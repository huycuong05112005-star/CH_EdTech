package com.chedtech.api.modules.classroom.model;

import com.chedtech.api.modules.auth.model.User;
import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "classroom_members", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"classroom_id", "student_id"})
})
public class ClassroomMember {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "classroom_id", nullable = false)
    private Classroom classroom;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private User student;

    @Column(name = "joined_at", nullable = false, updatable = false)
    private Instant joinedAt = Instant.now();

    @Column(nullable = false)
    private String status = "ACTIVE"; // ACTIVE, BLOCKED, LEFT

    public ClassroomMember() {}

    public ClassroomMember(Classroom classroom, User student) {
        this.classroom = classroom;
        this.student = student;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public Classroom getClassroom() { return classroom; }
    public void setClassroom(Classroom classroom) { this.classroom = classroom; }

    public User getStudent() { return student; }
    public void setStudent(User student) { this.student = student; }

    public Instant getJoinedAt() { return joinedAt; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}

