const express = require("express");
const cors = require("cors");
const session = require("express-session");
const passport = require("./config/passport");
const app = express();
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const placeRoutes = require("./routes/placeRoutes");
const scheduleRoutes = require("./routes/scheduleRoutes");
const tripRoutes = require("./routes/tripRoutes");

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => {
  res.send("Welcome to the Travel Planner API!");
});

app.use("/api/auth", authRoutes);
app.use("/api/places", placeRoutes);
app.use("/api/schedules", scheduleRoutes);
app.use("/api/trips", tripRoutes);

app.listen(process.env.SERVER_PORT, () => {
  console.log(`server running on port ${process.env.SERVER_PORT}`);
});
