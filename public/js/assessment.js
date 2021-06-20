/* eslint-disable no-alert */

import $ from 'jquery';
import Request from './request';

import '../css/assessment.css';


window.$ = $;
window.jQuery = $;

// Texts from back-end
const { signs, activeTaskSetId } = window;

// Get URL query parameter
const getUrlQueryParameter = function getUrlParameter(sParam) {
	const sPageURL = window.location.search.substring(1);
	const sURLVariables = sPageURL.split('&');
	let sParameterName;
	let i;

	for (i = 0; i < sURLVariables.length; i++) {
		sParameterName = sURLVariables[i].split('=');

		if (sParameterName[0] === sParam) {
			// eslint-disable-next-line valid-typeof
			return typeof sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
		}
	}
	return false;
};

// Вставить в элемент DOM $('#form') группу полей 'Опыт работы'
const addProjectExperienceFormGroupItemToDOM = () => {
	const formProjectExperienceGroupElem = $('#form > form > #projectExperienceGroup');
	if (! formProjectExperienceGroupElem.length) {
		return;
	}

	formProjectExperienceGroupElem.append('' +
		'<div class="well well-sm projectExperienceItem" style="margin-bottom: 20px">' +
		'   <p>' + signs.company_name + '</p>' +
		'	<input type="text" class="form-control companyNameField" style="margin-bottom: 10px" />' +
		'   <p>' + signs.position + '</p>' +
		'	<input type="text" class="form-control positionField" style="margin-bottom: 10px" />' +
		'	<p>' + signs.start_date + '</p>' +
		'	<input type="date" class="form-control startDateField" style="margin-bottom: 10px" />' +
		'	<p>' + signs.end_date + '</p>' +
		'	<input type="date" class="form-control endDateField" style="margin-bottom: 10px" />' +
		'' +
		'	<!-- Проекты (Projects)-->' +
		'	<h3 style="margin-bottom: 10px">' + signs.projects + '</h3>' +
		'	<div class="projectsGroup" style="margin-bottom: 25px">' +
		'		<button type="button" class="btn btn-primary addProjectGroupItemToDOM" style="margin-bottom: 10px">' +
		'			<span class="glyphicon glyphicon-plus" aria-hidden="true"></span> ' + signs.add +
		'		</button>' +
		'	</div>' +
		'	<!-- /Проект (Projects)-->' +
		'' +
		'	<button type="button" class="btn btn-danger removeProjectExperienceFormGroupItemToDOM">' +
		'  		<span class="glyphicon glyphicon-minus" aria-hidden="true"></span> ' + signs.delete +
		'	</button>' +
		'</div>' +
		'');
};

// Вставить в элемент DOM $('#form') группу полей 'Опыт работы' --> 'Проекты'
const addProjectGroupItemToDOM = (buttonElem) => {
	const formProjectsGroupElem = buttonElem.parent();

	formProjectsGroupElem.append('' +
		'<div class="well well-sm projectItem" style="margin-bottom: 20px">' +
		'   <p>' + signs.description + '</p>' +
		'	<input type="text" class="form-control descriptionField" style="margin-bottom: 10px" />' +
		'   <p>' + signs.responsibility + '</p>' +
		'	<input type="text" class="form-control responsibilityField" style="margin-bottom: 10px" />' +
		'   <p>' + signs.project_length + '</p>' +
		'	<input type="number" class="form-control projectLengthField" style="margin-bottom: 10px" />' +
		'' +
		'	<h4 style="margin-bottom: 10px">' + signs.technologies + '</h4>' +
		'	<div class="technologiesGroup" style="margin-bottom: 25px">' +
		'		<button type="button" class="btn btn-primary addTechnologiesGroupItemToDOM" style="margin-bottom: 10px">' +
		'			<span class="glyphicon glyphicon-plus" aria-hidden="true"></span> ' + signs.add +
		'		</button>' +
		'	</div>' +
		'' +
		'	<button type="button" class="btn btn-danger removeProjectExperienceFormGroupItemToDOM">' +
		'  		<span class="glyphicon glyphicon-minus" aria-hidden="true"></span> ' + signs.delete +
		'	</button>' +
		'</div>' +
		'');
};

// Вставить в элемент DOM $('#form') группу полей 'Опыт работы' --> 'Проекты' --> 'Технологии'
const addTechnologiesGroupItemToDOM = (buttonElem) => {
	const formTechnologiesGroupElem = buttonElem.parent();

	formTechnologiesGroupElem.append('' +
		'<div class="input-group" style="margin-bottom: 10px">' +
		'	<input type="text" class="form-control technologyField">' +
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
		'   <p>' + signs.university_name + '</p>' +
		'	<input type="text" class="form-control universityNameField" style="margin-bottom: 10px" />' +
		'   <p>' + signs.degree + '</p>' +
		'	<input type="text" class="form-control degreeField" style="margin-bottom: 10px" />' +
		'' +
		'	<button type="button" class="btn btn-danger removeEducationsGroupItemToDOM">' +
		'  		<span class="glyphicon glyphicon-minus" aria-hidden="true"></span> ' + signs.delete +
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
		'	<input type="text" class="form-control">' +
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
		'   <p>' + signs.language + '</p>' +
		'	<input type="text" class="form-control languageField" style="margin-bottom: 10px" />' +
		'   <p>' + signs.level_of_proficiency + '</p>' +
		'	<input type="text" class="form-control levelOfProficiencyField" style="margin-bottom: 10px" />' +
		'' +
		'	<button type="button" class="btn btn-danger removeForeignLanguagesGroupItemToDOM">' +
		'  		<span class="glyphicon glyphicon-minus" aria-hidden="true"></span> ' + signs.delete +
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
		'	<input type="text" class="form-control" />' +
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
		'	<input type="text" class="form-control" />' +
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
		'	<input type="text" class="form-control" />' +
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
		fullname: $('.fullnameField').val(),
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

// Установка данных формы
const setFormData = (form) => {
	$('.fullnameField').val(form.fullname);
	$('.fullExperienceField').val(form.fullExperience);
	$('.expectedSalaryField').val(form.expectedSalary);
	$('.regionWorkLocationField').val(form.regionWorkLocation);
	$('.remoteField').prop('checked', form.remote);
	$('.citizenshipField').val(form.citizenship);
	$('.employmentTypeField').val(form.employmentType);


	// Проходимся по 'Опыт работы'

	// Проходимся по 'Опыт работы' ---> Проекты

	// Проходимся по 'Опыт работы' ---> Проекты ---> Технологии

	// Проходимся по 'Образование'

	// Проходимся по 'Профессиональные навыки'

	// Проходимся по 'Иностранные языки'

	// Проходимся по 'Ссылки на open source проекты'

	// Проходимся по 'Сторонние проекты'

	// Проходимся по 'Ссылки на социальные сети'
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

			// Проверка 'добавление данных' или 'оценивание'
			if (getUrlQueryParameter('mode') === 'addform') {
				// Тупо выход, так как оценку запоминать не нужно
				return;
			}

			// Иначе оценивание
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

		// Проверка 'добавление данных' или 'оценивание'
		if (getUrlQueryParameter('mode') === 'addform') {
			// Тупо выход, так как оценку запоминать не нужно
			// и скрываем элемент #formIdWraper
			$('#formIdWraper').hide();
			return;
		}

		// Иначе оценивание
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
			$('#form > #formIdWraper > span')
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

					if (this.mode === 'form' && task.form) {
						setFormData(task.form);
					}

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
				form: serializedDataOfForm,
			};

			// Проверка 'добавление данных' или 'оценивание'
			if (getUrlQueryParameter('mode') === 'addform') {
				Request.post('/api/assessment/create-new-form', { data: payload })
					.then(() => {
						// Сброс формы, через перезагрузку текущей страницы
						document.location.reload();
					})
					.catch((error) => {
						if (error.message === 'active_taskset_changed') {
							window.location.href = '/dashboard';
						} else {
							alert(signs.set_form_data_error);
						}
					});

				// Выход
				return;
			}

			// иначе оценивание
			payload = {
				activeTaskSetId,
				siteId: this.task.siteId,
				answer: this.answer,
				form: serializedDataOfForm,
			};
			// и запоминание пред формы
			this.task.form = serializedDataOfForm;
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

				if (this.mode === 'form' && this.task.form) {
					setFormData(this.task.form);
				}

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
					// Проверка 'добавление данных' или 'оценивание'
					if (getUrlQueryParameter('mode') === 'addform') {
						// Тупо сохранение и выход
						this.save();
						return;
					}

					// Иначе оценка

					if (this.answer != null && (this.answer >= 1 && this.answer <= 10)) {
						this.save();
					} else {
						alert(signs.no_mark_specified_form);
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
