package com.chedtech.api.modules.drawing.controller;

import com.chedtech.api.common.response.ApiResponse;
import com.chedtech.api.modules.drawing.dto.DrawingResponse;
import com.chedtech.api.modules.drawing.dto.DrawingSummaryResponse;
import com.chedtech.api.modules.drawing.dto.SaveDrawingRequest;
import com.chedtech.api.modules.drawing.service.DrawingService;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/drawings")
public class DrawingController {

    private final DrawingService drawingService;

    public DrawingController(DrawingService drawingService) {
        this.drawingService = drawingService;
    }

    @PostMapping
    public ApiResponse<DrawingResponse> saveDrawing(
            @Valid @RequestBody SaveDrawingRequest request,
            Authentication auth
    ) {
        UUID userId = UUID.fromString(auth.getName());
        DrawingResponse response = drawingService.saveDrawing(userId, request);
        return ApiResponse.ok(response, "Lưu bản vẽ thành công");
    }

    @GetMapping("/my-drawings")
    public ApiResponse<List<DrawingSummaryResponse>> getMyDrawings(Authentication auth) {
        UUID userId = UUID.fromString(auth.getName());
        return ApiResponse.ok(drawingService.getUserDrawings(userId));
    }

    @GetMapping("/public")
    public ApiResponse<List<DrawingSummaryResponse>> getPublicDrawings() {
        return ApiResponse.ok(drawingService.getPublicDrawings());
    }

    @GetMapping("/{id}")
    public ApiResponse<DrawingResponse> getDrawingById(
            @PathVariable UUID id,
            Authentication auth
    ) {
        UUID userId = auth != null ? UUID.fromString(auth.getName()) : null;
        String role = auth != null && !auth.getAuthorities().isEmpty() 
                ? auth.getAuthorities().iterator().next().getAuthority() : "GUEST";
        return ApiResponse.ok(drawingService.getDrawingById(id, userId, role));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteDrawing(
            @PathVariable UUID id,
            Authentication auth
    ) {
        UUID userId = UUID.fromString(auth.getName());
        drawingService.deleteDrawing(id, userId);
        return ApiResponse.ok(null, "Xóa bản vẽ thành công");
    }
}

