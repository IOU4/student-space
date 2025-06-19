package ma.um5.student_space.rest;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;
import ma.um5.student_space.domain.Modulee;
import ma.um5.student_space.model.ExamDTO;
import ma.um5.student_space.repos.ModuleeRepository;
import ma.um5.student_space.service.ExamService;
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
@RequestMapping(value = "/api/exams", produces = MediaType.APPLICATION_JSON_VALUE)
public class ExamResource {

    private final ExamService examService;
    private final ModuleeRepository moduleeRepository;

    public ExamResource(final ExamService examService, final ModuleeRepository moduleeRepository) {
        this.examService = examService;
        this.moduleeRepository = moduleeRepository;
    }

    @GetMapping
    public ResponseEntity<List<ExamDTO>> getAllExams() {
        return ResponseEntity.ok(examService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ExamDTO> getExam(@PathVariable(name = "id") final Integer id) {
        return ResponseEntity.ok(examService.get(id));
    }

    @PostMapping
    public ResponseEntity<Integer> createExam(@RequestBody @Valid final ExamDTO examDTO) {
        final Integer createdId = examService.create(examDTO);
        return new ResponseEntity<>(createdId, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Integer> updateExam(@PathVariable(name = "id") final Integer id,
            @RequestBody @Valid final ExamDTO examDTO) {
        examService.update(id, examDTO);
        return ResponseEntity.ok(id);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteExam(@PathVariable(name = "id") final Integer id) {
        examService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/moduleeValues")
    public ResponseEntity<Map<Integer, String>> getModuleeValues() {
        return ResponseEntity.ok(moduleeRepository.findAll(Sort.by("id"))
                .stream()
                .collect(CustomCollectors.toSortedMap(Modulee::getId, Modulee::getName)));
    }

}
