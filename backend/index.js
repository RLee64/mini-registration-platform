const express = require("express");
const app = express();
const cors = require("cors");
const morgan = require("morgan");
const argon2 = require("argon2");
const jwt = require("jsonwebtoken");
const connectToMongo = require("./connect-to-mongo");
require("dotenv").config();

const Event = require("./models/event");
const Account = require("./models/account");

connectToMongo();

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

//GET ACCOUNT/S
app.get("/api/accounts", authenticateToken, (request, response) => {
  if (request.user.accessLevel !== "admin") {
    //Return ONLY the user's account
    Account.findById(request.user.sub).then((account) => {
      const responseDetails = {
        name: account.name,
        email: account.email,
        joinedEvents: account.joinedEvents,
      };
      return response.json(responseDetails);
    });
  } else {
    //Return ALL accounts
    Account.find({}).then((accounts) => {
      const returnedAccounts = accounts.map((account) => ({
        id: account.id,
        name: account.name,
        email: account.email,
        accessLevel: account.accessLevel,
        joinedEvents: account.joinedEvents,
      }));
      console.log(returnedAccounts);
      response.json(returnedAccounts);
    });
  }
});

//GET EVENTS
app.get("/api/events", (request, response) => {
  Event.find({}).then((events) => {
    response.json(events);
  });
});

//REGISTER NEW ACCOUNT
app.post("/api/accounts", async (request, response) => {
  const body = request.body;

  if (accounts.find((account) => account.email === body.email)) {
    //Duplicate email
    return response.sendStatus(409);
  }

  const hashedPassword = await argon2.hash(body.password);

  const newAccount = new Account({
    name: body.name,
    email: body.email.toLowerCase(),
    password: hashedPassword,
    accessLevel: "member",
    joinedEvents: [],
  });

  newAccount.save().then(() => {
    response.sendStatus(204);
  });
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

  newEvent.save().then((savedEvent) => {
    response.json(savedEvent);
  });
});

//LOGIN
app.post("/api/auth", (request, response) => {
  const { email, password } = request.body;

  Account.find({ email: email.toLowerCase() }).then(async (accounts) => {
    //Could consider case where there are somehow multiple accounts (maybe from manual insertion)
    if (accounts.length === 0) {
      console.log("Email is not registered");
      return response.sendStatus(401); //Maybe make it a 404 response
    }
    const locatedAccount = accounts[0];
    const passwordMatch = await argon2.verify(
      locatedAccount.password,
      password
    );
    if (passwordMatch) {
      console.log("Valid login details");
      //Generating access token
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
      console.log("Invalid password");
      response.sendStatus(401);
    }
  });
});

//CHANGE NAME
app.put("/api/accounts/edit-name", authenticateToken, (request, response) => {
  Account.findByIdAndUpdate(
    request.user.sub,
    { name: request.body.newName },
    { new: true }
  ).then((updatedAccount) => {
    console.log(updatedAccount);
    console.log(updatedAccount.name);
    response.json({ newName: updatedAccount.name });
  });
});

//JOIN EVENT
app.put("/api/accounts/join-event", authenticateToken, (request, response) => {
  const eventId = request.body.eventId;
  const userId = request.user.sub;

  Event.find({}).then((events) => {
    if (!events.find((event) => event.id === eventId)) {
      return response.sendStatus(404); //event does not exist
    }
  });

  Account.findById(userId).then((account) => {
    const alreadyJoined = account.joinedEvents.find(
      (joinedEventId) => joinedEventId === eventId
    );
    if (alreadyJoined) return response.sendStatus(409);

    console.log("Attempting to join event");
    console.log(eventId)
    Account.findOneAndUpdate(
      { _id: userId },
      { $push: { joinedEvents: eventId } },
      { new: true, returnDocument: 'after' }
    ).then((updatedAccount) => {
      response.json({ joinedEvents: updatedAccount.joinedEvents })
    }
    );
  });
});

const PORT = process.env.PORT;
app.listen(PORT);
console.log(`Server running on port ${PORT}`);
