# Svelte 5 and SvelteKit Best Practices and Rules

This document outlines key best practices, syntax changes (runes), and essential concepts for Svelte 5 and SvelteKit development, based on official documentation. Adherence to these guidelines will ensure a consistent, performant, and maintainable codebase.

## Do's and Don'ts for Svelte 5 Syntax

### Do's

- **Use `$state` for reactive state**: Explicitly declare reactive variables using `$state(...)`. This makes reactivity clearer and allows for a consistent reactivity model outside the top-level of components.
  ```svelte
  <script>
  	let count = $state(0);
  </script>
  ```
- **Use `$derived` for derived state**: For state that is computed from other reactive state, use `$derived(...)`. Ensure expressions are free of side-effects.
  ```svelte
  <script>
  	let count = $state(0);
  	let doubled = $derived(count * 2);
  </script>
  ```
- **Use `$effect` for side-effects**: When you need to run code in response to state changes (e.g., DOM manipulation, third-party library calls, network requests), use `$effect(...)`.
  ```svelte
  <script>
  	let size = $state(50);
  	$effect(() => {
  		// This effect re-runs when `size` changes
  		console.log(`Size changed to: ${size}`);
  	});
  </script>
  ```
- **Use `$props` for component properties**: Declare component inputs using `$props()` with destructuring, which aligns with standard JavaScript and provides flexibility for renaming, default values, and rest properties.
  ```svelte
  <script>
  	let { adjective = 'happy' } = $props();
  </script>
  ```
- **Use event attributes (e.g., `onclick`) for event handlers**: The `on:` directive is deprecated. Use direct HTML-like event attributes.
  ```svelte
  <button onclick={() => count++}>clicks: {count}</button>
  ```
- **Use callback props for component events**: Instead of `createEventDispatcher`, pass functions as properties to components for event handling.

  ```svelte
  <!-- Child.svelte -->
  <script>
  	let { onInflate } = $props();
  </script>

  <button onclick={() => onInflate(value)}>Inflate</button>

  <!-- Parent.svelte -->
  <Child onInflate={handleInflate} />
  ```

- **Use snippets (`{#snippet ...}`) instead of slots**: Snippets are the new, more powerful way to pass UI content to components.
  ```svelte
  <!-- Parent.svelte -->
  <Child>
  	{#snippet header()}
  		<h1>My Header</h1>
  	{/snippet}
  </Child>
  ```
- **Use `$bindable()` for two-way binding on props**: If a prop needs to be mutated by the child component and reflect back to the parent, explicitly mark it with `$bindable()`.

  ```svelte
  <script>
  	let { value = $bindable() } = $props();
  </script>

  <input bind:value />
  ```

### Don'ts

- **Don't use implicit reactivity with `let`**: Avoid relying on `let` declarations at the top-level of components for reactivity without `$state`.
- **Don't use reactive `$:` statements for derivations or effects**: Replace `$:` with `$derived` for derivations and `$effect` for side-effects.
- **Don't use `export let` for props**: Migrate to `$props()` for defining component properties.
- **Don't mutate props directly unless `$bindable`**: Mutating props (if not `$bindable`) can lead to unexpected behavior and warnings.
- **Don't update state inside `$effect`**: This can lead to convoluted code and infinite update cycles. Use `$derived` or other mechanisms for state synchronization.
- **Don't use `createEventDispatcher`**: This function is deprecated in Svelte 5. Use callback props instead.
- **Don't use `on:` directive for DOM events**: Use `onclick`, `oninput`, etc., directly.
- **Don't use event modifiers (e.g., `on:click|once`)**: Implement the logic directly within the event handler function.
- **Don't use `<slot />`**: Use snippets and `{@render children()}` for content projection.
- **Don't use `new Component(...)` for component instantiation**: Use `mount` or `hydrate` from `svelte` directly.
- **Don't use `beforeUpdate`/`afterUpdate` in runes mode**: Use `$effect.pre` and `$effect` along with `tick()` for equivalent functionality.

## Summary of Essential Svelte 5 and SvelteKit Documentation Points

### Svelte 5 Core Concepts

- **Runes are compiler instructions**: They control Svelte's reactivity and are part of the language syntax, prefixed with `$`. They don't need to be imported and are not normal JavaScript values.
- **`$state.raw` for non-reactive objects**: Use this for large arrays or objects you don't intend to mutate reactively, improving performance.
- **`$state.snapshot` for static copies**: Useful for passing reactive state to external libraries that don't expect proxies.
- **`$effect.pre` for pre-DOM updates**: Runs before DOM updates, useful for scroll logic or other pre-render tasks.
- **`$effect.root` for non-tracked scopes**: Advanced feature to create effects outside the component lifecycle or for manual cleanup.
- **Components are functions, not classes**: This affects how components are instantiated (`mount`, `hydrate`) and how `bind:this` behaves (returns exports, not class instance).
- **Whitespace handling is stricter**: Svelte 5 has simplified whitespace rules, leading to more predictable rendering.
- **Modern browser required**: Svelte 5 leverages modern browser APIs like `Proxy` and `ResizeObserver`.

### SvelteKit Core Concepts

- **Filesystem-based routing**: Routes are defined by the directory structure in `src/routes/`.
- **`+page.svelte`**: Defines the UI for a page, rendered both on server (SSR) and client (CSR).
- **`+page.js` / `+page.server.js`**: Contains `load` functions to fetch data for pages. `+page.js` is universal (runs on client and server), `+page.server.js` is server-only (for database access, private env vars).
- **`+layout.svelte` / `+layout.js` / `+layout.server.js`**: Defines shared UI and data loading for groups of pages. Layouts can be nested.
- **`+error.svelte`**: Customizes error pages for specific routes or globally.
- **`+server.js`**: Defines API endpoints (HTTP handlers for `GET`, `POST`, etc.) giving full control over responses.
- **Form actions**: Use `+page.server.js` to export `actions` for handling `POST` requests from `<form>` elements, enabling progressive enhancement with `use:enhance`.
- **`$types` for type safety**: SvelteKit generates type definitions for root files, providing strong typing for `load` functions and component props.
- **Data flow in `load` functions**: Data returned from parent `load` functions is available to children. `await parent()` allows accessing data from parent `load` functions.
- **Performance optimizations**: SvelteKit includes built-in optimizations like code-splitting, asset preloading, and request coalescing. Be mindful of image/video optimization, font subsetting, and avoiding data waterfalls.
- **Auth integration**: SvelteKit supports various authentication strategies, often leveraging server hooks and cookies.

### Research Gaps Identified:

- **Advanced Svelte 5 Runes Usage**: Explore and document more advanced use cases for Svelte 5 runes (`$state.raw`, `$state.snapshot`, `$effect.pre`, `$effect.root`) in optimizing performance and managing complex state.
- **SvelteKit Server-Side Best Practices**: Deep dive into best practices for SvelteKit server-side development, including error handling, data validation, and secure API design.
- **Testing Strategies for Svelte 5/SvelteKit**: Research and recommend comprehensive testing strategies for Svelte 5 components and SvelteKit applications (unit, integration, end-to-end testing), including popular testing frameworks and libraries.
