<script>
	import { Button } from '$lib/components/ui/button';
	import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '$lib/components/ui/card';
	import { Badge } from '$lib/components/ui/badge';
</script>

<!-- Hero Section - Immersive Introduction -->
<section
	class="relative grid min-h-screen grid-cols-1 items-center justify-between overflow-hidden bg-gradient-to-br from-purple-50 to-pink-100 p-8 lg:grid-cols-2 dark:from-gray-950 dark:to-purple-950"
>
	<div class="animate-fade-in-up relative z-10 mx-auto max-w-3xl text-center lg:mx-0 lg:text-left">
		<h1
			class="font-display variable-font-weight mb-6 text-6xl leading-tight font-extrabold tracking-tighter text-gray-900 lg:text-7xl dark:text-white"
		>
			FlavorJourney: Your Next Culinary & Travel Saga Begins
		</h1>
		<p
			class="animate-fade-in-up mb-10 text-xl text-gray-700 opacity-0 delay-200 dark:text-gray-300"
		>
			Unearth personalized dining and travel experiences, crafted by AI to match your unique tastes,
			mood, and cultural curiosity. Beyond recommendations, it's a journey.
		</p>
		<Button
			variant="default"
			size="lg"
			class="animate-fade-in-up w-full transform opacity-0 transition-all delay-400 duration-300 ease-out hover:scale-105 hover:shadow-lg focus:ring-4 focus:ring-purple-300 focus:outline-none md:w-auto dark:focus:ring-purple-700"
		>
			Embark on Your Journey
		</Button>
	</div>
	<div class="animate-fade-in-right relative z-0 ml-12 hidden flex-shrink-0 delay-300 lg:block">
		<img
			src="https://images.unsplash.com/photo-1600000000000-000000000000?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1NzM4OTd8MHwxfHNlYXJjaHwxfHxmb29kJTIwdHJhdmVsJTIwY29sbGxhZ2V8ZW58MHx8fHwxNzAzMDU2NzU0fDA&ixlib=rb-4.0.3&q=80&w=1080"
			alt="Dynamic collage of diverse culinary and travel experiences"
			loading="eager"
			class="h-auto w-[500px] rotate-3 transform rounded-3xl border-4 border-white shadow-2xl transition-transform duration-500 ease-in-out hover:rotate-0 dark:border-gray-800"
		/>
		<div
			class="animate-blob absolute -bottom-4 -left-4 h-32 w-32 rounded-full bg-purple-300 opacity-70 mix-blend-multiply blur-xl filter dark:bg-purple-700"
		></div>
		<div
			class="animate-blob animation-delay-2000 absolute -top-8 -right-8 h-48 w-48 rounded-full bg-pink-300 opacity-70 mix-blend-multiply blur-xl filter dark:bg-pink-700"
		></div>
	</div>
</section>

<!-- Features Section - Interactive Cards -->
<section class="grid gap-10 bg-gray-50 px-8 py-20 md:grid-cols-2 lg:grid-cols-3 dark:bg-gray-950">
	<Card
		class="group animate-fade-in-up transform overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl transition-all delay-100 duration-500 ease-out hover:-translate-y-2 hover:shadow-2xl dark:border-gray-700 dark:bg-gray-800"
	>
		<CardHeader>
			<CardTitle
				class="text-2xl font-bold text-gray-900 transition-colors duration-300 group-hover:text-purple-600 dark:text-white dark:group-hover:text-purple-400"
			>
				Hyper-Personalized Recommendations
			</CardTitle>
		</CardHeader>
		<CardContent class="text-gray-700 dark:text-gray-300">
			Leveraging advanced AI, we provide tailored restaurant and travel suggestions that resonate
			with your unique cultural preferences and evolving tastes.
		</CardContent>
		<CardFooter class="pt-4">
			<Button
				variant="ghost"
				size="sm"
				class="text-purple-600 transition-transform duration-300 group-hover:translate-x-1 dark:text-purple-400"
			>
				Learn More →
			</Button>
		</CardFooter>
	</Card>
	<Card
		class="group animate-fade-in-up transform overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl transition-all delay-200 duration-500 ease-out hover:-translate-y-2 hover:shadow-2xl dark:border-gray-700 dark:bg-gray-800"
	>
		<CardHeader>
			<CardTitle
				class="text-2xl font-bold text-gray-900 transition-colors duration-300 group-hover:text-purple-600 dark:text-white dark:group-hover:text-purple-400"
			>
				Intuitive Mood-Based Discovery
			</CardTitle>
		</CardHeader>
		<CardContent class="text-gray-700 dark:text-gray-300">
			Simply articulate your current mood or craving, and our intelligent system will curate the
			perfect culinary or travel experience just for you.
		</CardContent>
		<CardFooter class="pt-4">
			<Button
				variant="ghost"
				size="sm"
				class="text-purple-600 transition-transform duration-300 group-hover:translate-x-1 dark:text-purple-400"
			>
				Discover How →
			</Button>
		</CardFooter>
	</Card>
	<Card
		class="group animate-fade-in-up transform overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl transition-all delay-300 duration-500 ease-out hover:-translate-y-2 hover:shadow-2xl dark:border-gray-700 dark:bg-gray-800"
	>
		<CardHeader>
			<CardTitle
				class="text-2xl font-bold text-gray-900 transition-colors duration-300 group-hover:text-purple-600 dark:text-white dark:group-hover:text-purple-400"
			>
				Vibrant Global Community
			</CardTitle>
		</CardHeader>
		<CardContent class="text-gray-700 dark:text-gray-300">
			Share your culinary discoveries, rate unique recommendations, and connect with a passionate
			community of fellow food and travel enthusiasts worldwide.
		</CardContent>
		<CardFooter class="pt-4">
			<Button
				variant="ghost"
				size="sm"
				class="text-purple-600 transition-transform duration-300 group-hover:translate-x-1 dark:text-purple-400"
			>
				Join the Community →
			</Button>
		</CardFooter>
	</Card>
</section>

<!-- How It Works Section - Dynamic Steps -->
<section class="flex flex-col items-center bg-white px-8 py-20 dark:bg-gray-900">
	<h2 class="font-display mb-16 text-center text-5xl font-bold text-gray-900 dark:text-white">
		Your FlavorJourney: Simple Steps to Discovery
	</h2>
	<div class="grid w-full max-w-6xl gap-12 md:grid-cols-3">
		<Card
			class="dark:bg-gray-850 animate-fade-in-up group rounded-xl border border-gray-200 bg-gray-100 p-8 text-center shadow-md delay-100 dark:border-gray-700"
		>
			<Badge
				variant="secondary"
				class="mb-6 rounded-full bg-purple-200 px-4 py-2 text-lg text-purple-800 dark:bg-purple-800 dark:text-purple-200"
			>
				Step One
			</Badge>
			<h3
				class="mb-4 text-2xl font-semibold text-gray-900 transition-colors duration-300 group-hover:text-pink-600 dark:text-white dark:group-hover:text-pink-400"
			>
				Define Your Culinary Profile
			</h3>
			<p class="text-gray-700 dark:text-gray-300">
				Input your preferred cuisines, dietary needs, and even your favorite music or films to
				refine your unique taste profile.
			</p>
		</Card>
		<Card
			class="dark:bg-gray-850 animate-fade-in-up group rounded-xl border border-gray-200 bg-gray-100 p-8 text-center shadow-md delay-200 dark:border-gray-700"
		>
			<Badge
				variant="secondary"
				class="mb-6 rounded-full bg-purple-200 px-4 py-2 text-lg text-purple-800 dark:bg-purple-800 dark:text-purple-200"
			>
				Step Two
			</Badge>
			<h3
				class="mb-4 text-2xl font-semibold text-gray-900 transition-colors duration-300 group-hover:text-pink-600 dark:text-white dark:group-hover:text-pink-400"
			>
				Receive AI-Curated Journeys
			</h3>
			<p class="text-gray-700 dark:text-gray-300">
				Get instant, tailored suggestions for local dining spots, hidden gems, and travel
				destinations perfectly aligned with your desires.
			</p>
		</Card>
		<Card
			class="dark:bg-gray-850 animate-fade-in-up group rounded-xl border border-gray-200 bg-gray-100 p-8 text-center shadow-md delay-300 dark:border-gray-700"
		>
			<Badge
				variant="secondary"
				class="mb-6 rounded-full bg-purple-200 px-4 py-2 text-lg text-purple-800 dark:bg-purple-800 dark:text-purple-200"
			>
				Step Three
			</Badge>
			<h3
				class="mb-4 text-2xl font-semibold text-gray-900 transition-colors duration-300 group-hover:text-pink-600 dark:text-white dark:group-hover:text-pink-400"
			>
				Explore, Savor & Share
			</h3>
			<p class="text-gray-700 dark:text-gray-300">
				Embark on new experiences, capture your moments, and effortlessly share your culinary and
				travel adventures with the FlavorJourney community.
			</p>
		</Card>
	</div>
</section>

<!-- Call to Action Section - Emotional Appeal -->
<section
	class="animate-fade-in-up flex flex-col items-center bg-gradient-to-r from-pink-500 to-purple-600 text-center text-white shadow-inner"
>
	<h2 class="font-display mb-8 max-w-4xl text-5xl leading-tight font-extrabold">
		Ready to Redefine Your Culinary & Travel Horizons?
	</h2>
	<p class="animate-fade-in-up mb-12 max-w-3xl text-xl opacity-0 delay-200">
		Join FlavorJourney today and unlock an unparalleled world of personalized dining and travel
		experiences. Your next extraordinary adventure is just a click away.
	</p>
	<Button
		variant="outline"
		size="lg"
		class="animate-fade-in-up transform border-white text-white opacity-0 transition-all delay-400 duration-300 ease-in-out hover:scale-105 hover:bg-white hover:text-purple-600 focus:ring-4 focus:ring-pink-300 focus:outline-none dark:focus:ring-pink-700"
	>
		Start Your FlavorJourney Now
	</Button>
</section>

<!-- Footer Section - Modern & Functional -->
<footer
	class="grid grid-cols-1 gap-8 bg-gray-900 px-8 py-12 text-sm text-gray-300 md:grid-cols-2 lg:grid-cols-4"
>
	<div class="col-span-full mb-6 lg:col-span-1 lg:mb-0">
		<img
			src="https://images.unsplash.com/photo-1600000000000-000000000000?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1NzM4OTd8MHwxfHNlYXJjaHwxfHxmb29kJTIwbG9nb3xlbnwwfHx8fDE3NTMyMTE0MTR8MA&ixlib=rb-4.0.3&q=80&w=1080"
			alt="FlavorJourney Logo"
			class="mb-4 h-8"
		/>
		<p class="text-gray-400">© 2025 FlavorJourney. All rights reserved.</p>
	</div>
	<div>
		<h4 class="mb-4 font-semibold text-white">Company</h4>
		<ul>
			<li><a href="#about" class="transition-colors duration-200 hover:text-white">About Us</a></li>
			<li>
				<a href="#careers" class="transition-colors duration-200 hover:text-white">Careers</a>
			</li>
			<li><a href="#blog" class="transition-colors duration-200 hover:text-white">Blog</a></li>
		</ul>
	</div>
	<div>
		<h4 class="mb-4 font-semibold text-white">Legal</h4>
		<ul>
			<li>
				<a href="/privacy-policy" class="transition-colors duration-200 hover:text-white"
					>Privacy Policy</a
				>
			</li>
			<li>
				<a href="/terms-of-service" class="transition-colors duration-200 hover:text-white"
					>Terms of Service</a
				>
			</li>
			<li>
				<a href="#cookies" class="transition-colors duration-200 hover:text-white">Cookie Policy</a>
			</li>
		</ul>
	</div>
	<div>
		<h4 class="mb-4 font-semibold text-white">Connect</h4>
		<ul>
			<li>
				<a href="#contact" class="transition-colors duration-200 hover:text-white">Contact Us</a>
			</li>
			<li>
				<a href="#social" class="transition-colors duration-200 hover:text-white">Social Media</a>
			</li>
		</ul>
	</div>
</footer>

<style lang="postcss">
	/* Global styles based on design plan */
	body {
		font-family: 'Inter', sans-serif;
	}

	@layer base {
		:root {
			--font-display: 'Plus Jakarta Sans', sans-serif;
		}

		.font-display {
			font-family: var(--font-display);
		}

		.variable-font-weight {
			font-weight: 500;
		}
	}
</style>
