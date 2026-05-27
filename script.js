

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
let lastDeleted = null;
let undoTimeout = null;

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

function showMessage(text, type='success', actionLabel, actionCallback, duration=4500){
	messageEl.innerHTML = '';
	const el = document.createElement('div');
	el.className = 'toast ' + (type==='success'? 'toast-success':'toast-error');
	const wrapper = document.createElement('div'); wrapper.className = 'toast-wrapper';
	const txt = document.createElement('div'); txt.className = 'toast-text'; txt.textContent = text;
	wrapper.appendChild(txt);

	if(actionLabel && typeof actionCallback === 'function'){
		const act = document.createElement('button');
		act.className = 'btn btn-undo';
		act.textContent = actionLabel;
		act.setAttribute('aria-label','Undo delete');
		act.title = actionLabel;
		act.addEventListener('click', ()=>{
			actionCallback();
			if(messageEl.contains(el)) messageEl.removeChild(el);
			clearTimeout(undoTimeout);
			lastDeleted = null;
		});
		wrapper.appendChild(act);
	}

	el.appendChild(wrapper);
	messageEl.appendChild(el);

	// auto-dismiss
	const t = setTimeout(()=>{ if(messageEl.contains(el)) messageEl.removeChild(el); if(actionLabel) lastDeleted = null; }, duration);
	// keep ref so we can cancel in undo
	undoTimeout = t;
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

	if(filtered.length === 0){
		if(list.length === 0){
			recipesContainer.innerHTML = '<div class="card" style="text-align:center;padding:26px"><p class="meta">No recipes yet.</p><p class="meta" style="margin-top:6px;color:var(--muted-2)">Add your first recipe using the form.</p></div>';
		}else{
			recipesContainer.innerHTML = '<div class="card" style="text-align:center;padding:22px"><p class="meta">No recipes match your search.</p><p class="meta" style="margin-top:6px;color:var(--muted-2)">Try a different name or ingredient.</p></div>';
		}
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
		const editBtn = document.createElement('button'); editBtn.className='btn btn-edit'; editBtn.textContent='Edit';
		editBtn.setAttribute('aria-label', `Edit ${recipe.name}`);
		editBtn.title = `Edit ${recipe.name}`;
		editBtn.addEventListener('click', ()=> startEditRecipe(recipe.id));
		const delBtn = document.createElement('button'); delBtn.className='btn btn-delete'; delBtn.textContent='Delete';
		delBtn.setAttribute('aria-label', `Delete ${recipe.name}`);
		delBtn.title = `Delete ${recipe.name}`;
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
	// remove immediately; provide Undo in toast
	const list = getRecipes();
	const del = list.find(r=>r.id===id);
	const remaining = list.filter(r=>r.id!==id);
	saveRecipes(remaining);
	lastDeleted = del;
	renderRecipes(searchInput.value);
	showMessage('Recipe deleted', 'success', 'Undo', undoDelete, 6000);
}

function undoDelete(){
	if(!lastDeleted) return;
	const list = getRecipes();
	list.unshift(lastDeleted);
	saveRecipes(list);
	renderRecipes(searchInput.value);
	showMessage('Deletion undone');
	lastDeleted = null;
	clearTimeout(undoTimeout);
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

