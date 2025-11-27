import twilio from "twilio";

const accountSid = process.env.MY_TWILIO_ACCOUNT_SID;
const authToken = process.env.MY_TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

const sendSMS = async (task) => {
    try {
        const message = await client.messages.create({
            body: `🔔 Reminder: ${task.title}\nDescription: ${task.description}\nDue: ${task.dueDate}`,
            from: "+2001148786601",
            to: "+2001224865175", 
    });

    console.log("SMS sent:", message.sid);
    } catch (error) {
        console.error("Error sending SMS:", error.message);
    }
};

export default sendSMS;