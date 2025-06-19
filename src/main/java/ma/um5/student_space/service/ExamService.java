package ma.um5.student_space.service;

import java.util.List;
import ma.um5.student_space.domain.Exam;
import ma.um5.student_space.domain.Modulee;
import ma.um5.student_space.model.ExamDTO;
import ma.um5.student_space.repos.ExamRepository;
import ma.um5.student_space.repos.ModuleeRepository;
import ma.um5.student_space.util.NotFoundException;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;


@Service
public class ExamService {

    private final ExamRepository examRepository;
    private final ModuleeRepository moduleeRepository;

    public ExamService(final ExamRepository examRepository,
            final ModuleeRepository moduleeRepository) {
        this.examRepository = examRepository;
        this.moduleeRepository = moduleeRepository;
    }

    public List<ExamDTO> findAll() {
        final List<Exam> exams = examRepository.findAll(Sort.by("id"));
        return exams.stream()
                .map(exam -> mapToDTO(exam, new ExamDTO()))
                .toList();
    }

    public ExamDTO get(final Integer id) {
        return examRepository.findById(id)
                .map(exam -> mapToDTO(exam, new ExamDTO()))
                .orElseThrow(NotFoundException::new);
    }

    public Integer create(final ExamDTO examDTO) {
        final Exam exam = new Exam();
        mapToEntity(examDTO, exam);
        return examRepository.save(exam).getId();
    }

    public void update(final Integer id, final ExamDTO examDTO) {
        final Exam exam = examRepository.findById(id)
                .orElseThrow(NotFoundException::new);
        mapToEntity(examDTO, exam);
        examRepository.save(exam);
    }

    public void delete(final Integer id) {
        examRepository.deleteById(id);
    }

    private ExamDTO mapToDTO(final Exam exam, final ExamDTO examDTO) {
        examDTO.setId(exam.getId());
        examDTO.setTitle(exam.getTitle());
        examDTO.setExamYear(exam.getExamYear());
        examDTO.setFileUrl(exam.getFileUrl());
        examDTO.setUploadedAt(exam.getUploadedAt());
        examDTO.setModulee(exam.getModulee() == null ? null : exam.getModulee().getId());
        return examDTO;
    }

    private Exam mapToEntity(final ExamDTO examDTO, final Exam exam) {
        exam.setTitle(examDTO.getTitle());
        exam.setExamYear(examDTO.getExamYear());
        exam.setFileUrl(examDTO.getFileUrl());
        exam.setUploadedAt(examDTO.getUploadedAt());
        final Modulee modulee = examDTO.getModulee() == null ? null : moduleeRepository.findById(examDTO.getModulee())
                .orElseThrow(() -> new NotFoundException("modulee not found"));
        exam.setModulee(modulee);
        return exam;
    }

}
