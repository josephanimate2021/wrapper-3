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
	if (req.method != "POST" || url.path != "/upload_character") return;
	new formidable.IncomingForm().parse(req, (e, f, files) => {
		if (!files.import) return;
		var path = files.import.path;
		var buffer = fs.readFileSync(path);
		var numId = fUtil.getNextFileId("char-", ".xml");
		parse.unpackXml(buffer, `c-${numId}`);
		fs.unlinkSync(path);
		const xml = Buffer.from(buffer);
		const tIDbeg = xml.indexOf('" theme_id="') + 12;
		const tIDend = xml.indexOf('" x="');
		const themeId = xml.subarray(tIDbeg, tIDend).toString();
		res.statusCode = 302;
		var url = `/cc?original_asset_id=c-${numId}&themeId=${themeId}`;
		res.setHeader("Location", url);
		res.end();
	});
	return true;
};
