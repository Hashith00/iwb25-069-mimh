# Use the official Ballerina runtime image
FROM ballerina/ballerina:2201.12.7

# Set working directory
WORKDIR /home/ballerina

# Copy the built Ballerina application
COPY target/bin/green_proxy.jar /home/ballerina/

# Expose the port the service runs on
EXPOSE 9090

# Run the Ballerina service
CMD ["ballerina", "run", "green_proxy.jar"] 