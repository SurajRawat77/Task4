// Simple To‑Do with localStorage
const listEl = document.getElementById('list')
const addForm = document.getElementById('addForm')
const newTask = document.getElementById('newTask')
const search = document.getElementById('search')
const filter = document.getElementById('filter')
const clearDone = document.getElementById('clearDone')

const STORAGE_KEY = 'todo.items.v1'

function load(){
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [] } catch { return [] }
}
function save(items){ localStorage.setItem(STORAGE_KEY, JSON.stringify(items)) }

let items = load()

function render(){
  let q = (search.value || '').toLowerCase()
  let f = filter.value
  const filtered = items.filter(t => {
    const matches = t.title.toLowerCase().includes(q)
    if(f === 'active') return matches && !t.done
    if(f === 'done') return matches && t.done
    return matches
  })
  listEl.innerHTML = filtered.map(t => `
    <li class="item ${t.done ? 'done' : ''}">
      <input type="checkbox" data-id="${t.id}" ${t.done ? 'checked' : ''} />
      <input class="item-title" data-id="${t.id}" value="${t.title.replace(/"/g,'&quot;')}" />
      <div class="actions">
        <button data-action="delete" data-id="${t.id}">Delete</button>
      </div>
    </li>
  `).join('')
}

function addTask(title){
  items.push({ id: Date.now().toString(36), title, done:false })
  save(items); render()
}

addForm.addEventListener('submit', e => {
  e.preventDefault()
  const title = newTask.value.trim()
  if(!title) return
  addTask(title)
  newTask.value = ''
})

listEl.addEventListener('change', e => {
  if(e.target.type === 'checkbox'){
    const id = e.target.dataset.id
    const item = items.find(t => t.id === id)
    if(item){ item.done = e.target.checked; save(items); render() }
  }
})

listEl.addEventListener('input', e => {
  if(e.target.classList.contains('item-title')){
    const id = e.target.dataset.id
    const item = items.find(t => t.id === id)
    if(item){ item.title = e.target.value; save(items) }
  }
})

listEl.addEventListener('click', e => {
  if(e.target.dataset.action === 'delete'){
    const id = e.target.dataset.id
    items = items.filter(t => t.id !== id)
    save(items); render()
  }
})

search.addEventListener('input', render)
filter.addEventListener('change', render)
clearDone.addEventListener('click', () => {
  items = items.filter(t => !t.done)
  save(items); render()
})

render()
