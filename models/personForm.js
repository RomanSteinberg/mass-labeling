const mongoose = require('mongoose');


// Схема: Проект
const ProjectDescriptionSchema = new mongoose.Schema({
	// Описание проекта
	description: {
		type: String,
	},

	// Обязанности
	responsibility: {
		type: String,
	},

	// Длительность проекта
	projectLength: {
		type: Number,
	},

	// Технологии
	technologies: [String],
});

// Схема: Опыт работы
const ProjectExperienceSchema = new mongoose.Schema({
	// Название компании
	companyName: {
		type: String,
		required: true,
	},

	// Должность
	position: {
		type: String,
		required: true,
	},

	// Начало работы в компании
	startDate: {
		type: Date,
	},

	// Конец работы в компании
	endDate: {
		type: Date,
	},

	// Проекты
	projectsDescription: [ProjectDescriptionSchema],
});

// Схема: Иностранные языки
const ForeignLanguageSchema = new mongoose.Schema({
	// Название языка
	language: {
		type: String,
		required: true,
	},

	// Уровень владения
	levelOfProficiency: {
		type: String,
	},
});

// Схема: Образование
const EducationSchema = new mongoose.Schema({
	// Название университета
	universityName: {
		type: String,
	},

	// Степень
	degree: {
		type: String,
	},
});

// Схема: Анкета
const PersonFormSchema = new mongoose.Schema({
	// Опыт работы
	projectExperience: [ProjectExperienceSchema],

	// Полный опыт работы
	fullExperience: {
		type: Number,
	},

	// Ожидаемая зарплата
	expectedSalary: {
		type: Number,
	},

	// Регион места работы
	regionWorkLocation: {
		type: String,
	},

	// Удаленка
	remote: {
		type: Boolean,
	},

	// Гражданство
	citizenship: {
		type: String,
	},

	// Занятость
	employmentType: {
		type: String,
	},

	// Образование
	Educations: [EducationSchema],

	// Профессиональные навыки
	professionalSkills: [String],

	// Иностранные языки
	foreignLanguages: [ForeignLanguageSchema],

	// Ссылки на open source проекты
	linksToOpenSource: [String],

	// Сторонние проекты
	otherProjects: [String],

	// Ссылки на социальные сети
	socialNetworks: [String],
});


module.exports = mongoose.model('PersonForm', PersonFormSchema);
