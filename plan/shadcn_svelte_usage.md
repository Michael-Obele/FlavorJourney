# Shadcn-Svelte Component Usage Guide

This document provides a summary of how to use the `shadcn-svelte` components available in this project.

## Select

Displays a list of options for the user to pick from—triggered by a button.

### Usage

```svelte
<script lang="ts">
	import * as Select from '$lib/components/ui/select/index.js';

	const fruits = [
		{ value: 'apple', label: 'Apple' },
		{ value: 'banana', label: 'Banana' },
		{ value: 'blueberry', label: 'Blueberry' },
		{ value: 'grapes', label: 'Grapes' },
		{ value: 'pineapple', label: 'Pineapple' }
	];

	let value = $state('');

	const triggerContent = $derived(fruits.find((f) => f.value === value)?.label ?? 'Select a fruit');
</script>

<Select.Root type="single" name="favoriteFruit" bind:value>
	<Select.Trigger class="w-[180px]">
		{triggerContent}
	</Select.Trigger>
	<Select.Content>
		<Select.Group>
			<Select.Label>Fruits</Select.Label>
			{#each fruits as fruit (fruit.value)}
				<Select.Item value={fruit.value} label={fruit.label} disabled={fruit.value === 'grapes'}>
					{fruit.label}
				</Select.Item>
			{/each}
		</Select.Group>
	</Select.Content>
</Select.Root>
```

---

## Accordion

A vertically stacked set of interactive headings that each reveal a section of content.

### Usage

```svelte
<script lang="ts">
	import * as Accordion from '$lib/components/ui/accordion/index.js';
</script>

<Accordion.Root type="single">
	<Accordion.Item value="item-1">
		<Accordion.Trigger>Is it accessible?</Accordion.Trigger>
		<Accordion.Content>Yes. It adheres to the WAI-ARIA design pattern.</Accordion.Content>
	</Accordion.Item>
</Accordion.Root>
```

---

## Alert

Displays a callout for user attention.

### Usage

```svelte
<script lang="ts">
	import * as Alert from '$lib/components/ui/alert/index.js';
</script>

<Alert.Root>
	<Alert.Title>Heads up!</Alert.Title>
	<Alert.Description>You can add components to your app using the cli.</Alert.Description>
</Alert.Root>
```

### Destructive Variant

```svelte
<script lang="ts">
	import CircleAlertIcon from '@lucide/svelte/icons/circle-alert';
	import * as Alert from '$lib/components/ui/alert/index.js';
</script>

<Alert.Root variant="destructive">
	<CircleAlertIcon class="size-4" />
	<Alert.Title>Error</Alert.Title>
	<Alert.Description>Your session has expired. Please login again.</Alert.Description>
</Alert.Root>
```

---

## Badge

Displays a badge or a component that looks like a badge.

### Usage

```svelte
<script lang="ts">
	import { Badge } from '$lib/components/ui/badge/index.js';
</script>

<Badge variant="outline">Badge</Badge>
```

### Link

You can use the `badgeVariants` helper to create a link that looks like a badge.

```svelte
<script lang="ts">
	import { badgeVariants } from '$lib/components/ui/badge/index.js';
</script>

<a href="/dashboard" class={badgeVariants({ variant: 'outline' })}>Badge</a>
```

---

## Button

Displays a button or a component that looks like a button.

### Usage

```svelte
<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
</script>

<Button variant="outline">Button</Button>
```

### Link

You can convert the `<button>` into an `<a>` element by simply passing an `href` as a prop.

```svelte
<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
</script>

<Button href="/dashboard">Dashboard</Button>
```

Alternatively, you can use the `buttonVariants` helper to create a link that looks like a button.

```svelte
<script lang="ts">
	import { buttonVariants } from '$lib/components/ui/button';
</script>

<a href="/dashboard" class={buttonVariants({ variant: 'outline' })}> Dashboard </a>
```

---

## Card

Displays a card with header, content, and footer.

### Usage

```svelte
<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
</script>

<Card.Root>
	<Card.Header>
		<Card.Title>Card Title</Card.Title>
		<Card.Description>Card Description</Card.Description>
	</Card.Header>
	<Card.Content>
		<p>Card Content</p>
	</Card.Content>
	<Card.Footer>
		<p>Card Footer</p>
	</Card.Footer>
</Card.Root>
```

---

## Dialog

A window overlaid on either the primary window or another dialog window, rendering the content underneath inert.

### Usage

```svelte
<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index.js';
</script>

<Dialog.Root>
	<Dialog.Trigger>Open</Dialog.Trigger>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Are you sure absolutely sure?</Dialog.Title>
			<Dialog.Description>
				This action cannot be undone. This will permanently delete your account and remove your data
				from our servers.
			</Dialog.Description>
		</Dialog.Header>
	</Dialog.Content>
</Dialog.Root>
```

---

## Input

Displays a form input field or a component that looks like an input field.

### Usage

```svelte
<script lang="ts">
	import { Input } from '$lib/components/ui/input/index.js';
</script>

<Input />
```

### With Label

```svelte
<script lang="ts">
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';

	const id = $props.id();
</script>

<div class="flex w-full max-w-sm flex-col gap-1.5">
	<Label for="email-{id}">Email</Label>
	<Input type="email" id="email-{id}" placeholder="email" />
</div>
```

---

## Label

Renders an accessible label associated with controls.

### Usage

```svelte
<script lang="ts">
	import { Label } from '$lib/components/ui/label/index.js';
</script>

<Label for="email">Your email address</Label>
```

---

## Radio Group

A set of checkable buttons—known as radio buttons—where no more than one of the buttons can be checked at a time.

### Usage

```svelte
<script lang="ts">
	import { Label } from '$lib/components/ui/label/index.js';
	import * as RadioGroup from '$lib/components/ui/radio-group/index.js';
</script>

<RadioGroup.Root value="option-one">
	<div class="flex items-center space-x-2">
		<RadioGroup.Item value="option-one" id="option-one" />
		<Label for="option-one">Option One</Label>
	</div>
	<div class="flex items-center space-x-2">
		<RadioGroup.Item value="option-two" id="option-two" />
		<Label for="option-two">Option Two</Label>
	</div>
</RadioGroup.Root>
```

---

## Scroll Area

Augments native scroll functionality for custom, cross-browser styling.

### Usage

```svelte
<script lang="ts">
	import { ScrollArea } from '$lib/components/ui/scroll-area/index.js';
</script>

<ScrollArea class="h-[200px] w-[350px] rounded-md border p-4">
	Jokester began sneaking into the castle in the middle of the night and leaving jokes all over the
	place: under the king's pillow, in his soup, even in the royal toilet. The king was furious, but
	he couldn't seem to stop Jokester. And then, one day, the people of the kingdom discovered that
	the jokes left by Jokester were so funny that they couldn't help but laugh. And once they started
	laughing, they couldn't stop.
</ScrollArea>
```

---

## Separator

Visually or semantically separates content.

### Usage

```svelte
<script lang="ts">
	import { Separator } from '$lib/components/ui/separator/index.js';
</script>

<Separator />
```

---

## Tabs

A set of layered sections of content—known as tab panels—that are displayed one at a time.

### Usage

```svelte
<script lang="ts">
	import * as Tabs from '$lib/components/ui/tabs/index.js';
</script>

<Tabs.Root value="account" class="w-[400px]">
	<Tabs.List>
		<Tabs.Trigger value="account">Account</Tabs.Trigger>
		<Tabs.Trigger value="password">Password</Tabs.Trigger>
	</Tabs.List>
	<Tabs.Content value="account">Make changes to your account here.</Tabs.Content>
	<Tabs.Content value="password">Change your password here.</Tabs.Content>
</Tabs.Root>
```

---

## Textarea

Displays a form textarea or a component that looks like a textarea.

### Usage

```svelte
<script lang="ts">
	import { Textarea } from '$lib/components/ui/textarea/index.js';
</script>

<Textarea />
```

### With Label

```svelte
<script lang="ts">
	import { Label } from '$lib/components/ui/label/index.js';
	import { Textarea } from '$lib/components/ui/textarea/index.js';
</script>

<div class="grid w-full gap-1.5">
	<Label for="message">Your message</Label>
	<Textarea placeholder="Type your message here." id="message" />
</div>
```

---
