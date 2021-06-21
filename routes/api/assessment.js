/* eslint-disable no-underscore-dangle */
const mongoose = require('mongoose');

const PersonForm = require('../../models/personForm');

const config = require('../../config');

const Site = require('../../models/site');
const Task = require('../../models/task');
const TaskSet = require('../../models/taskset');

const logger = require('../../libs/logger');

const bridges = require('../bridges');

const router = require('express').Router();


/**
 * Нужно чтоб перевести глубкой обхект в DotNotation,
 * например $set: {"friends.0.emails.$.email" : '2222'}
 *
 * @param {Object|Array<Object>} args The object or array to  loop through
 * @param {String} prefix The prefix to fill the $set object
 * @returns {Object}
 */
const objectToDotNotation = (args, prefix = '') =>
	Object.keys(args).reduce((acc, key) => {
		if (typeof args[key] === 'object') {
			Object.assign(acc, objectToDotNotation(args[key], `${prefix}${key}.`));
		} else {
			acc[`${prefix}${key}`] = args[key];
		}

		return acc;
	}, {});


/**
 * Create new form
 */
router.post('/create-new-form', async (req, res) => {
	const activeTaskSet = await TaskSet.getCurrentActive();

	if (! activeTaskSet) {
		throw new Error('no_active_tasks');
	}

	const entityMode = config.get('boot.entityMode');

	if (entityMode !== 'form') {
		throw new Error('only_form_mode');
	}

	// eslint-disable-next-line prefer-destructuring
	const form = req.body.form;

	const personForm = await PersonForm.create({
		fullname: form.fullname,
		projectExperience: (form.projectExperience || []).map(item => ({
			companyName: item.companyName,
			position: item.position,
			startDate: item.startDate,
			endDate: item.endDate,
			projectsDescription: (item.projectsDescription || []).map(itemProj => ({
				description: itemProj.description,
				responsibility: itemProj.responsibility,
				projectLength: itemProj.projectLength,
				technologies: itemProj.technologies,
			})),
		})),
		fullExperience: form.fullExperience,
		expectedSalary: form.expectedSalary,
		regionWorkLocation: form.regionWorkLocation,
		remote: form.remote,
		citizenship: form.citizenship,
		employmentType: form.employmentType,
		educations: (form.educations || []).map(item => ({
			degree: item.degree,
			universityName: item.universityName,
		})),
		professionalSkills: form.professionalSkills,
		foreignLanguages: (form.educations || []).map(item => ({
			language: item.language,
			levelOfProficiency: item.levelOfProficiency,
		})),
		linksToOpenSource: form.linksToOpenSources,
		otherProjects: form.otherProjects,
		socialNetworks: form.socialNetworks,
	});

	const id = mongoose.Types.ObjectId();

	await Site.create({
		_id: id,
		url: id,
		dataset: 'forms',
		formId: personForm._id,
	});

	res.api.response({
		formId: personForm._id,
	});
});

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

			if (entityMode !== 'form') {
				res.api.response({
					siteId: site.id,
					siteStatus: site.status,
					siteUrl: site.url,
					entityMode,
				});
			} else {
				const form = await PersonForm.findById(site.formId).lean();

				res.api.response({
					siteId: site.id,
					siteStatus: site.status,
					siteUrl: site.url,
					form,
					entityMode,
				});
			}
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
			const task = await Task.getNewForm({
				siteId: req.body.siteId,
				answer: Number(req.body.answer),
				userId: req.user.id,
			});

			const site = await Site.findById(req.body.siteId);

			PersonForm.findByIdAndUpdate(site.formId, { $set: objectToDotNotation(req.body.form) }, { upsert: true }, (err) => {
				if (err) console.log(err);
			});

			logger.info({
				taskId: task.id,
				siteId: task.siteId,
				answer: task.answer,
				userId: task.userId,
			}, 'answerFormTask');

			res.api.response(task.id);
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
			}, 'answerTask');

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
