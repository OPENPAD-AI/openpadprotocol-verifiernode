# Makefile for calling multiple NestJS API endpoints

# Define the base URL for the API (can be adjusted)
API_URL=http://localhost:5000/api

# API endpoints
DAILY_UPTIME_ENDPOINT=/daily-uptime-statictis
DAILY_REWARD_ENDPOINT=/daily-reward-stats
DELEGATION_STATS_ENDPOINT=/get-delegation-stats
NODE_EXIT_ENDPOINT=/node-exit
NODE_ENTER_ENDPOINT=/node-exit
NODE_LIST_ENDPOINT=/get-node-list
UNDELEGATE=/undelegate




# Command to call the API using curl
CALL_API_CMD=curl -X GET

# Command to run the Docker container (if needed)
DOCKER_COMPOSE_CMD=docker-compose up -d

# Command to stop the Docker container (if needed)
DOCKER_DOWN_CMD=docker-compose down

# Build the Docker container
build:
	@echo "Building Docker container..."
	@docker-compose build

# Start the application (docker-compose up)
start: build
	@echo "Starting Docker container..."
	$(DOCKER_COMPOSE_CMD)

# Stop the application (docker-compose down)
stop:
	@echo "Stopping Docker container..."
	$(DOCKER_DOWN_CMD)

# Call the daily uptime statistics API
call-daily-uptime:
	@echo "Calling API for Daily Uptime Statistics..."
	$(CALL_API_CMD) $(API_URL)$(DAILY_UPTIME_ENDPOINT)

# Call the daily reward stats API
call-daily-reward:
	@echo "Calling API for Daily Reward Stats..."
	$(CALL_API_CMD) $(API_URL)$(DAILY_REWARD_ENDPOINT)

# Call the delegation stats API
call-delegation-stats:
	@echo "Calling API for Delegation Stats..."
	$(CALL_API_CMD) $(API_URL)$(DELEGATION_STATS_ENDPOINT)
	
# Call the node exit stats API
call-node-exit:
	@echo "Calling API for Delegation Stats..."
	$(CALL_API_CMD) $(API_URL)$(NODE_EXIT_ENDPOINT)
	
# Call the node exit stats API
call-node-enter:
	@echo "Calling API for Delegation Stats..."
	$(CALL_API_CMD) $(API_URL)$(NODE_ENTER_ENDPOINT)

# Call the node list API
call-node-enter:
	@echo "Calling API for Delegation Stats..."
	$(CALL_API_CMD) $(API_URL)$(NODE_LIST_ENDPOINT)

# Call the Undelegate
call-undelegate:
	@echo "Calling API for undelegate"
	$(CALL_API_CMD) $(API_URL)$(UNDELEGATE)