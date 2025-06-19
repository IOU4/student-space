package ma.um5.student_space.model;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.OffsetDateTime;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class StudentDTO {

    @Size(max = 100)
    @StudentApogeeNumberValid
    private String apogeeNumber;

    @NotNull
    @Size(max = 100)
    private String firstName;

    @NotNull
    @Size(max = 100)
    private String lastName;

    private OffsetDateTime createdAt;

    private Integer user;

    private Integer filiere;

}
