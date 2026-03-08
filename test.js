/**
 * Simple smoke test for historical-weather-utils
 * Run: node test.js
 */

const {
  getHistoricalWeather,
  getHistoricalTemperature,
  getMonthlyAverages,
  compareYears
} = require('./index');

async function runTests() {
  console.log('Running historical-weather-utils tests...\n');

  const lat = 40.7128;
  const lon = -74.0060;

  try {
    console.log('Test 1: getHistoricalTemperature');
    const temp = await getHistoricalTemperature({
      latitude: lat,
      longitude: lon,
      date: '2024-01-15'
    });
    console.log('  Result:', JSON.stringify(temp, null, 2));
    console.log('  PASS\n');

    console.log('Test 2: getHistoricalWeather');
    const weather = await getHistoricalWeather({
      latitude: lat,
      longitude: lon,
      startDate: '2024-06-01',
      endDate: '2024-06-03'
    });
    console.log('  Days returned:', weather.daily ? weather.daily.length : 0);
    console.log('  PASS\n');

    console.log('Test 3: getMonthlyAverages');
    const monthly = await getMonthlyAverages({
      latitude: lat,
      longitude: lon,
      year: 2023,
      month: 7
    });
    console.log('  Averages:', JSON.stringify(monthly.averages, null, 2));
    console.log('  PASS\n');

    console.log('Test 4: compareYears');
    const comparison = await compareYears({
      latitude: lat,
      longitude: lon,
      years: [2020, 2021, 2022, 2023],
      month: 1
    });
    console.log('  Years compared:', comparison.comparisons ? comparison.comparisons.length : 0);
    console.log('  PASS\n');

    console.log('All tests passed!');
  } catch (err) {
    console.error('Test failed:', err.message);
    process.exit(1);
  }
}

runTests();
