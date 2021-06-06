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
		});

		this.next();
	}


	show() {
		$('#answer').text('-');

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
		Request.post('/api/assessment/answer', {
			data: {
				activeTaskSetId,
				siteId: this.task.siteId,
				answer: this.answer,
			},
		})
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

				if (this.answer != null) {
					this.save();
				} else {
					alert(signs.no_mark_specified);
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
