
// Élément HTML qui va contenir les projets
const gallery = document.querySelector(".gallery");

/**
 * creer les figures html de la galerie avec une image un titre en enfant 
 * @param {object} work 
 * @returns figure html
 */
function createWorkFigure(work) {
	const figure = document.createElement("figure");

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
 * vide la galerie avant de la remplir
 * rempli la galerie en appelant createWorkfigure pour creer chaque figure a display
 * @param {object} worksToDisplay 
 */
export function displayWorks(worksToDisplay) {
	gallery.innerHTML = ""; 
	for  (const work of worksToDisplay) {
		gallery.appendChild(createWorkFigure(work));
	}
}

/**
 * Affichage du message d'erreur
 * @param {string} message 
 * 
 */
export function displayGalleryError(message) {
	gallery.textContent = message;
}
