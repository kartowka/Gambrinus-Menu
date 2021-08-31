const express = require('express')
const price = require('../views/prices.json')
const router = express.Router()

router.route('/').get((req, res) => {
	res.render('menu-hebrew', { price })
})
router.route('/english').get((req, res) => {
	res.render('menu-english', { price })
})
router.route('/russian').get((req, res) => {
	res.render('menu-russian', { price })
})

module.exports = router