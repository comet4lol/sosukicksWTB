const express = require('express');
const app = express();
const ejsMate = require('ejs-mate');

const Sneaker = require('../models/sneaker');
const Fuse = require('fuse.js');
const StockXAPI = require('stockx-api');
const stockX = new StockXAPI();
app.engine('ejs', ejsMate);

module.exports.renderHomePage = (req, res) => {
	res.render('../views/home.ejs');
};
module.exports.renderIndexPage = async (req, res) => {
	const items = await Sneaker.find({});
	res.render('index.ejs', { items });
};
module.exports.renderAdminPage = async (req, res) => {
	const items = await Sneaker.find({});
	res.render('admin.ejs', { items });
};
module.exports.renderEditPage = async (req, res) => {
	const { id } = req.params;
	const item = await Sneaker.findById(id).exec();
	res.render('edit.ejs', { id, item });
};

module.exports.updatedSearchSneaker = async (req, res, next) => {
	const sneakers = await Sneaker.find({});
	const { filter } = req.query;
	const options = {
		keys: [
			{
				name: 'model',
				weight: 0.5
			},
			{
				name: 'sku',
				weight: 100
			}
		],
		shouldSort: true,
		threshold: 0.2,
		ignoreLocation: true,
		ignoreFieldNorm: true
	};
	const fuse = new Fuse(sneakers, options);
	let items = fuse.search({
		$or: [ { model: filter }, { sku: filter } ]
	});
	let commonProducts = items.map((items) => {
		let products = {
			model: items.item.model,
			sizesNeeded: items.item.sizesNeeded.length === 0 ? 'Cannot find size' : items.item.sizesNeeded,
			sku: items.item.sku,
			image: items.item.image
		};
		return products;
	});
	//console.log(commonProducts);
	while (commonProducts.length % 5 !=0) {
		commonProducts.push({})
	}
	res.render('index.ejs', { items: commonProducts });
};
module.exports.addSneakerToDB = async (req, res, next) => {
	try {
		const { searchTerm, size, password } = req.body;
		const searchResults = await stockX.searchProducts(searchTerm, { limit: 1 });

		if (password === process.env.ADMIN_PASSWORD) {
			let sneaker = new Sneaker({
				model: searchResults[0].name,
				size: size,
				sku: searchResults[0].pid,
				image: searchResults[0].image
			});
			await sneaker.save(), res.redirect('/sneakers');
		} else {
			return res.send('corgeala');
		}
	} catch (e) {
		next(e);
	}
};
module.exports.editSneaker = async (req, res) => {
	const { model, size } = req.body;
	const { id } = req.params;
	await Sneaker.findByIdAndUpdate(id, { model, size });
	res.redirect('/sneakers/admin');
};
module.exports.adminDelete = async (req, res) => {
	const { markedSneakers } = req.body;
	markedSneakers.forEach(async function(sneakerId) {
		await Sneaker.findByIdAndDelete(sneakerId);
		//console.log(deletion);
		res.redirect('/sneakers/admin');
	});
};
