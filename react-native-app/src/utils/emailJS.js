import { send, EmailJSResponseStatus } from '@emailjs/react-native';

import { SERVER_URL, EMAILJS_PUBLIC_KEY, EMAILJS_PRIVATE_KEY, EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID as EMAILJS_VERIFICATION_TEMPLATE_ID } from "@env";

export const sendVerificationEmail = async (destination_email, name, verificationToken) => {
    
    const verificationLink = `${SERVER_URL}/api/auth/verify/${verificationToken}`;

    console.log("verificationLink", verificationLink);
    
    const templateParams = {
        destination_email: destination_email,
        name: name,
        verification_link: verificationLink,
    }

    const result = await send(
        EMAILJS_SERVICE_ID,
        EMAILJS_VERIFICATION_TEMPLATE_ID,
        templateParams,
        {
            publicKey: EMAILJS_PUBLIC_KEY,
        }
    ).then(
        (response) => {
          console.log('SUCCESS!', response.status, response.text);
        },
        (error) => {
            throw error;
        },
      );

}