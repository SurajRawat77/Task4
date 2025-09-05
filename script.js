// Dark mode toggle + responsive nav + dynamic content
const root = document.documentElement
const themeToggle = document.getElementById('themeToggle')
const navToggle = document.querySelector('.nav-toggle')
const nav = document.querySelector('.site-nav')
const year = document.getElementById('year')
if (year) year.textContent = new Date().getFullYear()

// theme
const savedTheme = localStorage.getItem('theme') || 'dark'
if (savedTheme === 'light') root.classList.add('light')
themeToggle?.addEventListener('click', () => {
  root.classList.toggle('light')
  localStorage.setItem('theme', root.classList.contains('light') ? 'light' : 'dark')
})

// nav
navToggle?.addEventListener('click', () => {
  const collapsed = nav.getAttribute('data-collapsed') === 'true'
  nav.setAttribute('data-collapsed', String(!collapsed))
  navToggle.setAttribute('aria-expanded', String(collapsed))
})

// Projects page dynamic render
const projects = [
  // { title: 'Dashboard UI', tag: 'ui', desc: 'Cards and charts layout.', img: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1000&q=80&auto=format&fit=crop',link:"#" },
  { title: 'To‑Do App', tag: 'js', desc: 'LocalStorage, filters, search.', img: 'https://images.unsplash.com/photo-1518779578993-ec3579fee39f?w=1000&q=80&auto=format&fit=crop',link:"todo.html" },
  { title: 'Product Listing', tag: 'js', desc: 'Filter & sort UI.', img: 'https://images.unsplash.com/photo-1472289065668-ce650ac443d2?w=1000&q=80&auto=format&fit=crop',link:"product.html" },
]

const grid = document.getElementById('projectGrid')
const search = document.getElementById('projSearch')
const filter = document.getElementById('projFilter')

function render(list){
  if(!grid) return
  grid.innerHTML = list.map(p => `
    <article class="card">
      <img src="${p.img}" alt="${p.title}" />
      <div class="card-body">
        <h3>${p.title}</h3>
        <p>${p.desc}</p>
        <span class="badges"><span class="badges" style="display:inline-flex;gap:8px;"><span class="badges"><span class="badges"></span></span></span>
        <a class="link" href="${p.link}">View</a>
      </div>
    </article>
  `).join('')
}

function apply(){
  let q = (search?.value || '').toLowerCase()
  let t = filter?.value || 'all'
  let out = projects.filter(p => 
    (t === 'all' || p.tag === t) &&
    (p.title.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q))
  )
  render(out)
}

if(grid){
  render(projects); 
  search?.addEventListener('input', apply)
  filter?.addEventListener('change', apply)
}
