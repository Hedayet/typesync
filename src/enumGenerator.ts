import fs from "fs";
import * as babel from "@babel/core";
import traverse from "@babel/traverse";

export class enumGenerator {
  constructor(
    public inputDirectory: string = "./",
    public outputDirectory: string = "__generated/dart",
    public sourceFileExtensions: string[] = [".ts"]
  ) {}

  // Function to crawl through files in a directory
  crawlAndProcessDirectory = (directory: string) => {
    const files = fs.readdirSync(directory);

    for (const file of files) {
      const filePath = `${directory}/${file}`;
      const stats = fs.statSync(filePath);

      if (stats.isDirectory()) {
        this.crawlAndProcessDirectory(filePath);
      } else {
        const fileExtension = file.split(".").pop();
        if (
          fileExtension &&
          this.sourceFileExtensions.includes(`.${fileExtension}`)
        ) {
          this.processFile(filePath);
        }
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
      presets: [
        ["@babel/preset-env", { targets: { node: "current" } }],
        "@babel/preset-typescript",
      ],
    });

    const outputDirectory = this.outputDirectory;
    if (ast == null) {
      return;
    }
    this.traverseAst(ast, outputDirectory);
  };

  private traverseAst = (ast: any, outputDirectory: string) => {
    traverse(ast, {
      TSEnumDeclaration(path) {
        enumGenerator.processEnumDeclaration(path, outputDirectory);
      },
    });
  };

  private static processEnumDeclaration = (
    path: any,
    outputDirectory: string
  ) => {
    const enumName = path.node.id.name;
    const enumValues = path.node.members.map(
      (member: { id: babel.types.Identifier }) =>
        (member.id as babel.types.Identifier).name
    );

    const dartEnumCode = enumGenerator.generateDartEnumCode(
      enumName,
      enumValues
    );

    const dartFileName = `${outputDirectory}/${enumName}.dart`;
    fs.writeFileSync(dartFileName, dartEnumCode);
  };

  run = (): void => {
    if (fs.existsSync(this.outputDirectory)) {
      fs.rmSync(this.outputDirectory, { recursive: true });
    }
    fs.mkdirSync(this.outputDirectory, { recursive: true });

    this.crawlAndProcessDirectory(this.inputDirectory);
  };
}
