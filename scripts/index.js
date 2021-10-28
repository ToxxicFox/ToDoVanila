const start = document.querySelector('.start')
const tasks = document.querySelector('.tasks')
const end = document.querySelector('.end')
const circle = document.querySelector('.gauge')
const $gauge = document.querySelector('.gauge')
const input = document.querySelector('.add__btn')

let tasksState = JSON.parse(localStorage.getItem('tasks')) || []

const state = getStoredStateOrDefault({
  counter: 40,
})

function getNewId() {
  if (tasksState.length) {
    return tasksState[tasksState.length - 1].id + 1
  }

  return 1
}

function addTask(event) {
  event.preventDefault()
  const value = input.value
  input.value = ''
  const newTask = {
    id: getNewId(),
    value,
    checked: false,
  }
  tasksState.push(newTask)
  renderSection()
  saveTasks(tasksState)
}

function delTask(id) {
  tasksState = tasksState.filter((elem) => elem.id != id)
  renderSection()
  saveTasks(tasksState)
}

function setIsChecked(id, checked) {
  const index = tasksState.findIndex((task) => task.id === id)
  tasksState[index].checked = checked
  renderSection()
  saveTasks(tasksState)
}

function renderTasks() {
  if (tasksState.length) {
    tasks.innerHTML = ''
    tasksState.forEach((task, index) => {
      let value = task.value
      const newItem = document.createElement('div')
      newItem.classList.add('task__item')
      newItem.innerHTML = `
        <input type="checkbox" ${
          task.checked ? 'checked="checked"' : ''
        } class="custom-checkbox" id="check${index}" name="check" value="yes" onchange="setIsChecked(${
        task.id
      }, event.target.checked)">
        <label for="check${index}">${value}</label>
        <div class="remove__button" onclick="delTask(${task.id})"></div>
        `
      tasks.appendChild(newItem)
    })
  }
  renderProgress()
}

function renderSection() {
  if (tasksState.length) {
    const isAllTasksCompleted = tasksState.every((task) => task.checked)
    if (isAllTasksCompleted) {
      start.style.display = 'none'
      tasks.style.display = 'none'
      circle.style.display = 'none'
      end.style.display = 'block'
    } else {
      start.style.display = 'none'
      tasks.style.display = 'block'
      circle.style.display = 'block'
      end.style.display = 'none'
      renderTasks()
    }
  } else {
    start.style.display = 'block'
    tasks.style.display = 'none'
    circle.style.display = 'none'
    end.style.display = 'none'
  }
}

function renderProgress() {
  let percent
  if (tasksState.length) {
    const completedTasksCount = tasksState.filter((task) => task.checked).length
    percent = Math.round((completedTasksCount / tasksState.length) * 100)
  } else {
    percent = 0
  }
  saveState(state)
  setGaugePercent($gauge, percent)
}

renderSection()
