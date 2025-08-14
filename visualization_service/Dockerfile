FROM ballerina/ballerina:2201.12.7

# Copy the application
COPY . /app
WORKDIR /app

# Build the application
RUN bal build

# Expose ports
EXPOSE 8080 9090

# Run the application
CMD ["bal", "run", "target/bin/visualization_service.jar"]
