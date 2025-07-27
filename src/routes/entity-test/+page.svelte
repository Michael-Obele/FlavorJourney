<script lang="ts">
	import { page } from '$app/state';

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

	let entity = $derived(page.data.entity);
	let error = $derived(page.data.error);
</script>

<h1>Entity Test Page</h1>

{#if error}
	<p class="error">{error.message}</p>
{:else if entity}
	<h2>{entity.name}</h2>
	<p><strong>ID:</strong> {entity.entity_id}</p>
	<p><strong>Types:</strong> {entity.types.join(', ')}</p>

	{#if entity.properties}
		<h3>Properties:</h3>
		<ul>
			{#each Object.entries(entity.properties) as [key, value]}
				{#if value}
					<li><strong>{key}:</strong> {JSON.stringify(value)}</li>
				{/if}
			{/each}
		</ul>
	{/if}

	{#if entity.tags && entity.tags.length > 0}
		<h3>Tags:</h3>
		<ul>
			{#each entity.tags as tag}
				<li>{tag.name} ({tag.type}: {tag.value})</li>
			{/each}
		</ul>
	{/if}

	{#if entity.popularity}
		<p><strong>Popularity:</strong> {entity.popularity}</p>
	{/if}

	{#if entity.disambiguation}
		<p><strong>Disambiguation:</strong> {entity.disambiguation}</p>
	{/if}

	{#if entity.location}
		<p><strong>Location:</strong> Lat: {entity.location.lat}, Lon: {entity.location.lon}</p>
	{/if}
{:else}
	<p>
		Loading entity data or no entity ID provided. Append
		`?entity_id=F6754C46-B3E7-457F-8B7E-06C613597320` to the URL to test.
	</p>
{/if}

<style>
	.error {
		color: red;
		font-weight: bold;
	}
</style>
