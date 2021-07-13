import * as functions from "firebase-functions";
import firestore = require("@google-cloud/firestore");
const client = new firestore.v1.FirestoreAdminClient();

// Replace BUCKET_NAME
const bucket = "gs://gep-firestore-backup";

exports.scheduledFirestoreExport = functions.pubsub
    .schedule("every 2 minutes")
    .onRun((context) => {
      const projectId = process.env.GCP_PROJECT || process.env.GCLOUD_PROJECT;
      const databaseName =
    client.databasePath(projectId!, "(default)");

      return client.exportDocuments({
        name: databaseName,
        outputUriPrefix: bucket,
        // Leave collectionIds empty to export all collections
        // or set to a list of collection IDs to export,
        // collectionIds: ["users", "posts"]
        collectionIds: [],
      })
          .then((responses) => {
            const response = responses[0];
            console.log(`Operation Name: ${response["name"]}`);
          })
          .catch((err) => {
            console.error(err);
            throw new Error("Export operation failed");
          });
    });
