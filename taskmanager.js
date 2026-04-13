function createTaskCard(taskObj) {
	const li = document.createElement('li');
	li.setAttribute('data-id', taskObj.id);
	li.classList.add('task-card');
	
	li.setAttribute('draggable', 'true');

	li.addEventListener('dragstart', () => {
		li.classList.add('dragging');
	});

	li.addEventListener('dragend', () => {
		li.classList.remove('dragging');
	});

	const title = document.createElement('h4');
	title.textContent = taskObj.title;

	title.addEventListener('dblclick', () => {
		const input = document.createElement('input');
		input.value = title.textContent;

		title.replaceWith(input);
		input.focus();

		const saveInline = () => {
			title.textContent = input.value;
			input.replaceWith(title);
		};

		input.addEventListener('keydown', (e) => { 
			if (e.key === 'Enter') saveInline(); 
		});
		
		input.addEventListener('blur', saveInline);		
	});

	const desc = document.createElement('p');
	desc.textContent = taskObj.description;

	const badge = document.createElement('span');
	badge.textContent = taskObj.priority;
	badge.classList.add('badge', taskObj.priority.toLowerCase());

	const date = document.createElement('small');
	date.textContent = 'Due: ' + taskObj.date;

	const editBtn = document.createElement('button');
	editBtn.textContent = 'Edit';
	editBtn.setAttribute('data-action', 'edit');

	const deleteBtn = document.createElement('button');
	deleteBtn.textContent = 'Delete';
	deleteBtn.setAttribute('data-action', 'delete');

	li.appendChild(title);
	li.appendChild(desc);
	li.appendChild(badge);
	li.appendChild(date);
	li.appendChild(editBtn);
	li.appendChild(deleteBtn);

	return li;
}

const columns = document.querySelectorAll('.task-list');

columns.forEach(list => {
	list.addEventListener('click', (event) => {
		const target = event.target;
		const card = target.closest('.task-card');

		const action = target.getAttribute('data-action');

		if (!card || !action) return;

		const taskId = card.getAttribute('data-id');

		if (action === 'edit') {
			editTask(taskId);
		} else if (action === 'delete') {
			deleteTask(taskId);
		}
	});
});

const filterDropdown = document.getElementById('priority-filter');

filterDropdown.addEventListener('change', () => {
	const selected = filterDropdown.value;
	const allCards = document.querySelectorAll('.task-card');
	
	allCards.forEach(card => {
		const cardPriority = card.querySelector('.badge').textContent;
		const shouldHide = selected !== 'All' && cardPriority !== selected;
		card.classList.toggle('is-hidden', shouldHide);
	});
});

const clearDoneBtn = document.getElementById('clear-done');

if (clearDoneBtn) {
	clearDoneBtn.addEventListener('click', () => {
		const doneCards = document.querySelectorAll('#done .task-card');

		doneCards.forEach((card, index) => {
			setTimeout(() => {
				card.classList.add('fade-out');
				card.addEventListener('animationend', () => {
					card.remove();
					updateTaskCounter();
				});
			}, index * 100);
		});
    });
}

function addTask (columnId, taskObj) {
	const columnList = document.querySelector('#' + columnId + ' .task-list');
	const card = createTaskCard(taskObj);

	columnList.appendChild(card);
	updateTaskCounter();
}

function deleteTask(taskId) {
	const card = document.querySelector('[data-id="' + taskId + '"]');

	if (card) {
		card.classList.add('fade-out'); 

        card.addEventListener('animationend', () => {
            card.remove();
            updateTaskCounter(); 
        });
    }
}

function editTask(taskId) {
	const card = document.querySelector('[data-id="' + taskId + '"]');

	const currentTitle = card.querySelector('h4').textContent;
    const currentDesc = card.querySelector('p').textContent;
    const currentPrio = card.querySelector('.badge').textContent;

    const currentDateText = card.querySelector('small').textContent;
    const currentDate = currentDateText.replace('Due: ', '');

    document.getElementById('task-title').value = currentTitle;
    document.getElementById('task-desc').value = currentDesc;
    document.getElementById('task-priority').value = currentPrio;
    document.getElementById('task-date').value = currentDate;

    const modal = document.getElementById('task-modal');
    modal.style.display = 'block';

    modal.setAttribute('data-editing-id', taskId);
}

function updateTask(taskId, updatedData) {
	const card = document.querySelector('[data-id="' + taskId + '"]');

	card.querySelector('h4').textContent = updatedData.title;
	card.querySelector('p').textContent = updatedData.description;
	
	const badge = card.querySelector('.badge');
    badge.textContent = updatedData.priority;
    badge.className = 'badge ' + updatedData.priority.toLowerCase();

    card.querySelector('small').textContent = 'Due: ' + updatedData.date;

    document.getElementById('task-modal').style.display = 'none';
}

function updateTaskCounter() {
	const count = document.querySelectorAll('.task-card').length;
	document.getElementById('task-counter').textContent = 'Tasks: ' + count;
}

document.querySelectorAll('.add-task-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const columnId = btn.closest('.column').id;
        const modal = document.getElementById('task-modal');
        
        modal.style.display = 'block';
        modal.setAttribute('data-column-id', columnId);
        modal.removeAttribute('data-editing-id');
    });
});

document.getElementById('save-task').addEventListener('click', () => {
    const modal = document.getElementById('task-modal');
    const title = document.getElementById('task-title').value;
    const desc = document.getElementById('task-desc').value;
    const priority = document.getElementById('task-priority').value;
    const date = document.getElementById('task-date').value;

    if (!title) return alert("Please enter a title");

    const taskData = {
        id: Date.now().toString(),
        title: title,
        description: desc,
        priority: priority,
        date: date
    };

    const editingId = modal.getAttribute('data-editing-id');

    if (editingId) {
        updateTask(editingId, taskData);
    } else {
        const columnId = modal.getAttribute('data-column-id');
        addTask(columnId, taskData);
    }

    modal.style.display = 'none';
    document.getElementById('task-title').value = '';
    document.getElementById('task-desc').value = '';
    document.getElementById('task-priority').value = 'High'; 
    document.getElementById('task-date').value = '';

    modal.removeAttribute('data-editing-id');
});

document.getElementById('cancel-task').addEventListener('click', () => {
    const modal = document.getElementById('task-modal');
    modal.style.display = 'none';
	
	document.getElementById('task-title').value = '';
    document.getElementById('task-desc').value = '';
    document.getElementById('task-priority').value = 'High';
    document.getElementById('task-date').value = '';
});

const dragColumns = document.querySelectorAll('.column');

dragColumns.forEach(column => {
    column.addEventListener('dragover', e => {
        e.preventDefault(); 
        
        const list = column.querySelector('.task-list');
        const afterElement = getDragAfterElement(list, e.clientY);
        const draggable = document.querySelector('.dragging');
        
        if (draggable) {
            if (afterElement == null) {
                list.appendChild(draggable);
            } else {
                list.insertBefore(draggable, afterElement);
            }
        }
    });
});

function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.task-card:not(.dragging)')];

    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

const dateInput = document.getElementById('task-date');
if (dateInput) {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const todayLocal = `${year}-${month}-${day}`;
    
    dateInput.setAttribute('min', todayLocal);
}