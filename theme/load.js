const loadPost = require('./postBody');
const folder = process.env.THEME_FOLDER;
const fUtil = require('../misc/file');

module.exports = function (req, res, url) {
	if (req.method != 'POST' || url.path != '/goapi/getTheme/') return;
	loadPost(req, res).then(data => {
		var theme = data.themeId;
		res.setHeader('Content-Type', 'application/zip');
		fUtil.zippy(`${folder}/${theme}.xml`, 'theme.xml').then(b => res.end(b));
	});
	return true;
}
