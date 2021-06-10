/* eslint-disable no-alert */

import $ from 'jquery';
import Request from './request';

import '../css/assessment.css';


window.$ = $;
window.jQuery = $;

// Texts from back-end
const { signs, activeTaskSetId } = window;

// Вставить в элемент DOM $('#form') группу полей 'Опыт работы'
const addProjectExperienceFormGroupItemToDOM = () => {
	const formProjectExperienceGroupElem = $('#form > form > #projectExperienceGroup');
	if (! formProjectExperienceGroupElem.length) {
		return;
	}

	formProjectExperienceGroupElem.append('' +
		'<div class="well well-sm projectExperienceItem" style="margin-bottom: 20px">' +
		'	<input type="text" class="form-control companyNameField" style="margin-bottom: 10px" placeholder="Company name (Название компании)" />' +
		'	<input type="text" class="form-control positionField" style="margin-bottom: 10px" placeholder="Position (Должность)" />' +
		'	<p>Start date (Начало работы в компании)</p>' +
		'	<input type="date" class="form-control startDateField" style="margin-bottom: 10px" placeholder="Start date (Начало работы в компании)" />' +
		'	<p>End date (Конец работы в компании)</p>' +
		'	<input type="date" class="form-control endDateField" style="margin-bottom: 10px" placeholder="End date (Конец работы в компании)" />' +
		'' +
		'	<!-- Проекты (Projects)-->' +
		'	<h3 style="margin-bottom: 10px">Проекты</h3>' +
		'	<div class="projectsGroup" style="margin-bottom: 25px">' +
		'		<button type="button" class="btn btn-primary addProjectGroupItemToDOM" style="margin-bottom: 10px">' +
		'			<span class="glyphicon glyphicon-plus" aria-hidden="true"></span> Добавить' +
		'		</button>' +
		'	</div>' +
		'	<!-- /Проект (Projects)-->' +
		'' +
		'	<button type="button" class="btn btn-danger removeProjectExperienceFormGroupItemToDOM">' +
		'  		<span class="glyphicon glyphicon-minus" aria-hidden="true"></span> Удалить' +
		'	</button>' +
		'</div>' +
		'');
};

// Вставить в элемент DOM $('#form') группу полей 'Опыт работы' --> 'Проекты'
const addProjectGroupItemToDOM = (buttonElem) => {
	const formProjectsGroupElem = buttonElem.parent();

	formProjectsGroupElem.append('' +
		'<div class="well well-sm projectItem" style="margin-bottom: 20px">' +
		'	<input type="text" class="form-control descriptionField" style="margin-bottom: 10px" placeholder="Description (Описание проекта)" />' +
		'	<input type="text" class="form-control responsibilityField" style="margin-bottom: 10px" placeholder="Responsibility (Обязанности)" />' +
		'	<input type="number" class="form-control projectLengthField" style="margin-bottom: 10px"' +
		'			placeholder="ProjectLength (Длительность проекта месяцев)" />' +
		'' +
		'	<h4 style="margin-bottom: 10px">Технологии</h4>' +
		'	<div class="technologiesGroup" style="margin-bottom: 25px">' +
		'		<button type="button" class="btn btn-primary addTechnologiesGroupItemToDOM" style="margin-bottom: 10px">' +
		'			<span class="glyphicon glyphicon-plus" aria-hidden="true"></span> Добавить' +
		'		</button>' +
		'	</div>' +
		'' +
		'	<button type="button" class="btn btn-danger removeProjectExperienceFormGroupItemToDOM">' +
		'  		<span class="glyphicon glyphicon-minus" aria-hidden="true"></span> Удалить' +
		'	</button>' +
		'</div>' +
		'');
};

// Вставить в элемент DOM $('#form') группу полей 'Опыт работы' --> 'Проекты' --> 'Технологии'
const addTechnologiesGroupItemToDOM = (buttonElem) => {
	const formTechnologiesGroupElem = buttonElem.parent();

	formTechnologiesGroupElem.append('' +
		'<div class="input-group" style="margin-bottom: 10px">' +
		'	<input type="text" class="form-control technologyField" placeholder="Технология">' +
		'	<span class="input-group-btn">' +
		'		<button class="btn btn-danger removeTechnologiesGroupItemToDOM" type="button">' +
		'			<span class="glyphicon glyphicon-minus" aria-hidden="true"></span>' +
		'		</button>' +
		'	</span>' +
		'</div>' +
		'');
};

// Вставить в элемент DOM $('#form') группу полей 'Образование'
const addEducationsGroupItemToDOM = () => {
	const formEducationsGroupElem = $('#form > form > #educationGroup');
	if (! formEducationsGroupElem.length) {
		return;
	}

	formEducationsGroupElem.append('' +
		'<div class="well well-sm educationsItem" style="margin-bottom: 20px">' +
		'	<input type="text" class="form-control universityNameField" style="margin-bottom: 10px" placeholder="University name (Название университета)" />' +
		'	<input type="text" class="form-control degreeField" style="margin-bottom: 10px" placeholder="Degree (Степень)" />' +
		'' +
		'	<button type="button" class="btn btn-danger removeEducationsGroupItemToDOM">' +
		'  		<span class="glyphicon glyphicon-minus" aria-hidden="true"></span> Удалить' +
		'	</button>' +
		'</div>' +
		'');
};

// Вставить в элемент DOM $('#form') группу полей 'Профессиональные навыки'
const addProfessionalSkillGroupItemToDOM = () => {
	const formProfessionalSkillGroupElem = $('#form > form > #professionalSkillGroup');
	if (! formProfessionalSkillGroupElem.length) {
		return;
	}

	formProfessionalSkillGroupElem.append('' +
		'<div class="input-group" style="margin-bottom: 10px">' +
		'	<input type="text" class="form-control" placeholder="Профессиональный навык">' +
		'	<span class="input-group-btn">' +
		'		<button class="btn btn-danger removeProfessionalSkillItemToDOM" type="button">' +
		'			<span class="glyphicon glyphicon-minus" aria-hidden="true"></span>' +
		'		</button>' +
		'	</span>' +
		'</div>' +
		'');
};

// Вставить в элемент DOM $('#form') группу полей 'Образование'
const addForeignLanguagesGroupItemToDOM = () => {
	const formForeignLanguagesGroupElem = $('#form > form > #foreignLanguagesGroup');
	if (! formForeignLanguagesGroupElem.length) {
		return;
	}

	formForeignLanguagesGroupElem.append('' +
		'<div class="well well-sm foreignLanguagesItem" style="margin-bottom: 20px">' +
		'	<input type="text" class="form-control languageField" style="margin-bottom: 10px" placeholder="Language (Название языка)" />' +
		'	<input type="text" class="form-control levelOfProficiencyField" ' +
		'			style="margin-bottom: 10px" placeholder="Level Of Proficiency (Уровень владения)" />' +
		'' +
		'	<button type="button" class="btn btn-danger removeForeignLanguagesGroupItemToDOM">' +
		'  		<span class="glyphicon glyphicon-minus" aria-hidden="true"></span> Удалить' +
		'	</button>' +
		'</div>' +
		'');
};

// Вставить в элемент DOM $('#form') группу полей 'Ссылки на open source проекты'
const addLinksToOpenSourceGroupItemToDOM = () => {
	const formLinksToOpenSourceGroupElem = $('#form > form > #linksToOpenSourceGroup');
	if (! formLinksToOpenSourceGroupElem.length) {
		return;
	}

	formLinksToOpenSourceGroupElem.append('' +
		'<div class="input-group" style="margin-bottom: 10px">' +
		'	<input type="text" class="form-control" placeholder="Ссылка на open source проект">' +
		'	<span class="input-group-btn">' +
		'		<button class="btn btn-danger removeLinksToOpenSourceGroupItemToDOM" type="button">' +
		'			<span class="glyphicon glyphicon-minus" aria-hidden="true"></span>' +
		'		</button>' +
		'	</span>' +
		'</div>' +
		'');
};

// Вставить в элемент DOM $('#form') группу полей 'Сторонние проекты'
const addOtherProjectsGroupItemToDOM = () => {
	const formOtherProjectsGroupElem = $('#form > form > #otherProjectsGroup');
	if (! formOtherProjectsGroupElem.length) {
		return;
	}

	formOtherProjectsGroupElem.append('' +
		'<div class="input-group" style="margin-bottom: 10px">' +
		'	<input type="text" class="form-control" placeholder="Сторонний проект">' +
		'	<span class="input-group-btn">' +
		'		<button class="btn btn-danger removeOtherProjectsGroupItemToDOM" type="button">' +
		'			<span class="glyphicon glyphicon-minus" aria-hidden="true"></span>' +
		'		</button>' +
		'	</span>' +
		'</div>' +
		'');
};

// Вставить в элемент DOM $('#form') группу полей 'Ссылки на социальные сети'
const addSocialNetworksGroupItemToDOM = () => {
	const formSocialNetworksGroupElem = $('#form > form > #socialNetworksGroup');
	if (! formSocialNetworksGroupElem.length) {
		return;
	}

	formSocialNetworksGroupElem.append('' +
		'<div class="input-group" style="margin-bottom: 10px">' +
		'	<input type="text" class="form-control" placeholder="Ссылки на социальные сети">' +
		'	<span class="input-group-btn">' +
		'		<button class="btn btn-danger removeSocialNetworksGroupItemToDOM" type="button">' +
		'			<span class="glyphicon glyphicon-minus" aria-hidden="true"></span>' +
		'		</button>' +
		'	</span>' +
		'</div>' +
		'');
};


// DOM callbacks
$('#logout').click((event) => {
	event.preventDefault();

	Request.post('/api/auth/logout')
		.then(() => {
			window.location = '/';
		});
});

$('.addProjectExperienceFormGroupItemToDOM').click(() => {
	addProjectExperienceFormGroupItemToDOM();
});

$('.addEducationsGroupItemToDOM').click(() => {
	addEducationsGroupItemToDOM();
});

$('.addProfessionalSkillGroupItemToDOM').click(() => {
	addProfessionalSkillGroupItemToDOM();
});

$('.addForeignLanguagesGroupItemToDOM').click(() => {
	addForeignLanguagesGroupItemToDOM();
});

$('.addLinksToOpenSourceGroupItemToDOM').click(() => {
	addLinksToOpenSourceGroupItemToDOM();
});

$('.addOtherProjectsGroupItemToDOM').click(() => {
	addOtherProjectsGroupItemToDOM();
});

$('.addSocialNetworksGroupItemToDOM').click(() => {
	addSocialNetworksGroupItemToDOM();
});

$(document).on('click', '.addProjectGroupItemToDOM', function () {
	const buttonElem = $(this);
	addProjectGroupItemToDOM(buttonElem);
});

$(document).on('click', '.addTechnologiesGroupItemToDOM', function () {
	const buttonElem = $(this);
	addTechnologiesGroupItemToDOM(buttonElem);
});

// ----

$(document).on('click', '.removeProjectExperienceFormGroupItemToDOM', function () {
	$(this).parent().remove();
});

$(document).on('click', '.removeOtherProjectsGroupItemToDOM', function () {
	$(this)
		.parent()
		.parent()
		.remove();
});

$(document).on('click', '.removeTechnologiesGroupItemToDOM', function () {
	$(this)
		.parent()
		.parent()
		.remove();
});

$(document).on('click', '.removeEducationsGroupItemToDOM', function () {
	$(this).parent().remove();
});

$(document).on('click', '.removeProfessionalSkillItemToDOM', function () {
	$(this)
		.parent()
		.parent()
		.remove();
});

$(document).on('click', '.removeForeignLanguagesGroupItemToDOM', function () {
	$(this).parent().remove();
});

$(document).on('click', '.removeLinksToOpenSourceGroupItemToDOM', function () {
	$(this)
		.parent()
		.parent()
		.remove();
});

$(document).on('click', '.removeSocialNetworksGroupItemToDOM', function () {
	$(this)
		.parent()
		.parent()
		.remove();
});

// ----

// Сериализация данных формы
const getSerializedDataOfForm = () => {
	const serializedData = {
		fullExperience: $('.fullExperienceField').val(),
		expectedSalary: $('.expectedSalaryField').val(),
		regionWorkLocation: $('.regionWorkLocationField').val(),
		remote: $('.remoteField').is(':checked'),
		citizenship: $('.citizenshipField').val(),
		employmentType: $('.employmentTypeField').val(),
		projectExperiences: [],
		educations: [],
		professionalSkills: [],
		foreignLanguages: [],
		linksToOpenSources: [],
		otherProjects: [],
		socialNetworks: [],
	};

	// Проходимся по 'Опыт работы'
	$('#projectExperienceGroup .projectExperienceItem').each(function () {
		const projectExperience = {
			companyName: $(this).find('.companyNameField').val(),
			position: $(this).find('.positionField').val(),
			startDate: $(this).find('.startDateField').val(),
			endDate: $(this).find('.endDateField').val(),
			projects: [],
		};

		// Проходимся по 'Опыт работы' ---> Проекты
		$(this).find('.projectItem').each(function () {
			const project = {
				description: $(this).find('.descriptionField').val(),
				responsibility: $(this).find('.responsibilityField').val(),
				projectLength: $(this).find('.projectLengthField').val(),
				technologies: [],
			};
			projectExperience.projects.push(project);

			// Проходимся по 'Опыт работы' ---> Проекты ---> Технологии
			$(this).find('.projectItem').find('.technologiesGroup').each(function () {
				project.technologies.push($(this).find('.technologyField').val());
			});
		});

		serializedData.projectExperiences.push(projectExperience);
	});

	// Проходимся по 'Образование'
	$('#educationGroup .educationsItem').each(function () {
		const education = {
			universityName: $(this).find('.universityNameField').val(),
			degree: $(this).find('.degreeField').val(),
		};

		serializedData.educations.push(education);
	});

	// Проходимся по 'Профессиональные навыки'
	$('#professionalSkillGroup input').each(function () {
		serializedData.professionalSkills.push($(this).val());
	});

	// Проходимся по 'Иностранные языки'
	$('#foreignLanguagesGroup .foreignLanguagesItem').each(function () {
		const foreignLang = {
			language: $(this).find('.languageField').val(),
			levelOfProficiency: $(this).find('.levelOfProficiencyField').val(),
		};

		serializedData.foreignLanguages.push(foreignLang);
	});

	// Проходимся по 'Ссылки на open source проекты'
	$('#linksToOpenSourceGroup input').each(function () {
		serializedData.linksToOpenSources.push($(this).val());
	});

	// Проходимся по 'Сторонние проекты'
	$('#otherProjectsGroup input').each(function () {
		serializedData.otherProjects.push($(this).val());
	});

	// Проходимся по 'Ссылки на социальные сети'
	$('#socialNetworksGroup input').each(function () {
		serializedData.socialNetworks.push($(this).val());
	});

	return serializedData;
};

// ----

class Design {
	constructor(markupCount, markupLimit) {
		this.markupCount = markupCount;
		this.markupLimit = markupLimit === Infinity ? 0 : markupLimit;

		// Потребуется в this.mode = 'link':
		// - четное нажатие для оценки кода;
		// - нечетное нажатие для оценки алгоритма.
		// Начинать с единицы!
		this.keyupCounter = 1;

		this.mode = null;
		// Определяем в каком режиме запущен фронт
		if ($('#answer-form').length) {
			this.mode = 'form';
		} else if ($('#answer-code').length && $('#answer-algorithm').length) {
			this.mode = 'link';
		} else {
			// Значит на странице существует элемент $('#answer')
			this.mode = 'site';
		}

		this.focusedInput = false;
		// Запоминаем весит ли фокус на полях формы или нет нужно чтоб понять оценивать или нет (по нажатию клавиш цифр)

		$(document).on('focus', 'input, textarea, select', () => {
			// Тут обязательно юзаем функцию ссылочного типа, чтою this был экземпляр класса Design
			this.focusedInput = true;
		});
		$(document).on('blur', 'input, textarea, select', () => {
			// Тут обязательно юзаем функцию ссылочного типа, чтою this был экземпляр класса Design
			this.focusedInput = false;
		});

		$(window).on('keyup', (event) => {
			// Проверка находимся ли мы в режиме редактирования поля или нет
			if (this.focusedInput) {
				return;
			}

			let { keyCode } = event;
			const xKeyCode = 'X'.charCodeAt(0);

			// numpad
			if (keyCode >= 96 && keyCode <= 105) {
				keyCode -= 96 - 48;
			}

			if (
				(keyCode >= 48 && keyCode <= 57) ||
				keyCode === xKeyCode
			) {
				event.preventDefault();

				if (keyCode === xKeyCode) {
					if (this.task.siteStatus === 'approved') {
						alert(signs.site_approved);
						return;
					}
					this.answer = 0;
				} else if (keyCode === 48) {
					this.answer = 10;
				} else {
					this.answer = keyCode - 48;
				}

				this.keyupCounter += 1;

				if (this.mode === 'form') {
					$('#answer-form').text(this.answer || 'X');

					const $mark = $(`<div class="mark">${this.answer || 'X'}</div>`);
					$mark.appendTo('body');
					$mark.animate({
						width: 0,
						height: 0,
						margin: 0,
						opacity: 0,
						fontSize: 0,
						lineHeight: 0,
					}, 1000, () => $mark.remove());
				} else if (this.mode === 'link') {
					if (this.keyupCounter % 2 === 0) {
						$('#answer-code').text(this.answer || 'X');
						this.answerCode = this.answer;
					} else {
						$('#answer-algorithm').text(this.answer || 'X');
						this.answerAlgorithm = this.answer;
					}

					const $mark = $(`<div class="mark">${this.answer || 'X'}</div>`);
					$mark.appendTo('body');
					$mark.animate({
						width: 0,
						height: 0,
						margin: 0,
						opacity: 0,
						fontSize: 0,
						lineHeight: 0,
					}, 1000, () => $mark.remove());

					// Сброс
					this.answer = null;
				} else {
					// т.е. this.mode = 'site'
					$('#answer').text(this.answer || 'X');

					const $mark = $(`<div class="mark">${this.answer || 'X'}</div>`);
					$mark.appendTo('body');
					$mark.animate({
						width: 0,
						height: 0,
						margin: 0,
						opacity: 0,
						fontSize: 0,
						lineHeight: 0,
					}, 1000, () => $mark.remove());
				}
			}
		});

		this.next();
	}


	show() {
		if (this.mode === 'form') {
			$('#answer-form').text('-');
		} else if (this.mode === 'link') {
			$('#answer-code').text('-');
			$('#answer-algorithm').text('-');
		} else {
			// т.е. this.mode = 'site'
			$('#answer').text('-');
		}


		$('#markup-count').text(this.markupCount);

		if (this.task.entityMode === 'site') {
			$('#image')
				.attr('src', `/api/site/${this.task.siteId}/screenshot`);
			$('#link').hide();
			$('#form').hide();
		} else if (this.task.entityMode === 'link') {
			$('#image').hide();
			$('#link > a')
				.attr('href', this.task.siteUrl)
				.text(this.task.siteUrl);
			$('#form').hide();
		} else if (this.task.entityMode === 'form') {
			$('#image').hide();
			$('#link').hide();
			$('#form > #formTitle')
				.text(this.task.siteUrl);
		}

		this.answer = null;
	}


	// Получение новой задачи
	next() {
		if (this.markupLimit && this.markupCount >= this.markupLimit) {
			$(window).off('keyup');
			$('#root').hide();
			$('#overdose').show();
		}

		Request.post('/api/assessment/create', { data: { activeTaskSetId } })
			.then((task) => {
				// Сброс this.keyupCounter
				this.keyupCounter = 1;

				// User has no more tasks
				if (task.limitReached) {
					$(window).off('keyup');
					$('#root').hide();
					$('#overdose').show();
				} else {
					this.task = task;
					this.show();
				}
			})
			.catch((error) => {
				if (error.message === 'active_taskset_changed') {
					window.location.href = '/dashboard';
				} else {
					alert(signs.get_new_task_error);
				}
			});
	}

	// Сохранение выбора пользователя
	save() {
		let payload = {};

		if (this.mode === 'form') {
			const serializedDataOfForm = getSerializedDataOfForm();

			payload = {
				activeTaskSetId,
				siteId: this.task.siteId,
				answer: this.answer,
				form: serializedDataOfForm,
			};
		} else if (this.mode === 'link') {
			payload = {
				activeTaskSetId,
				siteId: this.task.siteId,
				answerCode: this.answerCode,
				answerAlgorithm: this.answerAlgorithm,
			};
		} else {
			// т.е. this.mode = 'site'
			payload = {
				activeTaskSetId,
				siteId: this.task.siteId,
				answer: this.answer,
			};
		}

		Request.post('/api/assessment/answer', { data: payload })
			.then((taskId) => {
				this.markupCount++;
				this.task.id = taskId;
				this.prev = this.task;
				this.next();
			})
			.catch((error) => {
				if (error.message === 'active_taskset_changed') {
					window.location.href = '/dashboard';
				}
			});
	}

	// Возврат к предыдущей задаче
	undo() {
		if (! this.prev) {
			return;
		}

		Request.post(`/api/assessment/${this.prev.id}/undo`, { data: { activeTaskSetId } })
			.then(() => {
				// Сброс this.keyupCounter
				this.keyupCounter = 1;

				this.markupCount--;
				this.task = this.prev;
				this.prev = null;
				this.show();
			})
			.catch((error) => {
				if (error.message === 'active_taskset_changed') {
					window.location.href = '/dashboard';
				}
			});
	}


	// Инициализация горячих клавиш
	hotkeys(keys = {}) {
		$(window).on('keyup', (event) => {
			// Сохранить
			if (event.keyCode === keys.save) {
				event.preventDefault();

				if (this.mode === 'form') {
					if (this.answer != null) {
						this.save();
					} else {
						alert(signs.no_mark_specified);
					}
				} else if (this.mode === 'link') {
					if ((this.answerCode != null) && (this.answerAlgorithm != null)) {
						this.save();
					} else {
						alert(signs.no_mark_specified);
					}
				} else {
					// т.е. this.mode = 'site'
					// if внутри ветки else для читаемости!
					// eslint-disable-next-line no-lonely-if
					if (this.answer != null) {
						this.save();
					} else {
						alert(signs.no_mark_specified);
					}
				}
			}

			// Возврат к предыдущей задаче
			if (event.keyCode === keys.undo) {
				event.preventDefault();
				this.undo();
			}
		});
	}
}

const design = new Design(window.markupCount, window.markupLimit);
design.hotkeys({
	save: 13,
	undo: 8,
});
