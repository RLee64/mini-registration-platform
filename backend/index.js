const express = require("express");
const app = express();
const cors = require("cors");
const argon2 = require("argon2");
const jwt = require("jsonwebtoken");
require("dotenv").config();

//Hardcoded data for testing (REMOVE LATER)
let accounts = [
  {
    id: "1",
    name: "Steve",
    email: "steve@gmail.com",
    password: "$argon2id$v=19$m=65536,t=3,p=4$y+p3TKlzeluC5OFPjd9iHA$aK2IoM/344DLOzsV8hEwoMLC952vfFYjxHfJoyF/VfQ",
    accessLevel: "admin",
  },
  {
    id: "2",
    name: "John Smith",
    email: "bigplanes@gmail.com",
    password: "$argon2id$v=19$m=65536,t=3,p=4$y+p3TKlzeluC5OFPjd9iHA$aK2IoM/344DLOzsV8hEwoMLC952vfFYjxHfJoyF/VfQ",
    accessLevel: "member",
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

const authenticateToken = (request, response, next) => {
  const authHeader = request.headers["authorization"];
  console.log(authHeader)
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return response.sendStatus(401);

  console.log("the token was")
  console.log(token)

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, user) => {
    if (error) {
      console.log("Token present but is invalid (expired or doesn't exist)")
      return response.sendStatus(403); //Token present but is invalid (expired or doesn't exist)
    }
    request.user = user;
    next();
  });
};

//ERROR CHECKING NEEDED FOR ALL

//GET ACCOUNTS (ADMIN ONLY)
app.get("/api/accounts", authenticateToken, (request, response) => {
  if (request.user.accessLevel !== "admin") {
    return response.sendStatus(403)
  }
  //REMOVE PASSWORDS FROM DATA
  response.json(accounts);
});

//GET EVENTS
app.get("/api/events", (request, response) => {
  //IS VERIFICATION NEEDED?
  response.json(events);
});

//REGISTER NEW ACCOUNT
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

//CREATE NEW EVENT (ADMIN ONLY)
app.post("/api/events", authenticateToken, (request, response) => {
  if (request.user.accessLevel !== "admin") {
    return response.sendStatus(403)
  }
  //TEMPORARY ID GENERATOR
  const maxId =
    events.length > 0 ? Math.max(...events.map((e) => Number(e.id))) : 0;
  const id = String(maxId + 1);
  
  const newEvent = request.body;
  newEvent.id = id;
  events = events.concat(newEvent);
  response.json(newEvent);
});

//LOGIN
app.post("/api/auth", async (request, response) => {
  const { email, password } = request.body;
  const locatedAccount = accounts.find((account) => account.email === email);
  if (!locatedAccount) {
    console.log("No email");
    return response.sendStatus(401);
  }

  const passwordMatch = await argon2.verify(locatedAccount.password, password);
  if (passwordMatch) {
    console.log("correct stuff");
    const user = {
      sub: locatedAccount.id,
      accessLevel: locatedAccount.accessLevel,
    };
    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
    console.log(accessToken)
    response.status(200).json({
      accessToken: accessToken,
      accessLevel: locatedAccount.accessLevel, //Used on client-side to smooth experience
    });
  } else {
    console.log("yeah that didn't work");
    response.sendStatus(401);
  }
});

const PORT = process.env.PORT;
app.listen(PORT);
console.log(`Server running on port ${PORT}`);
