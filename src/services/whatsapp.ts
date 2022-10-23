import { BaseService } from "medusa-interfaces";
import signale from "signale";
import unirest from "unirest";
import fs from 'fs'

const COMPONENT_TYPE_HEADER = "header";
const COMPONENT_TYPE_BODY = "body";
const MESSAGING_PRODUCT = "whatsapp";

class WhatsAppCloudAPI extends BaseService {
  protected accessToken: string;
  protected graphAPIVersion: string;
  protected senderPhoneNumberId: string;
  protected baseUrl: string;
  protected _uploadMedia: any;
  protected WABA_ID: string;
  protected _fetch: (params: any) => Promise<unknown>;
  _mustHaveRecipient: (recipientPhone: any) => void;
  _mustHaveMessage: (message: any) => void;

  static MESSAGE_TYPE = {
    TEXT: "text",
    LOCATION: "location",
    TEMPLATE: "template"
  }

  constructor(
    { },
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

    this._uploadMedia = async ({ filePath, fileType }) => {
      return new Promise((resolve, reject) => {
        unirest(
            'POST',
            `https://graph.facebook.com/${this.graphAPIVersion}/${this.senderPhoneNumberId}/media`
        )
            .headers({
              Authorization: `Bearer ${this.accessToken}`,
            })
            .field('type', fileType)
            .field('messaging_product', 'whatsapp')
            .attach('file', fs.createReadStream(filePath))
            .end((res) => {
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
                let response = JSON.parse(res.raw_body);
                resolve({
                  status: 'success',
                  media_id: response.id,
                });
              }
            });
      });
    };
  }

  /**
   * Send text message
   *
   * @param {string} recipientPhone Recipient phone number
   * @param {string} contentMessage Text Message
   * @param {boolean} preview_url Show preview url from Text Message.
   * @return {object} WhatsApp API response object
   */
  async sendMessage({
    recipientPhone,
    contentMessage,
    preview_url
  }) {
    this._mustHaveRecipient(recipientPhone);
    this._mustHaveMessage(contentMessage);

    if (preview_url === undefined) {
      const regexUrl = /(http|https):\/\/[a-zA-Z0-9-]+(.[a-zA-Z0-9-]+)*/g;
      const messageContainUrl = contentMessage.match(regexUrl);
      if (messageContainUrl) {
        preview_url = true;
      }
    }

    const payload = {
      messaging_product: MESSAGING_PRODUCT,
      to: recipientPhone,
      type: WhatsAppCloudAPI.MESSAGE_TYPE.TEXT,
      text: {
        preview_url: preview_url,
        body: contentMessage
      },
    };

    const response = await this._fetch({
      url: "/messages",
      method: "POST",
      body: payload
    });

    return response;
  }

  /**
   * Send location
   *
   * @param {string} latitude latitude location
   * @param {string} longitude longitude location
   * @param {string} name name location
   * @param {string} address address location
   * @return {object} WhatsApp API response object
   */
  async sendLocation({
    recipientPhone,
    latitude,
    longitude,
    name,
    address
  }) {
    this._mustHaveRecipient(recipientPhone);

    const payload = {
      messaging_product: MESSAGING_PRODUCT,
      to: recipientPhone,
      type: WhatsAppCloudAPI.MESSAGE_TYPE.LOCATION,
      location: {
        latitude,
        longitude,
        name,
        address
      }
    };

    const response = await this._fetch({
      url: "/messages",
      method: "POST",
      body: payload
    });

    return response;
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
      type: WhatsAppCloudAPI.MESSAGE_TYPE.TEMPLATE,
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

  /**
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
  async sendDocument({ recipientPhone, caption, filePath, fileName, fileType, url }) {
    this._mustHaveRecipient(recipientPhone);
    if (filePath && url) {
      throw new Error(
          'You can only send a document in your "filePath" or one that is in a publicly available "url". Provide either "filePath" or "url".'
      );
    }

    if (!filePath && !url) {
      throw new Error(
          'You must send a document in your "filePath" or one that is in a publicly available "url". Provide either "filePath" or "url".'
      );
    }

    if(filePath && !fileType){
      throw new Error(
          'You must send a document with fileName if your file path is exist'
      );
    }

    if (!caption) {
      throw new Error('"caption" is required when sending a document');
    }

    let body = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: recipientPhone,
      type: 'document',
      document: {
        caption: caption || '',
        filename: fileName || '',
      },
    };

    if (filePath) {
      let uploadedFile = await this._uploadMedia({
        filePath,
        fileType,
      });
      body['document']['id'] = uploadedFile.media_id;
    } else {
      body['document']['link'] = url;
    }

    return await this._fetch({
      url: '/messages',
      method: 'POST',
      body,
    });
  }
}

export default WhatsAppCloudAPI;
