package ma.um5.student_space.service;

import java.util.List;
import ma.um5.student_space.domain.Message;
import ma.um5.student_space.domain.Modulee;
import ma.um5.student_space.domain.User;
import ma.um5.student_space.model.MessageDTO;
import ma.um5.student_space.repos.MessageRepository;
import ma.um5.student_space.repos.ModuleeRepository;
import ma.um5.student_space.repos.UserRepository;
import ma.um5.student_space.repos.TeacherRepository;
import ma.um5.student_space.repos.StudentRepository;
import ma.um5.student_space.util.NotFoundException;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;


@Service
public class MessageService {

    private final MessageRepository messageRepository;
    private final ModuleeRepository moduleeRepository;
    private final UserRepository userRepository;
    private final TeacherRepository teacherRepository;
    private final StudentRepository studentRepository;

    public MessageService(final MessageRepository messageRepository,
            final ModuleeRepository moduleeRepository, final UserRepository userRepository,
            final TeacherRepository teacherRepository, final StudentRepository studentRepository) {
        this.messageRepository = messageRepository;
        this.moduleeRepository = moduleeRepository;
        this.userRepository = userRepository;
        this.teacherRepository = teacherRepository;
        this.studentRepository = studentRepository;
    }

    public List<MessageDTO> findAll() {
        final List<Message> messages = messageRepository.findAll(Sort.by("id"));
        return messages.stream()
                .map(message -> mapToDTO(message, new MessageDTO()))
                .toList();
    }

    public MessageDTO get(final Integer id) {
        return messageRepository.findById(id)
                .map(message -> mapToDTO(message, new MessageDTO()))
                .orElseThrow(NotFoundException::new);
    }

    public Integer create(final MessageDTO messageDTO) {
        final Message message = new Message();
        mapToEntity(messageDTO, message);
        return messageRepository.save(message).getId();
    }

    public void update(final Integer id, final MessageDTO messageDTO) {
        final Message message = messageRepository.findById(id)
                .orElseThrow(NotFoundException::new);
        mapToEntity(messageDTO, message);
        messageRepository.save(message);
    }

    public void delete(final Integer id) {
        messageRepository.deleteById(id);
    }

    public List<MessageDTO> findAllByModuleeId(Integer moduleeId) {
        final List<Message> messages = messageRepository.findByModulee_IdOrderBySentAtAsc(moduleeId);
        return messages.stream()
                .map(message -> mapToDTO(message, new MessageDTO()))
                .toList();
    }

    private MessageDTO mapToDTO(final Message message, final MessageDTO messageDTO) {
        messageDTO.setId(message.getId());
        messageDTO.setContent(message.getContent());
        messageDTO.setSentAt(message.getSentAt());
        messageDTO.setModulee(message.getModulee() == null ? null : message.getModulee().getId());
        messageDTO.setSenderUser(message.getSenderUser() == null ? null : message.getSenderUser().getId());
        // Add senderName and senderUserId for chat display
        if (message.getSenderUser() != null) {
            var teacher = teacherRepository.findFirstByUser(message.getSenderUser());
            if (teacher != null) {
                messageDTO.setSenderName("Prof. " + teacher.getFirstName() + " " + teacher.getLastName());
            } else {
                var student = studentRepository.findFirstByUser(message.getSenderUser());
                if (student != null) {
                    messageDTO.setSenderName(student.getFirstName() + " " + student.getLastName());
                } else {
                    messageDTO.setSenderName(message.getSenderUser().getEmail());
                }
            }
            messageDTO.setSenderUserId(message.getSenderUser().getId());
        }
        return messageDTO;
    }

    private Message mapToEntity(final MessageDTO messageDTO, final Message message) {
        message.setContent(messageDTO.getContent());
        message.setSentAt(messageDTO.getSentAt());
        final Modulee modulee = messageDTO.getModulee() == null ? null : moduleeRepository.findById(messageDTO.getModulee())
                .orElseThrow(() -> new NotFoundException("modulee not found"));
        message.setModulee(modulee);
        final User senderUser = messageDTO.getSenderUser() == null ? null : userRepository.findById(messageDTO.getSenderUser())
                .orElseThrow(() -> new NotFoundException("senderUser not found"));
        message.setSenderUser(senderUser);
        return message;
    }

}
