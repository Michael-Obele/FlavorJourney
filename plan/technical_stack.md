# Technical Stack

## Technical Stack and Integration

This section outlines the core technologies and their integration within the FlavorJourney application.

- **Frontend**: SvelteKit will be used to develop a responsive and modern user interface, leveraging its reactivity and component-based architecture for rapid development.
- **Backend**: SvelteKit will serve as a full-stack framework, managing server-side logic and ensuring seamless compatibility with external APIs.
- **APIs**:
  - **Qloo’s Taste AI™ API**: This API is central to providing cultural preference-based recommendations. It supports `/search` and `/recs` endpoints with categories (e.g., `category: 'restaurants'`, `category: 'travel'`). The integration assumes Qloo provides sufficient metadata (e.g., name, location, cuisine type) for effective display.
  - **LLM API**: Perplexity Sonar AI or Gemini will power the mood-based chat functionality, chosen for their advanced natural language understanding capabilities. Exa Search can be integrated for fetching real-time online information as needed.
- **Database**: PostgreSQL will store minimal user data, such as preferences and community posts. While essential for full functionality, its implementation can be streamlined or partially deferred during the hackathon to focus on core features.
- **Authentication**: A simplified JWT or session-based authentication system will be implemented for the hackathon, potentially without requiring full user login for basic features.

## Development Steps

The development process will adopt a project-based methodology, prioritizing feature completion and flexibility over rigid timelines. This approach ensures robust core functionalities before moving onto enhancements.

### 1. Project Setup & API Integration

- Initialize the SvelteKit project.
- Integrate Qloo’s API: obtain API keys and thoroughly test `/search` and `/recs` endpoints.
- Set up the LLM API for chat functionality, including testing basic mood-based suggestions.

### 2. Core Features Implementation

- **User Preference Input**: Develop SvelteKit forms for capturing and managing user cultural preferences.
- **Local Dining Recommendations**: Implement the Qloo `/recs` endpoint to generate and display restaurant suggestions.
- **Mood-Based Suggestions**: Integrate the LLM chat interface to provide mood-driven recommendations.

### 3. Advanced Features & Refinement

- **Travel Recommendations**: Develop and integrate travel destination suggestions using Qloo’s API.
- **Itinerary Generation**: Implement LLM functionality for generating dynamic travel itineraries.
- **Monetization Logic**: Implement subscription tiers and pay-what-you-can options using Stripe.

### 4. Polish & Deployment

- **Testing**: Conduct comprehensive testing across all features to ensure stability and functionality.
- **Deployment**: Deploy the frontend (e.g., Vercel) and backend (e.g., Heroku) components.
- **Documentation & Submission**: Prepare all necessary project documentation and materials for hackathon submission.

### Research Findings and Updates:

- **Qloo API Metadata Schema**: Direct JSON schema documentation for Qloo's `/search` and `/recs` endpoints was not publicly available through web searches. We will proceed with the assumption that Qloo returns common metadata fields (e.g., name, location, cuisine type, genre, release year) for entities and recommendations. The precise schema will be inferred during the API integration phase by inspecting the actual JSON responses. This will ensure proper data handling and display in the frontend.
- **LLM API Rate Limits and Cost**:
  - **Perplexity Sonar AI**: Pricing is typically token-based ($3/million input tokens, $15/million output tokens for Sonar Pro). Rate limits are tier-based, with specific details available on their API settings page (not directly scraped). Integration requires an API key.
  - **Gemini API**: Offers a free tier with lower rate limits (e.g., 5 RPM for testing). Paid tiers support higher rates (e.g., up to 2,000 requests per minute). Pricing is generally usage-based, though specific enterprise pricing varies. Integration is via Google Cloud or Google AI Studio APIs.
- **Database Schema for User Data**: Develop a detailed PostgreSQL database schema for storing user preferences, community posts, and authentication-related data, considering scalability and data integrity.
- **Authentication Strategy Deep Dive**: Refine the authentication strategy, specifying whether JWT or session-based, and outlining the exact flow for user registration, login, and session management within the SvelteKit environment. This includes considering the chosen database integration.
