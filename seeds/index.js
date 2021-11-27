const mongoose = require('mongoose');
const { brands, sizes } = require('./data');
const Sneaker = require('../models/sneaker');
const StockXAPI = require('stockx-api');
const stockX = new StockXAPI();

require('dotenv').config();

const dbURL = process.env.DB_URL
console.log(dbURL)

mongoose.connect(dbURL, {
	useNewUrlParser: true,
	useCreateIndex: true,
	useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error!'));
db.once('open', () => {
	console.log('Successfully conected to  database!');
});

let getRandomSize = () => {
	return sizes[Math.floor(Math.random() * (sizes.length - 1))];
};
let getRandomSizes = (number) => {
	let sizes = [];
	for (let j = 0; j < number; j++) {
		sizes.push(getRandomSize());
	}
	return sizes;
};
let fiftyPercent = () => {
	if (Math.random() > 0.47) return true;
	else return false;
};
console.log('right before seedDB() ');
const seedDB = async () => {
	if (Sneaker.find({}).length > 0) await Sneaker.deleteMany({});
	
	for (let i = 0; i <= 15; i++) {
		const randomBrandNumber = Math.floor(Math.random() * 3);

		let randomBrand = brands[randomBrandNumber].brand;
		if (fiftyPercent() && randomBrand == 'Nike') randomBrand += '  Dunk Low';
		else if (fiftyPercent() && randomBrand == 'Nike') randomBrand += '  Travis Scott';
		else if (fiftyPercent() && randomBrand == 'Nike') randomBrand += '  Fear of God';

		if (fiftyPercent() && randomBrand == 'Adidas') randomBrand += '   Yeezy 350v2';
		else if (fiftyPercent() && randomBrand == 'Adidas') randomBrand += '   Yeezy';
		else if (fiftyPercent() && randomBrand == 'Adidas') randomBrand += '   Ultraboost';

		if (fiftyPercent() && randomBrand == 'Jordan') randomBrand += '  1 High Retro';
		else if (fiftyPercent() && randomBrand == 'Jordan') randomBrand += '  Retro 4';
		else if (fiftyPercent() && randomBrand == 'Jordan') randomBrand += ' 1 Low';
		console.log(randomBrand);
		// const randomProducts = await stockX.newSearchProducts(randomBrand, { limit: 8 });
		console.log('Successfully looked up stockx products');
		for (let k = 0; k < 3; k++) {
			let randomSizesNeeded = getRandomSizes(3);
			
			const item = new Sneaker({
				model: /* randomProducts[k].name */ "PLACEHOLDER" ,
				sizesNeeded: randomSizesNeeded,
				// brand: brands[randomBrandNumber].brand,
				sku: /*randomProducts[k].pid */ "testing mode",
				image: /*randomProducts[k].image */ "https://socialistmodernism.com/wp-content/uploads/2017/07/placeholder-image.png"
			});
			console.log(`Trying to save ${item}`);
			await item.save();
			console.log(`Successfully saved ${item}`);
			// console.log(item);
		}
		console.log('Seeded Item to DB.');
		if (i === 15) console.log('Successfully seeded DB!');
	}
};
seedDB();
