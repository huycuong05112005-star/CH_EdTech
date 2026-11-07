package com.chedtech.api.modules.drawing.dto;

import java.time.Instant;
import java.util.UUID;

public record DrawingResponse(
    UUID id,
    UUID ownerId,
    String ownerName,
    UUID classroomId,
    String title,
    String description,
    String dataJson,
    String thumbnailUrl,
    String visibility,
    int version,
    Instant createdAt,
    Instant updatedAt
) {}

