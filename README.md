<!-- Open Graph Meta Tags for Social Sharing -->
<!-- <meta property="og:title" content="historical-weather-utils - Historical Weather Data Utilities for Node.js" /> -->
<!-- <meta property="og:description" content="A powerful Node.js utility library for fetching and analyzing historical weather data using the Open-Meteo Archive API. No API key required." /> -->
<!-- <meta property="og:type" content="website" /> -->
<!-- <meta property="og:url" content="https://www.npmjs.com/package/historical-weather-utils" /> -->
<!-- <meta property="og:image" content="https://raw.githubusercontent.com/historical-weather-utils/historical-weather-utils/main/assets/banner.png" /> -->
<!-- <meta property="twitter:card" content="summary_large_image" /> -->
<!-- <meta property="twitter:title" content="historical-weather-utils" /> -->
<!-- <meta property="twitter:description" content="Fetch & analyze historical weather data with ease. No API key required." /> -->

<div align="center">

# 🌦️⛈️🌡️ historical-weather-utils 🌧️❄️🌤️

### Your go-to toolkit for historical weather data in Node.js

[![npm version](https://img.shields.io/npm/v/historical-weather-utils?color=cb0000&style=for-the-badge&logo=npm)](https://www.npmjs.com/package/historical-weather-utils)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![Node Version](https://img.shields.io/badge/node-%3E%3D18-brightgreen?style=for-the-badge&logo=node.js)](https://nodejs.org)
[![Downloads](https://img.shields.io/npm/dm/historical-weather-utils?style=for-the-badge&color=blue)](https://www.npmjs.com/package/historical-weather-utils)
[![Build Status](https://img.shields.io/github/actions/workflow/status/historical-weather-utils/historical-weather-utils/ci.yml?style=for-the-badge)](https://github.com/historical-weather-utils/historical-weather-utils/actions)

---

*Effortlessly fetch, analyze, and compare historical weather data from anywhere on Earth.*
*Powered by the [Open-Meteo Archive API](https://open-meteo.com/) — **100% free, no API key required.***

</div>

---

## 📖 Description

**historical-weather-utils** is a lightweight, developer-friendly Node.js library that makes working with historical weather data a breeze. Whether you're building a climate research tool, a data visualization dashboard, an agricultural planning app, or just satisfying your curiosity about what the weather was like on your birthday — this package has you covered.

Under the hood, it leverages the excellent [Open-Meteo Archive API](https://open-meteo.com/en/docs/historical-weather-api), which provides free access to historical weather data dating back to **1940** with no API key or registration required. We handle all the API communication, data transformation, error handling, and response normalization so you can focus on what matters: using the data.

---

## ✨ Features

- 🌡️ **Historical Temperature Lookups** — Get daily min, max, and mean temperatures for any date range
- 🌧️ **Precipitation Data** — Access rainfall, snowfall, and total precipitation records
- 💨 **Wind Metrics** — Retrieve wind speed, direction, and gust data
- 💧 **Humidity & Pressure** — Fetch relative humidity, dewpoint, and surface pressure readings
- 📅 **Flexible Date Ranges** — Query a single day, a week, a month, or multiple years
- 📊 **Monthly Averages** — Compute monthly weather averages with a single function call
- 🔄 **Year-over-Year Comparison** — Compare the same month across different years for trend analysis
- 🌍 **Global Coverage** — Works for any latitude/longitude coordinates on Earth
- 🔑 **No API Key Required** — Uses the free Open-Meteo Archive API
- 📦 **Zero Configuration** — Install and start using immediately
- 🛡️ **Built-in Error Handling** — Graceful handling of network errors, invalid coordinates, and date range issues
- 🔷 **Full TypeScript Support** — Ships with comprehensive type definitions
- ⚡ **Lightweight** — Minimal dependencies, fast execution

---

## 📋 Requirements

- **Node.js** >= 18.0.0 (uses native `fetch`)
- **npm** >= 9.0.0 or **yarn** >= 1.22.0

---

## 🚀 Installation

```bash
# Using npm
npm install historical-weather-utils

# Using yarn
yarn add historical-weather-utils

# Using pnpm
pnpm add historical-weather-utils
```

---

## ⚡ Quick Start

Get up and running in under 30 seconds:

```javascript
import {
  getHistoricalWeather,
  getHistoricalTemperature,
  getMonthlyAverages,
  compareYears
} from 'historical-weather-utils';

// Fetch a week of weather data for New York City
const weather = await getHistoricalWeather({
  latitude: 40.7128,
  longitude: -74.0060,
  startDate: '2023-07-01',
  endDate: '2023-07-07'
});

console.log(weather.daily[0]);
// {
//   date: '2023-07-01',
//   temperatureMax: 31.2,
//   temperatureMin: 22.4,
//   temperatureMean: 26.8,
//   precipitation: 0.0,
//   windSpeedMax: 15.3,
//   humidityMean: 62.5,
//   ...
// }
```

**CommonJS usage:**

```javascript
const { getHistoricalWeather } = require('historical-weather-utils');
```

---

## 📚 Full API Reference

### `getHistoricalWeather(options)`

Fetches comprehensive daily weather data for a given location and date range.

#### Parameters

| Parameter    | Type     | Required | Description                                      |
|-------------|----------|----------|--------------------------------------------------|
| `latitude`  | `number` | ✅       | Latitude of the location (-90 to 90)             |
| `longitude` | `number` | ✅       | Longitude of the location (-180 to 180)          |
| `startDate` | `string` | ✅       | Start date in `YYYY-MM-DD` format                |
| `endDate`   | `string` | ✅       | End date in `YYYY-MM-DD` format                  |
| `units`     | `string` | ❌       | Unit system: `"metric"` (default) or `"imperial"` |
| `timezone`  | `string` | ❌       | Timezone string (default: `"UTC"`)               |

#### Returns

`Promise<HistoricalWeatherResponse>`

#### Example

```javascript
import { getHistoricalWeather } from 'historical-weather-utils';

// Fetch two weeks of weather data for London
const londonWeather = await getHistoricalWeather({
  latitude: 51.5074,
  longitude: -0.1278,
  startDate: '2023-06-01',
  endDate: '2023-06-14',
  units: 'metric',
  timezone: 'Europe/London'
});

console.log(`Fetched ${londonWeather.daily.length} days of data`);
console.log(`Location: ${londonWeather.metadata.resolvedAddress}`);

// Iterate through daily records
for (const day of londonWeather.daily) {
  console.log(
    `${day.date}: ${day.temperatureMin}°C - ${day.temperatureMax}°C, ` +
    `Precipitation: ${day.precipitation}mm, ` +
    `Wind: ${day.windSpeedMax} km/h`
  );
}
```

```javascript
// Using imperial units for a US location
const chicagoWeather = await getHistoricalWeather({
  latitude: 41.8781,
  longitude: -87.6298,
  startDate: '2022-12-20',
  endDate: '2022-12-31',
  units: 'imperial',
  timezone: 'America/Chicago'
});

// Temperatures will be in °F, wind in mph, precipitation in inches
console.log(chicagoWeather.daily[0].temperatureMax); // e.g., 28.4 (°F)
```

---

### `getHistoricalTemperature(options)`

A convenience function that returns temperature data for a single specific date. Perfect for quick lookups like "What was the temperature on my wedding day?"

#### Parameters

| Parameter    | Type     | Required | Description                                      |
|-------------|----------|----------|--------------------------------------------------|
| `latitude`  | `number` | ✅       | Latitude of the location (-90 to 90)             |
| `longitude` | `number` | ✅       | Longitude of the location (-180 to 180)          |
| `date`      | `string` | ✅       | Date in `YYYY-MM-DD` format                      |
| `units`     | `string` | ❌       | Unit system: `"metric"` (default) or `"imperial"` |

#### Returns

`Promise<TemperatureResponse>`

#### Example

```javascript
import { getHistoricalTemperature } from 'historical-weather-utils';

// What was the temperature in Paris on Bastille Day 2023?
const bastilleDay = await getHistoricalTemperature({
  latitude: 48.8566,
  longitude: 2.3522,
  date: '2023-07-14'
});

console.log(bastilleDay);
// {
//   date: '2023-07-14',
//   location: { latitude: 48.86, longitude: 2.35, elevation: 38.0 },
//   temperature: {
//     min: 17.8,
//     max: 28.3,
//     mean: 23.1,
//     unit: '°C'
//   },
//   apparentTemperature: {
//     min: 16.9,
//     max: 30.1,
//     mean: 23.5,
//     unit: '°C'
//   }
// }

console.log(`It was between ${bastilleDay.temperature.min}°C and ${bastilleDay.temperature.max}°C`);
```

---

### `getMonthlyAverages(options)`

Calculates monthly average weather statistics for a given location, year, and month. Useful for understanding typical weather patterns and seasonal norms.

#### Parameters

| Parameter    | Type     | Required | Description                                      |
|-------------|----------|----------|--------------------------------------------------|
| `latitude`  | `number` | ✅       | Latitude of the location (-90 to 90)             |
| `longitude` | `number` | ✅       | Longitude of the location (-180 to 180)          |
| `year`      | `number` | ✅       | Year (1940 - last year)                          |
| `month`     | `number` | ✅       | Month (1-12)                                     |
| `units`     | `string` | ❌       | Unit system: `"metric"` (default) or `"imperial"` |

#### Returns

`Promise<MonthlyAveragesResponse>`

#### Example

```javascript
import { getMonthlyAverages } from 'historical-weather-utils';

// Get average weather for Tokyo in August 2023
const tokyoAugust = await getMonthlyAverages({
  latitude: 35.6762,
  longitude: 139.6503,
  year: 2023,
  month: 8
});

console.log(tokyoAugust);
// {
//   location: { latitude: 35.68, longitude: 139.65, elevation: 40.0 },
//   period: { year: 2023, month: 8, monthName: 'August', daysInMonth: 31 },
//   averages: {
//     temperatureMax: 34.2,
//     temperatureMin: 26.1,
//     temperatureMean: 30.1,
//     precipitation: 5.8,
//     totalPrecipitation: 179.8,
//     windSpeedMax: 12.4,
//     humidityMean: 71.3,
//     unit: { temperature: '°C', precipitation: 'mm', wind: 'km/h', humidity: '%' }
//   },
//   extremes: {
//     hottestDay: { date: '2023-08-10', temperatureMax: 37.8 },
//     coldestDay: { date: '2023-08-28', temperatureMin: 23.4 },
//     wettestDay: { date: '2023-08-15', precipitation: 42.1 },
//     windiestDay: { date: '2023-08-09', windSpeedMax: 28.7 }
//   }
// }

console.log(`Average high in Tokyo, August 2023: ${tokyoAugust.averages.temperatureMax}°C`);
console.log(`Total rainfall: ${tokyoAugust.averages.totalPrecipitation}mm`);
console.log(`Hottest day: ${tokyoAugust.extremes.hottestDay.date} at ${tokyoAugust.extremes.hottestDay.temperatureMax}°C`);
```

---

### `compareYears(options)`

Compares weather data for the same month across multiple years. Invaluable for climate trend analysis, academic research, and understanding how weather patterns change over time.

#### Parameters

| Parameter    | Type       | Required | Description                                      |
|-------------|------------|----------|--------------------------------------------------|
| `latitude`  | `number`   | ✅       | Latitude of the location (-90 to 90)             |
| `longitude` | `number`   | ✅       | Longitude of the location (-180 to 180)          |
| `years`     | `number[]` | ✅       | Array of years to compare (1940 - last year)     |
| `month`     | `number`   | ✅       | Month to compare (1-12)                          |
| `units`     | `string`   | ❌       | Unit system: `"metric"` (default) or `"imperial"` |

#### Returns

`Promise<CompareYearsResponse>`

#### Example

```javascript
import { compareYears } from 'historical-weather-utils';

// Compare January temperatures in Sydney across 5 years
const sydneyComparison = await compareYears({
  latitude: -33.8688,
  longitude: 151.2093,
  years: [2019, 2020, 2021, 2022, 2023],
  month: 1
});

console.log(sydneyComparison);
// {
//   location: { latitude: -33.87, longitude: 151.21, elevation: 3.0 },
//   month: 1,
//   monthName: 'January',
//   comparisons: [
//     {
//       year: 2019,
//       averages: {
//         temperatureMax: 29.4,
//         temperatureMin: 20.8,
//         temperatureMean: 25.1,
//         precipitation: 2.1,
//         totalPrecipitation: 65.1,
//         windSpeedMax: 18.2,
//         humidityMean: 63.4
//       }
//     },
//     {
//       year: 2020,
//       averages: {