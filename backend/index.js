const express = require("express");
const app = express();
const cors = require("cors");
const morgan = require("morgan");
const argon2 = require("argon2");
const jwt = require("jsonwebtoken");
const connectToMongo = require("./connect-to-mongo");
require("dotenv").config();

const Event = require("./models/event");

connectToMongo();

//Hardcoded data for testing (REMOVE LATER)
let accounts = [
  {
    id: "1",
    name: "Steve",
    email: "steve@gmail.com",
    password:
      "$argon2id$v=19$m=65536,t=3,p=4$y+p3TKlzeluC5OFPjd9iHA$aK2IoM/344DLOzsV8hEwoMLC952vfFYjxHfJoyF/VfQ",
    accessLevel: "admin",
    joinedEvents: [],
  },
  {
    id: "2",
    name: "John Smith",
    email: "bigplanes@gmail.com",
    password:
      "$argon2id$v=19$m=65536,t=3,p=4$y+p3TKlzeluC5OFPjd9iHA$aK2IoM/344DLOzsV8hEwoMLC952vfFYjxHfJoyF/VfQ",
    accessLevel: "member",
    joinedEvents: [],
  },
];

//Middleware
//ADD MIDDLEWARE FOR LOGGING REQUESTS
app.use(cors());
app.use(express.json());
app.use(morgan("tiny"));

const authenticateToken = (request, response, next) => {
  const authHeader = request.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return response.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, user) => {
    if (error) {
      console.log("Token present but is invalid (expired or doesn't exist)");
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
    //Return only the user's account
    const personalAccount = accounts.find(
      (account) => account.id === request.user.sub
    );
    const returnedDetails = {
      name: personalAccount.name,
      email: personalAccount.email,
      joinedEvents: personalAccount.joinedEvents,
    };
    return response.json(returnedDetails);
  }
  const returnedAccounts = accounts.map((account) => ({
    ...account,
    password: null,
  }));
  response.json(returnedAccounts);
});

//GET EVENTS
app.get("/api/events", (request, response) => {
  Event.find({}).then((events) => {
    response.json(events);
  });
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
  newAccount.accessLevel = "member";
  newAccount.joinedEvents = [];
  accounts = accounts.concat(newAccount);
  response.json(newAccount);
});

//CREATE NEW EVENT (ADMIN ONLY)
app.post("/api/events", authenticateToken, (request, response) => {
  if (request.user.accessLevel !== "admin") {
    return response.sendStatus(403);
  }

  const body = request.body;

  const date = new Date(body.date);

  const newEvent = new Event({
    name: body.name,
    description: body.description,
    date: date.toISOString(),
  });

  newEvent.save()
    .then(savedEvent => {
      response.json(savedEvent);
    })
});

//LOGIN
app.post("/api/auth", async (request, response) => {
  const { email, password } = request.body;
  const locatedAccount = accounts.find((account) => account.email === email);
  if (!locatedAccount) {
    console.log("No email was provided");
    return response.sendStatus(401);
  }

  const passwordMatch = await argon2.verify(locatedAccount.password, password);
  if (passwordMatch) {
    console.log("Valid login details");
    const user = {
      sub: locatedAccount.id,
      accessLevel: locatedAccount.accessLevel,
    };
    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
    response.status(200).json({
      accessToken: accessToken,
      accessLevel: locatedAccount.accessLevel, //Used on client-side to smooth experience
    });
  } else {
    console.log("Invalid login details");
    response.sendStatus(401);
  }
});

app.put("/api/accounts/edit-name", authenticateToken, (request, response) => {
  accounts = accounts.map((account) =>
    account.id !== request.user.sub
      ? account
      : { ...account, name: request.body.newName }
  );
  response.json({ newName: request.body.newName });
});

app.put("/api/accounts/join-event", authenticateToken, (request, response) => {
  Event.find({}).then((events) => {
    if (!events.find((event) => event.id === request.body.eventId)) {
      return response.sendStatus(404); //event does not exist
    }
  });
  
  personalAccount = accounts.find((account) => account.id === request.user.sub);
  if (
    personalAccount.joinedEvents.find(
      (eventId) => eventId === request.body.eventId
    )
  ) {
    return response.sendStatus(409); //user has already joined the event
  }
  console.log("Attempting to join event");
  personalAccount.joinedEvents.push(request.body.eventId);
  response.json({ id: request.body.eventId });
});

const PORT = process.env.PORT;
app.listen(PORT);
console.log(`Server running on port ${PORT}`);
