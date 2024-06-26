const { User } = require("../models");
const bcrypt = require("bcrypt");
const passport = require("../utils/passportStrategy.js");
const { Session } = require("express-session");

const saltRounds = 10;

async function getUsers(req, res) {
    const user = await User.findAll();

    if (user.length < 1) {
        return res.status(400).send("no users found!");
    }

    res.status(200).json(user);
}

async function registration(req, res) {
    bcrypt.hash(req.body.password, saltRounds, async function (err, hash) {
        await User.create({
            username: req.body.username,
            email: req.body.email,
            password: hash,
        });

        if (err) {
            throw Error;
        }

        res.cookie(process.env.COOKIE_NAME, User.username, {
            httpOnly: process.env.COOKIE_HTTP_ONLY,
            secure: process.env.COOKIE_SECURE,
            sameSite: process.env.COOKIE_SAME_SITE,
            maxAge: process.env.COOKIE_MAX_AGE,
        }).send({ message: "user successfully created!" });
    });
}

async function login(req, res, next) {
    passport.authenticate("local", { session: true }, async (err, user) => {
        if (err) {
            res.send({ message: "Wrong password!" });
            return next(err);
        }
        req.logIn(user, () => {
            return res
                .cookie(process.env.COOKIE_NAME, User.username, {
                    httpOnly: process.env.COOKIE_HTTP_ONLY,
                    secure: process.env.COOKIE_SECURE,
                    sameSite: process.env.COOKIE_SAME_SITE,
                    maxAge: process.env.COOKIE_MAX_AGE,
                })
                .send({ message: "successfuly loged in!" });
        });
    })(req, res);
}

async function deleteUser(req, res) {
    try {
        await User.destroy({
            where: {
                id: req.user.id,
            },
        });
    } catch (error) {
        throw new Error({ message: "Error accured!" });
    }

    res.clearCookie(process.env.COOKIE_NAME).json({
        message: "User has been successfully deleted!",
    });
}

module.exports = {
    registration,
    getUsers,
    deleteUser,
    login,
};
