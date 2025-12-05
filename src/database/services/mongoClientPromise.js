// database/services/mongoClientPromise.js

import { IS_DEVELOPMENT, MONGODB_URI } from '@/lib/constants';
import { MongoClient } from 'mongodb';

var _mongoClientPromise;

if (!MONGODB_URI) {
    throw new Error(
        'Invalid/Missing environment variable: "MONGODB_URI"'
    );
}

const uri = MONGODB_URI;
const options = {};

let client;
let mongoClientPromise;

if (IS_DEVELOPMENT) {
    // In development mode, use a global variable so that the value
    // is preserved across module reloads caused by HMR (Hot Module Replacement).
    if (!global._mongoClientPromise) {
        client = new MongoClient(uri, options);
        global._mongoClientPromise = client.connect();
    }
    mongoClientPromise = global._mongoClientPromise;
} else {
    // In production mode, it's best to not use a global variable.
    client = new MongoClient(uri, options);
    mongoClientPromise = client.connect();
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default mongoClientPromise;