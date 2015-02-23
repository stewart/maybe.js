/**
 * maybe.js
 *
 * Copyright (c) 2015 Andrew Stewart
 * Released under the MIT license
 */

(function (root, factory) {
  "use strict";

  if (typeof define === "function" && define.amd) {
    // AMD
    define([], factory);
  } else if (typeof exports === "object") {
    // Node
    module.exports = factory();
  } else {
    // Browser
    root.maybe = factory();
  }
}(this, function () {
  "use strict";

  function not(fn) {
    return function() {
      return !(fn.apply(this, arguments));
    };
  }

  function isA(type) {
    return function(thing) {
      return Object.prototype.toString.call(thing).slice(8, -1) === type;
    };
  }

  var isFunction = isA("Function"),
      isString   = isA("String");

  function maybe(value) {
    function isEmpty() { return value == null; }

    var notEmpty = not(isEmpty);

    function isWrapped(thing) {
      if (isFunction(thing) && isFunction(thing.toString)) {
        return thing.toString().slice(0, 5) === "Maybe";
      }

      return false;
    }

    function wrap(value) {
      if (isWrapped(value)) { return value; }
      return maybe(value);
    }

    function bind(fn) {
      if (isEmpty()) { return maybe.nothing; }

      var args = Array.prototype.slice.call(arguments, 1);

      if (isString(fn)) {
        if (isFunction(value[fn])) {
          return wrap(value[fn].apply(value, args));
        }

        return maybe.nothing;
      }

      args.unshift(value);

      return wrap(fn.apply(null, args));
    }

    function get(key) {
      if (isEmpty()) { return maybe.nothing; }
      return wrap(value[key]);
    }

    function access(opt) {
      if (isEmpty()) { return maybe.nothing; }

      if (isFunction(opt)) {
        return bind.apply(null, arguments);
      }

      if (isString(opt) && isFunction(value[opt])) {
        return bind.apply(null, arguments);
      }

      return get.apply(null, arguments);
    }

    function tap(fn, thisArg) {
      if (notEmpty()) {
        fn.call(thisArg, value);
      }

      return wrap(value);
    }

    function or(thing) {
      if (notEmpty()) { return wrap(value); }

      if (isFunction(thing)) {
        return wrap(thing.call(null));
      }

      return wrap(thing);
    }

    access.get = get;
    access.bind = bind;

    access.tap = tap;
    access.or = or;

    access.isNothing = isEmpty;
    access.isValue = notEmpty;

    access.toString = function() {
      return "Maybe(" + (isEmpty() ? "empty" : value) + ")";
    };

    access.toJSON = function() {
      return {
        type: "Maybe",
        value: value
      };
    };

    Object.defineProperty(access, "value", {
      get: function() {
        return value;
      }
    });

    return access;
  }

  maybe.nothing = maybe(void 0);

  maybe.lift = function(fn) {
    return function() {
      return maybe(fn.apply(this, arguments));
    };
  };

  return maybe;
}));
