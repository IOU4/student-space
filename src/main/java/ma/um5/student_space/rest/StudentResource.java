package ma.um5.student_space.rest;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.Map;
import ma.um5.student_space.domain.Filiere;
import ma.um5.student_space.model.StudentDTO;
import ma.um5.student_space.repos.FiliereRepository;
import ma.um5.student_space.service.StudentService;
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
@RequestMapping(value = "/api/students", produces = MediaType.APPLICATION_JSON_VALUE)
@RequiredArgsConstructor
public class StudentResource {

    private final StudentService studentService;
    private final FiliereRepository filiereRepository;


    @GetMapping
    public ResponseEntity<List<StudentDTO>> getAllStudents() {
        return ResponseEntity.ok(studentService.findAll());
    }

    @GetMapping("/{apogeeNumber}")
    public ResponseEntity<StudentDTO> getStudent(
            @PathVariable(name = "apogeeNumber") final String apogeeNumber) {
        return ResponseEntity.ok(studentService.get(apogeeNumber));
    }

    @PostMapping
    public ResponseEntity<String> createStudent(@RequestBody @Valid final StudentDTO studentDTO) {
        final String createdApogeeNumber = studentService.create(studentDTO);
        return new ResponseEntity<>('"' + createdApogeeNumber + '"', HttpStatus.CREATED);
    }

    @PutMapping("/{apogeeNumber}")
    public ResponseEntity<String> updateStudent(
            @PathVariable(name = "apogeeNumber") final String apogeeNumber,
            @RequestBody @Valid final StudentDTO studentDTO) {
        studentService.update(apogeeNumber, studentDTO);
        return ResponseEntity.ok('"' + apogeeNumber + '"');
    }

    @DeleteMapping("/{apogeeNumber}")
    public ResponseEntity<Void> deleteStudent(
            @PathVariable(name = "apogeeNumber") final String apogeeNumber) {
        final ReferencedWarning referencedWarning = studentService.getReferencedWarning(apogeeNumber);
        if (referencedWarning != null) {
            throw new ReferencedException(referencedWarning);
        }
        studentService.delete(apogeeNumber);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/filiereValues")
    public ResponseEntity<Map<Integer, String>> getFiliereValues() {
        return ResponseEntity.ok(filiereRepository.findAll(Sort.by("id"))
                .stream()
                .collect(CustomCollectors.toSortedMap(Filiere::getId, Filiere::getName)));
    }

}
