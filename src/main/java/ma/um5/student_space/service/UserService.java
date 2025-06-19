package ma.um5.student_space.service;

import java.util.List;
import ma.um5.student_space.domain.Message;
import ma.um5.student_space.domain.Student;
import ma.um5.student_space.domain.Teacher;
import ma.um5.student_space.domain.User;
import ma.um5.student_space.model.UserDTO;
import ma.um5.student_space.repos.MessageRepository;
import ma.um5.student_space.repos.StudentRepository;
import ma.um5.student_space.repos.TeacherRepository;
import ma.um5.student_space.repos.UserRepository;
import ma.um5.student_space.util.NotFoundException;
import ma.um5.student_space.util.ReferencedWarning;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;


@Service
public class UserService {

    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final TeacherRepository teacherRepository;
    private final MessageRepository messageRepository;

    public UserService(final UserRepository userRepository,
            final StudentRepository studentRepository, final TeacherRepository teacherRepository,
            final MessageRepository messageRepository) {
        this.userRepository = userRepository;
        this.studentRepository = studentRepository;
        this.teacherRepository = teacherRepository;
        this.messageRepository = messageRepository;
    }

    public List<UserDTO> findAll() {
        final List<User> users = userRepository.findAll(Sort.by("id"));
        return users.stream()
                .map(user -> mapToDTO(user, new UserDTO()))
                .toList();
    }

    public UserDTO get(final Integer id) {
        return userRepository.findById(id)
                .map(user -> mapToDTO(user, new UserDTO()))
                .orElseThrow(NotFoundException::new);
    }

    public Integer create(final UserDTO userDTO) {
        final User user = new User();
        mapToEntity(userDTO, user);
        return userRepository.save(user).getId();
    }

    public void update(final Integer id, final UserDTO userDTO) {
        final User user = userRepository.findById(id)
                .orElseThrow(NotFoundException::new);
        mapToEntity(userDTO, user);
        userRepository.save(user);
    }

    public void delete(final Integer id) {
        userRepository.deleteById(id);
    }

    private UserDTO mapToDTO(final User user, final UserDTO userDTO) {
        userDTO.setId(user.getId());
        userDTO.setEmail(user.getEmail());
        userDTO.setPasswordHash(user.getPasswordHash());
        userDTO.setRole(user.getRole());
        userDTO.setCreatedAt(user.getCreatedAt());
        return userDTO;
    }

    private User mapToEntity(final UserDTO userDTO, final User user) {
        user.setEmail(userDTO.getEmail());
        user.setPasswordHash(userDTO.getPasswordHash());
        user.setRole(userDTO.getRole());
        user.setCreatedAt(userDTO.getCreatedAt());
        return user;
    }

    public ReferencedWarning getReferencedWarning(final Integer id) {
        final ReferencedWarning referencedWarning = new ReferencedWarning();
        final User user = userRepository.findById(id)
                .orElseThrow(NotFoundException::new);
        final Student userStudent = studentRepository.findFirstByUser(user);
        if (userStudent != null) {
            referencedWarning.setKey("user.student.user.referenced");
            referencedWarning.addParam(userStudent.getApogeeNumber());
            return referencedWarning;
        }
        final Teacher userTeacher = teacherRepository.findFirstByUser(user);
        if (userTeacher != null) {
            referencedWarning.setKey("user.teacher.user.referenced");
            referencedWarning.addParam(userTeacher.getFirstName());
            return referencedWarning;
        }
        final Message senderUserMessage = messageRepository.findFirstBySenderUser(user);
        if (senderUserMessage != null) {
            referencedWarning.setKey("user.message.senderUser.referenced");
            referencedWarning.addParam(senderUserMessage.getId());
            return referencedWarning;
        }
        return null;
    }

}
