package ma.um5.student_space.repos;

import ma.um5.student_space.domain.Message;
import ma.um5.student_space.domain.Modulee;
import ma.um5.student_space.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;


public interface MessageRepository extends JpaRepository<Message, Integer> {

    Message findFirstByModulee(Modulee modulee);

    Message findFirstBySenderUser(User user);

    java.util.List<Message> findByModulee_IdOrderBySentAtAsc(Integer moduleeId);
}
