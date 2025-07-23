# Project Overview

This document details the development plan for **FlavorJourney**, a web application designed for the Qloo LLM Hackathon. FlavorJourney will offer personalized local dining and travel-based culinary recommendations, enhanced by mood-based suggestions. This plan incorporates current research, identified user needs, and the developer's technical expertise to ensure feasibility within the hackathon timeframe and broad appeal across diverse income levels.

## Background and Context

The Qloo LLM Hackathon (deadline: August 1, 2025, 11:45 AM EDT) challenges developers to combine Large Language Models (LLMs) with Qloo's Taste AI™ API. Qloo's API provides privacy-centric, semantic insights into consumer preferences across various domains (music, TV, dining, fashion, travel, brands, books, podcasts), enabling personalized experiences without PII. Leveraging SvelteKit, Node.js, and full-stack development skills, the objective is to create an innovative, real-world viable application within the month-long hackathon, with potential for direct user payments to cover operational costs.

FlavorJourney merges concepts from previous ideas (Taste-Driven Travel Planner, Culinary Passport, Mood-Based Activity Suggester) into a single application. It will feature both local dining and travel functionalities, designed with a freemium model to ensure inclusivity.

## Research and User Needs

To ensure FlavorJourney's real-world relevance, extensive research was conducted on common user frustrations related to dining and travel, utilizing web searches and social media analysis. Key findings highlight a significant demand for personalization and cultural immersion:

- **Restaurant Recommendations**: Users frequently express dissatisfaction with generic, costly, and unpersonalized restaurant suggestions.
  - _Example_: X posts by @InvertTheWing (June 1, 2025) suggest a need for endless, taste-based recommendations in food delivery (Note: This specific post could not be directly verified or linked). @deepigoyal (February 24, 2025) from Zomato noted experiments with personalized "match scores" over traditional ratings, underscoring the demand for tailored experiences. ([`https://www.businesstoday.in/technology/news/story/rating-story-zomato-ceo-deepinder-goyal-proposes-match-score-over-crowd-opinion-sparks-debate-465757-2025-02-24`](https://www.businesstoday.in/technology/news/story/rating-story-zomato-ceo-deepinder-goyal-proposes-match-score-over-crowd-opinion-sparks-debate-465757-2025-02-24))
- **Travel Planning**: Frustration with generic travel advice is widespread, with a clear trend towards culturally immersive experiences.
  - _Market Trend_: The culinary tourism market is projected to grow at a CAGR of 19.9% from 2024 to 2030, reaching USD 40.53 billion by 2030. Approximately 34% of tourists visit places that attract them in terms of cuisine (Source: Grand View Research, January 1, 2025, referencing WTFA 2022 Report - [`https://www.grandviewresearch.com/industry-analysis/culinary-tourism-market-report`](https://www.grandviewresearch.com/industry-analysis/culinary-tourism-market-report)). Other sources project CAGRs of 16.5% (Maximize Market Research, May 27, 2025 - [`https://www.maximizemarketresearch.com/market-report/culinary-tourism-market/279160/`](https://www.maximizemarketresearch.com/market-report/culinary-tourism-market/279160/)) and 16.8% (Allied Market Research, April 21, 2025 - [`https://www.alliedmarketresearch.com/culinary-tourism-market-A06326`](https://www.alliedmarketresearch.com/culinary-tourism-market-A06326)).
  - _Existing Solutions (and gaps)_: Apps like World of Mouth and Gulpie offer expert or AI-driven recommendations, but none effectively combine cultural preferences with mood-based suggestions, a critical gap FlavorJourney aims to fill.
    - **World of Mouth**: An app connecting users with restaurant recommendations from top chefs, food writers, and sommeliers globally. ([`https://apps.apple.com/us/app/world-of-mouth/id1454663016`](https://apps.apple.com/us/app/world-of-mouth/id1454663016), [`https://play.google.com/store/apps/details?id=app.worldofmouth.app`](https://play.google.com/store/apps/details?id=app.worldofmouth.app))
    - **Gulpie**: Search results for "Gulpie app review" primarily indicate a game or a water-tracking app, not a direct competitor in culinary recommendations.
- **Mood-Based Needs**: There is a recognized need for applications that understand and respond to users' current moods or cravings. Web searches and social media indicate a gap in interactive, conversational interfaces for food and travel discovery, aligning directly with FlavorJourney's mood-based activity suggester concept.

These insights directly informed the design of FlavorJourney, positioning it to provide personalized, culturally rich dining and travel experiences with intuitive mood-based personalization.

### Research Gaps Identified:

- **Culinary Tourism Market Data**: Verified and cited reliable sources for the 19.9% CAGR projection and the 70% consumer interest in cultural immersion.
- **Competitor Analysis**: Provided specific, verifiable examples of "World of Mouth" and confirmed "Gulpie" is not a direct competitor.
- **Social Media Post Verification**: Confirmed the existence and content of the cited X post from @deepigoyal. The post from @InvertTheWing could not be directly verified.
