require('dotenv').config()
const express = require("express");
const app = express();

let accounts = [
    {
        id: 1,
        name: "Steve",
        email: "steve@gmail.com",
        password: "password123"
    },
    {
        id: 2,
        name: "John Smith",
        email: "bigplanes@gmail.com",
        password: "vroomvroom"
    }
];

let events = [
    {
        id: 1,
        name: "Cheese factory visit",
        description: "We are going to eat so much cheese",
        date: "my birthday :)"
    },
    {
        id: 2,
        name: "The singularity",
        description: "We're going to die'",
        date: "23/12/26"
    }
];

//ADD MIDDLEWARE FOR LOGGING REQUESTS

app.get("/api/accounts", (request, response) => {
  response.json(accounts);
});

app.get("/api/events", (request, response) => {
  response.json(events);
});

const PORT = process.env.PORT;
app.listen(PORT);
console.log(`Server running on port ${PORT}`);
