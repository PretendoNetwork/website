const express = require('express');
const exphbs  = require('express-handlebars');
const app = express();
const config = require('./config.json');
require('colors');

const ROUTES = {
	HOME: require('./routes/home'),
	ACCOUNT: require('./routes/account')
};

app.engine('.hbs', exphbs({
        extname: '.hbs',
        layoutsDir: 'views',
        partialsDir: 'views/partials'
}));
app.set('view engine', '.hbs');

app.use('/assets', express.static('assets'));

app.use('/account', ROUTES.ACCOUNT);
app.use('/', ROUTES.HOME);

app.use((req, res) => {
	res.render('404');
});

app.listen(config.http.port, () => {
	console.log('Started '.green + 'on port '.red + new String(config.http.port).yellow);
});
