import { getWorks, getCategories } from "./api.js";
import { displayWorks, displayGalleryError } from "./works.js";
import { displayFilters } from "./categories.js";
import { createModal } from "./modal.js";


/* TO DO 
- css sur les filtres 
-css sur les fig caption
- creer le modale mes projets 
- titre du modale galerie photo 
- affichage de tous les works en tout petit dans le modale avec un bouton icone poiubelle en haut a droite de chaque image 
- bouton appelle la route delete /works/id-du-works-adelete (routre ne marhce pas tant quon est pas authentifie )
-en basdu modal bouton ajouter une photo 
- change le modale en ajout photo 
- formulaire pour drop file ( jpg png 4mo max ) 
- appercu du file drop en miniature avewc changement si changement 
-formulaire texte pour titre 
- choix parmis les categories existantes 
-bouton valider bloaue rtant que tous les champs ne sont pas rempli ( css bloque ) 
-> bouton qui appelle la route post work avec corps de la requete : image string le title string et la category int
- faire la page login avec champos email et mdp bouton se connecter qui appelle lla route  avec email string et passwork string en objet de la requete 
-  qui recupere le token dans la reponse et qui le met soit dans le local storage ( conserve apres fermeture du navigateur) soit session storage token effacxe apres fermeture de longlet 
- apres cettte etape route delete fonctionne
-faire le bouton modifier a cote de projet qui appelle displaymodale mais afficher ce bouton que si le client est connnecte ( voir comment verifier ca )
- initialise les boutons projets contact et login de la nav en haut
- */ 



/**
 * recupere les works
 * affiche les works
 * recupere les categories
 * creer et affiche les boutons filtres qui permettent de trier les categories a afficher /users/login avec 
 */
async function init() {
	try {
		const works = await getWorks();
		console.log(works);
		displayWorks(works);
		
		const categories = await getCategories();
		console.log(categories);
		displayFilters(categories, works);
		
		// Modale créée cachée, elle sera ouverte par le bouton "modifier"
		createModal();
	} catch (error) {
		console.error(error);
		displayGalleryError("Impossible de charger les projets pour le moment.");
	}
}

init();
