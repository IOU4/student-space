package ma.um5.student_space.service;

import java.util.List;

import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import ma.um5.student_space.domain.Message;
import ma.um5.student_space.domain.Modulee;
import ma.um5.student_space.model.MessageDTO;
import ma.um5.student_space.repos.MessageRepository;
import ma.um5.student_space.repos.ModuleeRepository;
import ma.um5.student_space.repos.StudentRepository;
import ma.um5.student_space.util.NotFoundException;


@Service
@RequiredArgsConstructor
public class MessageService {

    private final MessageRepository messageRepository;
    private final ModuleeRepository moduleeRepository;
    private final StudentRepository studentRepository;

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
        messageDTO.setStudentId(message.getStudent().getApogeeNumber());
        // Add senderName and senderUserId for chat display
        if (message.getIsTeacher()) {
            var teacher = message.getModulee().getTeacher();
            messageDTO.setSenderName("Prof. " + teacher.getFirstName() + " " + teacher.getLastName());
        } else messageDTO.setSenderName(message.getStudent().getFirstName() + " " + message.getStudent().getLastName());
        return messageDTO;
    }

    private Message mapToEntity(final MessageDTO messageDTO, final Message message) {
        message.setContent(messageDTO.getContent());
        message.setSentAt(messageDTO.getSentAt());
        final Modulee modulee = messageDTO.getModulee() == null ? null : moduleeRepository.findById(messageDTO.getModulee())
                .orElseThrow(() -> new NotFoundException("modulee not found"));
        message.setModulee(modulee);
        message.setStudent(studentRepository.findById(messageDTO.getStudentId()).orElse(null));
        return message;
    }

}
