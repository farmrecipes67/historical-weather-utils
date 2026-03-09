<!-- historical-weather-utils: Utilities for fetching and analyzing historical weather data using the free Open-Meteo API. No API key required. -->

# historical-weather-utils

[![GitHub last commit](https://img.shields.io/github/last-commit/farmrecipes67/historical-weather-utils)](https://github.com/farmrecipes67/historical-weather-utils/commits/main)
[![License](https://img.shields.io/github/license/farmrecipes67/historical-weather-utils)](./LICENSE)
![GitHub repo size](https://img.shields.io/github/repo-size/farmrecipes67/historical-weather-utils)

Utilities for fetching and analyzing historical weather data. Built on top of the free [Open-Meteo API](https://open-meteo.com/) — **no API key required**.

## Overview

**historical-weather-utils** is a lightweight Node.js package that makes it easy to retrieve and work with historical weather data. Whether you're building dashboards, performing climate analysis, or just exploring past weather patterns, this library provides a simple interface to get the data you need.

## Project Structure

| File | Description |
|------|-------------|
| `index.js` | Main module — core utilities for fetching and analyzing historical weather data |
| `test.js` | Test suite for validating functionality |
| `package.json` | Node.js package configuration and dependencies |
| `LICENSE` | Project license |
| `.gitignore` | Git ignore rules |

## Installation

```bash
npm install historical-weather-utils
```

Or clone the repository directly:

```bash
git clone https://github.com/farmrecipes67/historical-weather-utils.git
cd historical-weather-utils
npm install
```

## Usage

```js
const weatherUtils = require("historical-weather-utils");
```

Since this package uses the [Open-Meteo API](https://open-meteo.com/), no API key or account registration is needed. Simply install and start making requests.

## Running Tests

```bash
node test.js
```

## API Source

This project relies on the **Open-Meteo API**, which provides:

- Free access to historical weather data
- No API key requirement
- Global coverage

Learn more at [https://open-meteo.com/](https://open-meteo.com/)

## Requirements

- **Node.js** (check `package.json` for specific version and dependency details)

## License

This project is licensed under the terms specified in the [LICENSE](./LICENSE) file.

## Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request on [GitHub](https://github.com/farmrecipes67/historical-weather-utils).

---

<sub>📝 This README was auto-generated. Last updated: 2026-03-08</sub>