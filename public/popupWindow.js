let popupWindow = document.getElementsByClassName('popupWindow')[0];

let closeButton = document.getElementsByClassName('closeButton')[0];

window.onload = function() {
	popupWindow.style.display = 'block';
};
window.onclick = function(event) {
	if ((event.target = popupWindow)) {
		popupWindow.style.display = 'none';
	}
};

closeButton.onclick = function() {
	popupWindow.style.display = 'none';
};
