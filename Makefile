COMPOSE=docker compose -f docker-compose.util.yaml -p util-openjob

up:
	$(COMPOSE) up -d

down:
	$(COMPOSE) down

restart:
	$(COMPOSE) down
	$(COMPOSE) up -d

ps:
	$(COMPOSE) ps

logs:
	$(COMPOSE) logs -f

logs-pgsql:
	$(COMPOSE) logs -f pgsql

logs-redis:
	$(COMPOSE) logs -f redis

logs-rabbitmq:
	$(COMPOSE) logs -f rabbitmq

exec-pgsql:
	$(COMPOSE) exec pgsql bash

exec-redis:
	$(COMPOSE) exec redis sh

exec-rabbitmq:
	$(COMPOSE) exec rabbitmq sh

psql:
	$(COMPOSE) exec pgsql psql -U postgres -d openjob

redis-cli:
	$(COMPOSE) exec redis redis-cli

rabbitmq-status:
	$(COMPOSE) exec rabbitmq rabbitmq-diagnostics status

rabbitmq-ping:
	$(COMPOSE) exec rabbitmq rabbitmq-diagnostics ping

clean:
	$(COMPOSE) down -v