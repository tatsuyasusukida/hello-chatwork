import { createHmac } from 'crypto';
import fetch from 'node-fetch';

describe('Chatwork Webhook', () => {
  it('/api/v1/chatwork/webhook', async () => {
    const requestBody = JSON.stringify({
      webhook_setting_id: '12345',
      webhook_event_type: 'mention_to_me',
      webhook_event_time: 1498028130,
      webhook_event: {
        from_account_id: 123456,
        to_account_id: 1484814,
        room_id: 567890123,
        message_id: '789012345',
        body: '[To:1484814]おかずはなんですか？',
        send_time: 1498028125,
        update_time: 0,
      },
    });

    const webhookToken = process.env.WEBHOOK_TOKEN;
    const privateKey = Buffer.from(webhookToken, 'base64');
    const webhookSignature = createHmac('sha256', privateKey)
      .update(requestBody)
      .digest('base64');

    const fetchUrl = process.env.BASE_URL + '/api/v1/chatwork/webhook';
    const fetchResponse = await fetch(fetchUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Chatwork-Webhook/1.0.0',
        'X-Chatworkwebhooksignature': webhookSignature,
      },
      body: requestBody,
    });

    console.log(fetchResponse.status);
    console.log(await fetchResponse.text());
  });
});
