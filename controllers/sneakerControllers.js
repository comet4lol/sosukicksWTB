const express = require('express');
const app = express();
const ejsMate = require('ejs-mate');

const Sneaker = require('../models/sneaker');
const Fuse = require('fuse.js');
const StockXAPI = require('stockx-api');
const stockX = new StockXAPI();

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
		const { searchTerm, sizesNeeded, password, imageURL, tags } = req.body;

		if (password === process.env.ADMIN_PASSWORD) {
			const searchResults = await stockX.searchProducts(searchTerm, { limit: 1 });
			if (imageURL != '' || imageURL != undefined) {
				let sneaker = new Sneaker({
					model: searchTerm,
					sizesNeeded,
					sku: searchResults[0].pid ? searchResults[0].pid : 'manual',
					tags,
					image: imageURL
				});
				// console.log(sneaker);
				await sneaker.save();
				res.redirect('/sneakers');
			} else {
				let sneaker = new Sneaker({
					model: searchResults[0].name,
					sizesNeeded,
					sku: searchResults[0].pid,
					tags,
					image: searchResults[0].image
				});
				// console.log(sneaker);
				await sneaker.save();
				res.redirect('/sneakers');
			}
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
