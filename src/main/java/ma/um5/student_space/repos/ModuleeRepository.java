package ma.um5.student_space.repos;

import ma.um5.student_space.domain.Filiere;
import ma.um5.student_space.domain.Modulee;
import ma.um5.student_space.domain.Teacher;
import org.springframework.data.jpa.repository.JpaRepository;


public interface ModuleeRepository extends JpaRepository<Modulee, Integer> {

    Modulee findFirstByFiliere(Filiere filiere);

    Modulee findFirstByTeacher(Teacher teacher);

}
