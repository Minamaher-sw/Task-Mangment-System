
import webpush from "web-push";


// eslint-disable-next-line no-undef
const publicVapidKey = process.env.VAPID_PUBLIC_KEY;
// eslint-disable-next-line no-undef
const privateVapidKey = process.env.VAPID_PRIVATE_KEY;

webpush.setVapidDetails(
    "mailto:mena.maherqw@gmail.com",
    publicVapidKey,
    privateVapidKey
);

/**
 * @param {Object} subscription 
 * @param {Object} task 
 */
const sendWebPushNotification = async (subscription, task) => {
    const payload = JSON.stringify({
        title: `🔔 Reminder: ${task.title}`,
        body: `📝 ${task}`,
    });

    try {
        await webpush.sendNotification(subscription, payload);
        console.log("✅ Notification sent for task:", task.title);
    } catch (error) {
        console.error("❌ Failed to send notification:", error);
    }
};

export default sendWebPushNotification;