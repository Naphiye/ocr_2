import {getCategories, getWorks} from './api.js';
import {displayFilters} from './categories.js';
import {displayEditMode} from './edit-mode.js';
import {createModal, displayEditButton, displayModalWorks} from './modal.js';
import {displayGalleryError, displayWorks} from './works.js';



/**
 * Lance la page d'accueil.
 * Récupère les projets et les catégories, puis affiche la galerie.
 * Si on est connecté (token présent), passe en mode édition : bandeau, bouton
 * modifier et modale. Sinon, affiche les filtres.
 */
async function init() {
  try {
    const works = await getWorks();
    displayWorks(works);

    const categories = await getCategories();

    const token = localStorage.getItem('token');
    if (token) {
      createModal(categories);
      displayModalWorks(works);
      displayEditButton();
      displayEditMode();
    } else {
      displayFilters(categories, works);
    }
  } catch (error) {
    console.error(error);
    displayGalleryError('Impossible de charger les projets pour le moment.');
  }
}



document.addEventListener('DOMContentLoaded', event => {init()});
//attend que le dom soit charge  avant appel init
