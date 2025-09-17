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
  console.log(data.current.weather_code)
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
  const url = 'https://api.open-meteo.com/v1/forecast?daily=sunrise,sunset&current=temperature_2m,relative_humidity_2m,weather_code&timezone=auto'
  const latitude = import.meta.env.PUBLIC_WEATHER_LATITUDE_QUERY
  const longitude = import.meta.env.PUBLIC_WEATHER_LONGITUDE_QUERY
  const temperature_unit = import.meta.env.PUBLIC_WEATHER_TEMPERATURE_UNIT
  const response = await fetch(`${url}&latitude=${latitude}&longitude=${longitude}&temperature_unit=${temperature_unit}`)

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
    // sunrise: document.querySelector('.weather-back-sunrise'),
    // sunset: document.querySelector('.weather-back-sunset'),
  }
}

/**
 * Fill targeted DOM elements with weather API data
 * @param {Object} data data from the openwaether API
 * @param {Object} dom DOM elements
 * @returns {void} Nothing
 */
function fillWeatherDomElements(data, dom) {
  let weatherState
  
  // I wasn't quite sure how else to implement this
  // Please don't look at this code
  switch (data.current.weather_code) {
    case 0:
      weatherState = 'clear'
      break
    case 1:
      weatherState = 'clear'
      break
    case 2:
      weatherState = 'part-clouds'
      break
    case 3:
      weatherState = 'clouds'
      break
    case 45:
      weatherState = 'fog'
      break
    case 48:
      weatherState = 'fog'
      break
    case 51:
      weatherState = 'drizzle'
      break
    case 53:
      weatherState = 'drizzle'
      break
    case 55:
      weatherState = 'drizzle'
      break
    case 56:
      weatherState = 'freezing-drizzle'
      break
    case 57:
      weatherState = 'freezing-drizzle'
      break
    case 61:
      weatherState = 'rain'
      break
    case 63:
      weatherState = 'rain'
      break
    case 65:
      weatherState = 'rain'
      break
    case 66:
      weatherState = 'freezing-rain'
      break
    case 67:
      weatherState = 'freezing-rain'
      break
    case 80:
      weatherState = 'rain'
      break
    case 81:
      weatherState = 'rain'
      break
    case 82:
      weatherState = 'rain'
      break
    case 71:
      weatherState = 'snow'
      break
    case 73:
      weatherState = 'snow'
      break
    case 75:
      weatherState = 'snow'
      break
    case 77:
      weatherState = 'snow'
      break
    case 85:
      weatherState = 'snow'
      break
    case 86:
      weatherState = 'snow'
      break
    case 95:
      weatherState = 'thunderstorm'
      break
    case 96:
      weatherState = 'thunderstorm'
      break
    case 99:
      weatherState = 'thunderstorm'
      break
  }

  for (const icon of dom.icons) {    
    if (icon.id === weatherState) {
      icon.style.display = "inline"
    } else {
      icon.style.display = "none"
    }
  }

  dom.cityName.innerHTML = import.meta.env.PUBLIC_WEATHER_CITY_DISPLAY_NAME
  dom.temperature.innerHTML = data.current.temperature_2m > 0 && data.current.temperature_2m < 10 ? `0${Math.round(data.current.temperature_2m)}°` : `${Math.round(data.current.temperature_2m)}°`
  dom.humid.innerHTML = `${data.current.relative_humidity_2m}%`
  console.log(data.daily.sunrise[0])
  // dom.sunrise.innerHTML = new Date(data.daily.sunrise[0]).toLocaleTimeString(import.meta.env.PUBLIC_LOCALE)
  // dom.sunset.innerHTML = new Date(data.daily.sunset[0]).toLocaleTimeString(import.meta.env.PUBLIC_LOCALE)
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
