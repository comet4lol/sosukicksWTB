let popupWindow = document.querySelector('.popupWindow');
let body = document.querySelector('body');
let submitButton = document.querySelector('#submitButton');

let adminPanel = document.querySelector('.adminPanel');
let header = document.querySelector('.header');
window.onload = function() {
	adminPanel.style.display = 'none';
	header.style.display = 'none';
	popupWindow.style.display = 'flex';
	popupWindow.style.justifyContent = 'center';
	popupWindow.style.alignItems = 'center';
};

submitButton.onclick = function(event) {
	let adminInput = document.querySelector('#adminInput');
	if (adminInput.value == 'tothemoon') {
		popupWindow.style.display = 'none';
		adminPanel.style.display = 'flex';
		header.style.display = 'block';
	}
};
