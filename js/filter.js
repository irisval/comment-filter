function save_options() {
  console.log('SKRT');
  var op1 = document.getElementById('rmv-profanity').checked;
  var op2 = document.getElementById('rmv-links').checked;
  var op3 = document.getElementById('rmv-all').checked;
  var op4 = document.getElementById('blacklist').value;
  var op5 = document.getElementById('whitelist').value;

  chrome.storage.sync.set({
    profanity: op1,
    links: op2,
    removeAll: op3
  }, function () {
      var status = document.getElementById('status');
      status.textContent = 'Options saved.';
      setTimeout(function () {
        status.textContent = '';
      }, 1000);
  });

  chrome.storage.sync.get({blacklist: []}, function (data) {
    var blacklist = data.blacklist;
    blacklist.push(op4);
    chrome.storage.sync.set({
      blacklist: blacklist
    }, function () {
        chrome.storage.sync.get(null, function (data) {
          console.log(data.blacklist);
        });
      });
  });
}

function restore_options() {
  chrome.storage.sync.get(null, function (data) {
    document.getElementById('rmv-profanity').checked = data.profanity;
    document.getElementById('rmv-links').checked = data.links;
    document.getElementById('rmv-all').checked = data.removeAll;
  });

  chrome.storage.sync.get({blacklist: []}, function (data) {
    var blacklist = data.blacklist;
    var blacklistArea = document.getElementById('blacklist-area');
    for (var i = 0; i < blacklist.length; i++) {
      var word = document.createElement("div");
      
      var btn = document.createElement("button");
      btn.innerHTML = '<i class="fa fa-minus-square del-word"></i>';
      btn.addEventListener("click", function() {
        this.parentNode.parentNode.removeChild(this.parentNode);
      });

      var t = document.createTextNode(blacklist[i]);

      word.appendChild(btn);
      word.appendChild(t);
      blacklistArea.appendChild(word); 
    }
  });
}

function findAncestor(current, targetClass, exceptionClass = '') {
  while (!current.classList.contains(targetClass) & !current.classList.contains(exceptionClass)) {
    current = current.parentElement;
  }
  return current;
}

var selectors = ['#content-text'];
var outerCommentSelector = 'ytd-item-section-renderer';
var outerSubcommentSelector = 'ytd-comment-replies-renderer';

var processComment = function (comment) {
  comment.original = comment.innerHTML;
  comment.classList.add('parsed');
  chrome.storage.sync.get(null, function (data) {
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
        if (comment.getElementsByTagName('A').length > 0) {
          comment.outerComment = findAncestor(comment, outerCommentSelector, outerSubcommentSelector);
          comment.outerComment.parentNode.removeChild(comment.outerComment);
        }
      }
    }
  });
}

// build the full selector string
var selectorString = selectors.map(function (sel) {
  return sel + ':not(.parsed)';
}).join(', ');

// every 100 milliseconds, go over elements
setInterval(function () {
  document.querySelectorAll(selectorString).forEach(processComment);
}, 100);

document.getElementById('save').addEventListener('click', save_options);
document.addEventListener('DOMContentLoaded', restore_options, true);