const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const routes = require('./routes/route')
const app = express()
const methodOverride = require('method-override')

//.env
require('dotenv').config({
	path: path.join(__dirname, './.env'),
})
const appPort = process.env.PORT


//connect to mongodb
mongoose
	.connect(process.env.dbURI, 
		{
		useNewUrlParser: true,
		useUnifiedTopology: true
	})
	.then((result) => app.listen(3000), console.log('mongoDB connected.'))
	.catch((err) => console.log(err))


app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
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

app.use('/', routes)

//Creating a connection
app.listen(appPort, () => {
	console.log(`App is running. serve at port: ${appPort}`)
	console.log(`http://127.0.0.1:${appPort}`)
})