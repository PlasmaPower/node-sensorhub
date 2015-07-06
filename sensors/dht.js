var dhtlib = require('node-dht-sensor');

var dht_type = 22, dht_pin = 4;

exports.init = function () {
	dhtlib.initialize(dht_type, dht_pin);
};

exports.getCSVheader = function () {
	return ['DHThumidity', 'DHTtemperature'];
};

exports.getValues = function () {
	var values = dhtlib.read();
	return [values.humidity.toFixed(2), values.temperature.toFixed(2)];
};

