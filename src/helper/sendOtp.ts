import axios from "axios";

export const sendOTP = async (mobileNumber: any, otp: number) => {
  const apiKey = "430615AYdI3IDtv0d6731bbb7P1"; // Replace with your MSG91 API key
  //   const senderId = "FREEGI"; // Replace with your Sender ID
  const templateId = "67174251d6fc056aa45e3922"; // Replace with your OTP template ID

  const options = {
    method: "POST",
    url: "https://control.msg91.com/api/v5/flow",
    headers: {
      authkey: apiKey,
      accept: "application/json",
      "content-type": "application/json",
    },
    data: {
      template_id: templateId,
      short_url: "0",
      recipients: [
        {
          mobiles: `91${mobileNumber}`,
          otp: otp,
        },
      ],
    },
  };

  console.log(options);

  try {
    const { data } = await axios.request(options);
    console.log("OTP Sent Successfully:", data);

    if (!!data) {
      return true;
    }
  } catch (error) {
    // console.error("Error sending OTP:", error);
    return false;
  }
};
