package ma.um5.student_space.rest;

import jakarta.validation.Valid;
import java.util.List;
import ma.um5.student_space.model.FiliereDTO;
import ma.um5.student_space.service.FiliereService;
import ma.um5.student_space.util.ReferencedException;
import ma.um5.student_space.util.ReferencedWarning;
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
@RequestMapping(value = "/api/filieres", produces = MediaType.APPLICATION_JSON_VALUE)
public class FiliereResource {

    private final FiliereService filiereService;

    public FiliereResource(final FiliereService filiereService) {
        this.filiereService = filiereService;
    }

    @GetMapping
    public ResponseEntity<List<FiliereDTO>> getAllFilieres() {
        return ResponseEntity.ok(filiereService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<FiliereDTO> getFiliere(@PathVariable(name = "id") final Integer id) {
        return ResponseEntity.ok(filiereService.get(id));
    }

    @PostMapping
    public ResponseEntity<Integer> createFiliere(@RequestBody @Valid final FiliereDTO filiereDTO) {
        final Integer createdId = filiereService.create(filiereDTO);
        return new ResponseEntity<>(createdId, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Integer> updateFiliere(@PathVariable(name = "id") final Integer id,
            @RequestBody @Valid final FiliereDTO filiereDTO) {
        filiereService.update(id, filiereDTO);
        return ResponseEntity.ok(id);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFiliere(@PathVariable(name = "id") final Integer id) {
        final ReferencedWarning referencedWarning = filiereService.getReferencedWarning(id);
        if (referencedWarning != null) {
            throw new ReferencedException(referencedWarning);
        }
        filiereService.delete(id);
        return ResponseEntity.noContent().build();
    }

}
