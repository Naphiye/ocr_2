function displayEditBanner() {
	const banner = document.createElement("div");
	banner.classList.add("edit-banner");
	banner.innerHTML = `<img src="./assets/icons/Vectorwhite.png" alt=""><span>Mode édition</span>`;

	document.body.prepend(banner);
	document.body.classList.add("edit-mode");
}



function displayLogoutLink() {
	const loginLink = document.querySelector(".nav-login");
	loginLink.textContent = "logout";
	loginLink.addEventListener("click", (event) => {
		event.preventDefault();
		localStorage.removeItem("token");
		window.location.reload();
	});
}



export function displayEditMode() {
	displayEditBanner();
	displayLogoutLink();
}
