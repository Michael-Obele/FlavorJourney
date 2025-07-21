# Shadcn-Svelte Component Usage Guide

This guide outlines the recommended usage of Shadcn-Svelte components within this project. Adhering to these guidelines ensures consistency, maintainability, and proper integration of UI elements.

## General Principles

*   **Prioritize Shadcn-Svelte Components:** For all UI elements, always utilize the corresponding Shadcn-Svelte component whenever possible. Avoid using raw HTML elements if a suitable Shadcn-Svelte component exists.

## Forms

*   **Standard HTML `<form>` Elements:** All forms *must* be wrapped in standard HTML `<form>` elements.
*   **Shadcn-Svelte Form Controls:** Within a `<form>` element, all interactive form controls (inputs, buttons, select elements, text areas, etc.) *must* be the corresponding Shadcn-Svelte component.

## Available Components

Below is a list of available Shadcn-Svelte components in `src/lib/components/ui`. Refer to their respective directories for specific usage details and examples.

*   [`accordion`](src/lib/components/ui/accordion)
*   [`alert`](src/lib/components/ui/alert)
*   [`badge`](src/lib/components/ui/badge)
*   [`button`](src/lib/components/ui/button)
*   [`card`](src/lib/components/ui/card)
*   [`dialog`](src/lib/components/ui/dialog)
*   [`input`](src/lib/components/ui/input)
*   [`scroll-area`](src/lib/components/ui/scroll-area)
*   [`select`](src/lib/components/ui/select)
*   [`separator`](src/lib/components/ui/separator)
*   [`tabs`](src/lib/components/ui/tabs)
*   [`textarea`](src/lib/components/ui/textarea)