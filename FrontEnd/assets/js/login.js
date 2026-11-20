import {login} from './api.js';


/**
 * Gère le formulaire de connexion.
 * Si les identifiants sont bons : garde le token et renvoie vers l'accueil.
 * Sinon : affiche un message d'erreur.
 */
function initLoginForm() {
  const form = document.querySelector('#login form');
  const errorMessage = document.querySelector('.login-error');

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    errorMessage.textContent = '';

    const email = form.email.value.trim();
    const password = form.password.value;

    try {
      const data = await login(email, password);
      // localStorage : le token reste après fermeture du navigateur (24h côté API).
      // sessionStorage (effacé à la fermeture de l'onglet) serait plutôt pour des usages plus sécurisés, où l'on ne veut pas que la session survive.
      localStorage.setItem('token', data.token);
      window.location.href = './index.html';
    } catch (error) {
      console.error(error);
      errorMessage.textContent = 'Erreur dans l’identifiant ou le mot de passe';
    }
  });
}


document.addEventListener('DOMContentLoaded', () => {initLoginForm()});
