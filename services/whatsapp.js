"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _objectDestructuringEmpty2 = _interopRequireDefault(require("@babel/runtime/helpers/objectDestructuringEmpty"));
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));
var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));
var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _medusaInterfaces = require("medusa-interfaces");
var _signale = _interopRequireDefault(require("signale"));
var _unirest = _interopRequireDefault(require("unirest"));
var _fs = _interopRequireDefault(require("fs"));
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
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
    _this._uploadMedia = /*#__PURE__*/function () {
      var _ref5 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(_ref4) {
        var filePath, fileType;
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                filePath = _ref4.filePath, fileType = _ref4.fileType;
                return _context.abrupt("return", new Promise(function (resolve, reject) {
                  (0, _unirest["default"])('POST', "https://graph.facebook.com/".concat(_this.graphAPIVersion, "/").concat(_this.senderPhoneNumberId, "/media")).headers({
                    Authorization: "Bearer ".concat(_this.accessToken)
                  }).field('type', fileType).field('messaging_product', 'whatsapp').attach('file', _fs["default"].createReadStream(filePath)).end(function (res) {
                    if (res.error) {
                      var errorObject = function errorObject() {
                        try {
                          var _res$body2;
                          return ((_res$body2 = res.body) === null || _res$body2 === void 0 ? void 0 : _res$body2.error) || JSON.parse(res.raw_body);
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
                      var response = JSON.parse(res.raw_body);
                      resolve({
                        status: 'success',
                        media_id: response.id
                      });
                    }
                  });
                }));
              case 2:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));
      return function (_x) {
        return _ref5.apply(this, arguments);
      };
    }();
    return _this;
  }

  /**
   * Send text message
   *
   * @param {string} recipientPhone Recipient phone number
   * @param {string} contentMessage Text Message
   * @param {boolean} preview_url Show preview url from Text Message.
   * @return {object} WhatsApp API response object
   */
  (0, _createClass2["default"])(WhatsAppCloudAPI, [{
    key: "sendMessage",
    value: function () {
      var _sendMessage = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(_ref6) {
        var recipientPhone, contentMessage, preview_url, regexUrl, messageContainUrl, payload, response;
        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                recipientPhone = _ref6.recipientPhone, contentMessage = _ref6.contentMessage, preview_url = _ref6.preview_url;
                this._mustHaveRecipient(recipientPhone);
                this._mustHaveMessage(contentMessage);
                if (preview_url === undefined) {
                  regexUrl = /(http|https):\/\/[a-zA-Z0-9-]+(.[a-zA-Z0-9-]+)*/g;
                  messageContainUrl = contentMessage.match(regexUrl);
                  if (messageContainUrl) {
                    preview_url = true;
                  }
                }
                payload = {
                  messaging_product: MESSAGING_PRODUCT,
                  to: recipientPhone,
                  type: WhatsAppCloudAPI.MESSAGE_TYPE.TEXT,
                  text: {
                    preview_url: preview_url,
                    body: contentMessage
                  }
                };
                _context2.next = 7;
                return this._fetch({
                  url: "/messages",
                  method: "POST",
                  body: payload
                });
              case 7:
                response = _context2.sent;
                return _context2.abrupt("return", response);
              case 9:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));
      function sendMessage(_x2) {
        return _sendMessage.apply(this, arguments);
      }
      return sendMessage;
    }() /**
         * Send location
         *
         * @param {string} latitude latitude location
         * @param {string} longitude longitude location
         * @param {string} name name location
         * @param {string} address address location
         * @return {object} WhatsApp API response object
         */
  }, {
    key: "sendLocation",
    value: function () {
      var _sendLocation = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(_ref7) {
        var recipientPhone, latitude, longitude, name, address, payload, response;
        return _regenerator["default"].wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                recipientPhone = _ref7.recipientPhone, latitude = _ref7.latitude, longitude = _ref7.longitude, name = _ref7.name, address = _ref7.address;
                this._mustHaveRecipient(recipientPhone);
                payload = {
                  messaging_product: MESSAGING_PRODUCT,
                  to: recipientPhone,
                  type: WhatsAppCloudAPI.MESSAGE_TYPE.LOCATION,
                  location: {
                    latitude: latitude,
                    longitude: longitude,
                    name: name,
                    address: address
                  }
                };
                _context3.next = 5;
                return this._fetch({
                  url: "/messages",
                  method: "POST",
                  body: payload
                });
              case 5:
                response = _context3.sent;
                return _context3.abrupt("return", response);
              case 7:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));
      function sendLocation(_x3) {
        return _sendLocation.apply(this, arguments);
      }
      return sendLocation;
    }() /**
         * Send text-based message templates
         *
         * @param {string} templateName WhatsApp template id.
         * @param {string} recipientPhone Recipient phone number
         * @param {[object]} headerMessage Array of parameter objects with the content of the message. https://developers.facebook.com/docs/whatsapp/cloud-api/reference/messages#parameter-object
         * @param {[object]} contentMessage Array of parameter objects with the content of the message. https://developers.facebook.com/docs/whatsapp/cloud-api/reference/messages#parameter-object
         * @param {string} lang The code of the language or locale to use.
         * @return {object} WhatsApp API response object
         */
  }, {
    key: "sendMessageTemplate",
    value: function () {
      var _sendMessageTemplate = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(_ref8) {
        var templateName, recipientPhone, headerMessage, contentMessage, _ref8$lang, lang, payload, response;
        return _regenerator["default"].wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                templateName = _ref8.templateName, recipientPhone = _ref8.recipientPhone, headerMessage = _ref8.headerMessage, contentMessage = _ref8.contentMessage, _ref8$lang = _ref8.lang, lang = _ref8$lang === void 0 ? "en_US" : _ref8$lang;
                this._mustHaveRecipient(recipientPhone);
                payload = {
                  messaging_product: MESSAGING_PRODUCT,
                  to: recipientPhone,
                  type: WhatsAppCloudAPI.MESSAGE_TYPE.TEMPLATE,
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
                _context4.next = 5;
                return this._fetch({
                  url: "/messages",
                  method: "POST",
                  body: payload
                });
              case 5:
                response = _context4.sent;
                return _context4.abrupt("return", response);
              case 7:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));
      function sendMessageTemplate(_x4) {
        return _sendMessageTemplate.apply(this, arguments);
      }
      return sendMessageTemplate;
    }() /**
         * Send text message
         *
         * @param {string} recipientPhone Recipient phone number
         * @param {string} caption Text Caption
         * @param {string} filePath File path from your local directory. For example: "@/local/path/file.jpg".
         * @param {string} fileName File name
         * @param {string} fileType Type of media file being uploaded
         * @param {string} url Url document to send
         * @return {object} WhatsApp API response object
         */
  }, {
    key: "sendDocument",
    value: function () {
      var _sendDocument = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(_ref9) {
        var recipientPhone, caption, filePath, fileName, fileType, url, body, uploadedFile;
        return _regenerator["default"].wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                recipientPhone = _ref9.recipientPhone, caption = _ref9.caption, filePath = _ref9.filePath, fileName = _ref9.fileName, fileType = _ref9.fileType, url = _ref9.url;
                this._mustHaveRecipient(recipientPhone);
                if (!(filePath && url)) {
                  _context5.next = 4;
                  break;
                }
                throw new Error('You can only send a document in your "filePath" or one that is in a publicly available "url". Provide either "filePath" or "url".');
              case 4:
                if (!(!filePath && !url)) {
                  _context5.next = 6;
                  break;
                }
                throw new Error('You must send a document in your "filePath" or one that is in a publicly available "url". Provide either "filePath" or "url".');
              case 6:
                if (!(filePath && !fileType)) {
                  _context5.next = 8;
                  break;
                }
                throw new Error('You must send a document with fileName if your file path is exist');
              case 8:
                if (caption) {
                  _context5.next = 10;
                  break;
                }
                throw new Error('"caption" is required when sending a document');
              case 10:
                body = {
                  messaging_product: 'whatsapp',
                  recipient_type: 'individual',
                  to: recipientPhone,
                  type: 'document',
                  document: {
                    caption: caption || '',
                    filename: fileName || ''
                  }
                };
                if (!filePath) {
                  _context5.next = 18;
                  break;
                }
                _context5.next = 14;
                return this._uploadMedia({
                  filePath: filePath,
                  fileType: fileType
                });
              case 14:
                uploadedFile = _context5.sent;
                body['document']['id'] = uploadedFile.media_id;
                _context5.next = 19;
                break;
              case 18:
                body['document']['link'] = url;
              case 19:
                _context5.next = 21;
                return this._fetch({
                  url: '/messages',
                  method: 'POST',
                  body: body
                });
              case 21:
                return _context5.abrupt("return", _context5.sent);
              case 22:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));
      function sendDocument(_x5) {
        return _sendDocument.apply(this, arguments);
      }
      return sendDocument;
    }()
  }]);
  return WhatsAppCloudAPI;
}(_medusaInterfaces.BaseService);
(0, _defineProperty2["default"])(WhatsAppCloudAPI, "MESSAGE_TYPE", {
  TEXT: "text",
  LOCATION: "location",
  TEMPLATE: "template"
});
var _default = WhatsAppCloudAPI;
exports["default"] = _default;