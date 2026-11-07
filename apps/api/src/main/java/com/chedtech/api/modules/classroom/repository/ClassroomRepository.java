package com.chedtech.api.modules.classroom.repository;

import com.chedtech.api.modules.classroom.model.Classroom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ClassroomRepository extends JpaRepository<Classroom, UUID> {
    List<Classroom> findByTeacherIdOrderByCreatedAtDesc(UUID teacherId);
    Optional<Classroom> findByJoinCode(String joinCode);
    boolean existsByJoinCode(String joinCode);
}

