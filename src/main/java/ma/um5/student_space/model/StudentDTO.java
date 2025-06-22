package ma.um5.student_space.model;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class StudentDTO {

    @Size(max = 100)
    @StudentApogeeNumberValid
    private String apogeeNumber;

    @Size(max = 100)
    private String firstName;

    @Size(max = 100)
    private String lastName;

    private Integer filiere;

    private String email;

    private String password;

}
