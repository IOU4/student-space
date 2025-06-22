package ma.um5.student_space.repos;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import ma.um5.student_space.domain.Message;
import ma.um5.student_space.domain.Modulee;


public interface MessageRepository extends JpaRepository<Message, Integer> {

    Message findFirstByModulee(Modulee modulee);

    List<Message> findByModulee_IdOrderBySentAtAsc(Integer moduleeId);
}
