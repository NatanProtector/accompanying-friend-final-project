import { send, EmailJSResponseStatus } from '@emailjs/react-native';

import { SERVER_URL, EMAILJS_PUBLIC_KEY, EMAILJS_SERVICE_ID, EMAILJS_VERIFICATION_TEMPLATE_ID , EMAILJS_PASSWORD_RESET_TEMPLATE_ID} from "@env";

const turnedOffEmails = true;

export const sendVerificationEmail = async (destination_email, name, verificationToken) => {
    
    console.log("SERVER_URL for email verification:", SERVER_URL);

    const verificationLink = `${SERVER_URL}/api/auth/verify/${verificationToken}`;

    console.log("verificationLink", verificationLink);
    
    const templateParams = {
        destination_email: destination_email,
        name: name,
        verification_link: verificationLink,
    }

    if (turnedOffEmails) {
        console.log("Email sending turned off temporarily to prevent abuse, verify manually");
        return;
    }
    await send(
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
            console.log("ERROR!", error);
        },
      );

}

export const sendPasswordResetEmail = async (destination_email, name, verificationToken) => {
    
    const reset_link = `${SERVER_URL}/api/auth/reset-password/${verificationToken}`;

    const templateParams = {
        destination_email: destination_email,
        name: name,
        reset_link: reset_link,
    }


    if (turnedOffEmails) {
        console.log("Email sending turned off temporarily to prevent abuse, verify manually");
        return;
    }
    await send(
        EMAILJS_SERVICE_ID,
        EMAILJS_PASSWORD_RESET_TEMPLATE_ID,
        templateParams,
        {
            publicKey: EMAILJS_PUBLIC_KEY,
        }
    ).then(
        (response) => {
            console.log('SUCCESS!', response.status, response.text);
        },
        (error) => {
            console.log("ERROR!", error);
        },
    );

}
