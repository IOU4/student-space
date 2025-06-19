package ma.um5.student_space.service;

import java.util.List;
import ma.um5.student_space.domain.Exam;
import ma.um5.student_space.domain.Filiere;
import ma.um5.student_space.domain.Message;
import ma.um5.student_space.domain.Modulee;
import ma.um5.student_space.domain.StudentModuleEnrollment;
import ma.um5.student_space.domain.Teacher;
import ma.um5.student_space.model.ModuleeDTO;
import ma.um5.student_space.repos.ExamRepository;
import ma.um5.student_space.repos.FiliereRepository;
import ma.um5.student_space.repos.MessageRepository;
import ma.um5.student_space.repos.ModuleeRepository;
import ma.um5.student_space.repos.StudentModuleEnrollmentRepository;
import ma.um5.student_space.repos.TeacherRepository;
import ma.um5.student_space.util.NotFoundException;
import ma.um5.student_space.util.ReferencedWarning;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;


@Service
public class ModuleeService {

    private final ModuleeRepository moduleeRepository;
    private final FiliereRepository filiereRepository;
    private final TeacherRepository teacherRepository;
    private final ExamRepository examRepository;
    private final MessageRepository messageRepository;
    private final StudentModuleEnrollmentRepository studentModuleEnrollmentRepository;

    public ModuleeService(final ModuleeRepository moduleeRepository,
            final FiliereRepository filiereRepository, final TeacherRepository teacherRepository,
            final ExamRepository examRepository, final MessageRepository messageRepository,
            final StudentModuleEnrollmentRepository studentModuleEnrollmentRepository) {
        this.moduleeRepository = moduleeRepository;
        this.filiereRepository = filiereRepository;
        this.teacherRepository = teacherRepository;
        this.examRepository = examRepository;
        this.messageRepository = messageRepository;
        this.studentModuleEnrollmentRepository = studentModuleEnrollmentRepository;
    }

    public List<ModuleeDTO> findAll() {
        final List<Modulee> modulees = moduleeRepository.findAll(Sort.by("id"));
        return modulees.stream()
                .map(modulee -> mapToDTO(modulee, new ModuleeDTO()))
                .toList();
    }

    public ModuleeDTO get(final Integer id) {
        return moduleeRepository.findById(id)
                .map(modulee -> mapToDTO(modulee, new ModuleeDTO()))
                .orElseThrow(NotFoundException::new);
    }

    public Integer create(final ModuleeDTO moduleeDTO) {
        final Modulee modulee = new Modulee();
        mapToEntity(moduleeDTO, modulee);
        return moduleeRepository.save(modulee).getId();
    }

    public void update(final Integer id, final ModuleeDTO moduleeDTO) {
        final Modulee modulee = moduleeRepository.findById(id)
                .orElseThrow(NotFoundException::new);
        mapToEntity(moduleeDTO, modulee);
        moduleeRepository.save(modulee);
    }

    public void delete(final Integer id) {
        moduleeRepository.deleteById(id);
    }

    private ModuleeDTO mapToDTO(final Modulee modulee, final ModuleeDTO moduleeDTO) {
        moduleeDTO.setId(modulee.getId());
        moduleeDTO.setName(modulee.getName());
        moduleeDTO.setDescription(modulee.getDescription());
        moduleeDTO.setCreatedAt(modulee.getCreatedAt());
        moduleeDTO.setFiliere(modulee.getFiliere() == null ? null : modulee.getFiliere().getId());
        moduleeDTO.setTeacher(modulee.getTeacher() == null ? null : modulee.getTeacher().getFirstName());
        return moduleeDTO;
    }

    private Modulee mapToEntity(final ModuleeDTO moduleeDTO, final Modulee modulee) {
        modulee.setName(moduleeDTO.getName());
        modulee.setDescription(moduleeDTO.getDescription());
        modulee.setCreatedAt(moduleeDTO.getCreatedAt());
        final Filiere filiere = moduleeDTO.getFiliere() == null ? null : filiereRepository.findById(moduleeDTO.getFiliere())
                .orElseThrow(() -> new NotFoundException("filiere not found"));
        modulee.setFiliere(filiere);
        final Teacher teacher = moduleeDTO.getTeacher() == null ? null : teacherRepository.findById(moduleeDTO.getTeacher())
                .orElseThrow(() -> new NotFoundException("teacher not found"));
        modulee.setTeacher(teacher);
        return modulee;
    }

    public ReferencedWarning getReferencedWarning(final Integer id) {
        final ReferencedWarning referencedWarning = new ReferencedWarning();
        final Modulee modulee = moduleeRepository.findById(id)
                .orElseThrow(NotFoundException::new);
        final Exam moduleeExam = examRepository.findFirstByModulee(modulee);
        if (moduleeExam != null) {
            referencedWarning.setKey("modulee.exam.modulee.referenced");
            referencedWarning.addParam(moduleeExam.getId());
            return referencedWarning;
        }
        final Message moduleeMessage = messageRepository.findFirstByModulee(modulee);
        if (moduleeMessage != null) {
            referencedWarning.setKey("modulee.message.modulee.referenced");
            referencedWarning.addParam(moduleeMessage.getId());
            return referencedWarning;
        }
        final StudentModuleEnrollment moduleeStudentModuleEnrollment = studentModuleEnrollmentRepository.findFirstByModulee(modulee);
        if (moduleeStudentModuleEnrollment != null) {
            referencedWarning.setKey("modulee.studentModuleEnrollment.modulee.referenced");
            referencedWarning.addParam(moduleeStudentModuleEnrollment.getId());
            return referencedWarning;
        }
        return null;
    }

}
