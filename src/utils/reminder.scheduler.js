import schedule from 'node-schedule'
import sendReminderEmail from './email.notifications.js';
import sendWebPushNotification from './web.push.js';
import { getSubscription } from './subscriptionStore.js';
import User from '../models/user.model.js';
const schedularReminder = async (task) => {
    if (task.reminderTime) {
        const user = await User.findOne({_id:task.userID});
            if (!user) {
                console.error("User not found for task:", task._id);
                return;
            }
        console.log("Scheduling reminder for task:", task.title);
        // Schedule the reminder using node-schedule

        const utcDate = new Date(task.reminderTime);

        const reminderTime = new Date(utcDate.getTime() - 3 * 60 * 60 * 1000);
        schedule.scheduleJob(task._id.toString(), reminderTime, () => {
            console.log(`Reminder for task ${task._id}: ${task.Title} at ${task.reminderTime}`);
            sendReminderEmail(task,user.email);
            const subscription = getSubscription()
            console.log(subscription)
            sendWebPushNotification(subscription ,task);
        });
    }
};
export default schedularReminder ;