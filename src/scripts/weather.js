// //////// WEATHER //////// //
const weatherInner = document.querySelector("pp-weather-inner")
const loaderContainer = document.querySelector("pp-weather-loader-container")

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
	weatherInner.addEventListener("click", toggleWeatherDisplay)
	loaderContainer.style.display = "none"
	dom.container.style.display = "flex"
}

/**
 * GET data from the weather API
 * @async
 * @returns {Promise} Promise object
 */
async function getWeatherData() {
	const url =
		"https://api.open-meteo.com/v1/forecast?daily=temperature_2m_max,temperature_2m_min,weather_code&current=temperature_2m,relative_humidity_2m,weather_code,is_day&timezone=auto&forecast_days=7"
	const latitude = import.meta.env.PUBLIC_WEATHER_LATITUDE_QUERY
	const longitude = import.meta.env.PUBLIC_WEATHER_LONGITUDE_QUERY
	const temperature_unit = import.meta.env.PUBLIC_WEATHER_TEMPERATURE_UNIT
	const response = await fetch(
		`${url}&latitude=${latitude}&longitude=${longitude}&temperature_unit=${temperature_unit}`
	)

	if (!response.ok) {
		displayweatherErrorOnPage(response)
		throw new Error(
			`An error has occured: ${response.status} => ${response.statusText}`
		)
	}

	return response.json()
}

/**
 * GET DOM elements that will later be filled with data
 * @returns {Object} DOM elements contained in an object
 */
function catchWeatherDomElements() {
	return {
		container: document.querySelector("pp-weather"),
		forecastContainer: document.querySelector("weather-forecast-container"),
		temperature: document.querySelector(".temp-value"),
		humid: document.querySelector(".humid-value"),
		iconsContainer: document.querySelector("pp-weather-icons"),
		cityName: document.querySelector(".city-value")
	}
}

/**
 * Fill targeted DOM elements with weather API data
 * @param {Object} data data from the openwaether API
 * @param {Object} dom DOM elements
 * @returns {void} Nothing
 */
function fillWeatherDomElements(data, dom) {
	const isDay = data.current.is_day
	const weatherState = getWeatherState(data.current.weather_code)

	dom.iconsContainer.innerHTML = `
		<span class="pp-weather-icon">${isDay ? weatherState.iconDay : weatherState.iconNight}</span>
	`

	dom.cityName.innerHTML = import.meta.env.PUBLIC_WEATHER_CITY_DISPLAY_NAME ? 
		import.meta.env.PUBLIC_WEATHER_CITY_DISPLAY_NAME : `${data.latitude}, ${data.longitude}`
	dom.temperature.innerHTML = formatTemperature(data.current.temperature_2m)
	dom.humid.innerHTML = `${data.current.relative_humidity_2m}%`


	for (let i = 0; i < 7; i++) {
		let day = new Date(`${data.daily.time[i]}T00:00:00`).toLocaleDateString(import.meta.env.PUBLIC_LOCALE, { weekday: "short" })
		let low = formatTemperature(data.daily.temperature_2m_min[i])
		let high = formatTemperature(data.daily.temperature_2m_max[i])
		let weatherState = getWeatherState(data.daily.weather_code[i])

		let forecast = document.createElement("weather-forecast")

		dom.forecastContainer.append(forecast)
		forecast.innerHTML = `
			<span class="day">${day}</span>
			<span class="icon">${weatherState.iconDay}</span>
			<span class="data">${low} - ${high}</span>
		`

	}
	// dom.sunrise.innerHTML = new Date(data.daily.sunrise[0]).toLocaleTimeString(import.meta.env.PUBLIC_LOCALE)
	// dom.sunset.innerHTML = new Date(data.daily.sunset[0]).toLocaleTimeString(import.meta.env.PUBLIC_LOCALE)
}


function formatTemperature(value) {
	if (value > 0 && value < 10) {
		return `0${Math.round(value)}°`
	} else {
		return `${Math.round(value)}°`
	}
}

function getWeatherState(code) {
	let weatherCodes = [];
	weatherCodes[0]  = { state: "clear",            iconDay: "", iconNight: "" }
	weatherCodes[1]  = { state: "clear",            iconDay: "", iconNight: "" }
	weatherCodes[2]  = { state: "part-clouds",      iconDay: "", iconNight: "" }
	weatherCodes[3]  = { state: "clouds",           iconDay: "", iconNight: "" }
	weatherCodes[45] = { state: "fog",              iconDay: "", iconNight: "" }
	weatherCodes[48] = { state: "fog",              iconDay: "", iconNight: "" }
	weatherCodes[51] = { state: "drizzle",          iconDay: "", iconNight: "" }
	weatherCodes[53] = { state: "drizzle",          iconDay: "", iconNight: "" }
	weatherCodes[55] = { state: "drizzle",          iconDay: "", iconNight: "" }
	weatherCodes[56] = { state: "freezing-drizzle", iconDay: "", iconNight: "" }
	weatherCodes[57] = { state: "freezing-drizzle", iconDay: "", iconNight: "" }
	weatherCodes[61] = { state: "rain",             iconDay: "", iconNight: "" }
	weatherCodes[61] = { state: "rain",             iconDay: "", iconNight: "" }
	weatherCodes[63] = { state: "rain",             iconDay: "", iconNight: "" }
	weatherCodes[65] = { state: "rain",             iconDay: "", iconNight: "" }
	weatherCodes[66] = { state: "freezing-rain",    iconDay: "", iconNight: "" }
	weatherCodes[67] = { state: "freezing-rain",    iconDay: "", iconNight: "" }
	weatherCodes[71] = { state: "snow",             iconDay: "", iconNight: "" }
	weatherCodes[73] = { state: "snow",             iconDay: "", iconNight: "" }
	weatherCodes[80] = { state: "rain",             iconDay: "", iconNight: "" }
	weatherCodes[81] = { state: "rain",             iconDay: "", iconNight: "" }
	weatherCodes[82] = { state: "rain",             iconDay: "", iconNight: "" }
	weatherCodes[85] = { state: "snow",             iconDay: "", iconNight: "" }
	weatherCodes[86] = { state: "snow",             iconDay: "", iconNight: "" }
	weatherCodes[95] = { state: "thunderstorm",     iconDay: "", iconNight: "" }
	weatherCodes[96] = { state: "thunderstorm",     iconDay: "", iconNight: "" }
	weatherCodes[99] = { state: "thunderstorm",     iconDay: "", iconNight: "" }

	return {
		state: weatherCodes[code].state,
		iconDay: weatherCodes[code].iconDay,
		iconNight: weatherCodes[code].iconNight
	}
}

/**
 * If weather HTTP request fails, get error response and display info on the page
 * @param {Object} response the error response from the API
 * @returns {void} Nothing
 */
function displayweatherErrorOnPage(response) {
	const errorContainer = document.querySelector("pp-weather-error-container")
	const errorCode = document.querySelector(".weather-error-code")

	errorCode.innerHTML = response.status
	loaderContainer.style.display = "none"
	errorContainer.style.display = "flex"
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

	h = h < 10 ? "0" + h : h
	m = m < 10 ? "0" + m : m

	return `${h}:${m}`
}

/**
 * Add/remove class on dom element for flipping whole module
 * @returns {void} Nothing
 */
function toggleWeatherDisplay() {
	weatherInner.classList.toggle("is-flipped")
}
