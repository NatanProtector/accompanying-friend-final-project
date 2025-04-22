
import emailjs from '@emailjs/browser';

const {VITE_EMAILJS_PUBLIC_KEY, VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_CONFIRMATION_TEMPLATE_ID} = import.meta.env;

const sendConfirmationEmails = async (emaill_detinations) => {
    console.log("using..",VITE_EMAILJS_PUBLIC_KEY, VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_CONFIRMATION_TEMPLATE_ID);
    for (const email of emaill_detinations) {
        await emailjs
        .send(
            VITE_EMAILJS_SERVICE_ID,
            VITE_EMAILJS_CONFIRMATION_TEMPLATE_ID,
            {
                email_destination: email,
            },
            {
                publicKey: VITE_EMAILJS_PUBLIC_KEY,
            }
        )
        .then(() => {
            console.log(`Email sent to ${email}`);
        })
        .catch((error) => {
            console.log(`Error sending email to ${email}:`, error);
        });
    };
};

export default sendConfirmationEmails;