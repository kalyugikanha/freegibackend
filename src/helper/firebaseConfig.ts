import admin from "firebase-admin";
import config from "config";

var serviceAccount: any = config.get("firebase");
const storageBucketUrl: string = config.get("storageBucketUrl");

export const app = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: storageBucketUrl,
  databaseURL: "https://trackbook-35f2e-default-rtdb.firebaseio.com",
});

export const bucket = admin.storage().bucket();

export const uploadFile = async (body: any) => {
  const filePath = body.file.path; 
  const destinationPath =
    (body.folder ? body.folder + "/" : "") + body.filename; 

  const options = {
    destination: destinationPath,
    metadata: {
      contentType: body.file.mimetype, // Set content type (e.g., image/jpeg)
    },
    public: true, // Optionally make it publicly accessible
  };

  try {
    // Upload the file to Firebase Storage
    await bucket.upload(filePath, options);
    // Get the public URL of the uploaded file
    const file = bucket.file(destinationPath);
    const [url] = await file.getSignedUrl({
      action: "read",
      expires: "03-09-2491", // Set the expiration date far in the future
    });

    return url; // Return the public URL of the uploaded image
  } catch (error: any) {
    throw new Error(`Failed to upload file: ${error.message}`);
  }
};
