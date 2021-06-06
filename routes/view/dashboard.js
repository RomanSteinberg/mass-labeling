const config = require('../../config');

const Site = require('../../models/site');
const Task = require('../../models/task');

const router = require('express').Router();


router.get('/', async (req, res, next) => {
	try {
		const brokenCount = await Site.count({
			_id: {
				$in: await Task.distinct('siteId', {
					answer: 0,
				}),
			},
			status: 'active',
		});

		const entityMode = config.get('boot.entityMode');
		let brokenTitle = null;
		let scoredTitle = null;
		if (entityMode === 'link') {
			brokenTitle = res.locals.getText('broken_links');
			scoredTitle = res.locals.getText('scored_links_title');
		} else if (entityMode === 'form') {
			brokenTitle = res.locals.getText('broken_forms');
			scoredTitle = res.locals.getText('scored_forms_title');
		} else {
			brokenTitle = res.locals.getText('broken_sites');
			scoredTitle = res.locals.getText('scored_sites_title');
		}

		res.render('dashboard', {
			brokenTitle,
			scoredTitle,
			brokenCount,
			markupCount: await Task.countByUserId(req.user.id, true),
		});
	} catch (err) {
		// eslint-disable-next-line no-underscore-dangle
		err.message = req.__(err.message);
		next(err);
	}
});


module.exports = router;
