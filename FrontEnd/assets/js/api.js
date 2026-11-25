const API_URL = 'http://localhost:5678/api';



/**
 * Récupère la liste des projets (GET /works).
 * @returns {Promise<object[]>} les projets
 */
export async function getWorks() {
  const response = await fetch(API_URL + '/works');
  if (!response.ok) {
    throw new Error(`Erreur API : ${response.status}`);
  }
  return response.json();
}



/**
 * Récupère la liste des catégories (GET /categories).
 * @returns {Promise<object[]>} les catégories, avec leur id et leur nom
 */
export async function getCategories() {
  const response = await fetch(`${API_URL}/categories`);
  if (!response.ok) {
    throw new Error(`Erreur API : ${response.status}`);
  }
  return response.json();
}



/**
 * Connecte l'utilisateur (POST /users/login).
 * Lève une erreur si l'email ou le mot de passe est faux.
 * @param {string} email l'email saisi
 * @param {string} password le mot de passe saisi
 * @returns {Promise<object>} l'id de l'utilisateur et son token
 */
export async function login(email, password) {
  const response = await fetch(`${API_URL}/users/login`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({email, password}),
  });
  if (!response.ok) {
    throw new Error(`Erreur API : ${response.status}`);
  }
  return response.json();
}



/**
 * Supprime un projet (DELETE /works/{id}).
 * Il faut être connecté : le token est envoyé dans l'en-tête Authorization.
 * @param {number} id l'id du projet à supprimer
 * @returns {Promise<void>}
 */
export async function deleteWork(id) {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/works/${id}`, {
    method: 'DELETE',
    headers: {Authorization: `Bearer ${token}`},
  });
  if (!response.ok) {
    const error = new Error(`Erreur API : ${response.status}`);
    error.status = response.status;
    throw error;
  }
}



/**
 * Ajoute un projet (POST /works).
 * Il faut être connecté : le token est envoyé dans l'en-tête Authorization.
 * @param {FormData} formData l'image, le titre et la catégorie du projet
 * @returns {Promise<object>} le projet créé, avec son id et l'url de son image
 */
export async function addWork(formData) {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/works`, {
    method: 'POST',
    headers: {Authorization: `Bearer ${token}`},
    body: formData,
  });
  if (!response.ok) {
    throw new Error(`Erreur API : ${response.status}`);
  }
  return response.json();
}
