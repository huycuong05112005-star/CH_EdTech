package com.chedtech.api.modules.storage.service;

import java.io.InputStream;
import java.time.Duration;
import java.util.UUID;

public interface StorageService {
    String uploadFile(UUID ownerId, String originalFilename, String contentType, long size, InputStream inputStream, boolean isPublic);
    String generatePresignedDownloadUrl(UUID fileId, UUID requestingUserId, Duration duration);
    void deleteFile(UUID fileId, UUID requestingUserId);
}

