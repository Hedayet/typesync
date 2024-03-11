# TypeSync: Effortlessly Keep Your Enum Structures in Sync

TypeSync is an open-source tool designed to facilitate the seamless conversion of TypeScript enums into other language enums, enabling developers to effortlessly keep their enum structures in sync across languages.

## Features

- Convert TypeScript enums to enum structures compatible with various programming languages.
- Seamlessly synchronize enum definitions across different platforms.
- Easy-to-use interface for developers transitioning between languages.

## Installation

Install TypeSync,

```bash
npm install typesync --save-dev
```

Run TypeSync,

```bash
npm run start
```

This will generate Dart enums from typescript files in the `examples` folder and store them in the `__generated/dart` folder by default. You can configure the input and output directories from the `config.json` file.

## Contributing

Contributions are welcome! This is a basic tool at this point supporting only TypeScript -> Dart enum sync. We're looking for immediate support to add more language supports. If you have any ideas for improvements or new features, feel free to open an issue or submit a pull request.

## License

TypeSync is licensed under the MIT License. See LICENSE.txt
