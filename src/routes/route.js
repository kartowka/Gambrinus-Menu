const express = require('express')
const price = require('../views/prices.json')
const router = express.Router()
const price_controller = require('../controllers/price_controller')

router.route('/').get(price_controller.getPrices, (req, res) => {
	res.render('menu-hebrew', { pr: req.params.prices })
})
router.route('/english').get(price_controller.getPrices, (req, res) => {
	res.render('menu-english', { pr: req.params.prices })
})
router.route('/russian').get(price_controller.getPrices, (req, res) => {
	res.render('menu-russian', { pr: req.params.prices })
})
router
	.route('/login')
	.get(price_controller.denyIfLoggedin, (req, res) => {
		res.render('login')
	})
	.post(price_controller.login, (req, res) => {
		res.redirect(req.get('referer'))
	})

router
	.route('/admin')
	.get(
		price_controller.allowIfLoggedin,
		price_controller.grantAccess('readAny', 'price_settings'),
		price_controller.getPrices,
		(req, res) => {
			res.render('admin', { pr: req.params.prices })
		}
	)
	.post(price_controller.updatePrice)

module.exports = router
