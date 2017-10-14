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
		}, 1000);
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

// selectors for comments
var swearjar = require('swearjar');
var selectors = ['#content-text'];

var processComment = function(comment) {

	comment.original = comment.innerHTML;
  comment.onclick = function() {
      comment.innerHTML = comment.original;
    };
    comment.classList.add('parsed');
	
	// comment.innerHTML = "yes";
	chrome.storage.sync.get(null, function(data) { 
		if (data.one) {
		// var newComment = comment.original + "1";
		// // comment.innerHTML = newComment;
		if (swearjar.profane(comment.original)) {
			console.log(comment.original);
			comment.style.display = "none";
		}
	
	}
	if (data.two) {
		var newComment = comment.original + "2";
		comment.innerHTML = newComment;
	}
	if (data.three) {
		var newComment = comment.original + "3";
		comment.innerHTML = newComment;
	}
	if (data.four) {
		var newComment = comment.original + "4";
		comment.innerHTML = newComment;
	}
	});
}

// build the full selector string
var selectorString = selectors.map(function(sel) {
  return sel + ':not(.parsed)';
}).join(", ");

// every 100 milliseconds, derp any un-derped elements
setInterval(function() {
  document.querySelectorAll(selectorString).forEach(processComment);
}, 100);

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);