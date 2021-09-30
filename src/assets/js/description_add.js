$(document).ready(function () {
	let addButton = document.getElementById('add_he_description') //Add button selector
	let removeButton = document.getElementById('delete_he_description')
	let wrapper = document.getElementsByClassName('he_descriptions') //Input field wrapper
	let fieldHTML =
		'<div class="form-group hebrew_text"><label for="he_name">תיאור</label><textarea class="form-control" placeholder="תיאור" id=he_description name="he_description[]"></textarea></div>'
	//Once add button is clicked
	$(addButton).click(function () {
		$(wrapper).append(fieldHTML) //Add field html
	})
	$(removeButton).click(function () {
		$(wrapper).find('div:last').remove()
	})
})
$(document).ready(function () {
	let addButton = document.getElementById('add_ru_description') //Add button selector
	let removeButton = document.getElementById('delete_ru_description')
	let wrapper = document.getElementsByClassName('ru_descriptions') //Input field wrapper
	let fieldHTML =
		'<div class="form-group"><label for="ru_description">описание</label><textarea class="form-control" placeholder="описание" id=ru_description name="ru_description[]"></textarea></div>'

	//Once add button is clicked
	$(addButton).click(function () {
		$(wrapper).append(fieldHTML) //Add field html
	})
	$(removeButton).click(function () {
		$(wrapper).find('div:last').remove()
	})
})
$(document).ready(function () {
	let addButton = document.getElementById('add_en_description') //Add button selector
	let removeButton = document.getElementById('delete_en_description')
	let wrapper = document.getElementsByClassName('en_descriptions') //Input field wrapper
	let fieldHTML =
		'<div class="form-group"><label for="en_description">Description</label><textarea class="form-control" placeholder="Description" id=en_description name="en_description[]"></textarea></div>'

	//Once add button is clicked
	$(addButton).click(function () {
		$(wrapper).append(fieldHTML) //Add field html
	})
	$(removeButton).click(function () {
		$(wrapper).find('div:last').remove()
	})
})
