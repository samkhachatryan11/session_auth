require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const router = require("./routes/index.js");
const session = require("express-session");
const passport = require("./utils/passportStrategy.js");

const app = express();

app.use(bodyParser.json());
app.use(cookieParser());
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
    })
);
app.use(passport.initialize());
app.use(passport.session());

const port = process.env.PORT;

app.use("/api", router);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
