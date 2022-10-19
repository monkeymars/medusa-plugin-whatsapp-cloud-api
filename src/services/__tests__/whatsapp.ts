const WhatsAppServiceMock = jest.fn().mockImplementation(() => {
  return {
    sendMessage: jest.fn().mockReturnValue(
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
  describe("sendMessage", () => {
    let result;

    beforeAll(async () => {
      jest.clearAllMocks();
      const whatsappService = new WhatsAppServiceMock();
      result = await whatsappService.sendMessage();
    });

    it("resolves successfully", () => {
      expect(result.status).toEqual("success");
    });
  });
});
