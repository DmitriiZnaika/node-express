const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const exphbs = require('express-handlebars');
const homeRoutes = require('./routes/home')
const addRoutes = require('./routes/add')
const coursesRoutes = require('./routes/courses')
const cartRoutes = require('./routes/cart')
const User = require('./modules/user')
const {raw} = require("express");
const app = express()

const hbs = exphbs.create({
	defaultLayout: 'main',
	extname: 'hbs'
})

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')


app.use(async (req, res, next) => {
	try {
		const user = await User.findById('6313912995974cfe18779147')
		req.user = user
		next()
	} catch (e) {
		console.log(e)
	}
})


app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({extended: true}))
app.use(express.json());
app.use('/', homeRoutes)
app.use('/add', addRoutes)
app.use('/courses', coursesRoutes)
app.use('/cart', cartRoutes)


const PORT = process.env.PORT || 3001


async function start() {
	try {
		const url = `mongodb+srv://DmitriiSaricev:m3SjDCjq96Ghli5W@cluster0.nyvxj9u.mongodb.net/course-shop`
		await mongoose.connect(url, {useNewUrlParser: true})

		const candidate = await User.findOne()
		if (!candidate) {
			const user = new User({
				email: "dmitriisaricev@gmail.com",
				name: "Dmitrii",
				cart: {item: []}
			})
			await user.save()
		}
		app.listen(PORT, () => {
			console.log(`Server is running ${PORT}`)
		})
	} catch (e) {
		console.log('Error', e)
	}
}

start()
