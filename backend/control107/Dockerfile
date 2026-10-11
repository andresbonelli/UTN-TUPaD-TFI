FROM eclipse-temurin:17-alpine
WORKDIR /control107
COPY control107.jar control107.jar
EXPOSE 8080
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar control107.jar"]