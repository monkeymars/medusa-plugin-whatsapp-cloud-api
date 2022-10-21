import { BaseService } from "medusa-interfaces";
import signale from "signale";
import unirest from "unirest";

const MESSAGE_TYPE_TEMPLATE = "template";
const COMPONENT_TYPE_HEADER = "header";
const COMPONENT_TYPE_BODY = "body";
const MESSAGING_PRODUCT = "whatsapp";

class WhatsAppCloudAPI extends BaseService {
  protected accessToken: string;
  protected graphAPIVersion: string;
  protected senderPhoneNumberId: string;
  protected baseUrl: string;
  protected WABA_ID: string;
  protected _fetch: (params: any) => Promise<unknown>;
  _mustHaveRecipient: (recipientPhone: any) => void;
  _mustHaveMessage: (message: any) => void;

  constructor(
    {},
    { accessToken, graphAPIVersion, senderPhoneNumberId, WABA_ID }
  ) {
    super();

    this.accessToken = accessToken;
    this.graphAPIVersion = graphAPIVersion;
    this.senderPhoneNumberId = senderPhoneNumberId;
    this.baseUrl = `https://graph.facebook.com/${this.graphAPIVersion}/${this.senderPhoneNumberId}`;
    this.WABA_ID = WABA_ID;

    if (!this.accessToken) {
      throw new Error('Missing "accessToken"');
    }

    if (!this.senderPhoneNumberId) {
      throw new Error('Missing "senderPhoneNumberId".');
    }

    if (graphAPIVersion) {
      signale.warn(
        `Please note, the default "graphAPIVersion" is v13.0. You are using ${graphAPIVersion}. This may result in quirky behavior.`
      );
    }

    this._fetch = ({ baseUrl, url, method, headers, body }) => {
      return new Promise((resolve, reject) => {
        let defaultHeaders = () => {
          let output = {
            "Content-Type": "application/json",
            "Accept-Language": "en_US",
            Accept: "application/json",
          };

          if (this.accessToken) {
            output["Authorization"] = `Bearer ${this.accessToken}`;
          }
          return output;
        };

        let defaultBody = {};
        let defaultMethod = "GET";

        if (!url) {
          throw new Error('"url" is required in making a request');
        }

        if (!method) {
          signale.warn(
            `WARNING: "method" is missing. The default method will default to ${defaultMethod}. If this is not what you want, please specify the method.`
          );
        }

        if (!headers) {
          signale.warn(`WARNING: "headers" is missing.`);
        }

        if (method?.toUpperCase() === "POST" && !body) {
          signale.warn(
            `WARNING: "body" is missing. The default body will default to ${JSON.stringify(
              defaultBody
            )}. If this is not what you want, please specify the body.`
          );
        }

        method = method?.toUpperCase() || defaultMethod;
        headers = {
          ...defaultHeaders(),
          ...headers,
        };

        body = body || defaultBody;
        this.baseUrl = baseUrl || this.baseUrl;
        let fullUrl = `${this.baseUrl}${url}`;

        unirest(method, fullUrl)
          .headers(headers)
          .send(JSON.stringify(body))
          .end(function (res) {
            if (res.error) {
              let errorObject = () => {
                try {
                  return res.body?.error || JSON.parse(res.raw_body);
                } catch (e) {
                  return {
                    error: res.raw_body,
                  };
                }
              };

              reject({
                status: "failed",
                ...errorObject(),
              });
            } else {
              resolve({
                status: "success",
                data: res.body,
              });
            }
          });
      });
    };

    this._mustHaveRecipient = (recipientPhone) => {
      if (!recipientPhone) {
        throw new Error('"recipientPhone" is required in making a request');
      }
    };

    this._mustHaveMessage = (message) => {
      if (!message) {
        throw new Error('"message" is required in making a request');
      }
    };
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
  async sendMessageTemplate({
    templateName,
    recipientPhone,
    headerMessage,
    contentMessage,
    lang = "en_US",
  }) {
    this._mustHaveRecipient(recipientPhone);

    const payload = {
      messaging_product: MESSAGING_PRODUCT,
      to: recipientPhone,
      type: MESSAGE_TYPE_TEMPLATE,
      template: {
        name: templateName,
        language: {
          code: lang,
        },
        components: [
          ...(headerMessage?.length
            ? [
                {
                  type: COMPONENT_TYPE_HEADER,
                  parameters: headerMessage,
                },
              ]
            : []),
          ...(contentMessage?.length
            ? [
                {
                  type: COMPONENT_TYPE_BODY,
                  parameters: contentMessage,
                },
              ]
            : []),
        ],
      },
    };

    const response = await this._fetch({
      url: "/messages",
      method: "POST",
      body: payload,
    });

    return response;
  }
}

export default WhatsAppCloudAPI;
