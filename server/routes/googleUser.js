const express = require('express');
const router = express();
const passport = require('passport'); 
const jwt = require("jsonwebtoken");
require("../passport");

router.post('/set-account-type', (req, res) => {
    console.log("Request Body:", req.body); // Check the incoming request body
    const { accountType } = req.body;

    // Proceed only if accountType is present
    if (!accountType) {
        return res.status(400).json({ message: "Account type is required." });
    }

    // Initialize session if it's not already
    if (!req.session) {
        console.error("Session is not initialized.");
        return res.status(500).json({ message: "Session is not initialized." });
    }

    req.session.accountType = accountType;
    console.log("Session accountType set:", req.session.accountType); 
    console.log("Session accountType set:", req.session); 
    res.status(200).json({ message: "Account type set successfully" });
});


// Auth 
router.get('/auth/google' , passport.authenticate('google', { scope: 
	[ 'email', 'profile' ] 
}))

// Auth Callback 
router.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: 'http://localhost:3000/login' }),
    (req, res) => {
        if (req.user) {
            const token = jwt.sign({ id: req.user.id, email: req.user.email }, process.env.JWT_SECRET, { expiresIn: '24h' });
			console.log(token);
            res.cookie('token', token, { httpOnly: false, secure: true, sameSite: 'Strict' });
            res.redirect('http://localhost:3000/dashboard');
        } else {
            res.redirect('http://localhost:3000/login');
        }
    }
);


module.exports = router;
