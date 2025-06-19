package ma.um5.student_space.model;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.OffsetDateTime;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class TeacherDTO {

    @Size(max = 100)
    @TeacherFirstNameValid
    private String firstName;

    @NotNull
    @Size(max = 100)
    private String lastName;

    @Size(max = 255)
    private String specialty;

    private OffsetDateTime createdAt;

    private Integer user;

}
