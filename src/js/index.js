//
//https://www.food2fork.com/api/search

import axios from 'axios';

async function getResults(query) {
	const proxy = 'https://cors-anywhere.herokuapp.com/';
	const key = '137ba01c55392775b560e8a0507c0fa3';
	try {
		const res = await axios(`${proxy}https://www.food2fork.com/api/search?key=${key}&q=${query}`);
		const recipes = res.data.recipes;
		console.log(recipes);
	} catch (e) {
		alert(e);
	}
}
getResults('pizza');