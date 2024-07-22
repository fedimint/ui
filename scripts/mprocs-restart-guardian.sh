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

  # Update the docker-compose.yml file
  awk -v service="$service_name" -v new_port="$new_port" '
    $0 ~ service {in_service=1}
    in_service && /ports:/ {print; getline; $0 = "      - '"'"'" new_port ":" new_port "'"'"'"; in_ports=1}
    in_service && /FM_BIND_API=/ {sub(/:[0-9]+/, ":" new_port)}
    in_service && /FM_API_URL=/ {sub(/:[0-9]+/, ":" new_port)}
    {print}
    /^  [^ ]/ {in_service=0; in_ports=0}
  ' docker-compose.yml >docker-compose.yml.tmp && mv docker-compose.yml.tmp docker-compose.yml

  echo "Starting $service_name with new port $new_port..."
  docker-compose up -d "$service_name"

  echo "Waiting for service to start..."
  sleep 10

  if docker-compose ps | grep -q "${service_name}.*Up"; then
    echo "Service $service_name is running."
    if docker-compose port "$service_name" "$new_port" >/dev/null 2>&1; then
      echo "Service $service_name is listening on port $new_port."
    else
      echo "Warning: Service $service_name is not listening on port $new_port."
    fi
  else
    echo "Error: Service $service_name failed to start."
  fi

  echo "Recent logs for $service_name:"
  docker-compose logs --tail=10 "$service_name"
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
