package ma.um5.student_space.rest;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;
import ma.um5.student_space.domain.Filiere;
import ma.um5.student_space.domain.Teacher;
import ma.um5.student_space.model.ModuleeDTO;
import ma.um5.student_space.repos.FiliereRepository;
import ma.um5.student_space.repos.TeacherRepository;
import ma.um5.student_space.service.ModuleeService;
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
@RequestMapping(value = "/api/modulees", produces = MediaType.APPLICATION_JSON_VALUE)
public class ModuleeResource {

    private final ModuleeService moduleeService;
    private final FiliereRepository filiereRepository;
    private final TeacherRepository teacherRepository;

    public ModuleeResource(final ModuleeService moduleeService,
            final FiliereRepository filiereRepository, final TeacherRepository teacherRepository) {
        this.moduleeService = moduleeService;
        this.filiereRepository = filiereRepository;
        this.teacherRepository = teacherRepository;
    }

    @GetMapping
    public ResponseEntity<List<ModuleeDTO>> getAllModulees() {
        return ResponseEntity.ok(moduleeService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ModuleeDTO> getModulee(@PathVariable(name = "id") final Integer id) {
        return ResponseEntity.ok(moduleeService.get(id));
    }

    @PostMapping
    public ResponseEntity<Integer> createModulee(@RequestBody @Valid final ModuleeDTO moduleeDTO) {
        final Integer createdId = moduleeService.create(moduleeDTO);
        return new ResponseEntity<>(createdId, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Integer> updateModulee(@PathVariable(name = "id") final Integer id,
            @RequestBody @Valid final ModuleeDTO moduleeDTO) {
        moduleeService.update(id, moduleeDTO);
        return ResponseEntity.ok(id);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteModulee(@PathVariable(name = "id") final Integer id) {
        final ReferencedWarning referencedWarning = moduleeService.getReferencedWarning(id);
        if (referencedWarning != null) {
            throw new ReferencedException(referencedWarning);
        }
        moduleeService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/filiereValues")
    public ResponseEntity<Map<Integer, String>> getFiliereValues() {
        return ResponseEntity.ok(filiereRepository.findAll(Sort.by("id"))
                .stream()
                .collect(CustomCollectors.toSortedMap(Filiere::getId, Filiere::getName)));
    }

    @GetMapping("/teacherValues")
    public ResponseEntity<Map<Integer, String>> getTeacherValues() {
        return ResponseEntity.ok(teacherRepository.findAll(Sort.by("firstName"))
                .stream()
                .collect(CustomCollectors.toSortedMap(Teacher::getId, Teacher::getLastName)));
    }

}
