const Price = require('../models/price_model')

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
