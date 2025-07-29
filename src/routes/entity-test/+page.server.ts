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
	references: Tag[];
	disambiguation?: string;
	location?: Location;
}

export const load: PageServerLoad = async ({ url }) => {
	// const entityId = url.searchParams.get('entity_id');
	const entityId = '57FBCDD8-6840-468C-BECC-D0F92375BDD7';

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
		const response = await fetch(`${qlooApiUrl}entities?entity_ids=${entityId}`, options);

		if (response.status === 200) {
			const result: { results: QlooEntity[] } = await response.json();
			console.log(result);
			return {
				entity: result.results[0]
			};
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
