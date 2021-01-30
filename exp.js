function isObjLiteral(_obj) {
  var _test = _obj;
  return typeof _obj !== "object" || _obj === null
    ? false
    : (function () {
        while (!false) {
          if (
            Object.getPrototypeOf((_test = Object.getPrototypeOf(_test))) ===
            null
          ) {
            break;
          }
        }
        return Object.getPrototypeOf(_obj) === _test;
      })();
}

module.exports = isObjLiteral;
