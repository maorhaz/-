# Amigos Project Setup Guide

Welcome to the Amigos project! Follow the steps below to properly set up the project on your local machine and connect it to MongoDB.

## Prerequisites

Before starting, ensure you have the following installed:

- [Node.js](https://nodejs.org/en/download/)
- MongoDB (you can use a local instance or connect via VSCode MongoDB extension)

## Project Structure

In the `src` folder, you'll find two key files:
- `server.js` – The server file to run the application.
- `test.js` – A test file to verify the database connection.

## Steps to Set Up and Run

### 1. Clone the Repository

First, clone the repository to your local machine. Once cloned, you will have an `amigos` folder that contains all the necessary files to run the app.

### 2. Install Dependencies

Open your terminal, navigate to the src folder, and run the following command to install the necessary dependencies:
npm install express mongodb
###3. Navigate to the Project Directory

Move to the src directory inside the project folder using the following command (adjust the path according to where you cloned the repo):
cd /Users/roeybiton/Desktop/Amigos/Amigos/src

###4. Run the Database Test
After navigating to the correct directory, run test.js to verify that the database is connected correctly:
node test.js
If the connection is successful, you should see output from the MongoDB database in your terminal.

###5. Run the Server
Once the database connection is confirmed, run the server:
node server.js
After running the server, you can open the HTML file you want to work on by navigating to localhost in your browser.

MongoDB Connection via VSCode
Connecting to MongoDB through the VSCode MongoDB extension is straightforward. If you need further assistance with this, Maor and Noa are familiar with the process and can help.

