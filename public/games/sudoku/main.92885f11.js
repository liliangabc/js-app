parcelRequire=function(e,r,n,t){var i="function"==typeof parcelRequire&&parcelRequire,o="function"==typeof require&&require;function u(n,t){if(!r[n]){if(!e[n]){var f="function"==typeof parcelRequire&&parcelRequire;if(!t&&f)return f(n,!0);if(i)return i(n,!0);if(o&&"string"==typeof n)return o(n);var c=new Error("Cannot find module '"+n+"'");throw c.code="MODULE_NOT_FOUND",c}p.resolve=function(r){return e[n][1][r]||r},p.cache={};var l=r[n]=new u.Module(n);e[n][0].call(l.exports,p,l,l.exports,this)}return r[n].exports;function p(e){return u(p.resolve(e))}}u.isParcelRequire=!0,u.Module=function(e){this.id=e,this.bundle=u,this.exports={}},u.modules=e,u.cache=r,u.parent=i,u.register=function(r,n){e[r]=[function(e,r){r.exports=n},{}]};for(var f=0;f<n.length;f++)u(n[f]);if(n.length){var c=u(n[n.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=c:"function"==typeof define&&define.amd?define(function(){return c}):t&&(this[t]=c)}return u}({"LN/f":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var e={createStyleSheet:function(e){if(!document.getElementById("gameStyleSheet")){var t=document.createElement("style");t.type="text/css",t.id="gameStyleSheet",t.innerHTML=e,document.head.appendChild(t)}},createCanvas:function(e){e=e||document.body;var t=document.createElement("div"),n=document.createElement("canvas");return t.className="game-wrapper",n.className="game-ui",t.appendChild(n),e.appendChild(t),{wrapper:t,canvas:n}},getPixRatio:function(e){var t=e.backingStorePixelRatio||e.webkitBackingStorePixelRatio||e.mozBackingStorePixelRatio||1;return(window.devicePixelRatio||1)/t},isFunc:function(e){return"function"==typeof e},getRndInt:function(e,t){return Math.floor(Math.random()*(t-e+1)+e)},imageLoad:function(e){return new Promise(function(t,n){var a=new Image;a.onload=function(){a.onload=null,t(a)},a.onerror=function(e){a.onerror=null,n(new Error("图片加载失败"))},a.src=e})}},t=e;exports.default=t;
},{}],"epB2":[function(require,module,exports) {
"use strict";var t=i(require("../utils"));function i(t){return t&&t.__esModule?t:{default:t}}function e(t,i){if(!(t instanceof i))throw new TypeError("Cannot call a class as a function")}function o(t,i){for(var e=0;e<i.length;e++){var o=i[e];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(t,o.key,o)}}function s(t,i,e){return i&&o(t.prototype,i),e&&o(t,e),t}var n=function(){function t(i){var o=i.row,s=i.col,n=i.num,c=void 0===n?0:n,a=i.isInput,r=void 0!==a&&a,l=i.isFocus,h=void 0!==l&&l;e(this,t),this.row=o,this.col=s,this.num=c,this.isInput=r,this.isFocus=h}return s(t,[{key:"draw",value:function(t){var i=t.context,e=t.size,o=t.space,s=(e+o)*this.col+o,n=(e+o)*this.row+o;if(i.save(),this.isInput&&(i.fillStyle="#fff",i.fillRect(s,n,e,e),this.isFocus&&(i.save(),i.strokeStyle=i.shadowColor="#00f",i.shadowBlur=8*o,i.strokeRect(s,n,e,e),i.restore())),this.num){i.fillStyle="#424242",i.font="bold ".concat(e/2,"px serif"),i.textBaseline="hanging";var c=i.measureText(this.num).width;i.fillText(this.num,s+(e-c)/2,n+(e-c)/2)}i.restore()}}]),t}(),c=function(){function i(o){var s=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};e(this,i),this.rows=this.cols=9,this.callbacks=s,this.canvas=t.default.createCanvas(o).canvas,this.context=this.canvas.getContext("2d"),this.pixRatio=t.default.getPixRatio(this.context),this.blockSpace=this.pixRatio,this.keyboard=this.createNumKeys(),this.canvas.addEventListener("click",this.onClick.bind(this)),this.keyboard.addEventListener("click",this.onKeyboardClick.bind(this))}return s(i,[{key:"onClick",value:function(t){var i=this.getCurBlock(t);i!==this.focusBlock&&(this.focusBlock&&(this.focusBlock.isFocus=!1),i&&i.isInput?(this.focusBlock=i,this.focusBlock.isFocus=!0):this.focusBlock=null,this.drawUI(),this.updateNumkeysPos())}},{key:"onKeyboardClick",value:function(i){var e=i.target,o=this.callbacks.onDone;"li"===e.tagName.toLowerCase()&&(this.focusBlock.num=+e.textContent,this.focusBlock.isFocus=!1,this.focusBlock=null),this.drawUI(),this.keyboard.classList.remove("show"),this.checkDone()&&setTimeout(function(){return t.default.isFunc(o)&&o()},300)}},{key:"getCurBlock",value:function(t){for(var i=this.blockSize+this.blockSpace,e=(t.offsetX||t.pageX)*this.pixRatio,o=(t.offsetY||t.pageY)*this.pixRatio,s=Math.floor((e-this.blockSpace)/i),n=Math.floor((o-this.blockSpace)/i),c=0,a=this.blocks.length;c<a;c++){var r=this.blocks[c];if(r.row===n&&r.col===s)return r}}},{key:"createNumKeys",value:function(){var t=document.createElement("ul");return t.className="keyboard",t.innerHTML=Array(9).fill(null).map(function(t,i){return"<li>".concat(i+1,"</li>")}).join(""),this.canvas.parentNode.appendChild(t),t}},{key:"updateNumkeysPos",value:function(){var t=this.blockSize,i=this.blockSpace,e=this.pixRatio,o=this.keyboard;if(this.focusBlock){var s=this.focusBlock.row;o.style.top=((s+1)*(t+i)+i)/e+"px",o.classList.add("show")}else o.classList.remove("show")}},{key:"checkDone",value:function(){var t=this;return this.bakEmptyBlocks.every(function(i,e){return i.num===t.blocks[e].num})}},{key:"initUI",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:20,i=arguments.length>1&&void 0!==arguments[1]?arguments[1]:["#ccc","#def1e6"];this.emptyCount=Math.min(t,72),this.colors=i,this.focusBlock=null,this.updateSize(),this.keyboard.style.lineHeight=this.blockSize/this.pixRatio+"px";var e=this.genBlocks(),o=e.bakEmptyBlocks,s=e.blocks;this.bakEmptyBlocks=o,this.blocks=s,this.drawUI()}},{key:"updateSize",value:function(){var t=this.canvas.offsetWidth;this.width=this.canvas.width=this.canvas.height=t*this.pixRatio,this.blockSize=(this.width-(this.rows+1)*this.blockSpace)/this.rows}},{key:"initTable",value:function(){for(var t=[[8,7,1,9,3,2,6,4,5],[4,9,5,8,6,1,2,3,7],[6,3,2,7,5,4,8,1,9],[5,2,8,4,7,3,1,9,6],[9,1,3,6,2,5,7,8,4],[7,6,4,1,9,8,3,5,2],[2,8,7,3,4,9,5,6,1],[1,4,6,5,8,7,9,2,3],[3,5,9,2,1,6,4,7,8]],i=0;i<50;i++)this.replaceNum(t);return t}},{key:"replaceNum",value:function(i){var e=t.default.getRndInt(1,9),o=t.default.getRndInt(1,9);if(e!==o){var s=[],n=[];i.forEach(function(t,i){t.forEach(function(t,c){t===e?s.push({row:i,col:c}):t===o&&n.push({row:i,col:c})})}),s.forEach(function(t){var e=t.row,s=t.col;return i[e][s]=o}),n.forEach(function(t){var o=t.row,s=t.col;return i[o][s]=e})}}},{key:"genBlocks",value:function(){var t=[];this.initTable().forEach(function(i,e){i.forEach(function(i,o){t.push(new n({row:e,col:o,num:i}))})}),t.sort(function(){return Math.random()-.5});var i=t.slice(0,this.emptyCount),e=JSON.parse(JSON.stringify(i));return i.forEach(function(t){t.num=0,t.isInput=!0}),{bakEmptyBlocks:e,blocks:t}}},{key:"drawAreaBG",value:function(){var t=this.context,i=this.colors,e=this.width/3,o=0;t.save();for(var s=0;s<3;s++)for(var n=0;n<3;n++)t.fillStyle=i[o%2],t.fillRect(n*e,s*e,e,e),o++;t.restore()}},{key:"drawLines",value:function(){var t=this.context,i=this.blockSize,e=this.blockSpace,o=this.rows,s=this.width,n=i+e;t.save(),t.lineWidth=e,t.strokeStyle="#424242",t.beginPath();for(var c=0;c<o+1;c++)t.moveTo(0,c*n+e/2),t.lineTo(s,c*n+e/2),t.moveTo(c*n+e/2,0),t.lineTo(c*n+e/2,s);t.stroke(),t.restore()}},{key:"drawUI",value:function(){var t=this.context,i=this.width,e=this.blockSize,o=this.blockSpace;t.clearRect(0,0,i,i),this.drawAreaBG(),this.drawLines(),this.blocks.forEach(function(i){return i.draw({context:t,size:e,space:o})})}}]),i}(),a=new c(null,{onDone:function(){a.initUI(a.emptyCount+(confirm("恭喜！你完成了。要体验更高难度的吗？")?4:0))}});a.initUI();
},{"../utils":"LN/f"}]},{},["epB2"], null)