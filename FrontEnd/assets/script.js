// Adresse de base de l'API (le backend fourni)
const API_URL = "http://localhost:5678/api";

// Élément HTML qui va contenir les projets
const gallery = document.querySelector(".gallery");


let works = [];

async function getWorks() {
	const response = await fetch(`${API_URL}/works`);
	if (!response.ok) {
		throw new Error(`Erreur API : ${response.status}`);
	}
	return response.json();
}


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

function displayWorks(worksToDisplay) {
	gallery.innerHTML = ""; // on vide la galerie avant de la remplir
	for (const work of worksToDisplay) {
		gallery.appendChild(createWorkFigure(work));
	}
}

// ----- Étape 2 : filtres par catégorie -----

async function getCategories() {
	const response = await fetch(`${API_URL}/categories`);
	if (!response.ok) {
		throw new Error(`Erreur API : ${response.status}`);
	}
	return response.json();
}

// Crée un bouton de filtre.
// categoryId vaut null pour le bouton "Tous".
function createFilterButton(label, categoryId) {
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
function displayFilters(categories) {
	const filters = document.createElement("div");
	filters.classList.add("filters");

	const allButton = createFilterButton("Tous", null);
	allButton.classList.add("active"); // au chargement, tout est affiché
	filters.appendChild(allButton);

	for (const category of categories) {
		filters.appendChild(createFilterButton(category.name, category.id));
	}

	gallery.before(filters);
}

async function init() {
	try {
		works = await getWorks();
		console.log(works);
        displayWorks(works);

		const categories = await getCategories();
		displayFilters(categories);

	} catch (error) {
		console.error(error);
		gallery.textContent = "Impossible de charger les projets pour le moment.";
	}
}

init();
