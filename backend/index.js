const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();

//Hardcoded data for testing (REMOVE LATER)
let accounts = [
  {
    id: "1",
    name: "Steve",
    email: "steve@gmail.com",
    password: "password123",
  },
  {
    id: "2",
    name: "John Smith",
    email: "bigplanes@gmail.com",
    password: "vroomvroom",
  },
];

let events = [
  {
    id: 1,
    name: "Cheese factory visit",
    description: "We are going to eat so much cheese",
    date: "my birthday :)",
  },
  {
    id: 2,
    name: "The singularity",
    description: "We're going to die'",
    date: "23/12/26",
  },
];

//Middleware
//ADD MIDDLEWARE FOR LOGGING REQUESTS
app.use(cors());
app.use(express.json());

//ERROR CHECKING NEEDED FOR ALL
app.get("/api/accounts", (request, response) => {
  //ADD VERTIFICATION BEFORE RETURNING INFORMATION
  //REMOVE PASSWORDS FROM DATA
  response.json(accounts);
});

app.get("/api/events", (request, response) => {
  //IS VERIFICATION NEEDED?
  response.json(events);
});

app.post("/api/accounts", (request, response) => {
  //TEMPORARY ID GENERATOR
  const maxId =
    accounts.length > 0 ? Math.max(...accounts.map((a) => Number(a.id))) : 0;
  const id = String(maxId + 1);

  const newAccount = request.body;
  newAccount.id = id;
  accounts = accounts.concat(newAccount);
  response.json(newAccount);
});

app.post("/api/events", (request, response) => {
  //TEMPORARY ID GENERATOR
  const maxId =
    events.length > 0 ? Math.max(...events.map((e) => Number(e.id))) : 0;
  const id = String(maxId + 1);

  const newEvent = request.body;
  newEvent.id = id;
  events = events.concat(newEvent);
  response.json(newEvent);
});

const PORT = process.env.PORT;
app.listen(PORT);
console.log(`Server running on port ${PORT}`);
