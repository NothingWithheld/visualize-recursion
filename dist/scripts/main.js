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
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
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
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/scripts/recursive_modules/factorial.js":
/*!****************************************************!*\
  !*** ./src/scripts/recursive_modules/factorial.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function factorialBlockMaker(n) {
  var isFirstCall = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  var factorialBlock = document.createElement('dl');
  factorialBlock.classList.add('factorial-block--new');

  if (isFirstCall) {
    factorialBlock.classList.add('factorial-block__initial-call');
    factorialBlock.innerHTML = "<dt class=\"factorial-block__call-type factorial-block__top-row\">Initial Call</dt>\n                                    <dd class=\"factorial-block__function-name factorial-block__bottom-row\">factorial(".concat(n, ")</dd>\n                                    <dt class=\"factorial-block__equivalent factorial-block__top-row\">equivalent to</dt>\n                                    <dd class=\"factorial-block__equivalent-value factorial-block__bottom-row\">").concat(n, " * factorial(").concat(n - 1, ")</dd>\n                                    <dt class=\"factorial-block__return-header factorial-block__top-row\">return value</dt>\n                                    <dd class=\"factorial-block__return-value factorial-block__bottom-row\">waiting</dd>");
  } else if (n == 1) {
    factorialBlock.innerHTML = "<dt class=\"factorial-block__call-type factorial-block__top-row\">Base Case</dt>\n                                    <dd class=\"factorial-block__function-name factorial-block__bottom-row\">factorial(1)</dd>\n                                    <dt class=\"factorial-block__equivalent factorial-block__top-row\">equivalent to</dt>\n                                    <dd class=\"factorial-block__equivalent-value factorial-block__bottom-row\">1</dd>\n                                    <dt class=\"factorial-block__return-header factorial-block__top-row\">return value</dt>\n                                    <dd class=\"factorial-block__return-value factorial-block__return-value--returned factorial-block__bottom-row\">1</dd>";
  } else {
    factorialBlock.innerHTML = "<dt class=\"factorial-block__call-type factorial-block__top-row\">Recursive Call</dt>\n                                    <dd class=\"factorial-block__function-name factorial-block__bottom-row\">factorial(".concat(n, ")</dd>\n                                    <dt class=\"factorial-block__equivalent factorial-block__top-row\">equivalent to</dt>\n                                    <dd class=\"factorial-block__equivalent-value factorial-block__bottom-row\">").concat(n, " * factorial(").concat(n - 1, ")</dd>\n                                    <dt class=\"factorial-block__return-header factorial-block__top-row\">return value</dt>\n                                    <dd class=\"factorial-block__return-value factorial-block__bottom-row\">waiting</dd>");
  }

  return factorialBlock;
}

var factorialDemoContainer = document.querySelector('.factorial-demo');

function factorial(n) {
  return new Promise(function (resolve) {
    setTimeout(function () {
      var factorialBlock;
      if (!factorialDemoContainer.hasChildNodes()) factorialBlock = factorialBlockMaker(n, true);else factorialBlock = factorialBlockMaker(n, false);
      factorialDemoContainer.appendChild(factorialBlock);
      var functionValueText = factorialBlock.querySelector('.factorial-block__return-value');
      resolve(functionValueText);
    }, 500);
  }).then(function (functionValueText) {
    if (n <= 1) {
      return Promise.resolve(1);
    } else {
      return new Promise(function (resolve) {
        var value = factorial(n - 1).then(function (val) {
          return val * n;
        });
        resolve(value);
      }).then(function (value) {
        return new Promise(function (resolve) {
          setTimeout(function () {
            functionValueText.innerHTML = value.toString();
            functionValueText.classList.add('factorial-block__return-value--returned');
            resolve(value);
          }, 500);
        });
      });
    }
  });
}

factorialDemoContainer ? factorial(5) : null;

/***/ }),

/***/ "./src/scripts/recursive_modules/fibonacci.js":
/*!****************************************************!*\
  !*** ./src/scripts/recursive_modules/fibonacci.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/// <reference path="../code_player/code-player.js" />


var _marked =
/*#__PURE__*/
regeneratorRuntime.mark(fib);

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var FibonacciGeneratorMaker =
/*#__PURE__*/
function () {
  function FibonacciGeneratorMaker() {
    _classCallCheck(this, FibonacciGeneratorMaker);

    this.returnValue;
  }

  _createClass(FibonacciGeneratorMaker, [{
    key: "fibonacci",
    value:
    /*#__PURE__*/
    regeneratorRuntime.mark(function fibonacci(number, parentDOMRef) {
      var fibonacciBlock, value;
      return regeneratorRuntime.wrap(function fibonacci$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              fibonacciBlock = this.makeFibonnaciBlock(number);
              this.placeFibonacciBlockOnPage(fibonacciBlock, parentDOMRef);

              if (!(number > 2)) {
                _context.next = 5;
                break;
              }

              _context.next = 5;
              return;

            case 5:
              value = 0;

              if (!(number == 1 || number == 2)) {
                _context.next = 10;
                break;
              }

              value = 1;
              _context.next = 14;
              break;

            case 10:
              return _context.delegateYield(this.generateFibonacci(number - 1, fibonacciBlock), "t0", 11);

            case 11:
              value += this.returnValue;
              return _context.delegateYield(this.generateFibonacci(number - 2, fibonacciBlock), "t1", 13);

            case 13:
              value += this.returnValue;

            case 14:
              this.showFunctionHasResolved(value, fibonacciBlock);
              _context.next = 17;
              return value;

            case 17:
            case "end":
              return _context.stop();
          }
        }
      }, fibonacci, this);
    })
  }, {
    key: "generateFibonacci",
    value:
    /*#__PURE__*/
    regeneratorRuntime.mark(function generateFibonacci(number, parentDOMRef) {
      var generator, next, returnValue;
      return regeneratorRuntime.wrap(function generateFibonacci$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              generator = this.fibonacci(number, parentDOMRef);
              next = generator.next();

            case 2:
              if (next.done) {
                _context2.next = 9;
                break;
              }

              returnValue = next.value;
              _context2.next = 6;
              return;

            case 6:
              next = generator.next();
              _context2.next = 2;
              break;

            case 9:
              this.returnValue = returnValue;

            case 10:
            case "end":
              return _context2.stop();
          }
        }
      }, generateFibonacci, this);
    })
  }, {
    key: "makeFibonnaciBlock",
    value: function makeFibonnaciBlock(number) {
      var fibonacciBlock = document.createElement('div');
      fibonacciBlock.classList.add('fibonacci-block__child');
      fibonacciBlock.innerHTML = "<div class=\"fibonacci-block\">\n                                        <p class=\"fibonacci-block__function-name fibonacci-block__top-row\">fib(".concat(number, ")</p>\n                                        <p class=\"fibonacci-block__return-value fibonacci-block__bottom-row\">waiting</p>\n                                    </div>");
      return fibonacciBlock;
    }
  }, {
    key: "showFunctionHasResolved",
    value: function showFunctionHasResolved(returnValue, fibonacciBlock) {
      var functionValueText = fibonacciBlock.querySelector('.fibonacci-block__return-value');
      var functionNameBlock = fibonacciBlock.querySelector('.fibonacci-block__function-name');
      functionValueText.innerHTML = returnValue.toString();
      functionValueText.classList.add('fibonacci-block__return-value--returned');
      functionNameBlock.classList.add('fibonacci-block__function-name--resolved');
    }
  }, {
    key: "placeFibonacciBlockOnPage",
    value: function placeFibonacciBlockOnPage(fibonacciBlock, DOMLocation) {
      DOMLocation.appendChild(fibonacciBlock);
    }
  }]);

  return FibonacciGeneratorMaker;
}();

function fibonacciBlockMaker(n) {
  var fibonacciBlock = document.createElement('div');
  fibonacciBlock.classList.add('fibonacci-block__child');

  if (n == 1 || n == 2) {
    fibonacciBlock.innerHTML = "<div class=\"fibonacci-block\">\n                                        <p class=\"fibonacci-block__function-name fibonacci-block__function-name--resolved fibonacci-block__top-row\">fib(".concat(n, ")</p>\n                                        <p class=\"fibonacci-block__return-value fibonacci-block__return-value--returned fibonacci-block__bottom-row\">1</p>\n                                    </div>");
  } else {
    fibonacciBlock.innerHTML = "<div class=\"fibonacci-block\">\n                                        <p class=\"fibonacci-block__function-name fibonacci-block__top-row\">fib(".concat(n, ")</p>\n                                        <p class=\"fibonacci-block__return-value fibonacci-block__bottom-row\">waiting</p>\n                                    </div>");
  }

  return fibonacciBlock;
}

var fibonacciDemoContainer = document.querySelector('.fibonacci-demo');
var fibonacciWrapper = document.querySelector('.fibonacci-wrapper');

function fibonacci(n, parentDOMRef) {
  return new Promise(function (resolve) {
    setTimeout(function () {
      var fibonacciBlock;
      if (!fibonacciDemoContainer.hasChildNodes()) fibonacciBlock = fibonacciBlockMaker(n, true);else fibonacciBlock = fibonacciBlockMaker(n, false);
      var functionValueText = fibonacciBlock.querySelector('.fibonacci-block__return-value');
      var functionNameBlock = fibonacciBlock.querySelector('.fibonacci-block__function-name');
      parentDOMRef.append(fibonacciBlock);
      resolve([fibonacciBlock, functionValueText, functionNameBlock]);
    }, 500);
  }).then(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 3),
        fibonacciBlock = _ref2[0],
        functionValueText = _ref2[1],
        functionNameBlock = _ref2[2];

    if (n == 1 || n == 2) {
      return new Promise(function (resolve) {
        setTimeout(function () {
          resolve(1);
        }, 500);
      });
    } else {
      return new Promise(function (resolve) {
        var value = fibonacci(n - 1, fibonacciBlock).then(function (val1) {
          return fibonacci(n - 2, fibonacciBlock).then(function (val2) {
            return [val1, val2];
          });
        }).then(function (_ref3) {
          var _ref4 = _slicedToArray(_ref3, 2),
              val1 = _ref4[0],
              val2 = _ref4[1];

          return val1 + val2;
        });
        resolve(value);
      }).then(function (value) {
        return new Promise(function (resolve) {
          setTimeout(function () {
            functionValueText.innerHTML = value.toString();
            functionValueText.classList.add('fibonacci-block__return-value--returned');
            functionNameBlock.classList.add('fibonacci-block__function-name--resolved');
            resolve(value);
          }, 500);
        });
      });
    }
  });
} // fibonacci(7, fibonacciDemoContainer)


function fib(number, parentDOMRef) {
  var fibonacciBlock, functionValueText, functionNameBlock, value, generator1, next1, yieldedValue1, generator2, next2, yieldedValue2;
  return regeneratorRuntime.wrap(function fib$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          fibonacciBlock = fibonacciBlockMaker(number);
          functionValueText = fibonacciBlock.querySelector('.fibonacci-block__return-value');
          functionNameBlock = fibonacciBlock.querySelector('.fibonacci-block__function-name');
          parentDOMRef.appendChild(fibonacciBlock);

          if (!(number > 2)) {
            _context3.next = 7;
            break;
          }

          _context3.next = 7;
          return;

        case 7:
          value = 0;

          if (!(number == 1 || number == 2)) {
            _context3.next = 12;
            break;
          }

          value = 1;
          _context3.next = 32;
          break;

        case 12:
          generator1 = fib(number - 1, fibonacciBlock);
          next1 = generator1.next();

        case 14:
          if (next1.done) {
            _context3.next = 21;
            break;
          }

          yieldedValue1 = next1.value;
          _context3.next = 18;
          return;

        case 18:
          next1 = generator1.next();
          _context3.next = 14;
          break;

        case 21:
          value += yieldedValue1;
          generator2 = fib(number - 2, fibonacciBlock);
          next2 = generator2.next();

        case 24:
          if (next2.done) {
            _context3.next = 31;
            break;
          }

          yieldedValue2 = next2.value;
          _context3.next = 28;
          return;

        case 28:
          next2 = generator2.next();
          _context3.next = 24;
          break;

        case 31:
          value += yieldedValue2;

        case 32:
          functionValueText.innerHTML = value.toString();
          functionValueText.classList.add('fibonacci-block__return-value--returned');
          functionNameBlock.classList.add('fibonacci-block__function-name--resolved');
          _context3.next = 37;
          return value;

        case 37:
        case "end":
          return _context3.stop();
      }
    }
  }, _marked, this);
}

function trial(generator, generatorYield) {
  var codeStepper = setTimeout(function step(generator, generatorYield) {
    if (generatorYield && generatorYield.done) {
      return;
    } else {
      generatorYield = generator.next();
      codeStepper = setTimeout(step, 300, generator, generatorYield);
    }
  }, 300, generator, generatorYield);
} // trial(fib(10, fibonacciDemoContainer), null);


var fibGeneratorMaker = new FibonacciGeneratorMaker(); // trial(fibGeneratorMaker.fibonacci(7, fibonacciDemoContainer), null);

var simulationController = document.querySelector('.simulation-controller');
var startButton = document.querySelector('.simulation-controller__start-button');
var simulationFunctionParameter = document.querySelector('.simulation-controller__function-parameter');
var simulationDelay = document.querySelector('.simulation-controller__delay');
var codePlayer = new CodePlayer(fibGeneratorMaker.fibonacci.bind(fibGeneratorMaker), simulationController, 'fibonacci-demo');
codePlayer.placeCodePlayerAtLocation(fibonacciWrapper);
codePlayer.simluationStartButton.addEventListener('click', codePlayer.startFunction);
codePlayer.simulationPlayPause.addEventListener('click', codePlayer.togglePlayPause);
codePlayer.simulationPlayPause.addEventListener('click', codePlayer.playFunction);
codePlayer.simulationStepper.addEventListener('click', codePlayer.step);
fibonacciWrapper.scroll(4400, 0);

/***/ }),

/***/ 0:
/*!*******************************************************************************************************!*\
  !*** multi ./src/scripts/recursive_modules/factorial.js ./src/scripts/recursive_modules/fibonacci.js ***!
  \*******************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! C:\Users\Andrew\Desktop\visualize_recursion\src\scripts\recursive_modules\factorial.js */"./src/scripts/recursive_modules/factorial.js");
module.exports = __webpack_require__(/*! C:\Users\Andrew\Desktop\visualize_recursion\src\scripts\recursive_modules\fibonacci.js */"./src/scripts/recursive_modules/fibonacci.js");


/***/ })

/******/ });
//# sourceMappingURL=main.js.map