const {Router} = require('express')
const bcrypt = require('bcryptjs')
const nodemailer = require('nodemailer')
const sendgrid = require('nodemailer-sendgrid-transport')
const User = require("../modules/user");
const router = Router()
const keys = require('../keys')
const reqEmail = require('../emails/registartion')


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

router.post('/register', async (req, res) => {
	try {
		const {email, password, repeat, name} = req.body
		const candidate = await User.findOne({email})
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
			await transporter.sendMail(reqEmail(email))
		}


	} catch (e) {
		console.log(e)
	}
})


router.get('/reset', async (req, res) => {
	try {
		res.render('auth/reset', {
			title: 'Reset password',
			// isLogin: false,
			error: req.flash('error')
		})
	} catch (e) {
		console.log(e)
	}
})


router.post('/reset', async (req, res) => {
	try {

	} catch (e) {
		console.log(e)
	}
})

module.exports = router
