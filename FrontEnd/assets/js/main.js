import { getWorks, getCategories } from "./api.js";
import { displayWorks, displayGalleryError } from "./works.js";
import { displayFilters } from "./categories.js";


/**
 * recupere les works
 * affiche les works
 * recupere les categories
 * creer et affiche les boutons filtres qui permettent de trier les categories a afficher
 */
async function init() {
	try {
		const works = await getWorks();
		console.log(works);
		displayWorks(works);
		
		const categories = await getCategories();
		console.log(categories);
		displayFilters(categories, works);
		
		//displaymodal + hide en css 
	} catch (error) {
		console.error(error);
		displayGalleryError("Impossible de charger les projets pour le moment.");
	}
}

init();
