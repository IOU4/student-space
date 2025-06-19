package ma.um5.student_space.service;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import ma.um5.student_space.domain.Student;
import ma.um5.student_space.domain.User;
import ma.um5.student_space.model.AuthResponseDTO;
import ma.um5.student_space.model.StudentLoginDTO;
import ma.um5.student_space.model.TeacherLoginDTO;
import ma.um5.student_space.model.UserDTO;
import ma.um5.student_space.repos.StudentRepository;
import ma.um5.student_space.repos.UserRepository;

@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final JwtService jwtService;

    public AuthService(AuthenticationManager authenticationManager, UserRepository userRepository, StudentRepository studentRepository, JwtService jwtService) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.studentRepository = studentRepository;
        this.jwtService = jwtService;
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

        // Map the User entity to a UserDTO
        UserDTO userDTO = new UserDTO();

        return new AuthResponseDTO(token, userDTO);
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

        // Map the User entity to a UserDTO.
        // You might need to fetch the related Teacher entity to get the name.
        UserDTO userDTO = new UserDTO();

        return new AuthResponseDTO(token, userDTO);
    }
}

