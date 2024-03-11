import fs from "fs";
import { TsEnumToDartEnumGenerator } from "./src/enum-script";
const configPath = "./config.json";

try {
  const configData = fs.readFileSync(configPath, "utf8");
  const config = JSON.parse(configData);
  const generator = new TsEnumToDartEnumGenerator(
    `${config.inputDirectory}`,
    `${config.outputDirectory}`
  );
  generator.run();
} catch (error) {
  // console.log(error);
  console.log(
    error
    // `Error reading configuration file: ${error?.message ?? "Unknown error"}`
  );
}
