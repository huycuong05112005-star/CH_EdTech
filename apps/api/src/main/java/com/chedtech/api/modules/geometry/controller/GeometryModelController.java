package com.chedtech.api.modules.geometry.controller;

import com.chedtech.api.common.response.ApiResponse;
import com.chedtech.api.modules.geometry.model.GeometryModel;
import com.chedtech.api.modules.geometry.repository.GeometryModelRepository;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/geometry")
public class GeometryModelController {

    private final GeometryModelRepository repository;

    public GeometryModelController(GeometryModelRepository repository) {
        this.repository = repository;
    }

    @GetMapping("/models")
    public ApiResponse<List<GeometryModel>> getModels() {
        return ApiResponse.ok(repository.findAll());
    }

    @PostMapping("/models")
    public ApiResponse<GeometryModel> createModel(
            @RequestBody GeometryModel model,
            Authentication authentication
    ) {
        UUID creatorId = UUID.fromString(authentication.getName());
        model.setCreatorId(creatorId);
        GeometryModel saved = repository.save(model);
        return ApiResponse.ok(saved, "Geometry model saved successfully");
    }
}

