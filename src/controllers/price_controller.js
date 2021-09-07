const Price = require('../models/price_model')
const { roles } = require('../roles/roles')
const User = require('../models/admin_user')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

exports.grantAccess = function (action, resource) {
	return async (req, res, next) => {
		try {
			var granted = true
			const user = await User.findById(req.params.id)
			var permission = roles.can(req.user.role)[action](resource)
			if (!permission.granted || !granted) {
				throw new Error('You are not allowed to perform this action.')
			}
			next()
		} catch (error) {
			res.status(401).send('You are not allowed to perform this action.')
		}
	}
}
exports.allowIfLoggedin = async (req, res, next) => {
	try {
		const user = res.locals.loggedInUser
		if (!user) {
			throw new Error('You need to be logged in to access this route')
		}
		req.user = user
		next()
	} catch (error) {
		res.redirect('login')
	}
}

exports.hashPassword = async (password) => {
	return await bcrypt.hash(password, 10)
}

async function validatePassword(plainPassword, hashedPassword) {
	return await bcrypt.compare(plainPassword, hashedPassword)
}
exports.login = async (req, res, next) => {
	try {
		const { username, password } = req.body
		const user = await User.findOne({ username: username })
		if (!user) {
			throw 'username doesn`t exists!'
		}
		const validPassword = await validatePassword(password, user.password)
		if (!validPassword) {
			throw 'Password isn`t correct.'
		}
		const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
			expiresIn: '1d',
		})
		let options = {
			path: '/',
			sameSite: true,
			maxAge: 1000 * 60 * 60 * 24, // would expire after 24 hours
			httpOnly: true, // The cookie only accessible by the web server
		}
		res.cookie('x-access-token', accessToken, options)
		await User.findByIdAndUpdate(user._id, { accessToken })
		res.redirect('admin')
	} catch (error) {
		req.error = error
		next()
	}
}

exports.getPrices = async (req, res, next) => {
	const prices = await Price.find({})
	req.params.prices = prices
	next()
}
exports.addProduct = async (req, res, next) => {
	const { product, price } = req.body
	const newProduct = new Price({
		product,
		price,
	})
	Price.save()
}
exports.updatePrice = async (req, res, next) => {
	let productID = req.body.product_id
	let price = req.body.new_price
	let split_productID_index = productID.split(',')
	let index = split_productID_index[1]
	productID = split_productID_index[0]
	let product = await Price.findByIdAndUpdate(productID, {
		price: price[index],
	})
	res.redirect(req.get('referer'))
}
exports.denyIfLoggedin = async (req, res, next) => {
	try {
		const user = res.locals.loggedInUser
		if (user) {
			throw new Error('You already loggedin.')
		} else {
			next()
		}
	} catch (error) {
		res.status(401).send('you already loggedin.')
	}
}
