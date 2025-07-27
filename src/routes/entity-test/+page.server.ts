import { env } from '$env/dynamic/private';
import type { PageServerLoad } from './$types';

interface Tag {
	name: string;
	tag_id: string;
	type: string;
	value: string;
}

interface ExternalIds {
	[key: string]:
		| {
				id?: string;
				user_rating?: number;
				user_rating_count?: number;
				critic_rating?: number | string;
				critic_rating_count?: string;
				user_ratings_count?: number;
		  }
		| undefined;
}

interface Image {
	url: string;
}

interface Location {
	lat: number;
	lon: number;
}

interface Properties {
	child?: string;
	citizenship?: string;
	date_of_birth?: string;
	external?: ExternalIds;
	gender?: string;
	image?: Image;
	instrument?: string;
	links?: object;
	official_site?: string;
	place_of_birth?: string;
	short_description?: string;
	spouse?: string;
	start_work_period?: string;
	unmarried_partner?: string;
	akas?: { language: string; value: string }[];
	content_rating?: string;
	description?: string;
	filming_location?: string;
	is_special?: boolean;
	production_company?: string;
	release_country?: string;
	release_date?: string;
	release_year?: number;
	website?: string;
	duration?: { album?: number };
	track_count?: number;
	format?: string;
	isbn13?: string;
	isbn10?: string;
	page_count?: number;
	publication_date?: string;
	publication_year?: number;
	address?: string;
	business_rating?: number;
	geocode?: object;
	hours?: object;
	is_closed?: boolean;
	neighborhood?: string;
	phone?: string;
}

interface QlooEntity {
	name: string;
	entity_id: string;
	types: string[];
	properties: Properties;
	popularity?: number;
	tags: Tag[];
	disambiguation?: string;
	location?: Location;
}

export const load: PageServerLoad = async ({ url }) => {
	// const entityId = url.searchParams.get('entity_id');
	const entityId = 'F6754C46-B3E7-457F-8B7E-06C613597320';

	if (!entityId) {
		return {
			status: 400,
			error: new Error('Missing entity_id parameter.')
		};
	}

	const qlooApiKey = env.QLOO_API_KEY;
	const qlooApiUrl = env.QLOO_API_URL;

	if (!qlooApiKey || !qlooApiUrl) {
		console.error('Qloo API key or URL is not set in environment variables.');
		return {
			status: 500,
			error: new Error('Server configuration error.')
		};
	}

	const options = {
		method: 'GET',
		headers: { accept: 'application/json', 'X-Api-Key': `${qlooApiKey}` }
	};

	try {
		const response = await fetch(
			`${qlooApiUrl}entities?entity_ids=${entityId}&external.facebook.ids=&external.goodreads.ids=&external.goodreads_author.ids=&external.igdb.ids=&external.imdb.ids=&external.instagram.ids=&external.isbn10.ids=&external.isbn13.ids=&external.itunes.ids=&external.lastfm.ids=&external.library_of_congress.ids=&external.metacritic.ids=&external.michelin.ids=&external.musicbrainz.ids=&external.rottentomatoes.ids=&external.soundcloud.ids=&external.spotify.ids=&external.tablet.ids=&external.twitch.ids=&external.twitter.ids=&external.wikidata.ids=&external.resy.ids=`,
			options
		);

		if (response.status === 200) {
			const result: { entities: QlooEntity[] } = await response.json();
			console.log(result);
			if (result.entities && result.entities.length > 0) {
				return {
					entity: result.entities[0]
				};
			} else {
				return {
					status: 404,
					error: new Error('Entity not found.')
				};
			}
		} else {
			return {
				status: response.status,
				error: new Error(`Error fetching entity: ${response.statusText}`)
			};
		}
	} catch (error) {
		console.error('Exception fetching entity:', error);
		return {
			status: 500,
			error: new Error('Failed to fetch entity.')
		};
	}
};
