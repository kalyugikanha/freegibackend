import _ from "lodash";
import config from "config";
import axios from "axios";
import { DeviceToken } from "../models/deviceToken";

const firebaseApiUrl: string = 'https://fcm.googleapis.com/fcm/send';

export const sendNotification = async (data: any) => {
    if (!config.get('pushNotification.status')) return false;
    if (!data.title || data.title === '' || !data.description || data.description === '' || !data.fcmTokens || data.fcmTokens.length == 0) return false;

    let serverKey: any = config.get('pushNotification.serverKey');

    let notificationData: any = {};
    notificationData.title = data.title;
    notificationData.description = data.description;

    let fcmTokenArrays: any[] = _.chunk(data.fcm_tokens, 1000);
    for (let i = 0; i < fcmTokenArrays.length; i++) {
        let tokens: any[] = fcmTokenArrays[i];

        let _notification: any = {};
        _notification.title = data.title;
        _notification.body = data.description;

        let _notification_data: any = {
            click_action: 'FLUTTER_NOTIFICATION_CLICK'
        };
        if (data.data && typeof data.data === 'object') {
            _notification_data = Object.assign(_notification_data, data.data);
        }

        let body: any = {
            registration_ids: tokens,
            notification: _notification,
            data: _notification_data
        };

        let response: any = await axios.post(firebaseApiUrl, body, {
            headers: {
                'Authorization': 'key=' + serverKey,
                'Content-Type': 'application/json'
            }
        });
        if (response && response.data) {
            let results: any = response.data.results;
            let invalidTokens: string[] = [];
            for (let j = 0; j < results.length; j++) {
                if (results[j].error == "NotRegistered" || results[j].error == "InvalidRegistration") {
                    invalidTokens.push(tokens[j]);
                }
            }
            if (invalidTokens.length > 0) {
                await DeviceToken.deleteMany({ fcmToken: { '$in': invalidTokens } });
            }
        }
    }
    return true;
};