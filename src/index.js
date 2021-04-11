const logger = require('./logger');
const express = require('express');
const handlebars = require('express-handlebars');

const cfg = require('../config.json');

const app = express();

const routers = {
	home: require('./routers/home'),
	faq: require('./routers/faq'),
	progress: require('./routers/progress')
};

app.use('*', (req, res, next) => {
	logger.info(`${req.method.toUpperCase()} ${req.path}`);
	next();
});

app.use('/', routers.home);
app.use('/faq', routers.faq);
app.use('/progress', routers.progress);

app.engine('handlebars', handlebars({
	helpers: {
		doFaq(value, options) {
			let htmlLeft = '';
			let htmlRight = '';
			for(const [i, v] of Object.entries(value)) {
				const appendHtml = options.fn({
					...v
				}); // Tis is an HTML string
				if(i % 2 === 0) {
					htmlLeft += appendHtml;
				} else {
					htmlRight += appendHtml;
				}
			}
			return `
			<div class="left questions-left">
				${htmlLeft}
			</div>
			<div class="right questions-right">
				${htmlRight}
			</div>
			`;
		},
		customCheckbox(type) {
			switch(type) {
				case 'done':
					return `
						<div class="custom-checkbox done">
							<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-check"><polyline points="20 6 9 17 4 12"></polyline></svg>
						</div>
					`;
				case 'ongoing':
					return `
						<div class="custom-checkbox ongoing">
							<div class="small-dot"></div>
						</div>
					`;
				default:
					return '<div class="custom-checkbox incomplete"></div>';
			}
		}
	}
}));
app.set('view engine', 'handlebars');

app.use(express.static('public'));

app.listen(cfg.http.port, () => {
	logger.info(`Server listening on *:${cfg.http.port}`);
});