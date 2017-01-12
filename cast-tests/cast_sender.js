(function() {'use strict';var $jscomp = {};
$jscomp.scope = {};
$jscomp.inherits = function(childCtor, parentCtor) {
  function tempCtor() {
  }
  tempCtor.prototype = parentCtor.prototype;
  childCtor.prototype = new tempCtor;
  childCtor.prototype.constructor = childCtor;
  for (var p in parentCtor) {
    if (Object.defineProperties) {
      var descriptor = Object.getOwnPropertyDescriptor(parentCtor, p);
      if (descriptor) {
        Object.defineProperty(childCtor, p, descriptor);
      }
    } else {
      childCtor[p] = parentCtor[p];
    }
  }
};
$jscomp.defineProperty = typeof Object.defineProperties == "function" ? Object.defineProperty : function(target, property, descriptor) {
  if (descriptor.get || descriptor.set) {
    throw new TypeError("ES3 does not support getters and setters.");
  }
  if (target == Array.prototype || target == Object.prototype) {
    return;
  }
  target[property] = descriptor.value;
};
$jscomp.getGlobal = function(maybeGlobal) {
  return typeof window != "undefined" && window === maybeGlobal ? maybeGlobal : typeof global != "undefined" && global != null ? global : maybeGlobal;
};
$jscomp.global = $jscomp.getGlobal(this);
$jscomp.SYMBOL_PREFIX = "jscomp_symbol_";
$jscomp.initSymbol = function() {
  $jscomp.initSymbol = function() {
  };
  if (!$jscomp.global.Symbol) {
    $jscomp.global.Symbol = $jscomp.Symbol;
  }
};
$jscomp.symbolCounter_ = 0;
$jscomp.Symbol = function(opt_description) {
  return $jscomp.SYMBOL_PREFIX + (opt_description || "") + $jscomp.symbolCounter_++;
};
$jscomp.initSymbolIterator = function() {
  $jscomp.initSymbol();
  var symbolIterator = $jscomp.global.Symbol.iterator;
  if (!symbolIterator) {
    symbolIterator = $jscomp.global.Symbol.iterator = $jscomp.global.Symbol("iterator");
  }
  if (typeof Array.prototype[symbolIterator] != "function") {
    $jscomp.defineProperty(Array.prototype, symbolIterator, {configurable:true, writable:true, value:function() {
      return $jscomp.arrayIterator(this);
    }});
  }
  $jscomp.initSymbolIterator = function() {
  };
};
$jscomp.arrayIterator = function(array) {
  var index = 0;
  return $jscomp.iteratorPrototype(function() {
    if (index < array.length) {
      return {done:false, value:array[index++]};
    } else {
      return {done:true};
    }
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
$jscomp.makeIterator = function(iterable) {
  $jscomp.initSymbolIterator();
  var iteratorFunction = iterable[Symbol.iterator];
  return iteratorFunction ? iteratorFunction.call(iterable) : $jscomp.arrayIterator(iterable);
};
var goog = goog || {};
goog.global = this;
goog.isDef = function(val) {
  return val !== void 0;
};
goog.exportPath_ = function(name, opt_object, opt_objectToExportTo) {
  var parts = name.split("."), cur = opt_objectToExportTo || goog.global;
  if (!(parts[0] in cur) && cur.execScript) {
    cur.execScript("var " + parts[0]);
  }
  for (var part;parts.length && (part = parts.shift());) {
    if (!parts.length && goog.isDef(opt_object)) {
      cur[part] = opt_object;
    } else {
      if (cur[part]) {
        cur = cur[part];
      } else {
        cur = cur[part] = {};
      }
    }
  }
};
goog.define = function(name, defaultValue) {
  var value = defaultValue;
  if (!true) {
    if (goog.global.CLOSURE_UNCOMPILED_DEFINES && Object.prototype.hasOwnProperty.call(goog.global.CLOSURE_UNCOMPILED_DEFINES, name)) {
      value = goog.global.CLOSURE_UNCOMPILED_DEFINES[name];
    } else {
      if (goog.global.CLOSURE_DEFINES && Object.prototype.hasOwnProperty.call(goog.global.CLOSURE_DEFINES, name)) {
        value = goog.global.CLOSURE_DEFINES[name];
      }
    }
  }
  goog.exportPath_(name, value);
};
goog.DEBUG = true;
goog.LOCALE = "en";
goog.TRUSTED_SITE = true;
goog.STRICT_MODE_COMPATIBLE = false;
goog.DISALLOW_TEST_ONLY_CODE = true && !goog.DEBUG;
goog.ENABLE_CHROME_APP_SAFE_SCRIPT_LOADING = false;
goog.provide = function(name) {
  if (goog.isInModuleLoader_()) {
    throw Error("goog.provide can not be used within a goog.module.");
  }
  if (!true) {
    if (goog.isProvided_(name)) {
      throw Error('Namespace "' + name + '" already declared.');
    }
  }
  goog.constructNamespace_(name);
};
goog.constructNamespace_ = function(name, opt_obj) {
  if (!true) {
    delete goog.implicitNamespaces_[name];
    for (var namespace = name;namespace = namespace.substring(0, namespace.lastIndexOf("."));) {
      if (goog.getObjectByName(namespace)) {
        break;
      }
      goog.implicitNamespaces_[namespace] = true;
    }
  }
  goog.exportPath_(name, opt_obj);
};
goog.VALID_MODULE_RE_ = /^[a-zA-Z_$][a-zA-Z0-9._$]*$/;
goog.module = function(name) {
  if (!goog.isString(name) || !name || name.search(goog.VALID_MODULE_RE_) == -1) {
    throw Error("Invalid module identifier");
  }
  if (!goog.isInModuleLoader_()) {
    throw Error("Module " + name + " has been loaded incorrectly. Note, " + "modules cannot be loaded as normal scripts. They require some kind of " + "pre-processing step. You're likely trying to load a module via a " + "script tag or as a part of a concatenated bundle without rewriting the " + "module. For more info see: " + "https://github.com/google/closure-library/wiki/goog.module:-an-ES6-module-like-alternative-to-goog.provide.");
  }
  if (goog.moduleLoaderState_.moduleName) {
    throw Error("goog.module may only be called once per module.");
  }
  goog.moduleLoaderState_.moduleName = name;
  if (!true) {
    if (goog.isProvided_(name)) {
      throw Error('Namespace "' + name + '" already declared.');
    }
    delete goog.implicitNamespaces_[name];
  }
};
goog.module.get = function(name) {
  return goog.module.getInternal_(name);
};
goog.module.getInternal_ = function(name) {
  if (!true) {
    if (name in goog.loadedModules_) {
      return goog.loadedModules_[name];
    } else {
      if (!goog.implicitNamespaces_[name]) {
        var ns = goog.getObjectByName(name);
        return ns != null ? ns : null;
      }
    }
  }
  return null;
};
goog.moduleLoaderState_ = null;
goog.isInModuleLoader_ = function() {
  return goog.moduleLoaderState_ != null;
};
goog.module.declareLegacyNamespace = function() {
  if (!true && !goog.isInModuleLoader_()) {
    throw new Error("goog.module.declareLegacyNamespace must be called from " + "within a goog.module");
  }
  if (!true && !goog.moduleLoaderState_.moduleName) {
    throw Error("goog.module must be called prior to " + "goog.module.declareLegacyNamespace.");
  }
  goog.moduleLoaderState_.declareLegacyNamespace = true;
};
goog.setTestOnly = function(opt_message) {
  if (goog.DISALLOW_TEST_ONLY_CODE) {
    opt_message = opt_message || "";
    throw Error("Importing test-only code into non-debug environment" + (opt_message ? ": " + opt_message : "."));
  }
};
goog.forwardDeclare = function() {
};
if (!true) {
  goog.isProvided_ = function(name) {
    return name in goog.loadedModules_ || !goog.implicitNamespaces_[name] && goog.isDefAndNotNull(goog.getObjectByName(name));
  };
  goog.implicitNamespaces_ = {"goog.module":true};
}
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
    if (!opt_loadFlags || typeof opt_loadFlags === "boolean") {
      opt_loadFlags = opt_loadFlags ? {module:"goog"} : {};
    }
    for (var i = 0;provide = provides[i];i++) {
      deps.nameToPath[provide] = path;
      deps.loadFlags[path] = opt_loadFlags;
    }
    for (var j = 0;require = requires[j];j++) {
      if (!(path in deps.requires)) {
        deps.requires[path] = {};
      }
      deps.requires[path][require] = true;
    }
  }
};
goog.useStrictRequires = false;
goog.ENABLE_DEBUG_LOADER = true;
goog.logToConsole_ = function(msg) {
  if (goog.global.console) {
    goog.global.console.error(msg);
  }
};
goog.require = function(name) {
  if (!true) {
    if (goog.ENABLE_DEBUG_LOADER && goog.IS_OLD_IE_) {
      goog.maybeProcessDeferredDep_(name);
    }
    if (goog.isProvided_(name)) {
      if (goog.isInModuleLoader_()) {
        return goog.module.getInternal_(name);
      }
    } else {
      if (goog.ENABLE_DEBUG_LOADER) {
        var path = goog.getPathFromDeps_(name);
        if (path) {
          goog.writeScripts_(path);
        } else {
          var errorMessage = "goog.require could not find: " + name;
          goog.logToConsole_(errorMessage);
          if (goog.useStrictRequires) {
            throw Error(errorMessage);
          }
        }
      }
    }
    return null;
  }
};
goog.basePath = "";
goog.nullFunction = function() {
};
goog.abstractMethod = function() {
  throw Error("unimplemented abstract method");
};
goog.addSingletonGetter = function(ctor) {
  ctor.instance_ = undefined;
  ctor.getInstance = function() {
    if (ctor.instance_) {
      return ctor.instance_;
    }
    if (goog.DEBUG) {
      goog.instantiatedSingletons_[goog.instantiatedSingletons_.length] = ctor;
    }
    return ctor.instance_ = new ctor;
  };
};
goog.instantiatedSingletons_ = [];
goog.LOAD_MODULE_USING_EVAL = true;
goog.SEAL_MODULE_EXPORTS = goog.DEBUG;
goog.loadedModules_ = {};
goog.DEPENDENCIES_ENABLED = !true && goog.ENABLE_DEBUG_LOADER;
goog.TRANSPILE = "detect";
goog.TRANSPILER = "transpile.js";
if (goog.DEPENDENCIES_ENABLED) {
  goog.dependencies_ = {loadFlags:{}, nameToPath:{}, requires:{}, visited:{}, written:{}, deferred:{}};
  goog.inHtmlDocument_ = function() {
    var doc = goog.global.document;
    return doc != null && "write" in doc;
  };
  goog.findBasePath_ = function() {
    if (goog.isDef(goog.global.CLOSURE_BASE_PATH)) {
      goog.basePath = goog.global.CLOSURE_BASE_PATH;
      return;
    } else {
      if (!goog.inHtmlDocument_()) {
        return;
      }
    }
    for (var scripts = goog.global.document.getElementsByTagName("SCRIPT"), i = scripts.length - 1;i >= 0;--i) {
      var src = scripts[i].src, qmark = src.lastIndexOf("?"), l = qmark == -1 ? src.length : qmark;
      if (src.substr(l - 7, 7) == "base.js") {
        goog.basePath = src.substr(0, l - 7);
        return;
      }
    }
  };
  goog.importScript_ = function(src, opt_sourceText) {
    if ((goog.global.CLOSURE_IMPORT_SCRIPT || goog.writeScriptTag_)(src, opt_sourceText)) {
      goog.dependencies_.written[src] = true;
    }
  };
  goog.IS_OLD_IE_ = !!(!goog.global.atob && goog.global.document && goog.global.document.all);
  goog.importProcessedScript_ = function(src, isModule, needsTranspile) {
    goog.importScript_("", 'goog.retrieveAndExec_("' + src + '", ' + isModule + ", " + needsTranspile + ");");
  };
  goog.queuedModules_ = [];
  goog.wrapModule_ = function(srcUrl, scriptText) {
    if (!goog.LOAD_MODULE_USING_EVAL || !goog.isDef(goog.global.JSON)) {
      return "" + "goog.loadModule(function(exports) {" + '"use strict";' + scriptText + "\n" + ";return exports" + "});" + "\n//# sourceURL=" + srcUrl + "\n";
    } else {
      return "" + "goog.loadModule(" + goog.global.JSON.stringify(scriptText + "\n//# sourceURL=" + srcUrl + "\n") + ");";
    }
  };
  goog.loadQueuedModules_ = function() {
    var count = goog.queuedModules_.length;
    if (count > 0) {
      var queue = goog.queuedModules_;
      goog.queuedModules_ = [];
      for (var i = 0;i < count;i++) {
        goog.maybeProcessDeferredPath_(queue[i]);
      }
    }
  };
  goog.maybeProcessDeferredDep_ = function(name) {
    if (goog.isDeferredModule_(name) && goog.allDepsAreAvailable_(name)) {
      goog.maybeProcessDeferredPath_(goog.basePath + goog.getPathFromDeps_(name));
    }
  };
  goog.isDeferredModule_ = function(name) {
    var path = goog.getPathFromDeps_(name), loadFlags = path && goog.dependencies_.loadFlags[path] || {}, languageLevel = loadFlags.lang || "es3";
    if (path && (loadFlags.module == "goog" || goog.needsTranspile_(languageLevel))) {
      return goog.basePath + path in goog.dependencies_.deferred;
    }
    return false;
  };
  goog.allDepsAreAvailable_ = function(name) {
    var path = goog.getPathFromDeps_(name);
    if (path && path in goog.dependencies_.requires) {
      for (var requireName in goog.dependencies_.requires[path]) {
        if (!goog.isProvided_(requireName) && !goog.isDeferredModule_(requireName)) {
          return false;
        }
      }
    }
    return true;
  };
  goog.maybeProcessDeferredPath_ = function(abspath) {
    if (abspath in goog.dependencies_.deferred) {
      var src = goog.dependencies_.deferred[abspath];
      delete goog.dependencies_.deferred[abspath];
      goog.globalEval(src);
    }
  };
  goog.loadModuleFromUrl = function(url) {
    goog.retrieveAndExec_(url, true, false);
  };
  goog.writeScriptSrcNode_ = function(src) {
    goog.global.document.write('<script type="text/javascript" src="' + src + '"></' + "script>");
  };
  goog.appendScriptSrcNode_ = function(src) {
    var doc = goog.global.document, scriptEl = doc.createElement("script");
    scriptEl.type = "text/javascript";
    scriptEl.src = src;
    scriptEl.defer = false;
    scriptEl.async = false;
    doc.head.appendChild(scriptEl);
  };
  goog.writeScriptTag_ = function(src, opt_sourceText) {
    if (goog.inHtmlDocument_()) {
      var doc = goog.global.document;
      if (!goog.ENABLE_CHROME_APP_SAFE_SCRIPT_LOADING && doc.readyState == "complete") {
        if (/\bdeps.js$/.test(src)) {
          return false;
        } else {
          throw Error('Cannot write "' + src + '" after document load');
        }
      }
      if (opt_sourceText === undefined) {
        if (!goog.IS_OLD_IE_) {
          if (goog.ENABLE_CHROME_APP_SAFE_SCRIPT_LOADING) {
            goog.appendScriptSrcNode_(src);
          } else {
            goog.writeScriptSrcNode_(src);
          }
        } else {
          var state = " onreadystatechange='goog.onScriptLoad_(this, " + ++goog.lastNonModuleScriptIndex_ + ")' ";
          doc.write('<script type="text/javascript" src="' + src + '"' + state + "></" + "script>");
        }
      } else {
        doc.write('<script type="text/javascript">' + goog.protectScriptTag_(opt_sourceText) + "</" + "script>");
      }
      return true;
    } else {
      return false;
    }
  };
  goog.protectScriptTag_ = function(str) {
    return str.replace(/<\/(SCRIPT)/ig, "\\x3c\\$1");
  };
  goog.needsTranspile_ = function(lang) {
    if (goog.TRANSPILE == "always") {
      return true;
    } else {
      if (goog.TRANSPILE == "never") {
        return false;
      } else {
        if (!goog.requiresTranspilation_) {
          goog.requiresTranspilation_ = goog.createRequiresTranspilation_();
        }
      }
    }
    if (lang in goog.requiresTranspilation_) {
      return goog.requiresTranspilation_[lang];
    } else {
      throw new Error("Unknown language mode: " + lang);
    }
  };
  goog.requiresTranspilation_ = null;
  goog.lastNonModuleScriptIndex_ = 0;
  goog.onScriptLoad_ = function(script, scriptIndex) {
    if (script.readyState == "complete" && goog.lastNonModuleScriptIndex_ == scriptIndex) {
      goog.loadQueuedModules_();
    }
    return true;
  };
  goog.writeScripts_ = function(pathToLoad) {
    function visitNode(path) {
      if (path in deps.written) {
        return;
      }
      if (path in deps.visited) {
        return;
      }
      deps.visited[path] = true;
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
      if (!(path in seenScript)) {
        seenScript[path] = true;
        scripts.push(path);
      }
    }
    var scripts = [], seenScript = {}, deps = goog.dependencies_;
    visitNode(pathToLoad);
    for (var i = 0;i < scripts.length;i++) {
      var path$jscomp$0 = scripts[i];
      goog.dependencies_.written[path$jscomp$0] = true;
    }
    var moduleState = goog.moduleLoaderState_;
    goog.moduleLoaderState_ = null;
    for (i = 0;i < scripts.length;i++) {
      if (path$jscomp$0 = scripts[i]) {
        var loadFlags = deps.loadFlags[path$jscomp$0] || {}, needsTranspile = goog.needsTranspile_(loadFlags.lang || "es3");
        if (loadFlags.module == "goog" || needsTranspile) {
          goog.importProcessedScript_(goog.basePath + path$jscomp$0, loadFlags.module == "goog", needsTranspile);
        } else {
          goog.importScript_(goog.basePath + path$jscomp$0);
        }
      } else {
        goog.moduleLoaderState_ = moduleState;
        throw Error("Undefined script input");
      }
    }
    goog.moduleLoaderState_ = moduleState;
  };
  goog.getPathFromDeps_ = function(rule) {
    if (rule in goog.dependencies_.nameToPath) {
      return goog.dependencies_.nameToPath[rule];
    } else {
      return null;
    }
  };
  goog.findBasePath_();
  if (!goog.global.CLOSURE_NO_DEPS) {
    goog.importScript_(goog.basePath + "deps.js");
  }
}
goog.loadModule = function(moduleDef) {
  var previousState = goog.moduleLoaderState_;
  try {
    goog.moduleLoaderState_ = {moduleName:undefined, declareLegacyNamespace:false};
    var exports;
    if (goog.isFunction(moduleDef)) {
      exports = moduleDef.call(undefined, {});
    } else {
      if (goog.isString(moduleDef)) {
        exports = goog.loadModuleFromSource_.call(undefined, moduleDef);
      } else {
        throw Error("Invalid module definition");
      }
    }
    var moduleName = goog.moduleLoaderState_.moduleName;
    if (!goog.isString(moduleName) || !moduleName) {
      throw Error('Invalid module name "' + moduleName + '"');
    }
    if (goog.moduleLoaderState_.declareLegacyNamespace) {
      goog.constructNamespace_(moduleName, exports);
    } else {
      if (goog.SEAL_MODULE_EXPORTS && Object.seal && goog.isObject(exports)) {
        Object.seal(exports);
      }
    }
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
    if (components[i] == ".") {
      components.splice(i, 1);
    } else {
      if (i && components[i] == ".." && components[i - 1] && components[i - 1] != "..") {
        components.splice(--i, 2);
      } else {
        i++;
      }
    }
  }
  return components.join("/");
};
goog.loadFileSync_ = function(src) {
  if (goog.global.CLOSURE_LOAD_FILE_SYNC) {
    return goog.global.CLOSURE_LOAD_FILE_SYNC(src);
  } else {
    try {
      var xhr = new goog.global.XMLHttpRequest;
      xhr.open("get", src, false);
      xhr.send();
      return xhr.status == 0 || xhr.status == 200 ? xhr.responseText : null;
    } catch (err) {
      return null;
    }
  }
};
goog.retrieveAndExec_ = function(src, isModule, needsTranspile) {
  if (!true) {
    var originalPath = src;
    src = goog.normalizePath_(src);
    var importScript = goog.global.CLOSURE_IMPORT_SCRIPT || goog.writeScriptTag_, scriptText = goog.loadFileSync_(src);
    if (scriptText == null) {
      throw new Error('Load of "' + src + '" failed');
    }
    if (needsTranspile) {
      scriptText = goog.transpile_.call(goog.global, scriptText, src);
    }
    if (isModule) {
      scriptText = goog.wrapModule_(src, scriptText);
    } else {
      scriptText += "\n//# sourceURL=" + src;
    }
    if (goog.IS_OLD_IE_) {
      goog.dependencies_.deferred[originalPath] = scriptText;
      goog.queuedModules_.push(originalPath);
    } else {
      importScript(src, scriptText);
    }
  }
};
goog.transpile_ = function(code$jscomp$0, path$jscomp$0) {
  var jscomp = goog.global.$jscomp;
  if (!jscomp) {
    goog.global.$jscomp = jscomp = {};
  }
  var transpile = jscomp.transpile;
  if (!transpile) {
    var transpilerPath = goog.basePath + goog.TRANSPILER, transpilerCode = goog.loadFileSync_(transpilerPath);
    if (transpilerCode) {
      eval(transpilerCode + "\n//# sourceURL=" + transpilerPath);
      if (goog.global.$gwtExport && goog.global.$gwtExport.$jscomp && !goog.global.$gwtExport.$jscomp.transpile) {
        throw new Error('The transpiler did not properly export the "transpile" ' + "method. $gwtExport: " + JSON.stringify(goog.global.$gwtExport));
      }
      goog.global.$jscomp.transpile = goog.global.$gwtExport.$jscomp.transpile;
      jscomp = goog.global.$jscomp;
      transpile = jscomp.transpile;
    }
  }
  if (!transpile) {
    var suffix = " requires transpilation but no transpiler was found.", suffix = suffix + (' Please add "//javascript/closure:transpiler" as a data ' + "dependency to ensure it is included."), transpile = jscomp.transpile = function(code, path) {
      goog.logToConsole_(path + suffix);
      return code;
    };
  }
  return transpile(code$jscomp$0, path$jscomp$0);
};
goog.typeOf = function(value) {
  var s = typeof value;
  if (s == "object") {
    if (value) {
      if (value instanceof Array) {
        return "array";
      } else {
        if (value instanceof Object) {
          return s;
        }
      }
      var className = Object.prototype.toString.call(value);
      if (className == "[object Window]") {
        return "object";
      }
      if (className == "[object Array]" || typeof value.length == "number" && typeof value.splice != "undefined" && typeof value.propertyIsEnumerable != "undefined" && !value.propertyIsEnumerable("splice")) {
        return "array";
      }
      if (className == "[object Function]" || typeof value.call != "undefined" && typeof value.propertyIsEnumerable != "undefined" && !value.propertyIsEnumerable("call")) {
        return "function";
      }
    } else {
      return "null";
    }
  } else {
    if (s == "function" && typeof value.call == "undefined") {
      return "object";
    }
  }
  return s;
};
goog.isNull = function(val) {
  return val === null;
};
goog.isDefAndNotNull = function(val) {
  return val != null;
};
goog.isArray = function(val) {
  return goog.typeOf(val) == "array";
};
goog.isArrayLike = function(val) {
  var type = goog.typeOf(val);
  return type == "array" || type == "object" && typeof val.length == "number";
};
goog.isDateLike = function(val) {
  return goog.isObject(val) && typeof val.getFullYear == "function";
};
goog.isString = function(val) {
  return typeof val == "string";
};
goog.isBoolean = function(val) {
  return typeof val == "boolean";
};
goog.isNumber = function(val) {
  return typeof val == "number";
};
goog.isFunction = function(val) {
  return goog.typeOf(val) == "function";
};
goog.isObject = function(val) {
  var type = typeof val;
  return type == "object" && val != null || type == "function";
};
goog.getUid = function(obj) {
  return obj[goog.UID_PROPERTY_] || (obj[goog.UID_PROPERTY_] = ++goog.uidCounter_);
};
goog.hasUid = function(obj) {
  return !!obj[goog.UID_PROPERTY_];
};
goog.removeUid = function(obj) {
  if (obj !== null && "removeAttribute" in obj) {
    obj.removeAttribute(goog.UID_PROPERTY_);
  }
  try {
    delete obj[goog.UID_PROPERTY_];
  } catch (ex) {
  }
};
goog.UID_PROPERTY_ = "closure_uid_" + (Math.random() * 1e9 >>> 0);
goog.uidCounter_ = 0;
goog.getHashCode = goog.getUid;
goog.removeHashCode = goog.removeUid;
goog.cloneObject = function(obj) {
  var type = goog.typeOf(obj);
  if (type == "object" || type == "array") {
    if (obj.clone) {
      return obj.clone();
    }
    var clone = type == "array" ? [] : {}, key;
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
    throw new Error;
  }
  if (arguments.length > 2) {
    var boundArgs = Array.prototype.slice.call(arguments, 2);
    return function() {
      var newArgs = Array.prototype.slice.call(arguments);
      Array.prototype.unshift.apply(newArgs, boundArgs);
      return fn.apply(selfObj, newArgs);
    };
  } else {
    return function() {
      return fn.apply(selfObj, arguments);
    };
  }
};
goog.bind = function(fn, selfObj, var_args) {
  if (Function.prototype.bind && Function.prototype.bind.toString().indexOf("native code") != -1) {
    goog.bind = goog.bindNative_;
  } else {
    goog.bind = goog.bindJs_;
  }
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
      if (goog.evalWorksForGlobals_ == null) {
        goog.global.eval("var _evalTest_ = 1;");
        if (typeof goog.global._evalTest_ != "undefined") {
          try {
            delete goog.global._evalTest_;
          } catch (ignore) {
          }
          goog.evalWorksForGlobals_ = true;
        } else {
          goog.evalWorksForGlobals_ = false;
        }
      }
      if (goog.evalWorksForGlobals_) {
        goog.global.eval(script);
      } else {
        var doc = goog.global.document, scriptElt = doc.createElement("SCRIPT");
        scriptElt.type = "text/javascript";
        scriptElt.defer = false;
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
  if (String(className).charAt(0) == ".") {
    throw new Error('className passed in goog.getCssName must not start with ".".' + " You passed: " + className);
  }
  var getMapping = function(cssName) {
    return goog.cssNameMapping_[cssName] || cssName;
  }, renameByParts = function(cssName) {
    for (var parts = cssName.split("-"), mapped = [], i = 0;i < parts.length;i++) {
      mapped.push(getMapping(parts[i]));
    }
    return mapped.join("-");
  }, rename;
  if (goog.cssNameMapping_) {
    rename = goog.cssNameMappingStyle_ == "BY_WHOLE" ? getMapping : renameByParts;
  } else {
    rename = function(a) {
      return a;
    };
  }
  var result = opt_modifier ? className + "-" + rename(opt_modifier) : rename(className);
  if (goog.global.CLOSURE_CSS_NAME_MAP_FN) {
    return goog.global.CLOSURE_CSS_NAME_MAP_FN(result);
  }
  return result;
};
goog.setCssNameMapping = function(mapping, opt_style) {
  goog.cssNameMapping_ = mapping;
  goog.cssNameMappingStyle_ = opt_style;
};
if (!true && goog.global.CLOSURE_CSS_NAME_MAPPING) {
  goog.cssNameMapping_ = goog.global.CLOSURE_CSS_NAME_MAPPING;
}
goog.getMsg = function(str, opt_values) {
  if (opt_values) {
    str = str.replace(/\{\$([^}]+)}/g, function(match, key) {
      return opt_values != null && key in opt_values ? opt_values[key] : match;
    });
  }
  return str;
};
goog.getMsgWithFallback = function(a) {
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
    for (var args = new Array(arguments.length - 2), i = 2;i < arguments.length;i++) {
      args[i - 2] = arguments[i];
    }
    return parentCtor.prototype[methodName].apply(me, args);
  };
};
goog.base = function(me, opt_methodName, var_args) {
  var caller = arguments.callee.caller;
  if (goog.STRICT_MODE_COMPATIBLE || goog.DEBUG && !caller) {
    throw Error("arguments.caller not defined.  goog.base() cannot be used " + "with strict mode code. See " + "http://www.ecma-international.org/ecma-262/5.1/#sec-C");
  }
  if (caller.superClass_) {
    for (var ctorArgs = new Array(arguments.length - 1), i = 1;i < arguments.length;i++) {
      ctorArgs[i - 1] = arguments[i];
    }
    return caller.superClass_.constructor.apply(me, ctorArgs);
  }
  for (var args = new Array(arguments.length - 2), i = 2;i < arguments.length;i++) {
    args[i - 2] = arguments[i];
  }
  for (var foundCaller = false, ctor = me.constructor;ctor;ctor = ctor.superClass_ && ctor.superClass_.constructor) {
    if (ctor.prototype[opt_methodName] === caller) {
      foundCaller = true;
    } else {
      if (foundCaller) {
        return ctor.prototype[opt_methodName].apply(me, args);
      }
    }
  }
  if (me[opt_methodName] === caller) {
    return me.constructor.prototype[opt_methodName].apply(me, args);
  } else {
    throw Error("goog.base called from a method of one name " + "to a method of a different name");
  }
};
goog.scope = function(fn) {
  if (goog.isInModuleLoader_()) {
    throw Error("goog.scope is not supported within a goog.module.");
  }
  fn.call(goog.global);
};
if (!true) {
  goog.global.COMPILED = true;
}
goog.defineClass = function(superClass, def) {
  var constructor = def.constructor, statics = def.statics;
  if (!constructor || constructor == Object.prototype.constructor) {
    constructor = function() {
      throw Error("cannot instantiate an interface (no constructor defined).");
    };
  }
  var cls = goog.defineClass.createSealingConstructor_(constructor, superClass);
  if (superClass) {
    goog.inherits(cls, superClass);
  }
  delete def.constructor;
  delete def.statics;
  goog.defineClass.applyProperties_(cls.prototype, def);
  if (statics != null) {
    if (statics instanceof Function) {
      statics(cls);
    } else {
      goog.defineClass.applyProperties_(cls, statics);
    }
  }
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
    if (this.constructor === wrappedCtr && superclassSealable && Object.seal instanceof Function) {
      Object.seal(instance);
    }
    return instance;
  };
  return wrappedCtr;
};
goog.defineClass.isUnsealable_ = function(ctr) {
  return ctr && ctr.prototype && ctr.prototype[goog.UNSEALABLE_CONSTRUCTOR_PROPERTY_];
};
goog.defineClass.OBJECT_PROTOTYPE_FIELDS_ = ["constructor", "hasOwnProperty", "isPrototypeOf", "propertyIsEnumerable", "toLocaleString", "toString", "valueOf"];
goog.defineClass.applyProperties_ = function(target, source) {
  for (var key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      target[key] = source[key];
    }
  }
  for (var i = 0;i < goog.defineClass.OBJECT_PROTOTYPE_FIELDS_.length;i++) {
    key = goog.defineClass.OBJECT_PROTOTYPE_FIELDS_[i];
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      target[key] = source[key];
    }
  }
};
goog.tagUnsealableClass = function(ctr) {
  if (!true && goog.defineClass.SEAL_CLASS_INSTANCES) {
    ctr.prototype[goog.UNSEALABLE_CONSTRUCTOR_PROPERTY_] = true;
  }
};
goog.UNSEALABLE_CONSTRUCTOR_PROPERTY_ = "goog_defineClass_legacy_unsealable";
goog.createRequiresTranspilation_ = function() {
  function addNewerLanguageTranspilationCheck(modeName, isSupported) {
    if (transpilationRequiredForAllLaterModes) {
      requiresTranspilation[modeName] = true;
    } else {
      if (isSupported()) {
        requiresTranspilation[modeName] = false;
      } else {
        transpilationRequiredForAllLaterModes = requiresTranspilation[modeName] = true;
      }
    }
  }
  function evalCheck(code) {
    try {
      return !!eval(code);
    } catch (ignored) {
      return false;
    }
  }
  var requiresTranspilation = {es3:false}, transpilationRequiredForAllLaterModes = false;
  addNewerLanguageTranspilationCheck("es5", function() {
    return evalCheck("[1,].length==1");
  });
  addNewerLanguageTranspilationCheck("es6", function() {
    return evalCheck('(()=>{"use strict";' + ("class X{constructor(){if(new.target!=String)throw 1;this.x=42}}" + "let q=Reflect.construct(X,[],String);if(q.x!=42||!(q instanceof " + "String))throw 1;for(const a of[2,3]){if(a==2)continue;function " + "f(z={a}){let a=0;return z.a}{function f(){return 0;}}return f()" + "==3}") + "})()");
  });
  addNewerLanguageTranspilationCheck("es6-impl", function() {
    return true;
  });
  addNewerLanguageTranspilationCheck("es7", function() {
    return evalCheck("2 ** 2 == 4");
  });
  addNewerLanguageTranspilationCheck("es8", function() {
    return evalCheck("async () => 1, true");
  });
  return requiresTranspilation;
};
var chrome = chrome || window.chrome || {};
chrome.cast = chrome.cast || {};
chrome.cast.media = chrome.cast.media || {};
chrome.cast.VERSION = [1, 2];
goog.exportSymbol("chrome.cast.VERSION", chrome.cast.VERSION);
chrome.cast.usingPresentationApi = true;
goog.exportSymbol("chrome.cast.usingPresentationApi", chrome.cast.usingPresentationApi);
chrome.cast.Error = function(code, opt_description, opt_details) {
  this.code = code;
  this.description = opt_description || null;
  this.details = opt_details || null;
};
goog.exportSymbol("chrome.cast.Error", chrome.cast.Error);
chrome.cast.SenderApplication = function(platform) {
  this.platform = platform;
  this.packageId = this.url = null;
};
goog.exportSymbol("chrome.cast.SenderApplication", chrome.cast.SenderApplication);
chrome.cast.Image = function(url) {
  this.url = url;
  this.width = this.height = null;
};
goog.exportSymbol("chrome.cast.Image", chrome.cast.Image);
chrome.cast.Volume = function(opt_level, opt_muted) {
  this.level = goog.isDef(opt_level) ? opt_level : null;
  this.muted = goog.isDef(opt_muted) ? opt_muted : null;
};
goog.exportSymbol("chrome.cast.Volume", chrome.cast.Volume);
goog.string = {};
goog.string.DETECT_DOUBLE_ESCAPING = false;
goog.string.FORCE_NON_DOM_HTML_UNESCAPING = false;
goog.string.Unicode = {NBSP:"\u00a0"};
goog.string.startsWith = function(str, prefix) {
  return str.lastIndexOf(prefix, 0) == 0;
};
goog.string.endsWith = function(str, suffix) {
  var l = str.length - suffix.length;
  return l >= 0 && str.indexOf(suffix, l) == l;
};
goog.string.caseInsensitiveStartsWith = function(str, prefix) {
  return goog.string.caseInsensitiveCompare(prefix, str.substr(0, prefix.length)) == 0;
};
goog.string.caseInsensitiveEndsWith = function(str, suffix) {
  return goog.string.caseInsensitiveCompare(suffix, str.substr(str.length - suffix.length, suffix.length)) == 0;
};
goog.string.caseInsensitiveEquals = function(str1, str2) {
  return str1.toLowerCase() == str2.toLowerCase();
};
goog.string.subs = function(str, var_args) {
  for (var splitParts = str.split("%s"), returnString = "", subsArguments = Array.prototype.slice.call(arguments, 1);subsArguments.length && splitParts.length > 1;) {
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
  return str.length == 0;
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
  return ch == " ";
};
goog.string.isUnicodeChar = function(ch) {
  return ch.length == 1 && ch >= " " && ch <= "~" || ch >= "\u0080" && ch <= "\ufffd";
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
  if (test1 < test2) {
    return -1;
  } else {
    if (test1 == test2) {
      return 0;
    } else {
      return 1;
    }
  }
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
  if (tokens1.length != tokens2.length) {
    return tokens1.length - tokens2.length;
  }
  return str1 < str2 ? -1 : 1;
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
    str = str.replace(goog.string.AMP_RE_, "&amp;").replace(goog.string.LT_RE_, "&lt;").replace(goog.string.GT_RE_, "&gt;").replace(goog.string.QUOT_RE_, "&quot;").replace(goog.string.SINGLE_QUOTE_RE_, "&#39;").replace(goog.string.NULL_RE_, "&#0;");
    if (goog.string.DETECT_DOUBLE_ESCAPING) {
      str = str.replace(goog.string.E_RE_, "&#101;");
    }
    return str;
  } else {
    if (!goog.string.ALL_RE_.test(str)) {
      return str;
    }
    if (str.indexOf("&") != -1) {
      str = str.replace(goog.string.AMP_RE_, "&amp;");
    }
    if (str.indexOf("<") != -1) {
      str = str.replace(goog.string.LT_RE_, "&lt;");
    }
    if (str.indexOf(">") != -1) {
      str = str.replace(goog.string.GT_RE_, "&gt;");
    }
    if (str.indexOf('"') != -1) {
      str = str.replace(goog.string.QUOT_RE_, "&quot;");
    }
    if (str.indexOf("'") != -1) {
      str = str.replace(goog.string.SINGLE_QUOTE_RE_, "&#39;");
    }
    if (str.indexOf("\x00") != -1) {
      str = str.replace(goog.string.NULL_RE_, "&#0;");
    }
    if (goog.string.DETECT_DOUBLE_ESCAPING && str.indexOf("e") != -1) {
      str = str.replace(goog.string.E_RE_, "&#101;");
    }
    return str;
  }
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
  if (goog.string.contains(str, "&")) {
    if (!goog.string.FORCE_NON_DOM_HTML_UNESCAPING && "document" in goog.global) {
      return goog.string.unescapeEntitiesUsingDom_(str);
    } else {
      return goog.string.unescapePureXmlEntities_(str);
    }
  }
  return str;
};
goog.string.unescapeEntitiesWithDocument = function(str, document) {
  if (goog.string.contains(str, "&")) {
    return goog.string.unescapeEntitiesUsingDom_(str, document);
  }
  return str;
};
goog.string.unescapeEntitiesUsingDom_ = function(str, opt_document) {
  var seen = {"&amp;":"&", "&lt;":"<", "&gt;":">", "&quot;":'"'}, div;
  if (opt_document) {
    div = opt_document.createElement("div");
  } else {
    div = goog.global.document.createElement("div");
  }
  return str.replace(goog.string.HTML_ENTITY_PATTERN_, function(s, entity) {
    var value = seen[s];
    if (value) {
      return value;
    }
    if (entity.charAt(0) == "#") {
      var n = Number("0" + entity.substr(1));
      if (!isNaN(n)) {
        value = String.fromCharCode(n);
      }
    }
    if (!value) {
      div.innerHTML = s + " ";
      value = div.firstChild.nodeValue.slice(0, -1);
    }
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
        if (entity.charAt(0) == "#") {
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
    var quoteChar = length == 1 ? quoteChars : quoteChars.charAt(i);
    if (str.charAt(0) == quoteChar && str.charAt(str.length - 1) == quoteChar) {
      return str.substring(1, str.length - 1);
    }
  }
  return str;
};
goog.string.truncate = function(str, chars, opt_protectEscapedCharacters) {
  if (opt_protectEscapedCharacters) {
    str = goog.string.unescapeEntities(str);
  }
  if (str.length > chars) {
    str = str.substring(0, chars - 3) + "...";
  }
  if (opt_protectEscapedCharacters) {
    str = goog.string.htmlEscape(str);
  }
  return str;
};
goog.string.truncateMiddle = function(str, chars, opt_protectEscapedCharacters, opt_trailingChars) {
  if (opt_protectEscapedCharacters) {
    str = goog.string.unescapeEntities(str);
  }
  if (opt_trailingChars && str.length > chars) {
    if (opt_trailingChars > chars) {
      opt_trailingChars = chars;
    }
    str = str.substring(0, chars - opt_trailingChars) + "..." + str.substring(str.length - opt_trailingChars);
  } else {
    if (str.length > chars) {
      var half = Math.floor(chars / 2);
      str = str.substring(0, half + chars % 2) + "..." + str.substring(str.length - half);
    }
  }
  if (opt_protectEscapedCharacters) {
    str = goog.string.htmlEscape(str);
  }
  return str;
};
goog.string.specialEscapeChars_ = {"\x00":"\\0", "\b":"\\b", "\f":"\\f", "\n":"\\n", "\r":"\\r", "\t":"\\t", "\x0B":"\\x0B", '"':'\\"', "\\":"\\\\", "<":"<"};
goog.string.jsEscapeCache_ = {"'":"\\'"};
goog.string.quote = function(s) {
  s = String(s);
  for (var sb = ['"'], i = 0;i < s.length;i++) {
    var ch = s.charAt(i), cc = ch.charCodeAt(0);
    sb[i + 1] = goog.string.specialEscapeChars_[ch] || (cc > 31 && cc < 127 ? ch : goog.string.escapeChar(ch));
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
  var rv, cc = c.charCodeAt(0);
  if (cc > 31 && cc < 127) {
    rv = c;
  } else {
    if (cc < 256) {
      rv = "\\x";
      if (cc < 16 || cc > 256) {
        rv += "0";
      }
    } else {
      rv = "\\u";
      if (cc < 4096) {
        rv += "0";
      }
    }
    rv += cc.toString(16).toUpperCase();
  }
  return goog.string.jsEscapeCache_[c] = rv;
};
goog.string.contains = function(str, subString) {
  return str.indexOf(subString) != -1;
};
goog.string.caseInsensitiveContains = function(str, subString) {
  return goog.string.contains(str.toLowerCase(), subString.toLowerCase());
};
goog.string.countOf = function(s, ss) {
  return s && ss ? s.split(ss).length - 1 : 0;
};
goog.string.removeAt = function(s, index, stringLength) {
  var resultStr = s;
  if (index >= 0 && index < s.length && stringLength > 0) {
    resultStr = s.substr(0, index) + s.substr(index + stringLength, s.length - index - stringLength);
  }
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
  return (new Array(length + 1)).join(string);
};
goog.string.padNumber = function(num, length, opt_precision) {
  var s = goog.isDef(opt_precision) ? num.toFixed(opt_precision) : String(num), index = s.indexOf(".");
  if (index == -1) {
    index = s.length;
  }
  return goog.string.repeat("0", Math.max(0, length - index)) + s;
};
goog.string.makeSafe = function(obj) {
  return obj == null ? "" : String(obj);
};
goog.string.buildString = function(var_args) {
  return Array.prototype.join.call(arguments, "");
};
goog.string.getRandomString = function() {
  return Math.floor(Math.random() * 2147483648).toString(36) + Math.abs(Math.floor(Math.random() * 2147483648) ^ goog.now()).toString(36);
};
goog.string.compareVersions = function(version1, version2) {
  for (var order = 0, v1Subs = goog.string.trim(String(version1)).split("."), v2Subs = goog.string.trim(String(version2)).split("."), subCount = Math.max(v1Subs.length, v2Subs.length), subIdx = 0;order == 0 && subIdx < subCount;subIdx++) {
    var v1Sub = v1Subs[subIdx] || "", v2Sub = v2Subs[subIdx] || "";
    do {
      var v1Comp = /(\d*)(\D*)(.*)/.exec(v1Sub) || ["", "", "", ""], v2Comp = /(\d*)(\D*)(.*)/.exec(v2Sub) || ["", "", "", ""];
      if (v1Comp[0].length == 0 && v2Comp[0].length == 0) {
        break;
      }
      order = goog.string.compareElements_(v1Comp[1].length == 0 ? 0 : parseInt(v1Comp[1], 10), v2Comp[1].length == 0 ? 0 : parseInt(v2Comp[1], 10)) || goog.string.compareElements_(v1Comp[2].length == 0, v2Comp[2].length == 0) || goog.string.compareElements_(v1Comp[2], v2Comp[2]);
      v1Sub = v1Comp[3];
      v2Sub = v2Comp[3];
    } while (order == 0);
  }
  return order;
};
goog.string.compareElements_ = function(left, right) {
  if (left < right) {
    return -1;
  } else {
    if (left > right) {
      return 1;
    }
  }
  return 0;
};
goog.string.hashCode = function(str) {
  for (var result = 0, i = 0;i < str.length;++i) {
    result = 31 * result + str.charCodeAt(i) >>> 0;
  }
  return result;
};
goog.string.uniqueStringCounter_ = Math.random() * 2147483648 | 0;
goog.string.createUniqueString = function() {
  return "goog_" + goog.string.uniqueStringCounter_++;
};
goog.string.toNumber = function(str) {
  var num = Number(str);
  if (num == 0 && goog.string.isEmptyOrWhitespace(str)) {
    return NaN;
  }
  return num;
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
  if (isFinite(value)) {
    value = String(value);
  }
  if (goog.isString(value)) {
    return /^\s*-?0x/i.test(value) ? parseInt(value, 16) : parseInt(value, 10);
  }
  return NaN;
};
goog.string.splitLimit = function(str, separator, limit) {
  for (var parts = str.split(separator), returnVal = [];limit > 0 && parts.length;) {
    returnVal.push(parts.shift());
    limit--;
  }
  if (parts.length) {
    returnVal.push(parts.join(separator));
  }
  return returnVal;
};
goog.string.lastComponent = function(str, separators) {
  if (!separators) {
    return str;
  } else {
    if (typeof separators == "string") {
      separators = [separators];
    }
  }
  for (var lastSeparatorIndex = -1, i = 0;i < separators.length;i++) {
    if (separators[i] == "") {
      continue;
    }
    var currentSeparatorIndex = str.lastIndexOf(separators[i]);
    if (currentSeparatorIndex > lastSeparatorIndex) {
      lastSeparatorIndex = currentSeparatorIndex;
    }
  }
  if (lastSeparatorIndex == -1) {
    return str;
  }
  return str.slice(lastSeparatorIndex + 1);
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
chrome.cast.AutoJoinPolicy = {CUSTOM_CONTROLLER_SCOPED:"custom_controller_scoped", TAB_AND_ORIGIN_SCOPED:"tab_and_origin_scoped", ORIGIN_SCOPED:"origin_scoped", PAGE_SCOPED:"page_scoped"};
goog.exportSymbol("chrome.cast.AutoJoinPolicy", chrome.cast.AutoJoinPolicy);
chrome.cast.DefaultActionPolicy = {CREATE_SESSION:"create_session", CAST_THIS_TAB:"cast_this_tab"};
goog.exportSymbol("chrome.cast.DefaultActionPolicy", chrome.cast.DefaultActionPolicy);
chrome.cast.Capability = {VIDEO_OUT:"video_out", AUDIO_OUT:"audio_out", VIDEO_IN:"video_in", AUDIO_IN:"audio_in", MULTIZONE_GROUP:"multizone_group"};
goog.exportSymbol("chrome.cast.Capability", chrome.cast.Capability);
chrome.cast.ErrorCode = {CANCEL:"cancel", TIMEOUT:"timeout", API_NOT_INITIALIZED:"api_not_initialized", INVALID_PARAMETER:"invalid_parameter", EXTENSION_NOT_COMPATIBLE:"extension_not_compatible", EXTENSION_MISSING:"extension_missing", RECEIVER_UNAVAILABLE:"receiver_unavailable", SESSION_ERROR:"session_error", CHANNEL_ERROR:"channel_error", LOAD_MEDIA_FAILED:"load_media_failed"};
goog.exportSymbol("chrome.cast.ErrorCode", chrome.cast.ErrorCode);
chrome.cast.ReceiverAvailability = {AVAILABLE:"available", UNAVAILABLE:"unavailable"};
goog.exportSymbol("chrome.cast.ReceiverAvailability", chrome.cast.ReceiverAvailability);
chrome.cast.SenderPlatform = {CHROME:"chrome", IOS:"ios", ANDROID:"android"};
goog.exportSymbol("chrome.cast.SenderPlatform", chrome.cast.SenderPlatform);
chrome.cast.ReceiverType = {CAST:"cast", DIAL:"dial", HANGOUT:"hangout", CUSTOM:"custom"};
goog.exportSymbol("chrome.cast.ReceiverType", chrome.cast.ReceiverType);
chrome.cast.DialAppState = {RUNNING:"running", STOPPED:"stopped", ERROR:"error"};
goog.exportSymbol("chrome.cast.DialAppState", chrome.cast.DialAppState);
chrome.cast.ReceiverAction = {CAST:"cast", STOP:"stop"};
goog.exportSymbol("chrome.cast.ReceiverAction", chrome.cast.ReceiverAction);
chrome.cast.SessionStatus = {CONNECTED:"connected", DISCONNECTED:"disconnected", STOPPED:"stopped"};
goog.exportSymbol("chrome.cast.SessionStatus", chrome.cast.SessionStatus);
chrome.cast.ApiConfig = function(sessionRequest, sessionListener, receiverListener, opt_autoJoinPolicy, opt_defaultActionPolicy) {
  this.sessionRequest = sessionRequest;
  this.sessionListener = sessionListener;
  this.receiverListener = receiverListener;
  this.autoJoinPolicy = opt_autoJoinPolicy || chrome.cast.AutoJoinPolicy.TAB_AND_ORIGIN_SCOPED;
  this.defaultActionPolicy = opt_defaultActionPolicy || chrome.cast.DefaultActionPolicy.CREATE_SESSION;
  this.customDialLaunchCallback = null;
  this.invisibleSender = false;
  this.additionalSessionRequests = [];
};
goog.exportSymbol("chrome.cast.ApiConfig", chrome.cast.ApiConfig);
chrome.cast.DialRequest = function(appName, opt_launchParameter) {
  this.appName = appName;
  this.launchParameter = opt_launchParameter || null;
};
goog.exportSymbol("chrome.cast.DialRequest", chrome.cast.DialRequest);
chrome.cast.DialLaunchData = function(receiver, appState, opt_extraData) {
  this.receiver = receiver;
  this.appState = appState;
  this.extraData = opt_extraData || null;
};
goog.exportSymbol("chrome.cast.DialLaunchData", chrome.cast.DialLaunchData);
chrome.cast.DialLaunchResponse = function(doLaunch, opt_launchParameter) {
  this.doLaunch = doLaunch;
  this.launchParameter = opt_launchParameter || null;
};
goog.exportSymbol("chrome.cast.DialLaunchResponse", chrome.cast.DialLaunchResponse);
chrome.cast.SessionRequest = function(appId, opt_capabilities, opt_timeout) {
  this.appId = appId;
  this.capabilities = goog.isArray(opt_capabilities) ? opt_capabilities : [chrome.cast.Capability.VIDEO_OUT, chrome.cast.Capability.AUDIO_OUT];
  this.requestSessionTimeout = opt_timeout || chrome.cast.timeout.requestSession;
  this.dialRequest = this.language = null;
};
goog.exportSymbol("chrome.cast.SessionRequest", chrome.cast.SessionRequest);
chrome.cast.Receiver = function(label, friendlyName, opt_capabilities, opt_volume) {
  this.label = label;
  this.friendlyName = goog.string.htmlEscape(friendlyName);
  this.capabilities = opt_capabilities || [];
  this.volume = opt_volume || null;
  this.receiverType = chrome.cast.ReceiverType.CAST;
  this.displayStatus = this.isActiveInput = null;
};
goog.exportSymbol("chrome.cast.Receiver", chrome.cast.Receiver);
chrome.cast.ReceiverDisplayStatus = function(statusText, appImages) {
  this.statusText = statusText;
  this.appImages = appImages;
  this.showStop = null;
};
goog.exportSymbol("chrome.cast.ReceiverDisplayStatus", chrome.cast.ReceiverDisplayStatus);
chrome.cast.Timeout = function() {
  this.requestSession = 60000;
  this.sendCustomMessage = this.setReceiverVolume = this.stopSession = this.leaveSession = 3000;
};
goog.exportSymbol("chrome.cast.Timeout", chrome.cast.Timeout);
chrome.cast.timeout = new chrome.cast.Timeout;
goog.exportSymbol("chrome.cast.timeout", chrome.cast.timeout);
chrome.cast.AUTO_JOIN_PRESENTATION_ID = "auto-join";
chrome.cast.PRESENTATION_ID_PREFIX = "cast-session_";
var mr = {};
mr.cast = {};
mr.cast.MessageType = {LAUNCH:"LAUNCH", APPLICATION_BROADCAST:"APPLICATION_BROADCAST", STOP_SESSION:"STOP", SET_VOLUME:"SET_VOLUME", GET_STATUS:"GET_STATUS", RECEIVER_STATUS:"RECEIVER_STATUS", VIRTUAL_CONNECT:"CONNECT", VIRTUAL_CONNECT_CLOSE:"CLOSE", GET_APP_AVAILABILITY:"GET_APP_AVAILABILITY", PRECACHE:"PRECACHE", MEDIA_LOAD:"LOAD", MEDIA_PAUSE:"PAUSE", MEDIA_SEEK:"SEEK", MEDIA_PLAY:"PLAY", MEDIA_STOP:"STOP_MEDIA", MEDIA_GET_STATUS:"MEDIA_GET_STATUS", MEDIA_SET_VOLUME:"MEDIA_SET_VOLUME", MEDIA_EDIT_TRACKS_INFO:"EDIT_TRACKS_INFO", 
MEDIA_QUEUE_LOAD:"QUEUE_LOAD", MEDIA_QUEUE_INSERT:"QUEUE_INSERT", MEDIA_QUEUE_UPDATE:"QUEUE_UPDATE", MEDIA_QUEUE_REMOVE:"QUEUE_REMOVE", MEDIA_QUEUE_REORDER:"QUEUE_REORDER", INVALID_PLAYER_STATE:"INVALID_PLAYER_STATE", LOAD_FAILED:"LOAD_FAILED", LOAD_CANCELLED:"LOAD_CANCELLED", INVALID_REQUEST:"INVALID_REQUEST", MEDIA_STATUS:"MEDIA_STATUS", LAUNCH_ERROR:"LAUNCH_ERROR", PING:"PING", PONG:"PONG"};
mr.cast.OVERLOADED_MESSAGE_TYPES = {};
mr.cast.OVERLOADED_MESSAGE_TYPES[mr.cast.MessageType.MEDIA_STOP] = mr.cast.MessageType.STOP_SESSION;
mr.cast.OVERLOADED_MESSAGE_TYPES[mr.cast.MessageType.MEDIA_SET_VOLUME] = mr.cast.MessageType.SET_VOLUME;
mr.cast.OVERLOADED_MESSAGE_TYPES[mr.cast.MessageType.MEDIA_GET_STATUS] = mr.cast.MessageType.GET_STATUS;
chrome.cast.media.MediaCommand = {PAUSE:"pause", SEEK:"seek", STREAM_VOLUME:"stream_volume", STREAM_MUTE:"stream_mute"};
goog.exportSymbol("chrome.cast.media.MediaCommand", chrome.cast.media.MediaCommand);
chrome.cast.media.MetadataType = {GENERIC:0, MOVIE:1, TV_SHOW:2, MUSIC_TRACK:3, PHOTO:4};
goog.exportSymbol("chrome.cast.media.MetadataType", chrome.cast.media.MetadataType);
chrome.cast.media.PlayerState = {IDLE:"IDLE", PLAYING:"PLAYING", PAUSED:"PAUSED", BUFFERING:"BUFFERING"};
goog.exportSymbol("chrome.cast.media.PlayerState", chrome.cast.media.PlayerState);
chrome.cast.media.RepeatMode = {OFF:"REPEAT_OFF", ALL:"REPEAT_ALL", SINGLE:"REPEAT_SINGLE", ALL_AND_SHUFFLE:"REPEAT_ALL_AND_SHUFFLE"};
goog.exportSymbol("chrome.cast.media.RepeatMode", chrome.cast.media.RepeatMode);
chrome.cast.media.ResumeState = {PLAYBACK_START:"PLAYBACK_START", PLAYBACK_PAUSE:"PLAYBACK_PAUSE"};
goog.exportSymbol("chrome.cast.media.ResumeState", chrome.cast.media.ResumeState);
chrome.cast.media.StreamType = {BUFFERED:"BUFFERED", LIVE:"LIVE", OTHER:"OTHER"};
goog.exportSymbol("chrome.cast.media.StreamType", chrome.cast.media.StreamType);
chrome.cast.media.IdleReason = {CANCELLED:"CANCELLED", INTERRUPTED:"INTERRUPTED", FINISHED:"FINISHED", ERROR:"ERROR"};
goog.exportSymbol("chrome.cast.media.IdleReason", chrome.cast.media.IdleReason);
chrome.cast.media.TrackType = {TEXT:"TEXT", AUDIO:"AUDIO", VIDEO:"VIDEO"};
goog.exportSymbol("chrome.cast.media.TrackType", chrome.cast.media.TrackType);
chrome.cast.media.TextTrackType = {SUBTITLES:"SUBTITLES", CAPTIONS:"CAPTIONS", DESCRIPTIONS:"DESCRIPTIONS", CHAPTERS:"CHAPTERS", METADATA:"METADATA"};
goog.exportSymbol("chrome.cast.media.TextTrackType", chrome.cast.media.TextTrackType);
chrome.cast.media.TextTrackEdgeType = {NONE:"NONE", OUTLINE:"OUTLINE", DROP_SHADOW:"DROP_SHADOW", RAISED:"RAISED", DEPRESSED:"DEPRESSED"};
goog.exportSymbol("chrome.cast.media.TextTrackEdgeType", chrome.cast.media.TextTrackEdgeType);
chrome.cast.media.TextTrackWindowType = {NONE:"NONE", NORMAL:"NORMAL", ROUNDED_CORNERS:"ROUNDED_CORNERS"};
goog.exportSymbol("chrome.cast.media.TextTrackWindowType", chrome.cast.media.TextTrackWindowType);
chrome.cast.media.TextTrackFontGenericFamily = {SANS_SERIF:"SANS_SERIF", MONOSPACED_SANS_SERIF:"MONOSPACED_SANS_SERIF", SERIF:"SERIF", MONOSPACED_SERIF:"MONOSPACED_SERIF", CASUAL:"CASUAL", CURSIVE:"CURSIVE", SMALL_CAPITALS:"SMALL_CAPITALS"};
goog.exportSymbol("chrome.cast.media.TextTrackFontGenericFamily", chrome.cast.media.TextTrackFontGenericFamily);
chrome.cast.media.TextTrackFontStyle = {NORMAL:"NORMAL", BOLD:"BOLD", BOLD_ITALIC:"BOLD_ITALIC", ITALIC:"ITALIC"};
goog.exportSymbol("chrome.cast.media.TextTrackFontStyle", chrome.cast.media.TextTrackFontStyle);
chrome.cast.media.GetStatusRequest = function() {
  this.customData = null;
};
goog.exportSymbol("chrome.cast.media.GetStatusRequest", chrome.cast.media.GetStatusRequest);
chrome.cast.media.PauseRequest = function() {
  this.customData = null;
};
goog.exportSymbol("chrome.cast.media.PauseRequest", chrome.cast.media.PauseRequest);
chrome.cast.media.PlayRequest = function() {
  this.customData = null;
};
goog.exportSymbol("chrome.cast.media.PlayRequest", chrome.cast.media.PlayRequest);
chrome.cast.media.SeekRequest = function() {
  this.customData = this.resumeState = this.currentTime = null;
};
goog.exportSymbol("chrome.cast.media.SeekRequest", chrome.cast.media.SeekRequest);
chrome.cast.media.StopRequest = function() {
  this.customData = null;
};
goog.exportSymbol("chrome.cast.media.StopRequest", chrome.cast.media.StopRequest);
chrome.cast.media.VolumeRequest = function(volume) {
  this.volume = volume;
  this.customData = null;
};
goog.exportSymbol("chrome.cast.media.VolumeRequest", chrome.cast.media.VolumeRequest);
chrome.cast.media.LoadRequest = function(mediaInfo) {
  this.type = mr.cast.MessageType.MEDIA_LOAD;
  this.requestId = 0;
  this.sessionId = null;
  this.media = mediaInfo;
  this.activeTrackIds = null;
  this.autoplay = true;
  this.customData = this.currentTime = null;
};
goog.exportSymbol("chrome.cast.media.LoadRequest", chrome.cast.media.LoadRequest);
chrome.cast.media.PrecacheRequest = function(data) {
  this.type = mr.cast.MessageType.PRECACHE;
  this.requestId = 0;
  this.data = data;
};
chrome.cast.media.EditTracksInfoRequest = function(opt_activeTrackIds, opt_textTrackStyle) {
  this.requestId = 0;
  this.activeTrackIds = opt_activeTrackIds || null;
  this.textTrackStyle = opt_textTrackStyle || null;
};
goog.exportSymbol("chrome.cast.media.EditTracksInfoRequest", chrome.cast.media.EditTracksInfoRequest);
chrome.cast.media.GenericMediaMetadata = function() {
  this.metadataType = this.type = chrome.cast.media.MetadataType.GENERIC;
  this.releaseDate = this.releaseYear = this.images = this.subtitle = this.title = null;
};
goog.exportSymbol("chrome.cast.media.GenericMediaMetadata", chrome.cast.media.GenericMediaMetadata);
chrome.cast.media.MovieMediaMetadata = function() {
  this.metadataType = this.type = chrome.cast.media.MetadataType.MOVIE;
  this.releaseDate = this.releaseYear = this.images = this.subtitle = this.studio = this.title = null;
};
goog.exportSymbol("chrome.cast.media.MovieMediaMetadata", chrome.cast.media.MovieMediaMetadata);
chrome.cast.media.TvShowMediaMetadata = function() {
  this.metadataType = this.type = chrome.cast.media.MetadataType.TV_SHOW;
  this.originalAirdate = this.releaseYear = this.images = this.episode = this.episodeNumber = this.season = this.seasonNumber = this.episodeTitle = this.title = this.seriesTitle = null;
};
goog.exportSymbol("chrome.cast.media.TvShowMediaMetadata", chrome.cast.media.TvShowMediaMetadata);
chrome.cast.media.MusicTrackMediaMetadata = function() {
  this.metadataType = this.type = chrome.cast.media.MetadataType.MUSIC_TRACK;
  this.releaseDate = this.releaseYear = this.images = this.discNumber = this.trackNumber = this.artistName = this.songName = this.composer = this.artist = this.albumArtist = this.title = this.albumName = null;
};
goog.exportSymbol("chrome.cast.media.MusicTrackMediaMetadata", chrome.cast.media.MusicTrackMediaMetadata);
chrome.cast.media.PhotoMediaMetadata = function() {
  this.metadataType = this.type = chrome.cast.media.MetadataType.PHOTO;
  this.creationDateTime = this.height = this.width = this.longitude = this.latitude = this.images = this.location = this.artist = this.title = null;
};
goog.exportSymbol("chrome.cast.media.PhotoMediaMetadata", chrome.cast.media.PhotoMediaMetadata);
chrome.cast.media.MediaInfo = function(contentId, contentType) {
  this.contentId = contentId;
  this.streamType = chrome.cast.media.StreamType.BUFFERED;
  this.contentType = contentType;
  this.customData = this.textTrackStyle = this.tracks = this.duration = this.metadata = null;
};
goog.exportSymbol("chrome.cast.media.MediaInfo", chrome.cast.media.MediaInfo);
chrome.cast.media.QueueItem = function(mediaInfo) {
  this.itemId = null;
  this.media = mediaInfo;
  this.autoplay = true;
  this.startTime = 0;
  this.playbackDuration = null;
  this.preloadTime = 0;
  this.customData = this.activeTrackIds = null;
};
goog.exportSymbol("chrome.cast.media.QueueItem", chrome.cast.media.QueueItem);
chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID = "CC1AD845";
goog.exportSymbol("chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID", chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID);
chrome.cast.media.timeout = {};
goog.exportSymbol("chrome.cast.media.timeout", chrome.cast.media.timeout);
chrome.cast.media.timeout.load = 0;
goog.exportProperty(chrome.cast.media.timeout, "load", chrome.cast.media.timeout.load);
chrome.cast.media.timeout.getStatus = 0;
goog.exportProperty(chrome.cast.media.timeout, "getStatus", chrome.cast.media.timeout.getStatus);
chrome.cast.media.timeout.play = 0;
goog.exportProperty(chrome.cast.media.timeout, "play", chrome.cast.media.timeout.play);
chrome.cast.media.timeout.pause = 0;
goog.exportProperty(chrome.cast.media.timeout, "pause", chrome.cast.media.timeout.pause);
chrome.cast.media.timeout.seek = 0;
goog.exportProperty(chrome.cast.media.timeout, "seek", chrome.cast.media.timeout.seek);
chrome.cast.media.timeout.stop = 0;
goog.exportProperty(chrome.cast.media.timeout, "stop", chrome.cast.media.timeout.stop);
chrome.cast.media.timeout.setVolume = 0;
goog.exportProperty(chrome.cast.media.timeout, "setVolume", chrome.cast.media.timeout.setVolume);
chrome.cast.media.timeout.editTracksInfo = 0;
goog.exportProperty(chrome.cast.media.timeout, "editTracksInfo", chrome.cast.media.timeout.editTracksInfo);
chrome.cast.media.timeout.queue = 0;
goog.exportProperty(chrome.cast.media.timeout, "queue", chrome.cast.media.timeout.queue);
chrome.cast.media.Track = function(trackId, trackType) {
  this.trackId = trackId;
  this.trackContentType = this.trackContentId = null;
  this.type = trackType;
  this.customData = this.subtype = this.language = this.name = null;
};
goog.exportSymbol("chrome.cast.media.Track", chrome.cast.media.Track);
chrome.cast.media.TextTrackStyle = function() {
  this.customData = this.fontStyle = this.fontGenericFamily = this.fontFamily = this.fontScale = this.windowRoundedCornerRadius = this.windowColor = this.windowType = this.edgeColor = this.edgeType = this.backgroundColor = this.foregroundColor = null;
};
goog.exportSymbol("chrome.cast.media.TextTrackStyle", chrome.cast.media.TextTrackStyle);
chrome.cast.media.QueueLoadRequest = function(items) {
  this.type = mr.cast.MessageType.MEDIA_QUEUE_LOAD;
  this.sessionId = this.requestId = null;
  this.items = items;
  this.startIndex = 0;
  this.repeatMode = chrome.cast.media.RepeatMode.OFF;
  this.customData = null;
};
goog.exportSymbol("chrome.cast.media.QueueLoadRequest", chrome.cast.media.QueueLoadRequest);
chrome.cast.media.QueueInsertItemsRequest = function(itemsToInsert) {
  this.type = mr.cast.MessageType.MEDIA_QUEUE_INSERT;
  this.sessionId = this.requestId = null;
  this.items = itemsToInsert;
  this.customData = this.insertBefore = null;
};
goog.exportSymbol("chrome.cast.media.QueueInsertItemsRequest", chrome.cast.media.QueueInsertItemsRequest);
chrome.cast.media.QueueUpdateItemsRequest = function(itemsToUpdate) {
  this.type = mr.cast.MessageType.MEDIA_QUEUE_UPDATE;
  this.sessionId = this.requestId = null;
  this.items = itemsToUpdate;
  this.customData = null;
};
goog.exportSymbol("chrome.cast.media.QueueUpdateItemsRequest", chrome.cast.media.QueueUpdateItemsRequest);
chrome.cast.media.QueueJumpRequest = function() {
  this.type = mr.cast.MessageType.MEDIA_QUEUE_UPDATE;
  this.customData = this.jump = this.currentItemId = this.sessionId = this.requestId = null;
};
goog.exportSymbol("chrome.cast.media.QueueJumpRequest", chrome.cast.media.QueueJumpRequest);
chrome.cast.media.QueueSetPropertiesRequest = function() {
  this.type = mr.cast.MessageType.MEDIA_QUEUE_UPDATE;
  this.customData = this.repeatMode = this.sessionId = this.requestId = null;
};
goog.exportSymbol("chrome.cast.media.QueueSetPropertiesRequest", chrome.cast.media.QueueSetPropertiesRequest);
chrome.cast.media.QueueRemoveItemsRequest = function(itemIdsToRemove) {
  this.type = mr.cast.MessageType.MEDIA_QUEUE_REMOVE;
  this.sessionId = this.requestId = null;
  this.itemIds = itemIdsToRemove;
  this.customData = null;
};
goog.exportSymbol("chrome.cast.media.QueueRemoveItemsRequest", chrome.cast.media.QueueRemoveItemsRequest);
chrome.cast.media.QueueReorderItemsRequest = function(itemIdsToReorder) {
  this.type = mr.cast.MessageType.MEDIA_QUEUE_REORDER;
  this.sessionId = this.requestId = null;
  this.itemIds = itemIdsToReorder;
  this.customData = this.insertBefore = null;
};
goog.exportSymbol("chrome.cast.media.QueueReorderItemsRequest", chrome.cast.media.QueueReorderItemsRequest);
goog.debug = {};
goog.debug.Error = function(opt_msg) {
  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, goog.debug.Error);
  } else {
    var stack = (new Error).stack;
    if (stack) {
      this.stack = stack;
    }
  }
  if (opt_msg) {
    this.message = String(opt_msg);
  }
};
goog.inherits(goog.debug.Error, Error);
goog.debug.Error.prototype.name = "CustomError";
goog.dom = {};
goog.dom.NodeType = {ELEMENT:1, ATTRIBUTE:2, TEXT:3, CDATA_SECTION:4, ENTITY_REFERENCE:5, ENTITY:6, PROCESSING_INSTRUCTION:7, COMMENT:8, DOCUMENT:9, DOCUMENT_TYPE:10, DOCUMENT_FRAGMENT:11, NOTATION:12};
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
    if (defaultMessage) {
      message += ": " + defaultMessage;
      args = defaultArgs;
    }
  }
  var e = new goog.asserts.AssertionError("" + message, args || []);
  goog.asserts.errorHandler_(e);
};
goog.asserts.setErrorHandler = function(errorHandler) {
  if (goog.asserts.ENABLE_ASSERTS) {
    goog.asserts.errorHandler_ = errorHandler;
  }
};
goog.asserts.assert = function(condition, opt_message, var_args) {
  if (goog.asserts.ENABLE_ASSERTS && !condition) {
    goog.asserts.doAssertFailure_("", null, opt_message, Array.prototype.slice.call(arguments, 2));
  }
  return condition;
};
goog.asserts.fail = function(opt_message, var_args) {
  if (goog.asserts.ENABLE_ASSERTS) {
    goog.asserts.errorHandler_(new goog.asserts.AssertionError("Failure" + (opt_message ? ": " + opt_message : ""), Array.prototype.slice.call(arguments, 1)));
  }
};
goog.asserts.assertNumber = function(value, opt_message, var_args) {
  if (goog.asserts.ENABLE_ASSERTS && !goog.isNumber(value)) {
    goog.asserts.doAssertFailure_("Expected number but got %s: %s.", [goog.typeOf(value), value], opt_message, Array.prototype.slice.call(arguments, 2));
  }
  return value;
};
goog.asserts.assertString = function(value, opt_message, var_args) {
  if (goog.asserts.ENABLE_ASSERTS && !goog.isString(value)) {
    goog.asserts.doAssertFailure_("Expected string but got %s: %s.", [goog.typeOf(value), value], opt_message, Array.prototype.slice.call(arguments, 2));
  }
  return value;
};
goog.asserts.assertFunction = function(value, opt_message, var_args) {
  if (goog.asserts.ENABLE_ASSERTS && !goog.isFunction(value)) {
    goog.asserts.doAssertFailure_("Expected function but got %s: %s.", [goog.typeOf(value), value], opt_message, Array.prototype.slice.call(arguments, 2));
  }
  return value;
};
goog.asserts.assertObject = function(value, opt_message, var_args) {
  if (goog.asserts.ENABLE_ASSERTS && !goog.isObject(value)) {
    goog.asserts.doAssertFailure_("Expected object but got %s: %s.", [goog.typeOf(value), value], opt_message, Array.prototype.slice.call(arguments, 2));
  }
  return value;
};
goog.asserts.assertArray = function(value, opt_message, var_args) {
  if (goog.asserts.ENABLE_ASSERTS && !goog.isArray(value)) {
    goog.asserts.doAssertFailure_("Expected array but got %s: %s.", [goog.typeOf(value), value], opt_message, Array.prototype.slice.call(arguments, 2));
  }
  return value;
};
goog.asserts.assertBoolean = function(value, opt_message, var_args) {
  if (goog.asserts.ENABLE_ASSERTS && !goog.isBoolean(value)) {
    goog.asserts.doAssertFailure_("Expected boolean but got %s: %s.", [goog.typeOf(value), value], opt_message, Array.prototype.slice.call(arguments, 2));
  }
  return value;
};
goog.asserts.assertElement = function(value, opt_message, var_args) {
  if (goog.asserts.ENABLE_ASSERTS && (!goog.isObject(value) || value.nodeType != goog.dom.NodeType.ELEMENT)) {
    goog.asserts.doAssertFailure_("Expected Element but got %s: %s.", [goog.typeOf(value), value], opt_message, Array.prototype.slice.call(arguments, 2));
  }
  return value;
};
goog.asserts.assertInstanceof = function(value, type, opt_message, var_args) {
  if (goog.asserts.ENABLE_ASSERTS && !(value instanceof type)) {
    goog.asserts.doAssertFailure_("Expected instanceof %s but got %s.", [goog.asserts.getType_(type), goog.asserts.getType_(value)], opt_message, Array.prototype.slice.call(arguments, 3));
  }
  return value;
};
goog.asserts.assertObjectPrototypeIsIntact = function() {
  for (var key in Object.prototype) {
    goog.asserts.fail(key + " should not be enumerable in Object.prototype.");
  }
};
goog.asserts.getType_ = function(value) {
  if (value instanceof Function) {
    return value.displayName || value.name || "unknown type name";
  } else {
    if (value instanceof Object) {
      return value.constructor.displayName || value.constructor.name || Object.prototype.toString.call(value);
    } else {
      return value === null ? "null" : typeof value;
    }
  }
};
goog.array = {};
goog.NATIVE_ARRAY_PROTOTYPES = goog.TRUSTED_SITE;
goog.array.ASSUME_NATIVE_FUNCTIONS = false;
goog.array.peek = function(array) {
  return array[array.length - 1];
};
goog.array.last = goog.array.peek;
goog.array.indexOf = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || Array.prototype.indexOf) ? function(arr, obj, opt_fromIndex) {
  goog.asserts.assert(arr.length != null);
  return Array.prototype.indexOf.call(arr, obj, opt_fromIndex);
} : function(arr, obj, opt_fromIndex) {
  var fromIndex = opt_fromIndex == null ? 0 : opt_fromIndex < 0 ? Math.max(0, arr.length + opt_fromIndex) : opt_fromIndex;
  if (goog.isString(arr)) {
    if (!goog.isString(obj) || obj.length != 1) {
      return -1;
    }
    return arr.indexOf(obj, fromIndex);
  }
  for (var i = fromIndex;i < arr.length;i++) {
    if (i in arr && arr[i] === obj) {
      return i;
    }
  }
  return -1;
};
goog.array.lastIndexOf = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || Array.prototype.lastIndexOf) ? function(arr, obj, opt_fromIndex) {
  goog.asserts.assert(arr.length != null);
  return Array.prototype.lastIndexOf.call(arr, obj, opt_fromIndex == null ? arr.length - 1 : opt_fromIndex);
} : function(arr, obj, opt_fromIndex) {
  var fromIndex = opt_fromIndex == null ? arr.length - 1 : opt_fromIndex;
  if (fromIndex < 0) {
    fromIndex = Math.max(0, arr.length + fromIndex);
  }
  if (goog.isString(arr)) {
    if (!goog.isString(obj) || obj.length != 1) {
      return -1;
    }
    return arr.lastIndexOf(obj, fromIndex);
  }
  for (var i = fromIndex;i >= 0;i--) {
    if (i in arr && arr[i] === obj) {
      return i;
    }
  }
  return -1;
};
goog.array.forEach = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || Array.prototype.forEach) ? function(arr, f, opt_obj) {
  goog.asserts.assert(arr.length != null);
  Array.prototype.forEach.call(arr, f, opt_obj);
} : function(arr, f, opt_obj) {
  for (var l = arr.length, arr2 = goog.isString(arr) ? arr.split("") : arr, i = 0;i < l;i++) {
    if (i in arr2) {
      f.call(opt_obj, arr2[i], i, arr);
    }
  }
};
goog.array.forEachRight = function(arr, f, opt_obj) {
  for (var l = arr.length, arr2 = goog.isString(arr) ? arr.split("") : arr, i = l - 1;i >= 0;--i) {
    if (i in arr2) {
      f.call(opt_obj, arr2[i], i, arr);
    }
  }
};
goog.array.filter = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || Array.prototype.filter) ? function(arr, f, opt_obj) {
  goog.asserts.assert(arr.length != null);
  return Array.prototype.filter.call(arr, f, opt_obj);
} : function(arr, f, opt_obj) {
  for (var l = arr.length, res = [], resLength = 0, arr2 = goog.isString(arr) ? arr.split("") : arr, i = 0;i < l;i++) {
    if (i in arr2) {
      var val = arr2[i];
      if (f.call(opt_obj, val, i, arr)) {
        res[resLength++] = val;
      }
    }
  }
  return res;
};
goog.array.map = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || Array.prototype.map) ? function(arr, f, opt_obj) {
  goog.asserts.assert(arr.length != null);
  return Array.prototype.map.call(arr, f, opt_obj);
} : function(arr, f, opt_obj) {
  for (var l = arr.length, res = new Array(l), arr2 = goog.isString(arr) ? arr.split("") : arr, i = 0;i < l;i++) {
    if (i in arr2) {
      res[i] = f.call(opt_obj, arr2[i], i, arr);
    }
  }
  return res;
};
goog.array.reduce = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || Array.prototype.reduce) ? function(arr, f, val, opt_obj) {
  goog.asserts.assert(arr.length != null);
  if (opt_obj) {
    f = goog.bind(f, opt_obj);
  }
  return Array.prototype.reduce.call(arr, f, val);
} : function(arr, f, val$jscomp$0, opt_obj) {
  var rval = val$jscomp$0;
  goog.array.forEach(arr, function(val, index) {
    rval = f.call(opt_obj, rval, val, index, arr);
  });
  return rval;
};
goog.array.reduceRight = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || Array.prototype.reduceRight) ? function(arr, f, val, opt_obj) {
  goog.asserts.assert(arr.length != null);
  goog.asserts.assert(f != null);
  if (opt_obj) {
    f = goog.bind(f, opt_obj);
  }
  return Array.prototype.reduceRight.call(arr, f, val);
} : function(arr, f, val$jscomp$0, opt_obj) {
  var rval = val$jscomp$0;
  goog.array.forEachRight(arr, function(val, index) {
    rval = f.call(opt_obj, rval, val, index, arr);
  });
  return rval;
};
goog.array.some = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || Array.prototype.some) ? function(arr, f, opt_obj) {
  goog.asserts.assert(arr.length != null);
  return Array.prototype.some.call(arr, f, opt_obj);
} : function(arr, f, opt_obj) {
  for (var l = arr.length, arr2 = goog.isString(arr) ? arr.split("") : arr, i = 0;i < l;i++) {
    if (i in arr2 && f.call(opt_obj, arr2[i], i, arr)) {
      return true;
    }
  }
  return false;
};
goog.array.every = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || Array.prototype.every) ? function(arr, f, opt_obj) {
  goog.asserts.assert(arr.length != null);
  return Array.prototype.every.call(arr, f, opt_obj);
} : function(arr, f, opt_obj) {
  for (var l = arr.length, arr2 = goog.isString(arr) ? arr.split("") : arr, i = 0;i < l;i++) {
    if (i in arr2 && !f.call(opt_obj, arr2[i], i, arr)) {
      return false;
    }
  }
  return true;
};
goog.array.count = function(arr$jscomp$0, f, opt_obj) {
  var count = 0;
  goog.array.forEach(arr$jscomp$0, function(element, index, arr) {
    if (f.call(opt_obj, element, index, arr)) {
      ++count;
    }
  }, opt_obj);
  return count;
};
goog.array.find = function(arr, f, opt_obj) {
  var i = goog.array.findIndex(arr, f, opt_obj);
  return i < 0 ? null : goog.isString(arr) ? arr.charAt(i) : arr[i];
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
  return i < 0 ? null : goog.isString(arr) ? arr.charAt(i) : arr[i];
};
goog.array.findIndexRight = function(arr, f, opt_obj) {
  for (var l = arr.length, arr2 = goog.isString(arr) ? arr.split("") : arr, i = l - 1;i >= 0;i--) {
    if (i in arr2 && f.call(opt_obj, arr2[i], i, arr)) {
      return i;
    }
  }
  return -1;
};
goog.array.contains = function(arr, obj) {
  return goog.array.indexOf(arr, obj) >= 0;
};
goog.array.isEmpty = function(arr) {
  return arr.length == 0;
};
goog.array.clear = function(arr) {
  if (!goog.isArray(arr)) {
    for (var i = arr.length - 1;i >= 0;i--) {
      delete arr[i];
    }
  }
  arr.length = 0;
};
goog.array.insert = function(arr, obj) {
  if (!goog.array.contains(arr, obj)) {
    arr.push(obj);
  }
};
goog.array.insertAt = function(arr, obj, opt_i) {
  goog.array.splice(arr, opt_i, 0, obj);
};
goog.array.insertArrayAt = function(arr, elementsToAdd, opt_i) {
  goog.partial(goog.array.splice, arr, opt_i, 0).apply(null, elementsToAdd);
};
goog.array.insertBefore = function(arr, obj, opt_obj2) {
  var i;
  if (arguments.length == 2 || (i = goog.array.indexOf(arr, opt_obj2)) < 0) {
    arr.push(obj);
  } else {
    goog.array.insertAt(arr, obj, i);
  }
};
goog.array.remove = function(arr, obj) {
  var i = goog.array.indexOf(arr, obj), rv;
  if (rv = i >= 0) {
    goog.array.removeAt(arr, i);
  }
  return rv;
};
goog.array.removeLast = function(arr, obj) {
  var i = goog.array.lastIndexOf(arr, obj);
  if (i >= 0) {
    goog.array.removeAt(arr, i);
    return true;
  }
  return false;
};
goog.array.removeAt = function(arr, i) {
  goog.asserts.assert(arr.length != null);
  return Array.prototype.splice.call(arr, i, 1).length == 1;
};
goog.array.removeIf = function(arr, f, opt_obj) {
  var i = goog.array.findIndex(arr, f, opt_obj);
  if (i >= 0) {
    goog.array.removeAt(arr, i);
    return true;
  }
  return false;
};
goog.array.removeAllIf = function(arr, f, opt_obj) {
  var removedCount = 0;
  goog.array.forEachRight(arr, function(val, index) {
    if (f.call(opt_obj, val, index, arr)) {
      if (goog.array.removeAt(arr, index)) {
        removedCount++;
      }
    }
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
  if (length > 0) {
    for (var rv = new Array(length), i = 0;i < length;i++) {
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
  goog.asserts.assert(arr.length != null);
  return Array.prototype.splice.apply(arr, goog.array.slice(arguments, 1));
};
goog.array.slice = function(arr, start, opt_end) {
  goog.asserts.assert(arr.length != null);
  if (arguments.length <= 2) {
    return Array.prototype.slice.call(arr, start);
  } else {
    return Array.prototype.slice.call(arr, start, opt_end);
  }
};
goog.array.removeDuplicates = function(arr, opt_rv, opt_hashFn) {
  for (var returnArray = opt_rv || arr, defaultHashFn = function(item) {
    return goog.isObject(item) ? "o" + goog.getUid(item) : (typeof item).charAt(0) + item;
  }, hashFn = opt_hashFn || defaultHashFn, seen = {}, cursorInsert = 0, cursorRead = 0;cursorRead < arr.length;) {
    var current = arr[cursorRead++], key = hashFn(current);
    if (!Object.prototype.hasOwnProperty.call(seen, key)) {
      seen[key] = true;
      returnArray[cursorInsert++] = current;
    }
  }
  returnArray.length = cursorInsert;
};
goog.array.binarySearch = function(arr, target, opt_compareFn) {
  return goog.array.binarySearch_(arr, opt_compareFn || goog.array.defaultCompare, false, target);
};
goog.array.binarySelect = function(arr, evaluator, opt_obj) {
  return goog.array.binarySearch_(arr, evaluator, true, undefined, opt_obj);
};
goog.array.binarySearch_ = function(arr, compareFn, isEvaluator, opt_target, opt_selfObj) {
  for (var left = 0, right = arr.length, found;left < right;) {
    var middle = left + right >> 1, compareResult;
    if (isEvaluator) {
      compareResult = compareFn.call(opt_selfObj, arr[middle], middle, arr);
    } else {
      compareResult = compareFn(opt_target, arr[middle]);
    }
    if (compareResult > 0) {
      left = middle + 1;
    } else {
      right = middle;
      found = !compareResult;
    }
  }
  return found ? left : ~left;
};
goog.array.sort = function(arr, opt_compareFn) {
  arr.sort(opt_compareFn || goog.array.defaultCompare);
};
goog.array.stableSort = function(arr, opt_compareFn) {
  for (var compArr = new Array(arr.length), i = 0;i < arr.length;i++) {
    compArr[i] = {index:i, value:arr[i]};
  }
  var valueCompareFn = opt_compareFn || goog.array.defaultCompare;
  goog.array.sort(compArr, function(obj1, obj2) {
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
    if (compareResult > 0 || compareResult == 0 && opt_strict) {
      return false;
    }
  }
  return true;
};
goog.array.equals = function(arr1, arr2, opt_equalsFn) {
  if (!goog.isArrayLike(arr1) || !goog.isArrayLike(arr2) || arr1.length != arr2.length) {
    return false;
  }
  for (var l = arr1.length, equalsFn = opt_equalsFn || goog.array.defaultCompareEquality, i = 0;i < l;i++) {
    if (!equalsFn(arr1[i], arr2[i])) {
      return false;
    }
  }
  return true;
};
goog.array.compare3 = function(arr1, arr2, opt_compareFn) {
  for (var compare = opt_compareFn || goog.array.defaultCompare, l = Math.min(arr1.length, arr2.length), i = 0;i < l;i++) {
    var result = compare(arr1[i], arr2[i]);
    if (result != 0) {
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
  if (index < 0) {
    goog.array.insertAt(array, value, -(index + 1));
    return true;
  }
  return false;
};
goog.array.binaryRemove = function(array, value, opt_compareFn) {
  var index = goog.array.binarySearch(array, value, opt_compareFn);
  return index >= 0 ? goog.array.removeAt(array, index) : false;
};
goog.array.bucket = function(array, sorter, opt_obj) {
  for (var buckets = {}, i = 0;i < array.length;i++) {
    var value = array[i], key = sorter.call(opt_obj, value, i, array);
    if (goog.isDef(key)) {
      (buckets[key] || (buckets[key] = [])).push(value);
    }
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
  if (opt_end !== undefined) {
    start = startOrEnd;
    end = opt_end;
  }
  if (step * (end - start) < 0) {
    return [];
  }
  if (step > 0) {
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
  goog.asserts.assert(array.length != null);
  if (array.length) {
    n %= array.length;
    if (n > 0) {
      Array.prototype.unshift.apply(array, array.splice(-n, n));
    } else {
      if (n < 0) {
        Array.prototype.push.apply(array, array.splice(0, -n));
      }
    }
  }
  return array;
};
goog.array.moveItem = function(arr, fromIndex, toIndex) {
  goog.asserts.assert(fromIndex >= 0 && fromIndex < arr.length);
  goog.asserts.assert(toIndex >= 0 && toIndex < arr.length);
  var removedItems = Array.prototype.splice.call(arr, fromIndex, 1);
  Array.prototype.splice.call(arr, toIndex, 0, removedItems[0]);
};
goog.array.zip = function(var_args) {
  if (!arguments.length) {
    return [];
  }
  for (var result = [], minLen = arguments[0].length, i = 1;i < arguments.length;i++) {
    if (arguments[i].length < minLen) {
      minLen = arguments[i].length;
    }
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
  for (var randFn = opt_randFn || Math.random, i = arr.length - 1;i > 0;i--) {
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
chrome.cast.media.Media = function(sessionId, mediaSessionId) {
  this.sessionId = sessionId;
  this.mediaSessionId = mediaSessionId;
  this.media = null;
  this.playbackRate = 1.0;
  this.playerState = chrome.cast.media.PlayerState.IDLE;
  this.currentTime = 0.0;
  this.lastCurrentTimeUpdate = -1;
  this.supportedMediaCommands = [];
  this.volume = new chrome.cast.Volume;
  this.items = this.preloadedItemId = this.loadingItemId = this.currentItemId = this.customData = this.activeTrackIds = this.idleReason = null;
  this.repeatMode = chrome.cast.media.RepeatMode.OFF;
  this.hasBeenReported = false;
  this.updateListeners = [];
};
goog.exportSymbol("chrome.cast.media.Media", chrome.cast.media.Media);
chrome.cast.media.Media.prototype.getStatus = function(getStatusRequest, successCallback, errorCallback) {
  if (!getStatusRequest) {
    getStatusRequest = new chrome.cast.media.GetStatusRequest;
  }
  mr.cast.ApiInterface.instance.sendMediaUpdateRequest(this, mr.cast.MessageType.MEDIA_GET_STATUS, getStatusRequest, successCallback, errorCallback, chrome.cast.media.timeout.getStatus);
};
goog.exportProperty(chrome.cast.media.Media.prototype, "getStatus", chrome.cast.media.Media.prototype.getStatus);
chrome.cast.media.Media.prototype.play = function(playRequest, successCallback, errorCallback) {
  this.playWithContext(goog.asserts.assert(mr.cast.ApiInterface.instance), playRequest, successCallback, errorCallback);
};
goog.exportProperty(chrome.cast.media.Media.prototype, "play", chrome.cast.media.Media.prototype.play);
chrome.cast.media.Media.prototype.playWithContext = function(context, playRequest, successCallback, errorCallback) {
  if (!playRequest) {
    playRequest = new chrome.cast.media.PlayRequest;
  }
  context.sendMediaUpdateRequest(this, mr.cast.MessageType.MEDIA_PLAY, playRequest, successCallback, errorCallback, chrome.cast.media.timeout.play);
};
goog.exportProperty(chrome.cast.media.Media.prototype, "playWithContext", chrome.cast.media.Media.prototype.playWithContext);
chrome.cast.media.Media.prototype.pause = function(pauseRequest, successCallback, errorCallback) {
  this.pauseWithContext(goog.asserts.assert(mr.cast.ApiInterface.instance), pauseRequest, successCallback, errorCallback);
};
goog.exportProperty(chrome.cast.media.Media.prototype, "pause", chrome.cast.media.Media.prototype.pause);
chrome.cast.media.Media.prototype.pauseWithContext = function(context, pauseRequest, successCallback, errorCallback) {
  if (!pauseRequest) {
    pauseRequest = new chrome.cast.media.PauseRequest;
  }
  context.sendMediaUpdateRequest(this, mr.cast.MessageType.MEDIA_PAUSE, pauseRequest, successCallback, errorCallback, chrome.cast.media.timeout.pause);
};
goog.exportProperty(chrome.cast.media.Media.prototype, "pauseWithContext", chrome.cast.media.Media.prototype.pauseWithContext);
chrome.cast.media.Media.prototype.seek = function(seekRequest, successCallback, errorCallback) {
  mr.cast.ApiInterface.instance.sendMediaUpdateRequest(this, mr.cast.MessageType.MEDIA_SEEK, seekRequest, successCallback, errorCallback, chrome.cast.media.timeout.seek);
};
goog.exportProperty(chrome.cast.media.Media.prototype, "seek", chrome.cast.media.Media.prototype.seek);
chrome.cast.media.Media.prototype.stop = function(stopRequest, successCallback, errorCallback) {
  if (!stopRequest) {
    stopRequest = new chrome.cast.media.StopRequest;
  }
  mr.cast.ApiInterface.instance.sendMediaUpdateRequest(this, mr.cast.MessageType.MEDIA_STOP, stopRequest, successCallback, errorCallback, chrome.cast.media.timeout.stop);
};
goog.exportProperty(chrome.cast.media.Media.prototype, "stop", chrome.cast.media.Media.prototype.stop);
chrome.cast.media.Media.prototype.setVolume = function(volumeRequest, successCallback, errorCallback) {
  mr.cast.ApiInterface.instance.sendMediaUpdateRequest(this, mr.cast.MessageType.MEDIA_SET_VOLUME, volumeRequest, successCallback, errorCallback, chrome.cast.media.timeout.setVolume);
};
goog.exportProperty(chrome.cast.media.Media.prototype, "setVolume", chrome.cast.media.Media.prototype.setVolume);
chrome.cast.media.Media.prototype.editTracksInfo = function(editTracksInfoRequest, successCallback, errorCallback) {
  mr.cast.ApiInterface.instance.sendMediaUpdateRequest(this, mr.cast.MessageType.MEDIA_EDIT_TRACKS_INFO, editTracksInfoRequest, successCallback, errorCallback, chrome.cast.media.timeout.editTracksInfo);
};
goog.exportProperty(chrome.cast.media.Media.prototype, "editTracksInfo", chrome.cast.media.Media.prototype.editTracksInfo);
chrome.cast.media.Media.prototype.queueInsertItems = function(queueInsertItemsRequest, successCallback, errorCallback) {
  mr.cast.ApiInterface.instance.sendMediaUpdateRequest(this, mr.cast.MessageType.MEDIA_QUEUE_INSERT, queueInsertItemsRequest, successCallback, errorCallback, chrome.cast.media.timeout.queue);
};
goog.exportProperty(chrome.cast.media.Media.prototype, "queueInsertItems", chrome.cast.media.Media.prototype.queueInsertItems);
chrome.cast.media.Media.prototype.queueAppendItem = function(item, successCallback, errorCallback) {
  mr.cast.ApiInterface.instance.sendMediaUpdateRequest(this, mr.cast.MessageType.MEDIA_QUEUE_INSERT, new chrome.cast.media.QueueInsertItemsRequest([item]), successCallback, errorCallback, chrome.cast.media.timeout.queue);
};
goog.exportProperty(chrome.cast.media.Media.prototype, "queueAppendItem", chrome.cast.media.Media.prototype.queueAppendItem);
chrome.cast.media.Media.prototype.queueUpdateItems = function(queueUpdateItemsRequest, successCallback, errorCallback) {
  mr.cast.ApiInterface.instance.sendMediaUpdateRequest(this, mr.cast.MessageType.MEDIA_QUEUE_UPDATE, queueUpdateItemsRequest, successCallback, errorCallback, chrome.cast.media.timeout.queue);
};
goog.exportProperty(chrome.cast.media.Media.prototype, "queueUpdateItems", chrome.cast.media.Media.prototype.queueUpdateItems);
chrome.cast.media.Media.prototype.queuePrev = function(successCallback, errorCallback) {
  var queueJumpRequest = new chrome.cast.media.QueueJumpRequest;
  queueJumpRequest.jump = -1;
  mr.cast.ApiInterface.instance.sendMediaUpdateRequest(this, mr.cast.MessageType.MEDIA_QUEUE_UPDATE, queueJumpRequest, successCallback, errorCallback, chrome.cast.media.timeout.queue);
};
goog.exportProperty(chrome.cast.media.Media.prototype, "queuePrev", chrome.cast.media.Media.prototype.queuePrev);
chrome.cast.media.Media.prototype.queueNext = function(successCallback, errorCallback) {
  var queueJumpRequest = new chrome.cast.media.QueueJumpRequest;
  queueJumpRequest.jump = 1;
  mr.cast.ApiInterface.instance.sendMediaUpdateRequest(this, mr.cast.MessageType.MEDIA_QUEUE_UPDATE, queueJumpRequest, successCallback, errorCallback, chrome.cast.media.timeout.queue);
};
goog.exportProperty(chrome.cast.media.Media.prototype, "queueNext", chrome.cast.media.Media.prototype.queueNext);
chrome.cast.media.Media.prototype.queueJumpToItem = function(itemId, successCallback, errorCallback) {
  if (this.getIndexOfItem_(itemId) < 0) {
    return;
  }
  var queueJumpRequest = new chrome.cast.media.QueueJumpRequest;
  queueJumpRequest.currentItemId = itemId;
  mr.cast.ApiInterface.instance.sendMediaUpdateRequest(this, mr.cast.MessageType.MEDIA_QUEUE_UPDATE, queueJumpRequest, successCallback, errorCallback, chrome.cast.media.timeout.queue);
};
goog.exportProperty(chrome.cast.media.Media.prototype, "queueJumpToItem", chrome.cast.media.Media.prototype.queueJumpToItem);
chrome.cast.media.Media.prototype.queueSetRepeatMode = function(repeatMode, successCallback, errorCallback) {
  var queueSetPropertiesRequest = new chrome.cast.media.QueueSetPropertiesRequest;
  queueSetPropertiesRequest.repeatMode = repeatMode;
  mr.cast.ApiInterface.instance.sendMediaUpdateRequest(this, mr.cast.MessageType.MEDIA_QUEUE_UPDATE, queueSetPropertiesRequest, successCallback, errorCallback, chrome.cast.media.timeout.queue);
};
goog.exportProperty(chrome.cast.media.Media.prototype, "queueSetRepeatMode", chrome.cast.media.Media.prototype.queueSetRepeatMode);
chrome.cast.media.Media.prototype.queueRemoveItems = function(queueRemoveItemsRequest, successCallback, errorCallback) {
  mr.cast.ApiInterface.instance.sendMediaUpdateRequest(this, mr.cast.MessageType.MEDIA_QUEUE_REMOVE, queueRemoveItemsRequest, successCallback, errorCallback, chrome.cast.media.timeout.queue);
};
goog.exportProperty(chrome.cast.media.Media.prototype, "queueRemoveItems", chrome.cast.media.Media.prototype.queueRemoveItems);
chrome.cast.media.Media.prototype.queueRemoveItem = function(itemId, successCallback, errorCallback) {
  if (this.getIndexOfItem_(itemId) < 0) {
    return;
  }
  mr.cast.ApiInterface.instance.sendMediaUpdateRequest(this, mr.cast.MessageType.MEDIA_QUEUE_REMOVE, new chrome.cast.media.QueueRemoveItemsRequest([itemId]), successCallback, errorCallback, chrome.cast.media.timeout.queue);
};
goog.exportProperty(chrome.cast.media.Media.prototype, "queueRemoveItem", chrome.cast.media.Media.prototype.queueRemoveItem);
chrome.cast.media.Media.prototype.queueReorderItems = function(queueReorderItemsRequest, successCallback, errorCallback) {
  mr.cast.ApiInterface.instance.sendMediaUpdateRequest(this, mr.cast.MessageType.MEDIA_QUEUE_REORDER, queueReorderItemsRequest, successCallback, errorCallback, chrome.cast.media.timeout.queue);
};
goog.exportProperty(chrome.cast.media.Media.prototype, "queueReorderItems", chrome.cast.media.Media.prototype.queueReorderItems);
chrome.cast.media.Media.prototype.queueMoveItemToNewIndex = function(itemId, newIndex, successCallback, errorCallback) {
  var index = this.getIndexOfItem_(itemId);
  if (index < 0) {
    return;
  }
  if (newIndex < 0) {
    if (errorCallback) {
      errorCallback(new chrome.cast.Error(chrome.cast.ErrorCode.INVALID_PARAMETER));
    }
    return;
  }
  if (index == newIndex) {
    if (successCallback) {
      successCallback();
    }
    return;
  }
  var itemToInsertBefore = null, indexToInsertBefore = newIndex > index ? newIndex + 1 : newIndex;
  if (indexToInsertBefore < this.items.length) {
    itemToInsertBefore = this.items[indexToInsertBefore];
  }
  var queueReorderRequest = new chrome.cast.media.QueueReorderItemsRequest([itemId]);
  queueReorderRequest.insertBefore = itemToInsertBefore ? itemToInsertBefore.itemId : null;
  mr.cast.ApiInterface.instance.sendMediaUpdateRequest(this, mr.cast.MessageType.MEDIA_QUEUE_REORDER, queueReorderRequest, successCallback, errorCallback, chrome.cast.media.timeout.queue);
};
goog.exportProperty(chrome.cast.media.Media.prototype, "queueMoveItemToNewIndex", chrome.cast.media.Media.prototype.queueMoveItemToNewIndex);
chrome.cast.media.Media.prototype.supportsCommand = function(command) {
  return this.supportedMediaCommands.indexOf(command) > -1;
};
goog.exportProperty(chrome.cast.media.Media.prototype, "supportsCommand", chrome.cast.media.Media.prototype.supportsCommand);
chrome.cast.media.Media.prototype.getEstimatedTime = function() {
  if (this.playerState == chrome.cast.media.PlayerState.PLAYING && this.lastCurrentTimeUpdate >= 0) {
    var elapsedSeconds = (Date.now() - this.lastCurrentTimeUpdate) / 1000, result = this.currentTime + this.playbackRate * elapsedSeconds;
    if (this.media && this.media.duration != null && result > this.media.duration) {
      result = this.media.duration;
    }
    if (result < 0) {
      result = 0;
    }
    return result;
  } else {
    return this.currentTime;
  }
};
goog.exportProperty(chrome.cast.media.Media.prototype, "getEstimatedTime", chrome.cast.media.Media.prototype.getEstimatedTime);
chrome.cast.media.Media.prototype.addUpdateListener = function(listener) {
  this.addUpdateListenerWithContext(goog.asserts.assert(mr.cast.ApiInterface.instance), listener);
};
goog.exportProperty(chrome.cast.media.Media.prototype, "addUpdateListener", chrome.cast.media.Media.prototype.addUpdateListener);
chrome.cast.media.Media.prototype.addUpdateListenerWithContext = function(context, listener) {
  context.addMediaUpdateListener(this, listener);
};
goog.exportProperty(chrome.cast.media.Media.prototype, "addUpdateListenerWithContext", chrome.cast.media.Media.prototype.addUpdateListenerWithContext);
chrome.cast.media.Media.prototype.removeUpdateListener = function(listener) {
  this.removeUpdateListenerWithContext(goog.asserts.assert(mr.cast.ApiInterface.instance), listener);
};
goog.exportProperty(chrome.cast.media.Media.prototype, "removeUpdateListener", chrome.cast.media.Media.prototype.removeUpdateListener);
chrome.cast.media.Media.prototype.removeUpdateListenerWithContext = function(context, listener) {
  mr.cast.ApiInterface.instance.removeMediaUpdateListener(this, listener);
};
goog.exportProperty(chrome.cast.media.Media.prototype, "removeUpdateListenerWithContext", chrome.cast.media.Media.prototype.removeUpdateListenerWithContext);
chrome.cast.media.Media.prototype.getIndexOfItem_ = function(itemId) {
  return goog.array.findIndex(this.items, function(elem) {
    return elem.itemId == itemId;
  });
};
mr.cast.ApiInterface = function() {
};
mr.cast.ApiInterface.prototype.initialize = function() {
};
mr.cast.ApiInterface.prototype.requestSession = function() {
};
goog.exportProperty(mr.cast.ApiInterface.prototype, "requestSession", mr.cast.ApiInterface.prototype.requestSession);
mr.cast.ApiInterface.prototype.sendLoadMediaRequest = function() {
};
mr.cast.ApiInterface.prototype.sendMediaUpdateRequest = function() {
};
mr.cast.ApiInterface.prototype.setReceiverVolume = function() {
};
mr.cast.ApiInterface.prototype.requestSessionById = function() {
};
mr.cast.ApiInterface.prototype.leaveSession = function() {
};
mr.cast.ApiInterface.prototype.sendAppRequest = function() {
};
mr.cast.ApiInterface.prototype.sendApiRequest = function() {
};
mr.cast.ApiInterface.prototype.addSessionUpdateListener = function() {
};
mr.cast.ApiInterface.prototype.removeSessionUpdateListener = function() {
};
mr.cast.ApiInterface.prototype.addReceiverActionListener = function() {
};
mr.cast.ApiInterface.prototype.removeReceiverActionListener = function() {
};
mr.cast.ApiInterface.prototype.addAppMessageListener = function() {
};
mr.cast.ApiInterface.prototype.removeAppMessageListener = function() {
};
mr.cast.ApiInterface.prototype.addMediaListener = function() {
};
mr.cast.ApiInterface.prototype.removeMediaListener = function() {
};
mr.cast.ApiInterface.prototype.addMediaUpdateListener = function() {
};
mr.cast.ApiInterface.prototype.removeMediaUpdateListener = function() {
};
mr.cast.ApiInterface.instance = null;
mr.cast.AppMessage = function(sessionId, namespaceName, message) {
  this.sessionId = sessionId;
  this.namespaceName = namespaceName;
  this.message = message;
};
mr.cast.SetVolumeRequest = function(volume, opt_expectedVolume) {
  this.type = mr.cast.MessageType.SET_VOLUME;
  this.requestId = 0;
  this.volume = volume;
  this.expectedVolume = opt_expectedVolume || null;
};
mr.cast.StopSessionRequest = function(opt_sessionId) {
  this.type = mr.cast.MessageType.STOP_SESSION;
  this.requestId = 0;
  this.sessionId = opt_sessionId || null;
};
chrome.cast.Session = function(sessionId, appId, displayName, appImages, receiver) {
  this.sessionId = sessionId;
  this.appId = appId;
  this.displayName = displayName;
  this.statusText = null;
  this.appImages = appImages;
  this.receiver = receiver;
  this.senderApps = [];
  this.namespaces = [];
  this.media = [];
  this.status = chrome.cast.SessionStatus.CONNECTED;
  this.transportId = "";
};
goog.exportSymbol("chrome.cast.Session", chrome.cast.Session);
chrome.cast.Session.prototype.setReceiverVolumeLevel = function(newLevel, successCallback, errorCallback) {
  this.setReceiverVolumeLevelWithContext(goog.asserts.assert(mr.cast.ApiInterface.instance), newLevel, successCallback, errorCallback);
};
goog.exportProperty(chrome.cast.Session.prototype, "setReceiverVolumeLevel", chrome.cast.Session.prototype.setReceiverVolumeLevel);
chrome.cast.Session.prototype.setReceiverVolumeLevelWithContext = function(context, newLevel, successCallback, errorCallback) {
  var volumeRequest = new mr.cast.SetVolumeRequest(new chrome.cast.Volume(newLevel, null), this.receiver.volume);
  context.setReceiverVolume(this.sessionId, volumeRequest, successCallback, errorCallback);
};
goog.exportProperty(chrome.cast.Session.prototype, "setReceiverVolumeLevelWithContext", chrome.cast.Session.prototype.setReceiverVolumeLevelWithContext);
chrome.cast.Session.prototype.setReceiverMuted = function(muted, successCallback, errorCallback) {
  this.setReceiverMutedWithContext(goog.asserts.assert(mr.cast.ApiInterface.instance), muted, successCallback, errorCallback);
};
goog.exportProperty(chrome.cast.Session.prototype, "setReceiverMuted", chrome.cast.Session.prototype.setReceiverMuted);
chrome.cast.Session.prototype.setReceiverMutedWithContext = function(context, muted, successCallback, errorCallback) {
  var volumeRequest = new mr.cast.SetVolumeRequest(new chrome.cast.Volume(null, muted), this.receiver.volume);
  mr.cast.ApiInterface.instance.setReceiverVolume(this.sessionId, volumeRequest, successCallback, errorCallback);
};
goog.exportProperty(chrome.cast.Session.prototype, "setReceiverMutedWithContext", chrome.cast.Session.prototype.setReceiverMutedWithContext);
chrome.cast.Session.prototype.leave = function(successCallback, errorCallback) {
  mr.cast.ApiInterface.instance.leaveSession(this.sessionId, successCallback, errorCallback);
};
goog.exportProperty(chrome.cast.Session.prototype, "leave", chrome.cast.Session.prototype.leave);
chrome.cast.Session.prototype.stop = function(successCallback, errorCallback) {
  this.stopWithContext(goog.asserts.assert(mr.cast.ApiInterface.instance), successCallback, errorCallback);
};
goog.exportProperty(chrome.cast.Session.prototype, "stop", chrome.cast.Session.prototype.stop);
chrome.cast.Session.prototype.stopWithContext = function(context, successCallback, errorCallback) {
  context.sendApiRequest(new mr.cast.StopSessionRequest(this.sessionId), successCallback, errorCallback, chrome.cast.timeout.stopSession);
};
goog.exportProperty(chrome.cast.Session.prototype, "stopWithContext", chrome.cast.Session.prototype.stopWithContext);
chrome.cast.Session.prototype.sendMessage = function(namespace, message, successCallback, errorCallback) {
  this.sendMessageWithContext(goog.asserts.assert(mr.cast.ApiInterface.instance), namespace, message, successCallback, errorCallback);
};
goog.exportProperty(chrome.cast.Session.prototype, "sendMessage", chrome.cast.Session.prototype.sendMessage);
chrome.cast.Session.prototype.sendMessageWithContext = function(context, namespace, message, successCallback, errorCallback) {
  context.sendAppRequest(new mr.cast.AppMessage(this.sessionId, namespace, message), successCallback, errorCallback);
};
goog.exportProperty(chrome.cast.Session.prototype, "sendMessageWithContext", chrome.cast.Session.prototype.sendMessageWithContext);
chrome.cast.Session.prototype.addUpdateListener = function(listener) {
  this.addUpdateListenerWithContext(goog.asserts.assert(mr.cast.ApiInterface.instance), listener);
};
goog.exportProperty(chrome.cast.Session.prototype, "addUpdateListener", chrome.cast.Session.prototype.addUpdateListener);
chrome.cast.Session.prototype.addUpdateListenerWithContext = function(context, listener) {
  context.addSessionUpdateListener(this.sessionId, listener);
};
goog.exportProperty(chrome.cast.Session.prototype, "addUpdateListenerWithContext", chrome.cast.Session.prototype.addUpdateListenerWithContext);
chrome.cast.Session.prototype.removeUpdateListener = function(listener) {
  this.removeUpdateListenerWithContext(goog.asserts.assert(mr.cast.ApiInterface.instance), listener);
};
goog.exportProperty(chrome.cast.Session.prototype, "removeUpdateListener", chrome.cast.Session.prototype.removeUpdateListener);
chrome.cast.Session.prototype.removeUpdateListenerWithContext = function(context, listener) {
  context.removeSessionUpdateListener(this.sessionId, listener);
};
goog.exportProperty(chrome.cast.Session.prototype, "removeUpdateListenerWithContext", chrome.cast.Session.prototype.removeUpdateListenerWithContext);
chrome.cast.Session.prototype.addMessageListener = function(namespace, listener) {
  this.addMessageListenerWithContext(goog.asserts.assert(mr.cast.ApiInterface.instance), namespace, listener);
};
goog.exportProperty(chrome.cast.Session.prototype, "addMessageListener", chrome.cast.Session.prototype.addMessageListener);
chrome.cast.Session.prototype.addMessageListenerWithContext = function(context, namespace, listener) {
  context.addAppMessageListener(this.sessionId, namespace, listener);
};
goog.exportProperty(chrome.cast.Session.prototype, "addMessageListenerWithContext", chrome.cast.Session.prototype.addMessageListenerWithContext);
chrome.cast.Session.prototype.addMediaListener = function(listener) {
  this.addMediaListenerWithContext(goog.asserts.assert(mr.cast.ApiInterface.instance), listener);
};
goog.exportProperty(chrome.cast.Session.prototype, "addMediaListener", chrome.cast.Session.prototype.addMediaListener);
chrome.cast.Session.prototype.addMediaListenerWithContext = function(context, listener) {
  context.addMediaListener(this.sessionId, listener);
};
goog.exportProperty(chrome.cast.Session.prototype, "addMediaListenerWithContext", chrome.cast.Session.prototype.addMediaListenerWithContext);
chrome.cast.Session.prototype.removeMediaListener = function(listener) {
  this.removeMediaListenerWithContext(goog.asserts.assert(mr.cast.ApiInterface.instance), listener);
};
goog.exportProperty(chrome.cast.Session.prototype, "removeMediaListener", chrome.cast.Session.prototype.removeMediaListener);
chrome.cast.Session.prototype.removeMediaListenerWithContext = function(context, listener) {
  context.removeMediaListener(this.sessionId, listener);
};
goog.exportProperty(chrome.cast.Session.prototype, "removeMediaListenerWithContext", chrome.cast.Session.prototype.removeMediaListenerWithContext);
chrome.cast.Session.prototype.removeMessageListener = function(namespace, listener) {
  this.removeMessageListenerWithContext(goog.asserts.assert(mr.cast.ApiInterface.instance), namespace, listener);
};
goog.exportProperty(chrome.cast.Session.prototype, "removeMessageListener", chrome.cast.Session.prototype.removeMessageListener);
chrome.cast.Session.prototype.removeMessageListenerWithContext = function(context, namespace, listener) {
  context.removeAppMessageListener(this.sessionId, namespace, listener);
};
goog.exportProperty(chrome.cast.Session.prototype, "removeMessageListenerWithContext", chrome.cast.Session.prototype.removeMessageListenerWithContext);
chrome.cast.Session.prototype.loadMedia = function(loadRequest, successCallback, errorCallback) {
  loadRequest.sessionId = this.sessionId;
  mr.cast.ApiInterface.instance.sendLoadMediaRequest(loadRequest, mr.cast.MessageType.MEDIA_LOAD, successCallback, errorCallback);
};
goog.exportProperty(chrome.cast.Session.prototype, "loadMedia", chrome.cast.Session.prototype.loadMedia);
chrome.cast.Session.prototype.queueLoad = function(queueLoadRequest, successCallback, errorCallback) {
  queueLoadRequest.sessionId = this.sessionId;
  mr.cast.ApiInterface.instance.sendLoadMediaRequest(queueLoadRequest, mr.cast.MessageType.MEDIA_QUEUE_LOAD, successCallback, errorCallback);
};
goog.exportProperty(chrome.cast.Session.prototype, "queueLoad", chrome.cast.Session.prototype.queueLoad);
goog.object = {};
goog.object.is = function(v, v2) {
  if (v === v2) {
    return v !== 0 || 1 / v === 1 / v2;
  }
  return v !== v && v2 !== v2;
};
goog.object.forEach = function(obj, f, opt_obj) {
  for (var key in obj) {
    f.call(opt_obj, obj[key], key, obj);
  }
};
goog.object.filter = function(obj, f, opt_obj) {
  var res = {}, key;
  for (key in obj) {
    if (f.call(opt_obj, obj[key], key, obj)) {
      res[key] = obj[key];
    }
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
      return true;
    }
  }
  return false;
};
goog.object.every = function(obj, f, opt_obj) {
  for (var key in obj) {
    if (!f.call(opt_obj, obj[key], key, obj)) {
      return false;
    }
  }
  return true;
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
  for (var isArrayLike = goog.isArrayLike(var_args), keys = isArrayLike ? var_args : arguments, i = isArrayLike ? 0 : 1;i < keys.length;i++) {
    obj = obj[keys[i]];
    if (!goog.isDef(obj)) {
      break;
    }
  }
  return obj;
};
goog.object.containsKey = function(obj, key) {
  return obj !== null && key in obj;
};
goog.object.containsValue = function(obj, val) {
  for (var key in obj) {
    if (obj[key] == val) {
      return true;
    }
  }
  return false;
};
goog.object.findKey = function(obj, f, opt_this) {
  for (var key in obj) {
    if (f.call(opt_this, obj[key], key, obj)) {
      return key;
    }
  }
  return undefined;
};
goog.object.findValue = function(obj, f, opt_this) {
  var key = goog.object.findKey(obj, f, opt_this);
  return key && obj[key];
};
goog.object.isEmpty = function(obj) {
  for (var key in obj) {
    return false;
  }
  return true;
};
goog.object.clear = function(obj) {
  for (var i in obj) {
    delete obj[i];
  }
};
goog.object.remove = function(obj, key) {
  var rv;
  if (rv = key in obj) {
    delete obj[key];
  }
  return rv;
};
goog.object.add = function(obj, key, val) {
  if (obj !== null && key in obj) {
    throw Error('The object already contains the key "' + key + '"');
  }
  goog.object.set(obj, key, val);
};
goog.object.get = function(obj, key, opt_val) {
  if (obj !== null && key in obj) {
    return obj[key];
  }
  return opt_val;
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
      return false;
    }
  }
  for (k in b) {
    if (!(k in a)) {
      return false;
    }
  }
  return true;
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
  if (type == "object" || type == "array") {
    if (goog.isFunction(obj.clone)) {
      return obj.clone();
    }
    var clone = type == "array" ? [] : {}, key;
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
goog.object.PROTOTYPE_FIELDS_ = ["constructor", "hasOwnProperty", "isPrototypeOf", "propertyIsEnumerable", "toLocaleString", "toString", "valueOf"];
goog.object.extend = function(target, var_args) {
  for (var key, source, i = 1;i < arguments.length;i++) {
    source = arguments[i];
    for (key in source) {
      target[key] = source[key];
    }
    for (var j = 0;j < goog.object.PROTOTYPE_FIELDS_.length;j++) {
      key = goog.object.PROTOTYPE_FIELDS_[j];
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }
};
goog.object.create = function(var_args) {
  var argLength = arguments.length;
  if (argLength == 1 && goog.isArray(arguments[0])) {
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
  if (argLength == 1 && goog.isArray(arguments[0])) {
    return goog.object.createSet.apply(null, arguments[0]);
  }
  for (var rv = {}, i = 0;i < argLength;i++) {
    rv[arguments[i]] = true;
  }
  return rv;
};
goog.object.createImmutableView = function(obj) {
  var result = obj;
  if (Object.isFrozen && !Object.isFrozen(obj)) {
    result = Object.create(obj);
    Object.freeze(result);
  }
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
  for (var visitedSet = {}, proto = obj;proto && (proto !== Object.prototype || !!opt_includeObjectPrototype);) {
    for (var names = Object.getOwnPropertyNames(proto), i = 0;i < names.length;i++) {
      visitedSet[names[i]] = true;
    }
    proto = Object.getPrototypeOf(proto);
  }
  return goog.object.getKeys(visitedSet);
};
mr.cast.Namespace = {};
mr.cast.Namespace.NAMESPACE_PREFIX_ = "urn:x-cast:";
mr.cast.Namespace.MAX_NAMESPACE_LENGTH_ = 128;
mr.cast.Namespace.isValidNamespace = function(namespace) {
  return !!namespace && namespace.length > mr.cast.Namespace.NAMESPACE_PREFIX_.length && goog.string.startsWith(namespace, mr.cast.Namespace.NAMESPACE_PREFIX_) && namespace.length <= mr.cast.Namespace.MAX_NAMESPACE_LENGTH_;
};
mr.cast.Namespace.getCastNamespace_ = function(postfix) {
  return mr.cast.Namespace.NAMESPACE_PREFIX_ + "com.google.cast." + postfix;
};
mr.cast.Namespace.Cast = {TP_CONNECTION:mr.cast.Namespace.getCastNamespace_("tp.connection"), TP_HEARTBEAT:mr.cast.Namespace.getCastNamespace_("tp.heartbeat"), RECEIVER:mr.cast.Namespace.getCastNamespace_("receiver"), MEDIA:mr.cast.Namespace.getCastNamespace_("media"), MEDIA_UNIVERSAL_REMOTE_OPT_IN:mr.cast.Namespace.getCastNamespace_("media.universalRemote.optIn"), WEBRTC:mr.cast.Namespace.getCastNamespace_("webrtc"), BROADCAST:mr.cast.Namespace.getCastNamespace_("broadcast")};
mr.cast.Namespace.TRANSPOSED_CAST_NAMESPACES_ = goog.object.transpose(mr.cast.Namespace.Cast);
mr.cast.Namespace.isCastNamespace = function(namespace) {
  return mr.cast.Namespace.TRANSPOSED_CAST_NAMESPACES_.hasOwnProperty(namespace);
};
mr.cast.Constants = {};
mr.cast.Constants.SEQUENCE_NUMBER_WRAP = 9007199254740992;
goog.functions = {};
goog.functions.constant = function(retValue) {
  return function() {
    return retValue;
  };
};
goog.functions.FALSE = goog.functions.constant(false);
goog.functions.TRUE = goog.functions.constant(true);
goog.functions.NULL = goog.functions.constant(null);
goog.functions.identity = function(opt_returnValue) {
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
    if (length) {
      result = functions[length - 1].apply(this, arguments);
    }
    for (var i = length - 2;i >= 0;i--) {
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
        return false;
      }
    }
    return true;
  };
};
goog.functions.or = function(var_args) {
  var functions = arguments, length = functions.length;
  return function() {
    for (var i = 0;i < length;i++) {
      if (functions[i].apply(this, arguments)) {
        return true;
      }
    }
    return false;
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
goog.functions.CACHE_RETURN_VALUE = true;
goog.functions.cacheReturnValue = function(fn) {
  var called = false, value;
  return function() {
    if (!goog.functions.CACHE_RETURN_VALUE) {
      return fn();
    }
    if (!called) {
      value = fn();
      called = true;
    }
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
  var timeout = 0, shouldFire = false, args = [], handleTimeout = function() {
    timeout = 0;
    if (shouldFire) {
      shouldFire = false;
      fire();
    }
  }, fire = function() {
    timeout = goog.global.setTimeout(handleTimeout, interval);
    f.apply(opt_scope, args);
  };
  return function(var_args) {
    args = arguments;
    if (!timeout) {
      fire();
    } else {
      shouldFire = true;
    }
  };
};
goog.functions.rateLimit = function(f, interval, opt_scope) {
  var timeout = 0, handleTimeout = function() {
    timeout = 0;
  };
  return function(var_args) {
    if (!timeout) {
      timeout = goog.global.setTimeout(handleTimeout, interval);
      f.apply(opt_scope, arguments);
    }
  };
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
  return r * b < 0 ? r + b : r;
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
  return angleRadians * 180 / Math.PI;
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
  if (d > 180) {
    d -= 360;
  } else {
    if (d <= -180) {
      d = 360 + d;
    }
  }
  return d;
};
goog.math.sign = function(x) {
  if (x > 0) {
    return 1;
  }
  if (x < 0) {
    return -1;
  }
  return x;
};
goog.math.longestCommonSubsequence = function(array1, array2, opt_compareFn, opt_collectorFn) {
  for (var compare = opt_compareFn || function(a, b) {
    return a == b;
  }, collect = opt_collectorFn || function(i1) {
    return array1[i1];
  }, length1 = array1.length, length2 = array2.length, arr = [], i = 0;i < length1 + 1;i++) {
    arr[i] = [];
    arr[i][0] = 0;
  }
  for (var j = 0;j < length2 + 1;j++) {
    arr[0][j] = 0;
  }
  for (i = 1;i <= length1;i++) {
    for (j = 1;j <= length2;j++) {
      if (compare(array1[i - 1], array2[j - 1])) {
        arr[i][j] = arr[i - 1][j - 1] + 1;
      } else {
        arr[i][j] = Math.max(arr[i - 1][j], arr[i][j - 1]);
      }
    }
  }
  for (var result = [], i = length1, j = length2;i > 0 && j > 0;) {
    if (compare(array1[i - 1], array2[j - 1])) {
      result.unshift(collect(i - 1, j - 1));
      i--;
      j--;
    } else {
      if (arr[i - 1][j] > arr[i][j - 1]) {
        i--;
      } else {
        j--;
      }
    }
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
  if (sampleSize < 2) {
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
  return isFinite(num) && num % 1 == 0;
};
goog.math.isFiniteNumber = function(num) {
  return isFinite(num) && !isNaN(num);
};
goog.math.isNegativeZero = function(num) {
  return num == 0 && 1 / num < 0;
};
goog.math.log10Floor = function(num) {
  if (num > 0) {
    var x = Math.round(Math.log(num) * Math.LOG10E);
    return x - (parseFloat("1e" + x) > num ? 1 : 0);
  }
  return num == 0 ? -Infinity : NaN;
};
goog.math.safeFloor = function(num, opt_epsilon) {
  goog.asserts.assert(!goog.isDef(opt_epsilon) || opt_epsilon > 0);
  return Math.floor(num + (opt_epsilon || 2e-15));
};
goog.math.safeCeil = function(num, opt_epsilon) {
  goog.asserts.assert(!goog.isDef(opt_epsilon) || opt_epsilon > 0);
  return Math.ceil(num - (opt_epsilon || 2e-15));
};
goog.iter = {};
goog.iter.StopIteration = "StopIteration" in goog.global ? goog.global.StopIteration : {message:"StopIteration", stack:""};
goog.iter.Iterator = function() {
};
goog.iter.Iterator.prototype.next = function() {
  throw goog.iter.StopIteration;
};
goog.iter.Iterator.prototype.__iterator__ = function() {
  return this;
};
goog.iter.toIterator = function(iterable) {
  if (iterable instanceof goog.iter.Iterator) {
    return iterable;
  }
  if (typeof iterable.__iterator__ == "function") {
    return iterable.__iterator__(false);
  }
  if (goog.isArrayLike(iterable)) {
    var i = 0, newIter = new goog.iter.Iterator;
    newIter.next = function() {
      for (;true;) {
        if (i >= iterable.length) {
          throw goog.iter.StopIteration;
        }
        if (!(i in iterable)) {
          i++;
          continue;
        }
        return iterable[i++];
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
      for (;true;) {
        f.call(opt_obj, iterable.next(), undefined, iterable);
      }
    } catch (ex$1) {
      if (ex$1 !== goog.iter.StopIteration) {
        throw ex$1;
      }
    }
  }
};
goog.iter.filter = function(iterable, f, opt_obj) {
  var iterator = goog.iter.toIterator(iterable), newIter = new goog.iter.Iterator;
  newIter.next = function() {
    for (;true;) {
      var val = iterator.next();
      if (f.call(opt_obj, val, undefined, iterator)) {
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
  if (arguments.length > 1) {
    start = startOrStop;
    stop = opt_stop;
  }
  if (step == 0) {
    throw Error("Range step argument must not be zero");
  }
  var newIter = new goog.iter.Iterator;
  newIter.next = function() {
    if (step > 0 && start >= stop || step < 0 && start <= stop) {
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
    return f.call(opt_obj, val, undefined, iterator);
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
    for (;true;) {
      if (f.call(opt_obj, iterable.next(), undefined, iterable)) {
        return true;
      }
    }
  } catch (ex) {
    if (ex !== goog.iter.StopIteration) {
      throw ex;
    }
  }
  return false;
};
goog.iter.every = function(iterable, f, opt_obj) {
  iterable = goog.iter.toIterator(iterable);
  try {
    for (;true;) {
      if (!f.call(opt_obj, iterable.next(), undefined, iterable)) {
        return false;
      }
    }
  } catch (ex) {
    if (ex !== goog.iter.StopIteration) {
      throw ex;
    }
  }
  return true;
};
goog.iter.chain = function(var_args) {
  return goog.iter.chainFromIterable(arguments);
};
goog.iter.chainFromIterable = function(iterable) {
  var iterator = goog.iter.toIterator(iterable), iter = new goog.iter.Iterator, current = null;
  iter.next = function() {
    for (;true;) {
      if (current == null) {
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
  var iterator = goog.iter.toIterator(iterable), newIter = new goog.iter.Iterator, dropping = true;
  newIter.next = function() {
    for (;true;) {
      var val = iterator.next();
      if (dropping && f.call(opt_obj, val, undefined, iterator)) {
        continue;
      } else {
        dropping = false;
      }
      return val;
    }
  };
  return newIter;
};
goog.iter.takeWhile = function(iterable, f, opt_obj) {
  var iterator = goog.iter.toIterator(iterable), iter = new goog.iter.Iterator;
  iter.next = function() {
    var val = iterator.next();
    if (f.call(opt_obj, val, undefined, iterator)) {
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
      }), i = indicies.length - 1;i >= 0;i--) {
        goog.asserts.assert(indicies);
        if (indicies[i] < arrays[i].length - 1) {
          indicies[i]++;
          break;
        }
        if (i == 0) {
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
  var baseIterator = goog.iter.toIterator(iterable), cache = [], cacheIndex = 0, iter = new goog.iter.Iterator, useCache = false;
  iter.next = function() {
    var returnElement = null;
    if (!useCache) {
      try {
        returnElement = baseIterator.next();
        cache.push(returnElement);
        return returnElement;
      } catch (e) {
        if (e != goog.iter.StopIteration || goog.array.isEmpty(cache)) {
          throw e;
        }
        useCache = true;
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
  if (args.length > 0) {
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
  if (args.length > 0) {
    var iterators = goog.array.map(args, goog.iter.toIterator);
    iter.next = function() {
      var iteratorsHaveValues = false, arr = goog.array.map(iterators, function(it) {
        var returnValue;
        try {
          returnValue = it.next();
          iteratorsHaveValues = true;
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
    this.currentValue = this.iterator.next();
    this.currentKey = this.keyFunc(this.currentValue);
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
    return f.apply(opt_obj, goog.array.concat(args, undefined, iterator));
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
      if (goog.array.isEmpty(buffer)) {
        addNextIteratorValueToBuffers();
      }
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
  goog.asserts.assert(goog.math.isInt(limitSize) && limitSize >= 0);
  var iterator = goog.iter.toIterator(iterable), iter = new goog.iter.Iterator, remaining = limitSize;
  iter.next = function() {
    if (remaining-- > 0) {
      return iterator.next();
    }
    throw goog.iter.StopIteration;
  };
  return iter;
};
goog.iter.consume = function(iterable, count) {
  goog.asserts.assert(goog.math.isInt(count) && count >= 0);
  for (var iterator = goog.iter.toIterator(iterable);count-- > 0;) {
    goog.iter.nextOrValue(iterator, null);
  }
  return iterator;
};
goog.iter.slice = function(iterable, start, opt_end) {
  goog.asserts.assert(goog.math.isInt(start) && start >= 0);
  var iterator = goog.iter.consume(iterable, start);
  if (goog.isNumber(opt_end)) {
    goog.asserts.assert(goog.math.isInt(opt_end) && opt_end >= start);
    iterator = goog.iter.limit(iterator, opt_end - start);
  }
  return iterator;
};
goog.iter.hasDuplicates_ = function(arr) {
  var deduped = [];
  goog.array.removeDuplicates(arr, deduped);
  return arr.length != deduped.length;
};
goog.iter.permutations = function(iterable, opt_length) {
  var elements = goog.iter.toArray(iterable), sets = goog.array.repeat(elements, goog.isNumber(opt_length) ? opt_length : elements.length), product = goog.iter.product.apply(undefined, sets);
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
  var elements = goog.iter.toArray(iterable), indexes = goog.array.range(elements.length), sets = goog.array.repeat(indexes, length), indexIterator = goog.iter.product.apply(undefined, sets), sortedIndexIterator = goog.iter.filter(indexIterator, function(arr) {
    return goog.array.isSorted(arr);
  }), iter = new goog.iter.Iterator;
  iter.next = function() {
    return goog.array.map(sortedIndexIterator.next(), getIndexFromElements);
  };
  return iter;
};
goog.structs = {};
goog.structs.Map = function(opt_map, var_args) {
  this.map_ = {};
  this.keys_ = [];
  this.version_ = this.count_ = 0;
  var argLength = arguments.length;
  if (argLength > 1) {
    if (argLength % 2) {
      throw Error("Uneven number of arguments");
    }
    for (var i = 0;i < argLength;i += 2) {
      this.set(arguments[i], arguments[i + 1]);
    }
  } else {
    if (opt_map) {
      this.addAll(opt_map);
    }
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
      return true;
    }
  }
  return false;
};
goog.structs.Map.prototype.equals = function(otherMap, opt_equalityFn) {
  if (this === otherMap) {
    return true;
  }
  if (this.count_ != otherMap.getCount()) {
    return false;
  }
  var equalityFn = opt_equalityFn || goog.structs.Map.defaultEquals;
  this.cleanupKeysArray_();
  for (var key, i = 0;key = this.keys_[i];i++) {
    if (!equalityFn(this.get(key), otherMap.get(key))) {
      return false;
    }
  }
  return true;
};
goog.structs.Map.defaultEquals = function(a, b) {
  return a === b;
};
goog.structs.Map.prototype.isEmpty = function() {
  return this.count_ == 0;
};
goog.structs.Map.prototype.clear = function() {
  this.map_ = {};
  this.version_ = this.count_ = this.keys_.length = 0;
};
goog.structs.Map.prototype.remove = function(key) {
  if (goog.structs.Map.hasKey_(this.map_, key)) {
    delete this.map_[key];
    this.count_--;
    this.version_++;
    if (this.keys_.length > 2 * this.count_) {
      this.cleanupKeysArray_();
    }
    return true;
  }
  return false;
};
goog.structs.Map.prototype.cleanupKeysArray_ = function() {
  if (this.count_ != this.keys_.length) {
    for (var srcIndex = 0, destIndex = 0;srcIndex < this.keys_.length;) {
      var key = this.keys_[srcIndex];
      if (goog.structs.Map.hasKey_(this.map_, key)) {
        this.keys_[destIndex++] = key;
      }
      srcIndex++;
    }
    this.keys_.length = destIndex;
  }
  if (this.count_ != this.keys_.length) {
    for (var seen = {}, destIndex = srcIndex = 0;srcIndex < this.keys_.length;) {
      key = this.keys_[srcIndex];
      if (!goog.structs.Map.hasKey_(seen, key)) {
        this.keys_[destIndex++] = key;
        seen[key] = 1;
      }
      srcIndex++;
    }
    this.keys_.length = destIndex;
  }
};
goog.structs.Map.prototype.get = function(key, opt_val) {
  if (goog.structs.Map.hasKey_(this.map_, key)) {
    return this.map_[key];
  }
  return opt_val;
};
goog.structs.Map.prototype.set = function(key, value) {
  if (!goog.structs.Map.hasKey_(this.map_, key)) {
    this.count_++;
    this.keys_.push(key);
    this.version_++;
  }
  this.map_[key] = value;
};
goog.structs.Map.prototype.addAll = function(map) {
  var keys, values;
  if (map instanceof goog.structs.Map) {
    keys = map.getKeys();
    values = map.getValues();
  } else {
    keys = goog.object.getKeys(map);
    values = goog.object.getValues(map);
  }
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
mr.cast.PendingRequest = function(requestId, timeoutMs) {
  this.requestId = requestId;
  this.timeoutMs = timeoutMs;
  this.timeoutId = null;
};
mr.cast.PendingRequest.prototype.onExpired = function() {
};
mr.cast.PendingRequestsManager = function() {
  this.pendingRequests_ = new goog.structs.Map;
};
mr.cast.PendingRequestsManager.prototype.addRequest = function(request) {
  var $jscomp$this = this;
  this.pendingRequests_.set(request.requestId, request);
  request.timeoutId = setTimeout(function() {
    return $jscomp$this.onTimeout_(request);
  }, request.timeoutMs);
};
mr.cast.PendingRequestsManager.prototype.removeRequest = function(requestId) {
  var request = this.pendingRequests_.get(requestId);
  if (!request) {
    return null;
  }
  clearTimeout(request.timeoutId);
  this.pendingRequests_.remove(requestId);
  return request;
};
mr.cast.PendingRequestsManager.prototype.onTimeout_ = function(request) {
  this.pendingRequests_.remove(request.requestId);
  request.onExpired();
};
mr.PresentationConnectionState = {CONNECTED:"connected", TERMINATED:"terminated", CLOSED:"closed"};
mr.PresentationConnectionCloseReason = {ERROR:"error", CLOSED:"closed", WENT_AWAY:"went_away"};
mr.Logger = function(name) {
  this.name_ = name;
};
mr.Logger.getInstance = function(name) {
  var instance = mr.Logger.instances_.get(name);
  if (!instance) {
    instance = new mr.Logger(name);
    mr.Logger.instances_.set(name, instance);
  }
  return instance;
};
mr.Logger.addHandler = function(handler) {
  mr.Logger.handlers_.push(handler);
};
mr.Logger.logRecord = function(record) {
  if (record.level >= mr.Logger.level) {
    mr.Logger.handlers_.forEach(function(handler) {
      return handler(record);
    });
  }
};
mr.Logger.prototype.log = function(level, message, exception) {
  if (level >= mr.Logger.level) {
    if (typeof message == "function") {
      message = message();
    }
    var record = {logger:this.name_, level:level, time:Date.now(), message:message, exception:exception};
    mr.Logger.handlers_.forEach(function(handler) {
      return handler(record);
    });
    console.log(message);
  }
};
mr.Logger.prototype.error = function(message, exception) {
  this.log(mr.Logger.Level.SEVERE, message, exception);
};
mr.Logger.prototype.warning = function(message, exception) {
  this.log(mr.Logger.Level.WARNING, message, exception);
};
mr.Logger.prototype.info = function(message, exception) {
  this.log(mr.Logger.Level.INFO, message, exception);
};
mr.Logger.prototype.fine = function(message, exception) {
  this.log(mr.Logger.Level.FINE, message, exception);
};
mr.Logger.levelToString = function(level) {
  return mr.Logger.levelNames_[level];
};
mr.Logger.stringToLevel = function(levelName, defaultLevel) {
  var index = mr.Logger.levelNames_.indexOf(levelName);
  return index == -1 ? defaultLevel : index;
};
mr.Logger.numberToLevel = function(levelValue) {
  if (levelValue <= 600) {
    return mr.Logger.Level.FINE;
  } else {
    if (levelValue <= 850) {
      return mr.Logger.Level.INFO;
    } else {
      if (levelValue <= 950) {
        return mr.Logger.Level.WARNING;
      } else {
        return mr.Logger.Level.SEVERE;
      }
    }
  }
};
mr.Logger.handlers_ = [];
mr.Logger.instances_ = new Map;
mr.Logger.Level = {FINE:0, INFO:1, WARNING:2, SEVERE:3};
mr.Logger.levelNames_ = ["FINE", "INFO", "WARNING", "SEVERE"];
mr.Logger.level = mr.Logger.Level.FINE;
goog.disposable = {};
goog.disposable.IDisposable = function() {
};
goog.Disposable = function() {
  if (goog.Disposable.MONITORING_MODE != goog.Disposable.MonitoringMode.OFF) {
    goog.Disposable.instances_[goog.getUid(this)] = this;
  }
  this.disposed_ = this.disposed_;
  this.onDisposeCallbacks_ = this.onDisposeCallbacks_;
};
goog.Disposable.MonitoringMode = {OFF:0, PERMANENT:1, INTERACTIVE:2};
goog.Disposable.MONITORING_MODE = 0;
goog.Disposable.INCLUDE_STACK_ON_CREATION = true;
goog.Disposable.instances_ = {};
goog.Disposable.getUndisposedObjects = function() {
  var ret = [], id;
  for (id in goog.Disposable.instances_) {
    if (goog.Disposable.instances_.hasOwnProperty(id)) {
      ret.push(goog.Disposable.instances_[Number(id)]);
    }
  }
  return ret;
};
goog.Disposable.clearUndisposedObjects = function() {
  goog.Disposable.instances_ = {};
};
goog.Disposable.prototype.disposed_ = false;
goog.Disposable.prototype.isDisposed = function() {
  return this.disposed_;
};
goog.Disposable.prototype.dispose = function() {
  if (!this.disposed_) {
    this.disposed_ = true;
    this.disposeInternal();
    if (goog.Disposable.MONITORING_MODE != goog.Disposable.MonitoringMode.OFF) {
      var uid = goog.getUid(this);
      if (goog.Disposable.MONITORING_MODE == goog.Disposable.MonitoringMode.PERMANENT && !goog.Disposable.instances_.hasOwnProperty(uid)) {
        throw Error(this + " did not call the goog.Disposable base " + "constructor or was disposed of after a clearUndisposedObjects " + "call");
      }
      delete goog.Disposable.instances_[uid];
    }
  }
};
goog.Disposable.prototype.disposeInternal = function() {
  if (this.onDisposeCallbacks_) {
    for (;this.onDisposeCallbacks_.length;) {
      this.onDisposeCallbacks_.shift()();
    }
  }
};
goog.Disposable.isDisposed = function(obj) {
  if (obj && typeof obj.isDisposed == "function") {
    return obj.isDisposed();
  }
  return false;
};
goog.dispose = function(obj) {
  if (obj && typeof obj.dispose == "function") {
    obj.dispose();
  }
};
goog.disposeAll = function(var_args) {
  for (var i = 0, len = arguments.length;i < len;++i) {
    var disposable = arguments[i];
    if (goog.isArrayLike(disposable)) {
      goog.disposeAll.apply(null, disposable);
    } else {
      goog.dispose(disposable);
    }
  }
};
goog.events = {};
goog.events.EventId = function(eventId) {
  this.id = eventId;
};
goog.events.EventId.prototype.toString = function() {
  return this.id;
};
goog.events.Event = function(type, opt_target) {
  this.type = type instanceof goog.events.EventId ? String(type) : type;
  this.currentTarget = this.target = opt_target;
  this.defaultPrevented = this.propagationStopped_ = false;
  this.returnValue_ = true;
};
goog.events.Event.prototype.stopPropagation = function() {
  this.propagationStopped_ = true;
};
goog.events.Event.prototype.preventDefault = function() {
  this.defaultPrevented = true;
  this.returnValue_ = false;
};
goog.events.Event.stopPropagation = function(e) {
  e.stopPropagation();
};
goog.events.Event.preventDefault = function(e) {
  e.preventDefault();
};
goog.debug.entryPointRegistry = {};
goog.debug.EntryPointMonitor = function() {
};
goog.debug.entryPointRegistry.refList_ = [];
goog.debug.entryPointRegistry.monitors_ = [];
goog.debug.entryPointRegistry.monitorsMayExist_ = false;
goog.debug.entryPointRegistry.register = function(callback) {
  goog.debug.entryPointRegistry.refList_[goog.debug.entryPointRegistry.refList_.length] = callback;
  if (goog.debug.entryPointRegistry.monitorsMayExist_) {
    for (var monitors = goog.debug.entryPointRegistry.monitors_, i = 0;i < monitors.length;i++) {
      callback(goog.bind(monitors[i].wrap, monitors[i]));
    }
  }
};
goog.debug.entryPointRegistry.monitorAll = function(monitor) {
  goog.debug.entryPointRegistry.monitorsMayExist_ = true;
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
goog.reflect = {};
goog.reflect.object = function(type, object) {
  return object;
};
goog.reflect.objectProperty = function(prop) {
  return prop;
};
goog.reflect.sinkValue = function(x) {
  goog.reflect.sinkValue[" "](x);
  return x;
};
goog.reflect.sinkValue[" "] = goog.nullFunction;
goog.reflect.canAccessProperty = function(obj, prop) {
  try {
    goog.reflect.sinkValue(obj[prop]);
    return true;
  } catch (e) {
  }
  return false;
};
goog.reflect.cache = function(cacheObj, key, valueFn, opt_keyFn) {
  var storedKey = opt_keyFn ? opt_keyFn(key) : key;
  if (Object.prototype.hasOwnProperty.call(cacheObj, storedKey)) {
    return cacheObj[storedKey];
  }
  return cacheObj[storedKey] = valueFn(key);
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
  for (var versionRegExp = new RegExp("(\\w[\\w ]+)" + "/" + "([^\\s]+)" + "\\s*" + "(?:\\((.*?)\\))?", "g"), data = [], match;match = versionRegExp.exec(userAgent);) {
    data.push([match[1], match[2], match[3] || undefined]);
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
  return goog.string.compareVersions(goog.labs.userAgent.browser.getVersion(), version) >= 0;
};
goog.labs.userAgent.browser.getIEVersion_ = function(userAgent) {
  var rv = /rv: *([\d\.]*)/.exec(userAgent);
  if (rv && rv[1]) {
    return rv[1];
  }
  var version = "", msie = /MSIE +([\d\.]+)/.exec(userAgent);
  if (msie && msie[1]) {
    var tridentVersion = /Trident\/(\d.\d)/.exec(userAgent);
    if (msie[1] == "7.0") {
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
      if (engineTuple[0] == "Gecko") {
        return goog.labs.userAgent.engine.getVersionForKey_(tuples, "Firefox");
      }
      return engineTuple[1];
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
    if (tuple[0] == "Edge") {
      return tuple;
    }
  }
};
goog.labs.userAgent.engine.isVersionOrHigher = function(version) {
  return goog.string.compareVersions(goog.labs.userAgent.engine.getVersion(), version) >= 0;
};
goog.labs.userAgent.engine.getVersionForKey_ = function(tuples, key) {
  var pair$jscomp$0 = goog.array.find(tuples, function(pair) {
    return key == pair[0];
  });
  return pair$jscomp$0 && pair$jscomp$0[1] || "";
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
    var match = re.exec(userAgentString);
    if (match) {
      version = match[1];
    } else {
      version = "0.0";
    }
  } else {
    if (goog.labs.userAgent.platform.isIos()) {
      re = /(?:iPhone|iPod|iPad|CPU)\s+OS\s+(\S+)/;
      version = (match = re.exec(userAgentString)) && match[1].replace(/_/g, ".");
    } else {
      if (goog.labs.userAgent.platform.isMacintosh()) {
        re = /Mac OS X ([0-9_.]+)/;
        version = (match = re.exec(userAgentString)) ? match[1].replace(/_/g, ".") : "10";
      } else {
        if (goog.labs.userAgent.platform.isAndroid()) {
          re = /Android\s+([^\);]+)(\)|;)/;
          version = (match = re.exec(userAgentString)) && match[1];
        } else {
          if (goog.labs.userAgent.platform.isChromeOS()) {
            re = /(?:CrOS\s+(?:i686|x86_64)\s+([0-9.]+))/;
            version = (match = re.exec(userAgentString)) && match[1];
          }
        }
      }
    }
  }
  return version || "";
};
goog.labs.userAgent.platform.isVersionOrHigher = function(version) {
  return goog.string.compareVersions(goog.labs.userAgent.platform.getVersion(), version) >= 0;
};
goog.userAgent = {};
goog.userAgent.ASSUME_IE = false;
goog.userAgent.ASSUME_EDGE = false;
goog.userAgent.ASSUME_GECKO = false;
goog.userAgent.ASSUME_WEBKIT = false;
goog.userAgent.ASSUME_MOBILE_WEBKIT = false;
goog.userAgent.ASSUME_OPERA = false;
goog.userAgent.ASSUME_ANY_VERSION = false;
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
goog.userAgent.ASSUME_MAC = false;
goog.userAgent.ASSUME_WINDOWS = false;
goog.userAgent.ASSUME_LINUX = false;
goog.userAgent.ASSUME_X11 = false;
goog.userAgent.ASSUME_ANDROID = false;
goog.userAgent.ASSUME_IPHONE = false;
goog.userAgent.ASSUME_IPAD = false;
goog.userAgent.ASSUME_IPOD = false;
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
  if (arr) {
    version = arr ? arr[1] : "";
  }
  if (goog.userAgent.IE) {
    var docMode = goog.userAgent.getDocumentMode_();
    if (docMode != null && docMode > parseFloat(version)) {
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
  return undefined;
};
goog.userAgent.getDocumentMode_ = function() {
  var doc = goog.global.document;
  return doc ? doc.documentMode : undefined;
};
goog.userAgent.VERSION = goog.userAgent.determineVersion_();
goog.userAgent.compare = function(v1, v2) {
  return goog.string.compareVersions(v1, v2);
};
goog.userAgent.isVersionOrHigherCache_ = {};
goog.userAgent.isVersionOrHigher = function(version) {
  return goog.userAgent.ASSUME_ANY_VERSION || goog.reflect.cache(goog.userAgent.isVersionOrHigherCache_, version, function() {
    return goog.string.compareVersions(goog.userAgent.VERSION, version) >= 0;
  });
};
goog.userAgent.isVersion = goog.userAgent.isVersionOrHigher;
goog.userAgent.isDocumentModeOrHigher = function(documentMode) {
  return Number(goog.userAgent.DOCUMENT_MODE) >= documentMode;
};
goog.userAgent.isDocumentMode = goog.userAgent.isDocumentModeOrHigher;
var JSCompiler_inline_result$jscomp$3;
{
  a: {
    var doc$jscomp$inline_4 = goog.global.document;
    if (!doc$jscomp$inline_4 || !goog.userAgent.IE) {
      JSCompiler_inline_result$jscomp$3 = undefined;
      break a;
    }
    JSCompiler_inline_result$jscomp$3 = goog.userAgent.getDocumentMode_() || (doc$jscomp$inline_4.compatMode == "CSS1Compat" ? parseInt(goog.userAgent.VERSION, 10) : 5);
  }
}
goog.userAgent.DOCUMENT_MODE = JSCompiler_inline_result$jscomp$3;
goog.events.BrowserFeature = {HAS_W3C_BUTTON:!goog.userAgent.IE || goog.userAgent.isDocumentModeOrHigher(9), HAS_W3C_EVENT_SUPPORT:!goog.userAgent.IE || goog.userAgent.isDocumentModeOrHigher(9), SET_KEY_CODE_TO_PREVENT_DEFAULT:goog.userAgent.IE && !goog.userAgent.isVersionOrHigher("9"), HAS_NAVIGATOR_ONLINE_PROPERTY:!goog.userAgent.WEBKIT || goog.userAgent.isVersionOrHigher("528"), HAS_HTML5_NETWORK_EVENT_SUPPORT:goog.userAgent.GECKO && goog.userAgent.isVersionOrHigher("1.9b") || goog.userAgent.IE && 
goog.userAgent.isVersionOrHigher("8") || goog.userAgent.OPERA && goog.userAgent.isVersionOrHigher("9.5") || goog.userAgent.WEBKIT && goog.userAgent.isVersionOrHigher("528"), HTML5_NETWORK_EVENTS_FIRE_ON_BODY:goog.userAgent.GECKO && !goog.userAgent.isVersionOrHigher("8") || goog.userAgent.IE && !goog.userAgent.isVersionOrHigher("9"), TOUCH_ENABLED:"ontouchstart" in goog.global || !!(goog.global.document && document.documentElement && "ontouchstart" in document.documentElement) || !!(goog.global.navigator && 
goog.global.navigator.msMaxTouchPoints)};
goog.events.getVendorPrefixedName_ = function(eventName) {
  return goog.userAgent.WEBKIT ? "webkit" + eventName : goog.userAgent.OPERA ? "o" + eventName.toLowerCase() : eventName.toLowerCase();
};
goog.events.EventType = {CLICK:"click", RIGHTCLICK:"rightclick", DBLCLICK:"dblclick", MOUSEDOWN:"mousedown", MOUSEUP:"mouseup", MOUSEOVER:"mouseover", MOUSEOUT:"mouseout", MOUSEMOVE:"mousemove", MOUSEENTER:"mouseenter", MOUSELEAVE:"mouseleave", SELECTIONCHANGE:"selectionchange", SELECTSTART:"selectstart", WHEEL:"wheel", KEYPRESS:"keypress", KEYDOWN:"keydown", KEYUP:"keyup", BLUR:"blur", FOCUS:"focus", DEACTIVATE:"deactivate", FOCUSIN:goog.userAgent.IE ? "focusin" : "DOMFocusIn", FOCUSOUT:goog.userAgent.IE ? 
"focusout" : "DOMFocusOut", CHANGE:"change", RESET:"reset", SELECT:"select", SUBMIT:"submit", INPUT:"input", PROPERTYCHANGE:"propertychange", DRAGSTART:"dragstart", DRAG:"drag", DRAGENTER:"dragenter", DRAGOVER:"dragover", DRAGLEAVE:"dragleave", DROP:"drop", DRAGEND:"dragend", TOUCHSTART:"touchstart", TOUCHMOVE:"touchmove", TOUCHEND:"touchend", TOUCHCANCEL:"touchcancel", BEFOREUNLOAD:"beforeunload", CONSOLEMESSAGE:"consolemessage", CONTEXTMENU:"contextmenu", DEVICEORIENTATION:"deviceorientation", 
DOMCONTENTLOADED:"DOMContentLoaded", ERROR:"error", HELP:"help", LOAD:"load", LOSECAPTURE:"losecapture", ORIENTATIONCHANGE:"orientationchange", READYSTATECHANGE:"readystatechange", RESIZE:"resize", SCROLL:"scroll", UNLOAD:"unload", CANPLAY:"canplay", CANPLAYTHROUGH:"canplaythrough", DURATIONCHANGE:"durationchange", EMPTIED:"emptied", ENDED:"ended", LOADEDDATA:"loadeddata", LOADEDMETADATA:"loadedmetadata", PAUSE:"pause", PLAY:"play", PLAYING:"playing", RATECHANGE:"ratechange", SEEKED:"seeked", SEEKING:"seeking", 
STALLED:"stalled", SUSPEND:"suspend", TIMEUPDATE:"timeupdate", VOLUMECHANGE:"volumechange", WAITING:"waiting", HASHCHANGE:"hashchange", PAGEHIDE:"pagehide", PAGESHOW:"pageshow", POPSTATE:"popstate", COPY:"copy", PASTE:"paste", CUT:"cut", BEFORECOPY:"beforecopy", BEFORECUT:"beforecut", BEFOREPASTE:"beforepaste", ONLINE:"online", OFFLINE:"offline", MESSAGE:"message", CONNECT:"connect", ANIMATIONSTART:goog.events.getVendorPrefixedName_("AnimationStart"), ANIMATIONEND:goog.events.getVendorPrefixedName_("AnimationEnd"), 
ANIMATIONITERATION:goog.events.getVendorPrefixedName_("AnimationIteration"), TRANSITIONEND:goog.events.getVendorPrefixedName_("TransitionEnd"), POINTERDOWN:"pointerdown", POINTERUP:"pointerup", POINTERCANCEL:"pointercancel", POINTERMOVE:"pointermove", POINTEROVER:"pointerover", POINTEROUT:"pointerout", POINTERENTER:"pointerenter", POINTERLEAVE:"pointerleave", GOTPOINTERCAPTURE:"gotpointercapture", LOSTPOINTERCAPTURE:"lostpointercapture", MSGESTURECHANGE:"MSGestureChange", MSGESTUREEND:"MSGestureEnd", 
MSGESTUREHOLD:"MSGestureHold", MSGESTURESTART:"MSGestureStart", MSGESTURETAP:"MSGestureTap", MSGOTPOINTERCAPTURE:"MSGotPointerCapture", MSINERTIASTART:"MSInertiaStart", MSLOSTPOINTERCAPTURE:"MSLostPointerCapture", MSPOINTERCANCEL:"MSPointerCancel", MSPOINTERDOWN:"MSPointerDown", MSPOINTERENTER:"MSPointerEnter", MSPOINTERHOVER:"MSPointerHover", MSPOINTERLEAVE:"MSPointerLeave", MSPOINTERMOVE:"MSPointerMove", MSPOINTEROUT:"MSPointerOut", MSPOINTEROVER:"MSPointerOver", MSPOINTERUP:"MSPointerUp", TEXT:"text", 
TEXTINPUT:"textInput", COMPOSITIONSTART:"compositionstart", COMPOSITIONUPDATE:"compositionupdate", COMPOSITIONEND:"compositionend", EXIT:"exit", LOADABORT:"loadabort", LOADCOMMIT:"loadcommit", LOADREDIRECT:"loadredirect", LOADSTART:"loadstart", LOADSTOP:"loadstop", RESPONSIVE:"responsive", SIZECHANGED:"sizechanged", UNRESPONSIVE:"unresponsive", VISIBILITYCHANGE:"visibilitychange", STORAGE:"storage", DOMSUBTREEMODIFIED:"DOMSubtreeModified", DOMNODEINSERTED:"DOMNodeInserted", DOMNODEREMOVED:"DOMNodeRemoved", 
DOMNODEREMOVEDFROMDOCUMENT:"DOMNodeRemovedFromDocument", DOMNODEINSERTEDINTODOCUMENT:"DOMNodeInsertedIntoDocument", DOMATTRMODIFIED:"DOMAttrModified", DOMCHARACTERDATAMODIFIED:"DOMCharacterDataModified", BEFOREPRINT:"beforeprint", AFTERPRINT:"afterprint"};
goog.events.BrowserEvent = function(opt_e, opt_currentTarget) {
  goog.events.Event.call(this, opt_e ? opt_e.type : "");
  this.relatedTarget = this.currentTarget = this.target = null;
  this.charCode = this.keyCode = this.button = this.screenY = this.screenX = this.clientY = this.clientX = this.offsetY = this.offsetX = 0;
  this.metaKey = this.shiftKey = this.altKey = this.ctrlKey = false;
  this.event_ = this.state = null;
  if (opt_e) {
    this.init(opt_e, opt_currentTarget);
  }
};
goog.inherits(goog.events.BrowserEvent, goog.events.Event);
goog.events.BrowserEvent.MouseButton = {LEFT:0, MIDDLE:1, RIGHT:2};
goog.events.BrowserEvent.IEButtonMap = [1, 4, 2];
goog.events.BrowserEvent.prototype.init = function(e, opt_currentTarget) {
  var type = this.type = e.type, relevantTouch = e.changedTouches ? e.changedTouches[0] : null;
  this.target = e.target || e.srcElement;
  this.currentTarget = opt_currentTarget;
  var relatedTarget = e.relatedTarget;
  if (relatedTarget) {
    if (goog.userAgent.GECKO) {
      if (!goog.reflect.canAccessProperty(relatedTarget, "nodeName")) {
        relatedTarget = null;
      }
    }
  } else {
    if (type == goog.events.EventType.MOUSEOVER) {
      relatedTarget = e.fromElement;
    } else {
      if (type == goog.events.EventType.MOUSEOUT) {
        relatedTarget = e.toElement;
      }
    }
  }
  this.relatedTarget = relatedTarget;
  if (!goog.isNull(relevantTouch)) {
    this.clientX = relevantTouch.clientX !== undefined ? relevantTouch.clientX : relevantTouch.pageX;
    this.clientY = relevantTouch.clientY !== undefined ? relevantTouch.clientY : relevantTouch.pageY;
    this.screenX = relevantTouch.screenX || 0;
    this.screenY = relevantTouch.screenY || 0;
  } else {
    this.offsetX = goog.userAgent.WEBKIT || e.offsetX !== undefined ? e.offsetX : e.layerX;
    this.offsetY = goog.userAgent.WEBKIT || e.offsetY !== undefined ? e.offsetY : e.layerY;
    this.clientX = e.clientX !== undefined ? e.clientX : e.pageX;
    this.clientY = e.clientY !== undefined ? e.clientY : e.pageY;
    this.screenX = e.screenX || 0;
    this.screenY = e.screenY || 0;
  }
  this.button = e.button;
  this.keyCode = e.keyCode || 0;
  this.charCode = e.charCode || (type == "keypress" ? e.keyCode : 0);
  this.ctrlKey = e.ctrlKey;
  this.altKey = e.altKey;
  this.shiftKey = e.shiftKey;
  this.metaKey = e.metaKey;
  this.state = e.state;
  this.event_ = e;
  if (e.defaultPrevented) {
    this.preventDefault();
  }
};
goog.events.BrowserEvent.prototype.stopPropagation = function() {
  goog.events.BrowserEvent.superClass_.stopPropagation.call(this);
  if (this.event_.stopPropagation) {
    this.event_.stopPropagation();
  } else {
    this.event_.cancelBubble = true;
  }
};
goog.events.BrowserEvent.prototype.preventDefault = function() {
  goog.events.BrowserEvent.superClass_.preventDefault.call(this);
  var be = this.event_;
  if (!be.preventDefault) {
    be.returnValue = false;
    if (goog.events.BrowserFeature.SET_KEY_CODE_TO_PREVENT_DEFAULT) {
      try {
        if (be.ctrlKey || be.keyCode >= 112 && be.keyCode <= 123) {
          be.keyCode = -1;
        }
      } catch (ex) {
      }
    }
  } else {
    be.preventDefault();
  }
};
goog.events.Listenable = function() {
};
goog.events.Listenable.IMPLEMENTED_BY_PROP = "closure_listenable_" + (Math.random() * 1e6 | 0);
goog.events.Listenable.addImplementation = function(cls) {
  cls.prototype[goog.events.Listenable.IMPLEMENTED_BY_PROP] = true;
};
goog.events.Listenable.isImplementedBy = function(obj) {
  return !!(obj && obj[goog.events.Listenable.IMPLEMENTED_BY_PROP]);
};
goog.events.ListenableKey = function() {
};
goog.events.ListenableKey.counter_ = 0;
goog.events.ListenableKey.reserveKey = function() {
  return ++goog.events.ListenableKey.counter_;
};
goog.events.Listener = function(listener, proxy, src, type, capture, opt_handler) {
  this.listener = listener;
  this.proxy = proxy;
  this.src = src;
  this.type = type;
  this.capture = !!capture;
  this.handler = opt_handler;
  this.key = goog.events.ListenableKey.reserveKey();
  this.removed = this.callOnce = false;
};
goog.events.Listener.ENABLE_MONITORING = false;
goog.events.Listener.prototype.markAsRemoved = function() {
  this.removed = true;
  this.handler = this.src = this.proxy = this.listener = null;
};
goog.events.ListenerMap = function(src) {
  this.src = src;
  this.listeners = {};
  this.typeCount_ = 0;
};
goog.events.ListenerMap.prototype.add = function(type, listener, callOnce, opt_useCapture, opt_listenerScope) {
  var typeStr = type.toString(), listenerArray = this.listeners[typeStr];
  if (!listenerArray) {
    listenerArray = this.listeners[typeStr] = [];
    this.typeCount_++;
  }
  var listenerObj, index = goog.events.ListenerMap.findListenerIndex_(listenerArray, listener, opt_useCapture, opt_listenerScope);
  if (index > -1) {
    listenerObj = listenerArray[index];
    if (!callOnce) {
      listenerObj.callOnce = false;
    }
  } else {
    listenerObj = new goog.events.Listener(listener, null, this.src, typeStr, !!opt_useCapture, opt_listenerScope);
    listenerObj.callOnce = callOnce;
    listenerArray.push(listenerObj);
  }
  return listenerObj;
};
goog.events.ListenerMap.prototype.remove = function(type, listener, opt_useCapture, opt_listenerScope) {
  var typeStr = type.toString();
  if (!(typeStr in this.listeners)) {
    return false;
  }
  var listenerArray = this.listeners[typeStr], index = goog.events.ListenerMap.findListenerIndex_(listenerArray, listener, opt_useCapture, opt_listenerScope);
  if (index > -1) {
    listenerArray[index].markAsRemoved();
    goog.array.removeAt(listenerArray, index);
    if (listenerArray.length == 0) {
      delete this.listeners[typeStr];
      this.typeCount_--;
    }
    return true;
  }
  return false;
};
goog.events.ListenerMap.prototype.removeByKey = function(listener) {
  var type = listener.type;
  if (!(type in this.listeners)) {
    return false;
  }
  var removed = goog.array.remove(this.listeners[type], listener);
  if (removed) {
    listener.markAsRemoved();
    if (this.listeners[type].length == 0) {
      delete this.listeners[type];
      this.typeCount_--;
    }
  }
  return removed;
};
goog.events.ListenerMap.prototype.removeAll = function(opt_type) {
  var typeStr = opt_type && opt_type.toString(), count = 0, type;
  for (type in this.listeners) {
    if (!typeStr || type == typeStr) {
      for (var listenerArray = this.listeners[type], i = 0;i < listenerArray.length;i++) {
        ++count;
        listenerArray[i].markAsRemoved();
      }
      delete this.listeners[type];
      this.typeCount_--;
    }
  }
  return count;
};
goog.events.ListenerMap.prototype.getListeners = function(type, capture) {
  var listenerArray = this.listeners[type.toString()], rv = [];
  if (listenerArray) {
    for (var i = 0;i < listenerArray.length;++i) {
      var listenerObj = listenerArray[i];
      if (listenerObj.capture == capture) {
        rv.push(listenerObj);
      }
    }
  }
  return rv;
};
goog.events.ListenerMap.prototype.getListener = function(type, listener, capture, opt_listenerScope) {
  var listenerArray = this.listeners[type.toString()], i = -1;
  if (listenerArray) {
    i = goog.events.ListenerMap.findListenerIndex_(listenerArray, listener, capture, opt_listenerScope);
  }
  return i > -1 ? listenerArray[i] : null;
};
goog.events.ListenerMap.prototype.hasListener = function(opt_type, opt_capture) {
  var hasType = goog.isDef(opt_type), typeStr = hasType ? opt_type.toString() : "", hasCapture = goog.isDef(opt_capture);
  return goog.object.some(this.listeners, function(listenerArray) {
    for (var i = 0;i < listenerArray.length;++i) {
      if ((!hasType || listenerArray[i].type == typeStr) && (!hasCapture || listenerArray[i].capture == opt_capture)) {
        return true;
      }
    }
    return false;
  });
};
goog.events.ListenerMap.findListenerIndex_ = function(listenerArray, listener, opt_useCapture, opt_listenerScope) {
  for (var i = 0;i < listenerArray.length;++i) {
    var listenerObj = listenerArray[i];
    if (!listenerObj.removed && listenerObj.listener == listener && listenerObj.capture == !!opt_useCapture && listenerObj.handler == opt_listenerScope) {
      return i;
    }
  }
  return -1;
};
goog.events.LISTENER_MAP_PROP_ = "closure_lm_" + (Math.random() * 1e6 | 0);
goog.events.onString_ = "on";
goog.events.onStringMap_ = {};
goog.events.CaptureSimulationMode = {OFF_AND_FAIL:0, OFF_AND_SILENT:1, ON:2};
goog.events.CAPTURE_SIMULATION_MODE = 2;
goog.events.listenerCountEstimate_ = 0;
goog.events.listen = function(src, type, listener, opt_capt, opt_handler) {
  if (goog.isArray(type)) {
    for (var i = 0;i < type.length;i++) {
      goog.events.listen(src, type[i], listener, opt_capt, opt_handler);
    }
    return null;
  }
  listener = goog.events.wrapListener(listener);
  if (goog.events.Listenable.isImplementedBy(src)) {
    return src.listen(type, listener, opt_capt, opt_handler);
  } else {
    return goog.events.listen_(src, type, listener, false, opt_capt, opt_handler);
  }
};
goog.events.listen_ = function(src, type, listener, callOnce, opt_capt, opt_handler) {
  if (!type) {
    throw Error("Invalid event type");
  }
  var capture = !!opt_capt;
  if (capture && !goog.events.BrowserFeature.HAS_W3C_EVENT_SUPPORT) {
    if (goog.events.CAPTURE_SIMULATION_MODE == goog.events.CaptureSimulationMode.OFF_AND_FAIL) {
      goog.asserts.fail("Can not register capture listener in IE8-.");
      return null;
    } else {
      if (goog.events.CAPTURE_SIMULATION_MODE == goog.events.CaptureSimulationMode.OFF_AND_SILENT) {
        return null;
      }
    }
  }
  var listenerMap = goog.events.getListenerMap_(src);
  if (!listenerMap) {
    src[goog.events.LISTENER_MAP_PROP_] = listenerMap = new goog.events.ListenerMap(src);
  }
  var listenerObj = listenerMap.add(type, listener, callOnce, opt_capt, opt_handler);
  if (listenerObj.proxy) {
    return listenerObj;
  }
  var proxy = goog.events.getProxy();
  listenerObj.proxy = proxy;
  proxy.src = src;
  proxy.listener = listenerObj;
  if (src.addEventListener) {
    src.addEventListener(type.toString(), proxy, capture);
  } else {
    if (src.attachEvent) {
      src.attachEvent(goog.events.getOnString_(type.toString()), proxy);
    } else {
      throw Error("addEventListener and attachEvent are unavailable.");
    }
  }
  goog.events.listenerCountEstimate_++;
  return listenerObj;
};
goog.events.getProxy = function() {
  var proxyCallbackFunction = goog.events.handleBrowserEvent_, f = goog.events.BrowserFeature.HAS_W3C_EVENT_SUPPORT ? function(eventObject) {
    return proxyCallbackFunction.call(f.src, f.listener, eventObject);
  } : function(eventObject) {
    var v = proxyCallbackFunction.call(f.src, f.listener, eventObject);
    if (!v) {
      return v;
    }
  };
  return f;
};
goog.events.listenOnce = function(src, type, listener, opt_capt, opt_handler) {
  if (goog.isArray(type)) {
    for (var i = 0;i < type.length;i++) {
      goog.events.listenOnce(src, type[i], listener, opt_capt, opt_handler);
    }
    return null;
  }
  listener = goog.events.wrapListener(listener);
  if (goog.events.Listenable.isImplementedBy(src)) {
    return src.listenOnce(type, listener, opt_capt, opt_handler);
  } else {
    return goog.events.listen_(src, type, listener, true, opt_capt, opt_handler);
  }
};
goog.events.listenWithWrapper = function(src, wrapper, listener, opt_capt, opt_handler) {
  wrapper.listen(src, listener, opt_capt, opt_handler);
};
goog.events.unlisten = function(src, type, listener, opt_capt, opt_handler) {
  if (goog.isArray(type)) {
    for (var i = 0;i < type.length;i++) {
      goog.events.unlisten(src, type[i], listener, opt_capt, opt_handler);
    }
    return null;
  }
  listener = goog.events.wrapListener(listener);
  if (goog.events.Listenable.isImplementedBy(src)) {
    return src.unlisten(type, listener, opt_capt, opt_handler);
  }
  if (!src) {
    return false;
  }
  var listenerMap = goog.events.getListenerMap_(src);
  if (listenerMap) {
    var listenerObj = listenerMap.getListener(type, listener, !!opt_capt, opt_handler);
    if (listenerObj) {
      return goog.events.unlistenByKey(listenerObj);
    }
  }
  return false;
};
goog.events.unlistenByKey = function(key) {
  if (goog.isNumber(key)) {
    return false;
  }
  if (!key || key.removed) {
    return false;
  }
  var src = key.src;
  if (goog.events.Listenable.isImplementedBy(src)) {
    return src.unlistenByKey(key);
  }
  var type = key.type, proxy = key.proxy;
  if (src.removeEventListener) {
    src.removeEventListener(type, proxy, key.capture);
  } else {
    if (src.detachEvent) {
      src.detachEvent(goog.events.getOnString_(type), proxy);
    }
  }
  goog.events.listenerCountEstimate_--;
  var listenerMap = goog.events.getListenerMap_(src);
  if (listenerMap) {
    listenerMap.removeByKey(key);
    if (listenerMap.typeCount_ == 0) {
      listenerMap.src = null;
      src[goog.events.LISTENER_MAP_PROP_] = null;
    }
  } else {
    key.markAsRemoved();
  }
  return true;
};
goog.events.unlistenWithWrapper = function(src, wrapper, listener, opt_capt, opt_handler) {
  wrapper.unlisten(src, listener, opt_capt, opt_handler);
};
goog.events.removeAll = function(obj, opt_type) {
  if (!obj) {
    return 0;
  }
  if (goog.events.Listenable.isImplementedBy(obj)) {
    return obj.removeAllListeners(opt_type);
  }
  var listenerMap = goog.events.getListenerMap_(obj);
  if (!listenerMap) {
    return 0;
  }
  var count = 0, typeStr = opt_type && opt_type.toString(), type;
  for (type in listenerMap.listeners) {
    if (!typeStr || type == typeStr) {
      for (var listeners = listenerMap.listeners[type].concat(), i = 0;i < listeners.length;++i) {
        if (goog.events.unlistenByKey(listeners[i])) {
          ++count;
        }
      }
    }
  }
  return count;
};
goog.events.getListeners = function(obj, type, capture) {
  if (goog.events.Listenable.isImplementedBy(obj)) {
    return obj.getListeners(type, capture);
  } else {
    if (!obj) {
      return [];
    }
    var listenerMap = goog.events.getListenerMap_(obj);
    return listenerMap ? listenerMap.getListeners(type, capture) : [];
  }
};
goog.events.getListener = function(src, type, listener, opt_capt, opt_handler) {
  listener = goog.events.wrapListener(listener);
  var capture = !!opt_capt;
  if (goog.events.Listenable.isImplementedBy(src)) {
    return src.getListener(type, listener, capture, opt_handler);
  }
  if (!src) {
    return null;
  }
  var listenerMap = goog.events.getListenerMap_(src);
  if (listenerMap) {
    return listenerMap.getListener(type, listener, capture, opt_handler);
  }
  return null;
};
goog.events.hasListener = function(obj, opt_type, opt_capture) {
  if (goog.events.Listenable.isImplementedBy(obj)) {
    return obj.hasListener(opt_type, opt_capture);
  }
  var listenerMap = goog.events.getListenerMap_(obj);
  return !!listenerMap && listenerMap.hasListener(opt_type, opt_capture);
};
goog.events.expose = function(e) {
  var str = [], key;
  for (key in e) {
    if (e[key] && e[key].id) {
      str.push(key + " = " + e[key] + " (" + e[key].id + ")");
    } else {
      str.push(key + " = " + e[key]);
    }
  }
  return str.join("\n");
};
goog.events.getOnString_ = function(type) {
  if (type in goog.events.onStringMap_) {
    return goog.events.onStringMap_[type];
  }
  return goog.events.onStringMap_[type] = goog.events.onString_ + type;
};
goog.events.fireListeners = function(obj, type, capture, eventObject) {
  if (goog.events.Listenable.isImplementedBy(obj)) {
    return obj.fireListeners(type, capture, eventObject);
  }
  return goog.events.fireListeners_(obj, type, capture, eventObject);
};
goog.events.fireListeners_ = function(obj, type, capture, eventObject) {
  var retval = true, listenerMap = goog.events.getListenerMap_(obj);
  if (listenerMap) {
    var listenerArray = listenerMap.listeners[type.toString()];
    if (listenerArray) {
      for (var listenerArray = listenerArray.concat(), i = 0;i < listenerArray.length;i++) {
        var listener = listenerArray[i];
        if (listener && listener.capture == capture && !listener.removed) {
          var result = goog.events.fireListener(listener, eventObject), retval = retval && result !== false;
        }
      }
    }
  }
  return retval;
};
goog.events.fireListener = function(listener, eventObject) {
  var listenerFn = listener.listener, listenerHandler = listener.handler || listener.src;
  if (listener.callOnce) {
    goog.events.unlistenByKey(listener);
  }
  return listenerFn.call(listenerHandler, eventObject);
};
goog.events.getTotalListenerCount = function() {
  return goog.events.listenerCountEstimate_;
};
goog.events.dispatchEvent = function(src, e) {
  goog.asserts.assert(goog.events.Listenable.isImplementedBy(src), "Can not use goog.events.dispatchEvent with " + "non-goog.events.Listenable instance.");
  return src.dispatchEvent(e);
};
goog.events.protectBrowserEventEntryPoint = function(errorHandler) {
  goog.events.handleBrowserEvent_ = errorHandler.protectEntryPoint(goog.events.handleBrowserEvent_);
};
goog.events.handleBrowserEvent_ = function(listener, opt_evt) {
  if (listener.removed) {
    return true;
  }
  if (!goog.events.BrowserFeature.HAS_W3C_EVENT_SUPPORT) {
    var ieEvent = opt_evt || goog.getObjectByName("window.event"), evt = new goog.events.BrowserEvent(ieEvent, this), retval = true;
    if (goog.events.CAPTURE_SIMULATION_MODE == goog.events.CaptureSimulationMode.ON) {
      if (!goog.events.isMarkedIeEvent_(ieEvent)) {
        goog.events.markIeEvent_(ieEvent);
        for (var ancestors = [], parent = evt.currentTarget;parent;parent = parent.parentNode) {
          ancestors.push(parent);
        }
        for (var type = listener.type, i = ancestors.length - 1;!evt.propagationStopped_ && i >= 0;i--) {
          evt.currentTarget = ancestors[i];
          var result = goog.events.fireListeners_(ancestors[i], type, true, evt), retval = retval && result;
        }
        for (i = 0;!evt.propagationStopped_ && i < ancestors.length;i++) {
          evt.currentTarget = ancestors[i];
          result = goog.events.fireListeners_(ancestors[i], type, false, evt);
          retval = retval && result;
        }
      }
    } else {
      retval = goog.events.fireListener(listener, evt);
    }
    return retval;
  }
  return goog.events.fireListener(listener, new goog.events.BrowserEvent(opt_evt, this));
};
goog.events.markIeEvent_ = function(e) {
  var useReturnValue = false;
  if (e.keyCode == 0) {
    try {
      e.keyCode = -1;
      return;
    } catch (ex) {
      useReturnValue = true;
    }
  }
  if (useReturnValue || e.returnValue == undefined) {
    e.returnValue = true;
  }
};
goog.events.isMarkedIeEvent_ = function(e) {
  return e.keyCode < 0 || e.returnValue != undefined;
};
goog.events.uniqueIdCounter_ = 0;
goog.events.getUniqueId = function(identifier) {
  return identifier + "_" + goog.events.uniqueIdCounter_++;
};
goog.events.getListenerMap_ = function(src) {
  var listenerMap = src[goog.events.LISTENER_MAP_PROP_];
  return listenerMap instanceof goog.events.ListenerMap ? listenerMap : null;
};
goog.events.LISTENER_WRAPPER_PROP_ = "__closure_events_fn_" + (Math.random() * 1e9 >>> 0);
goog.events.wrapListener = function(listener) {
  goog.asserts.assert(listener, "Listener can not be null.");
  if (goog.isFunction(listener)) {
    return listener;
  }
  goog.asserts.assert(listener.handleEvent, "An object listener must have handleEvent method.");
  if (!listener[goog.events.LISTENER_WRAPPER_PROP_]) {
    listener[goog.events.LISTENER_WRAPPER_PROP_] = function(e) {
      return listener.handleEvent(e);
    };
  }
  return listener[goog.events.LISTENER_WRAPPER_PROP_];
};
goog.debug.entryPointRegistry.register(function(transformer) {
  goog.events.handleBrowserEvent_ = transformer(goog.events.handleBrowserEvent_);
});
goog.events.EventTarget = function() {
  goog.Disposable.call(this);
  this.eventTargetListeners_ = new goog.events.ListenerMap(this);
  this.actualEventTarget_ = this;
  this.parentEventTarget_ = null;
};
goog.inherits(goog.events.EventTarget, goog.Disposable);
goog.events.Listenable.addImplementation(goog.events.EventTarget);
goog.events.EventTarget.MAX_ANCESTORS_ = 1000;
goog.events.EventTarget.prototype.addEventListener = function(type, handler, opt_capture, opt_handlerScope) {
  goog.events.listen(this, type, handler, opt_capture, opt_handlerScope);
};
goog.events.EventTarget.prototype.removeEventListener = function(type, handler, opt_capture, opt_handlerScope) {
  goog.events.unlisten(this, type, handler, opt_capture, opt_handlerScope);
};
goog.events.EventTarget.prototype.dispatchEvent = function(e) {
  this.assertInitialized_();
  var ancestorsTree, ancestor = this.parentEventTarget_;
  if (ancestor) {
    ancestorsTree = [];
    for (var ancestorCount = 1;ancestor;ancestor = ancestor.parentEventTarget_) {
      ancestorsTree.push(ancestor);
      goog.asserts.assert(++ancestorCount < goog.events.EventTarget.MAX_ANCESTORS_, "infinite loop");
    }
  }
  return goog.events.EventTarget.dispatchEventInternal_(this.actualEventTarget_, e, ancestorsTree);
};
goog.events.EventTarget.prototype.disposeInternal = function() {
  goog.events.EventTarget.superClass_.disposeInternal.call(this);
  this.removeAllListeners();
  this.parentEventTarget_ = null;
};
goog.events.EventTarget.prototype.listen = function(type, listener, opt_useCapture, opt_listenerScope) {
  this.assertInitialized_();
  return this.eventTargetListeners_.add(String(type), listener, false, opt_useCapture, opt_listenerScope);
};
goog.events.EventTarget.prototype.listenOnce = function(type, listener, opt_useCapture, opt_listenerScope) {
  return this.eventTargetListeners_.add(String(type), listener, true, opt_useCapture, opt_listenerScope);
};
goog.events.EventTarget.prototype.unlisten = function(type, listener, opt_useCapture, opt_listenerScope) {
  return this.eventTargetListeners_.remove(String(type), listener, opt_useCapture, opt_listenerScope);
};
goog.events.EventTarget.prototype.unlistenByKey = function(key) {
  return this.eventTargetListeners_.removeByKey(key);
};
goog.events.EventTarget.prototype.removeAllListeners = function(opt_type) {
  if (!this.eventTargetListeners_) {
    return 0;
  }
  return this.eventTargetListeners_.removeAll(opt_type);
};
goog.events.EventTarget.prototype.fireListeners = function(type, capture, eventObject) {
  var listenerArray = this.eventTargetListeners_.listeners[String(type)];
  if (!listenerArray) {
    return true;
  }
  for (var listenerArray = listenerArray.concat(), rv = true, i = 0;i < listenerArray.length;++i) {
    var listener = listenerArray[i];
    if (listener && !listener.removed && listener.capture == capture) {
      var listenerFn = listener.listener, listenerHandler = listener.handler || listener.src;
      if (listener.callOnce) {
        this.unlistenByKey(listener);
      }
      rv = listenerFn.call(listenerHandler, eventObject) !== false && rv;
    }
  }
  return rv && eventObject.returnValue_ != false;
};
goog.events.EventTarget.prototype.getListeners = function(type, capture) {
  return this.eventTargetListeners_.getListeners(String(type), capture);
};
goog.events.EventTarget.prototype.getListener = function(type, listener, capture, opt_listenerScope) {
  return this.eventTargetListeners_.getListener(String(type), listener, capture, opt_listenerScope);
};
goog.events.EventTarget.prototype.hasListener = function(opt_type, opt_capture) {
  return this.eventTargetListeners_.hasListener(goog.isDef(opt_type) ? String(opt_type) : undefined, opt_capture);
};
goog.events.EventTarget.prototype.assertInitialized_ = function() {
  goog.asserts.assert(this.eventTargetListeners_, "Event target is not initialized. Did you call the superclass " + "(goog.events.EventTarget) constructor?");
};
goog.events.EventTarget.dispatchEventInternal_ = function(target, e, opt_ancestorsTree) {
  var type = e.type || e;
  if (goog.isString(e)) {
    e = new goog.events.Event(e, target);
  } else {
    if (!(e instanceof goog.events.Event)) {
      var oldEvent = e;
      e = new goog.events.Event(type, target);
      goog.object.extend(e, oldEvent);
    } else {
      e.target = e.target || target;
    }
  }
  var rv = true, currentTarget;
  if (opt_ancestorsTree) {
    for (var i = opt_ancestorsTree.length - 1;!e.propagationStopped_ && i >= 0;i--) {
      currentTarget = e.currentTarget = opt_ancestorsTree[i];
      rv = currentTarget.fireListeners(type, true, e) && rv;
    }
  }
  if (!e.propagationStopped_) {
    currentTarget = e.currentTarget = target;
    rv = currentTarget.fireListeners(type, true, e) && rv;
    if (!e.propagationStopped_) {
      rv = currentTarget.fireListeners(type, false, e) && rv;
    }
  }
  if (opt_ancestorsTree) {
    for (i = 0;!e.propagationStopped_ && i < opt_ancestorsTree.length;i++) {
      currentTarget = e.currentTarget = opt_ancestorsTree[i];
      rv = currentTarget.fireListeners(type, false, e) && rv;
    }
  }
  return rv;
};
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
  if (this.occupants_ > 0) {
    this.occupants_--;
    item = this.head_;
    this.head_ = item.next;
    item.next = null;
  } else {
    item = this.create_();
  }
  return item;
};
goog.async.FreeList.prototype.put = function(item) {
  this.reset_(item);
  if (this.occupants_ < this.limit_) {
    this.occupants_++;
    item.next = this.head_;
    this.head_ = item;
  }
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
goog.async.throwException = function(exception) {
  goog.global.setTimeout(function() {
    throw exception;
  }, 0);
};
goog.async.nextTick = function(callback, opt_context, opt_useSetImmediate) {
  var cb = callback;
  if (opt_context) {
    cb = goog.bind(callback, opt_context);
  }
  cb = goog.async.nextTick.wrapCallback_(cb);
  if (goog.isFunction(goog.global.setImmediate) && (opt_useSetImmediate || goog.async.nextTick.useSetImmediate_())) {
    goog.global.setImmediate(cb);
    return;
  }
  if (!goog.async.nextTick.setImmediate_) {
    goog.async.nextTick.setImmediate_ = goog.async.nextTick.getSetImmediateEmulator_();
  }
  goog.async.nextTick.setImmediate_(cb);
};
goog.async.nextTick.useSetImmediate_ = function() {
  if (!goog.global.Window || !goog.global.Window.prototype) {
    return true;
  }
  if (goog.labs.userAgent.browser.isEdge() || goog.global.Window.prototype.setImmediate != goog.global.setImmediate) {
    return true;
  }
  return false;
};
goog.async.nextTick.getSetImmediateEmulator_ = function() {
  var Channel = goog.global.MessageChannel;
  if (typeof Channel === "undefined" && typeof window !== "undefined" && window.postMessage && window.addEventListener && !goog.labs.userAgent.engine.isPresto()) {
    Channel = function() {
      var iframe = document.createElement(String("IFRAME"));
      iframe.style.display = "none";
      iframe.src = "";
      document.documentElement.appendChild(iframe);
      var win = iframe.contentWindow, doc = win.document;
      doc.open();
      doc.write("");
      doc.close();
      var message = "callImmediate" + Math.random(), origin = win.location.protocol == "file:" ? "*" : win.location.protocol + "//" + win.location.host, onmessage = goog.bind(function(e) {
        if (origin != "*" && e.origin != origin || e.data != message) {
          return;
        }
        this.port1.onmessage();
      }, this);
      win.addEventListener("message", onmessage, false);
      this.port1 = {};
      this.port2 = {postMessage:function() {
        win.postMessage(message, origin);
      }};
    };
  }
  if (typeof Channel !== "undefined" && !goog.labs.userAgent.browser.isIE()) {
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
  if (typeof document !== "undefined" && "onreadystatechange" in document.createElement(String("SCRIPT"))) {
    return function(cb) {
      var script = document.createElement(String("SCRIPT"));
      script.onreadystatechange = function() {
        script.onreadystatechange = null;
        script.parentNode.removeChild(script);
        script = null;
        cb();
        cb = null;
      };
      document.documentElement.appendChild(script);
    };
  }
  return function(cb) {
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
  if (this.workTail_) {
    this.workTail_ = this.workTail_.next = item;
  } else {
    goog.asserts.assert(!this.workHead_);
    this.workTail_ = this.workHead_ = item;
  }
};
goog.async.WorkQueue.prototype.remove = function() {
  var item = null;
  if (this.workHead_) {
    item = this.workHead_;
    this.workHead_ = this.workHead_.next;
    if (!this.workHead_) {
      this.workTail_ = null;
    }
    item.next = null;
  }
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
  if (!goog.async.run.schedule_) {
    goog.async.run.initializeRunner_();
  }
  if (!goog.async.run.workQueueScheduled_) {
    goog.async.run.schedule_();
    goog.async.run.workQueueScheduled_ = true;
  }
  goog.async.run.workQueue_.add(callback, opt_context);
};
goog.async.run.initializeRunner_ = function() {
  if (String(goog.global.Promise).indexOf("[native code]") != -1) {
    var promise = goog.global.Promise.resolve(undefined);
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
    if (opt_realSetTimeout) {
      opt_realSetTimeout(goog.async.run.processWorkQueue);
    }
  };
};
goog.async.run.workQueueScheduled_ = false;
goog.async.run.workQueue_ = new goog.async.WorkQueue;
if (goog.DEBUG) {
  goog.async.run.resetQueue = function() {
    goog.async.run.workQueueScheduled_ = false;
    goog.async.run.workQueue_ = new goog.async.WorkQueue;
  };
}
goog.async.run.processWorkQueue = function() {
  for (var item;item = goog.async.run.workQueue_.remove();) {
    try {
      item.fn.call(item.scope);
    } catch (e) {
      goog.async.throwException(e);
    }
    goog.async.run.workQueue_.returnUnused(item);
  }
  goog.async.run.workQueueScheduled_ = false;
};
goog.promise = {};
goog.promise.Resolver = function() {
};
goog.Thenable = function() {
};
goog.Thenable.prototype.then = function() {
};
goog.Thenable.IMPLEMENTED_BY_PROP = "$goog_Thenable";
goog.Thenable.addImplementation = function(ctor) {
  ctor.prototype.then = ctor.prototype.then;
  if (true) {
    ctor.prototype[goog.Thenable.IMPLEMENTED_BY_PROP] = true;
  } else {
    ctor.prototype.$goog_Thenable = true;
  }
};
goog.Thenable.isImplementedBy = function(object) {
  if (!object) {
    return false;
  }
  try {
    if (true) {
      return !!object[goog.Thenable.IMPLEMENTED_BY_PROP];
    }
    return !!object.$goog_Thenable;
  } catch (e) {
    return false;
  }
};
goog.Promise = function(resolver, opt_context) {
  this.state_ = goog.Promise.State_.PENDING;
  this.result_ = undefined;
  this.callbackEntriesTail_ = this.callbackEntries_ = this.parent_ = null;
  this.executing_ = false;
  if (goog.Promise.UNHANDLED_REJECTION_DELAY > 0) {
    this.unhandledRejectionId_ = 0;
  } else {
    if (goog.Promise.UNHANDLED_REJECTION_DELAY == 0) {
      this.hadUnhandledRejection_ = false;
    }
  }
  if (goog.Promise.LONG_STACK_TRACES) {
    this.stack_ = [];
    this.addStackTrace_(new Error("created"));
    this.currentStep_ = 0;
  }
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
            } else {
              throw new Error("Promise rejected.");
            }
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
goog.Promise.LONG_STACK_TRACES = false;
goog.Promise.UNHANDLED_REJECTION_DELAY = 0;
goog.Promise.State_ = {PENDING:0, BLOCKED:1, FULFILLED:2, REJECTED:3};
goog.Promise.CallbackEntry_ = function() {
  this.next = this.context = this.onRejected = this.onFulfilled = this.child = null;
  this.always = false;
};
goog.Promise.CallbackEntry_.prototype.reset = function() {
  this.context = this.onRejected = this.onFulfilled = this.child = null;
  this.always = false;
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
  if (!goog.Promise.maybeThen_(value, onFulfilled, onRejected, null)) {
    goog.async.run(goog.partial(onFulfilled, value));
  }
};
goog.Promise.race = function(promises) {
  return new goog.Promise(function(resolve, reject) {
    if (!promises.length) {
      resolve(undefined);
    }
    for (var i = 0, promise;i < promises.length;i++) {
      promise = promises[i];
      goog.Promise.resolveThen_(promise, resolve, reject);
    }
  });
};
goog.Promise.all = function(promises) {
  return new goog.Promise(function(resolve, reject) {
    var toFulfill = promises.length, values = [];
    if (!toFulfill) {
      resolve(values);
      return;
    }
    for (var onFulfill = function(index, value) {
      toFulfill--;
      values[index] = value;
      if (toFulfill == 0) {
        resolve(values);
      }
    }, onReject = function(reason) {
      reject(reason);
    }, i = 0, promise;i < promises.length;i++) {
      promise = promises[i];
      goog.Promise.resolveThen_(promise, goog.partial(onFulfill, i), onReject);
    }
  });
};
goog.Promise.allSettled = function(promises) {
  return new goog.Promise(function(resolve) {
    var toSettle = promises.length, results = [];
    if (!toSettle) {
      resolve(results);
      return;
    }
    for (var onSettled = function(index, fulfilled, result) {
      toSettle--;
      results[index] = fulfilled ? {fulfilled:true, value:result} : {fulfilled:false, reason:result};
      if (toSettle == 0) {
        resolve(results);
      }
    }, i = 0, promise;i < promises.length;i++) {
      promise = promises[i];
      goog.Promise.resolveThen_(promise, goog.partial(onSettled, i, true), goog.partial(onSettled, i, false));
    }
  });
};
goog.Promise.firstFulfilled = function(promises) {
  return new goog.Promise(function(resolve, reject) {
    var toReject = promises.length, reasons = [];
    if (!toReject) {
      resolve(undefined);
      return;
    }
    for (var onFulfill = function(value) {
      resolve(value);
    }, onReject = function(index, reason) {
      toReject--;
      reasons[index] = reason;
      if (toReject == 0) {
        reject(reasons);
      }
    }, i = 0, promise;i < promises.length;i++) {
      promise = promises[i];
      goog.Promise.resolveThen_(promise, onFulfill, goog.partial(onReject, i));
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
  if (opt_onFulfilled != null) {
    goog.asserts.assertFunction(opt_onFulfilled, "opt_onFulfilled should be a function.");
  }
  if (opt_onRejected != null) {
    goog.asserts.assertFunction(opt_onRejected, "opt_onRejected should be a function. Did you pass opt_context " + "as the second argument instead of the third?");
  }
  if (goog.Promise.LONG_STACK_TRACES) {
    this.addStackTrace_(new Error("then"));
  }
  return this.addChildPromise_(goog.isFunction(opt_onFulfilled) ? opt_onFulfilled : null, goog.isFunction(opt_onRejected) ? opt_onRejected : null, opt_context);
};
goog.Thenable.addImplementation(goog.Promise);
goog.Promise.prototype.thenVoid = function(opt_onFulfilled, opt_onRejected, opt_context) {
  if (opt_onFulfilled != null) {
    goog.asserts.assertFunction(opt_onFulfilled, "opt_onFulfilled should be a function.");
  }
  if (opt_onRejected != null) {
    goog.asserts.assertFunction(opt_onRejected, "opt_onRejected should be a function. Did you pass opt_context " + "as the second argument instead of the third?");
  }
  if (goog.Promise.LONG_STACK_TRACES) {
    this.addStackTrace_(new Error("then"));
  }
  this.addCallbackEntry_(goog.Promise.getCallbackEntry_(opt_onFulfilled || goog.nullFunction, opt_onRejected || null, opt_context));
};
goog.Promise.prototype.thenCatch = function(onRejected, opt_context) {
  if (goog.Promise.LONG_STACK_TRACES) {
    this.addStackTrace_(new Error("thenCatch"));
  }
  return this.addChildPromise_(null, onRejected, opt_context);
};
goog.Promise.prototype.cancel = function(opt_message) {
  if (this.state_ == goog.Promise.State_.PENDING) {
    goog.async.run(function() {
      var err = new goog.Promise.CancellationError(opt_message);
      this.cancelInternal_(err);
    }, this);
  }
};
goog.Promise.prototype.cancelInternal_ = function(err) {
  if (this.state_ == goog.Promise.State_.PENDING) {
    if (this.parent_) {
      this.parent_.cancelChild_(this, err);
      this.parent_ = null;
    } else {
      this.resolve_(goog.Promise.State_.REJECTED, err);
    }
  }
};
goog.Promise.prototype.cancelChild_ = function(childPromise, err) {
  if (!this.callbackEntries_) {
    return;
  }
  for (var childCount = 0, childEntry = null, beforeChildEntry = null, entry = this.callbackEntries_;entry;entry = entry.next) {
    if (!entry.always) {
      childCount++;
      if (entry.child == childPromise) {
        childEntry = entry;
      }
      if (childEntry && childCount > 1) {
        break;
      }
    }
    if (!childEntry) {
      beforeChildEntry = entry;
    }
  }
  if (childEntry) {
    if (this.state_ == goog.Promise.State_.PENDING && childCount == 1) {
      this.cancelInternal_(err);
    } else {
      if (beforeChildEntry) {
        this.removeEntryAfter_(beforeChildEntry);
      } else {
        this.popEntry_();
      }
      this.executeCallback_(childEntry, goog.Promise.State_.REJECTED, err);
    }
  }
};
goog.Promise.prototype.addCallbackEntry_ = function(callbackEntry) {
  if (!this.hasEntry_() && (this.state_ == goog.Promise.State_.FULFILLED || this.state_ == goog.Promise.State_.REJECTED)) {
    this.scheduleCallbacks_();
  }
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
        if (!goog.isDef(result) && reason instanceof goog.Promise.CancellationError) {
          reject(reason);
        } else {
          resolve(result);
        }
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
  if (this.state_ != goog.Promise.State_.PENDING) {
    return;
  }
  if (this === x) {
    state = goog.Promise.State_.REJECTED;
    x = new TypeError("Promise cannot resolve to itself");
  }
  this.state_ = goog.Promise.State_.BLOCKED;
  if (goog.Promise.maybeThen_(x, this.unblockAndFulfill_, this.unblockAndReject_, this)) {
    return;
  }
  this.result_ = x;
  this.state_ = state;
  this.parent_ = null;
  this.scheduleCallbacks_();
  if (state == goog.Promise.State_.REJECTED && !(x instanceof goog.Promise.CancellationError)) {
    goog.Promise.addUnhandledRejection_(this, x);
  }
};
goog.Promise.maybeThen_ = function(value, onFulfilled, onRejected, context) {
  if (value instanceof goog.Promise) {
    value.thenVoid(onFulfilled, onRejected, context);
    return true;
  } else {
    if (goog.Thenable.isImplementedBy(value)) {
      value.then(onFulfilled, onRejected, context);
      return true;
    } else {
      if (goog.isObject(value)) {
        try {
          var then = value.then;
          if (goog.isFunction(then)) {
            goog.Promise.tryThen_(value, then, onFulfilled, onRejected, context);
            return true;
          }
        } catch (e) {
          onRejected.call(context, e);
          return true;
        }
      }
    }
  }
  return false;
};
goog.Promise.tryThen_ = function(thenable, then, onFulfilled, onRejected, context) {
  var called = false, resolve = function(value) {
    if (!called) {
      called = true;
      onFulfilled.call(context, value);
    }
  }, reject = function(reason) {
    if (!called) {
      called = true;
      onRejected.call(context, reason);
    }
  };
  try {
    then.call(thenable, resolve, reject);
  } catch (e) {
    reject(e);
  }
};
goog.Promise.prototype.scheduleCallbacks_ = function() {
  if (!this.executing_) {
    this.executing_ = true;
    goog.async.run(this.executeCallbacks_, this);
  }
};
goog.Promise.prototype.hasEntry_ = function() {
  return !!this.callbackEntries_;
};
goog.Promise.prototype.queueEntry_ = function(entry) {
  goog.asserts.assert(entry.onFulfilled != null);
  if (this.callbackEntriesTail_) {
    this.callbackEntriesTail_ = this.callbackEntriesTail_.next = entry;
  } else {
    this.callbackEntriesTail_ = this.callbackEntries_ = entry;
  }
};
goog.Promise.prototype.popEntry_ = function() {
  var entry = null;
  if (this.callbackEntries_) {
    entry = this.callbackEntries_;
    this.callbackEntries_ = entry.next;
    entry.next = null;
  }
  if (!this.callbackEntries_) {
    this.callbackEntriesTail_ = null;
  }
  if (entry != null) {
    goog.asserts.assert(entry.onFulfilled != null);
  }
  return entry;
};
goog.Promise.prototype.removeEntryAfter_ = function(previous) {
  goog.asserts.assert(this.callbackEntries_);
  goog.asserts.assert(previous != null);
  if (previous.next == this.callbackEntriesTail_) {
    this.callbackEntriesTail_ = previous;
  }
  previous.next = previous.next.next;
};
goog.Promise.prototype.executeCallbacks_ = function() {
  for (var entry;entry = this.popEntry_();) {
    if (goog.Promise.LONG_STACK_TRACES) {
      this.currentStep_++;
    }
    this.executeCallback_(entry, this.state_, this.result_);
  }
  this.executing_ = false;
};
goog.Promise.prototype.executeCallback_ = function(callbackEntry, state, result) {
  if (state == goog.Promise.State_.REJECTED && callbackEntry.onRejected && !callbackEntry.always) {
    this.removeUnhandledRejection_();
  }
  if (callbackEntry.child) {
    callbackEntry.child.parent_ = null;
    goog.Promise.invokeCallback_(callbackEntry, state, result);
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
  if (state == goog.Promise.State_.FULFILLED) {
    callbackEntry.onFulfilled.call(callbackEntry.context, result);
  } else {
    if (callbackEntry.onRejected) {
      callbackEntry.onRejected.call(callbackEntry.context, result);
    }
  }
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
      for (var i = this.currentStep_;i >= 0;i--) {
        longTrace.push(promise.stack_[i]);
      }
      longTrace.push("Value: " + "[" + (promise.state_ == goog.Promise.State_.REJECTED ? "REJECTED" : "FULFILLED") + "] " + "<" + String(promise.result_) + ">");
    }
    err.stack += "\n\n" + longTrace.join("\n");
  }
};
goog.Promise.prototype.removeUnhandledRejection_ = function() {
  if (goog.Promise.UNHANDLED_REJECTION_DELAY > 0) {
    for (var p = this;p && p.unhandledRejectionId_;p = p.parent_) {
      goog.global.clearTimeout(p.unhandledRejectionId_);
      p.unhandledRejectionId_ = 0;
    }
  } else {
    if (goog.Promise.UNHANDLED_REJECTION_DELAY == 0) {
      for (p = this;p && p.hadUnhandledRejection_;p = p.parent_) {
        p.hadUnhandledRejection_ = false;
      }
    }
  }
};
goog.Promise.addUnhandledRejection_ = function(promise, reason) {
  if (goog.Promise.UNHANDLED_REJECTION_DELAY > 0) {
    promise.unhandledRejectionId_ = goog.global.setTimeout(function() {
      promise.appendLongStack_(reason);
      goog.Promise.handleRejection_.call(null, reason);
    }, goog.Promise.UNHANDLED_REJECTION_DELAY);
  } else {
    if (goog.Promise.UNHANDLED_REJECTION_DELAY == 0) {
      promise.hadUnhandledRejection_ = true;
      goog.async.run(function() {
        if (promise.hadUnhandledRejection_) {
          promise.appendLongStack_(reason);
          goog.Promise.handleRejection_.call(null, reason);
        }
      });
    }
  }
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
goog.Timer = function(opt_interval, opt_timerObject) {
  goog.events.EventTarget.call(this);
  this.interval_ = opt_interval || 1;
  this.timerObject_ = opt_timerObject || goog.Timer.defaultTimerObject;
  this.boundTick_ = goog.bind(this.tick_, this);
  this.last_ = goog.now();
};
goog.inherits(goog.Timer, goog.events.EventTarget);
goog.Timer.MAX_TIMEOUT_ = 2147483647;
goog.Timer.INVALID_TIMEOUT_ID_ = -1;
goog.Timer.prototype.enabled = false;
goog.Timer.defaultTimerObject = goog.global;
goog.Timer.intervalScale = 0.8;
goog.Timer.prototype.timer_ = null;
goog.Timer.prototype.setInterval = function(interval) {
  this.interval_ = interval;
  if (this.timer_ && this.enabled) {
    this.stop();
    this.start();
  } else {
    if (this.timer_) {
      this.stop();
    }
  }
};
goog.Timer.prototype.tick_ = function() {
  if (this.enabled) {
    var elapsed = goog.now() - this.last_;
    if (elapsed > 0 && elapsed < this.interval_ * goog.Timer.intervalScale) {
      this.timer_ = this.timerObject_.setTimeout(this.boundTick_, this.interval_ - elapsed);
      return;
    }
    if (this.timer_) {
      this.timerObject_.clearTimeout(this.timer_);
      this.timer_ = null;
    }
    this.dispatchTick();
    if (this.enabled) {
      this.timer_ = this.timerObject_.setTimeout(this.boundTick_, this.interval_);
      this.last_ = goog.now();
    }
  }
};
goog.Timer.prototype.dispatchTick = function() {
  this.dispatchEvent(goog.Timer.TICK);
};
goog.Timer.prototype.start = function() {
  this.enabled = true;
  if (!this.timer_) {
    this.timer_ = this.timerObject_.setTimeout(this.boundTick_, this.interval_);
    this.last_ = goog.now();
  }
};
goog.Timer.prototype.stop = function() {
  this.enabled = false;
  if (this.timer_) {
    this.timerObject_.clearTimeout(this.timer_);
    this.timer_ = null;
  }
};
goog.Timer.prototype.disposeInternal = function() {
  goog.Timer.superClass_.disposeInternal.call(this);
  this.stop();
  delete this.timerObject_;
};
goog.Timer.TICK = "tick";
goog.Timer.callOnce = function(listener, opt_delay, opt_handler) {
  if (goog.isFunction(listener)) {
    if (opt_handler) {
      listener = goog.bind(listener, opt_handler);
    }
  } else {
    if (listener && typeof listener.handleEvent == "function") {
      listener = goog.bind(listener.handleEvent, listener);
    } else {
      throw Error("Invalid listener argument");
    }
  }
  if (Number(opt_delay) > goog.Timer.MAX_TIMEOUT_) {
    return goog.Timer.INVALID_TIMEOUT_ID_;
  } else {
    return goog.Timer.defaultTimerObject.setTimeout(listener, opt_delay || 0);
  }
};
goog.Timer.clear = function(timerId) {
  goog.Timer.defaultTimerObject.clearTimeout(timerId);
};
goog.Timer.promise = function(delay, opt_result) {
  var timerKey = null;
  return (new goog.Promise(function(resolve, reject) {
    timerKey = goog.Timer.callOnce(function() {
      resolve(opt_result);
    }, delay);
    if (timerKey == goog.Timer.INVALID_TIMEOUT_ID_) {
      reject(new Error("Failed to schedule timer."));
    }
  })).thenCatch(function(error) {
    goog.Timer.clear(timerKey);
    throw error;
  });
};
goog.async.Throttle = function(listener, interval, opt_handler) {
  goog.Disposable.call(this);
  this.listener_ = opt_handler != null ? goog.bind(listener, opt_handler) : listener;
  this.interval_ = interval;
  this.callback_ = goog.bind(this.onTimer_, this);
  this.args_ = [];
};
goog.inherits(goog.async.Throttle, goog.Disposable);
goog.Throttle = goog.async.Throttle;
goog.async.Throttle.prototype.shouldFire_ = false;
goog.async.Throttle.prototype.pauseCount_ = 0;
goog.async.Throttle.prototype.timer_ = null;
goog.async.Throttle.prototype.fire = function(var_args) {
  this.args_ = arguments;
  if (!this.timer_ && !this.pauseCount_) {
    this.doAction_();
  } else {
    this.shouldFire_ = true;
  }
};
goog.async.Throttle.prototype.stop = function() {
  if (this.timer_) {
    goog.Timer.clear(this.timer_);
    this.timer_ = null;
    this.shouldFire_ = false;
    this.args_ = [];
  }
};
goog.async.Throttle.prototype.pause = function() {
  this.pauseCount_++;
};
goog.async.Throttle.prototype.resume = function() {
  this.pauseCount_--;
  if (!this.pauseCount_ && this.shouldFire_ && !this.timer_) {
    this.shouldFire_ = false;
    this.doAction_();
  }
};
goog.async.Throttle.prototype.disposeInternal = function() {
  goog.async.Throttle.superClass_.disposeInternal.call(this);
  this.stop();
};
goog.async.Throttle.prototype.onTimer_ = function() {
  this.timer_ = null;
  if (this.shouldFire_ && !this.pauseCount_) {
    this.shouldFire_ = false;
    this.doAction_();
  }
};
goog.async.Throttle.prototype.doAction_ = function() {
  this.timer_ = goog.Timer.callOnce(this.callback_, this.interval_);
  this.listener_.apply(null, this.args_);
};
goog.userAgent.product = {};
goog.userAgent.product.ASSUME_FIREFOX = false;
goog.userAgent.product.ASSUME_IPHONE = false;
goog.userAgent.product.ASSUME_IPAD = false;
goog.userAgent.product.ASSUME_ANDROID = false;
goog.userAgent.product.ASSUME_CHROME = false;
goog.userAgent.product.ASSUME_SAFARI = false;
goog.userAgent.product.PRODUCT_KNOWN_ = goog.userAgent.ASSUME_IE || goog.userAgent.ASSUME_EDGE || goog.userAgent.ASSUME_OPERA || goog.userAgent.product.ASSUME_FIREFOX || goog.userAgent.product.ASSUME_IPHONE || goog.userAgent.product.ASSUME_IPAD || goog.userAgent.product.ASSUME_ANDROID || goog.userAgent.product.ASSUME_CHROME || goog.userAgent.product.ASSUME_SAFARI;
goog.userAgent.product.OPERA = goog.userAgent.OPERA;
goog.userAgent.product.IE = goog.userAgent.IE;
goog.userAgent.product.EDGE = goog.userAgent.EDGE;
goog.userAgent.product.FIREFOX = goog.userAgent.product.PRODUCT_KNOWN_ ? goog.userAgent.product.ASSUME_FIREFOX : goog.labs.userAgent.browser.isFirefox();
goog.userAgent.product.isIphoneOrIpod_ = function() {
  return goog.labs.userAgent.platform.isIphone() || goog.labs.userAgent.platform.isIpod();
};
goog.userAgent.product.IPHONE = goog.userAgent.product.PRODUCT_KNOWN_ ? goog.userAgent.product.ASSUME_IPHONE : goog.userAgent.product.isIphoneOrIpod_();
goog.userAgent.product.IPAD = goog.userAgent.product.PRODUCT_KNOWN_ ? goog.userAgent.product.ASSUME_IPAD : goog.labs.userAgent.platform.isIpad();
goog.userAgent.product.ANDROID = goog.userAgent.product.PRODUCT_KNOWN_ ? goog.userAgent.product.ASSUME_ANDROID : goog.labs.userAgent.browser.isAndroidBrowser();
goog.userAgent.product.CHROME = goog.userAgent.product.PRODUCT_KNOWN_ ? goog.userAgent.product.ASSUME_CHROME : goog.labs.userAgent.browser.isChrome();
goog.userAgent.product.isSafariDesktop_ = function() {
  return goog.labs.userAgent.browser.isSafari() && !goog.labs.userAgent.platform.isIos();
};
goog.userAgent.product.SAFARI = goog.userAgent.product.PRODUCT_KNOWN_ ? goog.userAgent.product.ASSUME_SAFARI : goog.userAgent.product.isSafariDesktop_();
goog.crypt = {};
goog.crypt.stringToByteArray = function(str) {
  for (var output = [], p = 0, i = 0;i < str.length;i++) {
    for (var c = str.charCodeAt(i);c > 255;) {
      output[p++] = c & 255;
      c >>= 8;
    }
    output[p++] = c;
  }
  return output;
};
goog.crypt.byteArrayToString = function(bytes) {
  if (bytes.length <= 8192) {
    return String.fromCharCode.apply(null, bytes);
  }
  for (var str = "", i = 0;i < bytes.length;i += 8192) {
    var chunk = goog.array.slice(bytes, i, i + 8192), str = str + String.fromCharCode.apply(null, chunk);
  }
  return str;
};
goog.crypt.byteArrayToHex = function(array) {
  return goog.array.map(array, function(numByte) {
    var hexByte = numByte.toString(16);
    return hexByte.length > 1 ? hexByte : "0" + hexByte;
  }).join("");
};
goog.crypt.hexToByteArray = function(hexString) {
  goog.asserts.assert(hexString.length % 2 == 0, "Key string length must be multiple of 2");
  for (var arr = [], i = 0;i < hexString.length;i += 2) {
    arr.push(parseInt(hexString.substring(i, i + 2), 16));
  }
  return arr;
};
goog.crypt.stringToUtf8ByteArray = function(str) {
  for (var out = [], p = 0, i = 0;i < str.length;i++) {
    var c = str.charCodeAt(i);
    if (c < 128) {
      out[p++] = c;
    } else {
      if (c < 2048) {
        out[p++] = c >> 6 | 192;
        out[p++] = c & 63 | 128;
      } else {
        if ((c & 64512) == 55296 && i + 1 < str.length && (str.charCodeAt(i + 1) & 64512) == 56320) {
          c = 65536 + ((c & 1023) << 10) + (str.charCodeAt(++i) & 1023);
          out[p++] = c >> 18 | 240;
          out[p++] = c >> 12 & 63 | 128;
          out[p++] = c >> 6 & 63 | 128;
          out[p++] = c & 63 | 128;
        } else {
          out[p++] = c >> 12 | 224;
          out[p++] = c >> 6 & 63 | 128;
          out[p++] = c & 63 | 128;
        }
      }
    }
  }
  return out;
};
goog.crypt.utf8ByteArrayToString = function(bytes) {
  for (var out = [], pos = 0, c = 0;pos < bytes.length;) {
    var c1 = bytes[pos++];
    if (c1 < 128) {
      out[c++] = String.fromCharCode(c1);
    } else {
      if (c1 > 191 && c1 < 224) {
        var c2 = bytes[pos++];
        out[c++] = String.fromCharCode((c1 & 31) << 6 | c2 & 63);
      } else {
        if (c1 > 239 && c1 < 365) {
          var c2 = bytes[pos++], c3 = bytes[pos++], c4 = bytes[pos++], u = ((c1 & 7) << 18 | (c2 & 63) << 12 | (c3 & 63) << 6 | c4 & 63) - 65536;
          out[c++] = String.fromCharCode(55296 + (u >> 10));
          out[c++] = String.fromCharCode(56320 + (u & 1023));
        } else {
          c2 = bytes[pos++];
          c3 = bytes[pos++];
          out[c++] = String.fromCharCode((c1 & 15) << 12 | (c2 & 63) << 6 | c3 & 63);
        }
      }
    }
  }
  return out.join("");
};
goog.crypt.xorByteArray = function(bytes1, bytes2) {
  goog.asserts.assert(bytes1.length == bytes2.length, "XOR array lengths must match");
  for (var result = [], i = 0;i < bytes1.length;i++) {
    result.push(bytes1[i] ^ bytes2[i]);
  }
  return result;
};
goog.crypt.base64 = {};
goog.crypt.base64.byteToCharMap_ = null;
goog.crypt.base64.charToByteMap_ = null;
goog.crypt.base64.byteToCharMapWebSafe_ = null;
goog.crypt.base64.ENCODED_VALS_BASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ" + "abcdefghijklmnopqrstuvwxyz" + "0123456789";
goog.crypt.base64.ENCODED_VALS = goog.crypt.base64.ENCODED_VALS_BASE + "+/=";
goog.crypt.base64.ENCODED_VALS_WEBSAFE = goog.crypt.base64.ENCODED_VALS_BASE + "-_.";
goog.crypt.base64.ASSUME_NATIVE_SUPPORT_ = goog.userAgent.GECKO || goog.userAgent.WEBKIT && !goog.userAgent.product.SAFARI || goog.userAgent.OPERA;
goog.crypt.base64.HAS_NATIVE_ENCODE_ = goog.crypt.base64.ASSUME_NATIVE_SUPPORT_ || typeof goog.global.btoa == "function";
goog.crypt.base64.HAS_NATIVE_DECODE_ = goog.crypt.base64.ASSUME_NATIVE_SUPPORT_ || !goog.userAgent.product.SAFARI && !goog.userAgent.IE && typeof goog.global.atob == "function";
goog.crypt.base64.encodeByteArray = function(input, opt_webSafe) {
  goog.asserts.assert(goog.isArrayLike(input), "encodeByteArray takes an array as a parameter");
  goog.crypt.base64.init_();
  for (var byteToCharMap = opt_webSafe ? goog.crypt.base64.byteToCharMapWebSafe_ : goog.crypt.base64.byteToCharMap_, output = [], i = 0;i < input.length;i += 3) {
    var byte1 = input[i], haveByte2 = i + 1 < input.length, byte2 = haveByte2 ? input[i + 1] : 0, haveByte3 = i + 2 < input.length, byte3 = haveByte3 ? input[i + 2] : 0, outByte1 = byte1 >> 2, outByte2 = (byte1 & 3) << 4 | byte2 >> 4, outByte3 = (byte2 & 15) << 2 | byte3 >> 6, outByte4 = byte3 & 63;
    if (!haveByte3) {
      outByte4 = 64;
      if (!haveByte2) {
        outByte3 = 64;
      }
    }
    output.push(byteToCharMap[outByte1], byteToCharMap[outByte2], byteToCharMap[outByte3], byteToCharMap[outByte4]);
  }
  return output.join("");
};
goog.crypt.base64.encodeString = function(input, opt_webSafe) {
  if (goog.crypt.base64.HAS_NATIVE_ENCODE_ && !opt_webSafe) {
    return goog.global.btoa(input);
  }
  return goog.crypt.base64.encodeByteArray(goog.crypt.stringToByteArray(input), opt_webSafe);
};
goog.crypt.base64.decodeString = function(input, opt_webSafe) {
  if (goog.crypt.base64.HAS_NATIVE_DECODE_ && !opt_webSafe) {
    return goog.global.atob(input);
  }
  var output = "";
  goog.crypt.base64.decodeStringInternal_(input, function(b) {
    output += String.fromCharCode(b);
  });
  return output;
};
goog.crypt.base64.decodeStringToByteArray = function(input) {
  var output = [];
  goog.crypt.base64.decodeStringInternal_(input, function(b) {
    output.push(b);
  });
  return output;
};
goog.crypt.base64.decodeStringToUint8Array = function(input) {
  goog.asserts.assert(!goog.userAgent.IE || goog.userAgent.isVersionOrHigher("10"), "Browser does not support typed arrays");
  var output = new Uint8Array(Math.ceil(input.length * 3 / 4)), outLen = 0;
  goog.crypt.base64.decodeStringInternal_(input, function(b) {
    output[outLen++] = b;
  });
  return output.subarray(0, outLen);
};
goog.crypt.base64.decodeStringInternal_ = function(input, pushByte) {
  function getByte(default_val) {
    for (;nextCharIndex < input.length;) {
      var ch = input.charAt(nextCharIndex++), b = goog.crypt.base64.charToByteMap_[ch];
      if (b != null) {
        return b;
      }
      if (!goog.string.isEmptyOrWhitespace(ch)) {
        throw Error("Unknown base64 encoding at char: " + ch);
      }
    }
    return default_val;
  }
  goog.crypt.base64.init_();
  for (var nextCharIndex = 0;true;) {
    var byte1 = getByte(-1), byte2 = getByte(0), byte3 = getByte(64), byte4 = getByte(64);
    if (byte4 === 64) {
      if (byte1 === -1) {
        return;
      }
    }
    pushByte(byte1 << 2 | byte2 >> 4);
    if (byte3 != 64) {
      pushByte(byte2 << 4 & 240 | byte3 >> 2);
      if (byte4 != 64) {
        pushByte(byte3 << 6 & 192 | byte4);
      }
    }
  }
};
goog.crypt.base64.init_ = function() {
  if (!goog.crypt.base64.byteToCharMap_) {
    goog.crypt.base64.byteToCharMap_ = {};
    goog.crypt.base64.charToByteMap_ = {};
    goog.crypt.base64.byteToCharMapWebSafe_ = {};
    for (var i = 0;i < goog.crypt.base64.ENCODED_VALS.length;i++) {
      goog.crypt.base64.byteToCharMap_[i] = goog.crypt.base64.ENCODED_VALS.charAt(i);
      goog.crypt.base64.charToByteMap_[goog.crypt.base64.byteToCharMap_[i]] = i;
      goog.crypt.base64.byteToCharMapWebSafe_[i] = goog.crypt.base64.ENCODED_VALS_WEBSAFE.charAt(i);
      if (i >= goog.crypt.base64.ENCODED_VALS_BASE.length) {
        goog.crypt.base64.charToByteMap_[goog.crypt.base64.ENCODED_VALS_WEBSAFE.charAt(i)] = i;
      }
    }
  }
};
goog.structs.Collection = function() {
};
goog.structs.getCount = function(col) {
  if (col.getCount && typeof col.getCount == "function") {
    return col.getCount();
  }
  if (goog.isArrayLike(col) || goog.isString(col)) {
    return col.length;
  }
  return goog.object.getCount(col);
};
goog.structs.getValues = function(col) {
  if (col.getValues && typeof col.getValues == "function") {
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
  if (col.getKeys && typeof col.getKeys == "function") {
    return col.getKeys();
  }
  if (col.getValues && typeof col.getValues == "function") {
    return undefined;
  }
  if (goog.isArrayLike(col) || goog.isString(col)) {
    for (var rv = [], l = col.length, i = 0;i < l;i++) {
      rv.push(i);
    }
    return rv;
  }
  return goog.object.getKeys(col);
};
goog.structs.contains = function(col, val) {
  if (col.contains && typeof col.contains == "function") {
    return col.contains(val);
  }
  if (col.containsValue && typeof col.containsValue == "function") {
    return col.containsValue(val);
  }
  if (goog.isArrayLike(col) || goog.isString(col)) {
    return goog.array.contains(col, val);
  }
  return goog.object.containsValue(col, val);
};
goog.structs.isEmpty = function(col) {
  if (col.isEmpty && typeof col.isEmpty == "function") {
    return col.isEmpty();
  }
  if (goog.isArrayLike(col) || goog.isString(col)) {
    return goog.array.isEmpty(col);
  }
  return goog.object.isEmpty(col);
};
goog.structs.clear = function(col) {
  if (col.clear && typeof col.clear == "function") {
    col.clear();
  } else {
    if (goog.isArrayLike(col)) {
      goog.array.clear(col);
    } else {
      goog.object.clear(col);
    }
  }
};
goog.structs.forEach = function(col, f, opt_obj) {
  if (col.forEach && typeof col.forEach == "function") {
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
  if (typeof col.filter == "function") {
    return col.filter(f, opt_obj);
  }
  if (goog.isArrayLike(col) || goog.isString(col)) {
    return goog.array.filter(col, f, opt_obj);
  }
  var rv, keys = goog.structs.getKeys(col), values = goog.structs.getValues(col), l = values.length;
  if (keys) {
    rv = {};
    for (var i = 0;i < l;i++) {
      if (f.call(opt_obj, values[i], keys[i], col)) {
        rv[keys[i]] = values[i];
      }
    }
  } else {
    rv = [];
    for (i = 0;i < l;i++) {
      if (f.call(opt_obj, values[i], undefined, col)) {
        rv.push(values[i]);
      }
    }
  }
  return rv;
};
goog.structs.map = function(col, f, opt_obj) {
  if (typeof col.map == "function") {
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
    rv = [];
    for (i = 0;i < l;i++) {
      rv[i] = f.call(opt_obj, values[i], undefined, col);
    }
  }
  return rv;
};
goog.structs.some = function(col, f, opt_obj) {
  if (typeof col.some == "function") {
    return col.some(f, opt_obj);
  }
  if (goog.isArrayLike(col) || goog.isString(col)) {
    return goog.array.some(col, f, opt_obj);
  }
  for (var keys = goog.structs.getKeys(col), values = goog.structs.getValues(col), l = values.length, i = 0;i < l;i++) {
    if (f.call(opt_obj, values[i], keys && keys[i], col)) {
      return true;
    }
  }
  return false;
};
goog.structs.every = function(col, f, opt_obj) {
  if (typeof col.every == "function") {
    return col.every(f, opt_obj);
  }
  if (goog.isArrayLike(col) || goog.isString(col)) {
    return goog.array.every(col, f, opt_obj);
  }
  for (var keys = goog.structs.getKeys(col), values = goog.structs.getValues(col), l = values.length, i = 0;i < l;i++) {
    if (!f.call(opt_obj, values[i], keys && keys[i], col)) {
      return false;
    }
  }
  return true;
};
goog.structs.Set = function(opt_values) {
  this.map_ = new goog.structs.Map;
  if (opt_values) {
    this.addAll(opt_values);
  }
};
goog.structs.Set.getKey_ = function(val) {
  var type = typeof val;
  if (type == "object" && val || type == "function") {
    return "o" + goog.getUid(val);
  } else {
    return type.substr(0, 1) + val;
  }
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
    return false;
  }
  if (!(col instanceof goog.structs.Set) && colCount > 5) {
    col = new goog.structs.Set(col);
  }
  return goog.structs.every(this, function(value) {
    return goog.structs.contains(col, value);
  });
};
goog.structs.Set.prototype.__iterator__ = function() {
  return this.map_.__iterator__(false);
};
mr.cast.ApiCallbackInfo = function(sequenceNumber, successCallback, errorCallback, opt_timeoutMillis) {
  mr.cast.PendingRequest.call(this, sequenceNumber, opt_timeoutMillis || mr.cast.ApiCallbackInfo.CLEANUP_TIMEOUT_MS_);
  this.successCallback = successCallback;
  this.errorCallback = errorCallback;
};
$jscomp.inherits(mr.cast.ApiCallbackInfo, mr.cast.PendingRequest);
mr.cast.ApiCallbackInfo.prototype.onExpired = function() {
  this.errorCallback(new chrome.cast.Error(chrome.cast.ErrorCode.TIMEOUT));
};
mr.cast.ApiCallbackInfo.CLEANUP_TIMEOUT_MS_ = 10 * 60 * 1000;
mr.cast.InternalMessageType = {V2_MESSAGE:"v2_message", APP_MESSAGE:"app_message", CLIENT_CONNECT:"client_connect", LEAVE_SESSION:"leave_session", RECEIVER_ACTION:"receiver_action", NEW_SESSION:"new_session", UPDATE_SESSION:"update_session", ERROR:"error", CUSTOM_DIAL_LAUNCH:"custom_dial_launch"};
mr.cast.InternalMessage = function(type, message, opt_sequenceNumber, opt_timeoutMillis) {
  this.type = type;
  this.message = message;
  this.sequenceNumber = goog.isDef(opt_sequenceNumber) ? opt_sequenceNumber : -1;
  this.timeoutMillis = opt_timeoutMillis || 0;
  this.clientId = "";
};
mr.cast.ExtensionMessengerCallback = function() {
};
mr.cast.ExtensionMessengerCallback.prototype.onMessage = function() {
};
mr.cast.ExtensionMessenger = function(callback, opt_clientId) {
  this.callback_ = callback;
  this.clientId_ = opt_clientId || String(Date.now()) + String(Math.floor(Math.random() * 1e5));
  this.connection_ = null;
};
mr.cast.ExtensionMessenger.prototype.sendToBackground = function(message) {
  if (!this.connection_) {
    mr.cast.ExtensionMessenger.logger_.error("No active session");
    return "No active session";
  }
  message.clientId = this.clientId_;
  var msg = JSON.stringify(message);
  if (msg.length > mr.cast.ExtensionMessenger.MESSAGE_LENGTH_LIMIT_) {
    mr.cast.ExtensionMessenger.logger_.error("Message length over limit");
    return "Message length over limit";
  }
  mr.cast.ExtensionMessenger.logger_.fine("Send " + msg);
  this.connection_.send(msg);
  return null;
};
mr.cast.ExtensionMessenger.prototype.connect = function(connection) {
  this.connection_ = connection;
  this.connection_.onmessage = goog.bind(this.onExtensionMessage_, this);
  this.sendToBackground(new mr.cast.InternalMessage(mr.cast.InternalMessageType.CLIENT_CONNECT, this.clientId_));
};
mr.cast.ExtensionMessenger.prototype.disconnect = function() {
  this.connection_.close();
  this.connection_ = null;
};
mr.cast.ExtensionMessenger.prototype.onExtensionMessage_ = function(e) {
  mr.cast.ExtensionMessenger.logger_.fine("Receive " + e.data);
  var message = JSON.parse(e.data);
  if (message.clientId != this.clientId_) {
    return;
  }
  this.callback_.onMessage(message);
};
mr.cast.ExtensionMessenger.logger_ = mr.Logger.getInstance("mr.cast.ExtensionMessenger");
mr.cast.ExtensionMessenger.CHAR_BYTE_SIZE_ = 2;
mr.cast.ExtensionMessenger.MESSAGE_BYTE_LIMIT_ = 65536;
mr.cast.ExtensionMessenger.MESSAGE_LENGTH_LIMIT_ = mr.cast.ExtensionMessenger.MESSAGE_BYTE_LIMIT_ / mr.cast.ExtensionMessenger.CHAR_BYTE_SIZE_;
goog.uri = {};
goog.uri.utils = {};
goog.uri.utils.CharCode_ = {AMPERSAND:38, EQUAL:61, HASH:35, QUESTION:63};
goog.uri.utils.buildFromEncodedParts = function(opt_scheme, opt_userInfo, opt_domain, opt_port, opt_path, opt_queryData, opt_fragment) {
  var out = "";
  if (opt_scheme) {
    out += opt_scheme + ":";
  }
  if (opt_domain) {
    out += "//";
    if (opt_userInfo) {
      out += opt_userInfo + "@";
    }
    out += opt_domain;
    if (opt_port) {
      out += ":" + opt_port;
    }
  }
  if (opt_path) {
    out += opt_path;
  }
  if (opt_queryData) {
    out += "?" + opt_queryData;
  }
  if (opt_fragment) {
    out += "#" + opt_fragment;
  }
  return out;
};
goog.uri.utils.splitRe_ = new RegExp("^" + "(?:" + "([^:/?#.]+)" + ":)?" + "(?://" + "(?:([^/?#]*)@)?" + "([^/#?]*?)" + "(?::([0-9]+))?" + "(?=[/#?]|$)" + ")?" + "([^?#]+)?" + "(?:\\?([^#]*))?" + "(?:#([\\s\\S]*))?" + "$");
goog.uri.utils.ComponentIndex = {SCHEME:1, USER_INFO:2, DOMAIN:3, PORT:4, PATH:5, QUERY_DATA:6, FRAGMENT:7};
goog.uri.utils.split = function(uri) {
  return uri.match(goog.uri.utils.splitRe_);
};
goog.uri.utils.decodeIfPossible_ = function(uri, opt_preserveReserved) {
  if (!uri) {
    return uri;
  }
  return opt_preserveReserved ? decodeURI(uri) : decodeURIComponent(uri);
};
goog.uri.utils.getComponentByIndex_ = function(componentIndex, uri) {
  return goog.uri.utils.split(uri)[componentIndex] || null;
};
goog.uri.utils.getScheme = function(uri) {
  return goog.uri.utils.getComponentByIndex_(goog.uri.utils.ComponentIndex.SCHEME, uri);
};
goog.uri.utils.getEffectiveScheme = function(uri) {
  var scheme = goog.uri.utils.getScheme(uri);
  if (!scheme && goog.global.self && goog.global.self.location) {
    var protocol = goog.global.self.location.protocol, scheme = protocol.substr(0, protocol.length - 1);
  }
  return scheme ? scheme.toLowerCase() : "";
};
goog.uri.utils.getUserInfoEncoded = function(uri) {
  return goog.uri.utils.getComponentByIndex_(goog.uri.utils.ComponentIndex.USER_INFO, uri);
};
goog.uri.utils.getUserInfo = function(uri) {
  return goog.uri.utils.decodeIfPossible_(goog.uri.utils.getUserInfoEncoded(uri));
};
goog.uri.utils.getDomainEncoded = function(uri) {
  return goog.uri.utils.getComponentByIndex_(goog.uri.utils.ComponentIndex.DOMAIN, uri);
};
goog.uri.utils.getDomain = function(uri) {
  return goog.uri.utils.decodeIfPossible_(goog.uri.utils.getDomainEncoded(uri), true);
};
goog.uri.utils.getPort = function(uri) {
  return Number(goog.uri.utils.getComponentByIndex_(goog.uri.utils.ComponentIndex.PORT, uri)) || null;
};
goog.uri.utils.getPathEncoded = function(uri) {
  return goog.uri.utils.getComponentByIndex_(goog.uri.utils.ComponentIndex.PATH, uri);
};
goog.uri.utils.getPath = function(uri) {
  return goog.uri.utils.decodeIfPossible_(goog.uri.utils.getPathEncoded(uri), true);
};
goog.uri.utils.getQueryData = function(uri) {
  return goog.uri.utils.getComponentByIndex_(goog.uri.utils.ComponentIndex.QUERY_DATA, uri);
};
goog.uri.utils.getFragmentEncoded = function(uri) {
  var hashIndex = uri.indexOf("#");
  return hashIndex < 0 ? null : uri.substr(hashIndex + 1);
};
goog.uri.utils.setFragmentEncoded = function(uri, fragment) {
  return goog.uri.utils.removeFragment(uri) + (fragment ? "#" + fragment : "");
};
goog.uri.utils.getFragment = function(uri) {
  return goog.uri.utils.decodeIfPossible_(goog.uri.utils.getFragmentEncoded(uri));
};
goog.uri.utils.getHost = function(uri) {
  var pieces = goog.uri.utils.split(uri);
  return goog.uri.utils.buildFromEncodedParts(pieces[goog.uri.utils.ComponentIndex.SCHEME], pieces[goog.uri.utils.ComponentIndex.USER_INFO], pieces[goog.uri.utils.ComponentIndex.DOMAIN], pieces[goog.uri.utils.ComponentIndex.PORT]);
};
goog.uri.utils.getOrigin = function(uri) {
  var pieces = goog.uri.utils.split(uri);
  return goog.uri.utils.buildFromEncodedParts(pieces[goog.uri.utils.ComponentIndex.SCHEME], null, pieces[goog.uri.utils.ComponentIndex.DOMAIN], pieces[goog.uri.utils.ComponentIndex.PORT]);
};
goog.uri.utils.getPathAndAfter = function(uri) {
  var pieces = goog.uri.utils.split(uri);
  return goog.uri.utils.buildFromEncodedParts(null, null, null, null, pieces[goog.uri.utils.ComponentIndex.PATH], pieces[goog.uri.utils.ComponentIndex.QUERY_DATA], pieces[goog.uri.utils.ComponentIndex.FRAGMENT]);
};
goog.uri.utils.removeFragment = function(uri) {
  var hashIndex = uri.indexOf("#");
  return hashIndex < 0 ? uri : uri.substr(0, hashIndex);
};
goog.uri.utils.haveSameDomain = function(uri1, uri2) {
  var pieces1 = goog.uri.utils.split(uri1), pieces2 = goog.uri.utils.split(uri2);
  return pieces1[goog.uri.utils.ComponentIndex.DOMAIN] == pieces2[goog.uri.utils.ComponentIndex.DOMAIN] && pieces1[goog.uri.utils.ComponentIndex.SCHEME] == pieces2[goog.uri.utils.ComponentIndex.SCHEME] && pieces1[goog.uri.utils.ComponentIndex.PORT] == pieces2[goog.uri.utils.ComponentIndex.PORT];
};
goog.uri.utils.assertNoFragmentsOrQueries_ = function(uri) {
  if (goog.DEBUG && (uri.indexOf("#") >= 0 || uri.indexOf("?") >= 0)) {
    throw Error("goog.uri.utils: Fragment or query identifiers are not " + "supported: [" + uri + "]");
  }
};
goog.uri.utils.parseQueryData = function(encodedQuery, callback) {
  if (!encodedQuery) {
    return;
  }
  for (var pairs = encodedQuery.split("&"), i = 0;i < pairs.length;i++) {
    var indexOfEquals = pairs[i].indexOf("="), name, value = null;
    if (indexOfEquals >= 0) {
      name = pairs[i].substring(0, indexOfEquals);
      value = pairs[i].substring(indexOfEquals + 1);
    } else {
      name = pairs[i];
    }
    callback(name, value ? goog.string.urlDecode(value) : "");
  }
};
goog.uri.utils.appendQueryData_ = function(buffer) {
  if (buffer[1]) {
    var baseUri = buffer[0], hashIndex = baseUri.indexOf("#");
    if (hashIndex >= 0) {
      buffer.push(baseUri.substr(hashIndex));
      buffer[0] = baseUri = baseUri.substr(0, hashIndex);
    }
    var questionIndex = baseUri.indexOf("?");
    if (questionIndex < 0) {
      buffer[1] = "?";
    } else {
      if (questionIndex == baseUri.length - 1) {
        buffer[1] = undefined;
      }
    }
  }
  return buffer.join("");
};
goog.uri.utils.appendKeyValuePairs_ = function(key, value, pairs) {
  if (goog.isArray(value)) {
    goog.asserts.assertArray(value);
    for (var j = 0;j < value.length;j++) {
      goog.uri.utils.appendKeyValuePairs_(key, String(value[j]), pairs);
    }
  } else {
    if (value != null) {
      pairs.push("&", key, value === "" ? "" : "=", goog.string.urlEncode(value));
    }
  }
};
goog.uri.utils.buildQueryDataBuffer_ = function(buffer, keysAndValues, opt_startIndex) {
  goog.asserts.assert(Math.max(keysAndValues.length - (opt_startIndex || 0), 0) % 2 == 0, "goog.uri.utils: Key/value lists must be even in length.");
  for (var i = opt_startIndex || 0;i < keysAndValues.length;i += 2) {
    goog.uri.utils.appendKeyValuePairs_(keysAndValues[i], keysAndValues[i + 1], buffer);
  }
  return buffer;
};
goog.uri.utils.buildQueryData = function(keysAndValues, opt_startIndex) {
  var buffer = goog.uri.utils.buildQueryDataBuffer_([], keysAndValues, opt_startIndex);
  buffer[0] = "";
  return buffer.join("");
};
goog.uri.utils.buildQueryDataBufferFromMap_ = function(buffer, map) {
  for (var key in map) {
    goog.uri.utils.appendKeyValuePairs_(key, map[key], buffer);
  }
  return buffer;
};
goog.uri.utils.buildQueryDataFromMap = function(map) {
  var buffer = goog.uri.utils.buildQueryDataBufferFromMap_([], map);
  buffer[0] = "";
  return buffer.join("");
};
goog.uri.utils.appendParams = function(uri, var_args) {
  return goog.uri.utils.appendQueryData_(arguments.length == 2 ? goog.uri.utils.buildQueryDataBuffer_([uri], arguments[1], 0) : goog.uri.utils.buildQueryDataBuffer_([uri], arguments, 1));
};
goog.uri.utils.appendParamsFromMap = function(uri, map) {
  return goog.uri.utils.appendQueryData_(goog.uri.utils.buildQueryDataBufferFromMap_([uri], map));
};
goog.uri.utils.appendParam = function(uri, key, opt_value) {
  var paramArr = [uri, "&", key];
  if (goog.isDefAndNotNull(opt_value)) {
    paramArr.push("=", goog.string.urlEncode(opt_value));
  }
  return goog.uri.utils.appendQueryData_(paramArr);
};
goog.uri.utils.findParam_ = function(uri, startIndex, keyEncoded, hashOrEndIndex) {
  for (var index = startIndex, keyLength = keyEncoded.length;(index = uri.indexOf(keyEncoded, index)) >= 0 && index < hashOrEndIndex;) {
    var precedingChar = uri.charCodeAt(index - 1);
    if (precedingChar == goog.uri.utils.CharCode_.AMPERSAND || precedingChar == goog.uri.utils.CharCode_.QUESTION) {
      var followingChar = uri.charCodeAt(index + keyLength);
      if (!followingChar || followingChar == goog.uri.utils.CharCode_.EQUAL || followingChar == goog.uri.utils.CharCode_.AMPERSAND || followingChar == goog.uri.utils.CharCode_.HASH) {
        return index;
      }
    }
    index += keyLength + 1;
  }
  return -1;
};
goog.uri.utils.hashOrEndRe_ = /#|$/;
goog.uri.utils.hasParam = function(uri, keyEncoded) {
  return goog.uri.utils.findParam_(uri, 0, keyEncoded, uri.search(goog.uri.utils.hashOrEndRe_)) >= 0;
};
goog.uri.utils.getParamValue = function(uri, keyEncoded) {
  var hashOrEndIndex = uri.search(goog.uri.utils.hashOrEndRe_), foundIndex = goog.uri.utils.findParam_(uri, 0, keyEncoded, hashOrEndIndex);
  if (foundIndex < 0) {
    return null;
  } else {
    var endPosition = uri.indexOf("&", foundIndex);
    if (endPosition < 0 || endPosition > hashOrEndIndex) {
      endPosition = hashOrEndIndex;
    }
    foundIndex += keyEncoded.length + 1;
    return goog.string.urlDecode(uri.substr(foundIndex, endPosition - foundIndex));
  }
};
goog.uri.utils.getParamValues = function(uri, keyEncoded) {
  for (var hashOrEndIndex = uri.search(goog.uri.utils.hashOrEndRe_), position = 0, foundIndex, result = [];(foundIndex = goog.uri.utils.findParam_(uri, position, keyEncoded, hashOrEndIndex)) >= 0;) {
    position = uri.indexOf("&", foundIndex);
    if (position < 0 || position > hashOrEndIndex) {
      position = hashOrEndIndex;
    }
    foundIndex += keyEncoded.length + 1;
    result.push(goog.string.urlDecode(uri.substr(foundIndex, position - foundIndex)));
  }
  return result;
};
goog.uri.utils.trailingQueryPunctuationRe_ = /[?&]($|#)/;
goog.uri.utils.removeParam = function(uri, keyEncoded) {
  for (var hashOrEndIndex = uri.search(goog.uri.utils.hashOrEndRe_), position = 0, foundIndex, buffer = [];(foundIndex = goog.uri.utils.findParam_(uri, position, keyEncoded, hashOrEndIndex)) >= 0;) {
    buffer.push(uri.substring(position, foundIndex));
    position = Math.min(uri.indexOf("&", foundIndex) + 1 || hashOrEndIndex, hashOrEndIndex);
  }
  buffer.push(uri.substr(position));
  return buffer.join("").replace(goog.uri.utils.trailingQueryPunctuationRe_, "$1");
};
goog.uri.utils.setParam = function(uri, keyEncoded, value) {
  return goog.uri.utils.appendParam(goog.uri.utils.removeParam(uri, keyEncoded), keyEncoded, value);
};
goog.uri.utils.appendPath = function(baseUri, path) {
  goog.uri.utils.assertNoFragmentsOrQueries_(baseUri);
  if (goog.string.endsWith(baseUri, "/")) {
    baseUri = baseUri.substr(0, baseUri.length - 1);
  }
  if (goog.string.startsWith(path, "/")) {
    path = path.substr(1);
  }
  return goog.string.buildString(baseUri, "/", path);
};
goog.uri.utils.setPath = function(uri, path) {
  if (!goog.string.startsWith(path, "/")) {
    path = "/" + path;
  }
  var parts = goog.uri.utils.split(uri);
  return goog.uri.utils.buildFromEncodedParts(parts[goog.uri.utils.ComponentIndex.SCHEME], parts[goog.uri.utils.ComponentIndex.USER_INFO], parts[goog.uri.utils.ComponentIndex.DOMAIN], parts[goog.uri.utils.ComponentIndex.PORT], path, parts[goog.uri.utils.ComponentIndex.QUERY_DATA], parts[goog.uri.utils.ComponentIndex.FRAGMENT]);
};
goog.uri.utils.StandardQueryParam = {RANDOM:"zx"};
goog.uri.utils.makeUnique = function(uri) {
  return goog.uri.utils.setParam(uri, goog.uri.utils.StandardQueryParam.RANDOM, goog.string.getRandomString());
};
goog.Uri = function(opt_uri, opt_ignoreCase) {
  this.domain_ = this.userInfo_ = this.scheme_ = "";
  this.port_ = null;
  this.fragment_ = this.path_ = "";
  this.ignoreCase_ = this.isReadOnly_ = false;
  var m;
  if (opt_uri instanceof goog.Uri) {
    this.ignoreCase_ = goog.isDef(opt_ignoreCase) ? opt_ignoreCase : opt_uri.ignoreCase_;
    this.setScheme(opt_uri.getScheme());
    this.setUserInfo(opt_uri.getUserInfo());
    this.setDomain(opt_uri.getDomain());
    this.setPort(opt_uri.getPort());
    this.setPath(opt_uri.getPath());
    this.setQueryData(opt_uri.getQueryData().clone());
    this.setFragment(opt_uri.getFragment());
  } else {
    if (opt_uri && (m = goog.uri.utils.split(String(opt_uri)))) {
      this.ignoreCase_ = !!opt_ignoreCase;
      this.setScheme(m[goog.uri.utils.ComponentIndex.SCHEME] || "", true);
      this.setUserInfo(m[goog.uri.utils.ComponentIndex.USER_INFO] || "", true);
      this.setDomain(m[goog.uri.utils.ComponentIndex.DOMAIN] || "", true);
      this.setPort(m[goog.uri.utils.ComponentIndex.PORT]);
      this.setPath(m[goog.uri.utils.ComponentIndex.PATH] || "", true);
      this.setQueryData(m[goog.uri.utils.ComponentIndex.QUERY_DATA] || "", true);
      this.setFragment(m[goog.uri.utils.ComponentIndex.FRAGMENT] || "", true);
    } else {
      this.ignoreCase_ = !!opt_ignoreCase;
      this.queryData_ = new goog.Uri.QueryData(null, null, this.ignoreCase_);
    }
  }
};
goog.Uri.preserveParameterTypesCompatibilityFlag = false;
goog.Uri.RANDOM_PARAM = goog.uri.utils.StandardQueryParam.RANDOM;
goog.Uri.prototype.toString = function() {
  var out = [], scheme = this.getScheme();
  if (scheme) {
    out.push(goog.Uri.encodeSpecialChars_(scheme, goog.Uri.reDisallowedInSchemeOrUserInfo_, true), ":");
  }
  var domain = this.getDomain();
  if (domain || scheme == "file") {
    out.push("//");
    var userInfo = this.getUserInfo();
    if (userInfo) {
      out.push(goog.Uri.encodeSpecialChars_(userInfo, goog.Uri.reDisallowedInSchemeOrUserInfo_, true), "@");
    }
    out.push(goog.Uri.removeDoubleEncoding_(goog.string.urlEncode(domain)));
    var port = this.getPort();
    if (port != null) {
      out.push(":", String(port));
    }
  }
  var path = this.getPath();
  if (path) {
    if (this.hasDomain() && path.charAt(0) != "/") {
      out.push("/");
    }
    out.push(goog.Uri.encodeSpecialChars_(path, path.charAt(0) == "/" ? goog.Uri.reDisallowedInAbsolutePath_ : goog.Uri.reDisallowedInRelativePath_, true));
  }
  var query = this.getEncodedQuery();
  if (query) {
    out.push("?", query);
  }
  var fragment = this.getFragment();
  if (fragment) {
    out.push("#", goog.Uri.encodeSpecialChars_(fragment, goog.Uri.reDisallowedInFragment_));
  }
  return out.join("");
};
goog.Uri.prototype.resolve = function(relativeUri) {
  var absoluteUri = this.clone(), overridden = relativeUri.hasScheme();
  if (overridden) {
    absoluteUri.setScheme(relativeUri.getScheme());
  } else {
    overridden = relativeUri.hasUserInfo();
  }
  if (overridden) {
    absoluteUri.setUserInfo(relativeUri.getUserInfo());
  } else {
    overridden = relativeUri.hasDomain();
  }
  if (overridden) {
    absoluteUri.setDomain(relativeUri.getDomain());
  } else {
    overridden = relativeUri.hasPort();
  }
  var path = relativeUri.getPath();
  if (overridden) {
    absoluteUri.setPort(relativeUri.getPort());
  } else {
    if (overridden = relativeUri.hasPath()) {
      if (path.charAt(0) != "/") {
        if (this.hasDomain() && !this.hasPath()) {
          path = "/" + path;
        } else {
          var lastSlashIndex = absoluteUri.getPath().lastIndexOf("/");
          if (lastSlashIndex != -1) {
            path = absoluteUri.getPath().substr(0, lastSlashIndex + 1) + path;
          }
        }
      }
      path = goog.Uri.removeDotSegments(path);
    }
  }
  if (overridden) {
    absoluteUri.setPath(path);
  } else {
    overridden = relativeUri.hasQuery();
  }
  if (overridden) {
    absoluteUri.setQueryData(relativeUri.getQueryData().clone());
  } else {
    overridden = relativeUri.hasFragment();
  }
  if (overridden) {
    absoluteUri.setFragment(relativeUri.getFragment());
  }
  return absoluteUri;
};
goog.Uri.prototype.clone = function() {
  return new goog.Uri(this);
};
goog.Uri.prototype.getScheme = function() {
  return this.scheme_;
};
goog.Uri.prototype.setScheme = function(newScheme, opt_decode) {
  this.enforceReadOnly();
  if (this.scheme_ = opt_decode ? goog.Uri.decodeOrEmpty_(newScheme, true) : newScheme) {
    this.scheme_ = this.scheme_.replace(/:$/, "");
  }
  return this;
};
goog.Uri.prototype.hasScheme = function() {
  return !!this.scheme_;
};
goog.Uri.prototype.getUserInfo = function() {
  return this.userInfo_;
};
goog.Uri.prototype.setUserInfo = function(newUserInfo, opt_decode) {
  this.enforceReadOnly();
  this.userInfo_ = opt_decode ? goog.Uri.decodeOrEmpty_(newUserInfo) : newUserInfo;
  return this;
};
goog.Uri.prototype.hasUserInfo = function() {
  return !!this.userInfo_;
};
goog.Uri.prototype.getDomain = function() {
  return this.domain_;
};
goog.Uri.prototype.setDomain = function(newDomain, opt_decode) {
  this.enforceReadOnly();
  this.domain_ = opt_decode ? goog.Uri.decodeOrEmpty_(newDomain, true) : newDomain;
  return this;
};
goog.Uri.prototype.hasDomain = function() {
  return !!this.domain_;
};
goog.Uri.prototype.getPort = function() {
  return this.port_;
};
goog.Uri.prototype.setPort = function(newPort) {
  this.enforceReadOnly();
  if (newPort) {
    newPort = Number(newPort);
    if (isNaN(newPort) || newPort < 0) {
      throw Error("Bad port number " + newPort);
    }
    this.port_ = newPort;
  } else {
    this.port_ = null;
  }
  return this;
};
goog.Uri.prototype.hasPort = function() {
  return this.port_ != null;
};
goog.Uri.prototype.getPath = function() {
  return this.path_;
};
goog.Uri.prototype.setPath = function(newPath, opt_decode) {
  this.enforceReadOnly();
  this.path_ = opt_decode ? goog.Uri.decodeOrEmpty_(newPath, true) : newPath;
  return this;
};
goog.Uri.prototype.hasPath = function() {
  return !!this.path_;
};
goog.Uri.prototype.hasQuery = function() {
  return this.queryData_.toString() !== "";
};
goog.Uri.prototype.setQueryData = function(queryData, opt_decode) {
  this.enforceReadOnly();
  if (queryData instanceof goog.Uri.QueryData) {
    this.queryData_ = queryData;
    this.queryData_.setIgnoreCase(this.ignoreCase_);
  } else {
    if (!opt_decode) {
      queryData = goog.Uri.encodeSpecialChars_(queryData, goog.Uri.reDisallowedInQuery_);
    }
    this.queryData_ = new goog.Uri.QueryData(queryData, null, this.ignoreCase_);
  }
  return this;
};
goog.Uri.prototype.getEncodedQuery = function() {
  return this.queryData_.toString();
};
goog.Uri.prototype.getQueryData = function() {
  return this.queryData_;
};
goog.Uri.prototype.setParameterValue = function(key, value) {
  this.enforceReadOnly();
  this.queryData_.set(key, value);
  return this;
};
goog.Uri.prototype.getFragment = function() {
  return this.fragment_;
};
goog.Uri.prototype.setFragment = function(newFragment, opt_decode) {
  this.enforceReadOnly();
  this.fragment_ = opt_decode ? goog.Uri.decodeOrEmpty_(newFragment) : newFragment;
  return this;
};
goog.Uri.prototype.hasFragment = function() {
  return !!this.fragment_;
};
goog.Uri.prototype.makeUnique = function() {
  this.enforceReadOnly();
  this.setParameterValue(goog.Uri.RANDOM_PARAM, goog.string.getRandomString());
  return this;
};
goog.Uri.prototype.enforceReadOnly = function() {
  if (this.isReadOnly_) {
    throw Error("Tried to modify a read-only Uri");
  }
};
goog.Uri.prototype.setIgnoreCase = function(ignoreCase) {
  this.ignoreCase_ = ignoreCase;
  if (this.queryData_) {
    this.queryData_.setIgnoreCase(ignoreCase);
  }
  return this;
};
goog.Uri.parse = function(uri, opt_ignoreCase) {
  return uri instanceof goog.Uri ? uri.clone() : new goog.Uri(uri, opt_ignoreCase);
};
goog.Uri.create = function(opt_scheme, opt_userInfo, opt_domain, opt_port, opt_path, opt_query, opt_fragment, opt_ignoreCase) {
  var uri = new goog.Uri(null, opt_ignoreCase);
  opt_scheme && uri.setScheme(opt_scheme);
  opt_userInfo && uri.setUserInfo(opt_userInfo);
  opt_domain && uri.setDomain(opt_domain);
  opt_port && uri.setPort(opt_port);
  opt_path && uri.setPath(opt_path);
  opt_query && uri.setQueryData(opt_query);
  opt_fragment && uri.setFragment(opt_fragment);
  return uri;
};
goog.Uri.resolve = function(base, rel) {
  if (!(base instanceof goog.Uri)) {
    base = goog.Uri.parse(base);
  }
  if (!(rel instanceof goog.Uri)) {
    rel = goog.Uri.parse(rel);
  }
  return base.resolve(rel);
};
goog.Uri.removeDotSegments = function(path) {
  if (path == ".." || path == ".") {
    return "";
  } else {
    if (!goog.string.contains(path, "./") && !goog.string.contains(path, "/.")) {
      return path;
    } else {
      for (var leadingSlash = goog.string.startsWith(path, "/"), segments = path.split("/"), out = [], pos = 0;pos < segments.length;) {
        var segment = segments[pos++];
        if (segment == ".") {
          if (leadingSlash && pos == segments.length) {
            out.push("");
          }
        } else {
          if (segment == "..") {
            if (out.length > 1 || out.length == 1 && out[0] != "") {
              out.pop();
            }
            if (leadingSlash && pos == segments.length) {
              out.push("");
            }
          } else {
            out.push(segment);
            leadingSlash = true;
          }
        }
      }
      return out.join("/");
    }
  }
};
goog.Uri.decodeOrEmpty_ = function(val, opt_preserveReserved) {
  if (!val) {
    return "";
  }
  return opt_preserveReserved ? decodeURI(val.replace(/%25/g, "%2525")) : decodeURIComponent(val);
};
goog.Uri.encodeSpecialChars_ = function(unescapedPart, extra, opt_removeDoubleEncoding) {
  if (goog.isString(unescapedPart)) {
    var encoded = encodeURI(unescapedPart).replace(extra, goog.Uri.encodeChar_);
    if (opt_removeDoubleEncoding) {
      encoded = goog.Uri.removeDoubleEncoding_(encoded);
    }
    return encoded;
  }
  return null;
};
goog.Uri.encodeChar_ = function(ch) {
  var n = ch.charCodeAt(0);
  return "%" + (n >> 4 & 15).toString(16) + (n & 15).toString(16);
};
goog.Uri.removeDoubleEncoding_ = function(doubleEncodedString) {
  return doubleEncodedString.replace(/%25([0-9a-fA-F]{2})/g, "%$1");
};
goog.Uri.reDisallowedInSchemeOrUserInfo_ = /[#\/\?@]/g;
goog.Uri.reDisallowedInRelativePath_ = /[\#\?:]/g;
goog.Uri.reDisallowedInAbsolutePath_ = /[\#\?]/g;
goog.Uri.reDisallowedInQuery_ = /[\#\?@]/g;
goog.Uri.reDisallowedInFragment_ = /#/g;
goog.Uri.haveSameDomain = function(uri1String, uri2String) {
  var pieces1 = goog.uri.utils.split(uri1String), pieces2 = goog.uri.utils.split(uri2String);
  return pieces1[goog.uri.utils.ComponentIndex.DOMAIN] == pieces2[goog.uri.utils.ComponentIndex.DOMAIN] && pieces1[goog.uri.utils.ComponentIndex.PORT] == pieces2[goog.uri.utils.ComponentIndex.PORT];
};
goog.Uri.QueryData = function(opt_query, opt_uri, opt_ignoreCase) {
  this.count_ = this.keyMap_ = null;
  this.encodedQuery_ = opt_query || null;
  this.ignoreCase_ = !!opt_ignoreCase;
};
goog.Uri.QueryData.prototype.ensureKeyMapInitialized_ = function() {
  if (!this.keyMap_) {
    this.keyMap_ = new goog.structs.Map;
    this.count_ = 0;
    if (this.encodedQuery_) {
      var self = this;
      goog.uri.utils.parseQueryData(this.encodedQuery_, function(name, value) {
        self.add(goog.string.urlDecode(name), value);
      });
    }
  }
};
goog.Uri.QueryData.createFromMap = function(map, opt_uri, opt_ignoreCase) {
  var keys = goog.structs.getKeys(map);
  if (typeof keys == "undefined") {
    throw Error("Keys are undefined");
  }
  for (var queryData = new goog.Uri.QueryData(null, null, opt_ignoreCase), values = goog.structs.getValues(map), i = 0;i < keys.length;i++) {
    var key = keys[i], value = values[i];
    if (!goog.isArray(value)) {
      queryData.add(key, value);
    } else {
      queryData.setValues(key, value);
    }
  }
  return queryData;
};
goog.Uri.QueryData.createFromKeysValues = function(keys, values, opt_uri, opt_ignoreCase) {
  if (keys.length != values.length) {
    throw Error("Mismatched lengths for keys/values");
  }
  for (var queryData = new goog.Uri.QueryData(null, null, opt_ignoreCase), i = 0;i < keys.length;i++) {
    queryData.add(keys[i], values[i]);
  }
  return queryData;
};
goog.Uri.QueryData.prototype.getCount = function() {
  this.ensureKeyMapInitialized_();
  return this.count_;
};
goog.Uri.QueryData.prototype.add = function(key, value) {
  this.ensureKeyMapInitialized_();
  this.invalidateCache_();
  key = this.getKeyName_(key);
  var values = this.keyMap_.get(key);
  if (!values) {
    this.keyMap_.set(key, values = []);
  }
  values.push(value);
  this.count_ = goog.asserts.assertNumber(this.count_) + 1;
  return this;
};
goog.Uri.QueryData.prototype.remove = function(key) {
  this.ensureKeyMapInitialized_();
  key = this.getKeyName_(key);
  if (this.keyMap_.containsKey(key)) {
    this.invalidateCache_();
    this.count_ = goog.asserts.assertNumber(this.count_) - this.keyMap_.get(key).length;
    return this.keyMap_.remove(key);
  }
  return false;
};
goog.Uri.QueryData.prototype.clear = function() {
  this.invalidateCache_();
  this.keyMap_ = null;
  this.count_ = 0;
};
goog.Uri.QueryData.prototype.isEmpty = function() {
  this.ensureKeyMapInitialized_();
  return this.count_ == 0;
};
goog.Uri.QueryData.prototype.containsKey = function(key) {
  this.ensureKeyMapInitialized_();
  key = this.getKeyName_(key);
  return this.keyMap_.containsKey(key);
};
goog.Uri.QueryData.prototype.containsValue = function(value) {
  var vals = this.getValues();
  return goog.array.contains(vals, value);
};
goog.Uri.QueryData.prototype.getKeys = function() {
  this.ensureKeyMapInitialized_();
  for (var vals = this.keyMap_.getValues(), keys = this.keyMap_.getKeys(), rv = [], i = 0;i < keys.length;i++) {
    for (var val = vals[i], j = 0;j < val.length;j++) {
      rv.push(keys[i]);
    }
  }
  return rv;
};
goog.Uri.QueryData.prototype.getValues = function(opt_key) {
  this.ensureKeyMapInitialized_();
  var rv = [];
  if (goog.isString(opt_key)) {
    if (this.containsKey(opt_key)) {
      rv = goog.array.concat(rv, this.keyMap_.get(this.getKeyName_(opt_key)));
    }
  } else {
    for (var values = this.keyMap_.getValues(), i = 0;i < values.length;i++) {
      rv = goog.array.concat(rv, values[i]);
    }
  }
  return rv;
};
goog.Uri.QueryData.prototype.set = function(key, value) {
  this.ensureKeyMapInitialized_();
  this.invalidateCache_();
  key = this.getKeyName_(key);
  if (this.containsKey(key)) {
    this.count_ = goog.asserts.assertNumber(this.count_) - this.keyMap_.get(key).length;
  }
  this.keyMap_.set(key, [value]);
  this.count_ = goog.asserts.assertNumber(this.count_) + 1;
  return this;
};
goog.Uri.QueryData.prototype.get = function(key, opt_default) {
  var values = key ? this.getValues(key) : [];
  if (goog.Uri.preserveParameterTypesCompatibilityFlag) {
    return values.length > 0 ? values[0] : opt_default;
  } else {
    return values.length > 0 ? String(values[0]) : opt_default;
  }
};
goog.Uri.QueryData.prototype.setValues = function(key, values) {
  this.remove(key);
  if (values.length > 0) {
    this.invalidateCache_();
    this.keyMap_.set(this.getKeyName_(key), goog.array.clone(values));
    this.count_ = goog.asserts.assertNumber(this.count_) + values.length;
  }
};
goog.Uri.QueryData.prototype.toString = function() {
  if (this.encodedQuery_) {
    return this.encodedQuery_;
  }
  if (!this.keyMap_) {
    return "";
  }
  for (var sb = [], keys = this.keyMap_.getKeys(), i = 0;i < keys.length;i++) {
    for (var key = keys[i], encodedKey = goog.string.urlEncode(key), val = this.getValues(key), j = 0;j < val.length;j++) {
      var param = encodedKey;
      if (val[j] !== "") {
        param += "=" + goog.string.urlEncode(val[j]);
      }
      sb.push(param);
    }
  }
  return this.encodedQuery_ = sb.join("&");
};
goog.Uri.QueryData.prototype.invalidateCache_ = function() {
  this.encodedQuery_ = null;
};
goog.Uri.QueryData.prototype.clone = function() {
  var rv = new goog.Uri.QueryData;
  rv.encodedQuery_ = this.encodedQuery_;
  if (this.keyMap_) {
    rv.keyMap_ = this.keyMap_.clone();
    rv.count_ = this.count_;
  }
  return rv;
};
goog.Uri.QueryData.prototype.getKeyName_ = function(arg) {
  var keyName = String(arg);
  if (this.ignoreCase_) {
    keyName = keyName.toLowerCase();
  }
  return keyName;
};
goog.Uri.QueryData.prototype.setIgnoreCase = function(ignoreCase) {
  if (ignoreCase && !this.ignoreCase_) {
    this.ensureKeyMapInitialized_();
    this.invalidateCache_();
    this.keyMap_.forEach(function(value, key) {
      var lowerCase = key.toLowerCase();
      if (key != lowerCase) {
        this.remove(key);
        this.setValues(lowerCase, value);
      }
    }, this);
  }
  this.ignoreCase_ = ignoreCase;
};
goog.Uri.QueryData.prototype.extend = function(var_args) {
  for (var i = 0;i < arguments.length;i++) {
    goog.structs.forEach(arguments[i], function(value, key) {
      this.add(key, value);
    }, this);
  }
};
mr.cast.PresentationUrl = function(appInfos, opt_clientId, opt_autoJoinPolicy, opt_defaultActionPolicy, opt_launchTimeout, opt_appName, opt_dialPostData, opt_invisibleSender, opt_broadcastNamespace, opt_broadcastMessage) {
  this.appInfos_ = appInfos;
  this.clientId_ = opt_clientId || null;
  this.autoJoinPolicy_ = opt_autoJoinPolicy || null;
  this.defaultActionPolicy_ = opt_defaultActionPolicy || null;
  this.launchTimeout_ = goog.isDef(opt_launchTimeout) ? opt_launchTimeout : null;
  this.appName_ = opt_appName || null;
  this.dialPostData_ = opt_dialPostData || null;
  this.invisibleSender_ = opt_invisibleSender || false;
  this.broadcastNamespace_ = opt_broadcastNamespace || null;
  this.broadcastMessage_ = opt_broadcastMessage || null;
};
mr.cast.PresentationUrl.extractParameter_ = function(str, key) {
  var match = str.match(key + mr.cast.PresentationUrl.PARAM_REGEX_);
  return match ? match[1] : null;
};
mr.cast.PresentationUrl.extractParameters_ = function(str, key) {
  return str.match(new RegExp(key + mr.cast.PresentationUrl.PARAM_REGEX_, "g"));
};
mr.cast.PresentationUrl.extractAppInfos_ = function(str) {
  var appIds = mr.cast.PresentationUrl.extractParameters_(str, mr.cast.PresentationUrl.APP_ID_);
  if (appIds == null) {
    return [];
  }
  return goog.array.filter(goog.array.map(appIds, function(appId) {
    var appIdParam = mr.cast.PresentationUrl.extractParameter_(appId, mr.cast.PresentationUrl.APP_ID_);
    if (!appIdParam) {
      return null;
    }
    var matches = appIdParam.match(mr.cast.PresentationUrl.APP_ID_REGEX_);
    if (!matches || matches.length == 0) {
      return null;
    }
    var capabilities = [];
    if (matches.length == 3 && matches[2]) {
      capabilities = matches[2].split(",");
    }
    return {appId:matches[1], capabilities:capabilities};
  }), function(appInfo) {
    return appInfo != null;
  });
};
mr.cast.PresentationUrl.extractLaunchTimeout_ = function(str) {
  var param = mr.cast.PresentationUrl.extractParameter_(str, mr.cast.PresentationUrl.LAUNCH_TIMEOUT_);
  if (param == null) {
    return null;
  }
  var timeout = Number(param);
  return !isNaN(timeout) && timeout >= 0 ? timeout : null;
};
mr.cast.PresentationUrl.extractAppName_ = function(str) {
  return mr.cast.PresentationUrl.extractParameter_(str, mr.cast.PresentationUrl.APP_NAME_);
};
mr.cast.PresentationUrl.extractDialPostData_ = function(str) {
  return mr.cast.PresentationUrl.extractParameter_(str, mr.cast.PresentationUrl.DIAL_POST_DATA_);
};
mr.cast.PresentationUrl.extractClientId = function(str) {
  return mr.cast.PresentationUrl.extractParameter_(str, mr.cast.PresentationUrl.CLIENT_ID_);
};
mr.cast.PresentationUrl.extractAutoJoinPolicy = function(str) {
  return mr.cast.PresentationUrl.extractParameter_(str, mr.cast.PresentationUrl.AUTO_JOIN_POLICY_);
};
mr.cast.PresentationUrl.extractBroadcastNamespace_ = function(str) {
  return mr.cast.PresentationUrl.extractParameter_(str, mr.cast.PresentationUrl.BROADCAST_NAMESPACE_);
};
mr.cast.PresentationUrl.extractBroadcastMessage_ = function(str) {
  var data = mr.cast.PresentationUrl.extractParameter_(str, mr.cast.PresentationUrl.BROADCAST_MESSAGE_);
  if (!data) {
    return null;
  }
  return JSON.parse(decodeURIComponent(data));
};
mr.cast.PresentationUrl.extractDefaultActionPolicy_ = function(str) {
  return mr.cast.PresentationUrl.extractParameter_(str, mr.cast.PresentationUrl.DEFAULT_ACTION_POLICY_);
};
mr.cast.PresentationUrl.extractInvisibleSender_ = function(str) {
  var parameter = mr.cast.PresentationUrl.extractParameter_(str, mr.cast.PresentationUrl.INVISIBLE_SENDER_);
  return goog.isNull(parameter) ? null : parameter == "true";
};
mr.cast.PresentationUrl.prototype.getAppIds = function() {
  return goog.array.map(this.appInfos_, function(appInfo) {
    return appInfo.appId;
  });
};
mr.cast.PresentationUrl.prototype.toString = function() {
  var uri = new goog.Uri;
  uri.setScheme("https");
  uri.setDomain(mr.cast.PresentationUrl.HOST_);
  uri.setPath(mr.cast.PresentationUrl.PATH_);
  var fragments = [];
  goog.array.forEach(this.appInfos_, function(appInfo) {
    var fragment = mr.cast.PresentationUrl.APP_ID_ + "=" + appInfo.appId;
    if (appInfo.capabilities && appInfo.capabilities.length > 0) {
      fragment = fragment + "(" + appInfo.capabilities.join(",");
      fragment += ")";
    }
    fragments.push(fragment);
  });
  if (this.clientId_) {
    fragments.push(mr.cast.PresentationUrl.CLIENT_ID_ + "=" + this.clientId_);
  }
  if (this.autoJoinPolicy_) {
    fragments.push(mr.cast.PresentationUrl.AUTO_JOIN_POLICY_ + "=" + this.autoJoinPolicy_);
  }
  if (this.defaultActionPolicy_) {
    fragments.push(mr.cast.PresentationUrl.DEFAULT_ACTION_POLICY_ + "=" + this.defaultActionPolicy_);
  }
  if (this.launchTimeout_ != null) {
    fragments.push(mr.cast.PresentationUrl.LAUNCH_TIMEOUT_ + "=" + this.launchTimeout_);
  }
  if (this.appName_) {
    fragments.push(mr.cast.PresentationUrl.APP_NAME_ + "=" + this.appName_);
  }
  if (this.dialPostData_) {
    fragments.push(mr.cast.PresentationUrl.DIAL_POST_DATA_ + "=" + this.dialPostData_);
  }
  if (this.invisibleSender_) {
    fragments.push(mr.cast.PresentationUrl.INVISIBLE_SENDER_ + "=true");
  }
  if (this.broadcastNamespace_) {
    fragments.push(mr.cast.PresentationUrl.BROADCAST_NAMESPACE_ + "=" + this.broadcastNamespace_);
    fragments.push(mr.cast.PresentationUrl.BROADCAST_ID_ + "=" + Math.random());
  }
  if (this.broadcastMessage_) {
    fragments.push(mr.cast.PresentationUrl.BROADCAST_MESSAGE_ + "=" + encodeURIComponent(JSON.stringify(this.broadcastMessage_)));
  }
  uri.setFragment(fragments.join("/"));
  return uri.toString();
};
mr.cast.PresentationUrl.createFromUrl = function(url) {
  var uri = new goog.Uri(url);
  if (uri.getScheme() != "https" || uri.getDomain() != mr.cast.PresentationUrl.HOST_ || uri.getPath() != mr.cast.PresentationUrl.PATH_) {
    return null;
  }
  var fragment = uri.getFragment(), appInfos = mr.cast.PresentationUrl.extractAppInfos_(fragment);
  if (!appInfos || appInfos.length == 0) {
    return null;
  }
  var clientId = mr.cast.PresentationUrl.extractClientId(fragment), autoJoinPolicy = mr.cast.PresentationUrl.extractAutoJoinPolicy(fragment), defaultActionPolicy = mr.cast.PresentationUrl.extractDefaultActionPolicy_(fragment), launchTimeout = mr.cast.PresentationUrl.extractLaunchTimeout_(fragment), appName = mr.cast.PresentationUrl.extractAppName_(fragment), dialPostData = mr.cast.PresentationUrl.extractDialPostData_(fragment), invisibleSender = mr.cast.PresentationUrl.extractInvisibleSender_(fragment), 
  broadcastNamespace = mr.cast.PresentationUrl.extractBroadcastNamespace_(fragment), broadcastMessage = mr.cast.PresentationUrl.extractBroadcastMessage_(fragment);
  return new mr.cast.PresentationUrl(appInfos, clientId, autoJoinPolicy, defaultActionPolicy, launchTimeout, appName, dialPostData, invisibleSender, broadcastNamespace, broadcastMessage);
};
mr.cast.PresentationUrl.getAppIdsFromUrl = function(url) {
  var presentationUrl = mr.cast.PresentationUrl.createFromUrl(url);
  return presentationUrl ? presentationUrl.getAppIds() : null;
};
mr.cast.PresentationUrl.getClientIdFromUrl = function(url) {
  var presentationUrl = mr.cast.PresentationUrl.createFromUrl(url);
  return presentationUrl ? presentationUrl.clientId_ : null;
};
mr.cast.PresentationUrl.HOST_ = "google.com";
mr.cast.PresentationUrl.PATH_ = "/cast";
mr.cast.PresentationUrl.APP_ID_ = "__castAppId__";
mr.cast.PresentationUrl.APP_NAME_ = "__dialAppName__";
mr.cast.PresentationUrl.DIAL_POST_DATA_ = "__dialPostData__";
mr.cast.PresentationUrl.CLIENT_ID_ = "__castClientId__";
mr.cast.PresentationUrl.AUTO_JOIN_POLICY_ = "__castAutoJoinPolicy__";
mr.cast.PresentationUrl.DEFAULT_ACTION_POLICY_ = "__castDefaultActionPolicy__";
mr.cast.PresentationUrl.LAUNCH_TIMEOUT_ = "__castLaunchTimeout__";
mr.cast.PresentationUrl.INVISIBLE_SENDER_ = "__castInvisibleSender__";
mr.cast.PresentationUrl.BROADCAST_NAMESPACE_ = "__castBroadcastNamespace__";
mr.cast.PresentationUrl.BROADCAST_ID_ = "__castBroadcastId__";
mr.cast.PresentationUrl.BROADCAST_MESSAGE_ = "__castBroadcastMessage__";
mr.cast.PresentationUrl.PARAM_REGEX_ = "=([^/]*)";
mr.cast.PresentationUrl.APP_ID_REGEX_ = /(^\w+)(?:\(([\w,\ ]*)\))?$/;
mr.cast.SessionMediaUpdater = function() {
  this.sessions_ = {};
  this.media_ = {};
};
mr.cast.SessionMediaUpdater.prototype.removeSessionById = function(sessionId, finalSessionStatus) {
  var $jscomp$this = this, existingSession = this.sessions_[sessionId];
  if (existingSession) {
    existingSession.status = finalSessionStatus;
    existingSession.media.forEach(function(e) {
      delete $jscomp$this.media_[mr.cast.SessionMediaUpdater.getMediaKey_(e)];
    });
    delete this.sessions_[sessionId];
    return true;
  }
  return false;
};
mr.cast.SessionMediaUpdater.prototype.createOrUpdateSession = function(session) {
  var $jscomp$this = this, existingSession = this.sessions_[session.sessionId];
  if (existingSession) {
    existingSession.statusText = session.statusText;
    existingSession.namespaces = session.namespaces || [];
    existingSession.receiver.volume = session.receiver.volume;
    return existingSession;
  } else {
    var newSession = new chrome.cast.Session(session.sessionId, session.appId, session.displayName, session.appImages, session.receiver), key;
    for (key in session) {
      if (key == "media") {
        newSession.media = session.media.map(function(media) {
          media = $jscomp$this.createOrUpdateMedia(media);
          media.loadedByThisSender = false;
          media.hasBeenReported = true;
          return media;
        });
      } else {
        if (session.hasOwnProperty(key)) {
          newSession[key] = session[key];
        }
      }
    }
    return this.sessions_[session.sessionId] = newSession;
  }
};
mr.cast.SessionMediaUpdater.prototype.createOrUpdateMedia = function(newState) {
  var mediaKey = mr.cast.SessionMediaUpdater.getMediaKey_(newState), media = this.media_[mediaKey];
  if (!media) {
    media = new chrome.cast.media.Media(newState.sessionId, newState.mediaSessionId);
    this.media_[mediaKey] = media;
    var session = this.sessions_[newState.sessionId];
    if (session) {
      session.media.push(media);
    }
  }
  mr.cast.SessionMediaUpdater.updateMedia_(media, newState);
  return media;
};
mr.cast.SessionMediaUpdater.getMediaKey_ = function(media) {
  return media.sessionId + "#" + media.mediaSessionId;
};
mr.cast.SessionMediaUpdater.updateMedia_ = function(media, newState) {
  media.currentItemId = null;
  media.loadingItemId = null;
  media.preloadedItemId = null;
  for (var key in newState) {
    if (key == "items") {
    } else {
      if (newState.hasOwnProperty(key)) {
        if (key == "volume") {
          media.volume.level = newState.volume.level;
          media.volume.muted = newState.volume.muted;
        } else {
          media[key] = newState[key];
        }
      }
    }
  }
  if ("currentTime" in newState) {
    media.lastCurrentTimeUpdate = Date.now();
  }
  if (!mr.cast.SessionMediaUpdater.hasQueueEnded_(media.playerState, media.loadingItemId)) {
    mr.cast.SessionMediaUpdater.updateItemsInMedia_(media, newState);
  } else {
    media.currentItemId = null;
    media.loadingItemId = null;
    media.preloadedItemId = null;
    media.items = null;
  }
};
mr.cast.SessionMediaUpdater.hasQueueEnded_ = function(playerState, loadingItemId) {
  return playerState == chrome.cast.media.PlayerState.IDLE && loadingItemId == null;
};
mr.cast.SessionMediaUpdater.buildItemIdToIndexMap_ = function(items) {
  var itemIdToIndex = {};
  if (items) {
    for (var i = 0;i < items.length;i++) {
      itemIdToIndex[items[i].itemId] = i;
    }
  }
  return itemIdToIndex;
};
mr.cast.SessionMediaUpdater.prototype.removeMedia = function(media) {
  delete this.media_[mr.cast.SessionMediaUpdater.getMediaKey_(media)];
  var session = this.sessions_[media.sessionId];
  if (session) {
    var index = session.media.indexOf(media);
    if (index != -1) {
      session.media.splice(index, 1);
    }
  }
};
mr.cast.SessionMediaUpdater.updateItemsInMedia_ = function(media, newState) {
  if (!newState.hasOwnProperty("items") || !newState.items) {
    return;
  }
  for (var newItemsWithMediaInfo = [], itemIdToOldIndex = mr.cast.SessionMediaUpdater.buildItemIdToIndexMap_(media.items), $jscomp$iter$0 = $jscomp.makeIterator(newState.items), $jscomp$key$newItem = $jscomp$iter$0.next();!$jscomp$key$newItem.done;$jscomp$key$newItem = $jscomp$iter$0.next()) {
    var newItem = $jscomp$key$newItem.value;
    if (!newItem.media) {
      var itemId = newItem.itemId, oldItem = media.items ? media.items[itemIdToOldIndex[itemId]] : null;
      if (oldItem && oldItem.media) {
        newItem.media = oldItem.media;
      } else {
        if (itemId == media.currentItemId && media.media) {
          newItem.media = media.media;
        }
      }
    }
    newItemsWithMediaInfo.push(mr.cast.SessionMediaUpdater.createQueueItem_(newItem));
  }
  media.items = newItemsWithMediaInfo;
};
mr.cast.SessionMediaUpdater.createQueueItem_ = function(newState) {
  var item = new chrome.cast.media.QueueItem(newState.media), key;
  for (key in newState) {
    if (newState.hasOwnProperty(key)) {
      item[key] = newState[key];
    }
  }
  return item;
};
mr.cast.Api = function() {
  this.extensionMessenger_ = new mr.cast.ExtensionMessenger(this);
  this.apiConfig_ = null;
  this.sessionUpdater_ = new mr.cast.SessionMediaUpdater;
  this.sequenceNumber_ = 0;
  this.callbacks_ = new mr.cast.PendingRequestsManager;
  this.sessionUpdateListeners_ = new goog.structs.Map;
  this.receiverAvailable_ = false;
  this.appMessageListeners_ = new goog.structs.Map;
  this.mediaListeners_ = new goog.structs.Map;
  this.receiverActionListeners_ = [];
  this.createOrUpdateMediaHandler_ = this.createOrUpdateMedia_.bind(this);
  this.requestSessionSuccessCallback_ = null;
  this.loadingMediaCount_ = 0;
  this.activeSessionId_ = null;
  this.broadcastThrottle_ = new goog.async.Throttle(this.sendBroadcastRequest_, mr.cast.Api.BROADCAST_INTERVAL_MS_, this);
  this.defaultRequest_ = null;
};
mr.cast.Api.invokeCallback = function(callback, opt_param) {
  if (callback) {
    callback(opt_param);
  }
};
mr.cast.Api.invokeErrorCallback = function(errorCallback, error) {
  mr.cast.Api.invokeCallback(errorCallback, error);
};
mr.cast.Api.prototype.createCallbackInfo_ = function(successCallback, errorCallback, opt_timeoutMillis) {
  return new mr.cast.ApiCallbackInfo(this.sequenceNumber_, successCallback, errorCallback, opt_timeoutMillis);
};
mr.cast.Api.prototype.sendToExtension_ = function(message, opt_callbackInfo, opt_sequenceNumber) {
  if (opt_callbackInfo) {
    this.callbacks_.addRequest(opt_callbackInfo);
  }
  if (goog.isDef(opt_sequenceNumber)) {
    message.sequenceNumber = opt_sequenceNumber;
  } else {
    message.sequenceNumber = this.sequenceNumber_;
    this.sequenceNumber_ = (this.sequenceNumber_ + 1) % mr.cast.Constants.SEQUENCE_NUMBER_WRAP;
  }
  var errorMessage = this.extensionMessenger_.sendToBackground(message);
  if (!opt_callbackInfo) {
    return;
  }
  if (errorMessage) {
    var callbackInfo = this.callbacks_.removeRequest(message.sequenceNumber);
    mr.cast.Api.invokeErrorCallback(callbackInfo.errorCallback, new chrome.cast.Error(chrome.cast.ErrorCode.INVALID_PARAMETER, errorMessage));
  }
};
mr.cast.Api.prototype.initialize = function(apiConfig, successCallback) {
  var $jscomp$this = this;
  mr.cast.ApiInterface.instance = this;
  if (this.apiConfig_) {
    mr.cast.Api.invokeCallback(successCallback);
    return;
  }
  this.apiConfig_ = apiConfig;
  if (apiConfig.invisibleSender) {
    mr.cast.Api.invokeCallback(successCallback);
    return;
  }
  var request = new PresentationRequest(this.getPresentationUrl_());
  request.getAvailability().then(function(availability) {
    availability.onchange = function() {
      $jscomp$this.receiverAvailable_ = !!availability.value;
      $jscomp$this.apiConfig_.receiverListener(availability.value ? chrome.cast.ReceiverAvailability.AVAILABLE : chrome.cast.ReceiverAvailability.UNAVAILABLE);
    };
    availability.onchange();
  }, function() {
    $jscomp$this.apiConfig_.receiverListener(chrome.cast.ReceiverAvailability.AVAILABLE);
  });
  request.onconnectionavailable = function(e) {
    $jscomp$this.onConnection_(e.connection);
  };
  this.defaultRequest_ = goog.userAgent.getNavigator().presentation.defaultRequest = request;
  request.reconnect(chrome.cast.AUTO_JOIN_PRESENTATION_ID).then(function(connection) {
    $jscomp$this.onConnection_(connection);
  }, goog.nullFunction);
  mr.cast.Api.invokeCallback(successCallback);
};
mr.cast.Api.prototype.setPageContext = function(win) {
  win.navigator.presentation.defaultRequest = this.defaultRequest_;
};
mr.cast.Api.prototype.onConnection_ = function(connection, errorCallback) {
  errorCallback = errorCallback === undefined ? null : errorCallback;
  var $jscomp$this = this;
  connection.onclose = function(e) {
    $jscomp$this.requestSessionSuccessCallback_ = null;
    switch(e.reason) {
      case mr.PresentationConnectionCloseReason.CLOSED:
        $jscomp$this.onDisconnectSession_();
        break;
      case mr.PresentationConnectionCloseReason.ERROR:
        if (errorCallback) {
          mr.cast.Api.invokeErrorCallback(errorCallback, new chrome.cast.Error(chrome.cast.ErrorCode.SESSION_ERROR));
        }
    }
  };
  connection.onterminate = function() {
    $jscomp$this.onRemoveSession_();
  };
  if (connection.state == mr.PresentationConnectionState.CONNECTED) {
    this.extensionMessenger_.connect(connection);
  } else {
    connection.onconnect = function() {
      $jscomp$this.extensionMessenger_.connect(connection);
    };
  }
};
mr.cast.Api.prototype.broadcastOrSendMessage = function(namespace, request) {
  if (namespace != mr.cast.Namespace.Cast.MEDIA) {
    mr.cast.Api.logger_.error("Unsupported broadcast message namespace - " + namespace);
    return;
  }
  if (!mr.cast.Api.ALLOWED_BROADCAST_TYPES_.has(request.type)) {
    mr.cast.Api.logger_.error("Unsupported broadcast message type - " + request.type);
    return;
  }
  if (!this.receiverAvailable_) {
    return;
  }
  if (this.activeSessionId_) {
    request.sessionId = this.activeSessionId_;
    this.sendMediaRequest_(null, request.type, request, function() {
      mr.cast.Api.logger_.info("Send Broadcast directly succeeded");
    }, function(error) {
      mr.cast.Api.logger_.error("Send Broadcast directly failed with code " + error.code);
    });
    return;
  }
  this.broadcastThrottle_.fire(this.getPresentationUrl_(undefined, namespace, request));
};
mr.cast.Api.prototype.sendBroadcastRequest_ = function(url) {
  mr.cast.Api.logger_.info("Broadcast request " + url);
  var p = (new PresentationRequest(url)).getAvailability();
  if (!p) {
    mr.cast.Api.logger_.error("presentationRequest.getAvailability return undefined");
    return;
  }
  p.then(function() {
    mr.cast.Api.logger_.info("Broadcast succeeded");
  }, function() {
    mr.cast.Api.logger_.warning("Broadcast failed");
  });
};
mr.cast.Api.prototype.requestSession = function(successCallback, errorCallback, opt_sessionRequest) {
  var $jscomp$this = this;
  if (this.requestSessionSuccessCallback_) {
    mr.cast.Api.invokeErrorCallback(errorCallback, new chrome.cast.Error(chrome.cast.ErrorCode.INVALID_PARAMETER, "Already requesting session"));
    return;
  }
  var presentationUrl = this.getPresentationUrl_(opt_sessionRequest);
  this.requestSessionSuccessCallback_ = successCallback;
  (new PresentationRequest(presentationUrl.toString())).start().then(function(connection) {
    $jscomp$this.onConnection_(connection, errorCallback);
  }).catch(function(err) {
    $jscomp$this.requestSessionSuccessCallback_ = null;
    mr.cast.Api.invokeErrorCallback(errorCallback, new chrome.cast.Error(err.name == "AbortError" || err.name == "NotAllowedError" ? chrome.cast.ErrorCode.CANCEL : chrome.cast.ErrorCode.SESSION_ERROR));
  });
};
mr.cast.Api.prototype.getPresentationUrl_ = function(opt_sessionRequest, opt_broadcastNamespace, opt_broadcastRequest) {
  var dialName = null, dialPostData = null, sessionRequest = opt_sessionRequest || this.apiConfig_.sessionRequest, dialRequest = sessionRequest.dialRequest;
  if (dialRequest) {
    dialName = dialRequest.appName;
    if ((dialPostData = dialRequest.launchParameter) && !dialPostData.match(mr.cast.Api.BASE_64_REG_EX_)) {
      dialPostData = goog.crypt.base64.encodeString(dialPostData);
    }
  }
  var appInfoArray = [];
  appInfoArray.push({appId:sessionRequest.appId, capabilities:sessionRequest.capabilities});
  if (!opt_sessionRequest) {
    goog.array.forEach(this.apiConfig_.additionalSessionRequests, function(additionalSessionRequest) {
      appInfoArray.push({appId:additionalSessionRequest.appId, capabilities:additionalSessionRequest.capabilities});
    });
  }
  return (new mr.cast.PresentationUrl(appInfoArray, this.extensionMessenger_.clientId_, this.apiConfig_.autoJoinPolicy, this.apiConfig_.defaultActionPolicy, sessionRequest.requestSessionTimeout, dialName, dialPostData, this.apiConfig_.invisibleSender, opt_broadcastNamespace, opt_broadcastRequest)).toString();
};
mr.cast.Api.prototype.sendLoadMediaRequest = function(request, type, successCallback, errorCallback) {
  var $jscomp$this = this;
  this.loadingMediaCount_++;
  this.sendMediaRequest_(null, type, request, function(media) {
    $jscomp$this.loadingMediaCount_--;
    media.hasBeenReported = true;
    mr.cast.Api.invokeCallback(successCallback, media);
  }, function(error) {
    $jscomp$this.loadingMediaCount_--;
    errorCallback(error);
  }, chrome.cast.media.timeout.load);
};
mr.cast.Api.prototype.sendMediaUpdateRequest = function(media$jscomp$0, type, request, successCallback, errorCallback, opt_timeoutMillis) {
  var $jscomp$this = this;
  this.sendMediaRequest_(media$jscomp$0, type, request, function(media) {
    $jscomp$this.callMediaListeners_(media);
    mr.cast.Api.invokeCallback(successCallback);
  }, errorCallback, opt_timeoutMillis);
};
mr.cast.Api.prototype.sendMediaRequest_ = function(media, type, request, successCallback, errorCallback, opt_timeoutMillis) {
  request.type = type;
  if (media != null) {
    request.mediaSessionId = media.mediaSessionId;
    request.sessionId = media.sessionId;
  }
  this.sendApiRequest(request, function(message) {
    if (message.status && message.status.length == 1) {
      mr.cast.Api.invokeCallback(successCallback, message.status[0]);
    } else {
      mr.cast.Api.invokeErrorCallback(errorCallback, new chrome.cast.Error(chrome.cast.ErrorCode.SESSION_ERROR));
    }
  }, errorCallback, opt_timeoutMillis);
};
mr.cast.Api.prototype.setReceiverVolume = function(sessionId, volumeRequest, successCallback, errorCallback) {
  volumeRequest.sessionId = sessionId;
  this.sendToExtension_(new mr.cast.InternalMessage(mr.cast.InternalMessageType.V2_MESSAGE, volumeRequest, undefined, chrome.cast.timeout.setReceiverVolume), this.createCallbackInfo_(successCallback, errorCallback, chrome.cast.timeout.sendCustomMessage));
};
mr.cast.Api.prototype.requestSessionById = function(sessionId) {
  var $jscomp$this = this;
  (new PresentationRequest(this.getPresentationUrl_())).reconnect(chrome.cast.PRESENTATION_ID_PREFIX + sessionId).then(function(connection) {
    $jscomp$this.onConnection_(connection);
  }, goog.nullFunction);
};
mr.cast.Api.prototype.leaveSession = function(sessionId, successCallback, errorCallback) {
  this.sendToExtension_(new mr.cast.InternalMessage(mr.cast.InternalMessageType.LEAVE_SESSION, sessionId, undefined, chrome.cast.timeout.leaveSession), this.createCallbackInfo_(successCallback, errorCallback, chrome.cast.timeout.leaveSession));
};
mr.cast.Api.prototype.sendAppRequest = function(request, successCallback, errorCallback) {
  this.sendToExtension_(new mr.cast.InternalMessage(mr.cast.InternalMessageType.APP_MESSAGE, request, undefined, chrome.cast.timeout.sendCustomMessage), this.createCallbackInfo_(successCallback, errorCallback, chrome.cast.timeout.sendCustomMessage));
};
mr.cast.Api.prototype.sendApiRequest = function(request, successCallback, errorCallback, opt_timeoutMillis) {
  this.sendToExtension_(new mr.cast.InternalMessage(mr.cast.InternalMessageType.V2_MESSAGE, request, undefined, opt_timeoutMillis), this.createCallbackInfo_(successCallback, errorCallback, opt_timeoutMillis));
};
mr.cast.Api.mapSetAdd_ = function(map, key, value) {
  var values = map.get(key);
  if (!values) {
    values = new goog.structs.Set;
    map.set(key, values);
  }
  values.add(value);
};
mr.cast.Api.mapSetRemove_ = function(map, key, value) {
  var values = map.get(key);
  if (values) {
    values.remove(value);
  }
};
mr.cast.Api.prototype.addSessionUpdateListener = function(sessionId, listener) {
  mr.cast.Api.mapSetAdd_(this.sessionUpdateListeners_, sessionId, listener);
};
mr.cast.Api.prototype.removeSessionUpdateListener = function(sessionId, listener) {
  mr.cast.Api.mapSetRemove_(this.sessionUpdateListeners_, sessionId, listener);
};
mr.cast.Api.prototype.addReceiverActionListener = function(listener) {
  this.receiverActionListeners_.push(listener);
};
mr.cast.Api.prototype.removeReceiverActionListener = function(listener) {
  var index = this.receiverActionListeners_.indexOf(listener);
  if (index >= 0) {
    this.receiverActionListeners_.splice(index, 1);
  }
};
mr.cast.Api.prototype.addAppMessageListener = function(sessionId, namespace, listener) {
  var namespaceListeners = this.appMessageListeners_.get(sessionId);
  if (!namespaceListeners) {
    namespaceListeners = new goog.structs.Map;
    this.appMessageListeners_.set(sessionId, namespaceListeners);
  }
  var listeners = namespaceListeners.get(namespace);
  if (!listeners) {
    listeners = new goog.structs.Set;
    namespaceListeners.set(namespace, listeners);
  }
  listeners.add(listener);
};
mr.cast.Api.prototype.removeAppMessageListener = function(sessionId, namespace, listener) {
  var namespaceListeners = this.appMessageListeners_.get(sessionId);
  if (!namespaceListeners) {
    return;
  }
  var listeners = namespaceListeners.get(namespace);
  if (!listeners) {
    return;
  }
  listeners.remove(listener);
};
mr.cast.Api.prototype.addMediaListener = function(sessionId, listener) {
  mr.cast.Api.mapSetAdd_(this.mediaListeners_, sessionId, listener);
};
mr.cast.Api.prototype.removeMediaListener = function(sessionId, listener) {
  mr.cast.Api.mapSetRemove_(this.mediaListeners_, sessionId, listener);
};
mr.cast.Api.prototype.addMediaUpdateListener = function(media, listener) {
  if (media.updateListeners.indexOf(listener) == -1) {
    media.updateListeners.push(listener);
  }
};
mr.cast.Api.prototype.removeMediaUpdateListener = function(media, listener) {
  var index = media.updateListeners.indexOf(listener);
  if (index != -1) {
    media.updateListeners.splice(index, 1);
  }
};
mr.cast.Api.prototype.invokeCallbacks_ = function(message) {
  var callbackInfo = this.callbacks_.removeRequest(message.sequenceNumber);
  if (!callbackInfo) {
    return;
  }
  if (message.type == mr.cast.InternalMessageType.ERROR) {
    mr.cast.Api.invokeErrorCallback(callbackInfo.errorCallback, message.message);
  } else {
    mr.cast.Api.invokeCallback(callbackInfo.successCallback, message.message);
  }
};
mr.cast.Api.prototype.isMediaAlive_ = function(media) {
  return media.playerState != chrome.cast.media.PlayerState.IDLE || media.loadingItemId != null;
};
mr.cast.Api.prototype.callMediaListeners_ = function(media) {
  if (!media.hasBeenReported) {
    if (this.loadingMediaCount_ > 0) {
      return;
    }
    media.hasBeenReported = true;
    var listeners = this.mediaListeners_.get(media.sessionId);
    if (!listeners) {
      return;
    }
    goog.iter.forEach(listeners.__iterator__(), function(listener) {
      listener(media);
    });
  } else {
    var isAlive = this.isMediaAlive_(media);
    media.updateListeners.forEach(function(listener) {
      listener(isAlive);
    });
    if (!isAlive) {
      this.sessionUpdater_.removeMedia(media);
    }
  }
};
mr.cast.Api.prototype.createOrUpdateMedia_ = function(newState) {
  return this.sessionUpdater_.createOrUpdateMedia(newState);
};
mr.cast.Api.prototype.maybeRecreateObject_ = function(message) {
  switch(message.type) {
    case mr.cast.InternalMessageType.NEW_SESSION:
    case mr.cast.InternalMessageType.UPDATE_SESSION:
      message.message = this.sessionUpdater_.createOrUpdateSession(message.message);
      break;
    case mr.cast.InternalMessageType.V2_MESSAGE:
      var v2Message = message.message;
      if (v2Message && v2Message.type == mr.cast.MessageType.MEDIA_STATUS && v2Message.status) {
        v2Message.status = v2Message.status.map(this.createOrUpdateMediaHandler_);
      }
  }
};
mr.cast.Api.prototype.removeSessionById_ = function(finalSessionStatus) {
  if (!this.activeSessionId_) {
    return;
  }
  var sessionId = this.activeSessionId_;
  this.activeSessionId_ = null;
  this.extensionMessenger_.disconnect();
  var isAlive = finalSessionStatus != chrome.cast.SessionStatus.STOPPED;
  if (!this.sessionUpdater_.removeSessionById(sessionId, finalSessionStatus)) {
    return;
  }
  this.appMessageListeners_.remove(sessionId);
  this.mediaListeners_.remove(sessionId);
  var listeners = this.sessionUpdateListeners_.get(sessionId);
  if (!listeners) {
    return;
  }
  this.sessionUpdateListeners_.remove(sessionId);
  goog.iter.forEach(listeners.__iterator__(), function(listener) {
    listener(isAlive);
  });
};
mr.cast.Api.prototype.onMessage = function(message) {
  this.maybeRecreateObject_(message);
  this.invokeCallbacks_(message);
  var payload = message.message;
  if (!payload) {
    return;
  }
  switch(message.type) {
    case mr.cast.InternalMessageType.RECEIVER_ACTION:
      this.onReceiverAction_(payload);
      break;
    case mr.cast.InternalMessageType.NEW_SESSION:
      this.onNewSession_(payload);
      break;
    case mr.cast.InternalMessageType.UPDATE_SESSION:
      this.onUpdateSession_(payload);
      break;
    case mr.cast.InternalMessageType.APP_MESSAGE:
      this.onAppMessage_(payload);
      break;
    case mr.cast.InternalMessageType.V2_MESSAGE:
      this.onV2Message_(payload);
      break;
    case mr.cast.InternalMessageType.CUSTOM_DIAL_LAUNCH:
      this.onCustomDialLaunchRequest_(message.sequenceNumber, payload);
  }
};
mr.cast.Api.prototype.onNewSession_ = function(session) {
  this.activeSessionId_ = session.sessionId;
  if (this.requestSessionSuccessCallback_) {
    this.requestSessionSuccessCallback_(session);
    this.requestSessionSuccessCallback_ = null;
  } else {
    if (this.apiConfig_) {
      this.apiConfig_.sessionListener(session);
    }
  }
};
mr.cast.Api.prototype.onUpdateSession_ = function(session) {
  var listeners = this.sessionUpdateListeners_.get(session.sessionId);
  if (!listeners) {
    return;
  }
  goog.iter.forEach(listeners.__iterator__(), function(listener) {
    listener(true);
  });
};
mr.cast.Api.prototype.onReceiverAction_ = function(receiverAction) {
  this.receiverActionListeners_.forEach(function(listener) {
    listener(receiverAction.receiver, receiverAction.action);
  });
};
mr.cast.Api.prototype.onDisconnectSession_ = function() {
  this.removeSessionById_(chrome.cast.SessionStatus.DISCONNECTED);
};
mr.cast.Api.prototype.onRemoveSession_ = function() {
  this.removeSessionById_(chrome.cast.SessionStatus.STOPPED);
};
mr.cast.Api.prototype.onAppMessage_ = function(message) {
  var namespaceListeners = this.appMessageListeners_.get(message.sessionId);
  if (!namespaceListeners) {
    return;
  }
  var listeners = namespaceListeners.get(message.namespaceName);
  if (!listeners) {
    return;
  }
  goog.iter.forEach(listeners.__iterator__(), function(listener) {
    listener(message.namespaceName, message.message);
  });
};
mr.cast.Api.prototype.onV2Message_ = function(v2Message) {
  if (v2Message.type == mr.cast.MessageType.MEDIA_STATUS) {
    v2Message.status.forEach(this.callMediaListeners_.bind(this));
  }
};
mr.cast.Api.prototype.sendCustomDialLaunchResponse_ = function(sequenceNumber, opt_response) {
  this.sendToExtension_(new mr.cast.InternalMessage(mr.cast.InternalMessageType.CUSTOM_DIAL_LAUNCH, opt_response, undefined, chrome.cast.timeout.sendCustomMessage), null, sequenceNumber);
};
mr.cast.Api.prototype.onCustomDialLaunchRequest_ = function(sequenceNumber, request) {
  var $jscomp$this = this;
  if (this.apiConfig_.customDialLaunchCallback) {
    this.apiConfig_.customDialLaunchCallback(request).then(function(response) {
      $jscomp$this.sendCustomDialLaunchResponse_(sequenceNumber, response);
    }, function() {
      $jscomp$this.sendCustomDialLaunchResponse_(sequenceNumber);
    });
  } else {
    this.sendCustomDialLaunchResponse_(sequenceNumber);
  }
};
mr.cast.Api.BASE_64_REG_EX_ = new RegExp("^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$");
mr.cast.Api.ALLOWED_BROADCAST_TYPES_ = new Set([mr.cast.MessageType.PRECACHE]);
mr.cast.Api.BROADCAST_INTERVAL_MS_ = 200;
mr.cast.Api.api = new mr.cast.Api;
mr.cast.Api.logger_ = mr.Logger.getInstance("mr.cast.Api");
chrome.cast.initialize = function(apiConfig, successCallback, errorCallback) {
  mr.cast.Api.api.initialize(apiConfig, successCallback, errorCallback);
};
goog.exportSymbol("chrome.cast.initialize", chrome.cast.initialize);
chrome.cast.initializeWithContext = function(apiConfig, successCallback, errorCallback) {
  var api = new mr.cast.Api;
  api.initialize(apiConfig, successCallback, errorCallback);
  return api;
};
goog.exportSymbol("chrome.cast.initializeWithContext", chrome.cast.initializeWithContext);
chrome.cast.setPageContext = function(win) {
  mr.cast.Api.api.setPageContext(win);
};
goog.exportSymbol("chrome.cast.setPageContext", chrome.cast.setPageContext);
chrome.cast.requestSession = function(successCallback, errorCallback, opt_sessionRequest) {
  mr.cast.Api.api.requestSession(successCallback, errorCallback, opt_sessionRequest);
};
goog.exportSymbol("chrome.cast.requestSession", chrome.cast.requestSession);
chrome.cast.precache = function(data) {
  mr.cast.Api.api.broadcastOrSendMessage(mr.cast.Namespace.Cast.MEDIA, new chrome.cast.media.PrecacheRequest(data));
};
goog.exportSymbol("chrome.cast.precache", chrome.cast.precache);
chrome.cast.requestSessionById = function(sessionId) {
  chrome.cast.requestSessionByIdWithContext(mr.cast.Api.api, sessionId);
};
goog.exportSymbol("chrome.cast.requestSessionById", chrome.cast.requestSessionById);
chrome.cast.requestSessionByIdWithContext = function(context, sessionId) {
  context.requestSessionById(sessionId);
};
goog.exportSymbol("chrome.cast.requestSessionByIdWithContext", chrome.cast.requestSessionByIdWithContext);
chrome.cast.addReceiverActionListener = function(listener) {
  mr.cast.Api.api.addReceiverActionListener(listener);
};
goog.exportSymbol("chrome.cast.addReceiverActionListener", chrome.cast.addReceiverActionListener);
chrome.cast.removeReceiverActionListener = function(listener) {
  mr.cast.Api.api.removeReceiverActionListener(listener);
};
goog.exportSymbol("chrome.cast.removeReceiverActionListener", chrome.cast.removeReceiverActionListener);
chrome.cast.logMessage = function() {
};
goog.exportSymbol("chrome.cast.logMessage", chrome.cast.logMessage);
chrome.cast.setCustomReceivers = function(receivers, successCallback) {
  successCallback();
};
goog.exportSymbol("chrome.cast.setCustomReceivers", chrome.cast.setCustomReceivers);
chrome.cast.setReceiverDisplayStatus = function(receiver, successCallback) {
  successCallback();
};
goog.exportSymbol("chrome.cast.setReceiverDisplayStatus", chrome.cast.setReceiverDisplayStatus);
chrome.cast.unescape = function(escaped) {
  return goog.string.unescapeEntities(escaped);
};
goog.exportSymbol("chrome.cast.unescape", chrome.cast.unescape);
chrome.cast.isAvailable = false;
goog.exportSymbol("chrome.cast.isAvailable", chrome.cast.isAvailable);
chrome.cast.setupCastApiCalled_ = false;
chrome.cast.setupCastApi_ = function() {
  if (chrome.cast.setupCastApiCalled_) {
    return;
  }
  chrome.cast.setupCastApiCalled_ = true;
  chrome.cast.isAvailable = true;
  var callback = window.__onGCastApiAvailable;
  if (callback && typeof callback == "function") {
    callback(true);
  }
};
if (document.readyState == "complete") {
  chrome.cast.setupCastApi_();
} else {
  window.addEventListener("load", chrome.cast.setupCastApi_, false);
  window.addEventListener("DOMContentLoaded", chrome.cast.setupCastApi_, false);
}
;}).call(window);
