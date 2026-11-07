package com.chedtech.api.modules.classroom.controller;

import com.chedtech.api.common.response.ApiResponse;
import com.chedtech.api.modules.classroom.dto.ClassroomResponse;
import com.chedtech.api.modules.classroom.dto.CreateClassroomRequest;
import com.chedtech.api.modules.classroom.dto.JoinClassroomRequest;
import com.chedtech.api.modules.classroom.service.ClassroomService;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/classrooms")
public class ClassroomController {

    private final ClassroomService classroomService;

    public ClassroomController(ClassroomService classroomService) {
        this.classroomService = classroomService;
    }

    @PostMapping
    @PreAuthorize("hasAnyAuthority('ROLE_TEACHER', 'ROLE_ADMIN')")
    public ApiResponse<ClassroomResponse> createClassroom(
            @Valid @RequestBody CreateClassroomRequest request,
            Authentication auth
    ) {
        UUID teacherId = UUID.fromString(auth.getName());
        ClassroomResponse response = classroomService.createClassroom(teacherId, request);
        return ApiResponse.ok(response, "Tạo lớp học thành công");
    }

    @GetMapping("/teacher/my-classes")
    @PreAuthorize("hasAnyAuthority('ROLE_TEACHER', 'ROLE_ADMIN')")
    public ApiResponse<List<ClassroomResponse>> getTeacherClassrooms(Authentication auth) {
        UUID teacherId = UUID.fromString(auth.getName());
        return ApiResponse.ok(classroomService.getTeacherClassrooms(teacherId));
    }

    @PostMapping("/join")
    @PreAuthorize("hasAnyAuthority('ROLE_STUDENT', 'ROLE_TEACHER', 'ROLE_ADMIN')")
    public ApiResponse<ClassroomResponse> joinClassroom(
            @Valid @RequestBody JoinClassroomRequest request,
            Authentication auth
    ) {
        UUID studentId = UUID.fromString(auth.getName());
        ClassroomResponse response = classroomService.joinClassroom(studentId, request.joinCode());
        return ApiResponse.ok(response, "Tham gia lớp học thành công");
    }

    @GetMapping("/student/enrolled")
    @PreAuthorize("hasAnyAuthority('ROLE_STUDENT', 'ROLE_ADMIN')")
    public ApiResponse<List<ClassroomResponse>> getStudentEnrolled(Authentication auth) {
        UUID studentId = UUID.fromString(auth.getName());
        return ApiResponse.ok(classroomService.getStudentEnrolledClassrooms(studentId));
    }

    @GetMapping("/{id}")
    public ApiResponse<ClassroomResponse> getClassroomDetail(
            @PathVariable UUID id,
            Authentication auth
    ) {
        UUID userId = UUID.fromString(auth.getName());
        String role = auth.getAuthorities().iterator().next().getAuthority();
        return ApiResponse.ok(classroomService.getClassroomDetail(id, userId, role));
    }

    @PostMapping("/{id}/regenerate-code")
    @PreAuthorize("hasAnyAuthority('ROLE_TEACHER', 'ROLE_ADMIN')")
    public ApiResponse<ClassroomResponse> regenerateCode(
            @PathVariable UUID id,
            Authentication auth
    ) {
        UUID teacherId = UUID.fromString(auth.getName());
        return ApiResponse.ok(classroomService.regenerateJoinCode(id, teacherId), "Đã đổi mã tham gia mới");
    }
}

