# 4. User Experience (UX) and Design

### 4.1. User Journey Mapping

The primary user journey for FlavorJourney begins with **onboarding**, where new users are greeted with an intuitive interface to input their cultural preferences (favorite music, books, films, etc.). This step is designed to be engaging, almost like a game, encouraging users to explore their tastes. Once preferences are set, users can immediately access **personalized local dining recommendations**. They can browse these suggestions, view details, and potentially apply filters. If they're unsure what they want or have a specific craving, they can switch to the **mood-based chat interface**. Here, they describe their mood (e.g., "feeling adventurous," "need comfort food"), and the app responds with tailored suggestions. For users planning trips, the journey extends to **travel recommendations**. They can explore destinations based on their cultural profile and then generate detailed **culinary itineraries** for their chosen location. Throughout the app, a clean and visually appealing design will guide users, with clear calls to action and easy navigation. Community features, if implemented, will allow users to share their experiences, rate places, and discover new options through peer reviews, adding a social layer to their journey. The overall flow is designed to be seamless, reducing decision fatigue and making discovery enjoyable.

### 4.2. Wireframes and UI Design Principles

While detailed wireframes are part of the design phase, the UI design for FlavorJourney will adhere to several core principles to ensure a positive user experience, especially within the hackathon's tight timeframe. The primary principle is **simplicity and clarity**. Interfaces will be uncluttered, with a focus on essential information and clear navigation. For example, the recommendation screens will prominently display key details like restaurant names, cuisine types, and ratings, using cards or lists for easy scanning. The mood-based chat interface will be designed for natural conversation, with clear input fields and distinct visual cues for user messages and app responses. **Consistency** will be maintained across all screens in terms of typography, color scheme (likely a warm, appetizing palette), and component behavior. **Visual hierarchy** will guide users' attention to the most important elements on each page. For instance, call-to-action buttons for generating recommendations or viewing details will be visually distinct. **Feedback** will be provided for user actions, such as loading indicators when fetching data or success/error messages for submissions. The design will aim for an aesthetic that is both modern and inviting, reflecting the app's focus on culinary exploration and cultural discovery. **Tailwind CSS** will be instrumental in rapidly implementing these design principles with a utility-first approach .

### 4.3. Accessibility and Inclusivity Considerations

FlavorJourney aims to be accessible and inclusive to the widest possible range of users. While a full accessibility audit might be beyond the scope of a hackathon MVP, several key considerations will be incorporated. **Semantic HTML** will be used throughout the SvelteKit frontend to ensure proper structure and meaning for screen readers and other assistive technologies. This includes using appropriate heading tags (`h1`, `h2`, etc.), lists for collections of items, and `alt` text for images. **Keyboard navigation** will be tested to ensure all interactive elements are reachable and usable without a mouse. **Color contrast** will be checked to meet WCAG guidelines, ensuring text is readable against background colors for users with visual impairments. Forms, such as the preference input and chat interface, will have clearly associated labels. For the mood-based chat, while natural language input is the primary mode, consideration will be given to alternative input methods if time permits, such as selecting from a list of common moods or cravings, which can also benefit users who prefer more structured input. The **freemium model** itself is a core aspect of inclusivity, ensuring that valuable personalized recommendations are available to users regardless of their financial situation. Language will be kept clear and concise to aid comprehension.

### 4.4. Responsive Design for Multiple Devices

FlavorJourney will be designed with a **mobile-first approach**, ensuring a seamless and optimized experience across a variety of devices, including smartphones, tablets, and desktops. **SvelteKit's built-in capabilities for responsive design**, combined with **Tailwind CSS's responsive utility classes**, will be leveraged to create flexible layouts that adapt to different screen sizes . Content will reflow and resize appropriately, and interactive elements like buttons and input fields will be sized for easy interaction on touch devices. Navigation will be simplified for smaller screens, possibly using a hamburger menu for primary navigation links. Images and other media will be optimized to load quickly and display correctly on different resolutions. Testing will be performed on various screen sizes and browsers to ensure consistency and usability. The goal is to provide users with a high-quality experience whether they are accessing FlavorJourney on the go via their phone or planning a trip from their desktop computer. This responsiveness is crucial for a modern web application and will be a key factor in user satisfaction and engagement.

### General Principles

- **Prioritize Shadcn-Svelte Components**: For all UI elements, always utilize the corresponding Shadcn-Svelte component whenever possible. Avoid using raw HTML elements if a suitable Shadcn-Svelte component exists, to maintain visual and functional consistency.
- **Accessibility First**: All UI components and interactions must adhere to WCAG (Web Content Accessibility Guidelines) standards. Pay attention to semantic HTML, keyboard navigation, focus management, and ARIA attributes.
- **Responsive Design**: Ensure the application is fully responsive and provides an optimal experience across various screen sizes and devices (mobile, tablet, desktop).
- **Intuitive User Flow**: Design user flows to be clear, logical, and minimize cognitive load. Users should easily understand how to navigate and interact with the application.
- **Visual Consistency**: Maintain a consistent visual language across the application, including typography, color palette, spacing, and iconography.

### Forms

- **Standard HTML `<form>` Elements**: All forms _must_ be wrapped in standard HTML `<form>` elements to leverage native browser behavior and progressive enhancement.
- **Shadcn-Svelte Form Controls**: Within a `<form>` element, all interactive form controls (inputs, buttons, select elements, text areas, etc.) _must_ be the corresponding Shadcn-Svelte component. This ensures consistent styling, behavior, and accessibility features.

### Available Components

Below is a list of available Shadcn-Svelte components in [`src/lib/components/ui`](src/lib/components/ui). Refer to their respective directories for specific usage details and examples.

- [`accordion`](src/lib/components/ui/accordion)
- [`alert`](src/lib/components/ui/alert)
- [`badge`](src/lib/components/ui/badge)
- [`button`](src/lib/components/ui/button)
- [`card`](src/lib/components/ui/card)
- [`dialog`](src/lib/components/ui/dialog)
- [`input`](src/lib/components/ui/input)
- [`scroll-area`](src/lib/components/ui/scroll-area)
- [`select`](src/lib/components/ui/select)
- [`separator`](src/lib/components/ui/separator)
- [`tabs`](src/lib/components/ui/tabs)
- [`textarea`](src/lib/components/ui/textarea)

### Research Gaps Identified:

- **Shadcn-Svelte Component Customization**: Document best practices for customizing Shadcn-Svelte components (e.g., theming, extending styles) while maintaining upgradeability.
- **Complex UI Patterns**: Research and define guidelines for implementing more complex UI patterns not directly covered by existing Shadcn-Svelte components (e.g., data tables, drag-and-drop interfaces), potentially involving third-party libraries or custom solutions.
- **Accessibility Testing Strategy**: Outline a strategy for conducting comprehensive accessibility testing (e.g., using automated tools, manual checks, screen reader testing) to ensure WCAG compliance.

---

## Landing Page v2 (2025)

The 2025 landing page revamp introduces a more dynamic and interactive user experience, focusing on micro-interactions and a refreshed visual identity.

- **Core Principles:** Kinetic, ultra-vivid, and delightful.
- **Key Technologies:** Lucide for icons, Lordicon for Lottie animations.

**Official Documentation:**

- **Design & Motion Plan:** See the [2025 Landing Page 2.0 Plan](design/landing-page-design-plan-v2.md) for a detailed breakdown of icons, animations, and design tokens.
- **Content Blueprint:** The page structure and content are defined in the [v2 JSON Blueprint](blueprints/landing-page-v2.json5).
