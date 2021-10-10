const mongoose = require('mongoose')
const Schema = mongoose.Schema

const HomepageSchema = new Schema({
	he_description: {
		type: [String],
		require: true,
	},
	ru_description: {
		type: [String],
		require: true,
	},
	en_description: {
		type: [String],
		require: true,
	},
	tel: {
		type: String,
	},
	tel_show: {
		type: String,
	},
	contact_details: {
		type: [String],
	},
})

const Homepage = mongoose.model('homepage', HomepageSchema)

// var home = [
// 	{
// 		he_description: ['מלפפון,עגבניה,חסה,בצל וגבינה בולגרית מעל'],
// 		ru_description: ['огурец, помидор, листья салата, лук и болгарский сыр'],
// 		en_description: ['Cucumber, tomato, lettuce, onion and fetta cheese on top'],
// 	},
// ]

// // save multiple documents to the collection referenced by Book Model
// Homepage.collection.insertMany(home, function (err, docs) {
// 	if (err) {
// 		return console.error(err)
// 	} else {
// 		console.log('Multiple documents inserted to Collection')
// 	}
// })

module.exports = Homepage
