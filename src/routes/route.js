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

module.exports = router
