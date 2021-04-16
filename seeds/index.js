const mongoose = require('mongoose');
const { brands, sizes } = require('./data');
const Sneaker = require('../models/sneaker');
const StockXAPI = require('stockx-api');
const stockX = new StockXAPI();

mongoose.connect('mongodb://localhost:27017/sosukicks', {
	useNewUrlParser: true,
	useCreateIndex: true,
	useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error!'));
db.once('open', () => {
	console.log('Successfully conected to local database!');
});

let getRandomSize = () => {
	return sizes[Math.floor(Math.random() * (sizes.length - 1))];
};
const seedDB = async () => {
	await Sneaker.deleteMany({});
	for (let i = 0; i < 10; i++) {
		const randomBrandNumber = Math.floor(Math.random() * 4);
		const randomSizesNeeded = [];
		for (let j = 0; j < 3; j++) {
			randomSizesNeeded.push(getRandomSize());
		}
		const randomBrand = brands[randomBrandNumber].brand;
		const randomProducts = await stockX.searchProducts(randomBrand, { limit: 5 });
		for (let k = 0; k < 3; k++) {
			const item = new Sneaker({
				model: randomProducts[k].name,
				sizesNeeded: randomSizesNeeded,
				sku: randomProducts[k].pid,
				image: randomProducts[k].image
			});
			await item.save();
			console.log(item);
		}
		console.log('Seeded Item to DB.');
	}
};

try {
	seedDB();
	console.log('Successfully seeded database!');
} catch (e) {
	console.log('Something bad happened!');
	console.log(e);
}
