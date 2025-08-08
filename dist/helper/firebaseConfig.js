"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadFile = exports.bucket = exports.app = void 0;
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const config_1 = __importDefault(require("config"));
var serviceAccount = config_1.default.get("firebase");
const storageBucketUrl = config_1.default.get("storageBucketUrl");
exports.app = firebase_admin_1.default.initializeApp({
    credential: firebase_admin_1.default.credential.cert(serviceAccount),
    storageBucket: storageBucketUrl,
    databaseURL: "https://trackbook-35f2e-default-rtdb.firebaseio.com",
});
exports.bucket = firebase_admin_1.default.storage().bucket();
const uploadFile = (body) => __awaiter(void 0, void 0, void 0, function* () {
    const filePath = body.file.path;
    const destinationPath = (body.folder ? body.folder + "/" : "") + body.filename;
    const options = {
        destination: destinationPath,
        metadata: {
            contentType: body.file.mimetype, // Set content type (e.g., image/jpeg)
        },
        public: true, // Optionally make it publicly accessible
    };
    try {
        // Upload the file to Firebase Storage
        yield exports.bucket.upload(filePath, options);
        // Get the public URL of the uploaded file
        const file = exports.bucket.file(destinationPath);
        const [url] = yield file.getSignedUrl({
            action: "read",
            expires: "03-09-2491", // Set the expiration date far in the future
        });
        return url; // Return the public URL of the uploaded image
    }
    catch (error) {
        throw new Error(`Failed to upload file: ${error.message}`);
    }
});
exports.uploadFile = uploadFile;
//# sourceMappingURL=firebaseConfig.js.map