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
		compared_element.classList.add('compared_element');
		return false;
	} else {
		compared_element.classList.add('disordered_element');

		let tmp_id = compared_element.id;
		let tmp_height = compared_element.style.height;

		compared_element.style.height = selected_element.style.height;
		compared_element.id = selected_element.id;

		selected_element.style.height = tmp_height;
		selected_element.id = tmp_id;

		return true;
	}
}

function removeLastClass(element) {
	element.classList.remove(element.classList[element.classList.length - 1]);
}

// Sorting Waiting Control

async function wait() {
	if (checkStopSorting()) {
		return true;
	}
	await sleep(5000 / parseInt(document.getElementById('speed_slider').value));
	if (checkStopSorting()) {
		return true;
	}
	return false;
}

// Sorting Control

function startSorting() {
	document.getElementById('sort_button').disabled = true;
	document.getElementById('sort_status').innerHTML = 'sorting';
}

function stopSorting() {
	document.getElementById('sort_button').disabled = false;
	document.getElementById('sort_status').innerHTML = 'not_sorted';
}

function checkStopSorting() {
	if (document.getElementById('sort_status').innerHTML == 'not_sorted') {
		return true;
	}
	return false;
}

function finishSorting() {
	document.getElementById('sort_button').disabled = false;
	document.getElementById('sort_status').innerHTML = 'sorted';
}

// ---------------------------------

function generateRandomArray(size) {
	let array = [];

	stopSorting();

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
	startSorting();

	for (let i = 0; i < rectangles_array.length; i++) {
		let selected_element = rectangles_array[i];
		selected_element.classList.add('selected_element');

		for (let j = i + 1; j < rectangles_array.length; j++) {
			let compared_element = rectangles_array[j];

			switchRectangles(selected_element, compared_element);

			if (await wait()) {
				return 0;
			}

			removeLastClass(compared_element);
		}
		removeLastClass(selected_element);
	}
	finishSorting();
}
