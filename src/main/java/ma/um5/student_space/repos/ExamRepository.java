package ma.um5.student_space.repos;

import ma.um5.student_space.domain.Exam;
import ma.um5.student_space.domain.Modulee;
import org.springframework.data.jpa.repository.JpaRepository;


public interface ExamRepository extends JpaRepository<Exam, Integer> {

    Exam findFirstByModulee(Modulee modulee);

}
