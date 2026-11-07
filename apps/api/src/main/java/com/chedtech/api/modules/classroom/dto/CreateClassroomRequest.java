package com.chedtech.api.modules.classroom.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateClassroomRequest(
    @NotBlank(message = "Tên lớp học không được để trống")
    @Size(min = 3, max = 255, message = "Tên lớp phải từ 3 đến 255 ký tự")
    String name,

    String description,

    @NotBlank(message = "Môn học không được để trống")
    String subject,

    @NotBlank(message = "Khối lớp không được để trống")
    String gradeLevel
) {}

