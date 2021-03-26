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

function switchRectangles(selected_element_id, compared_element_id) {
	if (parseInt(selected_element_id) <= parseInt(compared_element_id)) {
		document.getElementById(compared_element_id).className +=
			' compared_element';

		return false;
	} else {
		document.getElementById(compared_element_id).className +=
			' disordered_element';

		let tmp_id = compared_element_id;
		let tmp_height = document.getElementById(compared_element_id).style
			.height;

		document.getElementById(
			compared_element_id
		).style.height = document.getElementById(
			selected_element_id
		).style.height;
		document.getElementById(compared_element_id).id = selected_element_id;
		a = tmp_height;

		document.getElementById(selected_element_id).style.height = tmp_height;
		document.getElementById(selected_element_id).id = tmp_id;

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

async function bubbleSort(time = 0.001) {
	let rectangles_array = document.getElementsByClassName('rectangle');
	let switched = true;

	while (switched) {
		switched = false;

		for (let i = 0; i < rectangles_array.length; i++) {
			let rectangles_array = document.getElementsByClassName('rectangle');

			let selected_element_id = rectangles_array[i].id;
			let selected_document_class = rectangles_array[i].className;

			document.getElementById(selected_element_id).className +=
				' selected_element';

			for (let j = i + 1; j < rectangles_array.length; j++) {
				let compared_element_id = rectangles_array[j].id;
				let compared_document_class = rectangles_array[j].className;

				switched = switchRectangles(
					selected_element_id,
					compared_element_id
				);
				await sleep(10);
				if (switched) {
					tmp_id = compared_element_id;
					compared_element_id = selected_element_id;
					selected_element_id = tmp_id;
				}

				document.getElementById(
					compared_element_id
				).className = compared_document_class;
			}

			document.getElementById(
				selected_element_id
			).className = selected_document_class;
		}
	}
}
