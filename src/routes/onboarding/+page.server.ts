import type { Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

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

export const actions: Actions = {
	search: async ({ request }: { request: Request }) => {
		console.log('Action: default - initiated');
		const data = await request.formData();
		const musicArtist = data.get('musicArtist')?.toString();
		const bookTitle = data.get('bookTitle')?.toString();
		const filmTitle = data.get('filmTitle')?.toString();

		console.log('Form data:', { musicArtist, bookTitle, filmTitle });

		const qlooApiKey = env.QLOO_API_KEY;
		const qlooApiUrl = env.QLOO_API_URL;

		if (!qlooApiKey || !qlooApiUrl) {
			console.error('Qloo API key or URL is not set in environment variables.');
			return fail(500, { message: 'Server configuration error.' });
		}
		console.log('Qloo API environment variables loaded.');

		const preferences = { musicArtist, bookTitle, filmTitle };
		const qlooEntityIds: Record<string, QlooEntity[] | null> = {};
		const options = {
			method: 'GET',
			headers: { accept: 'application/json', 'X-Api-Key': `${qlooApiKey}` }
		};

		for (const [key, value] of Object.entries(preferences)) {
			if (value) {
				console.log(`Searching Qloo for ${key}: "${value}"`);
				try {
					const response = await fetch(
						`${qlooApiUrl}search?query=${encodeURIComponent(value)}`,
						options
					);
					console.log(`Qloo API response status for ${key}: ${response.status}`);

					if (response.status === 200) {
						const result = await response.json();
						console.log(`Qloo API response data for ${key}:`, result);
						// Assuming Qloo API returns a list of entities and we take the first one
						if (result.results && result.results.length > 0) {
							qlooEntityIds[key] = result.results;
							console.log(`Found Qloo Entities for ${key}:`, qlooEntityIds[key]);
						} else {
							qlooEntityIds[key] = null; // No entity found for this preference
							console.log(`No Qloo entity found for ${key}: "${value}"`);
						}
					} else {
						console.error(
							`Error searching Qloo for ${key}: ${response.status} ${response.statusText}`
						);
						qlooEntityIds[key] = null;
					}
				} catch (error) {
					console.error(`Exception searching Qloo for ${key}:`, error);
					qlooEntityIds[key] = null;
				}
			} else {
				qlooEntityIds[key] = null;
				console.log(`Skipping empty preference for ${key}`);
			}
		}

		console.log('Final Processed Qloo Entity IDs:', qlooEntityIds);

		// For now, we'll just redirect to the home page after processing
		// In a real scenario, these IDs would be saved to a database for the user.
		return { success: true, qlooEntityIds };
	},
	submit: async ({ request, cookies }) => {
		console.log('Action: submit - initiated');
		const data = await request.formData();
		const selectedMusicArtist = data.get('selectedMusicArtist')?.toString();
		const selectedBookTitle = data.get('selectedBookTitle')?.toString();
		const selectedFilmTitle = data.get('selectedFilmTitle')?.toString();

		console.log('Selected Preferences:', {
			selectedMusicArtist,
			selectedBookTitle,
			selectedFilmTitle
		});

		if (selectedMusicArtist) {
			cookies.set('artist', selectedMusicArtist, { path: '/' });
		}
		if (selectedBookTitle) {
			cookies.set('book', selectedBookTitle, { path: '/' });
		}
		if (selectedFilmTitle) {
			cookies.set('film', selectedFilmTitle, { path: '/' });
		}
	}
};
