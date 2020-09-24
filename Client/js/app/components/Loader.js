var Loader = {

	loadText: function(path, onLoadedFunc) {

		var request = new XMLHttpRequest();
		request.open("GET", path);

		request.onreadystatechange = function() {
			
			if (request.readyState == 4) {
				onLoadedFunc.call(null, request.responseText);
			}
		};

		request.send();
	},

	post: function(path, data, onLoadedFunc) {

		if( typeof data === 'function' && onLoadedFunc === 'undefined' ) {

			onLoadedFunc = data;
			data = {};
		}

		var request = new XMLHttpRequest();

		request.onreadystatechange = function() {

			if (request.readyState == 4) {
				var r = JSON.parse(request.responseText)
				onLoadedFunc.call(null, r);
			}
		};

		request.open("POST", path);
		request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')

		request.send(data)
	},

	loadJSON: function(path, onLoadedFunc) {

		Loader.loadText(path, function(text) {
			onLoadedFunc(JSON.parse(text));
		});
	},

	loadImage:function(src, callback) {

		var img = new Image();
		img.onload = callback(img);
		setTimeout(function() {
			img.src = src;
		}, 10);
	}

};

module.exports = Loader;