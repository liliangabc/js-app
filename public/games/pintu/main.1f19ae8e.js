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
})({"../utils/index.js":[function(require,module,exports) {
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
  },
  imageLoad: function imageLoad(src) {
    return new Promise(function (resolve, reject) {
      var image = new Image();

      image.onload = function () {
        image.onload = null;
        resolve(image);
      };

      image.onerror = function (error) {
        image.onerror = null;
        reject(new Error('图片加载失败'));
      };

      image.src = src;
    });
  }
};
var _default = utils;
exports.default = _default;
},{}],"main.js":[function(require,module,exports) {
"use strict";

var _utils = _interopRequireDefault(require("../utils"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Game =
/*#__PURE__*/
function () {
  function Game(mountEl) {
    var callbacks = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, Game);

    this.callbacks = callbacks;

    var _utils$createCanvas = _utils.default.createCanvas(mountEl),
        wrapper = _utils$createCanvas.wrapper,
        canvas = _utils$createCanvas.canvas;

    this.wrapper = wrapper;
    this.canvas = canvas;
    this.context = this.canvas.getContext('2d');
    this.pixRatio = _utils.default.getPixRatio(this.context);
    this.canvas.addEventListener('click', this.onClick.bind(this));
  }

  _createClass(Game, [{
    key: "onClick",
    value: function onClick(event) {
      var _this = this;

      var onDone = this.callbacks.onDone;
      var curBlock = this.getCurBlock(event);
      if (!this.canMove(curBlock)) return;
      this.moveBlock(curBlock).then(function () {
        if (_this.checkDone()) _utils.default.isFunc(onDone) && onDone();
      });
    }
  }, {
    key: "getCurBlock",
    value: function getCurBlock(event) {
      var ex = (event.offsetX || event.pageX) * this.pixRatio;
      var ey = (event.offsetY || event.pageY) * this.pixRatio;
      return this.blocks.find(function (_) {
        return _.x < ex && ex < _.x + _.w && _.y < ey && ey < _.y + _.h;
      });
    }
  }, {
    key: "canMove",
    value: function canMove(block) {
      var blockSpace = this.blockSpace;
      var _this$emptyBlock = this.emptyBlock,
          x = _this$emptyBlock.x,
          y = _this$emptyBlock.y,
          w = _this$emptyBlock.w,
          h = _this$emptyBlock.h;
      return block.x === x && Math.abs(block.y - y) <= h + 2 * blockSpace || block.y === y && Math.abs(block.x - x) <= w + 2 * blockSpace;
    }
  }, {
    key: "moveBlock",
    value: function moveBlock(block) {
      return new Promise(function (resolve) {});
    }
  }, {
    key: "checkDone",
    value: function checkDone() {
      var _this2 = this;

      this.blocks.every(function (_, i) {
        var _bak = _this2.bakBlocks[i];
        return _bak.x === _.x && _bak.y === _.y;
      });
    }
  }, {
    key: "initUI",
    value: function initUI(_ref) {
      var _this3 = this;

      var rows = _ref.rows,
          cols = _ref.cols,
          src = _ref.src;
      this.rows = rows || cols;
      this.cols = cols;
      this.blockSpace = this.pixRatio;
      this.updateSize();

      _utils.default.imageLoad(src).then(function (img) {
        _this3.img = img;

        var _this3$genBlocks = _this3.genBlocks(),
            blocks = _this3$genBlocks.blocks,
            bakBlocks = _this3$genBlocks.bakBlocks,
            emptyBlock = _this3$genBlocks.emptyBlock;

        _this3.blocks = blocks;
        _this3.bakBlocks = bakBlocks;
        _this3.emptyBlock = emptyBlock;

        _this3.drawBlocks();
      });
    }
  }, {
    key: "updateSize",
    value: function updateSize() {
      var width = this.canvas.offsetWidth;
      this.width = this.canvas.width = this.canvas.height = width * this.pixRatio;
      this.bw = (this.width - this.blockSpace * (this.cols + 1)) / this.cols;
      this.bh = (this.width - this.blockSpace * (this.rows + 1)) / this.rows;
    }
  }, {
    key: "genBlocks",
    value: function genBlocks() {
      var img = this.img,
          rows = this.rows,
          cols = this.cols,
          bw = this.bw,
          bh = this.bh,
          blockSpace = this.blockSpace;
      var bakBlocks = [];
      var iw = img.naturalWidth / cols;
      var ih = img.naturalHeight / rows;

      for (var row = 0; row < rows; row++) {
        for (var col = 0; col < cols; col++) {
          var x = (bw + blockSpace) * col + blockSpace;
          var y = (bh + blockSpace) * row + blockSpace;
          bakBlocks.push({
            ix: iw * col,
            iy: ih * row,
            iw: iw,
            ih: ih,
            x: x,
            y: y,
            w: bw,
            h: bh
          });
        }
      }

      var delIndex = [0, cols - 1, cols * (rows - 1), rows * (cols - 1)][_utils.default.getRndInt(0, 3)];

      return {
        emptyBlock: bakBlocks.splice(delIndex, 1)[0],
        bakBlocks: bakBlocks,
        blocks: this.createRndBlocks(bakBlocks)
      };
    }
  }, {
    key: "createRndBlocks",
    value: function createRndBlocks(blocks) {
      var coords = blocks.map(function (_) {
        return {
          x: _.x,
          y: _.y
        };
      });
      coords.sort(function () {
        return Math.random() - .5;
      });
      var rtnBlocks = JSON.parse(JSON.stringify(blocks));
      rtnBlocks.forEach(function (_, i) {
        _.x = coords[i].x;
        _.y = coords[i].y;
      });
      return rtnBlocks;
    }
  }, {
    key: "drawBlocks",
    value: function drawBlocks() {
      var context = this.context,
          img = this.img,
          width = this.width,
          blocks = this.blocks;
      context.clearRect(0, 0, width, width);
      blocks.forEach(function (_) {
        var ix = _.ix,
            iy = _.iy,
            iw = _.iw,
            ih = _.ih,
            x = _.x,
            y = _.y,
            w = _.w,
            h = _.h;
        context.drawImage(img, ix, iy, iw, ih, x, y, w, h);
      });
    }
  }]);

  return Game;
}();

var options = {
  cols: 3,
  src: document.getElementById('gameImage').src
};
var demo = new Game(document.querySelector('.game-container'));
demo.initUI(options);
},{"../utils":"../utils/index.js"}],"C:/Users/liliang/AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
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
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "56384" + '/');

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