// Élément HTML qui va contenir les projets
const gallery = document.querySelector(".gallery");

/**
 * Crée la figure d'un projet : son image et son titre en dessous.
 * @param {object} work le projet
 * @returns {HTMLElement} la figure
 */
function createWorkFigure(work) {
	const figure = document.createElement("figure");
	figure.dataset.id = work.id;

	const img = document.createElement("img");
	img.src = work.imageUrl;
	img.alt = work.title;

	const figcaption = document.createElement("figcaption");
	figcaption.textContent = work.title;

	figure.appendChild(img);
	figure.appendChild(figcaption);
	return figure;
}

/**
 * Vide la galerie puis y affiche les projets donnés.
 * @param {object[]} worksToDisplay les projets à afficher
 */
export function displayWorks(worksToDisplay) {
	gallery.innerHTML = ""; 
	for  (const work of worksToDisplay) {
		gallery.appendChild(createWorkFigure(work));
	}
}

/**
 * Affiche un message d'erreur à la place de la galerie.
 * @param {string} message
 */
export function displayGalleryError(message) {
	gallery.textContent = message;
}

/**
 * Ajoute un projet à la fin de la galerie.
 * @param {object} work le projet
 */
export function addWorkToGallery(work) {
	gallery.appendChild(createWorkFigure(work));
}
