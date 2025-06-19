package ma.um5.student_space.service;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import ma.um5.student_space.domain.User;
import ma.um5.student_space.repos.UserRepository;

import java.util.Collections;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UserRepository userRepository;

    public UserDetailsServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    /**
     * Locates the user based on the email.
     * @param email the email identifying the user whose data is required.
     * @return a fully populated user record (never null).
     * @throws UsernameNotFoundException if the user could not be found.
     */
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        // Creates a Spring Security User object
        return new org.springframework.security.core.userdetails.User(
            user.getEmail(),
            user.getPasswordHash(), // Assuming your User entity has this method
            Collections.singletonList(new SimpleGrantedAuthority(user.getRole())) // And this one for the role
        );
    }
}
