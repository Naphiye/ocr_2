// Point d'entrée de la page d'accueil : charge les données puis lance l'affichage
import { getWorks, getCategories } from "./api.js";
import { displayWorks, displayGalleryError } from "./works.js";
import { displayFilters } from "./categories.js";

async function init() {
	try {
		const works = await getWorks();
		console.log(works);
		displayWorks(works);

		const categories = await getCategories();
		displayFilters(categories, works);
	} catch (error) {
		console.error(error);
		displayGalleryError("Impossible de charger les projets pour le moment.");
	}
}

init();
