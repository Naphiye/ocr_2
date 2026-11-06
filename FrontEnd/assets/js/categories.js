// Filtres de la galerie par catégorie
import { displayWorks } from "./works.js";

// Crée un bouton de filtre.
// categoryId vaut null pour le bouton "Tous".
// works = la liste complète des projets, déjà chargée.
function createFilterButton(label, categoryId, works) {
	const button = document.createElement("button");
	button.type = "button";
	button.textContent = label;
	button.classList.add("filter-btn");

	button.addEventListener("click", () => {
		// Le bouton cliqué devient le seul bouton actif
		document.querySelectorAll(".filter-btn").forEach((btn) => btn.classList.remove("active"));
		button.classList.add("active");

		// On filtre la liste déjà en mémoire : pas de nouvel appel à l'API
		if (categoryId === null) {
			displayWorks(works);
		} else {
			const filteredWorks = works.filter((work) => work.categoryId === categoryId);
			displayWorks(filteredWorks);
		}
	});

	return button;
}

// Crée la barre de filtres et la place juste avant la galerie
export function displayFilters(categories, works) {
	const filters = document.createElement("div");
	filters.classList.add("filters");

	const allButton = createFilterButton("Tous", null, works);
	allButton.classList.add("active"); // au chargement, tout est affiché
	filters.appendChild(allButton);

	for (const category of categories) {
		filters.appendChild(createFilterButton(category.name, category.id, works));
	}

	document.querySelector(".gallery").before(filters);
}
