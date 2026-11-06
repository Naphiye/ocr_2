// Affichage des projets dans la galerie

// Élément HTML qui va contenir les projets
const gallery = document.querySelector(".gallery");

// Crée la balise <figure> d'un projet (image + légende)
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

// Affiche une liste de projets dans la galerie
export function displayWorks(worksToDisplay) {
	gallery.innerHTML = ""; // on vide la galerie avant de la remplir
	for (const work of worksToDisplay) {
		gallery.appendChild(createWorkFigure(work));
	}
}

// Affiche un message à la place de la galerie (ex : API injoignable)
export function displayGalleryError(message) {
	gallery.textContent = message;
}
