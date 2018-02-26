/******/ (function(modules) { // webpackBootstrap
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
/******/ 	return __webpack_require__(__webpack_require__.s = 18);
/******/ })
/************************************************************************/
/******/ ({

/***/ 18:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(19);


/***/ }),

/***/ 19:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__cms_our_team__ = __webpack_require__(20);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__cms_serving__ = __webpack_require__(21);



CMS.registerPreviewStyle('/static/css/stcs.css');
CMS.registerPreviewTemplate('our-team', __WEBPACK_IMPORTED_MODULE_0__cms_our_team__["a" /* OurTeamPreview */]);
CMS.registerPreviewTemplate('serving', __WEBPACK_IMPORTED_MODULE_1__cms_serving__["a" /* ServingPreview */]);


/***/ }),

/***/ 20:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return OurTeamPreview; });
var OurTeamPreview = createClass({
  render: function() {
    var entry = this.props.entry;
    var heading = entry.getIn(['data', 'heading', 'left']);
    return h('div', {'className': 'content'},
      h('h1', {}, this.props.widgetFor('heading')),
      h('div', {'className': 'container'},
        h('div', {'className': 'row'},
          h('div', {'className': 'col-xs-12 col-sm-6 col-md-6 col-lg-6'}, entry.getIn(['data', 'intro', 'left'])),
          h('div', {'className': 'col-xs-12 col-sm-6 col-md-6 col-lg-6'}, entry.getIn(['data', 'intro', 'right'])),
        ),
        this.props.widgetsFor('teams').map(function(team, index) {
          return h('div', {},
            h('div', {className: 'container'},
              h('div', {className: 'row'},
                h('div', {className: 'col-xs-12 col-sm-6 col-md-6 col-lg-6'},
                  h('h2', {className: 'heading'}, team.getIn(['data', 'title']))
                ),
              ),
              h('div', {className: 'our-staff'},
                h('div', {className: 'container'},
                  h('div', {className: 'row'},
                    team.getIn(['data', 'members']).map(function(member) {
                      return h('div', {className: 'col-xs-6 col-sm-4 col-md-3 col-lg-2'},
                        h('div', {className: 'thumbnail'}, h('img', {src: member.get('picture')})),
                        h('div', {className: 'caption'},
                          h('h3', {}, member.get('name')),
                          h('p', {}, member.get('title')),
                        ),
                      );
                    })
                  )
                )
              )
            )
          );
        }),
      )
    );
  }
});




/***/ }),

/***/ 21:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ServingPreview; });
var ServingPreview = createClass({
  render: function() {
    var entry = this.props.entry;
    return h('div', {'className': 'content'},
      h('h1', {}, entry.getIn(['data', 'title'])),
      h('div', {'className': 'container'},
        h('div', {'className': 'row'},
          h('div', {'className': 'col-xs-12 col-sm-6 col-md-6 col-lg-6'}, entry.getIn(['data', 'intro', 'left'])),
          h('div', {'className': 'col-xs-12 col-sm-6 col-md-6 col-lg-6'}, entry.getIn(['data', 'intro', 'right'])),
        ),
        h('div', {'className': 'row'},
          h('div', {'className': 'col-xs-12 col-sm-6 col-md-6 col-lg-6'}, entry.getIn(['data', 'heading', 'left'])),
          h('div', {'className': 'col-xs-12 col-sm-6 col-md-6 col-lg-6'}, entry.getIn(['data', 'heading', 'right'])),
        ),
      )
    );
  }
});




/***/ })

/******/ });