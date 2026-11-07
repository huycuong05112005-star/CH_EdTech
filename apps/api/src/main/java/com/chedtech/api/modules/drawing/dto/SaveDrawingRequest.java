package com.chedtech.api.modules.drawing.dto;

import jakarta.validation.constraints.NotBlank;
import java.util.UUID;

public record SaveDrawingRequest(
    UUID id, // If present, update existing drawing; if null, create new
    UUID classroomId,
    @NotBlank(message = "Tiêu đề bản vẽ không được để trống")
    String title,
    String description,
    @NotBlank(message = "Dữ liệu hình học không được để trống")
    String dataJson,
    String thumbnailUrl,
    String visibility // PRIVATE, PUBLIC, CLASSROOM
) {}

