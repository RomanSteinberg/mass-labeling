const bunyan = require('bunyan');

const config = require('../config');


const options = {};

if (1 || process.env.NODE_ENV === 'production') {
	options.streams = [{ path: 'logs/mass-labeling.log' }];
} else {
	options.stream = process.stdout;
}


module.exports = bunyan.createLogger({
	...options,

	name: 'app',
	level: config.get('logger.level'),
	serializers: bunyan.stdSerializers,
});
