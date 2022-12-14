const {Router} = require('express')
const Course = require('../modules/course')
const auth = require('../middleware/auth')
const router = Router()

const mapCartItems = (cart) => {
	return cart.items.map((val) => ({
		...val.courseId._doc,
		id: val.courseId.id,
		count: val.count
	}))
}

const computerPrice = (courses) => {
	return courses.reduce((total, course) => {
		return total += course.price * course.count
	}, 0)
}

router.post('/add', auth, async (req, res) => {
	const course = await Course.findById(req.body.id)
	await req.user.addToCart(course)
	res.redirect('/cart')
})

router.delete('/remove/:id', auth, async (req, res) => {
	await req.user.removeFromCart(req.params.id)
	const user = await req.user
			.populate('cart.items.courseId')
	const courses = mapCartItems(user.cart)
	const cart = {
		courses,
		price: computerPrice(courses)
	}
	res.status(200).json(cart)
})

router.get('/', auth, async (req, res) => {
	const user = await req.user
			.populate('cart.items.courseId')

	const courses = mapCartItems(user.cart)
	res.render('cart', {
		title: 'Cart',
		isCart: true,
		courses: courses,
		price: computerPrice(courses)
	})
})


module.exports = router