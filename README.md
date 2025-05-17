# Users crud

## Setup

1. Create the environment files from the example file:
   ```
   cp ./web-users-crud/.env.example ./web-users-crud/.env.development
   cp ./api-users-crud/.env.example ./api-users-crud/.env.development
   ```
2. Build and then run the project with docker-compose:
   ```
   docker-compose build
   docker-compose up
   ```
3. You can now access the web page at `localhost:3000`, and the api at `localhost:8000`

4. (OPTIONAL) You can run the the tests with (containers should be running):

   - API (unit): `docker exec -it api-users-crud yarn test`
   - API (e2e): `docker exec -it api-users-crud yarn test:e2e`
   - WEB (unit): `docker exec -it web-users-crud yarn test`

5. (OPTIONAL) If your editor is full of warnings, you can install node_modules locally:
   ```
   cd ./web-users-crud && rmdir node_modules && yarn install && cd ..
   cd ./api-users-crud && rmdir node_modules && yarn install && cd ..
   ```
   - If you run these commands while the containers are up, you will need to restart it with `docker-compose up`
