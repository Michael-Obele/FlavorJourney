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
	import type { PageProps } from './$types';

	let { form }: PageProps = $props();

	let artist = $state<string>('');
	let book = $state<string>('');
	let film = $state<string>('');
	let loading = $state<boolean>(false);
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
			<CardTitle>Welcome to FlavorJourney!</CardTitle>
			<CardDescription
				>Tell us what you love! Your preferences help us understand your unique taste.</CardDescription
			>
		</CardHeader>
		<CardContent>
			<div class="grid w-full items-center gap-4">
				<div class="flex flex-col space-y-1.5">
					<label for="musicArtist">Favorite Music Artist</label>
					<Input id="musicArtist" name="musicArtist" placeholder="e.g., Beyonce" />
				</div>
				<div class="flex flex-col space-y-1.5">
					<label for="bookTitle">Favorite Book Title</label>
					<Input
						id="bookTitle"
						name="bookTitle"
						placeholder="e.g., The Hitchhiker's Guide to the Galaxy"
					/>
				</div>
				<div class="flex flex-col space-y-1.5">
					<label for="filmTitle">Favorite Film Title</label>
					<Input id="filmTitle" name="filmTitle" placeholder="e.g., Inception" />
				</div>
			</div>
			{#if form?.qlooEntityIds && Object.keys(form.qlooEntityIds).length > 0}
				{console.log(form.qlooEntityIds)}
				{#each Object.entries(form.qlooEntityIds) as [key, results] (key)}
					{#if results && results.length > 0}
						<div class="mb-4">
							<h3 class="text-lg font-semibold capitalize">
								Select {key.replace('Title', '').replace('Artist', '')}
							</h3>
							{#if key === 'musicArtist'}
								<RadioGroup name={key} class="grid grid-cols-1 gap-2" bind:value={artist}>
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
												{#if result.types && result.types.length > 0}
													<span class="text-xs text-muted-foreground"
														>Types: {result.types.join(', ').replace(/urn:entity:/g, '')}</span
													>
												{/if}
												{#if result.properties?.date_of_birth}
													<span class="text-xs text-muted-foreground"
														>Born: {result.properties.date_of_birth}</span
													>
												{/if}
												{#if result.properties?.place_of_birth}
													<span class="text-xs text-muted-foreground"
														>Place of Birth: {result.properties.place_of_birth}</span
													>
												{/if}
												{#if result.tags && result.tags.length > 0}
													<div class="mt-2">
														<h4 class="text-xs font-semibold">Tags</h4>
														<div class="flex flex-wrap gap-1">
															{#each result.tags.slice(0, 5) as tag (tag.tag_id)}
																<span
																	class="rounded-full bg-secondary px-2 py-0.5 text-xs text-secondary-foreground"
																>
																	{tag.name}
																</span>
															{/each}
														</div>
													</div>
												{/if}
											</div>
										</div>
									{/each}
								</RadioGroup>
							{:else if key === 'bookTitle'}
								<RadioGroup name={key} class="grid grid-cols-1 gap-2" bind:value={book}>
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
												{#if result.types && result.types.length > 0}
													<span class="text-xs text-muted-foreground"
														>Types: {result.types.join(', ').replace(/urn:entity:/g, '')}</span
													>
												{/if}
												{#if result.properties?.date_of_birth}
													<span class="text-xs text-muted-foreground"
														>Born: {result.properties.date_of_birth}</span
													>
												{/if}
												{#if result.properties?.place_of_birth}
													<span class="text-xs text-muted-foreground"
														>Place of Birth: {result.properties.place_of_birth}</span
													>
												{/if}
												{#if result.tags && result.tags.length > 0}
													<div class="mt-2">
														<h4 class="text-xs font-semibold">Tags</h4>
														<div class="flex flex-wrap gap-1">
															{#each result.tags.slice(0, 5) as tag (tag.tag_id)}
																<span
																	class="rounded-full bg-secondary px-2 py-0.5 text-xs text-secondary-foreground"
																>
																	{tag.name}
																</span>
															{/each}
														</div>
													</div>
												{/if}
											</div>
										</div>
									{/each}
								</RadioGroup>
							{:else if key === 'filmTitle'}
								<RadioGroup name={key} class="grid grid-cols-1 gap-2" bind:value={film}>
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
												{#if result.types && result.types.length > 0}
													<span class="text-xs text-muted-foreground"
														>Types: {result.types.join(', ').replace(/urn:entity:/g, '')}</span
													>
												{/if}
												{#if result.properties?.date_of_birth}
													<span class="text-xs text-muted-foreground"
														>Born: {result.properties.date_of_birth}</span
													>
												{/if}
												{#if result.properties?.place_of_birth}
													<span class="text-xs text-muted-foreground"
														>Place of Birth: {result.properties.place_of_birth}</span
													>
												{/if}
												{#if result.tags && result.tags.length > 0}
													<div class="mt-2">
														<h4 class="text-xs font-semibold">Tags</h4>
														<div class="flex flex-wrap gap-1">
															{#each result.tags.slice(0, 5) as tag (tag.tag_id)}
																<span
																	class="rounded-full bg-secondary px-2 py-0.5 text-xs text-secondary-foreground"
																>
																	{tag.name}
																</span>
															{/each}
														</div>
													</div>
												{/if}
											</div>
										</div>
									{/each}
								</RadioGroup>
							{/if}
						</div>
					{/if}
				{/each}
			{/if}

			<!-- Hidden inputs to send selected values -->
			{#if artist}
				<input type="hidden" name="selectedMusicArtist" value={artist} />
			{/if}
			{#if book}
				<input type="hidden" name="selectedBookTitle" value={book} />
			{/if}
			{#if film}
				<input type="hidden" name="selectedFilmTitle" value={film} />
			{/if}
		</CardContent>
		<CardFooter class="mt-2 flex justify-end">
			{#if form?.qlooEntityIds && Object.keys(form.qlooEntityIds).length > 0}
				<Button type="submit" formaction="?/submit">Finalize Preferences</Button>
			{:else if loading}
				<Button disabled>Submitting Preferences...</Button>
			{:else}
				<Button type="submit">Submit Preferences</Button>
			{/if}
		</CardFooter>
	</Card>
</form>
