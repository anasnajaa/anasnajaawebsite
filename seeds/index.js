require("dotenv").config();
const environment = process.env.NODE_ENV;
const stage = require("../../config/index")[environment];
const fs = require("fs");
const util = require("util");
const readDir = util.promisify(fs.readdir).bind(fs);
const path = require("path");
const mongoose = require("mongoose");

mongoose.connect(stage.mongoUri, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

const connection = mongoose.connection;

const t = stage.mongoUri;
console.log(`Seeding started.`);
console.log(`Target Database: ${t.split("/")[3].split("?")[0]}`);

setTimeout(() => {
  connection.once("open", async () => {
    console.log("MongoDB connection established.");
    const modelsToSeed = ["service", "country"];
    await runSeeds(modelsToSeed);
  });
}, 500);

async function runSeeds(runSaveMiddleware = false, models = []) {
  const dir = await readDir(__dirname);
  const seedFiles = dir.filter((f) => f.endsWith(".seed.js"));
  for (const file of seedFiles) {
    const fileName = file.split(".seed.js")[0];
    const modelName = fileName.toLowerCase();

    if (models.length > 0 && !models.find((x) => x === modelName)) {
      console.log(`Collection ${modelName} ignored.`);
      continue;
    }

    const model = require(`../../models/${modelName}.m`);

    if (!model) throw new Error(`Cannot find Model '${modelName}'`);

    const fileContents = require(path.join(__dirname, file));

    let insertedRecords = null;

    console.log(`Seeding Collection ${modelName}...`);

    if (runSaveMiddleware) {
      insertedRecords = await model.create(fileContents);
    } else {
      insertedRecords = await model.insertMany(fileContents);
    }

    console.log(
      `${modelName} seeding completed, ${insertedRecords.length} records added.\n----`
    );
  }
  connection.close(() => {
    console.log("MongoDB connection closed.");
  });
}
