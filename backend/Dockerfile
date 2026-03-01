# Build stage
FROM eclipse-temurin:17-jdk-alpine AS build
WORKDIR /app

RUN apk add --no-cache maven
COPY pom.xml ./
COPY src ./src/
RUN mvn -B package -DskipTests -q

# Run stage
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

COPY --from=build /app/target/*.jar app.jar

EXPOSE 8000
# Render sets PORT; default 8000 for local runs
ENTRYPOINT ["sh", "-c", "exec java -jar app.jar --server.port=${PORT:-8000}"]
