'use client'
import { useEffect, useRef, useState, useCallback } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/* ═══════════════════════════════════════════════════════════════════
   SECTION DATA — 12 cinematic chapters
═══════════════════════════════════════════════════════════════════ */
const SECTIONS = [
  {
    num: '01', label: 'Credibility',
    title: 'BUILT FOR\nENVIRONMENTS\nWHERE SYSTEMS\nFAIL',
    body: '',
    note: '',
    chips: [
      { val: '3 HRS', lbl: 'Deployment' },
      { val: '5 KM', lbl: 'Coverage' },
      { val: '24/7', lbl: 'Persistence' },
      { val: 'HAPS', lbl: 'Vision' },
    ],
    pos: 'left' as const,
    bgPos: 'right center',
    img: '/sft/stats.png',
    overlay: 'linear-gradient(90deg, rgba(5,5,5,0.94) 0%, rgba(5,5,5,0.82) 38%, rgba(5,5,5,0.3) 65%, transparent 100%)',
    eyebrow: 'WHY IT MATTERS',
    cta: [],
  },
  {
    num: '02', label: 'Vision',
    title: 'RETHINKING\nCONNECTIVITY\nDEPLOYMENT',
    body: 'Towers are fixed. Drones are limited. Satellites are distant. We are building persistent aerial systems that deploy faster and last longer.',
    note: '',
    chips: [],
    pos: 'right' as const,
    bgPos: 'left center',
    img: '/sft/vision.png',
    overlay: 'linear-gradient(270deg, rgba(5,5,5,0.94) 0%, rgba(5,5,5,0.82) 38%, rgba(5,5,5,0.3) 65%, transparent 100%)',
    eyebrow: 'STRATOSPHERIC SCALE',
    cta: [{ label: 'About SFT', style: 'ghost', href: '/about' }],
  },
  {
    num: '03', label: 'HAWKE',
    title: 'HAWKE',
    body: 'Rapidly deployable tethered aerial platform for communication relay, surveillance, and mission payload integration.',
    note: 'Rapid Communication & Monitoring',
    chips: [
      { val: '1 KM', lbl: 'Altitude' },
      { val: '5 KM', lbl: 'Radius' },
      { val: '20 KG', lbl: 'Payload' },
      { val: '~3 HRS', lbl: 'Deploy' },
    ],
    pos: 'center' as const,
    bgPos: 'center center',
    img: '/sft/hawke.png',
    overlay: 'radial-gradient(ellipse at center, rgba(5,5,5,0.84) 0%, rgba(5,5,5,0.62) 40%, rgba(5,5,5,0.25) 65%, transparent 100%)',
    eyebrow: 'DEPLOYABLE AERIAL PLATFORM',
    cta: [{ label: 'Explore HAWKE', style: 'primary', href: '/hawke' }],
  },
  {
    num: '04', label: 'MOBIUS',
    title: 'MOBIUS',
    body: 'Scalable, autonomous high-altitude platform for telecom, remote sensing, and strategic wide-area coverage from the stratosphere.',
    note: 'Next Era of Connectivity',
    chips: [
      { val: 'HIGH ALT.', lbl: 'Endurance' },
      { val: 'SCALABLE', lbl: 'Payload' },
      { val: 'AUTO', lbl: 'Positioning' },
      { val: 'MULTI', lbl: 'Mission' },
    ],
    pos: 'left' as const,
    bgPos: 'right center',
    img: '/sft/mobius.png',
    overlay: 'linear-gradient(90deg, rgba(5,5,5,0.94) 0%, rgba(5,5,5,0.82) 38%, rgba(5,5,5,0.3) 65%, transparent 100%)',
    eyebrow: 'HIGH ALTITUDE PLATFORM SYSTEM',
    cta: [{ label: 'Explore MOBIUS', style: 'primary', href: '/mobius' }],
  },
  {
    num: '05', label: 'Payloads',
    title: 'PAYLOADS\nBUILT FOR\nTHE MISSION',
    body: 'Modular aerial systems supporting communication relay, optical surveillance, thermal imaging, radar, and environmental sensing.',
    note: '',
    chips: [],
    pos: 'right' as const,
    bgPos: 'left center',
    img: '/sft/payload.png',
    overlay: 'linear-gradient(270deg, rgba(5,5,5,0.94) 0%, rgba(5,5,5,0.82) 38%, rgba(5,5,5,0.3) 65%, transparent 100%)',
    eyebrow: 'MODULAR MISSION SYSTEMS',
    cta: [{ label: 'View Applications', style: 'ghost', href: '/applications' }],
  },
  {
    num: '06', label: 'Comms',
    title: 'CONNECTIVITY\nFROM ABOVE',
    body: 'Persistent communication coverage and real-time situational awareness from elevated vantage points.',
    note: '',
    chips: [],
    pos: 'center' as const,
    bgPos: 'center center',
    img: '/sft/comms.png',
    overlay: 'radial-gradient(ellipse at center, rgba(5,5,5,0.84) 0%, rgba(5,5,5,0.62) 40%, rgba(5,5,5,0.25) 65%, transparent 100%)',
    eyebrow: 'COMMUNICATIONS & INTELLIGENCE',
    cta: [{ label: 'Explore Use Cases', style: 'ghost', href: '/applications' }],
  },
  {
    num: '07', label: 'Control',
    title: 'FLIGHT, GROUND\n& MISSION\nCONTROL',
    body: 'Integrated operational stack for telemetry, payload management, and autonomous flight architecture.',
    note: '',
    chips: [],
    pos: 'left' as const,
    bgPos: 'right center',
    img: '/sft/control.png',
    overlay: 'linear-gradient(90deg, rgba(5,5,5,0.94) 0%, rgba(5,5,5,0.82) 38%, rgba(5,5,5,0.3) 65%, transparent 100%)',
    eyebrow: 'CONTROL SYSTEMS',
    cta: [{ label: 'Explore Technology', style: 'ghost', href: '/ecosystem' }],
  },
  {
    num: '08', label: 'Technology',
    title: 'ENGINEERED\nFOR SCALE &\nENDURANCE',
    body: 'Layered platform architecture combining lighter-than-air systems, payload integration, and mission-specific modules.',
    note: '',
    chips: [],
    pos: 'right' as const,
    bgPos: 'left center',
    img: '/sft/tech.png',
    overlay: 'linear-gradient(270deg, rgba(5,5,5,0.94) 0%, rgba(5,5,5,0.82) 38%, rgba(5,5,5,0.3) 65%, transparent 100%)',
    eyebrow: 'TECHNOLOGY STACK',
    cta: [{ label: 'Technology Overview', style: 'ghost', href: '/ecosystem' }],
  },
  {
    num: '09', label: 'Operations',
    title: 'READY WHEN\nTHE MISSION\nDEMANDS IT',
    body: 'Designed for rapid deployment and persistent performance across disaster zones, industrial sites, and strategic environments.',
    note: '',
    chips: [],
    pos: 'center' as const,
    bgPos: 'center center',
    img: '/sft/operations.png',
    overlay: 'radial-gradient(ellipse at center, rgba(5,5,5,0.84) 0%, rgba(5,5,5,0.62) 40%, rgba(5,5,5,0.25) 65%, transparent 100%)',
    eyebrow: 'RESPONSIVE OPERATIONS',
    cta: [{ label: 'Request Pilot Deployment', style: 'primary', href: 'tel:+919486675847' }],
  },
  {
    num: '10', label: 'Updates',
    title: 'LATEST\nUPDATES',
    body: '',
    note: '',
    chips: [],
    pos: 'center' as const,
    bgPos: 'center center',
    img: '/sft/updates.png',
    overlay: 'radial-gradient(ellipse at center, rgba(5,5,5,0.88) 0%, rgba(5,5,5,0.72) 40%, rgba(5,5,5,0.4) 65%, rgba(5,5,5,0.2) 100%)',
    eyebrow: 'NEWS & MILESTONES',
    cta: [{ label: 'View All Updates', style: 'ghost', href: 'mailto:info@susanfuturetechnologies.com' }],
    updates: [
      { title: 'HAWKE Deployment Readiness', desc: 'Platform development continues toward TRL 9.', img: '/sft/blog-hawke.png' },
      { title: 'Modular Aerial Expansion', desc: 'Applications across disaster response and monitoring.', img: '/sft/blog-modular.png' },
      { title: 'Next-Gen Infrastructure', desc: 'Shaping a new connectivity layer from above.', img: '/sft/blog-nextgen.png' },
    ],
  },
]
/* ═══════════════════════════════════════════════════════════════════
   STYLES — Aerospace Dark Theme
═══════════════════════════════════════════════════════════════════ */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600&family=Space+Mono:wght@400;700&display=swap');

*,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
html{scroll-behavior:auto;background:#050505}
body{background:#050505;color:#F5F7FA;font-family:'Inter',sans-serif;overflow-x:hidden;
  -webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}

/* ── Fixed background image layer ── */
.bg-fixed{
  position:fixed;inset:0;z-index:0;
  background-size:cover;background-position:center;
  transition:none;
}
.bg-inner{
  position:absolute;inset:0;
  background-size:cover;background-position:center;
  will-change:transform,opacity;
  transition:opacity 1.2s cubic-bezier(.16,1,.3,1);
}
.bg-inner-a,.bg-inner-b{
  position:absolute;inset:0;
  background-size:cover;background-position:center;
  will-change:transform,opacity;
  transition:opacity 1.2s cubic-bezier(.16,1,.3,1);
}

/* ── Overlay gradient (changes per section) ── */
.overlay-layer{
  position:fixed;inset:0;z-index:1;
  pointer-events:none;
  transition:background 1.2s cubic-bezier(.16,1,.3,1);
}

/* ── Vignette ── */
.vignette{
  position:fixed;inset:0;z-index:2;pointer-events:none;
  background:radial-gradient(ellipse at center,transparent 50%,rgba(5,5,5,0.5) 100%);
}

/* ── Scan lines overlay ── */
.scanlines{
  position:fixed;inset:0;z-index:3;pointer-events:none;
  background:repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(74,199,255,0.008) 2px,
    rgba(74,199,255,0.008) 4px
  );
}

/* ── Nav ── */
.s-nav{
  position:fixed;top:0;left:0;right:0;z-index:100;
  display:flex;align-items:center;justify-content:space-between;
  padding:0 48px;height:70px;
  background:rgba(5,5,5,0.4);
  backdrop-filter:blur(20px);
  border-bottom:1px solid rgba(74,199,255,0.08);
}
.s-logo{
  display:flex;align-items:center;
}
.s-logo-img{
  height:40px;width:auto;object-fit:contain;
}
/* center section indicator */
.s-section{
  position:absolute;left:50%;transform:translateX(-50%);
  display:flex;align-items:center;gap:10px;
}
.s-sec-num{
  font-family:'Space Mono',monospace;
  font-size:0.8rem;font-weight:400;letter-spacing:.1em;
  color:rgba(255,255,255,0.25);
}
.s-sec-label{
  font-family:'Space Grotesk',sans-serif;
  font-size:0.8rem;font-weight:500;letter-spacing:.28em;text-transform:uppercase;
  color:rgba(74,199,255,0.55);
  transition:opacity .4s;
}
.s-sep{width:1px;height:12px;background:rgba(255,255,255,0.08)}
/* right nav */
.s-nav-right{display:flex;align-items:center;gap:18px}
.s-nav-link{
  font-family:'Space Grotesk',sans-serif;
  font-size:0.75rem;font-weight:500;letter-spacing:.18em;text-transform:uppercase;
  color:rgba(255,255,255,0.3);text-decoration:none;transition:color .2s;
}
.s-nav-link:hover{color:rgba(255,255,255,0.6)}
.s-cta-btn{
  font-family:'Space Grotesk',sans-serif;font-size:0.75rem;font-weight:600;
  letter-spacing:.18em;text-transform:uppercase;
  background:transparent;
  color:#4AC7FF;
  padding:7px 16px;border-radius:50px;text-decoration:none;
  border:1px solid rgba(74,199,255,0.4);
  transition:all .25s ease;
}
.s-cta-btn:hover{background:rgba(74,199,255,0.1);border-color:#4AC7FF;box-shadow:0 0 20px rgba(74,199,255,0.2)}

/* ── Progress bar ── */
#prog{position:fixed;bottom:0;left:0;right:0;height:2px;z-index:200;background:rgba(255,255,255,0.04)}
#prog-fill{height:100%;background:linear-gradient(90deg,#4AC7FF,#2a9fd4);width:0%;transition:width .12s linear;border-radius:1px}

/* ── Dot nav ── */
#dots{position:fixed;right:30px;top:50%;transform:translateY(-50%);z-index:100;
  display:flex;flex-direction:column;gap:10px}
.dot{width:4px;height:4px;border-radius:50%;background:rgba(255,255,255,0.15);
  transition:all .35s cubic-bezier(.16,1,.3,1);cursor:default}
.dot.act{background:#4AC7FF;transform:scale(1.7);box-shadow:0 0 8px rgba(74,199,255,0.5)}

/* ── Content panels (fixed overlay) ── */
.s-panel{
  position:fixed;top:0;height:100vh;z-index:10;
  display:flex;flex-direction:column;justify-content:center;
  pointer-events:none;
  opacity:0;transform:translateY(18px);
  transition:opacity 1.0s cubic-bezier(.16,1,.3,1), transform 1.0s cubic-bezier(.16,1,.3,1);
}
.s-panel.vis{opacity:1;transform:translateY(0)}

.s-panel.pos-left{left:0;width:42%;padding:0 56px 0 64px}
.s-panel.pos-right{right:0;width:42%;padding:0 64px 0 56px;align-items:flex-end;text-align:right}
.s-panel.pos-center{
  left:0;right:0;width:100%;padding:0 80px;
  align-items:center;text-align:center;
}
.s-panel.pos-updates{
  left:0;right:0;width:100%;padding:0 5%;
}

/* ── Typography ── */
.p-eyebrow{
  font-family:'Space Grotesk',sans-serif;
  font-size:0.85rem;font-weight:500;letter-spacing:.28em;text-transform:uppercase;
  color:#4AC7FF;margin-bottom:18px;
  display:flex;align-items:center;gap:10px;
}
.p-eyebrow-line{width:22px;height:1px;background:rgba(74,199,255,0.35);flex-shrink:0}
.pos-right .p-eyebrow{flex-direction:row-reverse}
.pos-center .p-eyebrow{justify-content:center}

.p-num{
  font-family:'Space Mono',monospace;font-size:0.85rem;font-weight:400;
  letter-spacing:.1em;color:rgba(255,255,255,0.15);margin-bottom:8px;
}

.p-title{
  font-family:'Space Grotesk',sans-serif;
  font-size:clamp(2.8rem,4.5vw,5rem);
  font-weight:300;line-height:1.08;letter-spacing:-0.03em;
  color:#F5F7FA;white-space:pre-line;margin-bottom:20px;
  text-transform:uppercase;
  text-shadow:0 4px 32px rgba(0,0,0,0.6);
}

.p-body{
  font-family:'Inter',sans-serif;
  font-size:0.95rem;color:#A7AFBB;
  line-height:1.82;max-width:420px;font-weight:400;margin-bottom:18px;
  white-space:pre-line;
}
.pos-right .p-body,.pos-right .p-note{margin-left:auto}
.pos-center .p-body{max-width:500px}

.p-note{
  font-family:'Space Grotesk',sans-serif;
  font-size:0.85rem;font-weight:400;color:rgba(74,199,255,0.6);
  letter-spacing:.1em;padding-top:12px;
  border-top:1px solid rgba(74,199,255,0.12);
  max-width:420px;line-height:1.6;
}
.pos-right .p-note{margin-left:auto}
.pos-center .p-note{max-width:none}

/* ── Stat chips ── */
.p-chips{
  display:flex;flex-wrap:wrap;gap:8px;margin-top:16px;
  max-width:460px;
}
.pos-right .p-chips{margin-left:auto;justify-content:flex-end}
.pos-center .p-chips{max-width:none;justify-content:center}

.p-chip{
  display:flex;align-items:center;gap:7px;
  background:rgba(74,199,255,0.06);
  border:1px solid rgba(74,199,255,0.12);
  border-radius:20px;padding:7px 16px;
  backdrop-filter:blur(8px);
  transition:all .3s ease;
}
.p-chip:hover{
  background:rgba(74,199,255,0.14);
  border-color:rgba(74,199,255,0.3);
  transform:translateY(-1px);
}
.p-chip-val{
  font-family:'Space Mono',monospace;
  font-size:0.95rem;font-weight:700;
  color:#F5F7FA;line-height:1;
  letter-spacing:-0.02em;
}
.p-chip-lbl{
  font-family:'Space Grotesk',sans-serif;
  font-size:0.8rem;font-weight:500;
  letter-spacing:.2em;text-transform:uppercase;
  color:#4AC7FF;
}

/* ── CTA buttons ── */
.p-ctas{display:flex;flex-wrap:wrap;gap:10px;margin-top:20px}
.pos-center .p-ctas{justify-content:center}
.pos-right .p-ctas{justify-content:flex-end}

.btn-p{
  background:transparent;color:#4AC7FF;
  font-family:'Space Grotesk',sans-serif;
  font-size:0.85rem;font-weight:600;letter-spacing:.18em;text-transform:uppercase;
  padding:11px 28px;border-radius:50px;text-decoration:none;display:inline-block;
  border:1px solid rgba(74,199,255,0.5);
  transition:all .25s ease;
  pointer-events:auto;cursor:pointer;
  position:relative;overflow:hidden;
}
.btn-p:hover{background:rgba(74,199,255,0.1);border-color:#4AC7FF;box-shadow:0 0 24px rgba(74,199,255,0.25);transform:translateY(-1px)}
.btn-g{
  color:rgba(255,255,255,0.5);font-family:'Space Grotesk',sans-serif;
  font-size:0.85rem;font-weight:400;letter-spacing:.18em;text-transform:uppercase;
  padding:11px 28px;border-radius:50px;border:1px solid rgba(255,255,255,0.12);
  text-decoration:none;display:inline-block;
  transition:all .25s ease;pointer-events:auto;cursor:pointer;
}
.btn-g:hover{color:#fff;border-color:rgba(74,199,255,0.4);background:rgba(74,199,255,0.06);box-shadow:0 0 16px rgba(74,199,255,0.12)}

/* ── Blog-style update cards (section 10) — Full Width ── */
.upd-header{
  display:flex;align-items:flex-start;justify-content:space-between;
  width:100%;max-width:none;margin-bottom:24px;
}
.upd-header-left{display:flex;flex-direction:column}
.upd-grid{
  display:flex;gap:20px;
  width:100%;max-width:none;
}
.upd-card{
  flex:1;min-width:0;
  background:rgba(74,199,255,0.04);
  border:1px solid rgba(74,199,255,0.1);
  border-radius:12px;overflow:hidden;
  backdrop-filter:blur(10px);
  text-align:left;
  cursor:pointer;
  opacity:0;transform:translateY(80px);
  transition:opacity 0.8s cubic-bezier(.16,1,.3,1), transform 0.8s cubic-bezier(.16,1,.3,1), background 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
}
.vis .upd-card{
  opacity:1;transform:translateY(0);
}
.vis .upd-card:nth-child(1){transition-delay:0s}
.vis .upd-card:nth-child(2){transition-delay:0.2s}
.vis .upd-card:nth-child(3){transition-delay:0.4s}
.upd-card:hover{
  background:rgba(74,199,255,0.1);
  border-color:rgba(74,199,255,0.25);
  transform:translateY(-4px);
  box-shadow:0 12px 40px rgba(0,0,0,0.3);
}
.upd-card-img{
  width:100%;aspect-ratio:16/9;
  object-fit:cover;display:block;
  border-bottom:1px solid rgba(74,199,255,0.08);
}
.upd-card-body{padding:16px 18px 20px}
.upd-card-tag{
  display:inline-block;font-family:'Space Mono',monospace;
  font-size:0.75rem;font-weight:400;letter-spacing:.1em;
  text-transform:uppercase;color:rgba(74,199,255,0.5);
  margin-bottom:6px;
}
.upd-card-title{
  font-family:'Space Grotesk',sans-serif;
  font-size:0.95rem;font-weight:500;color:#F5F7FA;
  margin-bottom:6px;line-height:1.35;
}
.upd-card-desc{
  font-family:'Inter',sans-serif;
  font-size:0.88rem;color:rgba(167,175,187,0.7);line-height:1.6;
}

/* ── Intro panel ── */
.intro-panel{
  position:fixed;top:0;left:0;right:0;height:100vh;
  display:flex;flex-direction:column;justify-content:center;align-items:center;
  text-align:center;
  padding:80px 80px 80px;z-index:10;pointer-events:none;
  opacity:0;transform:translateY(18px);
  transition:opacity 1.0s cubic-bezier(.16,1,.3,1), transform 1.0s cubic-bezier(.16,1,.3,1);
  background:radial-gradient(ellipse at center,rgba(5,5,5,.86) 0%,rgba(5,5,5,.68) 45%,rgba(5,5,5,.3) 70%,transparent 100%);
}
.intro-panel.vis{opacity:1;transform:translateY(0);pointer-events:auto}
.i-eye{
  font-family:'Space Grotesk',sans-serif;
  font-size:1rem;font-weight:500;letter-spacing:.28em;text-transform:uppercase;
  color:#4AC7FF;margin-bottom:22px;display:flex;align-items:center;
  justify-content:center;gap:12px
}
.i-eye-line{width:24px;height:1px;background:rgba(74,199,255,0.35)}
.i-title{
  font-family:'Space Grotesk',sans-serif;font-size:clamp(3.2rem,6vw,6.5rem);
  font-weight:300;line-height:1.05;letter-spacing:-0.03em;
  text-transform:uppercase;
  color:#F5F7FA;margin-bottom:24px;
  text-shadow:0 4px 40px rgba(0,0,0,0.5)
}
.i-title .gc{color:#4AC7FF}
.i-sub{
  font-family:'Inter',sans-serif;
  font-size:1.05rem;color:#A7AFBB;line-height:1.82;
  max-width:480px;margin-bottom:42px;text-align:center
}
.i-ctas{display:flex;gap:12px;margin-bottom:48px}
.i-scroll{
  display:flex;align-items:center;gap:10px;font-size:1rem;
  font-family:'Space Grotesk',sans-serif;
  letter-spacing:.2em;text-transform:uppercase;color:rgba(255,255,255,0.2);
  justify-content:center
}
.i-dot{
  width:5px;height:5px;border-radius:50%;background:#4AC7FF;
  animation:pulse 2.2s ease infinite
}
@keyframes pulse{0%,100%{opacity:.2;transform:scale(1)}50%{opacity:1;transform:scale(1.3)}}

/* ── Signal pulse (hero background) ── */
.signal-rings{
  position:fixed;top:50%;left:50%;z-index:4;pointer-events:none;
  transform:translate(-50%,-50%);
}
.signal-ring{
  position:absolute;top:50%;left:50%;
  border:1px solid rgba(74,199,255,0.08);
  border-radius:50%;
  transform:translate(-50%,-50%);
  animation:ringPulse 4s ease-out infinite;
}
.signal-ring:nth-child(1){width:200px;height:200px;animation-delay:0s}
.signal-ring:nth-child(2){width:400px;height:400px;animation-delay:0.8s}
.signal-ring:nth-child(3){width:600px;height:600px;animation-delay:1.6s}
.signal-ring:nth-child(4){width:800px;height:800px;animation-delay:2.4s}
@keyframes ringPulse{
  0%{opacity:0;transform:translate(-50%,-50%) scale(0.8)}
  30%{opacity:1}
  100%{opacity:0;transform:translate(-50%,-50%) scale(1.4)}
}

/* ── Floating particles ── */
.particles{position:fixed;inset:0;z-index:3;pointer-events:none;overflow:hidden}
.particle{
  position:absolute;width:2px;height:2px;border-radius:50%;
  background:rgba(74,199,255,0.25);
  animation:drift linear infinite;
}
@keyframes drift{
  0%{transform:translateY(100vh) translateX(0);opacity:0}
  10%{opacity:1}
  90%{opacity:1}
  100%{transform:translateY(-10vh) translateX(40px);opacity:0}
}

/* ── Outro overlay ── */
.outro-panel{
  position:fixed;inset:0;
  z-index:20;pointer-events:none;
  opacity:0;
  transform:translateY(100%);
  transition:opacity .8s cubic-bezier(.16,1,.3,1), transform .8s cubic-bezier(.16,1,.3,1);
  display:flex;flex-direction:column;align-items:center;justify-content:center;gap:0;
  background:linear-gradient(180deg, rgba(5,5,5,.94) 0%, rgba(8,17,31,.98) 100%);
  backdrop-filter:blur(30px);
  padding:48px;
}
.outro-panel.vis{opacity:1;transform:translateY(0);pointer-events:auto}

.o-logo{
  font-family:'Space Grotesk',sans-serif;font-size:1rem;font-weight:600;
  letter-spacing:.08em;color:#F5F7FA;text-transform:uppercase;
  display:flex;align-items:center;gap:6px;
  margin-bottom:18px;
}
.o-logo-icon{
  width:24px;height:24px;border-radius:5px;
  background:linear-gradient(135deg,#4AC7FF,#08111F);
  display:flex;align-items:center;justify-content:center;
  font-size:10px;font-weight:700;color:#fff;
}
.o-eyebrow{
  font-family:'Space Grotesk',sans-serif;
  font-size:1rem;font-weight:500;letter-spacing:.28em;text-transform:uppercase;
  color:rgba(74,199,255,0.45);
  display:flex;align-items:center;gap:12px;
  margin-bottom:16px;
}
.o-eyebrow-line{width:28px;height:1px;background:rgba(74,199,255,0.25)}
.o-title{
  font-family:'Space Grotesk',sans-serif;
  font-size:clamp(2.8rem,5vw,4.5rem);
  font-weight:300;line-height:1.08;letter-spacing:-0.03em;
  text-transform:uppercase;
  color:#F5F7FA;text-align:center;
  margin-bottom:14px;
  text-shadow:0 4px 40px rgba(0,0,0,.5);
}
.o-title .oc{color:#4AC7FF}
.o-sub{
  font-family:'Inter',sans-serif;
  font-size:1.05rem;color:#A7AFBB;line-height:1.82;
  text-align:center;max-width:440px;
  margin-bottom:32px;
}
.o-cta-row{display:flex;flex-wrap:wrap;gap:12px;justify-content:center;margin-bottom:36px}
.o-divider{
  width:120px;height:1px;
  background:linear-gradient(90deg,transparent,rgba(74,199,255,0.2),transparent);
  margin-bottom:28px;
}
.o-footer{
  display:flex;flex-direction:column;align-items:center;gap:16px;
  margin-top:12px;
}
.o-footer-nav{
  display:flex;gap:20px;flex-wrap:wrap;justify-content:center;
}
.o-footer-link{
  font-family:'Space Grotesk',sans-serif;
  font-size:0.9rem;font-weight:500;letter-spacing:.18em;text-transform:uppercase;
  color:rgba(255,255,255,0.2);text-decoration:none;transition:color .2s;
}
.o-footer-link:hover{color:rgba(74,199,255,0.6)}
.o-footer-info{
  font-family:'Inter',sans-serif;
  font-size:1rem;color:rgba(167,175,187,0.6);text-align:center;line-height:1.6;
}
.o-footer-tagline{
  font-family:'Space Grotesk',sans-serif;
  font-size:0.85rem;font-weight:500;letter-spacing:.2em;text-transform:uppercase;
  color:rgba(74,199,255,0.2);margin-top:8px;
  display:flex;align-items:center;gap:8px;
}
.o-footer-dot{width:3px;height:3px;border-radius:50%;background:rgba(74,199,255,0.4)}

/* ── Scroll driver ── */
#sd{height:1600vh;position:relative;z-index:5;pointer-events:none}


/* ═══════════════════════════════════════════════════════════════
   MOBILE — STORIES MODE
═══════════════════════════════════════════════════════════════ */

/* ── Stories container ── */
.m-stories{
  position:fixed;inset:0;z-index:500;
  overflow:hidden;background:#050505;
  touch-action:pan-y;
}

/* ── Progress bars ── */
.m-progress{
  position:absolute;top:0;left:0;right:0;z-index:60;
  display:flex;gap:3px;padding:8px 10px 0;
}
.m-prog-bar{
  flex:1;height:2px;border-radius:2px;
  background:rgba(255,255,255,0.12);overflow:hidden;
}
.m-prog-fill{
  height:100%;border-radius:2px;
  background:#4AC7FF;width:0%;
  transition:width 0.3s linear;
}
.m-prog-fill.done{width:100%}

/* ── Story slide ── */
.m-slide{
  position:absolute;inset:0;
  opacity:0;
  transform:scale(0.95);
  transition:opacity .35s ease, transform .35s ease;
  pointer-events:none;
  display:flex;flex-direction:column;
}
.m-slide.active{
  opacity:1;transform:scale(1);pointer-events:auto;
}

/* ── Story bg image ── */
.m-slide-bg{
  position:absolute;inset:0;
  background-size:cover;background-position:center;
}
.m-slide-overlay{
  position:absolute;inset:0;
}
.m-slide-vignette{
  position:absolute;inset:0;
  background:linear-gradient(180deg, rgba(5,5,5,.3) 0%, rgba(5,5,5,.1) 30%, rgba(5,5,5,.55) 65%, rgba(5,5,5,.94) 100%);
}

/* ── Story tap zones ── */
.m-tap-left,.m-tap-right{
  position:absolute;top:50px;bottom:0;z-index:40;
}
.m-tap-left{left:0;width:30%}
.m-tap-right{right:0;width:70%}

/* ── Story header ── */
.m-header{
  position:relative;z-index:50;
  display:flex;align-items:center;justify-content:space-between;
  padding:20px 16px 0;
}
.m-header-logo{
  font-family:'Space Grotesk',sans-serif;font-size:0.7rem;font-weight:600;
  color:#F5F7FA;display:flex;align-items:center;gap:4px;
  letter-spacing:.08em;text-transform:uppercase;
}
.m-header-icon{
  width:22px;height:22px;border-radius:4px;
  background:linear-gradient(135deg,#4AC7FF,#08111F);
  display:flex;align-items:center;justify-content:center;
  font-size:9px;font-weight:700;color:#fff;
}
.m-header-cta{
  font-family:'Space Grotesk',sans-serif;font-size:0.55rem;font-weight:700;
  letter-spacing:.14em;text-transform:uppercase;
  background:linear-gradient(135deg,#4AC7FF,#2a9fd4);color:#050505;
  padding:7px 12px;border-radius:5px;text-decoration:none;
}

/* ── Story content (bottom anchored) ── */
.m-content{
  position:relative;z-index:30;
  margin-top:auto;
  padding:0 12px 20px;
}
.m-content-inner{
  background:rgba(5,5,5,.5);
  backdrop-filter:blur(16px);
  border:1px solid rgba(74,199,255,0.08);
  border-radius:14px;
  padding:16px;
}
.m-sec-num{
  font-family:'Space Mono',monospace;
  font-size:0.5rem;font-weight:400;letter-spacing:.1em;
  color:rgba(255,255,255,0.18);margin-bottom:4px;
}
.m-sec-label{
  font-family:'Space Grotesk',sans-serif;
  font-size:0.5rem;font-weight:500;letter-spacing:.24em;text-transform:uppercase;
  color:#4AC7FF;margin-bottom:8px;
  display:flex;align-items:center;gap:8px;
}
.m-sec-label-line{width:16px;height:1px;background:rgba(74,199,255,0.35)}
.m-sec-title{
  font-family:'Space Grotesk',sans-serif;
  font-size:clamp(1.5rem,5vw,2rem);font-weight:300;line-height:1.1;
  color:#F5F7FA;margin-bottom:6px;text-transform:uppercase;
  letter-spacing:-0.02em;
}
.m-sec-body{
  font-family:'Inter',sans-serif;
  font-size:0.8rem;color:#A7AFBB;
  line-height:1.7;margin-bottom:6px;
}
.m-sec-note{
  font-family:'Space Grotesk',sans-serif;
  font-size:0.55rem;font-weight:400;color:rgba(74,199,255,0.5);
  letter-spacing:.08em;
  padding-top:6px;border-top:1px solid rgba(74,199,255,0.1);
  line-height:1.5;
}
.m-sec-chips{
  display:flex;flex-wrap:wrap;gap:5px;margin-top:6px;
}
.m-sec-chip{
  display:flex;align-items:center;gap:4px;
  background:rgba(74,199,255,0.06);
  border:1px solid rgba(74,199,255,0.1);
  border-radius:14px;padding:3px 8px;
}
.m-sec-chip-val{
  font-family:'Space Mono',monospace;font-size:0.75rem;font-weight:700;
  color:#F5F7FA;line-height:1;
}
.m-sec-chip-lbl{
  font-family:'Space Grotesk',sans-serif;
  font-size:0.42rem;font-weight:500;letter-spacing:.16em;text-transform:uppercase;
  color:#4AC7FF;
}
.m-sec-ctas{
  display:flex;gap:6px;margin-top:8px;flex-wrap:wrap;
}
.m-sec-ctas .btn-p{font-size:0.55rem;padding:8px 14px}
.m-sec-ctas .btn-g{font-size:0.55rem;padding:8px 14px}

/* ── Mobile updates cards ── */
.m-upd-grid{display:flex;flex-direction:row;gap:8px;margin-top:8px;overflow-x:auto}
.m-upd-card{
  min-width:140px;max-width:160px;flex-shrink:0;
  background:rgba(74,199,255,0.03);
  border:1px solid rgba(74,199,255,0.08);
  border-radius:8px;overflow:hidden;
}
.m-upd-card-img{
  width:100%;aspect-ratio:16/10;
  object-fit:cover;display:block;
  border-bottom:1px solid rgba(74,199,255,0.06);
}
.m-upd-card-body{padding:6px 8px 8px}
.m-upd-card-tag{
  font-family:'Space Mono',monospace;
  font-size:0.42rem;font-weight:400;letter-spacing:.1em;text-transform:uppercase;
  color:rgba(74,199,255,0.4);margin-bottom:3px;
}
.m-upd-card-title{
  font-family:'Space Grotesk',sans-serif;
  font-size:0.8rem;font-weight:500;color:#F5F7FA;
  margin-bottom:3px;line-height:1.35;
}
.m-upd-card-desc{
  font-family:'Inter',sans-serif;
  font-size:0.7rem;color:rgba(167,175,187,0.8);line-height:1.55;
}

/* ── Mobile outro slide ── */
.m-outro-content{
  position:relative;z-index:30;
  display:flex;flex-direction:column;
  align-items:center;justify-content:center;
  flex:1;padding:60px 20px 36px;text-align:center;
}
.m-outro-logo{
  font-family:'Space Grotesk',sans-serif;font-size:0.7rem;font-weight:600;
  color:#F5F7FA;display:flex;align-items:center;gap:4px;margin-bottom:14px;
  letter-spacing:.08em;text-transform:uppercase;
}
.m-outro-icon{
  width:22px;height:22px;border-radius:4px;
  background:linear-gradient(135deg,#4AC7FF,#08111F);
  display:flex;align-items:center;justify-content:center;
  font-size:9px;font-weight:700;color:#fff;
}
.m-outro-title{
  font-family:'Space Grotesk',sans-serif;
  font-size:clamp(1.5rem,6vw,2.2rem);font-weight:300;line-height:1.1;
  color:#F5F7FA;margin-bottom:10px;text-transform:uppercase;
  letter-spacing:-0.02em;
}
.m-outro-title .oc{color:#4AC7FF}
.m-outro-sub{
  font-family:'Inter',sans-serif;
  font-size:0.8rem;color:#A7AFBB;line-height:1.7;
  max-width:280px;margin-bottom:22px;
}
.m-outro-ctas{
  display:flex;flex-direction:column;gap:8px;width:100%;max-width:260px;margin-bottom:20px;
}
.m-outro-ctas .btn-p,.m-outro-ctas .btn-g{
  width:100%;text-align:center;padding:12px 20px;font-size:0.55rem;
}
.m-outro-footer{
  margin-top:auto;
  font-family:'Inter',sans-serif;
  font-size:0.7rem;color:rgba(167,175,187,0.5);text-align:center;line-height:1.6;
  letter-spacing:.04em;
}
.m-outro-footer-tag{
  font-family:'Space Grotesk',sans-serif;
  font-size:0.42rem;font-weight:500;letter-spacing:.16em;text-transform:uppercase;
  color:rgba(74,199,255,0.2);margin-top:8px;
}

`

/* ═══════════════════════════════════════════════════════════════════
   PAGE COMPONENT
═══════════════════════════════════════════════════════════════════ */
export default function SFTHomePage() {
  /* ── Mobile detection ── */
  const [isMobile, setIsMobile] = useState(false)
  const [activeStory, setActiveStory] = useState(0)
  const totalStories = SECTIONS.length + 1 // 10 sections + 1 outro

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  /* ── Story navigation ── */
  const goNext = useCallback(() => {
    setActiveStory(prev => Math.min(totalStories - 1, prev + 1))
  }, [totalStories])

  const goPrev = useCallback(() => {
    setActiveStory(prev => Math.max(0, prev - 1))
  }, [])

  /* ── Touch swipe for stories ── */
  const touchStart = useRef<{ x: number; y: number; t: number } | null>(null)

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY, t: Date.now() }
  }, [])

  const onTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!touchStart.current) return
    const dx = e.changedTouches[0].clientX - touchStart.current.x
    const dy = e.changedTouches[0].clientY - touchStart.current.y
    const dt = Date.now() - touchStart.current.t
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40 && dt < 500) {
      if (dx < 0) goNext()
      else goPrev()
    }
    touchStart.current = null
  }, [goNext, goPrev])

  /* ── Desktop refs ── */
  const bgLayerARef = useRef<HTMLDivElement>(null)
  const bgLayerBRef = useRef<HTMLDivElement>(null)
  const bgActiveLayer = useRef<'a' | 'b'>('a')
  const bgInnerRef = useRef<HTMLDivElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const panelRefs = useRef<(HTMLDivElement | null)[]>([])
  const introRef = useRef<HTMLDivElement>(null)
  const outroRef = useRef<HTMLDivElement>(null)
  const fillRef = useRef<HTMLDivElement>(null)
  const dotRefs = useRef<(HTMLDivElement | null)[]>([])
  const ctrRef = useRef<HTMLSpanElement>(null)
  const ctrLabelRef = useRef<HTMLSpanElement>(null)
  const activeIdx = useRef(-1)

  useEffect(() => {
    if (isMobile) return

    let lenis: any // eslint-disable-line @typescript-eslint/no-explicit-any

    const boot = async () => {
      /* Lenis smooth scroll */
      const { default: Lenis } = await import('lenis')
      lenis = new Lenis({
        duration: 1.6,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      })
      lenis.on('scroll', ScrollTrigger.update)
      gsap.ticker.add((time: number) => lenis.raf(time * 1000))
      gsap.ticker.lagSmoothing(0)

      /* Preload images */
      SECTIONS.forEach(s => { const img = new Image(); img.src = s.img })

      const driver = document.getElementById('sd')!
      if (!driver) return

      const N = SECTIONS.length // 12
      const onScroll = () => {
        const pct = Math.max(0, Math.min(1, window.scrollY / (driver.offsetHeight - window.innerHeight)))

        /* progress bar */
        if (fillRef.current) fillRef.current.style.width = (pct * 100) + '%'

        /* section mapping: sections occupy 3%–93% of scroll */
        const sF = Math.max(0, (pct - 0.03) / 0.90) * (N + 1.5)  // 0 → N+1.5
        const newIdx = Math.min(N - 1, Math.floor(sF - 0.75))

        /* intro: visible when at top */
        if (introRef.current) introRef.current.classList.toggle('vis', sF < 0.72)

        /* outro: visible at very end */
        const isOutro = sF >= N + 0.5
        if (outroRef.current) outroRef.current.classList.toggle('vis', isOutro)

        if (isOutro) {
          panelRefs.current.forEach(p => p?.classList.remove('vis'))
          dotRefs.current.forEach((d, i) => d?.classList.toggle('act', i === N - 1))
          activeIdx.current = -1
          return
        }

        /* section counter + label */
        if (ctrRef.current) {
          const n = Math.min(N, Math.max(1, Math.ceil(sF - 0.5)))
          ctrRef.current.textContent = `${String(n).padStart(2, '0')} / ${String(N).padStart(2, '0')}`
        }
        if (ctrLabelRef.current) {
          const n = Math.min(N - 1, Math.max(0, Math.ceil(sF - 0.5) - 1))
          ctrLabelRef.current.textContent = SECTIONS[n]?.label ?? 'SFT'
        }

        /* parallax on both layers */
        const shift = (pct - 0.5) * 10
        if (bgLayerARef.current) {
          bgLayerARef.current.style.transform = `translateY(${shift}%)`
        }
        if (bgLayerBRef.current) {
          bgLayerBRef.current.style.transform = `translateY(${shift}%)`
        }

        if (newIdx === activeIdx.current) return
        activeIdx.current = newIdx

        /* Cross-fade background image */
        const s = SECTIONS[Math.max(0, newIdx)]
        const incoming = bgActiveLayer.current === 'a' ? bgLayerBRef.current : bgLayerARef.current
        const outgoing = bgActiveLayer.current === 'a' ? bgLayerARef.current : bgLayerBRef.current
        if (incoming && outgoing) {
          incoming.style.backgroundImage = `url(${s.img})`
          incoming.style.backgroundPosition = s.bgPos
          incoming.style.opacity = '1'
          outgoing.style.opacity = '0'
          bgActiveLayer.current = bgActiveLayer.current === 'a' ? 'b' : 'a'
        }
        if (overlayRef.current) overlayRef.current.style.background = s.overlay

        /* panels */
        panelRefs.current.forEach((p, i) => p?.classList.toggle('vis', i === newIdx))

        /* dots */
        dotRefs.current.forEach((d, i) => d?.classList.toggle('act', i === newIdx))
      }

      lenis.on('scroll', onScroll)
      onScroll()
    }

    boot()

    return () => {
      lenis?.destroy()
      ScrollTrigger.getAll().forEach(t => t.kill())
    }
  }, [isMobile])

  /* ═══════════════════════════════════════════════════════════════
     MOBILE: STORIES MODE
  ═══════════════════════════════════════════════════════════════ */
  if (isMobile) {
    return (
      <>
        <style>{CSS}</style>
        <div
          className="m-stories"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {/* Progress bars */}
          <div className="m-progress">
            {Array.from({ length: totalStories }).map((_, i) => (
              <div key={i} className="m-prog-bar">
                <div
                  className={`m-prog-fill${i < activeStory ? ' done' : ''}`}
                  style={i === activeStory ? { width: '100%', transition: 'none' } : {}}
                />
              </div>
            ))}
          </div>

          {/* Section slides */}
          {SECTIONS.map((s, i) => (
            <div
              key={i}
              className={`m-slide${i === activeStory ? ' active' : ''}`}
            >
              <div className="m-slide-bg" style={{ backgroundImage: `url(${s.img})` }} />
              <div className="m-slide-overlay" style={{ background: s.overlay }} />
              <div className="m-slide-vignette" />

              {/* Header */}
              <div className="m-header">
                <div className="m-header-logo">
                  <span className="m-header-icon">S</span>
                  SFT
                </div>
                <a href="#contact" className="m-header-cta">
                  Request Pilot
                </a>
              </div>

              {/* Tap zones */}
              <div className="m-tap-left" onClick={goPrev} />
              <div className="m-tap-right" onClick={goNext} />

              {/* Content */}
              <div className="m-content">
                <div className="m-content-inner">
                  <div className="m-sec-num">— {s.num}</div>
                  <div className="m-sec-label">
                    <span className="m-sec-label-line" />
                    {s.eyebrow}
                  </div>
                  <div className="m-sec-title">
                    {s.title.split('\n').slice(0, 2).map((line, li) => (
                      <span key={li}>{line} </span>
                    ))}
                  </div>
                  {s.body && (
                    <div className="m-sec-body">
                      {s.body.split('\n\n')[0].substring(0, 150)}
                      {s.body.length > 150 ? '...' : ''}
                    </div>
                  )}
                  {s.note && <div className="m-sec-note">{s.note}</div>}
                  {s.chips && s.chips.length > 0 && (
                    <div className="m-sec-chips">
                      {s.chips.map((c, ci) => (
                        <div key={ci} className="m-sec-chip">
                          <span className="m-sec-chip-val">{c.val}</span>
                          <span className="m-sec-chip-lbl">{c.lbl}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {/* Blog-style update cards */}
                  {'updates' in s && (s as typeof SECTIONS[9] & { updates: { title: string; desc: string; img: string }[] }).updates && (
                    <div className="m-upd-grid">
                      {(s as typeof SECTIONS[9] & { updates: { title: string; desc: string; img: string }[] }).updates.map((u, ui) => (
                        <div key={ui} className="m-upd-card">
                          <img src={u.img} alt={u.title} className="m-upd-card-img" />
                          <div className="m-upd-card-body">
                            <div className="m-upd-card-tag">UPDATE {String(ui + 1).padStart(2, '0')}</div>
                            <div className="m-upd-card-title">{u.title}</div>
                            <div className="m-upd-card-desc">{u.desc}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  {s.cta && s.cta.length > 0 && (
                    <div className="m-sec-ctas">
                      {s.cta.map((c, ci) => (
                        <a key={ci} href={c.href || 'tel:+919486675847'} className={c.style === 'primary' ? 'btn-p' : 'btn-g'}>
                          {c.label}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Outro slide */}
          <div className={`m-slide${activeStory === SECTIONS.length ? ' active' : ''}`}>
            <div className="m-slide-bg" style={{ backgroundImage: `url(${SECTIONS[0].img})` }} />
            <div className="m-slide-overlay" style={{ background: 'rgba(5,5,5,0.92)' }} />

            <div className="m-tap-left" onClick={goPrev} />

            <div className="m-outro-content">
              <div className="m-outro-logo">
                <span className="m-outro-icon">S</span>
                Susan Future Technologies
              </div>
              <h2 className="m-outro-title">
                Let&apos;s Build The<br />
                Next Layer of<br />
                <span className="oc">Connectivity.</span>
              </h2>
              <p className="m-outro-sub">
                Deployable communication systems, aerial monitoring platforms, and future HAPS infrastructure.
              </p>
              <div className="m-outro-ctas">
                <a href="tel:+919486675847" className="btn-p">Request a Pilot</a>
                <a href="mailto:info@susanfuturetechnologies.com" className="btn-g">Contact Us</a>
              </div>
              <div className="m-outro-footer">
                Susan Future Technologies Pvt. Ltd.<br />
                IIT Madras Research Park, Chennai
                <div className="m-outro-footer-tag">
                  Persistent Aerial Systems · HAPS · Communication · Monitoring
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }

  /* ═══════════════════════════════════════════════════════════════
     DESKTOP: GSAP SCROLL MODE
  ═══════════════════════════════════════════════════════════════ */
  return (
    <>
      <style>{CSS}</style>

      {/* Fixed background */}
      <div className="bg-fixed">
        <div
          ref={bgLayerARef}
          className="bg-inner-a"
          style={{
            backgroundImage: `url(${SECTIONS[0].img})`,
            backgroundSize: 'cover',
            backgroundPosition: SECTIONS[0].bgPos,
            opacity: 1,
          }}
        />
        <div
          ref={bgLayerBRef}
          className="bg-inner-b"
          style={{
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0,
          }}
        />
      </div>

      {/* Overlay gradient */}
      <div ref={overlayRef} className="overlay-layer" style={{ background: SECTIONS[0].overlay }} />

      {/* Vignette */}
      <div className="vignette" />

      {/* Scan lines */}
      <div className="scanlines" />

      {/* Signal pulse rings */}
      <div className="signal-rings">
        <div className="signal-ring" />
        <div className="signal-ring" />
        <div className="signal-ring" />
        <div className="signal-ring" />
      </div>

      {/* Floating particles */}
      <div className="particles">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              animationDuration: `${12 + Math.random() * 20}s`,
              animationDelay: `${Math.random() * 10}s`,
              width: `${1 + Math.random() * 2}px`,
              height: `${1 + Math.random() * 2}px`,
              opacity: 0.1 + Math.random() * 0.3,
            }}
          />
        ))}
      </div>

      {/* Nav */}
      <nav className="s-nav">
        {/* Left: Logo */}
        <div className="s-logo">
          <img src="/SFT-logo-1.png" alt="Susan Future Technologies" className="s-logo-img" />
        </div>

        {/* Center: Section indicator */}
        <div className="s-section">
          <span ref={ctrRef} className="s-sec-num">01 / 12</span>
          <span className="s-sep" />
          <span ref={ctrLabelRef} className="s-sec-label">Hero</span>
        </div>

        {/* Right: CTA */}
        <div className="s-nav-right">
          <a href="/about" className="s-nav-link">About</a>
          <a href="/hawke" className="s-nav-link">HAWKE</a>
          <a href="/mobius" className="s-nav-link">MOBIUS</a>
          <a href="/applications" className="s-nav-link">Applications</a>
          <a href="/ecosystem" className="s-nav-link">Ecosystem</a>
          <a href="tel:+919486675847" className="s-cta-btn">Request Pilot</a>
        </div>
      </nav>

      {/* Progress bar */}
      <div id="prog"><div ref={fillRef} id="prog-fill" /></div>

      {/* Dot indicators */}
      <div id="dots">
        {SECTIONS.map((_, i) => (
          <div key={i} ref={el => { dotRefs.current[i] = el }} className="dot" />
        ))}
      </div>

      {/* Tall scroll driver */}
      <div id="sd" />

      {/* Intro panel */}
      <div ref={introRef} className="intro-panel vis">
        <div className="i-eye">
          <span className="i-eye-line" />
          Susan Future Technologies
          <span className="i-eye-line" />
        </div>
        <h1 className="i-title">
          The Future of<br />
          Persistent Aerial<br />
          <span className="gc">Infrastructure.</span>
        </h1>
        <p className="i-sub">
          Deployable and high-altitude aerial platforms for communication, monitoring, and mission-critical operations.
        </p>
        <div className="i-ctas">
          <a href="/hawke" className="btn-p">Explore HAWKE</a>
          <a href="/mobius" className="btn-g">Explore MOBIUS</a>
        </div>
        <div className="i-scroll">
          <span className="i-dot" />Scroll to explore
        </div>
      </div>

      {/* Section content panels */}
      {SECTIONS.map((s, i) => {
        const isUpdates = 'updates' in s;
        return (
        <div
          key={i}
          ref={el => { panelRefs.current[i] = el }}
          className={`s-panel ${isUpdates ? 'pos-updates' : `pos-${s.pos}`}`}
        >
          {isUpdates ? (
            <>
              {/* Updates: Header row — heading left, button right */}
              <div className="upd-header">
                <div className="upd-header-left">
                  <div className="p-num">— {s.num}</div>
                  <div className="p-eyebrow">
                    <span className="p-eyebrow-line" />
                    {s.eyebrow}
                  </div>
                  <h2 className="p-title">
                    {s.title.split('\n').map((line, li) => (
                      <span key={li}>{line}<br /></span>
                    ))}
                  </h2>
                </div>
                {s.cta && s.cta.length > 0 && (
                  <div className="p-ctas" style={{ marginTop: 0 }}>
                    {s.cta.map((c, ci) => (
                      <a key={ci} href={c.href || 'tel:+919486675847'} className={c.style === 'primary' ? 'btn-p' : 'btn-g'}>
                        {c.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
              {/* Full-width blog cards */}
              <div className="upd-grid">
                {(s as typeof SECTIONS[9] & { updates: { title: string; desc: string; img: string }[] }).updates.map((u, ui) => (
                  <div key={ui} className="upd-card">
                    <img src={u.img} alt={u.title} className="upd-card-img" />
                    <div className="upd-card-body">
                      <div className="upd-card-tag">UPDATE {String(ui + 1).padStart(2, '0')}</div>
                      <div className="upd-card-title">{u.title}</div>
                      <div className="upd-card-desc">{u.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              <div className="p-num">— {s.num}</div>
              <div className="p-eyebrow">
                <span className="p-eyebrow-line" />
                {s.eyebrow}
              </div>
              <h2 className="p-title">
                {s.title.split('\n').map((line, li) => (
                  <span key={li}>{line}<br /></span>
                ))}
              </h2>
              {s.body && (
                <p className="p-body">{s.body}</p>
              )}
              {s.note && (
                <div className="p-note">{s.note}</div>
              )}
              {s.chips && s.chips.length > 0 && (
                <div className="p-chips">
                  {s.chips.map((c, ci) => (
                    <div key={ci} className="p-chip">
                      <span className="p-chip-val">{c.val}</span>
                      <span className="p-chip-lbl">{c.lbl}</span>
                    </div>
                  ))}
                </div>
              )}
              {s.cta && s.cta.length > 0 && (
                <div className="p-ctas">
                  {s.cta.map((c, ci) => (
                    <a key={ci} href={c.href || 'tel:+919486675847'} className={c.style === 'primary' ? 'btn-p' : 'btn-g'}>
                      {c.label}
                    </a>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
        );
      })}

      {/* Outro — Full CTA + Footer */}
      <div ref={outroRef} className="outro-panel">
        {/* Logo */}
        <div className="o-logo">
          <span className="o-logo-icon">S</span>
          Susan Future Technologies
        </div>

        {/* Eyebrow */}
        <div className="o-eyebrow">
          <span className="o-eyebrow-line" />
          High Altitude Platform Systems
          <span className="o-eyebrow-line" />
        </div>

        {/* Title */}
        <h2 className="o-title">
          Let&apos;s Build The<br />
          Next Layer of<br />
          <span className="oc">Connectivity.</span>
        </h2>

        {/* Subtitle */}
        <p className="o-sub">
          Deployable communication systems, aerial monitoring, and HAPS infrastructure. Let&apos;s talk.
        </p>

        {/* CTA buttons */}
        <div className="o-cta-row">
          <a href="tel:+919486675847" className="btn-p">Request a Pilot</a>
          <a href="mailto:info@susanfuturetechnologies.com" className="btn-g">Contact Us</a>
          <a href="/hawke" className="btn-g">Explore HAWKE</a>
          <a href="/mobius" className="btn-g">Explore MOBIUS</a>
        </div>

        {/* Divider */}
        <div className="o-divider" />

        {/* Footer */}
        <div className="o-footer">
          <div className="o-footer-nav">
            <a href="/about" className="o-footer-link">About</a>
            <a href="/hawke" className="o-footer-link">HAWKE</a>
            <a href="/mobius" className="o-footer-link">MOBIUS</a>
            <a href="/applications" className="o-footer-link">Applications</a>
            <a href="/ecosystem" className="o-footer-link">Ecosystem</a>
            <a href="mailto:info@susanfuturetechnologies.com" className="o-footer-link">Contact</a>
          </div>
          <div className="o-footer-info">
            Susan Future Technologies Pvt. Ltd.<br />
            IIT Madras Research Park, Chennai
          </div>
          <div className="o-footer-tagline">
            <span className="o-footer-dot" />
            Persistent aerial systems for communication, monitoring, and high-altitude operations
            <span className="o-footer-dot" />
          </div>
        </div>
      </div>
    </>
  )
}
