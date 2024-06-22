const todoForm = document.querySelector('.todo-form');
const todoTaskInput = todoForm.querySelector("[name='task']");
const todoDateInput = todoForm.querySelector("[name='date']");
const todoList = document.querySelector('.todo-list');
const searchInput = document.querySelector('.search');

const tasks = JSON.parse(localStorage.getItem('tasks')) ?? [];

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

  task.append(check, taskDate, taskText);

  todoList.append(task);
};

const renderTasks = (tasksList) => {
  todoList.innerHTML = '';
  tasksList.forEach((task) => {
    createTask(task);
  });
};

if (tasks.length === 0) {
  const todoListWrapper = document.querySelector('.todo-list-wrapper');
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
