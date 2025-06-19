package ma.um5.student_space.model;

// Record for the successful authentication response
public record AuthResponseDTO(String token, UserDTO user) {}

