package ma.um5.student_space.rest;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;
import ma.um5.student_space.domain.Modulee;
import ma.um5.student_space.domain.User;
import ma.um5.student_space.model.MessageDTO;
import ma.um5.student_space.repos.ModuleeRepository;
import ma.um5.student_space.repos.UserRepository;
import ma.um5.student_space.service.MessageService;
import ma.um5.student_space.util.CustomCollectors;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping(value = "/api/messages", produces = MediaType.APPLICATION_JSON_VALUE)
public class MessageResource {

    private final MessageService messageService;
    private final ModuleeRepository moduleeRepository;
    private final UserRepository userRepository;

    public MessageResource(final MessageService messageService,
            final ModuleeRepository moduleeRepository, final UserRepository userRepository) {
        this.messageService = messageService;
        this.moduleeRepository = moduleeRepository;
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<List<MessageDTO>> getAllMessages() {
        return ResponseEntity.ok(messageService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<MessageDTO> getMessage(@PathVariable(name = "id") final Integer id) {
        return ResponseEntity.ok(messageService.get(id));
    }

    @PostMapping
    public ResponseEntity<Integer> createMessage(@RequestBody @Valid final MessageDTO messageDTO) {
        final Integer createdId = messageService.create(messageDTO);
        return new ResponseEntity<>(createdId, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Integer> updateMessage(@PathVariable(name = "id") final Integer id,
            @RequestBody @Valid final MessageDTO messageDTO) {
        messageService.update(id, messageDTO);
        return ResponseEntity.ok(id);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMessage(@PathVariable(name = "id") final Integer id) {
        messageService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/moduleeValues")
    public ResponseEntity<Map<Integer, String>> getModuleeValues() {
        return ResponseEntity.ok(moduleeRepository.findAll(Sort.by("id"))
                .stream()
                .collect(CustomCollectors.toSortedMap(Modulee::getId, Modulee::getName)));
    }

    @GetMapping("/senderUserValues")
    public ResponseEntity<Map<Integer, String>> getSenderUserValues() {
        return ResponseEntity.ok(userRepository.findAll(Sort.by("id"))
                .stream()
                .collect(CustomCollectors.toSortedMap(User::getId, User::getEmail)));
    }

    @GetMapping("/module/{moduleId}")
    public ResponseEntity<List<MessageDTO>> getMessagesByModule(@PathVariable Integer moduleId) {
        return ResponseEntity.ok(messageService.findAllByModuleeId(moduleId));
    }

}
