// Server and External Middleware
const express = require("express");
const app = express();
const cors = require("cors");
const morgan = require("morgan");
const argon2 = require("argon2");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Model and Database
const Event = require("./models/event");
const Account = require("./models/account");
const connectToMongo = require("./connect-to-mongo");

// Internal Middleware
const authenticateToken = require("./middleware/authenticate-token");
const unknownEndpoint = require("./middleware/unknown-endpoint");
const errorHandler = require("./middleware/error-handler");

// Mongo DB Connecation
connectToMongo();

// Initial Middleware
app.use(express.static('dist'))
app.use(cors());
app.use(express.json());
app.use(morgan("tiny"));

// Get Account/s
app.get("/api/accounts", authenticateToken, (request, response) => {
  // Response is determined by access level
  if (request.user.accessLevel !== "admin") {
    // Return ONLY the user's account
    Account.findById(request.user.sub)
      .then((account) => {
        const responseDetails = {
          name: account.name,
          email: account.email,
          joinedEvents: account.joinedEvents,
        };
        return response.json(responseDetails);
      })
      .catch((error) => next(error));
  } else {
    // Return ALL accounts
    Account.find({})
      .then((accounts) => {
        const returnedAccounts = accounts.map((account) => ({
          id: account.id,
          name: account.name,
          email: account.email,
          accessLevel: account.accessLevel,
          joinedEvents: account.joinedEvents,
        }));
        response.json(returnedAccounts);
      })
      .catch((error) => next(error));
  }
});

// Get Events
app.get("/api/events", (request, response) => {
  Event.find({})
    .then((events) => {
      response.json(events);
    })
    .catch((error) => next(error));
});

// Register a New Account
app.post("/api/accounts", async (request, response) => {
  const body = request.body;

  Account.find({ email: body.email.toLowerCase() })
    .then((accounts) => {
      // Check if account already exists
      if (accounts.length > 0) {
        console.log("Email has already been registered");
        return response.sendStatus(409);
      }
    })
    .catch((error) => next(error));

  // Use argon2 to make password storage more secure
  const hashedPassword = await argon2.hash(body.password);

  const newAccount = new Account({
    name: body.name,
    email: body.email.toLowerCase(),
    password: hashedPassword,
    accessLevel: "member",
    joinedEvents: [],
  });

  newAccount
    .save()
    .then(() => {
      response.sendStatus(204);
    })
    .catch((error) => next(error));
});

// Create New Event (Admin Only)
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

  newEvent
    .save()
    .then((savedEvent) => {
      response.json(savedEvent);
    })
    .catch((error) => next(error));
});

// Login
app.post("/api/auth", (request, response) => {
  const { email, password } = request.body;

  Account.find({ email: email.toLowerCase() })
    .then(async (accounts) => {
      // Check if account exists
      if (accounts.length === 0) {
        console.log("Email is not registered");
        return response.sendStatus(401);
      }
      const locatedAccount = accounts[0];
      const passwordMatch = await argon2.verify(
        locatedAccount.password,
        password
      );
      if (passwordMatch) {
        console.log("Valid login details");
        // Generating access token
        const user = {
          sub: locatedAccount.id,
          accessLevel: locatedAccount.accessLevel,
        };
        const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);

        response.status(200).json({
          accessToken: accessToken,
          accessLevel: locatedAccount.accessLevel,
        });
      } else {
        console.log("Invalid password");
        response.sendStatus(401);
      }
    })
    .catch((error) => next(error));
});

// Change Account Name
app.put("/api/accounts/edit-name", authenticateToken, (request, response) => {
  Account.findByIdAndUpdate(
    request.user.sub,
    { name: request.body.newName },
    { new: true }
  )
    .then((updatedAccount) => {
      response.json({ newName: updatedAccount.name });
    })
    .catch((error) => next(error));
});

// User Joining an Event
app.put("/api/accounts/join-event", authenticateToken, (request, response) => {
  const eventId = request.body.eventId;
  const userId = request.user.sub;

  // Check if event exists
  Event.find({})
    .then((events) => {
      if (!events.find((event) => event.id === eventId)) {
        return response.sendStatus(404);
      }
    })
    .catch((error) => next(error));

  // Find correct account
  Account.findById(userId)
    .then((account) => {
      // Check if account has already joined event (important to prevent account from entering twice)
      const alreadyJoined = account.joinedEvents.find(
        (joinedEventId) => joinedEventId === eventId
      );
      if (alreadyJoined) return response.sendStatus(409);

      // Add event to user account
      return Account.findOneAndUpdate(
        { _id: userId },
        { $push: { joinedEvents: eventId } },
        { new: true, returnDocument: "after", runValidators: true, context: 'query' }
      );
    })
    .then((updatedAccount) => {
      response.json({ joinedEvents: updatedAccount.joinedEvents });
    })
    .catch((error) => next(error));
});

// Ending middleware
app.use(unknownEndpoint);
app.use(errorHandler);

// Port Stuff
const PORT = process.env.PORT;
app.listen(PORT);
console.log(`Server running on port ${PORT}`);
