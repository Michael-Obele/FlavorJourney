# ✨ FlavorJourney – 2025 Landing Page 2.0

\*Ultra-vivid, kinetic & micro-delightful; now powered by **Lucide icons** + **Lordicon Lottie\***

---

## 🔍 What’s New

- **Lucide icons** for crisp, consistent UI elements
- **Lordicon Lottie** micro-animations for delightful interactions.
- 6 extra motion “delight” moments (hover, scroll, success states)
- Upgraded **glass-glow** cards & **kinetic typography**

---

## 🎨 Design Tokens (Updated)

| Token                  | Value                     |
| ---------------------- | ------------------------- |
| **Lucide stroke**      | `1.5`                     |
| **Lordicon trigger**   | `hover` / `loop-on-hover` |
| **Glow color (glass)** | `rgba(139, 92, 246, 0.4)` |
| **Lottie easing**      | `spring(0.5, 80, 10)`     |

---

## 🧩 Icon & Motion Inventory

| Location          | Lucide Icon                        | Lordicon Lottie   | Behavior          |
| ----------------- | ---------------------------------- | ----------------- | ----------------- |
| Hero CTA          | `ArrowRight`                       | -                 | Slide-in on hover |
| Feature cards     | `Brain`, `MessageCircle`, `MapPin` | -                 | 8° tilt on hover  |
| “Taste-DNA” chip  | -                                  | `dna-spiral.json` | Loop on hover     |
| Demo section      | `PlayCircle`                       | -                 | Ripple click      |
| Testimonial stars | `Star`                             | -                 | Fill on scroll    |
| Footer social     | `Twitter`, `Instagram`, `Send`     | -                 | 20 ms bounce      |

---

## 🎬 Motion Cheat-Sheet

| Interaction     | CSS / Tailwind                                          | Lottie          |
| --------------- | ------------------------------------------------------- | --------------- |
| Hero blob pulse | `animate-[pulse_4s_cubic-bezier(0.4,0,0.6,1)_infinite]` | —               |
| Card hover tilt | `transform hover:-rotate-1 hover:scale-105`             | Trigger         |
| Pricing badge   | —                                                       | `loop-on-hover` |
| Footer icon     | `hover:scale-110 transition-transform`                  | Bounce          |

---

## 🖼️ Preview (ASCII wireframe)

```
┌─────────────────────────────┐
│  HERO                       │
│  ┌──────┐  ┌─ Lucide →     │
│  │LOTTIE│  │  Headline     │
│  └──────┘  └─ CTA          │
├─────────────────────────────┤
│  Features (3-up)            │
│  [🧠] [💬] [📍]            │
├─────────────────────────────┤
│  Demo (Lottie player)       │
├─────────────────────────────┤
│  Testimonials               │
│  ⭐⭐⭐⭐⭐                    │
├─────────────────────────────┤
│  Pricing (highlight badge)  │
├─────────────────────────────┤
│  Footer - Lucide socials    │
└─────────────────────────────┘
```

---

## 🚀 Next Steps

1. Install `lucide-svelte` & a Lottie web player library.
2. Replace static icons with Lucide + Lordicon combos.
3. Run `pnpm dev --open` → instant ✨

Ready to delight every scroll and hover!

```json
{
	"project": "FlavorJourney – 2025 Landing Page (Complete Revamp)",
	"version": "2.1",
	"meta": {
		"designSystem": "Tailwind CSS 3.5 + SvelteKit",
		"inspiration": [
			"Behance glassmorphism portfolios",
			"Dribbble 3-D hero shots",
			"2025 kinetic-typography trends",
			"Lordicon Lottie micro-delight"
		],
		"keywords": [
			"immersive",
			"kinetic",
			"glassmorphism",
			"micro-interaction",
			"dark-mode-first",
			"lottie",
			"lucide"
		]
	},

	"breakpoints": {
		"xs": "0px",
		"sm": "640px",
		"md": "768px",
		"lg": "1024px",
		"xl": "1280px",
		"2xl": "1536px"
	},

	"tokens": {
		"color": {
			"primary": {
				"50": "#faf5ff",
				"100": "#f3e8ff",
				"500": "#8b5cf6",
				"600": "#7c3aed",
				"700": "#6d28d9"
			},
			"accent": {
				"400": "#f472b6",
				"500": "#ec4899"
			},
			"neutral": {
				"50": "#fafafa",
				"100": "#f5f5f5",
				"300": "#d4d4d4",
				"800": "#262626",
				"900": "#171717"
			}
		},
		"font": {
			"display": "Satoshi-Variable, sans-serif",
			"body": "Inter, system-ui"
		},
		"shadow": {
			"soft": "0 4px 16px rgba(0,0,0,0.08)",
			"xl": "0 25px 50px -12px rgba(0,0,0,0.25)"
		},
		"radius": {
			"card": "1.5rem",
			"button": "0.75rem",
			"blob": "50%"
		}
	},

	"sections": [
		{
			"id": "hero",
			"name": "Hero Section – Immersive Introduction",
			"layout": {
				"type": "grid",
				"cols": "lg:grid-cols-5",
				"gap": "gap-12",
				"align": "center",
				"minH": "min-h-screen",
				"p": "p-8"
			},
			"background": {
				"type": "gradient",
				"from": "neutral-900",
				"to": "primary-700",
				"angle": "135deg"
			},
			"effects": [
				{
					"type": "glass-blob",
					"count": 3,
					"blur": "blur-3xl",
					"opacity": "0.4",
					"colors": ["primary-500", "accent-400"]
				}
			],
			"lottie": {
				"file": "/lottie/hero-foodie.json",
				"trigger": "hover",
				"loop": false
			},
			"content": {
				"headline": {
					"text": "Your Next Bite,<br>Your Next Flight,<br>Your Story.",
					"tag": "h1",
					"class": "text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-pink-400 animate-slide-up"
				},
				"subline": {
					"text": "AI-curated culinary and travel experiences that sync with your mood, taste, and curiosity.",
					"class": "mt-6 max-w-lg text-lg text-neutral-300 animate-fade-in delay-300"
				},
				"cta": {
					"primary": {
						"label": "Start tasting",
						"icon": { "lucide": "ArrowRight", "pos": "right" },
						"class": "bg-primary-600 hover:bg-primary-500 text-white shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
					},
					"secondary": {
						"label": "Watch demo",
						"type": "ghost",
						"icon": { "lucide": "PlayCircle", "pos": "left" },
						"class": "border-neutral-600 text-neutral-300 hover:bg-neutral-800"
					}
				},
				"visual": {
					"type": "3d-masonry",
					"images": ["/hero-dish-1.avif", "/hero-trip-1.avif", "/hero-dish-2.avif"],
					"class": "lg:col-span-2 relative group",
					"hover": "group-hover:scale-105",
					"lottie": "/lottie/chef-wink.json",
					"lottieTrigger": "hover"
				}
			}
		},

		{
			"id": "features",
			"name": "Features Showcase – Interactive Cards",
			"layout": {
				"type": "grid",
				"cols": "md:grid-cols-2 lg:grid-cols-3",
				"gap": "gap-8",
				"p": "py-20 px-8",
				"bg": "bg-neutral-50 dark:bg-neutral-950"
			},
			"cards": [
				{
					"lucideIcon": "Brain",
					"lottie": "/lottie/neural-spark.json",
					"lottieTrigger": "hover",
					"title": "Taste-DNA™",
					"body": "We map your cultural loves—music, films, books—to plates and places.",
					"hover": "hover:bg-primary-500/10 hover:scale-105"
				},
				{
					"lucideIcon": "MessageCircle",
					"lottie": "/lottie/message-bubble.json",
					"lottieTrigger": "hover",
					"title": "MoodChat",
					"body": "Tell us “I’m homesick” or “I’m adventurous” and get instant matches.",
					"hover": "hover:bg-accent-500/10 hover:scale-105"
				},
				{
					"lucideIcon": "MapPin",
					"lottie": "/lottie/pin-drop.json",
					"lottieTrigger": "hover",
					"title": "Micro-Itineraries",
					"body": "AI-generated half-day food walks you can book in two taps.",
					"hover": "hover:bg-teal-500/10 hover:scale-105"
				}
			]
		},

		{
			"id": "demo",
			"name": "Interactive Demo",
			"layout": {
				"type": "flex",
				"direction": "col",
				"align": "center",
				"p": "py-20 px-8",
				"bg": "bg-white dark:bg-neutral-900"
			},
			"content": {
				"headline": "See it in 15 seconds",
				"lottie": {
					"file": "/lottie/demo-lottie.json",
					"autoplay": true,
					"loop": false,
					"controls": false
				},
				"cta": {
					"label": "Replay demo",
					"icon": { "lucide": "RotateCcw" }
				}
			}
		},

		{
			"id": "social-proof",
			"name": "Testimonials",
			"layout": {
				"cols": "lg:grid-cols-3",
				"gap": "gap-8",
				"p": "py-20 px-8"
			},
			"quotes": [
				{
					"text": "FlavorJourney found a ramen spot that felt like a Murakami novel.",
					"author": "Aya K.",
					"role": "Designer, Tokyo",
					"icon": { "lucide": "Star" },
					"lottie": "/lottie/star-fill.json"
				},
				{
					"text": "Planned my entire Lisbon food crawl during a layover.",
					"author": "Marco R.",
					"role": "Photographer, NYC",
					"icon": { "lucide": "Star" },
					"lottie": "/lottie/star-fill.json"
				},
				{
					"text": "Finally, recommendations that get my gluten-free + punk-rock vibe.",
					"author": "Sam L.",
					"role": "Musician, Berlin",
					"icon": { "lucide": "Star" },
					"lottie": "/lottie/star-fill.json"
				}
			]
		},

		{
			"id": "pricing",
			"name": "Pricing Table",
			"layout": {
				"cols": "lg:grid-cols-3",
				"gap": "gap-8",
				"p": "py-20 px-8",
				"bg": "bg-neutral-50 dark:bg-neutral-950"
			},
			"tiers": [
				{
					"name": "Taste",
					"price": 0,
					"features": ["Local bites", "Basic mood", "Community feed"],
					"cta": "Get started",
					"lottie": "/lottie/taste-icon.json"
				},
				{
					"name": "Journey",
					"price": 5,
					"period": "mo",
					"features": ["Global trips", "Full itineraries", "Offline maps"],
					"highlight": true,
					"cta": "Start traveling",
					"badge": {
						"text": "Most popular",
						"icon": { "lucide": "TrendingUp" },
						"lottie": "/lottie/badge-shine.json"
					}
				},
				{
					"name": "Storyteller",
					"price": 10,
					"period": "mo",
					"features": ["Group planning", "Concierge chat", "Exclusive drops"],
					"cta": "Go premium",
					"lottie": "/lottie/storyteller-icon.json"
				}
			]
		},

		{
			"id": "footer",
			"name": "Footer – Modern & Functional",
			"layout": {
				"cols": "grid-cols-2 md:grid-cols-4",
				"gap": "gap-8",
				"p": "py-12 px-8",
				"bg": "bg-neutral-900 text-neutral-300"
			},
			"links": {
				"Product": ["Features", "Pricing", "Changelog"],
				"Community": ["Discord", "Blog", "Ambassadors"],
				"Legal": ["Privacy", "Terms", "Licenses"],
				"Support": ["Help center", "Contact", "Status"]
			},
			"social": [
				{
					"name": "twitter",
					"lucide": "Twitter",
					"lottie": "/lottie/twitter-bounce.json"
				},
				{
					"name": "instagram",
					"lucide": "Instagram",
					"lottie": "/lottie/instagram-like.json"
				},
				{
					"name": "tiktok",
					"lucide": "Send",
					"lottie": "/lottie/send-fly.json"
				}
			],
			"copyright": "© 2025 FlavorJourney"
		}
	],

	"animations": {
		"scroll": {
			"trigger": "intersection-observer",
			"threshold": 0.2
		},
		"hero": {
			"type": "stagger",
			"duration": 800,
			"delay": 100
		},
		"cards": {
			"type": "spring",
			"stiffness": 120,
			"damping": 15
		}
	},

	"performance": {
		"images": {
			"format": ["avif", "webp"],
			"lazy": true,
			"sizes": "(max-width: 640px) 100vw, 50vw"
		},
		"fonts": {
			"display": "swap"
		},
		"js": {
			"bundleSplitting": true,
			"preload": ["lottie-player"]
		}
	},

	"accessibility": {
		"colorContrast": "WCAG 2.1 AAA",
		"keyboard": true,
		"prefersReducedMotion": true,
		"aria": {
			"landmarks": true,
			"liveRegions": ["announcements"]
		}
	},

	"svelteComponents": {
		"LottieIcon": {
			"path": "src/lib/components/LottieIcon.svelte",
			"props": ["src", "trigger", "loop", "controls"]
		}
	}
}
```
