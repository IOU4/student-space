package ma.um5.student_space.model;

import static java.lang.annotation.ElementType.ANNOTATION_TYPE;
import static java.lang.annotation.ElementType.FIELD;
import static java.lang.annotation.ElementType.METHOD;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Constraint;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import jakarta.validation.Payload;
import java.lang.annotation.Documented;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;
import java.util.Map;
import ma.um5.student_space.service.StudentService;
import org.springframework.web.servlet.HandlerMapping;


/**
 * Check that apogeeNumber is present and available when a new Student is created.
 */
@Target({ FIELD, METHOD, ANNOTATION_TYPE })
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Constraint(
        validatedBy = StudentApogeeNumberValid.StudentApogeeNumberValidValidator.class
)
public @interface StudentApogeeNumberValid {

    String message() default "";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};

    class StudentApogeeNumberValidValidator implements ConstraintValidator<StudentApogeeNumberValid, String> {

        private final StudentService studentService;
        private final HttpServletRequest request;

        public StudentApogeeNumberValidValidator(final StudentService studentService,
                final HttpServletRequest request) {
            this.studentService = studentService;
            this.request = request;
        }

        @Override
        public boolean isValid(final String value, final ConstraintValidatorContext cvContext) {
            @SuppressWarnings("unchecked") final Map<String, String> pathVariables =
                    ((Map<String, String>)request.getAttribute(HandlerMapping.URI_TEMPLATE_VARIABLES_ATTRIBUTE));
            final String currentId = pathVariables.get("apogeeNumber");
            if (currentId != null) {
                // only relevant for new objects
                return true;
            }
            String error = null;
            if (value == null) {
                // missing input
                error = "NotNull";
            } else if (studentService.apogeeNumberExists(value)) {
                error = "Exists.student.apogeeNumber";
            }
            if (error != null) {
                cvContext.disableDefaultConstraintViolation();
                cvContext.buildConstraintViolationWithTemplate("{" + error + "}")
                        .addConstraintViolation();
                return false;
            }
            return true;
        }

    }

}
