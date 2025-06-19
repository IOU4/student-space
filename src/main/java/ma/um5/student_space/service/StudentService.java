package ma.um5.student_space.service;

import java.util.List;
import ma.um5.student_space.domain.Filiere;
import ma.um5.student_space.domain.Student;
import ma.um5.student_space.domain.StudentModuleEnrollment;
import ma.um5.student_space.domain.User;
import ma.um5.student_space.model.StudentDTO;
import ma.um5.student_space.repos.FiliereRepository;
import ma.um5.student_space.repos.StudentModuleEnrollmentRepository;
import ma.um5.student_space.repos.StudentRepository;
import ma.um5.student_space.repos.UserRepository;
import ma.um5.student_space.util.NotFoundException;
import ma.um5.student_space.util.ReferencedWarning;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;


@Service
public class StudentService {

    private final StudentRepository studentRepository;
    private final UserRepository userRepository;
    private final FiliereRepository filiereRepository;
    private final StudentModuleEnrollmentRepository studentModuleEnrollmentRepository;

    public StudentService(final StudentRepository studentRepository,
            final UserRepository userRepository, final FiliereRepository filiereRepository,
            final StudentModuleEnrollmentRepository studentModuleEnrollmentRepository) {
        this.studentRepository = studentRepository;
        this.userRepository = userRepository;
        this.filiereRepository = filiereRepository;
        this.studentModuleEnrollmentRepository = studentModuleEnrollmentRepository;
    }

    public List<StudentDTO> findAll() {
        final List<Student> students = studentRepository.findAll(Sort.by("apogeeNumber"));
        return students.stream()
                .map(student -> mapToDTO(student, new StudentDTO()))
                .toList();
    }

    public StudentDTO get(final String apogeeNumber) {
        return studentRepository.findById(apogeeNumber)
                .map(student -> mapToDTO(student, new StudentDTO()))
                .orElseThrow(NotFoundException::new);
    }

    public String create(final StudentDTO studentDTO) {
        final Student student = new Student();
        mapToEntity(studentDTO, student);
        student.setApogeeNumber(studentDTO.getApogeeNumber());
        return studentRepository.save(student).getApogeeNumber();
    }

    public void update(final String apogeeNumber, final StudentDTO studentDTO) {
        final Student student = studentRepository.findById(apogeeNumber)
                .orElseThrow(NotFoundException::new);
        mapToEntity(studentDTO, student);
        studentRepository.save(student);
    }

    public void delete(final String apogeeNumber) {
        studentRepository.deleteById(apogeeNumber);
    }

    private StudentDTO mapToDTO(final Student student, final StudentDTO studentDTO) {
        studentDTO.setApogeeNumber(student.getApogeeNumber());
        studentDTO.setFirstName(student.getFirstName());
        studentDTO.setLastName(student.getLastName());
        studentDTO.setCreatedAt(student.getCreatedAt());
        studentDTO.setUser(student.getUser() == null ? null : student.getUser().getId());
        studentDTO.setFiliere(student.getFiliere() == null ? null : student.getFiliere().getId());
        return studentDTO;
    }

    private Student mapToEntity(final StudentDTO studentDTO, final Student student) {
        student.setFirstName(studentDTO.getFirstName());
        student.setLastName(studentDTO.getLastName());
        student.setCreatedAt(studentDTO.getCreatedAt());
        final User user = studentDTO.getUser() == null ? null : userRepository.findById(studentDTO.getUser())
                .orElseThrow(() -> new NotFoundException("user not found"));
        student.setUser(user);
        final Filiere filiere = studentDTO.getFiliere() == null ? null : filiereRepository.findById(studentDTO.getFiliere())
                .orElseThrow(() -> new NotFoundException("filiere not found"));
        student.setFiliere(filiere);
        return student;
    }

    public boolean apogeeNumberExists(final String apogeeNumber) {
        return studentRepository.existsByApogeeNumberIgnoreCase(apogeeNumber);
    }

    public ReferencedWarning getReferencedWarning(final String apogeeNumber) {
        final ReferencedWarning referencedWarning = new ReferencedWarning();
        final Student student = studentRepository.findById(apogeeNumber)
                .orElseThrow(NotFoundException::new);
        final StudentModuleEnrollment studentUserStudentModuleEnrollment = studentModuleEnrollmentRepository.findFirstByStudentUser(student);
        if (studentUserStudentModuleEnrollment != null) {
            referencedWarning.setKey("student.studentModuleEnrollment.studentUser.referenced");
            referencedWarning.addParam(studentUserStudentModuleEnrollment.getId());
            return referencedWarning;
        }
        return null;
    }

}
