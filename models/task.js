/* eslint-disable no-underscore-dangle */
const mongoose = require('mongoose');

const Site = require('./site');
const PersonForm = require('./personForm');
const TaskSet = require('./taskset');


const TaskSchema = new mongoose.Schema({
	siteId: {
		type: mongoose.Schema.ObjectId,
		required: true,
	},

	answer: {
		type: Number,
		min: 0,
		max: 10,
		required: true,
	},

	answerCode: {
		type: Number,
		min: 0,
		max: 10,
		required: false,
	},

	answerAlgorithm: {
		type: Number,
		min: 0,
		max: 10,
		required: false,
	},

	formId: {
		type: mongoose.Schema.ObjectId,
		required: false,
		ref: 'PersonForm',
	},

	userId: {
		type: mongoose.Schema.ObjectId,
		required: true,
	},

	taskSetId: {
		type: mongoose.Schema.ObjectId,
		required: true,
	},

	status: {
		type: String,
		enum: ['active', 'disabled'],
		default: 'active',
		required: true,
	},
});


TaskSchema.statics = {
	async countByUserId(userId, allowed = false) {
		const filter = { userId };

		const activeTaskSet = await TaskSet.getCurrentActive();

		if (! activeTaskSet) {
			return 0;
		}

		// Find in current active task only
		filter.taskSetId = {
			$eq: activeTaskSet._id,
		};

		if (allowed) {
			const siteIds = await Site.distinct('_id', {
				dataset: {
					$in: activeTaskSet.activeDataSets,
				},
			});

			filter.siteId = { $in: siteIds };
		}

		const count = await this.count(filter);

		return count;
	},

	// Set mark
	async getNew({ siteId, answer, userId }) {
		const activeTaskSet = await TaskSet.getCurrentActive();

		if (! activeTaskSet) {
			throw new Error('no_active_tasks');
		}

		const limit = activeTaskSet.assessmentLimit;
		const showRandomly = activeTaskSet.randomSelection;

		const count = await this.countByUserId(userId, true);

		if (limit && count >= limit && showRandomly) {
			throw new Error('task_errors.limit_reached');
		}

		const site = await Site.findById(siteId);

		if (site.status === 'disabled') {
			throw new Error('task_errors.bad_markup_request');
		}

		if (site.status === 'approved' && answer === 0) {
			throw new Error('task_errors.bad_markup_request');
		}

		return this.create({
			siteId,
			answer,
			userId,
			taskSetId: activeTaskSet._id,
		});
	},

	// Set mark for link
	async getNewLink({
		siteId, answerCode, answerAlgorithm, userId,
	}) {
		const activeTaskSet = await TaskSet.getCurrentActive();

		if (! activeTaskSet) {
			throw new Error('no_active_tasks');
		}

		const limit = activeTaskSet.assessmentLimit;
		const showRandomly = activeTaskSet.randomSelection;

		const count = await this.countByUserId(userId, true);

		if (limit && count >= limit && showRandomly) {
			throw new Error('task_errors.limit_reached');
		}

		const site = await Site.findById(siteId);

		if (site.status === 'disabled') {
			throw new Error('task_errors.bad_markup_request');
		}

		if (site.status === 'approved' && answerCode === 0 && answerAlgorithm === 0) {
			throw new Error('task_errors.bad_markup_request');
		}

		// Костыль!!!
		let answer = 1;
		if (answerCode === 'X' || answerAlgorithm === 'X') {
			answer = 'X';
		}

		return this.create({
			siteId,
			answer,
			answerCode,
			answerAlgorithm,
			userId,
			taskSetId: activeTaskSet._id,
		});
	},

	// Set mark for form
	async getNewForm({
		siteId, answer, userId, form,
	}) {
		const activeTaskSet = await TaskSet.getCurrentActive();

		if (! activeTaskSet) {
			throw new Error('no_active_tasks');
		}

		const limit = activeTaskSet.assessmentLimit;
		const showRandomly = activeTaskSet.randomSelection;

		const count = await this.countByUserId(userId, true);

		if (limit && count >= limit && showRandomly) {
			throw new Error('task_errors.limit_reached');
		}

		const site = await Site.findById(siteId);

		if (site.status === 'disabled') {
			throw new Error('task_errors.bad_markup_request');
		}

		if (site.status === 'approved' && answer === 0) {
			throw new Error('task_errors.bad_markup_request');
		}

		const personForm = await PersonForm.create({
			projectExperience: (form.projectExperiences || []).map(item => ({
				companyName: item.companyName,
				position: item.position,
				startDate: item.startDate,
				endDate: item.endDate,
				projectsDescription: (item.projects || []).map(itemProj => ({
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

		return this.create({
			siteId,
			answer,
			formId: personForm._id,
			userId,
			taskSetId: activeTaskSet._id,
		});
	},

	async getBrokenSites() {
		const activeTaskSet = await TaskSet.getCurrentActive();

		if (! activeTaskSet) {
			throw new Error('no_active_tasks');
		}

		const siteIds = await this.distinct('siteId', {
			answer: 0,
			taskSetId: activeTaskSet._id,
		});

		return Site.find({
			_id: { $in: siteIds },
			status: 'active',
		});
	},

	async getMaxTasksCountOfUserInTaskSet(taskSetId) {
		const taskSet = await TaskSet.findById(taskSetId);

		if (! taskSet) {
			return 0;
		}

		const aggregationResults = await this.aggregate([
			{
				$match: {
					taskSetId: mongoose.Types.ObjectId(taskSet.id),
				},
			},
			{
				$group: {
					_id: { _id: '$userId' },
					count: { $sum: 1 },
				},
			},
		]);

		return aggregationResults
			.reduce((currentMax, result) => Math.max(result.count, currentMax), 0);
	},
};


module.exports = mongoose.model('Task', TaskSchema);
