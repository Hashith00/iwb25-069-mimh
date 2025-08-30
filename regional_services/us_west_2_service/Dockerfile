# Use the official Ballerina runtime image
FROM ballerina/ballerina:2201.12.7

# Set working directory
WORKDIR /home/ballerina

# Copy the built Ballerina application
COPY target/bin/us_west_2_service.jar /home/ballerina/

# Expose the port the service runs on
EXPOSE 3002

# Run the Ballerina service
CMD ["ballerina", "run", "us_west_2_service.jar"] 