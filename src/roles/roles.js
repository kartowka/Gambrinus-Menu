const AccessControl = require('accesscontrol')
const ac = new AccessControl()

exports.roles = (function () {
	ac.grant('admin')
		.readAny('price_settings')
		.updateAny('price_settings')
		.deleteAny('price_settings')

	return ac
})()
