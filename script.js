

// Recipe Manager - vanilla JS + localStorage
const form = document.getElementById('recipeForm');
const nameInput = document.getElementById('name');
const ingredientsInput = document.getElementById('ingredients');
const stepsInput = document.getElementById('steps');
const recipesContainer = document.getElementById('recipesContainer');
const messageEl = document.getElementById('message');
const searchInput = document.getElementById('searchInput');
const submitBtn = document.getElementById('submitBtn');
const cancelBtn = document.getElementById('cancelBtn');

let editingId = null;

function getRecipes(){
	try{
		return JSON.parse(localStorage.getItem('recipes')||'[]');
	}catch(e){
		console.error(e);
		return [];
	}
}

function saveRecipes(list){
	localStorage.setItem('recipes', JSON.stringify(list));
}

function normalizeIngredients(text){
	// split by newline or comma, trim and filter empties
	return text.split(/\r?\n|,/).map(s=>s.trim()).filter(Boolean);
}

function showMessage(text, type='success'){
	messageEl.innerHTML = '';
	const el = document.createElement('div');
	el.className = 'toast ' + (type==='success'? 'toast-success':'toast-error');
	el.textContent = text;
	messageEl.appendChild(el);
	setTimeout(()=>{ if(messageEl.contains(el)) messageEl.removeChild(el); }, 3000);
}

function renderRecipes(filter=''){
	const list = getRecipes();
	const q = filter.trim().toLowerCase();
	recipesContainer.innerHTML = '';
	const filtered = list.filter(r=>{
		if(!q) return true;
		if(r.name.toLowerCase().includes(q)) return true;
		if(r.ingredients.join(' ').toLowerCase().includes(q)) return true;
		return false;
	});

	if(filtered.length===0){
		recipesContainer.innerHTML = '<p class="meta">No recipes found.</p>';
		return;
	}

	filtered.forEach(recipe=>{
		const card = document.createElement('article');
		card.className = 'card';
		const h = document.createElement('h3'); h.textContent = recipe.name;
		const meta = document.createElement('div'); meta.className='meta'; meta.textContent = 'Ingredients:';
		const ingWrap = document.createElement('div'); ingWrap.className='ingredients';
		recipe.ingredients.forEach(i=>{
			const b = document.createElement('span'); b.className='ingredient-badge'; b.textContent = i; ingWrap.appendChild(b);
		});
		const steps = document.createElement('div'); steps.className='steps'; steps.textContent = recipe.steps;

		const actions = document.createElement('div'); actions.className='card-actions';
		const editBtn = document.createElement('button'); editBtn.className='edit-btn'; editBtn.textContent='Edit';
		editBtn.addEventListener('click', ()=> startEditRecipe(recipe.id));
		const delBtn = document.createElement('button'); delBtn.className='delete-btn'; delBtn.textContent='Delete';
		delBtn.addEventListener('click', ()=> deleteRecipe(recipe.id));

		actions.appendChild(editBtn); actions.appendChild(delBtn);

		card.appendChild(h);
		card.appendChild(meta);
		card.appendChild(ingWrap);
		card.appendChild(steps);
		card.appendChild(actions);
		recipesContainer.appendChild(card);
	});
}

function startEditRecipe(id){
	const list = getRecipes();
	const r = list.find(x=>x.id===id);
	if(!r) return showMessage('Recipe not found', 'error');
	editingId = id;
	nameInput.value = r.name;
	ingredientsInput.value = r.ingredients.join('\n');
	stepsInput.value = r.steps;
	submitBtn.textContent = 'Update Recipe';
	cancelBtn.hidden = false;
	window.scrollTo({top:0,behavior:'smooth'});
}

function deleteRecipe(id){
	if(!confirm('Delete this recipe?')) return;
	const list = getRecipes().filter(r=>r.id!==id);
	saveRecipes(list);
	renderRecipes(searchInput.value);
	showMessage('Recipe deleted');
}

form.addEventListener('submit', function(e){
	e.preventDefault();
	const name = nameInput.value.trim();
	const ingredients = normalizeIngredients(ingredientsInput.value);
	const steps = stepsInput.value.trim();
	if(!name || ingredients.length===0 || !steps){
		return showMessage('Please fill out all fields', 'error');
	}

	const list = getRecipes();
	if(editingId){
		const idx = list.findIndex(r=>r.id===editingId);
		if(idx!==-1){
			list[idx].name = name;
			list[idx].ingredients = ingredients;
			list[idx].steps = steps;
			saveRecipes(list);
			showMessage('Recipe updated');
		}else{
			showMessage('Could not find recipe to update','error');
		}
	}else{
		const newRecipe = { id: Date.now().toString(), name, ingredients, steps };
		list.unshift(newRecipe);
		saveRecipes(list);
		showMessage('Recipe added');
	}

	form.reset();
	editingId = null;
	submitBtn.textContent = 'Add Recipe';
	cancelBtn.hidden = true;
	renderRecipes(searchInput.value);
});

cancelBtn.addEventListener('click', ()=>{
	editingId = null;
	form.reset();
	submitBtn.textContent = 'Add Recipe';
	cancelBtn.hidden = true;
});

searchInput.addEventListener('input', ()=>{
	renderRecipes(searchInput.value);
});

// initial render
renderRecipes();

