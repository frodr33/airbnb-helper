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

