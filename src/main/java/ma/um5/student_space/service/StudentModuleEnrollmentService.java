package ma.um5.student_space.service;

import java.util.List;
import ma.um5.student_space.domain.Modulee;
import ma.um5.student_space.domain.Student;
import ma.um5.student_space.domain.StudentModuleEnrollment;
import ma.um5.student_space.model.StudentModuleEnrollmentDTO;
import ma.um5.student_space.repos.ModuleeRepository;
import ma.um5.student_space.repos.StudentModuleEnrollmentRepository;
import ma.um5.student_space.repos.StudentRepository;
import ma.um5.student_space.util.NotFoundException;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;


@Service
public class StudentModuleEnrollmentService {

    private final StudentModuleEnrollmentRepository studentModuleEnrollmentRepository;
    private final StudentRepository studentRepository;
    private final ModuleeRepository moduleeRepository;

    public StudentModuleEnrollmentService(
            final StudentModuleEnrollmentRepository studentModuleEnrollmentRepository,
            final StudentRepository studentRepository, final ModuleeRepository moduleeRepository) {
        this.studentModuleEnrollmentRepository = studentModuleEnrollmentRepository;
        this.studentRepository = studentRepository;
        this.moduleeRepository = moduleeRepository;
    }

    public List<StudentModuleEnrollmentDTO> findAll() {
        final List<StudentModuleEnrollment> studentModuleEnrollments = studentModuleEnrollmentRepository.findAll(Sort.by("id"));
        return studentModuleEnrollments.stream()
                .map(studentModuleEnrollment -> mapToDTO(studentModuleEnrollment, new StudentModuleEnrollmentDTO()))
                .toList();
    }

    public StudentModuleEnrollmentDTO get(final Long id) {
        return studentModuleEnrollmentRepository.findById(id)
                .map(studentModuleEnrollment -> mapToDTO(studentModuleEnrollment, new StudentModuleEnrollmentDTO()))
                .orElseThrow(NotFoundException::new);
    }

    public Long create(final StudentModuleEnrollmentDTO studentModuleEnrollmentDTO) {
        final StudentModuleEnrollment studentModuleEnrollment = new StudentModuleEnrollment();
        mapToEntity(studentModuleEnrollmentDTO, studentModuleEnrollment);
        return studentModuleEnrollmentRepository.save(studentModuleEnrollment).getId();
    }

    public void update(final Long id, final StudentModuleEnrollmentDTO studentModuleEnrollmentDTO) {
        final StudentModuleEnrollment studentModuleEnrollment = studentModuleEnrollmentRepository.findById(id)
                .orElseThrow(NotFoundException::new);
        mapToEntity(studentModuleEnrollmentDTO, studentModuleEnrollment);
        studentModuleEnrollmentRepository.save(studentModuleEnrollment);
    }

    public void delete(final Long id) {
        studentModuleEnrollmentRepository.deleteById(id);
    }

    private StudentModuleEnrollmentDTO mapToDTO(
            final StudentModuleEnrollment studentModuleEnrollment,
            final StudentModuleEnrollmentDTO studentModuleEnrollmentDTO) {
        studentModuleEnrollmentDTO.setId(studentModuleEnrollment.getId());
        studentModuleEnrollmentDTO.setEnrollmentDate(studentModuleEnrollment.getEnrollmentDate());
        studentModuleEnrollmentDTO.setStudentUser(studentModuleEnrollment.getStudentUser() == null ? null : studentModuleEnrollment.getStudentUser().getApogeeNumber());
        studentModuleEnrollmentDTO.setModulee(studentModuleEnrollment.getModulee() == null ? null : studentModuleEnrollment.getModulee().getId());
        return studentModuleEnrollmentDTO;
    }

    private StudentModuleEnrollment mapToEntity(
            final StudentModuleEnrollmentDTO studentModuleEnrollmentDTO,
            final StudentModuleEnrollment studentModuleEnrollment) {
        studentModuleEnrollment.setEnrollmentDate(studentModuleEnrollmentDTO.getEnrollmentDate());
        final Student studentUser = studentModuleEnrollmentDTO.getStudentUser() == null ? null : studentRepository.findById(studentModuleEnrollmentDTO.getStudentUser())
                .orElseThrow(() -> new NotFoundException("studentUser not found"));
        studentModuleEnrollment.setStudentUser(studentUser);
        final Modulee modulee = studentModuleEnrollmentDTO.getModulee() == null ? null : moduleeRepository.findById(studentModuleEnrollmentDTO.getModulee())
                .orElseThrow(() -> new NotFoundException("modulee not found"));
        studentModuleEnrollment.setModulee(modulee);
        return studentModuleEnrollment;
    }

}
