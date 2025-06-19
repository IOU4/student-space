package ma.um5.student_space.model;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class StudentModuleEnrollmentDTO {

    private Long id;

    private LocalDate enrollmentDate;

    @NotNull
    @Size(max = 100)
    private String studentUser;

    @NotNull
    private Integer modulee;

}
