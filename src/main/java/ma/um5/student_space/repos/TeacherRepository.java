package ma.um5.student_space.repos;

import ma.um5.student_space.domain.Teacher;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface TeacherRepository extends JpaRepository<Teacher, Integer> {

    Optional<Teacher> findByEmail(String email);
    boolean existsByFirstNameIgnoreCase(String firstName);

}
