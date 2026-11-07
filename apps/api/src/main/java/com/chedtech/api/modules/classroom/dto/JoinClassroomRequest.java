package com.chedtech.api.modules.classroom.dto;

import jakarta.validation.constraints.NotBlank;

public record JoinClassroomRequest(
    @NotBlank(message = "Mã tham gia không được để trống")
    String joinCode
) {}

