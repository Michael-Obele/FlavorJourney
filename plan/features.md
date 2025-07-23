# Features

## Detailed Features and Implementation

This section details FlavorJourney's core features, their implementation approach, and how they cater to various income levels, ensuring both functionality and inclusivity.

### 1. User Preference Input

- **Description**: Users provide their favorite cultural entities (e.g., music artists, books, movies) to create a personalized taste profile.
- **Implementation**: A SvelteKit form will be used, featuring dropdowns or search fields for easy input. During the hackathon, preferences will be stored in local storage or a minimal database to maintain stateless operation.
- **Qloo’s API Usage**: The `/search` endpoint will be utilized to retrieve entity IDs based on user input, which are crucial for generating tailored recommendations.

### 2. Local Dining Recommendations

- **Description**: The application recommends local restaurants, personalized by cultural preferences, with options for dietary and price filters.
- **Implementation**: Qloo’s `/recs` endpoint will be called with `category: 'restaurants'` and the user’s entity IDs. Displayed details will include restaurant name, location, and cuisine type, assuming sufficient metadata from Qloo.
- **Inclusivity**: Basic recommendations are available in the free tier. A premium tier ($1/month) unlocks advanced filtering capabilities for price range and dietary restrictions.

### 3. Travel-Based Recommendations

- **Description**: FlavorJourney suggests travel destinations and crafts culinary itineraries based on users' cultural tastes.
- **Implementation**: Qloo’s `/recs` endpoint with `category: 'travel'` will provide destination recommendations. An integrated LLM (e.g., Perplexity Sonar AI or Gemini) will generate detailed itineraries, including must-visit restaurants and food markets.
- **Inclusivity**: Travel features are part of the premium tier ($5–$10/month), targeting users with higher income, while free-tier users can still explore basic destination ideas.

### 4. Mood-Based Suggestions

- **Description**: A conversational chat interface allows users to express their mood or cravings, receiving relevant dining or travel suggestions from LLMs.
- **Implementation**: An LLM API (e.g., Perplexity Sonar AI or Gemini) will power the chat. The LLM interprets mood inputs (e.g., “I want something spicy”), and suggests cultural entities or directly recommends dining/travel options. Efforts will be made to map LLM outputs to Qloo’s `/search` or `/recs` for enhanced personalization where possible.
- **Inclusivity**: The free tier includes basic mood-based local dining suggestions, with premium tiers extending this functionality to travel options.

### 5. Community Features

- **Description**: Users can share their experiences, rate recommendations, and engage with a community of fellow food and travel enthusiasts.
- **Implementation**: A simple PostgreSQL database will store user-generated content, with SvelteKit forms facilitating submissions. Shared content will be displayed on a dedicated community page. (This feature is optional for the hackathon and will be prioritized if time permits.)
- **Inclusivity**: These features are free for all users, designed to foster broad engagement regardless of income level.

### 6. Monetization

- **Description**: FlavorJourney employs a freemium model with tiered subscriptions and pay-what-you-can options.
- **Implementation**: Stripe will manage subscriptions. The free tier offers basic features. A basic paid tier ($1/month) provides enhanced local features, while a premium tier ($5–$10/month) includes all travel and advanced functionalities. A custom payment form will support pay-what-you-can options for downloadable guides.
- **Inclusivity**: This flexible model ensures accessibility for users with varying budgets, allowing even small contributions to cover server costs.

### Research Findings and Updates:

- **Qloo API Metadata Details**: Direct JSON schema documentation for Qloo's `/search` and `/recs` endpoints was not publicly available through web searches. We will proceed with the assumption that Qloo returns common metadata fields (e.g., name, location, cuisine type, genre, release year) for entities and recommendations. The precise schema will be inferred during the API integration phase by inspecting the actual JSON responses. This may require initial manual inspection of API calls or using tools like Postman to understand the response structure.
- **LLM Integration with Qloo API**: Mapping LLM outputs to Qloo's API for personalized recommendations is feasible. This will involve:
  1. **Entity Extraction**: Using the LLM to extract relevant entities (e.g., specific artists, movies, books) from user's mood-based input.
  2. **Intent Recognition**: Identifying whether the user's intent is to search for a specific entity (using `/search`) or to get recommendations based on a category and extracted entities (using `/recs`).
  3. **Dynamic Query Construction**: Constructing Qloo API queries based on the extracted entities and recognized intent. For example, if a user expresses a mood, the LLM could identify relevant cultural entities and then call Qloo's `/recs` endpoint with those entities and a relevant category.
  The feasibility of mapping LLM outputs to Qloo's API will largely depend on the flexibility and richness of Qloo's API parameters and the LLM's ability to accurately parse and categorize user input into structured data suitable for Qloo's endpoints.
- **Community Features (Hackathon Scope)**: This feature remains optional for the hackathon. A basic implementation with PostgreSQL for storing user-generated content will be considered if time permits, focusing on core recommendation features first.
