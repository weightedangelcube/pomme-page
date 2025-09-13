// //////// WEATHER //////// //
const weatherInner = document.querySelector('pp-weather-inner')
const loaderContainer = document.querySelector('pp-weather-loader-container')

/**
 * Main exported module function that trigger data request, DOM elements collection, DOM elements filling
 * add an event listener on module and display it
 * @async
 * @returns {void} Nothing
 */
export async function startWeatherModule() {
  const dom = catchWeatherDomElements()
  const data = await getWeatherData()

  fillWeatherDomElements(data, dom)
  weatherInner.addEventListener('click', toggleWeatherDisplay)
  loaderContainer.style.display = 'none'
  dom.container.style.display = 'flex'
}

/**
 * GET data fron the weather API
 * @async
 * @returns {Promise} Promise object
 */
async function getWeatherData() {
  const url = 'https://api.open-meteo.com/v1/forecast?daily=sunrise,sunset&current=temperature_2m,relative_humidity_2m'
  const latitude = process.env.WEATHER_LATITUDE_QUERY
  const longitude = process.env.WEATHER_LONGITUDE_QUERY
  const temperature_unit = process.env.WEATHER_TEMPERATURE_UNIT
  const response = await fetch(`${url}&latitude=${latitude}&longitude=${longitude}&temperature_unit=${temperature_unit}`)

  console.log("weather got")

  if (!response.ok) {
    displayweatherErrorOnPage(response)
    throw new Error(`An error has occured: ${response.status} => ${response.statusText}`)
  }

  return response.json()
}

/**
 * GET DOM elements that will later be filled with data
 * @returns {Object} DOM elements contained in an object
 */
function catchWeatherDomElements() {
  return {
    container: document.querySelector('pp-weather'),
    temperature: document.querySelector('.temp-value'),
    humid: document.querySelector('.humid-value'),
    icons: [...document.querySelectorAll('.pp-weather-icon')],
    cityName: document.querySelector('.city-value'),
    sunrise: document.querySelector('.weather-back-sunrise'),
    sunset: document.querySelector('.weather-back-sunset'),
  }
}

/**
 * Fill targeted DOM elements with weather API data
 * @param {Object} data data from the openwaether API
 * @param {Object} dom DOM elements
 * @returns {void} Nothing
 */
function fillWeatherDomElements(data, dom) {
  for (const icon of dom.icons) {
    // icon.dataset.state = icon.dataset.type.includes(data.weather[0].main.toLowerCase()) ? 'show' : 'hide'
  }

  dom.cityName.innerHTML = process.env.WEATHER_CITY_DISPLAY_NAME
  dom.temperature.innerHTML = data.current.temperature_2m > 0 && data.current.temperature_2m < 10 ? `0${Math.round(data.current.temperature_2m)}°` : `${Math.round(data.current.temperature_2m)}°`
  dom.humid.innerHTML = `${data.current.relative_humidity_2m}%`
  dom.sunrise.innerHTML = new Date(data.daily.sunrise[0]).toLocaleTimeString(process.env.LOCALE)
  dom.sunset.innerHTML = new Date(data.daily.sunset[0]).toLocaleTimeString(process.env.LOCALE)
}

/**
 * If weather HTTP request fails, get error response and display info on the page
 * @param {Object} response the error response from the API
 * @returns {void} Nothing
 */
function displayweatherErrorOnPage(response) {
  const errorContainer = document.querySelector('pp-weather-error-container')
  const errorCode = document.querySelector('.weather-error-code')

  errorCode.innerHTML = response.status
  loaderContainer.style.display = 'none'
  errorContainer.style.display = 'flex'
}

/**
 * Format timestamp to human readable hours and minutes
 * @param {Number} stamp timestamp found in API response for sunrise and sunset
 * @returns {string} time in hours and minutes
 */
function formatTimestamp(stamp) {
  const date = new Date(stamp * 1000)
  let h = date.getHours()
  let m = date.getMinutes()

  h = (h < 10) ? '0' + h : h
  m = (m < 10) ? '0' + m : m

  return `${h}:${m}`
}

/**
 * Add/remove class on dom element for flipping whole module
 * @returns {void} Nothing
 */
function toggleWeatherDisplay() {
  weatherInner.classList.toggle('is-flipped')
}
