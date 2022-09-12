const {Router} = require('express')
const bcrypt = require('bcryptjs')
const nodemailer = require('nodemailer')
const crypto = require('crypto')
const sendgrid = require('nodemailer-sendgrid-transport')
const User = require("../modules/user");
const router = Router()
const {validationResult} = require('express-validator');
const {registerValidators} = require('../utils/validators');
require('dotenv').config()
const reqEmail = require('../emails/registartion')
const resetPassword = require('../emails/reset')


const transporter = nodemailer.createTransport(sendgrid({
	auth: {api_key: process.env.SEND_GRID_KEY}
}))

router.get('/login', async (req, res) => {
	res.render('auth/login', {
		title: 'Authorization',
		isLogin: true,
		registerError: req.flash('registerError'),
		loginError: req.flash('loginError')
	})
})

router.get('/logout', async (req, res) => {
	req.session.destroy(() => {
		res.redirect('/auth/login#login')
	})
})

router.post('/login', async (req, res) => {
	try {
		const {email, password} = req.body
		const candidate = await User.findOne({email})
		if (candidate) {
			const areSame = await bcrypt.compare(password, candidate.password)
			if (areSame) {
				const user = candidate
				req.session.user = user
				req.session.isAuthenticated = true
				req.session.save(err => {
					if (err) {
						throw err
					}
					res.redirect('/')
				})
			} else {
				req.flash('loginError', "Wrong password")
				res.redirect('/auth/login')
			}

		} else {
			req.flash('loginError', "The user not exist")
			res.redirect('/auth/login')
		}

	} catch (e) {
		console.log(e)
	}
})

router.post('/register', registerValidators, async (req, res) => {
	try {
		const {email, password, confirm, name} = req.body
		const candidate = await User.findOne({email})

		const errors = validationResult(req)

		if (!errors.isEmpty()) {
			req.flash('registerError', errors.array()[0].msg)
			return res.status(422).redirect('/auth/login#register')
		}

		if (candidate) {
			req.flash('registerError', "User with same email exist")
			res.redirect('/auth/login#register')
		} else {
			const hashPassword = await bcrypt.hash(password, 10)
			const user = new User({
				email, name, password: hashPassword, cart: {items: []}
			})
			await user.save()
			res.redirect('/auth/login#login')
			// await transporter.sendMail(reqEmail(email))
		}


	} catch (e) {
		console.log(e)
	}
})


router.get('/reset', (req, res) => {
	try {
		res.render('auth/reset', {
			title: 'Reset password',
			error: req.flash('error')
		})
	} catch (e) {
		console.log(e)
	}
})


router.post('/reset', (req, res) => {
	try {
		crypto.randomBytes(32, async (err, buffer) => {
			if (err) {
				req.flash('error', "Something wrong")
				return res.redirect('/auth/reset')
			}
			const token = buffer.toString('hex')
			const {email} = req.body
			const candidate = await User.findOne({email})

			if (candidate) {
				candidate.resetToken = token
				candidate.resetTokenExp = Date.now() + 60 + 60 * 1000
				await candidate.save()
				// await transporter.sendMail(resetPassword(candidate.email, token))
				return res.redirect('/auth/login')
			} else {
				req.flash('error', "Such email does not exist")
				return res.redirect('/auth/reset')
			}
		})

	} catch (e) {
		console.log(e)
	}
})

router.get('/password/:token', async (req, res) => {
	const {token} = req.params

	if (token) {
		return res.redirect('/auth/login')
	}
	try {
		const user = await User.findOne({
			resetToken: token,
			resetTokenExp: {
				$gt: Date.now()
			}
		})
		if (!user) {
			return res.redirect('/auth/login')
		} else {
			res.render('auth/password', {
				title: 'Restore  password',
				userId: user._id.toString(),
				error: req.flash('error'),
				token: token
			})
		}
	} catch (e) {
		console.log(e)
	}
})

router.post('/password', async (req, res) => {
	try {
		const user = await User.findOne({
			_id: req.body.userId,
			resetToken: req.body.token,
			resetTokenExp: {
				$gt: Date.now()
			}
		})

		if (user) {
			user.password = await bcrypt.hash(req.body.password, 10)
			user.resetToken = undefined
			user.resetTokenExp = undefined
			await user.save()
			res.redirect('/auth/login')
		} else {
			req.flash('loginError', "Token expired")
			res.redirect('/auth/login')
		}
	} catch (e) {
		console.log(e)
	}
})

module.exports = router
