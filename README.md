# HotTakes #
This is the back end server for Project 6 "HotTakes".
### Prerequisites ###
Installed Node and `npm` locally on your machine.
Create a directory with the name of your choice ("HotTakes" for exemple)
### frontend Installation ###
Clone the code for the frontend into a subdirectory called frontend using the command below :
git clone https://github.com/OpenClassrooms-Student-Center/Web-Developer-P6.git
Then, in terminal, do the following : 
cd frontend
npm install
npm run start
You can run the interface in your browser with :  http://localhost:4200
### Backend Installation ###
Add the "backend" folder to the project.
Then, run `npm install`. 
You can run the server with `node server`. 
The server should run on `localhost` with default port `3000`.  
Create a cluster with MongoDB Atlas.
You can use free layer of MongoDB Atlas, the “database as a service”.
Access the Database Access. You will need to add a user that has the ability to read and write to any database
Connect and choose "Connect your application". 
Select the most recent version of the Node.js driver, then "Connection String Only", and make a copy of the character string returned

Within backend folder, create an “image” folder and a “env.” file.

Within the “env.” file add the following :

PORT  = 3000

DB_CONNECTION = 'mongodb+srv: insert your own address'