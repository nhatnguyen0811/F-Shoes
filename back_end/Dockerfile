# Stage 1: Build the Spring Boot application with Maven
FROM maven:3.8.4-openjdk-17 AS builder

WORKDIR /app

COPY pom.xml .
COPY src src

# Show the directory contents before running the build
RUN ls -al

# Run the Maven build command with more detailed output
RUN mvn clean package

# Stage 2: Create the final image
FROM openjdk:17-jdk-slim

WORKDIR /app

COPY --from=builder /app/target/*.jar /app/app.jar

CMD ["java", "-jar", "app.jar"]