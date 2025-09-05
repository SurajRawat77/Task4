// Product listing demo with filter & sort
const DATA = [];

// load static data (could be replaced by fetch)
async function load() {
  try {
    // Try json-server first
    const res = await fetch("http://localhost:5000/products");
    if (!res.ok) throw new Error("json-server not available");
    const arr = await res.json();
    DATA.push(...arr);
  } catch (e) {
    console.warn("json-server not found, falling back to static products.json");
    const res = await fetch("products.json");
    const arr = await res.json();
    // If wrapped { products: [...] }, adjust accordingly
    DATA.push(...(arr.products || arr));
  }
  initUI();
  render();
}


const search = document.getElementById('search')
const category = document.getElementById('category')
const price = document.getElementById('price')
const priceVal = document.getElementById('priceVal')
const sort = document.getElementById('sort')
const grid = document.getElementById('grid')

function initUI(){
  // categories
  const cats = Array.from(new Set(DATA.map(p => p.category)))
  for(const c of cats){
    const opt = document.createElement('option')
    opt.value = c
    opt.textContent = c
    category.appendChild(opt)
  }
  price.max = Math.ceil(Math.max(...DATA.map(p => p.price)))
  price.value = price.max
  priceVal.textContent = price.value

  search.addEventListener('input', render)
  category.addEventListener('change', render)
  price.addEventListener('input', () => { priceVal.textContent = price.value; render() })
  sort.addEventListener('change', render)
}

function applyFilters(){
  let q = (search.value || '').toLowerCase()
  let cat = category.value
  let maxPrice = parseFloat(price.value)
  let out = DATA.filter(p => 
    (cat === 'all' || p.category === cat) &&
    p.price <= maxPrice &&
    (p.title.toLowerCase().includes(q))
  )
  const s = sort.value
  out.sort((a,b) => {
    if(s === 'ratingDesc') return b.rating - a.rating
    if(s === 'priceAsc') return a.price - b.price
    if(s === 'priceDesc') return b.price - a.price
    if(s === 'titleAsc') return a.title.localeCompare(b.title)
    return 0
  })
  return out
}

function render(){
  const list = applyFilters()
  grid.innerHTML = list.map(p => `
    <div class="card">
      <div class="meta">
        <span>⭐ ${p.rating.toFixed(1)}</span>
        <span>$${p.price.toFixed(2)}</span>
      </div>
      <h3>${p.title}</h3>
      <span class="badge">${p.category}</span>
    </div>
  `).join('')
}

load()
