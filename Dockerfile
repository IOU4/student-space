# Use official OpenJDK 21 image as base
FROM eclipse-temurin:21-jre

# Set working directory
WORKDIR /app

# Copy the jar file from target directory
COPY target/*.jar app.jar

# Run the jar file
CMD ["java", "-jar", "app.jar"]
