const express = require('express')
const router = express.Router()
const price_controller = require('../controllers/price_controller')

router.route('/').get(price_controller.getPrices, (req, res) => {
	res.render('menus/menu-hebrew', { pr: req.params.prices })
})
router.route('/english').get(price_controller.getPrices, (req, res) => {
	res.render('menus/menu-english', { pr: req.params.prices })
})
router.route('/russian').get(price_controller.getPrices, (req, res) => {
	res.render('menus/menu-russian', { pr: req.params.prices })
})
router.route('/homepage').get((req, res) => {
	res.render('homepage')
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
	.route('/edit_products')
	.get(price_controller.allowIfLoggedin, price_controller.grantAccess('readAny', 'price_settings'), price_controller.getPrices, (req, res) => {
		res.render('edit_products', {
			pr: req.params.prices,
		})
	})
	.post(async (req, res) => {
		if (Object.keys(req.body)[0] === 'edit_ID') {
			res.redirect(`edit_products/${req.body.edit_ID}`)
		} else if (Object.keys(req.body)[0] === 'delete_ID') {
			await price_controller.deleteProduct(req, res)
			res.redirect(req.get('referer'))
		}
	})
router
	.route('/add_product')
	.get(price_controller.allowIfLoggedin, price_controller.grantAccess('readAny', 'price_settings'), (req, res) => {
		res.render('add_product')
	})
	.post(async (req, res) => {
		await price_controller.addProduct(req, res)
		res.redirect(req.get('referer'))
	})
router
	.route('/admin')
	.get(price_controller.allowIfLoggedin, price_controller.grantAccess('readAny', 'price_settings'), price_controller.getPrices, (req, res) => {
		res.render('admin_interface', {
			user: req.user.username,
		})
	})
	.post((req, res) => {})
router
	.route('/edit_products/:id')
	.get(price_controller.allowIfLoggedin, price_controller.getPrice, (req, res) => {
		res.render('edit_product', {
			pr: req.params.edit_ID,
		})
	})
	.post(price_controller.updatePrice, (req, res) => {
		res.redirect(req.get('referer'))
	})
//logout
router.route('/logout').get((req, res) => {
	res.clearCookie('x-access-token')
	res.redirect('/')
})

module.exports = router
