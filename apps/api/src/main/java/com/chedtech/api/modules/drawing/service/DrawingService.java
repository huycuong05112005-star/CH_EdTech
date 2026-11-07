package com.chedtech.api.modules.drawing.service;

import com.chedtech.api.modules.auth.model.User;
import com.chedtech.api.modules.auth.repository.UserRepository;
import com.chedtech.api.modules.classroom.model.Classroom;
import com.chedtech.api.modules.classroom.repository.ClassroomRepository;
import com.chedtech.api.modules.drawing.dto.DrawingResponse;
import com.chedtech.api.modules.drawing.dto.DrawingSummaryResponse;
import com.chedtech.api.modules.drawing.dto.SaveDrawingRequest;
import com.chedtech.api.modules.drawing.model.Drawing;
import com.chedtech.api.modules.drawing.repository.DrawingRepository;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class DrawingService {

    private final DrawingRepository drawingRepository;
    private final UserRepository userRepository;
    private final ClassroomRepository classroomRepository;

    public DrawingService(
            DrawingRepository drawingRepository,
            UserRepository userRepository,
            ClassroomRepository classroomRepository
    ) {
        this.drawingRepository = drawingRepository;
        this.userRepository = userRepository;
        this.classroomRepository = classroomRepository;
    }

    @Transactional
    public DrawingResponse saveDrawing(UUID userId, SaveDrawingRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        Classroom classroom = null;
        if (request.classroomId() != null) {
            classroom = classroomRepository.findById(request.classroomId())
                    .orElse(null);
        }

        Drawing drawing;
        if (request.id() != null) {
            // Update existing drawing
            drawing = drawingRepository.findById(request.id())
                    .orElseThrow(() -> new IllegalArgumentException("Bản vẽ không tồn tại"));

            // IDOR check: Only owner or admin can update
            if (!drawing.getOwner().getId().equals(userId)) {
                throw new AccessDeniedException("Bạn không có quyền chỉnh sửa bản vẽ này");
            }

            drawing.setTitle(request.title());
            drawing.setDescription(request.description());
            drawing.setDataJson(request.dataJson());
            if (request.thumbnailUrl() != null) drawing.setThumbnailUrl(request.thumbnailUrl());
            if (request.visibility() != null) drawing.setVisibility(request.visibility());
            if (classroom != null) drawing.setClassroom(classroom);
            drawing.setVersion(drawing.getVersion() + 1);
        } else {
            // Create new drawing
            drawing = new Drawing(
                    user,
                    classroom,
                    request.title(),
                    request.description(),
                    request.dataJson(),
                    request.visibility() != null ? request.visibility() : "PRIVATE"
            );
            if (request.thumbnailUrl() != null) drawing.setThumbnailUrl(request.thumbnailUrl());
        }

        Drawing saved = drawingRepository.save(drawing);
        return toDrawingResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<DrawingSummaryResponse> getUserDrawings(UUID userId) {
        return drawingRepository.findByOwnerIdOrderByUpdatedAtDesc(userId)
                .stream().map(this::toSummaryResponse).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<DrawingSummaryResponse> getPublicDrawings() {
        return drawingRepository.findByVisibilityOrderByUpdatedAtDesc("PUBLIC")
                .stream().map(this::toSummaryResponse).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public DrawingResponse getDrawingById(UUID drawingId, UUID requestingUserId, String role) {
        Drawing drawing = drawingRepository.findById(drawingId)
                .orElseThrow(() -> new IllegalArgumentException("Bản vẽ không tồn tại"));

        boolean isPublic = "PUBLIC".equals(drawing.getVisibility());
        boolean isOwner = requestingUserId != null && drawing.getOwner().getId().equals(requestingUserId);
        boolean isAdmin = "ROLE_ADMIN".equals(role);

        if (!isPublic && !isOwner && !isAdmin) {
            throw new AccessDeniedException("Bạn không có quyền xem bản vẽ riêng tư này");
        }

        return toDrawingResponse(drawing);
    }

    @Transactional
    public void deleteDrawing(UUID drawingId, UUID requestingUserId) {
        Drawing drawing = drawingRepository.findById(drawingId)
                .orElseThrow(() -> new IllegalArgumentException("Bản vẽ không tồn tại"));

        if (!drawing.getOwner().getId().equals(requestingUserId)) {
            throw new AccessDeniedException("Bạn không có quyền xóa bản vẽ này");
        }

        drawingRepository.delete(drawing);
    }

    private DrawingResponse toDrawingResponse(Drawing d) {
        return new DrawingResponse(
                d.getId(),
                d.getOwner().getId(),
                d.getOwner().getFullName(),
                d.getClassroom() != null ? d.getClassroom().getId() : null,
                d.getTitle(),
                d.getDescription(),
                d.getDataJson(),
                d.getThumbnailUrl(),
                d.getVisibility(),
                d.getVersion(),
                d.getCreatedAt(),
                d.getUpdatedAt()
        );
    }

    private DrawingSummaryResponse toSummaryResponse(Drawing d) {
        return new DrawingSummaryResponse(
                d.getId(),
                d.getOwner().getId(),
                d.getOwner().getFullName(),
                d.getTitle(),
                d.getDescription(),
                d.getThumbnailUrl(),
                d.getVisibility(),
                d.getVersion(),
                d.getUpdatedAt()
        );
    }
}

