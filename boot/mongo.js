const Promise = require('bluebird');
const mongoose = require('mongoose');

const config = require('../config');
const logger = require('../lib/logger');


module.exports = () => {
	mongoose.Promise = Promise;
	mongoose.connect(config.mongo.url, (err) => {
		if (err) {
			logger.error(err);
			process.exit(1);
		}
	});
};
