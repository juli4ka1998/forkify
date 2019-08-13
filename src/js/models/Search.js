import axios from 'axios';

export default class Search {
	constructor(query) {
		this.query = query;
	}
	async getResults() {
		const proxy = 'https://cors-anywhere.herokuapp.com/';
		const key = '137ba01c55392775b560e8a0507c0fa3';
		try {
			const res = await axios(`${proxy}https://www.food2fork.com/api/search?key=${key}&q=${this.query}`);
			this.result = res.data.recipes;
			//console.log(this.result);
		} catch (e) {
			alert(e);
		}
	}

}