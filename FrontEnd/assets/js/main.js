import {getCategories, getWorks} from './api.js';
import {displayFilters} from './categories.js';
import {displayEditMode} from './edit-mode.js';
import {createModal, displayEditButton, displayModalWorks} from './modal.js';
import {displayGalleryError, displayWorks} from './works.js';


/* TO DO
-> fonction regarder si il y a un token si oui afficher obuton modifier si non afficher les filtres 
-> localstorage.setItem / getItem -> local storage
- bouton appelle la route delete /works/id-du-works-adelete (routre ne marhce
pas tant quon est pas authentifie ) recuperer le token du local storage pour dans le header du fetch authorisation bearer 
 -en bas du modal bouton ajouter une photo
 const response = await fetch( "http://localhost:5678/api/works", { method: "POST", headers: { Authorization: `Bearer ${token}` }, body: formData } 
 javascript formdata 
- appelle un nouveau modale ajout photo
- formulaire pour champ input type file + creer un mask et le relier avec label for ( jpg png 4mo max ) accept + size + verifier extension en js   
-formulaire texte pour titre
- choix parmis les categories existantes
-bouton valider bloaue rtant que tous les champs ne sont pas rempli ( css bloque
)
-> bouton qui appelle la route post work avec corps de la requete : image string
le title string et la category int
- faire la page login avec champos email et mdp bouton se connecter qui appelle
lla route  avec email string et passwork string en objet de la requete
-  qui recupere le token dans la reponse et qui le met soit dans le local
storage ( conserve apres fermeture du navigateur) soit session storage token
effacxe apres fermeture de longlet
- apres cettte etape route delete fonctionne
-faire le bouton modifier a cote de projet qui appelle displaymodale mais
afficher ce bouton que si le client est connnecte ( si il y a token ) 
- initialise les boutons projets contact et login de la nav en haut


-CMS prestaSHOP 
- */



/**
 * recupere les works
 * affiche les works
 * recupere les categories
 * creer et affiche les boutons filtres qui permettent de trier les categories a
 * afficher /users/login avec
 */
async function init() {
  try {
    const works = await getWorks();
    console.log(works);
    displayWorks(works);

    const categories = await getCategories();
    console.log(categories);

    const token = localStorage.getItem('token');
    if (token) {
      createModal();
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