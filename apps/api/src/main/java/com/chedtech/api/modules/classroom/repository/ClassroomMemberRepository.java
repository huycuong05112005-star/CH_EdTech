package com.chedtech.api.modules.classroom.repository;

import com.chedtech.api.modules.classroom.model.ClassroomMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ClassroomMemberRepository extends JpaRepository<ClassroomMember, UUID> {
    List<ClassroomMember> findByStudentIdOrderByJoinedAtDesc(UUID studentId);
    List<ClassroomMember> findByClassroomId(UUID classroomId);
    Optional<ClassroomMember> findByClassroomIdAndStudentId(UUID classroomId, UUID studentId);
    boolean existsByClassroomIdAndStudentId(UUID classroomId, UUID studentId);
    long countByClassroomId(UUID classroomId);
}

