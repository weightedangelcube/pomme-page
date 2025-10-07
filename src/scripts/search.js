// //////// SEARCH //////// //

const searchURL = document.querySelector("pp-search").getAttribute("url")

/**
 * Main exported function that attaches event handler to specified DOM elements
 * @returns {void} Nothing
 */
export function startSearchModule() {
  const searchContainer = document.querySelector('pp-search')
  document.addEventListener('keydown', () => {
    document.querySelector('.pp-search-input').focus()
  })

  searchContainer.addEventListener('keydown', sendSearch)
}

/**
 * Trigger search if enter key is pressed when using the module
 * the user picked search engine is retrieved through html custom attributes
 * @param {*} event the event object that we are checking for a key press
 * @returns {void} Nothing
 */
function sendSearch(event) {
  const input = document.querySelector('.pp-search-input')

  if (event.key === 'Enter') {
	// test if user's input is a real url
    if (input.value.match(/^([a-zA-Z]+)(\.[a-zA-Z]+)(\/*.*)$/gm)) {
      window.open(`https://${input.value}/`, "_self")
    } else {
	  // proceed if the given url contains %s
	  if (/%s/.test(searchURL)) {
		window.open(searchURL.replace("%s", input.value), "_self")
	  } else {
		throw new Error("Search URL must contain %s!")
	  }
    }
    input.value = ''
  }

  // holy nesting bro
}
