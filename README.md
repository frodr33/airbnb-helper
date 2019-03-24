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
First Install [Postgres](https://devcenter.heroku.com/articles/heroku-postgresql#heroku-postgres-ssl). Go to the 'Local Setup' section and follow the instructions there. After that do the following steps:

`psql postgres`
`CREATE ROLE me WITH LOGIN PASSWORD 'password';`
`ALTER ROLE me CREATEDB;`
`\q` (to quit)
`psql -d postgres -U me` (Then enter 'password')
`CREATE DATABASE api;`
`\list`
`\c api`

CREATE TABLE team_members (
  ID SERIAL PRIMARY KEY,
  name VARCHAR(30),
  netID VARCHAR(30)
);

INSERT INTO team_members (name, netID)
  VALUES ('Frank Rodriguez', 'Fsr32'), ('Aditya Jha', 'Aj377'), 
	('Jacob Mathai', 'Jm2463'), ('Tharun Sankur', 'Tps87');

SELECT * FROM team_members;

psql <username> <password>