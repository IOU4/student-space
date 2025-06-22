package ma.um5.student_space.service;

import java.util.List;
import ma.um5.student_space.domain.Filiere;
import ma.um5.student_space.domain.Student;
import ma.um5.student_space.domain.StudentModuleEnrollment;
import ma.um5.student_space.model.StudentDTO;
import ma.um5.student_space.repos.FiliereRepository;
import ma.um5.student_space.repos.StudentModuleEnrollmentRepository;
import ma.um5.student_space.repos.StudentRepository;
import ma.um5.student_space.util.NotFoundException;
import ma.um5.student_space.util.ReferencedWarning;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;


@Service
@RequiredArgsConstructor
public class StudentService {

    private final StudentRepository studentRepository;
    private final FiliereRepository filiereRepository;
    private final StudentModuleEnrollmentRepository studentModuleEnrollmentRepository;

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
        studentDTO.setEmail(student.getEmail());
        studentDTO.setFiliere(student.getFiliere() == null ? null : student.getFiliere().getId());
        studentDTO.setPassword(student.getPasswordHash());
        return studentDTO;
    }

    private Student mapToEntity(final StudentDTO studentDTO, final Student student) {
        student.setFirstName(studentDTO.getFirstName());
        student.setLastName(studentDTO.getLastName());
        final Filiere filiere = studentDTO.getFiliere() == null ? null : filiereRepository.findById(studentDTO.getFiliere())
                .orElseThrow(() -> new NotFoundException("filiere not found"));
        student.setFiliere(filiere);
        student.setEmail(studentDTO.getEmail());
        student.setPasswordHash(studentDTO.getPassword());
        return student;
    }

    public boolean apogeeNumberExists(final String apogeeNumber) {
        return studentRepository.existsByApogeeNumberIgnoreCase(apogeeNumber);
    }

    public ReferencedWarning getReferencedWarning(final String apogeeNumber) {
        final ReferencedWarning referencedWarning = new ReferencedWarning();
        final Student student = studentRepository.findById(apogeeNumber)
                .orElseThrow(NotFoundException::new);
        final StudentModuleEnrollment studentUserStudentModuleEnrollment = studentModuleEnrollmentRepository.findFirstByStudent(student);
        if (studentUserStudentModuleEnrollment != null) {
            referencedWarning.setKey("student.studentModuleEnrollment.studentUser.referenced");
            referencedWarning.addParam(studentUserStudentModuleEnrollment.getId());
            return referencedWarning;
        }
        return null;
    }

}
