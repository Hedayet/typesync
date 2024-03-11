import fs from "fs";
import * as babel from "@babel/core";
import traverse from "@babel/traverse";

export class TsEnumToDartEnumGenerator {
  constructor(
    public outputDirectory: string = "__generated/dart",
    public projectDirectory: string = "./"
  ) {}

  // Function to crawl through files in a directory
  crawlAndProcessDirectory = (directory: string) => {
    const files = fs.readdirSync(directory);

    for (const file of files) {
      const filePath = `${directory}/${file}`;
      const stats = fs.statSync(filePath);

      if (stats.isDirectory()) {
        this.crawlAndProcessDirectory(filePath);
      } else if (file.endsWith(".ts")) {
        this.processFile(filePath);
      }
    }
  };

  static generateDartEnumCode = (
    enumName: string,
    enumValues: Array<string>
  ) => {
    const enumValuesString = enumValues
      .map((value: any) => `${value}`)
      .join(", ");

    return `enum ${enumName} { ${enumValuesString} }`;
  };

  // Function to process each file
  processFile = (filePath: string) => {
    const code = fs.readFileSync(filePath, "utf8");

    const ast = babel.parseSync(code, {
      filename: filePath,
      sourceType: "module",
      presets: ["@babel/preset-typescript"],
    });

    const outputDirectory = this.outputDirectory;
    if (ast == null) {
      return;
    }
    // Traverse the AST to identify enum declarations
    traverse(ast, {
      TSEnumDeclaration(path) {
        const enumName = path.node.id.name;
        const enumValues = path.node.members.map(
          (member) => (member.id as babel.types.Identifier).name
        );

        // Generate Dart enum code
        const dartEnumCode = TsEnumToDartEnumGenerator.generateDartEnumCode(
          enumName,
          enumValues
        );

        // Write Dart enum file
        const dartFileName = `${outputDirectory}/${enumName}.dart`;
        fs.writeFileSync(dartFileName, dartEnumCode);
      },
    });
  };

  run = (): void => {
    if (fs.existsSync(this.outputDirectory)) {
      fs.rmSync(this.outputDirectory, { recursive: true });
    }
    fs.mkdirSync(this.outputDirectory, { recursive: true });

    this.crawlAndProcessDirectory(this.projectDirectory);
  };
}

const generator = new TsEnumToDartEnumGenerator();
generator.run();
