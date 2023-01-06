import axios from 'axios';

const server = process.env.RINGCENTRAL_SERVER_URL!;
const clientId = process.env.RINGCENTRAL_CLIENT_ID!;
const clientSecret = process.env.RINGCENTRAL_CLIENT_SECRET!;
const jwtToken = process.env.RINGCENTRAL_JWT_TOKEN!;
const phoneNumber = process.env.PHONE_NUMBER!;

console.log(server, clientId, clientSecret, jwtToken, phoneNumber);
