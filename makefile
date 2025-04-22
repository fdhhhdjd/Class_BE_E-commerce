##################### ENV #####################
include .env
export $(shell sed 's/=.*//' .env)

############### Test ###############
test:
	@echo "Running tests..."

############### Database ###############
db-build:
	@echo "Stopping database..."
	docker-compose -f docker-compose.yml up -d --build

db-start:
	@echo "Stopping database..."
	docker-compose -f docker-compose.yml up -d

db-stop:
	@echo "Stopping database..."
	docker-compose -f docker-compose.yml down

db-export:
	@echo "Exporting database..."
	docker exec -t $(POSTGRES_HOST_CONTAINER) pg_dumpall -c -U $(POSTGRES_USER) > ./database/data/dump.sql

db-import:
	@echo "Importing database..."
	cat ./database/data/dump.sql | docker exec -i $(POSTGRES_HOST_CONTAINER) psql -U $(POSTGRES_USER) -d $(POSTGRES_DB)

# PM2

pm2-start:
	pm2 start ecosystem.config.js

pm2-delete:
	pm2 delete e-commerce-be

pm2-deploy:
	git pull 
	make pm2-delete
	make pm2-start

# Password
run-script:
	docker exec -it nginx chmod +x /usr/local/bin/scripts/htpasswd.sh




