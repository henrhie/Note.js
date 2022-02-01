(function () {
	var vscode = acquireVsCodeApi();

	var handleError = function (err) {
		var body = document.getElementsByTagName('body');
		body.innerHTML =
			'<div style="color: red;"><h4>Runtime Error</h4>' + err + '</div>';
		console.error(err);
	};

	window.addEventListener('error', function (e) {
		e.preventDefault();
		handleError(e.error);
	});

	console.stdlog = console.log.bind(console);
	console.logs = [];
	console.log = function () {
		console.logs.push(Array.from(arguments));
		console.stdlog.apply(console, arguments);
	};
	window.addEventListener(
		'message',
		function (event) {
			try {
				eval(event.data);
				vscode.postMessage({
					output: console.logs,
				});
				console.logs = [];
			} catch (err) {
				handleError(err);
			}
		},
		false
	);
})();
