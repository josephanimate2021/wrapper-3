const formidable = require("formidable");
const fUtil = require("../misc/file");
const parse = require("../movie/parse");
const http = require("http");
const fs = require("fs");

/**
 * @param {http.IncomingMessage} req
 * @param {http.ServerResponse} res
 * @param {import("url").UrlWithParsedQuery} url
 * @returns {boolean}
 */
module.exports = function (req, res, url) {
	if (req.method != "POST" || url.path != "/upload_starter") return;
	new formidable.IncomingForm().parse(req, (e, f, files) => {
		if (!files.import) return;
		var path = files.import.path;
		var buffer = fs.readFileSync(path);
		var numId = fUtil.getNextFileId("starter-", ".xml");
		parse.unpackXml(buffer, `s-${numId}`);
		fs.unlinkSync(path);

		res.statusCode = 302;
		var url = `/html/list/starters.html`;
		res.setHeader("Location", url);
		res.end();
	});
	return true;
};
