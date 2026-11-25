import {addWork, deleteWork} from "./api.js";
import {addWorkToGallery} from "./works.js";

// Élément HTML de la modale (créé une seule fois par createModal)
let modal = null;

const MAX_FILE_SIZE = 4 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png"];
const ALLOWED_EXTENSIONS = [".jpg", ".jpeg", ".png"];

/**
 * Crée la modale et l'ajoute à la fin de la page. Elle est cachée au départ.
 * Elle contient deux vues : la galerie photo et le formulaire d'ajout photo.
 * On la ferme avec la croix, en cliquant à côté ou avec la touche Échap.
 * @param {object[]} categories les catégories, pour la liste du formulaire
 */
export function createModal(categories) {
	modal = document.createElement("aside");
	modal.classList.add("modal");
	modal.setAttribute("role", "dialog");
	modal.setAttribute("aria-modal", "true");
	modal.setAttribute("aria-labelledby", "modal-title");
	modal.setAttribute("aria-hidden", "true");

	// Fenêtre blanche au centre
	const wrapper = document.createElement("div");
	wrapper.classList.add("modal-wrapper");

	const backButton = document.createElement("button");
	backButton.type = "button";
	backButton.classList.add("modal-back");
	backButton.setAttribute("aria-label", "Retour à la galerie");
	backButton.innerHTML = `<img src="./assets/icons/arrow-left.png" alt="">`;
	backButton.hidden = true;
	backButton.addEventListener("click", showGalleryView);

	const closeButton = document.createElement("button");
	closeButton.type = "button";
	closeButton.classList.add("modal-close");
	closeButton.setAttribute("aria-label", "Fermer la modale");
	closeButton.textContent = "×";
	closeButton.addEventListener("click", closeModal);

	wrapper.appendChild(backButton);
	wrapper.appendChild(closeButton);
	wrapper.appendChild(createGalleryView());
	wrapper.appendChild(createAddView(categories));
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
 * Ouvre la modale, toujours sur la vue galerie.
 */
export function openModal() {
	showGalleryView();
	modal.classList.add("modal--open");
	modal.setAttribute("aria-hidden", "false");
}



/**
 * Ferme la modale.
 */
export function closeModal() {
	modal.classList.remove("modal--open");
	modal.setAttribute("aria-hidden", "true");
}



/**
 * Affiche le bouton "modifier" à côté du titre "Mes Projets".
 * Au clic, il ouvre la modale.
 */
export function displayEditButton() {
	const editButton = document.createElement("button");
	editButton.type = "button";
	editButton.classList.add("edit-btn");
	editButton.innerHTML = `<img src="./assets/icons/Vector.png" alt=""><span>modifier</span>`;
	editButton.addEventListener("click", openModal);

	document.querySelector(".portfolio-header").appendChild(editButton);
}



/**
 * Crée la vue galerie : le titre, les miniatures et le bouton "Ajouter une photo".
 * @returns {HTMLElement} la vue
 */
function createGalleryView() {
	const view = document.createElement("div");
	view.classList.add("modal-view--gallery");

	const title = document.createElement("h3");
	title.id = "modal-title";
	title.classList.add("modal-title");
	title.textContent = "Galerie photo";

	// Zone des miniatures des works (remplie par displayModalWorks)
	const modalGallery = document.createElement("div");
	modalGallery.classList.add("modal-gallery");

	const addButton = document.createElement("button");
	addButton.type = "button";
	addButton.classList.add("modal-add-btn");
	addButton.textContent = "Ajouter une photo";
	addButton.addEventListener("click", showAddView);

	view.appendChild(title);
	view.appendChild(modalGallery);
	view.appendChild(addButton);
	return view;
}



/**
 * Vide la galerie de la modale puis affiche une miniature par projet.
 * @param {object[]} works les projets
 */
export function displayModalWorks(works) {
	const modalGallery = modal.querySelector(".modal-gallery");
	modalGallery.innerHTML = "";
	for (const work of works) {
		modalGallery.appendChild(createModalFigure(work));
	}
}



/**
 * Crée la miniature d'un projet dans la modale, avec sa poubelle.
 * Au clic sur la poubelle, le projet est supprimé de l'API, de la modale
 * et de la galerie.
 * @param {object} work le projet
 * @returns {HTMLElement} la miniature
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
	deleteButton.innerHTML = `<img src="./assets/icons/trash-can-solid.png" alt="">`;
	/**
	 * Supprime le projet dans l'API, puis retire sa miniature et sa figure de la galerie.
	 */
	async function handleDelete() {
		try {
			await deleteWork(work.id);
			figure.remove();
			document.querySelector(`.gallery figure[data-id="${work.id}"]`).remove();
		} catch (error) {
			console.error(error);
			if (error.status === 401) {
				alert("Session expirée, reconnectez-vous.");
			} else if (error.status === 404) {
				alert("Projet introuvable : il a peut-être déjà été supprimé.");
			} else if (error.status) {
				alert(`Erreur du serveur (${error.status}), réessayez plus tard.`);
			} else {
				alert("Serveur injoignable, réessayez plus tard.");
			}

		}
	}

	deleteButton.addEventListener("click", handleDelete);

	figure.appendChild(img);
	figure.appendChild(deleteButton);
	return figure;
}



/**
 * Affiche la vue galerie (et vide le formulaire d'ajout au passage).
 */
function showGalleryView() {
	modal.querySelector(".modal-view--gallery").hidden = false;
	modal.querySelector(".modal-view--add").hidden = true;
	modal.querySelector(".modal-back").hidden = true;
	resetAddForm();
}



/**
 * Crée la vue ajout photo : la zone pour choisir l'image, le titre,
 * la catégorie et le bouton Valider.
 * @param {object[]} categories les catégories proposées dans la liste
 * @returns {HTMLElement} la vue
 */
function createAddView(categories) {
	const view = document.createElement("div");
	view.classList.add("modal-view--add");
	view.hidden = true;

	view.innerHTML = `
		<h3 class="modal-title">Ajout photo</h3>
		<form class="add-form">
			<label class="upload-zone" for="photo-file">
				<span class="upload-placeholder">
					<img src="./assets/icons/upload.png" alt="">
					<span class="upload-btn">+ Ajouter photo</span>
					<span class="upload-info">jpg, png : 4mo max</span>
				</span>
				<img class="upload-preview" alt="Aperçu de la photo">
			</label>
			<input type="file" id="photo-file" class="visually-hidden" accept=".jpg,.jpeg,.png,image/jpeg,image/png">
			<label for="photo-title">Titre</label>
			<input type="text" id="photo-title">
			<label for="photo-category">Catégorie</label>
			<select id="photo-category">
				<option value=""></option>
			</select>
			<p class="add-error"></p>
			<input type="submit" value="Valider" disabled>
		</form>`;

	const select = view.querySelector("#photo-category");
	for (const category of categories) {
		select.appendChild(new Option(category.name, category.id));
	}

	initAddForm(view.querySelector(".add-form"));
	return view;
}



/**
 * Affiche la vue ajout photo, avec la flèche retour.
 */
function showAddView() {
	modal.querySelector(".modal-view--gallery").hidden = true;
	modal.querySelector(".modal-view--add").hidden = false;
	modal.querySelector(".modal-back").hidden = false;
}



/**
 * Vérifie que le fichier choisi est un jpg ou un png de 4 Mo maximum.
 * @param {File} file le fichier choisi
 * @returns {string} le message d'erreur, ou "" si le fichier est bon
 */
function checkFile(file) {
	const extension = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
	if (!ALLOWED_TYPES.includes(file.type) || !ALLOWED_EXTENSIONS.includes(extension)) {
		return "Format non accepté : jpg ou png uniquement";
	}
	if (file.size > MAX_FILE_SIZE) {
		return "Fichier trop lourd : 4 Mo maximum";
	}
	return "";
}



/**
 * Fait fonctionner le formulaire d'ajout photo :
 * aperçu de l'image, bouton Valider bloqué tant qu'il manque quelque chose,
 * puis envoi du projet, ajout dans la galerie et dans la modale, et fermeture.
 * @param {HTMLFormElement} form le formulaire
 */
function initAddForm(form) {
	const fileInput = form.querySelector("#photo-file");
	const titleInput = form.querySelector("#photo-title");
	const categorySelect = form.querySelector("#photo-category");
	const uploadZone = form.querySelector(".upload-zone");
	const preview = form.querySelector(".upload-preview");
	const errorMessage = form.querySelector(".add-error");
	const submitButton = form.querySelector('input[type="submit"]');

	/**
	 * Active le bouton Valider seulement si l'image, le titre et la catégorie sont remplis.
	 */
	function updateSubmitButton() {
		const isComplete =
			fileInput.files.length > 0 &&
			titleInput.value.trim() !== "" &&
			categorySelect.value !== "";
		submitButton.disabled = !isComplete;
	}

	/**
	 * Vérifie le fichier choisi : affiche son aperçu s'il est valide,
	 * sinon vide le champ et affiche l'erreur.
	 */
	function handleFileChange() {
		errorMessage.textContent = "";
		const file = fileInput.files[0];
		const error = file ? checkFile(file) : "";

		if (!file || error) {
			fileInput.value = "";
			uploadZone.classList.remove("has-preview");
			preview.removeAttribute("src");
			errorMessage.textContent = error;
		} else {
			preview.src = URL.createObjectURL(file);
			uploadZone.classList.add("has-preview");
		}
		updateSubmitButton();
	}

	/**
	 * Envoie le nouveau projet à l'API, l'ajoute à la galerie et à la modale,
	 * puis ferme la modale.
	 * @param {SubmitEvent} event l'envoi du formulaire
	 */
	async function handleAddSubmit(event) {
		event.preventDefault();
		errorMessage.textContent = "";

		const formData = new FormData();
		formData.append("image", fileInput.files[0]);
		formData.append("title", titleInput.value.trim());
		formData.append("category", categorySelect.value);

		try {
			const work = await addWork(formData);
			addWorkToGallery(work);
			modal.querySelector(".modal-gallery").appendChild(createModalFigure(work));
			closeModal();
		} catch (error) {
			console.error(error);
			errorMessage.textContent = "Impossible d'ajouter le projet. Reconnectez-vous puis réessayez.";
		}
	}

	fileInput.addEventListener("change", handleFileChange);
	titleInput.addEventListener("input", updateSubmitButton);
	categorySelect.addEventListener("change", updateSubmitButton);
	form.addEventListener("submit", handleAddSubmit);
}



/**
 * Vide le formulaire d'ajout photo : champs, aperçu et message d'erreur.
 */
function resetAddForm() {
	const form = modal.querySelector(".add-form");
	form.reset();
	form.querySelector(".upload-zone").classList.remove("has-preview");
	form.querySelector(".upload-preview").removeAttribute("src");
	form.querySelector(".add-error").textContent = "";
	form.querySelector('input[type="submit"]').disabled = true;
}
