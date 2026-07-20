'use client'
import { useEffect, useRef, useState, useCallback } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/* ── SVG Icon Map ── */
const ICON: Record<string, string> = {
  plane: 'M21 16v-2l-8-5V3.5A1.5 1.5 0 0011.5 2 1.5 1.5 0 0010 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5z',
  antenna: 'M12 10a2 2 0 100-4 2 2 0 000 4zm0 2c-3.31 0-6-2.69-6-6h2a4 4 0 008 0h2c0 3.31-2.69 6-6 6zm0 4c-5.52 0-10-4.48-10-10h2a8 8 0 0016 0h2c0 5.52-4.48 10-10 10zM11 16v6h2v-6z',
  signal: 'M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3a4.24 4.24 0 00-6 0zm-4-4l2 2a7.07 7.07 0 0110 0l2-2C14.14 8.14 9.86 8.14 5 13z',
  target: 'M12 2C6.49 2 2 6.49 2 12s4.49 10 10 10 10-4.49 10-10S17.51 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3-8a3 3 0 11-6 0 3 3 0 016 0z',
  build: 'M22 4H2v16h20V4zm-2 14H4V8h16v10zM6 10h12v2H6v-2zm0 4h8v2H6v-2z',
  rocket: 'M12 2.5s-5 7.5-5 12a5 5 0 0010 0c0-4.5-5-12-5-12zM12 18a2 2 0 110-4 2 2 0 010 4z',
  bolt: 'M11 21h-1l1-7H7.5c-.89 0-.45-.53-.05-1.08l5.55-8.42h1l-1 7h3.5c.49 0 .56.34.16.88L11 21z',
  monitor: 'M21 2H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h7v2H8v2h8v-2h-2v-2h7c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H3V4h18v12z',
  camera: 'M12 15.2a3.2 3.2 0 100-6.4 3.2 3.2 0 000 6.4zM9 2L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3.17L15 2H9z',
  thermo: 'M15 13V5a3 3 0 00-6 0v8a5 5 0 106 0zm-3 7a3 3 0 01-1.5-5.6V5a1.5 1.5 0 013 0v9.4A3 3 0 0112 20z',
  chart: 'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z',
  globe: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z',
  alert: 'M12 2L1 21h22L12 2zm0 4l7.53 13H4.47L12 6zm-1 5v4h2v-4h-2zm0 6v2h2v-2h-2z',
  shield: 'M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z',
  pick: 'M14.79 10.62L3.5 21.9 2.1 20.5 13.38 9.21l1.41 1.41zM19.27 2.05L17.86 3.46l1.41 1.41L17.86 6.28l-2.12-2.12L14.33 5.57l.71.71-1.42 1.41-.71-.71L11.5 8.39l2.12 2.12-1.41 1.42-.71-.71-1.41 1.41.71.71-1.42 1.42-2.12-2.12L5.85 14.05l2.12 2.12L6.56 17.58',
  leaf: 'M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66.95-2.71c.67.21 1.37.34 2.09.38C14 20 17 15 17 8zM6.73 17.1c1.4-3.84 3.35-7.38 7.27-9.04-.66 3.56-2.45 6.64-5.08 8.52-.81.03-1.54-.12-2.19-.48z',
  clock: 'M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z',
  mountain: 'M14 6l-3.75 5 2.85 3.8-1.6 1.2C9.81 13.75 7 10 7 10l-6 8h22L14 6z',
  wrench: 'M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z',
  refresh: 'M17.65 6.35A7.958 7.958 0 0012 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0112 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z',
  trending: 'M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z',
  satellite: 'M13 9h-2V7h2v2zm0 2h-2v6h2v-6zm4-2V3H7v6l5 5 5-5zm-2-4v2.17l-3 3-3-3V5h6z',
  helicopter: 'M22 11h-6V9h6V7H4v2h6v2H4v2h7v2H9l-3 3v1h12v-1l-3-3h-2v-2h9v-2z',
}
function SvgIcon({ name, size = 28 }: { name: string; size?: number }) {
  const d = ICON[name]
  if (!d) return <span style={{width:size,height:size,display:'inline-block'}} />
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d={d} fill="currentColor" stroke="none" /></svg>
}

/* ═══════════════════════════════════════════════════════════════════
   SECTION DATA — MOBIUS Product Chapters
═══════════════════════════════════════════════════════════════════ */
const SECTIONS: {
  num: string; label: string; title: string; body: string; note: string;
  chips: { val: string; lbl: string }[];
  pos: 'left' | 'right' | 'center'; bgPos: string; img: string; overlay: string; eyebrow: string;
  cta: { label: string; style: string; href: string }[];
  [key: string]: unknown;
}[] = [
  {
    num: '01', label: 'Hero',
    title: 'MOBIUS',
    body: 'A high-altitude platform system (HAPS) engineered for persistent, scalable aerial infrastructure — operating above weather, above limitations.',
    note: '',
    chips: [],
    pos: 'center' as const,
    bgPos: 'center center',
    img: '/sft/mobius/hero.png',
    overlay: 'radial-gradient(ellipse at center, rgba(5,5,5,0.86) 0%, rgba(5,5,5,0.65) 40%, rgba(5,5,5,0.3) 65%, transparent 100%)',
    eyebrow: 'HIGH-ALTITUDE PLATFORM SYSTEM',
    cta: [
      { label: 'Contact Us', style: 'primary', href: 'mailto:info@susanfuturetechnologies.com' },
      { label: 'Learn More', style: 'ghost', href: 'tel:+919486675847' },
    ],
  },
  {
    num: '02', label: 'Vision',
    title: 'BEYOND\nGROUND.\nBEYOND\nORBIT\nLIMITATIONS.',
    body: 'MOBIUS occupies the stratospheric layer between terrestrial infrastructure and satellites — delivering the persistence of towers with the coverage of satellites, at a fraction of the cost.',
    note: 'Operating at 20+ km altitude, MOBIUS provides a unique vantage point for communication, observation, and connectivity services.',
    chips: [],
    pos: 'center' as const,
    bgPos: 'center center',
    img: '/sft/mobius/vision.png',
    overlay: 'radial-gradient(ellipse at center, rgba(5,5,5,0.88) 0%, rgba(5,5,5,0.68) 40%, rgba(5,5,5,0.3) 65%, transparent 100%)',
    eyebrow: 'THE STRATOSPHERIC ADVANTAGE',
    cta: [],
  },
  {
    num: '03', label: 'Metrics',
    title: 'KEY\nCAPABILITY\nMETRICS',
    body: '',
    note: '',
    chips: [],
    pos: 'center' as const,
    bgPos: 'center center',
    img: '/sft/mobius/metrics.png',
    overlay: 'radial-gradient(ellipse at center, rgba(5,5,5,0.88) 0%, rgba(5,5,5,0.68) 40%, rgba(5,5,5,0.3) 65%, transparent 100%)',
    eyebrow: 'PERFORMANCE AT SCALE',
    cta: [],
    metrics: [
      { val: '20+ KM', desc: 'Stratospheric Operating Altitude' },
      { val: '200 KM', desc: 'Coverage Diameter' },
      { val: 'MONTHS', desc: 'Continuous Endurance' },
      { val: 'MULTI', desc: 'Payload Configuration' },
    ],
  },
  {
    num: '04', label: 'Overview',
    title: 'A NEW LAYER\nOF AERIAL\nINFRASTRUCTURE',
    body: 'MOBIUS is not a drone, not a satellite, and not a balloon. It is a purpose-built stratospheric platform designed for long-endurance operations with modular payload capability.',
    note: 'Solar-powered, autonomous, and designed for continuous operation above weather systems.',
    chips: [],
    pos: 'left' as const,
    bgPos: 'right center',
    img: '/sft/mobius/overview.png',
    overlay: 'linear-gradient(90deg, rgba(5,5,5,0.94) 0%, rgba(5,5,5,0.82) 38%, rgba(5,5,5,0.3) 65%, transparent 100%)',
    eyebrow: 'PLATFORM OVERVIEW',
    cta: [],
  },
  {
    num: '05', label: 'Why',
    title: 'WHY IT\nMATTERS',
    body: '',
    note: '',
    chips: [],
    pos: 'center' as const,
    bgPos: 'center center',
    img: '/sft/mobius/matters.png',
    overlay: 'radial-gradient(ellipse at center, rgba(5,5,5,0.88) 0%, rgba(5,5,5,0.72) 40%, rgba(5,5,5,0.4) 65%, rgba(5,5,5,0.2) 100%)',
    eyebrow: 'THE INFRASTRUCTURE GAP',
    cta: [],
    problems: [
      { problem: 'TERRESTRIAL', issue: 'Limited range, expensive to build, vulnerable to disasters', icon: 'build' },
      { problem: 'SATELLITE', issue: 'High latency, massive cost, long deployment cycles', icon: 'satellite' },
      { problem: 'DRONES', issue: 'Short endurance, small coverage, regulatory barriers', icon: 'helicopter' },
    ],
    solution: 'MOBIUS bridges the gap — stratospheric persistence with terrestrial-grade latency and satellite-scale coverage.',
  },
  {
    num: '06', label: 'Architecture',
    title: 'CORE\nSYSTEMS',
    body: 'Five integrated subsystems designed for autonomous stratospheric operation.',
    note: '',
    chips: [],
    pos: 'right' as const,
    bgPos: 'left center',
    img: '/sft/mobius/architecture.png',
    overlay: 'linear-gradient(270deg, rgba(5,5,5,0.94) 0%, rgba(5,5,5,0.82) 38%, rgba(5,5,5,0.3) 65%, transparent 100%)',
    eyebrow: 'SYSTEM ARCHITECTURE',
    cta: [],
    systems: [
      'Airframe — Ultra-lightweight composite structure',
      'Propulsion — Electric motors with solar regeneration',
      'Energy — Solar array + battery management system',
      'Payload Bay — Modular, hot-swappable mission packages',
      'Autonomy — AI-driven flight control + station-keeping',
    ],
  },
  {
    num: '07', label: 'Capabilities',
    title: 'PLATFORM\nCAPABILITIES',
    body: '',
    note: '',
    chips: [],
    pos: 'center' as const,
    bgPos: 'center center',
    img: '/sft/mobius/capabilities.png',
    overlay: 'radial-gradient(ellipse at center, rgba(5,5,5,0.88) 0%, rgba(5,5,5,0.68) 40%, rgba(5,5,5,0.3) 65%, transparent 100%)',
    eyebrow: 'WHAT MOBIUS DELIVERS',
    cta: [],
    capabilities: [
      { icon: 'clock', title: 'PERSISTENCE', desc: 'Months of continuous operation without landing or refueling' },
      { icon: 'trending', title: 'SCALABILITY', desc: 'Deploy multiple platforms for mesh network coverage' },
      { icon: 'wrench', title: 'ADAPTABILITY', desc: 'Modular payloads for telecom, observation, and research' },
      { icon: 'globe', title: 'COVERAGE', desc: '200 km diameter footprint from a single platform' },
    ],
  },
  {
    num: '08', label: 'Applications',
    title: 'APPLICATION\nDOMAINS',
    body: '',
    note: '',
    chips: [],
    pos: 'center' as const,
    bgPos: 'center center',
    img: '/sft/mobius/applications.png',
    overlay: 'radial-gradient(ellipse at center, rgba(5,5,5,0.88) 0%, rgba(5,5,5,0.72) 40%, rgba(5,5,5,0.4) 65%, rgba(5,5,5,0.2) 100%)',
    eyebrow: 'SECTORS & USE CASES',
    cta: [],
    applications: [
      { title: 'TELECOMMUNICATIONS', desc: '5G/LTE backhaul, rural connectivity, emergency comms restoration', icon: 'antenna' },
      { title: 'DEFENCE & SECURITY', desc: 'ISR, border surveillance, secure communication networks', icon: 'shield' },
      { title: 'ENVIRONMENT', desc: 'Climate monitoring, ocean observation, atmospheric research', icon: 'leaf' },
      { title: 'DISASTER RESPONSE', desc: 'Post-disaster communication, situational awareness, coordination', icon: 'alert' },
    ],
  },
  {
    num: '09', label: 'Roadmap',
    title: 'DEVELOPMENT\nROADMAP',
    body: '',
    note: '',
    chips: [],
    pos: 'center' as const,
    bgPos: 'center center',
    img: '/sft/mobius/roadmap.png',
    overlay: 'radial-gradient(ellipse at center, rgba(5,5,5,0.88) 0%, rgba(5,5,5,0.72) 40%, rgba(5,5,5,0.4) 65%, rgba(5,5,5,0.2) 100%)',
    eyebrow: 'PATH TO DEPLOYMENT',
    cta: [],
    phases: [
      { phase: 'PHASE 1', period: '2024–2025', title: 'DESIGN & PROTOTYPE', items: ['Aerodynamic design finalization', 'Subsystem development', 'Ground testing'] },
      { phase: 'PHASE 2', period: '2025–2026', title: 'FLIGHT TESTING', items: ['Low-altitude flight trials', 'System integration testing', 'Payload validation'] },
      { phase: 'PHASE 3', period: '2027+', title: 'STRATOSPHERIC OPS', items: ['Full altitude deployment', 'Extended endurance testing', 'Commercial operations'] },
    ],
  },
  {
    num: '10', label: 'Future',
    title: 'TOWARD A NEW\nCONNECTIVITY\nLAYER',
    body: 'Imagine a network of stratospheric platforms providing always-on connectivity across entire regions — no ground infrastructure needed, no satellite delays, no coverage gaps.',
    note: 'MOBIUS represents the beginning of a new era in aerial infrastructure — where the sky becomes a permanent, adaptable platform for human connectivity.',
    chips: [],
    pos: 'center' as const,
    bgPos: 'center center',
    img: '/sft/mobius/future.png',
    overlay: 'radial-gradient(ellipse at center, rgba(5,5,5,0.88) 0%, rgba(5,5,5,0.72) 40%, rgba(5,5,5,0.35) 65%, transparent 100%)',
    eyebrow: 'THE VISION',
    cta: [],
  },
  {
    num: '11', label: 'Connect',
    title: 'BUILD THE\nFUTURE OF\nAERIAL\nINFRASTRUCTURE',
    body: 'If you are exploring stratospheric platforms, HAPS technology, or next-generation connectivity solutions — let\'s talk.',
    note: '',
    chips: [],
    pos: 'center' as const,
    bgPos: 'center center',
    img: '/sft/mobius/cta.png',
    overlay: 'radial-gradient(ellipse at center, rgba(5,5,5,0.88) 0%, rgba(5,5,5,0.72) 40%, rgba(5,5,5,0.35) 65%, transparent 100%)',
    eyebrow: 'GET IN TOUCH',
    cta: [
      { label: 'Contact Us', style: 'primary', href: 'mailto:info@susanfuturetechnologies.com' },
      { label: 'Partner With Us', style: 'ghost', href: 'tel:+919486675847' },
    ],
  },
]

/* ═══════════════════════════════════════════════════════════════════
   STYLES
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
.bg-inner-a,.bg-inner-b{
  position:absolute;inset:0;
  background-size:cover;background-position:center;
  will-change:transform,opacity;
  transition:opacity 1.2s cubic-bezier(.16,1,.3,1);
}

/* ── Overlay gradient ── */
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
.s-logo{display:flex;align-items:center}
.s-logo-img{height:40px;width:auto;object-fit:contain}
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
.s-nav-right{display:flex;align-items:center;gap:18px}
.s-nav-link{
  font-family:'Space Grotesk',sans-serif;
  font-size:0.75rem;font-weight:500;letter-spacing:.18em;text-transform:uppercase;
  color:rgba(255,255,255,0.3);text-decoration:none;transition:color .2s;
}
.s-nav-link:hover{color:rgba(255,255,255,0.6)}
.s-nav-link.active{color:rgba(74,199,255,0.7)}
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

/* ── Typography ── */
.p-eyebrow{
  font-family:'Space Grotesk',sans-serif;
  font-size:0.7rem;font-weight:500;letter-spacing:.28em;text-transform:uppercase;
  color:#4AC7FF;margin-bottom:12px;
  display:flex;align-items:center;gap:10px;
}
.p-eyebrow-line{width:22px;height:1px;background:rgba(74,199,255,0.35);flex-shrink:0}
.pos-right .p-eyebrow{flex-direction:row-reverse}
.pos-center .p-eyebrow{justify-content:center}

.p-num{
  font-family:'Space Mono',monospace;font-size:0.7rem;font-weight:400;
  letter-spacing:.1em;color:rgba(255,255,255,0.15);margin-bottom:6px;
}

.p-title{
  font-family:'Space Grotesk',sans-serif;
  font-size:clamp(2rem,3.5vw,3.5rem);
  font-weight:300;line-height:1.08;letter-spacing:-0.03em;
  color:#F5F7FA;white-space:pre-line;margin-bottom:14px;
  text-transform:uppercase;
  text-shadow:0 4px 32px rgba(0,0,0,0.6);
}

.p-body{
  font-family:'Inter',sans-serif;
  font-size:0.82rem;color:#A7AFBB;
  line-height:1.72;max-width:380px;font-weight:400;margin-bottom:12px;
  white-space:pre-line;
}
.pos-right .p-body,.pos-right .p-note{margin-left:auto}
.pos-center .p-body{max-width:460px}

.p-note{
  font-family:'Space Grotesk',sans-serif;
  font-size:0.72rem;font-weight:400;color:rgba(74,199,255,0.6);
  letter-spacing:.08em;padding-top:10px;
  border-top:1px solid rgba(74,199,255,0.12);
  max-width:380px;line-height:1.5;
  white-space:pre-line;
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

/* ── Metrics grid ── */
.metrics-grid{
  display:grid;grid-template-columns:repeat(4,1fr);gap:20px;
  width:100%;max-width:900px;margin-top:24px;
}
.metric-card{
  background:rgba(74,199,255,0.04);
  border:1px solid rgba(74,199,255,0.1);
  border-radius:12px;padding:28px 20px;
  backdrop-filter:blur(10px);
  text-align:center;
  opacity:0;transform:translateY(60px);
  transition:opacity 0.8s cubic-bezier(.16,1,.3,1), transform 0.8s cubic-bezier(.16,1,.3,1), background 0.3s ease, border-color 0.3s ease;
}
.vis .metric-card{opacity:1;transform:translateY(0)}
.vis .metric-card:nth-child(1){transition-delay:0s}
.vis .metric-card:nth-child(2){transition-delay:0.15s}
.vis .metric-card:nth-child(3){transition-delay:0.3s}
.vis .metric-card:nth-child(4){transition-delay:0.45s}
.metric-card:hover{
  background:rgba(74,199,255,0.1);
  border-color:rgba(74,199,255,0.25);
}
.metric-val{
  font-family:'Space Mono',monospace;
  font-size:1.6rem;font-weight:700;color:#4AC7FF;
  margin-bottom:8px;letter-spacing:-0.02em;
}
.metric-desc{
  font-family:'Inter',sans-serif;
  font-size:0.85rem;color:rgba(167,175,187,0.7);line-height:1.5;
}

/* ── Capabilities grid ── */
.cap-grid{
  display:grid;grid-template-columns:repeat(4,1fr);gap:20px;
  width:100%;max-width:960px;margin-top:24px;
}
.cap-card{
  background:rgba(74,199,255,0.04);
  border:1px solid rgba(74,199,255,0.1);
  border-radius:12px;padding:28px 20px;
  backdrop-filter:blur(10px);
  text-align:center;
  opacity:0;transform:translateY(60px);
  transition:opacity 0.8s cubic-bezier(.16,1,.3,1), transform 0.8s cubic-bezier(.16,1,.3,1), background 0.3s ease, border-color 0.3s ease;
}
.vis .cap-card{opacity:1;transform:translateY(0)}
.vis .cap-card:nth-child(1){transition-delay:0s}
.vis .cap-card:nth-child(2){transition-delay:0.15s}
.vis .cap-card:nth-child(3){transition-delay:0.3s}
.vis .cap-card:nth-child(4){transition-delay:0.45s}
.cap-card:hover{
  background:rgba(74,199,255,0.1);
  border-color:rgba(74,199,255,0.25);
}
.cap-icon{font-size:1.6rem;margin-bottom:12px}
.cap-title{
  font-family:'Space Grotesk',sans-serif;
  font-size:0.85rem;font-weight:600;letter-spacing:.18em;text-transform:uppercase;
  color:#4AC7FF;margin-bottom:8px;
}
.cap-desc{
  font-family:'Inter',sans-serif;
  font-size:0.82rem;color:rgba(167,175,187,0.7);line-height:1.55;
}

/* ── Application cards ── */
.app-grid{
  display:grid;grid-template-columns:repeat(4,1fr);gap:20px;
  width:100%;max-width:960px;margin-top:24px;
}
.app-card{
  background:rgba(74,199,255,0.04);
  border:1px solid rgba(74,199,255,0.1);
  border-radius:12px;padding:28px 20px;
  backdrop-filter:blur(10px);
  text-align:center;
  opacity:0;transform:translateY(60px);
  transition:opacity 0.8s cubic-bezier(.16,1,.3,1), transform 0.8s cubic-bezier(.16,1,.3,1), background 0.3s ease, border-color 0.3s ease;
}
.vis .app-card{opacity:1;transform:translateY(0)}
.vis .app-card:nth-child(1){transition-delay:0s}
.vis .app-card:nth-child(2){transition-delay:0.15s}
.vis .app-card:nth-child(3){transition-delay:0.3s}
.vis .app-card:nth-child(4){transition-delay:0.45s}
.app-card:hover{
  background:rgba(74,199,255,0.1);
  border-color:rgba(74,199,255,0.25);
}
.app-icon{font-size:1.6rem;margin-bottom:12px}
.app-title{
  font-family:'Space Grotesk',sans-serif;
  font-size:0.8rem;font-weight:600;letter-spacing:.16em;text-transform:uppercase;
  color:#F5F7FA;margin-bottom:8px;
}
.app-desc{
  font-family:'Inter',sans-serif;
  font-size:0.82rem;color:rgba(167,175,187,0.7);line-height:1.55;
}

/* ── Problems + Solution ── */
.problems-grid{
  display:grid;grid-template-columns:repeat(3,1fr);gap:20px;
  width:100%;max-width:800px;margin-top:24px;
}
.problem-card{
  background:rgba(255,100,100,0.04);
  border:1px solid rgba(255,100,100,0.12);
  border-radius:12px;padding:24px 16px;
  backdrop-filter:blur(10px);
  text-align:center;
  opacity:0;transform:translateY(50px);
  transition:opacity 0.7s cubic-bezier(.16,1,.3,1), transform 0.7s cubic-bezier(.16,1,.3,1), background 0.3s ease, border-color 0.3s ease;
}
.vis .problem-card{opacity:1;transform:translateY(0)}
.vis .problem-card:nth-child(1){transition-delay:0s}
.vis .problem-card:nth-child(2){transition-delay:0.12s}
.vis .problem-card:nth-child(3){transition-delay:0.24s}
.problem-card:hover{
  background:rgba(255,100,100,0.08);
  border-color:rgba(255,100,100,0.2);
}
.problem-icon{font-size:1.4rem;margin-bottom:10px}
.problem-name{
  font-family:'Space Grotesk',sans-serif;
  font-size:0.85rem;font-weight:600;letter-spacing:.16em;text-transform:uppercase;
  color:#F5F7FA;margin-bottom:8px;
}
.problem-issue{
  font-family:'Inter',sans-serif;
  font-size:0.82rem;color:rgba(167,175,187,0.7);line-height:1.55;
}
.solution-banner{
  margin-top:20px;
  background:rgba(74,199,255,0.06);
  border:1px solid rgba(74,199,255,0.2);
  border-radius:12px;padding:18px 28px;
  max-width:800px;
  font-family:'Space Grotesk',sans-serif;
  font-size:0.85rem;font-weight:500;letter-spacing:.06em;
  color:#4AC7FF;text-align:center;line-height:1.6;
}

/* ── Systems list ── */
.systems-list{
  display:flex;flex-direction:column;gap:10px;margin-top:16px;
}
.system-item{
  font-family:'Space Grotesk',sans-serif;
  font-size:0.85rem;font-weight:400;color:rgba(255,255,255,0.5);
  letter-spacing:.08em;
  padding:10px 0;
  border-bottom:1px solid rgba(74,199,255,0.08);
  display:flex;align-items:center;gap:10px;
}
.system-dot{width:4px;height:4px;border-radius:50%;background:#4AC7FF;flex-shrink:0}

/* ── Roadmap phases ── */
.phases-grid{
  display:grid;grid-template-columns:repeat(3,1fr);gap:20px;
  width:100%;max-width:900px;margin-top:24px;
}
.phase-card{
  background:rgba(74,199,255,0.04);
  border:1px solid rgba(74,199,255,0.1);
  border-radius:12px;padding:24px 20px;
  backdrop-filter:blur(10px);
  text-align:left;
  opacity:0;transform:translateY(50px);
  transition:opacity 0.7s cubic-bezier(.16,1,.3,1), transform 0.7s cubic-bezier(.16,1,.3,1), background 0.3s ease, border-color 0.3s ease;
  position:relative;
}
.vis .phase-card{opacity:1;transform:translateY(0)}
.vis .phase-card:nth-child(1){transition-delay:0s}
.vis .phase-card:nth-child(2){transition-delay:0.15s}
.vis .phase-card:nth-child(3){transition-delay:0.3s}
.phase-card:hover{
  background:rgba(74,199,255,0.1);
  border-color:rgba(74,199,255,0.25);
}
.phase-card::before{
  content:'';position:absolute;top:0;left:20px;right:20px;height:2px;
  background:linear-gradient(90deg,#4AC7FF,rgba(74,199,255,0.1));
  border-radius:1px;
}
.phase-label{
  font-family:'Space Mono',monospace;
  font-size:0.7rem;font-weight:400;letter-spacing:.1em;
  color:rgba(255,255,255,0.25);margin-bottom:4px;margin-top:4px;
}
.phase-period{
  font-family:'Space Mono',monospace;
  font-size:1.1rem;font-weight:700;color:#4AC7FF;
  margin-bottom:8px;
}
.phase-title{
  font-family:'Space Grotesk',sans-serif;
  font-size:0.85rem;font-weight:600;letter-spacing:.12em;text-transform:uppercase;
  color:#F5F7FA;margin-bottom:10px;
}
.phase-items{list-style:none;padding:0}
.phase-item{
  font-family:'Inter',sans-serif;
  font-size:0.78rem;color:rgba(167,175,187,0.7);line-height:1.55;
  padding:3px 0;padding-left:14px;position:relative;
}
.phase-item::before{
  content:'';position:absolute;left:0;top:10px;
  width:4px;height:4px;border-radius:50%;background:rgba(74,199,255,0.4);
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
  font-size:0.85rem;font-weight:500;letter-spacing:.28em;text-transform:uppercase;
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
  font-size:0.95rem;color:#A7AFBB;line-height:1.82;
  max-width:480px;margin-bottom:42px;text-align:center
}
.i-ctas{display:flex;gap:12px;margin-bottom:48px}
.i-scroll{
  display:flex;align-items:center;gap:10px;font-size:0.85rem;
  font-family:'Space Grotesk',sans-serif;
  letter-spacing:.2em;text-transform:uppercase;color:rgba(255,255,255,0.2);
  justify-content:center
}
.i-dot{
  width:5px;height:5px;border-radius:50%;background:#4AC7FF;
  animation:pulse 2.2s ease infinite
}
@keyframes pulse{0%,100%{opacity:.2;transform:scale(1)}50%{opacity:1;transform:scale(1.3)}}

/* ── Signal pulse ── */
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
.o-logo-img{height:36px;width:auto;object-fit:contain}
.o-eyebrow{
  font-family:'Space Grotesk',sans-serif;
  font-size:0.85rem;font-weight:500;letter-spacing:.28em;text-transform:uppercase;
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
  font-size:0.95rem;color:#A7AFBB;line-height:1.82;
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
  font-size:0.85rem;font-weight:500;letter-spacing:.18em;text-transform:uppercase;
  color:rgba(255,255,255,0.2);text-decoration:none;transition:color .2s;
}
.o-footer-link:hover{color:rgba(74,199,255,0.6)}
.o-footer-info{
  font-family:'Inter',sans-serif;
  font-size:0.9rem;color:rgba(167,175,187,0.6);text-align:center;line-height:1.6;
}
.o-footer-tagline{
  font-family:'Space Grotesk',sans-serif;
  font-size:0.8rem;font-weight:500;letter-spacing:.2em;text-transform:uppercase;
  color:rgba(74,199,255,0.2);margin-top:8px;
  display:flex;align-items:center;gap:8px;
}
.o-footer-dot{width:3px;height:3px;border-radius:50%;background:rgba(74,199,255,0.4)}

/* ── Scroll driver ── */
#sd{height:1690vh;position:relative;z-index:5;pointer-events:none}


/* ═══════════════════════════════════════════════════════════════
   MOBILE — STORIES MODE
═══════════════════════════════════════════════════════════════ */

.m-stories{
  position:fixed;inset:0;z-index:500;
  overflow:hidden;background:#050505;
  touch-action:pan-y;
}
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

.m-slide{
  position:absolute;inset:0;
  opacity:0;transform:scale(0.95);
  transition:opacity .35s ease, transform .35s ease;
  pointer-events:none;display:flex;flex-direction:column;
}
.m-slide.active{opacity:1;transform:scale(1);pointer-events:auto}

.m-slide-bg{position:absolute;inset:0;background-size:cover;background-position:center}
.m-slide-overlay{position:absolute;inset:0}
.m-slide-vignette{
  position:absolute;inset:0;
  background:linear-gradient(180deg, rgba(5,5,5,.3) 0%, rgba(5,5,5,.1) 30%, rgba(5,5,5,.55) 65%, rgba(5,5,5,.94) 100%);
}

.m-tap-left,.m-tap-right{position:absolute;top:50px;bottom:0;z-index:40}
.m-tap-left{left:0;width:30%}
.m-tap-right{right:0;width:70%}

.m-header{
  position:relative;z-index:50;
  display:flex;align-items:center;justify-content:space-between;
  padding:20px 16px 0;
}
.m-header-logo{display:flex;align-items:center}
.m-header-logo-img{height:28px;width:auto;object-fit:contain}
.m-header-cta{
  font-family:'Space Grotesk',sans-serif;font-size:0.55rem;font-weight:700;
  letter-spacing:.14em;text-transform:uppercase;
  background:transparent;color:#4AC7FF;
  border:1px solid rgba(74,199,255,0.4);
  padding:7px 12px;border-radius:50px;text-decoration:none;
}

.m-content{position:relative;z-index:30;margin-top:auto;padding:0 12px 20px}
.m-content-inner{
  background:rgba(5,5,5,.5);backdrop-filter:blur(16px);
  border:1px solid rgba(74,199,255,0.08);border-radius:14px;padding:16px;
}
.m-sec-num{
  font-family:'Space Mono',monospace;font-size:0.5rem;font-weight:400;
  letter-spacing:.1em;color:rgba(255,255,255,0.18);margin-bottom:4px;
}
.m-sec-label{
  font-family:'Space Grotesk',sans-serif;font-size:0.5rem;font-weight:500;
  letter-spacing:.24em;text-transform:uppercase;color:#4AC7FF;margin-bottom:8px;
  display:flex;align-items:center;gap:8px;
}
.m-sec-label-line{width:16px;height:1px;background:rgba(74,199,255,0.35)}
.m-sec-title{
  font-family:'Space Grotesk',sans-serif;
  font-size:clamp(1.5rem,5vw,2rem);font-weight:300;line-height:1.1;
  color:#F5F7FA;margin-bottom:6px;text-transform:uppercase;letter-spacing:-0.02em;
}
.m-sec-body{
  font-family:'Inter',sans-serif;font-size:0.8rem;color:#A7AFBB;
  line-height:1.7;margin-bottom:6px;
}
.m-sec-note{
  font-family:'Space Grotesk',sans-serif;font-size:0.55rem;font-weight:400;
  color:rgba(74,199,255,0.5);letter-spacing:.08em;
  padding-top:6px;border-top:1px solid rgba(74,199,255,0.1);line-height:1.5;
}
.m-sec-chips{display:flex;flex-wrap:wrap;gap:5px;margin-top:6px}
.m-sec-chip{
  display:flex;align-items:center;gap:4px;
  background:rgba(74,199,255,0.06);border:1px solid rgba(74,199,255,0.1);
  border-radius:14px;padding:3px 8px;
}
.m-sec-chip-val{font-family:'Space Mono',monospace;font-size:0.75rem;font-weight:700;color:#F5F7FA;line-height:1}
.m-sec-chip-lbl{
  font-family:'Space Grotesk',sans-serif;font-size:0.42rem;font-weight:500;
  letter-spacing:.16em;text-transform:uppercase;color:#4AC7FF;
}
.m-sec-ctas{display:flex;gap:6px;margin-top:8px;flex-wrap:wrap}
.m-sec-ctas .btn-p{font-size:0.55rem;padding:8px 14px}
.m-sec-ctas .btn-g{font-size:0.55rem;padding:8px 14px}

/* ── Mobile grids ── */
.m-metrics-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:6px;margin-top:8px}
.m-metric-card{
  background:rgba(74,199,255,0.04);border:1px solid rgba(74,199,255,0.1);
  border-radius:8px;padding:10px 8px;text-align:center;
}
.m-metric-val{font-family:'Space Mono',monospace;font-size:1rem;font-weight:700;color:#4AC7FF;margin-bottom:4px}
.m-metric-desc{font-family:'Inter',sans-serif;font-size:0.6rem;color:rgba(167,175,187,0.7);line-height:1.4}

.m-cap-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:6px;margin-top:8px}
.m-cap-card{
  background:rgba(74,199,255,0.04);border:1px solid rgba(74,199,255,0.1);
  border-radius:8px;padding:10px 8px;text-align:center;
}
.m-cap-icon{font-size:1rem;margin-bottom:4px}
.m-cap-title{
  font-family:'Space Grotesk',sans-serif;font-size:0.55rem;font-weight:600;
  letter-spacing:.12em;text-transform:uppercase;color:#4AC7FF;margin-bottom:4px;
}
.m-cap-desc{font-family:'Inter',sans-serif;font-size:0.6rem;color:rgba(167,175,187,0.7);line-height:1.4}

.m-app-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:6px;margin-top:8px}
.m-app-card{
  background:rgba(74,199,255,0.04);border:1px solid rgba(74,199,255,0.1);
  border-radius:8px;padding:10px 8px;text-align:center;
}
.m-app-icon{font-size:1rem;margin-bottom:4px}
.m-app-title{
  font-family:'Space Grotesk',sans-serif;font-size:0.55rem;font-weight:600;
  letter-spacing:.1em;text-transform:uppercase;color:#F5F7FA;margin-bottom:4px;
}
.m-app-desc{font-family:'Inter',sans-serif;font-size:0.55rem;color:rgba(167,175,187,0.7);line-height:1.4}

.m-problems-grid{display:flex;flex-direction:column;gap:6px;margin-top:8px}
.m-problem-card{
  display:flex;gap:8px;align-items:flex-start;
  background:rgba(255,100,100,0.03);border:1px solid rgba(255,100,100,0.1);
  border-radius:8px;padding:8px 10px;
}
.m-problem-icon{font-size:0.9rem;flex-shrink:0}
.m-problem-name{
  font-family:'Space Grotesk',sans-serif;font-size:0.6rem;font-weight:600;
  letter-spacing:.1em;text-transform:uppercase;color:#F5F7FA;margin-bottom:2px;
}
.m-problem-issue{font-family:'Inter',sans-serif;font-size:0.55rem;color:rgba(167,175,187,0.7);line-height:1.4}
.m-solution-banner{
  margin-top:8px;
  background:rgba(74,199,255,0.06);border:1px solid rgba(74,199,255,0.15);
  border-radius:8px;padding:10px 12px;
  font-family:'Space Grotesk',sans-serif;font-size:0.6rem;font-weight:500;
  color:#4AC7FF;line-height:1.5;
}

.m-systems-list{display:flex;flex-direction:column;gap:4px;margin-top:8px}
.m-system-item{
  font-family:'Space Grotesk',sans-serif;font-size:0.6rem;font-weight:400;
  color:rgba(255,255,255,0.5);letter-spacing:.06em;
  padding:6px 0;border-bottom:1px solid rgba(74,199,255,0.06);
  display:flex;align-items:center;gap:6px;
}
.m-system-dot{width:3px;height:3px;border-radius:50%;background:#4AC7FF;flex-shrink:0}

.m-phases-list{display:flex;flex-direction:column;gap:8px;margin-top:8px}
.m-phase-card{
  background:rgba(74,199,255,0.03);border:1px solid rgba(74,199,255,0.08);
  border-radius:8px;padding:10px 12px;
}
.m-phase-label{
  font-family:'Space Mono',monospace;font-size:0.5rem;font-weight:400;
  color:rgba(255,255,255,0.2);margin-bottom:2px;
}
.m-phase-period{font-family:'Space Mono',monospace;font-size:0.75rem;font-weight:700;color:#4AC7FF;margin-bottom:4px}
.m-phase-title{
  font-family:'Space Grotesk',sans-serif;font-size:0.6rem;font-weight:600;
  letter-spacing:.1em;text-transform:uppercase;color:#F5F7FA;margin-bottom:4px;
}
.m-phase-items{list-style:none;padding:0}
.m-phase-item{
  font-family:'Inter',sans-serif;font-size:0.55rem;color:rgba(167,175,187,0.7);
  line-height:1.4;padding:2px 0 2px 10px;position:relative;
}
.m-phase-item::before{
  content:'';position:absolute;left:0;top:6px;
  width:3px;height:3px;border-radius:50%;background:rgba(74,199,255,0.3);
}

/* ── Mobile outro slide ── */
.m-outro-content{
  position:relative;z-index:30;
  display:flex;flex-direction:column;
  align-items:center;justify-content:center;
  flex:1;padding:60px 20px 36px;text-align:center;
}
.m-outro-logo{display:flex;align-items:center;margin-bottom:14px}
.m-outro-logo-img{height:28px;width:auto;object-fit:contain}
.m-outro-title{
  font-family:'Space Grotesk',sans-serif;
  font-size:clamp(1.5rem,6vw,2.2rem);font-weight:300;line-height:1.1;
  color:#F5F7FA;margin-bottom:10px;text-transform:uppercase;letter-spacing:-0.02em;
}
.m-outro-title .oc{color:#4AC7FF}
.m-outro-sub{
  font-family:'Inter',sans-serif;font-size:0.8rem;color:#A7AFBB;
  line-height:1.7;max-width:280px;margin-bottom:22px;
}
.m-outro-ctas{
  display:flex;flex-direction:column;gap:8px;width:100%;max-width:260px;margin-bottom:20px;
}
.m-outro-ctas .btn-p,.m-outro-ctas .btn-g{width:100%;text-align:center;padding:12px 20px;font-size:0.55rem}
.m-outro-footer{
  margin-top:auto;font-family:'Inter',sans-serif;
  font-size:0.7rem;color:rgba(167,175,187,0.5);text-align:center;line-height:1.6;letter-spacing:.04em;
}
.m-outro-footer-tag{
  font-family:'Space Grotesk',sans-serif;font-size:0.42rem;font-weight:500;
  letter-spacing:.16em;text-transform:uppercase;color:rgba(74,199,255,0.2);margin-top:8px;
}

`

/* ═══════════════════════════════════════════════════════════════════
   PAGE COMPONENT
═══════════════════════════════════════════════════════════════════ */
export default function MobiusPage() {
  /* ── Mobile detection ── */
  const [isMobile, setIsMobile] = useState(false)
  const [activeStory, setActiveStory] = useState(0)
  const totalStories = SECTIONS.length + 1

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

  /* ── Touch handlers ── */
  const touchStart = useRef<{ x: number; y: number; t: number } | null>(null)

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    touchStart.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
      t: Date.now(),
    }
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
      const { default: Lenis } = await import('lenis')
      lenis = new Lenis({
        duration: 1.6,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      })
      lenis.on('scroll', ScrollTrigger.update)
      gsap.ticker.add((time: number) => lenis.raf(time * 1000))
      gsap.ticker.lagSmoothing(0)

      SECTIONS.forEach(s => { const img = new Image(); img.src = s.img })

      const driver = document.getElementById('sd')!
      if (!driver) return

      const N = SECTIONS.length
      const onScroll = () => {
        const pct = Math.max(0, Math.min(1, window.scrollY / (driver.offsetHeight - window.innerHeight)))

        if (fillRef.current) fillRef.current.style.width = (pct * 100) + '%'

        const sF = Math.max(0, (pct - 0.03) / 0.90) * (N + 1.5)
        const newIdx = Math.min(N - 1, Math.floor(sF - 0.75))

        if (introRef.current) introRef.current.classList.toggle('vis', newIdx <= 0)

        const isOutro = sF >= N + 0.5
        if (outroRef.current) outroRef.current.classList.toggle('vis', isOutro)

        if (isOutro) {
          panelRefs.current.forEach(p => p?.classList.remove('vis'))
          dotRefs.current.forEach((d, i) => d?.classList.toggle('act', i === N - 1))
          activeIdx.current = -1
          return
        }

        if (ctrRef.current) {
          const n = Math.min(N, Math.max(1, Math.ceil(sF - 0.5)))
          ctrRef.current.textContent = `${String(n).padStart(2, '0')} / ${String(N).padStart(2, '0')}`
        }
        if (ctrLabelRef.current) {
          const n = Math.min(N - 1, Math.max(0, Math.ceil(sF - 0.5) - 1))
          ctrLabelRef.current.textContent = SECTIONS[n]?.label ?? 'MOBIUS'
        }

        const shift = (pct - 0.5) * 10
        if (bgLayerARef.current) bgLayerARef.current.style.transform = `translateY(${shift}%)`
        if (bgLayerBRef.current) bgLayerBRef.current.style.transform = `translateY(${shift}%)`

        if (newIdx === activeIdx.current) return
        activeIdx.current = newIdx

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

        panelRefs.current.forEach((p, i) => p?.classList.toggle('vis', i === newIdx && i !== 0))
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
          <div className="m-progress">
            {Array.from({ length: totalStories }).map((_, i) => (
              <div key={i} className="m-prog-bar">
                <div className={`m-prog-fill${i < activeStory ? ' done' : ''}`}
                  style={i === activeStory ? { width: '50%' } : {}} />
              </div>
            ))}
          </div>

          {SECTIONS.map((s, i) => (
            <div key={i} className={`m-slide${activeStory === i ? ' active' : ''}`}>
              <div className="m-slide-bg" style={{ backgroundImage: `url(${s.img})` }} />
              <div className="m-slide-overlay" style={{ background: s.overlay }} />
              <div className="m-slide-vignette" />

              <div className="m-tap-left" onClick={goPrev} />
              <div className="m-tap-right" onClick={goNext} />

              <div className="m-header">
                <div className="m-header-logo">
                  <img src="/SFT-logo-1.png" alt="SFT" className="m-header-logo-img" />
                </div>
                <a href="/" className="m-header-cta">Home</a>
              </div>

              <div className="m-content">
                <div className="m-content-inner">
                  <div className="m-sec-num">— {s.num}</div>
                  <div className="m-sec-label">
                    <span className="m-sec-label-line" />
                    {s.eyebrow}
                  </div>
                  <div className="m-sec-title">
                    {s.title.split('\n').map((l, li) => <span key={li}>{l}<br /></span>)}
                  </div>
                  {s.body && <div className="m-sec-body">{s.body}</div>}
                  {s.note && <div className="m-sec-note">{s.note}</div>}
                  {/* Mobile metrics */}
                  {'metrics' in s && (s as typeof SECTIONS[2] & { metrics: { val: string; desc: string }[] }).metrics && (
                    <div className="m-metrics-grid">
                      {(s as typeof SECTIONS[2] & { metrics: { val: string; desc: string }[] }).metrics.map((m, mi) => (
                        <div key={mi} className="m-metric-card">
                          <div className="m-metric-val">{m.val}</div>
                          <div className="m-metric-desc">{m.desc}</div>
                        </div>
                      ))}
                    </div>
                  )}
                  {/* Mobile capabilities */}
                  {'capabilities' in s && (s as typeof SECTIONS[6] & { capabilities: { icon: string; title: string; desc: string }[] }).capabilities && (
                    <div className="m-cap-grid">
                      {(s as typeof SECTIONS[6] & { capabilities: { icon: string; title: string; desc: string }[] }).capabilities.map((c, ci) => (
                        <div key={ci} className="m-cap-card">
                          <div className="m-cap-icon"><SvgIcon name={c.icon} /></div>
                          <div className="m-cap-title">{c.title}</div>
                          <div className="m-cap-desc">{c.desc}</div>
                        </div>
                      ))}
                    </div>
                  )}
                  {/* Mobile applications */}
                  {'applications' in s && (s as typeof SECTIONS[7] & { applications: { icon: string; title: string; desc: string }[] }).applications && (
                    <div className="m-app-grid">
                      {(s as typeof SECTIONS[7] & { applications: { icon: string; title: string; desc: string }[] }).applications.map((a, ai) => (
                        <div key={ai} className="m-app-card">
                          <div className="m-app-icon"><SvgIcon name={a.icon} /></div>
                          <div className="m-app-title">{a.title}</div>
                          <div className="m-app-desc">{a.desc}</div>
                        </div>
                      ))}
                    </div>
                  )}
                  {/* Mobile problems */}
                  {'problems' in s && (s as typeof SECTIONS[4] & { problems: { problem: string; issue: string; icon: string }[]; solution: string }).problems && (
                    <>
                      <div className="m-problems-grid">
                        {(s as typeof SECTIONS[4] & { problems: { problem: string; issue: string; icon: string }[] }).problems.map((p, pi) => (
                          <div key={pi} className="m-problem-card">
                            <div className="m-problem-icon"><SvgIcon name={p.icon} /></div>
                            <div>
                              <div className="m-problem-name">{p.problem}</div>
                              <div className="m-problem-issue">{p.issue}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                      {'solution' in s && (
                        <div className="m-solution-banner">
                          {(s as typeof SECTIONS[4] & { solution: string }).solution}
                        </div>
                      )}
                    </>
                  )}
                  {/* Mobile systems */}
                  {'systems' in s && (s as typeof SECTIONS[5] & { systems: string[] }).systems && (
                    <div className="m-systems-list">
                      {(s as typeof SECTIONS[5] & { systems: string[] }).systems.map((sys, si) => (
                        <div key={si} className="m-system-item">
                          <span className="m-system-dot" />
                          {sys}
                        </div>
                      ))}
                    </div>
                  )}
                  {/* Mobile phases */}
                  {'phases' in s && (s as typeof SECTIONS[8] & { phases: { phase: string; period: string; title: string; items: string[] }[] }).phases && (
                    <div className="m-phases-list">
                      {(s as typeof SECTIONS[8] & { phases: { phase: string; period: string; title: string; items: string[] }[] }).phases.map((p, pi) => (
                        <div key={pi} className="m-phase-card">
                          <div className="m-phase-label">{p.phase}</div>
                          <div className="m-phase-period">{p.period}</div>
                          <div className="m-phase-title">{p.title}</div>
                          <ul className="m-phase-items">
                            {p.items.map((item, ii) => (
                              <li key={ii} className="m-phase-item">{item}</li>
                            ))}
                          </ul>
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
            <div className="m-slide-overlay" style={{ background: 'radial-gradient(ellipse at center, rgba(5,5,5,0.92) 0%, rgba(5,5,5,0.88) 50%, rgba(5,5,5,0.7) 100%)' }} />
            <div className="m-slide-vignette" />
            <div className="m-tap-left" onClick={goPrev} />
            <div className="m-tap-right" onClick={goNext} />
            <div className="m-header">
              <div className="m-header-logo">
                <img src="/SFT-logo-1.png" alt="SFT" className="m-header-logo-img" />
              </div>
              <a href="/" className="m-header-cta">Home</a>
            </div>
            <div className="m-outro-content">
              <div className="m-outro-logo">
                <img src="/SFT-logo-1.png" alt="SFT" className="m-outro-logo-img" />
              </div>
              <h2 className="m-outro-title">
                Build The<br />
                Future of<br />
                <span className="oc">Aerial Infrastructure.</span>
              </h2>
              <p className="m-outro-sub">
                Stratospheric platforms for next-generation connectivity, observation, and communication services.
              </p>
              <div className="m-outro-ctas">
                <a href="mailto:info@susanfuturetechnologies.com" className="btn-p">Contact Us</a>
                <a href="tel:+919486675847" className="btn-g">Partner With Us</a>
              </div>
              <div className="m-outro-footer">
                Susan Future Technologies Pvt. Ltd.<br />
                IIT Madras Research Park, Chennai
                <div className="m-outro-footer-tag">
                  MOBIUS · HAPS · Stratospheric Platform · Communication
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

      <div className="bg-fixed">
        <div
          ref={bgLayerARef}
          className="bg-inner-a"
          style={{
            backgroundImage: `url(/sft/mobius/hero.png)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center center',
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

      <div ref={overlayRef} className="overlay-layer" style={{ background: 'radial-gradient(ellipse at center, rgba(5,5,5,0.84) 0%, rgba(5,5,5,0.62) 40%, rgba(5,5,5,0.25) 65%, transparent 100%)' }} />

      <div className="vignette" />
      <div className="scanlines" />

      <div className="signal-rings">
        <div className="signal-ring" />
        <div className="signal-ring" />
        <div className="signal-ring" />
        <div className="signal-ring" />
      </div>

      <div className="particles">
        {Array.from({ length: 15 }).map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              animationDuration: `${8 + Math.random() * 12}s`,
              animationDelay: `${Math.random() * 8}s`,
            }}
          />
        ))}
      </div>

      <div id="sd" />

      <div ref={introRef} className="intro-panel">
        <div className="i-eye">
          <span className="i-eye-line" />
          SUSAN FUTURE TECHNOLOGIES
          <span className="i-eye-line" />
        </div>
        <h1 className="i-title">
          <span className="gc">MOBIUS</span>
        </h1>
        <p className="i-sub">
          High-altitude platform system for persistent, scalable aerial infrastructure — operating above weather, above limitations.
        </p>
        <div className="i-ctas">
          <a href="mailto:info@susanfuturetechnologies.com" className="btn-p">Contact Us</a>
          <a href="tel:+919486675847" className="btn-g">Learn More</a>
        </div>
        <div className="i-scroll">
          <span className="i-dot" />Scroll to explore
        </div>
      </div>

      <nav className="s-nav">
        <div className="s-logo">
          <img src="/SFT-logo-1.png" alt="Susan Future Technologies" className="s-logo-img" />
        </div>

        <div className="s-section">
          <span ref={ctrRef} className="s-sec-num">01 / 11</span>
          <span className="s-sep" />
          <span ref={ctrLabelRef} className="s-sec-label">MOBIUS</span>
        </div>

        <div className="s-nav-right">
          <a href="/about" className="s-nav-link">About</a>
          <a href="/hawke" className="s-nav-link">HAWKE</a>
          <a href="/mobius" className="s-nav-link">MOBIUS</a>
          <a href="/applications" className="s-nav-link">Applications</a>
          <a href="/ecosystem" className="s-nav-link">Ecosystem</a>
          <a href="tel:+919486675847" className="s-cta-btn">Request Pilot</a>
        </div>
      </nav>

      <div id="prog"><div ref={fillRef} id="prog-fill" /></div>

      <div id="dots">
        {SECTIONS.map((_, i) => (
          <div key={i} ref={el => { dotRefs.current[i] = el }} className="dot" />
        ))}
      </div>

      {SECTIONS.map((s, i) => {
        const hasMetrics = 'metrics' in s
        const hasCaps = 'capabilities' in s
        const hasApps = 'applications' in s
        const hasProblems = 'problems' in s
        const hasSystems = 'systems' in s
        const hasPhases = 'phases' in s
        return (
        <div
          key={i}
          ref={el => { panelRefs.current[i] = el }}
          className={`s-panel pos-${s.pos}`}
        >
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
          {s.body && <p className="p-body">{s.body}</p>}
          {s.note && <div className="p-note">{s.note}</div>}
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
          {/* Metrics grid */}
          {hasMetrics && (
            <div className="metrics-grid">
              {(s as typeof SECTIONS[2] & { metrics: { val: string; desc: string }[] }).metrics.map((m, mi) => (
                <div key={mi} className="metric-card">
                  <div className="metric-val">{m.val}</div>
                  <div className="metric-desc">{m.desc}</div>
                </div>
              ))}
            </div>
          )}
          {/* Capabilities grid */}
          {hasCaps && (
            <div className="cap-grid">
              {(s as typeof SECTIONS[6] & { capabilities: { icon: string; title: string; desc: string }[] }).capabilities.map((c, ci) => (
                <div key={ci} className="cap-card">
                  <div className="cap-icon"><SvgIcon name={c.icon} /></div>
                  <div className="cap-title">{c.title}</div>
                  <div className="cap-desc">{c.desc}</div>
                </div>
              ))}
            </div>
          )}
          {/* Application cards */}
          {hasApps && (
            <div className="app-grid">
              {(s as typeof SECTIONS[7] & { applications: { icon: string; title: string; desc: string }[] }).applications.map((a, ai) => (
                <div key={ai} className="app-card">
                  <div className="app-icon"><SvgIcon name={a.icon} /></div>
                  <div className="app-title">{a.title}</div>
                  <div className="app-desc">{a.desc}</div>
                </div>
              ))}
            </div>
          )}
          {/* Problems + Solution */}
          {hasProblems && (
            <>
              <div className="problems-grid">
                {(s as typeof SECTIONS[4] & { problems: { problem: string; issue: string; icon: string }[] }).problems.map((p, pi) => (
                  <div key={pi} className="problem-card">
                    <div className="problem-icon"><SvgIcon name={p.icon} /></div>
                    <div className="problem-name">{p.problem}</div>
                    <div className="problem-issue">{p.issue}</div>
                  </div>
                ))}
              </div>
              {'solution' in s && (
                <div className="solution-banner">
                  {(s as typeof SECTIONS[4] & { solution: string }).solution}
                </div>
              )}
            </>
          )}
          {/* Systems list */}
          {hasSystems && (
            <div className="systems-list">
              {(s as typeof SECTIONS[5] & { systems: string[] }).systems.map((sys, si) => (
                <div key={si} className="system-item">
                  <span className="system-dot" />
                  {sys}
                </div>
              ))}
            </div>
          )}
          {/* Phases roadmap */}
          {hasPhases && (
            <div className="phases-grid">
              {(s as typeof SECTIONS[8] & { phases: { phase: string; period: string; title: string; items: string[] }[] }).phases.map((p, pi) => (
                <div key={pi} className="phase-card">
                  <div className="phase-label">{p.phase}</div>
                  <div className="phase-period">{p.period}</div>
                  <div className="phase-title">{p.title}</div>
                  <ul className="phase-items">
                    {p.items.map((item, ii) => (
                      <li key={ii} className="phase-item">{item}</li>
                    ))}
                  </ul>
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
        </div>
        )
      })}

      {/* Outro overlay */}
      <div ref={outroRef} className="outro-panel">
        <div className="o-logo">
          <img src="/SFT-logo-1.png" alt="SFT" className="o-logo-img" />
        </div>

        <div className="o-eyebrow">
          <span className="o-eyebrow-line" />
          EXPLORE MOBIUS
          <span className="o-eyebrow-line" />
        </div>

        <h2 className="o-title">
          Build The<br />
          Future of<br />
          <span className="oc">Aerial Infrastructure.</span>
        </h2>

        <p className="o-sub">
          Stratospheric platforms for persistent connectivity, observation, and communication at scale.
        </p>

        <div className="o-cta-row">
          <a href="mailto:info@susanfuturetechnologies.com" className="btn-p">Contact Us</a>
          <a href="tel:+919486675847" className="btn-g">Partner With Us</a>
          <a href="/" className="btn-g">Home</a>
        </div>

        <div className="o-divider" />

        <div className="o-footer">
          <div className="o-footer-nav">
            <a href="/" className="o-footer-link">Home</a>
            <a href="/about" className="o-footer-link">About</a>
            <a href="/hawke" className="o-footer-link">HAWKE</a>
            <a href="/mobius" className="o-footer-link">MOBIUS</a>
            <a href="mailto:info@susanfuturetechnologies.com" className="o-footer-link">Contact</a>
          </div>
          <div className="o-footer-info">
            Susan Future Technologies Pvt. Ltd.<br />
            IIT Madras Research Park, Chennai
          </div>
          <div className="o-footer-tagline">
            <span className="o-footer-dot" />
            HAPS
            <span className="o-footer-dot" />
            Stratospheric Platform
            <span className="o-footer-dot" />
            Communication
            <span className="o-footer-dot" />
          </div>
        </div>
      </div>
    </>
  )
}
