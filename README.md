# FlavorJourney

Everything you need to build a Svelte project, powered by [`sv`](https://github.com/sveltejs/cli).

## App Overview

**FlavorJourney** is a web app designed to help users discover personalized dining experiences, whether locally or through travel, based on their cultural tastes and current mood. It uses Qloo’s Taste AI™ API for recommendations and integrates LLMs for a conversational interface, ensuring inclusivity across income levels with a freemium model.

## Key Features

- **Local Dining and Travel Recommendations**: Users input cultural preferences (e.g., favorite music, books) to get tailored restaurant or destination suggestions, with details like menus or itineraries.
- **Mood-Based Suggestions**: A chat feature lets users describe their mood (e.g., “I want something spicy”), with LLMs suggesting relevant options.
- **Community Features**: Users can share experiences and rate recommendations, fostering engagement.
- **Monetization**: Free tier for basic features, with premium subscriptions ($1–$10/month) for travel itineraries, ad-free experiences, and offline guides, plus pay-what-you-can options.

## Technical Stack and Integration

- **Frontend**: SvelteKit for a responsive, modern UI, leveraging your expertise for quick development.
- **Backend**: SvelteKit as a full stack project, ensuring compatibility with Qloo’s and LLM APIs.
- **APIs**:
  - **Qloo’s Taste AI™ API**: For cultural preference-based recommendations. Research suggests it supports `/search` and `/recs` endpoints, with parameters for categories (e.g., `category: 'restaurants'`, `category: 'travel'`). Assumes sufficient metadata (e.g., name, location, cuisine type) is provided.
  - **LLM API**: Perplexity Sonar AI or Gemini for mood-based chat, chosen for their natural language understanding capabilities. Exa Search can be used for fetching real-time online information if needed.
- **Database**: PostgreSQL for minimal user data (e.g., preferences, community posts), optional for hackathon to keep focus on functionality.
- **Authentication**: JWT or session-based, simplified for hackathon (e.g., no login required for basic use).

## Development Phases

The development of FlavorJourney will proceed through the following phases:

1. **Phase 1: Setup and Integration**
   - Initialize SvelteKit project and Node.js backend.
   - Obtain and integrate Qloo’s API keys, test `/search` and `/recs` endpoints.
   - Set up LLM API for chat functionality, test basic mood-based suggestions.

2. **Phase 2: Core Features Implementation**
   - Implement user preference input and local dining recommendations using Qloo’s API.
   - Build travel recommendation feature, generating basic itineraries with LLM.
   - Test integration for seamless user experience.

3. **Phase 3: Additional Features and Refinement**
   - Enhance mood-based suggestions, ensuring integration with Qloo’s recommendations.
   - Add community features (e.g., basic sharing and rating).
   - Implement monetization logic (e.g., subscription tiers, pay-what-you-can).

4. **Phase 4: Testing and Deployment**
   - Test the app thoroughly with sample data, ensuring functionality across devices.
   - Deploy frontend on Vercel and backend on Heroku, ensuring compatibility.
   - Prepare submission materials (e.g., demo video, documentation).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```bash
# create a new project in the current directory
npx sv create

# create a new project in my-app
npx sv create my-app
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.
