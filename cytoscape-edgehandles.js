(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("lodash.memoize"), require("lodash.throttle"));
	else if(typeof define === 'function' && define.amd)
		define(["lodash.memoize", "lodash.throttle"], factory);
	else if(typeof exports === 'object')
		exports["cytoscapeEdgehandles"] = factory(require("lodash.memoize"), require("lodash.throttle"));
	else
		root["cytoscapeEdgehandles"] = factory(root["_"]["memoize"], root["_"]["throttle"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_13__, __WEBPACK_EXTERNAL_MODULE_14__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 12);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Simple, internal Object.assign() polyfill for options objects etc.

module.exports = Object.assign != null ? Object.assign.bind(Object) : function (tgt) {
  for (var _len = arguments.length, srcs = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    srcs[_key - 1] = arguments[_key];
  }

  srcs.filter(function (src) {
    return src != null;
  }).forEach(function (src) {
    Object.keys(src).forEach(function (k) {
      return tgt[k] = src[k];
    });
  });

  return tgt;
};

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Edgehandles = __webpack_require__(10);
var assign = __webpack_require__(0);

module.exports = function (options) {
  var cy = this;

  if (options.hasOwnProperty('handleNodes')) {
    options.selector = options.handleNodes;
    delete options.handleNodes;
  }

  return new Edgehandles(assign({ cy: cy }, options));
};

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function disableGestures() {
  this.saveGestureState();

  this.cy.zoomingEnabled(false).panningEnabled(false).boxSelectionEnabled(false);

  if (this.options.disableBrowserGestures) {
    var wlOpts = this.windowListenerOptions;

    window.addEventListener('touchstart', this.preventDefault, wlOpts);
    window.addEventListener('touchmove', this.preventDefault, wlOpts);
    window.addEventListener('wheel', this.preventDefault, wlOpts);
  }

  return this;
}

function resetGestures() {
  this.cy.zoomingEnabled(this.lastZoomingEnabled).panningEnabled(this.lastPanningEnabled).boxSelectionEnabled(this.lastBoxSelectionEnabled);

  if (this.options.disableBrowserGestures) {
    var wlOpts = this.windowListenerOptions;

    window.removeEventListener('touchstart', this.preventDefault, wlOpts);
    window.removeEventListener('touchmove', this.preventDefault, wlOpts);
    window.removeEventListener('wheel', this.preventDefault, wlOpts);
  }

  return this;
}

function saveGestureState() {
  var cy = this.cy;


  this.lastPanningEnabled = cy.panningEnabled();
  this.lastZoomingEnabled = cy.zoomingEnabled();
  this.lastBoxSelectionEnabled = cy.boxSelectionEnabled();

  return this;
}

module.exports = { disableGestures: disableGestures, resetGestures: resetGestures, saveGestureState: saveGestureState };

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function addCytoscapeListeners() {
  var _this = this;

  var cy = this.cy,
      options = this.options;

  // grabbing nodes

  this.addListener(cy, 'drag', function () {
    return _this.grabbingNode = true;
  });
  this.addListener(cy, 'free', function () {
    return _this.grabbingNode = false;
  });

  // show handle on hover
  this.addListener(cy, 'mouseover', 'node', function (e) {
    _this.show(e.target);
  });

  // show handle on tap node
  this.addListener(cy, 'tap', 'node', function (e) {
    _this.show(e.target);
  });

  // hide handle when source node moved
  this.addListener(cy, 'position', 'node', function (e) {
    if (e.target.same(_this.sourceNode)) {
      _this.hide();
    }
  });

  // start on tapstart handle
  // start on tapstart node (draw mode)
  // toggle on source node
  this.addListener(cy, 'tapstart', 'node', function (e) {
    var node = e.target;

    if (node.anySame(_this.handleNodes)) {
      _this.handleNode = node.intersection(_this.handleNodes);
      _this.start(_this.sourceNode);
    } else if (_this.drawMode) {
      _this.start(node);
    } else if (node.same(_this.sourceNode)) {
      _this.hide();
    }
  });

  // update line on drag
  this.addListener(cy, 'tapdrag', function (e) {
    _this.update(e.position);
  });

  // hover over preview
  this.addListener(cy, 'tapdragover', 'node', function (e) {
    _this.preview(e.target);
  });

  // hover out unpreview
  this.addListener(cy, 'tapdragout', 'node', function (e) {
    if (options.snap && e.target.same(_this.targetNode)) {
      // then keep the preview
    } else {
      _this.unpreview(e.target);
    }
  });

  // stop gesture on tapend
  this.addListener(cy, 'tapend', function () {
    _this.stop();
  });

  // hide handle if source node is removed
  this.addListener(cy, 'remove', function (e) {
    if (e.target.same(_this.sourceNode)) {
      _this.hide();
    }
  });

  return this;
}

module.exports = { addCytoscapeListeners: addCytoscapeListeners };

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/* eslint-disable no-unused-vars */
var defaults = {
  selector: 'node', // selector/filter function for whether edges can be made from a given node
  preview: true, // whether to show added edges preview before releasing selection
  hoverDelay: 150, // time spent hovering over a target node before it is considered selected
  snap: false, // when enabled, the edge can be drawn by just moving close to a target node (can be confusing on compound graphs)
  snapThreshold: 50, // the target node must be less than or equal to this many pixels away from the cursor/finger
  snapFrequency: 15, // the number of times per second (Hz) that snap checks done (lower is less expensive)
  noEdgeEventsInDraw: false, // set events:no to edges during draws, prevents mouseouts on compounds
  disableBrowserGestures: true, // during an edge drawing gesture, disable browser gestures such as two-finger trackpad swipe and pinch-to-zoom
  handleParams: function handleParams(node) {
    // returns array of elements to be passed to cy.add() for the handle nodes
    // (default classes are always added for you)
    return [];
  },
  handlePosition: function handlePosition(node) {
    return 'middle top'; // sets the position of the handle in the format of "X-AXIS Y-AXIS" such as "left top", "middle top"
  },
  handleInDrawMode: false, // whether to show the handle in draw mode
  edgeType: function edgeType(sourceNode, targetNode, handleNode) {
    // can return 'flat' for flat edges between nodes or 'node' for intermediate node between them
    // returning null/undefined means an edge can't be added between the two nodes
    return 'flat';
  },
  loopAllowed: function loopAllowed(node, handleNode) {
    // for the specified node, return whether edges from itself to itself are allowed
    return false;
  },
  nodeLoopOffset: -50, // offset for edgeType: 'node' loops
  nodeParams: function nodeParams(sourceNode, targetNode, handleNode) {
    // for node between the specified source and target
    // return element object to be passed to cy.add() for intermediary node
    return {};
  },
  edgeParams: function edgeParams(sourceNode, targetNode, i, handleNode) {
    // for edges between the specified source and target
    // return element object to be passed to cy.add() for edge
    // NB: i indicates edge index in case of edgeType: 'node'
    return {};
  },
  ghostEdgeParams: function ghostEdgeParams(sourceNode, handleNode) {
    // return element object to be passed to cy.add() for the ghost edge
    // (default classes are always added for you)
    return {};
  },
  show: function show(sourceNode, handleNodes) {
    // fired when handles is shown
  },
  hide: function hide(sourceNode) {
    // fired when the handles is hidden
  },
  start: function start(sourceNode, handleNode) {
    // fired when edgehandles interaction starts (drag on handle)
  },
  complete: function complete(sourceNode, targetNode, addedEles) {
    // fired when edgehandles is done and elements are added
  },
  stop: function stop(sourceNode) {
    // fired when edgehandles interaction is stopped (either complete with added edges or incomplete)
  },
  cancel: function cancel(sourceNode, cancelledTargets) {
    // fired when edgehandles are cancelled (incomplete gesture)
  },
  hoverover: function hoverover(sourceNode, targetNode) {
    // fired when a target is hovered
  },
  hoverout: function hoverout(sourceNode, targetNode) {
    // fired when a target isn't hovered anymore
  },
  previewon: function previewon(sourceNode, targetNode, previewEles) {
    // fired when preview is shown
  },
  previewoff: function previewoff(sourceNode, targetNode, previewEles) {
    // fired when preview is hidden
  },
  drawon: function drawon() {
    // fired when draw mode enabled
  },
  drawoff: function drawoff() {
    // fired when draw mode disabled
  }
};
/* eslint-enable */

module.exports = defaults;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function toggleDrawMode(bool) {
  var cy = this.cy,
      options = this.options;


  this.drawMode = bool != null ? bool : !this.drawMode;

  if (this.drawMode) {
    this.prevUngrabifyState = cy.autoungrabify();

    cy.autoungrabify(true);

    if (!options.handleInDrawMode && this.handleShown()) {
      this.hide();
    }

    this.emit('drawon');
  } else {
    cy.autoungrabify(this.prevUngrabifyState);

    this.emit('drawoff');
  }

  return this;
}

function enableDrawMode() {
  return this.toggleDrawMode(true);
}

function disableDrawMode() {
  return this.toggleDrawMode(false);
}

module.exports = { toggleDrawMode: toggleDrawMode, enableDrawMode: enableDrawMode, disableDrawMode: disableDrawMode };

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var assign = __webpack_require__(0);
var isArray = function isArray(obj) {
  return Array.isArray ? Array.isArray(obj) : obj != null && obj instanceof Array;
};

function makeEdges() {
  var preview = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

  // can't make edges outside of regular gesture lifecycle
  if (!this.active) {
    return;
  }

  var cy = this.cy,
      options = this.options,
      presumptiveTargets = this.presumptiveTargets,
      previewEles = this.previewEles;

  // can't make preview if disabled

  if (preview && !options.preview) {
    return;
  }

  var sourceNode = this.sourceNode,
      targetNode = this.targetNode,
      handleNode = this.handleNode;

  // detect cancel

  if (!targetNode || targetNode.empty()) {
    this.removePreview();

    this.emit('cancel', this.mp(), sourceNode, presumptiveTargets);

    return;
  }

  // just remove preview class if we already have the edges
  if (!preview && previewEles.nonempty()) {
    cy.startBatch();
    previewEles.removeClass('eh-preview').style('events', '');
    cy.endBatch();

    this.emit('complete', this.mp(), sourceNode, targetNode, previewEles);

    return;
  }

  var edgeType = options.edgeType(sourceNode, targetNode, handleNode);

  // must have a non-empty edge type
  if (!edgeType) {
    return;
  }

  var p = void 0;
  var p1 = sourceNode.position();
  var p2 = targetNode.position();

  if (sourceNode.same(targetNode)) {
    p = {
      x: p1.x + options.nodeLoopOffset,
      y: p1.y + options.nodeLoopOffset
    };
  } else {
    p = {
      x: (p1.x + p2.x) / 2,
      y: (p1.y + p2.y) / 2
    };
  }

  var added = cy.collection();
  var edgeParams = options.edgeParams(sourceNode, targetNode, 0, handleNode);

  cy.startBatch();

  if (edgeType === 'node') {
    var interNodeParams = options.nodeParams(sourceNode, targetNode, handleNode);
    var edgeParams2 = options.edgeParams(sourceNode, targetNode, 1, handleNode);

    var interNode = cy.add(assign({}, interNodeParams, {
      group: 'nodes',
      position: p
    }));

    var sourceEdge = cy.add(assign({}, edgeParams, {
      group: 'edges',
      data: assign({}, edgeParams.data, {
        source: sourceNode.id(),
        target: interNode.id()
      })
    }));

    var targetEdge = cy.add(assign({}, edgeParams2, {
      group: 'edges',
      data: assign({}, edgeParams2.data, {
        source: interNode.id(),
        target: targetNode.id()
      })
    }));

    added = added.merge(interNode).merge(sourceEdge).merge(targetEdge);
  } else {
    // flat
    added = cy.add(assign({}, edgeParams, {
      group: 'edges',
      data: assign({}, edgeParams.data, {
        source: sourceNode.id(),
        target: targetNode.id()
      })
    }));
  }

  if (preview) {
    added.style('events', 'no');
    added.addClass('eh-preview');
    this.previewEles = added;
  }

  cy.endBatch();

  if (!preview) {
    this.emit('complete', this.mp(), sourceNode, targetNode, added);
  }

  return this;
}

function makePreview() {
  this.makeEdges(true);

  return this;
}

function removePreview() {
  if (this.previewEles.nonempty()) {
    this.previewEles.remove();
    this.previewEles = this.cy.collection();
  }

  return this;
}

function handleShown() {
  return this.handleNodes.nonempty();
}

function removeHandles() {
  if (this.handleNodes.nonempty()) {
    this.handleNodes.remove();
    this.handleNodes = this.cy.collection();
  }

  return this;
}

function handlePosition(node) {
  var options = this.options,
      cy = this.cy;

  var handlePosition = _typeof(options.handlePosition) === _typeof('') ? function () {
    return options.handlePosition;
  } : options.handlePosition;
  var p = node.position();
  var h = node.outerHeight();
  var w = node.outerWidth();

  // store how much we should move the handle from origin(p.x, p.y)
  var moveX = 0;
  var moveY = 0;

  // grab axes
  var axes = handlePosition(node).toLowerCase().split(/\s+/);
  var axisX = axes[0];
  var axisY = axes[1];

  // based on handlePosition move left/right/top/bottom. Middle/middle will just be normal
  if (axisX === 'left') {
    moveX = -(w / 2);
  } else if (axisX === 'right') {
    moveX = w / 2;
  }if (axisY === 'top') {
    moveY = -(h / 2);
  } else if (axisY === 'bottom') {
    moveY = h / 2;
  }

  // set handle x and y based on adjusted positions
  var hx = p.x + moveX;
  var hy = p.y + moveY;
  var pos = { x: hx, y: hy };

  return pos;
}

function makeHandles(node) {
  var options = this.options,
      cy = this.cy;


  var handleParams = options.handleParams(node);
  if (!isArray(handleParams)) {
    handleParams = [handleParams];
  }

  var handles = [];
  for (var i = 0; i < handleParams.length; i++) {
    var handle = assign({}, handleParams[i], {
      group: 'nodes',
      grabbable: false,
      selectable: false
    });

    if (!handle.hasOwnProperty('position')) {
      handle.position = this.handlePosition(node);
    }

    handles.push(handle);
  }

  cy.startBatch();
  this.removeHandles();
  this.handleNodes = cy.add(handles);
  this.handleNodes.addClass('eh-handle');
  cy.endBatch();

  return this;
}

function updateEdge() {
  var sourceNode = this.sourceNode,
      ghostNode = this.ghostNode;

  var x = this.mx;
  var y = this.my;

  // can't draw a line without having the starting node
  if (!sourceNode) {
    return;
  }

  if (ghostNode.empty() || ghostNode.removed()) {
    var handleNode = this.handleNode,
        options = this.options,
        cy = this.cy;

    var ghostEdge = void 0,
        ghostEles = void 0;

    cy.startBatch();

    ghostNode = this.ghostNode = cy.add({
      group: 'nodes',
      classes: 'eh-ghost eh-ghost-node',
      position: { x: x, y: y }
    });

    ghostNode.style({
      'background-color': 'blue',
      'width': 0.0001,
      'height': 0.0001,
      'opacity': 0,
      'events': 'no'
    });

    var ghostEdgeParams = options.ghostEdgeParams(sourceNode, handleNode);

    ghostEdge = cy.add(assign({}, ghostEdgeParams, {
      group: 'edges',
      data: assign({}, ghostEdgeParams.data, {
        source: sourceNode.id(),
        target: ghostNode.id()
      })
    }));

    ghostEdge.addClass('eh-ghost eh-ghost-edge');
    ghostEdge.style('events', 'no');

    ghostEles = this.ghostEles = cy.collection();
    ghostEles.merge(ghostNode).merge(ghostEdge);

    cy.endBatch();
  } else {
    this.ghostNode.position({ x: x, y: y });
  }

  return this;
}

module.exports = {
  makeEdges: makeEdges, makePreview: makePreview, removePreview: removePreview,
  updateEdge: updateEdge,
  handleShown: handleShown, handlePosition: handlePosition, makeHandles: makeHandles, removeHandles: removeHandles
};

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function disableEdgeEvents() {
  if (this.options.noEdgeEventsInDraw) {
    this.cy.edges().style('events', 'no');
  }

  return this;
}

function enableEdgeEvents() {
  if (this.options.noEdgeEventsInDraw) {
    this.cy.edges().style('events', '');
  }

  return this;
}

module.exports = { disableEdgeEvents: disableEdgeEvents, enableEdgeEvents: enableEdgeEvents };

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function enable() {
  this.enabled = true;

  this.emit('enable');

  return this;
}

function disable() {
  this.enabled = false;

  this.emit('disable');

  return this;
}

module.exports = { enable: enable, disable: disable };

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var memoize = __webpack_require__(13);

function canStartOn(node) {
  var options = this.options,
      previewEles = this.previewEles,
      ghostEles = this.ghostEles,
      handleNodes = this.handleNodes;

  var isPreview = function isPreview(el) {
    return previewEles.anySame(el);
  };
  var isHandle = function isHandle(el) {
    return handleNodes.anySame(el);
  };
  var isGhost = function isGhost(el) {
    return ghostEles.anySame(el);
  };
  var isTemp = function isTemp(el) {
    return isPreview(el) || isHandle(el) || isGhost(el);
  };
  var userFilter = function userFilter(el) {
    return el.filter(options.selector).nonempty();
  };

  var enabled = this.enabled,
      active = this.active,
      grabbingNode = this.grabbingNode;


  return enabled && !active && !grabbingNode && node != null && node.inside() && !isTemp(node) && userFilter(node);
}

function canStartDrawModeOn(node) {
  return this.canStartOn(node) && this.drawMode;
}

function canStartNonDrawModeOn(node) {
  return this.canStartOn(node) && !this.drawMode;
}

function show(node) {
  var options = this.options,
      drawMode = this.drawMode;


  if (!this.canStartOn(node) || drawMode && !options.handleInDrawMode) {
    return;
  }

  this.sourceNode = node;

  this.makeHandles(node);

  this.emit('show', this.mp(), node, this.handleNodes);

  return this;
}

function hide() {
  this.removeHandles();

  this.emit('hide', this.mp(), this.sourceNode);

  return this;
}

function start(node) {
  if (!this.canStartOn(node)) {
    return;
  }

  this.active = true;

  this.sourceNode = node;
  this.sourceNode.addClass('eh-source');

  this.disableGestures();
  this.disableEdgeEvents();

  this.emit('start', this.mp(), node, this.handleNode);
}

function update(pos) {
  if (!this.active) {
    return;
  }

  var p = pos;

  this.mx = p.x;
  this.my = p.y;

  this.updateEdge();
  this.throttledSnap();

  return this;
}

function snap() {
  if (!this.active || !this.options.snap) {
    return false;
  }

  var cy = this.cy;
  var target = this.targetNode;
  var threshold = this.options.snapThreshold;
  var sqThreshold = function sqThreshold(n) {
    var r = getRadius(n);var t = r + threshold;return t * t;
  };
  var mousePos = this.mp();
  var sqDist = function sqDist(p1, p2) {
    return (p2.x - p1.x) * (p2.x - p1.x) + (p2.y - p1.y) * (p2.y - p1.y);
  };
  var getRadius = function getRadius(n) {
    return (n.outerWidth() + n.outerHeight()) / 4;
  };
  var nodeSqDist = memoize(function (n) {
    return sqDist(n.position(), mousePos);
  }, function (n) {
    return n.id();
  });
  var isWithinTheshold = function isWithinTheshold(n) {
    return nodeSqDist(n) <= sqThreshold(n);
  };
  var cmpSqDist = function cmpSqDist(n1, n2) {
    return nodeSqDist(n1) - nodeSqDist(n2);
  };
  var allowHoverDelay = false;

  var nodesByDist = cy.nodes(isWithinTheshold).sort(cmpSqDist);
  var snapped = false;

  if (target.nonempty() && !isWithinTheshold(target)) {
    this.unpreview(target);
  }

  for (var i = 0; i < nodesByDist.length; i++) {
    var n = nodesByDist[i];

    if (n.same(target) || this.preview(n, allowHoverDelay)) {
      snapped = true;
      break;
    }
  }

  return snapped;
}

function preview(target) {
  var _this = this;

  var allowHoverDelay = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
  var options = this.options,
      sourceNode = this.sourceNode,
      ghostNode = this.ghostNode,
      handleNode = this.handleNode,
      ghostEles = this.ghostEles,
      presumptiveTargets = this.presumptiveTargets,
      previewEles = this.previewEles,
      active = this.active;

  var source = sourceNode;
  var isLoop = target.same(source);
  var loopAllowed = options.loopAllowed(target, handleNode);
  var isGhost = target.same(ghostNode);
  var noEdge = !options.edgeType(source, target, handleNode);
  var isHandle = target.anySame(this.handleNodes);
  var isExistingTgt = target.same(this.targetNode);

  if (!active || isHandle || isGhost || noEdge || isExistingTgt || isLoop && !loopAllowed) {
    return false;
  }

  if (this.targetNode.nonempty()) {
    this.unpreview(this.targetNode);
  }

  clearTimeout(this.previewTimeout);

  var applyPreview = function applyPreview() {
    _this.targetNode = target;

    presumptiveTargets.merge(target);

    target.addClass('eh-presumptive-target');
    target.addClass('eh-target');

    _this.emit('hoverover', _this.mp(), source, target);

    if (options.preview) {
      target.addClass('eh-preview');

      ghostEles.addClass('eh-preview-active');
      sourceNode.addClass('eh-preview-active');
      target.addClass('eh-preview-active');

      _this.makePreview();

      _this.emit('previewon', _this.mp(), source, target, previewEles);
    }
  };

  if (allowHoverDelay && options.hoverDelay > 0) {
    this.previewTimeout = setTimeout(applyPreview, options.hoverDelay);
  } else {
    applyPreview();
  }

  return true;
}

function unpreview(target) {
  if (!this.active || target.anySame(this.handleNodes)) {
    return;
  }

  var ghostEles = this.ghostEles,
      previewEles = this.previewEles,
      cy = this.cy;

  var source = this.sourceNode;

  clearTimeout(this.previewTimeout);
  this.previewTimeout = null;

  source.removeClass('eh-preview-active');
  target.removeClass('eh-preview-active eh-preview eh-target eh-presumptive-target');
  ghostEles.removeClass('eh-preview-active');

  this.targetNode = cy.collection();

  this.removePreview();

  this.emit('hoverout', this.mp(), source, target);
  this.emit('previewoff', this.mp(), source, target, previewEles);

  return this;
}

function stop() {
  if (!this.active) {
    return;
  }

  var sourceNode = this.sourceNode;


  clearTimeout(this.previewTimeout);

  this.sourceNode.removeClass('eh-source');
  this.targetNode.removeClass('eh-target eh-preview eh-hover');
  this.presumptiveTargets.removeClass('eh-presumptive-target');

  this.ghostEles.remove();

  this.removeHandles();

  this.makeEdges();

  this.clearCollections();

  this.resetGestures();
  this.enableEdgeEvents();

  this.active = false;

  this.emit('stop', this.mp(), sourceNode);

  return this;
}

module.exports = {
  show: show, hide: hide, start: start, update: update, preview: preview, unpreview: unpreview, stop: stop, snap: snap,
  canStartOn: canStartOn, canStartDrawModeOn: canStartDrawModeOn, canStartNonDrawModeOn: canStartNonDrawModeOn
};

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var defaults = __webpack_require__(4);
var assign = __webpack_require__(0);
var throttle = __webpack_require__(14);

var cyGesturesToggle = __webpack_require__(2);
var cyListeners = __webpack_require__(3);
var drawMode = __webpack_require__(5);
var drawing = __webpack_require__(6);
var enabling = __webpack_require__(8);
var gestureLifecycle = __webpack_require__(9);
var listeners = __webpack_require__(11);
var edgeEvents = __webpack_require__(7);

function Edgehandles(options) {
  var cy = options.cy;

  this.cy = cy;
  this.listeners = [];

  // edgehandles gesture state
  this.enabled = true;
  this.drawMode = false;
  this.active = false;
  this.grabbingNode = false;

  // edgehandles elements
  this.handleNodes = cy.collection();
  this.clearCollections();

  // mouse position
  this.mx = 0;
  this.my = 0;

  this.options = assign({}, defaults, options);

  this.saveGestureState();
  this.addListeners();

  this.throttledSnap = throttle(this.snap.bind(this), 1000 / options.snapFrequency);

  this.preventDefault = function (e) {
    return e.preventDefault();
  };

  var supportsPassive = false;
  try {
    var opts = Object.defineProperty({}, 'passive', {
      get: function get() {
        supportsPassive = true;
      }
    });

    window.addEventListener('test', null, opts);
  } catch (err) {}

  if (supportsPassive) {
    this.windowListenerOptions = { capture: true, passive: false };
  } else {
    this.windowListenerOptions = true;
  }
}

var proto = Edgehandles.prototype = {};
var extend = function extend(obj) {
  return assign(proto, obj);
};

proto.destroy = function () {
  this.removeListeners();
};

proto.setOptions = function (options) {
  assign(this.options, options);
};

proto.mp = function () {
  return { x: this.mx, y: this.my };
};

proto.clearCollections = function () {
  var cy = this.cy;


  this.handleNode = cy.collection();
  this.previewEles = cy.collection();
  this.ghostNode = cy.collection();
  this.ghostEles = cy.collection();
  this.sourceNode = cy.collection();
  this.targetNode = cy.collection();
  this.presumptiveTargets = cy.collection();
};

[cyGesturesToggle, cyListeners, drawMode, drawing, enabling, gestureLifecycle, listeners, edgeEvents].forEach(extend);

module.exports = Edgehandles;

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function addListeners() {
  var _this = this;

  this.addCytoscapeListeners();

  this.addListener(this.cy, 'destroy', function () {
    return _this.destroy();
  });

  return this;
}

function removeListeners() {
  for (var i = this.listeners.length - 1; i >= 0; i--) {
    var l = this.listeners[i];

    this.removeListener(l.target, l.event, l.selector, l.callback, l.options);
  }

  return this;
}

function getListener(target, event, selector, callback, options) {
  if ((typeof selector === 'undefined' ? 'undefined' : _typeof(selector)) !== _typeof('')) {
    callback = selector;
    options = callback;
    selector = null;
  }

  if (options == null) {
    options = false;
  }

  return { target: target, event: event, selector: selector, callback: callback, options: options };
}

function isDom(target) {
  return target instanceof Element;
}

function addListener(target, event, selector, callback, options) {
  var l = getListener(target, event, selector, callback, options);

  this.listeners.push(l);

  if (isDom(l.target)) {
    l.target.addEventListener(l.event, l.callback, l.options);
  } else {
    if (l.selector) {
      l.target.addListener(l.event, l.selector, l.callback, l.options);
    } else {
      l.target.addListener(l.event, l.callback, l.options);
    }
  }

  return this;
}

function removeListener(target, event, selector, callback, options) {
  var l = getListener(target, event, selector, callback, options);

  for (var i = this.listeners.length - 1; i >= 0; i--) {
    var l2 = this.listeners[i];

    if (l.target === l2.target && l.event === l2.event && (l.selector == null || l.selector === l2.selector) && (l.callback == null || l.callback === l2.callback)) {
      this.listeners.splice(i, 1);

      if (isDom(l.target)) {
        l.target.removeEventListener(l.event, l.callback, l.options);
      } else {
        if (l.selector) {
          l.target.removeListener(l.event, l.selector, l.callback, l.options);
        } else {
          l.target.removeListener(l.event, l.callback, l.options);
        }
      }

      break;
    }
  }

  return this;
}

function emit(type, position) {
  var options = this.options,
      cy = this.cy;

  for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    args[_key - 2] = arguments[_key];
  }

  cy.emit({ type: 'eh' + type, position: position }, args);

  var handler = options[type];

  if (handler != null) {
    handler.apply(undefined, args);
  }

  return this;
}

module.exports = { addListener: addListener, addListeners: addListeners, removeListener: removeListener, removeListeners: removeListeners, emit: emit };

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var impl = __webpack_require__(1);

// registers the extension on a cytoscape lib ref
var register = function register(cytoscape) {
  if (!cytoscape) {
    return;
  } // can't register if cytoscape unspecified

  cytoscape('core', 'edgehandles', impl); // register with cytoscape.js
};

if (typeof cytoscape !== 'undefined') {
  // expose to global cytoscape (i.e. window.cytoscape)
  register(cytoscape); // eslint-disable-line no-undef
}

module.exports = register;

/***/ }),
/* 13 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_13__;

/***/ }),
/* 14 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_14__;

/***/ })
/******/ ]);
});