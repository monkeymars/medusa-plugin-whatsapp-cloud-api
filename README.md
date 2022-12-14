## medusa-plugin-whatsapp-cloud-api

![dots-cover-template-min](https://user-images.githubusercontent.com/2216426/198864470-a145383d-1b29-454f-bd3d-11191977b270.jpeg)

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

# Contributing

When contributing to this repository, please first discuss the change you wish to make via issue,
email, or any other method with the owners of this repository before making a change.

Please note we have a code of conduct, please follow it in all your interactions with the project.

## Pull Request Process

1. Ensure any install or build dependencies are removed before the end of the layer when doing a
   build.
2. Update the README.md with details of changes to the interface, this includes new environment
   variables, exposed ports, useful file locations and container parameters.
3. Increase the version numbers in any examples files and the README.md to the new version that this
   Pull Request would represent. The versioning scheme we use is [SemVer](http://semver.org/).
4. You may merge the Pull Request in once you have the sign-off of two other developers, or if you
   do not have permission to do that, you may request the second reviewer to merge it for you.

## Resources

- [Overview of plugins in Medusa](https://docs.medusajs.com/advanced/backend/plugins/overview)
- [Create Message Templates for WhatsApp Business Account](https://business.facebook.com/business/help/2055875911147364?id=2129163877102343)
- [WhatsApp Cloud API Messages References](https://developers.facebook.com/docs/whatsapp/cloud-api/reference/messages)
- [Create Plugin](https://docs.medusajs.com/advanced/backend/plugins/create)
