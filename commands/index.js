/* eslint-disable global-require */


module.exports = (program) => {
	require('./export/answers')(program.command('export:answers'));
	require('./export/answers-links')(program.command('export:answers-links'));
	require('./export/answers-forms')(program.command('export:answers-forms'));
	require('./import/dataset')(program.command('import:dataset'));
	require('./import/modelRates')(program.command('import:modelRates'));
	require('./user/create')(program.command('user:create'));
	require('./locale/createLanguageFile')(program.command('locale:create'));
	require('./locale/syncLocaleFiles')(program.command('locale:sync'));
	require('./locale/regNewSign')(program.command('locale:new'));
};
