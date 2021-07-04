let popupWindow = document.getElementsByClassName('popupWindow')[0];

let closeButton = document.getElementsByClassName('closeButton')[0];

let openButton = document.querySelector('#helpButton');
// console.log(openButton);
window.onload = function() {
	popupWindow.style.display = 'block';
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
};
