<script lang="ts">
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

	interface ActionData {
		success: boolean;
		qlooEntityIds: Record<string, QlooEntity[] | null>;
		qlooTagIds: Record<string, Tag[] | null>;
		priceRange: string | undefined;
		message?: string; // Add message for error cases
		insights?: {
			success: boolean;
			results: {
				entities: QlooEntity[];
			};
		};
	}

	type PageProps = {
		form: ActionData;
		data: PageData;
	};

	let { form }: PageProps = $props();

	let selectedPlace = $state<string>('');
	let loading = $state<boolean>(false);
	let priceRangeValue = $state<string>(''); // State for price range select

	const priceOptions = [
		{ value: '1', label: '$ (Inexpensive)' },
		{ value: '2', label: '$$ (Moderate)' },
		{ value: '3', label: '$$$ (Expensive)' },
		{ value: '4', label: '$$$$ (Very Expensive)' }
	];

	const priceTriggerContent = $derived(
		priceOptions.find((p) => p.value === priceRangeValue)?.label ?? 'Select a price range'
	);

	let selectedCuisine = $state<string>('');
	let selectedPlaceType = $state<string>('');

	const cuisineOptions = [
		{ value: 'italian', label: 'Italian' },
		{ value: 'french', label: 'French' },
		{ value: 'mexican', label: 'Mexican' },
		{ value: 'chinese', label: 'Chinese' },
		{ value: 'indian', label: 'Indian' },
		{ value: 'japanese', label: 'Japanese' },
		{ value: 'mediterranean', label: 'Mediterranean' },
		{ value: 'thai', label: 'Thai' },
		{ value: 'american', label: 'American' }
	];

	const placeTypeOptions = [
		{ value: 'restaurant', label: 'Restaurant' },
		{ value: 'cafe', label: 'Cafe' },
		{ value: 'bar', label: 'Bar' }
	];

	const cuisineTriggerContent = $derived(
		cuisineOptions.find((c) => c.value === selectedCuisine)?.label ?? 'Select a cuisine'
	);

	const placeTypeTriggerContent = $derived(
		placeTypeOptions.find((p) => p.value === selectedPlaceType)?.label ?? 'Select a place type'
	);
</script>

<form
	method="POST"
	action="?/search"
	use:enhance={() => {
		loading = true;
		return async ({ update }) => {
			loading = false;
			update();
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
				<div class="flex flex-col space-y-1.5">
					<Label for="favoritePlaces">Favorite Places (Optional)</Label>
					<Input
						id="favoritePlaces"
						name="favoritePlaces"
						placeholder="e.g., The French Laundry, Noma"
					/>
				</div>
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
			{:else if loading}
				<Button disabled>Finding Places...</Button>
			{:else}
				<Button type="submit">Find Places</Button>
			{/if}
		</CardFooter>
	</Card>
</form>

{#if form?.insights?.success && form.insights.results.entities.length > 0}
	<h2 class="mt-10 text-2xl font-bold">Recommended Places:</h2>
	<div class="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
		{#each form.insights.results.entities as entity (entity.entity_id)}
			<Card>
				<CardHeader>
					<CardTitle>{entity.name}</CardTitle>
					<CardDescription
						>{entity.properties?.description || 'No description available.'}</CardDescription
					>
				</CardHeader>
				<CardContent>
					<p><strong>Address:</strong> {entity.properties?.address || 'N/A'}</p>
					<p><strong>Business Rating:</strong> {entity.properties?.business_rating || 'N/A'}</p>
					<p><strong>Neighborhood:</strong> {entity.properties?.neighborhood || 'N/A'}</p>
					{#if entity.properties?.keywords && entity.properties.keywords.length > 0}
						<p>
							<strong>Keywords:</strong>
							{entity.properties.keywords.map((k) => k.name).join(', ')}
						</p>
					{/if}
					{#if entity.properties?.specialty_dishes && entity.properties.specialty_dishes.length > 0}
						<p>
							<strong>Specialty Dishes:</strong>
							{entity.properties.specialty_dishes.map((d) => d.name).join(', ')}
						</p>
					{/if}
				</CardContent>
				<CardFooter>
					{#if entity.properties?.website}
						<a
							href={entity.properties.website}
							target="_blank"
							class="text-blue-500 hover:underline">Website</a
						>
					{/if}
				</CardFooter>
			</Card>
		{/each}
	</div>
{:else if form?.insights?.success === false}
	<p class="mt-4 text-red-500">No recommendations found or an error occurred: {form.message}</p>
{/if}
