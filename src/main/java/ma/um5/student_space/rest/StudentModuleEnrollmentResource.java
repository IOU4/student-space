package ma.um5.student_space.rest;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;
import ma.um5.student_space.domain.Modulee;
import ma.um5.student_space.domain.Student;
import ma.um5.student_space.model.StudentModuleEnrollmentDTO;
import ma.um5.student_space.repos.ModuleeRepository;
import ma.um5.student_space.repos.StudentRepository;
import ma.um5.student_space.service.StudentModuleEnrollmentService;
import ma.um5.student_space.util.CustomCollectors;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping(value = "/api/studentModuleEnrollments", produces = MediaType.APPLICATION_JSON_VALUE)
public class StudentModuleEnrollmentResource {

    private final StudentModuleEnrollmentService studentModuleEnrollmentService;
    private final StudentRepository studentRepository;
    private final ModuleeRepository moduleeRepository;

    public StudentModuleEnrollmentResource(
            final StudentModuleEnrollmentService studentModuleEnrollmentService,
            final StudentRepository studentRepository, final ModuleeRepository moduleeRepository) {
        this.studentModuleEnrollmentService = studentModuleEnrollmentService;
        this.studentRepository = studentRepository;
        this.moduleeRepository = moduleeRepository;
    }

    @GetMapping
    public ResponseEntity<List<StudentModuleEnrollmentDTO>> getAllStudentModuleEnrollments() {
        return ResponseEntity.ok(studentModuleEnrollmentService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<StudentModuleEnrollmentDTO> getStudentModuleEnrollment(
            @PathVariable(name = "id") final Long id) {
        return ResponseEntity.ok(studentModuleEnrollmentService.get(id));
    }

    @PostMapping
    public ResponseEntity<Long> createStudentModuleEnrollment(
            @RequestBody @Valid final StudentModuleEnrollmentDTO studentModuleEnrollmentDTO) {
        final Long createdId = studentModuleEnrollmentService.create(studentModuleEnrollmentDTO);
        return new ResponseEntity<>(createdId, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Long> updateStudentModuleEnrollment(
            @PathVariable(name = "id") final Long id,
            @RequestBody @Valid final StudentModuleEnrollmentDTO studentModuleEnrollmentDTO) {
        studentModuleEnrollmentService.update(id, studentModuleEnrollmentDTO);
        return ResponseEntity.ok(id);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStudentModuleEnrollment(
            @PathVariable(name = "id") final Long id) {
        studentModuleEnrollmentService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/studentUserValues")
    public ResponseEntity<Map<String, String>> getStudentUserValues() {
        return ResponseEntity.ok(studentRepository.findAll(Sort.by("apogeeNumber"))
                .stream()
                .collect(CustomCollectors.toSortedMap(Student::getApogeeNumber, Student::getFirstName)));
    }

    @GetMapping("/moduleeValues")
    public ResponseEntity<Map<Integer, String>> getModuleeValues() {
        return ResponseEntity.ok(moduleeRepository.findAll(Sort.by("id"))
                .stream()
                .collect(CustomCollectors.toSortedMap(Modulee::getId, Modulee::getName)));
    }

}
