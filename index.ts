import fs from "fs";
import { enumGenerator } from "./src/enumGenerator";
import path from "path";
const configPath = path.join(process.cwd(), "typesync-config.json");

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
