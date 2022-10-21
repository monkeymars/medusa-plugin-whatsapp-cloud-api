const WhatsAppServiceMock = jest.fn().mockImplementation(() => {
  return {
    sendMessageTemplate: jest.fn().mockReturnValue(
      Promise.resolve({
        status: "success",
        data: {
          messaging_product: "whatsapp",
          contacts: [],
          messages: [],
        },
      })
    ),
  };
});

describe("WhatsAppService", () => {
  describe("sendMessageTemplate", () => {
    let result;

    beforeAll(async () => {
      jest.clearAllMocks();
      const whatsappService = new WhatsAppServiceMock();
      result = await whatsappService.sendMessageTemplate();
    });

    it("resolves successfully", () => {
      expect(result.status).toEqual("success");
    });
  });
});
