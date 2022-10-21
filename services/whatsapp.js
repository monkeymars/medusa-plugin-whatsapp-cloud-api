"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _objectDestructuringEmpty2 = _interopRequireDefault(require("@babel/runtime/helpers/objectDestructuringEmpty"));
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));
var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));
var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));
var _medusaInterfaces = require("medusa-interfaces");
var _signale = _interopRequireDefault(require("signale"));
var _unirest = _interopRequireDefault(require("unirest"));
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
var MESSAGE_TYPE_TEMPLATE = "template";
var COMPONENT_TYPE_HEADER = "header";
var COMPONENT_TYPE_BODY = "body";
var MESSAGING_PRODUCT = "whatsapp";
var WhatsAppCloudAPI = /*#__PURE__*/function (_BaseService) {
  (0, _inherits2["default"])(WhatsAppCloudAPI, _BaseService);
  var _super = _createSuper(WhatsAppCloudAPI);
  function WhatsAppCloudAPI(_ref, _ref2) {
    var _this;
    (0, _objectDestructuringEmpty2["default"])(_ref);
    var accessToken = _ref2.accessToken,
      graphAPIVersion = _ref2.graphAPIVersion,
      senderPhoneNumberId = _ref2.senderPhoneNumberId,
      WABA_ID = _ref2.WABA_ID;
    (0, _classCallCheck2["default"])(this, WhatsAppCloudAPI);
    _this = _super.call(this);
    _this.accessToken = accessToken;
    _this.graphAPIVersion = graphAPIVersion;
    _this.senderPhoneNumberId = senderPhoneNumberId;
    _this.baseUrl = "https://graph.facebook.com/".concat(_this.graphAPIVersion, "/").concat(_this.senderPhoneNumberId);
    _this.WABA_ID = WABA_ID;
    if (!_this.accessToken) {
      throw new Error('Missing "accessToken"');
    }
    if (!_this.senderPhoneNumberId) {
      throw new Error('Missing "senderPhoneNumberId".');
    }
    if (graphAPIVersion) {
      _signale["default"].warn("Please note, the default \"graphAPIVersion\" is v13.0. You are using ".concat(graphAPIVersion, ". This may result in quirky behavior."));
    }
    _this._fetch = function (_ref3) {
      var baseUrl = _ref3.baseUrl,
        url = _ref3.url,
        method = _ref3.method,
        headers = _ref3.headers,
        body = _ref3.body;
      return new Promise(function (resolve, reject) {
        var _method, _method2;
        var defaultHeaders = function defaultHeaders() {
          var output = {
            "Content-Type": "application/json",
            "Accept-Language": "en_US",
            Accept: "application/json"
          };
          if (_this.accessToken) {
            output["Authorization"] = "Bearer ".concat(_this.accessToken);
          }
          return output;
        };
        var defaultBody = {};
        var defaultMethod = "GET";
        if (!url) {
          throw new Error('"url" is required in making a request');
        }
        if (!method) {
          _signale["default"].warn("WARNING: \"method\" is missing. The default method will default to ".concat(defaultMethod, ". If this is not what you want, please specify the method."));
        }
        if (!headers) {
          _signale["default"].warn("WARNING: \"headers\" is missing.");
        }
        if (((_method = method) === null || _method === void 0 ? void 0 : _method.toUpperCase()) === "POST" && !body) {
          _signale["default"].warn("WARNING: \"body\" is missing. The default body will default to ".concat(JSON.stringify(defaultBody), ". If this is not what you want, please specify the body."));
        }
        method = ((_method2 = method) === null || _method2 === void 0 ? void 0 : _method2.toUpperCase()) || defaultMethod;
        headers = _objectSpread(_objectSpread({}, defaultHeaders()), headers);
        body = body || defaultBody;
        _this.baseUrl = baseUrl || _this.baseUrl;
        var fullUrl = "".concat(_this.baseUrl).concat(url);
        (0, _unirest["default"])(method, fullUrl).headers(headers).send(JSON.stringify(body)).end(function (res) {
          if (res.error) {
            var errorObject = function errorObject() {
              try {
                var _res$body;
                return ((_res$body = res.body) === null || _res$body === void 0 ? void 0 : _res$body.error) || JSON.parse(res.raw_body);
              } catch (e) {
                return {
                  error: res.raw_body
                };
              }
            };
            reject(_objectSpread({
              status: "failed"
            }, errorObject()));
          } else {
            resolve({
              status: "success",
              data: res.body
            });
          }
        });
      });
    };
    _this._mustHaveRecipient = function (recipientPhone) {
      if (!recipientPhone) {
        throw new Error('"recipientPhone" is required in making a request');
      }
    };
    _this._mustHaveMessage = function (message) {
      if (!message) {
        throw new Error('"message" is required in making a request');
      }
    };
    return _this;
  }

  /**
   * Send text-based message templates
   *
   * @param {string} templateName WhatsApp template id.
   * @param {string} recipientPhone Recipient phone number
   * @param {[object]} headerMessage Array of parameter objects with the content of the message. https://developers.facebook.com/docs/whatsapp/cloud-api/reference/messages#parameter-object
   * @param {[object]} contentMessage Array of parameter objects with the content of the message. https://developers.facebook.com/docs/whatsapp/cloud-api/reference/messages#parameter-object
   * @param {string} lang The code of the language or locale to use.
   * @return {object} WhatsApp API response object
   */
  (0, _createClass2["default"])(WhatsAppCloudAPI, [{
    key: "sendMessageTemplate",
    value: function () {
      var _sendMessageTemplate = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(_ref4) {
        var templateName, recipientPhone, headerMessage, contentMessage, _ref4$lang, lang, payload, response;
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                templateName = _ref4.templateName, recipientPhone = _ref4.recipientPhone, headerMessage = _ref4.headerMessage, contentMessage = _ref4.contentMessage, _ref4$lang = _ref4.lang, lang = _ref4$lang === void 0 ? "en_US" : _ref4$lang;
                this._mustHaveRecipient(recipientPhone);
                payload = {
                  messaging_product: MESSAGING_PRODUCT,
                  to: recipientPhone,
                  type: MESSAGE_TYPE_TEMPLATE,
                  template: {
                    name: templateName,
                    language: {
                      code: lang
                    },
                    components: [].concat((0, _toConsumableArray2["default"])(headerMessage !== null && headerMessage !== void 0 && headerMessage.length ? [{
                      type: COMPONENT_TYPE_HEADER,
                      parameters: headerMessage
                    }] : []), (0, _toConsumableArray2["default"])(contentMessage !== null && contentMessage !== void 0 && contentMessage.length ? [{
                      type: COMPONENT_TYPE_BODY,
                      parameters: contentMessage
                    }] : []))
                  }
                };
                _context.next = 5;
                return this._fetch({
                  url: "/messages",
                  method: "POST",
                  body: payload
                });
              case 5:
                response = _context.sent;
                return _context.abrupt("return", response);
              case 7:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));
      function sendMessageTemplate(_x) {
        return _sendMessageTemplate.apply(this, arguments);
      }
      return sendMessageTemplate;
    }()
  }]);
  return WhatsAppCloudAPI;
}(_medusaInterfaces.BaseService);
var _default = WhatsAppCloudAPI;
exports["default"] = _default;