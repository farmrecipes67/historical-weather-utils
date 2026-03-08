const BASE_URL = 'https://archive-api.open-meteo.com/v1/archive';

const DAILY_PARAMS = [
  'temperature_2m_max',
  'temperature_2m_min',
  'temperature_2m_mean',
  'precipitation_sum',
  'windspeed_10m_max',
  'relative_humidity_2m_mean'
].join(',');

/**
 * Validates that a value is a finite number within an optional range.
 * @param {*} value - The value to validate.
 * @param {string} name - The parameter name for error messages.
 * @param {number} [min] - Optional minimum allowed value.
 * @param {number} [max] - Optional maximum allowed value.
 * @throws {Error} If the value is not a valid number or is out of range.
 */
function validateNumber(value, name, min, max) {
  if (value === undefined || value === null || typeof value !== 'number' || !Number.isFinite(value)) {
    throw new Error(`"${name}" must be a finite number. Received: ${value}`);
  }
  if (min !== undefined && value < min) {
    throw new Error(`"${name}" must be >= ${min}. Received: ${value}`);
  }
  if (max !== undefined && value > max) {
    throw new Error(`"${name}" must be <= ${max}. Received: ${value}`);
  }
}

/**
 * Validates that a string matches the YYYY-MM-DD date format and represents a real date.
 * @param {string} dateStr - The date string to validate.
 * @param {string} name - The parameter name for error messages.
 * @throws {Error} If the date string is invalid.
 * @returns {string} The validated date string.
 */
function validateDateString(dateStr, name) {
  if (typeof dateStr !== 'string') {
    throw new Error(`"${name}" must be a string in YYYY-MM-DD format. Received: ${dateStr}`);
  }
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateStr)) {
    throw new Error(`"${name}" must be in YYYY-MM-DD format. Received: "${dateStr}"`);
  }
  const parsed = new Date(dateStr + 'T00:00:00Z');
  if (isNaN(parsed.getTime())) {
    throw new Error(`"${name}" is not a valid date. Received: "${dateStr}"`);
  }
  // Verify the date components match (guards against e.g. Feb 30)
  const [y, m, d] = dateStr.split('-').map(Number);
  if (parsed.getUTCFullYear() !== y || parsed.getUTCMonth() + 1 !== m || parsed.getUTCDate() !== d) {
    throw new Error(`"${name}" is not a valid calendar date. Received: "${dateStr}"`);
  }
  return dateStr;
}

/**
 * Validates latitude and longitude values.
 * @param {number} latitude - Latitude (-90 to 90).
 * @param {number} longitude - Longitude (-180 to 180).
 * @throws {Error} If coordinates are out of range.
 */
function validateCoordinates(latitude, longitude) {
  validateNumber(latitude, 'latitude', -90, 90);
  validateNumber(longitude, 'longitude', -180, 180);
}

/**
 * Returns the number of days in a given month of a given year.
 * @param {number} year - The year.
 * @param {number} month - The month (1-12).
 * @returns {number} The number of days in the month.
 */
function daysInMonth(year, month) {
  return new Date(year, month, 0).getDate();
}

/**
 * Computes the arithmetic mean of an array of numbers, ignoring null/undefined values.
 * @param {Array<number|null>} arr - The array of numbers.
 * @returns {number|null} The mean, or null if no valid values.
 */
function mean(arr) {
  const valid = arr.filter(v => v !== null && v !== undefined && Number.isFinite(v));
  if (valid.length === 0) return null;
  return valid.reduce((sum, v) => sum + v, 0) / valid.length;
}

/**
 * Computes the sum of an array of numbers, ignoring null/undefined values.
 * @param {Array<number|null>} arr - The array of numbers.
 * @returns {number|null} The sum, or null if no valid values.
 */
function sum(arr) {
  const valid = arr.filter(v => v !== null && v !== undefined && Number.isFinite(v));
  if (valid.length === 0) return null;
  return valid.reduce((s, v) => s + v, 0);
}

/**
 * Rounds a number to a specified number of decimal places. Returns null if value is null.
 * @param {number|null} value - The value to round.
 * @param {number} [decimals=2] - Number of decimal places.
 * @returns {number|null} The rounded value.
 */
function round(value, decimals = 2) {
  if (value === null || value === undefined) return null;
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}

/**
 * Fetches data from the Open-Meteo Archive API.
 * @param {number} latitude - Latitude of the location.
 * @param {number} longitude - Longitude of the location.
 * @param {string} startDate - Start date in YYYY-MM-DD format.
 * @param {string} endDate - End date in YYYY-MM-DD format.
 * @param {string} [timezone='UTC'] - Timezone string (e.g. 'America/New_York').
 * @returns {Promise<Object>} The parsed JSON response from the API.
 * @throws {Error} If the API request fails or returns an error.
 */
async function fetchArchiveData(latitude, longitude, startDate, endDate, timezone = 'UTC') {
  const url = new URL(BASE_URL);
  url.searchParams.set('latitude', latitude.toString());
  url.searchParams.set('longitude', longitude.toString());
  url.searchParams.set('start_date', startDate);
  url.searchParams.set('end_date', endDate);
  url.searchParams.set('daily', DAILY_PARAMS);
  url.searchParams.set('timezone', timezone || 'UTC');

  const response = await fetch(url.toString());

  if (!response.ok) {
    let errorMessage = `Open-Meteo API request failed with status ${response.status}`;
    try {
      const errorBody = await response.json();
      if (errorBody && errorBody.reason) {
        errorMessage += `: ${errorBody.reason}`;
      }
    } catch (_) {
      // Ignore JSON parse errors on the error body
    }
    throw new Error(errorMessage);
  }

  const data = await response.json();

  if (data.error) {
    throw new Error(`Open-Meteo API error: ${data.reason || 'Unknown error'}`);
  }

  return data;
}

/**
 * Parses the daily data from the Open-Meteo API response into a standardized array of day objects.
 * @param {Object} daily - The `daily` object from the API response.
 * @returns {Array<Object>} Array of objects with date, tempMax, tempMin, tempMean, precipitation, windSpeed, humidity.
 */
function parseDailyData(daily) {
  if (!daily || !daily.time || !Array.isArray(daily.time)) {
    return [];
  }

  return daily.time.map((date, i) => ({
    date,
    tempMax: daily.temperature_2m_max ? daily.temperature_2m_max[i] : null,
    tempMin: daily.temperature_2m_min ? daily.temperature_2m_min[i] : null,
    tempMean: daily.temperature_2m_mean ? daily.temperature_2m_mean[i] : null,
    precipitation: daily.precipitation_sum ? daily.precipitation_sum[i] : null,
    windSpeed: daily.windspeed_10m_max ? daily.windspeed_10m_max[i] : null,
    humidity: daily.relative_humidity_2m_mean ? daily.relative_humidity_2m_mean[i] : null
  }));
}

/**
 * Fetches historical daily weather data for a location over a date range using the Open-Meteo Archive API.
 *
 * @async
 * @param {Object} params - The parameters object.
 * @param {number} params.latitude - Latitude of the location (-90 to 90).
 * @param {number} params.longitude - Longitude of the location (-180 to 180).
 * @param {string} params.startDate - Start date in YYYY-MM-DD format.
 * @param {string} params.endDate - End date in YYYY-MM-DD format.
 * @param {string} [params.timezone='UTC'] - Timezone string (e.g. 'America/New_York').
 * @returns {Promise<Object>} An object containing location info, period, and daily weather data.
 * @returns {Object} return.location - The location coordinates.
 * @returns {number} return.location.lat - Latitude.
 * @returns {number} return.location.lon - Longitude.
 * @returns {Object} return.period - The date range.
 * @returns {string} return.period.start - Start date.
 * @returns {string} return.period.end - End date.
 * @returns {Array<Object>} return.daily - Array of daily weather objects.
 * @returns {string} return.daily[].date - The date (YYYY-MM-DD).
 * @returns {number|null} return.daily[].tempMax - Maximum temperature in °C.
 * @returns {number|null} return.daily[].tempMin - Minimum temperature in °C.
 * @returns {number|null} return.daily[].tempMean - Mean temperature in °C.
 * @returns {number|null} return.daily[].precipitation - Total precipitation in mm.
 * @returns {number|null} return.daily[].windSpeed - Maximum wind speed at 10m in km/h.
 * @returns {number|null} return.daily[].humidity - Mean relative humidity in %.
 * @throws {Error} If parameters are invalid or the API request fails.
 *
 * @example
 * const data = await getHistoricalWeather({
 *   latitude: 52.52,
 *   longitude: 13.41,
 *   startDate: '2023-01-01',
 *   endDate: '2023-01-31',
 *   timezone: 'Europe/Berlin'
 * });
 */
async function getHistoricalWeather({ latitude, longitude, startDate, endDate, timezone } = {}) {
  validateCoordinates(latitude, longitude);
  validateDateString(startDate, 'startDate');
  validateDateString(endDate, 'endDate');

  if (new Date(startDate) > new Date(endDate)) {
    throw new Error(`"startDate" (${startDate}) must not be after "endDate" (${endDate}).`);
  }

  const tz = timezone || 'UTC';
  const data = await fetchArchiveData(latitude, longitude, startDate, endDate, tz);
  const dailyData = parseDailyData(data.daily);

  return {
    location: {
      lat: data.latitude !== undefined ? data.latitude : latitude,
      lon: data.longitude !== undefined ? data.longitude : longitude
    },
    period: {
      start: startDate,
      end: endDate
    },
    daily: dailyData
  };
}

/**
 * Fetches historical temperature data for a single date at a given location using the Open-Meteo Archive API.
 *
 * @async
 * @param {Object} params - The parameters object.
 * @param {number} params.latitude - Latitude of the location (-90 to 90).
 * @param {number} params.longitude - Longitude of the location (-180 to 180).
 * @param {string} params.date - The date in YYYY-MM-DD format.
 * @param {string} [params.timezone='UTC'] - Timezone string.
 * @returns {Promise<Object>} An object containing date, location, and temperature data.
 * @returns {string} return.date - The requested date.
 * @returns {Object} return.location - The location coordinates.
 * @returns {number} return.location.lat - Latitude.
 * @returns {number} return.location.lon - Longitude.
 * @returns {Object} return.temperature - Temperature values.
 * @returns {number|null} return.temperature.max - Maximum temperature in °C.
 * @returns {number|null} return.temperature.min - Minimum temperature in °C.
 * @returns {number|null} return.temperature.mean - Mean temperature in °C.
 * @returns {string} return.temperature.unit - Temperature unit ('°C').
 * @throws {Error} If parameters are invalid or the API request fails.
 *
 * @example
 * const temp = await getHistoricalTemperature({
 *   latitude: 40.71,
 *   longitude: -74.01,
 *   date: '2023-07-04',
 *   timezone: 'America/New_York'
 * });
 */
async function getHistoricalTemperature({ latitude, longitude, date, timezone } = {}) {
  validateCoordinates(latitude, longitude);
  validateDateString(date, 'date');

  const tz = timezone || 'UTC';
  const data = await fetchArchiveData(latitude, longitude, date, date, tz);
  const daily = data.daily;

  let max = null;
  let min = null;
  let meanVal = null;

  if (daily && daily.temperature_2m_max && daily.temperature_2m_max.length > 0) {
    max = daily.temperature_2m_max[0];
  }
  if (daily && daily.temperature_2m_min && daily.temperature_2m_min.length > 0) {
    min = daily.temperature_2m_min[0];
  }
  if (daily && daily.temperature_2m_mean && daily.temperature_2m_mean.length > 0) {
    meanVal = daily.temperature_2m_mean[0];
  }

  return {
    date,
    location: {
      lat: data.latitude !== undefined ? data.latitude : latitude,
      lon: data.longitude !== undefined ? data.longitude : longitude
    },
    temperature: {
      max,
      min,
      mean: meanVal,
      unit: '°C'
    }
  };
}

/**
 * Calculates monthly average weather statistics from daily data for a specific month and year
 * using the Open-Meteo Archive API.
 *
 * @async
 * @param {Object} params - The parameters object.
 * @param {number} params.latitude - Latitude of the location (-90 to 90).
 * @param {number} params.longitude - Longitude of the location (-180 to 180).
 * @param {number} params.year - The year (e.g. 2023).
 * @param {number} params.month - The month (1-12).
 * @param {string} [params.timezone='UTC'] - Timezone string.
 * @returns {Promise<Object>} An object containing year, month, location, averages, and daily data