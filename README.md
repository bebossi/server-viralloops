# server-viralloops
## Overview
This project is a Form Widget Editor, built using Node.js, Express, and RabbitMQ. The server code is responsible for handling user requests, saving form widget data to a database, and rendering HTML files for form widgets.

## Features
REST API endpoints for saving and retrieving form widget data
A background worker that listens for messages from RabbitMQ and generates HTML files for form widgets
Requirements
Node.js
Express
RabbitMQ
A database PostgreSQL hosted on Railway
Setup
Clone the repository.
Install the dependencies with npm install or yarn install.
Configure the database connection and RabbitMQ in the config file.
Start the server with npm run dev.

