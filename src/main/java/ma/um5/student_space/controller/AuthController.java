package ma.um5.student_space.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.transaction.Transactional;
import ma.um5.student_space.model.AuthResponseDTO;
import ma.um5.student_space.model.StudentLoginDTO;
import ma.um5.student_space.model.TeacherLoginDTO;
import ma.um5.student_space.service.AuthService;

@RestController
@RequestMapping("/api/login")
@Transactional
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    /**
     * Handles login requests for students.
     * @param loginDTO Contains the student's apogeeNumber.
     * @return A ResponseEntity with the JWT and student details, or an error status.
     */
    @PostMapping("/student")
    public ResponseEntity<AuthResponseDTO> loginStudent(@RequestBody StudentLoginDTO loginDTO) {
        AuthResponseDTO response = authService.loginStudent(loginDTO);
        return ResponseEntity.ok(response);
    }

    /**
     * Handles login requests for teachers.
     * @param loginDTO Contains the teacher's email and password.
     * @return A ResponseEntity with the JWT and teacher details, or an error status.
     */
    @PostMapping("/teacher")
    public ResponseEntity<AuthResponseDTO> loginTeacher(@RequestBody TeacherLoginDTO loginDTO) {
        AuthResponseDTO response = authService.loginTeacher(loginDTO);
        return ResponseEntity.ok(response);
    }
}
