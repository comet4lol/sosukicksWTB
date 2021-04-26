const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SneakerSchema = new Schema({
	model: {
		type: String,
		required: true
	},
	sizesNeeded: [
		{
			type: [ Number ],
			enum: [
				35,
				35.5,
				36,
				36.5,
				36.5,
				37,
				37.3,
				37.5,
				38,
				39,
				40,
				40.5,
				41,
				42,
				42.3,
				42.5,
				43,
				44,
				44.5,
				45,
				46,
				47,
				48,
				49
			]
		}
	],
	sku: {
		type: String
	},
	image: {
		type: String,
		required: true
	}
});

module.exports = mongoose.model('Sneaker', SneakerSchema);
