package com.chedtech.api.modules.storage.provider;

import com.chedtech.api.modules.storage.model.FileMetadata;
import com.chedtech.api.modules.storage.repository.FileMetadataRepository;
import com.chedtech.api.modules.storage.service.StorageService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.GetObjectPresignRequest;

import java.io.InputStream;
import java.time.Duration;
import java.util.UUID;

@Service
public class MinioStorageProvider implements StorageService {

    private final S3Client s3Client;
    private final S3Presigner s3Presigner;
    private final FileMetadataRepository fileMetadataRepository;

    @Value("${ch-edtech.storage.bucket-documents:ch-edtech-documents}")
    private String bucketDocuments;

    @Value("${ch-edtech.storage.bucket-public:ch-edtech-public}")
    private String bucketPublic;

    public MinioStorageProvider(
            S3Client s3Client,
            S3Presigner s3Presigner,
            FileMetadataRepository fileMetadataRepository
    ) {
        this.s3Client = s3Client;
        this.s3Presigner = s3Presigner;
        this.fileMetadataRepository = fileMetadataRepository;
    }

    @Override
    @Transactional
    public String uploadFile(
            UUID ownerId,
            String originalFilename,
            String contentType,
            long size,
            InputStream inputStream,
            boolean isPublic
    ) {
        String bucket = isPublic ? bucketPublic : bucketDocuments;
        String extension = "";
        int dotIndex = originalFilename.lastIndexOf('.');
        if (dotIndex > 0) {
            extension = originalFilename.substring(dotIndex);
        }

        // Rename to secure UUID object key (never use user-supplied path directly)
        String objectKey = (isPublic ? "public/" : "documents/") + UUID.randomUUID() + extension;

        PutObjectRequest putRequest = PutObjectRequest.builder()
                .bucket(bucket)
                .key(objectKey)
                .contentType(contentType)
                .contentLength(size)
                .build();

        s3Client.putObject(putRequest, RequestBody.fromInputStream(inputStream, size));

        FileMetadata metadata = new FileMetadata(
                ownerId,
                originalFilename,
                objectKey,
                bucket,
                "minio",
                contentType,
                size,
                isPublic ? "PUBLIC" : "PRIVATE"
        );
        fileMetadataRepository.save(metadata);

        return metadata.getId().toString();
    }

    @Override
    @Transactional(readOnly = true)
    public String generatePresignedDownloadUrl(UUID fileId, UUID requestingUserId, Duration duration) {
        FileMetadata metadata = fileMetadataRepository.findById(fileId)
                .orElseThrow(() -> new IllegalArgumentException("File not found"));

        // IDOR Verification: Verify requesting user is owner or file is public
        if (!"PUBLIC".equals(metadata.getVisibility()) && !metadata.getOwnerId().equals(requestingUserId)) {
            throw new AccessDeniedException("Unauthorized access to file");
        }

        GetObjectRequest getObjectRequest = GetObjectRequest.builder()
                .bucket(metadata.getBucket())
                .key(metadata.getObjectKey())
                .build();

        GetObjectPresignRequest presignRequest = GetObjectPresignRequest.builder()
                .signatureDuration(duration)
                .getObjectRequest(getObjectRequest)
                .build();

        return s3Presigner.presignGetObject(presignRequest).url().toString();
    }

    @Override
    @Transactional
    public void deleteFile(UUID fileId, UUID requestingUserId) {
        FileMetadata metadata = fileMetadataRepository.findById(fileId)
                .orElseThrow(() -> new IllegalArgumentException("File not found"));

        // IDOR Verification
        if (!metadata.getOwnerId().equals(requestingUserId)) {
            throw new AccessDeniedException("Unauthorized deletion of file");
        }

        s3Client.deleteObject(DeleteObjectRequest.builder()
                .bucket(metadata.getBucket())
                .key(metadata.getObjectKey())
                .build());

        metadata.setStatus("DELETED");
        fileMetadataRepository.save(metadata);
    }
}

