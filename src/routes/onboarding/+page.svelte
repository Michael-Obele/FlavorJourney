<script lang="ts">
	import { Alert, AlertDescription, AlertTitle } from '$lib/components/ui/alert';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import {
		Card,
		CardContent,
		CardDescription,
		CardFooter,
		CardHeader,
		CardTitle
	} from '$lib/components/ui/card';
	import { enhance } from '$app/forms';
	import { RadioGroup, RadioGroupItem } from '$lib/components/ui/radio-group';
	import { Label } from '$lib/components/ui/label';
	import * as Select from '$lib/components/ui/select'; // Import all from select
	import type { PageData } from './$types';
	import type { QlooEntity, Tag } from './+page.server'; // Import necessary types
	import { PersistedState } from 'runed';
	import ResultCard from '$lib/components/ResultCard.svelte'; // Import the new component

	// Shape returned by server 'search' action for card rendering and storage
	type VerbosePlace = {
		name: string;
		entity_id: string;
		popularity: number | null;
		types: string[];
		disambiguation: string | null;
		location: { lat: number; lon: number } | null;
		properties: {
			description: string | null;
			keywords: { name: string; count: number }[];
			specialty_dishes: { id: string; name: string; type: string; weight: number }[];
			address: string | null;
			phone: string | null;
			website: string | null;
			image: string | null;
			business_rating: number | null;
			price_level: number | null;
		};
		tags: { name: string; type: string; tag_id?: string; value?: string }[];
	};

	interface ActionData {
		success: boolean;
		qlooEntityIds?: Record<string, QlooEntity[] | null>;
		qlooTagIds?: Record<string, Tag[] | null>;
		priceRange?: string | undefined;
		message?: string;
		insights?: {
			success: boolean;
			results: {
				entities: QlooEntity[];
			};
		};
		entityId?: string;
		entityName?: string;
		verbose?: VerbosePlace[]; // New: verbose array for UI + storage
		aiSuggestions?: Record<string, string>; // New: AI suggestions
	}

	type PageDataExtended = PageData & {
		top5?: QlooEntity[];
		other?: QlooEntity[];
		aiSuggestions?: Record<string, string>; // Add aiSuggestions to PageDataExtended
	};

	type PageProps = {
		form: ActionData;
		data: PageDataExtended;
	};

	let { form, data }: PageProps = $props();

	let selectedPlace = $state<string>('');
	let loading = $state<boolean>(false);
	let priceRangeValue = $state<string>(''); // State for price range select
	let entityId = $state<string | undefined>(undefined); // Add state for entityId
	let entityName = $state<string | undefined>(undefined); // Add state for entityName

	let showForm = $state<boolean>(true); // New state variable to control form/results display
	let currentAiSuggestions: any = $state({}); // Changed type to any to bypass strict TS error

	// Persist verbose results using runed PersistedState (no manual effects needed)
	const verboseStore = new PersistedState<VerbosePlace[]>('qloo_verbose_latest_array', [], {
		storage: 'local',
		syncTabs: true
	});

	// New: Location selection (US cities)
	let locationQuery = $state<string>('');
	const usCityOptions = [
		{ value: 'New York', label: 'New York' },
		{ value: 'Los Angeles', label: 'Los Angeles' },
		{ value: 'Chicago', label: 'Chicago' },
		{ value: 'Houston', label: 'Houston' },
		{ value: 'Phoenix', label: 'Phoenix' },
		{ value: 'Philadelphia', label: 'Philadelphia' },
		{ value: 'San Antonio', label: 'San Antonio' },
		{ value: 'San Diego', label: 'San Diego' },
		{ value: 'Dallas', label: 'Dallas' },
		{ value: 'San Jose', label: 'San Jose' },
		{ value: 'Austin', label: 'Austin' },
		{ value: 'Miami', label: 'Miami' },
		{ value: 'Seattle', label: 'Seattle' },
		{ value: 'Boston', label: 'Boston' },
		{ value: 'Atlanta', label: 'Atlanta' }
	];
	const locationTriggerContent = $derived(
		usCityOptions.find((c) => c.value === locationQuery)?.label ?? 'Select a city'
	);

	const priceOptions = [
		{ value: '1', label: '$ (Inexpensive)' },
		{ value: '2', label: '$$ (Moderate)' },
		{ value: '3', label: '$$$ (Expensive)' },
		{ value: '4', label: '$$$$ (Very Expensive)' }
	];

	const priceTriggerContent = $derived(
		priceOptions.find((p) => p.value === priceRangeValue)?.label ?? 'Select a price range'
	);

	// Not used by server right now — keep commented to avoid UI drift
	// let selectedCuisine = $state<string>('');
	// let selectedPlaceType = $state<string>('');
	// const cuisineOptions = [
	// 	{ value: 'italian', label: 'Italian' },
	// 	{ value: 'french', label: 'French' },
	// 	{ value: 'mexican', label: 'Mexican' },
	// 	{ value: 'chinese', label: 'Chinese' },
	// 	{ value: 'indian', label: 'Indian' },
	// 	{ value: 'japanese', label: 'Japanese' },
	// 	{ value: 'mediterranean', label: 'Mediterranean' },
	// 	{ value: 'thai', label: 'Thai' },
	// 	{ value: 'american', label: 'American' }
	// ];
	// const placeTypeOptions = [
	// 	{ value: 'restaurant', label: 'Restaurant' },
	// 	{ value: 'cafe', label: 'Cafe' },
	// 	{ value: 'bar', label: 'Bar' }
	// ];
	// const cuisineTriggerContent = $derived(
	// 	cuisineOptions.find((c) => c.value === selectedCuisine)?.label ?? 'Select a cuisine'
	// );
	// const placeTypeTriggerContent = $derived(
	// 	placeTypeOptions.find((p) => p.value === selectedPlaceType)?.label ?? 'Select a place type'
	// );

	// New: Tag groups (Accessibility, Offerings, Eating habits) with Qloo tag URNs
	// These will post as filterTags[] so the server can build &operator.filter.tags and &filter.tags
	const accessibilityTags = [
		{
			value: 'urn:tag:accessibility:place:wheelchair_accessible_entrance',
			label: 'Wheelchair accessible entrance'
		},
		{
			value: 'urn:tag:accessibility:place:wheelchair_accessible_seating',
			label: 'Wheelchair accessible seating'
		}
	];
	const offeringTags = [
		{ value: 'urn:tag:offerings:place:vegan_options', label: 'Vegan options' },
		{ value: 'urn:tag:offerings:place:gluten_free_options', label: 'Gluten-free options' }
	];
	const eatingHabitTags = [
		{ value: 'urn:tag:eating_habits:vegan', label: 'Vegan' },
		{ value: 'urn:tag:eating_habits:vegetarian', label: 'Vegetarian' },
		{ value: 'urn:tag:eating_habits:pescatarian', label: 'Pescatarian' }
	];

	// State for operator (union|intersection) with default intersection as requested
	let operatorFilterTags = $state<'union' | 'intersection'>('intersection');

	let entityLoading = $state(false);
	let searchLoading = $state(false);
</script>

<form
	method="POST"
	action="?/getEntityId"
	use:enhance={() => {
		entityLoading = true;
		return ({ update }) => {
			// Set invalidateAll to false if you don't want to reload page data when submitting
			update({ invalidateAll: false }).finally(async () => {
				entityLoading = false;
			});
		};
	}}
	id="get-entity-id-form"
>
	<Card class="mx-auto mt-10 w-[450px]">
		<CardHeader>
			<CardTitle>Find an Entity ID</CardTitle>
			<CardDescription>Enter a search term to find a Qloo entity ID.</CardDescription>
		</CardHeader>
		<CardContent>
			<div class="grid w-full items-center gap-4">
				<div class="flex flex-col space-y-1.5">
					<Label for="searchTerm">Search Term</Label>
					<Input id="searchTerm" name="searchTerm" placeholder="e.g., The French Laundry" />
				</div>
				{#if form?.entityId && form?.success}
					<p class="text-green-500">Found Entity ID: {form.entityId} ({form.entityName})</p>
				{/if}
				{#if form?.message && !form?.entityId}
					<p class="text-red-500">{form.message}</p>
				{/if}
			</div>
		</CardContent>
		<CardFooter class="mt-2 flex justify-end">
			{#if entityLoading}
				<Button disabled>Finding Entity ID...</Button>
			{:else}
				<Button type="submit">Get Entity ID</Button>
			{/if}
		</CardFooter>
	</Card>
</form>

{#if showForm}
	<form
		method="POST"
		action="?/search"
		use:enhance={() => {
			searchLoading = true;
			return async ({ update, result }) => {
				if (result.type === 'redirect') {
					// Handle redirects if any
				} else if (result.type === 'success' && Array.isArray(result.data?.verbose)) {
					verboseStore.current = result.data.verbose;
					// Update currentAiSuggestions from the action result
					if (result.data?.aiSuggestions) {
						currentAiSuggestions = result.data.aiSuggestions;
					} else {
						currentAiSuggestions = {};
					}
					showForm = false; // Transition to results state on successful form submission
				} else if (result.type === 'success' && result.data?.message) {
					// If there's a message but no verbose data, stay on form and show message
					// This handles cases where search returns an error message but no results
					console.error('Form submission returned a message:', result.data.message);
				}
				searchLoading = false;
			};
		}}
		id="onboarding-form"
	>
		<Card class="mx-auto mt-10 w-[450px]">
			<CardHeader>
				<CardTitle>Find Your Next Flavor</CardTitle>
				<CardDescription
					>Tell us your tastes and we'll find the perfect place for you.</CardDescription
				>
			</CardHeader>
			<CardContent>
				<div class="grid w-full items-center gap-4">
					<!-- Location (US City) -->
					<div class="flex flex-col space-y-1.5">
						<Label for="locationQuery">Location (City)</Label>
						<Select.Root type="single" name="locationQuery" bind:value={locationQuery}>
							<Select.Trigger id="locationQuery" class="w-full">
								{locationTriggerContent}
							</Select.Trigger>
							<Select.Content>
								<Select.Group>
									<Select.Label>US Cities</Select.Label>
									{#each usCityOptions as option (option.value)}
										<Select.Item value={option.value} label={option.label}>
											{option.label}
										</Select.Item>
									{/each}
								</Select.Group>
							</Select.Content>
						</Select.Root>
					</div>

					<!-- Favorite Cuisines - not used by server currently -->
					<!--
				<div class="flex flex-col space-y-1.5">
					<Label for="cuisines">Favorite Cuisines</Label>
					<Select.Root type="single" name="cuisines" bind:value={selectedCuisine}>
						<Select.Trigger id="cuisines" class="w-full">
							{cuisineTriggerContent}
						</Select.Trigger>
						<Select.Content>
							<Select.Group>
								<Select.Label>Cuisines</Select.Label>
								{#each cuisineOptions as option (option.value)}
									<Select.Item value={option.value} label={option.label}>
										{option.label}
									</Select.Item>
								{/each}
							</Select.Group>
						</Select.Content>
					</Select.Root>
				</div>
				-->

					<!-- Place Types - not used by server currently -->
					<!--
				<div class="flex flex-col space-y-1.5">
					<Label for="placeTypes">Types of Places</Label>
					<Select.Root type="single" name="placeTypes" bind:value={selectedPlaceType}>
						<Select.Trigger id="placeTypes" class="w-full">
							{placeTypeTriggerContent}
						</Select.Trigger>
						<Select.Content>
							<Select.Group>
								<Select.Label>Place Types</Select.Label>
								{#each placeTypeOptions as option (option.value)}
									<Select.Item value={option.value} label={option.label}>
										{option.label}
									</Select.Item>
								{/each}
							</Select.Group>
						</Select.Content>
					</Select.Root>
				</div>
				-->

					<!-- Price Range -->
					<div class="flex flex-col space-y-1.5">
						<Label for="priceRange">Price Range</Label>
						<Select.Root type="single" name="priceRange" bind:value={priceRangeValue}>
							<Select.Trigger id="priceRange" class="w-full">
								{priceTriggerContent}
							</Select.Trigger>
							<Select.Content>
								<Select.Group>
									<Select.Label>Price</Select.Label>
									{#each priceOptions as option (option.value)}
										<Select.Item value={option.value} label={option.label}>
											{option.label}
										</Select.Item>
									{/each}
								</Select.Group>
							</Select.Content>
						</Select.Root>
					</div>

					<!-- Tag Groups: Accessibility -->
					<div class="flex flex-col space-y-1.5">
						<Label>Accessibility</Label>
						<div class="grid gap-2">
							{#each accessibilityTags as t (t.value)}
								<label class="flex items-center gap-2 text-sm">
									<input type="checkbox" name="filterTags[]" value={t.value} />
									<span>{t.label}</span>
								</label>
							{/each}
						</div>
					</div>

					<!-- Tag Groups: Offerings -->
					<div class="flex flex-col space-y-1.5">
						<Label>Offerings</Label>
						<div class="grid gap-2">
							{#each offeringTags as t (t.value)}
								<label class="flex items-center gap-2 text-sm">
									<input type="checkbox" name="filterTags[]" value={t.value} />
									<span>{t.label}</span>
								</label>
							{/each}
						</div>
					</div>

					<!-- Tag Groups: Eating Habits -->
					<div class="flex flex-col space-y-1.5">
						<Label>Eating habits</Label>
						<div class="grid gap-2">
							{#each eatingHabitTags as t (t.value)}
								<label class="flex items-center gap-2 text-sm">
									<input type="checkbox" name="filterTags[]" value={t.value} />
									<span>{t.label}</span>
								</label>
							{/each}
						</div>
					</div>

					<!-- Operator for combining tags -->
					<div class="flex flex-col space-y-1.5">
						<Label for="operatorFilterTags">Combine selected tags by</Label>
						<Select.Root type="single" name="operatorFilterTags" bind:value={operatorFilterTags}>
							<Select.Trigger id="operatorFilterTags" class="w-full">
								{operatorFilterTags === 'intersection' ? 'Intersection (AND)' : 'Union (OR)'}
							</Select.Trigger>
							<Select.Content>
								<Select.Group>
									<Select.Label>Operator</Select.Label>
									<Select.Item value="intersection" label="Intersection (AND)"
										>Intersection (AND)</Select.Item
									>
									<Select.Item value="union" label="Union (OR)">Union (OR)</Select.Item>
								</Select.Group>
							</Select.Content>
						</Select.Root>
					</div>

					<!-- Optional: radius -->
					<div class="flex flex-col space-y-1.5">
						<Label for="filterLocationRadius">Radius (meters, optional)</Label>
						<Input
							id="filterLocationRadius"
							name="filterLocationRadius"
							type="number"
							min="0"
							placeholder="e.g., 0 to restrict strictly within locality"
						/>
					</div>

					<!-- Favorite Places (Optional) - not used by server currently -->
					<!--
				<div class="flex flex-col space-y-1.5">
					<Label for="favoritePlaces">Favorite Places (Optional)</Label>
					<Input
						id="favoritePlaces"
						name="favoritePlaces"
						placeholder="e.g., The French Laundry, Noma"
					/>
				</div>
				-->
				</div>
				{#if form?.qlooEntityIds && Object.keys(form.qlooEntityIds).length > 0}
					{console.log(form.qlooEntityIds)}
					{#each Object.entries(form.qlooEntityIds) as [key, results] (key)}
						{#if results && results.length > 0}
							<div class="mb-4">
								<h3 class="text-lg font-semibold capitalize">Select a matching place</h3>
								<RadioGroup
									name="selectedPlace"
									class="grid grid-cols-1 gap-2"
									bind:value={selectedPlace}
								>
									{#each results as result (result.entity_id)}
										<div class="flex items-start space-x-4 rounded-md border p-4">
											<RadioGroupItem value={result.entity_id} id={result.entity_id} class="mt-1" />
											{#if result.properties?.image?.url}
												<img
													src={result.properties.image.url}
													alt="Image of {result.name}"
													class="h-24 w-24 rounded-md object-cover"
												/>
											{/if}
											<div class="flex flex-col">
												<Label for={result.entity_id} class="text-base font-semibold"
													>{result.name}</Label
												>
												{#if result.properties?.short_description}
													<p class="text-sm text-muted-foreground">
														{result.properties.short_description}
													</p>
												{/if}
												{#if result.disambiguation}
													<span class="text-sm text-muted-foreground">{result.disambiguation}</span>
												{/if}
											</div>
										</div>
									{/each}
								</RadioGroup>
							</div>
						{/if}
					{/each}
				{/if}

				<!-- Hidden inputs to send selected values -->
				{#if selectedPlace}
					<input type="hidden" name="selectedPlace" value={selectedPlace} />
				{/if}
				{#if entityId}
					<input type="hidden" name="entityId" value={entityId} />
				{/if}
				{#if form?.qlooTagIds}
					<input type="hidden" name="allQlooTagIds" value={JSON.stringify(form.qlooTagIds)} />
				{/if}
				{#if form?.priceRange}
					<input type="hidden" name="priceRange" value={form.priceRange} />
				{/if}
				{#if form?.message}
					<p class="text-red-500">{form.message}</p>
				{/if}
			</CardContent>
			<CardFooter class="mt-2 flex justify-end">
				{#if form?.qlooEntityIds && Object.keys(form.qlooEntityIds).length > 0}
					<Button type="submit" formaction="?/submit">Finalize Preferences</Button>
				{:else if searchLoading}
					<Button disabled>Finding Places...</Button>
				{:else}
					<Button type="submit">Find Places</Button>
				{/if}
			</CardFooter>
		</Card>
	</form>
{/if}

<!-- Display verbose results from persisted state -->
{#if !showForm}
	<h2 class="mt-10 text-2xl font-bold">Your Recommendations</h2>
	<Alert class="mb-6">
		<AlertTitle>Welcome to FlavorJourney!</AlertTitle>
		<AlertDescription>
			We're just getting started. Many more exciting features, including real-time recommendations
			and travel itineraries, are coming soon!
		</AlertDescription>
	</Alert>

	{#if data.top5 && data.top5.length > 0}
		<h3 class="mt-8 text-xl font-semibold">AI Top Picks</h3>
		<div class="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
			{#each data.top5 as entity (entity.entity_id)}
				<ResultCard
					name={entity.name}
					cuisine={entity.types.length > 0 ? entity.types[0] : 'Unknown Cuisine'}
					address={entity.properties?.address || 'N/A'}
					aiSuggestion={data?.aiSuggestions?.[entity.entity_id] || 'No AI suggestion available.'}
				/>
			{/each}
		</div>
	{/if}

	{#if verboseStore.current && verboseStore.current.length > 0}
		<h3 class="mt-8 text-xl font-semibold">Search Results</h3>
		<div class="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
			{#each verboseStore.current as entity (entity.entity_id)}
				<ResultCard
					name={entity.name}
					cuisine={entity.types.length > 0 ? entity.types[0] : 'Unknown Cuisine'}
					address={entity.properties?.address || 'N/A'}
					aiSuggestion={currentAiSuggestions[entity.entity_id] || 'No AI suggestion available.'}
				/>
			{/each}
		</div>
	{/if}

	{#if (!data.top5 || data.top5.length === 0) && (!data.other || data.other.length === 0) && (!verboseStore.current || verboseStore.current.length === 0)}
		<p class="mt-4 text-muted-foreground">No recommendations found based on your preferences.</p>
	{/if}

	<div class="mt-6 flex justify-center">
		<Button onclick={() => (showForm = true)}>Start New Search</Button>
	</div>
{/if}
