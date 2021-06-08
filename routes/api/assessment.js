/* eslint-disable no-underscore-dangle */
const config = require('../../config');

const Site = require('../../models/site');
const Task = require('../../models/task');
const TaskSet = require('../../models/taskset');

const logger = require('../../libs/logger');

const bridges = require('../bridges');

const router = require('express').Router();


/**
 * Get new task for user
 */
router.post('/create', async (req, res, next) => {
	try {
		const activeTaskSet = await TaskSet.getCurrentActive();

		if (! activeTaskSet) {
			throw new Error('no_active_tasks');
		}

		const userActiveTaskId = req.body.activeTaskSetId;

		if (String(userActiveTaskId) !== String(activeTaskSet._id)) {
			throw new Error('active_taskset_changed');
		}

		const showRandomly = activeTaskSet.randomSelection;

		let additionalFilter = {};

		// User should rate all images from current taskset,
		// so retrieve all tasks continuously
		if (! showRandomly) {
			const approvedByUserSiteIds = await Task.distinct('siteId', {
				userId: {
					$eq: req.user.id,
				},

				taskSetId: {
					$eq: activeTaskSet._id,
				},
			});

			additionalFilter = {
				_id: {
					$nin: approvedByUserSiteIds,
				},
			};
		}


		const site = await Site.getRandom(additionalFilter);

		const entityMode = config.get('boot.entityMode');

		// User has any task
		if (site) {
			logger.info({
				siteId: site.id,
				userId: req.user.id,
			}, 'createTask');

			res.api.response({
				siteId: site.id,
				siteStatus: site.status,
				siteUrl: site.url,
				siteFormText: site.formText || '',
				entityMode,
			});
		} else {
			res.api.response({
				limitReached: true,
			});
		}
	} catch (err) {
		// eslint-disable-next-line no-underscore-dangle
		err.message = req.__(err.message);
		next(err);
	}
});


/**
 * User have rated some image
 */
router.post('/answer', async (req, res, next) => {
	try {
		const activeTaskSet = await TaskSet.getCurrentActive();

		if (! activeTaskSet) {
			throw new Error('no_active_tasks');
		}

		const userActiveTaskId = req.body.activeTaskSetId;

		if (String(userActiveTaskId) !== String(activeTaskSet._id)) {
			throw new Error('active_taskset_changed');
		}

		const entityMode = config.get('boot.entityMode');

		if (entityMode === 'form') {
			// TODO...
		} else if (entityMode === 'link') {
			const task = await Task.getNewLink({
				siteId: req.body.siteId,
				answerCode: Number(req.body.answerCode),
				answerAlgorithm: Number(req.body.answerAlgorithm),
				userId: req.user.id,
			});

			logger.info({
				taskId: task.id,
				siteId: task.siteId,
				answerCode: task.answerCode,
				answerAlgorithm: task.answerAlgorithm,
				userId: task.userId,
			}, 'answerLinkTask');

			res.api.response(task.id);
		} else {
			// entityMode == site

			const task = await Task.getNew({
				siteId: req.body.siteId,
				answer: Number(req.body.answer),
				userId: req.user.id,
			});

			logger.info({
				taskId: task.id,
				siteId: task.siteId,
				answer: task.answer,
				userId: task.userId,
			}, 'answerSiteTask');

			res.api.response(task.id);
		}
	} catch (err) {
		// eslint-disable-next-line no-underscore-dangle
		err.message = req.__(err.message);
		next(err);
	}
});


/**
 * User decided to change the last answer
 */
router.post('/:taskId/undo', bridges.task.id, bridges.task.owner, async (req, res, next) => {
	try {
		const activeTaskSet = await TaskSet.getCurrentActive();

		if (! activeTaskSet) {
			throw new Error('no_active_tasks');
		}

		const userActiveTaskId = req.body.activeTaskSetId;

		if (String(userActiveTaskId) !== String(activeTaskSet._id)) {
			throw new Error('active_taskset_changed');
		}

		await req.task.remove();

		logger.info({
			taskId: req.task.id,
			siteId: req.task.siteId,
			answer: req.task.answer,
			userId: req.task.userId,
		}, 'undoTask');

		res.api.response();
	} catch (err) {
		// eslint-disable-next-line no-underscore-dangle
		err.message = req.__(err.message);
		next(err);
	}
});


module.exports = router;
