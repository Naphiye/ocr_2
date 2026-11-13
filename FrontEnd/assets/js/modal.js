// Élément HTML de la modale (créé une seule fois par createModal)
let modal = null;



/**
 * creer la modale "Mes projets" et l'ajoute a la fin du body
 * la modale est cachee par defaut (css), on l'affiche avec openModal
 * contient : bouton fermer, titre "Galerie photo", zone vide pour les miniatures des works
 * initialise la fermeture : clic sur la croix, clic en dehors de la fenetre, touche Echap
 */
export function createModal() {
	modal = document.createElement("aside");
	modal.classList.add("modal");
	modal.setAttribute("role", "dialog");
	modal.setAttribute("aria-modal", "true");
	modal.setAttribute("aria-labelledby", "modal-title");
	modal.setAttribute("aria-hidden", "true");

	// Fenêtre blanche au centre
	const wrapper = document.createElement("div");
	wrapper.classList.add("modal-wrapper");

	const closeButton = document.createElement("button");
	closeButton.type = "button";
	closeButton.classList.add("modal-close");
	closeButton.setAttribute("aria-label", "Fermer la modale");
	closeButton.textContent = "×";
	closeButton.addEventListener("click", closeModal);

	const title = document.createElement("h3");
	title.id = "modal-title";
	title.classList.add("modal-title");
	title.textContent = "Galerie photo";

	// Zone des miniatures des works (remplie par displayModalWorks)
	const modalGallery = document.createElement("div");
	modalGallery.classList.add("modal-gallery");

	wrapper.appendChild(closeButton);
	wrapper.appendChild(title);
	wrapper.appendChild(modalGallery);
	modal.appendChild(wrapper);

	// Clic sur le fond gris (en dehors de la fenêtre) : on ferme
	modal.addEventListener("click", (event) => {
		if (event.target === modal) {
			closeModal();
		}
	});

	// Touche Échap : on ferme
	document.addEventListener("keydown", (event) => {
		if (event.key === "Escape") {
			closeModal();
		}
	});

	document.body.appendChild(modal);
}



// Icône poubelle en SVG (pas besoin de fichier ni de librairie d'icônes)
const TRASH_ICON = `
	<svg viewBox="0 0 24 24" width="10" height="10" fill="currentColor" aria-hidden="true">
		<path d="M9 2h6l1 2h5v2H3V4h5l1-2zM5 8h14l-1.2 14H6.2L5 8zm4 3v8h2v-8H9zm4 0v8h2v-8h-2z"/>
	</svg>`;



/**
 * creer une miniature html pour la modale : image du work + bouton poubelle en haut a droite
 * l'id du work est stocke sur le bouton (data-id) pour appeler la route delete plus tard
 * @param {object} work
 * @returns figure html
 */
function createModalFigure(work) {
	const figure = document.createElement("figure");
	figure.classList.add("modal-figure");

	const img = document.createElement("img");
	img.src = work.imageUrl;
	img.alt = work.title;

	const deleteButton = document.createElement("button");
	deleteButton.type = "button";
	deleteButton.classList.add("modal-delete");
	deleteButton.dataset.id = work.id;
	deleteButton.setAttribute("aria-label", `Supprimer ${work.title}`);
	deleteButton.innerHTML = TRASH_ICON;
	// TODO : au clic, appeler la route DELETE /works/{id} (étape suivante)

	figure.appendChild(img);
	figure.appendChild(deleteButton);
	return figure;
}



/**
 * vide la galerie de la modale puis affiche une miniature par work
 * @param {object array} works
 */
export function displayModalWorks(works) {
	const modalGallery = modal.querySelector(".modal-gallery");
	modalGallery.innerHTML = "";
	for (const work of works) {
		modalGallery.appendChild(createModalFigure(work));
	}
}



/**
 * affiche la modale
 */
export function openModal() {
	modal.classList.add("modal--open");
	modal.setAttribute("aria-hidden", "false");
}



/**
 * cache la modale
 */
export function closeModal() {
	modal.classList.remove("modal--open");
	modal.setAttribute("aria-hidden", "true");
}
