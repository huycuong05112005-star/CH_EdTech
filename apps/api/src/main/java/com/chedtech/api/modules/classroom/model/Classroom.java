package com.chedtech.api.modules.classroom.model;

import com.chedtech.api.modules.auth.model.User;
import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "classrooms")
public class Classroom {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "teacher_id", nullable = false)
    private User teacher;

    @Column(nullable = false)
    private String name;

    private String description;

    @Column(nullable = false)
    private String subject = "Toán Học";

    @Column(name = "grade_level", nullable = false)
    private String gradeLevel = "Khối 11";

    @Column(name = "join_code", nullable = false, unique = true, length = 20)
    private String joinCode;

    @Column(nullable = false)
    private String status = "ACTIVE"; // ACTIVE, CONCLUDED, ARCHIVED

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt = Instant.now();

    public Classroom() {}

    public Classroom(User teacher, String name, String description, String subject, String gradeLevel, String joinCode) {
        this.teacher = teacher;
        this.name = name;
        this.description = description;
        this.subject = subject;
        this.gradeLevel = gradeLevel;
        this.joinCode = joinCode;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public User getTeacher() { return teacher; }
    public void setTeacher(User teacher) { this.teacher = teacher; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }

    public String getGradeLevel() { return gradeLevel; }
    public void setGradeLevel(String gradeLevel) { this.gradeLevel = gradeLevel; }

    public String getJoinCode() { return joinCode; }
    public void setJoinCode(String joinCode) { this.joinCode = joinCode; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Instant getCreatedAt() { return createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }

    @PreUpdate
    public void preUpdate() { this.updatedAt = Instant.now(); }
}

