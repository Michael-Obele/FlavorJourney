import type { Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

export interface Tag {
	name: string;
	tag_id: string;
	type: string;
	value: string;
}

interface InsightsResponse {
	success: boolean;
	results: {
		entities: QlooEntity[];
	};
}

interface Keyword {
	name: string;
	count: number;
}

interface SpecialtyDish {
	id: string;
	name: string;
	type: string;
	weight: number;
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
	keywords?: Keyword[]; // Add keywords to Properties
	specialty_dishes?: SpecialtyDish[]; // Add specialty_dishes to Properties
}

export interface QlooEntity {
	name: string;
	entity_id: string;
	types: string[];
	properties: Properties;
	popularity?: number;
	tags: Tag[];
	disambiguation?: string;
	location?: Location;
	type?: string;
	subtype?: string;
}

export const actions: Actions = {
	search: async ({ request }) => {
		console.log('Action: search - initiated');
		const data = await request.formData();
		const cuisines = data.get('cuisines')?.toString();
		const placeTypes = data.get('placeTypes')?.toString();
		const priceRange = data.get('priceRange')?.toString();
		const favoritePlaces = data.get('favoritePlaces')?.toString();

		console.log('Form data:', { cuisines, placeTypes, priceRange, favoritePlaces });

		const qlooApiKey = env.QLOO_API_KEY;
		const qlooApiUrl = env.QLOO_API_URL;

		if (!qlooApiKey || !qlooApiUrl) {
			console.error('Qloo API key or URL is not set in environment variables.');
			return fail(500, {
				success: false,
				qlooEntityIds: {},
				qlooTagIds: {},
				priceRange: undefined,
				message: 'Server configuration error.'
			});
		}
		console.log('Qloo API environment variables loaded.');

		const qlooEntityIds: Record<string, QlooEntity[] | null> = {};
		const qlooTagIds: Record<string, Tag[] | null> = {};
		const options = {
			method: 'GET',
			headers: { accept: 'application/json', 'X-Api-Key': `${qlooApiKey}` }
		};

		// Fetch tag IDs for cuisines
		if (cuisines) {
			const cuisineArray = cuisines.split(',').map((s) => s.trim());
			for (const cuisine of cuisineArray) {
				console.log(`Searching Qloo for cuisine tag: "${cuisine}"`);
				try {
					const response = await fetch(
						`${qlooApiUrl}v2/tags?q=${encodeURIComponent(cuisine)}`,
						options
					);
					if (response.status === 200) {
						const result = await response.json();
						if (result.results && result.results.length > 0) {
							qlooTagIds[cuisine] = result.results;
						} else {
							qlooTagIds[cuisine] = null;
						}
					} else {
						console.error(
							`Error searching Qloo for cuisine ${cuisine}: ${response.status} ${response.statusText}`
						);
						qlooTagIds[cuisine] = null;
					}
				} catch (error) {
					console.error(`Exception searching Qloo for cuisine ${cuisine}:`, error);
					qlooTagIds[cuisine] = null;
				}
			}
		}

		// Fetch tag IDs for place types
		if (placeTypes) {
			const placeTypeArray = placeTypes.split(',').map((s) => s.trim());
			for (const type of placeTypeArray) {
				console.log(`Searching Qloo for place type tag: "${type}"`);
				try {
					const response = await fetch(
						`${qlooApiUrl}v2/tags?q=${encodeURIComponent(type)}`,
						options
					);
					if (response.status === 200) {
						const result = await response.json();
						if (result.results && result.results.length > 0) {
							qlooTagIds[type] = result.results;
						} else {
							qlooTagIds[type] = null;
						}
					} else {
						console.error(
							`Error searching Qloo for place type ${type}: ${response.status} ${response.statusText}`
						);
						qlooTagIds[type] = null;
					}
				} catch (error) {
					console.error(`Exception searching Qloo for place type ${type}:`, error);
					qlooTagIds[type] = null;
				}
			}
		}

		// Fetch entity IDs for favorite places
		if (favoritePlaces) {
			const favoritePlaceArray = favoritePlaces.split(',').map((s) => s.trim());
			for (const place of favoritePlaceArray) {
				console.log(`Searching Qloo for favorite place: "${place}"`);
				try {
					const response = await fetch(
						`${qlooApiUrl}search?q=${encodeURIComponent(place)}&types=place`,
						options
					);
					if (response.status === 200) {
						const result = await response.json();
						if (result.results && result.results.length > 0) {
							qlooEntityIds[place] = result.results;
						} else {
							qlooEntityIds[place] = null;
						}
					} else {
						console.error(
							`Error searching Qloo for favorite place ${place}: ${response.status} ${response.statusText}`
						);
						qlooEntityIds[place] = null;
					}
				} catch (error) {
					console.error(`Exception searching Qloo for favorite place ${place}:`, error);
					qlooEntityIds[place] = null;
				}
			}
		}

		console.log('Final Processed Qloo Entity IDs:', qlooEntityIds);
		console.log('Final Processed Qloo Tag IDs:', qlooTagIds);

		return { success: true, qlooEntityIds, qlooTagIds, priceRange, message: undefined }; // Ensure message is always present
	},
	submit: async ({ request, cookies }) => {
		console.log('Action: submit - initiated');
		const data = await request.formData();
		const selectedPlace = data.get('selectedPlace')?.toString();
		const allQlooTagIds = JSON.parse(data.get('allQlooTagIds')?.toString() || '{}');
		const priceRange = data.get('priceRange')?.toString();
		const cuisines = data.get('cuisines')?.toString(); // Retrieve cuisines from form data

		console.log('Selected Place:', selectedPlace);
		console.log('All Qloo Tag IDs:', allQlooTagIds);
		console.log('Price Range:', priceRange);
		console.log('Cuisines:', cuisines);

		const qlooApiKey = env.QLOO_API_KEY;
		const qlooApiUrl = env.QLOO_API_URL;

		if (!qlooApiKey || !qlooApiUrl) {
			console.error('Qloo API key or URL is not set in environment variables.');
			return fail(500, { message: 'Server configuration error.' });
		}

		const options = {
			method: 'GET',
			headers: { accept: 'application/json', 'X-Api-Key': `${qlooApiKey}` }
		};

		let insightsUrl = `${qlooApiUrl}v2/insights?filter.type=urn:entity:place`;

		// Add selected place as a signal if available
		if (selectedPlace) {
			insightsUrl += `&signal.interests.entities=${selectedPlace}`;
		}

		// Add all gathered tag IDs as signals
		const tagIds = Object.values(allQlooTagIds)
			.flat()
			.map((tag: any) => tag.tag_id)
			.join(',');
		if (tagIds) {
			insightsUrl += `&signal.interests.tags=${tagIds}`;
		}

		// Add price range filter
		if (priceRange) {
			insightsUrl += `&filter.price_level.min=${priceRange}&filter.price_level.max=${priceRange}`;
		}

		// Add a dummy location filter for now
		insightsUrl += `&filter.location=40.7128,-74.0060`; // New York City coordinates

		console.log('Insights URL:', insightsUrl);

		try {
			const response = await fetch(insightsUrl, options);
			if (response.status === 200) {
				const insights: InsightsResponse = await response.json();
				console.log('Qloo Insights:', insights);

				for (const entity of insights.results.entities) {
					const prompt = `You are a food recommendation assistant. Based on the following information about a restaurant, please suggest 3 to 5 specific and popular dishes that a user should try.

Restaurant Name: ${entity.name}
Cuisine: ${cuisines || 'N/A'}
Description: ${entity.properties?.description || 'No description available.'}
Keywords: ${entity.properties?.keywords?.map((k) => k.name).join(', ') || 'No keywords available.'}
Specialty Dishes: ${entity.properties?.specialty_dishes?.map((d) => d.name).join(', ') || 'No specialty dishes available.'}

What are the must-try dishes at this restaurant?`;

					const deepseekApiKey = env.DEEPSEEK_API_KEY;
					if (!deepseekApiKey) {
						console.error('DeepSeek API key is not set in environment variables.');
						// Continue processing other entities or handle this error appropriately
						continue;
					}

					try {
						const deepseekResponse = await fetch('https://api.deepseek.com/chat/completions', {
							method: 'POST',
							headers: {
								'Content-Type': 'application/json',
								Authorization: `Bearer ${deepseekApiKey}`
							},
							body: JSON.stringify({
								model: 'deepseek-chat',
								messages: [
									{ role: 'system', content: 'You are a helpful assistant.' },
									{ role: 'user', content: prompt }
								],
								stream: false
							})
						});

						if (deepseekResponse.status === 200) {
							const deepseekResult = await deepseekResponse.json();
							const foodSuggestions = deepseekResult.choices[0]?.message?.content;
							console.log(`Food suggestions for ${entity.name}:`, foodSuggestions);
							// TODO: Store food suggestions with the entity or process further
						} else {
							console.error(
								`Error fetching DeepSeek suggestions for ${entity.name}: ${deepseekResponse.status} ${deepseekResponse.statusText}`
							);
						}
					} catch (llmError) {
						console.error(`Exception fetching DeepSeek suggestions for ${entity.name}:`, llmError);
					}
				}
				return { insights }; // Return insights after processing
			} else {
				console.error(`Error fetching Qloo insights: ${response.status} ${response.statusText}`);
				return fail(500, { message: 'Failed to fetch Qloo insights.' });
			}
		} catch (error) {
			console.error('Exception fetching Qloo insights:', error);
			return fail(500, { message: 'Failed to fetch Qloo insights.' });
		}
	}
};
