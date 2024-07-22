#!/bin/bash

# Function to get running fedimintd services
get_running_fedimintds() {
  docker-compose ps --services | grep 'fedimintd'
}

# Function to restart a fedimintd service with new ports
restart_fedimintd() {
  local service_name=$1
  local new_port=$2

  echo "Stopping $service_name..."
  docker-compose stop "$service_name"

  echo "Updating docker-compose.yml for $service_name with new port $new_port..."
  # Update the ports mapping
  sed -i "s/- '[0-9]\+:${new_port}'/- '${new_port}:${new_port}'/" docker-compose.yml
  # Update FM_BIND_API
  sed -i "s/FM_BIND_API=0.0.0.0:[0-9]\+/FM_BIND_API=0.0.0.0:${new_port}/" docker-compose.yml
  # Update FM_API_URL
  sed -i "s/FM_API_URL=ws:\/\/${service_name}:[0-9]\+/FM_API_URL=ws:\/\/${service_name}:${new_port}/" docker-compose.yml

  echo "Starting $service_name with new port $new_port..."
  docker-compose up -d "$service_name"

  # Check if the service is running
  if docker-compose ps "$service_name" | grep -q "Up"; then
    echo "Service $service_name is running."

    # Wait for a few seconds to allow the service to fully start
    sleep 10

    # Check if the service is listening on the new port
    if docker-compose exec "$service_name" netstat -tuln | grep -q ":$new_port"; then
      echo "Service $service_name is listening on port $new_port."
    else
      echo "Warning: Service $service_name is not listening on port $new_port."
    fi

    # Display the logs of the restarted service
    echo "Recent logs for $service_name:"
    docker-compose logs --tail=20 "$service_name"
  else
    echo "Error: Failed to restart $service_name."
    echo "Docker compose status:"
    docker-compose ps "$service_name"
  fi
}

# Main script
echo "Running fedimintd services:"
mapfile -t services < <(get_running_fedimintds)

for i in "${!services[@]}"; do
  echo "$((i + 1)). ${services[i]}"
done

read -p "Enter the number of the service to restart: " choice

if [[ "$choice" =~ ^[0-9]+$ ]] && [ "$choice" -ge 1 ] && [ "$choice" -le "${#services[@]}" ]; then
  selected_service="${services[$((choice - 1))]}"
  read -p "Enter the new API port for $selected_service: " new_port

  if [[ "$new_port" =~ ^[0-9]+$ ]]; then
    restart_fedimintd "$selected_service" "$new_port"
  else
    echo "Invalid port number. Please enter a valid number."
  fi
else
  echo "Invalid choice. Please enter a number between 1 and ${#services[@]}."
fi
