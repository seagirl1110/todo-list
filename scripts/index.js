const todoForm = document.querySelector('.todo-form');
const todoTaskInput = todoForm.querySelector("[name='task']");
const todoDateInput = todoForm.querySelector("[name='date']");
const todoListWrapper = document.querySelector('.todo-list-wrapper');
const todoList = document.querySelector('.todo-list');
const todoListTabs = document.querySelectorAll('.todo-list-tabs > .tab');
const searchInput = document.querySelector('.todo-search');

let tasks = JSON.parse(localStorage.getItem('tasks')) ?? [];

const searchTasks = (tasksList, taskValue) => {
  const filteredTasks = tasksList.filter((task) =>
    task.taskText.includes(taskValue)
  );
  renderTasks(filteredTasks);
};

searchInput.addEventListener('input', () => {
  searchTasks(tasks, searchInput.value);
});

const createTask = (taskObj) => {
  const task = document.createElement('li');
  task.setAttribute('class', 'todo-list__item task');

  const check = document.createElement('input');
  check.setAttribute('type', 'checkbox');
  check.setAttribute('class', 'task__check');

  const setChecked = () => {
    if (taskObj.completed) {
      task.classList.add('task--done');
      check.checked = true;
    } else {
      task.classList.remove('task--done');
      check.checked = false;
    }
  };
  setChecked();

  const toggleChecked = () => {
    const tasksElement = tasks.find((item) => item.id === taskObj.id);
    if (check.checked) {
      tasksElement.completed = true;
    } else {
      tasksElement.completed = false;
    }
    setChecked();
    localStorage.setItem('tasks', JSON.stringify(tasks));
  };

  check.addEventListener('change', toggleChecked);

  const taskDate = document.createElement('div');
  taskDate.setAttribute('class', 'task__date');
  taskDate.textContent = taskObj.taskDate;

  const taskText = document.createElement('div');
  taskText.setAttribute('class', 'task__text');
  taskText.textContent = taskObj.taskText;

  const deleteBtn = document.createElement('span');
  deleteBtn.setAttribute('class', 'material-symbols-outlined task__delete');
  deleteBtn.textContent = 'delete';

  const deleteTask = (taskID) => {
    const filteredTasks = tasks.filter((item) => item.id !== taskID);
    localStorage.setItem('tasks', JSON.stringify(filteredTasks));
    tasks = filteredTasks;
    if (tasks.length === 0) {
      todoListWrapper.style.display = 'none';
    } else {
      renderTasks(filteredTasks);
    }
  };

  deleteBtn.addEventListener('click', () => {
    deleteTask(taskObj.id);
  });

  task.append(check, taskDate, taskText, deleteBtn);

  todoList.append(task);
};

function renderTasks(tasksList) {
  todoList.innerHTML = '';
  tasksList.forEach((task) => {
    createTask(task);
  });
}

if (tasks.length === 0) {
  todoListWrapper.style.display = 'none';
} else {
  renderTasks(tasks);
}

const clearInput = () => {
  todoDateInput.value = '';
  todoDateInput.placeholder = 'Дата';
  todoTaskInput.value = '';
  todoTaskInput.placeholder = 'Описание';
};

const addTask = (taskText, taskDate) => {
  const newTask = {
    id: Math.random(),
    taskText,
    taskDate,
    completed: false,
  };
  tasks.push(newTask);
  localStorage.setItem('tasks', JSON.stringify(tasks));
  if (tasks.length === 1) {
    todoListWrapper.style.display = 'flex';
  }
  renderTasks(tasks);
};

todoForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const taskText = todoTaskInput.value;
  const taskDate = todoDateInput.value;
  if (taskText && taskDate) {
    addTask(taskText, taskDate);
    clearInput();
  } else {
    const setRequiredInput = (input) => {
      input.setAttribute('placeholder', 'Поле обязательно для заполнения');
    };
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

const getfilteredTasks = (tabStatus) => {
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

todoListTabs.forEach((tab) => {
  tab.addEventListener('click', (event) => {
    const selectedTab = document.querySelector('.tab--selected');
    if (selectedTab) {
      selectedTab.classList.remove('tab--selected');
    }
    const currentTab = event.currentTarget;
    currentTab.classList.toggle('tab--selected');
    const tabStatus = currentTab.dataset.tab;
    const filteredTask = getfilteredTasks(tabStatus);
    renderTasks(filteredTask);
  });
});

const currentDateElement = document.querySelector("[date='date']");
const currentDayElement = document.querySelector('[date="day"]');

const currentDate = new Date();
const currentWeekendDay = currentDate.toLocaleString('ru-RU', {
  weekday: 'long',
});
const currentDay = currentDate.toLocaleString('ru', { day: 'numeric' });
let currentMonth = currentDate.toLocaleString('ru', { month: 'long' });

currentDayElement.textContent =
  currentWeekendDay[0].toUpperCase() + currentWeekendDay.slice(1);
currentDateElement.textContent = currentDay + ', ' + currentMonth;
