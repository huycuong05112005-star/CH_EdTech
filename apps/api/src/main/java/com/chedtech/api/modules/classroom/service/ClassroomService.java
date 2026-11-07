package com.chedtech.api.modules.classroom.service;

import com.chedtech.api.modules.auth.model.User;
import com.chedtech.api.modules.auth.repository.UserRepository;
import com.chedtech.api.modules.classroom.dto.ClassroomResponse;
import com.chedtech.api.modules.classroom.dto.CreateClassroomRequest;
import com.chedtech.api.modules.classroom.model.Classroom;
import com.chedtech.api.modules.classroom.model.ClassroomMember;
import com.chedtech.api.modules.classroom.repository.ClassroomMemberRepository;
import com.chedtech.api.modules.classroom.repository.ClassroomRepository;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ClassroomService {

    private final ClassroomRepository classroomRepository;
    private final ClassroomMemberRepository memberRepository;
    private final UserRepository userRepository;
    private static final String CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    private static final SecureRandom RANDOM = new SecureRandom();

    public ClassroomService(
            ClassroomRepository classroomRepository,
            ClassroomMemberRepository memberRepository,
            UserRepository userRepository
    ) {
        this.classroomRepository = classroomRepository;
        this.memberRepository = memberRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public ClassroomResponse createClassroom(UUID teacherId, CreateClassroomRequest request) {
        User teacher = userRepository.findById(teacherId)
                .orElseThrow(() -> new IllegalArgumentException("Teacher not found"));

        String joinCode = generateUniqueJoinCode();

        Classroom classroom = new Classroom(
                teacher,
                request.name(),
                request.description(),
                request.subject(),
                request.gradeLevel(),
                joinCode
        );

        Classroom saved = classroomRepository.save(classroom);
        return toClassroomResponse(saved, 0);
    }

    @Transactional(readOnly = true)
    public List<ClassroomResponse> getTeacherClassrooms(UUID teacherId) {
        List<Classroom> classrooms = classroomRepository.findByTeacherIdOrderByCreatedAtDesc(teacherId);
        return classrooms.stream().map(c -> {
            long count = memberRepository.countByClassroomId(c.getId());
            return toClassroomResponse(c, count);
        }).collect(Collectors.toList());
    }

    @Transactional
    public ClassroomResponse joinClassroom(UUID studentId, String rawCode) {
        String cleanCode = rawCode.trim().toUpperCase();
        Classroom classroom = classroomRepository.findByJoinCode(cleanCode)
                .orElseThrow(() -> new IllegalArgumentException("Mã lớp không tồn tại hoặc đã bị thu hồi"));

        if (!"ACTIVE".equals(classroom.getStatus())) {
            throw new IllegalArgumentException("Lớp học này hiện không còn nhận học sinh mới");
        }

        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new IllegalArgumentException("Student not found"));

        // If teacher accidentally joins their own classroom
        if (classroom.getTeacher().getId().equals(studentId)) {
            throw new IllegalArgumentException("Bạn là giáo viên phụ trách lớp học này");
        }

        if (memberRepository.existsByClassroomIdAndStudentId(classroom.getId(), studentId)) {
            throw new IllegalArgumentException("Bạn đã tham gia lớp học này rồi");
        }

        ClassroomMember member = new ClassroomMember(classroom, student);
        memberRepository.save(member);

        long count = memberRepository.countByClassroomId(classroom.getId());
        return toClassroomResponse(classroom, count);
    }

    @Transactional(readOnly = true)
    public List<ClassroomResponse> getStudentEnrolledClassrooms(UUID studentId) {
        List<ClassroomMember> memberships = memberRepository.findByStudentIdOrderByJoinedAtDesc(studentId);
        return memberships.stream().map(m -> {
            Classroom c = m.getClassroom();
            long count = memberRepository.countByClassroomId(c.getId());
            return toClassroomResponse(c, count);
        }).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ClassroomResponse getClassroomDetail(UUID classroomId, UUID requestingUserId, String role) {
        Classroom classroom = classroomRepository.findById(classroomId)
                .orElseThrow(() -> new IllegalArgumentException("Lớp học không tồn tại"));

        // IDOR check: Only teacher of classroom, enrolled student, or ADMIN can access
        boolean isTeacher = classroom.getTeacher().getId().equals(requestingUserId);
        boolean isStudent = memberRepository.existsByClassroomIdAndStudentId(classroomId, requestingUserId);
        boolean isAdmin = "ROLE_ADMIN".equals(role);

        if (!isTeacher && !isStudent && !isAdmin) {
            throw new AccessDeniedException("Bạn không có quyền truy cập vào không gian lớp học này");
        }

        long count = memberRepository.countByClassroomId(classroomId);
        return toClassroomResponse(classroom, count);
    }

    @Transactional
    public ClassroomResponse regenerateJoinCode(UUID classroomId, UUID teacherId) {
        Classroom classroom = classroomRepository.findById(classroomId)
                .orElseThrow(() -> new IllegalArgumentException("Lớp học không tồn tại"));

        if (!classroom.getTeacher().getId().equals(teacherId)) {
            throw new AccessDeniedException("Chỉ giáo viên phụ trách mới có quyền đổi mã tham gia");
        }

        classroom.setJoinCode(generateUniqueJoinCode());
        Classroom updated = classroomRepository.save(classroom);
        long count = memberRepository.countByClassroomId(classroomId);
        return toClassroomResponse(updated, count);
    }

    private String generateUniqueJoinCode() {
        String code;
        do {
            StringBuilder sb = new StringBuilder("CH-");
            for (int i = 0; i < 4; i++) {
                sb.append(CODE_CHARS.charAt(RANDOM.nextInt(CODE_CHARS.length())));
            }
            code = sb.toString();
        } while (classroomRepository.existsByJoinCode(code));
        return code;
    }

    private ClassroomResponse toClassroomResponse(Classroom c, long studentCount) {
        return new ClassroomResponse(
                c.getId(),
                c.getName(),
                c.getDescription(),
                c.getSubject(),
                c.getGradeLevel(),
                c.getJoinCode(),
                c.getTeacher().getFullName(),
                c.getTeacher().getEmail(),
                studentCount,
                c.getStatus(),
                c.getCreatedAt()
        );
    }
}

