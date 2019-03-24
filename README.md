# airbnb-helper

## Getting Set up
First get [node](https://nodejs.org/en/download/) for your computer. Node comes with
a package manager called 'npm' which is kind of like pip in python. Do the following
commands:

`node --version` to see that Node installed correctly

`npm --version` to see that npm installed correctly

`npm run install-dependencies` to install requried dependncies for backend
and front end

`npm run dev` to start the front/backend servers in development mode. The app
is hosted on localhost:3000 and the backend is hosted on localhost:5000. This is only
for development. For deployment, the front end is made into a build file run by the 
backend when deployed to Heroku. 

Note: The last command only auto-refreshes when you change client/src/app.js (frontend). 
It will not auto refresh when you edit index.js (backend). If you want to work on just
the front end or just the back end do `npm start` in the root directory to run backend 
or in /client to run the react app

## Folder Structure
|      Folders     |                Purpose                  | 
| ---------------- |:---------------------------------------:| 
| client/src       | react front-end                         | 
| machine-learning | All ML code will go here                |  
| node_modules     | Libraries installed. Do not commit this |

## Important Files
|      Folders      |                Purpose                  | 
| ----------------- |:---------------------------------------:| 
| server.js         | The entry point to the back end server  | 
| client/src/app.js | The entry point to the front end        |  

## Database Set up
First Install [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli)
Next Install [Postgres](https://devcenter.heroku.com/articles/heroku-postgresql#heroku-postgres-ssl). Go to the 'Local Setup' section and follow the instructions there and download the latest version. Version 11.2 might not be available on Linux. In that case get 10.7, you just won't be able to push or pull from the production database. After that do the following steps:

`psql -U postgres`  
`CREATE ROLE me WITH LOGIN PASSWORD 'password';`  Creates user 'me'  
`ALTER ROLE me CREATEDB;`  Allow user 'me' to create db's
`\q` (to quit)  
`psql -d postgres -U me` Login as 'me' with the password 'password'  
`CREATE DATABASE api;`  Create database called api  
`\list`  
`\c api` Connect to database 'api'

After connecting to database 'api', you can enter SQL commands. I made a table called team_members
with our names and netIDs to show you how this works. Enter the following once you connect to the 
'api' database:

CREATE TABLE team_members (<br/>
  ID SERIAL PRIMARY KEY,<br/>
  name VARCHAR(30),<br/>
  netID VARCHAR(30)<br/> 
);<br/>

INSERT INTO team_members (name, netID)<br/>
  VALUES ('Frank Rodriguez', 'Fsr32'), ('Aditya Jha', 'Aj377'),<br/>
    ('Jacob Mathai', 'Jm2463'), ('Tharun Sankur', 'Tps87');<br/>

`SELECT * FROM team_members;`  Should print out names and netIDs in a table

After doing this, individually start the server with `npm start`. Then go to the endpoint 
`localhost:5000/api/users`. If you see our names and netIDs, it worked

## Pushing to Production Database
https://devcenter.heroku.com/articles/heroku-postgresql#heroku-postgres-ssl

Connect to database: `heroku pg:psql -app airbnb-helper`

pg:pull
`heroku pg:pull postgresql-sinuous-69154 testdb --app airbnb-helper`
`PGUSER=postgres PGPASSWORD=password heroku pg:pull HEROKU_POSTGRESQL_MAGENTA mylocaldb --app airbnb-helper`

pg:push
`heroku pg:push mylocaldb HEROKU_POSTGRESQL_MAGENTA --app airbnb-helper`

## Deploying to Heroku using CLI
