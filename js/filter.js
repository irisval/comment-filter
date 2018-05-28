const height = document.body.clientHeight;
document.body.style.height = `${height + 1}px`;
setTimeout(() => document.body.style.height = `${height + 2}px`, 50);

function saveOptions() {
  console.log('SKRT');
  var op1 = document.getElementById('rmv-profanity').checked;
  var op2 = document.getElementById('rmv-links').checked;
  var op3 = document.getElementById('rmv-all').checked;
  var op4 = document.getElementById('blacklist').value;
  var op5 = document.getElementById('whitelist').value;

  chrome.storage.sync.get({blacklist: [], whitelist: []}, function (data) {
    if (op4.length > 0) {
      var blacklist = data.blacklist;
      blacklist.push(op4);
    }
    if (op5.length > 0) {
      var whitelist = data.whitelist;
      whitelist.push(op5);
    }
    chrome.storage.sync.set({
      profanity: op1,
      links: op2,
      removeAll: op3,
      blacklist: blacklist,
      whitelist: whitelist
    });
    });
  location.reload()
}

function populateArea(color, list, area) {
    for (var i = 0; i < list.length; i++) {
      var word = document.createElement('div');

      var btn = document.createElement('button');
      btn.className = color + 'listDel'
      btn.innerHTML = '<i class="fa fa-times fa-lg del-word"></i>';
      btn.id = i;
     

      var t = document.createTextNode(list[i]);

      word.appendChild(btn);
      word.appendChild(t);
      area.appendChild(word); 
    }
}

function restoreOptions() {
  chrome.storage.sync.get(null, function (data) {
    document.getElementById('rmv-profanity').checked = data.profanity;
    document.getElementById('rmv-links').checked = data.links;
    document.getElementById('rmv-all').checked = data.removeAll;
  });

   chrome.storage.sync.get(null, function (data) {
    var whitelist = data.whitelist;
    var whitelistArea = document.getElementById('whitelist-area');
    var blacklist = data.blacklist;
    var blacklistArea = document.getElementById('blacklist-area');

    populateArea('white', whitelist, whitelistArea);
    populateArea('black', blacklist, blacklistArea);
    
    var whiteBtns = document.querySelectorAll('.whitelistDel');
    var blackBtns = document.querySelectorAll('.blacklistDel');
    whiteBtns.forEach(function(e) {
      e.addEventListener('click', function() {
        this.parentNode.parentNode.removeChild(this.parentNode);
          chrome.storage.sync.get(null, function (data) {
            var x = data.whitelist;
            x.splice(e.id,1);
            // todo: find a more efficient way of removing values from whitelist array
            chrome.storage.sync.set({whitelist: x}, null);
          });
      });
    });
    blackBtns.forEach(function(e) {
      e.addEventListener('click', function() {
        this.parentNode.parentNode.removeChild(this.parentNode);
          chrome.storage.sync.get(null, function (data) {
            var x = data.blacklist;
            x.splice(e.id,1);
            // todo: find a more efficient way of removing values from blacklist array
            chrome.storage.sync.set({blacklist: x}, null);
          });
      });
    });
  });
}

function findAncestor(current, targetClass, exceptionClass = '') {
  while (!current.classList.contains(targetClass) & !current.classList.contains(exceptionClass)) {
    current = current.parentElement;
  }
  return current;
}

var containsValInList = function(text, list) {
  for (var i = 0; i < list.length; i++) {
    if (text.toUpperCase().indexOf(list[i].toUpperCase()) !== -1) {
      return true;
    }
  }
  return false;
}

var swearjar = require('swearjar');
var selectors = ['#content-text'];
var outerCommentSelector = 'ytd-item-section-renderer';
var outerSubcommentSelector = 'ytd-comment-replies-renderer';

var processComment = function(comment) {
  comment.original = comment.innerHTML;
  comment.classList.add('parsed');
  chrome.storage.sync.get(null, function (data) {
  var blacklist = data.blacklist;
  var whitelist = data.whitelist;
  var flagged = false;

    if (data.removeAll) {
      document.getElementById('comments').parentNode.removeChild(document.getElementById('comments'));
    } else {
      if (data.profanity && swearjar.profane(comment.original)) {  
        if (!containsValInList(comment.original, whitelist)) {
          flagged = true;
        }
      }
      else if (data.links && comment.getElementsByTagName('A').length > 0) {
        flagged = true;
      }
      else if (blacklist.length > 0 && containsValInList(comment.original, blacklist)) {
        flagged = true;
      } 
    }
    
    if (flagged) {
      comment.outerComment = findAncestor(comment, outerCommentSelector, outerSubcommentSelector);
      comment.outerComment.parentNode.removeChild(comment.outerComment);
    }
  });
}

function enterKey(e) {
  e.preventDefault();
  if (e.keyCode === 13) {
    document.getElementById('save').click();
  }
}

// build the full selector string
var selectorString = selectors.map(function (sel) {
  return sel + ':not(.parsed)';
}).join(', ');

// every 100 milliseconds, go over elements
setInterval(function () {
  document.querySelectorAll(selectorString).forEach(processComment);
}, 100);


if (document.getElementById('save')) {
  document.getElementById("blacklist").addEventListener("keyup", enterKey);
  document.getElementById("whitelist").addEventListener("keyup", enterKey);
  document.getElementById('save').addEventListener('click', saveOptions);
}
document.addEventListener('DOMContentLoaded', restoreOptions, true);