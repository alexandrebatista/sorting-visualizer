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

async function switchRectangles(selected_element, compared_element) {
	let swap = 0;
	if (parseInt(selected_element.id) <= parseInt(compared_element.id)) {
		compared_element.classList.add('compared_element');
	} else {
		compared_element.classList.add('disordered_element');

		let tmp_id = compared_element.id;
		let tmp_height = compared_element.style.height;

		compared_element.style.height = selected_element.style.height;
		compared_element.id = selected_element.id;

		selected_element.style.height = tmp_height;
		selected_element.id = tmp_id;
		swap = 1;
	}

	if (await wait()) {
		return -1;
	} else {
		removeLastClass(compared_element);
		return swap;
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

function generateRandomArray() {
	let array = [];
	const size = document.getElementById('size_slider').value;

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

function defineSizeSlider() {
	const selectElement = document.getElementById('size_slider');
	selectElement.addEventListener('change', (event) => {
		generateRandomArray();
	});
}

async function algorithmSelection() {
	const algorithm = document.getElementById('algorithm').value;
	let rectangles_array = document.getElementsByClassName('rectangle');

	startSorting();
	switch (algorithm) {
		case 'Bubble':
			await bubbleSort(rectangles_array);
			break;
		case 'Selection':
			await selectionSort(rectangles_array);
			break;
		default:
			break;
	}
	finishSorting();
}

async function bubbleSort(rectangles_array) {
	let swap = true;
	let iterations = 0;

	while (swap == true) {
		swap = false;
		for (let i = 0; i < rectangles_array.length - 1 - iterations; i++) {
			let selected_element = rectangles_array[i];
			selected_element.classList.add('selected_element');
			let compared_element = rectangles_array[i + 1];
			result = await switchRectangles(selected_element, compared_element);

			if (result == -1) {
				return 0;
			} else if (result == 1) {
				swap = true;
			}
			removeLastClass(selected_element);
		}
		iterations += 1;
	}
}

async function selectionSort(rectangles_array) {
	for (let i = 0; i < rectangles_array.length; i++) {
		let selected_element = rectangles_array[i];
		selected_element.classList.add('selected_element');

		for (let j = i + 1; j < rectangles_array.length; j++) {
			let compared_element = rectangles_array[j];
			if (
				(await switchRectangles(selected_element, compared_element)) ==
				-1
			) {
				return 0;
			}
		}
		removeLastClass(selected_element);
	}
}
