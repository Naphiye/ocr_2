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

async function init() {
	try {
		works = await getWorks();
		console.log(works);
        displayWorks(works);

	} catch (error) {
		console.error(error);
		gallery.textContent = "Impossible de charger les projets pour le moment.";
	}
}

init();
