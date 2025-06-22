package ma.um5.student_space.model;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class ModuleeDTO {

    private Integer id;

    @NotNull
    @Size(max = 255)
    private String name;

    private String description;

    @NotNull
    private Integer filiere;

    private Integer teacher;

}
