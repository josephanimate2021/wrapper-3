const loadPost = require("../misc/post_body");
const movie = require("./main");
const starter = require("../starter/main");
const http = require("http");
const fs = require("fs");

/**
 * @param {http.IncomingMessage} req
 * @param {http.ServerResponse} res
 * @param {import("url").UrlWithParsedQuery} url
 * @returns {boolean}
 */
module.exports = function (req, res, url) {
	var thumb;
	if (req.method != "POST") return;
	switch (url.pathname) {
		case "/goapi/saveMovie/": {
			loadPost(req, res).then(([data, mId]) => {
				const trigAutosave = data.is_triggered_by_autosave;
				if (trigAutosave && !data.movieId ) {
					thumb = fs.readFileSync(process.env.THUMB_BASE_URL + "/285747869.jpg");
				} else {
					thumb = data.thumbnail_large && Buffer.from(data.thumbnail_large, "base64");
				}

				var body = Buffer.from(data.body_zip, "base64");
				movie.save(body, thumb, mId, data.presaveId).then((nId) => res.end("0" + nId));
			});
			return true;
		}
		case "/goapi/saveTemplate/": {
			loadPost(req, res).then(([data]) => {
				thumb = data.thumbnail_large && Buffer.from(data.thumbnail_large, "base64");
				var body = Buffer.from(data.body_zip, "base64");
				starter.save(body, thumb).then((nId) => res.end("0" + nId));
			});
			return true;
		}
	}
};
