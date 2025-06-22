package ma.um5.student_space.service;

import java.util.List;
import ma.um5.student_space.domain.Modulee;
import ma.um5.student_space.domain.Teacher;
import ma.um5.student_space.model.TeacherDTO;
import ma.um5.student_space.repos.ModuleeRepository;
import ma.um5.student_space.repos.TeacherRepository;
import ma.um5.student_space.util.NotFoundException;
import ma.um5.student_space.util.ReferencedWarning;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;


@Service
@RequiredArgsConstructor
public class TeacherService {

    private final TeacherRepository teacherRepository;
    private final ModuleeRepository moduleeRepository;

    public List<TeacherDTO> findAll() {
        final List<Teacher> teachers = teacherRepository.findAll(Sort.by("firstName"));
        return teachers.stream()
                .map(teacher -> mapToDTO(teacher, new TeacherDTO()))
                .toList();
    }

    public TeacherDTO get(final Integer ID) {
        return teacherRepository.findById(ID)
                .map(teacher -> mapToDTO(teacher, new TeacherDTO()))
                .orElseThrow(NotFoundException::new);
    }

    public String create(final TeacherDTO teacherDTO) {
        final Teacher teacher = new Teacher();
        mapToEntity(teacherDTO, teacher);
        teacher.setFirstName(teacherDTO.getFirstName());
        return teacherRepository.save(teacher).getFirstName();
    }

    public void update(final Integer ID, final TeacherDTO teacherDTO) {
        final Teacher teacher = teacherRepository.findById(ID)
                .orElseThrow(NotFoundException::new);
        mapToEntity(teacherDTO, teacher);
        teacherRepository.save(teacher);
    }

    public void delete(final Integer ID) {
        teacherRepository.deleteById(ID);
    }

    private TeacherDTO mapToDTO(final Teacher teacher, final TeacherDTO teacherDTO) {
        teacherDTO.setFirstName(teacher.getFirstName());
        teacherDTO.setLastName(teacher.getLastName());
        teacherDTO.setSpecialty(teacher.getSpecialty());
        teacherDTO.setEmail(teacher.getEmail());
        teacherDTO.setPhoneNumber(teacher.getPhoneNumber());
        teacherDTO.setPassword(teacher.getPasswordHash());
        return teacherDTO;
    }

    private Teacher mapToEntity(final TeacherDTO teacherDTO, final Teacher teacher) {
        teacher.setLastName(teacherDTO.getLastName());
        teacher.setSpecialty(teacherDTO.getSpecialty());
        teacher.setEmail(teacherDTO.getEmail());
        teacher.setPhoneNumber(teacherDTO.getPhoneNumber());
        teacher.setPasswordHash(teacherDTO.getPassword());
        return teacher;
    }

    public boolean firstNameExists(final String firstName) {
        return teacherRepository.existsByFirstNameIgnoreCase(firstName);
    }

    public ReferencedWarning getReferencedWarning(final Integer ID) {
        final ReferencedWarning referencedWarning = new ReferencedWarning();
        final Teacher teacher = teacherRepository.findById(ID)
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
