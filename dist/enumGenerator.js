"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.enumGenerator = void 0;
const fs_1 = __importDefault(require("fs"));
const babel = __importStar(require("@babel/core"));
const traverse_1 = __importDefault(require("@babel/traverse"));
class enumGenerator {
    constructor(inputDirectory = "./", outputDirectory = "__generated/dart", sourceFileExtensions = [".ts"]) {
        this.inputDirectory = inputDirectory;
        this.outputDirectory = outputDirectory;
        this.sourceFileExtensions = sourceFileExtensions;
        // Function to crawl through files in a directory
        this.crawlAndProcessDirectory = (directory) => {
            const files = fs_1.default.readdirSync(directory);
            for (const file of files) {
                const filePath = `${directory}/${file}`;
                const stats = fs_1.default.statSync(filePath);
                if (stats.isDirectory()) {
                    this.crawlAndProcessDirectory(filePath);
                }
                else {
                    const fileExtension = file.split(".").pop();
                    if (fileExtension &&
                        this.sourceFileExtensions.includes(`.${fileExtension}`)) {
                        this.processFile(filePath);
                    }
                }
            }
        };
        // Function to process each file
        this.processFile = (filePath) => {
            const code = fs_1.default.readFileSync(filePath, "utf8");
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
        this.traverseAst = (ast, outputDirectory) => {
            (0, traverse_1.default)(ast, {
                TSEnumDeclaration(path) {
                    enumGenerator.processEnumDeclaration(path, outputDirectory);
                },
            });
        };
        this.run = () => {
            if (fs_1.default.existsSync(this.outputDirectory)) {
                fs_1.default.rmSync(this.outputDirectory, { recursive: true });
            }
            fs_1.default.mkdirSync(this.outputDirectory, { recursive: true });
            this.crawlAndProcessDirectory(this.inputDirectory);
        };
    }
}
exports.enumGenerator = enumGenerator;
enumGenerator.generateDartEnumCode = (enumName, enumValues) => {
    const enumValuesString = enumValues
        .map((value) => `${value}`)
        .join(", ");
    return `enum ${enumName} { ${enumValuesString} }`;
};
enumGenerator.processEnumDeclaration = (path, outputDirectory) => {
    const enumName = path.node.id.name;
    const enumValues = path.node.members.map((member) => member.id.name);
    const dartEnumCode = enumGenerator.generateDartEnumCode(enumName, enumValues);
    const dartFileName = `${outputDirectory}/${enumName}.dart`;
    fs_1.default.writeFileSync(dartFileName, dartEnumCode);
};
