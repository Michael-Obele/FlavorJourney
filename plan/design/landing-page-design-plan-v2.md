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
