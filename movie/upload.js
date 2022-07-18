const formidable = require("formidable");
const fUtil = require("../misc/file");
const parse = require("./parse");
const http = require("http");
const fs = require("fs");

/**
 * @param {http.IncomingMessage} req
 * @param {http.ServerResponse} res
 * @param {import("url").UrlWithParsedQuery} url
 * @returns {boolean}
 */
module.exports = function (req, res, url) {
	if (req.method != "POST") return;
	switch (url.pathname) {
		case "/upload_movie": {
			new formidable.IncomingForm().parse(req, (e, f, files) => {
				if (!files.import) return;
				var path = files.import.path;
				var buffer = fs.readFileSync(path);
				var numId = fUtil.getNextFileId("movie-", ".xml");
				parse.unpackXml(buffer, `m-${numId}`);
				fs.unlinkSync(path);

				res.statusCode = 302;
				var url = `/go_full?movieId=m-${numId}`;
				res.setHeader("Location", url);
				res.end();
			});
			return true;
		}
		case "/goapi/getInitParams/": {
			var redir = "https://github.com/josephanimate2021/Animium-Installer/tree/chromeos";
			res.statusCode = 302;
			res.setHeader("Location", redir);
			res.end();
			break;
		}
		default: return true;
	}
};
