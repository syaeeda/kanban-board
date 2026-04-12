function createTaskCard(taskObj) {
	const li = document.createElement('li');
	li.setAttribute('data-id', taskObj.id);
	li.classList.add('task-card');

	const title = document.createElement('h4');
	title.textContent = taskObj.title;

	const desc = document.createElement('p');
	desc.textContent = taskObj.description;

	const badge = document.createElement('span');
	badge.textContent = taskObj.priority;
	badge.classList.add('badge', taskObj.priority.toLowerCase());

	const date = document.createElement('small');
	date.textContent = 'Due: ${taskObj.date}';

	const editBtn = document.createElement('button');
	editBtn.textContent = 'Edit';
	editBtn.addEventListener('click', () => editTask(taskObj.id));

	const deleteBtn = document.createElement('button');
	deleteBtn.textContent = 'Delete';
	deleteBtn.addEventListener('click', () => deleteTask(taskObj.id));

	li.appendChild(title);
	li.appendChild(desc);
	li.appendChild(badge);
	li.appendChild(date);
	li.appendChild(editBtn);
	li.appendChild(deleteBtn);

	return li;
}

function addTask (columnId, taskObj) {
	const columnList = document.querySelector('#${columnId} .task-list');
	const card = createTaskCard(taskObj);

	columnList.appendChild(card);
	updateTaskCounter();
}

function deleteTask(taskId) {
	const card = document.querySelector('[data-id="${taskId}"]');

	card.classList.add('fade-out');

	card.addEventListener('animationend', () => {
		card.remove();
		updateTaskCounter();
	})
}

function editTask(taskId) {
	const card = document.querySelector('[data-id="${taskId}"]');

	document.getElementById('task-title').value = card.querySelector('h4').textContent;
	document.getElementById('task-desc').value = card.querySelector('p').textContent;

	document.getElementById('task-modal').style.display = 'block';

	document.getElementById('task-modal').setAttribute('data-editing-id', taskId);
}

function updateTask(taskId, updatedData) {
	const card = document.querySelector('[data-id="${taskId}"]');

	card.querySelector('h4').textContent = updatedData.title;
	card.querySelector('p').textContent = updatedData.description;
	card.querySelector('badge').textContent = updatedData.priority;

	document.getElementById('task-modal').style.display = 'none';
	
}