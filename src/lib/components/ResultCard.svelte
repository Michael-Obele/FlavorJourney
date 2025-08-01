<!-- src/lib/components/ResultCard.svelte -->
<script lang="ts">
	import * as Card from '$lib/components/ui/card';

	export let name: string;
	export let cuisine: string;
	export let address: string;
	export let aiSuggestion: string;
</script>

<Card.Root class="w-[350px]">
	<Card.Header>
		<Card.Title>{name}</Card.Title>
		<Card.Description>{cuisine} - {address}</Card.Description>
	</Card.Header>
	<Card.Content>
		<h3 class="text-md mb-2 font-semibold">AI Insight:</h3>
		<p>{aiSuggestion}</p>
	</Card.Content>
	<Card.Footer>
		<!-- Optional: Add actions or more info here -->
	</Card.Footer>
</Card.Root>
