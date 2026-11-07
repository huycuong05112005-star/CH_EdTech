package com.chedtech.api.modules.drawing.repository;

import com.chedtech.api.modules.drawing.model.Drawing;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface DrawingRepository extends JpaRepository<Drawing, UUID> {
    List<Drawing> findByOwnerIdOrderByUpdatedAtDesc(UUID ownerId);
    List<Drawing> findByClassroomIdOrderByUpdatedAtDesc(UUID classroomId);
    List<Drawing> findByVisibilityOrderByUpdatedAtDesc(String visibility);
}

