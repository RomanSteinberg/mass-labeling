'use strict';


$('#logout').click((event) => {
	event.preventDefault();

	window.Request.post('/auth/logout')
		.then(() => {
			window.location = '/';
		});
});


class Design {
	constructor(markupCount, markupLimit) {
		this.markupCount = markupCount;
		this.markupLimit = markupLimit;

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
						alert('Сайт одобрен разработчиками');
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

		$('#image').attr('src', `/site/${this.task.siteId}/screenshot`);

		this.answer = null;
	}


	// Получение новой задачи
	next() {
		if (this.markupLimit && this.markupCount >= this.markupLimit) {
			$(window).off('keyup');
			$('#root').hide();
			$('#overdose').show();
		}

		window.Request.post('/markup/create')
			.then((task) => {
				this.task = task;
				this.show();
			})
			.catch(() => {
				alert('Ошибка получения новой задачи');
			});
	}

	// Сохранение выбора пользователя
	save() {
		window.Request.post('/markup/answer', {
			data: {
				siteId: this.task.siteId,
				answer: this.answer,
			},
		})
			.then((taskId) => {
				this.markupCount++;
				this.task.id = taskId;
				this.prev = this.task;
				this.next();
			});
	}

	// Возврат к предыдущей задаче
	undo() {
		if (! this.prev) {
			return;
		}

		window.Request.post(`/markup/${this.prev.id}/undo`)
			.then(() => {
				this.markupCount--;
				this.task = this.prev;
				this.prev = null;
				this.show();
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
					alert('Вы не выставили отметку');
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