import * as express from "express";
import * as validator from "validator";
import * as got from "got";
import * as sgMail from "@sendgrid/mail";

const jwt = require("jsonwebtoken");

const userDao = require("../models").User;

sgMail.setApiKey(process.env.SENDGRID_API_KEY);
sgMail.setSubstitutionWrappers("{{", "}}");

let router = express.Router();

router.get("/login", function (req, res) {
	res.render("login", {});
});

router.post("/login", async function (req, res) {
	try {
		let user = await userDao.findOne({where: {email: req.body.emailAddress}});
		if (!user) {
			res.render("login", {error: "Authentication failed. User not found."});
		} else {
			if (!user.validPassword(req.body.password)) {
				res.render("login", {error: "Authentication failed. Wrong password."});
			} else {
				res.cookie("token", jwt.sign({id: user.id, username: user.username, role: user.role}, process.env.JWT_SECRET), {});
				res.redirect('/dashboard');
			}
		}
	} catch (error) {
		console.error(error.message);
		res.render("login", {error: error.message});
	}
});

router.get("/register", function (req, res) {
	res.render("register", {siteKey: process.env.G_CAPTCHA_SITEKEY});
});

router.post("/register", async function (req, res) {
	const username = req.body.username;
	const password = req.body.password;
	const passwordVerification = req.body.passwordVerification;
	const emailAddress = req.body.emailAddress;
	const emailAddressVerification = req.body.emailAddressVerification;
	const gCaptchaResponse = req.body["g-recaptcha-response"];

	const response = await got.post("https://www.google.com/recaptcha/api/siteverify", {
		body: {
			secret: process.env.G_CAPTCHA_SECRET,
			response: gCaptchaResponse
		},
		form: true
	});
	if (!JSON.parse(response.body).success) {
		res.render("register", {error: "Captcha error.", siteKey: process.env.G_CAPTCHA_SITEKEY});
		return;
	}

	// 1: Check if username isn't already taken.
	const potentiallyExistingUsername = await userDao.findOne({where: {username: username}});
	if (potentiallyExistingUsername) {
		res.render("register", {error: "Username \"" + username + "\" is already used.", siteKey: process.env.G_CAPTCHA_SITEKEY});
		return;
	}

	// 2: Check if password and password verification are identical
	if (password !== passwordVerification) {
		res.render("register", {error: "Password and password verification fields are not identical", siteKey: process.env.G_CAPTCHA_SITEKEY});
		return;
	}

	// 3: Check the email format
	if (!validator.isEmail(emailAddress)) {
		res.render("register", {error: "Email \"" + emailAddress + "\" is invalid.", siteKey: process.env.G_CAPTCHA_SITEKEY});
		return;
	}

	// 4: Check if email and email verification are identical
	if (emailAddress !== emailAddressVerification) {
		res.render("register", {error: "Email and email verification fields are not identical", siteKey: process.env.G_CAPTCHA_SITEKEY});
		return;
	}

	// 5: Check if email isn't already taken.
	const potentiallyExistingEmail = await userDao.findOne({where: {email: emailAddress}});
	if (potentiallyExistingEmail) {
		res.render("register", {error: "Email \"" + emailAddress + "\" is already used.", siteKey: process.env.G_CAPTCHA_SITEKEY});
		return;
	}

	try {
		let newUser = await userDao.create({
			username: username,
			password: "",
			email: emailAddress,
			role: "USER"
		});
		newUser.update({
			password: newUser.generateHash(password)
		});

		const msg = {
			to: emailAddress,
			from: "welcome@mvtr.tk",
			subject: "Welcome to Movie Tracker!",
			text: "Welcome to Movie Tracker!",
			html: '<p>Welcome to Movie Tracker!</p>',
			templateId: "bb9f8c38-19af-4c3a-8224-3d940407f956",
			substitutions: {
				username: username
			},
		};
		await sgMail.send(msg);

		res.cookie("token", jwt.sign({id: newUser.id, username: newUser.username, role: newUser.role}, process.env.JWT_SECRET), {});
		res.redirect('/dashboard');

	} catch (error) {
		res.render("register", {error: error.message, siteKey: process.env.G_CAPTCHA_SITEKEY});
	}
});

router.get("/logout", function (req, res) {
	res.clearCookie("token");
	res.redirect("/");
});


export = router;