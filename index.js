const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const csrf = require('csurf')
const session = require('express-session')
const flash = require('connect-flash')
const MongoDBStore = require('connect-mongodb-session')(session)
const exphbs = require('express-handlebars')
const homeRoutes = require('./routes/home')
const addRoutes = require('./routes/add')
const coursesRoutes = require('./routes/courses')
const cartRoutes = require('./routes/cart')
const ordersRoutes = require('./routes/orders')
const authRoutes = require('./routes/auth')
const varMiddleware = require('./middleware/variables')
const userMiddleware = require('./middleware/user')
const app = express()

const MONGODB_URI = 'mongodb+srv://DmitriiSaricev:m3SjDCjq96Ghli5W@cluster0.nyvxj9u.mongodb.net/course-shop'
const hbs = exphbs.create({
	defaultLayout: 'main',
	extname: 'hbs'
})

const store = new MongoDBStore({
	collections: 'sessions',
	uri: MONGODB_URI
})

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({extended: true}))
app.use(session({
	secret: 'secret',
	resave: false,
	saveUninitialized: false,
	store: store
}))
app.use(csrf());
app.use(flash());
app.use(varMiddleware);
app.use(userMiddleware);
app.use(express.json());
app.use('/', homeRoutes)
app.use('/add', addRoutes)
app.use('/courses', coursesRoutes)
app.use('/cart', cartRoutes)
app.use('/orders', ordersRoutes)
app.use('/auth', authRoutes)


const PORT = process.env.PORT || 3001


async function start() {
	try {
		await mongoose.connect(MONGODB_URI, {useNewUrlParser: true})
		app.listen(PORT, () => {
			console.log(`Server is running ${PORT}`)
		})
	} catch (e) {
		console.log('Error', e)
	}
}

start()
