// Tous les échanges avec le serveur passent par ce fichier.
// Si l'adresse de l'API change, on ne la modifie qu'ici.
export const API_URL = 'http://localhost:5678/api';

// Récupère tous les projets (GET /works)
export async function getWorks() {
  const response = await fetch(API_URL + '/works');
  if (!response.ok) {
    throw new Error(`Erreur API : ${response.status}`);
  }
  return response.json();
}

// Récupère toutes les catégories (GET /categories)
export async function getCategories() {
  const response = await fetch(`${API_URL}/categories`);
  if (!response.ok) {
    throw new Error(`Erreur API : ${response.status}`);
  }
  return response.json();
}
