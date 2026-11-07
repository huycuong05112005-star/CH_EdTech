package com.chedtech.api.modules.classroom.dto;

import java.time.Instant;
import java.util.UUID;

public record ClassroomResponse(
    UUID id,
    String name,
    String description,
    String subject,
    String gradeLevel,
    String joinCode,
    String teacherName,
    String teacherEmail,
    long studentCount,
    String status,
    Instant createdAt
) {}

