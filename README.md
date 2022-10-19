# medusa-plugin-whatsapp-cloud-api

WhatsApp Cloud API / Messaging plugin.

Learn more about how you can use this plugin in the [use plugin documentaion](https://docs.medusajs.com/advanced/backend/plugins/overview/).

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
      accessToken: "<Temporary or permanent access token>", // required
      graphAPIVersion: "<Graph API Version>", // required
      senderPhoneNumberId: "<Phone number ID>", // required
      WABA_ID: "<WhatsApp Business Account ID>", // required
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

  const response = await whatsappService.sendMessage({
    recipientPhone: "+6281556750222",
    templateId: "hello_world",
    lang: "en_US",
  });

  res.json({
    message: `message sent: ${response.status}`,
  });
});
```
