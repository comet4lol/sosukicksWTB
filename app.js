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

const app = express();

app.engine('ejs', ejsMate);
mongoose.set('returnOriginal', false);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// app.use(helmet());
// app.use(
// 	helmet.contentSecurityPolicy({
// 		directives: {
// 			defaultSrc: 'self',
// 			connectSrc: 'self',
// 			scriptSrc: [
// 				"'unsafe-inline'",
// 				"'self'",
// 				'https://connect.facebook.net/en_US/sdk/xfbml.customerchat.js',
// 				'https://connect.facebook.net/en_US/sdk.js'
// 			],
// 			styleSrc: [
// 				"'self'",
// 				"'unsafe-inline'",
// 				'https://stackpath.bootstrapcdn.com/',
// 				'https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta2/dist/css/bootstrap.min.css"',
// 				'https://cdn.jsdelivr.net',
// 				'https://connect.facebook.net/en_US/sdk.js',
// 				'https://use.fontawesome.com/releases/',
// 				'https://use.fontawesome.com/releases/v5.15.3/webfonts/',
// 				'https://www.facebook.com/'
// 			],
// 			workerSrc: [ "'self'", 'blob:' ],
// 			childSrc: [ 'blob:' ],
// 			objectSrc: [ 'none' ],
// 			imgSrc: [
// 				'any'
// 				// "'self'",
// 				// 'https://images.stockx.com/',
// 				// 'https://images.stockx.com',
// 				// 'https://images.unsplash.com/',
// 				// 'https://images.unsplash.com',
// 				// 'https://download.logo.wine/logo/Facebook/Facebook-f_Logo-Blue-Logo.wine.png',
// 				// 'https://download.logo.wine/logo/Instagram/Instagram-Logo.wine.png',
// 				// 'https://www.facebook.com/tr/?id=480859439855362&ev=fb_page_view&dl=http%3A%2F%2Flocalhost%3A3000%2Fsneakers&rl=&if=false&ts=1621962499572&sw=1920&sh=1080&at=',
// 				// 'https://www.facebook.com/tr/?id=480859439855362&ev=fb_page_view&dl=http%3A%2F%2Flocalhost%3A3000%2Fsneakers&rl=&if=false&ts=1621962525388&sw=1920&sh=1080&at=',
// 				// 'https://www.facebook.com/'
// 			],
// 			fontSrc: [ "'self'" ]
// 		}
// 	})
// );
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, '/public')));
app.use(cookieParser());

express.json({ extended: true });

app.get('/', sneakers.renderHomePage);
app.get('/sneakers', sneakers.renderIndexPage);
app.get('/sneakers/admin', sneakers.renderAdminPage);
app.get('/sneakers/:id/edit', sneakers.renderEditPage);
// app.get('/sneakers/filter/', sneakers.updatedSearchSneaker);
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
