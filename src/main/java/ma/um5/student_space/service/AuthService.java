package ma.um5.student_space.service;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import ma.um5.student_space.domain.Student;
import ma.um5.student_space.domain.User;
import ma.um5.student_space.model.AuthResponseDTO;
import ma.um5.student_space.model.StudentDTO;
import ma.um5.student_space.model.StudentLoginDTO;
import ma.um5.student_space.model.TeacherDTO;
import ma.um5.student_space.model.TeacherLoginDTO;
import ma.um5.student_space.repos.StudentRepository;
import ma.um5.student_space.repos.TeacherRepository;
import ma.um5.student_space.repos.UserRepository;
import ma.um5.student_space.domain.Teacher;

@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final JwtService jwtService;
    private final StudentService studentService;
    private final TeacherService teacherService;
    private final TeacherRepository teacherRepository;

    public AuthService(AuthenticationManager authenticationManager, UserRepository userRepository, StudentRepository studentRepository, JwtService jwtService, StudentService studentService, TeacherService teacherService, TeacherRepository teacherRepository) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.studentRepository = studentRepository;
        this.jwtService = jwtService;
        this.studentService = studentService;
        this.teacherService = teacherService;
        this.teacherRepository = teacherRepository;
    }

    /**
     * Authenticates a student. We use @Transactional to ensure the session remains
     * open while we access related user data.
     */
    @Transactional(readOnly = true)
    public AuthResponseDTO loginStudent(StudentLoginDTO loginDTO) {
        Student student = studentRepository.findByApogeeNumber(loginDTO.apogeeNumber())
                .orElseThrow(() -> new UsernameNotFoundException("Student not found with APOGEE number: " + loginDTO.apogeeNumber()));

        // The user is fetched from the student relationship
        User user = student.getUser();
        String token = jwtService.generateToken(user);

        StudentDTO studentDTO = studentService.findAll().stream()
            .filter(s -> s.getApogeeNumber().equals(student.getApogeeNumber()))
            .findFirst().orElse(null);

        return new AuthResponseDTO(token, studentDTO, null);
    }

    /**
     * Authenticates a teacher.
     */
    @Transactional(readOnly = true)
    public AuthResponseDTO loginTeacher(TeacherLoginDTO loginDTO) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginDTO.email(), loginDTO.password())
        );

        User user = userRepository.findByEmail(loginDTO.email())
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + loginDTO.email()));

        String token = jwtService.generateToken(user);

        Teacher teacher = teacherRepository.findFirstByUser(user);
        TeacherDTO teacherDTO = teacher != null ? teacherService.findAll().stream()
            .filter(t -> t.getFirstName().equals(teacher.getFirstName()))
            .findFirst().orElse(null) : null;

        return new AuthResponseDTO(token, null, teacherDTO);
    }
}

