// //////// SEARCH //////// //

const iconList = document.querySelectorAll('.pp-search-icon')

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
    if (input.value.match(/^([a-zA-Z]+)((\.[a-zA-Z]+)*)(\/+.*)$/gm)) {
      window.open(`https://${input.value}/`, "_self")
    } else {
      const domain = "https://www.google.com/search"
      window.open(`${domain}?q=${input.value}&udm=14`, "_self")
    }
    
    input.value = ''
  }
}
