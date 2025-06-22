package ma.um5.student_space.rest;

import java.util.List;

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

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import ma.um5.student_space.model.TeacherDTO;
import ma.um5.student_space.service.TeacherService;
import ma.um5.student_space.util.ReferencedException;
import ma.um5.student_space.util.ReferencedWarning;


@RestController
@RequestMapping(value = "/api/teachers", produces = MediaType.APPLICATION_JSON_VALUE)
@RequiredArgsConstructor
public class TeacherResource {

    private final TeacherService teacherService;

    @GetMapping
    public ResponseEntity<List<TeacherDTO>> getAllTeachers() {
        return ResponseEntity.ok(teacherService.findAll());
    }

    @GetMapping("/{ID}")
    public ResponseEntity<TeacherDTO> getTeacher(
            @PathVariable(name = "ID") final Integer teacherId) {
        return ResponseEntity.ok(teacherService.get(teacherId));
    }

    @PostMapping
    public ResponseEntity<String> createTeacher(@RequestBody @Valid final TeacherDTO teacherDTO) {
        final String createdFirstName = teacherService.create(teacherDTO);
        return new ResponseEntity<>('"' + createdFirstName + '"', HttpStatus.CREATED);
    }

    @PutMapping("/{ID}")
    public ResponseEntity<String> updateTeacher(
            @PathVariable(name = "ID") final Integer teacherId,
            @RequestBody @Valid final TeacherDTO teacherDTO) {
        teacherService.update(teacherId, teacherDTO);
        return ResponseEntity.ok('"' + teacherId.toString() + '"');
    }

    @DeleteMapping("/{ID}")
    public ResponseEntity<Void> deleteTeacher(
            @PathVariable(name = "ID") final Integer teacherId) {
        final ReferencedWarning referencedWarning = teacherService.getReferencedWarning(teacherId);
        if (referencedWarning != null) {
            throw new ReferencedException(referencedWarning);
        }
        teacherService.delete(teacherId);
        return ResponseEntity.noContent().build();
    }

}
