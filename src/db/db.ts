import mongoose from 'mongoose';
import 'dotenv/config';

const connection = {
  isConnected: 0,
};

async function connect(): Promise<void> {
  if (connection.isConnected) {
    // eslint-disable-next-line no-console
    console.log('already connected');
    return;
  }
  if (mongoose.connections.length > 0) {
    connection.isConnected = mongoose.connections[0].readyState;
    if (connection.isConnected === 1) {
      // eslint-disable-next-line no-console
      console.log('use previous connection');
      return;
    }
    await mongoose.disconnect();
  }
  const db = await mongoose.connect(process.env.MONGODB_URI as string, {});
  // eslint-disable-next-line no-console
  console.log('new connection');
  connection.isConnected = db.connections[0].readyState;
}

async function disconnect(): Promise<void> {
  if (connection.isConnected) {
    if (process.env.NODE_ENV === 'production') {
      await mongoose.disconnect();
      connection.isConnected = 0;
    } else {
      // eslint-disable-next-line no-console
      console.log('not disconnected');
    }
  }
}

// doc is a mongo document.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function convertDocToObj(doc: any): void {
  doc._id = doc._id.toString();
  if (doc.createdAt instanceof Date) {
    // number of milliseconds since epoch
    doc.createdAt = doc.createdAt.getTime();
  }
  if (doc.updatedAt instanceof Date) {
    doc.updatedAt = doc.updatedAt.getTime();
  }
}

const db = { connect, disconnect, convertDocToObj };
export default db;
