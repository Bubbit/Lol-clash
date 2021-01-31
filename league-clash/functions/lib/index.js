"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
// The Firebase Admin SDK to access Cloud Firestore.
const admin = require("firebase-admin");
admin.initializeApp();
// Take the text parameter passed to this HTTP endpoint and insert it into 
// Cloud Firestore under the path /messages/:documentId/original
exports.addMessage = functions.https.onRequest(async (req, res) => {
    // Grab the text parameter.
    const original = req.query.text;
    console.log(original);
    // Push the new message into Cloud Firestore using the Firebase Admin SDK.
    var db = admin.database();
    var ref = db.ref("server/saving-data/fireblog");
    var usersRef = ref.child("users");
    usersRef.set({
        alanisawesome: {
            date_of_birth: "June 23, 1912",
            full_name: "Alan Turing"
        },
        gracehop: {
            date_of_birth: "December 9, 1906",
            full_name: "Grace Hopper"
        }
    });
    console.log(ref);
    // const writeResult = await admin.database().ref('messages').set({original: original});
    console.log('result');
    // Send back a message that we've successfully written the message
    res.json({ result: `Message with ID: ${original} added.` });
});
// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
// Listens for new messages added to /messages/:documentId/original and creates an
// uppercase version of the message to /messages/:documentId/uppercase
// exports.makeUppercase = functions.firestore.document('/messages/{documentId}')
//     .onCreate((snap, context) => {
//       // Grab the current value of what was written to Cloud Firestore.
//       const original = snap.data().original;
//       // Access the parameter `{documentId}` with `context.params`
//       functions.logger.log('Uppercasing', context.params.documentId, original);
//       const uppercase = original.toUpperCase();
//       // You must return a Promise when performing asynchronous tasks inside a Functions such as
//       // writing to Cloud Firestore.
//       // Setting an 'uppercase' field in Cloud Firestore document returns a Promise.
//       return snap.ref.set({uppercase}, {merge: true});
//     });
//# sourceMappingURL=index.js.map