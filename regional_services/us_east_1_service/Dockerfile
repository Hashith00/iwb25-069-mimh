# Use the official Ballerina runtime image
FROM ballerina/ballerina:2201.12.7

# Set working directory
WORKDIR /home/ballerina

# Copy the built Ballerina application
COPY target/bin/us_east_1_service.jar /home/ballerina/

# Expose the port the service runs on
EXPOSE 3001

# Run the Ballerina service
CMD ["ballerina", "run", "us_east_1_service.jar"] 