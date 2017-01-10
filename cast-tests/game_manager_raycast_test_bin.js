var $jscomp = {scope:{}, checkStringArgs:function(thisArg, arg, func) {
  if (null == thisArg) {
    throw new TypeError("The 'this' value for String.prototype." + func + " must not be null or undefined");
  }
  if (arg instanceof RegExp) {
    throw new TypeError("First argument to String.prototype." + func + " must not be a regular expression");
  }
  return thisArg + "";
}};
$jscomp.defineProperty = "function" == typeof Object.defineProperties ? Object.defineProperty : function(target, property, descriptor) {
  if (descriptor.get || descriptor.set) {
    throw new TypeError("ES3 does not support getters and setters.");
  }
  target != Array.prototype && target != Object.prototype && (target[property] = descriptor.value);
};
$jscomp.getGlobal = function(maybeGlobal) {
  return "undefined" != typeof window && window === maybeGlobal ? maybeGlobal : "undefined" != typeof global && null != global ? global : maybeGlobal;
};
$jscomp.global = $jscomp.getGlobal(this);
$jscomp.polyfill = function(target, polyfill, fromLang, toLang) {
  if (polyfill) {
    for (var obj = $jscomp.global, split = target.split("."), i = 0;i < split.length - 1;i++) {
      var key = split[i];
      key in obj || (obj[key] = {});
      obj = obj[key];
    }
    var property = split[split.length - 1], orig = obj[property], impl = polyfill(orig);
    impl != orig && null != impl && $jscomp.defineProperty(obj, property, {configurable:!0, writable:!0, value:impl});
  }
};
$jscomp.polyfill("String.prototype.repeat", function(orig) {
  return orig ? orig : function(copies) {
    var string = $jscomp.checkStringArgs(this, null, "repeat");
    if (0 > copies || 1342177279 < copies) {
      throw new RangeError("Invalid count value");
    }
    copies |= 0;
    for (var result = "";copies;) {
      if (copies & 1 && (result += string), copies >>>= 1) {
        string += string;
      }
    }
    return result;
  };
}, "es6-impl", "es3");
$jscomp.findInternal = function(array, callback, thisArg) {
  array instanceof String && (array = String(array));
  for (var len = array.length, i = 0;i < len;i++) {
    var value = array[i];
    if (callback.call(thisArg, value, i, array)) {
      return {i:i, v:value};
    }
  }
  return {i:-1, v:void 0};
};
$jscomp.polyfill("Array.prototype.findIndex", function(orig) {
  return orig ? orig : function(callback, opt_thisArg) {
    return $jscomp.findInternal(this, callback, opt_thisArg).i;
  };
}, "es6-impl", "es3");
$jscomp.polyfill("Array.prototype.find", function(orig) {
  return orig ? orig : function(callback, opt_thisArg) {
    return $jscomp.findInternal(this, callback, opt_thisArg).v;
  };
}, "es6-impl", "es3");
$jscomp.polyfill("String.prototype.endsWith", function(orig) {
  return orig ? orig : function(searchString, opt_position) {
    var string = $jscomp.checkStringArgs(this, searchString, "endsWith");
    searchString += "";
    void 0 === opt_position && (opt_position = string.length);
    for (var i = Math.max(0, Math.min(opt_position | 0, string.length)), j = searchString.length;0 < j && 0 < i;) {
      if (string[--i] != searchString[--j]) {
        return !1;
      }
    }
    return 0 >= j;
  };
}, "es6-impl", "es3");
$jscomp.polyfill("String.prototype.startsWith", function(orig) {
  return orig ? orig : function(searchString, opt_position) {
    var string = $jscomp.checkStringArgs(this, searchString, "startsWith");
    searchString += "";
    for (var strLen = string.length, searchLen = searchString.length, i = Math.max(0, Math.min(opt_position | 0, string.length)), j = 0;j < searchLen && i < strLen;) {
      if (string[i++] != searchString[j++]) {
        return !1;
      }
    }
    return j >= searchLen;
  };
}, "es6-impl", "es3");
$jscomp.SYMBOL_PREFIX = "jscomp_symbol_";
$jscomp.initSymbol = function() {
  $jscomp.initSymbol = function() {
  };
  $jscomp.global.Symbol || ($jscomp.global.Symbol = $jscomp.Symbol);
};
$jscomp.symbolCounter_ = 0;
$jscomp.Symbol = function(opt_description) {
  return $jscomp.SYMBOL_PREFIX + (opt_description || "") + $jscomp.symbolCounter_++;
};
$jscomp.initSymbolIterator = function() {
  $jscomp.initSymbol();
  var symbolIterator = $jscomp.global.Symbol.iterator;
  symbolIterator || (symbolIterator = $jscomp.global.Symbol.iterator = $jscomp.global.Symbol("iterator"));
  "function" != typeof Array.prototype[symbolIterator] && $jscomp.defineProperty(Array.prototype, symbolIterator, {configurable:!0, writable:!0, value:function() {
    return $jscomp.arrayIterator(this);
  }});
  $jscomp.initSymbolIterator = function() {
  };
};
$jscomp.arrayIterator = function(array) {
  var index = 0;
  return $jscomp.iteratorPrototype(function() {
    return index < array.length ? {done:!1, value:array[index++]} : {done:!0};
  });
};
$jscomp.iteratorPrototype = function(next) {
  $jscomp.initSymbolIterator();
  var iterator = {next:next};
  iterator[$jscomp.global.Symbol.iterator] = function() {
    return this;
  };
  return iterator;
};
$jscomp.array = $jscomp.array || {};
$jscomp.iteratorFromArray = function(array, transform) {
  $jscomp.initSymbolIterator();
  array instanceof String && (array += "");
  var i = 0, iter = {next:function() {
    if (i < array.length) {
      var index = i++;
      return {value:transform(index, array[index]), done:!1};
    }
    iter.next = function() {
      return {done:!0, value:void 0};
    };
    return iter.next();
  }};
  iter[Symbol.iterator] = function() {
    return iter;
  };
  return iter;
};
$jscomp.polyfill("Array.prototype.keys", function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill;
  return function() {
    return $jscomp.iteratorFromArray(this, function(i) {
      return i;
    });
  };
}, "es6-impl", "es3");
var goog = goog || {};
goog.global = this;
goog.isDef = function(val) {
  return void 0 !== val;
};
goog.exportPath_ = function(name, opt_object, opt_objectToExportTo) {
  var parts = name.split("."), cur = opt_objectToExportTo || goog.global;
  parts[0] in cur || !cur.execScript || cur.execScript("var " + parts[0]);
  for (var part;parts.length && (part = parts.shift());) {
    !parts.length && goog.isDef(opt_object) ? cur[part] = opt_object : cur = cur[part] ? cur[part] : cur[part] = {};
  }
};
goog.define = function(name, defaultValue) {
  goog.exportPath_(name, defaultValue);
};
goog.DEBUG = !0;
goog.LOCALE = "en";
goog.TRUSTED_SITE = !0;
goog.STRICT_MODE_COMPATIBLE = !1;
goog.DISALLOW_TEST_ONLY_CODE = !goog.DEBUG;
goog.ENABLE_CHROME_APP_SAFE_SCRIPT_LOADING = !1;
goog.provide = function(name) {
  if (goog.isInModuleLoader_()) {
    throw Error("goog.provide can not be used within a goog.module.");
  }
  goog.constructNamespace_(name);
};
goog.constructNamespace_ = function(name, opt_obj) {
  var namespace;
  goog.exportPath_(name, opt_obj);
};
goog.VALID_MODULE_RE_ = /^[a-zA-Z_$][a-zA-Z0-9._$]*$/;
goog.module = function(name) {
  if (!goog.isString(name) || !name || -1 == name.search(goog.VALID_MODULE_RE_)) {
    throw Error("Invalid module identifier");
  }
  if (!goog.isInModuleLoader_()) {
    throw Error("Module " + name + " has been loaded incorrectly. Note, modules cannot be loaded as normal scripts. They require some kind of pre-processing step. You're likely trying to load a module via a script tag or as a part of a concatenated bundle without rewriting the module. For more info see: https://github.com/google/closure-library/wiki/goog.module:-an-ES6-module-like-alternative-to-goog.provide.");
  }
  if (goog.moduleLoaderState_.moduleName) {
    throw Error("goog.module may only be called once per module.");
  }
  goog.moduleLoaderState_.moduleName = name;
};
goog.module.get = function(name) {
  return goog.module.getInternal_(name);
};
goog.module.getInternal_ = function(name) {
  var ns;
  return null;
};
goog.moduleLoaderState_ = null;
goog.isInModuleLoader_ = function() {
  return null != goog.moduleLoaderState_;
};
goog.module.declareLegacyNamespace = function() {
  goog.moduleLoaderState_.declareLegacyNamespace = !0;
};
goog.setTestOnly = function(opt_message) {
  if (goog.DISALLOW_TEST_ONLY_CODE) {
    throw opt_message = opt_message || "", Error("Importing test-only code into non-debug environment" + (opt_message ? ": " + opt_message : "."));
  }
};
goog.forwardDeclare = function(name) {
};
goog.getObjectByName = function(name, opt_obj) {
  for (var parts = name.split("."), cur = opt_obj || goog.global, part;part = parts.shift();) {
    if (goog.isDefAndNotNull(cur[part])) {
      cur = cur[part];
    } else {
      return null;
    }
  }
  return cur;
};
goog.globalize = function(obj, opt_global) {
  var global = opt_global || goog.global, x;
  for (x in obj) {
    global[x] = obj[x];
  }
};
goog.addDependency = function(relPath, provides, requires, opt_loadFlags) {
  if (goog.DEPENDENCIES_ENABLED) {
    var provide, require, path = relPath.replace(/\\/g, "/"), deps = goog.dependencies_;
    opt_loadFlags && "boolean" !== typeof opt_loadFlags || (opt_loadFlags = opt_loadFlags ? {module:"goog"} : {});
    for (var i = 0;provide = provides[i];i++) {
      deps.nameToPath[provide] = path, deps.loadFlags[path] = opt_loadFlags;
    }
    for (var j = 0;require = requires[j];j++) {
      path in deps.requires || (deps.requires[path] = {}), deps.requires[path][require] = !0;
    }
  }
};
goog.useStrictRequires = !1;
goog.ENABLE_DEBUG_LOADER = !0;
goog.logToConsole_ = function(msg) {
  goog.global.console && goog.global.console.error(msg);
};
goog.require = function(name) {
  var errorMessage, path;
};
goog.basePath = "";
goog.nullFunction = function() {
};
goog.abstractMethod = function() {
  throw Error("unimplemented abstract method");
};
goog.addSingletonGetter = function(ctor) {
  ctor.instance_ = void 0;
  ctor.getInstance = function() {
    if (ctor.instance_) {
      return ctor.instance_;
    }
    goog.DEBUG && (goog.instantiatedSingletons_[goog.instantiatedSingletons_.length] = ctor);
    return ctor.instance_ = new ctor;
  };
};
goog.instantiatedSingletons_ = [];
goog.LOAD_MODULE_USING_EVAL = !0;
goog.SEAL_MODULE_EXPORTS = goog.DEBUG;
goog.loadedModules_ = {};
goog.DEPENDENCIES_ENABLED = !1;
goog.TRANSPILE = "detect";
goog.TRANSPILER = "transpile.js";
goog.DEPENDENCIES_ENABLED && (goog.dependencies_ = {loadFlags:{}, nameToPath:{}, requires:{}, visited:{}, written:{}, deferred:{}}, goog.inHtmlDocument_ = function() {
  var doc = goog.global.document;
  return null != doc && "write" in doc;
}, goog.findBasePath_ = function() {
  if (goog.isDef(goog.global.CLOSURE_BASE_PATH)) {
    goog.basePath = goog.global.CLOSURE_BASE_PATH;
  } else {
    if (goog.inHtmlDocument_()) {
      for (var scripts = goog.global.document.getElementsByTagName("SCRIPT"), i = scripts.length - 1;0 <= i;--i) {
        var src = scripts[i].src, qmark = src.lastIndexOf("?"), l = -1 == qmark ? src.length : qmark;
        if ("base.js" == src.substr(l - 7, 7)) {
          goog.basePath = src.substr(0, l - 7);
          break;
        }
      }
    }
  }
}, goog.importScript_ = function(src, opt_sourceText) {
  (goog.global.CLOSURE_IMPORT_SCRIPT || goog.writeScriptTag_)(src, opt_sourceText) && (goog.dependencies_.written[src] = !0);
}, goog.IS_OLD_IE_ = !(goog.global.atob || !goog.global.document || !goog.global.document.all), goog.importProcessedScript_ = function(src, isModule, needsTranspile) {
  var bootstrap;
  goog.importScript_("", 'goog.retrieveAndExec_("' + src + '", ' + isModule + ", " + needsTranspile + ");");
}, goog.queuedModules_ = [], goog.wrapModule_ = function(srcUrl, scriptText) {
  return goog.LOAD_MODULE_USING_EVAL && goog.isDef(goog.global.JSON) ? "goog.loadModule(" + goog.global.JSON.stringify(scriptText + "\n//# sourceURL=" + srcUrl + "\n") + ");" : 'goog.loadModule(function(exports) {"use strict";' + scriptText + "\n;return exports});\n//# sourceURL=" + srcUrl + "\n";
}, goog.loadQueuedModules_ = function() {
  var count = goog.queuedModules_.length;
  if (0 < count) {
    var queue = goog.queuedModules_;
    goog.queuedModules_ = [];
    for (var i = 0;i < count;i++) {
      goog.maybeProcessDeferredPath_(queue[i]);
    }
  }
}, goog.maybeProcessDeferredDep_ = function(name) {
  goog.isDeferredModule_(name) && goog.allDepsAreAvailable_(name) && goog.maybeProcessDeferredPath_(goog.basePath + goog.getPathFromDeps_(name));
}, goog.isDeferredModule_ = function(name) {
  var path = goog.getPathFromDeps_(name), loadFlags = path && goog.dependencies_.loadFlags[path] || {}, languageLevel = loadFlags.lang || "es3";
  return path && ("goog" == loadFlags.module || goog.needsTranspile_(languageLevel)) ? goog.basePath + path in goog.dependencies_.deferred : !1;
}, goog.allDepsAreAvailable_ = function(name) {
  var path = goog.getPathFromDeps_(name);
  if (path && path in goog.dependencies_.requires) {
    for (var requireName in goog.dependencies_.requires[path]) {
      if (!goog.isProvided_(requireName) && !goog.isDeferredModule_(requireName)) {
        return !1;
      }
    }
  }
  return !0;
}, goog.maybeProcessDeferredPath_ = function(abspath) {
  if (abspath in goog.dependencies_.deferred) {
    var src = goog.dependencies_.deferred[abspath];
    delete goog.dependencies_.deferred[abspath];
    goog.globalEval(src);
  }
}, goog.loadModuleFromUrl = function(url) {
  goog.retrieveAndExec_(url, !0, !1);
}, goog.writeScriptSrcNode_ = function(src) {
  goog.global.document.write('<script type="text/javascript" src="' + src + '">\x3c/script>');
}, goog.appendScriptSrcNode_ = function(src) {
  var doc = goog.global.document, scriptEl = doc.createElement("script");
  scriptEl.type = "text/javascript";
  scriptEl.src = src;
  scriptEl.defer = !1;
  scriptEl.async = !1;
  doc.head.appendChild(scriptEl);
}, goog.writeScriptTag_ = function(src, opt_sourceText) {
  if (goog.inHtmlDocument_()) {
    var doc = goog.global.document;
    if (!goog.ENABLE_CHROME_APP_SAFE_SCRIPT_LOADING && "complete" == doc.readyState) {
      if (/\bdeps.js$/.test(src)) {
        return !1;
      }
      throw Error('Cannot write "' + src + '" after document load');
    }
    if (void 0 === opt_sourceText) {
      if (goog.IS_OLD_IE_) {
        var state = " onreadystatechange='goog.onScriptLoad_(this, " + ++goog.lastNonModuleScriptIndex_ + ")' ";
        doc.write('<script type="text/javascript" src="' + src + '"' + state + ">\x3c/script>");
      } else {
        goog.ENABLE_CHROME_APP_SAFE_SCRIPT_LOADING ? goog.appendScriptSrcNode_(src) : goog.writeScriptSrcNode_(src);
      }
    } else {
      doc.write('<script type="text/javascript">' + goog.protectScriptTag_(opt_sourceText) + "\x3c/script>");
    }
    return !0;
  }
  return !1;
}, goog.protectScriptTag_ = function(str) {
  return str.replace(/<\/(SCRIPT)/ig, "\\x3c\\$1");
}, goog.needsTranspile_ = function(lang) {
  if ("always" == goog.TRANSPILE) {
    return !0;
  }
  if ("never" == goog.TRANSPILE) {
    return !1;
  }
  goog.requiresTranspilation_ || (goog.requiresTranspilation_ = goog.createRequiresTranspilation_());
  if (lang in goog.requiresTranspilation_) {
    return goog.requiresTranspilation_[lang];
  }
  throw Error("Unknown language mode: " + lang);
}, goog.requiresTranspilation_ = null, goog.lastNonModuleScriptIndex_ = 0, goog.onScriptLoad_ = function(script, scriptIndex) {
  "complete" == script.readyState && goog.lastNonModuleScriptIndex_ == scriptIndex && goog.loadQueuedModules_();
  return !0;
}, goog.writeScripts_ = function(pathToLoad) {
  function visitNode(path) {
    if (!(path in deps.written || path in deps.visited)) {
      deps.visited[path] = !0;
      if (path in deps.requires) {
        for (var requireName in deps.requires[path]) {
          if (!goog.isProvided_(requireName)) {
            if (requireName in deps.nameToPath) {
              visitNode(deps.nameToPath[requireName]);
            } else {
              throw Error("Undefined nameToPath for " + requireName);
            }
          }
        }
      }
      path in seenScript || (seenScript[path] = !0, scripts.push(path));
    }
  }
  var scripts = [], seenScript = {}, deps = goog.dependencies_;
  visitNode(pathToLoad);
  for (var i = 0;i < scripts.length;i++) {
    var path$jscomp$0 = scripts[i];
    goog.dependencies_.written[path$jscomp$0] = !0;
  }
  var moduleState = goog.moduleLoaderState_;
  goog.moduleLoaderState_ = null;
  for (i = 0;i < scripts.length;i++) {
    if (path$jscomp$0 = scripts[i]) {
      var loadFlags = deps.loadFlags[path$jscomp$0] || {}, needsTranspile = goog.needsTranspile_(loadFlags.lang || "es3");
      "goog" == loadFlags.module || needsTranspile ? goog.importProcessedScript_(goog.basePath + path$jscomp$0, "goog" == loadFlags.module, needsTranspile) : goog.importScript_(goog.basePath + path$jscomp$0);
    } else {
      throw goog.moduleLoaderState_ = moduleState, Error("Undefined script input");
    }
  }
  goog.moduleLoaderState_ = moduleState;
}, goog.getPathFromDeps_ = function(rule) {
  return rule in goog.dependencies_.nameToPath ? goog.dependencies_.nameToPath[rule] : null;
}, goog.findBasePath_(), goog.global.CLOSURE_NO_DEPS || goog.importScript_(goog.basePath + "deps.js"));
goog.loadModule = function(moduleDef) {
  var previousState = goog.moduleLoaderState_;
  try {
    goog.moduleLoaderState_ = {moduleName:void 0, declareLegacyNamespace:!1};
    var exports;
    if (goog.isFunction(moduleDef)) {
      exports = moduleDef.call(void 0, {});
    } else {
      if (goog.isString(moduleDef)) {
        exports = goog.loadModuleFromSource_.call(void 0, moduleDef);
      } else {
        throw Error("Invalid module definition");
      }
    }
    var moduleName = goog.moduleLoaderState_.moduleName;
    if (!goog.isString(moduleName) || !moduleName) {
      throw Error('Invalid module name "' + moduleName + '"');
    }
    goog.moduleLoaderState_.declareLegacyNamespace ? goog.constructNamespace_(moduleName, exports) : goog.SEAL_MODULE_EXPORTS && Object.seal && goog.isObject(exports) && Object.seal(exports);
    goog.loadedModules_[moduleName] = exports;
  } finally {
    goog.moduleLoaderState_ = previousState;
  }
};
goog.loadModuleFromSource_ = function(JSCompiler_OptimizeArgumentsArray_p0) {
  eval(JSCompiler_OptimizeArgumentsArray_p0);
  return {};
};
goog.normalizePath_ = function(path) {
  for (var components = path.split("/"), i = 0;i < components.length;) {
    "." == components[i] ? components.splice(i, 1) : i && ".." == components[i] && components[i - 1] && ".." != components[i - 1] ? components.splice(--i, 2) : i++;
  }
  return components.join("/");
};
goog.loadFileSync_ = function(src) {
  if (goog.global.CLOSURE_LOAD_FILE_SYNC) {
    return goog.global.CLOSURE_LOAD_FILE_SYNC(src);
  }
  try {
    var xhr = new goog.global.XMLHttpRequest;
    xhr.open("get", src, !1);
    xhr.send();
    return 0 == xhr.status || 200 == xhr.status ? xhr.responseText : null;
  } catch (err) {
    return null;
  }
};
goog.retrieveAndExec_ = function(src, isModule, needsTranspile) {
  var scriptText, importScript, originalPath;
};
goog.transpile_ = function(code$jscomp$0, path$jscomp$0) {
  var jscomp = goog.global.$jscomp;
  jscomp || (goog.global.$jscomp = jscomp = {});
  var transpile = jscomp.transpile;
  if (!transpile) {
    var transpilerPath = goog.basePath + goog.TRANSPILER, transpilerCode = goog.loadFileSync_(transpilerPath);
    if (transpilerCode) {
      eval(transpilerCode + "\n//# sourceURL=" + transpilerPath);
      if (goog.global.$gwtExport && goog.global.$gwtExport.$jscomp && !goog.global.$gwtExport.$jscomp.transpile) {
        throw Error('The transpiler did not properly export the "transpile" method. $gwtExport: ' + JSON.stringify(goog.global.$gwtExport));
      }
      goog.global.$jscomp.transpile = goog.global.$gwtExport.$jscomp.transpile;
      jscomp = goog.global.$jscomp;
      transpile = jscomp.transpile;
    }
  }
  if (!transpile) {
    var suffix = " requires transpilation but no transpiler was found.", suffix = suffix + ' Please add "//javascript/closure:transpiler" as a data dependency to ensure it is included.', transpile = jscomp.transpile = function(code, path) {
      goog.logToConsole_(path + suffix);
      return code;
    };
  }
  return transpile(code$jscomp$0, path$jscomp$0);
};
goog.typeOf = function(value) {
  var s = typeof value;
  if ("object" == s) {
    if (value) {
      if (value instanceof Array) {
        return "array";
      }
      if (value instanceof Object) {
        return s;
      }
      var className = Object.prototype.toString.call(value);
      if ("[object Window]" == className) {
        return "object";
      }
      if ("[object Array]" == className || "number" == typeof value.length && "undefined" != typeof value.splice && "undefined" != typeof value.propertyIsEnumerable && !value.propertyIsEnumerable("splice")) {
        return "array";
      }
      if ("[object Function]" == className || "undefined" != typeof value.call && "undefined" != typeof value.propertyIsEnumerable && !value.propertyIsEnumerable("call")) {
        return "function";
      }
    } else {
      return "null";
    }
  } else {
    if ("function" == s && "undefined" == typeof value.call) {
      return "object";
    }
  }
  return s;
};
goog.isNull = function(val) {
  return null === val;
};
goog.isDefAndNotNull = function(val) {
  return null != val;
};
goog.isArray = function(val) {
  return "array" == goog.typeOf(val);
};
goog.isArrayLike = function(val) {
  var type = goog.typeOf(val);
  return "array" == type || "object" == type && "number" == typeof val.length;
};
goog.isDateLike = function(val) {
  return goog.isObject(val) && "function" == typeof val.getFullYear;
};
goog.isString = function(val) {
  return "string" == typeof val;
};
goog.isBoolean = function(val) {
  return "boolean" == typeof val;
};
goog.isNumber = function(val) {
  return "number" == typeof val;
};
goog.isFunction = function(val) {
  return "function" == goog.typeOf(val);
};
goog.isObject = function(val) {
  var type = typeof val;
  return "object" == type && null != val || "function" == type;
};
goog.getUid = function(obj) {
  return obj[goog.UID_PROPERTY_] || (obj[goog.UID_PROPERTY_] = ++goog.uidCounter_);
};
goog.hasUid = function(obj) {
  return !!obj[goog.UID_PROPERTY_];
};
goog.removeUid = function(obj) {
  null !== obj && "removeAttribute" in obj && obj.removeAttribute(goog.UID_PROPERTY_);
  try {
    delete obj[goog.UID_PROPERTY_];
  } catch (ex) {
  }
};
goog.UID_PROPERTY_ = "closure_uid_" + (1e9 * Math.random() >>> 0);
goog.uidCounter_ = 0;
goog.getHashCode = goog.getUid;
goog.removeHashCode = goog.removeUid;
goog.cloneObject = function(obj) {
  var type = goog.typeOf(obj);
  if ("object" == type || "array" == type) {
    if (obj.clone) {
      return obj.clone();
    }
    var clone = "array" == type ? [] : {}, key;
    for (key in obj) {
      clone[key] = goog.cloneObject(obj[key]);
    }
    return clone;
  }
  return obj;
};
goog.bindNative_ = function(fn, selfObj, var_args) {
  return fn.call.apply(fn.bind, arguments);
};
goog.bindJs_ = function(fn, selfObj, var_args) {
  if (!fn) {
    throw Error();
  }
  if (2 < arguments.length) {
    var boundArgs = Array.prototype.slice.call(arguments, 2);
    return function() {
      var newArgs = Array.prototype.slice.call(arguments);
      Array.prototype.unshift.apply(newArgs, boundArgs);
      return fn.apply(selfObj, newArgs);
    };
  }
  return function() {
    return fn.apply(selfObj, arguments);
  };
};
goog.bind = function(fn, selfObj, var_args) {
  Function.prototype.bind && -1 != Function.prototype.bind.toString().indexOf("native code") ? goog.bind = goog.bindNative_ : goog.bind = goog.bindJs_;
  return goog.bind.apply(null, arguments);
};
goog.partial = function(fn, var_args) {
  var args = Array.prototype.slice.call(arguments, 1);
  return function() {
    var newArgs = args.slice();
    newArgs.push.apply(newArgs, arguments);
    return fn.apply(this, newArgs);
  };
};
goog.mixin = function(target, source) {
  for (var x in source) {
    target[x] = source[x];
  }
};
goog.now = goog.TRUSTED_SITE && Date.now || function() {
  return +new Date;
};
goog.globalEval = function(script) {
  if (goog.global.execScript) {
    goog.global.execScript(script, "JavaScript");
  } else {
    if (goog.global.eval) {
      if (null == goog.evalWorksForGlobals_) {
        if (goog.global.eval("var _evalTest_ = 1;"), "undefined" != typeof goog.global._evalTest_) {
          try {
            delete goog.global._evalTest_;
          } catch (ignore) {
          }
          goog.evalWorksForGlobals_ = !0;
        } else {
          goog.evalWorksForGlobals_ = !1;
        }
      }
      if (goog.evalWorksForGlobals_) {
        goog.global.eval(script);
      } else {
        var doc = goog.global.document, scriptElt = doc.createElement("SCRIPT");
        scriptElt.type = "text/javascript";
        scriptElt.defer = !1;
        scriptElt.appendChild(doc.createTextNode(script));
        doc.body.appendChild(scriptElt);
        doc.body.removeChild(scriptElt);
      }
    } else {
      throw Error("goog.globalEval not available");
    }
  }
};
goog.evalWorksForGlobals_ = null;
goog.getCssName = function(className, opt_modifier) {
  if ("." == String(className).charAt(0)) {
    throw Error('className passed in goog.getCssName must not start with ".". You passed: ' + className);
  }
  var getMapping = function(cssName) {
    return goog.cssNameMapping_[cssName] || cssName;
  }, renameByParts = function(cssName) {
    for (var parts = cssName.split("-"), mapped = [], i = 0;i < parts.length;i++) {
      mapped.push(getMapping(parts[i]));
    }
    return mapped.join("-");
  }, rename;
  rename = goog.cssNameMapping_ ? "BY_WHOLE" == goog.cssNameMappingStyle_ ? getMapping : renameByParts : function(a) {
    return a;
  };
  var result = opt_modifier ? className + "-" + rename(opt_modifier) : rename(className);
  return goog.global.CLOSURE_CSS_NAME_MAP_FN ? goog.global.CLOSURE_CSS_NAME_MAP_FN(result) : result;
};
goog.setCssNameMapping = function(mapping, opt_style) {
  goog.cssNameMapping_ = mapping;
  goog.cssNameMappingStyle_ = opt_style;
};
goog.getMsg = function(str, opt_values) {
  opt_values && (str = str.replace(/\{\$([^}]+)}/g, function(match, key) {
    return null != opt_values && key in opt_values ? opt_values[key] : match;
  }));
  return str;
};
goog.getMsgWithFallback = function(a, b) {
  return a;
};
goog.exportSymbol = function(publicPath, object, opt_objectToExportTo) {
  goog.exportPath_(publicPath, object, opt_objectToExportTo);
};
goog.exportProperty = function(object, publicName, symbol) {
  object[publicName] = symbol;
};
goog.inherits = function(childCtor, parentCtor) {
  function tempCtor() {
  }
  tempCtor.prototype = parentCtor.prototype;
  childCtor.superClass_ = parentCtor.prototype;
  childCtor.prototype = new tempCtor;
  childCtor.prototype.constructor = childCtor;
  childCtor.base = function(me, methodName, var_args) {
    for (var args = Array(arguments.length - 2), i = 2;i < arguments.length;i++) {
      args[i - 2] = arguments[i];
    }
    return parentCtor.prototype[methodName].apply(me, args);
  };
};
goog.base = function(me, opt_methodName, var_args) {
  var caller = arguments.callee.caller;
  if (goog.STRICT_MODE_COMPATIBLE || goog.DEBUG && !caller) {
    throw Error("arguments.caller not defined.  goog.base() cannot be used with strict mode code. See http://www.ecma-international.org/ecma-262/5.1/#sec-C");
  }
  if (caller.superClass_) {
    for (var ctorArgs = Array(arguments.length - 1), i = 1;i < arguments.length;i++) {
      ctorArgs[i - 1] = arguments[i];
    }
    return caller.superClass_.constructor.apply(me, ctorArgs);
  }
  for (var args = Array(arguments.length - 2), i = 2;i < arguments.length;i++) {
    args[i - 2] = arguments[i];
  }
  for (var foundCaller = !1, ctor = me.constructor;ctor;ctor = ctor.superClass_ && ctor.superClass_.constructor) {
    if (ctor.prototype[opt_methodName] === caller) {
      foundCaller = !0;
    } else {
      if (foundCaller) {
        return ctor.prototype[opt_methodName].apply(me, args);
      }
    }
  }
  if (me[opt_methodName] === caller) {
    return me.constructor.prototype[opt_methodName].apply(me, args);
  }
  throw Error("goog.base called from a method of one name to a method of a different name");
};
goog.scope = function(fn) {
  if (goog.isInModuleLoader_()) {
    throw Error("goog.scope is not supported within a goog.module.");
  }
  fn.call(goog.global);
};
goog.defineClass = function(superClass, def) {
  var constructor = def.constructor, statics = def.statics;
  constructor && constructor != Object.prototype.constructor || (constructor = function() {
    throw Error("cannot instantiate an interface (no constructor defined).");
  });
  var cls = goog.defineClass.createSealingConstructor_(constructor, superClass);
  superClass && goog.inherits(cls, superClass);
  delete def.constructor;
  delete def.statics;
  goog.defineClass.applyProperties_(cls.prototype, def);
  null != statics && (statics instanceof Function ? statics(cls) : goog.defineClass.applyProperties_(cls, statics));
  return cls;
};
goog.defineClass.SEAL_CLASS_INSTANCES = goog.DEBUG;
goog.defineClass.createSealingConstructor_ = function(ctr, superClass) {
  if (!goog.defineClass.SEAL_CLASS_INSTANCES) {
    return ctr;
  }
  var superclassSealable = !goog.defineClass.isUnsealable_(superClass), wrappedCtr = function() {
    var instance = ctr.apply(this, arguments) || this;
    instance[goog.UID_PROPERTY_] = instance[goog.UID_PROPERTY_];
    this.constructor === wrappedCtr && superclassSealable && Object.seal instanceof Function && Object.seal(instance);
    return instance;
  };
  return wrappedCtr;
};
goog.defineClass.isUnsealable_ = function(ctr) {
  return ctr && ctr.prototype && ctr.prototype[goog.UNSEALABLE_CONSTRUCTOR_PROPERTY_];
};
goog.defineClass.OBJECT_PROTOTYPE_FIELDS_ = "constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");
goog.defineClass.applyProperties_ = function(target, source) {
  for (var key in source) {
    Object.prototype.hasOwnProperty.call(source, key) && (target[key] = source[key]);
  }
  for (var i = 0;i < goog.defineClass.OBJECT_PROTOTYPE_FIELDS_.length;i++) {
    key = goog.defineClass.OBJECT_PROTOTYPE_FIELDS_[i], Object.prototype.hasOwnProperty.call(source, key) && (target[key] = source[key]);
  }
};
goog.tagUnsealableClass = function(ctr) {
};
goog.UNSEALABLE_CONSTRUCTOR_PROPERTY_ = "goog_defineClass_legacy_unsealable";
goog.createRequiresTranspilation_ = function() {
  function addNewerLanguageTranspilationCheck(modeName, isSupported) {
    transpilationRequiredForAllLaterModes ? requiresTranspilation[modeName] = !0 : isSupported() ? requiresTranspilation[modeName] = !1 : transpilationRequiredForAllLaterModes = requiresTranspilation[modeName] = !0;
  }
  function evalCheck(code) {
    try {
      return !!eval(code);
    } catch (ignored) {
      return !1;
    }
  }
  var requiresTranspilation = {es3:!1}, transpilationRequiredForAllLaterModes = !1;
  addNewerLanguageTranspilationCheck("es5", function() {
    return evalCheck("[1,].length==1");
  });
  addNewerLanguageTranspilationCheck("es6", function() {
    var es6fullTest;
    return evalCheck('(()=>{"use strict";class X{constructor(){if(new.target!=String)throw 1;this.x=42}}let q=Reflect.construct(X,[],String);if(q.x!=42||!(q instanceof String))throw 1;for(const a of[2,3]){if(a==2)continue;function f(z={a}){let a=0;return z.a}{function f(){return 0;}}return f()==3}})()');
  });
  addNewerLanguageTranspilationCheck("es6-impl", function() {
    return !0;
  });
  addNewerLanguageTranspilationCheck("es7", function() {
    return evalCheck("2 ** 2 == 4");
  });
  addNewerLanguageTranspilationCheck("es8", function() {
    return evalCheck("async () => 1, true");
  });
  return requiresTranspilation;
};
goog.setTestOnly("goog.testing.stacktrace");
goog.testing = {};
goog.testing.stacktrace = {};
goog.testing.stacktrace.Frame = function(context, name, alias, path) {
  this.context_ = context;
  this.name_ = name;
  this.alias_ = alias;
  this.path_ = path;
};
goog.testing.stacktrace.Frame.prototype.getName = function() {
  return this.name_;
};
goog.testing.stacktrace.Frame.prototype.isAnonymous = function() {
  return !this.name_ || "[object Object]" == this.context_;
};
goog.testing.stacktrace.Frame.prototype.toCanonicalString = function() {
  var htmlEscape = goog.testing.stacktrace.htmlEscape_, deobfuscate = goog.testing.stacktrace.maybeDeobfuscateFunctionName_, canonical = [this.context_ ? htmlEscape(this.context_) + "." : "", this.name_ ? htmlEscape(deobfuscate(this.name_)) : "anonymous", this.alias_ ? " [as " + htmlEscape(deobfuscate(this.alias_)) + "]" : ""];
  this.path_ && (canonical.push(" at "), canonical.push(htmlEscape(this.path_)));
  return canonical.join("");
};
goog.testing.stacktrace.MAX_DEPTH_ = 20;
goog.testing.stacktrace.MAX_FIREFOX_FRAMESTRING_LENGTH_ = 500000;
goog.testing.stacktrace.IDENTIFIER_PATTERN_ = "[a-zA-Z_$][\\w$]*";
goog.testing.stacktrace.V8_ALIAS_PATTERN_ = "(?: \\[as (" + goog.testing.stacktrace.IDENTIFIER_PATTERN_ + ")\\])?";
goog.testing.stacktrace.V8_CONTEXT_PATTERN_ = "(?:((?:new )?(?:\\[object Object\\]|" + goog.testing.stacktrace.IDENTIFIER_PATTERN_ + "(?:\\." + goog.testing.stacktrace.IDENTIFIER_PATTERN_ + ")*))\\.)?";
goog.testing.stacktrace.V8_FUNCTION_NAME_PATTERN_ = "(?:new )?(?:" + goog.testing.stacktrace.IDENTIFIER_PATTERN_ + "|<anonymous>)";
goog.testing.stacktrace.V8_FUNCTION_CALL_PATTERN_ = " " + goog.testing.stacktrace.V8_CONTEXT_PATTERN_ + "(" + goog.testing.stacktrace.V8_FUNCTION_NAME_PATTERN_ + ")" + goog.testing.stacktrace.V8_ALIAS_PATTERN_;
goog.testing.stacktrace.URL_PATTERN_ = "((?:http|https|file)://[^\\s)]+|javascript:.*)";
goog.testing.stacktrace.CHROME_URL_PATTERN_ = " (?:\\(unknown source\\)|\\(native\\)|\\((.+)\\)|(.+))";
goog.testing.stacktrace.V8_STACK_FRAME_REGEXP_ = new RegExp("^    at(?:" + goog.testing.stacktrace.V8_FUNCTION_CALL_PATTERN_ + ")?" + goog.testing.stacktrace.CHROME_URL_PATTERN_ + "$");
goog.testing.stacktrace.FIREFOX_FUNCTION_CALL_PATTERN_ = "(" + goog.testing.stacktrace.IDENTIFIER_PATTERN_ + "(?:\\." + goog.testing.stacktrace.IDENTIFIER_PATTERN_ + ")*)?(\\(.*\\))?@";
goog.testing.stacktrace.FIREFOX_STACK_FRAME_REGEXP_ = new RegExp("^" + goog.testing.stacktrace.FIREFOX_FUNCTION_CALL_PATTERN_ + "(?::0|" + goog.testing.stacktrace.URL_PATTERN_ + ")$");
goog.testing.stacktrace.OPERA_ANONYMOUS_FUNCTION_NAME_PATTERN_ = "<anonymous function(?:\\: (?:(" + goog.testing.stacktrace.IDENTIFIER_PATTERN_ + "(?:\\." + goog.testing.stacktrace.IDENTIFIER_PATTERN_ + ")*)\\.)?(" + goog.testing.stacktrace.IDENTIFIER_PATTERN_ + "))?>";
goog.testing.stacktrace.OPERA_FUNCTION_CALL_PATTERN_ = "(?:(?:(" + goog.testing.stacktrace.IDENTIFIER_PATTERN_ + ")|" + goog.testing.stacktrace.OPERA_ANONYMOUS_FUNCTION_NAME_PATTERN_ + ")(\\(.*\\)))?@";
goog.testing.stacktrace.OPERA_STACK_FRAME_REGEXP_ = new RegExp("^" + goog.testing.stacktrace.OPERA_FUNCTION_CALL_PATTERN_ + goog.testing.stacktrace.URL_PATTERN_ + "?$");
goog.testing.stacktrace.FUNCTION_SOURCE_REGEXP_ = new RegExp("^function (" + goog.testing.stacktrace.IDENTIFIER_PATTERN_ + ")");
goog.testing.stacktrace.IE_FUNCTION_CALL_PATTERN_ = "(" + goog.testing.stacktrace.IDENTIFIER_PATTERN_ + "(?:\\." + goog.testing.stacktrace.IDENTIFIER_PATTERN_ + ")*(?:\\s+\\w+)*)";
goog.testing.stacktrace.IE_STACK_FRAME_REGEXP_ = new RegExp("^   at " + goog.testing.stacktrace.IE_FUNCTION_CALL_PATTERN_ + "\\s*\\((eval code:[^)]*|Unknown script code:[^)]*|" + goog.testing.stacktrace.URL_PATTERN_ + ")\\)?$");
goog.testing.stacktrace.followCallChain_ = function() {
  for (var frames = [], fn = arguments.callee.caller, depth = 0;fn && depth < goog.testing.stacktrace.MAX_DEPTH_;) {
    var match = Function.prototype.toString.call(fn).match(goog.testing.stacktrace.FUNCTION_SOURCE_REGEXP_);
    frames.push(new goog.testing.stacktrace.Frame("", match ? match[1] : "", "", ""));
    try {
      fn = fn.caller;
    } catch (e) {
      break;
    }
    depth++;
  }
  return frames;
};
goog.testing.stacktrace.parseStackFrame_ = function(frameStr) {
  var m = frameStr.match(goog.testing.stacktrace.V8_STACK_FRAME_REGEXP_);
  return m ? new goog.testing.stacktrace.Frame(m[1] || "", m[2] || "", m[3] || "", m[4] || m[5] || m[6] || "") : frameStr.length > goog.testing.stacktrace.MAX_FIREFOX_FRAMESTRING_LENGTH_ ? null : (m = frameStr.match(goog.testing.stacktrace.FIREFOX_STACK_FRAME_REGEXP_)) ? new goog.testing.stacktrace.Frame("", m[1] || "", "", m[3] || "") : (m = frameStr.match(goog.testing.stacktrace.OPERA_STACK_FRAME_REGEXP_)) ? new goog.testing.stacktrace.Frame(m[2] || "", m[1] || m[3] || "", "", m[5] || "") : (m = 
  frameStr.match(goog.testing.stacktrace.IE_STACK_FRAME_REGEXP_)) ? new goog.testing.stacktrace.Frame("", m[1] || "", "", m[2] || "") : null;
};
goog.testing.stacktrace.setDeobfuscateFunctionName = function(fn) {
  goog.testing.stacktrace.deobfuscateFunctionName_ = fn;
};
goog.testing.stacktrace.maybeDeobfuscateFunctionName_ = function(name) {
  return goog.testing.stacktrace.deobfuscateFunctionName_ ? goog.testing.stacktrace.deobfuscateFunctionName_(name) : name;
};
goog.testing.stacktrace.htmlEscape_ = function(text) {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
};
goog.testing.stacktrace.framesToString_ = function(frames) {
  for (var lastIndex = frames.length - 1;frames[lastIndex] && frames[lastIndex].isAnonymous();) {
    lastIndex--;
  }
  for (var privateAssertIndex = -1, i = 0;i < frames.length;i++) {
    if (frames[i] && "_assert" == frames[i].getName()) {
      privateAssertIndex = i;
      break;
    }
  }
  for (var canonical = [], i = privateAssertIndex + 1;i <= lastIndex;i++) {
    canonical.push("> "), frames[i] ? canonical.push(frames[i].toCanonicalString()) : canonical.push("(unknown)"), canonical.push("\n");
  }
  return canonical.join("");
};
goog.testing.stacktrace.parse_ = function(stack) {
  for (var lines = stack.replace(/\s*$/, "").split("\n"), frames = [], i = 0;i < lines.length;i++) {
    frames.push(goog.testing.stacktrace.parseStackFrame_(lines[i]));
  }
  return frames;
};
goog.testing.stacktrace.canonicalize = function(stack) {
  var frames = goog.testing.stacktrace.parse_(stack);
  return goog.testing.stacktrace.framesToString_(frames);
};
goog.testing.stacktrace.getNativeStack_ = function() {
  var tmpError = Error();
  if (tmpError.stack) {
    return tmpError.stack;
  }
  try {
    null.x();
  } catch (e) {
    return e.stack;
  }
  return "";
};
goog.testing.stacktrace.get = function() {
  var stack = goog.testing.stacktrace.getNativeStack_(), frames;
  frames = stack ? goog.isArray(stack) ? goog.testing.stacktrace.callSitesToFrames_(stack) : goog.testing.stacktrace.parse_(stack) : goog.testing.stacktrace.followCallChain_();
  return goog.testing.stacktrace.framesToString_(frames);
};
goog.testing.stacktrace.callSitesToFrames_ = function(stack) {
  for (var frames = [], i = 0;i < stack.length;i++) {
    var callSite = stack[i], functionName = callSite.getFunctionName() || "unknown", fileName = callSite.getFileName(), path = fileName ? fileName + ":" + callSite.getLineNumber() + ":" + callSite.getColumnNumber() : "unknown";
    frames.push(new goog.testing.stacktrace.Frame("", functionName, "", path));
  }
  return frames;
};
goog.exportSymbol("setDeobfuscateFunctionName", goog.testing.stacktrace.setDeobfuscateFunctionName);
goog.setTestOnly("goog.testing.JsUnitException");
goog.testing.asserts = {};
var DOUBLE_EQUALITY_PREDICATE = function(var1, var2) {
  return var1 == var2;
}, TO_STRING_EQUALITY_PREDICATE = function(var1, var2) {
  return var1.toString() === var2.toString();
}, PredicateFunctionType, PRIMITIVE_EQUALITY_PREDICATES = {String:DOUBLE_EQUALITY_PREDICATE, Number:DOUBLE_EQUALITY_PREDICATE, Boolean:DOUBLE_EQUALITY_PREDICATE, Date:function(date1, date2) {
  return date1.getTime() == date2.getTime();
}, RegExp:TO_STRING_EQUALITY_PREDICATE, Function:TO_STRING_EQUALITY_PREDICATE};
goog.testing.asserts.numberRoughEqualityPredicate_ = function(var1, var2, tolerance) {
  return Math.abs(var1 - var2) <= tolerance;
};
goog.testing.asserts.primitiveRoughEqualityPredicates_ = {Number:goog.testing.asserts.numberRoughEqualityPredicate_};
var _trueTypeOf = function(something) {
  var result = typeof something;
  try {
    switch(result) {
      case "object":
        if (null == something) {
          result = "null";
          break;
        }
      case "function":
        switch(something.constructor) {
          case (new String("")).constructor:
            result = "String";
            break;
          case (new Boolean(!0)).constructor:
            result = "Boolean";
            break;
          case (new Number(0)).constructor:
            result = "Number";
            break;
          case [].constructor:
            result = "Array";
            break;
          case RegExp().constructor:
            result = "RegExp";
            break;
          case (new Date).constructor:
            result = "Date";
            break;
          case Function:
            result = "Function";
            break;
          default:
            var m = something.constructor.toString().match(/function\s*([^( ]+)\(/);
            m && (result = m[1]);
        }
    }
  } catch (e) {
  } finally {
    result = result.substr(0, 1).toUpperCase() + result.substr(1);
  }
  return result;
}, _displayStringForValue = function(aVar) {
  var result;
  try {
    result = "<" + String(aVar) + ">";
  } catch (ex) {
    result = "<toString failed: " + ex.message + ">";
  }
  null !== aVar && void 0 !== aVar && (result += " (" + _trueTypeOf(aVar) + ")");
  return result;
}, fail = function(failureMessage) {
  goog.testing.asserts.raiseException("Call to fail()", failureMessage);
}, argumentsIncludeComments = function(expectedNumberOfNonCommentArgs, args) {
  return args.length == expectedNumberOfNonCommentArgs + 1;
}, commentArg = function(expectedNumberOfNonCommentArgs, args) {
  return argumentsIncludeComments(expectedNumberOfNonCommentArgs, args) ? args[0] : null;
}, nonCommentArg = function(desiredNonCommentArgIndex, expectedNumberOfNonCommentArgs, args) {
  return argumentsIncludeComments(expectedNumberOfNonCommentArgs, args) ? args[desiredNonCommentArgIndex] : args[desiredNonCommentArgIndex - 1];
}, _validateArguments = function(expectedNumberOfNonCommentArgs, args) {
  _assert(null, args.length == expectedNumberOfNonCommentArgs || args.length == expectedNumberOfNonCommentArgs + 1 && goog.isString(args[0]), "Incorrect arguments passed to assert function");
}, _getCurrentTestCase = function() {
  var testRunner = goog.global.G_testRunner;
  return testRunner ? testRunner.testCase : null;
}, _assert = function(comment, booleanValue, failureMessage) {
  booleanValue || goog.testing.asserts.raiseException(comment, failureMessage);
};
goog.testing.asserts.getDefaultErrorMsg_ = function(expected, actual) {
  var msg = "Expected " + _displayStringForValue(expected) + " but was " + _displayStringForValue(actual);
  if ("string" == typeof expected && "string" == typeof actual) {
    for (var limit = Math.min(expected.length, actual.length), commonPrefix = 0;commonPrefix < limit && expected.charAt(commonPrefix) == actual.charAt(commonPrefix);) {
      commonPrefix++;
    }
    for (var commonSuffix = 0;commonSuffix < limit && expected.charAt(expected.length - commonSuffix - 1) == actual.charAt(actual.length - commonSuffix - 1);) {
      commonSuffix++;
    }
    commonPrefix + commonSuffix > limit && (commonSuffix = 0);
    if (2 < commonPrefix || 2 < commonSuffix) {
      var printString = function(str) {
        var startIndex = Math.max(0, commonPrefix - 2), endIndex = Math.min(str.length, str.length - (commonSuffix - 2));
        return (0 < startIndex ? "..." : "") + str.substring(startIndex, endIndex) + (endIndex < str.length ? "..." : "");
      }, msg = msg + ("\nDifference was at position " + commonPrefix + ". Expected [" + printString(expected) + "] vs. actual [" + printString(actual) + "]");
    }
  }
  return msg;
};
var assert = function(a, opt_b) {
  _validateArguments(1, arguments);
  var comment = commentArg(1, arguments), booleanValue = nonCommentArg(1, 1, arguments);
  _assert(comment, goog.isBoolean(booleanValue), "Bad argument to assert(boolean)");
  _assert(comment, booleanValue, "Call to assert(boolean) with false");
}, assertThrows = function(a, opt_b) {
  _validateArguments(1, arguments);
  var func = nonCommentArg(1, 1, arguments), comment = commentArg(1, arguments);
  _assert(comment, "function" == typeof func, "Argument passed to assertThrows is not a function");
  try {
    func();
  } catch (e) {
    if (e && goog.isString(e.stacktrace) && goog.isString(e.message)) {
      var startIndex = e.message.length - e.stacktrace.length;
      e.message.indexOf(e.stacktrace, startIndex) == startIndex && (e.message = e.message.substr(0, startIndex - 14));
    }
    var testCase = _getCurrentTestCase();
    e && e.isJsUnitException && testCase && testCase.failOnUnreportedAsserts && goog.testing.asserts.raiseException(comment, "Function passed to assertThrows caught a JsUnitException (usually from an assert or call to fail()). If this is expected, use assertThrowsJsUnitException instead.");
    return e;
  }
  goog.testing.asserts.raiseException(comment, "No exception thrown from function passed to assertThrows");
}, assertTrue = function(a, opt_b) {
  _validateArguments(1, arguments);
  var comment = commentArg(1, arguments), booleanValue = nonCommentArg(1, 1, arguments);
  _assert(comment, goog.isBoolean(booleanValue), "Bad argument to assertTrue(boolean)");
  _assert(comment, booleanValue, "Call to assertTrue(boolean) with false");
}, assertEquals = function(a, b, opt_c) {
  _validateArguments(2, arguments);
  var var1 = nonCommentArg(1, 2, arguments), var2 = nonCommentArg(2, 2, arguments);
  _assert(commentArg(2, arguments), var1 === var2, goog.testing.asserts.getDefaultErrorMsg_(var1, var2));
}, assertNull = function(a, opt_b) {
  _validateArguments(1, arguments);
  var aVar = nonCommentArg(1, 1, arguments);
  _assert(commentArg(1, arguments), null === aVar, goog.testing.asserts.getDefaultErrorMsg_(null, aVar));
}, assertNotNull = function(a, opt_b) {
  _validateArguments(1, arguments);
  _assert(commentArg(1, arguments), null !== nonCommentArg(1, 1, arguments), "Expected not to be " + _displayStringForValue(null));
}, assertNotUndefined = function(a, opt_b) {
  _validateArguments(1, arguments);
  _assert(commentArg(1, arguments), void 0 !== nonCommentArg(1, 1, arguments), "Expected not to be " + _displayStringForValue(void 0));
}, assertNotNullNorUndefined = function(a, opt_b) {
  _validateArguments(1, arguments);
  assertNotNull.apply(null, arguments);
  assertNotUndefined.apply(null, arguments);
};
goog.testing.asserts.callWithoutLogging = function(fn) {
  var testRunner = goog.global.G_testRunner, oldLogTestFailure = testRunner.logTestFailure;
  try {
    testRunner.logTestFailure = void 0, fn();
  } finally {
    testRunner.logTestFailure = oldLogTestFailure;
  }
};
goog.testing.asserts.EQUALITY_PREDICATE_CANT_PROCESS = null;
goog.testing.asserts.EQUALITY_PREDICATE_VARS_ARE_EQUAL = "";
goog.testing.asserts.findDifferences = function(expected, actual, opt_equalityPredicate) {
  function innerAssertWithCycleCheck(var1, var2, path) {
    for (var i = 0;i < seen1.length;++i) {
      var match1 = seen1[i] === var1, match2 = seen2[i] === var2;
      if (match1 || match2) {
        match1 && match2 || failures.push("Asymmetric cycle detected at " + path);
        return;
      }
    }
    seen1.push(var1);
    seen2.push(var2);
    if (var1 !== var2) {
      var typeOfVar1 = _trueTypeOf(var1), typeOfVar2 = _trueTypeOf(var2);
      if (typeOfVar1 == typeOfVar2) {
        var isArray = "Array" == typeOfVar1, errorMessage = equalityPredicate(typeOfVar1, var1, var2);
        if (errorMessage != goog.testing.asserts.EQUALITY_PREDICATE_CANT_PROCESS) {
          errorMessage != goog.testing.asserts.EQUALITY_PREDICATE_VARS_ARE_EQUAL && failures.push(path + ": " + errorMessage);
        } else {
          if (isArray && var1.length != var2.length) {
            failures.push(path + ": Expected " + var1.length + "-element array but got a " + var2.length + "-element array");
          } else {
            var childPath = path + (isArray ? "[%s]" : path ? ".%s" : "%s");
            if (var1.__iterator__) {
              goog.isFunction(var1.equals) ? var1.equals(var2) || failures.push("equals() returned false for " + (path || typeOfVar1)) : var1.map_ ? innerAssertWithCycleCheck(var1.map_, var2.map_, childPath.replace("%s", "map_")) : failures.push("unable to check " + (path || typeOfVar1) + " for equality: it has an iterator we do not know how to handle. please add an equals method");
            } else {
              for (var prop in var1) {
                isArray && goog.testing.asserts.isArrayIndexProp_(prop) || (prop in var2 ? innerAssertWithCycleCheck(var1[prop], var2[prop], childPath.replace("%s", prop)) : failures.push("property " + prop + " not present in actual " + (path || typeOfVar2)));
              }
              for (prop in var2) {
                isArray && goog.testing.asserts.isArrayIndexProp_(prop) || prop in var1 || failures.push("property " + prop + " not present in expected " + (path || typeOfVar1));
              }
              if (isArray) {
                for (prop = 0;prop < var1.length;prop++) {
                  innerAssertWithCycleCheck(var1[prop], var2[prop], childPath.replace("%s", String(prop)));
                }
              }
            }
          }
        }
      } else {
        failures.push(path + " " + goog.testing.asserts.getDefaultErrorMsg_(var1, var2));
      }
    }
    seen1.pop();
    seen2.pop();
  }
  var failures = [], seen1 = [], seen2 = [], equalityPredicate = opt_equalityPredicate || function(type, var1, var2) {
    var typedPredicate = PRIMITIVE_EQUALITY_PREDICATES[type];
    return typedPredicate ? typedPredicate(var1, var2) ? goog.testing.asserts.EQUALITY_PREDICATE_VARS_ARE_EQUAL : goog.testing.asserts.getDefaultErrorMsg_(var1, var2) : goog.testing.asserts.EQUALITY_PREDICATE_CANT_PROCESS;
  };
  innerAssertWithCycleCheck(expected, actual, "");
  return 0 == failures.length ? null : goog.testing.asserts.getDefaultErrorMsg_(expected, actual) + "\n   " + failures.join("\n   ");
};
var assertObjectEquals = function(a, b, opt_c) {
  _validateArguments(2, arguments);
  var failureMessage = commentArg(2, arguments) ? commentArg(2, arguments) : "", differences = goog.testing.asserts.findDifferences(nonCommentArg(1, 2, arguments), nonCommentArg(2, 2, arguments));
  _assert(failureMessage, !differences, differences);
}, assertCSSValueEquals = function(a, b, c, opt_d) {
  _validateArguments(3, arguments);
  var propertyName = nonCommentArg(1, 3, arguments), actualValue = nonCommentArg(3, 3, arguments), expectedValueStandardized = standardizeCSSValue(propertyName, nonCommentArg(2, 3, arguments)), actualValueStandardized = standardizeCSSValue(propertyName, actualValue);
  _assert(commentArg(3, arguments), expectedValueStandardized == actualValueStandardized, goog.testing.asserts.getDefaultErrorMsg_(expectedValueStandardized, actualValueStandardized));
}, assertRoughlyEquals = function(a, b, c, opt_d) {
  _validateArguments(3, arguments);
  var expected = nonCommentArg(1, 3, arguments), actual = nonCommentArg(2, 3, arguments), tolerance = nonCommentArg(3, 3, arguments);
  _assert(commentArg(3, arguments), goog.testing.asserts.numberRoughEqualityPredicate_(expected, actual, tolerance), "Expected " + expected + ", but got " + actual + " which was more than " + tolerance + " away");
};
goog.testing.asserts.toArray_ = function(arrayLike) {
  for (var ret = [], i = 0;i < arrayLike.length;i++) {
    ret[i] = arrayLike[i];
  }
  return ret;
};
goog.testing.asserts.indexOf_ = function(container, contained) {
  if (container.indexOf) {
    return container.indexOf(contained);
  }
  for (var i = 0;i < container.length;i++) {
    if (container[i] === contained) {
      return i;
    }
  }
  return -1;
};
goog.testing.asserts.contains_ = function(container, contained) {
  return -1 != goog.testing.asserts.indexOf_(container, contained);
};
var standardizeHTML = function(html) {
  var translator = document.createElement("DIV");
  translator.innerHTML = html;
  return translator.innerHTML.replace(/^\s+|\s+$/g, "");
}, standardizeCSSValue = function(propertyName, value) {
  var styleDeclaration = document.createElement("DIV").style;
  styleDeclaration[propertyName] = value;
  return styleDeclaration[propertyName];
};
goog.testing.asserts.raiseException = function(comment, opt_message) {
  var e = new goog.testing.JsUnitException(comment, opt_message), testCase = _getCurrentTestCase();
  if (testCase) {
    testCase.raiseAssertionException(e);
  } else {
    throw goog.global.console.error("Failed to save thrown exception: no test case is installed."), e;
  }
};
goog.testing.asserts.isArrayIndexProp_ = function(prop) {
  return (prop | 0) == prop;
};
goog.testing.JsUnitException = function(comment, opt_message) {
  this.isJsUnitException = !0;
  this.message = (comment ? comment : "") + (comment && opt_message ? "\n" : "") + (opt_message ? opt_message : "");
  goog.testing.stacktrace.get();
  Error.captureStackTrace ? Error.captureStackTrace(this, goog.testing.JsUnitException) : this.stack = Error().stack || "";
};
goog.inherits(goog.testing.JsUnitException, Error);
goog.testing.JsUnitException.prototype.toString = function() {
  return this.message;
};
goog.exportSymbol("fail", fail);
goog.exportSymbol("assert", assert);
goog.exportSymbol("assertThrows", assertThrows);
goog.exportSymbol("assertNotThrows", function(a, opt_b) {
  _validateArguments(1, arguments);
  var comment = commentArg(1, arguments), func = nonCommentArg(1, 1, arguments);
  _assert(comment, "function" == typeof func, "Argument passed to assertNotThrows is not a function");
  try {
    return func();
  } catch (e) {
    goog.testing.asserts.raiseException((comment ? comment + "\n" : "") + "A non expected exception was thrown from function passed to assertNotThrows", e.stack || e.stacktrace || e.toString());
  }
});
goog.exportSymbol("assertThrowsJsUnitException", function(callback, opt_expectedMessage) {
  try {
    goog.testing.asserts.callWithoutLogging(callback);
  } catch (e) {
    var testCase = _getCurrentTestCase();
    testCase ? testCase.invalidateAssertionException(e) : goog.global.console.error("Failed to remove expected exception: no test case is installed.");
    e.isJsUnitException || fail("Expected a JsUnitException");
    "undefined" != typeof opt_expectedMessage && e.message != opt_expectedMessage && fail("Expected message [" + opt_expectedMessage + "] but got [" + e.message + "]");
    return e;
  }
  var msg = "Expected a failure";
  "undefined" != typeof opt_expectedMessage && (msg += ": " + opt_expectedMessage);
  throw new goog.testing.JsUnitException(msg);
});
goog.exportSymbol("assertTrue", assertTrue);
goog.exportSymbol("assertFalse", function(a, opt_b) {
  _validateArguments(1, arguments);
  var comment = commentArg(1, arguments), booleanValue = nonCommentArg(1, 1, arguments);
  _assert(comment, goog.isBoolean(booleanValue), "Bad argument to assertFalse(boolean)");
  _assert(comment, !booleanValue, "Call to assertFalse(boolean) with true");
});
goog.exportSymbol("assertEquals", assertEquals);
goog.exportSymbol("assertNotEquals", function(a, b, opt_c) {
  _validateArguments(2, arguments);
  var var2 = nonCommentArg(2, 2, arguments);
  _assert(commentArg(2, arguments), nonCommentArg(1, 2, arguments) !== var2, "Expected not to be " + _displayStringForValue(var2));
});
goog.exportSymbol("assertNull", assertNull);
goog.exportSymbol("assertNotNull", assertNotNull);
goog.exportSymbol("assertUndefined", function(a, opt_b) {
  _validateArguments(1, arguments);
  var aVar = nonCommentArg(1, 1, arguments);
  _assert(commentArg(1, arguments), void 0 === aVar, goog.testing.asserts.getDefaultErrorMsg_(void 0, aVar));
});
goog.exportSymbol("assertNotUndefined", assertNotUndefined);
goog.exportSymbol("assertNotNullNorUndefined", assertNotNullNorUndefined);
goog.exportSymbol("assertNonEmptyString", function(a, opt_b) {
  _validateArguments(1, arguments);
  var aVar = nonCommentArg(1, 1, arguments);
  _assert(commentArg(1, arguments), void 0 !== aVar && null !== aVar && "string" == typeof aVar && "" !== aVar, "Expected non-empty string but was " + _displayStringForValue(aVar));
});
goog.exportSymbol("assertNaN", function(a, opt_b) {
  _validateArguments(1, arguments);
  _assert(commentArg(1, arguments), isNaN(nonCommentArg(1, 1, arguments)), "Expected NaN");
});
goog.exportSymbol("assertNotNaN", function(a, opt_b) {
  _validateArguments(1, arguments);
  _assert(commentArg(1, arguments), !isNaN(nonCommentArg(1, 1, arguments)), "Expected not NaN");
});
goog.exportSymbol("assertObjectEquals", assertObjectEquals);
goog.exportSymbol("assertObjectRoughlyEquals", function(a, b, c, opt_d) {
  _validateArguments(3, arguments);
  var tolerance = nonCommentArg(3, 3, arguments), failureMessage = commentArg(3, arguments) ? commentArg(3, arguments) : "", differences = goog.testing.asserts.findDifferences(nonCommentArg(1, 3, arguments), nonCommentArg(2, 3, arguments), function(type, var1, var2) {
    var typedPredicate = goog.testing.asserts.primitiveRoughEqualityPredicates_[type];
    return typedPredicate ? typedPredicate(var1, var2, tolerance) ? goog.testing.asserts.EQUALITY_PREDICATE_VARS_ARE_EQUAL : goog.testing.asserts.getDefaultErrorMsg_(var1, var2) + " which was more than " + tolerance + " away" : goog.testing.asserts.EQUALITY_PREDICATE_CANT_PROCESS;
  });
  _assert(failureMessage, !differences, differences);
});
goog.exportSymbol("assertObjectNotEquals", function(a, b, opt_c) {
  _validateArguments(2, arguments);
  var failureMessage = commentArg(2, arguments) ? commentArg(2, arguments) : "", differences = goog.testing.asserts.findDifferences(nonCommentArg(1, 2, arguments), nonCommentArg(2, 2, arguments));
  _assert(failureMessage, differences, "Objects should not be equal");
});
goog.exportSymbol("assertArrayEquals", function(a, b, opt_c) {
  _validateArguments(2, arguments);
  var v1 = nonCommentArg(1, 2, arguments), v2 = nonCommentArg(2, 2, arguments), failureMessage = commentArg(2, arguments) ? commentArg(2, arguments) : "", typeOfVar1 = _trueTypeOf(v1);
  _assert(failureMessage, "Array" == typeOfVar1, "Expected an array for assertArrayEquals but found a " + typeOfVar1);
  var typeOfVar2 = _trueTypeOf(v2);
  _assert(failureMessage, "Array" == typeOfVar2, "Expected an array for assertArrayEquals but found a " + typeOfVar2);
  assertObjectEquals(failureMessage, Array.prototype.concat.call(v1), Array.prototype.concat.call(v2));
});
goog.exportSymbol("assertElementsEquals", function(a, b, opt_c) {
  _validateArguments(2, arguments);
  var v1 = nonCommentArg(1, 2, arguments), v2 = nonCommentArg(2, 2, arguments), failureMessage = commentArg(2, arguments) ? commentArg(2, arguments) : "";
  if (v1) {
    assertEquals("length mismatch: " + failureMessage, v1.length, v2.length);
    for (var i = 0;i < v1.length;++i) {
      assertEquals("mismatch at index " + i + ": " + failureMessage, v1[i], v2[i]);
    }
  } else {
    assert(failureMessage, !v2);
  }
});
goog.exportSymbol("assertElementsRoughlyEqual", function(a, b, c, opt_d) {
  _validateArguments(3, arguments);
  var v1 = nonCommentArg(1, 3, arguments), v2 = nonCommentArg(2, 3, arguments), tolerance = nonCommentArg(3, 3, arguments), failureMessage = commentArg(3, arguments) ? commentArg(3, arguments) : "";
  if (v1) {
    assertEquals("length mismatch: " + failureMessage, v1.length, v2.length);
    for (var i = 0;i < v1.length;++i) {
      assertRoughlyEquals(failureMessage, v1[i], v2[i], tolerance);
    }
  } else {
    assert(failureMessage, !v2);
  }
});
goog.exportSymbol("assertSameElements", function(a, b, opt_c) {
  _validateArguments(2, arguments);
  var expected = nonCommentArg(1, 2, arguments), actual = nonCommentArg(2, 2, arguments), message = commentArg(2, arguments);
  assertTrue("Bad arguments to assertSameElements(opt_message, expected: ArrayLike, actual: ArrayLike)", goog.isArrayLike(expected) && goog.isArrayLike(actual));
  expected = goog.testing.asserts.toArray_(expected);
  actual = goog.testing.asserts.toArray_(actual);
  _assert(message, expected.length == actual.length, "Expected " + expected.length + " elements: [" + expected + "], got " + actual.length + " elements: [" + actual + "]");
  for (var toFind = goog.testing.asserts.toArray_(expected), i = 0;i < actual.length;i++) {
    var index = goog.testing.asserts.indexOf_(toFind, actual[i]);
    _assert(message, -1 != index, "Expected [" + expected + "], got [" + actual + "]");
    toFind.splice(index, 1);
  }
});
goog.exportSymbol("assertEvaluatesToTrue", function(a, opt_b) {
  _validateArguments(1, arguments);
  nonCommentArg(1, 1, arguments) || _assert(commentArg(1, arguments), !1, "Expected to evaluate to true");
});
goog.exportSymbol("assertEvaluatesToFalse", function(a, opt_b) {
  _validateArguments(1, arguments);
  nonCommentArg(1, 1, arguments) && _assert(commentArg(1, arguments), !1, "Expected to evaluate to false");
});
goog.exportSymbol("assertHTMLEquals", function(a, b, opt_c) {
  _validateArguments(2, arguments);
  var var2 = nonCommentArg(2, 2, arguments), var1Standardized = standardizeHTML(nonCommentArg(1, 2, arguments)), var2Standardized = standardizeHTML(var2);
  _assert(commentArg(2, arguments), var1Standardized === var2Standardized, goog.testing.asserts.getDefaultErrorMsg_(var1Standardized, var2Standardized));
});
goog.exportSymbol("assertHashEquals", function(a, b, opt_c) {
  _validateArguments(2, arguments);
  var var1 = nonCommentArg(1, 2, arguments), var2 = nonCommentArg(2, 2, arguments), message = commentArg(2, arguments), key;
  for (key in var1) {
    _assert(message, key in var2, "Expected hash had key " + key + " that was not found"), _assert(message, var1[key] == var2[key], "Value for key " + key + " mismatch - expected = " + var1[key] + ", actual = " + var2[key]);
  }
  for (key in var2) {
    _assert(message, key in var1, "Actual hash had key " + key + " that was not expected");
  }
});
goog.exportSymbol("assertRoughlyEquals", assertRoughlyEquals);
goog.exportSymbol("assertContains", function(a, b, opt_c) {
  _validateArguments(2, arguments);
  var contained = nonCommentArg(1, 2, arguments), container = nonCommentArg(2, 2, arguments);
  _assert(commentArg(2, arguments), goog.testing.asserts.contains_(container, contained), "Expected '" + container + "' to contain '" + contained + "'");
});
goog.exportSymbol("assertNotContains", function(a, b, opt_c) {
  _validateArguments(2, arguments);
  var contained = nonCommentArg(1, 2, arguments), container = nonCommentArg(2, 2, arguments);
  _assert(commentArg(2, arguments), !goog.testing.asserts.contains_(container, contained), "Expected '" + container + "' not to contain '" + contained + "'");
});
goog.exportSymbol("assertRegExp", function(a, b, opt_c) {
  _validateArguments(2, arguments);
  var regexp = nonCommentArg(1, 2, arguments), string = nonCommentArg(2, 2, arguments);
  "string" == typeof regexp && (regexp = new RegExp(regexp));
  _assert(commentArg(2, arguments), regexp.test(string), "Expected '" + string + "' to match RegExp " + regexp.toString());
});
goog.debug = {};
goog.debug.Error = function(opt_msg) {
  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, goog.debug.Error);
  } else {
    var stack = Error().stack;
    stack && (this.stack = stack);
  }
  opt_msg && (this.message = String(opt_msg));
};
goog.inherits(goog.debug.Error, Error);
goog.debug.Error.prototype.name = "CustomError";
goog.dom = {};
goog.dom.NodeType = {ELEMENT:1, ATTRIBUTE:2, TEXT:3, CDATA_SECTION:4, ENTITY_REFERENCE:5, ENTITY:6, PROCESSING_INSTRUCTION:7, COMMENT:8, DOCUMENT:9, DOCUMENT_TYPE:10, DOCUMENT_FRAGMENT:11, NOTATION:12};
goog.string = {};
goog.string.DETECT_DOUBLE_ESCAPING = !1;
goog.string.FORCE_NON_DOM_HTML_UNESCAPING = !1;
goog.string.Unicode = {NBSP:"\u00a0"};
goog.string.startsWith = function(str, prefix) {
  return 0 == str.lastIndexOf(prefix, 0);
};
goog.string.endsWith = function(str, suffix) {
  var l = str.length - suffix.length;
  return 0 <= l && str.indexOf(suffix, l) == l;
};
goog.string.caseInsensitiveStartsWith = function(str, prefix) {
  return 0 == goog.string.caseInsensitiveCompare(prefix, str.substr(0, prefix.length));
};
goog.string.caseInsensitiveEndsWith = function(str, suffix) {
  return 0 == goog.string.caseInsensitiveCompare(suffix, str.substr(str.length - suffix.length, suffix.length));
};
goog.string.caseInsensitiveEquals = function(str1, str2) {
  return str1.toLowerCase() == str2.toLowerCase();
};
goog.string.subs = function(str, var_args) {
  for (var splitParts = str.split("%s"), returnString = "", subsArguments = Array.prototype.slice.call(arguments, 1);subsArguments.length && 1 < splitParts.length;) {
    returnString += splitParts.shift() + subsArguments.shift();
  }
  return returnString + splitParts.join("%s");
};
goog.string.collapseWhitespace = function(str) {
  return str.replace(/[\s\xa0]+/g, " ").replace(/^\s+|\s+$/g, "");
};
goog.string.isEmptyOrWhitespace = function(str) {
  return /^[\s\xa0]*$/.test(str);
};
goog.string.isEmptyString = function(str) {
  return 0 == str.length;
};
goog.string.isEmpty = goog.string.isEmptyOrWhitespace;
goog.string.isEmptyOrWhitespaceSafe = function(str) {
  return goog.string.isEmptyOrWhitespace(goog.string.makeSafe(str));
};
goog.string.isEmptySafe = goog.string.isEmptyOrWhitespaceSafe;
goog.string.isBreakingWhitespace = function(str) {
  return !/[^\t\n\r ]/.test(str);
};
goog.string.isAlpha = function(str) {
  return !/[^a-zA-Z]/.test(str);
};
goog.string.isNumeric = function(str) {
  return !/[^0-9]/.test(str);
};
goog.string.isAlphaNumeric = function(str) {
  return !/[^a-zA-Z0-9]/.test(str);
};
goog.string.isSpace = function(ch) {
  return " " == ch;
};
goog.string.isUnicodeChar = function(ch) {
  return 1 == ch.length && " " <= ch && "~" >= ch || "\u0080" <= ch && "\ufffd" >= ch;
};
goog.string.stripNewlines = function(str) {
  return str.replace(/(\r\n|\r|\n)+/g, " ");
};
goog.string.canonicalizeNewlines = function(str) {
  return str.replace(/(\r\n|\r|\n)/g, "\n");
};
goog.string.normalizeWhitespace = function(str) {
  return str.replace(/\xa0|\s/g, " ");
};
goog.string.normalizeSpaces = function(str) {
  return str.replace(/\xa0|[ \t]+/g, " ");
};
goog.string.collapseBreakingSpaces = function(str) {
  return str.replace(/[\t\r\n ]+/g, " ").replace(/^[\t\r\n ]+|[\t\r\n ]+$/g, "");
};
goog.string.trim = goog.TRUSTED_SITE && String.prototype.trim ? function(str) {
  return str.trim();
} : function(str) {
  return str.replace(/^[\s\xa0]+|[\s\xa0]+$/g, "");
};
goog.string.trimLeft = function(str) {
  return str.replace(/^[\s\xa0]+/, "");
};
goog.string.trimRight = function(str) {
  return str.replace(/[\s\xa0]+$/, "");
};
goog.string.caseInsensitiveCompare = function(str1, str2) {
  var test1 = String(str1).toLowerCase(), test2 = String(str2).toLowerCase();
  return test1 < test2 ? -1 : test1 == test2 ? 0 : 1;
};
goog.string.numberAwareCompare_ = function(str1, str2, tokenizerRegExp) {
  if (str1 == str2) {
    return 0;
  }
  if (!str1) {
    return -1;
  }
  if (!str2) {
    return 1;
  }
  for (var tokens1 = str1.toLowerCase().match(tokenizerRegExp), tokens2 = str2.toLowerCase().match(tokenizerRegExp), count = Math.min(tokens1.length, tokens2.length), i = 0;i < count;i++) {
    var a = tokens1[i], b = tokens2[i];
    if (a != b) {
      var num1 = parseInt(a, 10);
      if (!isNaN(num1)) {
        var num2 = parseInt(b, 10);
        if (!isNaN(num2) && num1 - num2) {
          return num1 - num2;
        }
      }
      return a < b ? -1 : 1;
    }
  }
  return tokens1.length != tokens2.length ? tokens1.length - tokens2.length : str1 < str2 ? -1 : 1;
};
goog.string.intAwareCompare = function(str1, str2) {
  return goog.string.numberAwareCompare_(str1, str2, /\d+|\D+/g);
};
goog.string.floatAwareCompare = function(str1, str2) {
  return goog.string.numberAwareCompare_(str1, str2, /\d+|\.\d+|\D+/g);
};
goog.string.numerateCompare = goog.string.floatAwareCompare;
goog.string.urlEncode = function(str) {
  return encodeURIComponent(String(str));
};
goog.string.urlDecode = function(str) {
  return decodeURIComponent(str.replace(/\+/g, " "));
};
goog.string.newLineToBr = function(str, opt_xml) {
  return str.replace(/(\r\n|\r|\n)/g, opt_xml ? "<br />" : "<br>");
};
goog.string.htmlEscape = function(str, opt_isLikelyToContainHtmlChars) {
  if (opt_isLikelyToContainHtmlChars) {
    str = str.replace(goog.string.AMP_RE_, "&amp;").replace(goog.string.LT_RE_, "&lt;").replace(goog.string.GT_RE_, "&gt;").replace(goog.string.QUOT_RE_, "&quot;").replace(goog.string.SINGLE_QUOTE_RE_, "&#39;").replace(goog.string.NULL_RE_, "&#0;"), goog.string.DETECT_DOUBLE_ESCAPING && (str = str.replace(goog.string.E_RE_, "&#101;"));
  } else {
    if (!goog.string.ALL_RE_.test(str)) {
      return str;
    }
    -1 != str.indexOf("&") && (str = str.replace(goog.string.AMP_RE_, "&amp;"));
    -1 != str.indexOf("<") && (str = str.replace(goog.string.LT_RE_, "&lt;"));
    -1 != str.indexOf(">") && (str = str.replace(goog.string.GT_RE_, "&gt;"));
    -1 != str.indexOf('"') && (str = str.replace(goog.string.QUOT_RE_, "&quot;"));
    -1 != str.indexOf("'") && (str = str.replace(goog.string.SINGLE_QUOTE_RE_, "&#39;"));
    -1 != str.indexOf("\x00") && (str = str.replace(goog.string.NULL_RE_, "&#0;"));
    goog.string.DETECT_DOUBLE_ESCAPING && -1 != str.indexOf("e") && (str = str.replace(goog.string.E_RE_, "&#101;"));
  }
  return str;
};
goog.string.AMP_RE_ = /&/g;
goog.string.LT_RE_ = /</g;
goog.string.GT_RE_ = />/g;
goog.string.QUOT_RE_ = /"/g;
goog.string.SINGLE_QUOTE_RE_ = /'/g;
goog.string.NULL_RE_ = /\x00/g;
goog.string.E_RE_ = /e/g;
goog.string.ALL_RE_ = goog.string.DETECT_DOUBLE_ESCAPING ? /[\x00&<>"'e]/ : /[\x00&<>"']/;
goog.string.unescapeEntities = function(str) {
  return goog.string.contains(str, "&") ? !goog.string.FORCE_NON_DOM_HTML_UNESCAPING && "document" in goog.global ? goog.string.unescapeEntitiesUsingDom_(str) : goog.string.unescapePureXmlEntities_(str) : str;
};
goog.string.unescapeEntitiesWithDocument = function(str, document) {
  return goog.string.contains(str, "&") ? goog.string.unescapeEntitiesUsingDom_(str, document) : str;
};
goog.string.unescapeEntitiesUsingDom_ = function(str, opt_document) {
  var seen = {"&amp;":"&", "&lt;":"<", "&gt;":">", "&quot;":'"'}, div;
  div = opt_document ? opt_document.createElement("div") : goog.global.document.createElement("div");
  return str.replace(goog.string.HTML_ENTITY_PATTERN_, function(s, entity) {
    var value = seen[s];
    if (value) {
      return value;
    }
    if ("#" == entity.charAt(0)) {
      var n = Number("0" + entity.substr(1));
      isNaN(n) || (value = String.fromCharCode(n));
    }
    value || (div.innerHTML = s + " ", value = div.firstChild.nodeValue.slice(0, -1));
    return seen[s] = value;
  });
};
goog.string.unescapePureXmlEntities_ = function(str) {
  return str.replace(/&([^;]+);/g, function(s, entity) {
    switch(entity) {
      case "amp":
        return "&";
      case "lt":
        return "<";
      case "gt":
        return ">";
      case "quot":
        return '"';
      default:
        if ("#" == entity.charAt(0)) {
          var n = Number("0" + entity.substr(1));
          if (!isNaN(n)) {
            return String.fromCharCode(n);
          }
        }
        return s;
    }
  });
};
goog.string.HTML_ENTITY_PATTERN_ = /&([^;\s<&]+);?/g;
goog.string.whitespaceEscape = function(str, opt_xml) {
  return goog.string.newLineToBr(str.replace(/  /g, " &#160;"), opt_xml);
};
goog.string.preserveSpaces = function(str) {
  return str.replace(/(^|[\n ]) /g, "$1" + goog.string.Unicode.NBSP);
};
goog.string.stripQuotes = function(str, quoteChars) {
  for (var length = quoteChars.length, i = 0;i < length;i++) {
    var quoteChar = 1 == length ? quoteChars : quoteChars.charAt(i);
    if (str.charAt(0) == quoteChar && str.charAt(str.length - 1) == quoteChar) {
      return str.substring(1, str.length - 1);
    }
  }
  return str;
};
goog.string.truncate = function(str, chars, opt_protectEscapedCharacters) {
  opt_protectEscapedCharacters && (str = goog.string.unescapeEntities(str));
  str.length > chars && (str = str.substring(0, chars - 3) + "...");
  opt_protectEscapedCharacters && (str = goog.string.htmlEscape(str));
  return str;
};
goog.string.truncateMiddle = function(str, chars, opt_protectEscapedCharacters, opt_trailingChars) {
  opt_protectEscapedCharacters && (str = goog.string.unescapeEntities(str));
  if (opt_trailingChars && str.length > chars) {
    opt_trailingChars > chars && (opt_trailingChars = chars);
    var startPoint;
    str = str.substring(0, chars - opt_trailingChars) + "..." + str.substring(str.length - opt_trailingChars);
  } else {
    if (str.length > chars) {
      var half = Math.floor(chars / 2);
      str = str.substring(0, half + chars % 2) + "..." + str.substring(str.length - half);
    }
  }
  opt_protectEscapedCharacters && (str = goog.string.htmlEscape(str));
  return str;
};
goog.string.specialEscapeChars_ = {"\x00":"\\0", "\b":"\\b", "\f":"\\f", "\n":"\\n", "\r":"\\r", "\t":"\\t", "\x0B":"\\x0B", '"':'\\"', "\\":"\\\\", "<":"<"};
goog.string.jsEscapeCache_ = {"'":"\\'"};
goog.string.quote = function(s) {
  s = String(s);
  for (var sb = ['"'], i = 0;i < s.length;i++) {
    var ch = s.charAt(i), cc = ch.charCodeAt(0);
    sb[i + 1] = goog.string.specialEscapeChars_[ch] || (31 < cc && 127 > cc ? ch : goog.string.escapeChar(ch));
  }
  sb.push('"');
  return sb.join("");
};
goog.string.escapeString = function(str) {
  for (var sb = [], i = 0;i < str.length;i++) {
    sb[i] = goog.string.escapeChar(str.charAt(i));
  }
  return sb.join("");
};
goog.string.escapeChar = function(c) {
  if (c in goog.string.jsEscapeCache_) {
    return goog.string.jsEscapeCache_[c];
  }
  if (c in goog.string.specialEscapeChars_) {
    return goog.string.jsEscapeCache_[c] = goog.string.specialEscapeChars_[c];
  }
  var rv = c, cc = c.charCodeAt(0);
  if (31 < cc && 127 > cc) {
    rv = c;
  } else {
    if (256 > cc) {
      if (rv = "\\x", 16 > cc || 256 < cc) {
        rv += "0";
      }
    } else {
      rv = "\\u", 4096 > cc && (rv += "0");
    }
    rv += cc.toString(16).toUpperCase();
  }
  return goog.string.jsEscapeCache_[c] = rv;
};
goog.string.contains = function(str, subString) {
  return -1 != str.indexOf(subString);
};
goog.string.caseInsensitiveContains = function(str, subString) {
  return goog.string.contains(str.toLowerCase(), subString.toLowerCase());
};
goog.string.countOf = function(s, ss) {
  return s && ss ? s.split(ss).length - 1 : 0;
};
goog.string.removeAt = function(s, index, stringLength) {
  var resultStr = s;
  0 <= index && index < s.length && 0 < stringLength && (resultStr = s.substr(0, index) + s.substr(index + stringLength, s.length - index - stringLength));
  return resultStr;
};
goog.string.remove = function(str, substr) {
  return str.replace(substr, "");
};
goog.string.removeAll = function(s, ss) {
  var re = new RegExp(goog.string.regExpEscape(ss), "g");
  return s.replace(re, "");
};
goog.string.replaceAll = function(s, ss, replacement) {
  var re = new RegExp(goog.string.regExpEscape(ss), "g");
  return s.replace(re, replacement.replace(/\$/g, "$$$$"));
};
goog.string.regExpEscape = function(s) {
  return String(s).replace(/([-()\[\]{}+?*.$\^|,:#<!\\])/g, "\\$1").replace(/\x08/g, "\\x08");
};
goog.string.repeat = String.prototype.repeat ? function(string, length) {
  return string.repeat(length);
} : function(string, length) {
  return Array(length + 1).join(string);
};
goog.string.padNumber = function(num, length, opt_precision) {
  var s = goog.isDef(opt_precision) ? num.toFixed(opt_precision) : String(num), index = s.indexOf(".");
  -1 == index && (index = s.length);
  return goog.string.repeat("0", Math.max(0, length - index)) + s;
};
goog.string.makeSafe = function(obj) {
  return null == obj ? "" : String(obj);
};
goog.string.buildString = function(var_args) {
  return Array.prototype.join.call(arguments, "");
};
goog.string.getRandomString = function() {
  return Math.floor(2147483648 * Math.random()).toString(36) + Math.abs(Math.floor(2147483648 * Math.random()) ^ goog.now()).toString(36);
};
goog.string.compareVersions = function(version1, version2) {
  for (var order = 0, v1Subs = goog.string.trim(String(version1)).split("."), v2Subs = goog.string.trim(String(version2)).split("."), subCount = Math.max(v1Subs.length, v2Subs.length), subIdx = 0;0 == order && subIdx < subCount;subIdx++) {
    var v1Sub = v1Subs[subIdx] || "", v2Sub = v2Subs[subIdx] || "";
    do {
      var v1Comp = /(\d*)(\D*)(.*)/.exec(v1Sub) || ["", "", "", ""], v2Comp = /(\d*)(\D*)(.*)/.exec(v2Sub) || ["", "", "", ""];
      if (0 == v1Comp[0].length && 0 == v2Comp[0].length) {
        break;
      }
      order = goog.string.compareElements_(0 == v1Comp[1].length ? 0 : parseInt(v1Comp[1], 10), 0 == v2Comp[1].length ? 0 : parseInt(v2Comp[1], 10)) || goog.string.compareElements_(0 == v1Comp[2].length, 0 == v2Comp[2].length) || goog.string.compareElements_(v1Comp[2], v2Comp[2]);
      v1Sub = v1Comp[3];
      v2Sub = v2Comp[3];
    } while (0 == order);
  }
  return order;
};
goog.string.compareElements_ = function(left, right) {
  return left < right ? -1 : left > right ? 1 : 0;
};
goog.string.hashCode = function(str) {
  for (var result = 0, i = 0;i < str.length;++i) {
    result = 31 * result + str.charCodeAt(i) >>> 0;
  }
  return result;
};
goog.string.uniqueStringCounter_ = 2147483648 * Math.random() | 0;
goog.string.createUniqueString = function() {
  return "goog_" + goog.string.uniqueStringCounter_++;
};
goog.string.toNumber = function(str) {
  var num = Number(str);
  return 0 == num && goog.string.isEmptyOrWhitespace(str) ? NaN : num;
};
goog.string.isLowerCamelCase = function(str) {
  return /^[a-z]+([A-Z][a-z]*)*$/.test(str);
};
goog.string.isUpperCamelCase = function(str) {
  return /^([A-Z][a-z]*)+$/.test(str);
};
goog.string.toCamelCase = function(str) {
  return String(str).replace(/\-([a-z])/g, function(all, match) {
    return match.toUpperCase();
  });
};
goog.string.toSelectorCase = function(str) {
  return String(str).replace(/([A-Z])/g, "-$1").toLowerCase();
};
goog.string.toTitleCase = function(str, opt_delimiters) {
  var delimiters = goog.isString(opt_delimiters) ? goog.string.regExpEscape(opt_delimiters) : "\\s";
  return str.replace(new RegExp("(^" + (delimiters ? "|[" + delimiters + "]+" : "") + ")([a-z])", "g"), function(all, p1, p2) {
    return p1 + p2.toUpperCase();
  });
};
goog.string.capitalize = function(str) {
  return String(str.charAt(0)).toUpperCase() + String(str.substr(1)).toLowerCase();
};
goog.string.parseInt = function(value) {
  isFinite(value) && (value = String(value));
  return goog.isString(value) ? /^\s*-?0x/i.test(value) ? parseInt(value, 16) : parseInt(value, 10) : NaN;
};
goog.string.splitLimit = function(str, separator, limit) {
  for (var parts = str.split(separator), returnVal = [];0 < limit && parts.length;) {
    returnVal.push(parts.shift()), limit--;
  }
  parts.length && returnVal.push(parts.join(separator));
  return returnVal;
};
goog.string.lastComponent = function(str, separators) {
  if (separators) {
    "string" == typeof separators && (separators = [separators]);
  } else {
    return str;
  }
  for (var lastSeparatorIndex = -1, i = 0;i < separators.length;i++) {
    if ("" != separators[i]) {
      var currentSeparatorIndex = str.lastIndexOf(separators[i]);
      currentSeparatorIndex > lastSeparatorIndex && (lastSeparatorIndex = currentSeparatorIndex);
    }
  }
  return -1 == lastSeparatorIndex ? str : str.slice(lastSeparatorIndex + 1);
};
goog.string.editDistance = function(a, b) {
  var v0 = [], v1 = [];
  if (a == b) {
    return 0;
  }
  if (!a.length || !b.length) {
    return Math.max(a.length, b.length);
  }
  for (var i = 0;i < b.length + 1;i++) {
    v0[i] = i;
  }
  for (i = 0;i < a.length;i++) {
    v1[0] = i + 1;
    for (var j = 0;j < b.length;j++) {
      v1[j + 1] = Math.min(v1[j] + 1, v0[j + 1] + 1, v0[j] + Number(a[i] != b[j]));
    }
    for (j = 0;j < v0.length;j++) {
      v0[j] = v1[j];
    }
  }
  return v1[b.length];
};
goog.asserts = {};
goog.asserts.ENABLE_ASSERTS = goog.DEBUG;
goog.asserts.AssertionError = function(messagePattern, messageArgs) {
  messageArgs.unshift(messagePattern);
  goog.debug.Error.call(this, goog.string.subs.apply(null, messageArgs));
  messageArgs.shift();
};
goog.inherits(goog.asserts.AssertionError, goog.debug.Error);
goog.asserts.AssertionError.prototype.name = "AssertionError";
goog.asserts.DEFAULT_ERROR_HANDLER = function(e) {
  throw e;
};
goog.asserts.errorHandler_ = goog.asserts.DEFAULT_ERROR_HANDLER;
goog.asserts.doAssertFailure_ = function(defaultMessage, defaultArgs, givenMessage, givenArgs) {
  var message = "Assertion failed";
  if (givenMessage) {
    var message = message + (": " + givenMessage), args = givenArgs;
  } else {
    defaultMessage && (message += ": " + defaultMessage, args = defaultArgs);
  }
  var e = new goog.asserts.AssertionError("" + message, args || []);
  goog.asserts.errorHandler_(e);
};
goog.asserts.setErrorHandler = function(errorHandler) {
  goog.asserts.ENABLE_ASSERTS && (goog.asserts.errorHandler_ = errorHandler);
};
goog.asserts.assert = function(condition, opt_message, var_args) {
  goog.asserts.ENABLE_ASSERTS && !condition && goog.asserts.doAssertFailure_("", null, opt_message, Array.prototype.slice.call(arguments, 2));
  return condition;
};
goog.asserts.fail = function(opt_message, var_args) {
  goog.asserts.ENABLE_ASSERTS && goog.asserts.errorHandler_(new goog.asserts.AssertionError("Failure" + (opt_message ? ": " + opt_message : ""), Array.prototype.slice.call(arguments, 1)));
};
goog.asserts.assertNumber = function(value, opt_message, var_args) {
  goog.asserts.ENABLE_ASSERTS && !goog.isNumber(value) && goog.asserts.doAssertFailure_("Expected number but got %s: %s.", [goog.typeOf(value), value], opt_message, Array.prototype.slice.call(arguments, 2));
  return value;
};
goog.asserts.assertString = function(value, opt_message, var_args) {
  goog.asserts.ENABLE_ASSERTS && !goog.isString(value) && goog.asserts.doAssertFailure_("Expected string but got %s: %s.", [goog.typeOf(value), value], opt_message, Array.prototype.slice.call(arguments, 2));
  return value;
};
goog.asserts.assertFunction = function(value, opt_message, var_args) {
  goog.asserts.ENABLE_ASSERTS && !goog.isFunction(value) && goog.asserts.doAssertFailure_("Expected function but got %s: %s.", [goog.typeOf(value), value], opt_message, Array.prototype.slice.call(arguments, 2));
  return value;
};
goog.asserts.assertObject = function(value, opt_message, var_args) {
  goog.asserts.ENABLE_ASSERTS && !goog.isObject(value) && goog.asserts.doAssertFailure_("Expected object but got %s: %s.", [goog.typeOf(value), value], opt_message, Array.prototype.slice.call(arguments, 2));
  return value;
};
goog.asserts.assertArray = function(value, opt_message, var_args) {
  goog.asserts.ENABLE_ASSERTS && !goog.isArray(value) && goog.asserts.doAssertFailure_("Expected array but got %s: %s.", [goog.typeOf(value), value], opt_message, Array.prototype.slice.call(arguments, 2));
  return value;
};
goog.asserts.assertBoolean = function(value, opt_message, var_args) {
  goog.asserts.ENABLE_ASSERTS && !goog.isBoolean(value) && goog.asserts.doAssertFailure_("Expected boolean but got %s: %s.", [goog.typeOf(value), value], opt_message, Array.prototype.slice.call(arguments, 2));
  return value;
};
goog.asserts.assertElement = function(value, opt_message, var_args) {
  !goog.asserts.ENABLE_ASSERTS || goog.isObject(value) && value.nodeType == goog.dom.NodeType.ELEMENT || goog.asserts.doAssertFailure_("Expected Element but got %s: %s.", [goog.typeOf(value), value], opt_message, Array.prototype.slice.call(arguments, 2));
  return value;
};
goog.asserts.assertInstanceof = function(value, type, opt_message, var_args) {
  !goog.asserts.ENABLE_ASSERTS || value instanceof type || goog.asserts.doAssertFailure_("Expected instanceof %s but got %s.", [goog.asserts.getType_(type), goog.asserts.getType_(value)], opt_message, Array.prototype.slice.call(arguments, 3));
  return value;
};
goog.asserts.assertObjectPrototypeIsIntact = function() {
  for (var key in Object.prototype) {
    goog.asserts.fail(key + " should not be enumerable in Object.prototype.");
  }
};
goog.asserts.getType_ = function(value) {
  return value instanceof Function ? value.displayName || value.name || "unknown type name" : value instanceof Object ? value.constructor.displayName || value.constructor.name || Object.prototype.toString.call(value) : null === value ? "null" : typeof value;
};
goog.array = {};
goog.NATIVE_ARRAY_PROTOTYPES = goog.TRUSTED_SITE;
goog.array.ASSUME_NATIVE_FUNCTIONS = !1;
goog.array.peek = function(array) {
  return array[array.length - 1];
};
goog.array.last = goog.array.peek;
goog.array.indexOf = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || Array.prototype.indexOf) ? function(arr, obj, opt_fromIndex) {
  goog.asserts.assert(null != arr.length);
  return Array.prototype.indexOf.call(arr, obj, opt_fromIndex);
} : function(arr, obj, opt_fromIndex) {
  var fromIndex = null == opt_fromIndex ? 0 : 0 > opt_fromIndex ? Math.max(0, arr.length + opt_fromIndex) : opt_fromIndex;
  if (goog.isString(arr)) {
    return goog.isString(obj) && 1 == obj.length ? arr.indexOf(obj, fromIndex) : -1;
  }
  for (var i = fromIndex;i < arr.length;i++) {
    if (i in arr && arr[i] === obj) {
      return i;
    }
  }
  return -1;
};
goog.array.lastIndexOf = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || Array.prototype.lastIndexOf) ? function(arr, obj, opt_fromIndex) {
  goog.asserts.assert(null != arr.length);
  return Array.prototype.lastIndexOf.call(arr, obj, null == opt_fromIndex ? arr.length - 1 : opt_fromIndex);
} : function(arr, obj, opt_fromIndex) {
  var fromIndex = null == opt_fromIndex ? arr.length - 1 : opt_fromIndex;
  0 > fromIndex && (fromIndex = Math.max(0, arr.length + fromIndex));
  if (goog.isString(arr)) {
    return goog.isString(obj) && 1 == obj.length ? arr.lastIndexOf(obj, fromIndex) : -1;
  }
  for (var i = fromIndex;0 <= i;i--) {
    if (i in arr && arr[i] === obj) {
      return i;
    }
  }
  return -1;
};
goog.array.forEach = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || Array.prototype.forEach) ? function(arr, f, opt_obj) {
  goog.asserts.assert(null != arr.length);
  Array.prototype.forEach.call(arr, f, opt_obj);
} : function(arr, f, opt_obj) {
  for (var l = arr.length, arr2 = goog.isString(arr) ? arr.split("") : arr, i = 0;i < l;i++) {
    i in arr2 && f.call(opt_obj, arr2[i], i, arr);
  }
};
goog.array.forEachRight = function(arr, f, opt_obj) {
  for (var arr2 = goog.isString(arr) ? arr.split("") : arr, i = arr.length - 1;0 <= i;--i) {
    i in arr2 && f.call(opt_obj, arr2[i], i, arr);
  }
};
goog.array.filter = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || Array.prototype.filter) ? function(arr, f, opt_obj) {
  goog.asserts.assert(null != arr.length);
  return Array.prototype.filter.call(arr, f, opt_obj);
} : function(arr, f, opt_obj) {
  for (var l = arr.length, res = [], resLength = 0, arr2 = goog.isString(arr) ? arr.split("") : arr, i = 0;i < l;i++) {
    if (i in arr2) {
      var val = arr2[i];
      f.call(opt_obj, val, i, arr) && (res[resLength++] = val);
    }
  }
  return res;
};
goog.array.map = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || Array.prototype.map) ? function(arr, f, opt_obj) {
  goog.asserts.assert(null != arr.length);
  return Array.prototype.map.call(arr, f, opt_obj);
} : function(arr, f, opt_obj) {
  for (var l = arr.length, res = Array(l), arr2 = goog.isString(arr) ? arr.split("") : arr, i = 0;i < l;i++) {
    i in arr2 && (res[i] = f.call(opt_obj, arr2[i], i, arr));
  }
  return res;
};
goog.array.reduce = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || Array.prototype.reduce) ? function(arr, f, val, opt_obj) {
  goog.asserts.assert(null != arr.length);
  opt_obj && (f = goog.bind(f, opt_obj));
  return Array.prototype.reduce.call(arr, f, val);
} : function(arr, f, val$jscomp$0, opt_obj) {
  var rval = val$jscomp$0;
  goog.array.forEach(arr, function(val, index) {
    rval = f.call(opt_obj, rval, val, index, arr);
  });
  return rval;
};
goog.array.reduceRight = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || Array.prototype.reduceRight) ? function(arr, f, val, opt_obj) {
  goog.asserts.assert(null != arr.length);
  goog.asserts.assert(null != f);
  opt_obj && (f = goog.bind(f, opt_obj));
  return Array.prototype.reduceRight.call(arr, f, val);
} : function(arr, f, val$jscomp$0, opt_obj) {
  var rval = val$jscomp$0;
  goog.array.forEachRight(arr, function(val, index) {
    rval = f.call(opt_obj, rval, val, index, arr);
  });
  return rval;
};
goog.array.some = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || Array.prototype.some) ? function(arr, f, opt_obj) {
  goog.asserts.assert(null != arr.length);
  return Array.prototype.some.call(arr, f, opt_obj);
} : function(arr, f, opt_obj) {
  for (var l = arr.length, arr2 = goog.isString(arr) ? arr.split("") : arr, i = 0;i < l;i++) {
    if (i in arr2 && f.call(opt_obj, arr2[i], i, arr)) {
      return !0;
    }
  }
  return !1;
};
goog.array.every = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || Array.prototype.every) ? function(arr, f, opt_obj) {
  goog.asserts.assert(null != arr.length);
  return Array.prototype.every.call(arr, f, opt_obj);
} : function(arr, f, opt_obj) {
  for (var l = arr.length, arr2 = goog.isString(arr) ? arr.split("") : arr, i = 0;i < l;i++) {
    if (i in arr2 && !f.call(opt_obj, arr2[i], i, arr)) {
      return !1;
    }
  }
  return !0;
};
goog.array.count = function(arr$jscomp$0, f, opt_obj) {
  var count = 0;
  goog.array.forEach(arr$jscomp$0, function(element, index, arr) {
    f.call(opt_obj, element, index, arr) && ++count;
  }, opt_obj);
  return count;
};
goog.array.find = function(arr, f, opt_obj) {
  var i = goog.array.findIndex(arr, f, opt_obj);
  return 0 > i ? null : goog.isString(arr) ? arr.charAt(i) : arr[i];
};
goog.array.findIndex = function(arr, f, opt_obj) {
  for (var l = arr.length, arr2 = goog.isString(arr) ? arr.split("") : arr, i = 0;i < l;i++) {
    if (i in arr2 && f.call(opt_obj, arr2[i], i, arr)) {
      return i;
    }
  }
  return -1;
};
goog.array.findRight = function(arr, f, opt_obj) {
  var i = goog.array.findIndexRight(arr, f, opt_obj);
  return 0 > i ? null : goog.isString(arr) ? arr.charAt(i) : arr[i];
};
goog.array.findIndexRight = function(arr, f, opt_obj) {
  for (var arr2 = goog.isString(arr) ? arr.split("") : arr, i = arr.length - 1;0 <= i;i--) {
    if (i in arr2 && f.call(opt_obj, arr2[i], i, arr)) {
      return i;
    }
  }
  return -1;
};
goog.array.contains = function(arr, obj) {
  return 0 <= goog.array.indexOf(arr, obj);
};
goog.array.isEmpty = function(arr) {
  return 0 == arr.length;
};
goog.array.clear = function(arr) {
  if (!goog.isArray(arr)) {
    for (var i = arr.length - 1;0 <= i;i--) {
      delete arr[i];
    }
  }
  arr.length = 0;
};
goog.array.insert = function(arr, obj) {
  goog.array.contains(arr, obj) || arr.push(obj);
};
goog.array.insertAt = function(arr, obj, opt_i) {
  goog.array.splice(arr, opt_i, 0, obj);
};
goog.array.insertArrayAt = function(arr, elementsToAdd, opt_i) {
  goog.partial(goog.array.splice, arr, opt_i, 0).apply(null, elementsToAdd);
};
goog.array.insertBefore = function(arr, obj, opt_obj2) {
  var i;
  2 == arguments.length || 0 > (i = goog.array.indexOf(arr, opt_obj2)) ? arr.push(obj) : goog.array.insertAt(arr, obj, i);
};
goog.array.remove = function(arr, obj) {
  var i = goog.array.indexOf(arr, obj), rv;
  (rv = 0 <= i) && goog.array.removeAt(arr, i);
  return rv;
};
goog.array.removeLast = function(arr, obj) {
  var i = goog.array.lastIndexOf(arr, obj);
  return 0 <= i ? (goog.array.removeAt(arr, i), !0) : !1;
};
goog.array.removeAt = function(arr, i) {
  goog.asserts.assert(null != arr.length);
  return 1 == Array.prototype.splice.call(arr, i, 1).length;
};
goog.array.removeIf = function(arr, f, opt_obj) {
  var i = goog.array.findIndex(arr, f, opt_obj);
  return 0 <= i ? (goog.array.removeAt(arr, i), !0) : !1;
};
goog.array.removeAllIf = function(arr, f, opt_obj) {
  var removedCount = 0;
  goog.array.forEachRight(arr, function(val, index) {
    f.call(opt_obj, val, index, arr) && goog.array.removeAt(arr, index) && removedCount++;
  });
  return removedCount;
};
goog.array.concat = function(var_args) {
  return Array.prototype.concat.apply(Array.prototype, arguments);
};
goog.array.join = function(var_args) {
  return Array.prototype.concat.apply(Array.prototype, arguments);
};
goog.array.toArray = function(object) {
  var length = object.length;
  if (0 < length) {
    for (var rv = Array(length), i = 0;i < length;i++) {
      rv[i] = object[i];
    }
    return rv;
  }
  return [];
};
goog.array.clone = goog.array.toArray;
goog.array.extend = function(arr1, var_args) {
  for (var i = 1;i < arguments.length;i++) {
    var arr2 = arguments[i];
    if (goog.isArrayLike(arr2)) {
      var len1 = arr1.length || 0, len2 = arr2.length || 0;
      arr1.length = len1 + len2;
      for (var j = 0;j < len2;j++) {
        arr1[len1 + j] = arr2[j];
      }
    } else {
      arr1.push(arr2);
    }
  }
};
goog.array.splice = function(arr, index, howMany, var_args) {
  goog.asserts.assert(null != arr.length);
  return Array.prototype.splice.apply(arr, goog.array.slice(arguments, 1));
};
goog.array.slice = function(arr, start, opt_end) {
  goog.asserts.assert(null != arr.length);
  return 2 >= arguments.length ? Array.prototype.slice.call(arr, start) : Array.prototype.slice.call(arr, start, opt_end);
};
goog.array.removeDuplicates = function(arr, opt_rv, opt_hashFn) {
  for (var returnArray = opt_rv || arr, defaultHashFn = function(item) {
    return goog.isObject(item) ? "o" + goog.getUid(item) : (typeof item).charAt(0) + item;
  }, hashFn = opt_hashFn || defaultHashFn, seen = {}, cursorInsert = 0, cursorRead = 0;cursorRead < arr.length;) {
    var current = arr[cursorRead++], key = hashFn(current);
    Object.prototype.hasOwnProperty.call(seen, key) || (seen[key] = !0, returnArray[cursorInsert++] = current);
  }
  returnArray.length = cursorInsert;
};
goog.array.binarySearch = function(arr, target, opt_compareFn) {
  return goog.array.binarySearch_(arr, opt_compareFn || goog.array.defaultCompare, !1, target);
};
goog.array.binarySelect = function(arr, evaluator, opt_obj) {
  return goog.array.binarySearch_(arr, evaluator, !0, void 0, opt_obj);
};
goog.array.binarySearch_ = function(arr, compareFn, isEvaluator, opt_target, opt_selfObj) {
  for (var left = 0, right = arr.length, found;left < right;) {
    var middle = left + right >> 1, compareResult;
    compareResult = isEvaluator ? compareFn.call(opt_selfObj, arr[middle], middle, arr) : compareFn(opt_target, arr[middle]);
    0 < compareResult ? left = middle + 1 : (right = middle, found = !compareResult);
  }
  return found ? left : ~left;
};
goog.array.sort = function(arr, opt_compareFn) {
  arr.sort(opt_compareFn || goog.array.defaultCompare);
};
goog.array.stableSort = function(arr, opt_compareFn) {
  for (var compArr = Array(arr.length), i = 0;i < arr.length;i++) {
    compArr[i] = {index:i, value:arr[i]};
  }
  var valueCompareFn = opt_compareFn || goog.array.defaultCompare;
  goog.array.sort(compArr, function stableCompareFn(obj1, obj2) {
    return valueCompareFn(obj1.value, obj2.value) || obj1.index - obj2.index;
  });
  for (i = 0;i < arr.length;i++) {
    arr[i] = compArr[i].value;
  }
};
goog.array.sortByKey = function(arr, keyFn, opt_compareFn) {
  var keyCompareFn = opt_compareFn || goog.array.defaultCompare;
  goog.array.sort(arr, function(a, b) {
    return keyCompareFn(keyFn(a), keyFn(b));
  });
};
goog.array.sortObjectsByKey = function(arr, key, opt_compareFn) {
  goog.array.sortByKey(arr, function(obj) {
    return obj[key];
  }, opt_compareFn);
};
goog.array.isSorted = function(arr, opt_compareFn, opt_strict) {
  for (var compare = opt_compareFn || goog.array.defaultCompare, i = 1;i < arr.length;i++) {
    var compareResult = compare(arr[i - 1], arr[i]);
    if (0 < compareResult || 0 == compareResult && opt_strict) {
      return !1;
    }
  }
  return !0;
};
goog.array.equals = function(arr1, arr2, opt_equalsFn) {
  if (!goog.isArrayLike(arr1) || !goog.isArrayLike(arr2) || arr1.length != arr2.length) {
    return !1;
  }
  for (var l = arr1.length, equalsFn = opt_equalsFn || goog.array.defaultCompareEquality, i = 0;i < l;i++) {
    if (!equalsFn(arr1[i], arr2[i])) {
      return !1;
    }
  }
  return !0;
};
goog.array.compare3 = function(arr1, arr2, opt_compareFn) {
  for (var compare = opt_compareFn || goog.array.defaultCompare, l = Math.min(arr1.length, arr2.length), i = 0;i < l;i++) {
    var result = compare(arr1[i], arr2[i]);
    if (0 != result) {
      return result;
    }
  }
  return goog.array.defaultCompare(arr1.length, arr2.length);
};
goog.array.defaultCompare = function(a, b) {
  return a > b ? 1 : a < b ? -1 : 0;
};
goog.array.inverseDefaultCompare = function(a, b) {
  return -goog.array.defaultCompare(a, b);
};
goog.array.defaultCompareEquality = function(a, b) {
  return a === b;
};
goog.array.binaryInsert = function(array, value, opt_compareFn) {
  var index = goog.array.binarySearch(array, value, opt_compareFn);
  return 0 > index ? (goog.array.insertAt(array, value, -(index + 1)), !0) : !1;
};
goog.array.binaryRemove = function(array, value, opt_compareFn) {
  var index = goog.array.binarySearch(array, value, opt_compareFn);
  return 0 <= index ? goog.array.removeAt(array, index) : !1;
};
goog.array.bucket = function(array, sorter, opt_obj) {
  for (var buckets = {}, i = 0;i < array.length;i++) {
    var value = array[i], key = sorter.call(opt_obj, value, i, array);
    goog.isDef(key) && (buckets[key] || (buckets[key] = [])).push(value);
  }
  return buckets;
};
goog.array.toObject = function(arr, keyFunc, opt_obj) {
  var ret = {};
  goog.array.forEach(arr, function(element, index) {
    ret[keyFunc.call(opt_obj, element, index, arr)] = element;
  });
  return ret;
};
goog.array.range = function(startOrEnd, opt_end, opt_step) {
  var array = [], start = 0, end = startOrEnd, step = opt_step || 1;
  void 0 !== opt_end && (start = startOrEnd, end = opt_end);
  if (0 > step * (end - start)) {
    return [];
  }
  if (0 < step) {
    for (var i = start;i < end;i += step) {
      array.push(i);
    }
  } else {
    for (i = start;i > end;i += step) {
      array.push(i);
    }
  }
  return array;
};
goog.array.repeat = function(value, n) {
  for (var array = [], i = 0;i < n;i++) {
    array[i] = value;
  }
  return array;
};
goog.array.flatten = function(var_args) {
  for (var result = [], i = 0;i < arguments.length;i++) {
    var element = arguments[i];
    if (goog.isArray(element)) {
      for (var c = 0;c < element.length;c += 8192) {
        for (var chunk = goog.array.slice(element, c, c + 8192), recurseResult = goog.array.flatten.apply(null, chunk), r = 0;r < recurseResult.length;r++) {
          result.push(recurseResult[r]);
        }
      }
    } else {
      result.push(element);
    }
  }
  return result;
};
goog.array.rotate = function(array, n) {
  goog.asserts.assert(null != array.length);
  array.length && (n %= array.length, 0 < n ? Array.prototype.unshift.apply(array, array.splice(-n, n)) : 0 > n && Array.prototype.push.apply(array, array.splice(0, -n)));
  return array;
};
goog.array.moveItem = function(arr, fromIndex, toIndex) {
  goog.asserts.assert(0 <= fromIndex && fromIndex < arr.length);
  goog.asserts.assert(0 <= toIndex && toIndex < arr.length);
  var removedItems = Array.prototype.splice.call(arr, fromIndex, 1);
  Array.prototype.splice.call(arr, toIndex, 0, removedItems[0]);
};
goog.array.zip = function(var_args) {
  if (!arguments.length) {
    return [];
  }
  for (var result = [], minLen = arguments[0].length, i = 1;i < arguments.length;i++) {
    arguments[i].length < minLen && (minLen = arguments[i].length);
  }
  for (i = 0;i < minLen;i++) {
    for (var value = [], j = 0;j < arguments.length;j++) {
      value.push(arguments[j][i]);
    }
    result.push(value);
  }
  return result;
};
goog.array.shuffle = function(arr, opt_randFn) {
  for (var randFn = opt_randFn || Math.random, i = arr.length - 1;0 < i;i--) {
    var j = Math.floor(randFn() * (i + 1)), tmp = arr[i];
    arr[i] = arr[j];
    arr[j] = tmp;
  }
};
goog.array.copyByIndex = function(arr, index_arr) {
  var result = [];
  goog.array.forEach(index_arr, function(index) {
    result.push(arr[index]);
  });
  return result;
};
goog.array.concatMap = function(arr, f, opt_obj) {
  return goog.array.concat.apply([], goog.array.map(arr, f, opt_obj));
};
goog.dom.TagName = function(tagName) {
  this.tagName_ = tagName;
};
goog.dom.TagName.prototype.toString = function() {
  return this.tagName_;
};
goog.dom.TagName.A = new goog.dom.TagName("A");
goog.dom.TagName.ABBR = new goog.dom.TagName("ABBR");
goog.dom.TagName.ACRONYM = new goog.dom.TagName("ACRONYM");
goog.dom.TagName.ADDRESS = new goog.dom.TagName("ADDRESS");
goog.dom.TagName.APPLET = new goog.dom.TagName("APPLET");
goog.dom.TagName.AREA = new goog.dom.TagName("AREA");
goog.dom.TagName.ARTICLE = new goog.dom.TagName("ARTICLE");
goog.dom.TagName.ASIDE = new goog.dom.TagName("ASIDE");
goog.dom.TagName.AUDIO = new goog.dom.TagName("AUDIO");
goog.dom.TagName.B = new goog.dom.TagName("B");
goog.dom.TagName.BASE = new goog.dom.TagName("BASE");
goog.dom.TagName.BASEFONT = new goog.dom.TagName("BASEFONT");
goog.dom.TagName.BDI = new goog.dom.TagName("BDI");
goog.dom.TagName.BDO = new goog.dom.TagName("BDO");
goog.dom.TagName.BIG = new goog.dom.TagName("BIG");
goog.dom.TagName.BLOCKQUOTE = new goog.dom.TagName("BLOCKQUOTE");
goog.dom.TagName.BODY = new goog.dom.TagName("BODY");
goog.dom.TagName.BR = new goog.dom.TagName("BR");
goog.dom.TagName.BUTTON = new goog.dom.TagName("BUTTON");
goog.dom.TagName.CANVAS = new goog.dom.TagName("CANVAS");
goog.dom.TagName.CAPTION = new goog.dom.TagName("CAPTION");
goog.dom.TagName.CENTER = new goog.dom.TagName("CENTER");
goog.dom.TagName.CITE = new goog.dom.TagName("CITE");
goog.dom.TagName.CODE = new goog.dom.TagName("CODE");
goog.dom.TagName.COL = new goog.dom.TagName("COL");
goog.dom.TagName.COLGROUP = new goog.dom.TagName("COLGROUP");
goog.dom.TagName.COMMAND = new goog.dom.TagName("COMMAND");
goog.dom.TagName.DATA = new goog.dom.TagName("DATA");
goog.dom.TagName.DATALIST = new goog.dom.TagName("DATALIST");
goog.dom.TagName.DD = new goog.dom.TagName("DD");
goog.dom.TagName.DEL = new goog.dom.TagName("DEL");
goog.dom.TagName.DETAILS = new goog.dom.TagName("DETAILS");
goog.dom.TagName.DFN = new goog.dom.TagName("DFN");
goog.dom.TagName.DIALOG = new goog.dom.TagName("DIALOG");
goog.dom.TagName.DIR = new goog.dom.TagName("DIR");
goog.dom.TagName.DIV = new goog.dom.TagName("DIV");
goog.dom.TagName.DL = new goog.dom.TagName("DL");
goog.dom.TagName.DT = new goog.dom.TagName("DT");
goog.dom.TagName.EM = new goog.dom.TagName("EM");
goog.dom.TagName.EMBED = new goog.dom.TagName("EMBED");
goog.dom.TagName.FIELDSET = new goog.dom.TagName("FIELDSET");
goog.dom.TagName.FIGCAPTION = new goog.dom.TagName("FIGCAPTION");
goog.dom.TagName.FIGURE = new goog.dom.TagName("FIGURE");
goog.dom.TagName.FONT = new goog.dom.TagName("FONT");
goog.dom.TagName.FOOTER = new goog.dom.TagName("FOOTER");
goog.dom.TagName.FORM = new goog.dom.TagName("FORM");
goog.dom.TagName.FRAME = new goog.dom.TagName("FRAME");
goog.dom.TagName.FRAMESET = new goog.dom.TagName("FRAMESET");
goog.dom.TagName.H1 = new goog.dom.TagName("H1");
goog.dom.TagName.H2 = new goog.dom.TagName("H2");
goog.dom.TagName.H3 = new goog.dom.TagName("H3");
goog.dom.TagName.H4 = new goog.dom.TagName("H4");
goog.dom.TagName.H5 = new goog.dom.TagName("H5");
goog.dom.TagName.H6 = new goog.dom.TagName("H6");
goog.dom.TagName.HEAD = new goog.dom.TagName("HEAD");
goog.dom.TagName.HEADER = new goog.dom.TagName("HEADER");
goog.dom.TagName.HGROUP = new goog.dom.TagName("HGROUP");
goog.dom.TagName.HR = new goog.dom.TagName("HR");
goog.dom.TagName.HTML = new goog.dom.TagName("HTML");
goog.dom.TagName.I = new goog.dom.TagName("I");
goog.dom.TagName.IFRAME = new goog.dom.TagName("IFRAME");
goog.dom.TagName.IMG = new goog.dom.TagName("IMG");
goog.dom.TagName.INPUT = new goog.dom.TagName("INPUT");
goog.dom.TagName.INS = new goog.dom.TagName("INS");
goog.dom.TagName.ISINDEX = new goog.dom.TagName("ISINDEX");
goog.dom.TagName.KBD = new goog.dom.TagName("KBD");
goog.dom.TagName.KEYGEN = new goog.dom.TagName("KEYGEN");
goog.dom.TagName.LABEL = new goog.dom.TagName("LABEL");
goog.dom.TagName.LEGEND = new goog.dom.TagName("LEGEND");
goog.dom.TagName.LI = new goog.dom.TagName("LI");
goog.dom.TagName.LINK = new goog.dom.TagName("LINK");
goog.dom.TagName.MAP = new goog.dom.TagName("MAP");
goog.dom.TagName.MARK = new goog.dom.TagName("MARK");
goog.dom.TagName.MATH = new goog.dom.TagName("MATH");
goog.dom.TagName.MENU = new goog.dom.TagName("MENU");
goog.dom.TagName.META = new goog.dom.TagName("META");
goog.dom.TagName.METER = new goog.dom.TagName("METER");
goog.dom.TagName.NAV = new goog.dom.TagName("NAV");
goog.dom.TagName.NOFRAMES = new goog.dom.TagName("NOFRAMES");
goog.dom.TagName.NOSCRIPT = new goog.dom.TagName("NOSCRIPT");
goog.dom.TagName.OBJECT = new goog.dom.TagName("OBJECT");
goog.dom.TagName.OL = new goog.dom.TagName("OL");
goog.dom.TagName.OPTGROUP = new goog.dom.TagName("OPTGROUP");
goog.dom.TagName.OPTION = new goog.dom.TagName("OPTION");
goog.dom.TagName.OUTPUT = new goog.dom.TagName("OUTPUT");
goog.dom.TagName.P = new goog.dom.TagName("P");
goog.dom.TagName.PARAM = new goog.dom.TagName("PARAM");
goog.dom.TagName.PRE = new goog.dom.TagName("PRE");
goog.dom.TagName.PROGRESS = new goog.dom.TagName("PROGRESS");
goog.dom.TagName.Q = new goog.dom.TagName("Q");
goog.dom.TagName.RP = new goog.dom.TagName("RP");
goog.dom.TagName.RT = new goog.dom.TagName("RT");
goog.dom.TagName.RUBY = new goog.dom.TagName("RUBY");
goog.dom.TagName.S = new goog.dom.TagName("S");
goog.dom.TagName.SAMP = new goog.dom.TagName("SAMP");
goog.dom.TagName.SCRIPT = new goog.dom.TagName("SCRIPT");
goog.dom.TagName.SECTION = new goog.dom.TagName("SECTION");
goog.dom.TagName.SELECT = new goog.dom.TagName("SELECT");
goog.dom.TagName.SMALL = new goog.dom.TagName("SMALL");
goog.dom.TagName.SOURCE = new goog.dom.TagName("SOURCE");
goog.dom.TagName.SPAN = new goog.dom.TagName("SPAN");
goog.dom.TagName.STRIKE = new goog.dom.TagName("STRIKE");
goog.dom.TagName.STRONG = new goog.dom.TagName("STRONG");
goog.dom.TagName.STYLE = new goog.dom.TagName("STYLE");
goog.dom.TagName.SUB = new goog.dom.TagName("SUB");
goog.dom.TagName.SUMMARY = new goog.dom.TagName("SUMMARY");
goog.dom.TagName.SUP = new goog.dom.TagName("SUP");
goog.dom.TagName.SVG = new goog.dom.TagName("SVG");
goog.dom.TagName.TABLE = new goog.dom.TagName("TABLE");
goog.dom.TagName.TBODY = new goog.dom.TagName("TBODY");
goog.dom.TagName.TD = new goog.dom.TagName("TD");
goog.dom.TagName.TEMPLATE = new goog.dom.TagName("TEMPLATE");
goog.dom.TagName.TEXTAREA = new goog.dom.TagName("TEXTAREA");
goog.dom.TagName.TFOOT = new goog.dom.TagName("TFOOT");
goog.dom.TagName.TH = new goog.dom.TagName("TH");
goog.dom.TagName.THEAD = new goog.dom.TagName("THEAD");
goog.dom.TagName.TIME = new goog.dom.TagName("TIME");
goog.dom.TagName.TITLE = new goog.dom.TagName("TITLE");
goog.dom.TagName.TR = new goog.dom.TagName("TR");
goog.dom.TagName.TRACK = new goog.dom.TagName("TRACK");
goog.dom.TagName.TT = new goog.dom.TagName("TT");
goog.dom.TagName.U = new goog.dom.TagName("U");
goog.dom.TagName.UL = new goog.dom.TagName("UL");
goog.dom.TagName.VAR = new goog.dom.TagName("VAR");
goog.dom.TagName.VIDEO = new goog.dom.TagName("VIDEO");
goog.dom.TagName.WBR = new goog.dom.TagName("WBR");
goog.object = {};
goog.object.is = function(v, v2) {
  return v === v2 ? 0 !== v || 1 / v === 1 / v2 : v !== v && v2 !== v2;
};
goog.object.forEach = function(obj, f, opt_obj) {
  for (var key in obj) {
    f.call(opt_obj, obj[key], key, obj);
  }
};
goog.object.filter = function(obj, f, opt_obj) {
  var res = {}, key;
  for (key in obj) {
    f.call(opt_obj, obj[key], key, obj) && (res[key] = obj[key]);
  }
  return res;
};
goog.object.map = function(obj, f, opt_obj) {
  var res = {}, key;
  for (key in obj) {
    res[key] = f.call(opt_obj, obj[key], key, obj);
  }
  return res;
};
goog.object.some = function(obj, f, opt_obj) {
  for (var key in obj) {
    if (f.call(opt_obj, obj[key], key, obj)) {
      return !0;
    }
  }
  return !1;
};
goog.object.every = function(obj, f, opt_obj) {
  for (var key in obj) {
    if (!f.call(opt_obj, obj[key], key, obj)) {
      return !1;
    }
  }
  return !0;
};
goog.object.getCount = function(obj) {
  var rv = 0, key;
  for (key in obj) {
    rv++;
  }
  return rv;
};
goog.object.getAnyKey = function(obj) {
  for (var key in obj) {
    return key;
  }
};
goog.object.getAnyValue = function(obj) {
  for (var key in obj) {
    return obj[key];
  }
};
goog.object.contains = function(obj, val) {
  return goog.object.containsValue(obj, val);
};
goog.object.getValues = function(obj) {
  var res = [], i = 0, key;
  for (key in obj) {
    res[i++] = obj[key];
  }
  return res;
};
goog.object.getKeys = function(obj) {
  var res = [], i = 0, key;
  for (key in obj) {
    res[i++] = key;
  }
  return res;
};
goog.object.getValueByKeys = function(obj, var_args) {
  for (var isArrayLike = goog.isArrayLike(var_args), keys = isArrayLike ? var_args : arguments, i = isArrayLike ? 0 : 1;i < keys.length && (obj = obj[keys[i]], goog.isDef(obj));i++) {
  }
  return obj;
};
goog.object.containsKey = function(obj, key) {
  return null !== obj && key in obj;
};
goog.object.containsValue = function(obj, val) {
  for (var key in obj) {
    if (obj[key] == val) {
      return !0;
    }
  }
  return !1;
};
goog.object.findKey = function(obj, f, opt_this) {
  for (var key in obj) {
    if (f.call(opt_this, obj[key], key, obj)) {
      return key;
    }
  }
};
goog.object.findValue = function(obj, f, opt_this) {
  var key = goog.object.findKey(obj, f, opt_this);
  return key && obj[key];
};
goog.object.isEmpty = function(obj) {
  for (var key in obj) {
    return !1;
  }
  return !0;
};
goog.object.clear = function(obj) {
  for (var i in obj) {
    delete obj[i];
  }
};
goog.object.remove = function(obj, key) {
  var rv;
  (rv = key in obj) && delete obj[key];
  return rv;
};
goog.object.add = function(obj, key, val) {
  if (null !== obj && key in obj) {
    throw Error('The object already contains the key "' + key + '"');
  }
  goog.object.set(obj, key, val);
};
goog.object.get = function(obj, key, opt_val) {
  return null !== obj && key in obj ? obj[key] : opt_val;
};
goog.object.set = function(obj, key, value) {
  obj[key] = value;
};
goog.object.setIfUndefined = function(obj, key, value) {
  return key in obj ? obj[key] : obj[key] = value;
};
goog.object.setWithReturnValueIfNotSet = function(obj, key, f) {
  if (key in obj) {
    return obj[key];
  }
  var val = f();
  return obj[key] = val;
};
goog.object.equals = function(a, b) {
  for (var k in a) {
    if (!(k in b) || a[k] !== b[k]) {
      return !1;
    }
  }
  for (k in b) {
    if (!(k in a)) {
      return !1;
    }
  }
  return !0;
};
goog.object.clone = function(obj) {
  var res = {}, key;
  for (key in obj) {
    res[key] = obj[key];
  }
  return res;
};
goog.object.unsafeClone = function(obj) {
  var type = goog.typeOf(obj);
  if ("object" == type || "array" == type) {
    if (goog.isFunction(obj.clone)) {
      return obj.clone();
    }
    var clone = "array" == type ? [] : {}, key;
    for (key in obj) {
      clone[key] = goog.object.unsafeClone(obj[key]);
    }
    return clone;
  }
  return obj;
};
goog.object.transpose = function(obj) {
  var transposed = {}, key;
  for (key in obj) {
    transposed[obj[key]] = key;
  }
  return transposed;
};
goog.object.PROTOTYPE_FIELDS_ = "constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");
goog.object.extend = function(target, var_args) {
  for (var key, source, i = 1;i < arguments.length;i++) {
    source = arguments[i];
    for (key in source) {
      target[key] = source[key];
    }
    for (var j = 0;j < goog.object.PROTOTYPE_FIELDS_.length;j++) {
      key = goog.object.PROTOTYPE_FIELDS_[j], Object.prototype.hasOwnProperty.call(source, key) && (target[key] = source[key]);
    }
  }
};
goog.object.create = function(var_args) {
  var argLength = arguments.length;
  if (1 == argLength && goog.isArray(arguments[0])) {
    return goog.object.create.apply(null, arguments[0]);
  }
  if (argLength % 2) {
    throw Error("Uneven number of arguments");
  }
  for (var rv = {}, i = 0;i < argLength;i += 2) {
    rv[arguments[i]] = arguments[i + 1];
  }
  return rv;
};
goog.object.createSet = function(var_args) {
  var argLength = arguments.length;
  if (1 == argLength && goog.isArray(arguments[0])) {
    return goog.object.createSet.apply(null, arguments[0]);
  }
  for (var rv = {}, i = 0;i < argLength;i++) {
    rv[arguments[i]] = !0;
  }
  return rv;
};
goog.object.createImmutableView = function(obj) {
  var result = obj;
  Object.isFrozen && !Object.isFrozen(obj) && (result = Object.create(obj), Object.freeze(result));
  return result;
};
goog.object.isImmutableView = function(obj) {
  return !!Object.isFrozen && Object.isFrozen(obj);
};
goog.object.getAllPropertyNames = function(obj, opt_includeObjectPrototype) {
  if (!obj) {
    return [];
  }
  if (!Object.getOwnPropertyNames || !Object.getPrototypeOf) {
    return goog.object.getKeys(obj);
  }
  for (var visitedSet = {}, proto = obj;proto && (proto !== Object.prototype || opt_includeObjectPrototype);) {
    for (var names = Object.getOwnPropertyNames(proto), i = 0;i < names.length;i++) {
      visitedSet[names[i]] = !0;
    }
    proto = Object.getPrototypeOf(proto);
  }
  return goog.object.getKeys(visitedSet);
};
goog.dom.tags = {};
goog.dom.tags.VOID_TAGS_ = {area:!0, base:!0, br:!0, col:!0, command:!0, embed:!0, hr:!0, img:!0, input:!0, keygen:!0, link:!0, meta:!0, param:!0, source:!0, track:!0, wbr:!0};
goog.dom.tags.isVoidTag = function(tagName) {
  return !0 === goog.dom.tags.VOID_TAGS_[tagName];
};
goog.i18n = {};
goog.i18n.bidi = {};
goog.i18n.bidi.FORCE_RTL = !1;
goog.i18n.bidi.IS_RTL = goog.i18n.bidi.FORCE_RTL || ("ar" == goog.LOCALE.substring(0, 2).toLowerCase() || "fa" == goog.LOCALE.substring(0, 2).toLowerCase() || "he" == goog.LOCALE.substring(0, 2).toLowerCase() || "iw" == goog.LOCALE.substring(0, 2).toLowerCase() || "ps" == goog.LOCALE.substring(0, 2).toLowerCase() || "sd" == goog.LOCALE.substring(0, 2).toLowerCase() || "ug" == goog.LOCALE.substring(0, 2).toLowerCase() || "ur" == goog.LOCALE.substring(0, 2).toLowerCase() || "yi" == goog.LOCALE.substring(0, 
2).toLowerCase()) && (2 == goog.LOCALE.length || "-" == goog.LOCALE.substring(2, 3) || "_" == goog.LOCALE.substring(2, 3)) || 3 <= goog.LOCALE.length && "ckb" == goog.LOCALE.substring(0, 3).toLowerCase() && (3 == goog.LOCALE.length || "-" == goog.LOCALE.substring(3, 4) || "_" == goog.LOCALE.substring(3, 4));
goog.i18n.bidi.Format = {LRE:"\u202a", RLE:"\u202b", PDF:"\u202c", LRM:"\u200e", RLM:"\u200f"};
goog.i18n.bidi.Dir = {LTR:1, RTL:-1, NEUTRAL:0};
goog.i18n.bidi.RIGHT = "right";
goog.i18n.bidi.LEFT = "left";
goog.i18n.bidi.I18N_RIGHT = goog.i18n.bidi.IS_RTL ? goog.i18n.bidi.LEFT : goog.i18n.bidi.RIGHT;
goog.i18n.bidi.I18N_LEFT = goog.i18n.bidi.IS_RTL ? goog.i18n.bidi.RIGHT : goog.i18n.bidi.LEFT;
goog.i18n.bidi.toDir = function(givenDir, opt_noNeutral) {
  return "number" == typeof givenDir ? 0 < givenDir ? goog.i18n.bidi.Dir.LTR : 0 > givenDir ? goog.i18n.bidi.Dir.RTL : opt_noNeutral ? null : goog.i18n.bidi.Dir.NEUTRAL : null == givenDir ? null : givenDir ? goog.i18n.bidi.Dir.RTL : goog.i18n.bidi.Dir.LTR;
};
goog.i18n.bidi.ltrChars_ = "A-Za-z\u00c0-\u00d6\u00d8-\u00f6\u00f8-\u02b8\u0300-\u0590\u0800-\u1fff\u200e\u2c00-\ufb1c\ufe00-\ufe6f\ufefd-\uffff";
goog.i18n.bidi.rtlChars_ = "\u0591-\u06ef\u06fa-\u07ff\u200f\ufb1d-\ufdff\ufe70-\ufefc";
goog.i18n.bidi.htmlSkipReg_ = /<[^>]*>|&[^;]+;/g;
goog.i18n.bidi.stripHtmlIfNeeded_ = function(str, opt_isStripNeeded) {
  return opt_isStripNeeded ? str.replace(goog.i18n.bidi.htmlSkipReg_, "") : str;
};
goog.i18n.bidi.rtlCharReg_ = new RegExp("[" + goog.i18n.bidi.rtlChars_ + "]");
goog.i18n.bidi.ltrCharReg_ = new RegExp("[" + goog.i18n.bidi.ltrChars_ + "]");
goog.i18n.bidi.hasAnyRtl = function(str, opt_isHtml) {
  return goog.i18n.bidi.rtlCharReg_.test(goog.i18n.bidi.stripHtmlIfNeeded_(str, opt_isHtml));
};
goog.i18n.bidi.hasRtlChar = goog.i18n.bidi.hasAnyRtl;
goog.i18n.bidi.hasAnyLtr = function(str, opt_isHtml) {
  return goog.i18n.bidi.ltrCharReg_.test(goog.i18n.bidi.stripHtmlIfNeeded_(str, opt_isHtml));
};
goog.i18n.bidi.ltrRe_ = new RegExp("^[" + goog.i18n.bidi.ltrChars_ + "]");
goog.i18n.bidi.rtlRe_ = new RegExp("^[" + goog.i18n.bidi.rtlChars_ + "]");
goog.i18n.bidi.isRtlChar = function(str) {
  return goog.i18n.bidi.rtlRe_.test(str);
};
goog.i18n.bidi.isLtrChar = function(str) {
  return goog.i18n.bidi.ltrRe_.test(str);
};
goog.i18n.bidi.isNeutralChar = function(str) {
  return !goog.i18n.bidi.isLtrChar(str) && !goog.i18n.bidi.isRtlChar(str);
};
goog.i18n.bidi.ltrDirCheckRe_ = new RegExp("^[^" + goog.i18n.bidi.rtlChars_ + "]*[" + goog.i18n.bidi.ltrChars_ + "]");
goog.i18n.bidi.rtlDirCheckRe_ = new RegExp("^[^" + goog.i18n.bidi.ltrChars_ + "]*[" + goog.i18n.bidi.rtlChars_ + "]");
goog.i18n.bidi.startsWithRtl = function(str, opt_isHtml) {
  return goog.i18n.bidi.rtlDirCheckRe_.test(goog.i18n.bidi.stripHtmlIfNeeded_(str, opt_isHtml));
};
goog.i18n.bidi.isRtlText = goog.i18n.bidi.startsWithRtl;
goog.i18n.bidi.startsWithLtr = function(str, opt_isHtml) {
  return goog.i18n.bidi.ltrDirCheckRe_.test(goog.i18n.bidi.stripHtmlIfNeeded_(str, opt_isHtml));
};
goog.i18n.bidi.isLtrText = goog.i18n.bidi.startsWithLtr;
goog.i18n.bidi.isRequiredLtrRe_ = /^http:\/\/.*/;
goog.i18n.bidi.isNeutralText = function(str, opt_isHtml) {
  str = goog.i18n.bidi.stripHtmlIfNeeded_(str, opt_isHtml);
  return goog.i18n.bidi.isRequiredLtrRe_.test(str) || !goog.i18n.bidi.hasAnyLtr(str) && !goog.i18n.bidi.hasAnyRtl(str);
};
goog.i18n.bidi.ltrExitDirCheckRe_ = new RegExp("[" + goog.i18n.bidi.ltrChars_ + "][^" + goog.i18n.bidi.rtlChars_ + "]*$");
goog.i18n.bidi.rtlExitDirCheckRe_ = new RegExp("[" + goog.i18n.bidi.rtlChars_ + "][^" + goog.i18n.bidi.ltrChars_ + "]*$");
goog.i18n.bidi.endsWithLtr = function(str, opt_isHtml) {
  return goog.i18n.bidi.ltrExitDirCheckRe_.test(goog.i18n.bidi.stripHtmlIfNeeded_(str, opt_isHtml));
};
goog.i18n.bidi.isLtrExitText = goog.i18n.bidi.endsWithLtr;
goog.i18n.bidi.endsWithRtl = function(str, opt_isHtml) {
  return goog.i18n.bidi.rtlExitDirCheckRe_.test(goog.i18n.bidi.stripHtmlIfNeeded_(str, opt_isHtml));
};
goog.i18n.bidi.isRtlExitText = goog.i18n.bidi.endsWithRtl;
goog.i18n.bidi.rtlLocalesRe_ = /^(ar|ckb|dv|he|iw|fa|nqo|ps|sd|ug|ur|yi|.*[-_](Arab|Hebr|Thaa|Nkoo|Tfng))(?!.*[-_](Latn|Cyrl)($|-|_))($|-|_)/i;
goog.i18n.bidi.isRtlLanguage = function(lang) {
  return goog.i18n.bidi.rtlLocalesRe_.test(lang);
};
goog.i18n.bidi.bracketGuardTextRe_ = /(\(.*?\)+)|(\[.*?\]+)|(\{.*?\}+)|(<.*?>+)/g;
goog.i18n.bidi.guardBracketInText = function(s, opt_isRtlContext) {
  var mark = (void 0 === opt_isRtlContext ? goog.i18n.bidi.hasAnyRtl(s) : opt_isRtlContext) ? goog.i18n.bidi.Format.RLM : goog.i18n.bidi.Format.LRM;
  return s.replace(goog.i18n.bidi.bracketGuardTextRe_, mark + "$&" + mark);
};
goog.i18n.bidi.enforceRtlInHtml = function(html) {
  return "<" == html.charAt(0) ? html.replace(/<\w+/, "$& dir=rtl") : "\n<span dir=rtl>" + html + "</span>";
};
goog.i18n.bidi.enforceRtlInText = function(text) {
  return goog.i18n.bidi.Format.RLE + text + goog.i18n.bidi.Format.PDF;
};
goog.i18n.bidi.enforceLtrInHtml = function(html) {
  return "<" == html.charAt(0) ? html.replace(/<\w+/, "$& dir=ltr") : "\n<span dir=ltr>" + html + "</span>";
};
goog.i18n.bidi.enforceLtrInText = function(text) {
  return goog.i18n.bidi.Format.LRE + text + goog.i18n.bidi.Format.PDF;
};
goog.i18n.bidi.dimensionsRe_ = /:\s*([.\d][.\w]*)\s+([.\d][.\w]*)\s+([.\d][.\w]*)\s+([.\d][.\w]*)/g;
goog.i18n.bidi.leftRe_ = /left/gi;
goog.i18n.bidi.rightRe_ = /right/gi;
goog.i18n.bidi.tempRe_ = /%%%%/g;
goog.i18n.bidi.mirrorCSS = function(cssStr) {
  return cssStr.replace(goog.i18n.bidi.dimensionsRe_, ":$1 $4 $3 $2").replace(goog.i18n.bidi.leftRe_, "%%%%").replace(goog.i18n.bidi.rightRe_, goog.i18n.bidi.LEFT).replace(goog.i18n.bidi.tempRe_, goog.i18n.bidi.RIGHT);
};
goog.i18n.bidi.doubleQuoteSubstituteRe_ = /([\u0591-\u05f2])"/g;
goog.i18n.bidi.singleQuoteSubstituteRe_ = /([\u0591-\u05f2])'/g;
goog.i18n.bidi.normalizeHebrewQuote = function(str) {
  return str.replace(goog.i18n.bidi.doubleQuoteSubstituteRe_, "$1\u05f4").replace(goog.i18n.bidi.singleQuoteSubstituteRe_, "$1\u05f3");
};
goog.i18n.bidi.wordSeparatorRe_ = /\s+/;
goog.i18n.bidi.hasNumeralsRe_ = /[\d\u06f0-\u06f9]/;
goog.i18n.bidi.rtlDetectionThreshold_ = 0.40;
goog.i18n.bidi.estimateDirection = function(str, opt_isHtml) {
  for (var rtlCount = 0, totalCount = 0, hasWeaklyLtr = !1, tokens = goog.i18n.bidi.stripHtmlIfNeeded_(str, opt_isHtml).split(goog.i18n.bidi.wordSeparatorRe_), i = 0;i < tokens.length;i++) {
    var token = tokens[i];
    goog.i18n.bidi.startsWithRtl(token) ? (rtlCount++, totalCount++) : goog.i18n.bidi.isRequiredLtrRe_.test(token) ? hasWeaklyLtr = !0 : goog.i18n.bidi.hasAnyLtr(token) ? totalCount++ : goog.i18n.bidi.hasNumeralsRe_.test(token) && (hasWeaklyLtr = !0);
  }
  return 0 == totalCount ? hasWeaklyLtr ? goog.i18n.bidi.Dir.LTR : goog.i18n.bidi.Dir.NEUTRAL : rtlCount / totalCount > goog.i18n.bidi.rtlDetectionThreshold_ ? goog.i18n.bidi.Dir.RTL : goog.i18n.bidi.Dir.LTR;
};
goog.i18n.bidi.detectRtlDirectionality = function(str, opt_isHtml) {
  return goog.i18n.bidi.estimateDirection(str, opt_isHtml) == goog.i18n.bidi.Dir.RTL;
};
goog.i18n.bidi.setElementDirAndAlign = function(element, dir) {
  element && (dir = goog.i18n.bidi.toDir(dir)) && (element.style.textAlign = dir == goog.i18n.bidi.Dir.RTL ? goog.i18n.bidi.RIGHT : goog.i18n.bidi.LEFT, element.dir = dir == goog.i18n.bidi.Dir.RTL ? "rtl" : "ltr");
};
goog.i18n.bidi.setElementDirByTextDirectionality = function(element, text) {
  switch(goog.i18n.bidi.estimateDirection(text)) {
    case goog.i18n.bidi.Dir.LTR:
      element.dir = "ltr";
      break;
    case goog.i18n.bidi.Dir.RTL:
      element.dir = "rtl";
      break;
    default:
      element.removeAttribute("dir");
  }
};
goog.i18n.bidi.DirectionalString = function() {
};
goog.labs = {};
goog.labs.userAgent = {};
goog.labs.userAgent.util = {};
goog.labs.userAgent.util.getNativeUserAgentString_ = function() {
  var navigator = goog.labs.userAgent.util.getNavigator_();
  if (navigator) {
    var userAgent = navigator.userAgent;
    if (userAgent) {
      return userAgent;
    }
  }
  return "";
};
goog.labs.userAgent.util.getNavigator_ = function() {
  return goog.global.navigator;
};
goog.labs.userAgent.util.userAgent_ = goog.labs.userAgent.util.getNativeUserAgentString_();
goog.labs.userAgent.util.setUserAgent = function(opt_userAgent) {
  goog.labs.userAgent.util.userAgent_ = opt_userAgent || goog.labs.userAgent.util.getNativeUserAgentString_();
};
goog.labs.userAgent.util.getUserAgent = function() {
  return goog.labs.userAgent.util.userAgent_;
};
goog.labs.userAgent.util.matchUserAgent = function(str) {
  return goog.string.contains(goog.labs.userAgent.util.getUserAgent(), str);
};
goog.labs.userAgent.util.matchUserAgentIgnoreCase = function(str) {
  return goog.string.caseInsensitiveContains(goog.labs.userAgent.util.getUserAgent(), str);
};
goog.labs.userAgent.util.extractVersionTuples = function(userAgent) {
  for (var versionRegExp = /(\w[\w ]+)\/([^\s]+)\s*(?:\((.*?)\))?/g, data = [], match;match = versionRegExp.exec(userAgent);) {
    data.push([match[1], match[2], match[3] || void 0]);
  }
  return data;
};
goog.labs.userAgent.browser = {};
goog.labs.userAgent.browser.matchOpera_ = function() {
  return goog.labs.userAgent.util.matchUserAgent("Opera");
};
goog.labs.userAgent.browser.matchIE_ = function() {
  return goog.labs.userAgent.util.matchUserAgent("Trident") || goog.labs.userAgent.util.matchUserAgent("MSIE");
};
goog.labs.userAgent.browser.matchEdge_ = function() {
  return goog.labs.userAgent.util.matchUserAgent("Edge");
};
goog.labs.userAgent.browser.matchFirefox_ = function() {
  return goog.labs.userAgent.util.matchUserAgent("Firefox");
};
goog.labs.userAgent.browser.matchSafari_ = function() {
  return goog.labs.userAgent.util.matchUserAgent("Safari") && !(goog.labs.userAgent.browser.matchChrome_() || goog.labs.userAgent.browser.matchCoast_() || goog.labs.userAgent.browser.matchOpera_() || goog.labs.userAgent.browser.matchEdge_() || goog.labs.userAgent.browser.isSilk() || goog.labs.userAgent.util.matchUserAgent("Android"));
};
goog.labs.userAgent.browser.matchCoast_ = function() {
  return goog.labs.userAgent.util.matchUserAgent("Coast");
};
goog.labs.userAgent.browser.matchIosWebview_ = function() {
  return (goog.labs.userAgent.util.matchUserAgent("iPad") || goog.labs.userAgent.util.matchUserAgent("iPhone")) && !goog.labs.userAgent.browser.matchSafari_() && !goog.labs.userAgent.browser.matchChrome_() && !goog.labs.userAgent.browser.matchCoast_() && goog.labs.userAgent.util.matchUserAgent("AppleWebKit");
};
goog.labs.userAgent.browser.matchChrome_ = function() {
  return (goog.labs.userAgent.util.matchUserAgent("Chrome") || goog.labs.userAgent.util.matchUserAgent("CriOS")) && !goog.labs.userAgent.browser.matchEdge_();
};
goog.labs.userAgent.browser.matchAndroidBrowser_ = function() {
  return goog.labs.userAgent.util.matchUserAgent("Android") && !(goog.labs.userAgent.browser.isChrome() || goog.labs.userAgent.browser.isFirefox() || goog.labs.userAgent.browser.isOpera() || goog.labs.userAgent.browser.isSilk());
};
goog.labs.userAgent.browser.isOpera = goog.labs.userAgent.browser.matchOpera_;
goog.labs.userAgent.browser.isIE = goog.labs.userAgent.browser.matchIE_;
goog.labs.userAgent.browser.isEdge = goog.labs.userAgent.browser.matchEdge_;
goog.labs.userAgent.browser.isFirefox = goog.labs.userAgent.browser.matchFirefox_;
goog.labs.userAgent.browser.isSafari = goog.labs.userAgent.browser.matchSafari_;
goog.labs.userAgent.browser.isCoast = goog.labs.userAgent.browser.matchCoast_;
goog.labs.userAgent.browser.isIosWebview = goog.labs.userAgent.browser.matchIosWebview_;
goog.labs.userAgent.browser.isChrome = goog.labs.userAgent.browser.matchChrome_;
goog.labs.userAgent.browser.isAndroidBrowser = goog.labs.userAgent.browser.matchAndroidBrowser_;
goog.labs.userAgent.browser.isSilk = function() {
  return goog.labs.userAgent.util.matchUserAgent("Silk");
};
goog.labs.userAgent.browser.getVersion = function() {
  function lookUpValueWithKeys(keys) {
    var key = goog.array.find(keys, versionMapHasKey);
    return versionMap[key] || "";
  }
  var userAgentString = goog.labs.userAgent.util.getUserAgent();
  if (goog.labs.userAgent.browser.isIE()) {
    return goog.labs.userAgent.browser.getIEVersion_(userAgentString);
  }
  var versionTuples = goog.labs.userAgent.util.extractVersionTuples(userAgentString), versionMap = {};
  goog.array.forEach(versionTuples, function(tuple) {
    versionMap[tuple[0]] = tuple[1];
  });
  var versionMapHasKey = goog.partial(goog.object.containsKey, versionMap);
  if (goog.labs.userAgent.browser.isOpera()) {
    return lookUpValueWithKeys(["Version", "Opera"]);
  }
  if (goog.labs.userAgent.browser.isEdge()) {
    return lookUpValueWithKeys(["Edge"]);
  }
  if (goog.labs.userAgent.browser.isChrome()) {
    return lookUpValueWithKeys(["Chrome", "CriOS"]);
  }
  var tuple = versionTuples[2];
  return tuple && tuple[1] || "";
};
goog.labs.userAgent.browser.isVersionOrHigher = function(version) {
  return 0 <= goog.string.compareVersions(goog.labs.userAgent.browser.getVersion(), version);
};
goog.labs.userAgent.browser.getIEVersion_ = function(userAgent) {
  var rv = /rv: *([\d\.]*)/.exec(userAgent);
  if (rv && rv[1]) {
    return rv[1];
  }
  var version = "", msie = /MSIE +([\d\.]+)/.exec(userAgent);
  if (msie && msie[1]) {
    var tridentVersion = /Trident\/(\d.\d)/.exec(userAgent);
    if ("7.0" == msie[1]) {
      if (tridentVersion && tridentVersion[1]) {
        switch(tridentVersion[1]) {
          case "4.0":
            version = "8.0";
            break;
          case "5.0":
            version = "9.0";
            break;
          case "6.0":
            version = "10.0";
            break;
          case "7.0":
            version = "11.0";
        }
      } else {
        version = "7.0";
      }
    } else {
      version = msie[1];
    }
  }
  return version;
};
goog.string.TypedString = function() {
};
goog.string.Const = function() {
  this.stringConstValueWithSecurityContract__googStringSecurityPrivate_ = "";
  this.STRING_CONST_TYPE_MARKER__GOOG_STRING_SECURITY_PRIVATE_ = goog.string.Const.TYPE_MARKER_;
};
goog.string.Const.prototype.implementsGoogStringTypedString = !0;
goog.string.Const.prototype.getTypedStringValue = function() {
  return this.stringConstValueWithSecurityContract__googStringSecurityPrivate_;
};
goog.string.Const.prototype.toString = function() {
  return "Const{" + this.stringConstValueWithSecurityContract__googStringSecurityPrivate_ + "}";
};
goog.string.Const.unwrap = function(stringConst) {
  if (stringConst instanceof goog.string.Const && stringConst.constructor === goog.string.Const && stringConst.STRING_CONST_TYPE_MARKER__GOOG_STRING_SECURITY_PRIVATE_ === goog.string.Const.TYPE_MARKER_) {
    return stringConst.stringConstValueWithSecurityContract__googStringSecurityPrivate_;
  }
  goog.asserts.fail("expected object of type Const, got '" + stringConst + "'");
  return "type_error:Const";
};
goog.string.Const.from = function(s) {
  return goog.string.Const.create__googStringSecurityPrivate_(s);
};
goog.string.Const.TYPE_MARKER_ = {};
goog.string.Const.create__googStringSecurityPrivate_ = function(s) {
  var stringConst = new goog.string.Const;
  stringConst.stringConstValueWithSecurityContract__googStringSecurityPrivate_ = s;
  return stringConst;
};
goog.string.Const.EMPTY = goog.string.Const.from("");
goog.html = {};
goog.html.SafeScript = function() {
  this.privateDoNotAccessOrElseSafeScriptWrappedValue_ = "";
  this.SAFE_SCRIPT_TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_ = goog.html.SafeScript.TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_;
};
goog.html.SafeScript.prototype.implementsGoogStringTypedString = !0;
goog.html.SafeScript.TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_ = {};
goog.html.SafeScript.fromConstant = function(script) {
  var scriptString = goog.string.Const.unwrap(script);
  return 0 === scriptString.length ? goog.html.SafeScript.EMPTY : goog.html.SafeScript.createSafeScriptSecurityPrivateDoNotAccessOrElse(scriptString);
};
goog.html.SafeScript.prototype.getTypedStringValue = function() {
  return this.privateDoNotAccessOrElseSafeScriptWrappedValue_;
};
goog.DEBUG && (goog.html.SafeScript.prototype.toString = function() {
  return "SafeScript{" + this.privateDoNotAccessOrElseSafeScriptWrappedValue_ + "}";
});
goog.html.SafeScript.unwrap = function(safeScript) {
  if (safeScript instanceof goog.html.SafeScript && safeScript.constructor === goog.html.SafeScript && safeScript.SAFE_SCRIPT_TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_ === goog.html.SafeScript.TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_) {
    return safeScript.privateDoNotAccessOrElseSafeScriptWrappedValue_;
  }
  goog.asserts.fail("expected object of type SafeScript, got '" + safeScript + "' of type " + goog.typeOf(safeScript));
  return "type_error:SafeScript";
};
goog.html.SafeScript.createSafeScriptSecurityPrivateDoNotAccessOrElse = function(script) {
  return (new goog.html.SafeScript).initSecurityPrivateDoNotAccessOrElse_(script);
};
goog.html.SafeScript.prototype.initSecurityPrivateDoNotAccessOrElse_ = function(script) {
  this.privateDoNotAccessOrElseSafeScriptWrappedValue_ = script;
  return this;
};
goog.html.SafeScript.EMPTY = goog.html.SafeScript.createSafeScriptSecurityPrivateDoNotAccessOrElse("");
goog.html.SafeStyle = function() {
  this.privateDoNotAccessOrElseSafeStyleWrappedValue_ = "";
  this.SAFE_STYLE_TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_ = goog.html.SafeStyle.TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_;
};
goog.html.SafeStyle.prototype.implementsGoogStringTypedString = !0;
goog.html.SafeStyle.TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_ = {};
goog.html.SafeStyle.fromConstant = function(style) {
  var styleString = goog.string.Const.unwrap(style);
  if (0 === styleString.length) {
    return goog.html.SafeStyle.EMPTY;
  }
  goog.html.SafeStyle.checkStyle_(styleString);
  goog.asserts.assert(goog.string.endsWith(styleString, ";"), "Last character of style string is not ';': " + styleString);
  goog.asserts.assert(goog.string.contains(styleString, ":"), "Style string must contain at least one ':', to specify a \"name: value\" pair: " + styleString);
  return goog.html.SafeStyle.createSafeStyleSecurityPrivateDoNotAccessOrElse(styleString);
};
goog.html.SafeStyle.checkStyle_ = function(style) {
  goog.asserts.assert(!/[<>]/.test(style), "Forbidden characters in style string: " + style);
};
goog.html.SafeStyle.prototype.getTypedStringValue = function() {
  return this.privateDoNotAccessOrElseSafeStyleWrappedValue_;
};
goog.DEBUG && (goog.html.SafeStyle.prototype.toString = function() {
  return "SafeStyle{" + this.privateDoNotAccessOrElseSafeStyleWrappedValue_ + "}";
});
goog.html.SafeStyle.unwrap = function(safeStyle) {
  if (safeStyle instanceof goog.html.SafeStyle && safeStyle.constructor === goog.html.SafeStyle && safeStyle.SAFE_STYLE_TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_ === goog.html.SafeStyle.TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_) {
    return safeStyle.privateDoNotAccessOrElseSafeStyleWrappedValue_;
  }
  goog.asserts.fail("expected object of type SafeStyle, got '" + safeStyle + "' of type " + goog.typeOf(safeStyle));
  return "type_error:SafeStyle";
};
goog.html.SafeStyle.createSafeStyleSecurityPrivateDoNotAccessOrElse = function(style) {
  return (new goog.html.SafeStyle).initSecurityPrivateDoNotAccessOrElse_(style);
};
goog.html.SafeStyle.prototype.initSecurityPrivateDoNotAccessOrElse_ = function(style) {
  this.privateDoNotAccessOrElseSafeStyleWrappedValue_ = style;
  return this;
};
goog.html.SafeStyle.EMPTY = goog.html.SafeStyle.createSafeStyleSecurityPrivateDoNotAccessOrElse("");
goog.html.SafeStyle.INNOCUOUS_STRING = "zClosurez";
goog.html.SafeStyle.create = function(map) {
  var style = "", name;
  for (name in map) {
    if (!/^[-_a-zA-Z0-9]+$/.test(name)) {
      throw Error("Name allows only [-_a-zA-Z0-9], got: " + name);
    }
    var value = map[name];
    null != value && (value instanceof goog.string.Const ? (value = goog.string.Const.unwrap(value), goog.asserts.assert(!/[{;}]/.test(value), "Value does not allow [{;}].")) : goog.html.SafeStyle.VALUE_RE_.test(value) ? goog.html.SafeStyle.hasBalancedQuotes_(value) || (goog.asserts.fail("String value requires balanced quotes, got: " + value), value = goog.html.SafeStyle.INNOCUOUS_STRING) : (goog.asserts.fail("String value allows only [-,.\"'%_!# a-zA-Z0-9], rgb() and rgba(), got: " + value), value = 
    goog.html.SafeStyle.INNOCUOUS_STRING), style += name + ":" + value + ";");
  }
  if (!style) {
    return goog.html.SafeStyle.EMPTY;
  }
  goog.html.SafeStyle.checkStyle_(style);
  return goog.html.SafeStyle.createSafeStyleSecurityPrivateDoNotAccessOrElse(style);
};
goog.html.SafeStyle.hasBalancedQuotes_ = function(value) {
  for (var outsideSingle = !0, outsideDouble = !0, i = 0;i < value.length;i++) {
    var c = value.charAt(i);
    "'" == c && outsideDouble ? outsideSingle = !outsideSingle : '"' == c && outsideSingle && (outsideDouble = !outsideDouble);
  }
  return outsideSingle && outsideDouble;
};
goog.html.SafeStyle.VALUE_RE_ = /^([-,."'%_!# a-zA-Z0-9]+|(?:rgb|hsl)a?\([0-9.%, ]+\))$/;
goog.html.SafeStyle.concat = function(var_args) {
  var style = "", addArgument = function(argument) {
    goog.isArray(argument) ? goog.array.forEach(argument, addArgument) : style += goog.html.SafeStyle.unwrap(argument);
  };
  goog.array.forEach(arguments, addArgument);
  return style ? goog.html.SafeStyle.createSafeStyleSecurityPrivateDoNotAccessOrElse(style) : goog.html.SafeStyle.EMPTY;
};
goog.html.SafeStyleSheet = function() {
  this.privateDoNotAccessOrElseSafeStyleSheetWrappedValue_ = "";
  this.SAFE_STYLE_SHEET_TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_ = goog.html.SafeStyleSheet.TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_;
};
goog.html.SafeStyleSheet.prototype.implementsGoogStringTypedString = !0;
goog.html.SafeStyleSheet.TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_ = {};
goog.html.SafeStyleSheet.concat = function(var_args) {
  var result = "", addArgument = function(argument) {
    goog.isArray(argument) ? goog.array.forEach(argument, addArgument) : result += goog.html.SafeStyleSheet.unwrap(argument);
  };
  goog.array.forEach(arguments, addArgument);
  return goog.html.SafeStyleSheet.createSafeStyleSheetSecurityPrivateDoNotAccessOrElse(result);
};
goog.html.SafeStyleSheet.fromConstant = function(styleSheet) {
  var styleSheetString = goog.string.Const.unwrap(styleSheet);
  if (0 === styleSheetString.length) {
    return goog.html.SafeStyleSheet.EMPTY;
  }
  goog.asserts.assert(!goog.string.contains(styleSheetString, "<"), "Forbidden '<' character in style sheet string: " + styleSheetString);
  return goog.html.SafeStyleSheet.createSafeStyleSheetSecurityPrivateDoNotAccessOrElse(styleSheetString);
};
goog.html.SafeStyleSheet.prototype.getTypedStringValue = function() {
  return this.privateDoNotAccessOrElseSafeStyleSheetWrappedValue_;
};
goog.DEBUG && (goog.html.SafeStyleSheet.prototype.toString = function() {
  return "SafeStyleSheet{" + this.privateDoNotAccessOrElseSafeStyleSheetWrappedValue_ + "}";
});
goog.html.SafeStyleSheet.unwrap = function(safeStyleSheet) {
  if (safeStyleSheet instanceof goog.html.SafeStyleSheet && safeStyleSheet.constructor === goog.html.SafeStyleSheet && safeStyleSheet.SAFE_STYLE_SHEET_TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_ === goog.html.SafeStyleSheet.TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_) {
    return safeStyleSheet.privateDoNotAccessOrElseSafeStyleSheetWrappedValue_;
  }
  goog.asserts.fail("expected object of type SafeStyleSheet, got '" + safeStyleSheet + "' of type " + goog.typeOf(safeStyleSheet));
  return "type_error:SafeStyleSheet";
};
goog.html.SafeStyleSheet.createSafeStyleSheetSecurityPrivateDoNotAccessOrElse = function(styleSheet) {
  return (new goog.html.SafeStyleSheet).initSecurityPrivateDoNotAccessOrElse_(styleSheet);
};
goog.html.SafeStyleSheet.prototype.initSecurityPrivateDoNotAccessOrElse_ = function(styleSheet) {
  this.privateDoNotAccessOrElseSafeStyleSheetWrappedValue_ = styleSheet;
  return this;
};
goog.html.SafeStyleSheet.EMPTY = goog.html.SafeStyleSheet.createSafeStyleSheetSecurityPrivateDoNotAccessOrElse("");
goog.fs = {};
goog.fs.url = {};
goog.fs.url.createObjectUrl = function(blob) {
  return goog.fs.url.getUrlObject_().createObjectURL(blob);
};
goog.fs.url.revokeObjectUrl = function(url) {
  goog.fs.url.getUrlObject_().revokeObjectURL(url);
};
goog.fs.url.getUrlObject_ = function() {
  var urlObject = goog.fs.url.findUrlObject_();
  if (null != urlObject) {
    return urlObject;
  }
  throw Error("This browser doesn't seem to support blob URLs");
};
goog.fs.url.findUrlObject_ = function() {
  return goog.isDef(goog.global.URL) && goog.isDef(goog.global.URL.createObjectURL) ? goog.global.URL : goog.isDef(goog.global.webkitURL) && goog.isDef(goog.global.webkitURL.createObjectURL) ? goog.global.webkitURL : goog.isDef(goog.global.createObjectURL) ? goog.global : null;
};
goog.fs.url.browserSupportsObjectUrls = function() {
  return null != goog.fs.url.findUrlObject_();
};
goog.html.SafeUrl = function() {
  this.privateDoNotAccessOrElseSafeHtmlWrappedValue_ = "";
  this.SAFE_URL_TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_ = goog.html.SafeUrl.TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_;
};
goog.html.SafeUrl.INNOCUOUS_STRING = "about:invalid#zClosurez";
goog.html.SafeUrl.prototype.implementsGoogStringTypedString = !0;
goog.html.SafeUrl.prototype.getTypedStringValue = function() {
  return this.privateDoNotAccessOrElseSafeHtmlWrappedValue_;
};
goog.html.SafeUrl.prototype.implementsGoogI18nBidiDirectionalString = !0;
goog.html.SafeUrl.prototype.getDirection = function() {
  return goog.i18n.bidi.Dir.LTR;
};
goog.DEBUG && (goog.html.SafeUrl.prototype.toString = function() {
  return "SafeUrl{" + this.privateDoNotAccessOrElseSafeHtmlWrappedValue_ + "}";
});
goog.html.SafeUrl.unwrap = function(safeUrl) {
  if (safeUrl instanceof goog.html.SafeUrl && safeUrl.constructor === goog.html.SafeUrl && safeUrl.SAFE_URL_TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_ === goog.html.SafeUrl.TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_) {
    return safeUrl.privateDoNotAccessOrElseSafeHtmlWrappedValue_;
  }
  goog.asserts.fail("expected object of type SafeUrl, got '" + safeUrl + "' of type " + goog.typeOf(safeUrl));
  return "type_error:SafeUrl";
};
goog.html.SafeUrl.fromConstant = function(url) {
  return goog.html.SafeUrl.createSafeUrlSecurityPrivateDoNotAccessOrElse(goog.string.Const.unwrap(url));
};
goog.html.SAFE_MIME_TYPE_PATTERN_ = /^(?:image\/(?:bmp|gif|jpeg|jpg|png|tiff|webp)|video\/(?:mpeg|mp4|ogg|webm))$/i;
goog.html.SafeUrl.fromBlob = function(blob) {
  var url = goog.html.SAFE_MIME_TYPE_PATTERN_.test(blob.type) ? goog.fs.url.createObjectUrl(blob) : goog.html.SafeUrl.INNOCUOUS_STRING;
  return goog.html.SafeUrl.createSafeUrlSecurityPrivateDoNotAccessOrElse(url);
};
goog.html.DATA_URL_PATTERN_ = /^data:([^;,]*);base64,[a-z0-9+\/]+=*$/i;
goog.html.SafeUrl.fromDataUrl = function(dataUrl) {
  var match = dataUrl.match(goog.html.DATA_URL_PATTERN_), valid = match && goog.html.SAFE_MIME_TYPE_PATTERN_.test(match[1]);
  return goog.html.SafeUrl.createSafeUrlSecurityPrivateDoNotAccessOrElse(valid ? dataUrl : goog.html.SafeUrl.INNOCUOUS_STRING);
};
goog.html.SafeUrl.fromTelUrl = function(telUrl) {
  goog.string.caseInsensitiveStartsWith(telUrl, "tel:") || (telUrl = goog.html.SafeUrl.INNOCUOUS_STRING);
  return goog.html.SafeUrl.createSafeUrlSecurityPrivateDoNotAccessOrElse(telUrl);
};
goog.html.SAFE_URL_PATTERN_ = /^(?:(?:https?|mailto|ftp):|[^&:/?#]*(?:[/?#]|$))/i;
goog.html.SafeUrl.sanitize = function(url) {
  if (url instanceof goog.html.SafeUrl) {
    return url;
  }
  url = url.implementsGoogStringTypedString ? url.getTypedStringValue() : String(url);
  goog.html.SAFE_URL_PATTERN_.test(url) || (url = goog.html.SafeUrl.INNOCUOUS_STRING);
  return goog.html.SafeUrl.createSafeUrlSecurityPrivateDoNotAccessOrElse(url);
};
goog.html.SafeUrl.TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_ = {};
goog.html.SafeUrl.createSafeUrlSecurityPrivateDoNotAccessOrElse = function(url) {
  var safeUrl = new goog.html.SafeUrl;
  safeUrl.privateDoNotAccessOrElseSafeHtmlWrappedValue_ = url;
  return safeUrl;
};
goog.html.SafeUrl.ABOUT_BLANK = goog.html.SafeUrl.createSafeUrlSecurityPrivateDoNotAccessOrElse("about:blank");
goog.html.TrustedResourceUrl = function() {
  this.privateDoNotAccessOrElseTrustedResourceUrlWrappedValue_ = "";
  this.TRUSTED_RESOURCE_URL_TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_ = goog.html.TrustedResourceUrl.TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_;
};
goog.html.TrustedResourceUrl.prototype.implementsGoogStringTypedString = !0;
goog.html.TrustedResourceUrl.prototype.getTypedStringValue = function() {
  return this.privateDoNotAccessOrElseTrustedResourceUrlWrappedValue_;
};
goog.html.TrustedResourceUrl.prototype.implementsGoogI18nBidiDirectionalString = !0;
goog.html.TrustedResourceUrl.prototype.getDirection = function() {
  return goog.i18n.bidi.Dir.LTR;
};
goog.DEBUG && (goog.html.TrustedResourceUrl.prototype.toString = function() {
  return "TrustedResourceUrl{" + this.privateDoNotAccessOrElseTrustedResourceUrlWrappedValue_ + "}";
});
goog.html.TrustedResourceUrl.unwrap = function(trustedResourceUrl) {
  if (trustedResourceUrl instanceof goog.html.TrustedResourceUrl && trustedResourceUrl.constructor === goog.html.TrustedResourceUrl && trustedResourceUrl.TRUSTED_RESOURCE_URL_TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_ === goog.html.TrustedResourceUrl.TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_) {
    return trustedResourceUrl.privateDoNotAccessOrElseTrustedResourceUrlWrappedValue_;
  }
  goog.asserts.fail("expected object of type TrustedResourceUrl, got '" + trustedResourceUrl + "' of type " + goog.typeOf(trustedResourceUrl));
  return "type_error:TrustedResourceUrl";
};
goog.html.TrustedResourceUrl.format = function(format, args) {
  var formatStr = goog.string.Const.unwrap(format);
  if (!goog.html.TrustedResourceUrl.BASE_URL_.test(formatStr)) {
    throw Error("Invalid TrustedResourceUrl format: " + formatStr);
  }
  var result = formatStr.replace(goog.html.TrustedResourceUrl.FORMAT_MARKER_, function(match, id) {
    if (!Object.prototype.hasOwnProperty.call(args, id)) {
      throw Error('Found marker, "' + id + '", in format string, "' + formatStr + '", but no valid label mapping found in args: ' + JSON.stringify(args));
    }
    var arg = args[id];
    return arg instanceof goog.string.Const ? goog.string.Const.unwrap(arg) : encodeURIComponent(String(arg));
  });
  return goog.html.TrustedResourceUrl.createTrustedResourceUrlSecurityPrivateDoNotAccessOrElse(result);
};
goog.html.TrustedResourceUrl.FORMAT_MARKER_ = /%{(\w+)}/g;
goog.html.TrustedResourceUrl.BASE_URL_ = /^(?:https:)?\/\/[0-9a-z.:[\]-]+\/|^\/[^\/\\]/i;
goog.html.TrustedResourceUrl.fromConstant = function(url) {
  return goog.html.TrustedResourceUrl.createTrustedResourceUrlSecurityPrivateDoNotAccessOrElse(goog.string.Const.unwrap(url));
};
goog.html.TrustedResourceUrl.fromConstants = function(parts) {
  for (var unwrapped = "", i = 0;i < parts.length;i++) {
    unwrapped += goog.string.Const.unwrap(parts[i]);
  }
  return goog.html.TrustedResourceUrl.createTrustedResourceUrlSecurityPrivateDoNotAccessOrElse(unwrapped);
};
goog.html.TrustedResourceUrl.TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_ = {};
goog.html.TrustedResourceUrl.createTrustedResourceUrlSecurityPrivateDoNotAccessOrElse = function(url) {
  var trustedResourceUrl = new goog.html.TrustedResourceUrl;
  trustedResourceUrl.privateDoNotAccessOrElseTrustedResourceUrlWrappedValue_ = url;
  return trustedResourceUrl;
};
goog.html.SafeHtml = function() {
  this.privateDoNotAccessOrElseSafeHtmlWrappedValue_ = "";
  this.SAFE_HTML_TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_ = goog.html.SafeHtml.TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_;
  this.dir_ = null;
};
goog.html.SafeHtml.prototype.implementsGoogI18nBidiDirectionalString = !0;
goog.html.SafeHtml.prototype.getDirection = function() {
  return this.dir_;
};
goog.html.SafeHtml.prototype.implementsGoogStringTypedString = !0;
goog.html.SafeHtml.prototype.getTypedStringValue = function() {
  return this.privateDoNotAccessOrElseSafeHtmlWrappedValue_;
};
goog.DEBUG && (goog.html.SafeHtml.prototype.toString = function() {
  return "SafeHtml{" + this.privateDoNotAccessOrElseSafeHtmlWrappedValue_ + "}";
});
goog.html.SafeHtml.unwrap = function(safeHtml) {
  if (safeHtml instanceof goog.html.SafeHtml && safeHtml.constructor === goog.html.SafeHtml && safeHtml.SAFE_HTML_TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_ === goog.html.SafeHtml.TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_) {
    return safeHtml.privateDoNotAccessOrElseSafeHtmlWrappedValue_;
  }
  goog.asserts.fail("expected object of type SafeHtml, got '" + safeHtml + "' of type " + goog.typeOf(safeHtml));
  return "type_error:SafeHtml";
};
goog.html.SafeHtml.htmlEscape = function(textOrHtml) {
  if (textOrHtml instanceof goog.html.SafeHtml) {
    return textOrHtml;
  }
  var dir = null;
  textOrHtml.implementsGoogI18nBidiDirectionalString && (dir = textOrHtml.getDirection());
  return goog.html.SafeHtml.createSafeHtmlSecurityPrivateDoNotAccessOrElse(goog.string.htmlEscape(textOrHtml.implementsGoogStringTypedString ? textOrHtml.getTypedStringValue() : String(textOrHtml)), dir);
};
goog.html.SafeHtml.htmlEscapePreservingNewlines = function(textOrHtml) {
  if (textOrHtml instanceof goog.html.SafeHtml) {
    return textOrHtml;
  }
  var html = goog.html.SafeHtml.htmlEscape(textOrHtml);
  return goog.html.SafeHtml.createSafeHtmlSecurityPrivateDoNotAccessOrElse(goog.string.newLineToBr(goog.html.SafeHtml.unwrap(html)), html.getDirection());
};
goog.html.SafeHtml.htmlEscapePreservingNewlinesAndSpaces = function(textOrHtml) {
  if (textOrHtml instanceof goog.html.SafeHtml) {
    return textOrHtml;
  }
  var html = goog.html.SafeHtml.htmlEscape(textOrHtml);
  return goog.html.SafeHtml.createSafeHtmlSecurityPrivateDoNotAccessOrElse(goog.string.whitespaceEscape(goog.html.SafeHtml.unwrap(html)), html.getDirection());
};
goog.html.SafeHtml.from = goog.html.SafeHtml.htmlEscape;
goog.html.SafeHtml.VALID_NAMES_IN_TAG_ = /^[a-zA-Z0-9-]+$/;
goog.html.SafeHtml.URL_ATTRIBUTES_ = {action:!0, cite:!0, data:!0, formaction:!0, href:!0, manifest:!0, poster:!0, src:!0};
goog.html.SafeHtml.NOT_ALLOWED_TAG_NAMES_ = {APPLET:!0, BASE:!0, EMBED:!0, IFRAME:!0, LINK:!0, MATH:!0, META:!0, OBJECT:!0, SCRIPT:!0, STYLE:!0, SVG:!0, TEMPLATE:!0};
goog.html.SafeHtml.create = function(tagName, opt_attributes, opt_content) {
  goog.html.SafeHtml.verifyTagName(String(tagName));
  return goog.html.SafeHtml.createSafeHtmlTagSecurityPrivateDoNotAccessOrElse(String(tagName), opt_attributes, opt_content);
};
goog.html.SafeHtml.verifyTagName = function(tagName) {
  if (!goog.html.SafeHtml.VALID_NAMES_IN_TAG_.test(tagName)) {
    throw Error("Invalid tag name <" + tagName + ">.");
  }
  if (tagName.toUpperCase() in goog.html.SafeHtml.NOT_ALLOWED_TAG_NAMES_) {
    throw Error("Tag name <" + tagName + "> is not allowed for SafeHtml.");
  }
};
goog.html.SafeHtml.createIframe = function(opt_src, opt_srcdoc, opt_attributes, opt_content) {
  opt_src && goog.html.TrustedResourceUrl.unwrap(opt_src);
  var fixedAttributes = {};
  fixedAttributes.src = opt_src || null;
  fixedAttributes.srcdoc = opt_srcdoc && goog.html.SafeHtml.unwrap(opt_srcdoc);
  var attributes = goog.html.SafeHtml.combineAttributes(fixedAttributes, {sandbox:""}, opt_attributes);
  return goog.html.SafeHtml.createSafeHtmlTagSecurityPrivateDoNotAccessOrElse("iframe", attributes, opt_content);
};
goog.html.SafeHtml.createSandboxIframe = function(opt_src, opt_srcdoc, opt_attributes, opt_content) {
  if (!goog.html.SafeHtml.canUseSandboxIframe()) {
    throw Error("The browser does not support sandboxed iframes.");
  }
  var fixedAttributes = {};
  fixedAttributes.src = opt_src ? goog.html.SafeUrl.unwrap(goog.html.SafeUrl.sanitize(opt_src)) : null;
  fixedAttributes.srcdoc = opt_srcdoc || null;
  fixedAttributes.sandbox = "";
  var attributes = goog.html.SafeHtml.combineAttributes(fixedAttributes, {}, opt_attributes);
  return goog.html.SafeHtml.createSafeHtmlTagSecurityPrivateDoNotAccessOrElse("iframe", attributes, opt_content);
};
goog.html.SafeHtml.canUseSandboxIframe = function() {
  return goog.global.HTMLIFrameElement && "sandbox" in goog.global.HTMLIFrameElement.prototype;
};
goog.html.SafeHtml.createScriptSrc = function(src, opt_attributes) {
  goog.html.TrustedResourceUrl.unwrap(src);
  var attributes = goog.html.SafeHtml.combineAttributes({src:src}, {}, opt_attributes);
  return goog.html.SafeHtml.createSafeHtmlTagSecurityPrivateDoNotAccessOrElse("script", attributes);
};
goog.html.SafeHtml.createScript = function(script, opt_attributes) {
  for (var attr in opt_attributes) {
    var attrLower = attr.toLowerCase();
    if ("language" == attrLower || "src" == attrLower || "text" == attrLower || "type" == attrLower) {
      throw Error('Cannot set "' + attrLower + '" attribute');
    }
  }
  var content = "";
  script = goog.array.concat(script);
  for (var i = 0;i < script.length;i++) {
    content += goog.html.SafeScript.unwrap(script[i]);
  }
  var htmlContent = goog.html.SafeHtml.createSafeHtmlSecurityPrivateDoNotAccessOrElse(content, goog.i18n.bidi.Dir.NEUTRAL);
  return goog.html.SafeHtml.createSafeHtmlTagSecurityPrivateDoNotAccessOrElse("script", opt_attributes, htmlContent);
};
goog.html.SafeHtml.createStyle = function(styleSheet, opt_attributes) {
  var attributes = goog.html.SafeHtml.combineAttributes({type:"text/css"}, {}, opt_attributes), content = "";
  styleSheet = goog.array.concat(styleSheet);
  for (var i = 0;i < styleSheet.length;i++) {
    content += goog.html.SafeStyleSheet.unwrap(styleSheet[i]);
  }
  var htmlContent = goog.html.SafeHtml.createSafeHtmlSecurityPrivateDoNotAccessOrElse(content, goog.i18n.bidi.Dir.NEUTRAL);
  return goog.html.SafeHtml.createSafeHtmlTagSecurityPrivateDoNotAccessOrElse("style", attributes, htmlContent);
};
goog.html.SafeHtml.createMetaRefresh = function(url, opt_secs) {
  var unwrappedUrl = goog.html.SafeUrl.unwrap(goog.html.SafeUrl.sanitize(url));
  (goog.labs.userAgent.browser.isIE() || goog.labs.userAgent.browser.isEdge()) && goog.string.contains(unwrappedUrl, ";") && (unwrappedUrl = "'" + unwrappedUrl.replace(/'/g, "%27") + "'");
  return goog.html.SafeHtml.createSafeHtmlTagSecurityPrivateDoNotAccessOrElse("meta", {"http-equiv":"refresh", content:(opt_secs || 0) + "; url=" + unwrappedUrl});
};
goog.html.SafeHtml.getAttrNameAndValue_ = function(tagName, name, value) {
  if (value instanceof goog.string.Const) {
    value = goog.string.Const.unwrap(value);
  } else {
    if ("style" == name.toLowerCase()) {
      value = goog.html.SafeHtml.getStyleValue_(value);
    } else {
      if (/^on/i.test(name)) {
        throw Error('Attribute "' + name + '" requires goog.string.Const value, "' + value + '" given.');
      }
      if (name.toLowerCase() in goog.html.SafeHtml.URL_ATTRIBUTES_) {
        if (value instanceof goog.html.TrustedResourceUrl) {
          value = goog.html.TrustedResourceUrl.unwrap(value);
        } else {
          if (value instanceof goog.html.SafeUrl) {
            value = goog.html.SafeUrl.unwrap(value);
          } else {
            if (goog.isString(value)) {
              value = goog.html.SafeUrl.sanitize(value).getTypedStringValue();
            } else {
              throw Error('Attribute "' + name + '" on tag "' + tagName + '" requires goog.html.SafeUrl, goog.string.Const, or string, value "' + value + '" given.');
            }
          }
        }
      }
    }
  }
  value.implementsGoogStringTypedString && (value = value.getTypedStringValue());
  goog.asserts.assert(goog.isString(value) || goog.isNumber(value), "String or number value expected, got " + typeof value + " with value: " + value);
  return name + '="' + goog.string.htmlEscape(String(value)) + '"';
};
goog.html.SafeHtml.getStyleValue_ = function(value) {
  if (!goog.isObject(value)) {
    throw Error('The "style" attribute requires goog.html.SafeStyle or map of style properties, ' + typeof value + " given: " + value);
  }
  value instanceof goog.html.SafeStyle || (value = goog.html.SafeStyle.create(value));
  return goog.html.SafeStyle.unwrap(value);
};
goog.html.SafeHtml.createWithDir = function(dir, tagName, opt_attributes, opt_content) {
  var html = goog.html.SafeHtml.create(tagName, opt_attributes, opt_content);
  html.dir_ = dir;
  return html;
};
goog.html.SafeHtml.concat = function(var_args) {
  var dir = goog.i18n.bidi.Dir.NEUTRAL, content = "", addArgument = function(argument) {
    if (goog.isArray(argument)) {
      goog.array.forEach(argument, addArgument);
    } else {
      var html = goog.html.SafeHtml.htmlEscape(argument);
      content += goog.html.SafeHtml.unwrap(html);
      var htmlDir = html.getDirection();
      dir == goog.i18n.bidi.Dir.NEUTRAL ? dir = htmlDir : htmlDir != goog.i18n.bidi.Dir.NEUTRAL && dir != htmlDir && (dir = null);
    }
  };
  goog.array.forEach(arguments, addArgument);
  return goog.html.SafeHtml.createSafeHtmlSecurityPrivateDoNotAccessOrElse(content, dir);
};
goog.html.SafeHtml.concatWithDir = function(dir, var_args) {
  var html = goog.html.SafeHtml.concat(goog.array.slice(arguments, 1));
  html.dir_ = dir;
  return html;
};
goog.html.SafeHtml.TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_ = {};
goog.html.SafeHtml.createSafeHtmlSecurityPrivateDoNotAccessOrElse = function(html, dir) {
  return (new goog.html.SafeHtml).initSecurityPrivateDoNotAccessOrElse_(html, dir);
};
goog.html.SafeHtml.prototype.initSecurityPrivateDoNotAccessOrElse_ = function(html, dir) {
  this.privateDoNotAccessOrElseSafeHtmlWrappedValue_ = html;
  this.dir_ = dir;
  return this;
};
goog.html.SafeHtml.createSafeHtmlTagSecurityPrivateDoNotAccessOrElse = function(tagName, opt_attributes, opt_content) {
  var dir = null, result;
  result = "<" + tagName + goog.html.SafeHtml.stringifyAttributes(tagName, opt_attributes);
  var content = opt_content;
  goog.isDefAndNotNull(content) ? goog.isArray(content) || (content = [content]) : content = [];
  if (goog.dom.tags.isVoidTag(tagName.toLowerCase())) {
    goog.asserts.assert(!content.length, "Void tag <" + tagName + "> does not allow content."), result += ">";
  } else {
    var html = goog.html.SafeHtml.concat(content);
    result += ">" + goog.html.SafeHtml.unwrap(html) + "</" + tagName + ">";
    dir = html.getDirection();
  }
  var dirAttribute = opt_attributes && opt_attributes.dir;
  dirAttribute && (dir = /^(ltr|rtl|auto)$/i.test(dirAttribute) ? goog.i18n.bidi.Dir.NEUTRAL : null);
  return goog.html.SafeHtml.createSafeHtmlSecurityPrivateDoNotAccessOrElse(result, dir);
};
goog.html.SafeHtml.stringifyAttributes = function(tagName, opt_attributes) {
  var result = "";
  if (opt_attributes) {
    for (var name in opt_attributes) {
      if (!goog.html.SafeHtml.VALID_NAMES_IN_TAG_.test(name)) {
        throw Error('Invalid attribute name "' + name + '".');
      }
      var value = opt_attributes[name];
      goog.isDefAndNotNull(value) && (result += " " + goog.html.SafeHtml.getAttrNameAndValue_(tagName, name, value));
    }
  }
  return result;
};
goog.html.SafeHtml.combineAttributes = function(fixedAttributes, defaultAttributes, opt_attributes) {
  var combinedAttributes = {}, name;
  for (name in fixedAttributes) {
    goog.asserts.assert(name.toLowerCase() == name, "Must be lower case"), combinedAttributes[name] = fixedAttributes[name];
  }
  for (name in defaultAttributes) {
    goog.asserts.assert(name.toLowerCase() == name, "Must be lower case"), combinedAttributes[name] = defaultAttributes[name];
  }
  for (name in opt_attributes) {
    var nameLower = name.toLowerCase();
    if (nameLower in fixedAttributes) {
      throw Error('Cannot override "' + nameLower + '" attribute, got "' + name + '" with value "' + opt_attributes[name] + '"');
    }
    nameLower in defaultAttributes && delete combinedAttributes[nameLower];
    combinedAttributes[name] = opt_attributes[name];
  }
  return combinedAttributes;
};
goog.html.SafeHtml.DOCTYPE_HTML = goog.html.SafeHtml.createSafeHtmlSecurityPrivateDoNotAccessOrElse("<!DOCTYPE html>", goog.i18n.bidi.Dir.NEUTRAL);
goog.html.SafeHtml.EMPTY = goog.html.SafeHtml.createSafeHtmlSecurityPrivateDoNotAccessOrElse("", goog.i18n.bidi.Dir.NEUTRAL);
goog.html.SafeHtml.BR = goog.html.SafeHtml.createSafeHtmlSecurityPrivateDoNotAccessOrElse("<br>", goog.i18n.bidi.Dir.NEUTRAL);
goog.html.uncheckedconversions = {};
goog.html.uncheckedconversions.safeHtmlFromStringKnownToSatisfyTypeContract = function(justification, html, opt_dir) {
  goog.asserts.assertString(goog.string.Const.unwrap(justification), "must provide justification");
  goog.asserts.assert(!goog.string.isEmptyOrWhitespace(goog.string.Const.unwrap(justification)), "must provide non-empty justification");
  return goog.html.SafeHtml.createSafeHtmlSecurityPrivateDoNotAccessOrElse(html, opt_dir || null);
};
goog.html.uncheckedconversions.safeScriptFromStringKnownToSatisfyTypeContract = function(justification, script) {
  goog.asserts.assertString(goog.string.Const.unwrap(justification), "must provide justification");
  goog.asserts.assert(!goog.string.isEmpty(goog.string.Const.unwrap(justification)), "must provide non-empty justification");
  return goog.html.SafeScript.createSafeScriptSecurityPrivateDoNotAccessOrElse(script);
};
goog.html.uncheckedconversions.safeStyleFromStringKnownToSatisfyTypeContract = function(justification, style) {
  goog.asserts.assertString(goog.string.Const.unwrap(justification), "must provide justification");
  goog.asserts.assert(!goog.string.isEmptyOrWhitespace(goog.string.Const.unwrap(justification)), "must provide non-empty justification");
  return goog.html.SafeStyle.createSafeStyleSecurityPrivateDoNotAccessOrElse(style);
};
goog.html.uncheckedconversions.safeStyleSheetFromStringKnownToSatisfyTypeContract = function(justification, styleSheet) {
  goog.asserts.assertString(goog.string.Const.unwrap(justification), "must provide justification");
  goog.asserts.assert(!goog.string.isEmptyOrWhitespace(goog.string.Const.unwrap(justification)), "must provide non-empty justification");
  return goog.html.SafeStyleSheet.createSafeStyleSheetSecurityPrivateDoNotAccessOrElse(styleSheet);
};
goog.html.uncheckedconversions.safeUrlFromStringKnownToSatisfyTypeContract = function(justification, url) {
  goog.asserts.assertString(goog.string.Const.unwrap(justification), "must provide justification");
  goog.asserts.assert(!goog.string.isEmptyOrWhitespace(goog.string.Const.unwrap(justification)), "must provide non-empty justification");
  return goog.html.SafeUrl.createSafeUrlSecurityPrivateDoNotAccessOrElse(url);
};
goog.html.uncheckedconversions.trustedResourceUrlFromStringKnownToSatisfyTypeContract = function(justification, url) {
  goog.asserts.assertString(goog.string.Const.unwrap(justification), "must provide justification");
  goog.asserts.assert(!goog.string.isEmptyOrWhitespace(goog.string.Const.unwrap(justification)), "must provide non-empty justification");
  return goog.html.TrustedResourceUrl.createTrustedResourceUrlSecurityPrivateDoNotAccessOrElse(url);
};
goog.math = {};
goog.math.randomInt = function(a) {
  return Math.floor(Math.random() * a);
};
goog.math.uniformRandom = function(a, b) {
  return a + Math.random() * (b - a);
};
goog.math.clamp = function(value, min, max) {
  return Math.min(Math.max(value, min), max);
};
goog.math.modulo = function(a, b) {
  var r = a % b;
  return 0 > r * b ? r + b : r;
};
goog.math.lerp = function(a, b, x) {
  return a + x * (b - a);
};
goog.math.nearlyEquals = function(a, b, opt_tolerance) {
  return Math.abs(a - b) <= (opt_tolerance || 0.000001);
};
goog.math.standardAngle = function(angle) {
  return goog.math.modulo(angle, 360);
};
goog.math.standardAngleInRadians = function(angle) {
  return goog.math.modulo(angle, 2 * Math.PI);
};
goog.math.toRadians = function(angleDegrees) {
  return angleDegrees * Math.PI / 180;
};
goog.math.toDegrees = function(angleRadians) {
  return 180 * angleRadians / Math.PI;
};
goog.math.angleDx = function(degrees, radius) {
  return radius * Math.cos(goog.math.toRadians(degrees));
};
goog.math.angleDy = function(degrees, radius) {
  return radius * Math.sin(goog.math.toRadians(degrees));
};
goog.math.angle = function(x1, y1, x2, y2) {
  return goog.math.standardAngle(goog.math.toDegrees(Math.atan2(y2 - y1, x2 - x1)));
};
goog.math.angleDifference = function(startAngle, endAngle) {
  var d = goog.math.standardAngle(endAngle) - goog.math.standardAngle(startAngle);
  180 < d ? d -= 360 : -180 >= d && (d = 360 + d);
  return d;
};
goog.math.sign = function(x) {
  return 0 < x ? 1 : 0 > x ? -1 : x;
};
goog.math.longestCommonSubsequence = function(array1, array2, opt_compareFn, opt_collectorFn) {
  for (var compare = opt_compareFn || function(a, b) {
    return a == b;
  }, collect = opt_collectorFn || function(i1, i2) {
    return array1[i1];
  }, length1 = array1.length, length2 = array2.length, arr = [], i = 0;i < length1 + 1;i++) {
    arr[i] = [], arr[i][0] = 0;
  }
  for (var j = 0;j < length2 + 1;j++) {
    arr[0][j] = 0;
  }
  for (i = 1;i <= length1;i++) {
    for (j = 1;j <= length2;j++) {
      compare(array1[i - 1], array2[j - 1]) ? arr[i][j] = arr[i - 1][j - 1] + 1 : arr[i][j] = Math.max(arr[i - 1][j], arr[i][j - 1]);
    }
  }
  for (var result = [], i = length1, j = length2;0 < i && 0 < j;) {
    compare(array1[i - 1], array2[j - 1]) ? (result.unshift(collect(i - 1, j - 1)), i--, j--) : arr[i - 1][j] > arr[i][j - 1] ? i-- : j--;
  }
  return result;
};
goog.math.sum = function(var_args) {
  return goog.array.reduce(arguments, function(sum, value) {
    return sum + value;
  }, 0);
};
goog.math.average = function(var_args) {
  return goog.math.sum.apply(null, arguments) / arguments.length;
};
goog.math.sampleVariance = function(var_args) {
  var sampleSize = arguments.length;
  if (2 > sampleSize) {
    return 0;
  }
  var mean = goog.math.average.apply(null, arguments);
  return goog.math.sum.apply(null, goog.array.map(arguments, function(val) {
    return Math.pow(val - mean, 2);
  })) / (sampleSize - 1);
};
goog.math.standardDeviation = function(var_args) {
  return Math.sqrt(goog.math.sampleVariance.apply(null, arguments));
};
goog.math.isInt = function(num) {
  return isFinite(num) && 0 == num % 1;
};
goog.math.isFiniteNumber = function(num) {
  return isFinite(num) && !isNaN(num);
};
goog.math.isNegativeZero = function(num) {
  return 0 == num && 0 > 1 / num;
};
goog.math.log10Floor = function(num) {
  if (0 < num) {
    var x = Math.round(Math.log(num) * Math.LOG10E);
    return x - (parseFloat("1e" + x) > num ? 1 : 0);
  }
  return 0 == num ? -Infinity : NaN;
};
goog.math.safeFloor = function(num, opt_epsilon) {
  goog.asserts.assert(!goog.isDef(opt_epsilon) || 0 < opt_epsilon);
  return Math.floor(num + (opt_epsilon || 2e-15));
};
goog.math.safeCeil = function(num, opt_epsilon) {
  goog.asserts.assert(!goog.isDef(opt_epsilon) || 0 < opt_epsilon);
  return Math.ceil(num - (opt_epsilon || 2e-15));
};
goog.math.Coordinate = function(opt_x, opt_y) {
  this.x = goog.isDef(opt_x) ? opt_x : 0;
  this.y = goog.isDef(opt_y) ? opt_y : 0;
};
goog.math.Coordinate.prototype.clone = function() {
  return new goog.math.Coordinate(this.x, this.y);
};
goog.DEBUG && (goog.math.Coordinate.prototype.toString = function() {
  return "(" + this.x + ", " + this.y + ")";
});
goog.math.Coordinate.prototype.equals = function(other) {
  return other instanceof goog.math.Coordinate && goog.math.Coordinate.equals(this, other);
};
goog.math.Coordinate.equals = function(a, b) {
  return a == b ? !0 : a && b ? a.x == b.x && a.y == b.y : !1;
};
goog.math.Coordinate.distance = function(a, b) {
  var dx = a.x - b.x, dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
};
goog.math.Coordinate.magnitude = function(a) {
  return Math.sqrt(a.x * a.x + a.y * a.y);
};
goog.math.Coordinate.azimuth = function(a) {
  return goog.math.angle(0, 0, a.x, a.y);
};
goog.math.Coordinate.squaredDistance = function(a, b) {
  var dx = a.x - b.x, dy = a.y - b.y;
  return dx * dx + dy * dy;
};
goog.math.Coordinate.difference = function(a, b) {
  return new goog.math.Coordinate(a.x - b.x, a.y - b.y);
};
goog.math.Coordinate.sum = function(a, b) {
  return new goog.math.Coordinate(a.x + b.x, a.y + b.y);
};
goog.math.Coordinate.prototype.ceil = function() {
  this.x = Math.ceil(this.x);
  this.y = Math.ceil(this.y);
  return this;
};
goog.math.Coordinate.prototype.floor = function() {
  this.x = Math.floor(this.x);
  this.y = Math.floor(this.y);
  return this;
};
goog.math.Coordinate.prototype.round = function() {
  this.x = Math.round(this.x);
  this.y = Math.round(this.y);
  return this;
};
goog.math.Coordinate.prototype.translate = function(tx, opt_ty) {
  tx instanceof goog.math.Coordinate ? (this.x += tx.x, this.y += tx.y) : (this.x += Number(tx), goog.isNumber(opt_ty) && (this.y += opt_ty));
  return this;
};
goog.math.Coordinate.prototype.scale = function(sx, opt_sy) {
  var sy = goog.isNumber(opt_sy) ? opt_sy : sx;
  this.x *= sx;
  this.y *= sy;
  return this;
};
goog.math.Size = function(width, height) {
  this.width = width;
  this.height = height;
};
goog.math.Size.equals = function(a, b) {
  return a == b ? !0 : a && b ? a.width == b.width && a.height == b.height : !1;
};
goog.math.Size.prototype.clone = function() {
  return new goog.math.Size(this.width, this.height);
};
goog.DEBUG && (goog.math.Size.prototype.toString = function() {
  return "(" + this.width + " x " + this.height + ")";
});
goog.math.Size.prototype.area = function() {
  return this.width * this.height;
};
goog.math.Size.prototype.isEmpty = function() {
  return !this.area();
};
goog.math.Size.prototype.ceil = function() {
  this.width = Math.ceil(this.width);
  this.height = Math.ceil(this.height);
  return this;
};
goog.math.Size.prototype.floor = function() {
  this.width = Math.floor(this.width);
  this.height = Math.floor(this.height);
  return this;
};
goog.math.Size.prototype.round = function() {
  this.width = Math.round(this.width);
  this.height = Math.round(this.height);
  return this;
};
goog.math.Size.prototype.scale = function(sx, opt_sy) {
  var sy = goog.isNumber(opt_sy) ? opt_sy : sx;
  this.width *= sx;
  this.height *= sy;
  return this;
};
goog.labs.userAgent.engine = {};
goog.labs.userAgent.engine.isPresto = function() {
  return goog.labs.userAgent.util.matchUserAgent("Presto");
};
goog.labs.userAgent.engine.isTrident = function() {
  return goog.labs.userAgent.util.matchUserAgent("Trident") || goog.labs.userAgent.util.matchUserAgent("MSIE");
};
goog.labs.userAgent.engine.isEdge = function() {
  return goog.labs.userAgent.util.matchUserAgent("Edge");
};
goog.labs.userAgent.engine.isWebKit = function() {
  return goog.labs.userAgent.util.matchUserAgentIgnoreCase("WebKit") && !goog.labs.userAgent.engine.isEdge();
};
goog.labs.userAgent.engine.isGecko = function() {
  return goog.labs.userAgent.util.matchUserAgent("Gecko") && !goog.labs.userAgent.engine.isWebKit() && !goog.labs.userAgent.engine.isTrident() && !goog.labs.userAgent.engine.isEdge();
};
goog.labs.userAgent.engine.getVersion = function() {
  var userAgentString = goog.labs.userAgent.util.getUserAgent();
  if (userAgentString) {
    var tuples = goog.labs.userAgent.util.extractVersionTuples(userAgentString), engineTuple = goog.labs.userAgent.engine.getEngineTuple_(tuples);
    if (engineTuple) {
      return "Gecko" == engineTuple[0] ? goog.labs.userAgent.engine.getVersionForKey_(tuples, "Firefox") : engineTuple[1];
    }
    var browserTuple = tuples[0], info;
    if (browserTuple && (info = browserTuple[2])) {
      var match = /Trident\/([^\s;]+)/.exec(info);
      if (match) {
        return match[1];
      }
    }
  }
  return "";
};
goog.labs.userAgent.engine.getEngineTuple_ = function(tuples) {
  if (!goog.labs.userAgent.engine.isEdge()) {
    return tuples[1];
  }
  for (var i = 0;i < tuples.length;i++) {
    var tuple = tuples[i];
    if ("Edge" == tuple[0]) {
      return tuple;
    }
  }
};
goog.labs.userAgent.engine.isVersionOrHigher = function(version) {
  return 0 <= goog.string.compareVersions(goog.labs.userAgent.engine.getVersion(), version);
};
goog.labs.userAgent.engine.getVersionForKey_ = function(tuples, key) {
  var pair = goog.array.find(tuples, function(pair) {
    return key == pair[0];
  });
  return pair && pair[1] || "";
};
goog.labs.userAgent.platform = {};
goog.labs.userAgent.platform.isAndroid = function() {
  return goog.labs.userAgent.util.matchUserAgent("Android");
};
goog.labs.userAgent.platform.isIpod = function() {
  return goog.labs.userAgent.util.matchUserAgent("iPod");
};
goog.labs.userAgent.platform.isIphone = function() {
  return goog.labs.userAgent.util.matchUserAgent("iPhone") && !goog.labs.userAgent.util.matchUserAgent("iPod") && !goog.labs.userAgent.util.matchUserAgent("iPad");
};
goog.labs.userAgent.platform.isIpad = function() {
  return goog.labs.userAgent.util.matchUserAgent("iPad");
};
goog.labs.userAgent.platform.isIos = function() {
  return goog.labs.userAgent.platform.isIphone() || goog.labs.userAgent.platform.isIpad() || goog.labs.userAgent.platform.isIpod();
};
goog.labs.userAgent.platform.isMacintosh = function() {
  return goog.labs.userAgent.util.matchUserAgent("Macintosh");
};
goog.labs.userAgent.platform.isLinux = function() {
  return goog.labs.userAgent.util.matchUserAgent("Linux");
};
goog.labs.userAgent.platform.isWindows = function() {
  return goog.labs.userAgent.util.matchUserAgent("Windows");
};
goog.labs.userAgent.platform.isChromeOS = function() {
  return goog.labs.userAgent.util.matchUserAgent("CrOS");
};
goog.labs.userAgent.platform.getVersion = function() {
  var userAgentString = goog.labs.userAgent.util.getUserAgent(), version = "", re;
  if (goog.labs.userAgent.platform.isWindows()) {
    re = /Windows (?:NT|Phone) ([0-9.]+)/;
    var match = re.exec(userAgentString), version = match ? match[1] : "0.0";
  } else {
    goog.labs.userAgent.platform.isIos() ? (re = /(?:iPhone|iPod|iPad|CPU)\s+OS\s+(\S+)/, version = (match = re.exec(userAgentString)) && match[1].replace(/_/g, ".")) : goog.labs.userAgent.platform.isMacintosh() ? (re = /Mac OS X ([0-9_.]+)/, version = (match = re.exec(userAgentString)) ? match[1].replace(/_/g, ".") : "10") : goog.labs.userAgent.platform.isAndroid() ? (re = /Android\s+([^\);]+)(\)|;)/, version = (match = re.exec(userAgentString)) && match[1]) : goog.labs.userAgent.platform.isChromeOS() && 
    (re = /(?:CrOS\s+(?:i686|x86_64)\s+([0-9.]+))/, version = (match = re.exec(userAgentString)) && match[1]);
  }
  return version || "";
};
goog.labs.userAgent.platform.isVersionOrHigher = function(version) {
  return 0 <= goog.string.compareVersions(goog.labs.userAgent.platform.getVersion(), version);
};
goog.reflect = {};
goog.reflect.object = function(type, object) {
  return object;
};
goog.reflect.objectProperty = function(prop, object) {
  return prop;
};
goog.reflect.sinkValue = function(x) {
  goog.reflect.sinkValue[" "](x);
  return x;
};
goog.reflect.sinkValue[" "] = goog.nullFunction;
goog.reflect.canAccessProperty = function(obj, prop) {
  try {
    return goog.reflect.sinkValue(obj[prop]), !0;
  } catch (e) {
  }
  return !1;
};
goog.reflect.cache = function(cacheObj, key, valueFn, opt_keyFn) {
  var storedKey = opt_keyFn ? opt_keyFn(key) : key;
  return Object.prototype.hasOwnProperty.call(cacheObj, storedKey) ? cacheObj[storedKey] : cacheObj[storedKey] = valueFn(key);
};
goog.userAgent = {};
goog.userAgent.ASSUME_IE = !1;
goog.userAgent.ASSUME_EDGE = !1;
goog.userAgent.ASSUME_GECKO = !1;
goog.userAgent.ASSUME_WEBKIT = !1;
goog.userAgent.ASSUME_MOBILE_WEBKIT = !1;
goog.userAgent.ASSUME_OPERA = !1;
goog.userAgent.ASSUME_ANY_VERSION = !1;
goog.userAgent.BROWSER_KNOWN_ = goog.userAgent.ASSUME_IE || goog.userAgent.ASSUME_EDGE || goog.userAgent.ASSUME_GECKO || goog.userAgent.ASSUME_MOBILE_WEBKIT || goog.userAgent.ASSUME_WEBKIT || goog.userAgent.ASSUME_OPERA;
goog.userAgent.getUserAgentString = function() {
  return goog.labs.userAgent.util.getUserAgent();
};
goog.userAgent.getNavigator = function() {
  return goog.global.navigator || null;
};
goog.userAgent.OPERA = goog.userAgent.BROWSER_KNOWN_ ? goog.userAgent.ASSUME_OPERA : goog.labs.userAgent.browser.isOpera();
goog.userAgent.IE = goog.userAgent.BROWSER_KNOWN_ ? goog.userAgent.ASSUME_IE : goog.labs.userAgent.browser.isIE();
goog.userAgent.EDGE = goog.userAgent.BROWSER_KNOWN_ ? goog.userAgent.ASSUME_EDGE : goog.labs.userAgent.engine.isEdge();
goog.userAgent.EDGE_OR_IE = goog.userAgent.EDGE || goog.userAgent.IE;
goog.userAgent.GECKO = goog.userAgent.BROWSER_KNOWN_ ? goog.userAgent.ASSUME_GECKO : goog.labs.userAgent.engine.isGecko();
goog.userAgent.WEBKIT = goog.userAgent.BROWSER_KNOWN_ ? goog.userAgent.ASSUME_WEBKIT || goog.userAgent.ASSUME_MOBILE_WEBKIT : goog.labs.userAgent.engine.isWebKit();
goog.userAgent.isMobile_ = function() {
  return goog.userAgent.WEBKIT && goog.labs.userAgent.util.matchUserAgent("Mobile");
};
goog.userAgent.MOBILE = goog.userAgent.ASSUME_MOBILE_WEBKIT || goog.userAgent.isMobile_();
goog.userAgent.SAFARI = goog.userAgent.WEBKIT;
goog.userAgent.determinePlatform_ = function() {
  var navigator = goog.userAgent.getNavigator();
  return navigator && navigator.platform || "";
};
goog.userAgent.PLATFORM = goog.userAgent.determinePlatform_();
goog.userAgent.ASSUME_MAC = !1;
goog.userAgent.ASSUME_WINDOWS = !1;
goog.userAgent.ASSUME_LINUX = !1;
goog.userAgent.ASSUME_X11 = !1;
goog.userAgent.ASSUME_ANDROID = !1;
goog.userAgent.ASSUME_IPHONE = !1;
goog.userAgent.ASSUME_IPAD = !1;
goog.userAgent.ASSUME_IPOD = !1;
goog.userAgent.PLATFORM_KNOWN_ = goog.userAgent.ASSUME_MAC || goog.userAgent.ASSUME_WINDOWS || goog.userAgent.ASSUME_LINUX || goog.userAgent.ASSUME_X11 || goog.userAgent.ASSUME_ANDROID || goog.userAgent.ASSUME_IPHONE || goog.userAgent.ASSUME_IPAD || goog.userAgent.ASSUME_IPOD;
goog.userAgent.MAC = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_MAC : goog.labs.userAgent.platform.isMacintosh();
goog.userAgent.WINDOWS = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_WINDOWS : goog.labs.userAgent.platform.isWindows();
goog.userAgent.isLegacyLinux_ = function() {
  return goog.labs.userAgent.platform.isLinux() || goog.labs.userAgent.platform.isChromeOS();
};
goog.userAgent.LINUX = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_LINUX : goog.userAgent.isLegacyLinux_();
goog.userAgent.isX11_ = function() {
  var navigator = goog.userAgent.getNavigator();
  return !!navigator && goog.string.contains(navigator.appVersion || "", "X11");
};
goog.userAgent.X11 = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_X11 : goog.userAgent.isX11_();
goog.userAgent.ANDROID = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_ANDROID : goog.labs.userAgent.platform.isAndroid();
goog.userAgent.IPHONE = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_IPHONE : goog.labs.userAgent.platform.isIphone();
goog.userAgent.IPAD = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_IPAD : goog.labs.userAgent.platform.isIpad();
goog.userAgent.IPOD = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_IPOD : goog.labs.userAgent.platform.isIpod();
goog.userAgent.IOS = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_IPHONE || goog.userAgent.ASSUME_IPAD || goog.userAgent.ASSUME_IPOD : goog.labs.userAgent.platform.isIos();
goog.userAgent.determineVersion_ = function() {
  var version = "", arr = goog.userAgent.getVersionRegexResult_();
  arr && (version = arr ? arr[1] : "");
  if (goog.userAgent.IE) {
    var docMode = goog.userAgent.getDocumentMode_();
    if (null != docMode && docMode > parseFloat(version)) {
      return String(docMode);
    }
  }
  return version;
};
goog.userAgent.getVersionRegexResult_ = function() {
  var userAgent = goog.userAgent.getUserAgentString();
  if (goog.userAgent.GECKO) {
    return /rv\:([^\);]+)(\)|;)/.exec(userAgent);
  }
  if (goog.userAgent.EDGE) {
    return /Edge\/([\d\.]+)/.exec(userAgent);
  }
  if (goog.userAgent.IE) {
    return /\b(?:MSIE|rv)[: ]([^\);]+)(\)|;)/.exec(userAgent);
  }
  if (goog.userAgent.WEBKIT) {
    return /WebKit\/(\S+)/.exec(userAgent);
  }
  if (goog.userAgent.OPERA) {
    return /(?:Version)[ \/]?(\S+)/.exec(userAgent);
  }
};
goog.userAgent.getDocumentMode_ = function() {
  var doc = goog.global.document;
  return doc ? doc.documentMode : void 0;
};
goog.userAgent.VERSION = goog.userAgent.determineVersion_();
goog.userAgent.compare = function(v1, v2) {
  return goog.string.compareVersions(v1, v2);
};
goog.userAgent.isVersionOrHigherCache_ = {};
goog.userAgent.isVersionOrHigher = function(version) {
  return goog.userAgent.ASSUME_ANY_VERSION || goog.reflect.cache(goog.userAgent.isVersionOrHigherCache_, version, function() {
    return 0 <= goog.string.compareVersions(goog.userAgent.VERSION, version);
  });
};
goog.userAgent.isVersion = goog.userAgent.isVersionOrHigher;
goog.userAgent.isDocumentModeOrHigher = function(documentMode) {
  return Number(goog.userAgent.DOCUMENT_MODE) >= documentMode;
};
goog.userAgent.isDocumentMode = goog.userAgent.isDocumentModeOrHigher;
goog.userAgent.DOCUMENT_MODE = function() {
  var doc = goog.global.document;
  if (doc && goog.userAgent.IE) {
    return goog.userAgent.getDocumentMode_() || ("CSS1Compat" == doc.compatMode ? parseInt(goog.userAgent.VERSION, 10) : 5);
  }
}();
goog.dom.BrowserFeature = {CAN_ADD_NAME_OR_TYPE_ATTRIBUTES:!goog.userAgent.IE || goog.userAgent.isDocumentModeOrHigher(9), CAN_USE_CHILDREN_ATTRIBUTE:!goog.userAgent.GECKO && !goog.userAgent.IE || goog.userAgent.IE && goog.userAgent.isDocumentModeOrHigher(9) || goog.userAgent.GECKO && goog.userAgent.isVersionOrHigher("1.9.1"), CAN_USE_INNER_TEXT:goog.userAgent.IE && !goog.userAgent.isVersionOrHigher("9"), CAN_USE_PARENT_ELEMENT_PROPERTY:goog.userAgent.IE || goog.userAgent.OPERA || goog.userAgent.WEBKIT, 
INNER_HTML_NEEDS_SCOPED_ELEMENT:goog.userAgent.IE, LEGACY_IE_RANGES:goog.userAgent.IE && !goog.userAgent.isDocumentModeOrHigher(9)};
goog.dom.safe = {};
goog.dom.safe.InsertAdjacentHtmlPosition = {AFTERBEGIN:"afterbegin", AFTEREND:"afterend", BEFOREBEGIN:"beforebegin", BEFOREEND:"beforeend"};
goog.dom.safe.insertAdjacentHtml = function(node, position, html) {
  node.insertAdjacentHTML(position, goog.html.SafeHtml.unwrap(html));
};
goog.dom.safe.SET_INNER_HTML_DISALLOWED_TAGS_ = {MATH:!0, SCRIPT:!0, STYLE:!0, SVG:!0, TEMPLATE:!0};
goog.dom.safe.setInnerHtml = function(elem, html) {
  if (goog.asserts.ENABLE_ASSERTS && goog.dom.safe.SET_INNER_HTML_DISALLOWED_TAGS_[elem.tagName.toUpperCase()]) {
    throw Error("goog.dom.safe.setInnerHtml cannot be used to set content of " + elem.tagName + ".");
  }
  elem.innerHTML = goog.html.SafeHtml.unwrap(html);
};
goog.dom.safe.setOuterHtml = function(elem, html) {
  elem.outerHTML = goog.html.SafeHtml.unwrap(html);
};
goog.dom.safe.setStyle = function(elem, style) {
  elem.style.cssText = goog.html.SafeStyle.unwrap(style);
};
goog.dom.safe.documentWrite = function(doc, html) {
  doc.write(goog.html.SafeHtml.unwrap(html));
};
goog.dom.safe.setAnchorHref = function(anchor, url) {
  goog.dom.safe.assertIsHTMLAnchorElement_(anchor);
  var safeUrl;
  safeUrl = url instanceof goog.html.SafeUrl ? url : goog.html.SafeUrl.sanitize(url);
  anchor.href = goog.html.SafeUrl.unwrap(safeUrl);
};
goog.dom.safe.setImageSrc = function(imageElement, url) {
  goog.dom.safe.assertIsHTMLImageElement_(imageElement);
  var safeUrl;
  safeUrl = url instanceof goog.html.SafeUrl ? url : goog.html.SafeUrl.sanitize(url);
  imageElement.src = goog.html.SafeUrl.unwrap(safeUrl);
};
goog.dom.safe.setEmbedSrc = function(embed, url) {
  goog.dom.safe.assertIsHTMLEmbedElement_(embed);
  embed.src = goog.html.TrustedResourceUrl.unwrap(url);
};
goog.dom.safe.setFrameSrc = function(frame, url) {
  goog.dom.safe.assertIsHTMLFrameElement_(frame);
  frame.src = goog.html.TrustedResourceUrl.unwrap(url);
};
goog.dom.safe.setIframeSrc = function(iframe, url) {
  goog.dom.safe.assertIsHTMLIFrameElement_(iframe);
  iframe.src = goog.html.TrustedResourceUrl.unwrap(url);
};
goog.dom.safe.setIframeSrcdoc = function(iframe, html) {
  goog.dom.safe.assertIsHTMLIFrameElement_(iframe);
  iframe.srcdoc = goog.html.SafeHtml.unwrap(html);
};
goog.dom.safe.setLinkHrefAndRel = function(link, url, rel) {
  goog.dom.safe.assertIsHTMLLinkElement_(link);
  link.rel = rel;
  goog.string.caseInsensitiveContains(rel, "stylesheet") ? (goog.asserts.assert(url instanceof goog.html.TrustedResourceUrl, 'URL must be TrustedResourceUrl because "rel" contains "stylesheet"'), link.href = goog.html.TrustedResourceUrl.unwrap(url)) : link.href = url instanceof goog.html.TrustedResourceUrl ? goog.html.TrustedResourceUrl.unwrap(url) : url instanceof goog.html.SafeUrl ? goog.html.SafeUrl.unwrap(url) : goog.html.SafeUrl.sanitize(url).getTypedStringValue();
};
goog.dom.safe.setObjectData = function(object, url) {
  goog.dom.safe.assertIsHTMLObjectElement_(object);
  object.data = goog.html.TrustedResourceUrl.unwrap(url);
};
goog.dom.safe.setScriptSrc = function(script, url) {
  goog.dom.safe.assertIsHTMLScriptElement_(script);
  script.src = goog.html.TrustedResourceUrl.unwrap(url);
};
goog.dom.safe.setLocationHref = function(loc, url) {
  goog.dom.safe.assertIsLocation_(loc);
  var safeUrl;
  safeUrl = url instanceof goog.html.SafeUrl ? url : goog.html.SafeUrl.sanitize(url);
  loc.href = goog.html.SafeUrl.unwrap(safeUrl);
};
goog.dom.safe.openInWindow = function(url, opt_openerWin, opt_name, opt_specs, opt_replace) {
  var safeUrl;
  safeUrl = url instanceof goog.html.SafeUrl ? url : goog.html.SafeUrl.sanitize(url);
  return (opt_openerWin || window).open(goog.html.SafeUrl.unwrap(safeUrl), opt_name ? goog.string.Const.unwrap(opt_name) : "", opt_specs, opt_replace);
};
goog.dom.safe.assertIsLocation_ = function(o) {
  goog.asserts.ENABLE_ASSERTS && "undefined" != typeof Location && "undefined" != typeof Element && goog.asserts.assert(o && (o instanceof Location || !(o instanceof Element)), "Argument is not a Location (or a non-Element mock); got: %s", goog.dom.safe.debugStringForType_(o));
  return o;
};
goog.dom.safe.assertIsHTMLAnchorElement_ = function(o) {
  goog.asserts.ENABLE_ASSERTS && "undefined" != typeof HTMLAnchorElement && "undefined" != typeof Location && "undefined" != typeof Element && goog.asserts.assert(o && (o instanceof HTMLAnchorElement || !(o instanceof Location || o instanceof Element)), "Argument is not a HTMLAnchorElement (or a non-Element mock); got: %s", goog.dom.safe.debugStringForType_(o));
  return o;
};
goog.dom.safe.assertIsHTMLLinkElement_ = function(o) {
  goog.asserts.ENABLE_ASSERTS && "undefined" != typeof HTMLLinkElement && "undefined" != typeof Location && "undefined" != typeof Element && goog.asserts.assert(o && (o instanceof HTMLLinkElement || !(o instanceof Location || o instanceof Element)), "Argument is not a HTMLLinkElement (or a non-Element mock); got: %s", goog.dom.safe.debugStringForType_(o));
  return o;
};
goog.dom.safe.assertIsHTMLImageElement_ = function(o) {
  goog.asserts.ENABLE_ASSERTS && "undefined" != typeof HTMLImageElement && "undefined" != typeof Element && goog.asserts.assert(o && (o instanceof HTMLImageElement || !(o instanceof Element)), "Argument is not a HTMLImageElement (or a non-Element mock); got: %s", goog.dom.safe.debugStringForType_(o));
  return o;
};
goog.dom.safe.assertIsHTMLEmbedElement_ = function(o) {
  goog.asserts.ENABLE_ASSERTS && "undefined" != typeof HTMLEmbedElement && "undefined" != typeof Element && goog.asserts.assert(o && (o instanceof HTMLEmbedElement || !(o instanceof Element)), "Argument is not a HTMLEmbedElement (or a non-Element mock); got: %s", goog.dom.safe.debugStringForType_(o));
  return o;
};
goog.dom.safe.assertIsHTMLFrameElement_ = function(o) {
  goog.asserts.ENABLE_ASSERTS && "undefined" != typeof HTMLFrameElement && "undefined" != typeof Element && goog.asserts.assert(o && (o instanceof HTMLFrameElement || !(o instanceof Element)), "Argument is not a HTMLFrameElement (or a non-Element mock); got: %s", goog.dom.safe.debugStringForType_(o));
  return o;
};
goog.dom.safe.assertIsHTMLIFrameElement_ = function(o) {
  goog.asserts.ENABLE_ASSERTS && "undefined" != typeof HTMLIFrameElement && "undefined" != typeof Element && goog.asserts.assert(o && (o instanceof HTMLIFrameElement || !(o instanceof Element)), "Argument is not a HTMLIFrameElement (or a non-Element mock); got: %s", goog.dom.safe.debugStringForType_(o));
  return o;
};
goog.dom.safe.assertIsHTMLObjectElement_ = function(o) {
  goog.asserts.ENABLE_ASSERTS && "undefined" != typeof HTMLObjectElement && "undefined" != typeof Element && goog.asserts.assert(o && (o instanceof HTMLObjectElement || !(o instanceof Element)), "Argument is not a HTMLObjectElement (or a non-Element mock); got: %s", goog.dom.safe.debugStringForType_(o));
  return o;
};
goog.dom.safe.assertIsHTMLScriptElement_ = function(o) {
  goog.asserts.ENABLE_ASSERTS && "undefined" != typeof HTMLScriptElement && "undefined" != typeof Element && goog.asserts.assert(o && (o instanceof HTMLScriptElement || !(o instanceof Element)), "Argument is not a HTMLScriptElement (or a non-Element mock); got: %s", goog.dom.safe.debugStringForType_(o));
  return o;
};
goog.dom.safe.debugStringForType_ = function(value) {
  return goog.isObject(value) ? value.constructor.displayName || value.constructor.name || Object.prototype.toString.call(value) : void 0 === value ? "undefined" : null === value ? "null" : typeof value;
};
goog.dom.ASSUME_QUIRKS_MODE = !1;
goog.dom.ASSUME_STANDARDS_MODE = !1;
goog.dom.COMPAT_MODE_KNOWN_ = goog.dom.ASSUME_QUIRKS_MODE || goog.dom.ASSUME_STANDARDS_MODE;
goog.dom.getDomHelper = function(opt_element) {
  return opt_element ? new goog.dom.DomHelper(goog.dom.getOwnerDocument(opt_element)) : goog.dom.defaultDomHelper_ || (goog.dom.defaultDomHelper_ = new goog.dom.DomHelper);
};
goog.dom.getDocument = function() {
  return document;
};
goog.dom.getElement = function(element) {
  return goog.dom.getElementHelper_(document, element);
};
goog.dom.getElementHelper_ = function(doc, element) {
  return goog.isString(element) ? doc.getElementById(element) : element;
};
goog.dom.getRequiredElement = function(id) {
  return goog.dom.getRequiredElementHelper_(document, id);
};
goog.dom.getRequiredElementHelper_ = function(doc, id) {
  goog.asserts.assertString(id);
  var element = goog.dom.getElementHelper_(doc, id);
  return element = goog.asserts.assertElement(element, "No element found with id: " + id);
};
goog.dom.$ = goog.dom.getElement;
goog.dom.getElementsByTagName = function(tagName, opt_parent) {
  return (opt_parent || document).getElementsByTagName(String(tagName));
};
goog.dom.getElementsByTagNameAndClass = function(opt_tag, opt_class, opt_el) {
  return goog.dom.getElementsByTagNameAndClass_(document, opt_tag, opt_class, opt_el);
};
goog.dom.getElementsByClass = function(className, opt_el) {
  var parent = opt_el || document;
  return goog.dom.canUseQuerySelector_(parent) ? parent.querySelectorAll("." + className) : goog.dom.getElementsByTagNameAndClass_(document, "*", className, opt_el);
};
goog.dom.getElementByClass = function(className, opt_el) {
  var parent = opt_el || document, retVal = null;
  return (retVal = parent.getElementsByClassName ? parent.getElementsByClassName(className)[0] : goog.dom.canUseQuerySelector_(parent) ? parent.querySelector("." + className) : goog.dom.getElementsByTagNameAndClass_(document, "*", className, opt_el)[0]) || null;
};
goog.dom.getRequiredElementByClass = function(className, opt_root) {
  var retValue = goog.dom.getElementByClass(className, opt_root);
  return goog.asserts.assert(retValue, "No element found with className: " + className);
};
goog.dom.canUseQuerySelector_ = function(parent) {
  return !(!parent.querySelectorAll || !parent.querySelector);
};
goog.dom.getElementsByTagNameAndClass_ = function(doc, opt_tag, opt_class, opt_el) {
  var parent = opt_el || doc, tagName = opt_tag && "*" != opt_tag ? String(opt_tag).toUpperCase() : "";
  if (goog.dom.canUseQuerySelector_(parent) && (tagName || opt_class)) {
    var query;
    return parent.querySelectorAll(tagName + (opt_class ? "." + opt_class : ""));
  }
  if (opt_class && parent.getElementsByClassName) {
    var els = parent.getElementsByClassName(opt_class);
    if (tagName) {
      for (var arrayLike = {}, len = 0, i = 0, el;el = els[i];i++) {
        tagName == el.nodeName && (arrayLike[len++] = el);
      }
      arrayLike.length = len;
      return arrayLike;
    }
    return els;
  }
  els = parent.getElementsByTagName(tagName || "*");
  if (opt_class) {
    arrayLike = {};
    for (i = len = 0;el = els[i];i++) {
      var className = el.className;
      "function" == typeof className.split && goog.array.contains(className.split(/\s+/), opt_class) && (arrayLike[len++] = el);
    }
    arrayLike.length = len;
    return arrayLike;
  }
  return els;
};
goog.dom.$$ = goog.dom.getElementsByTagNameAndClass;
goog.dom.setProperties = function(element, properties) {
  goog.object.forEach(properties, function(val, key) {
    "style" == key ? element.style.cssText = val : "class" == key ? element.className = val : "for" == key ? element.htmlFor = val : goog.dom.DIRECT_ATTRIBUTE_MAP_.hasOwnProperty(key) ? element.setAttribute(goog.dom.DIRECT_ATTRIBUTE_MAP_[key], val) : goog.string.startsWith(key, "aria-") || goog.string.startsWith(key, "data-") ? element.setAttribute(key, val) : element[key] = val;
  });
};
goog.dom.DIRECT_ATTRIBUTE_MAP_ = {cellpadding:"cellPadding", cellspacing:"cellSpacing", colspan:"colSpan", frameborder:"frameBorder", height:"height", maxlength:"maxLength", nonce:"nonce", role:"role", rowspan:"rowSpan", type:"type", usemap:"useMap", valign:"vAlign", width:"width"};
goog.dom.getViewportSize = function(opt_window) {
  return goog.dom.getViewportSize_(opt_window || window);
};
goog.dom.getViewportSize_ = function(win) {
  var doc = win.document, el = goog.dom.isCss1CompatMode_(doc) ? doc.documentElement : doc.body;
  return new goog.math.Size(el.clientWidth, el.clientHeight);
};
goog.dom.getDocumentHeight = function() {
  return goog.dom.getDocumentHeight_(window);
};
goog.dom.getDocumentHeightForWindow = function(win) {
  return goog.dom.getDocumentHeight_(win);
};
goog.dom.getDocumentHeight_ = function(win) {
  var doc = win.document, height = 0;
  if (doc) {
    var body = doc.body, docEl = doc.documentElement;
    if (!docEl || !body) {
      return 0;
    }
    var vh = goog.dom.getViewportSize_(win).height;
    if (goog.dom.isCss1CompatMode_(doc) && docEl.scrollHeight) {
      height = docEl.scrollHeight != vh ? docEl.scrollHeight : docEl.offsetHeight;
    } else {
      var sh = docEl.scrollHeight, oh = docEl.offsetHeight;
      docEl.clientHeight != oh && (sh = body.scrollHeight, oh = body.offsetHeight);
      height = sh > vh ? sh > oh ? sh : oh : sh < oh ? sh : oh;
    }
  }
  return height;
};
goog.dom.getPageScroll = function(opt_window) {
  return goog.dom.getDomHelper((opt_window || goog.global || window).document).getDocumentScroll();
};
goog.dom.getDocumentScroll = function() {
  return goog.dom.getDocumentScroll_(document);
};
goog.dom.getDocumentScroll_ = function(doc) {
  var el = goog.dom.getDocumentScrollElement_(doc), win = goog.dom.getWindow_(doc);
  return goog.userAgent.IE && goog.userAgent.isVersionOrHigher("10") && win.pageYOffset != el.scrollTop ? new goog.math.Coordinate(el.scrollLeft, el.scrollTop) : new goog.math.Coordinate(win.pageXOffset || el.scrollLeft, win.pageYOffset || el.scrollTop);
};
goog.dom.getDocumentScrollElement = function() {
  return goog.dom.getDocumentScrollElement_(document);
};
goog.dom.getDocumentScrollElement_ = function(doc) {
  return doc.scrollingElement ? doc.scrollingElement : !goog.userAgent.WEBKIT && goog.dom.isCss1CompatMode_(doc) ? doc.documentElement : doc.body || doc.documentElement;
};
goog.dom.getWindow = function(opt_doc) {
  return opt_doc ? goog.dom.getWindow_(opt_doc) : window;
};
goog.dom.getWindow_ = function(doc) {
  return doc.parentWindow || doc.defaultView;
};
goog.dom.createDom = function(tagName, opt_properties, var_args) {
  return goog.dom.createDom_(document, arguments);
};
goog.dom.createDom_ = function(doc, args) {
  var tagName = String(args[0]), attributes = args[1];
  if (!goog.dom.BrowserFeature.CAN_ADD_NAME_OR_TYPE_ATTRIBUTES && attributes && (attributes.name || attributes.type)) {
    var tagNameArr = ["<", tagName];
    attributes.name && tagNameArr.push(' name="', goog.string.htmlEscape(attributes.name), '"');
    if (attributes.type) {
      tagNameArr.push(' type="', goog.string.htmlEscape(attributes.type), '"');
      var clone = {};
      goog.object.extend(clone, attributes);
      delete clone.type;
      attributes = clone;
    }
    tagNameArr.push(">");
    tagName = tagNameArr.join("");
  }
  var element = doc.createElement(tagName);
  attributes && (goog.isString(attributes) ? element.className = attributes : goog.isArray(attributes) ? element.className = attributes.join(" ") : goog.dom.setProperties(element, attributes));
  2 < args.length && goog.dom.append_(doc, element, args, 2);
  return element;
};
goog.dom.append_ = function(doc, parent, args, startIndex) {
  function childHandler(child) {
    child && parent.appendChild(goog.isString(child) ? doc.createTextNode(child) : child);
  }
  for (var i = startIndex;i < args.length;i++) {
    var arg = args[i];
    goog.isArrayLike(arg) && !goog.dom.isNodeLike(arg) ? goog.array.forEach(goog.dom.isNodeList(arg) ? goog.array.toArray(arg) : arg, childHandler) : childHandler(arg);
  }
};
goog.dom.$dom = goog.dom.createDom;
goog.dom.createElement = function(name) {
  return goog.dom.createElement_(document, name);
};
goog.dom.createElement_ = function(doc, name) {
  return doc.createElement(String(name));
};
goog.dom.createTextNode = function(content) {
  return document.createTextNode(String(content));
};
goog.dom.createTable = function(rows, columns, opt_fillWithNbsp) {
  return goog.dom.createTable_(document, rows, columns, !!opt_fillWithNbsp);
};
goog.dom.createTable_ = function(doc, rows, columns, fillWithNbsp) {
  for (var table = goog.dom.createElement_(doc, "TABLE"), tbody = table.appendChild(goog.dom.createElement_(doc, "TBODY")), i = 0;i < rows;i++) {
    for (var tr = goog.dom.createElement_(doc, "TR"), j = 0;j < columns;j++) {
      var td = goog.dom.createElement_(doc, "TD");
      fillWithNbsp && goog.dom.setTextContent(td, goog.string.Unicode.NBSP);
      tr.appendChild(td);
    }
    tbody.appendChild(tr);
  }
  return table;
};
goog.dom.constHtmlToNode = function(var_args) {
  var stringArray = goog.array.map(arguments, goog.string.Const.unwrap), safeHtml = goog.html.uncheckedconversions.safeHtmlFromStringKnownToSatisfyTypeContract(goog.string.Const.from("Constant HTML string, that gets turned into a Node later, so it will be automatically balanced."), stringArray.join(""));
  return goog.dom.safeHtmlToNode(safeHtml);
};
goog.dom.safeHtmlToNode = function(html) {
  return goog.dom.safeHtmlToNode_(document, html);
};
goog.dom.safeHtmlToNode_ = function(doc, html) {
  var tempDiv = goog.dom.createElement_(doc, "DIV");
  goog.dom.BrowserFeature.INNER_HTML_NEEDS_SCOPED_ELEMENT ? (goog.dom.safe.setInnerHtml(tempDiv, goog.html.SafeHtml.concat(goog.html.SafeHtml.BR, html)), tempDiv.removeChild(tempDiv.firstChild)) : goog.dom.safe.setInnerHtml(tempDiv, html);
  return goog.dom.childrenToNode_(doc, tempDiv);
};
goog.dom.childrenToNode_ = function(doc, tempDiv) {
  if (1 == tempDiv.childNodes.length) {
    return tempDiv.removeChild(tempDiv.firstChild);
  }
  for (var fragment = doc.createDocumentFragment();tempDiv.firstChild;) {
    fragment.appendChild(tempDiv.firstChild);
  }
  return fragment;
};
goog.dom.isCss1CompatMode = function() {
  return goog.dom.isCss1CompatMode_(document);
};
goog.dom.isCss1CompatMode_ = function(doc) {
  return goog.dom.COMPAT_MODE_KNOWN_ ? goog.dom.ASSUME_STANDARDS_MODE : "CSS1Compat" == doc.compatMode;
};
goog.dom.canHaveChildren = function(node) {
  if (node.nodeType != goog.dom.NodeType.ELEMENT) {
    return !1;
  }
  switch(node.tagName) {
    case "APPLET":
    case "AREA":
    case "BASE":
    case "BR":
    case "COL":
    case "COMMAND":
    case "EMBED":
    case "FRAME":
    case "HR":
    case "IMG":
    case "INPUT":
    case "IFRAME":
    case "ISINDEX":
    case "KEYGEN":
    case "LINK":
    case "NOFRAMES":
    case "NOSCRIPT":
    case "META":
    case "OBJECT":
    case "PARAM":
    case "SCRIPT":
    case "SOURCE":
    case "STYLE":
    case "TRACK":
    case "WBR":
      return !1;
  }
  return !0;
};
goog.dom.appendChild = function(parent, child) {
  parent.appendChild(child);
};
goog.dom.append = function(parent, var_args) {
  goog.dom.append_(goog.dom.getOwnerDocument(parent), parent, arguments, 1);
};
goog.dom.removeChildren = function(node) {
  for (var child;child = node.firstChild;) {
    node.removeChild(child);
  }
};
goog.dom.insertSiblingBefore = function(newNode, refNode) {
  refNode.parentNode && refNode.parentNode.insertBefore(newNode, refNode);
};
goog.dom.insertSiblingAfter = function(newNode, refNode) {
  refNode.parentNode && refNode.parentNode.insertBefore(newNode, refNode.nextSibling);
};
goog.dom.insertChildAt = function(parent, child, index) {
  parent.insertBefore(child, parent.childNodes[index] || null);
};
goog.dom.removeNode = function(node) {
  return node && node.parentNode ? node.parentNode.removeChild(node) : null;
};
goog.dom.replaceNode = function(newNode, oldNode) {
  var parent = oldNode.parentNode;
  parent && parent.replaceChild(newNode, oldNode);
};
goog.dom.flattenElement = function(element) {
  var child, parent = element.parentNode;
  if (parent && parent.nodeType != goog.dom.NodeType.DOCUMENT_FRAGMENT) {
    if (element.removeNode) {
      return element.removeNode(!1);
    }
    for (;child = element.firstChild;) {
      parent.insertBefore(child, element);
    }
    return goog.dom.removeNode(element);
  }
};
goog.dom.getChildren = function(element) {
  return goog.dom.BrowserFeature.CAN_USE_CHILDREN_ATTRIBUTE && void 0 != element.children ? element.children : goog.array.filter(element.childNodes, function(node) {
    return node.nodeType == goog.dom.NodeType.ELEMENT;
  });
};
goog.dom.getFirstElementChild = function(node) {
  return goog.isDef(node.firstElementChild) ? node.firstElementChild : goog.dom.getNextElementNode_(node.firstChild, !0);
};
goog.dom.getLastElementChild = function(node) {
  return goog.isDef(node.lastElementChild) ? node.lastElementChild : goog.dom.getNextElementNode_(node.lastChild, !1);
};
goog.dom.getNextElementSibling = function(node) {
  return goog.isDef(node.nextElementSibling) ? node.nextElementSibling : goog.dom.getNextElementNode_(node.nextSibling, !0);
};
goog.dom.getPreviousElementSibling = function(node) {
  return goog.isDef(node.previousElementSibling) ? node.previousElementSibling : goog.dom.getNextElementNode_(node.previousSibling, !1);
};
goog.dom.getNextElementNode_ = function(node, forward) {
  for (;node && node.nodeType != goog.dom.NodeType.ELEMENT;) {
    node = forward ? node.nextSibling : node.previousSibling;
  }
  return node;
};
goog.dom.getNextNode = function(node) {
  if (!node) {
    return null;
  }
  if (node.firstChild) {
    return node.firstChild;
  }
  for (;node && !node.nextSibling;) {
    node = node.parentNode;
  }
  return node ? node.nextSibling : null;
};
goog.dom.getPreviousNode = function(node) {
  if (!node) {
    return null;
  }
  if (!node.previousSibling) {
    return node.parentNode;
  }
  for (node = node.previousSibling;node && node.lastChild;) {
    node = node.lastChild;
  }
  return node;
};
goog.dom.isNodeLike = function(obj) {
  return goog.isObject(obj) && 0 < obj.nodeType;
};
goog.dom.isElement = function(obj) {
  return goog.isObject(obj) && obj.nodeType == goog.dom.NodeType.ELEMENT;
};
goog.dom.isWindow = function(obj) {
  return goog.isObject(obj) && obj.window == obj;
};
goog.dom.getParentElement = function(element) {
  var parent;
  if (goog.dom.BrowserFeature.CAN_USE_PARENT_ELEMENT_PROPERTY && !(goog.userAgent.IE && goog.userAgent.isVersionOrHigher("9") && !goog.userAgent.isVersionOrHigher("10") && goog.global.SVGElement && element instanceof goog.global.SVGElement) && (parent = element.parentElement)) {
    return parent;
  }
  parent = element.parentNode;
  return goog.dom.isElement(parent) ? parent : null;
};
goog.dom.contains = function(parent, descendant) {
  if (!parent || !descendant) {
    return !1;
  }
  if (parent.contains && descendant.nodeType == goog.dom.NodeType.ELEMENT) {
    return parent == descendant || parent.contains(descendant);
  }
  if ("undefined" != typeof parent.compareDocumentPosition) {
    return parent == descendant || !!(parent.compareDocumentPosition(descendant) & 16);
  }
  for (;descendant && parent != descendant;) {
    descendant = descendant.parentNode;
  }
  return descendant == parent;
};
goog.dom.compareNodeOrder = function(node1, node2) {
  if (node1 == node2) {
    return 0;
  }
  if (node1.compareDocumentPosition) {
    return node1.compareDocumentPosition(node2) & 2 ? 1 : -1;
  }
  if (goog.userAgent.IE && !goog.userAgent.isDocumentModeOrHigher(9)) {
    if (node1.nodeType == goog.dom.NodeType.DOCUMENT) {
      return -1;
    }
    if (node2.nodeType == goog.dom.NodeType.DOCUMENT) {
      return 1;
    }
  }
  if ("sourceIndex" in node1 || node1.parentNode && "sourceIndex" in node1.parentNode) {
    var isElement1 = node1.nodeType == goog.dom.NodeType.ELEMENT, isElement2 = node2.nodeType == goog.dom.NodeType.ELEMENT;
    if (isElement1 && isElement2) {
      return node1.sourceIndex - node2.sourceIndex;
    }
    var parent1 = node1.parentNode, parent2 = node2.parentNode;
    return parent1 == parent2 ? goog.dom.compareSiblingOrder_(node1, node2) : !isElement1 && goog.dom.contains(parent1, node2) ? -1 * goog.dom.compareParentsDescendantNodeIe_(node1, node2) : !isElement2 && goog.dom.contains(parent2, node1) ? goog.dom.compareParentsDescendantNodeIe_(node2, node1) : (isElement1 ? node1.sourceIndex : parent1.sourceIndex) - (isElement2 ? node2.sourceIndex : parent2.sourceIndex);
  }
  var doc = goog.dom.getOwnerDocument(node1), range1, range2;
  range1 = doc.createRange();
  range1.selectNode(node1);
  range1.collapse(!0);
  range2 = doc.createRange();
  range2.selectNode(node2);
  range2.collapse(!0);
  return range1.compareBoundaryPoints(goog.global.Range.START_TO_END, range2);
};
goog.dom.compareParentsDescendantNodeIe_ = function(textNode, node) {
  var parent = textNode.parentNode;
  if (parent == node) {
    return -1;
  }
  for (var sibling = node;sibling.parentNode != parent;) {
    sibling = sibling.parentNode;
  }
  return goog.dom.compareSiblingOrder_(sibling, textNode);
};
goog.dom.compareSiblingOrder_ = function(node1, node2) {
  for (var s = node2;s = s.previousSibling;) {
    if (s == node1) {
      return -1;
    }
  }
  return 1;
};
goog.dom.findCommonAncestor = function(var_args) {
  var i, count = arguments.length;
  if (!count) {
    return null;
  }
  if (1 == count) {
    return arguments[0];
  }
  var paths = [], minLength = Infinity;
  for (i = 0;i < count;i++) {
    for (var ancestors = [], node = arguments[i];node;) {
      ancestors.unshift(node), node = node.parentNode;
    }
    paths.push(ancestors);
    minLength = Math.min(minLength, ancestors.length);
  }
  var output = null;
  for (i = 0;i < minLength;i++) {
    for (var first = paths[0][i], j = 1;j < count;j++) {
      if (first != paths[j][i]) {
        return output;
      }
    }
    output = first;
  }
  return output;
};
goog.dom.getOwnerDocument = function(node) {
  goog.asserts.assert(node, "Node cannot be null or undefined.");
  return node.nodeType == goog.dom.NodeType.DOCUMENT ? node : node.ownerDocument || node.document;
};
goog.dom.getFrameContentDocument = function(frame) {
  return frame.contentDocument || frame.contentWindow.document;
};
goog.dom.getFrameContentWindow = function(frame) {
  try {
    return frame.contentWindow || (frame.contentDocument ? goog.dom.getWindow(frame.contentDocument) : null);
  } catch (e) {
  }
  return null;
};
goog.dom.setTextContent = function(node, text) {
  goog.asserts.assert(null != node, "goog.dom.setTextContent expects a non-null value for node");
  if ("textContent" in node) {
    node.textContent = text;
  } else {
    if (node.nodeType == goog.dom.NodeType.TEXT) {
      node.data = text;
    } else {
      if (node.firstChild && node.firstChild.nodeType == goog.dom.NodeType.TEXT) {
        for (;node.lastChild != node.firstChild;) {
          node.removeChild(node.lastChild);
        }
        node.firstChild.data = text;
      } else {
        goog.dom.removeChildren(node);
        var doc = goog.dom.getOwnerDocument(node);
        node.appendChild(doc.createTextNode(String(text)));
      }
    }
  }
};
goog.dom.getOuterHtml = function(element) {
  goog.asserts.assert(null !== element, "goog.dom.getOuterHtml expects a non-null value for element");
  if ("outerHTML" in element) {
    return element.outerHTML;
  }
  var doc = goog.dom.getOwnerDocument(element), div = goog.dom.createElement_(doc, "DIV");
  div.appendChild(element.cloneNode(!0));
  return div.innerHTML;
};
goog.dom.findNode = function(root, p) {
  var rv = [];
  return goog.dom.findNodes_(root, p, rv, !0) ? rv[0] : void 0;
};
goog.dom.findNodes = function(root, p) {
  var rv = [];
  goog.dom.findNodes_(root, p, rv, !1);
  return rv;
};
goog.dom.findNodes_ = function(root, p, rv, findOne) {
  if (null != root) {
    for (var child = root.firstChild;child;) {
      if (p(child) && (rv.push(child), findOne) || goog.dom.findNodes_(child, p, rv, findOne)) {
        return !0;
      }
      child = child.nextSibling;
    }
  }
  return !1;
};
goog.dom.TAGS_TO_IGNORE_ = {SCRIPT:1, STYLE:1, HEAD:1, IFRAME:1, OBJECT:1};
goog.dom.PREDEFINED_TAG_VALUES_ = {IMG:" ", BR:"\n"};
goog.dom.isFocusableTabIndex = function(element) {
  return goog.dom.hasSpecifiedTabIndex_(element) && goog.dom.isTabIndexFocusable_(element);
};
goog.dom.setFocusableTabIndex = function(element, enable) {
  enable ? element.tabIndex = 0 : (element.tabIndex = -1, element.removeAttribute("tabIndex"));
};
goog.dom.isFocusable = function(element) {
  var focusable;
  return (focusable = goog.dom.nativelySupportsFocus_(element) ? !element.disabled && (!goog.dom.hasSpecifiedTabIndex_(element) || goog.dom.isTabIndexFocusable_(element)) : goog.dom.isFocusableTabIndex(element)) && goog.userAgent.IE ? goog.dom.hasNonZeroBoundingRect_(element) : focusable;
};
goog.dom.hasSpecifiedTabIndex_ = function(element) {
  if (goog.userAgent.IE && !goog.userAgent.isVersionOrHigher("9")) {
    var attrNode = element.getAttributeNode("tabindex");
    return goog.isDefAndNotNull(attrNode) && attrNode.specified;
  }
  return element.hasAttribute("tabindex");
};
goog.dom.isTabIndexFocusable_ = function(element) {
  var index = element.tabIndex;
  return goog.isNumber(index) && 0 <= index && 32768 > index;
};
goog.dom.nativelySupportsFocus_ = function(element) {
  return "A" == element.tagName || "INPUT" == element.tagName || "TEXTAREA" == element.tagName || "SELECT" == element.tagName || "BUTTON" == element.tagName;
};
goog.dom.hasNonZeroBoundingRect_ = function(element) {
  var rect;
  rect = !goog.isFunction(element.getBoundingClientRect) || goog.userAgent.IE && null == element.parentElement ? {height:element.offsetHeight, width:element.offsetWidth} : element.getBoundingClientRect();
  return goog.isDefAndNotNull(rect) && 0 < rect.height && 0 < rect.width;
};
goog.dom.getTextContent = function(node) {
  var textContent;
  if (goog.dom.BrowserFeature.CAN_USE_INNER_TEXT && null !== node && "innerText" in node) {
    textContent = goog.string.canonicalizeNewlines(node.innerText);
  } else {
    var buf = [];
    goog.dom.getTextContent_(node, buf, !0);
    textContent = buf.join("");
  }
  textContent = textContent.replace(/ \xAD /g, " ").replace(/\xAD/g, "");
  textContent = textContent.replace(/\u200B/g, "");
  goog.dom.BrowserFeature.CAN_USE_INNER_TEXT || (textContent = textContent.replace(/ +/g, " "));
  " " != textContent && (textContent = textContent.replace(/^\s*/, ""));
  return textContent;
};
goog.dom.getRawTextContent = function(node) {
  var buf = [];
  goog.dom.getTextContent_(node, buf, !1);
  return buf.join("");
};
goog.dom.getTextContent_ = function(node, buf, normalizeWhitespace) {
  if (!(node.nodeName in goog.dom.TAGS_TO_IGNORE_)) {
    if (node.nodeType == goog.dom.NodeType.TEXT) {
      normalizeWhitespace ? buf.push(String(node.nodeValue).replace(/(\r\n|\r|\n)/g, "")) : buf.push(node.nodeValue);
    } else {
      if (node.nodeName in goog.dom.PREDEFINED_TAG_VALUES_) {
        buf.push(goog.dom.PREDEFINED_TAG_VALUES_[node.nodeName]);
      } else {
        for (var child = node.firstChild;child;) {
          goog.dom.getTextContent_(child, buf, normalizeWhitespace), child = child.nextSibling;
        }
      }
    }
  }
};
goog.dom.getNodeTextLength = function(node) {
  return goog.dom.getTextContent(node).length;
};
goog.dom.getNodeTextOffset = function(node, opt_offsetParent) {
  for (var root = opt_offsetParent || goog.dom.getOwnerDocument(node).body, buf = [];node && node != root;) {
    for (var cur = node;cur = cur.previousSibling;) {
      buf.unshift(goog.dom.getTextContent(cur));
    }
    node = node.parentNode;
  }
  return goog.string.trimLeft(buf.join("")).replace(/ +/g, " ").length;
};
goog.dom.getNodeAtOffset = function(parent, offset, opt_result) {
  for (var stack = [parent], pos = 0, cur = null;0 < stack.length && pos < offset;) {
    if (cur = stack.pop(), !(cur.nodeName in goog.dom.TAGS_TO_IGNORE_)) {
      if (cur.nodeType == goog.dom.NodeType.TEXT) {
        var text = cur.nodeValue.replace(/(\r\n|\r|\n)/g, "").replace(/ +/g, " "), pos = pos + text.length;
      } else {
        if (cur.nodeName in goog.dom.PREDEFINED_TAG_VALUES_) {
          pos += goog.dom.PREDEFINED_TAG_VALUES_[cur.nodeName].length;
        } else {
          for (var i = cur.childNodes.length - 1;0 <= i;i--) {
            stack.push(cur.childNodes[i]);
          }
        }
      }
    }
  }
  goog.isObject(opt_result) && (opt_result.remainder = cur ? cur.nodeValue.length + offset - pos - 1 : 0, opt_result.node = cur);
  return cur;
};
goog.dom.isNodeList = function(val) {
  if (val && "number" == typeof val.length) {
    if (goog.isObject(val)) {
      return "function" == typeof val.item || "string" == typeof val.item;
    }
    if (goog.isFunction(val)) {
      return "function" == typeof val.item;
    }
  }
  return !1;
};
goog.dom.getAncestorByTagNameAndClass = function(element, opt_tag, opt_class, opt_maxSearchSteps) {
  if (!opt_tag && !opt_class) {
    return null;
  }
  var tagName = opt_tag ? String(opt_tag).toUpperCase() : null;
  return goog.dom.getAncestor(element, function(node) {
    return (!tagName || node.nodeName == tagName) && (!opt_class || goog.isString(node.className) && goog.array.contains(node.className.split(/\s+/), opt_class));
  }, !0, opt_maxSearchSteps);
};
goog.dom.getAncestorByClass = function(element, className, opt_maxSearchSteps) {
  return goog.dom.getAncestorByTagNameAndClass(element, null, className, opt_maxSearchSteps);
};
goog.dom.getAncestor = function(element, matcher, opt_includeNode, opt_maxSearchSteps) {
  element && !opt_includeNode && (element = element.parentNode);
  for (var steps = 0;element && (null == opt_maxSearchSteps || steps <= opt_maxSearchSteps);) {
    goog.asserts.assert("parentNode" != element.name);
    if (matcher(element)) {
      return element;
    }
    element = element.parentNode;
    steps++;
  }
  return null;
};
goog.dom.getActiveElement = function(doc) {
  try {
    return doc && doc.activeElement;
  } catch (e) {
  }
  return null;
};
goog.dom.getPixelRatio = function() {
  var win = goog.dom.getWindow();
  return goog.isDef(win.devicePixelRatio) ? win.devicePixelRatio : win.matchMedia ? goog.dom.matchesPixelRatio_(3) || goog.dom.matchesPixelRatio_(2) || goog.dom.matchesPixelRatio_(1.5) || goog.dom.matchesPixelRatio_(1) || .75 : 1;
};
goog.dom.matchesPixelRatio_ = function(pixelRatio) {
  var dpiPerDppx, query;
  return goog.dom.getWindow().matchMedia("(min-resolution: " + pixelRatio + "dppx),(min--moz-device-pixel-ratio: " + pixelRatio + "),(min-resolution: " + 96 * pixelRatio + "dpi)").matches ? pixelRatio : 0;
};
goog.dom.getCanvasContext2D = function(canvas) {
  return canvas.getContext("2d");
};
goog.dom.DomHelper = function(opt_document) {
  this.document_ = opt_document || goog.global.document || document;
};
goog.dom.DomHelper.prototype.getDomHelper = goog.dom.getDomHelper;
goog.dom.DomHelper.prototype.getDocument = function() {
  return this.document_;
};
goog.dom.DomHelper.prototype.getElement = function(element) {
  return goog.dom.getElementHelper_(this.document_, element);
};
goog.dom.DomHelper.prototype.getRequiredElement = function(id) {
  return goog.dom.getRequiredElementHelper_(this.document_, id);
};
goog.dom.DomHelper.prototype.$ = goog.dom.DomHelper.prototype.getElement;
goog.dom.DomHelper.prototype.getElementsByTagName = function(tagName, opt_parent) {
  return (opt_parent || this.document_).getElementsByTagName(String(tagName));
};
goog.dom.DomHelper.prototype.getElementsByTagNameAndClass = function(opt_tag, opt_class, opt_el) {
  return goog.dom.getElementsByTagNameAndClass_(this.document_, opt_tag, opt_class, opt_el);
};
goog.dom.DomHelper.prototype.getElementsByClass = function(className, opt_el) {
  return goog.dom.getElementsByClass(className, opt_el || this.document_);
};
goog.dom.DomHelper.prototype.getElementByClass = function(className, opt_el) {
  return goog.dom.getElementByClass(className, opt_el || this.document_);
};
goog.dom.DomHelper.prototype.getRequiredElementByClass = function(className, opt_root) {
  return goog.dom.getRequiredElementByClass(className, opt_root || this.document_);
};
goog.dom.DomHelper.prototype.$$ = goog.dom.DomHelper.prototype.getElementsByTagNameAndClass;
goog.dom.DomHelper.prototype.setProperties = goog.dom.setProperties;
goog.dom.DomHelper.prototype.getViewportSize = function(opt_window) {
  return goog.dom.getViewportSize(opt_window || this.getWindow());
};
goog.dom.DomHelper.prototype.getDocumentHeight = function() {
  return goog.dom.getDocumentHeight_(this.getWindow());
};
goog.dom.DomHelper.prototype.createDom = function(tagName, opt_attributes, var_args) {
  return goog.dom.createDom_(this.document_, arguments);
};
goog.dom.DomHelper.prototype.$dom = goog.dom.DomHelper.prototype.createDom;
goog.dom.DomHelper.prototype.createElement = function(name) {
  return goog.dom.createElement_(this.document_, name);
};
goog.dom.DomHelper.prototype.createTextNode = function(content) {
  return this.document_.createTextNode(String(content));
};
goog.dom.DomHelper.prototype.createTable = function(rows, columns, opt_fillWithNbsp) {
  return goog.dom.createTable_(this.document_, rows, columns, !!opt_fillWithNbsp);
};
goog.dom.DomHelper.prototype.safeHtmlToNode = function(html) {
  return goog.dom.safeHtmlToNode_(this.document_, html);
};
goog.dom.DomHelper.prototype.isCss1CompatMode = function() {
  return goog.dom.isCss1CompatMode_(this.document_);
};
goog.dom.DomHelper.prototype.getWindow = function() {
  return goog.dom.getWindow_(this.document_);
};
goog.dom.DomHelper.prototype.getDocumentScrollElement = function() {
  return goog.dom.getDocumentScrollElement_(this.document_);
};
goog.dom.DomHelper.prototype.getDocumentScroll = function() {
  return goog.dom.getDocumentScroll_(this.document_);
};
goog.dom.DomHelper.prototype.getActiveElement = function(opt_doc) {
  return goog.dom.getActiveElement(opt_doc || this.document_);
};
goog.dom.DomHelper.prototype.appendChild = goog.dom.appendChild;
goog.dom.DomHelper.prototype.append = goog.dom.append;
goog.dom.DomHelper.prototype.canHaveChildren = goog.dom.canHaveChildren;
goog.dom.DomHelper.prototype.removeChildren = goog.dom.removeChildren;
goog.dom.DomHelper.prototype.insertSiblingBefore = goog.dom.insertSiblingBefore;
goog.dom.DomHelper.prototype.insertSiblingAfter = goog.dom.insertSiblingAfter;
goog.dom.DomHelper.prototype.insertChildAt = goog.dom.insertChildAt;
goog.dom.DomHelper.prototype.removeNode = goog.dom.removeNode;
goog.dom.DomHelper.prototype.replaceNode = goog.dom.replaceNode;
goog.dom.DomHelper.prototype.flattenElement = goog.dom.flattenElement;
goog.dom.DomHelper.prototype.getChildren = goog.dom.getChildren;
goog.dom.DomHelper.prototype.getFirstElementChild = goog.dom.getFirstElementChild;
goog.dom.DomHelper.prototype.getLastElementChild = goog.dom.getLastElementChild;
goog.dom.DomHelper.prototype.getNextElementSibling = goog.dom.getNextElementSibling;
goog.dom.DomHelper.prototype.getPreviousElementSibling = goog.dom.getPreviousElementSibling;
goog.dom.DomHelper.prototype.getNextNode = goog.dom.getNextNode;
goog.dom.DomHelper.prototype.getPreviousNode = goog.dom.getPreviousNode;
goog.dom.DomHelper.prototype.isNodeLike = goog.dom.isNodeLike;
goog.dom.DomHelper.prototype.isElement = goog.dom.isElement;
goog.dom.DomHelper.prototype.isWindow = goog.dom.isWindow;
goog.dom.DomHelper.prototype.getParentElement = goog.dom.getParentElement;
goog.dom.DomHelper.prototype.contains = goog.dom.contains;
goog.dom.DomHelper.prototype.compareNodeOrder = goog.dom.compareNodeOrder;
goog.dom.DomHelper.prototype.findCommonAncestor = goog.dom.findCommonAncestor;
goog.dom.DomHelper.prototype.getOwnerDocument = goog.dom.getOwnerDocument;
goog.dom.DomHelper.prototype.getFrameContentDocument = goog.dom.getFrameContentDocument;
goog.dom.DomHelper.prototype.getFrameContentWindow = goog.dom.getFrameContentWindow;
goog.dom.DomHelper.prototype.setTextContent = goog.dom.setTextContent;
goog.dom.DomHelper.prototype.getOuterHtml = goog.dom.getOuterHtml;
goog.dom.DomHelper.prototype.findNode = goog.dom.findNode;
goog.dom.DomHelper.prototype.findNodes = goog.dom.findNodes;
goog.dom.DomHelper.prototype.isFocusableTabIndex = goog.dom.isFocusableTabIndex;
goog.dom.DomHelper.prototype.setFocusableTabIndex = goog.dom.setFocusableTabIndex;
goog.dom.DomHelper.prototype.isFocusable = goog.dom.isFocusable;
goog.dom.DomHelper.prototype.getTextContent = goog.dom.getTextContent;
goog.dom.DomHelper.prototype.getNodeTextLength = goog.dom.getNodeTextLength;
goog.dom.DomHelper.prototype.getNodeTextOffset = goog.dom.getNodeTextOffset;
goog.dom.DomHelper.prototype.getNodeAtOffset = goog.dom.getNodeAtOffset;
goog.dom.DomHelper.prototype.isNodeList = goog.dom.isNodeList;
goog.dom.DomHelper.prototype.getAncestorByTagNameAndClass = goog.dom.getAncestorByTagNameAndClass;
goog.dom.DomHelper.prototype.getAncestorByClass = goog.dom.getAncestorByClass;
goog.dom.DomHelper.prototype.getAncestor = goog.dom.getAncestor;
goog.dom.DomHelper.prototype.getCanvasContext2D = goog.dom.getCanvasContext2D;
goog.async = {};
goog.async.FreeList = function(create, reset, limit) {
  this.limit_ = limit;
  this.create_ = create;
  this.reset_ = reset;
  this.occupants_ = 0;
  this.head_ = null;
};
goog.async.FreeList.prototype.get = function() {
  var item;
  0 < this.occupants_ ? (this.occupants_--, item = this.head_, this.head_ = item.next, item.next = null) : item = this.create_();
  return item;
};
goog.async.FreeList.prototype.put = function(item) {
  this.reset_(item);
  this.occupants_ < this.limit_ && (this.occupants_++, item.next = this.head_, this.head_ = item);
};
goog.debug.entryPointRegistry = {};
goog.debug.EntryPointMonitor = function() {
};
goog.debug.entryPointRegistry.refList_ = [];
goog.debug.entryPointRegistry.monitors_ = [];
goog.debug.entryPointRegistry.monitorsMayExist_ = !1;
goog.debug.entryPointRegistry.register = function(callback) {
  goog.debug.entryPointRegistry.refList_[goog.debug.entryPointRegistry.refList_.length] = callback;
  if (goog.debug.entryPointRegistry.monitorsMayExist_) {
    for (var monitors = goog.debug.entryPointRegistry.monitors_, i = 0;i < monitors.length;i++) {
      callback(goog.bind(monitors[i].wrap, monitors[i]));
    }
  }
};
goog.debug.entryPointRegistry.monitorAll = function(monitor) {
  goog.debug.entryPointRegistry.monitorsMayExist_ = !0;
  for (var transformer = goog.bind(monitor.wrap, monitor), i = 0;i < goog.debug.entryPointRegistry.refList_.length;i++) {
    goog.debug.entryPointRegistry.refList_[i](transformer);
  }
  goog.debug.entryPointRegistry.monitors_.push(monitor);
};
goog.debug.entryPointRegistry.unmonitorAllIfPossible = function(monitor) {
  var monitors = goog.debug.entryPointRegistry.monitors_;
  goog.asserts.assert(monitor == monitors[monitors.length - 1], "Only the most recent monitor can be unwrapped.");
  for (var transformer = goog.bind(monitor.unwrap, monitor), i = 0;i < goog.debug.entryPointRegistry.refList_.length;i++) {
    goog.debug.entryPointRegistry.refList_[i](transformer);
  }
  monitors.length--;
};
goog.functions = {};
goog.functions.constant = function(retValue) {
  return function() {
    return retValue;
  };
};
goog.functions.FALSE = goog.functions.constant(!1);
goog.functions.TRUE = goog.functions.constant(!0);
goog.functions.NULL = goog.functions.constant(null);
goog.functions.identity = function(opt_returnValue, var_args) {
  return opt_returnValue;
};
goog.functions.error = function(message) {
  return function() {
    throw Error(message);
  };
};
goog.functions.fail = function(err) {
  return function() {
    throw err;
  };
};
goog.functions.lock = function(f, opt_numArgs) {
  opt_numArgs = opt_numArgs || 0;
  return function() {
    return f.apply(this, Array.prototype.slice.call(arguments, 0, opt_numArgs));
  };
};
goog.functions.nth = function(n) {
  return function() {
    return arguments[n];
  };
};
goog.functions.partialRight = function(fn, var_args) {
  var rightArgs = Array.prototype.slice.call(arguments, 1);
  return function() {
    var newArgs = Array.prototype.slice.call(arguments);
    newArgs.push.apply(newArgs, rightArgs);
    return fn.apply(this, newArgs);
  };
};
goog.functions.withReturnValue = function(f, retValue) {
  return goog.functions.sequence(f, goog.functions.constant(retValue));
};
goog.functions.equalTo = function(value, opt_useLooseComparison) {
  return function(other) {
    return opt_useLooseComparison ? value == other : value === other;
  };
};
goog.functions.compose = function(fn, var_args) {
  var functions = arguments, length = functions.length;
  return function() {
    var result;
    length && (result = functions[length - 1].apply(this, arguments));
    for (var i = length - 2;0 <= i;i--) {
      result = functions[i].call(this, result);
    }
    return result;
  };
};
goog.functions.sequence = function(var_args) {
  var functions = arguments, length = functions.length;
  return function() {
    for (var result, i = 0;i < length;i++) {
      result = functions[i].apply(this, arguments);
    }
    return result;
  };
};
goog.functions.and = function(var_args) {
  var functions = arguments, length = functions.length;
  return function() {
    for (var i = 0;i < length;i++) {
      if (!functions[i].apply(this, arguments)) {
        return !1;
      }
    }
    return !0;
  };
};
goog.functions.or = function(var_args) {
  var functions = arguments, length = functions.length;
  return function() {
    for (var i = 0;i < length;i++) {
      if (functions[i].apply(this, arguments)) {
        return !0;
      }
    }
    return !1;
  };
};
goog.functions.not = function(f) {
  return function() {
    return !f.apply(this, arguments);
  };
};
goog.functions.create = function(constructor, var_args) {
  var temp = function() {
  };
  temp.prototype = constructor.prototype;
  var obj = new temp;
  constructor.apply(obj, Array.prototype.slice.call(arguments, 1));
  return obj;
};
goog.functions.CACHE_RETURN_VALUE = !0;
goog.functions.cacheReturnValue = function(fn) {
  var called = !1, value;
  return function() {
    if (!goog.functions.CACHE_RETURN_VALUE) {
      return fn();
    }
    called || (value = fn(), called = !0);
    return value;
  };
};
goog.functions.once = function(f) {
  var inner = f;
  return function() {
    if (inner) {
      var tmp = inner;
      inner = null;
      tmp();
    }
  };
};
goog.functions.debounce = function(f, interval, opt_scope) {
  var timeout = 0;
  return function(var_args) {
    goog.global.clearTimeout(timeout);
    var args = arguments;
    timeout = goog.global.setTimeout(function() {
      f.apply(opt_scope, args);
    }, interval);
  };
};
goog.functions.throttle = function(f, interval, opt_scope) {
  var timeout = 0, shouldFire = !1, args = [], handleTimeout = function() {
    timeout = 0;
    shouldFire && (shouldFire = !1, fire());
  }, fire = function() {
    timeout = goog.global.setTimeout(handleTimeout, interval);
    f.apply(opt_scope, args);
  };
  return function(var_args) {
    args = arguments;
    timeout ? shouldFire = !0 : fire();
  };
};
goog.functions.rateLimit = function(f, interval, opt_scope) {
  var timeout = 0, handleTimeout = function() {
    timeout = 0;
  };
  return function(var_args) {
    timeout || (timeout = goog.global.setTimeout(handleTimeout, interval), f.apply(opt_scope, arguments));
  };
};
goog.async.throwException = function(exception) {
  goog.global.setTimeout(function() {
    throw exception;
  }, 0);
};
goog.async.nextTick = function(callback, opt_context, opt_useSetImmediate) {
  var cb = callback;
  opt_context && (cb = goog.bind(callback, opt_context));
  cb = goog.async.nextTick.wrapCallback_(cb);
  goog.isFunction(goog.global.setImmediate) && (opt_useSetImmediate || goog.async.nextTick.useSetImmediate_()) ? goog.global.setImmediate(cb) : (goog.async.nextTick.setImmediate_ || (goog.async.nextTick.setImmediate_ = goog.async.nextTick.getSetImmediateEmulator_()), goog.async.nextTick.setImmediate_(cb));
};
goog.async.nextTick.useSetImmediate_ = function() {
  return goog.global.Window && goog.global.Window.prototype && !goog.labs.userAgent.browser.isEdge() && goog.global.Window.prototype.setImmediate == goog.global.setImmediate ? !1 : !0;
};
goog.async.nextTick.getSetImmediateEmulator_ = function() {
  var Channel = goog.global.MessageChannel;
  "undefined" === typeof Channel && "undefined" !== typeof window && window.postMessage && window.addEventListener && !goog.labs.userAgent.engine.isPresto() && (Channel = function() {
    var iframe = document.createElement("IFRAME");
    iframe.style.display = "none";
    iframe.src = "";
    document.documentElement.appendChild(iframe);
    var win = iframe.contentWindow, doc = win.document;
    doc.open();
    doc.write("");
    doc.close();
    var message = "callImmediate" + Math.random(), origin = "file:" == win.location.protocol ? "*" : win.location.protocol + "//" + win.location.host, onmessage = goog.bind(function(e) {
      if (("*" == origin || e.origin == origin) && e.data == message) {
        this.port1.onmessage();
      }
    }, this);
    win.addEventListener("message", onmessage, !1);
    this.port1 = {};
    this.port2 = {postMessage:function() {
      win.postMessage(message, origin);
    }};
  });
  if ("undefined" !== typeof Channel && !goog.labs.userAgent.browser.isIE()) {
    var channel = new Channel, head = {}, tail = head;
    channel.port1.onmessage = function() {
      if (goog.isDef(head.next)) {
        head = head.next;
        var cb = head.cb;
        head.cb = null;
        cb();
      }
    };
    return function(cb) {
      tail.next = {cb:cb};
      tail = tail.next;
      channel.port2.postMessage(0);
    };
  }
  return "undefined" !== typeof document && "onreadystatechange" in document.createElement("SCRIPT") ? function(cb) {
    var script = document.createElement("SCRIPT");
    script.onreadystatechange = function() {
      script.onreadystatechange = null;
      script.parentNode.removeChild(script);
      script = null;
      cb();
      cb = null;
    };
    document.documentElement.appendChild(script);
  } : function(cb) {
    goog.global.setTimeout(cb, 0);
  };
};
goog.async.nextTick.wrapCallback_ = goog.functions.identity;
goog.debug.entryPointRegistry.register(function(transformer) {
  goog.async.nextTick.wrapCallback_ = transformer;
});
goog.async.WorkQueue = function() {
  this.workTail_ = this.workHead_ = null;
};
goog.async.WorkQueue.DEFAULT_MAX_UNUSED = 100;
goog.async.WorkQueue.freelist_ = new goog.async.FreeList(function() {
  return new goog.async.WorkItem;
}, function(item) {
  item.reset();
}, goog.async.WorkQueue.DEFAULT_MAX_UNUSED);
goog.async.WorkQueue.prototype.add = function(fn, scope) {
  var item = this.getUnusedItem_();
  item.set(fn, scope);
  this.workTail_ ? this.workTail_.next = item : (goog.asserts.assert(!this.workHead_), this.workHead_ = item);
  this.workTail_ = item;
};
goog.async.WorkQueue.prototype.remove = function() {
  var item = null;
  this.workHead_ && (item = this.workHead_, this.workHead_ = this.workHead_.next, this.workHead_ || (this.workTail_ = null), item.next = null);
  return item;
};
goog.async.WorkQueue.prototype.returnUnused = function(item) {
  goog.async.WorkQueue.freelist_.put(item);
};
goog.async.WorkQueue.prototype.getUnusedItem_ = function() {
  return goog.async.WorkQueue.freelist_.get();
};
goog.async.WorkItem = function() {
  this.next = this.scope = this.fn = null;
};
goog.async.WorkItem.prototype.set = function(fn, scope) {
  this.fn = fn;
  this.scope = scope;
  this.next = null;
};
goog.async.WorkItem.prototype.reset = function() {
  this.next = this.scope = this.fn = null;
};
goog.async.run = function(callback, opt_context) {
  goog.async.run.schedule_ || goog.async.run.initializeRunner_();
  goog.async.run.workQueueScheduled_ || (goog.async.run.schedule_(), goog.async.run.workQueueScheduled_ = !0);
  goog.async.run.workQueue_.add(callback, opt_context);
};
goog.async.run.initializeRunner_ = function() {
  if (-1 != String(goog.global.Promise).indexOf("[native code]")) {
    var promise = goog.global.Promise.resolve(void 0);
    goog.async.run.schedule_ = function() {
      promise.then(goog.async.run.processWorkQueue);
    };
  } else {
    goog.async.run.schedule_ = function() {
      goog.async.nextTick(goog.async.run.processWorkQueue);
    };
  }
};
goog.async.run.forceNextTick = function(opt_realSetTimeout) {
  goog.async.run.schedule_ = function() {
    goog.async.nextTick(goog.async.run.processWorkQueue);
    opt_realSetTimeout && opt_realSetTimeout(goog.async.run.processWorkQueue);
  };
};
goog.async.run.workQueueScheduled_ = !1;
goog.async.run.workQueue_ = new goog.async.WorkQueue;
goog.DEBUG && (goog.async.run.resetQueue = function() {
  goog.async.run.workQueueScheduled_ = !1;
  goog.async.run.workQueue_ = new goog.async.WorkQueue;
});
goog.async.run.processWorkQueue = function() {
  for (var item = null;item = goog.async.run.workQueue_.remove();) {
    try {
      item.fn.call(item.scope);
    } catch (e) {
      goog.async.throwException(e);
    }
    goog.async.run.workQueue_.returnUnused(item);
  }
  goog.async.run.workQueueScheduled_ = !1;
};
goog.promise = {};
goog.promise.Resolver = function() {
};
goog.Thenable = function() {
};
goog.Thenable.prototype.then = function(opt_onFulfilled, opt_onRejected, opt_context) {
};
goog.Thenable.IMPLEMENTED_BY_PROP = "$goog_Thenable";
goog.Thenable.addImplementation = function(ctor) {
  ctor.prototype.then = ctor.prototype.then;
  ctor.prototype[goog.Thenable.IMPLEMENTED_BY_PROP] = !0;
};
goog.Thenable.isImplementedBy = function(object) {
  if (!object) {
    return !1;
  }
  try {
    return !!object[goog.Thenable.IMPLEMENTED_BY_PROP];
    return !!object.$goog_Thenable;
  } catch (e) {
    return !1;
  }
};
goog.Promise = function(resolver, opt_context) {
  this.state_ = goog.Promise.State_.PENDING;
  this.result_ = void 0;
  this.callbackEntriesTail_ = this.callbackEntries_ = this.parent_ = null;
  this.executing_ = !1;
  0 < goog.Promise.UNHANDLED_REJECTION_DELAY ? this.unhandledRejectionId_ = 0 : 0 == goog.Promise.UNHANDLED_REJECTION_DELAY && (this.hadUnhandledRejection_ = !1);
  goog.Promise.LONG_STACK_TRACES && (this.stack_ = [], this.addStackTrace_(Error("created")), this.currentStep_ = 0);
  if (resolver != goog.nullFunction) {
    try {
      var self = this;
      resolver.call(opt_context, function(value) {
        self.resolve_(goog.Promise.State_.FULFILLED, value);
      }, function(reason) {
        if (goog.DEBUG && !(reason instanceof goog.Promise.CancellationError)) {
          try {
            if (reason instanceof Error) {
              throw reason;
            }
            throw Error("Promise rejected.");
          } catch (e) {
          }
        }
        self.resolve_(goog.Promise.State_.REJECTED, reason);
      });
    } catch (e) {
      this.resolve_(goog.Promise.State_.REJECTED, e);
    }
  }
};
goog.Promise.LONG_STACK_TRACES = !1;
goog.Promise.UNHANDLED_REJECTION_DELAY = 0;
goog.Promise.State_ = {PENDING:0, BLOCKED:1, FULFILLED:2, REJECTED:3};
goog.Promise.CallbackEntry_ = function() {
  this.next = this.context = this.onRejected = this.onFulfilled = this.child = null;
  this.always = !1;
};
goog.Promise.CallbackEntry_.prototype.reset = function() {
  this.context = this.onRejected = this.onFulfilled = this.child = null;
  this.always = !1;
};
goog.Promise.DEFAULT_MAX_UNUSED = 100;
goog.Promise.freelist_ = new goog.async.FreeList(function() {
  return new goog.Promise.CallbackEntry_;
}, function(item) {
  item.reset();
}, goog.Promise.DEFAULT_MAX_UNUSED);
goog.Promise.getCallbackEntry_ = function(onFulfilled, onRejected, context) {
  var entry = goog.Promise.freelist_.get();
  entry.onFulfilled = onFulfilled;
  entry.onRejected = onRejected;
  entry.context = context;
  return entry;
};
goog.Promise.returnEntry_ = function(entry) {
  goog.Promise.freelist_.put(entry);
};
goog.Promise.resolve = function(opt_value) {
  if (opt_value instanceof goog.Promise) {
    return opt_value;
  }
  var promise = new goog.Promise(goog.nullFunction);
  promise.resolve_(goog.Promise.State_.FULFILLED, opt_value);
  return promise;
};
goog.Promise.reject = function(opt_reason) {
  return new goog.Promise(function(resolve, reject) {
    reject(opt_reason);
  });
};
goog.Promise.resolveThen_ = function(value, onFulfilled, onRejected) {
  goog.Promise.maybeThen_(value, onFulfilled, onRejected, null) || goog.async.run(goog.partial(onFulfilled, value));
};
goog.Promise.race = function(promises) {
  return new goog.Promise(function(resolve, reject) {
    promises.length || resolve(void 0);
    for (var i = 0, promise;i < promises.length;i++) {
      promise = promises[i], goog.Promise.resolveThen_(promise, resolve, reject);
    }
  });
};
goog.Promise.all = function(promises) {
  return new goog.Promise(function(resolve, reject) {
    var toFulfill = promises.length, values = [];
    if (toFulfill) {
      for (var onFulfill = function(index, value) {
        toFulfill--;
        values[index] = value;
        0 == toFulfill && resolve(values);
      }, onReject = function(reason) {
        reject(reason);
      }, i = 0, promise;i < promises.length;i++) {
        promise = promises[i], goog.Promise.resolveThen_(promise, goog.partial(onFulfill, i), onReject);
      }
    } else {
      resolve(values);
    }
  });
};
goog.Promise.allSettled = function(promises) {
  return new goog.Promise(function(resolve, reject) {
    var toSettle = promises.length, results = [];
    if (toSettle) {
      for (var onSettled = function(index, fulfilled, result) {
        toSettle--;
        results[index] = fulfilled ? {fulfilled:!0, value:result} : {fulfilled:!1, reason:result};
        0 == toSettle && resolve(results);
      }, i = 0, promise;i < promises.length;i++) {
        promise = promises[i], goog.Promise.resolveThen_(promise, goog.partial(onSettled, i, !0), goog.partial(onSettled, i, !1));
      }
    } else {
      resolve(results);
    }
  });
};
goog.Promise.firstFulfilled = function(promises) {
  return new goog.Promise(function(resolve, reject) {
    var toReject = promises.length, reasons = [];
    if (toReject) {
      for (var onFulfill = function(value) {
        resolve(value);
      }, onReject = function(index, reason) {
        toReject--;
        reasons[index] = reason;
        0 == toReject && reject(reasons);
      }, i = 0, promise;i < promises.length;i++) {
        promise = promises[i], goog.Promise.resolveThen_(promise, onFulfill, goog.partial(onReject, i));
      }
    } else {
      resolve(void 0);
    }
  });
};
goog.Promise.withResolver = function() {
  var resolve, reject, promise = new goog.Promise(function(rs, rj) {
    resolve = rs;
    reject = rj;
  });
  return new goog.Promise.Resolver_(promise, resolve, reject);
};
goog.Promise.prototype.then = function(opt_onFulfilled, opt_onRejected, opt_context) {
  null != opt_onFulfilled && goog.asserts.assertFunction(opt_onFulfilled, "opt_onFulfilled should be a function.");
  null != opt_onRejected && goog.asserts.assertFunction(opt_onRejected, "opt_onRejected should be a function. Did you pass opt_context as the second argument instead of the third?");
  goog.Promise.LONG_STACK_TRACES && this.addStackTrace_(Error("then"));
  return this.addChildPromise_(goog.isFunction(opt_onFulfilled) ? opt_onFulfilled : null, goog.isFunction(opt_onRejected) ? opt_onRejected : null, opt_context);
};
goog.Thenable.addImplementation(goog.Promise);
goog.Promise.prototype.thenVoid = function(opt_onFulfilled, opt_onRejected, opt_context) {
  null != opt_onFulfilled && goog.asserts.assertFunction(opt_onFulfilled, "opt_onFulfilled should be a function.");
  null != opt_onRejected && goog.asserts.assertFunction(opt_onRejected, "opt_onRejected should be a function. Did you pass opt_context as the second argument instead of the third?");
  goog.Promise.LONG_STACK_TRACES && this.addStackTrace_(Error("then"));
  this.addCallbackEntry_(goog.Promise.getCallbackEntry_(opt_onFulfilled || goog.nullFunction, opt_onRejected || null, opt_context));
};
goog.Promise.prototype.cancel = function(opt_message) {
  this.state_ == goog.Promise.State_.PENDING && goog.async.run(function() {
    var err = new goog.Promise.CancellationError(opt_message);
    this.cancelInternal_(err);
  }, this);
};
goog.Promise.prototype.cancelInternal_ = function(err) {
  this.state_ == goog.Promise.State_.PENDING && (this.parent_ ? (this.parent_.cancelChild_(this, err), this.parent_ = null) : this.resolve_(goog.Promise.State_.REJECTED, err));
};
goog.Promise.prototype.cancelChild_ = function(childPromise, err) {
  if (this.callbackEntries_) {
    for (var childCount = 0, childEntry = null, beforeChildEntry = null, entry = this.callbackEntries_;entry && (entry.always || (childCount++, entry.child == childPromise && (childEntry = entry), !(childEntry && 1 < childCount)));entry = entry.next) {
      childEntry || (beforeChildEntry = entry);
    }
    childEntry && (this.state_ == goog.Promise.State_.PENDING && 1 == childCount ? this.cancelInternal_(err) : (beforeChildEntry ? this.removeEntryAfter_(beforeChildEntry) : this.popEntry_(), this.executeCallback_(childEntry, goog.Promise.State_.REJECTED, err)));
  }
};
goog.Promise.prototype.addCallbackEntry_ = function(callbackEntry) {
  this.hasEntry_() || this.state_ != goog.Promise.State_.FULFILLED && this.state_ != goog.Promise.State_.REJECTED || this.scheduleCallbacks_();
  this.queueEntry_(callbackEntry);
};
goog.Promise.prototype.addChildPromise_ = function(onFulfilled, onRejected, opt_context) {
  var callbackEntry = goog.Promise.getCallbackEntry_(null, null, null);
  callbackEntry.child = new goog.Promise(function(resolve, reject) {
    callbackEntry.onFulfilled = onFulfilled ? function(value) {
      try {
        var result = onFulfilled.call(opt_context, value);
        resolve(result);
      } catch (err) {
        reject(err);
      }
    } : resolve;
    callbackEntry.onRejected = onRejected ? function(reason) {
      try {
        var result = onRejected.call(opt_context, reason);
        !goog.isDef(result) && reason instanceof goog.Promise.CancellationError ? reject(reason) : resolve(result);
      } catch (err) {
        reject(err);
      }
    } : reject;
  });
  callbackEntry.child.parent_ = this;
  this.addCallbackEntry_(callbackEntry);
  return callbackEntry.child;
};
goog.Promise.prototype.unblockAndFulfill_ = function(value) {
  goog.asserts.assert(this.state_ == goog.Promise.State_.BLOCKED);
  this.state_ = goog.Promise.State_.PENDING;
  this.resolve_(goog.Promise.State_.FULFILLED, value);
};
goog.Promise.prototype.unblockAndReject_ = function(reason) {
  goog.asserts.assert(this.state_ == goog.Promise.State_.BLOCKED);
  this.state_ = goog.Promise.State_.PENDING;
  this.resolve_(goog.Promise.State_.REJECTED, reason);
};
goog.Promise.prototype.resolve_ = function(state, x) {
  this.state_ == goog.Promise.State_.PENDING && (this === x && (state = goog.Promise.State_.REJECTED, x = new TypeError("Promise cannot resolve to itself")), this.state_ = goog.Promise.State_.BLOCKED, goog.Promise.maybeThen_(x, this.unblockAndFulfill_, this.unblockAndReject_, this) || (this.result_ = x, this.state_ = state, this.parent_ = null, this.scheduleCallbacks_(), state != goog.Promise.State_.REJECTED || x instanceof goog.Promise.CancellationError || goog.Promise.addUnhandledRejection_(this, 
  x)));
};
goog.Promise.maybeThen_ = function(value, onFulfilled, onRejected, context) {
  if (value instanceof goog.Promise) {
    return value.thenVoid(onFulfilled, onRejected, context), !0;
  }
  if (goog.Thenable.isImplementedBy(value)) {
    return value.then(onFulfilled, onRejected, context), !0;
  }
  if (goog.isObject(value)) {
    try {
      var then = value.then;
      if (goog.isFunction(then)) {
        return goog.Promise.tryThen_(value, then, onFulfilled, onRejected, context), !0;
      }
    } catch (e) {
      return onRejected.call(context, e), !0;
    }
  }
  return !1;
};
goog.Promise.tryThen_ = function(thenable, then, onFulfilled, onRejected, context) {
  var called = !1, resolve = function(value) {
    called || (called = !0, onFulfilled.call(context, value));
  }, reject = function(reason) {
    called || (called = !0, onRejected.call(context, reason));
  };
  try {
    then.call(thenable, resolve, reject);
  } catch (e) {
    reject(e);
  }
};
goog.Promise.prototype.scheduleCallbacks_ = function() {
  this.executing_ || (this.executing_ = !0, goog.async.run(this.executeCallbacks_, this));
};
goog.Promise.prototype.hasEntry_ = function() {
  return !!this.callbackEntries_;
};
goog.Promise.prototype.queueEntry_ = function(entry) {
  goog.asserts.assert(null != entry.onFulfilled);
  this.callbackEntriesTail_ ? this.callbackEntriesTail_.next = entry : this.callbackEntries_ = entry;
  this.callbackEntriesTail_ = entry;
};
goog.Promise.prototype.popEntry_ = function() {
  var entry = null;
  this.callbackEntries_ && (entry = this.callbackEntries_, this.callbackEntries_ = entry.next, entry.next = null);
  this.callbackEntries_ || (this.callbackEntriesTail_ = null);
  null != entry && goog.asserts.assert(null != entry.onFulfilled);
  return entry;
};
goog.Promise.prototype.removeEntryAfter_ = function(previous) {
  goog.asserts.assert(this.callbackEntries_);
  goog.asserts.assert(null != previous);
  previous.next == this.callbackEntriesTail_ && (this.callbackEntriesTail_ = previous);
  previous.next = previous.next.next;
};
goog.Promise.prototype.executeCallbacks_ = function() {
  for (var entry = null;entry = this.popEntry_();) {
    goog.Promise.LONG_STACK_TRACES && this.currentStep_++, this.executeCallback_(entry, this.state_, this.result_);
  }
  this.executing_ = !1;
};
goog.Promise.prototype.executeCallback_ = function(callbackEntry, state, result) {
  state == goog.Promise.State_.REJECTED && callbackEntry.onRejected && !callbackEntry.always && this.removeUnhandledRejection_();
  if (callbackEntry.child) {
    callbackEntry.child.parent_ = null, goog.Promise.invokeCallback_(callbackEntry, state, result);
  } else {
    try {
      callbackEntry.always ? callbackEntry.onFulfilled.call(callbackEntry.context) : goog.Promise.invokeCallback_(callbackEntry, state, result);
    } catch (err) {
      goog.Promise.handleRejection_.call(null, err);
    }
  }
  goog.Promise.returnEntry_(callbackEntry);
};
goog.Promise.invokeCallback_ = function(callbackEntry, state, result) {
  state == goog.Promise.State_.FULFILLED ? callbackEntry.onFulfilled.call(callbackEntry.context, result) : callbackEntry.onRejected && callbackEntry.onRejected.call(callbackEntry.context, result);
};
goog.Promise.prototype.addStackTrace_ = function(err) {
  if (goog.Promise.LONG_STACK_TRACES && goog.isString(err.stack)) {
    var trace = err.stack.split("\n", 4)[3], message = err.message, message = message + Array(11 - message.length).join(" ");
    this.stack_.push(message + trace);
  }
};
goog.Promise.prototype.appendLongStack_ = function(err) {
  if (goog.Promise.LONG_STACK_TRACES && err && goog.isString(err.stack) && this.stack_.length) {
    for (var longTrace = ["Promise trace:"], promise = this;promise;promise = promise.parent_) {
      for (var i = this.currentStep_;0 <= i;i--) {
        longTrace.push(promise.stack_[i]);
      }
      longTrace.push("Value: [" + (promise.state_ == goog.Promise.State_.REJECTED ? "REJECTED" : "FULFILLED") + "] <" + String(promise.result_) + ">");
    }
    err.stack += "\n\n" + longTrace.join("\n");
  }
};
goog.Promise.prototype.removeUnhandledRejection_ = function() {
  if (0 < goog.Promise.UNHANDLED_REJECTION_DELAY) {
    for (var p = this;p && p.unhandledRejectionId_;p = p.parent_) {
      goog.global.clearTimeout(p.unhandledRejectionId_), p.unhandledRejectionId_ = 0;
    }
  } else {
    if (0 == goog.Promise.UNHANDLED_REJECTION_DELAY) {
      for (p = this;p && p.hadUnhandledRejection_;p = p.parent_) {
        p.hadUnhandledRejection_ = !1;
      }
    }
  }
};
goog.Promise.addUnhandledRejection_ = function(promise, reason) {
  0 < goog.Promise.UNHANDLED_REJECTION_DELAY ? promise.unhandledRejectionId_ = goog.global.setTimeout(function() {
    promise.appendLongStack_(reason);
    goog.Promise.handleRejection_.call(null, reason);
  }, goog.Promise.UNHANDLED_REJECTION_DELAY) : 0 == goog.Promise.UNHANDLED_REJECTION_DELAY && (promise.hadUnhandledRejection_ = !0, goog.async.run(function() {
    promise.hadUnhandledRejection_ && (promise.appendLongStack_(reason), goog.Promise.handleRejection_.call(null, reason));
  }));
};
goog.Promise.handleRejection_ = goog.async.throwException;
goog.Promise.setUnhandledRejectionHandler = function(handler) {
  goog.Promise.handleRejection_ = handler;
};
goog.Promise.CancellationError = function(opt_message) {
  goog.debug.Error.call(this, opt_message);
};
goog.inherits(goog.Promise.CancellationError, goog.debug.Error);
goog.Promise.CancellationError.prototype.name = "cancel";
goog.Promise.Resolver_ = function(promise, resolve, reject) {
  this.promise = promise;
  this.resolve = resolve;
  this.reject = reject;
};
goog.setTestOnly("goog.testing.TestCase");
goog.testing.TestCase = function(opt_name) {
  this.name_ = opt_name || "Untitled Test Case";
  this.tests_ = [];
  this.testsToRun_ = null;
  this.order = goog.testing.TestCase.Order.SORTED;
  this.runNextTestCallback_ = goog.nullFunction;
  this.depth_ = 0;
  this.curTest_ = null;
  this.result_ = new goog.testing.TestCase.Result(this);
  this.thrownAssertionExceptions_ = [];
  this.failOnUnreportedAsserts = !0;
  this.promiseTimeout = 1000;
};
goog.testing.TestCase.Order = {NATURAL:"natural", RANDOM:"random", SORTED:"sorted"};
goog.testing.TestCase.prototype.getName = function() {
  return this.name_;
};
goog.testing.TestCase.maxRunTime = 200;
goog.testing.TestCase.MAX_STACK_DEPTH_ = 50;
goog.testing.TestCase.protectedSetTimeout_ = goog.global.setTimeout;
goog.testing.TestCase.protectedClearTimeout_ = goog.global.clearTimeout;
goog.testing.TestCase.protectedDate_ = Date;
goog.testing.TestCase.setTimeoutAsString_ = String(goog.global.setTimeout);
goog.testing.TestCase.currentTestName = null;
goog.testing.TestCase.IS_IE = "undefined" == typeof opera && !!goog.global.navigator && -1 != goog.global.navigator.userAgent.indexOf("MSIE");
goog.testing.TestCase.prototype.started = !1;
goog.testing.TestCase.prototype.running = !1;
goog.testing.TestCase.prototype.startTime_ = 0;
goog.testing.TestCase.prototype.batchTime_ = 0;
goog.testing.TestCase.prototype.currentTestPointer_ = 0;
goog.testing.TestCase.prototype.onCompleteCallback_ = null;
goog.testing.TestCase.prototype.add = function(test) {
  goog.asserts.assert(test);
  if (this.started) {
    throw Error("Tests cannot be added after execute() has been called. Test: " + test.name);
  }
  this.tests_.push(test);
};
goog.testing.TestCase.prototype.setTests = function(tests) {
  this.tests_ = tests;
};
goog.testing.TestCase.prototype.getCount = function() {
  return this.tests_.length;
};
goog.testing.TestCase.prototype.getActuallyRunCount = function() {
  return this.testsToRun_ ? goog.object.getCount(this.testsToRun_) : 0;
};
goog.testing.TestCase.prototype.next = function() {
  for (var test;test = this.tests_[this.currentTestPointer_++];) {
    if (!this.testsToRun_ || this.testsToRun_[test.name] || this.testsToRun_[this.currentTestPointer_ - 1]) {
      return test;
    }
  }
  return null;
};
goog.testing.TestCase.prototype.reset = function() {
  this.currentTestPointer_ = 0;
  this.result_ = new goog.testing.TestCase.Result(this);
};
goog.testing.TestCase.prototype.setCompletedCallback = function(fn) {
  this.onCompleteCallback_ = fn;
};
goog.testing.TestCase.prototype.setOrder = function(order) {
  this.order = order;
};
goog.testing.TestCase.prototype.setTestsToRun = function(testsToRun) {
  this.testsToRun_ = testsToRun;
};
goog.testing.TestCase.prototype.shouldRunTests = function() {
  return !0;
};
goog.testing.TestCase.prototype.execute = function() {
  this.prepareForRun_() && (this.log("Starting tests: " + this.name_), this.cycleTests());
};
goog.testing.TestCase.prototype.prepareForRun_ = function() {
  this.started = !0;
  this.reset();
  this.startTime_ = this.now();
  this.running = !0;
  this.result_.totalCount = this.getCount();
  return this.shouldRunTests() ? !0 : (this.log("shouldRunTests() returned false, skipping these tests."), this.result_.testSuppressed = !0, this.finalize(), !1);
};
goog.testing.TestCase.prototype.finalize = function() {
  this.saveMessage("Done");
  this.tearDownPage();
  var restoredSetTimeout = goog.testing.TestCase.protectedSetTimeout_ == goog.global.setTimeout && goog.testing.TestCase.protectedClearTimeout_ == goog.global.clearTimeout;
  !restoredSetTimeout && goog.testing.TestCase.IS_IE && String(goog.global.setTimeout) == goog.testing.TestCase.setTimeoutAsString_ && (restoredSetTimeout = !0);
  if (!restoredSetTimeout) {
    this.saveMessage("ERROR: Test did not restore setTimeout and clearTimeout");
    var err = new goog.testing.TestCase.Error(this.name_, "ERROR: Test did not restore setTimeout and clearTimeout");
    this.result_.errors.push(err);
  }
  goog.global.clearTimeout = goog.testing.TestCase.protectedClearTimeout_;
  goog.global.setTimeout = goog.testing.TestCase.protectedSetTimeout_;
  this.endTime_ = this.now();
  this.running = !1;
  this.result_.runTime = this.endTime_ - this.startTime_;
  this.result_.numFilesLoaded = this.countNumFilesLoaded_();
  this.result_.complete = !0;
  this.log(this.result_.getSummary());
  this.result_.isSuccess() ? this.log("Tests complete") : this.log("Tests Failed");
  if (this.onCompleteCallback_) {
    var fn = this.onCompleteCallback_;
    fn();
    this.onCompleteCallback_ = null;
  }
};
goog.testing.TestCase.prototype.saveMessage = function(message) {
  this.result_.messages.push(this.getTimeStamp_() + "  " + message);
};
goog.testing.TestCase.prototype.isInsideMultiTestRunner = function() {
  var top = goog.global.top;
  return top && "undefined" != typeof top._allTests;
};
goog.testing.TestCase.prototype.log = function(val) {
  !this.isInsideMultiTestRunner() && goog.global.console && ("string" == typeof val && (val = this.getTimeStamp_() + " : " + val), val instanceof Error && val.stack ? goog.global.console.log(val, val.message, val.stack) : goog.global.console.log(val));
};
goog.testing.TestCase.prototype.isSuccess = function() {
  return !!this.result_ && this.result_.isSuccess();
};
goog.testing.TestCase.prototype.getReport = function(opt_verbose) {
  var rv = [];
  this.running ? rv.push(this.name_ + " [RUNNING]") : rv.push(this.name_ + " [" + (this.result_.isSuccess() ? "PASSED" : "FAILED") + "]");
  goog.global.location && rv.push(this.trimPath_(goog.global.location.href));
  rv.push(this.result_.getSummary());
  opt_verbose ? rv.push(".", this.result_.messages.join("\n")) : this.result_.isSuccess() || rv.push(this.result_.errors.join("\n"));
  rv.push(" ");
  return rv.join("\n");
};
goog.testing.TestCase.prototype.getRunTime = function() {
  return this.result_.runTime;
};
goog.testing.TestCase.prototype.getNumFilesLoaded = function() {
  return this.result_.numFilesLoaded;
};
goog.testing.TestCase.prototype.getTestResults = function() {
  return this.result_.resultsByName;
};
goog.testing.TestCase.prototype.runTests = function() {
  try {
    this.setUpPage();
  } catch (e) {
    this.exceptionBeforeTest = e;
  }
  this.execute();
};
goog.testing.TestCase.prototype.runTestsReturningPromise = function() {
  try {
    this.setUpPage();
  } catch (e) {
    this.exceptionBeforeTest = e;
  }
  if (!this.prepareForRun_()) {
    return goog.Promise.resolve(this.result_);
  }
  this.log("Starting tests: " + this.name_);
  this.saveMessage("Start");
  this.batchTime_ = this.now();
  return new goog.Promise(function(resolve) {
    this.runNextTestCallback_ = resolve;
    this.runNextTest_();
  }, this);
};
goog.testing.TestCase.prototype.runNextTest_ = function() {
  (this.curTest_ = this.next()) && this.running ? (this.result_.runCount++, this.log("Running test: " + this.curTest_.name), this.maybeFailTestEarly(this.curTest_) ? this.finishTestInvocation_() : (goog.testing.TestCase.currentTestName = this.curTest_.name, this.invokeTestFunction_(this.setUp, this.safeRunTest_, this.safeTearDown_, "setUp"))) : (this.finalize(), this.runNextTestCallback_(this.result_));
};
goog.testing.TestCase.prototype.safeRunTest_ = function() {
  this.invokeTestFunction_(goog.bind(this.curTest_.ref, this.curTest_.scope), this.safeTearDown_, this.safeTearDown_, this.curTest_.name);
};
goog.testing.TestCase.prototype.safeTearDown_ = function(opt_error) {
  1 == arguments.length && this.doError(this.curTest_, opt_error);
  this.invokeTestFunction_(this.tearDown, this.finishTestInvocation_, this.finishTestInvocation_, "tearDown");
};
goog.testing.TestCase.prototype.invokeTestFunction_ = function(fn, onSuccess, onFailure, fnName) {
  var testCase = this;
  this.thrownAssertionExceptions_ = [];
  try {
    var retval = fn.call(this);
    if (goog.Thenable.isImplementedBy(retval) || goog.isFunction(retval && retval.then)) {
      var promise = goog.Promise.resolve(retval), self = this, promise = this.rejectIfPromiseTimesOut_(promise, self.promiseTimeout, "Timed out while waiting for a promise returned from " + fnName + " to resolve. Set goog.testing.TestCase.getActiveTestCase().promiseTimeout to adjust the timeout.");
      promise.then(function() {
        self.resetBatchTimeAfterPromise_();
        0 == testCase.thrownAssertionExceptions_.length ? onSuccess.call(self) : onFailure.call(self, testCase.reportUnpropagatedAssertionExceptions_(fnName));
      }, function(e) {
        self.resetBatchTimeAfterPromise_();
        onFailure.call(self, e);
      });
    } else {
      0 == this.thrownAssertionExceptions_.length ? onSuccess.call(this) : onFailure.call(this, this.reportUnpropagatedAssertionExceptions_(fnName));
    }
  } catch (e) {
    onFailure.call(this, e);
  }
};
goog.testing.TestCase.prototype.reportUnpropagatedAssertionExceptions_ = function(testName) {
  for (var numExceptions = this.thrownAssertionExceptions_.length, i = 0;i < numExceptions;i++) {
    this.recordError_(testName, this.thrownAssertionExceptions_[i]);
  }
  return new goog.testing.JsUnitException("One or more assertions were raised but not caught by the testing framework. These assertions may have been unintentionally captured by a catch block or a thenCatch resolution of a Promise.");
};
goog.testing.TestCase.prototype.resetBatchTimeAfterPromise_ = function() {
  this.batchTime_ = this.now();
};
goog.testing.TestCase.prototype.finishTestInvocation_ = function(opt_error) {
  1 == arguments.length && this.doError(this.curTest_, opt_error);
  this.curTest_.name in this.result_.resultsByName && this.result_.resultsByName[this.curTest_.name].length || this.doSuccess(this.curTest_);
  goog.testing.TestCase.currentTestName = null;
  this.depth_ > goog.testing.TestCase.MAX_STACK_DEPTH_ || this.now() - this.batchTime_ > goog.testing.TestCase.maxRunTime ? (this.saveMessage("Breaking async"), this.timeout(goog.bind(this.startNextBatch_, this), 0)) : (++this.depth_, this.runNextTest_());
};
goog.testing.TestCase.prototype.startNextBatch_ = function() {
  this.batchTime_ = this.now();
  this.depth_ = 0;
  this.runNextTest_();
};
goog.testing.TestCase.prototype.orderTests_ = function() {
  switch(this.order) {
    case goog.testing.TestCase.Order.RANDOM:
      for (var i = this.tests_.length;1 < i;) {
        var j = Math.floor(Math.random() * i);
        i--;
        var tmp = this.tests_[i];
        this.tests_[i] = this.tests_[j];
        this.tests_[j] = tmp;
      }
      break;
    case goog.testing.TestCase.Order.SORTED:
      this.tests_.sort(function(t1, t2) {
        return t1.name == t2.name ? 0 : t1.name < t2.name ? -1 : 1;
      });
  }
};
goog.testing.TestCase.prototype.getGlobals = function(opt_prefix) {
  return goog.testing.TestCase.getGlobals(opt_prefix);
};
goog.testing.TestCase.getGlobals = function(opt_prefix) {
  return "undefined" != typeof goog.global.RuntimeObject ? [goog.global.RuntimeObject((opt_prefix || "") + "*"), goog.global] : [goog.global];
};
goog.testing.TestCase.getActiveTestCase = function() {
  var gTestRunner = goog.global.G_testRunner;
  return gTestRunner && gTestRunner.testCase ? gTestRunner.testCase : null;
};
goog.testing.TestCase.invalidateAssertionException = function(e) {
  var testCase = goog.testing.TestCase.getActiveTestCase();
  testCase ? testCase.invalidateAssertionException(e) : goog.global.console.error("Failed to remove expected exception: no test case is installed.");
};
goog.testing.TestCase.prototype.setUpPage = function() {
};
goog.testing.TestCase.prototype.tearDownPage = function() {
};
goog.testing.TestCase.prototype.setUp = function() {
};
goog.testing.TestCase.prototype.tearDown = function() {
};
goog.testing.TestCase.prototype.setBatchTime = function(batchTime) {
  this.batchTime_ = batchTime;
};
goog.testing.TestCase.prototype.createTestFromAutoDiscoveredFunction = function(name, ref) {
  return new goog.testing.TestCase.Test(name, ref, goog.global);
};
goog.testing.TestCase.prototype.autoDiscoverLifecycle = function(opt_obj) {
  var obj = opt_obj || goog.global;
  obj.setUp && (this.setUp = goog.bind(obj.setUp, obj));
  obj.tearDown && (this.tearDown = goog.bind(obj.tearDown, obj));
  obj.setUpPage && (this.setUpPage = goog.bind(obj.setUpPage, obj));
  obj.tearDownPage && (this.tearDownPage = goog.bind(obj.tearDownPage, obj));
  obj.runTests && (this.runTests = goog.bind(obj.runTests, obj));
  obj.shouldRunTests && (this.shouldRunTests = goog.bind(obj.shouldRunTests, obj));
};
goog.testing.TestCase.prototype.autoDiscoverTests = function() {
  for (var testSources = this.getGlobals("test"), foundTests = [], i = 0;i < testSources.length;i++) {
    var testSource = testSources[i], name;
    for (name in testSource) {
      if (/^test/.test(name)) {
        var ref;
        try {
          ref = testSource[name];
        } catch (ex) {
          ref = void 0;
        }
        goog.isFunction(ref) && foundTests.push(this.createTestFromAutoDiscoveredFunction(name, ref));
      }
    }
  }
  for (i = 0;i < foundTests.length;i++) {
    this.add(foundTests[i]);
  }
  this.orderTests_();
  this.log(this.getCount() + " tests auto-discovered");
  this.autoDiscoverLifecycle();
};
goog.testing.TestCase.prototype.maybeFailTestEarly = function(testCase) {
  return this.exceptionBeforeTest ? (testCase.name = "setUpPage for " + testCase.name, this.doError(testCase, this.exceptionBeforeTest), !0) : !1;
};
goog.testing.TestCase.prototype.cycleTests = function() {
  this.saveMessage("Start");
  this.batchTime_ = this.now();
  this.running && (this.runNextTestCallback_ = goog.nullFunction, this.runNextTest_());
};
goog.testing.TestCase.prototype.countNumFilesLoaded_ = function() {
  for (var scripts = goog.dom.getElementsByTagName("SCRIPT"), count = 0, i = 0, n = scripts.length;i < n;i++) {
    scripts[i].src && count++;
  }
  return count;
};
goog.testing.TestCase.prototype.timeout = function(fn, time) {
  var protectedSetTimeout = goog.testing.TestCase.protectedSetTimeout_;
  return protectedSetTimeout(fn, time);
};
goog.testing.TestCase.prototype.clearTimeout = function(id) {
  var protectedClearTimeout = goog.testing.TestCase.protectedClearTimeout_;
  protectedClearTimeout(id);
};
goog.testing.TestCase.prototype.now = function() {
  return (new goog.testing.TestCase.protectedDate_).getTime();
};
goog.testing.TestCase.prototype.getTimeStamp_ = function() {
  var d = new goog.testing.TestCase.protectedDate_, millis = "00" + d.getMilliseconds(), millis = millis.substr(millis.length - 3);
  return this.pad_(d.getHours()) + ":" + this.pad_(d.getMinutes()) + ":" + this.pad_(d.getSeconds()) + "." + millis;
};
goog.testing.TestCase.prototype.pad_ = function(number) {
  return 10 > number ? "0" + number : String(number);
};
goog.testing.TestCase.prototype.trimPath_ = function(path) {
  return path.substring(path.indexOf("google3") + 8);
};
goog.testing.TestCase.prototype.doSuccess = function(test) {
  this.result_.successCount++;
  test.name in this.result_.resultsByName || (this.result_.resultsByName[test.name] = []);
  var message = test.name + " : PASSED";
  this.saveMessage(message);
  this.log(message);
};
goog.testing.TestCase.prototype.recordError_ = function(testName, opt_e) {
  var message = testName + " : FAILED";
  this.log(message);
  this.saveMessage(message);
  var err = this.logError(testName, opt_e);
  this.result_.errors.push(err);
  testName in this.result_.resultsByName ? this.result_.resultsByName[testName].push(err.toString()) : this.result_.resultsByName[testName] = [err.toString()];
};
goog.testing.TestCase.prototype.doError = function(test, opt_e) {
  this.recordError_(test.name, opt_e);
};
goog.testing.TestCase.prototype.raiseAssertionException = function(e) {
  this.failOnUnreportedAsserts && this.thrownAssertionExceptions_.push(e);
  throw e;
};
goog.testing.TestCase.prototype.invalidateAssertionException = function(e) {
  this.failOnUnreportedAsserts && goog.array.remove(this.thrownAssertionExceptions_, e);
};
goog.testing.TestCase.prototype.logError = function(name, opt_e) {
  var errMsg = null, stack = null;
  opt_e ? (this.log(opt_e), goog.isString(opt_e) ? errMsg = opt_e : (errMsg = opt_e.message || opt_e.description || opt_e.toString(), stack = opt_e.stack ? goog.testing.stacktrace.canonicalize(opt_e.stack) : opt_e.stackTrace)) : errMsg = "An unknown error occurred";
  var err = new goog.testing.TestCase.Error(name, errMsg, stack);
  opt_e && opt_e.isJsUnitException && opt_e.loggedJsUnitException || this.saveMessage(err.toString());
  opt_e && opt_e.isJsUnitException && (opt_e.loggedJsUnitException = !0);
  return err;
};
goog.testing.TestCase.Test = function(name, ref, opt_scope) {
  this.name = name;
  this.ref = ref;
  this.scope = opt_scope || null;
};
goog.testing.TestCase.Test.prototype.execute = function() {
  this.ref.call(this.scope);
};
goog.testing.TestCase.Result = function(testCase) {
  this.testCase_ = testCase;
  this.numFilesLoaded = this.runTime = this.successCount = this.runCount = this.totalCount = 0;
  this.testSuppressed = !1;
  this.resultsByName = {};
  this.errors = [];
  this.messages = [];
  this.complete = !1;
};
goog.testing.TestCase.Result.prototype.isSuccess = function() {
  return this.complete && 0 == this.errors.length;
};
goog.testing.TestCase.Result.prototype.getSummary = function() {
  var summary = this.runCount + " of " + this.totalCount + " tests run in " + this.runTime + "ms.\n";
  if (this.testSuppressed) {
    summary += "Tests not run because shouldRunTests() returned false.";
  } else {
    var failures = this.totalCount - this.successCount, suppressionMessage = "", countOfRunTests = this.testCase_.getActuallyRunCount();
    countOfRunTests && (failures = countOfRunTests - this.successCount, suppressionMessage = ", " + (this.totalCount - countOfRunTests) + " suppressed by querystring");
    summary += this.successCount + " passed, " + failures + " failed" + suppressionMessage + ".\n" + Math.round(this.runTime / this.runCount) + " ms/test. " + this.numFilesLoaded + " files loaded.";
  }
  return summary;
};
goog.testing.TestCase.initializeTestRunner = function(testCase) {
  testCase.autoDiscoverTests();
  if (goog.global.location) {
    var search = goog.global.location.search;
    testCase.setOrder(goog.testing.TestCase.parseOrder_(search) || goog.testing.TestCase.Order.SORTED);
    testCase.setTestsToRun(goog.testing.TestCase.parseRunTests_(search));
  }
  var gTestRunner = goog.global.G_testRunner;
  if (gTestRunner) {
    gTestRunner.initialize(testCase);
  } else {
    throw Error("G_testRunner is undefined. Please ensure goog.testing.jsunit is included.");
  }
};
goog.testing.TestCase.parseOrder_ = function(search) {
  var order = null, orderMatch = search.match(/(?:\?|&)order=(natural|random|sorted)/i);
  orderMatch && (order = orderMatch[1].toLowerCase());
  return order;
};
goog.testing.TestCase.parseRunTests_ = function(search) {
  var testsToRun = null, runTestsMatch = search.match(/(?:\?|&)runTests=([^?&]+)/i);
  if (runTestsMatch) {
    for (var testsToRun = {}, arr = runTestsMatch[1].split(","), i = 0, len = arr.length;i < len;i++) {
      testsToRun[arr[i]] = !0;
    }
  }
  return testsToRun;
};
goog.testing.TestCase.prototype.rejectIfPromiseTimesOut_ = function(promise, timeoutInMs, errorMsg) {
  var self = this, start = this.now();
  return new goog.Promise(function(resolve, reject) {
    var timeoutId = self.timeout(function() {
      var elapsed = self.now() - start;
      reject(Error(errorMsg + "\nElapsed time: " + elapsed + "ms."));
    }, timeoutInMs);
    promise.then(resolve, reject);
    var clearTimeout = goog.bind(self.clearTimeout, self, timeoutId);
    promise.then(clearTimeout, clearTimeout);
  });
};
goog.testing.TestCase.Error = function(source, message, opt_stack) {
  this.source = source;
  this.message = message;
  this.stack = null;
  if (opt_stack) {
    this.stack = opt_stack;
  } else {
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, goog.testing.TestCase.Error);
    } else {
      var stack = Error().stack;
      stack && (this.stack = stack);
    }
  }
};
goog.testing.TestCase.Error.prototype.toString = function() {
  return "ERROR in " + this.source + "\n" + this.message + (this.stack ? "\n" + this.stack : "");
};
goog.setTestOnly("goog.testing.AsyncTestCase");
goog.testing.AsyncTestCase = function(opt_name) {
  goog.testing.TestCase.call(this, opt_name);
};
goog.inherits(goog.testing.AsyncTestCase, goog.testing.TestCase);
goog.testing.AsyncTestCase.ControlBreakingException = function(opt_message) {
  this.message = opt_message || "";
};
goog.inherits(goog.testing.AsyncTestCase.ControlBreakingException, Error);
goog.testing.AsyncTestCase.ControlBreakingException.TO_STRING = "[AsyncTestCase.ControlBreakingException]";
goog.testing.AsyncTestCase.ControlBreakingException.prototype.isControlBreakingException = !0;
goog.testing.AsyncTestCase.ControlBreakingException.prototype.toString = function() {
  return goog.testing.AsyncTestCase.ControlBreakingException.TO_STRING;
};
goog.testing.AsyncTestCase.prototype.stepTimeout = 1000;
goog.testing.AsyncTestCase.prototype.timeToSleepAfterFailure = 500;
goog.testing.AsyncTestCase.prototype.enableDebugLogs_ = !1;
goog.testing.AsyncTestCase.prototype.curStepName_ = "";
goog.testing.AsyncTestCase.prototype.nextStepName_ = "";
goog.testing.AsyncTestCase.prototype.timeoutHandle_ = 0;
goog.testing.AsyncTestCase.prototype.cleanedUp_ = !1;
goog.testing.AsyncTestCase.prototype.inException_ = !1;
goog.testing.AsyncTestCase.prototype.isReady_ = !0;
goog.testing.AsyncTestCase.prototype.expectedSignalCount_ = 0;
goog.testing.AsyncTestCase.prototype.receivedSignalCount_ = 0;
goog.testing.AsyncTestCase.prototype.returnWillPump_ = !1;
goog.testing.AsyncTestCase.prototype.numControlExceptionsExpected_ = 0;
goog.testing.AsyncTestCase.createAndInstall = function(opt_name) {
  var asyncTestCase = new goog.testing.AsyncTestCase(opt_name);
  goog.testing.TestCase.initializeTestRunner(asyncTestCase);
  return asyncTestCase;
};
goog.testing.AsyncTestCase.prototype.waitForAsync = function(opt_name) {
  this.isReady_ = !1;
  this.curStepName_ = opt_name || this.curStepName_;
  this.stopTimeoutTimer_();
  this.startTimeoutTimer_();
};
goog.testing.AsyncTestCase.prototype.endCurrentStep_ = function() {
  this.isReady_ || (this.isReady_ = !0, this.stopTimeoutTimer_(), this.timeout(goog.bind(this.pump_, this, null), 0));
};
goog.testing.AsyncTestCase.prototype.waitForSignals = function(times, opt_name) {
  this.expectedSignalCount_ += times;
  this.receivedSignalCount_ < this.expectedSignalCount_ && this.waitForAsync(opt_name);
};
goog.testing.AsyncTestCase.prototype.signal = function() {
  ++this.receivedSignalCount_ === this.expectedSignalCount_ && 0 < this.expectedSignalCount_ && this.endCurrentStep_();
};
goog.testing.AsyncTestCase.prototype.doAsyncError = function(opt_e) {
  if (opt_e && opt_e.isControlBreakingException) {
    throw opt_e;
  }
  this.stopTimeoutTimer_();
  var fakeTestObj = new goog.testing.TestCase.Test(this.curStepName_, goog.nullFunction);
  this.activeTest && (fakeTestObj.name = this.activeTest.name + " [" + fakeTestObj.name + "]");
  this.activeTest ? this.doError(fakeTestObj, opt_e) : this.exceptionBeforeTest = opt_e;
  this.timeout(goog.bind(this.pump_, this, this.doAsyncErrorTearDown_), this.timeToSleepAfterFailure);
  this.returnWillPump_ || (this.numControlExceptionsExpected_ += 1, this.dbgLog_("doAsynError: numControlExceptionsExpected_ = " + this.numControlExceptionsExpected_ + " and throwing exception."));
  var message = "";
  "string" == typeof opt_e ? message = opt_e : opt_e && opt_e.message && (message = opt_e.message);
  throw new goog.testing.AsyncTestCase.ControlBreakingException(message);
};
goog.testing.AsyncTestCase.prototype.runTests = function() {
  this.hookAssert_();
  this.hookOnError_();
  goog.testing.TestCase.currentTestName = null;
  this.setNextStep_(this.doSetUpPage_, "setUpPage");
  this.pump_();
};
goog.testing.AsyncTestCase.prototype.cycleTests = function() {
  this.saveMessage("Start");
  this.setNextStep_(this.doIteration_, "doIteration");
  this.pump_();
};
goog.testing.AsyncTestCase.prototype.finalize = function() {
  this.unhookAll_();
  this.setNextStep_(null, "finalized");
  goog.testing.AsyncTestCase.superClass_.finalize.call(this);
};
goog.testing.AsyncTestCase.prototype.dbgLog_ = function(message) {
  this.enableDebugLogs_ && this.log("AsyncTestCase - " + message);
};
goog.testing.AsyncTestCase.prototype.doTopOfStackAsyncError_ = function(opt_e) {
  try {
    this.doAsyncError(opt_e);
  } catch (e) {
    if (e.isControlBreakingException) {
      --this.numControlExceptionsExpected_, this.dbgLog_("doTopOfStackAsyncError_: numControlExceptionsExpected_ = " + this.numControlExceptionsExpected_ + " and catching exception.");
    } else {
      throw e;
    }
  }
};
goog.testing.AsyncTestCase.prototype.doAsyncErrorTearDown_ = function() {
  if (this.inException_) {
    this.endCurrentStep_();
  } else {
    this.isReady_ = this.inException_ = !0;
    var stepFuncAfterError = this.nextStepFunc_, stepNameAfterError = "TestCase.execute (after error)";
    this.activeTest && (stepFuncAfterError = this.doIteration_, stepNameAfterError = "doIteration (after error)");
    this.setNextStep_(function() {
      this.inException_ = !1;
      this.setNextStep_(stepFuncAfterError, stepNameAfterError);
    }, "doAsyncError");
    this.cleanedUp_ || (this.cleanedUp_ = !0, this.tearDown());
  }
};
goog.testing.AsyncTestCase.prototype.hookAssert_ = function() {
  if (!this.origAssert_) {
    this.origAssert_ = _assert;
    this.origFail_ = fail;
    var self = this;
    _assert = function() {
      try {
        self.origAssert_.apply(this, arguments);
      } catch (e) {
        self.dbgLog_("Wrapping failed assert()"), self.doAsyncError(e);
      }
    };
    fail = function() {
      try {
        self.origFail_.apply(this, arguments);
      } catch (e) {
        self.dbgLog_("Wrapping fail()"), self.doAsyncError(e);
      }
    };
  }
};
goog.testing.AsyncTestCase.prototype.hookOnError_ = function() {
  if (!this.origOnError_) {
    this.origOnError_ = window.onerror;
    var self = this;
    window.onerror = function(error, url, line) {
      if (-1 != String(error).indexOf(goog.testing.AsyncTestCase.ControlBreakingException.TO_STRING) && self.numControlExceptionsExpected_) {
        return --self.numControlExceptionsExpected_, self.dbgLog_("window.onerror: numControlExceptionsExpected_ = " + self.numControlExceptionsExpected_ + " and ignoring exception. " + error), !0;
      }
      self.dbgLog_("window.onerror caught exception.");
      var message;
      self.doTopOfStackAsyncError_(error + "\nURL: " + url + "\nLine: " + line);
      return !1;
    };
  }
};
goog.testing.AsyncTestCase.prototype.unhookAll_ = function() {
  this.origOnError_ && (window.onerror = this.origOnError_, this.origOnError_ = null, _assert = this.origAssert_, this.origAssert_ = null, fail = this.origFail_, this.origFail_ = null);
};
goog.testing.AsyncTestCase.prototype.startTimeoutTimer_ = function() {
  !this.timeoutHandle_ && 0 < this.stepTimeout && (this.timeoutHandle_ = this.timeout(goog.bind(function() {
    this.dbgLog_("Timeout timer fired with id " + this.timeoutHandle_);
    this.timeoutHandle_ = 0;
    this.doTopOfStackAsyncError_("Timed out while waiting for continueTesting() to be called.");
  }, this, null), this.stepTimeout), this.dbgLog_("Started timeout timer with id " + this.timeoutHandle_));
};
goog.testing.AsyncTestCase.prototype.stopTimeoutTimer_ = function() {
  this.timeoutHandle_ && (this.dbgLog_("Clearing timeout timer with id " + this.timeoutHandle_), this.clearTimeout(this.timeoutHandle_), this.timeoutHandle_ = 0);
};
goog.testing.AsyncTestCase.prototype.setNextStep_ = function(func, name) {
  this.nextStepFunc_ = func && goog.bind(func, this);
  this.nextStepName_ = name;
};
goog.testing.AsyncTestCase.prototype.callTopOfStackFunc_ = function(func) {
  try {
    return func.call(this), {controlBreakingExceptionThrown:!1, message:""};
  } catch (e) {
    this.dbgLog_("Caught exception in callTopOfStackFunc_");
    try {
      return this.doAsyncError(e), {controlBreakingExceptionThrown:!1, message:""};
    } catch (e2) {
      if (!e2.isControlBreakingException) {
        throw e2;
      }
      return {controlBreakingExceptionThrown:!0, message:e2.message};
    }
  }
};
goog.testing.AsyncTestCase.prototype.pump_ = function(opt_doFirst) {
  if (this.returnWillPump_) {
    opt_doFirst && opt_doFirst.call(this);
  } else {
    this.setBatchTime(this.now());
    this.returnWillPump_ = !0;
    var topFuncResult = {};
    for (opt_doFirst && (topFuncResult = this.callTopOfStackFunc_(opt_doFirst));this.isReady_ && this.nextStepFunc_ && !topFuncResult.controlBreakingExceptionThrown;) {
      if (this.curStepFunc_ = this.nextStepFunc_, this.curStepName_ = this.nextStepName_, this.nextStepFunc_ = null, this.nextStepName_ = "", this.dbgLog_("Performing step: " + this.curStepName_), topFuncResult = this.callTopOfStackFunc_(this.curStepFunc_), this.now() - this.batchTime_ > goog.testing.TestCase.maxRunTime && !topFuncResult.controlBreakingExceptionThrown) {
        this.saveMessage("Breaking async");
        var self = this;
        this.timeout(function() {
          self.pump_();
        }, 100);
        break;
      }
    }
    this.returnWillPump_ = !1;
  }
};
goog.testing.AsyncTestCase.prototype.doSetUpPage_ = function() {
  this.setNextStep_(this.execute, "TestCase.execute");
  this.setUpPage();
};
goog.testing.AsyncTestCase.prototype.doIteration_ = function() {
  this.receivedSignalCount_ = this.expectedSignalCount_ = 0;
  this.activeTest = this.next();
  goog.testing.TestCase.currentTestName = this.activeTest ? this.activeTest.name : null;
  this.activeTest && this.running ? (this.result_.runCount++, this.maybeFailTestEarly(this.activeTest) ? this.setNextStep_(this.doIteration_, "doIteration") : this.setNextStep_(this.doSetUp_, "setUp")) : this.finalize();
};
goog.testing.AsyncTestCase.prototype.doSetUp_ = function() {
  this.log("Running test: " + this.activeTest.name);
  this.cleanedUp_ = !1;
  this.setNextStep_(this.doExecute_, this.activeTest.name);
  this.setUp();
};
goog.testing.AsyncTestCase.prototype.doExecute_ = function() {
  this.setNextStep_(this.doTearDown_, "tearDown");
  this.activeTest.execute();
};
goog.testing.AsyncTestCase.prototype.doTearDown_ = function() {
  this.cleanedUp_ = !0;
  this.setNextStep_(this.doNext_, "doNext");
  this.tearDown();
};
goog.testing.AsyncTestCase.prototype.doNext_ = function() {
  this.setNextStep_(this.doIteration_, "doIteration");
  this.doSuccess(this.activeTest);
};
goog.setTestOnly("goog.testing.TestRunner");
goog.testing.TestRunner = function() {
  this.errors = [];
  this.testCase = null;
  this.initialized = !1;
  this.errorFilter_ = this.logEl_ = null;
  this.strict_ = !0;
};
goog.testing.TestRunner.prototype.initialize = function(testCase) {
  if (this.testCase && this.testCase.running) {
    throw Error("The test runner is already waiting for a test to complete");
  }
  this.testCase = testCase;
  this.initialized = !0;
};
goog.testing.TestRunner.prototype.setStrict = function(strict) {
  this.strict_ = strict;
};
goog.testing.TestRunner.prototype.isInitialized = function() {
  return this.initialized;
};
goog.testing.TestRunner.prototype.isFinished = function() {
  return 0 < this.errors.length || this.initialized && !!this.testCase && this.testCase.started && !this.testCase.running;
};
goog.testing.TestRunner.prototype.isSuccess = function() {
  return !this.hasErrors() && !!this.testCase && this.testCase.isSuccess();
};
goog.testing.TestRunner.prototype.hasErrors = function() {
  return 0 < this.errors.length;
};
goog.testing.TestRunner.prototype.logError = function(msg) {
  this.errorFilter_ && !this.errorFilter_.call(null, msg) || this.errors.push(msg);
};
goog.testing.TestRunner.prototype.logTestFailure = function(ex) {
  var testName = goog.testing.TestCase.currentTestName;
  if (this.testCase) {
    this.testCase.logError(testName, ex);
  } else {
    throw Error("Test runner not initialized with a test case. Original exception: " + ex.message);
  }
};
goog.testing.TestRunner.prototype.setErrorFilter = function(fn) {
  this.errorFilter_ = fn;
};
goog.testing.TestRunner.prototype.getReport = function(opt_verbose) {
  var report = [];
  this.testCase && report.push(this.testCase.getReport(opt_verbose));
  0 < this.errors.length && (report.push("JavaScript errors detected by test runner:"), report.push.apply(report, this.errors), report.push("\n"));
  return report.join("\n");
};
goog.testing.TestRunner.prototype.getRunTime = function() {
  return this.testCase ? this.testCase.getRunTime() : 0;
};
goog.testing.TestRunner.prototype.getNumFilesLoaded = function() {
  return this.testCase ? this.testCase.getNumFilesLoaded() : 0;
};
goog.testing.TestRunner.prototype.execute = function() {
  if (!this.testCase) {
    throw Error("The test runner must be initialized with a test case before execute can be called.");
  }
  if (this.strict_ && 0 == this.testCase.getCount()) {
    throw Error("No tests found in given test case: " + this.testCase.getName() + ". By default, the test runner fails if a test case has no tests. To modify this behavior, see goog.testing.TestRunner's setStrict() method, or G_testRunner.setStrict()");
  }
  this.testCase.setCompletedCallback(goog.bind(this.onComplete_, this));
  goog.testing.TestRunner.shouldUsePromises_(this.testCase) ? this.testCase.runTestsReturningPromise() : this.testCase.runTests();
};
goog.testing.TestRunner.shouldUsePromises_ = function(testCase) {
  return testCase.constructor === goog.testing.TestCase;
};
goog.testing.TestRunner.prototype.onComplete_ = function() {
  var log = this.testCase.getReport(!0);
  0 < this.errors.length && (log += "\n" + this.errors.join("\n"));
  if (!this.logEl_) {
    var el = document.getElementById("closureTestRunnerLog");
    null == el && (el = goog.dom.createElement("DIV"), document.body.appendChild(el));
    this.logEl_ = el;
  }
  this.writeLog(log);
  var runAgainLink = goog.dom.createElement("A");
  runAgainLink.style.display = "inline-block";
  runAgainLink.style.fontSize = "small";
  runAgainLink.style.marginBottom = "16px";
  runAgainLink.href = "";
  runAgainLink.onclick = goog.bind(function() {
    this.execute();
    return !1;
  }, this);
  runAgainLink.innerHTML = "Run again without reloading";
  this.logEl_.appendChild(runAgainLink);
};
goog.testing.TestRunner.prototype.writeLog = function(log) {
  for (var lines = log.split("\n"), i = 0;i < lines.length;i++) {
    var line = lines[i], color, isFailOrError = /FAILED/.test(line) || /ERROR/.test(line);
    color = /PASSED/.test(line) ? "darkgreen" : isFailOrError ? "darkred" : "#333";
    var div = goog.dom.createElement("DIV");
    "> " == line.substr(0, 2) ? div.innerHTML = line : div.appendChild(document.createTextNode(line));
    var testNameMatch = /(\S+) (\[[^\]]*] )?: (FAILED|ERROR|PASSED)/.exec(line);
    if (testNameMatch) {
      var newSearch = "runTests=" + testNameMatch[1], search = window.location.search;
      if (search) {
        var oldTests = /runTests=([^&]*)/.exec(search), newSearch = oldTests ? search.substr(0, oldTests.index) + newSearch + search.substr(oldTests.index + oldTests[0].length) : search + "&" + newSearch;
      } else {
        newSearch = "?" + newSearch;
      }
      var href = window.location.href, hash = window.location.hash;
      hash && "#" != hash.charAt(0) && (hash = "#" + hash);
      var href = href.split("#")[0].split("?")[0] + newSearch + hash, a = goog.dom.createElement("A");
      a.innerHTML = "(run individually)";
      a.style.fontSize = "0.8em";
      a.style.color = "#888";
      a.href = href;
      div.appendChild(document.createTextNode(" "));
      div.appendChild(a);
    }
    div.style.color = color;
    div.style.font = "normal 100% monospace";
    div.style.wordWrap = "break-word";
    0 == i && (div.style.padding = "20px", div.style.marginBottom = "10px", isFailOrError ? (div.style.border = "5px solid " + color, div.style.backgroundColor = "#ffeeee") : (div.style.border = "1px solid black", div.style.backgroundColor = "#eeffee"));
    try {
      div.style.whiteSpace = "pre-wrap";
    } catch (e) {
    }
    2 > i && (div.style.fontWeight = "bold");
    this.logEl_.appendChild(div);
  }
};
goog.testing.TestRunner.prototype.log = function(s) {
  this.testCase && this.testCase.log(s);
};
goog.testing.TestRunner.prototype.getTestResults = function() {
  return this.testCase ? this.testCase.getTestResults() : null;
};
goog.setTestOnly("goog.testing.jsunit");
goog.testing.jsunit = {};
goog.testing.jsunit.BASE_PATH = "../../third_party/java/jsunit/core/app/";
goog.testing.jsunit.CORE_SCRIPT = goog.testing.jsunit.BASE_PATH + "jsUnitCore.js";
goog.testing.jsunit.AUTO_RUN_ONLOAD = !0;
goog.testing.jsunit.AUTO_RUN_DELAY_IN_MS = 500;
(function() {
  if (!(goog.global.G_testRunner instanceof goog.testing.TestRunner)) {
    Error.stackTraceLimit = 50;
    var realTimeout = window.setTimeout;
    if (top.JsUnitTestManager || top.jsUnitTestManager) {
      document.write('<script type="text/javascript" src="' + (goog.basePath + goog.testing.jsunit.CORE_SCRIPT) + '">\x3c/script>');
    } else {
      var tr = new goog.testing.TestRunner;
      goog.exportSymbol("G_testRunner", tr);
      goog.exportSymbol("G_testRunner.initialize", tr.initialize);
      goog.exportSymbol("G_testRunner.isInitialized", tr.isInitialized);
      goog.exportSymbol("G_testRunner.isFinished", tr.isFinished);
      goog.exportSymbol("G_testRunner.isSuccess", tr.isSuccess);
      goog.exportSymbol("G_testRunner.getReport", tr.getReport);
      goog.exportSymbol("G_testRunner.getRunTime", tr.getRunTime);
      goog.exportSymbol("G_testRunner.getNumFilesLoaded", tr.getNumFilesLoaded);
      goog.exportSymbol("G_testRunner.setStrict", tr.setStrict);
      goog.exportSymbol("G_testRunner.logTestFailure", tr.logTestFailure);
      goog.exportSymbol("G_testRunner.getTestResults", tr.getTestResults);
      goog.global.debug || goog.exportSymbol("debug", goog.bind(tr.log, tr));
      goog.global.G_errorFilter && tr.setErrorFilter(goog.global.G_errorFilter);
      var onerror = window.onerror;
      window.onerror = function(error, url, line) {
        onerror && onerror(error, url, line);
        "object" == typeof error ? error.target && "SCRIPT" == error.target.tagName ? tr.logError("UNKNOWN ERROR: Script " + error.target.src) : tr.logError("UNKNOWN ERROR: No error information available.") : tr.logError("JS ERROR: " + error + "\nURL: " + url + "\nLine: " + line);
      };
      if (goog.testing.jsunit.AUTO_RUN_ONLOAD) {
        var onload = window.onload;
        window.onload = function(e) {
          onload && onload(e);
          realTimeout(function() {
            tr.initialized || goog.testing.TestCase.initializeTestRunner(new goog.testing.TestCase(document.title));
            tr.execute();
          }, goog.testing.jsunit.AUTO_RUN_DELAY_IN_MS);
          window.onload = null;
        };
      }
    }
  }
})();
goog.structs = {};
goog.structs.Collection = function() {
};
goog.iter = {};
goog.iter.StopIteration = "StopIteration" in goog.global ? goog.global.StopIteration : {message:"StopIteration", stack:""};
goog.iter.Iterator = function() {
};
goog.iter.Iterator.prototype.next = function() {
  throw goog.iter.StopIteration;
};
goog.iter.Iterator.prototype.__iterator__ = function(opt_keys) {
  return this;
};
goog.iter.toIterator = function(iterable) {
  if (iterable instanceof goog.iter.Iterator) {
    return iterable;
  }
  if ("function" == typeof iterable.__iterator__) {
    return iterable.__iterator__(!1);
  }
  if (goog.isArrayLike(iterable)) {
    var i = 0, newIter = new goog.iter.Iterator;
    newIter.next = function() {
      for (;;) {
        if (i >= iterable.length) {
          throw goog.iter.StopIteration;
        }
        if (i in iterable) {
          return iterable[i++];
        }
        i++;
      }
    };
    return newIter;
  }
  throw Error("Not implemented");
};
goog.iter.forEach = function(iterable, f, opt_obj) {
  if (goog.isArrayLike(iterable)) {
    try {
      goog.array.forEach(iterable, f, opt_obj);
    } catch (ex) {
      if (ex !== goog.iter.StopIteration) {
        throw ex;
      }
    }
  } else {
    iterable = goog.iter.toIterator(iterable);
    try {
      for (;;) {
        f.call(opt_obj, iterable.next(), void 0, iterable);
      }
    } catch (ex$0) {
      if (ex$0 !== goog.iter.StopIteration) {
        throw ex$0;
      }
    }
  }
};
goog.iter.filter = function(iterable, f, opt_obj) {
  var iterator = goog.iter.toIterator(iterable), newIter = new goog.iter.Iterator;
  newIter.next = function() {
    for (;;) {
      var val = iterator.next();
      if (f.call(opt_obj, val, void 0, iterator)) {
        return val;
      }
    }
  };
  return newIter;
};
goog.iter.filterFalse = function(iterable, f, opt_obj) {
  return goog.iter.filter(iterable, goog.functions.not(f), opt_obj);
};
goog.iter.range = function(startOrStop, opt_stop, opt_step) {
  var start = 0, stop = startOrStop, step = opt_step || 1;
  1 < arguments.length && (start = startOrStop, stop = opt_stop);
  if (0 == step) {
    throw Error("Range step argument must not be zero");
  }
  var newIter = new goog.iter.Iterator;
  newIter.next = function() {
    if (0 < step && start >= stop || 0 > step && start <= stop) {
      throw goog.iter.StopIteration;
    }
    var rv = start;
    start += step;
    return rv;
  };
  return newIter;
};
goog.iter.join = function(iterable, deliminator) {
  return goog.iter.toArray(iterable).join(deliminator);
};
goog.iter.map = function(iterable, f, opt_obj) {
  var iterator = goog.iter.toIterator(iterable), newIter = new goog.iter.Iterator;
  newIter.next = function() {
    var val = iterator.next();
    return f.call(opt_obj, val, void 0, iterator);
  };
  return newIter;
};
goog.iter.reduce = function(iterable, f, val$jscomp$0, opt_obj) {
  var rval = val$jscomp$0;
  goog.iter.forEach(iterable, function(val) {
    rval = f.call(opt_obj, rval, val);
  });
  return rval;
};
goog.iter.some = function(iterable, f, opt_obj) {
  iterable = goog.iter.toIterator(iterable);
  try {
    for (;;) {
      if (f.call(opt_obj, iterable.next(), void 0, iterable)) {
        return !0;
      }
    }
  } catch (ex) {
    if (ex !== goog.iter.StopIteration) {
      throw ex;
    }
  }
  return !1;
};
goog.iter.every = function(iterable, f, opt_obj) {
  iterable = goog.iter.toIterator(iterable);
  try {
    for (;;) {
      if (!f.call(opt_obj, iterable.next(), void 0, iterable)) {
        return !1;
      }
    }
  } catch (ex) {
    if (ex !== goog.iter.StopIteration) {
      throw ex;
    }
  }
  return !0;
};
goog.iter.chain = function(var_args) {
  return goog.iter.chainFromIterable(arguments);
};
goog.iter.chainFromIterable = function(iterable) {
  var iterator = goog.iter.toIterator(iterable), iter = new goog.iter.Iterator, current = null;
  iter.next = function() {
    for (;;) {
      if (null == current) {
        var it = iterator.next();
        current = goog.iter.toIterator(it);
      }
      try {
        return current.next();
      } catch (ex) {
        if (ex !== goog.iter.StopIteration) {
          throw ex;
        }
        current = null;
      }
    }
  };
  return iter;
};
goog.iter.dropWhile = function(iterable, f, opt_obj) {
  var iterator = goog.iter.toIterator(iterable), newIter = new goog.iter.Iterator, dropping = !0;
  newIter.next = function() {
    for (;;) {
      var val = iterator.next();
      if (!dropping || !f.call(opt_obj, val, void 0, iterator)) {
        return dropping = !1, val;
      }
    }
  };
  return newIter;
};
goog.iter.takeWhile = function(iterable, f, opt_obj) {
  var iterator = goog.iter.toIterator(iterable), iter = new goog.iter.Iterator;
  iter.next = function() {
    var val = iterator.next();
    if (f.call(opt_obj, val, void 0, iterator)) {
      return val;
    }
    throw goog.iter.StopIteration;
  };
  return iter;
};
goog.iter.toArray = function(iterable) {
  if (goog.isArrayLike(iterable)) {
    return goog.array.toArray(iterable);
  }
  iterable = goog.iter.toIterator(iterable);
  var array = [];
  goog.iter.forEach(iterable, function(val) {
    array.push(val);
  });
  return array;
};
goog.iter.equals = function(iterable1, iterable2, opt_equalsFn) {
  var pairs = goog.iter.zipLongest({}, iterable1, iterable2), equalsFn = opt_equalsFn || goog.array.defaultCompareEquality;
  return goog.iter.every(pairs, function(pair) {
    return equalsFn(pair[0], pair[1]);
  });
};
goog.iter.nextOrValue = function(iterable, defaultValue) {
  try {
    return goog.iter.toIterator(iterable).next();
  } catch (e) {
    if (e != goog.iter.StopIteration) {
      throw e;
    }
    return defaultValue;
  }
};
goog.iter.product = function(var_args) {
  if (goog.array.some(arguments, function(arr) {
    return !arr.length;
  }) || !arguments.length) {
    return new goog.iter.Iterator;
  }
  var iter = new goog.iter.Iterator, arrays = arguments, indicies = goog.array.repeat(0, arrays.length);
  iter.next = function() {
    if (indicies) {
      for (var retVal = goog.array.map(indicies, function(valueIndex, arrayIndex) {
        return arrays[arrayIndex][valueIndex];
      }), i = indicies.length - 1;0 <= i;i--) {
        goog.asserts.assert(indicies);
        if (indicies[i] < arrays[i].length - 1) {
          indicies[i]++;
          break;
        }
        if (0 == i) {
          indicies = null;
          break;
        }
        indicies[i] = 0;
      }
      return retVal;
    }
    throw goog.iter.StopIteration;
  };
  return iter;
};
goog.iter.cycle = function(iterable) {
  var baseIterator = goog.iter.toIterator(iterable), cache = [], cacheIndex = 0, iter = new goog.iter.Iterator, useCache = !1;
  iter.next = function() {
    var returnElement = null;
    if (!useCache) {
      try {
        return returnElement = baseIterator.next(), cache.push(returnElement), returnElement;
      } catch (e) {
        if (e != goog.iter.StopIteration || goog.array.isEmpty(cache)) {
          throw e;
        }
        useCache = !0;
      }
    }
    returnElement = cache[cacheIndex];
    cacheIndex = (cacheIndex + 1) % cache.length;
    return returnElement;
  };
  return iter;
};
goog.iter.count = function(opt_start, opt_step) {
  var counter = opt_start || 0, step = goog.isDef(opt_step) ? opt_step : 1, iter = new goog.iter.Iterator;
  iter.next = function() {
    var returnValue = counter;
    counter += step;
    return returnValue;
  };
  return iter;
};
goog.iter.repeat = function(value) {
  var iter = new goog.iter.Iterator;
  iter.next = goog.functions.constant(value);
  return iter;
};
goog.iter.accumulate = function(iterable) {
  var iterator = goog.iter.toIterator(iterable), total = 0, iter = new goog.iter.Iterator;
  iter.next = function() {
    return total += iterator.next();
  };
  return iter;
};
goog.iter.zip = function(var_args) {
  var args = arguments, iter = new goog.iter.Iterator;
  if (0 < args.length) {
    var iterators = goog.array.map(args, goog.iter.toIterator);
    iter.next = function() {
      return goog.array.map(iterators, function(it) {
        return it.next();
      });
    };
  }
  return iter;
};
goog.iter.zipLongest = function(fillValue, var_args) {
  var args = goog.array.slice(arguments, 1), iter = new goog.iter.Iterator;
  if (0 < args.length) {
    var iterators = goog.array.map(args, goog.iter.toIterator);
    iter.next = function() {
      var iteratorsHaveValues = !1, arr = goog.array.map(iterators, function(it) {
        var returnValue;
        try {
          returnValue = it.next(), iteratorsHaveValues = !0;
        } catch (ex) {
          if (ex !== goog.iter.StopIteration) {
            throw ex;
          }
          returnValue = fillValue;
        }
        return returnValue;
      });
      if (!iteratorsHaveValues) {
        throw goog.iter.StopIteration;
      }
      return arr;
    };
  }
  return iter;
};
goog.iter.compress = function(iterable, selectors) {
  var selectorIterator = goog.iter.toIterator(selectors);
  return goog.iter.filter(iterable, function() {
    return !!selectorIterator.next();
  });
};
goog.iter.GroupByIterator_ = function(iterable, opt_keyFunc) {
  this.iterator = goog.iter.toIterator(iterable);
  this.keyFunc = opt_keyFunc || goog.functions.identity;
};
goog.inherits(goog.iter.GroupByIterator_, goog.iter.Iterator);
goog.iter.GroupByIterator_.prototype.next = function() {
  for (;this.currentKey == this.targetKey;) {
    this.currentValue = this.iterator.next(), this.currentKey = this.keyFunc(this.currentValue);
  }
  this.targetKey = this.currentKey;
  return [this.currentKey, this.groupItems_(this.targetKey)];
};
goog.iter.GroupByIterator_.prototype.groupItems_ = function(targetKey) {
  for (var arr = [];this.currentKey == targetKey;) {
    arr.push(this.currentValue);
    try {
      this.currentValue = this.iterator.next();
    } catch (ex) {
      if (ex !== goog.iter.StopIteration) {
        throw ex;
      }
      break;
    }
    this.currentKey = this.keyFunc(this.currentValue);
  }
  return arr;
};
goog.iter.groupBy = function(iterable, opt_keyFunc) {
  return new goog.iter.GroupByIterator_(iterable, opt_keyFunc);
};
goog.iter.starMap = function(iterable, f, opt_obj) {
  var iterator = goog.iter.toIterator(iterable), iter = new goog.iter.Iterator;
  iter.next = function() {
    var args = goog.iter.toArray(iterator.next());
    return f.apply(opt_obj, goog.array.concat(args, void 0, iterator));
  };
  return iter;
};
goog.iter.tee = function(iterable, opt_num) {
  var iterator = goog.iter.toIterator(iterable), buffers = goog.array.map(goog.array.range(goog.isNumber(opt_num) ? opt_num : 2), function() {
    return [];
  }), addNextIteratorValueToBuffers = function() {
    var val = iterator.next();
    goog.array.forEach(buffers, function(buffer) {
      buffer.push(val);
    });
  };
  return goog.array.map(buffers, function(buffer) {
    var iter = new goog.iter.Iterator;
    iter.next = function() {
      goog.array.isEmpty(buffer) && addNextIteratorValueToBuffers();
      goog.asserts.assert(!goog.array.isEmpty(buffer));
      return buffer.shift();
    };
    return iter;
  });
};
goog.iter.enumerate = function(iterable, opt_start) {
  return goog.iter.zip(goog.iter.count(opt_start), iterable);
};
goog.iter.limit = function(iterable, limitSize) {
  goog.asserts.assert(goog.math.isInt(limitSize) && 0 <= limitSize);
  var iterator = goog.iter.toIterator(iterable), iter = new goog.iter.Iterator, remaining = limitSize;
  iter.next = function() {
    if (0 < remaining--) {
      return iterator.next();
    }
    throw goog.iter.StopIteration;
  };
  return iter;
};
goog.iter.consume = function(iterable, count) {
  goog.asserts.assert(goog.math.isInt(count) && 0 <= count);
  for (var iterator = goog.iter.toIterator(iterable);0 < count--;) {
    goog.iter.nextOrValue(iterator, null);
  }
  return iterator;
};
goog.iter.slice = function(iterable, start, opt_end) {
  goog.asserts.assert(goog.math.isInt(start) && 0 <= start);
  var iterator = goog.iter.consume(iterable, start);
  goog.isNumber(opt_end) && (goog.asserts.assert(goog.math.isInt(opt_end) && opt_end >= start), iterator = goog.iter.limit(iterator, opt_end - start));
  return iterator;
};
goog.iter.hasDuplicates_ = function(arr) {
  var deduped = [];
  goog.array.removeDuplicates(arr, deduped);
  return arr.length != deduped.length;
};
goog.iter.permutations = function(iterable, opt_length) {
  var elements = goog.iter.toArray(iterable), sets = goog.array.repeat(elements, goog.isNumber(opt_length) ? opt_length : elements.length), product = goog.iter.product.apply(void 0, sets);
  return goog.iter.filter(product, function(arr) {
    return !goog.iter.hasDuplicates_(arr);
  });
};
goog.iter.combinations = function(iterable, length) {
  function getIndexFromElements(index) {
    return elements[index];
  }
  var elements = goog.iter.toArray(iterable), indexes = goog.iter.range(elements.length), indexIterator = goog.iter.permutations(indexes, length), sortedIndexIterator = goog.iter.filter(indexIterator, function(arr) {
    return goog.array.isSorted(arr);
  }), iter = new goog.iter.Iterator;
  iter.next = function() {
    return goog.array.map(sortedIndexIterator.next(), getIndexFromElements);
  };
  return iter;
};
goog.iter.combinationsWithReplacement = function(iterable, length) {
  function getIndexFromElements(index) {
    return elements[index];
  }
  var elements = goog.iter.toArray(iterable), indexes = goog.array.range(elements.length), sets = goog.array.repeat(indexes, length), indexIterator = goog.iter.product.apply(void 0, sets), sortedIndexIterator = goog.iter.filter(indexIterator, function(arr) {
    return goog.array.isSorted(arr);
  }), iter = new goog.iter.Iterator;
  iter.next = function() {
    return goog.array.map(sortedIndexIterator.next(), getIndexFromElements);
  };
  return iter;
};
goog.structs.Map = function(opt_map, var_args) {
  this.map_ = {};
  this.keys_ = [];
  this.version_ = this.count_ = 0;
  var argLength = arguments.length;
  if (1 < argLength) {
    if (argLength % 2) {
      throw Error("Uneven number of arguments");
    }
    for (var i = 0;i < argLength;i += 2) {
      this.set(arguments[i], arguments[i + 1]);
    }
  } else {
    opt_map && this.addAll(opt_map);
  }
};
goog.structs.Map.prototype.getCount = function() {
  return this.count_;
};
goog.structs.Map.prototype.getValues = function() {
  this.cleanupKeysArray_();
  for (var rv = [], i = 0;i < this.keys_.length;i++) {
    rv.push(this.map_[this.keys_[i]]);
  }
  return rv;
};
goog.structs.Map.prototype.getKeys = function() {
  this.cleanupKeysArray_();
  return this.keys_.concat();
};
goog.structs.Map.prototype.containsKey = function(key) {
  return goog.structs.Map.hasKey_(this.map_, key);
};
goog.structs.Map.prototype.containsValue = function(val) {
  for (var i = 0;i < this.keys_.length;i++) {
    var key = this.keys_[i];
    if (goog.structs.Map.hasKey_(this.map_, key) && this.map_[key] == val) {
      return !0;
    }
  }
  return !1;
};
goog.structs.Map.prototype.equals = function(otherMap, opt_equalityFn) {
  if (this === otherMap) {
    return !0;
  }
  if (this.count_ != otherMap.getCount()) {
    return !1;
  }
  var equalityFn = opt_equalityFn || goog.structs.Map.defaultEquals;
  this.cleanupKeysArray_();
  for (var key, i = 0;key = this.keys_[i];i++) {
    if (!equalityFn(this.get(key), otherMap.get(key))) {
      return !1;
    }
  }
  return !0;
};
goog.structs.Map.defaultEquals = function(a, b) {
  return a === b;
};
goog.structs.Map.prototype.isEmpty = function() {
  return 0 == this.count_;
};
goog.structs.Map.prototype.clear = function() {
  this.map_ = {};
  this.version_ = this.count_ = this.keys_.length = 0;
};
goog.structs.Map.prototype.remove = function(key) {
  return goog.structs.Map.hasKey_(this.map_, key) ? (delete this.map_[key], this.count_--, this.version_++, this.keys_.length > 2 * this.count_ && this.cleanupKeysArray_(), !0) : !1;
};
goog.structs.Map.prototype.cleanupKeysArray_ = function() {
  if (this.count_ != this.keys_.length) {
    for (var srcIndex = 0, destIndex = 0;srcIndex < this.keys_.length;) {
      var key = this.keys_[srcIndex];
      goog.structs.Map.hasKey_(this.map_, key) && (this.keys_[destIndex++] = key);
      srcIndex++;
    }
    this.keys_.length = destIndex;
  }
  if (this.count_ != this.keys_.length) {
    for (var seen = {}, destIndex = srcIndex = 0;srcIndex < this.keys_.length;) {
      key = this.keys_[srcIndex], goog.structs.Map.hasKey_(seen, key) || (this.keys_[destIndex++] = key, seen[key] = 1), srcIndex++;
    }
    this.keys_.length = destIndex;
  }
};
goog.structs.Map.prototype.get = function(key, opt_val) {
  return goog.structs.Map.hasKey_(this.map_, key) ? this.map_[key] : opt_val;
};
goog.structs.Map.prototype.set = function(key, value) {
  goog.structs.Map.hasKey_(this.map_, key) || (this.count_++, this.keys_.push(key), this.version_++);
  this.map_[key] = value;
};
goog.structs.Map.prototype.addAll = function(map) {
  var keys, values;
  map instanceof goog.structs.Map ? (keys = map.getKeys(), values = map.getValues()) : (keys = goog.object.getKeys(map), values = goog.object.getValues(map));
  for (var i = 0;i < keys.length;i++) {
    this.set(keys[i], values[i]);
  }
};
goog.structs.Map.prototype.forEach = function(f, opt_obj) {
  for (var keys = this.getKeys(), i = 0;i < keys.length;i++) {
    var key = keys[i], value = this.get(key);
    f.call(opt_obj, value, key, this);
  }
};
goog.structs.Map.prototype.clone = function() {
  return new goog.structs.Map(this);
};
goog.structs.Map.prototype.transpose = function() {
  for (var transposed = new goog.structs.Map, i = 0;i < this.keys_.length;i++) {
    var key = this.keys_[i];
    transposed.set(this.map_[key], key);
  }
  return transposed;
};
goog.structs.Map.prototype.toObject = function() {
  this.cleanupKeysArray_();
  for (var obj = {}, i = 0;i < this.keys_.length;i++) {
    var key = this.keys_[i];
    obj[key] = this.map_[key];
  }
  return obj;
};
goog.structs.Map.prototype.__iterator__ = function(opt_keys) {
  this.cleanupKeysArray_();
  var i = 0, version = this.version_, selfObj = this, newIter = new goog.iter.Iterator;
  newIter.next = function() {
    if (version != selfObj.version_) {
      throw Error("The map has changed since the iterator was created");
    }
    if (i >= selfObj.keys_.length) {
      throw goog.iter.StopIteration;
    }
    var key = selfObj.keys_[i++];
    return opt_keys ? key : selfObj.map_[key];
  };
  return newIter;
};
goog.structs.Map.hasKey_ = function(obj, key) {
  return Object.prototype.hasOwnProperty.call(obj, key);
};
goog.structs.getCount = function(col) {
  return col.getCount && "function" == typeof col.getCount ? col.getCount() : goog.isArrayLike(col) || goog.isString(col) ? col.length : goog.object.getCount(col);
};
goog.structs.getValues = function(col) {
  if (col.getValues && "function" == typeof col.getValues) {
    return col.getValues();
  }
  if (goog.isString(col)) {
    return col.split("");
  }
  if (goog.isArrayLike(col)) {
    for (var rv = [], l = col.length, i = 0;i < l;i++) {
      rv.push(col[i]);
    }
    return rv;
  }
  return goog.object.getValues(col);
};
goog.structs.getKeys = function(col) {
  if (col.getKeys && "function" == typeof col.getKeys) {
    return col.getKeys();
  }
  if (!col.getValues || "function" != typeof col.getValues) {
    if (goog.isArrayLike(col) || goog.isString(col)) {
      for (var rv = [], l = col.length, i = 0;i < l;i++) {
        rv.push(i);
      }
      return rv;
    }
    return goog.object.getKeys(col);
  }
};
goog.structs.contains = function(col, val) {
  return col.contains && "function" == typeof col.contains ? col.contains(val) : col.containsValue && "function" == typeof col.containsValue ? col.containsValue(val) : goog.isArrayLike(col) || goog.isString(col) ? goog.array.contains(col, val) : goog.object.containsValue(col, val);
};
goog.structs.isEmpty = function(col) {
  return col.isEmpty && "function" == typeof col.isEmpty ? col.isEmpty() : goog.isArrayLike(col) || goog.isString(col) ? goog.array.isEmpty(col) : goog.object.isEmpty(col);
};
goog.structs.clear = function(col) {
  col.clear && "function" == typeof col.clear ? col.clear() : goog.isArrayLike(col) ? goog.array.clear(col) : goog.object.clear(col);
};
goog.structs.forEach = function(col, f, opt_obj) {
  if (col.forEach && "function" == typeof col.forEach) {
    col.forEach(f, opt_obj);
  } else {
    if (goog.isArrayLike(col) || goog.isString(col)) {
      goog.array.forEach(col, f, opt_obj);
    } else {
      for (var keys = goog.structs.getKeys(col), values = goog.structs.getValues(col), l = values.length, i = 0;i < l;i++) {
        f.call(opt_obj, values[i], keys && keys[i], col);
      }
    }
  }
};
goog.structs.filter = function(col, f, opt_obj) {
  if ("function" == typeof col.filter) {
    return col.filter(f, opt_obj);
  }
  if (goog.isArrayLike(col) || goog.isString(col)) {
    return goog.array.filter(col, f, opt_obj);
  }
  var rv, keys = goog.structs.getKeys(col), values = goog.structs.getValues(col), l = values.length;
  if (keys) {
    rv = {};
    for (var i = 0;i < l;i++) {
      f.call(opt_obj, values[i], keys[i], col) && (rv[keys[i]] = values[i]);
    }
  } else {
    for (rv = [], i = 0;i < l;i++) {
      f.call(opt_obj, values[i], void 0, col) && rv.push(values[i]);
    }
  }
  return rv;
};
goog.structs.map = function(col, f, opt_obj) {
  if ("function" == typeof col.map) {
    return col.map(f, opt_obj);
  }
  if (goog.isArrayLike(col) || goog.isString(col)) {
    return goog.array.map(col, f, opt_obj);
  }
  var rv, keys = goog.structs.getKeys(col), values = goog.structs.getValues(col), l = values.length;
  if (keys) {
    rv = {};
    for (var i = 0;i < l;i++) {
      rv[keys[i]] = f.call(opt_obj, values[i], keys[i], col);
    }
  } else {
    for (rv = [], i = 0;i < l;i++) {
      rv[i] = f.call(opt_obj, values[i], void 0, col);
    }
  }
  return rv;
};
goog.structs.some = function(col, f, opt_obj) {
  if ("function" == typeof col.some) {
    return col.some(f, opt_obj);
  }
  if (goog.isArrayLike(col) || goog.isString(col)) {
    return goog.array.some(col, f, opt_obj);
  }
  for (var keys = goog.structs.getKeys(col), values = goog.structs.getValues(col), l = values.length, i = 0;i < l;i++) {
    if (f.call(opt_obj, values[i], keys && keys[i], col)) {
      return !0;
    }
  }
  return !1;
};
goog.structs.every = function(col, f, opt_obj) {
  if ("function" == typeof col.every) {
    return col.every(f, opt_obj);
  }
  if (goog.isArrayLike(col) || goog.isString(col)) {
    return goog.array.every(col, f, opt_obj);
  }
  for (var keys = goog.structs.getKeys(col), values = goog.structs.getValues(col), l = values.length, i = 0;i < l;i++) {
    if (!f.call(opt_obj, values[i], keys && keys[i], col)) {
      return !1;
    }
  }
  return !0;
};
goog.structs.Set = function(opt_values) {
  this.map_ = new goog.structs.Map;
  opt_values && this.addAll(opt_values);
};
goog.structs.Set.getKey_ = function(val) {
  var type = typeof val;
  return "object" == type && val || "function" == type ? "o" + goog.getUid(val) : type.substr(0, 1) + val;
};
goog.structs.Set.prototype.getCount = function() {
  return this.map_.getCount();
};
goog.structs.Set.prototype.add = function(element) {
  this.map_.set(goog.structs.Set.getKey_(element), element);
};
goog.structs.Set.prototype.addAll = function(col) {
  for (var values = goog.structs.getValues(col), l = values.length, i = 0;i < l;i++) {
    this.add(values[i]);
  }
};
goog.structs.Set.prototype.removeAll = function(col) {
  for (var values = goog.structs.getValues(col), l = values.length, i = 0;i < l;i++) {
    this.remove(values[i]);
  }
};
goog.structs.Set.prototype.remove = function(element) {
  return this.map_.remove(goog.structs.Set.getKey_(element));
};
goog.structs.Set.prototype.clear = function() {
  this.map_.clear();
};
goog.structs.Set.prototype.isEmpty = function() {
  return this.map_.isEmpty();
};
goog.structs.Set.prototype.contains = function(element) {
  return this.map_.containsKey(goog.structs.Set.getKey_(element));
};
goog.structs.Set.prototype.difference = function(col) {
  var result = this.clone();
  result.removeAll(col);
  return result;
};
goog.structs.Set.prototype.getValues = function() {
  return this.map_.getValues();
};
goog.structs.Set.prototype.clone = function() {
  return new goog.structs.Set(this);
};
goog.structs.Set.prototype.equals = function(col) {
  return this.getCount() == goog.structs.getCount(col) && this.isSubsetOf(col);
};
goog.structs.Set.prototype.isSubsetOf = function(col) {
  var colCount = goog.structs.getCount(col);
  if (this.getCount() > colCount) {
    return !1;
  }
  !(col instanceof goog.structs.Set) && 5 < colCount && (col = new goog.structs.Set(col));
  return goog.structs.every(this, function(value) {
    return goog.structs.contains(col, value);
  });
};
goog.structs.Set.prototype.__iterator__ = function(opt_keys) {
  return this.map_.__iterator__(!1);
};
goog.debug.LOGGING_ENABLED = goog.DEBUG;
goog.debug.FORCE_SLOPPY_STACKS = !1;
goog.debug.catchErrors = function(logFunc, opt_cancel, opt_target) {
  var target = opt_target || goog.global, oldErrorHandler = target.onerror, retVal = !!opt_cancel;
  goog.userAgent.WEBKIT && !goog.userAgent.isVersionOrHigher("535.3") && (retVal = !retVal);
  target.onerror = function(message, url, line, opt_col, opt_error) {
    oldErrorHandler && oldErrorHandler(message, url, line, opt_col, opt_error);
    logFunc({message:message, fileName:url, line:line, col:opt_col, error:opt_error});
    return retVal;
  };
};
goog.debug.expose = function(obj, opt_showFn) {
  if ("undefined" == typeof obj) {
    return "undefined";
  }
  if (null == obj) {
    return "NULL";
  }
  var str = [], x;
  for (x in obj) {
    if (opt_showFn || !goog.isFunction(obj[x])) {
      var s = x + " = ";
      try {
        s += obj[x];
      } catch (e) {
        s += "*** " + e + " ***";
      }
      str.push(s);
    }
  }
  return str.join("\n");
};
goog.debug.deepExpose = function(obj$jscomp$0, opt_showFn) {
  var str = [], helper = function(obj, space, parentSeen) {
    var nestspace = space + "  ", seen = new goog.structs.Set(parentSeen);
    try {
      if (goog.isDef(obj)) {
        if (goog.isNull(obj)) {
          str.push("NULL");
        } else {
          if (goog.isString(obj)) {
            str.push('"' + obj.replace(/\n/g, "\n" + space) + '"');
          } else {
            if (goog.isFunction(obj)) {
              str.push(String(obj).replace(/\n/g, "\n" + space));
            } else {
              if (goog.isObject(obj)) {
                if (seen.contains(obj)) {
                  str.push("*** reference loop detected ***");
                } else {
                  seen.add(obj);
                  str.push("{");
                  for (var x in obj) {
                    if (opt_showFn || !goog.isFunction(obj[x])) {
                      str.push("\n"), str.push(nestspace), str.push(x + " = "), helper(obj[x], nestspace, seen);
                    }
                  }
                  str.push("\n" + space + "}");
                }
              } else {
                str.push(obj);
              }
            }
          }
        }
      } else {
        str.push("undefined");
      }
    } catch (e) {
      str.push("*** " + e + " ***");
    }
  };
  helper(obj$jscomp$0, "", new goog.structs.Set);
  return str.join("");
};
goog.debug.exposeArray = function(arr) {
  for (var str = [], i = 0;i < arr.length;i++) {
    goog.isArray(arr[i]) ? str.push(goog.debug.exposeArray(arr[i])) : str.push(arr[i]);
  }
  return "[ " + str.join(", ") + " ]";
};
goog.debug.exposeException = function(err, opt_fn) {
  var html = goog.debug.exposeExceptionAsHtml(err, opt_fn);
  return goog.html.SafeHtml.unwrap(html);
};
goog.debug.exposeExceptionAsHtml = function(err, opt_fn) {
  try {
    var e = goog.debug.normalizeErrorObject(err), viewSourceUrl = goog.debug.createViewSourceUrl_(e.fileName);
    return goog.html.SafeHtml.concat(goog.html.SafeHtml.htmlEscapePreservingNewlinesAndSpaces("Message: " + e.message + "\nUrl: "), goog.html.SafeHtml.create("a", {href:viewSourceUrl, target:"_new"}, e.fileName), goog.html.SafeHtml.htmlEscapePreservingNewlinesAndSpaces("\nLine: " + e.lineNumber + "\n\nBrowser stack:\n" + e.stack + "-> [end]\n\nJS stack traversal:\n" + goog.debug.getStacktrace(opt_fn) + "-> "));
  } catch (e2) {
    return goog.html.SafeHtml.htmlEscapePreservingNewlinesAndSpaces("Exception trying to expose exception! You win, we lose. " + e2);
  }
};
goog.debug.createViewSourceUrl_ = function(opt_fileName) {
  goog.isDefAndNotNull(opt_fileName) || (opt_fileName = "");
  if (!/^https?:\/\//i.test(opt_fileName)) {
    return goog.html.SafeUrl.fromConstant(goog.string.Const.from("sanitizedviewsrc"));
  }
  var sanitizedFileName = goog.html.SafeUrl.sanitize(opt_fileName);
  return goog.html.uncheckedconversions.safeUrlFromStringKnownToSatisfyTypeContract(goog.string.Const.from("view-source scheme plus HTTP/HTTPS URL"), "view-source:" + goog.html.SafeUrl.unwrap(sanitizedFileName));
};
goog.debug.normalizeErrorObject = function(err) {
  var href = goog.getObjectByName("window.location.href");
  if (goog.isString(err)) {
    return {message:err, name:"Unknown error", lineNumber:"Not available", fileName:href, stack:"Not available"};
  }
  var lineNumber, fileName, threwError = !1;
  try {
    lineNumber = err.lineNumber || err.line || "Not available";
  } catch (e) {
    lineNumber = "Not available", threwError = !0;
  }
  try {
    fileName = err.fileName || err.filename || err.sourceURL || goog.global.$googDebugFname || href;
  } catch (e$1) {
    fileName = "Not available", threwError = !0;
  }
  return !threwError && err.lineNumber && err.fileName && err.stack && err.message && err.name ? err : {message:err.message || "Not available", name:err.name || "UnknownError", lineNumber:lineNumber, fileName:fileName, stack:err.stack || "Not available"};
};
goog.debug.enhanceError = function(err, opt_message) {
  var error;
  err instanceof Error ? error = err : (error = Error(err), Error.captureStackTrace && Error.captureStackTrace(error, goog.debug.enhanceError));
  error.stack || (error.stack = goog.debug.getStacktrace(goog.debug.enhanceError));
  if (opt_message) {
    for (var x = 0;error["message" + x];) {
      ++x;
    }
    error["message" + x] = String(opt_message);
  }
  return error;
};
goog.debug.getStacktraceSimple = function(opt_depth) {
  if (!goog.debug.FORCE_SLOPPY_STACKS) {
    var stack = goog.debug.getNativeStackTrace_(goog.debug.getStacktraceSimple);
    if (stack) {
      return stack;
    }
  }
  for (var sb = [], fn = arguments.callee.caller, depth = 0;fn && (!opt_depth || depth < opt_depth);) {
    sb.push(goog.debug.getFunctionName(fn));
    sb.push("()\n");
    try {
      fn = fn.caller;
    } catch (e) {
      sb.push("[exception trying to get caller]\n");
      break;
    }
    depth++;
    if (depth >= goog.debug.MAX_STACK_DEPTH) {
      sb.push("[...long stack...]");
      break;
    }
  }
  opt_depth && depth >= opt_depth ? sb.push("[...reached max depth limit...]") : sb.push("[end]");
  return sb.join("");
};
goog.debug.MAX_STACK_DEPTH = 50;
goog.debug.getNativeStackTrace_ = function(fn) {
  var tempErr = Error();
  if (Error.captureStackTrace) {
    return Error.captureStackTrace(tempErr, fn), String(tempErr.stack);
  }
  try {
    throw tempErr;
  } catch (e) {
    tempErr = e;
  }
  var stack = tempErr.stack;
  return stack ? String(stack) : null;
};
goog.debug.getStacktrace = function(opt_fn) {
  var stack;
  goog.debug.FORCE_SLOPPY_STACKS || (stack = goog.debug.getNativeStackTrace_(opt_fn || goog.debug.getStacktrace));
  stack || (stack = goog.debug.getStacktraceHelper_(opt_fn || arguments.callee.caller, []));
  return stack;
};
goog.debug.getStacktraceHelper_ = function(fn, visited) {
  var sb = [];
  if (goog.array.contains(visited, fn)) {
    sb.push("[...circular reference...]");
  } else {
    if (fn && visited.length < goog.debug.MAX_STACK_DEPTH) {
      sb.push(goog.debug.getFunctionName(fn) + "(");
      for (var args = fn.arguments, i = 0;args && i < args.length;i++) {
        0 < i && sb.push(", ");
        var argDesc, arg = args[i];
        switch(typeof arg) {
          case "object":
            argDesc = arg ? "object" : "null";
            break;
          case "string":
            argDesc = arg;
            break;
          case "number":
            argDesc = String(arg);
            break;
          case "boolean":
            argDesc = arg ? "true" : "false";
            break;
          case "function":
            argDesc = (argDesc = goog.debug.getFunctionName(arg)) ? argDesc : "[fn]";
            break;
          default:
            argDesc = typeof arg;
        }
        40 < argDesc.length && (argDesc = argDesc.substr(0, 40) + "...");
        sb.push(argDesc);
      }
      visited.push(fn);
      sb.push(")\n");
      try {
        sb.push(goog.debug.getStacktraceHelper_(fn.caller, visited));
      } catch (e) {
        sb.push("[exception trying to get caller]\n");
      }
    } else {
      fn ? sb.push("[...long stack...]") : sb.push("[end]");
    }
  }
  return sb.join("");
};
goog.debug.setFunctionResolver = function(resolver) {
  goog.debug.fnNameResolver_ = resolver;
};
goog.debug.getFunctionName = function(fn) {
  if (goog.debug.fnNameCache_[fn]) {
    return goog.debug.fnNameCache_[fn];
  }
  if (goog.debug.fnNameResolver_) {
    var name = goog.debug.fnNameResolver_(fn);
    if (name) {
      return goog.debug.fnNameCache_[fn] = name;
    }
  }
  var functionSource = String(fn);
  if (!goog.debug.fnNameCache_[functionSource]) {
    var matches = /function ([^\(]+)/.exec(functionSource);
    goog.debug.fnNameCache_[functionSource] = matches ? matches[1] : "[Anonymous]";
  }
  return goog.debug.fnNameCache_[functionSource];
};
goog.debug.makeWhitespaceVisible = function(string) {
  return string.replace(/ /g, "[_]").replace(/\f/g, "[f]").replace(/\n/g, "[n]\n").replace(/\r/g, "[r]").replace(/\t/g, "[t]");
};
goog.debug.runtimeType = function(value) {
  return value instanceof Function ? value.displayName || value.name || "unknown type name" : value instanceof Object ? value.constructor.displayName || value.constructor.name || Object.prototype.toString.call(value) : null === value ? "null" : typeof value;
};
goog.debug.fnNameCache_ = {};
goog.debug.LogRecord = function(level, msg, loggerName, opt_time, opt_sequenceNumber) {
  this.reset(level, msg, loggerName, opt_time, opt_sequenceNumber);
};
goog.debug.LogRecord.prototype.exception_ = null;
goog.debug.LogRecord.ENABLE_SEQUENCE_NUMBERS = !0;
goog.debug.LogRecord.nextSequenceNumber_ = 0;
goog.debug.LogRecord.prototype.reset = function(level, msg, loggerName, opt_time, opt_sequenceNumber) {
  goog.debug.LogRecord.ENABLE_SEQUENCE_NUMBERS && ("number" == typeof opt_sequenceNumber || goog.debug.LogRecord.nextSequenceNumber_++);
  this.time_ = opt_time || goog.now();
  this.level_ = level;
  this.msg_ = msg;
  this.loggerName_ = loggerName;
  delete this.exception_;
};
goog.debug.LogRecord.prototype.setException = function(exception) {
  this.exception_ = exception;
};
goog.debug.LogRecord.prototype.getLevel = function() {
  return this.level_;
};
goog.debug.LogRecord.prototype.setLevel = function(level) {
  this.level_ = level;
};
goog.debug.LogBuffer = function() {
  goog.asserts.assert(goog.debug.LogBuffer.isBufferingEnabled(), "Cannot use goog.debug.LogBuffer without defining goog.debug.LogBuffer.CAPACITY.");
  this.clear();
};
goog.debug.LogBuffer.getInstance = function() {
  goog.debug.LogBuffer.instance_ || (goog.debug.LogBuffer.instance_ = new goog.debug.LogBuffer);
  return goog.debug.LogBuffer.instance_;
};
goog.debug.LogBuffer.CAPACITY = 0;
goog.debug.LogBuffer.prototype.addRecord = function(level, msg, loggerName) {
  var curIndex = (this.curIndex_ + 1) % goog.debug.LogBuffer.CAPACITY;
  this.curIndex_ = curIndex;
  if (this.isFull_) {
    var ret = this.buffer_[curIndex];
    ret.reset(level, msg, loggerName);
    return ret;
  }
  this.isFull_ = curIndex == goog.debug.LogBuffer.CAPACITY - 1;
  return this.buffer_[curIndex] = new goog.debug.LogRecord(level, msg, loggerName);
};
goog.debug.LogBuffer.isBufferingEnabled = function() {
  return 0 < goog.debug.LogBuffer.CAPACITY;
};
goog.debug.LogBuffer.prototype.clear = function() {
  this.buffer_ = Array(goog.debug.LogBuffer.CAPACITY);
  this.curIndex_ = -1;
  this.isFull_ = !1;
};
goog.debug.Logger = function(name) {
  this.name_ = name;
  this.handlers_ = this.children_ = this.level_ = this.parent_ = null;
};
goog.debug.Logger.ROOT_LOGGER_NAME = "";
goog.debug.Logger.ENABLE_HIERARCHY = !0;
goog.debug.Logger.ENABLE_HIERARCHY || (goog.debug.Logger.rootHandlers_ = []);
goog.debug.Logger.Level = function(name, value) {
  this.name = name;
  this.value = value;
};
goog.debug.Logger.Level.prototype.toString = function() {
  return this.name;
};
goog.debug.Logger.Level.OFF = new goog.debug.Logger.Level("OFF", Infinity);
goog.debug.Logger.Level.SHOUT = new goog.debug.Logger.Level("SHOUT", 1200);
goog.debug.Logger.Level.SEVERE = new goog.debug.Logger.Level("SEVERE", 1000);
goog.debug.Logger.Level.WARNING = new goog.debug.Logger.Level("WARNING", 900);
goog.debug.Logger.Level.INFO = new goog.debug.Logger.Level("INFO", 800);
goog.debug.Logger.Level.CONFIG = new goog.debug.Logger.Level("CONFIG", 700);
goog.debug.Logger.Level.FINE = new goog.debug.Logger.Level("FINE", 500);
goog.debug.Logger.Level.FINER = new goog.debug.Logger.Level("FINER", 400);
goog.debug.Logger.Level.FINEST = new goog.debug.Logger.Level("FINEST", 300);
goog.debug.Logger.Level.ALL = new goog.debug.Logger.Level("ALL", 0);
goog.debug.Logger.Level.PREDEFINED_LEVELS = [goog.debug.Logger.Level.OFF, goog.debug.Logger.Level.SHOUT, goog.debug.Logger.Level.SEVERE, goog.debug.Logger.Level.WARNING, goog.debug.Logger.Level.INFO, goog.debug.Logger.Level.CONFIG, goog.debug.Logger.Level.FINE, goog.debug.Logger.Level.FINER, goog.debug.Logger.Level.FINEST, goog.debug.Logger.Level.ALL];
goog.debug.Logger.Level.predefinedLevelsCache_ = null;
goog.debug.Logger.Level.createPredefinedLevelsCache_ = function() {
  goog.debug.Logger.Level.predefinedLevelsCache_ = {};
  for (var i = 0, level;level = goog.debug.Logger.Level.PREDEFINED_LEVELS[i];i++) {
    goog.debug.Logger.Level.predefinedLevelsCache_[level.value] = level, goog.debug.Logger.Level.predefinedLevelsCache_[level.name] = level;
  }
};
goog.debug.Logger.Level.getPredefinedLevel = function(name) {
  goog.debug.Logger.Level.predefinedLevelsCache_ || goog.debug.Logger.Level.createPredefinedLevelsCache_();
  return goog.debug.Logger.Level.predefinedLevelsCache_[name] || null;
};
goog.debug.Logger.Level.getPredefinedLevelByValue = function(value) {
  goog.debug.Logger.Level.predefinedLevelsCache_ || goog.debug.Logger.Level.createPredefinedLevelsCache_();
  if (value in goog.debug.Logger.Level.predefinedLevelsCache_) {
    return goog.debug.Logger.Level.predefinedLevelsCache_[value];
  }
  for (var i = 0;i < goog.debug.Logger.Level.PREDEFINED_LEVELS.length;++i) {
    var level = goog.debug.Logger.Level.PREDEFINED_LEVELS[i];
    if (level.value <= value) {
      return level;
    }
  }
  return null;
};
goog.debug.Logger.getLogger = function(name) {
  return goog.debug.LogManager.getLogger(name);
};
goog.debug.Logger.logToProfilers = function(msg) {
  goog.global.console && (goog.global.console.timeStamp ? goog.global.console.timeStamp(msg) : goog.global.console.markTimeline && goog.global.console.markTimeline(msg));
  goog.global.msWriteProfilerMark && goog.global.msWriteProfilerMark(msg);
};
goog.debug.Logger.prototype.getName = function() {
  return this.name_;
};
goog.debug.Logger.prototype.addHandler = function(handler) {
  goog.debug.LOGGING_ENABLED && (goog.debug.Logger.ENABLE_HIERARCHY ? (this.handlers_ || (this.handlers_ = []), this.handlers_.push(handler)) : (goog.asserts.assert(!this.name_, "Cannot call addHandler on a non-root logger when goog.debug.Logger.ENABLE_HIERARCHY is false."), goog.debug.Logger.rootHandlers_.push(handler)));
};
goog.debug.Logger.prototype.removeHandler = function(handler) {
  if (goog.debug.LOGGING_ENABLED) {
    var handlers = goog.debug.Logger.ENABLE_HIERARCHY ? this.handlers_ : goog.debug.Logger.rootHandlers_;
    return !!handlers && goog.array.remove(handlers, handler);
  }
  return !1;
};
goog.debug.Logger.prototype.getParent = function() {
  return this.parent_;
};
goog.debug.Logger.prototype.getChildren = function() {
  this.children_ || (this.children_ = {});
  return this.children_;
};
goog.debug.Logger.prototype.setLevel = function(level) {
  goog.debug.LOGGING_ENABLED && (goog.debug.Logger.ENABLE_HIERARCHY ? this.level_ = level : (goog.asserts.assert(!this.name_, "Cannot call setLevel() on a non-root logger when goog.debug.Logger.ENABLE_HIERARCHY is false."), goog.debug.Logger.rootLevel_ = level));
};
goog.debug.Logger.prototype.getLevel = function() {
  return goog.debug.LOGGING_ENABLED ? this.level_ : goog.debug.Logger.Level.OFF;
};
goog.debug.Logger.prototype.getEffectiveLevel = function() {
  if (!goog.debug.LOGGING_ENABLED) {
    return goog.debug.Logger.Level.OFF;
  }
  if (!goog.debug.Logger.ENABLE_HIERARCHY) {
    return goog.debug.Logger.rootLevel_;
  }
  if (this.level_) {
    return this.level_;
  }
  if (this.parent_) {
    return this.parent_.getEffectiveLevel();
  }
  goog.asserts.fail("Root logger has no level set.");
  return null;
};
goog.debug.Logger.prototype.isLoggable = function(level) {
  return goog.debug.LOGGING_ENABLED && level.value >= this.getEffectiveLevel().value;
};
goog.debug.Logger.prototype.log = function(level, msg, opt_exception) {
  goog.debug.LOGGING_ENABLED && this.isLoggable(level) && (goog.isFunction(msg) && (msg = msg()), this.doLogRecord_(this.getLogRecord(level, msg, opt_exception)));
};
goog.debug.Logger.prototype.getLogRecord = function(level, msg, opt_exception) {
  var logRecord = goog.debug.LogBuffer.isBufferingEnabled() ? goog.debug.LogBuffer.getInstance().addRecord(level, msg, this.name_) : new goog.debug.LogRecord(level, String(msg), this.name_);
  opt_exception && logRecord.setException(opt_exception);
  return logRecord;
};
goog.debug.Logger.prototype.severe = function(msg, opt_exception) {
  goog.debug.LOGGING_ENABLED && this.log(goog.debug.Logger.Level.SEVERE, msg, opt_exception);
};
goog.debug.Logger.prototype.warning = function(msg, opt_exception) {
  goog.debug.LOGGING_ENABLED && this.log(goog.debug.Logger.Level.WARNING, msg, opt_exception);
};
goog.debug.Logger.prototype.info = function(msg, opt_exception) {
  goog.debug.LOGGING_ENABLED && this.log(goog.debug.Logger.Level.INFO, msg, opt_exception);
};
goog.debug.Logger.prototype.fine = function(msg, opt_exception) {
  goog.debug.LOGGING_ENABLED && this.log(goog.debug.Logger.Level.FINE, msg, opt_exception);
};
goog.debug.Logger.prototype.doLogRecord_ = function(logRecord) {
  goog.debug.Logger.logToProfilers("log:" + logRecord.msg_);
  if (goog.debug.Logger.ENABLE_HIERARCHY) {
    for (var target = this;target;) {
      target.callPublish_(logRecord), target = target.getParent();
    }
  } else {
    for (var i = 0, handler;handler = goog.debug.Logger.rootHandlers_[i++];) {
      handler(logRecord);
    }
  }
};
goog.debug.Logger.prototype.callPublish_ = function(logRecord) {
  if (this.handlers_) {
    for (var i = 0, handler;handler = this.handlers_[i];i++) {
      handler(logRecord);
    }
  }
};
goog.debug.Logger.prototype.setParent_ = function(parent) {
  this.parent_ = parent;
};
goog.debug.Logger.prototype.addChild_ = function(name, logger) {
  this.getChildren()[name] = logger;
};
goog.debug.LogManager = {};
goog.debug.LogManager.loggers_ = {};
goog.debug.LogManager.rootLogger_ = null;
goog.debug.LogManager.initialize = function() {
  goog.debug.LogManager.rootLogger_ || (goog.debug.LogManager.rootLogger_ = new goog.debug.Logger(goog.debug.Logger.ROOT_LOGGER_NAME), goog.debug.LogManager.loggers_[goog.debug.Logger.ROOT_LOGGER_NAME] = goog.debug.LogManager.rootLogger_, goog.debug.LogManager.rootLogger_.setLevel(goog.debug.Logger.Level.CONFIG));
};
goog.debug.LogManager.getLoggers = function() {
  return goog.debug.LogManager.loggers_;
};
goog.debug.LogManager.getRoot = function() {
  goog.debug.LogManager.initialize();
  return goog.debug.LogManager.rootLogger_;
};
goog.debug.LogManager.getLogger = function(name) {
  goog.debug.LogManager.initialize();
  return goog.debug.LogManager.loggers_[name] || goog.debug.LogManager.createLogger_(name);
};
goog.debug.LogManager.createFunctionForCatchErrors = function(opt_logger) {
  return function(info) {
    (opt_logger || goog.debug.LogManager.getRoot()).severe("Error: " + info.message + " (" + info.fileName + " @ Line: " + info.line + ")");
  };
};
goog.debug.LogManager.createLogger_ = function(name) {
  var logger = new goog.debug.Logger(name);
  if (goog.debug.Logger.ENABLE_HIERARCHY) {
    var lastDotIndex = name.lastIndexOf("."), leafName = name.substr(lastDotIndex + 1), parentLogger = goog.debug.LogManager.getLogger(name.substr(0, lastDotIndex));
    parentLogger.addChild_(leafName, logger);
    logger.setParent_(parentLogger);
  }
  return goog.debug.LogManager.loggers_[name] = logger;
};
goog.debug.RelativeTimeProvider = function() {
  this.relativeTimeStart_ = goog.now();
};
goog.debug.RelativeTimeProvider.defaultInstance_ = new goog.debug.RelativeTimeProvider;
goog.debug.RelativeTimeProvider.prototype.set = function(timeStamp) {
  this.relativeTimeStart_ = timeStamp;
};
goog.debug.RelativeTimeProvider.prototype.reset = function() {
  this.set(goog.now());
};
goog.debug.RelativeTimeProvider.prototype.get = function() {
  return this.relativeTimeStart_;
};
goog.debug.RelativeTimeProvider.getDefaultInstance = function() {
  return goog.debug.RelativeTimeProvider.defaultInstance_;
};
goog.debug.Formatter = function(opt_prefix) {
  this.prefix_ = opt_prefix || "";
  this.startTimeProvider_ = goog.debug.RelativeTimeProvider.getDefaultInstance();
};
goog.debug.Formatter.prototype.appendNewline = !0;
goog.debug.Formatter.prototype.showAbsoluteTime = !0;
goog.debug.Formatter.prototype.showRelativeTime = !0;
goog.debug.Formatter.prototype.showLoggerName = !0;
goog.debug.Formatter.prototype.showExceptionText = !1;
goog.debug.Formatter.prototype.showSeverityLevel = !1;
goog.debug.Formatter.getDateTimeStamp_ = function(logRecord) {
  var time = new Date(logRecord.time_);
  return goog.debug.Formatter.getTwoDigitString_(time.getFullYear() - 2000) + goog.debug.Formatter.getTwoDigitString_(time.getMonth() + 1) + goog.debug.Formatter.getTwoDigitString_(time.getDate()) + " " + goog.debug.Formatter.getTwoDigitString_(time.getHours()) + ":" + goog.debug.Formatter.getTwoDigitString_(time.getMinutes()) + ":" + goog.debug.Formatter.getTwoDigitString_(time.getSeconds()) + "." + goog.debug.Formatter.getTwoDigitString_(Math.floor(time.getMilliseconds() / 10));
};
goog.debug.Formatter.getTwoDigitString_ = function(n) {
  return 10 > n ? "0" + n : String(n);
};
goog.debug.Formatter.getRelativeTime_ = function(logRecord, relativeTimeStart) {
  var sec = (logRecord.time_ - relativeTimeStart) / 1000, str = sec.toFixed(3), spacesToPrepend = 0;
  if (1 > sec) {
    spacesToPrepend = 2;
  } else {
    for (;100 > sec;) {
      spacesToPrepend++, sec *= 10;
    }
  }
  for (;0 < spacesToPrepend--;) {
    str = " " + str;
  }
  return str;
};
goog.debug.HtmlFormatter = function(opt_prefix) {
  goog.debug.Formatter.call(this, opt_prefix);
};
goog.inherits(goog.debug.HtmlFormatter, goog.debug.Formatter);
goog.debug.HtmlFormatter.prototype.showExceptionText = !0;
goog.debug.HtmlFormatter.prototype.formatRecord = function(logRecord) {
  return logRecord ? this.formatRecordAsHtml(logRecord).getTypedStringValue() : "";
};
goog.debug.HtmlFormatter.prototype.formatRecordAsHtml = function(logRecord) {
  if (!logRecord) {
    return goog.html.SafeHtml.EMPTY;
  }
  var className;
  switch(logRecord.getLevel().value) {
    case goog.debug.Logger.Level.SHOUT.value:
      className = "dbg-sh";
      break;
    case goog.debug.Logger.Level.SEVERE.value:
      className = "dbg-sev";
      break;
    case goog.debug.Logger.Level.WARNING.value:
      className = "dbg-w";
      break;
    case goog.debug.Logger.Level.INFO.value:
      className = "dbg-i";
      break;
    default:
      className = "dbg-f";
  }
  var sb = [];
  sb.push(this.prefix_, " ");
  this.showAbsoluteTime && sb.push("[", goog.debug.Formatter.getDateTimeStamp_(logRecord), "] ");
  this.showRelativeTime && sb.push("[", goog.debug.Formatter.getRelativeTime_(logRecord, this.startTimeProvider_.get()), "s] ");
  this.showLoggerName && sb.push("[", logRecord.loggerName_, "] ");
  this.showSeverityLevel && sb.push("[", logRecord.getLevel().name, "] ");
  var fullPrefixHtml = goog.html.SafeHtml.htmlEscapePreservingNewlinesAndSpaces(sb.join("")), exceptionHtml = goog.html.SafeHtml.EMPTY;
  this.showExceptionText && logRecord.exception_ && (exceptionHtml = goog.html.SafeHtml.concat(goog.html.SafeHtml.BR, goog.debug.exposeExceptionAsHtml(logRecord.exception_)));
  var logRecordHtml = goog.html.SafeHtml.htmlEscapePreservingNewlinesAndSpaces(logRecord.msg_), recordAndExceptionHtml = goog.html.SafeHtml.create("span", {"class":className}, goog.html.SafeHtml.concat(logRecordHtml, exceptionHtml));
  return this.appendNewline ? goog.html.SafeHtml.concat(fullPrefixHtml, recordAndExceptionHtml, goog.html.SafeHtml.BR) : goog.html.SafeHtml.concat(fullPrefixHtml, recordAndExceptionHtml);
};
goog.debug.TextFormatter = function(opt_prefix) {
  goog.debug.Formatter.call(this, opt_prefix);
};
goog.inherits(goog.debug.TextFormatter, goog.debug.Formatter);
goog.debug.TextFormatter.prototype.formatRecord = function(logRecord) {
  var sb = [];
  sb.push(this.prefix_, " ");
  this.showAbsoluteTime && sb.push("[", goog.debug.Formatter.getDateTimeStamp_(logRecord), "] ");
  this.showRelativeTime && sb.push("[", goog.debug.Formatter.getRelativeTime_(logRecord, this.startTimeProvider_.get()), "s] ");
  this.showLoggerName && sb.push("[", logRecord.loggerName_, "] ");
  this.showSeverityLevel && sb.push("[", logRecord.getLevel().name, "] ");
  sb.push(logRecord.msg_);
  if (this.showExceptionText) {
    var exception = logRecord.exception_;
    exception && sb.push("\n", exception instanceof Error ? exception.message : exception.toString());
  }
  this.appendNewline && sb.push("\n");
  return sb.join("");
};
goog.debug.TextFormatter.prototype.formatRecordAsHtml = function(logRecord) {
  return goog.html.SafeHtml.htmlEscapePreservingNewlinesAndSpaces(goog.debug.TextFormatter.prototype.formatRecord(logRecord));
};
goog.debug.Console = function() {
  this.publishHandler_ = goog.bind(this.addLogRecord, this);
  this.formatter_ = new goog.debug.TextFormatter;
  this.formatter_.showAbsoluteTime = !1;
  this.formatter_.showExceptionText = !1;
  this.isCapturing_ = this.formatter_.appendNewline = !1;
  this.logBuffer_ = "";
  this.filteredLoggers_ = {};
};
goog.debug.Console.prototype.setCapturing = function(capturing) {
  if (capturing != this.isCapturing_) {
    var rootLogger = goog.debug.LogManager.getRoot();
    capturing ? rootLogger.addHandler(this.publishHandler_) : rootLogger.removeHandler(this.publishHandler_);
    this.isCapturing_ = capturing;
  }
};
goog.debug.Console.prototype.addLogRecord = function(logRecord) {
  if (!this.filteredLoggers_[logRecord.loggerName_]) {
    var record = this.formatter_.formatRecord(logRecord), console = goog.debug.Console.console_;
    if (console) {
      switch(logRecord.getLevel()) {
        case goog.debug.Logger.Level.SHOUT:
          goog.debug.Console.logToConsole_(console, "info", record);
          break;
        case goog.debug.Logger.Level.SEVERE:
          goog.debug.Console.logToConsole_(console, "error", record);
          break;
        case goog.debug.Logger.Level.WARNING:
          goog.debug.Console.logToConsole_(console, "warn", record);
          break;
        default:
          goog.debug.Console.logToConsole_(console, "debug", record);
      }
    } else {
      this.logBuffer_ += record;
    }
  }
};
goog.debug.Console.instance = null;
goog.debug.Console.console_ = goog.global.console;
goog.debug.Console.setConsole = function(console) {
  goog.debug.Console.console_ = console;
};
goog.debug.Console.autoInstall = function() {
  goog.debug.Console.instance || (goog.debug.Console.instance = new goog.debug.Console);
  goog.global.location && -1 != goog.global.location.href.indexOf("Debug=true") && goog.debug.Console.instance.setCapturing(!0);
};
goog.debug.Console.show = function() {
  alert(goog.debug.Console.instance.logBuffer_);
};
goog.debug.Console.logToConsole_ = function(console, fnName, record) {
  if (console[fnName]) {
    console[fnName](record);
  } else {
    console.log(record);
  }
};
goog.log = {};
goog.log.ENABLED = goog.debug.LOGGING_ENABLED;
goog.log.ROOT_LOGGER_NAME = goog.debug.Logger.ROOT_LOGGER_NAME;
goog.log.Logger = goog.debug.Logger;
goog.log.Level = goog.debug.Logger.Level;
goog.log.LogRecord = goog.debug.LogRecord;
goog.log.getLogger = function(name, opt_level) {
  if (goog.log.ENABLED) {
    var logger = goog.debug.LogManager.getLogger(name);
    opt_level && logger && logger.setLevel(opt_level);
    return logger;
  }
  return null;
};
goog.log.addHandler = function(logger, handler) {
  goog.log.ENABLED && logger && logger.addHandler(handler);
};
goog.log.removeHandler = function(logger, handler) {
  return goog.log.ENABLED && logger ? logger.removeHandler(handler) : !1;
};
goog.log.log = function(logger, level, msg, opt_exception) {
  goog.log.ENABLED && logger && logger.log(level, msg, opt_exception);
};
goog.log.error = function(logger, msg, opt_exception) {
  goog.log.ENABLED && logger && logger.severe(msg, opt_exception);
};
goog.log.warning = function(logger, msg, opt_exception) {
  goog.log.ENABLED && logger && logger.warning(msg, opt_exception);
};
goog.log.info = function(logger, msg, opt_exception) {
  goog.log.ENABLED && logger && logger.info(msg, opt_exception);
};
goog.log.fine = function(logger, msg, opt_exception) {
  goog.log.ENABLED && logger && logger.fine(msg, opt_exception);
};
var castv2testing = {e2e:{}};
castv2testing.e2e.Controller = function() {
  this.logger_ = goog.log.getLogger("castv2testing");
  this.media_ = this.session_ = null;
  this.initLog_();
};
castv2testing.e2e.Controller.prototype.initialize = function(appId, sessionListener, receiverListener, successCallback, errorCallback, opt_autoJoinPolicy, opt_dialAppName) {
  this.logger_.info("Initializing API");
  var sessionRequest = new chrome.cast.SessionRequest(appId);
  opt_dialAppName && (sessionRequest.dialRequest = new chrome.cast.DialRequest(opt_dialAppName, "v=MJyJKwzxFpY"));
  var apiConfig = new chrome.cast.ApiConfig(sessionRequest, this.sessionListener_.bind(this, sessionListener), this.receiverListener_.bind(this, receiverListener), opt_autoJoinPolicy);
  chrome.cast.initialize(apiConfig, this.onSuccess_.bind(this, successCallback), this.onError_.bind(this, errorCallback));
};
castv2testing.e2e.Controller.prototype.requestSession = function(successCallback, errorCallback) {
  this.logger_.info("Request session");
  chrome.cast.requestSession(this.onRequestSessionSuccess_.bind(this, successCallback), this.onError_.bind(this, errorCallback));
};
castv2testing.e2e.Controller.prototype.stopSession = function(successCallback, errorCallback) {
  this.session_ ? (this.logger_.info("Stopping " + this.session_.sessionId), this.session_.stop(this.onSuccess_.bind(this, successCallback), this.onError_.bind(this, errorCallback))) : (this.logger_.info("No session available"), errorCallback && errorCallback());
};
castv2testing.e2e.Controller.prototype.sendMessage = function(namespace, message, successCallback, errorCallback) {
  this.session_ ? (this.logger_.info("Sending " + JSON.stringify(message)), this.session_.sendMessage(namespace, message, this.onSuccess_.bind(this, successCallback), this.onError_.bind(this, errorCallback))) : (this.logger_.info("No session available"), errorCallback && errorCallback());
};
castv2testing.e2e.Controller.prototype.setDeviceVolume = function(volumeLevel, muted, successCallback, errorCallback) {
  this.session_ || (this.logger_.error("No session availabe"), errorCallback && errorCallback());
  void 0 == volumeLevel ? this.session_.setReceiverMuted(muted, successCallback, this.onError_.bind(this, errorCallback)) : this.session_.setReceiverVolumeLevel(volumeLevel, successCallback, this.onError_.bind(this, errorCallback));
};
goog.exportProperty(castv2testing.e2e.Controller.prototype, "setDeviceVolume", castv2testing.e2e.Controller.prototype.setDeviceVolume);
castv2testing.e2e.Controller.prototype.addMediaUpdateListener = function(listener) {
  this.media_ ? (this.logger_.info("Adding media update listener"), this.media_.addUpdateListener(listener)) : this.logger_.severe("No media");
};
goog.exportProperty(castv2testing.e2e.Controller.prototype, "addMediaUpdateListener", castv2testing.e2e.Controller.prototype.addMediaUpdateListener);
castv2testing.e2e.Controller.prototype.removeMediaUpdateListener = function(listener) {
  this.media_ ? (this.logger_.info("Removing media update listener"), this.media_.removeUpdateListener(listener)) : this.logger_.severe("No media");
};
goog.exportProperty(castv2testing.e2e.Controller.prototype, "removeMediaUpdateListener", castv2testing.e2e.Controller.prototype.removeMediaUpdateListener);
castv2testing.e2e.Controller.prototype.getCurrentMedia = function() {
  return this.media_;
};
goog.exportProperty(castv2testing.e2e.Controller.prototype, "getCurrentMedia", castv2testing.e2e.Controller.prototype.getCurrentMedia);
castv2testing.e2e.Controller.prototype.getSession = function() {
  return this.session_;
};
goog.exportProperty(castv2testing.e2e.Controller.prototype, "getSession", castv2testing.e2e.Controller.prototype.getSession);
castv2testing.e2e.Controller.prototype.onSuccess_ = function(callback) {
  this.logger_.info("Request success");
  callback && callback();
};
castv2testing.e2e.Controller.prototype.onError_ = function(callback, error) {
  this.logger_.info("Request fail, error: " + JSON.stringify(error));
  callback && callback(error);
};
castv2testing.e2e.Controller.prototype.sessionListener_ = function(callback, session) {
  this.logger_.info("Session listener: " + JSON.stringify(session));
  this.session_ = session;
  callback && callback(session);
};
castv2testing.e2e.Controller.prototype.receiverListener_ = function(callback, availability) {
  this.logger_.info("Recevier listener: " + JSON.stringify(availability));
  callback && callback(availability);
};
castv2testing.e2e.Controller.prototype.onRequestSessionSuccess_ = function(callback, session) {
  this.logger_.info("Request session success");
  this.logger_.info("New session ID: " + session.sessionId);
  this.session_ = session;
  callback && callback(session);
};
castv2testing.e2e.Controller.prototype.initLog_ = function() {
  goog.debug.LogManager.getRoot().setLevel(goog.log.Logger.Level.FINE);
  (new goog.debug.Console).setCapturing(!0);
};
goog.setTestOnly("castv2testing.e2e.GameManagerController");
castv2testing.e2e.GameManagerController = function() {
  this.logger_ = goog.log.getLogger("castv2testing");
  this.gameManagerClient_ = null;
  this.initLog_();
};
castv2testing.e2e.GameManagerController.prototype.createGameManagerClient = function(session, successCallback, errorCallback) {
  this.logger_.info("Creating game manager client.");
  chrome.cast.games.GameManagerClient.getInstanceFor(session, this.onCreateGameManagerClientSuccess_.bind(this, successCallback), this.onCreateGameManagerClientFailure_.bind(this, errorCallback));
};
castv2testing.e2e.GameManagerController.prototype.getState = function() {
  if (this.gameManagerClient_) {
    return this.gameManagerClient_.getCurrentState();
  }
  this.logger_.info("Game Manager Client not Initialized!");
};
castv2testing.e2e.GameManagerController.prototype.changePlayerStateToAvailable = function(playerId, extraMessageData, successCallback, errorCallback) {
  this.gameManagerClient_.sendPlayerAvailableRequestWithPlayerId(playerId, extraMessageData, successCallback, errorCallback);
};
castv2testing.e2e.GameManagerController.prototype.changePlayerStateToIdle = function(playerId, extraMessageData, successCallback, errorCallback) {
  this.gameManagerClient_.sendPlayerIdleRequestWithPlayerId(playerId, extraMessageData, successCallback, errorCallback);
};
castv2testing.e2e.GameManagerController.prototype.changePlayerStateToPlaying = function(playerId, extraMessageData, successCallback, errorCallback) {
  this.gameManagerClient_.sendPlayerPlayingRequestWithPlayerId(playerId, extraMessageData, successCallback, errorCallback);
};
castv2testing.e2e.GameManagerController.prototype.changePlayerStateToQuit = function(playerId, extraMessageData, successCallback, errorCallback) {
  this.gameManagerClient_.sendPlayerQuitRequestWithPlayerId(playerId, extraMessageData, successCallback, errorCallback);
};
castv2testing.e2e.GameManagerController.prototype.changePlayerStateToReady = function(playerId, extraMessageData, successCallback, errorCallback) {
  this.gameManagerClient_.sendPlayerReadyRequestWithPlayerId(playerId, extraMessageData, successCallback, errorCallback);
};
castv2testing.e2e.GameManagerController.prototype.sendGameMessage = function(playerId, message, successCallback, errorCallback) {
  this.gameManagerClient_.sendGameRequestWithPlayerId(playerId, message, successCallback, errorCallback);
};
castv2testing.e2e.GameManagerController.prototype.getLastUsedPlayer = function() {
  return this.gameManagerClient_.getLastUsedPlayerId();
};
castv2testing.e2e.GameManagerController.prototype.listenForGameplayStateChange = function(gameplayState, callback) {
  if (this.getState().getGameplayState() == gameplayState) {
    return callback(), !0;
  }
  var listener = goog.bind(function(event) {
    var currentState = event.currentState;
    currentState.hasGameplayStateChanged(event.previousState) && currentState.getGameplayState() == gameplayState && (this.gameManagerClient_.removeEventListener(chrome.cast.games.GameManagerEventType.STATE_CHANGED, listener), callback());
  }, this);
  this.gameManagerClient_.addEventListener(chrome.cast.games.GameManagerEventType.STATE_CHANGED, listener);
  return !1;
};
castv2testing.e2e.GameManagerController.prototype.destroyGameManagerClient = function() {
  this.logger_.info("Destroying game manager client.");
  this.gameManagerClient_.dispose();
};
castv2testing.e2e.GameManagerController.prototype.isGameManagerClientDisposed = function() {
  return this.gameManagerClient_.isDisposed();
};
castv2testing.e2e.GameManagerController.prototype.onCreateGameManagerClientSuccess_ = function(callback, result) {
  this.logger_.info("Game manager client initialized!");
  this.gameManagerClient_ = result.gameManagerClient;
  this.gameManagerClient_.addEventListener(chrome.cast.games.GameManagerEventType.STATE_CHANGED, this.onStateChanged_.bind(this));
  callback && callback(result.gameManagerClient);
};
castv2testing.e2e.GameManagerController.prototype.onCreateGameManagerClientFailure_ = function(callback, error) {
  this.logger_.info("Error initializing the game manager client: " + error.errorDescription + " Error code: " + error.errorCode);
  callback && callback(error);
};
castv2testing.e2e.GameManagerController.prototype.initLog_ = function() {
  goog.debug.LogManager.getRoot().setLevel(goog.log.Logger.Level.FINE);
  (new goog.debug.Console).setCapturing(!0);
};
castv2testing.e2e.GameManagerController.prototype.onStateChanged_ = function(event) {
  var currentState = event.currentState, previousState = event.previousState;
  if (currentState.hasLobbyStateChanged(previousState)) {
    var previousLobbyState = this.getNameForValue(chrome.cast.games.LobbyState, previousState.getLobbyState()), currentLobbyState = this.getNameForValue(chrome.cast.games.LobbyState, currentState.getLobbyState());
    this.logger_.info("Lobby state change: " + previousLobbyState + " -> " + currentLobbyState);
  }
  if (currentState.hasGameplayStateChanged(previousState)) {
    var previousGameplayState = this.getNameForValue(chrome.cast.games.GameplayState, previousState.getGameplayState()), currentGameplayState = this.getNameForValue(chrome.cast.games.GameplayState, currentState.getGameplayState());
    this.logger_.info("Gameplay state change: " + previousGameplayState + " -> " + currentGameplayState);
  }
  currentState.hasGameDataChanged(previousState) && this.logger_.info("Game data change: " + previousState.getGameData() + " -> " + currentState.getGameData());
  currentState.hasGameStatusTextChanged(previousState) && this.logger_.info("Game status text change: " + previousState.getGameStatusText() + " -> " + currentState.getGameStatusText());
  for (var changedPlayers = currentState.getListOfChangedPlayers(previousState), i = 0;i < changedPlayers.length;i++) {
    var changedPlayerId = changedPlayers[i];
    this.logger_.info("Player Info change: " + previousState.getPlayer(changedPlayerId) + currentState.getPlayer(changedPlayerId));
  }
};
castv2testing.e2e.GameManagerController.prototype.getNameForValue = function(object, value) {
  for (var keys = Object.keys(object), i = 0;i < keys.length;i++) {
    var key = keys[i];
    if (object[key] == value) {
      return key;
    }
  }
};
castv2testing.e2e.Utilities = {};
var MR_EXTENSION_IDS = ["ekpaaapppgpmolpcldedioblbkmijaca", "lhkfccafpkdlaodkicmokbmfapjadkij", "ibiljbkambkbohapfhoonkcpcikdglop", "pkedcjkdefgpdelpbcmbmeomcjbeemfm"];
castv2testing.e2e.Utilities.GetQueryVariable = function getQueryVariable(queryVariable) {
  for (var vars = window.location.search.substring(1).split("&"), i = 0;i < vars.length;i++) {
    var pair = vars[i].split("=");
    if (pair[0] == queryVariable) {
      return pair[1];
    }
  }
  return !1;
};
castv2testing.e2e.Utilities.GetMediaUrl = function() {
  return castv2testing.e2e.Utilities.GetQueryVariable("VIDEO_URL") || "http://avayvod.github.io/cast-tests/video.webm";
};
castv2testing.e2e.Utilities.isCastMrpAvailable = function(extensionId) {
  return !extensionId || !!chrome.cast.PRESENTATION_ID_PREFIX || -1 < navigator.userAgent.indexOf("Android");
};
goog.setTestOnly("castv2testing.e2e.GameManagerTestHelper");
castv2testing.e2e.GameManagerTestHelper = function(controller, gameManagerController, asyncTestCase) {
  this.controller_ = controller;
  this.gameManagerController_ = gameManagerController;
  this.asyncTestCase_ = asyncTestCase;
  this.stateChangeFunctions_ = {};
  var PlayerState = chrome.cast.games.PlayerState;
  this.stateChangeFunctions_[PlayerState.AVAILABLE] = this.gameManagerController_.changePlayerStateToAvailable.bind(this.gameManagerController_);
  this.stateChangeFunctions_[PlayerState.READY] = this.gameManagerController_.changePlayerStateToReady.bind(this.gameManagerController_);
  this.stateChangeFunctions_[PlayerState.IDLE] = this.gameManagerController_.changePlayerStateToIdle.bind(this.gameManagerController_);
  this.stateChangeFunctions_[PlayerState.PLAYING] = this.gameManagerController_.changePlayerStateToPlaying.bind(this.gameManagerController_);
  this.stateChangeFunctions_[PlayerState.QUIT] = this.gameManagerController_.changePlayerStateToQuit.bind(this.gameManagerController_);
};
castv2testing.e2e.GameManagerTestHelper.prototype.asyncAssertAndSignalLoadAPIScript = function() {
  chrome.cast && chrome.cast.isAvailable ? this.asyncTestCase_.signal() : setTimeout(this.assertAPIScriptLoaded.bind(this), 1000);
};
castv2testing.e2e.GameManagerTestHelper.prototype.asyncAssertAndSignalInitializeController = function(appId) {
  var initSuccessful = !1, isReceiverAvailable = !1, receiverListener = function(availability) {
    initSuccessful && !isReceiverAvailable && availability == chrome.cast.ReceiverAvailability.AVAILABLE && (isReceiverAvailable = !0, this.asyncTestCase_.signal());
  }.bind(this), successCallback, errorCallback;
  this.controller_.initialize(appId, null, receiverListener, function() {
    initSuccessful = !0;
  }, function() {
    fail("Failed to initialize API");
  });
};
castv2testing.e2e.GameManagerTestHelper.prototype.asyncAssertAndSignalRequestSession = function() {
  var timeoutFunction = function() {
    this.isBling_() ? setTimeout(goog.bind(this.requestSession_, this), 10000) : this.requestSession_();
  }.bind(this);
  setTimeout(timeoutFunction, 5000);
};
castv2testing.e2e.GameManagerTestHelper.prototype.requestSession_ = function() {
  var callback = function(session) {
    assertNotNullNorUndefined(session);
    assertNotNullNorUndefined(session.sessionId);
    this.asyncTestCase_.signal();
  }.bind(this);
  this.controller_.requestSession(callback);
};
castv2testing.e2e.GameManagerTestHelper.prototype.isBling_ = function() {
  return -1 < navigator.userAgent.indexOf("CriOS");
};
castv2testing.e2e.GameManagerTestHelper.prototype.asyncAssertAndSignalCreateGameManagerClient = function(gameplayStates) {
  var successCallback = function(gameManagerClient) {
    assertNotNullNorUndefined(gameManagerClient);
    var currentState = this.gameManagerController_.getState(), currentPlayers = currentState.getPlayers(), gameplayState = currentState.getGameplayState();
    assertEquals(currentPlayers.length, 0);
    for (var hasValidGameplayState = !1, i = 0;i < gameplayStates.length;i++) {
      if (gameplayState == gameplayStates[i]) {
        hasValidGameplayState = !0;
        break;
      }
    }
    assertTrue(hasValidGameplayState);
    assertNull(this.gameManagerController_.getLastUsedPlayer());
    this.asyncTestCase_.signal();
  }.bind(this);
  assertNotNullNorUndefined(this.controller_.session_);
  this.gameManagerController_.createGameManagerClient(this.controller_.session_, successCallback, function(error) {
    fail("Failed to create Game Manager Client : " + JSON.stringify(error));
  });
};
castv2testing.e2e.GameManagerTestHelper.prototype.asyncAssertAndSignalGameplayStateChanged = function(gameplayState) {
  var callback = function() {
    var currentGameplayState = this.gameManagerController_.getState().getGameplayState();
    assertEquals(currentGameplayState, gameplayState);
    this.asyncTestCase_.signal();
  }.bind(this);
  this.gameManagerController_.listenForGameplayStateChange(gameplayState, callback) && this.asyncTestCase_.signal();
};
castv2testing.e2e.GameManagerTestHelper.prototype.asyncAssertAndSignalCreatePlayer = function(playerId, playerState, numberPlayers) {
  var gameState = this.gameManagerController_.getState();
  assertNotNullNorUndefined(gameState);
  assertEquals(gameState.getLobbyState(), chrome.cast.games.LobbyState.OPEN);
  var successCallback = function(result) {
    var currentState = this.gameManagerController_.getState();
    assertEquals(currentState.getLobbyState(), chrome.cast.games.LobbyState.OPEN);
    assertEquals(result.playerId, playerId);
    assertEquals(currentState.getPlayers().length, numberPlayers);
    this.assertPlayerIsConnectedControllable(playerId, playerState);
    assertNull(currentState.getPlayer(playerId).getPlayerData());
    this.asyncTestCase_.signal();
  }.bind(this), errorCallback;
  this.gameManagerController_.changePlayerStateToAvailable(playerId, null, successCallback, function() {
    fail("Failed to create Player.");
  });
};
castv2testing.e2e.GameManagerTestHelper.prototype.assertStateAndGetPlayer = function(playerId) {
  var currentState = this.gameManagerController_.getState();
  assertNotNullNorUndefined(currentState);
  return currentState.getPlayer(playerId);
};
castv2testing.e2e.GameManagerTestHelper.prototype.assertPlayerIsConnectedControllable = function(playerId, playerState) {
  var currentPlayer = this.assertStateAndGetPlayer(playerId);
  assertEquals(this.gameManagerController_.getLastUsedPlayer(), playerId);
  assertEquals(currentPlayer.getPlayerId(), playerId);
  assertEquals(currentPlayer.getPlayerState(), playerState);
  assertTrue(currentPlayer.isControllable());
  var currentState = this.gameManagerController_.getState(), controllablePlayers = currentState.getControllablePlayers(), connectedPlayers = currentState.getConnectedPlayers(), connectedControllablePlayers = currentState.getConnectedControllablePlayers(), playersInPlayerState = currentState.getPlayersInState(playerState);
  assertNotNullNorUndefined(this.findPlayer(playerId, controllablePlayers));
  assertNotNullNorUndefined(this.findPlayer(playerId, connectedPlayers));
  assertNotNullNorUndefined(this.findPlayer(playerId, connectedControllablePlayers));
  assertNotNullNorUndefined(this.findPlayer(playerId, playersInPlayerState));
};
castv2testing.e2e.GameManagerTestHelper.prototype.asyncAssertAndSignalSendGameMessage = function(playerId, message, playerState, gameplayState, lobbyState) {
  var successCallback = function(result) {
    var currentState = this.gameManagerController_.getState(), currentPlayers = currentState.getPlayers(), currentPlayer = this.findPlayer(playerId, currentPlayers);
    assertNotNullNorUndefined(currentPlayer);
    assertEquals(currentPlayer.getPlayerState(), playerState);
    assertEquals(result.playerId, playerId);
    assertEquals(currentState.getGameplayState(), gameplayState);
    assertEquals(currentState.getLobbyState(), lobbyState);
    this.asyncTestCase_.signal();
  }.bind(this);
  this.gameManagerController_.sendGameMessage(playerId, message, successCallback, function(error) {
    fail("Failed to send Game message : " + JSON.stringify(error));
  });
};
castv2testing.e2e.GameManagerTestHelper.prototype.findPlayer = function(playerId, players) {
  for (var i = 0;i < players.length;i++) {
    if (players[i].getPlayerId() == playerId) {
      return players[i];
    }
  }
  return null;
};
castv2testing.e2e.GameManagerTestHelper.prototype.assertDestroyGameManagerClient = function() {
  this.gameManagerController_.destroyGameManagerClient();
  assertTrue(this.gameManagerController_.isGameManagerClientDisposed());
  assertThrows(function() {
    this.gameManagerController_.getState();
  }.bind(this));
};
castv2testing.e2e.GameManagerTestHelper.prototype.asyncAssertAndSignalStopSession = function() {
  var successCallback = function(session) {
    this.asyncTestCase_.signal();
  }.bind(this), errorCallback = function(error) {
    this.isBling_() ? this.asyncTestCase_.signal() : fail("Fail to stop session, error message" + JSON.stringify(error));
  }.bind(this);
  this.controller_.stopSession(successCallback, errorCallback);
};
goog.setTestOnly();
var asyncTestCase = goog.testing.AsyncTestCase.createAndInstall();
asyncTestCase.stepTimeout = 3E4;
var controller = null, gameManagerController = null, gameManagerTestHelper = null;
function setUpPage() {
  controller || (controller = new castv2testing.e2e.Controller);
  gameManagerController || (gameManagerController = new castv2testing.e2e.GameManagerController);
  gameManagerTestHelper || (gameManagerTestHelper = new castv2testing.e2e.GameManagerTestHelper(controller, gameManagerController, asyncTestCase));
  asyncTestCase.setTests([new goog.testing.TestCase.Test("testSetupSession", testSetupSession), new goog.testing.TestCase.Test("testSetupGameManagerClient", testSetupGameManagerClient), new goog.testing.TestCase.Test("testWaitForRunningGame", testWaitForRunningGame), new goog.testing.TestCase.Test("testCreatePlayer", testCreatePlayer), new goog.testing.TestCase.Test("testSendManyGameMessages", testSendManyGameMessages), new goog.testing.TestCase.Test("testTeardown", testTeardown)]);
}
function testSetupSession() {
  gameManagerTestHelper.asyncAssertAndSignalLoadAPIScript();
  gameManagerTestHelper.asyncAssertAndSignalInitializeController("0244B03F");
  gameManagerTestHelper.asyncAssertAndSignalRequestSession();
  asyncTestCase.waitForSignals(3, "Waiting to set up cast session");
}
function testSetupGameManagerClient() {
  gameManagerTestHelper.asyncAssertAndSignalCreateGameManagerClient([chrome.cast.games.GameplayState.LOADING, chrome.cast.games.GameplayState.RUNNING]);
  asyncTestCase.waitForSignals(1, "Waiting to create game manager client");
}
function testWaitForRunningGame() {
  gameManagerTestHelper.asyncAssertAndSignalGameplayStateChanged(chrome.cast.games.GameplayState.RUNNING);
  asyncTestCase.waitForSignals(1, "Waiting for gameplay to change to running");
}
function testCreatePlayer() {
  gameManagerTestHelper.asyncAssertAndSignalCreatePlayer("Player1", chrome.cast.games.PlayerState.PLAYING, 1);
  asyncTestCase.waitForSignals(1, "Waiting for player to be created");
}
function testSendManyGameMessages() {
  for (var i = 0;100 > i;i++) {
    var message = {};
    message.angle1 = i;
    message.angle2 = i + 1;
    message.angle3 = i + 2;
    gameManagerTestHelper.asyncAssertAndSignalSendGameMessage("Player1", message, chrome.cast.games.PlayerState.PLAYING, chrome.cast.games.GameplayState.RUNNING, chrome.cast.games.LobbyState.OPEN);
  }
  asyncTestCase.waitForSignals(100, "Waiting for game messages");
}
function testTeardown() {
  gameManagerTestHelper.assertDestroyGameManagerClient();
  gameManagerTestHelper.asyncAssertAndSignalStopSession();
  asyncTestCase.waitForSignals(1, "Waiting to tear down session");
}
;goog.json = {};
goog.json.USE_NATIVE_JSON = !1;
goog.json.isValid = function(s) {
  return /^\s*$/.test(s) ? !1 : /^[\],:{}\s\u2028\u2029]*$/.test(s.replace(/\\["\\\/bfnrtu]/g, "@").replace(/(?:"[^"\\\n\r\u2028\u2029\x00-\x08\x0a-\x1f]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)[\s\u2028\u2029]*(?=:|,|]|}|$)/g, "]").replace(/(?:^|:|,)(?:[\s\u2028\u2029]*\[)+/g, ""));
};
goog.json.parse = goog.json.USE_NATIVE_JSON ? goog.global.JSON.parse : function(s) {
  var o = String(s);
  if (goog.json.isValid(o)) {
    try {
      return eval("(" + o + ")");
    } catch (ex) {
    }
  }
  throw Error("Invalid JSON string: " + o);
};
goog.json.unsafeParse = goog.json.USE_NATIVE_JSON ? goog.global.JSON.parse : function(s) {
  return eval("(" + s + ")");
};
goog.json.serialize = goog.json.USE_NATIVE_JSON ? goog.global.JSON.stringify : function(object, opt_replacer) {
  return (new goog.json.Serializer(opt_replacer)).serialize(object);
};
goog.json.Serializer = function(opt_replacer) {
  this.replacer_ = opt_replacer;
};
goog.json.Serializer.prototype.serialize = function(object) {
  var sb = [];
  this.serializeInternal(object, sb);
  return sb.join("");
};
goog.json.Serializer.prototype.serializeInternal = function(object, sb) {
  if (null == object) {
    sb.push("null");
  } else {
    if ("object" == typeof object) {
      if (goog.isArray(object)) {
        this.serializeArray(object, sb);
        return;
      }
      if (object instanceof String || object instanceof Number || object instanceof Boolean) {
        object = object.valueOf();
      } else {
        this.serializeObject_(object, sb);
        return;
      }
    }
    switch(typeof object) {
      case "string":
        this.serializeString_(object, sb);
        break;
      case "number":
        this.serializeNumber_(object, sb);
        break;
      case "boolean":
        sb.push(String(object));
        break;
      case "function":
        sb.push("null");
        break;
      default:
        throw Error("Unknown type: " + typeof object);
    }
  }
};
goog.json.Serializer.charToJsonCharCache_ = {'"':'\\"', "\\":"\\\\", "/":"\\/", "\b":"\\b", "\f":"\\f", "\n":"\\n", "\r":"\\r", "\t":"\\t", "\x0B":"\\u000b"};
goog.json.Serializer.charsToReplace_ = /\uffff/.test("\uffff") ? /[\\\"\x00-\x1f\x7f-\uffff]/g : /[\\\"\x00-\x1f\x7f-\xff]/g;
goog.json.Serializer.prototype.serializeString_ = function(s, sb) {
  sb.push('"', s.replace(goog.json.Serializer.charsToReplace_, function(c) {
    var rv = goog.json.Serializer.charToJsonCharCache_[c];
    rv || (rv = "\\u" + (c.charCodeAt(0) | 65536).toString(16).substr(1), goog.json.Serializer.charToJsonCharCache_[c] = rv);
    return rv;
  }), '"');
};
goog.json.Serializer.prototype.serializeNumber_ = function(n, sb) {
  sb.push(isFinite(n) && !isNaN(n) ? String(n) : "null");
};
goog.json.Serializer.prototype.serializeArray = function(arr, sb) {
  var l = arr.length;
  sb.push("[");
  for (var sep = "", i = 0;i < l;i++) {
    sb.push(sep);
    var value = arr[i];
    this.serializeInternal(this.replacer_ ? this.replacer_.call(arr, String(i), value) : value, sb);
    sep = ",";
  }
  sb.push("]");
};
goog.json.Serializer.prototype.serializeObject_ = function(obj, sb) {
  sb.push("{");
  var sep = "", key;
  for (key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      var value = obj[key];
      "function" != typeof value && (sb.push(sep), this.serializeString_(key, sb), sb.push(":"), this.serializeInternal(this.replacer_ ? this.replacer_.call(obj, key, value) : value, sb), sep = ",");
    }
  }
  sb.push("}");
};

