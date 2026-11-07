package com.chedtech.api.modules.storage.controller;

import com.chedtech.api.common.response.ApiResponse;
import com.chedtech.api.modules.storage.service.StorageService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.Duration;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/storage")
public class StorageController {

    private final StorageService storageService;

    public StorageController(StorageService storageService) {
        this.storageService = storageService;
    }

    @PostMapping("/upload")
    public ApiResponse<Map<String, String>> uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "isPublic", defaultValue = "false") boolean isPublic,
            Authentication authentication
    ) throws IOException {
        UUID userId = UUID.fromString(authentication.getName());

        String fileId = storageService.uploadFile(
                userId,
                file.getOriginalFilename(),
                file.getContentType(),
                file.getSize(),
                file.getInputStream(),
                isPublic
        );

        return ApiResponse.ok(Map.of("fileId", fileId), "File uploaded to Object Storage successfully");
    }

    @GetMapping("/download-url/{fileId}")
    public ApiResponse<Map<String, String>> getDownloadUrl(
            @PathVariable UUID fileId,
            Authentication authentication
    ) {
        UUID userId = UUID.fromString(authentication.getName());
        String url = storageService.generatePresignedDownloadUrl(fileId, userId, Duration.ofMinutes(15));
        return ApiResponse.ok(Map.of("url", url, "expiresInMinutes", "15"));
    }
}

