function save_options() {
	var op1 = document.getElementById('op1').checked;
	var op2 = document.getElementById('op2').checked;
	var op3 = document.getElementById('op3').checked;
	var op4 = document.getElementById('op4').checked;

	chrome.storage.sync.set({
		one: op1,
		two: op2,
		three: op3,
		four: op4
	}, function() {
		var status = document.getElementById('status');
		status.textContent = "Options saved.";
		setTimeout(function() {
			status.textContent = '';
		}, 750);
	});
}

function restore_options() {
	chrome.storage.sync.get(null, function(data) {
		document.getElementById('op1').checked = data.one;
		document.getElementById('op2').checked = data.two;
		document.getElementById('op3').checked = data.three;
		document.getElementById('op4').checked = data.four;
	});
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);