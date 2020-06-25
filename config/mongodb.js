var mongoose = require("mongoose");
// mongoLocal
// mongo_mlab
const dbURI = process.env.mongo_mlab;
// const dbURI = process.env.mongoLocal;

const dbOptions = {
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
  useCreateIndex: true,
};

// mongoose.connect(dbUri, dbOptions).catch(err => {
//   console.log("err: ", err);
// });

const db = mongoose.connection;
const reconnectTimeout = 5000; // ms.

db.on("connecting", () => {
  console.info("Connecting to MongoDB...");
});

db.on("error", (error) => {
  // console.error(`MongoDB connection error: ${error}`);
  mongoose.disconnect();
});

db.on("connected", () => {
  console.info("Connected to MongoDB!");
});

db.once("open", () => {
  console.info("MongoDB connection opened!");
});

db.on("reconnected", () => {
  console.info("MongoDB reconnected!");
});

db.on("disconnected", () => {
  console.error(
    `MongoDB disconnected! Reconnecting in ${reconnectTimeout / 1000}s...`
  );
  setTimeout(() => connectDB(), reconnectTimeout);
});

function connectDB() {
  mongoose.connect(dbURI, dbOptions).catch((err) => {
    console.log("dbURI: ", dbURI);
    // console.log("err: ", err);
  });
}

module.exports.mongoose = mongoose;
module.exports.connectDB = connectDB;

// mongoose.set('useNewUrlParser', true);
// mongoose.set('useFindAndModify', false);
// mongoose.set('useCreateIndex', true);
