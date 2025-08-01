import type { Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { URLSearchParams } from 'url';
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
	image?: Image | null;
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
	description?: string | null;
	filming_location?: string;
	is_special?: boolean;
	production_company?: string;
	release_country?: string;
	release_date?: string;
	release_year?: number;
	website?: string | null;
	duration?: { album?: number };
	track_count?: number;
	format?: string;
	isbn13?: string;
	isbn10?: string;
	page_count?: number;
	publication_date?: string;
	publication_year?: number;
	address?: string | null;
	business_rating?: number | null;
	geocode?: object;
	hours?: object;
	is_closed?: boolean;
	neighborhood?: string;
	phone?: string | null;
	keywords?: Keyword[]; // Add keywords to Properties
	specialty_dishes?: SpecialtyDish[]; // Add specialty_dishes to Properties
	price_level?: number | null; // Add price_level to Properties
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

interface VerboseTag {
	name: string;
	type: string;
	tag_id?: string;
	value?: string;
}

interface VerboseProperties {
	description: string | null;
	keywords: { name: string; count: number }[];
	specialty_dishes: { id: string; name: string; type: string; weight: number }[];
	address: string | null;
	phone: string | null;
	website: string | null;
	image: string | null;
	business_rating: number | null;
	price_level: number | null;
}

interface VerboseEntity {
	name: string;
	entity_id: string;
	popularity: number | null;
	types: string[];
	disambiguation: string | null;
	location: Location | null;
	properties: VerboseProperties;
	tags: VerboseTag[];
}

// Helper function to build Qloo Insights API URL
function buildQlooInsightsUrl(
	qlooApiUrl: string,
	entityId: string,
	locationQuery?: string,
	filterTags?: string[],
	operatorFilterTags?: 'union' | 'intersection',
	filterRadius?: string,
	priceRange?: string
): string {
	let insightsUrl = `${qlooApiUrl}v2/insights/?filter.type=urn:entity:place`;
	insightsUrl += `&signal.interests.entities=${encodeURIComponent(entityId)}`;

	if (locationQuery) {
		insightsUrl += `&filter.location.query=${encodeURIComponent(locationQuery)}`;
	}

	if (filterTags && filterTags.length > 0) {
		insightsUrl += `&filter.tags=${encodeURIComponent(filterTags.join(','))}`;
		if (operatorFilterTags) {
			insightsUrl += `&operator.filter.tags=${encodeURIComponent(operatorFilterTags)}`;
		}
	}

	if (filterRadius) {
		insightsUrl += `&filter.location.radius=${encodeURIComponent(filterRadius)}`;
	}

	if (priceRange) {
		insightsUrl += `&filter.price_level.min=${priceRange}&filter.price_level.max=${priceRange}`;
	}

	return insightsUrl;
}

// Helper function to process Qloo entities into verbose format
function processQlooEntities(entities: QlooEntity[]): VerboseEntity[] {
	return entities.map((e) => ({
		name: e.name,
		entity_id: e.entity_id,
		popularity: e.popularity ?? null,
		types: e.types,
		disambiguation: e.disambiguation ?? null,
		location: e.location ?? null,
		properties: {
			description: e.properties?.description ?? null,
			keywords: e.properties?.keywords?.map((k) => ({ name: k.name, count: k.count })) ?? [],
			specialty_dishes:
				e.properties?.specialty_dishes?.map((d) => ({
					id: d.id,
					name: d.name,
					type: d.type,
					weight: d.weight
				})) ?? [],
			address: e.properties?.address ?? null,
			phone: e.properties?.phone ?? null,
			website: e.properties?.website ?? e.properties?.official_site ?? null,
			image: e.properties?.image?.url ?? null,
			business_rating: e.properties?.business_rating ?? null,
			price_level: e.properties?.price_level ?? null
		},
		tags:
			e.tags?.map((t) => ({
				name: t.name,
				type: t.type,
				tag_id: (t as any).tag_id,
				value: (t as any).value
			})) ?? []
	}));
}

export const actions: Actions = {
	getEntityId: async ({ request, cookies }) => {
		console.log('Action: getEntityId - initiated');
		const data = await request.formData();
		const searchTerm = data.get('searchTerm')?.toString();

		if (!searchTerm) {
			return fail(400, { success: false, message: 'Search term is required.' });
		}

		const qlooApiKey = env.QLOO_API_KEY;
		const qlooApiUrl = env.QLOO_API_URL;

		if (!qlooApiKey || !qlooApiUrl) {
			console.error('Qloo API key or URL is not set in environment variables.');
			return fail(500, { success: false, message: 'Server configuration error.' });
		}

		const options = {
			method: 'GET',
			headers: { accept: 'application/json', 'X-Api-Key': `${qlooApiKey}` }
		};

		const searchParams = new URLSearchParams({
			query: searchTerm
		});

		const searchUrl = `${qlooApiUrl}search?${searchParams.toString()}`;
		console.log('Qloo Search URL:', searchUrl);

		try {
			const response = await fetch(searchUrl, options);
			console.log(`Qloo Search API Response Status: ${response.status} ${response.statusText}`);

			if (response.status === 200) {
				type QlooSearchResponse = { results: QlooEntity[] };
				const searchResult: QlooSearchResponse = await response.json();
				console.log('Full Qloo Search API Response:', searchResult);

				const mostPopularEntity = searchResult.results[0];
				if (!mostPopularEntity) {
					console.warn('Qloo Search API returned no results for query.');
					return fail(404, { success: false, message: 'No matching entities found.' });
				}

				cookies.set('entityId', mostPopularEntity.entity_id, { path: '/' });
				return {
					success: true,
					entityId: mostPopularEntity.entity_id,
					entityName: mostPopularEntity.name
				};
			} else {
				console.error(`Error fetching Qloo search: ${response.status} ${response.statusText}`);
				return fail(500, { success: false, message: 'Failed to fetch Qloo search results.' });
			}
		} catch (error) {
			console.error('Exception fetching Qloo search:', error);
			return fail(500, { success: false, message: 'Failed to fetch Qloo search results.' });
		}
	},
	search: async ({ request, cookies }) => {
		console.log('Action: search - initiated (dynamic)');

		const entityId = cookies.get('entityId');
		if (!entityId) {
			console.warn('Missing entityId cookie. Prompt user to fetch it first via getEntityId.');
			return fail(400, {
				success: false,
				qlooEntityIds: {},
				qlooTagIds: {},
				priceRange: undefined,
				message: 'Missing entityId. Please fetch an Entity ID first.'
			});
		}

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

		let locationQuery: string | undefined;
		let operatorFilterTags: 'union' | 'intersection' | undefined;
		let filterRadius: string | undefined;
		let filterTags: string[] = [];
		let priceRange: string | undefined;

		try {
			const data = await request.formData();
			locationQuery = data.get('locationQuery')?.toString() || undefined;
			priceRange = data.get('priceRange')?.toString() || undefined;

			const rawTags = data.getAll('filterTags[]').map((v) => v.toString());
			filterTags = rawTags.filter((t) => t && t.startsWith('urn:tag:'));

			operatorFilterTags =
				(data.get('operatorFilterTags')?.toString() as 'union' | 'intersection') || 'intersection';

			filterRadius = data.get('filterLocationRadius')?.toString() || undefined;
		} catch (e) {
			console.error('Error parsing form data for search action:', e);
		}

		const options = {
			method: 'GET',
			headers: { accept: 'application/json', 'X-Api-Key': `${qlooApiKey}` }
		};

		const insightsUrl = buildQlooInsightsUrl(
			qlooApiUrl,
			entityId,
			locationQuery,
			filterTags,
			operatorFilterTags,
			filterRadius,
			priceRange
		);
		console.log('Dynamic Insights URL (search action):', insightsUrl);

		try {
			const response = await fetch(insightsUrl, options);
			console.log(
				`Qloo Insights API Response Status (dynamic search action): ${response.status} ${response.statusText}`
			);
			if (response.status === 200) {
				const insights: InsightsResponse = await response.json();
				let verbose: VerboseEntity[] = [];

				if (insights.results?.entities?.length) {
					verbose = processQlooEntities(insights.results.entities);
					console.info('Verbose Places (dynamic search action):', JSON.stringify(verbose, null, 2));
				} else {
					console.log('Verbose Places (dynamic search action): []');
				}

				if (insights.results && insights.results.entities && insights.results.entities.length > 0) {
					const qlooEntityIds: Record<string, QlooEntity[] | null> = {
						recommendedPlaces: insights.results.entities
					};
					const qlooTagIds: Record<string, Tag[] | null> = {};

					// Generate AI suggestions for all entities in a single call
					const deepseekApiKey = env.DEEPSEEK_API_KEY;
					const aiSuggestions: Record<string, string> = {};

					if (deepseekApiKey && verbose.length > 0) {
						const systemPrompt = `You are a helpful assistant that provides concise, well-crafted suggestions or insights for places.
						For each place provided, focus on what makes it unique or interesting, drawing from its description, keywords, and tags.
						Do not suggest specific food dishes.
						Your response MUST be a JSON object where keys are 'entity_id' and values are the string suggestions. Ensure all strings are properly escaped for JSON.`;

						const userPrompt = `Provide a JSON object with suggestions for the following places. Each suggestion should be a concise string.
${verbose
	.map(
		(entity) =>
			`Entity ID: ${entity.entity_id}, Name: ${entity.name}, Description: ${
				entity.properties?.description || 'N/A'
			}, Keywords: ${
				entity.properties?.keywords?.map((k) => k.name).join(', ') || 'N/A'
			}, Tags: ${entity.tags?.map((t) => t.name).join(', ') || 'N/A'}`
	)
	.join('\n')}`;

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
										{ role: 'system', content: systemPrompt },
										{ role: 'user', content: userPrompt }
									],
									response_format: { type: 'json_object' }, // Request JSON output
									stream: false,
									max_tokens: 2000 // Increased max_tokens for larger responses
								})
							});

							if (deepseekResponse.status === 200) {
								const deepseekResult = await deepseekResponse.json();
								try {
									const parsedSuggestions = JSON.parse(
										deepseekResult.choices[0]?.message?.content || '{}'
									);
									Object.assign(aiSuggestions, parsedSuggestions);
									console.log('DeepSeek AI Suggestions (parsed):', aiSuggestions);
								} catch (jsonError) {
									console.error('Error parsing DeepSeek JSON response:', jsonError);
								}
							} else {
								console.error(
									`Error fetching DeepSeek suggestions: ${deepseekResponse.status} ${deepseekResponse.statusText}`
								);
							}
						} catch (llmError) {
							console.error('Exception fetching DeepSeek suggestions:', llmError);
						}
					}

					return {
						success: true,
						qlooEntityIds,
						qlooTagIds,
						priceRange: priceRange,
						verbose,
						aiSuggestions
					};
				} else {
					console.warn('Qloo Insights API returned no entities for the given dynamic criteria.');
					return fail(404, {
						success: false,
						qlooEntityIds: {},
						qlooTagIds: {},
						priceRange,
						message: 'No recommendations found for your preferences.'
					});
				}
			} else {
				console.error(
					`Error fetching Qloo insights (dynamic search action): ${response.status} ${response.statusText}`
				);
				return fail(500, { message: 'Failed to fetch Qloo insights.' });
			}
		} catch (error) {
			console.error('Exception fetching Qloo insights (dynamic search action):', error);
			return fail(500, { message: 'Failed to fetch Qloo insights.' });
		}
	}
};

// Mock data generation function
function createMockQlooEntity(
	name: string,
	entity_id: string,
	types: string[],
	popularity: number,
	description: string
): QlooEntity {
	return {
		name,
		entity_id,
		types,
		properties: {
			description: description,
			keywords: [],
			specialty_dishes: [],
			address: null,
			phone: null,
			website: null,
			image: null,
			business_rating: null,
			price_level: null
		},
		popularity,
		tags: []
	};
}

export const load = async () => {
	console.log('Load function in +page.server.ts initiated.');

	const allRecommendations: QlooEntity[] = [
		createMockQlooEntity(
			'The Gourmet Bistro',
			'entity-1',
			['restaurant'],
			0.95,
			'A fine dining experience with a modern twist.'
		),
		createMockQlooEntity(
			'Cafe Delights',
			'entity-2',
			['cafe'],
			0.92,
			'Cozy cafe with artisanal coffee and pastries.'
		),
		createMockQlooEntity(
			'Sushi Haven',
			'entity-3',
			['restaurant', 'japanese'],
			0.9,
			'Authentic Japanese sushi and sashimi.'
		),
		createMockQlooEntity(
			'Pasta Paradise',
			'entity-4',
			['restaurant', 'italian'],
			0.88,
			'Traditional Italian pasta dishes and wines.'
		),
		createMockQlooEntity(
			'Burger Joint',
			'entity-5',
			['restaurant', 'american'],
			0.85,
			'Classic American burgers and shakes.'
		),
		createMockQlooEntity(
			'Vegan Oasis',
			'entity-6',
			['restaurant', 'vegan'],
			0.8,
			'Healthy and delicious plant-based cuisine.'
		),
		createMockQlooEntity(
			'Spice Route',
			'entity-7',
			['restaurant', 'indian'],
			0.78,
			'Exotic Indian flavors and aromatic curries.'
		),
		createMockQlooEntity(
			'Mediterranean Grill',
			'entity-8',
			['restaurant', 'mediterranean'],
			0.75,
			'Fresh and vibrant Mediterranean dishes.'
		),
		createMockQlooEntity(
			'Taco Truck',
			'entity-9',
			['food_truck', 'mexican'],
			0.72,
			'Quick and tasty street tacos.'
		),
		createMockQlooEntity(
			'Pancake House',
			'entity-10',
			['restaurant', 'breakfast'],
			0.7,
			'All-day breakfast with a variety of pancakes.'
		),
		createMockQlooEntity(
			'Seafood Shack',
			'entity-11',
			['restaurant', 'seafood'],
			0.68,
			'Fresh catches and ocean views.'
		),
		createMockQlooEntity(
			'Pizza Palace',
			'entity-12',
			['restaurant', 'pizza'],
			0.65,
			'Hand-tossed pizzas with gourmet toppings.'
		),
		createMockQlooEntity(
			'BBQ Pit',
			'entity-13',
			['restaurant', 'bbq'],
			0.62,
			'Smoky ribs and savory barbecue.'
		),
		createMockQlooEntity(
			'Dessert Dream',
			'entity-14',
			['cafe', 'dessert'],
			0.6,
			'Sweet treats and decadent desserts.'
		),
		createMockQlooEntity(
			'Smoothie Bar',
			'entity-15',
			['cafe', 'healthy'],
			0.58,
			'Refreshing smoothies and healthy snacks.'
		)
	];

	const top5Recommendations = allRecommendations.slice(0, 5);
	const otherRecommendations = allRecommendations.slice(5);

	console.log('Returning mock recommendations:', {
		top5: top5Recommendations.length,
		other: otherRecommendations.length
	});

	return {
		top5: top5Recommendations,
		other: otherRecommendations
	};
};
