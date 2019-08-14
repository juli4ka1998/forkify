import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import * as searchView from './views/searchView'
import * as recipeView from './views/recipeView'
import {elements, renderLoader, clearLoader} from "./views/base";

/** Global state of the app
 * - Search object
 * - Current recipe object
 * - Shopping list object
 * - Linked recipes
 */
const state = {};

/**
 * SEARCH CONTROLLER
 */
const controlSearch = async () => {
	// 1) Get query from view
	const query =searchView.getInput();

	if(query) {
		// 2) New search object and add to state
		state.search = new Search(query);

		// 3) Prepare UI for results
		searchView.clearInput();
		searchView.clearResults();
		renderLoader(elements.searchRes);
		try {
			// 4) Search for recipes
			await state.search.getResults();

			// 5) Render results on UI
			clearLoader();
			searchView.renderResults(state.search.result);
		} catch(e) {
			alert('Something wrong with the search...');
			clearLoader();
		}
	}
};

elements.searchForm.addEventListener('submit', e => {
	e.preventDefault();
	controlSearch();
});

elements.searchResPages.addEventListener('click', e => {
	const btn = e.target.closest('.btn-inline');
	if (btn) {
		const goToPage = parseInt(btn.dataset.goto, 10);
		searchView.clearResults();
		searchView.renderResults(state.search.result, goToPage);
	}
});


/**
 * RECIPE CONTROLLER
 */
const controlRecipe = async () => {
	// 1) Get ID from url
	const id = window.location.hash.replace('#', '');
	console.log(id);

	if (id) {
		// 2) Prepare UI for changes
		recipeView.clearRecipe();
		renderLoader(elements.recipe);

		// 3) Highlight selected search item
		if (state.search) searchView.highlightSelected(id);

		// 4) Create new recipe object
		state.recipe = new Recipe(id);

		try {
			// 5) Get recipe data and parse ingredients
			await state.recipe.getRecipe();
			console.log(state.recipe.ingredients);
			state.recipe.parseIngredients();

			// 6) Calculate servings and time
			state.recipe.calcTime();
			state.recipe.calcServings();

			// 7) Render recipe
			clearLoader();
			recipeView.renderRecipe(state.recipe);
		} catch (e) {
			alert('Error processing recipe!');
		}
	}
};

['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));

// Handling recipe button clicks
elements.recipe.addEventListener('click', e => {
	if (e.target.matches('.btn-decrease, .btn-decrease *')) {
		// Decrease button is clicked
		if (state.recipe.servings > 1) {
			state.recipe.updateServings('dec');
			recipeView.updateServingsIngredients(state.recipe);
		}
	} else if (e.target.matches('.btn-increase, .btn-increase *')) {
		// Increase button is clicked
			state.recipe.updateServings('inc');
			recipeView.updateServingsIngredients(state.recipe);
	}
});