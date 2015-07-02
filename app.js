var ADC = require('adc-pi-gpio');
var async = require('async');
var path = require('path');
var fs = require('fs');
var adc = new ADC({
	tolerance : 2,
	interval : 300,
	channels : [0, 1, 2, 3, 4, 5, 6, 7],
	SPICLK: 12,
	SPIMISO: 16,
	SPIMOSI: 18,
	SPICS: 22
});

process.on('SIGTERM', function(){
    adc.close();
});

process.on('SIGINT', function(){
    adc.close();
});

function flatten (deepArray) {
	return [].concat.apply([], deepArray);
}

var now = Date.now();
var filename = 'data_' + date.toISOString() + '.csv';

var sensors = [];

fs.readdir(path.join(__dirname, 'sensors'), function (files) {
	files.forEach(function(file) {
		sensors.push(require('./sensors/' + file));
	});
	sensors.forEach(function (sensor) {
		if (sensor.init) {
			sensor.init();
		}
	});
	fs.appendFile(filename, flatten(sensors.map(function (sensor) {
		return sensor.getCSVheader();
	})).join(','), function (error) {
		if (error) {
			console.error('Failed to write to log file, shutting down.');
			process.exit(1);
		}
		function readData() {
			async.mapSeries(sensors, function (sensor, callback) {
				sensor.getValues(adc, callback);
			}, function (deepValues, error) {
				var values = flatten(deepValues);
				fs.appendFile(filename, values.join(','), function (error) {
					if (error) {
						console.error('Failed to write to log file, shutting down');
						process.exit(1);
					}
				});
			});
		}
	});
});

