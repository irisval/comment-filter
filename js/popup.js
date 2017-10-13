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
var selectors = ['#content-text'];


var processComment = function(comment) {
  // comment.onclick = function() {
  //     comment.innerHTML = comment.derpOriginal;
  //   };
  //   comment.classList.add('');
	comment.original = comment.innerHTML;
	// comment.innerHTML = "yes";
	chrome.storage.sync.get(null, function(data) { 
	if (data.one) {
		// var newComment = comment.original + "1";
		// comment.innerHTML = newComment;
		comment.innerHTML = "one";
	}
	if (data.two) {
		// var newComment = comment.original + "2";
		// comment.innerHTML = newComment;
		comment.innerHTML = "two";
	}
	if (data.three) {
		// var newComment = comment.original + "3";
		// comment.innerHTML = newComment;
		comment.innerHTML = "three";
	}
	if (data.four) {
		// var newComment = comment.original + "4";
		// comment.innerHTML = newComment;
		comment.innerHTML = "four";
	}

});
}

// build the full selector string
var selectorString = selectors.map(function(sel) {
  return sel + ':not(.derped)';
}).join(", ");

// every 100 milliseconds, derp any un-derped elements
setInterval(function() {
  document.querySelectorAll(selectorString).forEach(processComment);
}, 100);

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);


