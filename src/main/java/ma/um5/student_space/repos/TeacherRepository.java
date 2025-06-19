package ma.um5.student_space.repos;

import ma.um5.student_space.domain.Teacher;
import ma.um5.student_space.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;


public interface TeacherRepository extends JpaRepository<Teacher, String> {

    Teacher findFirstByUser(User user);

    boolean existsByFirstNameIgnoreCase(String firstName);

}
