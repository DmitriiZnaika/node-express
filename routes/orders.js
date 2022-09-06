const {Router} = require('express')
const Order = require("../modules/order");
const router = Router()


router.get('/', async (req, res) => {
	try {
		const orders = await Order.find({
			'user.userId': req.user.id
		}).populate('user.userId').lean()

		res.render('orders', {
			title: 'Orders',
			isOrder: true,
			orders: orders.map((val) => {
				return {
					...val,
					price: val.courses.reduce((total, course) => {
						return total += course.course.price * course.count
					}, 0)
				}
			})
		})
	} catch (e) {
		console.log(e)
	}
})

router.post('/:id', async (req, res) => {
	try {
		await Order.deleteOne({id: req.params.id})
		await req.res.redirect('/orders')
	} catch (e) {
		console.log(e)
	}
})

router.post('/', async (req, res) => {
	try {
		const user = await req.user
				.populate('cart.items.courseId')
		const courses = user.cart.items.map((val) => ({
			count: val.count,
			course: {...val.courseId._doc}
		}))

		const order = new Order({
			user: {
				name: req.user.name,
				userId: req.user
			},
			courses: courses
		})

		await order.save()
		await req.user.clearCart()

		await req.res.redirect('/orders')
	} catch (e) {
	}
})

module.exports = router