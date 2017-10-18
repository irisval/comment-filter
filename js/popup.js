function save_options() {
  var op1 = document.getElementById('rmv-profanity').checked;
  var op2 = document.getElementById('rmv-links').checked;
  var op3 = document.getElementById('rmv-all').checked;

  chrome.storage.sync.set({
    profanity: op1,
    links: op2,
    removeAll: op3
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
    document.getElementById('rmv-profanity').checked = data.profanity;
    document.getElementById('rm-links').checked = data.links;
    document.getElementById('rmv-all').checked = data.removeAll;
  });
}
function findAncestor (current, targetClass, exceptionClass='') {
    while (!current.classList.contains(targetClass) & !current.classList.contains(exceptionClass)) {
    	current = current.parentElement;
    }
    return current;
}
// selectors for comments
var swearjar = require('swearjar');
var selectors = ['#content-text'];
var outerCommentSelector = "ytd-item-section-renderer";
var outerSubcommentSelector = "ytd-comment-replies-renderer";

var processComment = function(comment) {

    comment.original = comment.innerHTML;
    comment.classList.add('parsed');
   
    chrome.storage.sync.get(null, function(data) {
        if (data.removeAll) {
            document.getElementById('comments').parentNode.removeChild(document.getElementById('comments'));
        } else {
            if (data.profanity) {
              if (swearjar.profane(comment.original)) {
                console.log(comment.original);
                comment.outerComment = findAncestor(comment, outerCommentSelector, outerSubcommentSelector);
                comment.outerComment.parentNode.removeChild(comment.outerComment);
              }
            }
            if (data.links) {
                if (comment.getElementsByTagName("A").length > 0) {
                  comment.outerComment = findAncestor(comment, outerCommentSelector, outerSubcommentSelector);
                  comment.outerComment.parentNode.removeChild(comment.outerComment);
                }
            }
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