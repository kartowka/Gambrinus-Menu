const express = require('express')
// Configure & Run the http server
const fs = require('fs')
const http = require('http')
const https = require('https')
const mongoose = require('mongoose')
const path = require('path')
const routes = require('./routes/route')
const app = express()
const methodOverride = require('method-override')
const cookieParser = require('cookie-parser')
const User = require('./models/admin_user')
const jwt = require('jsonwebtoken')

//! SSL //
const forceSsl = require('express-force-ssl')
// Certificate
const privateKey = fs.readFileSync('/etc/letsencrypt/live/www.gambrinus.co.il/privkey.pem', 'utf8')
const certificate = fs.readFileSync('/etc/letsencrypt/live/www.gambrinus.co.il/cert.pem', 'utf8')
const ca = fs.readFileSync('/etc/letsencrypt/live/www.gambrinus.co.il/chain.pem', 'utf8')

const credentials = {
	key: privateKey,
	cert: certificate,
	ca: ca,
}
app.use(forceSsl)
https.createServer(credentials, app).listen(443, () => {
	console.log(`App is running. serve at port: ${appPort}`)
	console.log(`https://127.0.0.1:${appPort}`)
})

//! END SSL //

app.use(cookieParser())
app.locals.userLoggedIn = 0
app.locals.userID = ''
app.locals.userRole = ''
//.env
require('dotenv').config({
	path: path.join(__dirname, './.env'),
})
const appPort = process.env.PORT

//connect to mongodb
mongoose
	.connect(process.env.dbURI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then((result) => app.listen(3000), console.log('mongoDB connected.'))
	.catch((err) => console.log(err))

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

// Creating a connection
// app.listen(appPort, () => {
// 	console.log(`App is running. serve at port: ${appPort}`)
// 	console.log(`http://127.0.0.1:${appPort}`)
// })

http.createServer(app).listen(80)

// const httpServer = http.createServer(app)
// const httpsServer = https.createServer(credentials, app)

// httpServer.listen(80, () => {
// 	console.log('HTTP Server running on port 80')
// })

// httpsServer.listen(443, () => {
// 	console.log('HTTPS Server running on port 443')
// })

// Dependencies
// const express = require('express')

// // Configure & Run the http server
// const app = express()

// app.use(express.static(__dirname, { dotfiles: 'allow' }))

// app.listen(80, () => {
// 	console.log('HTTP server running on port 80')
// })
