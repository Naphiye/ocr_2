import {addWork, deleteWork} from "./api.js";
import {addWorkToGallery} from "./works.js";

// Élément HTML de la modale (créé une seule fois par createModal)
let modal = null;

const MAX_FILE_SIZE = 4 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png"];
const ALLOWED_EXTENSIONS = [".jpg", ".jpeg", ".png"];

const IMAGE_ICON = `
	<svg viewBox="0 0 24 24" width="68" height="60" fill="currentColor" aria-hidden="true">
		<path d="M21 3H3a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1zm-1 13.6-4.3-4.3a1 1 0 0 0-1.4 0L11 15.6l-2.3-2.3a1 1 0 0 0-1.4 0L4 16.6V5h16v11.6zM8.5 10.5a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"/>
	</svg>`;



/**
 * creer la modale "Mes projets" et l'ajoute a la fin du body
 * la modale est cachee par defaut (css), on l'affiche avec openModal
 * contient : bouton fermer, titre "Galerie photo", zone vide pour les miniatures des works
 * initialise la fermeture : clic sur la croix, clic en dehors de la fenetre, touche Echap
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
	backButton.textContent = "←";
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



function createAddView(categories) {
	const view = document.createElement("div");
	view.classList.add("modal-view--add");
	view.hidden = true;

	view.innerHTML = `
		<h3 class="modal-title">Ajout photo</h3>
		<form class="add-form">
			<label class="upload-zone" for="photo-file">
				<span class="upload-placeholder">
					${IMAGE_ICON}
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



function initAddForm(form) {
	const fileInput = form.querySelector("#photo-file");
	const titleInput = form.querySelector("#photo-title");
	const categorySelect = form.querySelector("#photo-category");
	const uploadZone = form.querySelector(".upload-zone");
	const preview = form.querySelector(".upload-preview");
	const errorMessage = form.querySelector(".add-error");
	const submitButton = form.querySelector('input[type="submit"]');

	function updateSubmitButton() {
		const isComplete =
			fileInput.files.length > 0 &&
			titleInput.value.trim() !== "" &&
			categorySelect.value !== "";
		submitButton.disabled = !isComplete;
	}

	fileInput.addEventListener("change", () => {
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
	});

	titleInput.addEventListener("input", updateSubmitButton);
	categorySelect.addEventListener("change", updateSubmitButton);

	form.addEventListener("submit", async (event) => {
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
			showGalleryView();
		} catch (error) {
			console.error(error);
			errorMessage.textContent = "Impossible d'ajouter le projet. Reconnectez-vous puis réessayez.";
		}
	});
}



function resetAddForm() {
	const form = modal.querySelector(".add-form");
	form.reset();
	form.querySelector(".upload-zone").classList.remove("has-preview");
	form.querySelector(".upload-preview").removeAttribute("src");
	form.querySelector(".add-error").textContent = "";
	form.querySelector('input[type="submit"]').disabled = true;
}



function showGalleryView() {
	modal.querySelector(".modal-view--gallery").hidden = false;
	modal.querySelector(".modal-view--add").hidden = true;
	modal.querySelector(".modal-back").hidden = true;
	resetAddForm();
}



function showAddView() {
	modal.querySelector(".modal-view--gallery").hidden = true;
	modal.querySelector(".modal-view--add").hidden = false;
	modal.querySelector(".modal-back").hidden = false;
}



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
	deleteButton.innerHTML = `<img src="./assets/icons/trash-can-solid.png" alt="">`;
	deleteButton.addEventListener("click", async () => {
		try {
			await deleteWork(work.id);
			figure.remove();
			document.querySelector(`.gallery figure[data-id="${work.id}"]`).remove();
		} catch (error) {
			console.error(error);
			alert("Impossible de supprimer ce projet. Reconnectez-vous puis réessayez.");
		}
	});

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
	showGalleryView();
	modal.classList.add("modal--open");
	modal.setAttribute("aria-hidden", "false");
}



export function displayEditButton() {
	const editButton = document.createElement("button");
	editButton.type = "button";
	editButton.classList.add("edit-btn");
	editButton.innerHTML = `<img src="./assets/icons/Vector.png" alt=""><span>modifier</span>`;
	editButton.addEventListener("click", openModal);

	document.querySelector(".portfolio-header").appendChild(editButton);
}



/**
 * cache la modale
 */
export function closeModal() {
	modal.classList.remove("modal--open");
	modal.setAttribute("aria-hidden", "true");
}
