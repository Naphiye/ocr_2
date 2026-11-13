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

	// Zone qui accueillera les miniatures des works (étape suivante)
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
