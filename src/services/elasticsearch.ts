import * as elasticsearch from "elasticsearch";

const client = new elasticsearch.Client({
	hosts: [
		process.env.ES_HOST_1 + ":9200",
		process.env.ES_HOST_2 + ":9200"
	],
	log: "warning",
	apiVersion: "6.2"
});

export async function checkMovieIndex () {
	const exists = await client.indices.exists({index: "movie"});
	if (!exists) {
		await client.indices.create({index: "movie"});
	}
}

export async function searchMovies (search: string) : Promise<Movie[]> {
	const results = await client.search({
		index: "movie",
		type: "movie",
		body: {
			query: {
				match_phrase: {
					title: search
				}
			}
		}
	});

	let movies: Movie[] = [];
	for (let hit of results.hits.hits) {
		movies.push({
			imdbId: hit._id,
			title: hit._source.title,
			year: hit._source.year,
			runtime: hit._source.runtime,
			poster: hit._source.poster
		});
	}

	return movies;
}

export async function getMovie (id: string) {
	return await client.get({
		index: "movie",
		type: "movie",
		id: id
	});
}

export async function exists (id: string) {
	 return await client.exists({
		index: 'movie',
		type: 'movie',
		id: id
	});
}

export async function insertMovie (movie: Movie) {
	await client.create({
		index: "movie",
		type: "movie",
		id: movie.imdbId,
		body: {
			title: movie.title,
			year: movie.year,
			runtime: movie.runtime,
			poster: movie.poster
        }
	});
}