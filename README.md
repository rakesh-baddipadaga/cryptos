##Next.js Cryptocurrency Dashboard
This project is a cryptocurrency dashboard built with Next.js, React, and Redux. It fetches real-time data from the CoinGecko API, displaying current prices and maintaining a history of price changes.

##Table of Contents
Installation
Usage
Features
Technologies Used
Contributing
License


Installation

To run this project locally, follow these steps:

#Clone the repository:
git clone


##Install dependencies:

npm install
or
yarn install


Set up environment variables:

Create a .env.local file in the root of the project and add your environment variables like database uri. For example:


MONGODB_URI=MONGODB_CONNECTION_STRING
Replace   MONGODB_CONNECTION_STRING with actual connection string

##Start the development server:
to start the backend server 
npm run start-cron
and 
npm run dev


This command starts the development server on http://localhost:3000.

#Usage
Once the development server is running, you can access the application by navigating to http://localhost:3000 in your web browser.

#Features
Real-time cryptocurrency data updates
Historical price tracking

#Technologies Used
Next.js: React framework for server-rendered applications.
React: JavaScript library for building user interfaces.
Redux: State management library for predictable state containers.
Axios: Promise-based HTTP client for making API requests.
CSS Modules: Local scoped CSS by default in Next.js.
