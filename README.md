## medusa-plugin-whatsapp-cloud-api
![medua-logos-cover-template-min](https://user-images.githubusercontent.com/2216426/197403099-3e33dc5d-4986-44e8-9e4b-fcbfa019d75d.jpeg)

WhatsApp Cloud API / Messaging plugin.

Learn more about how you can use this plugin in the [documentaion](https://docs.medusajs.com/advanced/backend/plugins/overview/).

[![Build & Test](https://github.com/monkeymars/medusa-plugin-whatsapp-cloud-api/actions/workflows/node-ci.yml/badge.svg?branch=main)](https://github.com/monkeymars/medusa-plugin-whatsapp-cloud-api/actions/workflows/node-ci.yml)
[![npm publish](https://github.com/monkeymars/medusa-plugin-whatsapp-cloud-api/actions/workflows/npm-publish.yml/badge.svg)](https://github.com/monkeymars/medusa-plugin-whatsapp-cloud-api/actions/workflows/npm-publish.yml)
<img alt="npm" src="https://img.shields.io/npm/dw/medusa-plugin-whatsapp-cloud-api">
[![CodeQL](https://github.com/monkeymars/medusa-plugin-whatsapp-cloud-api/actions/workflows/codeql.yml/badge.svg)](https://github.com/monkeymars/medusa-plugin-whatsapp-cloud-api/actions/workflows/codeql.yml)
<img alt="NPM" src="https://img.shields.io/npm/l/medusa-plugin-whatsapp-cloud-api">
<img alt="npm" src="https://img.shields.io/npm/v/medusa-plugin-whatsapp-cloud-api">

## Install Plugin

In the directory of your Medusa server, run the following command to install WhatsApp Cloud API plugin:

#### Yarn or NPM

```bash
npm install --save medusa-plugin-whatsapp-cloud-api
```

```bash
yarn add medusa-plugin-whatsapp-cloud-api
```

## Options
Next, you need to add configurations for **medusa-plugin-whatsapp-cloud-api** plugin. 
In **medusa-config.js** add the following at the plugins array:

```js
const plugins = [
  {
    resolve: `medusa-plugin-whatsapp-cloud-api`,
    options: {
      accessToken: "<Temporary or permanent access token>",
      WABA_ID: "<WhatsApp Business Account ID>",
      senderPhoneNumberId: "<Phone number ID>",
      graphAPIVersion: "<Graph API Version>",
    },
  },
];
```

## Dynamic usage

You can resolve the WhatsApp service to dynamically send messages via WhatsApp Cloud API. Example:

#### sendMessageTemplate

```js
router.get("/send-message-sample", async (req, res) => {
  const whatsappService = req.scope.resolve("whatsappService");

  const response = await whatsappService.sendMessageTemplate({
    templateId: "flight_confirmation", // your message templates
    recipientPhone: "+6281556750222",
    headerMessage: [
      {
        type: "image",
        image: {
          link: "https://<URL>",
        },
      },
    ],
    contentMessage: [
      { type: "text", text: "NYC" },
      { type: "text", text: "JFK" },
      {
        type: "date_time",
        date_time: {
          fallback_value: "December 24, 2022",
        },
      },
    ],
    lang: "en_US",
  });

  res.json({
    message: `message sent: ${response.status}`,
  });
});
```

#### sendLocation

```js
whatsappService.sendLocation({
  name: "GBK Stadium",
  address: "Jl. Pintu Satu Senayan, Gelora, Kota Jakarta Pusat, DKI Jakarta",
  recipientPhone: "+6281556750222",
  latitude: -6.21844,
  longitude: 106.8018,
});
```

## Preview: sendMessageTemplate

![sample](https://user-images.githubusercontent.com/2216426/197109119-3ad748b9-803c-45b8-888d-8f5cd8bada06.jpeg)

## Participants
| GitHub | Twitter | Discord |
| ------------- | ------------- | ------------- |
| [monkeymars](https://github.com/monkeymars/)  | [@SoekmoWibowo](https://twitter.com/SoekmoWibowo)  | **NaN#5123**
| [madzarmr](https://github.com/madzarmr/)  | [@madzarmr](https://twitter.com/madzarmr)  | **madzarmr**
| [putra299](https://github.com/putra299/)  | [@putra29](https://twitter.com/putra29)  | **putra299** 
| [silogos](https://github.com/silogos/)  | [@AminLogos](https://twitter.com/AminLogos)  | **Geeks#8128** 


## Resources

- [Overview of plugins in Medusa](https://docs.medusajs.com/advanced/backend/plugins/overview)
- [Create Message Templates for WhatsApp Business Account](https://business.facebook.com/business/help/2055875911147364?id=2129163877102343)
- [WhatsApp Cloud API Messages References](https://developers.facebook.com/docs/whatsapp/cloud-api/reference/messages)
- [Create Plugin](https://docs.medusajs.com/advanced/backend/plugins/create)
