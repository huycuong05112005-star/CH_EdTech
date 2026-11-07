package com.chedtech.api.modules.geometry.model;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "geometry_models")
public class GeometryModel {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "creator_id", nullable = false)
    private UUID creatorId;

    @Column(nullable = false)
    private String title;

    private String description;

    @Column(name = "dimension_type", nullable = false)
    private String dimensionType;

    @Column(name = "math_definition", nullable = false, columnDefinition = "jsonb")
    private String mathDefinition;

    @Column(nullable = false)
    private String status = "ACTIVE";

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt = Instant.now();

    public GeometryModel() {}

    public GeometryModel(UUID creatorId, String title, String description, String dimensionType, String mathDefinition) {
        this.creatorId = creatorId;
        this.title = title;
        this.description = description;
        this.dimensionType = dimensionType;
        this.mathDefinition = mathDefinition;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public UUID getCreatorId() { return creatorId; }
    public void setCreatorId(UUID creatorId) { this.creatorId = creatorId; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getDimensionType() { return dimensionType; }
    public void setDimensionType(String dimensionType) { this.dimensionType = dimensionType; }

    public String getMathDefinition() { return mathDefinition; }
    public void setMathDefinition(String mathDefinition) { this.mathDefinition = mathDefinition; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Instant getCreatedAt() { return createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }

    @PreUpdate
    public void preUpdate() { this.updatedAt = Instant.now(); }
}

