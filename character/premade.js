module.exports = function (req, res, url) {
	if (req.method != "POST" || url.path != "/goapi/getCCPreMadeCharacters") return;
	res.end();
	return true;
};
