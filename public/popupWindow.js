document.getElementsByClassName('popupWindow')[0].style.display = 'none';
let popupWindow = document.getElementsByClassName('popupWindow')[0];

let closeButton = document.getElementsByClassName('closeButton')[0];

let openButton = document.querySelector('#helpButton');

window.onload = function() {
	if (document.cookie == 'readPopup=true') {
		popupWindow.style.display = 'none';
	} else popupWindow.style.display = 'block';
};

window.onclick = function(event) {
	if (event.target == popupWindow && event.target != openButton) {
		popupWindow.style.display = 'none';
	}
};
openButton.onclick = function() {
	popupWindow.style.display = 'block';
};
closeButton.onclick = function() {
	popupWindow.style.display = 'none';
	const d = new Date();
	d.setTime(d.getTime() + 7 * 24 * 60 * 60 * 1000);
	let expires = 'expires=' + d.toUTCString();
	document.cookie = 'readPopup' + '=' + true + ';' + expires + ';path=/';
};
