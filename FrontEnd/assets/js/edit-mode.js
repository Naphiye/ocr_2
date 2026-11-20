/**
 * Affiche le bandeau noir "Mode édition" tout en haut de la page.
 */
function displayEditBanner() {
	const banner = document.createElement("div");
	banner.classList.add("edit-banner");
	banner.innerHTML = `<img src="./assets/icons/Vectorwhite.png" alt=""><span>Mode édition</span>`;

	document.body.prepend(banner);
	document.body.classList.add("edit-mode");
}



/**
 * Transforme "login" en "logout" dans la nav.
 * Au clic : supprime le token et recharge la page.
 */
function displayLogoutLink() {
	const loginLink = document.querySelector(".nav-login");
	loginLink.textContent = "logout";
	loginLink.addEventListener("click", (event) => {
		event.preventDefault();
		localStorage.removeItem("token");
		window.location.reload();
	});
}



/**
 * Affiche tout ce qui change quand on est connecté : le bandeau et le lien logout.
 */
export function displayEditMode() {
	displayEditBanner();
	displayLogoutLink();
}
