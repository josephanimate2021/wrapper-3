const http = require("http");
const fs = require("fs");

/**
 * @param {http.IncomingMessage} req
 * @param {http.ServerResponse} res
 * @param {import("url").UrlWithParsedQuery} url
 * @returns {boolean}
 */
module.exports = function (req, res, url) {
	var path = url.pathname;
	if (req.method != "GET" || !path.startsWith("/stock_thumbs")) return;
	fs.readFileSync(process.env.THUMB_BASE_URL + path.substr(path.lastIndexOf("/"))).then((v) => res.end(v));
	return true;
};
