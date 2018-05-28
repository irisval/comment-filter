(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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

var processComment = function (comment) {
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

// build the full selector string
var selectorString = selectors.map(function (sel) {
  return sel + ':not(.parsed)';
}).join(', ');

// every 100 milliseconds, go over elements
setInterval(function () {
  document.querySelectorAll(selectorString).forEach(processComment);
}, 100);


function enterKey(e) {
  e.preventDefault();
  if (e.keyCode === 13) {
    document.getElementById('save').click();
  }
}
if (document.getElementById('save')) {
  var b = document.getElementById("blacklist");
  var w = document.getElementById("whitelist");

  b.addEventListener("keyup", enterKey);
  w.addEventListener("keyup", enterKey);
  document.getElementById('save').addEventListener('click', saveOptions);
}
document.addEventListener('DOMContentLoaded', restoreOptions, true);
},{"swearjar":3}],2:[function(require,module,exports){
module.exports={
  "anus": ["sexual"],
  "arse": ["insult"],
  "arsehole": ["insult"],
  "ass": ["sexual","insult"],
  "ass-hat": ["insult"],
  "ass-pirate": ["discriminatory"],
  "assbag": ["insult"],
  "assbandit": ["discriminatory"],
  "assbanger": ["discriminatory"],
  "assbite": ["insult"],
  "assclown": ["sexual"],
  "asscock": ["insult"],
  "asscracker": ["sexual"],
  "assface": ["sexual"],
  "assfuck": ["sexual"],
  "assfucker": ["discriminatory"],
  "assgoblin": ["discriminatory"],
  "asshat": ["sexual"],
  "asshead": ["insult"],
  "asshole": ["insult"],
  "asshopper": ["discriminatory"],
  "assjacker": ["discriminatory"],
  "asslick": ["insult"],
  "asslicker": ["insult"],
  "assmonkey": ["insult"],
  "assmunch": ["insult"],
  "assmuncher": ["sexual"],
  "assnigger": ["discriminatory"],
  "asspirate": ["discriminatory"],
  "assshit": ["insult"],
  "assshole": ["sexual"],
  "asssucker": ["insult"],
  "asswad": ["sexual"],
  "asswipe": ["sexual"],
  "bampot": ["insult"],
  "bastard": ["insult"],
  "beaner": ["discriminatory"],
  "beastial": ["sexual"],
  "beastiality": ["sexual"],
  "beastility": ["sexual"],
  "bestial": ["sexual"],
  "bestiality": ["sexual"],
  "bitch": ["insult"],
  "bitchass": ["insult"],
  "bitcher": ["insult"],
  "bitchin": ["inappropriate"],
  "bitching": ["inappropriate"],
  "bitchtit": ["discriminatory"],
  "bitchy": ["insult"],
  "blow job": ["sexual"],
  "blowjob": ["sexual"],
  "bollocks": ["sexual"],
  "bollox": ["sexual"],
  "boner": ["sexual"],
  "bullshit": ["inappropriate"],
  "butt plug": ["sexual"],
  "camel toe": ["sexual"],
  "choad": ["sexual"],
  "chode": ["sexual"],
  "clit": ["sexual"],
  "clitface": ["insult"],
  "clitfuck": ["sexual"],
  "clusterfuck": ["inappropriate"],
  "cock": ["sexual"],
  "cockbite": ["insult"],
  "cockburger": ["insult"],
  "cockface": ["insult"],
  "cockfucker": ["insult"],
  "cockhead": ["insult"],
  "cockmonkey": ["insult"],
  "cocknose": ["insult"],
  "cocknugget": ["insult"],
  "cockshit": ["insult"],
  "cocksuck": ["sexual"],
  "cocksucked": ["sexual"],
  "cocksucker": ["discriminatory","sexual"],
  "cocksucking": ["sexual","discriminatory"],
  "cocksucks": ["sexual","discriminatory"],
  "coochie": ["sexual"],
  "coochy": ["sexual"],
  "cooter": ["sexual"],
  "cum": ["sexual"],
  "cumbubble": ["insult"],
  "cumdumpster": ["sexual"],
  "cummer": ["sexual"],
  "cumming": ["sexual"],
  "cumshot": ["sexual"],
  "cumslut": ["sexual","insult"],
  "cumtart": ["insult"],
  "cunillingus": ["sexual"],
  "cunnie": ["sexual"],
  "cunnilingus": ["sexual"],
  "cunt": ["insult","sexual"],
  "cuntface": ["insult"],
  "cunthole": ["sexual"],
  "cuntlick": ["sexual"],
  "cuntlicker": ["sexual","discriminatory"],
  "cuntlicking": ["sexual"],
  "cuntrag": ["insult"],
  "cuntslut": ["insult"],
  "cyberfuc": ["sexual"],
  "cyberfuck": ["sexual"],
  "cyberfucked": ["sexual"],
  "cyberfucker": ["sexual"],
  "cyberfucking": ["sexual"],
  "dago": ["discriminatory"],
  "damn": ["inappropriate"],
  "deggo": ["discriminatory"],
  "dick": ["sexual","insult"],
  "dickbag": ["insult"],
  "dickbeaters": ["sexual"],
  "dickface": ["insult"],
  "dickfuck": ["insult"],
  "dickhead": ["insult"],
  "dickhole": ["sexual"],
  "dickjuice": ["sexual"],
  "dickmilk": ["sexual"],
  "dickslap": ["sexual"],
  "dickwad": ["insult"],
  "dickweasel": ["insult"],
  "dickweed": ["insult"],
  "dickwod": ["insult"],
  "dildo": ["sexual"],
  "dink": ["insult","sexual"],
  "dipshit": ["insult"],
  "doochbag": ["insult"],
  "dookie": ["inappropriate"],
  "douche": ["insult"],
  "douche-fag": ["insult"],
  "douchebag": ["insult"],
  "douchewaffle": ["discriminatory"],
  "dumass": ["insult"],
  "dumb ass": ["insult"],
  "dumbass": ["insult"],
  "dumbfuck": ["insult"],
  "dumbshit": ["insult"],
  "dumshit": ["insult"],
  "ejaculate": ["sexual"],
  "ejaculated": ["sexual"],
  "ejaculates": ["sexual"],
  "ejaculating": ["sexual"],
  "ejaculation": ["sexual"],
  "fag": ["discriminatory"],
  "fagbag": ["discriminatory"],
  "fagfucker": ["discriminatory"],
  "fagging": ["discriminatory"],
  "faggit": ["discriminatory"],
  "faggot": ["discriminatory"],
  "faggotcock": ["discriminatory"],
  "faggs": ["discriminatory"],
  "fagot": ["discriminatory"],
  "fags": ["discriminatory"],
  "fagtard": ["discriminatory"],
  "fart": ["inappropriate"],
  "farted": ["inappropriate"],
  "farting": ["inappropriate"],
  "farty": ["inappropriate"],
  "fatass": ["insult"],
  "felatio": ["sexual"],
  "fellatio": ["sexual"],
  "feltch": ["sexual"],
  "fingerfuck": ["sexual"],
  "fingerfucked": ["sexual"],
  "fingerfucker": ["sexual"],
  "fingerfucking": ["sexual"],
  "fingerfucks": ["sexual"],
  "fistfuck": ["sexual"],
  "fistfucked": ["sexual"],
  "fistfucker": ["sexual"],
  "fistfucking": ["sexual"],
  "flamer": ["discriminatory"],
  "fuck": ["sexual"],
  "fuckass": ["insult"],
  "fuckbag": ["insult"],
  "fuckboy": ["insult"],
  "fuckbrain": ["insult"],
  "fuckbutt": ["sexual"],
  "fucked": ["sexual"],
  "fucker": ["sexual","insult"],
  "fuckersucker": ["insult"],
  "fuckface": ["insult"],
  "fuckhead": ["sexual"],
  "fuckhole": ["insult"],
  "fuckin": ["sexual"],
  "fucking": ["sexual"],
  "fuckme": ["sexual"],
  "fucknut": ["insult"],
  "fucknutt": ["insult"],
  "fuckoff": ["insult"],
  "fuckstick": ["sexual"],
  "fucktard": ["insult"],
  "fuckup": ["insult"],
  "fuckwad": ["insult"],
  "fuckwit": ["insult"],
  "fuckwitt": ["insult"],
  "fudgepacker": ["discriminatory"],
  "fuk": ["sexual"],
  "gangbang": ["sexual"],
  "gangbanged": ["sexual"],
  "goddamn": ["inappropriate","blasphemy"],
  "goddamnit": ["inappropriate","blasphemy"],
  "gooch": ["sexual"],
  "gook": ["discriminatory"],
  "gringo": ["discriminatory"],
  "guido": ["discriminatory"],
  "handjob": ["sexual"],
  "hardcoresex": ["sexual"],
  "heeb": ["discriminatory"],
  "hell": ["inappropriate"],
  "ho": ["discriminatory"],
  "hoe": ["discriminatory"],
  "homo": ["discriminatory"],
  "homodumbshit": ["insult"],
  "honkey": ["discriminatory"],
  "horniest": ["sexual"],
  "horny": ["sexual"],
  "hotsex": ["sexual"],
  "humping": ["sexual"],
  "jackass": ["insult"],
  "jap": ["discriminatory"],
  "jigaboo": ["discriminatory"],
  "jism": ["sexual"],
  "jiz": ["sexual"],
  "jizm": ["sexual"],
  "jizz": ["sexual"],
  "jungle bunny": ["discriminatory"],
  "junglebunny": ["discriminatory"],
  "kike": ["discriminatory"],
  "kock": ["sexual"],
  "kondum": ["sexual"],
  "kooch": ["sexual"],
  "kootch": ["sexual"],
  "kum": ["sexual"],
  "kumer": ["sexual"],
  "kummer": ["sexual"],
  "kumming": ["sexual"],
  "kums": ["sexual"],
  "kunilingus": ["sexual"],
  "kunt": ["sexual"],
  "kyke": ["discriminatory"],
  "lezzie": ["discriminatory"],
  "lust": ["sexual"],
  "lusting": ["sexual"],
  "mcfagget": ["discriminatory"],
  "mick": ["discriminatory"],
  "minge": ["sexual"],
  "mothafuck": ["sexual"],
  "mothafucka": ["sexual","insult"],
  "mothafuckaz": ["sexual"],
  "mothafucked": ["sexual"],
  "mothafucker": ["sexual","insult"],
  "mothafuckin": ["sexual"],
  "mothafucking": ["sexual"],
  "mothafucks": ["sexual"],
  "motherfuck": ["sexual"],
  "motherfucked": ["sexual"],
  "motherfucker": ["sexual","insult"],
  "motherfuckin": ["sexual"],
  "motherfucking": ["sexual"],
  "muff": ["sexual"],
  "muffdiver": ["discriminatory","sexual"],
  "munging": ["sexual"],
  "negro": ["discriminatory"],
  "nigga": ["discriminatory"],
  "nigger": ["discriminatory"],
  "niglet": ["discriminatory"],
  "nut sack": ["sexual"],
  "nutsack": ["sexual"],
  "orgasim": ["sexual"],
  "orgasm": ["sexual"],
  "paki": ["discriminatory"],
  "panooch": ["sexual"],
  "pecker": ["sexual"],
  "peckerhead": ["insult"],
  "penis": ["sexual"],
  "penisfucker": ["discriminatory"],
  "penispuffer": ["discriminatory"],
  "phonesex": ["sexual"],
  "phuk": ["sexual"],
  "phuked": ["sexual"],
  "phuking": ["sexual"],
  "phukked": ["sexual"],
  "phukking": ["sexual"],
  "phuks": ["sexual"],
  "phuq": ["sexual"],
  "pis": ["sexual"],
  "pises": ["sexual"],
  "pisin": ["sexual"],
  "pising": ["sexual"],
  "pisof": ["sexual"],
  "piss": ["inappropriate"],
  "pissed": ["inappropriate"],
  "pisser": ["sexual"],
  "pisses": ["sexual"],
  "pissflaps": ["sexual"],
  "pissin": ["sexual"],
  "pissing": ["sexual"],
  "pissoff": ["sexual"],
  "polesmoker": ["discriminatory"],
  "pollock": ["discriminatory"],
  "poon": ["sexual"],
  "poonani": ["sexual"],
  "poonany": ["sexual"],
  "poontang": ["sexual"],
  "porch monkey": ["discriminatory"],
  "porchmonkey": ["discriminatory"],
  "porn": ["sexual"],
  "porno": ["sexual"],
  "pornography": ["sexual"],
  "pornos": ["sexual"],
  "prick": ["sexual"],
  "punanny": ["sexual"],
  "punta": ["insult"],
  "pusies": ["sexual","insult"],
  "pussies": ["sexual","insult"],
  "pussy": ["sexual","insult"],
  "pussylicking": ["sexual"],
  "pusy": ["sexual"],
  "puto": ["insult"],
  "renob": ["sexual"],
  "rimjob": ["sexual"],
  "ruski": ["discriminatory"],
  "sandnigger": ["discriminatory"],
  "schlong": ["sexual"],
  "scrote": ["sexual"],
  "shit": ["sexual","inappropriate"],
  "shitass": ["insult"],
  "shitbag": ["insult"],
  "shitbagger": ["insult"],
  "shitbrain": ["insult"],
  "shitbreath": ["insult"],
  "shitcunt": ["insult"],
  "shitdick": ["insult"],
  "shited": ["sexual"],
  "shitface": ["insult"],
  "shitfaced": ["inappropriate","insult"],
  "shitfull": ["sexual"],
  "shithead": ["insult"],
  "shithole": ["insult"],
  "shithouse": ["inappropriate"],
  "shiting": ["sexual"],
  "shitspitter": ["sexual"],
  "shitstain": ["inappropriate","insult"],
  "shitted": ["sexual"],
  "shitter": ["sexual"],
  "shittiest": ["inappropriate"],
  "shitting": ["inappropriate"],
  "shitty": ["inappropriate"],
  "shity": ["sexual"],
  "shiz": ["inappropriate"],
  "shiznit": ["inappropriate"],
  "skank": ["insult"],
  "skeet": ["sexual"],
  "skullfuck": ["sexual"],
  "slut": ["discriminatory"],
  "slutbag": ["discriminatory"],
  "sluts": ["sexual"],
  "smeg": ["inappropriate"],
  "smut": ["sexual"],
  "snatch": ["sexual"],
  "spic": ["discriminatory"],
  "spick": ["discriminatory"],
  "splooge": ["sexual"],
  "spunk": ["sexual"],
  "tard": ["discriminatory"],
  "testicle": ["sexual"],
  "thundercunt": ["insult"],
  "tit": ["sexual"],
  "tits": ["sexual"],
  "titfuck": ["sexual"],
  "tittyfuck": ["sexual"],
  "twat": ["sexual"],
  "twatlips": ["insult"],
  "twatwaffle": ["discriminatory"],
  "unclefucker": ["discriminatory"],
  "va-j-j": ["sexual"],
  "vag": ["sexual"],
  "vagina": ["sexual"],
  "vjayjay": ["sexual"],
  "wank": ["sexual"],
  "wetback": ["discriminatory"],
  "whore": ["insult"],
  "whorebag": ["insult"],
  "whoreface": ["insult"]
}

},{}],3:[function(require,module,exports){
// swearjar-node
var path = require('path');
var swearjar = {

  _badWords: {},

  scan: function (text, callback) {
    var word, key, match;
    var regex = /\w+/g

    while (match = regex.exec(text)) {
      word = match[0];
      key  = word.toLowerCase();

      if (key in this._badWords && Array.isArray(this._badWords[key])) {
        if (callback(word, match.index, this._badWords[key]) === false) {
          break;
        }
      }
    }
  },

  profane: function (text) {
    var profane = false;

    this.scan(text, function (word, index, categories) {
      profane = true;
      return false; // Stop on first match
    });

    return profane;
  },

  scorecard: function (text) {
    var scorecard = {};

    this.scan(text, function (word, index, categories) {
      for (var i = 0; i < categories.length; i+=1) {
        var cat = categories[i];

        if (cat in scorecard) {
          scorecard[cat] += 1;
        } else {
          scorecard[cat] = 1;
        }
      };
    });

    return scorecard;
  },

  censor: function (text) {
    var censored = text;

    this.scan(text, function (word, index, categories) {
      censored = censored.substr(0, index) +
                  word.replace(/\S/g, '*') +
                  censored.substr(index + word.length);
    });

    return censored;
  },

  loadBadWords: function (relativePath) {
    var basePath = path.dirname(module.parent.filename);
    var fullPath = path.join(basePath, relativePath);
    this._badWords = require(fullPath);
  },
  
  setBadWords: function (badWords) {
    this._badWords = badWords || {};
  }
};

swearjar._badWords = require("./config/en_US.json");

module.exports = swearjar;

},{"./config/en_US.json":2,"path":4}],4:[function(require,module,exports){
(function (process){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// resolves . and .. elements in a path array with directory names there
// must be no slashes, empty elements, or device names (c:\) in the array
// (so also no leading and trailing slashes - it does not distinguish
// relative and absolute paths)
function normalizeArray(parts, allowAboveRoot) {
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = parts.length - 1; i >= 0; i--) {
    var last = parts[i];
    if (last === '.') {
      parts.splice(i, 1);
    } else if (last === '..') {
      parts.splice(i, 1);
      up++;
    } else if (up) {
      parts.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (allowAboveRoot) {
    for (; up--; up) {
      parts.unshift('..');
    }
  }

  return parts;
}

// Split a filename into [root, dir, basename, ext], unix version
// 'root' is just a slash, or nothing.
var splitPathRe =
    /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
var splitPath = function(filename) {
  return splitPathRe.exec(filename).slice(1);
};

// path.resolve([from ...], to)
// posix version
exports.resolve = function() {
  var resolvedPath = '',
      resolvedAbsolute = false;

  for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
    var path = (i >= 0) ? arguments[i] : process.cwd();

    // Skip empty and invalid entries
    if (typeof path !== 'string') {
      throw new TypeError('Arguments to path.resolve must be strings');
    } else if (!path) {
      continue;
    }

    resolvedPath = path + '/' + resolvedPath;
    resolvedAbsolute = path.charAt(0) === '/';
  }

  // At this point the path should be resolved to a full absolute path, but
  // handle relative paths to be safe (might happen when process.cwd() fails)

  // Normalize the path
  resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function(p) {
    return !!p;
  }), !resolvedAbsolute).join('/');

  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
};

// path.normalize(path)
// posix version
exports.normalize = function(path) {
  var isAbsolute = exports.isAbsolute(path),
      trailingSlash = substr(path, -1) === '/';

  // Normalize the path
  path = normalizeArray(filter(path.split('/'), function(p) {
    return !!p;
  }), !isAbsolute).join('/');

  if (!path && !isAbsolute) {
    path = '.';
  }
  if (path && trailingSlash) {
    path += '/';
  }

  return (isAbsolute ? '/' : '') + path;
};

// posix version
exports.isAbsolute = function(path) {
  return path.charAt(0) === '/';
};

// posix version
exports.join = function() {
  var paths = Array.prototype.slice.call(arguments, 0);
  return exports.normalize(filter(paths, function(p, index) {
    if (typeof p !== 'string') {
      throw new TypeError('Arguments to path.join must be strings');
    }
    return p;
  }).join('/'));
};


// path.relative(from, to)
// posix version
exports.relative = function(from, to) {
  from = exports.resolve(from).substr(1);
  to = exports.resolve(to).substr(1);

  function trim(arr) {
    var start = 0;
    for (; start < arr.length; start++) {
      if (arr[start] !== '') break;
    }

    var end = arr.length - 1;
    for (; end >= 0; end--) {
      if (arr[end] !== '') break;
    }

    if (start > end) return [];
    return arr.slice(start, end - start + 1);
  }

  var fromParts = trim(from.split('/'));
  var toParts = trim(to.split('/'));

  var length = Math.min(fromParts.length, toParts.length);
  var samePartsLength = length;
  for (var i = 0; i < length; i++) {
    if (fromParts[i] !== toParts[i]) {
      samePartsLength = i;
      break;
    }
  }

  var outputParts = [];
  for (var i = samePartsLength; i < fromParts.length; i++) {
    outputParts.push('..');
  }

  outputParts = outputParts.concat(toParts.slice(samePartsLength));

  return outputParts.join('/');
};

exports.sep = '/';
exports.delimiter = ':';

exports.dirname = function(path) {
  var result = splitPath(path),
      root = result[0],
      dir = result[1];

  if (!root && !dir) {
    // No dirname whatsoever
    return '.';
  }

  if (dir) {
    // It has a dirname, strip trailing slash
    dir = dir.substr(0, dir.length - 1);
  }

  return root + dir;
};


exports.basename = function(path, ext) {
  var f = splitPath(path)[2];
  // TODO: make this comparison case-insensitive on windows?
  if (ext && f.substr(-1 * ext.length) === ext) {
    f = f.substr(0, f.length - ext.length);
  }
  return f;
};


exports.extname = function(path) {
  return splitPath(path)[3];
};

function filter (xs, f) {
    if (xs.filter) return xs.filter(f);
    var res = [];
    for (var i = 0; i < xs.length; i++) {
        if (f(xs[i], i, xs)) res.push(xs[i]);
    }
    return res;
}

// String.prototype.substr - negative index don't work in IE8
var substr = 'ab'.substr(-1) === 'b'
    ? function (str, start, len) { return str.substr(start, len) }
    : function (str, start, len) {
        if (start < 0) start = str.length + start;
        return str.substr(start, len);
    }
;

}).call(this,require('_process'))
},{"_process":5}],5:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}]},{},[1]);
