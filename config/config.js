require('dotenv').config();

module.exports = {
  port: process.env.PORT,
  dbUrl: process.env.MONGO_URI,
  encryptionKey: process.env.ENCRYPTION_KEY,
  jwtPrivateKey: process.env.JWT_PRIVATE_KEY,
  file: {
    path: "./files/",
  },
  firebase: {
    type: process.env.FIREBASE_TYPE,
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID,
    auth_uri: process.env.FIREBASE_AUTH_URI,
    token_uri: process.env.FIREBASE_TOKEN_URI,
    auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_CERT_URL,
    client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL,
    universe_domain: process.env.FIREBASE_UNIVERSE_DOMAIN,
  },
  storageBucketUrl: process.env.FIREBASE_STORAGE_BUCKET,
  sendgrid_api_key: process.env.SENDGRID_API_KEY,
  sendgrid_from_email: process.env.SENDGRID_FROM_EMAIL,
  pushNotification: {
    status: process.env.PUSH_NOTIFICATION_ENABLED === 'true',
    serverKey: process.env.FCM_SERVER_KEY,
  }
};
