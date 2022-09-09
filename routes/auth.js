const {Router} = require('express')
const User = require("../modules/user");
const router = Router()

router.get('/login', async (req, res) => {
	res.render('auth/login', {title: 'Authorization', isLogin: true})
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
			const areSame = password === candidate.password

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
				res.redirect('/auth/login')
			}

		} else {
			res.redirect('/auth/login')
		}

	} catch (e) {
		console.log(e)
	}
	const user = await User.findById('6313912995974cfe18779147')
	req.session.user = user
	req.session.isAuthenticated = true
	req.session.save(err => {
		if (err) {
			throw err
		}
		res.redirect('/')
	})
})

router.post('/register', async (req, res) => {
	try {
		const {email, password, repeat, name} = req.body
		const candidate = await User.findOne({email})
		if (candidate) {
			res.redirect('/auth/login#register')
		} else {
			const user = new User({
				email, name, password, cart: {items: []}
			})
			await user.save()
			res.redirect('/auth/login')
		}


	} catch (e) {
		console.log(e)
	}
})

module.exports = router
