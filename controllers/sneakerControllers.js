const express = require('express');
const app = express();
const ejsMate = require('ejs-mate');

const Sneaker = require('../models/sneaker');
const Fuse = require('fuse.js');
const StockXAPI = require('stockx-api');
const stockX = new StockXAPI();


require('dotenv').config();
const adminPassword = process.env.ADMIN_PASSWORD;
app.engine('ejs', ejsMate);

module.exports.renderHomePage = (req, res) => {
	// res.render('../views/home.ejs');
	res.redirect('/sneakers');
};
module.exports.renderIndexPage = async (req, res) => {
	if (req.query != {} || (req.query.filter != undefined && req.query.filter != '')) {
		const sneakers = await Sneaker.find({});
		let filter = req.query.filter;
		if (filter == '' || filter == 'all' || filter == undefined) {
			return res.render('index.ejs', { items: sneakers });
		} else {
			filter = filter.trim();
			const options = {
				keys: [
					{
						name: 'model',
						weight: 0.6
					},
					'tags',
					'sizesNeeded',
					{
						name: 'sku',
						weight: 100
					}
				],
				shouldSort: true,
				threshold: 0.2,
				ignoreLocation: true,
				ignoreFieldNorm: true,
				isCaseSensitive: false
			};
			let fuse = new Fuse(sneakers, options);
			let items = fuse.search({
				$or: [ { model: filter }, { sku: filter }, { tags: filter }, { sizesNeeded: filter } ]
			});
			// let items = fuse.search(filter);
			let commonProducts = items.map((items) => {
				let products = {
					model: items.item.model,
					sizesNeeded: items.item.sizesNeeded.length === 0 ? 'Cannot find size' : items.item.sizesNeeded,
					sku: items.item.sku,
					image: items.item.image
				};
				return products;
			});
			return res.render('index.ejs', { items: commonProducts, searchQuery: filter });
		}
		// } else {
		// 	let defaultItems = await Sneaker.find({});
		// 	res.render('index.ejs', { items: defaultItems, searchQuery: filter });
		// }
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

module.exports.addSneakerToDB = async (req, res, next) => {
	try {

		const { searchTerm, sizesNeeded, password, imageURL, tags, sku } = req.body;
		sizesNeeded.forEach( (size) => typeof(size) );
		if ( (searchTerm && sizesNeeded && imageURL && tags && sku) && password == adminPassword) {
				let sneaker = new Sneaker ({
					model : searchTerm,
					sizesNeeded,
					tags,
					sku,
					image: imageURL
				});
				await sneaker.save();
				res.redirect('/sneakers');
			} else throw new Error("Missing parameters!");
		} catch (e) {
		next(e);
	}
};
module.exports.editSneaker = async (req, res) => {
	let { model, sizesNeeded,imageURL } = req.body;
	const { id } = req.params;
	await Sneaker.findByIdAndUpdate(id, { model, sizesNeeded, image: imageURL }).then(res.redirect('/sneakers/admin'));
};
module.exports.adminDelete = async (req, res) => {
	const { markedSneakers } = req.body;
	markedSneakers.forEach(async function(sneakerId) {
		await Sneaker.findByIdAndDelete(sneakerId);

		res.redirect('/sneakers/admin');
	});
};
