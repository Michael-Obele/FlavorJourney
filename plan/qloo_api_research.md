# Qloo API Research for LLM Hackathon

This document provides a comprehensive overview of the Qloo API for the LLM Hackathon, synthesized from various provided research materials.

## 1. Qloo LLM Hackathon Overview

**Deadline:** August 1, 2025 @ 11:45am EDT

### Overview

A month-long global hackathon for developers, builders, and creatives to build applications at the intersection of Large Language Models (LLMs) and the Qloo API. The goal is to explore the possibilities of combining cultural knowledge with consumer behavior to create intelligent systems.

### What to Build

Create an original project that integrates an LLM (like GPT, Claude, or Gemini) with Qloo’s Taste AI™ API. The project should showcase how Qloo’s API connects behavior with cultural context to understand user preferences across various domains.

**Potential Use Cases:**

- Cultural recommendation engines
- Taste-based personal assistants
- Discovery or research tools
- Smart lifestyle/travel/dining/fashion interfaces
- Market-matching or audience prediction models
- Personalized content or product experiences

### Submission Requirements

- **Project:** A functional application built with the required developer tools.
- **Text Description:** An explanation of your project's features and functionality.
- **Demo Video:** A video (under 3 minutes) showcasing the project's functionality. The video must be publicly visible on YouTube, Vimeo, Facebook Video, or Youku.
- **Demo App URL:** A link to your functional demo application.
- **Public Code Repository:** A URL to your public code repository (e.g., GitHub) with documentation.

### Rules

- **Eligibility:** Ages 18 and older. Open to all countries/territories with standard exceptions.
- **Team Size:** Up to 4 members. Solo submissions are also welcome.

### Prizes

- **Grand Prize:** $10,000 in cash (1 winner)
- **Honorable Mention:** $5,000 in cash (3 winners)
- **Jason Calacanis Bonus Prize:** $25,000 investment (1 winner, details to be provided by Jason Calacanis and his team).

### Judging Criteria

- **Intelligent & Thoughtful Use of LLMs:** How effectively the project uses an LLM and how Qloo's API enhances its capabilities.
- **Integration with Qloo’s API:** How well the project incorporates the Qloo Taste AI™ API and showcases its unique value.
- **Technical Implementation & Execution:** The quality of the code and application.
- **Originality & Creativity:** The novelty and insightfulness of the concept and its use case.
- **Potential for Real-World Application:** The project's potential to address a real need or evolve into a useful product.

---

## 2. Qloo API General Overview

Welcome to the Qloo LLM Hackathon! This guide covers the basics of using the Qloo API.

### Hackathon API Access

During the hackathon, all requests must be made to the dedicated hackathon URL:

`https://hackathon.api.qloo.com`

Your hackathon API keys **will not work** against the staging (`https://staging.api.qloo.com`) or production (`https://api.qloo.com`) environments.

### Available API Suites

During the hackathon, all [Qloo API endpoints](https://docs.qloo.com/reference/api-overview#/) are available.

- **Insights API**: The primary way to generate recommendations and insights.
- **Supporting APIs**: Lookup and analysis endpoints to validate parameters and explore audiences and tags.
- **Entity Data APIs**: Search and retrieve detailed entity-level data to use as inputs or for analysis.

### Endpoint Overview

#### Insights API

The Insights API is the core of Qloo’s platform, designed to deliver taste-driven recommendations, insights, and analysis across all supported data categories.

**Key Use Cases:**

- **Recommendation Insights**: Get top recommendations for any entity type.
- **Demographic Insights**: See how different audiences align with an entity or tag.
- **Heatmaps**: Visualize geographic affinity data.
- **Location-Based Insights**: Tailor results by geography.
- **Taste Analysis**: Retrieve metadata and taste-related tags.

#### Supporting APIs

Qloo provides additional APIs to complement Insights by helping you discover valid input values, analyze trends, and compare entities or audiences.

**Lookup APIs**
Use these APIs to search for and validate IDs you can pass as parameters to the Insights API.

- **Entity Search**: `GET /search`
- **Entity Search by ID**: `GET /entities`
- **Find Audiences**: `GET /audiences`
- **Get Audience Types**: `GET /audience-types`
- **Tags Search**: `GET /tags`
- **Tag Types**: `GET /tag-types`

**Analysis & Trends APIs**
Use these APIs to analyze, compare, and monitor entity or audience performance over time.

- **Analysis**: `GET /analysis`
- **Analysis Compare**: `GET /analysis/compare`
- **Trending Entities**: `GET /trends/{category}`
- **Week-Over-Week Trending Data**: `GET /trends/{entity}`

---

## 3. Insights API Deep Dive

Qloo’s Insights API helps uncover the underlying factors that shape human preferences, offering cultural intelligence about how people relate to different entities like brands, artists, destinations, and more.

### How to Use the Insights API

The Insights API allows you to get recommendations and affinity scores based on a variety of inputs. You provide signals (like user interests and demographics) and apply filters to get tailored results.

**Recommended Flow:**

1.  Use supporting endpoints to find valid IDs:
    - [`/search`](#search-endpoint) to look up Qloo entity IDs by name.
    - [`/v2/tags`](#v2tags-endpoint) to find valid tag IDs for interests, cuisines, or genres.
    - [`/v2/audiences`](#v2audiences-endpoint) to find audience IDs for demographics.
2.  Pass these IDs as signal or filter parameters in your `/v2/insights` request.
3.  Ensure the parameters you use are valid for your selected `filter.type` using the [Entity Type Parameter Guide](#parameters-by-entity-type).

### Key Concepts

- **Signals:** Inputs that influence recommendation scores (e.g., entities, tags, demographics).
- **Filters:** Criteria to narrow the result set (e.g., entity type, location, release date).
- **Explainability:** A feature providing metadata on why a recommendation was made.

### Entity Types

Every request to the Insights API must include `filter.type` to specify the entity category. Supported categories are:

- `urn:entity:artist`
- `urn:entity:book`
- `urn:entity:brand`
- `urn:entity:destination`
- `urn:entity:movie`
- `urn:entity:person`
- `urn:entity:place`
- `urn:entity:podcast`
- `urn:entity:tv_show`
- `urn:entity:video_game`

**Note:** The supported types for `/search` are not the same as `filter.type` in `/v2/insights`.

### Example Request

```shell
curl --request GET \
     --url 'https://hackathon.api.qloo.com/v2/insights?filter.type=urn%3Aentity%3Aartist' \
     --header 'accept: application/json' \
     --header 'x-api-key: YOUR_HACKATHON_API_KEY'
```

---

## 4. Supporting API Endpoints

### `/search` Endpoint

Allows you to search for an entity by its name or other properties.

**Parameters:**

| Parameter                      | Type               | Description                                                          |
| :----------------------------- | :----------------- | :------------------------------------------------------------------- |
| `q`                            | `string`           | The text to search against.                                          |
| `types`                        | `array of strings` | The category to search against.                                      |
| `filter.location`              | `string`           | A geolocational position to base searches on ("latitude,longitude"). |
| `filter.radius`                | `float`            | Max distance in miles from the location (Default: 10).               |
| `filter.exists`                | `array of strings` | Filter by existential property check like `external.resy`.           |
| `filter.tags`                  | `array of strings` | Filter results by a tag.                                             |
| `filter.rating`                | `double`           | Filter by the lowest desired business rating (0-5).                  |
| `filter.exclude.tags`          | `array of strings` | Exclude entities from results with tags.                             |
| `filter.popularity`            | `double`           | Minimum popularity value (0-1).                                      |
| `operator.filter.tags`         | `string`           | "intersection" or "union" (default).                                 |
| `operator.filter.exclude.tags` | `string`           | "intersection" or "union" (default).                                 |
| `page`                         | `int32`            | Page number (Default: 1).                                            |
| `take`                         | `integer`          | Number of records to return (Default: 20).                           |
| `sort_by`                      | `string`           | `match`, `distance`, or `popularity` (Default: `match`).             |

### `/v2/tags` Endpoint

Used to search for and retrieve tags.

**Parameters:**

| Parameter | Type    | Description                                            |
| :-------- | :------ | :----------------------------------------------------- |
| `q`       | string  | The search query.                                      |
| `type`    | string  | The category to search within (e.g., `music`, `film`). |
| `limit`   | integer | Max number of results.                                 |

### `/v2/audiences` Endpoint

Used to retrieve audience data.

**Request:** `GET https://hackathon.api.qloo.com/v2/audiences`

---

## 5. API Parameters Reference

This section provides a comprehensive list of parameters for the Insights API.

- **Filters**: Specify _what kind of results you want_.
- **Signals**: Specify _what to base the recommendations on_.
- **Output**: Specify _how the results are presented_.

### Full Parameter List

| Parameter Name                                 | Type               | Description                                                      |
| ---------------------------------------------- | ------------------ | ---------------------------------------------------------------- |
| `filter.address`                               | string             | Filter by address using a partial string query.                  |
| `filter.audience.types`                        | array of strings   | Filter by a list of audience types.                              |
| `filter.content_rating`                        | string             | Filter by a comma-separated list of content ratings (MPAA).      |
| `filter.date_of_birth.max`                     | string, YYYY-MM-DD | Filter by the most recent date of birth.                         |
| `filter.date_of_birth.min`                     | string, YYYY-MM-DD | Filter by the earliest date of birth.                            |
| `filter.date_of_death.max`                     | string, YYYY-MM-DD | Filter by the most recent date of death.                         |
| `filter.date_of_death.min`                     | string, YYYY-MM-DD | Filter by the earliest date of death.                            |
| `filter.entities`                              | string             | Filter by a comma-separated list of entity IDs.                  |
| `filter.exclude.entities`                      | string             | A comma-separated list of entity IDs to remove from the results. |
| `filter.exclude.tags`                          | string             | Exclude entities associated with a comma-separated list of tags. |
| `operator.exclude.tags`                        | string             | "union" (default) or "intersection".                             |
| `filter.external.exists`                       | string             | Filter by external keys (`resy`, `michelin`, `tablet`).          |
| `operator.filter.external.exists`              | string             | "union" (default) or "intersection".                             |
| `filter.external.resy.count.max`               | integer            | Max Resy rating count.                                           |
| `filter.external.resy.count.min`               | integer            | Min Resy rating count.                                           |
| `filter.external.resy.party_size.max`          | integer            | Max party size for Resy.                                         |
| `filter.external.resy.party_size.min`          | integer            | Min party size for Resy.                                         |
| `filter.external.resy.rating.max`              | float              | Max Resy rating (1-5).                                           |
| `filter.external.resy.rating.min`              | float              | Min Resy rating (1-5).                                           |
| `filter.external.tripadvisor.rating.count.max` | integer            | Max Tripadvisor review count.                                    |
| `filter.external.tripadvisor.rating.count.min` | integer            | Min Tripadvisor review count.                                    |
| `filter.external.tripadvisor.rating.max`       | float              | Max Tripadvisor rating.                                          |
| `filter.external.tripadvisor.rating.min`       | float              | Min Tripadvisor rating.                                          |
| `filter.finale_year.max`                       | integer            | Latest finale year for a TV show.                                |
| `filter.finale_year.min`                       | integer            | Earliest finale year for a TV show.                              |
| `filter.gender`                                | string             | Filter by gender identity.                                       |
| `filter.geocode.admin1_region`                 | string             | Filter by state/region.                                          |
| `filter.geocode.admin2_region`                 | string             | Filter by county/borough.                                        |
| `filter.geocode.country_code`                  | string             | Filter by two-letter country code.                               |
| `filter.geocode.name`                          | string             | Filter by city/town name.                                        |
| `filter.hotel_class.max`                       | integer            | Max hotel class (1-5).                                           |
| `filter.hotel_class.min`                       | integer            | Min hotel class (1-5).                                           |
| `filter.hours`                                 | string             | Day of the week a place must be open.                            |
| `filter.location`                              | string             | Filter by WKT `POINT`, `POLYGON`, or locality ID.                |
| `filter.exclude.location`                      | string             | Exclude results within a location.                               |
| `filter.location.query`                        | string             | Search for a locality by name.                                   |
| `filter.exclude.location.query`                | string             | Exclude results by locality name.                                |
| `filter.location.geohash`                      | string             | Filter by geohash prefix.                                        |
| `filter.exclude.location.geohash`              | string             | Exclude by geohash prefix.                                       |
| `filter.location.radius`                       | integer            | Radius in meters for location filters.                           |
| `filter.popularity.max`                        | number             | Max popularity percentile (0-1).                                 |
| `filter.popularity.min`                        | number             | Min popularity percentile (0-1).                                 |
| `filter.price_level.max`                       | integer            | Max price level (1-4).                                           |
| `filter.price_level.min`                       | integer            | Min price level (1-4).                                           |
| `filter.publication_year.max`                  | number             | Latest publication year for a book.                              |
| `filter.publication_year.min`                  | number             | Earliest publication year for a book.                            |
| `filter.rating.max`                            | number             | Max Qloo rating (0-5).                                           |
| `filter.rating.min`                            | number             | Min Qloo rating (0-5).                                           |
| `filter.release_year.max`                      | integer            | Latest release year.                                             |
| `filter.release_year.min`                      | integer            | Earliest release year.                                           |
| `filter.tags`                                  | string             | Filter by a comma-separated list of tag IDs.                     |
| `operator.filter.tags`                         | string             | "union" (default) or "intersection".                             |
| `filter.type`                                  | string             | **Required.** The entity type to return.                         |
| `signal.interests.entities`                    | string             | List of entity IDs to influence recommendations.                 |
| `signal.interests.tags`                        | string             | List of tag IDs to influence recommendations.                    |
| `signal.demographics.age`                      | string             | Influence by age ranges.                                         |
| `signal.demographics.gender`                   | string             | Influence by gender.                                             |
| `signal.location`                              | string             | Influence by geolocation.                                        |
| `feature.explainability`                       | boolean            | Set to `true` for recommendation explanations.                   |
| `diversify.by`                                 | string             | Group results to avoid similarity.                               |
| `take`                                         | integer            | Number of results to return.                                     |
| `page`                                         | integer            | Page number for pagination.                                      |
| `sort_by`                                      | string             | `affinity` (default) or `distance`.                              |

### Parameters by Entity Type

This table summarizes the supported signals and filters for each entity type.

| Parameter                                      | Artist | Book | Brand | Destination | Movie | Person | Place | Podcast | TV Show | Video Game |
| :--------------------------------------------- | :----: | :--: | :---: | :---------: | :---: | :----: | :---: | :-----: | :-----: | :--------: |
| **Filters**                                    |        |      |       |             |       |        |       |         |         |            |
| `filter.type`                                  |   ✓    |  ✓   |   ✓   |      ✓      |   ✓   |   ✓    |   ✓   |    ✓    |    ✓    |     ✓      |
| `filter.address`                               |        |      |       |             |       |        |   ✓   |         |         |            |
| `filter.content_rating`                        |        |      |       |             |   ✓   |        |       |         |    ✓    |            |
| `filter.date_of_birth.max`                     |        |      |       |             |       |   ✓    |       |         |         |            |
| `filter.date_of_birth.min`                     |        |      |       |             |       |   ✓    |       |         |         |            |
| `filter.date_of_death.max`                     |        |      |       |             |       |   ✓    |       |         |         |            |
| `filter.date_of_death.min`                     |        |      |       |             |       |   ✓    |       |         |         |            |
| `filter.exclude.entities`                      |   ✓    |  ✓   |   ✓   |      ✓      |   ✓   |   ✓    |   ✓   |    ✓    |    ✓    |     ✓      |
| `filter.exclude.location.geohash`              |        |      |       |      ✓      |       |        |   ✓   |         |         |            |
| `filter.exclude.tags`                          |   ✓    |  ✓   |   ✓   |      ✓      |   ✓   |   ✓    |   ✓   |    ✓    |    ✓    |     ✓      |
| `filter.external.exists`                       |   ✓    |  ✓   |   ✓   |      ✓      |   ✓   |   ✓    |   ✓   |    ✓    |    ✓    |     ✓      |
| `filter.external.tripadvisor.rating.count.max` |        |      |       |             |       |        |   ✓   |         |         |            |
| `filter.external.tripadvisor.rating.count.min` |        |      |       |             |       |        |   ✓   |         |         |            |
| `filter.external.tripadvisor.rating.max`       |        |      |       |             |       |        |   ✓   |         |         |            |
| `filter.external.tripadvisor.rating.min`       |        |      |       |             |       |        |   ✓   |         |         |            |
| `filter.finale_year.max`                       |        |      |       |             |       |        |       |         |    ✓    |            |
| `filter.finale_year.min`                       |        |      |       |             |       |        |       |         |    ✓    |            |
| `filter.gender`                                |        |      |       |             |       |   ✓    |       |         |         |            |
| `filter.geocode.admin1_region`                 |        |      |       |      ✓      |       |        |   ✓   |         |         |            |
| `filter.geocode.admin2_region`                 |        |      |       |      ✓      |       |        |   ✓   |         |         |            |
| `filter.geocode.country_code`                  |        |      |       |      ✓      |       |        |   ✓   |         |         |            |
| `filter.geocode.name`                          |        |      |       |      ✓      |       |        |   ✓   |         |         |            |
| `filter.hotel_class.max`                       |        |      |       |             |       |        |   ✓   |         |         |            |
| `filter.hotel_class.min`                       |        |      |       |             |       |        |   ✓   |         |         |            |
| `filter.hours`                                 |        |      |       |             |       |        |   ✓   |         |         |            |
| `filter.latest_known_year.max`                 |        |      |       |             |       |        |       |         |    ✓    |            |
| `filter.latest_known_year.min`                 |        |      |       |             |       |        |       |         |    ✓    |            |
| `filter.location`                              |        |      |       |      ✓      |       |        |   ✓   |         |         |            |
| `filter.location.geohash`                      |        |      |       |      ✓      |       |        |   ✓   |         |         |            |
| `filter.location.radius`                       |        |      |       |      ✓      |       |        |   ✓   |         |         |            |
| `filter.parents.types`                         |   ✓    |  ✓   |   ✓   |      ✓      |   ✓   |   ✓    |   ✓   |    ✓    |    ✓    |     ✓      |
| `filter.popularity.max`                        |   ✓    |  ✓   |   ✓   |      ✓      |   ✓   |   ✓    |   ✓   |    ✓    |    ✓    |     ✓      |
| `filter.popularity.min`                        |   ✓    |  ✓   |   ✓   |      ✓      |   ✓   |   ✓    |   ✓   |    ✓    |    ✓    |     ✓      |
| `filter.price_level.max`                       |        |      |       |             |       |        |   ✓   |         |         |            |
| `filter.price_level.min`                       |        |      |       |             |       |        |   ✓   |         |         |            |
| `filter.price_range.from`                      |        |      |       |             |       |        |   ✓   |         |         |            |
| `filter.price_range.to`                        |        |      |       |             |       |        |   ✓   |         |         |            |
| `filter.properties.business_rating.max`        |        |      |       |             |       |        |   ✓   |         |         |            |
| `filter.properties.business_rating.min`        |        |      |       |             |       |        |   ✓   |         |         |            |
| `filter.properties.resy.rating.max`            |        |      |       |             |       |        |   ✓   |         |         |            |
| `filter.properties.resy.rating.min`            |        |      |       |             |       |        |   ✓   |         |         |            |
| `filter.publication_year.max`                  |        |  ✓   |       |             |       |        |       |         |         |            |
| `filter.publication_year.min`                  |        |  ✓   |       |             |       |        |       |         |         |            |
| `filter.rating.max`                            |        |      |       |             |   ✓   |        |       |         |    ✓    |            |
| `filter.rating.min`                            |        |      |       |             |   ✓   |        |       |         |    ✓    |            |
| `filter.references_brand`                      |        |      |       |             |       |        |   ✓   |         |         |            |
| `filter.release_country`                       |        |      |       |             |   ✓   |        |       |         |    ✓    |            |
| `filter.release_year.max`                      |        |      |       |             |   ✓   |        |       |         |    ✓    |            |
| `filter.release_year.min`                      |        |      |       |             |   ✓   |        |       |         |    ✓    |            |
| `filter.results.entities`                      |   ✓    |  ✓   |   ✓   |      ✓      |   ✓   |   ✓    |   ✓   |    ✓    |    ✓    |     ✓      |
| `filter.results.entities.query`                |   ✓    |  ✓   |   ✓   |      ✓      |   ✓   |   ✓    |   ✓   |    ✓    |    ✓    |     ✓      |
| `filter.resy.rating.party.max`                 |        |      |       |             |       |        |   ✓   |         |         |            |
| `filter.resy.rating.party.min`                 |        |      |       |             |       |        |   ✓   |         |         |            |
| `filter.resy.rating_count.max`                 |        |      |       |             |       |        |   ✓   |         |         |            |
| `filter.resy.rating_count.min`                 |        |      |       |             |       |        |   ✓   |         |         |            |
| `filter.tags`                                  |   ✓    |  ✓   |   ✓   |      ✓      |   ✓   |   ✓    |   ✓   |    ✓    |    ✓    |     ✓      |
| **Signals**                                    |        |      |       |             |       |        |       |         |         |            |
| `signal.demographics.age`                      |   ✓    |  ✓   |   ✓   |      ✓      |   ✓   |   ✓    |   ✓   |    ✓    |    ✓    |     ✓      |
| `signal.demographics.audiences`                |   ✓    |  ✓   |   ✓   |      ✓      |   ✓   |   ✓    |   ✓   |    ✓    |    ✓    |     ✓      |
| `signal.demographics.audiences.weight`         |   ✓    |  ✓   |   ✓   |      ✓      |   ✓   |   ✓    |   ✓   |    ✓    |    ✓    |     ✓      |
| `signal.demographics.gender`                   |   ✓    |  ✓   |   ✓   |      ✓      |   ✓   |   ✓    |   ✓   |    ✓    |    ✓    |     ✓      |
| `signal.interests.entities`                    |   ✓    |  ✓   |   ✓   |      ✓      |   ✓   |   ✓    |   ✓   |    ✓    |    ✓    |     ✓      |
| `signal.interests.tags`                        |   ✓    |  ✓   |   ✓   |      ✓      |   ✓   |   ✓    |   ✓   |    ✓    |    ✓    |     ✓      |
| **Operators**                                  |        |      |       |             |       |        |       |         |         |            |
| `operator.exclude.tags`                        |   ✓    |  ✓   |   ✓   |      ✓      |   ✓   |   ✓    |   ✓   |    ✓    |    ✓    |     ✓      |
| `operator.filter.external.exists`              |   ✓    |  ✓   |   ✓   |      ✓      |   ✓   |   ✓    |   ✓   |    ✓    |    ✓    |     ✓      |
| `operator.filter.release_country`              |        |      |       |             |   ✓   |        |       |         |    ✓    |            |
| `operator.filter.tags`                         |   ✓    |  ✓   |   ✓   |      ✓      |   ✓   |   ✓    |   ✓   |    ✓    |    ✓    |     ✓      |
| **Other**                                      |        |      |       |             |       |        |       |         |         |            |
| `bias.trends`                                  |   ✓    |  ✓   |   ✓   |      ✓      |   ✓   |   ✓    |   ✓   |    ✓    |    ✓    |     ✓      |
| `offset`                                       |   ✓    |  ✓   |   ✓   |      ✓      |   ✓   |   ✓    |   ✓   |    ✓    |    ✓    |     ✓      |
| `take`                                         |   ✓    |  ✓   |   ✓   |      ✓      |   ✓   |   ✓    |   ✓   |    ✓    |    ✓    |     ✓      |

---

## 6. Common Issues & FAQ

### Common Errors

- **404 or no response**: Ensure you include an endpoint after the base URL (e.g., `/v2/insights`).
- **"at least one valid signal or filter is required"**:
  - Use `GET` for most `/v2/insights` requests. `POST` is only for specific advanced parameters.
  - Ensure tag IDs are valid by fetching them from `/v2/tags`.
- **401 or unauthorized**: Make sure you are using the `hackathon.api.qloo.com` URL with your hackathon API key.

### FAQ

- **How do I get an API key?**
  You’ll usually receive your API key within one business day after signing up for the hackathon.
- **Do I need to bring my own data?**
  No, Qloo provides all the data you need.
- **Can I limit the fields in the API response?**
  No, the API returns the full response. You can extract the fields you need on your end.
- **How do I find tags for a specific category?**
  Use the [`/v2/tags` endpoint](#v2tags-endpoint) to search for relevant tags.
- **How do I know which parameters to use?**
  Check the [Parameters by Entity Type guide](#parameters-by-entity-type) to see which signals and filters are valid for your chosen entity type.

### Helpful Resources

- [Hackathon Sign-Up](https://qloo-hackathon.devpost.com/)
- [Qloo API Documentation](https://docs.qloo.com/reference/api-overview#/)
- [#qloo-hackathon Discord Channel](https://discord.com/channels/1367906548264992768/1367906751969497159) for help.

### Constructing Tag URNs

The Qloo API requires full URNs (Uniform Resource Names) for tags, not simple user-input strings. This was identified through recent test results where using simple strings resulted in a `400 Bad Request` error. A successful call used specific URNs, confirming this requirement.

The likely structure for a Qloo tag URN is `urn:tag:<category>:<name>`.

**Examples of valid tag URNs:**

- Cuisine: `urn:tag:cuisine:italian`
- Accessibility: `urn:tag:accessibility:place:wheelchair_accessible_entrance`
- Offerings: `urn:tag:offerings:place:vegan_options`
- Dining Options: `urn:tag:dining_options:place:brunch`
