const admin = require('firebase-admin');

let firebaseApp = null;

function initializeFirebase() {
  if (firebaseApp) return firebaseApp;

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY
    ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
    : undefined;

  if (projectId && clientEmail && privateKey) {
    firebaseApp = admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey,
      }),
    });
    console.log('✅ Firebase Admin SDK initialized');
  } else {
    console.warn(
      '⚠️  Firebase credentials not configured. OTP verification will use mock mode.'
    );
    firebaseApp = null;
  }

  return firebaseApp;
}

function getFirebaseAuth() {
  if (!firebaseApp) return null;
  return admin.auth(firebaseApp);
}

module.exports = {
  initializeFirebase,
  getFirebaseAuth,
};
