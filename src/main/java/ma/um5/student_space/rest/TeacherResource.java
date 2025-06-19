package ma.um5.student_space.rest;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;
import ma.um5.student_space.domain.User;
import ma.um5.student_space.model.TeacherDTO;
import ma.um5.student_space.repos.UserRepository;
import ma.um5.student_space.service.TeacherService;
import ma.um5.student_space.util.CustomCollectors;
import ma.um5.student_space.util.ReferencedException;
import ma.um5.student_space.util.ReferencedWarning;
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
@RequestMapping(value = "/api/teachers", produces = MediaType.APPLICATION_JSON_VALUE)
public class TeacherResource {

    private final TeacherService teacherService;
    private final UserRepository userRepository;

    public TeacherResource(final TeacherService teacherService,
            final UserRepository userRepository) {
        this.teacherService = teacherService;
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<List<TeacherDTO>> getAllTeachers() {
        return ResponseEntity.ok(teacherService.findAll());
    }

    @GetMapping("/{firstName}")
    public ResponseEntity<TeacherDTO> getTeacher(
            @PathVariable(name = "firstName") final String firstName) {
        return ResponseEntity.ok(teacherService.get(firstName));
    }

    @PostMapping
    public ResponseEntity<String> createTeacher(@RequestBody @Valid final TeacherDTO teacherDTO) {
        final String createdFirstName = teacherService.create(teacherDTO);
        return new ResponseEntity<>('"' + createdFirstName + '"', HttpStatus.CREATED);
    }

    @PutMapping("/{firstName}")
    public ResponseEntity<String> updateTeacher(
            @PathVariable(name = "firstName") final String firstName,
            @RequestBody @Valid final TeacherDTO teacherDTO) {
        teacherService.update(firstName, teacherDTO);
        return ResponseEntity.ok('"' + firstName + '"');
    }

    @DeleteMapping("/{firstName}")
    public ResponseEntity<Void> deleteTeacher(
            @PathVariable(name = "firstName") final String firstName) {
        final ReferencedWarning referencedWarning = teacherService.getReferencedWarning(firstName);
        if (referencedWarning != null) {
            throw new ReferencedException(referencedWarning);
        }
        teacherService.delete(firstName);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/userValues")
    public ResponseEntity<Map<Integer, String>> getUserValues() {
        return ResponseEntity.ok(userRepository.findAll(Sort.by("id"))
                .stream()
                .collect(CustomCollectors.toSortedMap(User::getId, User::getEmail)));
    }

}
