import fs from "fs";
import { enumGenerator } from "./src/enumGenerator";
const configPath = "./config.json";

try {
  const configData = fs.readFileSync(configPath, "utf8");
  const config = JSON.parse(configData);
  const generator = new enumGenerator(
    config.inputDirectory,
    config.outputDirectory,
    config.sourceFileExtensions
  );
  generator.run();
} catch (error) {
  console.log(`Error reading configuration file: ${error}`);
}
