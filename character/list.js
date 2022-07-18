const movie = require("../movie/main");
const character = require("./main");
const http = require("http");

/**
 * @param {http.IncomingMessage} req
 * @param {http.ServerResponse} res
 * @param {import("url").UrlWithParsedQuery} url
 * @returns {boolean}
 */
module.exports = function (req, res, url) {
	if (req.method != "GET" || url.pathname != "/charList") return;
	Promise.all(movie.listCharacters().map(character.meta)).then((a) => res.end(JSON.stringify(a)));
	return true;
};
