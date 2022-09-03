const {Router} = require('express')
const Course = require('../modules/course')
const router = Router()

router.post('/add', async (req, res) => {
	console.log('course', req.user)

	const course = await Course.findById(req.body.id)
	await req.user.addToCart(course)
	res.redirect('/cart')
})
//
// router.delete('/remove/:id', async (req, res) => {
// 	const cart = await Cart.deleteOne(req.params.id)
// 	res.status(200).json(cart)
// })
//
// router.get('/', async (rq, res) => {
// 	const cart = await Cart.find().lean()
// 	res.render('cart', {
// 		title: 'Cart',
// 		isCart: true,
// 		courses: cart.courses,
// 		price: cart.price
// 	})
// })


module.exports = router