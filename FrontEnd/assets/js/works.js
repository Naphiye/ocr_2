// Affichage des projets dans la galerie

// Élément HTML qui va contenir les projets
const gallery = document.querySelector(".gallery");

/**
 * creer les figures html de la galerie
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
 * 
 * @param {*} worksToDisplay 
 */
export function displayWorks(worksToDisplay) {
	gallery.innerHTML = ""; // on vide la galerie avant de la remplir
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
