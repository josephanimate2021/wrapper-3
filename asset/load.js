const loadPost = require("../misc/post_body");
const asset = require("./main");
const character = require("../character/main");
const http = require("http");

/**
 * @param {http.IncomingMessage} req
 * @param {http.ServerResponse} res
 * @param {import("url").UrlWithParsedQuery} url
 * @returns {boolean}
 */
module.exports = function (req, res, url) {
	switch (req.method) {
		case "GET": {
			const match = req.url.match(/\/(assets|goapi\/getAsset)\/([^/]+)\/([^.]+)(?:\.xml)?$/);
			if (!match) return;

			const mId = match[1];
			const aId = match[2];
			const b = asset.load(mId, aId);
			if (b) {
				res.statusCode = 200;
				res.end(b);
			} else {
				res.statusCode = 404;
				res.end(e);
			}
			const charMatch = req.url.match(/\/characters\/([^.]+)(?:\.xml)?$/);
			if (!charMatch) return;

			var id = charMatch[1];
			res.setHeader("Content-Type", "text/xml");
			character
				.load(id)
				.then((v) => {
					(res.statusCode = 200), res.end(v);
				})
				.catch((e) => {
					(res.statusCode = 404), res.end(e);
				});
			return true;
		}

		case "POST": {
			switch (url.pathname) {
				case "/goapi/getAsset/":
				case "/goapi/getAssetEx/": {
					loadPost(req, res).then(([data, mId]) => {
						const aId = data.assetId || data.enc_asset_id;

						const b = asset.load(mId, aId);
						if (b) {
							res.setHeader("Content-Length", b.length);
							res.setHeader("Content-Type", "audio/mp3");
							res.end(b);
						} else {
							res.statusCode = 404;
							res.end();
						}
					});
					return true;
				}
				case "/goapi/deleteAsset/": {
					loadPost(req, res).then(async ([data, mId]) => {
						const aId = data.assetId || data.enc_asset_id;
						const c = character.delete(data.assetId || data.original_asset_id);
						const ct = character.deleteThumb(data.assetId || data.original_asset_id);
						const b = asset.delete(mId, aId);
						if (data.original_asset_id) {
							if (c, ct) {
								res.end(c, ct);
							} else {
								res.statusCode = 404;
								res.end();
							}
						} else {
							if (b) {
								res.end(b);
							} else {
								res.statusCode = 404;
								res.end();
							}
						}
					});
					return true;
				}
				case "/goapi/deleteUserTemplate/": {
					console.log('Please delete your starter in html form.');
					return true;
				}
				default:
					return;
			}
		}
		default:
			return;
	}
};
