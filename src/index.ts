import axios from 'axios';
import * as querystring from 'querystring';
import * as fs from 'fs';

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

  let formData = Buffer.alloc(0);
  const boundary = 'ad05fc42-a66d-4a94-b807-f1c91136c17b';

  const appendFile = (
    fileName: string,
    contentType: string,
    content: string | Buffer
  ) => {
    let temp = `--${boundary}\r\n`;
    temp += `Content-Type: ${contentType}\r\n`;
    temp += `Content-Disposition: form-data; name="${fileName}"; filename="${fileName}"\r\n\r\n`;
    formData = Buffer.concat([formData, Buffer.from(temp, 'utf-8')]);
    if (typeof content === 'string') {
      formData = Buffer.concat([
        formData,
        Buffer.from(`${content}\r\n`, 'utf-8'),
      ]);
    } else {
      formData = Buffer.concat([formData, content as Buffer]);
    }
  };

  appendFile(
    'request.json',
    'application/json',
    `{"to": [{"phoneNumber": "${phoneNumber}"}]}`
  );
  appendFile('test.txt', 'text/plain', 'Hello world!');
  appendFile('test.png', 'image/png', fs.readFileSync('test.png'));

  const payload = Buffer.concat([
    formData,
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
