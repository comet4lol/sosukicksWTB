const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const sneakers = require('./controllers/sneakerControllers.js');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');


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

const app = express();

app.engine('ejs', ejsMate);
mongoose.set('returnOriginal', false);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// app.use(helmet());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, '/public')));
app.use(cookieParser());

express.json({ extended: true });

app.get('/', sneakers.renderHomePage);
app.get('/sneakers', sneakers.renderIndexPage);
app.get('/sneakers/admin', sneakers.renderAdminPage);
app.get('/sneakers/:id/edit', sneakers.renderEditPage);
//app.get('/sneakers/filter/', sneakers.updatedSearchSneaker);
app.post('/sneakers', sneakers.addSneakerToDB);
app.put('/sneakers/:id/edit', sneakers.editSneaker);
app.delete('/sneakers/admin', sneakers.adminDelete);

// app.get('/searchSneaker/:query', async (req, res) => {
// 	const searchTerm = req.params.query;
// 	await stockX
// 		.searchProducts(searchTerm, { limit: 6 })
// 		.then((products) => {
// 			const foundProducts = JSON.parse(JSON.stringify(products));
// 			//const foundProducts = [ products[0], products[1], products[2] ];
// 			res.render('search.ejs', { foundProducts });
// 		})
// 		.catch((err) => console.log(`An error ocurred ${err}`));
// });

app.listen(3000, () => {
	console.log('Listening on port 3000!');
});

// app.use((err, req, res, next) => {
// 	res.render('error.ejs', { err });
// });
