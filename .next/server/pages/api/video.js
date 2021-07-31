(function() {
var exports = {};
exports.id = 101;
exports.ids = [101];
exports.modules = {

/***/ 519:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ videoHandler; }
/* harmony export */ });
/* harmony import */ var ytdl_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(853);
/* harmony import */ var ytdl_core__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(ytdl_core__WEBPACK_IMPORTED_MODULE_0__);

async function videoHandler(req, res) {
  if (req.method !== 'POST') {
    res.status(400).send({
      message: 'Only POST requests allowed'
    });
    return;
  }

  const {
    url,
    formats
  } = req.body;
  const format = await ytdl_core__WEBPACK_IMPORTED_MODULE_0___default().chooseFormat(formats, {
    quality: 'highestvideo'
  });
  const video = await ytdl_core__WEBPACK_IMPORTED_MODULE_0___default()(url, {
    format
  });
  res.setHeader('Content-Length', format.contentLength);
  video.pipe(res);
}

/***/ }),

/***/ 853:
/***/ (function(module) {

"use strict";
module.exports = require("ytdl-core");;

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = function(moduleId) { return __webpack_require__(__webpack_require__.s = moduleId); }
var __webpack_exports__ = (__webpack_exec__(519));
module.exports = __webpack_exports__;

})();