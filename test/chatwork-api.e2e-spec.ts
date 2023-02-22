import fetch from 'node-fetch';
import { URLSearchParams } from 'url';

describe('Chatwork API', () => {
  it('/me', async () => {
    const fetchUrl = 'https://api.chatwork.com/v2/me';
    const fetchResponse = await fetch(fetchUrl, {
      method: 'GET',
      headers: {
        'X-Chatworktoken': process.env.CHATWORK_API_TOKEN,
      },
    });

    console.log(fetchResponse.status);
    console.log(await fetchResponse.text());
  });

  it('/rooms/{room_id}/messages', async () => {
    const fetchUrl = `https://api.chatwork.com/v2/rooms/${process.env.ROOM_ID}/messages`;
    const fetchResponse = await fetch(fetchUrl, {
      method: 'POST',
      headers: {
        'X-Chatworktoken': process.env.CHATWORK_API_TOKEN,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        self_unread: '0',
        body: 'メッセージ本文',
      }).toString(),
    });

    console.log(fetchResponse.status);
    console.log(await fetchResponse.text());
  });
});
