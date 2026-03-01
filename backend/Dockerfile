# Build stage (use Debian base - Alpine has SSL issues with MongoDB Atlas)
FROM eclipse-temurin:17-jdk-jammy AS build
WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends maven && rm -rf /var/lib/apt/lists/*
COPY pom.xml ./
COPY src ./src/
RUN mvn -B package -DskipTests -q

# Run stage (Debian base for reliable TLS to Atlas)
FROM eclipse-temurin:17-jre-jammy
WORKDIR /app

COPY --from=build /app/target/*.jar app.jar

EXPOSE 8000
# Render sets PORT; default 8000 for local runs
ENTRYPOINT ["sh", "-c", "exec java -jar app.jar --server.port=${PORT:-8000}"]
