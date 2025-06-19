package ma.um5.student_space.repos;

import ma.um5.student_space.domain.Filiere;
import ma.um5.student_space.domain.Student;
import ma.um5.student_space.domain.User;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;


public interface StudentRepository extends JpaRepository<Student, String> {

    Student findFirstByUser(User user);

    Student findFirstByFiliere(Filiere filiere);

    boolean existsByApogeeNumberIgnoreCase(String apogeeNumber);

    Optional<Student> findByApogeeNumber(String apogeeNumber);

}
