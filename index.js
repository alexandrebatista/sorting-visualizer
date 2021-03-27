function shuffle(array) {
	var currentIndex = array.length,
		temporaryValue,
		randomIndex;

	// While there remain elements to shuffle...
	while (0 !== currentIndex) {
		// Pick a remaining element...
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;

		// And swap it with the current element.
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}

	return array;
}

function sleep(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

function switchRectangles(selected_element, compared_element) {
	if (parseInt(selected_element.id) <= parseInt(compared_element.id)) {
		compared_element.className += ' compared_element';
		return false;
	} else {
		compared_element.className += ' disordered_element';

		let tmp_id = compared_element.id;
		let tmp_height = compared_element.style.height;

		compared_element.style.height = selected_element.style.height;
		compared_element.id = selected_element.id;

		selected_element.style.height = tmp_height;
		selected_element.id = tmp_id;

		return true;
	}
}

// ---------------------------------

function generateRandomArray(size) {
	let array = [];

	for (let i = 0; i < size; i++) {
		array.push(
			`<div id="${i}" class="rectangle" style="height: ${
				10 + 10 * i
			}px"></div>`
		);
	}

	array = shuffle(array);
	document.getElementById('rectangles_container').innerHTML = array.join(' ');
}

async function bubbleSort() {
	let rectangles_array = document.getElementsByClassName('rectangle');

	for (let i = 0; i < rectangles_array.length; i++) {
		let selected_element = rectangles_array[i];
		let selected_element_oldclass = selected_element.className;

		selected_element.className += ' selected_element';

		for (let j = i + 1; j < rectangles_array.length; j++) {
			let compared_element = rectangles_array[j];
			let compared_element_oldclass = compared_element.className;

			switchRectangles(selected_element, compared_element);

			await sleep(
				parseInt(document.getElementById('speed_slider').value)
			);
			compared_element.className = compared_element_oldclass;
		}
		selected_element.className = selected_element_oldclass;
	}
}
