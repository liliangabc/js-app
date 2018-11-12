// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  return newRequire;
})({"C:/Users/liliang/AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/_empty.js":[function(require,module,exports) {

},{}],"../utils/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var utils = {
  createStyleSheet: function createStyleSheet(styleStr) {
    var styleEl = document.getElementById('gameStyleSheet');
    if (styleEl) return;
    var newStyleEl = document.createElement('style');
    newStyleEl.type = 'text/css';
    newStyleEl.id = 'gameStyleSheet';
    newStyleEl.innerHTML = styleStr;
    document.head.appendChild(newStyleEl);
  },
  createCanvas: function createCanvas(mountEl) {
    mountEl = mountEl || document.body;
    var wrapper = document.createElement('div');
    var canvas = document.createElement('canvas');
    wrapper.className = 'game-wrapper';
    canvas.className = 'game-ui';
    wrapper.appendChild(canvas);
    mountEl.appendChild(wrapper);
    return {
      wrapper: wrapper,
      canvas: canvas
    };
  },
  getPixRatio: function getPixRatio(context) {
    var backingStore = context.backingStorePixelRatio || context.webkitBackingStorePixelRatio || context.mozBackingStorePixelRatio || 1;
    return (window.devicePixelRatio || 1) / backingStore;
  },
  isFunc: function isFunc(func) {
    return typeof func === 'function';
  },
  getRndInt: function getRndInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
};
var _default = utils;
exports.default = _default;
},{}],"main.js":[function(require,module,exports) {
"use strict";

var _fs = _interopRequireDefault(require("fs"));

var _utils = _interopRequireDefault(require("../utils"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

_utils.default.createStyleSheet("* {\r\n  padding: 0;\r\n  margin: 0;\r\n  box-sizing: border-box;\r\n}\r\n\r\nbody {\r\n  background-color: #fbe9e7;\r\n}\r\n\r\n.game-wrapper {\r\n  max-width: 480px;\r\n  margin: auto;\r\n  position: relative;\r\n}\r\n\r\n.game-wrapper canvas.game-ui {\r\n  display: block;\r\n  width: 100%;\r\n  padding: 3px;\r\n  border-radius: 4px;\r\n  background-color: #fff;\r\n  cursor: pointer;\r\n  -webkit-tap-highlight-color: transparent;\r\n  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);\r\n}\r\n\r\n.game-wrapper .scores {\r\n  position: absolute;\r\n  text-align: center;\r\n  color: #212121;\r\n}");

var Block =
/*#__PURE__*/
function () {
  function Block(_ref) {
    var row = _ref.row,
        col = _ref.col,
        color = _ref.color;

    _classCallCheck(this, Block);

    this.row = row;
    this.col = col;
    this.color = color;
  }

  _createClass(Block, [{
    key: "draw",
    value: function draw(_ref2) {
      var context = _ref2.context,
          size = _ref2.size,
          space = _ref2.space;
      context.save();
      context.fillStyle = this.color;
      context.fillRect(this.col * size + space, this.row * size + space, size - space, size - space);
      context.restore();
    }
  }]);

  return Block;
}();

var Board =
/*#__PURE__*/
function () {
  function Board(mountEl) {
    var callbacks = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, Board);

    this.callbacks = callbacks;

    var _utils$createCanvas = _utils.default.createCanvas(mountEl),
        wrapper = _utils$createCanvas.wrapper,
        canvas = _utils$createCanvas.canvas;

    this.wrapper = wrapper;
    this.canvas = canvas;
    this.context = this.canvas.getContext('2d');
    this.pixRatio = _utils.default.getPixRatio(this.context);
    this.addListener();
  }

  _createClass(Board, [{
    key: "initUI",
    value: function initUI(_ref3) {
      var rows = _ref3.rows,
          cols = _ref3.cols,
          _ref3$colors = _ref3.colors,
          colors = _ref3$colors === void 0 ? [] : _ref3$colors;
      if (colors.length < 3) throw new Error('请至少提供3种颜色.');
      this.rows = rows || cols;
      this.cols = cols;
      if (this.rows * this.cols % 2) throw new Error('行和列的积必须是2的倍数.');
      this.colors = colors;
      this.blockSize = 0;
      this.blockSpace = this.pixRatio * 2;
      this.removedColor = '#fff';
      this.updateSize();
      this.blocks = this.genBlocks();
      this.drawBlocks();
    }
  }, {
    key: "updateSize",
    value: function updateSize() {
      var cvsWidth,
          width = this.canvas.offsetWidth;
      this.canvas.width = cvsWidth = this.pixRatio * width;
      this.blockSize = (cvsWidth - this.blockSpace) / this.cols;
      this.canvas.height = this.rows * this.blockSize + this.blockSpace;
    }
  }, {
    key: "genBlocks",
    value: function genBlocks() {
      var total = this.rows * this.cols;
      var colorCount = this.colors.length;
      var colors = [],
          blocks = [],
          index = 0;

      for (var i = 0; i < total / 2; i++) {
        colors.push(this.colors[_utils.default.getRndInt(0, colorCount - 1)]);
      }

      colors = colors.concat(colors).sort(function () {
        return Math.random() - .5;
      });

      for (var row = 0; row < this.rows; row++) {
        for (var col = 0; col < this.cols; col++) {
          blocks.push(new Block({
            row: row,
            col: col,
            color: colors[index]
          }));
          index++;
        }
      }

      return blocks;
    }
  }, {
    key: "drawBlocks",
    value: function drawBlocks() {
      var _this$canvas = this.canvas,
          width = _this$canvas.width,
          height = _this$canvas.height;
      var context = this.context,
          size = this.blockSize,
          space = this.blockSpace;
      this.context.clearRect(0, 0, +width, +height);
      this.blocks.forEach(function (_) {
        return _.draw({
          context: context,
          size: size,
          space: space
        });
      });
    }
  }, {
    key: "getCurBlock",
    value: function getCurBlock(event) {
      var ex = (event.offsetX || event.pageX) * this.pixRatio;
      var ey = (event.offsetY || event.pageY) * this.pixRatio;
      var curCol = Math.floor(ex / this.blockSize);
      var curRow = Math.floor(ey / this.blockSize);

      for (var i = 0, len = this.blocks.length; i < len; i++) {
        var _ = this.blocks[i];
        if (_.row === curRow && _.col === curCol) return _;
      }
    }
  }, {
    key: "getTRBLBlocks",
    value: function getTRBLBlocks(block) {
      var i = this.blocks.indexOf(block);
      var T = this.blocks[i - this.rows];
      var R = this.blocks[i + 1];
      var B = this.blocks[i + this.rows];
      var L = this.blocks[i - 1];
      var blocks = [T, R, B, L];

      if (i % this.cols === 0) {
        blocks = [T, R, B];
      } else if ((i + 1) % this.cols === 0) {
        blocks = [T, B, L];
      }

      return blocks.filter(function (_) {
        return _;
      });
    }
  }, {
    key: "getIdentColorBlocks",
    value: function getIdentColorBlocks(block) {
      var _this = this;

      var checkedBlocks = [],
          noCheckBlocks = [block];

      var _loop = function _loop() {
        var b = noCheckBlocks.pop();
        checkedBlocks.push(b);

        _this.getTRBLBlocks(b).forEach(function (_) {
          if (_.color === b.color && checkedBlocks.indexOf(_) === -1) {
            noCheckBlocks.push(_);
          }
        });
      };

      while (noCheckBlocks.length) {
        _loop();
      }

      return checkedBlocks;
    }
  }, {
    key: "drawScores",
    value: function drawScores(blocks) {
      var _this2 = this;

      var cvsStyle = window.getComputedStyle(this.canvas, null);
      var padX = parseInt(cvsStyle.paddingLeft);
      var padY = parseInt(cvsStyle.paddingTop);
      var div = document.createElement('div');
      div.innerHTML = blocks.map(function (_) {
        var T = _.row * _this2.blockSize / _this2.pixRatio + padY + 'px';
        var L = _.col * _this2.blockSize / _this2.pixRatio + padX + 'px';
        var W = _this2.blockSize / _this2.pixRatio + 'px';
        return "<span class=\"scores\" style=\"top:".concat(T, ";left:").concat(L, ";width:").concat(W, ";height:").concat(W, ";line-height:").concat(W, "\">+").concat(blocks.length, "</span>");
      }).join('');
      this.wrapper.appendChild(div);
      setTimeout(function () {
        return _this2.wrapper.removeChild(div);
      }, 300);
    }
  }, {
    key: "addListener",
    value: function addListener() {
      this.canvas.addEventListener('click', this.onClick.bind(this));
    }
  }, {
    key: "onClick",
    value: function onClick(event) {
      var _this3 = this;

      var curBlock = this.getCurBlock(event);
      if (!curBlock || curBlock.color === this.removedColor) return;
      var identColorBlocks = this.getIdentColorBlocks(curBlock);
      if (identColorBlocks.length < 2) return;
      identColorBlocks.forEach(function (_) {
        return _.color = _this3.removedColor;
      });
      this.drawBlocks();
      this.drawScores(identColorBlocks);
    }
  }]);

  return Board;
}();

var demo = new Board();
demo.initUI({
  cols: 10,
  colors: ['#22a6ea', '#f44e4e', '#b3cc25', '#f1a30c', '#b854e6']
});
},{"fs":"C:/Users/liliang/AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/_empty.js","../utils":"../utils/index.js"}],"C:/Users/liliang/AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "54298" + '/');

  ws.onmessage = function (event) {
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      console.clear();
      data.assets.forEach(function (asset) {
        hmrApply(global.parcelRequire, asset);
      });
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          hmrAccept(global.parcelRequire, asset.id);
        }
      });
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAccept(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAccept(bundle.parent, id);
  }

  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAccept(global.parcelRequire, id);
  });
}
},{}]},{},["C:/Users/liliang/AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","main.js"], null)