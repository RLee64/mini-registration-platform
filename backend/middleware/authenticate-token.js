const jwt = require("jsonwebtoken");

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

module.exports = authenticateToken;
