const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const routes = require('./routes/route')
const app = express()
const methodOverride = require('method-override')
const cookieParser = require('cookie-parser')
const User = require('./models/admin_user')
const jwt = require('jsonwebtoken')

// Trust proxy headers (Traefik, Cloudflare, etc.)
app.set('trust proxy', true)

app.use(cookieParser())
app.locals.userLoggedIn = 0
app.locals.userID = ''
app.locals.userRole = ''

//.env
require('dotenv').config({
	path: path.join(__dirname, './.env'),
})

// Set Mongoose strictQuery option to suppress deprecation warning
mongoose.set('strictQuery', false)

// Configure Express middleware BEFORE connecting to database
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(async (req, res, next) => {
	if (req.cookies['x-access-token']) {
		try {
			const accessToken = req.cookies['x-access-token']
			const { userId, exp } = await jwt.verify(accessToken, process.env.JWT_SECRET)
			// If token has expired
			if (exp < Date.now().valueOf() / 1000) {
				return res.status(401).json({
					error: 'JWT token has expired, please login to obtain a new one',
				})
			}
			res.locals.loggedInUser = await User.findById(userId)
			if (res.locals.loggedInUser) {
				res.locals.userLoggedIn = 1
				res.locals.userRole = res.locals.loggedInUser.role
				res.locals.userID = userId
			}
			next()
		} catch (error) {
			next(error)
		}
	} else {
		res.locals.userLoggedIn = 0
		next()
	}
})
//Setting up Handlebars
app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.use('/src', express.static(__dirname + '/src'))
app.use('/views', express.static(__dirname + '/views'))
app.use('/assets', express.static(__dirname + '/assets'))
app.use('/fonts', express.static(__dirname + '/assets/fonts'))
app.use('/js', express.static(__dirname + '/assets/js'))
app.use('/img', express.static(__dirname + '/assets/img'))
app.use('/css', express.static(__dirname + '/assets/css'))
app.use('/scripts', express.static(path.join(__dirname, '..', 'node_modules/accessibility/')))

app.use('/', routes)

//connect to mongodb and start server
mongoose
	.connect(process.env.dbURI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		maxPoolSize: process.env.DB_MAX_POOL_SIZE || 10,
		serverSelectionTimeoutMS: process.env.DB_SERVER_SELECTION_TIMEOUT_MS || 5000,
		socketTimeoutMS: process.env.DB_SOCKET_TIMEOUT_MS || 45000,
	})
	.then(() => {
		console.log('✅ MongoDB connected successfully')
		// Start server only after DB connection
		const PORT = process.env.PORT || 3000
		app.listen(PORT, '0.0.0.0', () => {
			console.log(`🚀 Server running on port ${PORT}`)
			console.log(`📱 Environment: ${process.env.NODE_ENV || 'development'}`)
			console.log(`🔒 SSL/TLS handled by reverse proxy`)
			console.log(`🌐 Ready for: Traefik, Cloudflare, or direct access`)
		})
	})
	.catch((err) => {
		console.error('❌ MongoDB connection error:', err)
		process.exit(1)
	})
