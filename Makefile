COMPOSE=docker compose -f docker-compose.pgsql.yaml -p pgsql-openjob

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

exec:
	$(COMPOSE) exec pgsql bash

psql:
	$(COMPOSE) exec pgsql psql -U postgres -d openjob

clean:
	$(COMPOSE) down -v