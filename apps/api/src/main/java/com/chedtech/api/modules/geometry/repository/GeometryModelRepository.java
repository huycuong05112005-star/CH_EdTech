package com.chedtech.api.modules.geometry.repository;

import com.chedtech.api.modules.geometry.model.GeometryModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface GeometryModelRepository extends JpaRepository<GeometryModel, UUID> {
    List<GeometryModel> findByCreatorId(UUID creatorId);
    List<GeometryModel> findByDimensionType(String dimensionType);
}

