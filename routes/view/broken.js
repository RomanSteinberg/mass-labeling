const config = require('../../config');

const Task = require('../../models/task');

const router = require('express').Router();


router.get('/', async (req, res, next) => {
	try {
		const sites = await Task.getBrokenSites();

		const entityMode = config.get('boot.entityMode');
		let brokenTitle = null;
		if (entityMode === 'link') {
			brokenTitle = res.locals.getText('show_broken_links');
		} else if (entityMode === 'form') {
			brokenTitle = res.locals.getText('show_broken_forms');
		} else {
			brokenTitle = res.locals.getText('show_broken');
		}

		res.render('broken', {
			sites,
			brokenTitle,
			entityMode,
		});
	} catch (err) {
		// eslint-disable-next-line no-underscore-dangle
		err.message = req.__(err.message);
		next(err);
	}
});


module.exports = router;
