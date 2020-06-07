import cron from 'node-cron';
import BackgroundTasks from './backgroundServices';

const { expiredTokenCleanUp } = BackgroundTasks;

const nezamediaScheduler = cron.schedule('* 59 23 * * *', expiredTokenCleanUp);

export default nezamediaScheduler;
