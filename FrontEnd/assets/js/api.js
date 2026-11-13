export const API_URL = 'http://localhost:5678/api';



/**
 * recupere la liste des travaux avec un get sur la route  /works
 * @returns promesse résolue avec les travaux, une fois le corps de la réponse lu et converti du JSON en objets JS par response.json()
 */
export async function getWorks() {
  const response = await fetch(API_URL + '/works');
  if (!response.ok) {
    throw new Error(`Erreur API : ${response.status}`);
  }
  return response.json();
}



/**
 * recupere las liste des categories de travaux avec un getr sur la route  /categories
 * @returns promesse résolue avec les categories, une fois le corps de la réponse lu et converti du JSON en objets JS par response.json()
 */
export async function getCategories() {
  const response = await fetch(`${API_URL}/categories`);
  if (!response.ok) {
    throw new Error(`Erreur API : ${response.status}`);
  }
  return response.json();
}
