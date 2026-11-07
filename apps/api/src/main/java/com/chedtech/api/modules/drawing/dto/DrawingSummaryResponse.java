package com.chedtech.api.modules.drawing.dto;

import java.time.Instant;
import java.util.UUID;

public record DrawingSummaryResponse(
    UUID id,
    UUID ownerId,
    String ownerName,
    String title,
    String description,
    String thumbnailUrl,
    String visibility,
    int version,
    Instant updatedAt
) {}

