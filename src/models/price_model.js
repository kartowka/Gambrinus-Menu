const mongoose = require('mongoose')
const Schema = mongoose.Schema

const PriceSchema = new Schema({
	product: {
		type: String,
		require: true,
	},
	price: {
		type: String,
		require: true,
	},
})

PriceSchema.index({ product: 'text' })

const Price = mongoose.model('price', PriceSchema)

// var price = [
// 	{ product: 'salad_gambrinus', price: '50' },
// 	{ product: 'chips_gambrinus', price: '25/30' },
// 	{ product: 'mukram', price: '50' },
// 	{ product: 'pitriyot', price: '50' },
// 	{ product: 'toast', price: '35' },
// 	{ product: 'mix', price: '130' },
// 	{ product: 'mevushal', price: '50' },
// 	{ product: 'mahvat', price: '75' },
// 	{ product: 'shipudim', price: '75' },
// 	{ product: 'metugan', price: '75' },
// 	{ product: 'kalamari', price: '75' },
// 	{ product: 'krab', price: '120' },
// 	{ product: 'raki', price: '150' },
// 	{ product: 'denis', price: '95' },
// 	{ product: 'bananot', price: '95' },
// 	{ product: 'forel', price: '95' },
// 	{ product: 'netah', price: '150' },
// 	{ product: 'entrecote_boded', price: '100' },
// 	{ product: 'entrecote_kaful', price: '170' },
// 	{ product: 'spareribs', price: '120' },
// 	{ product: 'lavan', price: '100' },
// 	{ product: 'file_boded', price: '100' },
// 	{ product: 'file_kaful', price: '150' },
// 	{ product: 'keves', price: '100' },
// 	{ product: 'naknikiyot', price: '70' },
// 	{ product: 'kala', price: '15' },
// 	{ product: 'hama', price: '12' },
// 	{ product: 'irish_coffee', price: '20' },
// 	{ product: 'nutella', price: '35' },
// 	{ product: 'glida', price: '15' },
// 	{ product: 'beer_0.3', price: '28' },
// 	{ product: 'beer_0.5', price: '30' },
// 	{ product: 'jameson', price: '12' },
// 	{ product: 'takila_based', price: '45' },
// 	{ product: 'rum_based', price: '45' },
// 	{ product: 'shament_based', price: '45' },
// 	{ product: 'whiskey_based', price: '55' },
// 	{ product: 'gin_based', price: '45' },
// 	{ product: 'vodka_based', price: '45' },
//  { product: 'seabass', price: '125' },
//  { product: 'beer_0', price: '20' }
// ]

// // save multiple documents to the collection referenced by Book Model
// Price.collection.insertMany(price, function (err, docs) {
// 	if (err) {
// 		return console.error(err)
// 	} else {
// 		console.log('Multiple documents inserted to Collection')
// 	}
// })

module.exports = Price
