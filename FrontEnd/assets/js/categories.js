import {displayWorks} from './works.js';


/**
 * Crée un bouton filtre.
 * Au clic, il devient le bouton actif et la galerie n'affiche plus que les
 * projets de sa catégorie (ou tous les projets si categoryId vaut null).
 * @param {string} label le texte du bouton
 * @param {number|null} categoryId l'id de la catégorie, null pour "Tous"
 * @param {object[]} works tous les projets
 * @returns {HTMLButtonElement} le bouton
 */
function createFilterButton(label, categoryId, works) {
  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = label;
  button.classList.add('filter-btn');

  /**
   * Active ce bouton et affiche les projets de sa catégorie.
   */
  function handleFilterClick() {
    // Le bouton cliqué devient le seul bouton actif
    document.querySelectorAll('.filter-btn')
        .forEach((btn) => btn.classList.remove('active'));
    button.classList.add('active');

    if (categoryId === null) {
      displayWorks(works);
    } else {
      const filteredWorks =
          works.filter((work) => work.categoryId === categoryId);
      displayWorks(filteredWorks);
    }
  }

  button.addEventListener('click', handleFilterClick);

  return button;
}



/**
 * Affiche les filtres au-dessus de la galerie :
 * un bouton "Tous" puis un bouton par catégorie.
 * @param {object[]} categories les catégories
 * @param {object[]} works tous les projets
 */
export function displayFilters(categories, works) {
  const filters = document.createElement('div');
  filters.classList.add('filters');

  const allButton = createFilterButton('Tous', null, works);
  allButton.classList.add('active');  // au chargement, tout est affiché
  filters.appendChild(allButton);

  for (const category of categories) {
    filters.appendChild(createFilterButton(category.name, category.id, works));
  }

  document.querySelector('.gallery').before(filters);
}
