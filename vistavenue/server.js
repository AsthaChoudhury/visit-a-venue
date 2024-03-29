const express = require("express");
const app = express();
const sbConfig = require("./db");
const roomsRoute = require("./routes/roomsroute");
const userRoute = require("./routes/userroute");
const bookingroute = require("./routes/bookingRoute");
app.use(express.json());
app.use("/api/rooms", roomsRoute);
app.use("/api/user", userRoute);
app.use("api/bookings", bookingroute);
const port = process.env.PORT || 5000;
app.listen(port, () => console.log("server hgdhcstarted"));
