import axios from 'axios';
import * as querystring from 'querystring';

const server = process.env.RINGCENTRAL_SERVER_URL!;
const clientId = process.env.RINGCENTRAL_CLIENT_ID!;
const clientSecret = process.env.RINGCENTRAL_CLIENT_SECRET!;
const jwtToken = process.env.RINGCENTRAL_JWT_TOKEN!;
const phoneNumber = process.env.PHONE_NUMBER!;

const main = async () => {
  const r = await axios.post(
    `${server}/restapi/oauth/token`,
    querystring.stringify({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwtToken,
    }),
    {
      auth: {
        username: clientId,
        password: clientSecret,
      },
    }
  );
  const accessToken = r.data.access_token;

  let formData = '';
  const boundary = 'ad05fc42-a66d-4a94-b807-f1c91136c17b';
  formData += `--${boundary}\r\n`;
  formData += 'Content-Type: application/json; charset=utf-8\r\n';
  formData +=
    'Content-Disposition: form-data; name="request.json"; filename="request.json"\r\n\r\n';
  formData += `{"to": [{"phoneNumber": "${phoneNumber}"}]}\r\n`;

  formData += `--${boundary}\r\n`;
  formData += 'Content-Type: text/plain; charset=utf-8\r\n';
  formData +=
    'Content-Disposition: form-data; name="test.txt"; filename="test.txt"\r\n\r\n';
  formData += 'Hello world\r\n';

  const payload = Buffer.concat([
    Buffer.from(formData, 'utf8'),
    Buffer.from('\r\n--' + boundary + '--\r\n', 'utf8'),
  ]);

  const r2 = await axios.post(
    `${server}/restapi/v1.0/account/~/extension/~/fax`,
    payload,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'multipart/form-data; boundary=' + boundary,
      },
    }
  );
  console.log(r2.data);
};
main();
