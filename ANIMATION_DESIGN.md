Scroll-Driven Sticky Animation — Design Skill File
For use with Copilot, Cursor, or any coding agent
Reference: Linear.app / Apple / Vercel scroll style

What This File Is
This file tells the coding agent exactly how to build scroll-driven sticky animations for this project. Read this before writing any animation or landing page code.

The Core Effect — Plain English
As the user scrolls down the page, a central element (product screenshot, mockup, or UI demo) stays fixed and centered on screen. It does not scroll away. Instead, the content AROUND it changes — text slides in from the side, feature labels fade in, the product image itself may rotate, zoom, or switch views. The user feels like they are controlling a presentation by scrolling, not reading a static page.
This is sometimes called:

Scroll-jacking (mild version)
Sticky scroll animation
Scroll-driven storytelling
Progressive disclosure on scroll


Tech Stack for This Project

Framework: Next.js 14 (React)
Animation library: Framer Motion (already fits our React stack, no extra bundle cost)
Scroll detection: Framer Motion's useScroll + useTransform hooks
Styling: Tailwind CSS
NO GSAP — avoid adding GSAP unless Framer Motion cannot achieve the effect. Keep dependencies minimal.


Page Structure — How to Build It
The Container Pattern
[Full viewport height sticky container]
  ├── [Left side — scrolling text sections]
  │     ├── Section 1: Feature headline + description
  │     ├── Section 2: Feature headline + description
  │     ├── Section 3: Feature headline + description
  │     └── Section 4: Feature headline + description
  └── [Right side — sticky product visual]
        └── This does NOT scroll. It stays fixed.
              └── The image/UI inside it DOES animate based on scroll position
Implementation Pattern (Framer Motion)
tsx// Outer wrapper — tall enough to create scroll room
<div className="relative h-[400vh]">

  {/* Sticky container — stays in view */}
  <div className="sticky top-0 h-screen flex items-center">

    {/* Left: text that scrolls through sections */}
    <div className="w-1/2 space-y-[100vh]">
      <FeatureSection title="Feature 1" description="..." />
      <FeatureSection title="Feature 2" description="..." />
      <FeatureSection title="Feature 3" description="..." />
    </div>

    {/* Right: product visual that reacts to scroll */}
    <div className="w-1/2 flex items-center justify-center">
      <AnimatedProductVisual scrollProgress={scrollYProgress} />
    </div>

  </div>
</div>

Scroll Progress Hook Pattern
tsximport { useScroll, useTransform, motion } from 'framer-motion'
import { useRef } from 'react'

export function ScrollSection() {
  const containerRef = useRef(null)

  // Track scroll progress within this specific container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  })

  // Map scroll 0→1 to whatever visual change you want
  // Example: rotate product image from 0deg to 15deg as user scrolls
  const rotateY = useTransform(scrollYProgress, [0, 1], [0, 15])

  // Example: switch between 4 feature states at scroll breakpoints
  const featureIndex = useTransform(scrollYProgress, 
    [0, 0.25, 0.5, 0.75], 
    [0, 1, 2, 3]
  )

  return (
    <div ref={containerRef} className="relative h-[400vh]">
      {/* content here */}
    </div>
  )
}

Animation Types — Use These
Type 1: Feature Switch
Product image swaps (or overlays appear/disappear) at scroll breakpoints.
Best for: showing different UI screens or product states.
Scroll 0–25%   → Show screen 1 (e.g. denial input form)
Scroll 25–50%  → Crossfade to screen 2 (e.g. AI processing)
Scroll 50–75%  → Crossfade to screen 3 (e.g. letter output)
Scroll 75–100% → Crossfade to screen 4 (e.g. download ready)
Type 2: Float In / Out
Text sections float in from left or right as their scroll position is reached, then float out as the user continues.
tsx<motion.div
  style={{ opacity, y }}  // driven by useTransform
  className="..."
>
  Feature text here
</motion.div>
Type 3: Zoom / Scale
Product mockup starts slightly zoomed out and scales up as user scrolls into the section.
tsxconst scale = useTransform(scrollYProgress, [0, 0.3], [0.85, 1])
Type 4: Highlight / Glow Pulse
A ring or glow appears around a specific part of the product UI to draw attention to the feature being described.
Use CSS box-shadow animated via Framer Motion.

For This Project (Dental Appeal Generator)
The 4 scroll sections should tell the product story:
SectionSticky VisualLeft Text1Input form UI"Paste the denial reason. That's it."2AI processing animation (spinner / thinking dots)"AI reads the payer's logic in seconds"3Appeal letter appearing line by line"A professional letter, ready to send"4Download button + success state"Recover thousands in denied claims"

Rules for the Coding Agent

Use Framer Motion only — no GSAP, no raw CSS keyframes for scroll effects
useScroll target must be the outer container ref — not window scroll
All scroll transforms use useTransform — never calculate scroll manually in JS
Each animation value is a MotionValue — pass via style prop, not animate
Mobile: on screens under 768px, disable the sticky layout and stack sections vertically with simple fade-in animations using Framer Motion whileInView
Performance: use will-change: transform sparingly, only on the sticky product visual element
No horizontal scroll — overflow-x must be hidden on the container


Framer Motion Install
bashnpm install framer-motion
Already compatible with Next.js 14. No additional config needed.

Reference Sites for Visual Inspiration
Tell the agent to look at these for scroll behavior reference:

https://linear.app — sticky product, features scroll past
https://vercel.com — scroll-driven text + product transitions
https://arc.net — bold typography + smooth scroll sections