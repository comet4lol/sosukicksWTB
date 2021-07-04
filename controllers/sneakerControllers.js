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
	res.cookie('readPopup', true, { maxAge: 432000000 });
	if (req.query != {} || req.query.filter != undefined) {
		const sneakers = await Sneaker.find({});
		const { filter } = req.query;
		// console.log(filter);
		if (filter == '' || filter == 'all' || filter == undefined) {
			res.render('index.ejs', { items: sneakers });
		}
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
		res.render('index.ejs', { items: commonProducts, cookies: req.cookies });
	} else {
		let defaultItems = await Sneaker.find({});
		res.render('index.ejs', { items: defaultItems, cookies: req.cookies });
	}
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

// module.exports.updatedSearchSneaker = async (req, res, next) => {
// 	const sneakers = await Sneaker.find({});
// 	const { filter } = req.query;
// 	const options = {
// 		keys: [
// 			{
// 				name: 'model',
// 				weight: 0.5
// 			},
// 			{
// 				name: 'sku',
// 				weight: 100
// 			}
// 		],
// 		shouldSort: true,
// 		threshold: 0.2,
// 		ignoreLocation: true,
// 		ignoreFieldNorm: true
// 	};
// 	const fuse = new Fuse(sneakers, options);
// 	let items = fuse.search({
// 		$or: [ { model: filter }, { sku: filter } ]
// 	});
// 	let commonProducts = items.map((items) => {
// 		let products = {
// 			model: items.item.model,
// 			sizesNeeded: items.item.sizesNeeded.length === 0 ? 'Cannot find size' : items.item.sizesNeeded,
// 			sku: items.item.sku,
// 			image: items.item.image
// 		};
// 		return products;
// 	});
// 	res.render('index.ejs', { items: commonProducts });
// };
module.exports.addSneakerToDB = async (req, res, next) => {
	try {
		const { searchTerm, sizesNeeded, password, imageURL } = req.body;

		const searchResults = await stockX.searchProducts(searchTerm, { limit: 1 });

		if (searchResults != [] && searchResults[0] != undefined && password === process.env.ADMIN_PASSWORD) {
			console.log(searchResults[0]);
			let sneaker = new Sneaker({
				model: searchResults[0].name,
				sizesNeeded,
				sku: searchResults[0].pid,
				image: searchResults[0].image
			});
			await sneaker.save();
			res.redirect('/sneakers');
		} else {
			let sneaker = new Sneaker({
				model: searchTerm,
				sizesNeeded,
				sku: 'NO AVAILABLE SKU',
				image: imageURL
			});
			await sneaker.save();
			res.redirect('/sneakers');
		}
	} catch (e) {
		next(e);
	}
};
module.exports.editSneaker = async (req, res) => {
	let { model, sizesNeeded } = req.body;
	const { id } = req.params;
	if (sizesNeeded) {
		await Sneaker.findByIdAndUpdate(id, { model, sizesNeeded });
	} else await Sneaker.findByIdAndUpdate(id, { model });
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
