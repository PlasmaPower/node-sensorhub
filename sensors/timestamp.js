exports.getCSVheader = function () {
	return ['unixTimestamp'];
};

exports.getValues = function () {
	return [Math.floor(new Date() / 1000)];
};
