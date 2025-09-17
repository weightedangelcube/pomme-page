// //////// RAISIN //////// //

/**
 * Main exported module function
 * @returns {void} Nothing
 */
export function startRaisinModule() {
  console.log("loaded")
  getHostnameOnHover()
  openLink()
}

/**
 * Add an mouse over event listener on each link to display domain name inside the search module if existing
 */
function getHostnameOnHover() {
  const raisinLinks = [...document.querySelectorAll('.raisin-link')]
  const searchInput = document.querySelector('.pp-search-input')

  for (const link of raisinLinks) {
    link.addEventListener('mouseover', event => {
      event.preventDefault()
      if (searchInput) {
        searchInput.placeholder = link.hostname
      }
    })
  }
}

function openLink() {
  const raisinLinks = [...document.querySelectorAll('.raisin-link')]

  for (const link of raisinLinks) {
    link.addEventListener('click', event => {
      event.preventDefault()
      window.open(link.getAttribute('href'), '_self')
    })
  }
}