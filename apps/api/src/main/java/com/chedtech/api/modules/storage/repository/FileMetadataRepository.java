package com.chedtech.api.modules.storage.repository;

import com.chedtech.api.modules.storage.model.FileMetadata;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface FileMetadataRepository extends JpaRepository<FileMetadata, UUID> {
    Optional<FileMetadata> findByObjectKey(String objectKey);
    List<FileMetadata> findByOwnerId(UUID ownerId);
}

