package ma.um5.student_space.model;

import jakarta.validation.constraints.NotNull;
import java.time.OffsetDateTime;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class MessageDTO {

    private Integer id;

    @NotNull
    private String content;

    private OffsetDateTime sentAt;

    @NotNull
    private Integer modulee;

    private String studentId;
    private Boolean isTeacher;
    private String senderName;
}
