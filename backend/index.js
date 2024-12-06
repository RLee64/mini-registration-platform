const express = require("express");
const app = express();
const cors = require("cors");
const argon2 = require("argon2");
require("dotenv").config();

//Hardcoded data for testing (REMOVE LATER)
let accounts = [
  {
    id: "1",
    name: "Steve",
    email: "steve@gmail.com",
    password: "password123",
    role: "admin"
  },
  {
    id: "2",
    name: "John Smith",
    email: "bigplanes@gmail.com",
    password: "vroomvroom",
    role: "member"
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
app.get("/api/accounts", async (request, response) => {
  //ADD VERTIFICATION BEFORE RETURNING INFORMATION
  //REMOVE PASSWORDS FROM DATA
  response.json(accounts);
});

app.get("/api/events", async (request, response) => {
  //IS VERIFICATION NEEDED?
  response.json(events);
});

app.post("/api/accounts", async (request, response) => {
  //TEMPORARY ID GENERATOR
  const maxId =
    accounts.length > 0 ? Math.max(...accounts.map((a) => Number(a.id))) : 0;
  const id = String(maxId + 1);

  const newAccount = request.body;

  if (accounts.find((account) => account.email === newAccount.email)) {
    //Duplicate email
    return response.sendStatus(409);
  }

  newAccount.id = id;
  newAccount.password = await argon2.hash(newAccount.password);
  accounts = accounts.concat(newAccount);
  response.json(newAccount);
});

app.post("/api/events", async (request, response) => {
  //TEMPORARY ID GENERATOR
  const maxId =
    events.length > 0 ? Math.max(...events.map((e) => Number(e.id))) : 0;
  const id = String(maxId + 1);

  const newEvent = request.body;
  newEvent.id = id;
  events = events.concat(newEvent);
  response.json(newEvent);
});

app.post("/api/authentication", async (request, response) => {
  const { email, password } = request.body;
  const locatedAccount = accounts.find((account) => account.email === email);
  if (!locatedAccount) {
    console.log("No email");
    return response.sendStatus(401);
  }

  const passwordMatch = await argon2.verify(locatedAccount.password, password);
  if (passwordMatch) {
    console.log("correct stuff");
    response.sendStatus(200);
  } else {
    console.log("yeah that didn't work");
    response.sendStatus(401);
  }
});

const PORT = process.env.PORT;
app.listen(PORT);
console.log(`Server running on port ${PORT}`);
