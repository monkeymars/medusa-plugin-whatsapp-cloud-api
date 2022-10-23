# medusa-plugin-whatsapp-cloud-api

WhatsApp Cloud API / Messaging plugin.

Learn more about how you can use this plugin in the [documentaion](https://docs.medusajs.com/advanced/backend/plugins/overview/).

[![Build & Test](https://github.com/monkeymars/medusa-plugin-whatsapp-cloud-api/actions/workflows/node-ci.yml/badge.svg?branch=main)](https://github.com/monkeymars/medusa-plugin-whatsapp-cloud-api/actions/workflows/node-ci.yml)
[![npm publish](https://github.com/monkeymars/medusa-plugin-whatsapp-cloud-api/actions/workflows/npm-publish.yml/badge.svg)](https://github.com/monkeymars/medusa-plugin-whatsapp-cloud-api/actions/workflows/npm-publish.yml)
<img alt="npm" src="https://img.shields.io/npm/dw/medusa-plugin-whatsapp-cloud-api">
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

```js
const plugins = [
  {
    resolve: `medusa-plugin-whatsapp-cloud-api`,
    options: {
      graphAPIVersion: "<Graph API Version>",
      senderPhoneNumberId: "<Phone number ID>",
      WABA_ID: "<WhatsApp Business Account ID>",
      accessToken: "<Temporary or permanent access token>",
    },
  },
];
```

## Dynamic usage

You can resolve the WhatsApp service to dynamically send messages via WhatsApp Cloud API.

Example:

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
          link: "https://img.freepik.com/premium-vector/modern-realistic-airline-ticket-design-with-flight-time-passenger-name-vector-illustration_123447-8.jpg",
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

### Send Location

```js
whatsappService.sendLocation({
  recipientPhone: "+6281556750222",
  latitude: -6.21844,
  longitude: 106.8018,
  name: "GBK Stadium",
  address: "Jl. Pintu Satu Senayan, Gelora, Kota Jakarta Pusat, DKI Jakarta",
});
```

## Preview

![sample](https://user-images.githubusercontent.com/2216426/197109119-3ad748b9-803c-45b8-888d-8f5cd8bada06.jpeg)