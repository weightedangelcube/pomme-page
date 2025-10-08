// //////// MYRTILLE //////// //

/**
 * Main exported module function
 * @returns {void} Nothing
 */
export function startMyrtilleModule() {
	getHostnameOnHover()
	openLink()
}

/**
 * Add an mouse over event listener on each link to display domain name inside the search module if existing
 * @returns {void} Nothing
 */
function getHostnameOnHover() {
	const myrtilleLinks = [...document.querySelectorAll(".myrtille-link")]
	const searchInput = document.querySelector(".pp-search-input")

	for (const link of myrtilleLinks) {
		link.addEventListener("mouseenter", (event) => {
			event.preventDefault()
			if (searchInput) {
				searchInput.placeholder = link.hostname
			}
		})
	}
}

/**
 * Opens the link in the same tab.
 * @returns {void} Nothing
 */
function openLink() {
	const myrtilleLinks = [...document.querySelectorAll(".myrtille-link")]

	for (const link of myrtilleLinks) {
		link.addEventListener("click", (event) => {
			event.preventDefault()
			window.open(link.getAttribute("href"), "_self")
		})
	}
}
