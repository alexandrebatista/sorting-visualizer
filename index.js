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

async function switchRectangles(
	selected_element,
	compared_element,
	check = true
) {
	let swap = false;
	if (
		check &&
		parseInt(selected_element.id) <= parseInt(compared_element.id)
	) {
		compared_element.classList.add('compared_element');
	} else {
		compared_element.classList.add('disordered_element');

		let tmp_id = compared_element.id;
		let tmp_height = compared_element.style.height;

		compared_element.style.height = selected_element.style.height;
		compared_element.id = selected_element.id;

		selected_element.style.height = tmp_height;
		selected_element.id = tmp_id;
		swap = true;
	}

	await wait();
	removeLastClass(compared_element);
	return swap;
}

function removeLastClass(element) {
	element.classList.remove(element.classList[element.classList.length - 1]);
}

// Sorting Waiting Control

async function wait() {
	if (checkStopSorting()) {
		throw 'Error';
	}
	await sleep(5000 / parseInt(document.getElementById('speed_slider').value));
	if (checkStopSorting()) {
		throw 'Error';
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
	const maxSize = parseInt(document.getElementById('size_slider').max);

	const windowHeight =
		window.innerHeight ||
		document.documentElement.clientHeight ||
		document.body.clientHeight;

	const heightAdjust = size + windowHeight;

	stopSorting();

	for (let i = 0; i < size; i++) {
		array.push(
			`<div id="${i}" class="rectangle" style="height: ${
				(10 + 10 * i) * 45000 * (1 / heightAdjust)
			}px; width: ${maxSize / size}%"></div>`
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
	try {
		switch (algorithm) {
			case 'Bubble':
				await bubbleSort(rectangles_array);
				break;
			case 'Merge':
				await mergeSort(rectangles_array, 0, rectangles_array.length);
				break;
			case 'Quick':
				await quickSort(rectangles_array, 0, rectangles_array.length);
				break;
			case 'Selection':
				await selectionSort(rectangles_array);
				break;
			default:
				break;
		}
	} catch {}
	finishSorting();
}

// Bubble Sort -----------------------------------------------------

async function bubbleSort(rectangles_array) {
	let swap = true;
	let iterations = 0;

	while (swap) {
		swap = false;
		for (let i = 0; i < rectangles_array.length - 1 - iterations; i++) {
			let selected_element = rectangles_array[i];
			selected_element.classList.add('selected_element');
			let compared_element = rectangles_array[i + 1];
			if (await switchRectangles(selected_element, compared_element)) {
				swap = true;
			}
			removeLastClass(selected_element);
		}
		iterations += 1;
	}
}

// Merge Sort -----------------------------------------------------

async function merge(rectangles_array, begin, middle, end) {
	let correct_order = [];

	for (
		let index_first_half = begin, index_second_half = middle;
		index_first_half < middle || index_second_half < end;

	) {
		if (index_first_half < middle && index_second_half < end) {
			rectangles_array[index_first_half].classList.add(
				'selected_element'
			);
			if (
				parseInt(rectangles_array[index_first_half].id) <
				parseInt(rectangles_array[index_second_half].id)
			) {
				rectangles_array[index_second_half].classList.add(
					'compared_element'
				);
				correct_order.push({
					id: rectangles_array[index_first_half].id,
					height: rectangles_array[index_first_half].style.height,
				});
				await wait();
				removeLastClass(rectangles_array[index_first_half]);
				removeLastClass(rectangles_array[index_second_half]);
				index_first_half++;
			} else {
				rectangles_array[index_second_half].classList.add(
					'disordered_element'
				);
				correct_order.push({
					id: rectangles_array[index_second_half].id,
					height: rectangles_array[index_second_half].style.height,
				});
				await wait();
				removeLastClass(rectangles_array[index_first_half]);
				removeLastClass(rectangles_array[index_second_half]);
				index_second_half++;
			}
		} else {
			if (index_first_half < middle) {
				rectangles_array[index_first_half].classList.add(
					'selected_element'
				);
				correct_order.push({
					id: rectangles_array[index_first_half].id,
					height: rectangles_array[index_first_half].style.height,
				});
				await wait();
				removeLastClass(rectangles_array[index_first_half]);
				index_first_half++;
			} else {
				rectangles_array[index_second_half].classList.add(
					'selected_element'
				);
				correct_order.push({
					id: rectangles_array[index_second_half].id,
					height: rectangles_array[index_second_half].style.height,
				});
				await wait();
				removeLastClass(rectangles_array[index_second_half]);
				index_second_half++;
			}
		}
	}

	for (let index = begin; index < end; index++) {
		const selected_element = rectangles_array[index];
		selected_element.classList.add('selected_element');
		await wait();
		const correct_element = correct_order[index - begin];
		selected_element.style.height = correct_element.height;
		selected_element.id = correct_element.id;
		removeLastClass(selected_element);
	}
	return false;
}

async function mergeSort(rectangles_array, begin, end) {
	if (end - begin > 1) {
		const middle = parseInt((begin + end) / 2);

		await mergeSort(rectangles_array, begin, middle);
		await mergeSort(rectangles_array, middle, end);
		await merge(rectangles_array, begin, middle, end);
	}
	return false;
}

// Quick Sort -----------------------------------------------------

async function partition(rectangles_array, begin, end) {
	const pivot = rectangles_array[end - 1];

	const selected_element = pivot;
	selected_element.classList.add('selected_element');

	let correctPivotIndex = begin - 1;
	let compared_element;

	for (let index = begin; index < end - 1; index++) {
		let compared_element = rectangles_array[index];
		compared_element.classList.add('compared_element');
		await wait();
		if (parseInt(compared_element.id) < parseInt(selected_element.id)) {
			correctPivotIndex++;
			const compared_element2 = rectangles_array[correctPivotIndex];

			await switchRectangles(compared_element, compared_element2, false);
		}
		removeLastClass(compared_element);
	}
	compared_element = rectangles_array[correctPivotIndex + 1];

	await switchRectangles(selected_element, compared_element, false);

	removeLastClass(selected_element);

	return correctPivotIndex + 1;
}

async function quickSort(rectangles_array, begin, end) {
	if (begin < end - 1) {
		const pivotIndex = await partition(rectangles_array, begin, end);

		await quickSort(rectangles_array, begin, pivotIndex);
		await quickSort(rectangles_array, pivotIndex + 1, end);
	}
}

// Selection Sort -----------------------------------------------------

async function selectionSort(rectangles_array) {
	for (let i = 0; i < rectangles_array.length; i++) {
		let selected_element = rectangles_array[i];
		selected_element.classList.add('selected_element');

		for (let j = i + 1; j < rectangles_array.length; j++) {
			let compared_element = rectangles_array[j];
			await switchRectangles(selected_element, compared_element);
		}
		removeLastClass(selected_element);
	}
}
