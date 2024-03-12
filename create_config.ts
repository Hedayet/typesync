import fs from "fs";

const configData = {
  inputDirectory: "examples",
  outputDirectory: "__generated/dart",
  sourceExtensions: [".ts", ".tsx"],
};
const projectRoot = process.cwd();
const configFile = `${projectRoot}/typesync-config.json`;

console.log(`Creating js-typesync configuration file: ${configFile}`);
if (fs.existsSync(configFile)) {
  console.log(
    `Configuration file already exists: ${configFile}. Overwriting...`
  );
  fs.rmSync(configFile);
}
fs.writeFileSync(configFile, JSON.stringify(configData, null, 2));
console.log(`Configuration file created: ${configFile}`);
