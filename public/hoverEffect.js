let allSneakersButton = document.querySelector('#allSneakersButton');
if (
	window.location.href == 'http://localhost:3000/sneakers' ||
	window.location.href == 'http://localhost:3000/sneakers/?filter='
) {
	allSneakersButton.style.backgroundColor = '#682dc5';
	allSneakersButton.style.color = '#ffffff';
}
let renderSellForm = function() {
	window.location.href = 'https://pjejyr1rrls.typeform.com/to/W6VtJ8Rg';
};
let renderAllSneakers = function() {
	window.location.href = 'http://localhost:3000/sneakers';
};
