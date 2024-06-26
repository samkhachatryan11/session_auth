const express = require("express");
const {
    registration,
    getUsers,
    login,
    deleteUser,
} = require("../controllers/AuthController.js");
const {
    registrationRequest,
    loginRequest,
} = require("../requests/authRequest.js");
const isAuthenticated = require("../middleware/isAuthenticated.js");

const router = express.Router();

router.post('/registration', registrationRequest, registration);
router.post('/login', loginRequest, login);
router.get('/getusers', isAuthenticated, getUsers);
router.delete('/deleteuser', isAuthenticated, deleteUser);

module.exports = router;
