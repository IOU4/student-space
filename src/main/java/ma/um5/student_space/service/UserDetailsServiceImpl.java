package ma.um5.student_space.service;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import ma.um5.student_space.repos.StudentRepository;
import ma.um5.student_space.repos.TeacherRepository;

import java.util.Collections;

@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {


    private final StudentRepository studentRepository;
    private final TeacherRepository teacherRepository;
    /**
     * Locates the user based on the email.
     * @param email the email identifying the user whose data is required.
     * @return a fully populated user record (never null).
     * @throws UsernameNotFoundException if the user could not be found.
     */
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        var student = studentRepository.findByEmail(email).orElse(null);
        if(student != null) {
            return new User(
                student.getEmail(),
                student.getPasswordHash(),
                Collections.singletonList(new SimpleGrantedAuthority("student"))
            );
        } else {
            var teacher = teacherRepository.findByEmail(email)
                .orElseThrow(() ->new UsernameNotFoundException("User not found with email: " + email));
            return new User(
                teacher.getEmail(),
                teacher.getPasswordHash(),
                Collections.singletonList(new SimpleGrantedAuthority("teacher"))
            );

        }

        // Creates a Spring Security User object
    }
}
