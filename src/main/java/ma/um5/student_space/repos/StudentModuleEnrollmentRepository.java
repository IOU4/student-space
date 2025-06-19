package ma.um5.student_space.repos;

import ma.um5.student_space.domain.Modulee;
import ma.um5.student_space.domain.Student;
import ma.um5.student_space.domain.StudentModuleEnrollment;
import org.springframework.data.jpa.repository.JpaRepository;


public interface StudentModuleEnrollmentRepository extends JpaRepository<StudentModuleEnrollment, Long> {

    StudentModuleEnrollment findFirstByStudentUser(Student student);

    StudentModuleEnrollment findFirstByModulee(Modulee modulee);

}
