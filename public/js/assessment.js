/* eslint-disable no-alert */

import $ from 'jquery';
import Request from './request';

import '../css/assessment.css';


window.$ = $;
window.jQuery = $;

// Texts from back-end
const { signs, activeTaskSetId } = window;


$('#logout').click((event) => {
	event.preventDefault();

	Request.post('/api/auth/logout')
		.then(() => {
			window.location = '/';
		});
});


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

		$(window).on('keyup', (event) => {
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
				} else if (this.mode === 'link') {
					if (this.keyupCounter % 2 === 0) {
						$('#answer-code').text(this.answer || 'X');
						this.answerCode = this.answer;
					} else {
						$('#answer-algorithm').text(this.answer || 'X');
						this.answerAlgorithm = this.answer;
					}

					// Сброс
					this.answer = null;
				} else {
					// т.е. this.mode = 'site'
					$('#answer').text(this.answer || 'X');
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
			}
		});

		this.next();
	}


	show() {
		if (this.mode === 'form') {
			$('#answer').text('-');
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
			$('#form > p')
				.text(this.task.siteFormText);
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
			payload = {
				activeTaskSetId,
				siteId: this.task.siteId,
				answer: this.answer,
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
					if (this.answer) {
						this.save();
					} else {
						alert(signs.no_mark_specified);
					}
				} else if (this.mode === 'link') {
					if (this.answerCode && this.answerAlgorithm) {
						this.save();
					} else {
						alert(signs.no_mark_specified);
					}
				} else {
					// т.е. this.mode = 'site'
					// if внутри ветки else для читаемости!
					// eslint-disable-next-line no-lonely-if
					if (this.answer) {
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
