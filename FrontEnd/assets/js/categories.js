import {displayWorks} from './works.js';


/**
 * creer un bouton html avec le texte label 
 * initialise sont event click :  prend la classe active  et enleve la classe active des autres boutons 
 * event click : regarde la categorieId du bouton passe en param et affiche les works ou la categorie id est egal a celle du bouton 
 * si category id null affiche tous les works 
 * affiche les works avec fonction displayWorks 
 * @param {string} label 
 * @param {int} categoryId 
 * @param {object array} works 
 * @returns 
 */
function createFilterButton(label, categoryId, works) {
  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = label;
  button.classList.add('filter-btn');

  button.addEventListener('click', () => {
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
  });

  return button;
}



/**
 * creer et affiche des boutons :
 *  tous pour toutes les categories puis un bouton par categorie
 * bouons creer avec la fonction createfilterbutton
 * insere element html filtres avec les boutons  avant l'element gallery 
 * @param {object id name} categories
 * @param {object category categoryId id imageUrl titleuserId} works
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
