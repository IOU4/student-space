package ma.um5.student_space.model;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.OffsetDateTime;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class ExamDTO {

    private Integer id;

    @NotNull
    @Size(max = 255)
    private String title;

    @NotNull
    private Integer examYear;

    @NotNull
    @Size(max = 512)
    private String fileUrl;

    private OffsetDateTime uploadedAt;

    @NotNull
    private Integer modulee;

}
