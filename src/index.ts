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
  console.log(r.data);
};
main();
