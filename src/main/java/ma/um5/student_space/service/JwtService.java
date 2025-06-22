package ma.um5.student_space.service;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import ma.um5.student_space.domain.Student;
import ma.um5.student_space.domain.Teacher;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Service
public class JwtService {

    @Value("${jwt.secret}")
    private String secretKey;

    // Token validity in milliseconds (e.g., 24 hours)
    private static final long TOKEN_VALIDITY = 1000 * 60 * 60 * 24;

    /**
     * Generates a JWT for a given UserDetails object.
     * This is typically used by Spring Security's internal authentication flow.
     * @param userDetails The user details to include in the token.
     * @return A signed JWT string.
     */
    public String generateToken(UserDetails userDetails) {
        Map<String, Object> claims = new HashMap<>();
        // You can add more claims here if needed
        return createToken(claims, userDetails.getUsername());
    }

    public String generateToken(Student student) {
        Map<String, Object> claims = new HashMap<>();
        // Add custom claims like role or user ID for easier access on the frontend
        claims.put("apogee_number", student.getApogeeNumber());
        return createToken(claims, student.getEmail());
    }

    public String generateToken(Teacher teacher) {
        Map<String, Object> claims = new HashMap<>();
        // Add custom claims like role or user ID for easier access on the frontend
        claims.put("teacher_id", teacher.getId());
        return createToken(claims, teacher.getEmail());
    }

    private String createToken(Map<String, Object> claims, String subject) {
        Date now = new Date(System.currentTimeMillis());
        Date expirationDate = new Date(now.getTime() + TOKEN_VALIDITY);

        return Jwts.builder()
                .setClaims(claims)
                .setSubject(subject) // The user's email is the subject of the token
                .setIssuedAt(now)
                .setExpiration(expirationDate)
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    private Key getSigningKey() {
        byte[] keyBytes = secretKey.getBytes();
        return Keys.hmacShaKeyFor(keyBytes);
    }
}

