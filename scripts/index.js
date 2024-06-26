const todoForm = document.querySelector('.todo-form');
const todoTaskInput = todoForm.querySelector("[name='task']");
const todoDateInput = todoForm.querySelector("[name='date']");
const todoListWrapper = document.querySelector('.todo-list-wrapper');
const todoList = document.querySelector('.todo-list');
const todoListTabs = document.querySelectorAll('.todo-list-tabs > .tab');

let tasks = JSON.parse(localStorage.getItem('tasks')) ?? [];

const renderTasks = (tasksList = tasks) => {
  if (tasks.length === 0) {
    todoListWrapper.style.display = 'none';
  }
  if (tasks.length === 1) {
    todoListWrapper.style.display = 'flex';
  }
  todoList.innerHTML = '';
  tasksList.forEach((task) => {
    createTaskEl(task);
  });
};

renderTasks();

function createTaskEl(task) {
  const taskEl = createEl('li', 'todo-list__item task');

  const checkEl = createEl('input', 'task__check');
  checkEl.setAttribute('type', 'checkbox');

  setChecked(task.completed, taskEl, checkEl);

  checkEl.addEventListener('change', () => {
    toggleChecked(task.id, checkEl);
    setChecked(task.completed, taskEl, checkEl);
  });

  const dateEl = createEl('div', 'task__date', task.date);
  const textEl = createEl('div', 'task__text', task.text);

  const deleteBtn = createEl(
    'span',
    'material-symbols-outlined task__delete',
    'delete'
  );

  deleteBtn.addEventListener('click', () => {
    deleteTask(task.id);
    renderTasks();
  });

  taskEl.append(checkEl, dateEl, textEl, deleteBtn);

  todoList.append(taskEl);
}

function createEl(tag, className, text) {
  const element = document.createElement(tag);
  element.setAttribute('class', className);
  if (text) {
    element.textContent = text;
  }
  return element;
}

function setChecked(taskCompleted, taskEl, checkEl) {
  if (taskCompleted) {
    taskEl.classList.add('task--done');
    checkEl.checked = true;
  } else {
    taskEl.classList.remove('task--done');
    checkEl.checked = false;
  }
}

function toggleChecked(taskID, checkEl) {
  const task = tasks.find((item) => item.id === taskID);
  if (checkEl.checked) {
    task.completed = true;
  } else {
    task.completed = false;
  }
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

const clearInput = () => {
  todoDateInput.value = '';
  todoDateInput.placeholder = 'Дата';
  todoTaskInput.value = '';
  todoTaskInput.placeholder = 'Описание';
};

const addTask = (text, date) => {
  const newTask = {
    id: Math.random(),
    text,
    date,
    completed: false,
  };
  tasks.push(newTask);
  localStorage.setItem('tasks', JSON.stringify(tasks));
};

function deleteTask(taskID) {
  const filteredTasks = tasks.filter((item) => item.id !== taskID);
  tasks = filteredTasks;
  localStorage.setItem('tasks', JSON.stringify(filteredTasks));
}

const setRequiredInput = (input) => {
  input.setAttribute('placeholder', 'Поле обязательно для заполнения');
};

todoForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const taskText = todoTaskInput.value;
  const taskDate = todoDateInput.value;

  if (taskText && taskDate) {
    addTask(taskText, taskDate);
    clearInput();
    renderTasks();
  } else {
    if (!todoDateInput.value) {
      setRequiredInput(todoDateInput);
    }
    if (!todoTaskInput.value) {
      setRequiredInput(todoTaskInput);
    }
  }
});

todoForm.addEventListener('reset', clearInput);

todoDateInput.addEventListener('focus', (event) => {
  event.target.type = 'datetime-local';
});

todoDateInput.addEventListener('blur', (event) => {
  event.target.type = 'text';
});

const getTasksByStatus = (tabStatus) => {
  if (tabStatus === 'all') {
    return tasks;
  }
  if (tabStatus === 'active') {
    return tasks.filter((task) => !task.completed);
  }
  if (tabStatus === 'done') {
    return tasks.filter((task) => task.completed);
  }
};

const setSelectedTab = (tab) => {
  const selectedTab = document.querySelector('.tab--selected');
  if (selectedTab) {
    selectedTab.classList.remove('tab--selected');
  }

  tab.classList.add('tab--selected');
};

todoListTabs.forEach((tab) => {
  tab.addEventListener('click', (event) => {
    const currentTab = event.currentTarget;
    setSelectedTab(currentTab);

    const status = currentTab.dataset.tab;
    const statusTasks = getTasksByStatus(status);
    renderTasks(statusTasks);
  });
});

const searchInput = document.querySelector('.todo-search');

const getTasksByValue = (tasksList, taskValue) => {
  return tasksList.filter((task) => task.text.includes(taskValue));
};

searchInput.addEventListener('input', () => {
  const searchTasks = getTasksByValue(tasks, searchInput.value);
  renderTasks(searchTasks);
});

const currentDateElement = document.querySelector("[date='date']");
const currentDayElement = document.querySelector('[date="day"]');

const currentDate = new Date();
const currentWeekendDay = currentDate.toLocaleString('ru-RU', {
  weekday: 'long',
});
const currentDay = currentDate.toLocaleString('ru-RU', { day: 'numeric' });
const currentMonth = currentDate.toLocaleString('ru-RU', { month: 'long' });

currentDayElement.textContent =
  currentWeekendDay[0].toUpperCase() + currentWeekendDay.slice(1);
currentDateElement.textContent = currentDay + ', ' + currentMonth;
