package ma.um5.student_space.service;

import java.util.List;
import ma.um5.student_space.domain.Modulee;
import ma.um5.student_space.domain.Teacher;
import ma.um5.student_space.domain.User;
import ma.um5.student_space.model.TeacherDTO;
import ma.um5.student_space.repos.ModuleeRepository;
import ma.um5.student_space.repos.TeacherRepository;
import ma.um5.student_space.repos.UserRepository;
import ma.um5.student_space.util.NotFoundException;
import ma.um5.student_space.util.ReferencedWarning;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;


@Service
public class TeacherService {

    private final TeacherRepository teacherRepository;
    private final UserRepository userRepository;
    private final ModuleeRepository moduleeRepository;

    public TeacherService(final TeacherRepository teacherRepository,
            final UserRepository userRepository, final ModuleeRepository moduleeRepository) {
        this.teacherRepository = teacherRepository;
        this.userRepository = userRepository;
        this.moduleeRepository = moduleeRepository;
    }

    public List<TeacherDTO> findAll() {
        final List<Teacher> teachers = teacherRepository.findAll(Sort.by("firstName"));
        return teachers.stream()
                .map(teacher -> mapToDTO(teacher, new TeacherDTO()))
                .toList();
    }

    public TeacherDTO get(final String firstName) {
        return teacherRepository.findById(firstName)
                .map(teacher -> mapToDTO(teacher, new TeacherDTO()))
                .orElseThrow(NotFoundException::new);
    }

    public String create(final TeacherDTO teacherDTO) {
        final Teacher teacher = new Teacher();
        mapToEntity(teacherDTO, teacher);
        teacher.setFirstName(teacherDTO.getFirstName());
        return teacherRepository.save(teacher).getFirstName();
    }

    public void update(final String firstName, final TeacherDTO teacherDTO) {
        final Teacher teacher = teacherRepository.findById(firstName)
                .orElseThrow(NotFoundException::new);
        mapToEntity(teacherDTO, teacher);
        teacherRepository.save(teacher);
    }

    public void delete(final String firstName) {
        teacherRepository.deleteById(firstName);
    }

    private TeacherDTO mapToDTO(final Teacher teacher, final TeacherDTO teacherDTO) {
        teacherDTO.setFirstName(teacher.getFirstName());
        teacherDTO.setLastName(teacher.getLastName());
        teacherDTO.setSpecialty(teacher.getSpecialty());
        teacherDTO.setCreatedAt(teacher.getCreatedAt());
        teacherDTO.setUser(teacher.getUser() == null ? null : teacher.getUser().getId());
        return teacherDTO;
    }

    private Teacher mapToEntity(final TeacherDTO teacherDTO, final Teacher teacher) {
        teacher.setLastName(teacherDTO.getLastName());
        teacher.setSpecialty(teacherDTO.getSpecialty());
        teacher.setCreatedAt(teacherDTO.getCreatedAt());
        final User user = teacherDTO.getUser() == null ? null : userRepository.findById(teacherDTO.getUser())
                .orElseThrow(() -> new NotFoundException("user not found"));
        teacher.setUser(user);
        return teacher;
    }

    public boolean firstNameExists(final String firstName) {
        return teacherRepository.existsByFirstNameIgnoreCase(firstName);
    }

    public ReferencedWarning getReferencedWarning(final String firstName) {
        final ReferencedWarning referencedWarning = new ReferencedWarning();
        final Teacher teacher = teacherRepository.findById(firstName)
                .orElseThrow(NotFoundException::new);
        final Modulee teacherModulee = moduleeRepository.findFirstByTeacher(teacher);
        if (teacherModulee != null) {
            referencedWarning.setKey("teacher.modulee.teacher.referenced");
            referencedWarning.addParam(teacherModulee.getId());
            return referencedWarning;
        }
        return null;
    }

}
