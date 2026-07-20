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
  satellite: 'M13 9h-2V7h2v2zm0 2h-2v6h2v-6zm4-2V3H7v6l5 5 5-5zm-2-4v2.17l-3 3-3-3V5h6z',
  helicopter: 'M22 11h-6V9h6V7H4v2h6v2H4v2h7v2H9l-3 3v1h12v-1l-3-3h-2v-2h9v-2z',
  clock: 'M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z',
  mountain: 'M14 6l-3.75 5 2.85 3.8-1.6 1.2C9.81 13.75 7 10 7 10l-6 8h22L14 6z',
  wrench: 'M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z',
  refresh: 'M17.65 6.35A7.958 7.958 0 0012 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0112 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z',
  trending: 'M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z',
}
function SvgIcon({ name, size = 28 }: { name: string; size?: number }) {
  const d = ICON[name]
  if (!d) return <span style={{width:size,height:size,display:'inline-block'}} />
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d={d} fill="currentColor" stroke="none" /></svg>
}

/* ═══════════════════════════════════════════════════════════════════
   SECTION DATA — Ecosystem Chapters
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
    title: 'ECOSYSTEM',
    body: 'Aerial Infrastructure Systems for Communication and Monitoring',
    note: 'Integrating platforms, payloads, communication, and control into a unified operational system.',
    chips: [],
    pos: 'center' as const,
    bgPos: 'center center',
    img: '/sft/ecosystem/hero.png',
    overlay: 'radial-gradient(ellipse at center, rgba(5,5,5,0.86) 0%, rgba(5,5,5,0.65) 40%, rgba(5,5,5,0.3) 65%, transparent 100%)',
    eyebrow: 'UNIFIED AERIAL INFRASTRUCTURE',
    cta: [
      { label: 'Explore Technology', style: 'primary', href: '/applications' },
      { label: 'View Applications', style: 'ghost', href: '/applications' },
    ],
  },
  {
    num: '02', label: 'Statement',
    title: 'A CONNECTED\nAERIAL\nINFRASTRUCTURE',
    body: 'SFT is building an integrated aerial ecosystem that combines deployable platforms, modular payload systems, communication networks, and control infrastructure.\n\nEach component is designed to operate independently — but delivers maximum value when functioning as part of a unified system.',
    note: '',
    chips: [],
    pos: 'center' as const,
    bgPos: 'center center',
    img: '/sft/ecosystem/statement.png',
    overlay: 'radial-gradient(ellipse at center, rgba(5,5,5,0.88) 0%, rgba(5,5,5,0.72) 40%, rgba(5,5,5,0.35) 65%, transparent 100%)',
    eyebrow: 'ECOSYSTEM STATEMENT',
    cta: [],
    nodeLabels: ['PLATFORMS', 'PAYLOADS', 'COMMUNICATION', 'CONTROL', 'GROUND OPS'],
  },
  {
    num: '03', label: 'System',
    title: 'HOW THE\nSYSTEM\nWORKS',
    body: 'SFT\'s ecosystem is structured across multiple interconnected layers that enable deployment, operation, and monitoring.',
    note: '',
    chips: [],
    pos: 'center' as const,
    bgPos: 'center center',
    img: '/sft/ecosystem/overview.png',
    overlay: 'radial-gradient(ellipse at center, rgba(5,5,5,0.90) 0%, rgba(5,5,5,0.75) 40%, rgba(5,5,5,0.4) 65%, rgba(5,5,5,0.2) 100%)',
    eyebrow: 'SYSTEM OVERVIEW',
    cta: [],
    layers: [
      { name: 'PLATFORM LAYER', desc: 'HAWKE & MOBIUS aerial systems', icon: 'plane', level: 5 },
      { name: 'PAYLOAD LAYER', desc: 'Mission-specific sensor & comms modules', icon: 'antenna', level: 4 },
      { name: 'COMMUNICATION LAYER', desc: 'Signal relay & network extension', icon: 'signal', level: 3 },
      { name: 'CONTROL LAYER', desc: 'Telemetry, flight control & mission ops', icon: 'target', level: 2 },
      { name: 'GROUND OPERATIONS', desc: 'Deployment, logistics & support', icon: 'build', level: 1 },
    ],
  },
  {
    num: '04', label: 'Platforms',
    title: 'PLATFORM\nSYSTEMS',
    body: '',
    note: '',
    chips: [],
    pos: 'center' as const,
    bgPos: 'center center',
    img: '/sft/ecosystem/platform.png',
    overlay: 'radial-gradient(ellipse at center, rgba(5,5,5,0.88) 0%, rgba(5,5,5,0.68) 40%, rgba(5,5,5,0.3) 65%, transparent 100%)',
    eyebrow: 'PLATFORM LAYER',
    cta: [],
    platforms: [
      {
        name: 'HAWKE',
        sub: 'Deployable Aerial Platform',
        body: 'Designed for rapid deployment and localized operations, providing communication and monitoring capabilities in real-world environments.',
        alt: 'LOW ALTITUDE',
        href: '/hawke',
        specs: ['Rapid Deploy', 'Localized Ops', '~1KM Alt', '~5KM Range'],
      },
      {
        name: 'MOBIUS',
        sub: 'High-Altitude Platform System',
        body: 'Represents the next stage — a scalable, persistent aerial platform designed for wide-area coverage and long-duration missions.',
        alt: 'STRATOSPHERIC',
        href: '/mobius',
        specs: ['Persistent', 'Wide-Area', '20+ KM Alt', '200KM Range'],
      },
    ],
  },
  {
    num: '05', label: 'Payloads',
    title: 'MISSION-READY\nPAYLOAD\nSYSTEMS',
    body: 'Payload systems define mission capability — enabling communication, sensing, and monitoring across different environments.',
    note: '',
    chips: [],
    pos: 'center' as const,
    bgPos: 'center center',
    img: '/sft/ecosystem/payload.png',
    overlay: 'radial-gradient(ellipse at center, rgba(5,5,5,0.88) 0%, rgba(5,5,5,0.68) 40%, rgba(5,5,5,0.3) 65%, transparent 100%)',
    eyebrow: 'PAYLOAD & MISSION SYSTEMS',
    cta: [],
    payloads: [
      { title: 'COMMUNICATION', desc: 'Signal relay and network extension modules', icon: 'antenna' },
      { title: 'OPTICAL (EO)', desc: 'High-resolution visual monitoring systems', icon: 'camera' },
      { title: 'THERMAL', desc: 'Infrared sensors for all-condition operation', icon: 'thermo' },
      { title: 'RADAR', desc: 'Detection and tracking capabilities', icon: 'chart' },
      { title: 'ENVIRONMENTAL', desc: 'Air quality and ecosystem monitoring', icon: 'globe' },
    ],
  },
  {
    num: '06', label: 'Control',
    title: 'CONTROL AND\nOPERATIONS\nINFRASTRUCTURE',
    body: 'Ground control systems manage deployment, monitoring, and mission execution across the entire aerial infrastructure.',
    note: '',
    chips: [],
    pos: 'right' as const,
    bgPos: 'left center',
    img: '/sft/ecosystem/control.png',
    overlay: 'linear-gradient(270deg, rgba(5,5,5,0.94) 0%, rgba(5,5,5,0.82) 38%, rgba(5,5,5,0.3) 65%, transparent 100%)',
    eyebrow: 'CONTROL & GROUND SYSTEMS',
    cta: [],
    functions: [
      'Telemetry Monitoring — Real-time platform health and position tracking',
      'Mission Control — Payload operation and mission parameter management',
      'Data Processing — Sensor data aggregation and analysis pipeline',
      'System Management — Fleet-level coordination and resource allocation',
    ],
  },
  {
    num: '07', label: 'Workflow',
    title: 'FROM\nDEPLOYMENT\nTO OPERATION',
    body: 'The SFT ecosystem is designed for seamless transition from deployment to active operation, enabling rapid response and sustained performance.',
    note: '',
    chips: [],
    pos: 'center' as const,
    bgPos: 'center center',
    img: '/sft/ecosystem/workflow.png',
    overlay: 'radial-gradient(ellipse at center, rgba(5,5,5,0.90) 0%, rgba(5,5,5,0.75) 40%, rgba(5,5,5,0.4) 65%, rgba(5,5,5,0.2) 100%)',
    eyebrow: 'OPERATIONAL WORKFLOW',
    cta: [],
    workflow: [
      { step: '01', title: 'DEPLOYMENT', desc: 'Platform transport and field setup', icon: 'rocket' },
      { step: '02', title: 'ACTIVATION', desc: 'Platform launch and systems initialization', icon: 'bolt' },
      { step: '03', title: 'PAYLOAD OPS', desc: 'Mission payload activation and configuration', icon: 'target' },
      { step: '04', title: 'TRANSMISSION', desc: 'Data and signal relay to ground systems', icon: 'signal' },
      { step: '05', title: 'MONITORING', desc: 'Continuous ground-based oversight', icon: 'monitor' },
    ],
  },
  {
    num: '08', label: 'Components',
    title: 'SYSTEM\nCOMPONENTS',
    body: '',
    note: '',
    chips: [],
    pos: 'center' as const,
    bgPos: 'center center',
    img: '/sft/ecosystem/components.png',
    overlay: 'radial-gradient(ellipse at center, rgba(5,5,5,0.88) 0%, rgba(5,5,5,0.72) 40%, rgba(5,5,5,0.4) 65%, rgba(5,5,5,0.2) 100%)',
    eyebrow: 'PLATFORM BREAKDOWN',
    cta: [],
    components: [
      { title: 'AERIAL PLATFORMS', desc: 'HAWKE and MOBIUS systems forming the core infrastructure layer', icon: 'plane' },
      { title: 'PAYLOAD SYSTEMS', desc: 'Modular mission-specific sensor and communication integration', icon: 'antenna' },
      { title: 'COMMUNICATION SYSTEMS', desc: 'Signal relay, network extension, and data transmission', icon: 'signal' },
      { title: 'CONTROL SYSTEMS', desc: 'Flight, telemetry, and operations management infrastructure', icon: 'target' },
    ],
  },
  {
    num: '09', label: 'Scale',
    title: 'DESIGNED\nFOR\nSCALE',
    body: 'The SFT ecosystem is designed to scale from localized deployments to wide-area coverage systems.\n\nFrom single deployment units to networked aerial platforms, the system can evolve to support increasing operational demands.',
    note: '',
    chips: [],
    pos: 'center' as const,
    bgPos: 'center center',
    img: '/sft/ecosystem/scale.png',
    overlay: 'radial-gradient(ellipse at center, rgba(5,5,5,0.88) 0%, rgba(5,5,5,0.72) 40%, rgba(5,5,5,0.35) 65%, transparent 100%)',
    eyebrow: 'SCALABLE INFRASTRUCTURE VISION',
    cta: [],
    scaleMetrics: [
      { val: 'SINGLE', desc: 'Localized deployment operations' },
      { val: 'MULTI', desc: 'Coordinated platform fleet' },
      { val: 'NETWORK', desc: 'Mesh coverage across regions' },
      { val: 'NATIONAL', desc: 'Infrastructure-scale operations' },
    ],
  },
  {
    num: '10', label: 'Connect',
    title: 'BUILDING\nTHE NEXT\nLAYER OF\nINFRASTRUCTURE',
    body: 'SFT\'s ecosystem brings together platforms, systems, and applications into a unified approach to aerial infrastructure.',
    note: '',
    chips: [],
    pos: 'center' as const,
    bgPos: 'center center',
    img: '/sft/ecosystem/cta.png',
    overlay: 'radial-gradient(ellipse at center, rgba(5,5,5,0.88) 0%, rgba(5,5,5,0.72) 40%, rgba(5,5,5,0.35) 65%, transparent 100%)',
    eyebrow: 'GET STARTED',
    cta: [
      { label: 'Explore HAWKE', style: 'primary', href: '/hawke' },
      { label: 'Explore MOBIUS', style: 'ghost', href: '/mobius' },
      { label: 'Contact Our Team', style: 'ghost', href: 'mailto:info@susanfuturetechnologies.com' },
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

.bg-fixed{position:fixed;inset:0;z-index:0;background-size:cover;background-position:center;transition:none}
.bg-inner-a,.bg-inner-b{position:absolute;inset:0;background-size:cover;background-position:center;will-change:transform,opacity;transition:opacity 1.2s cubic-bezier(.16,1,.3,1)}
.overlay-layer{position:fixed;inset:0;z-index:1;pointer-events:none;transition:background 1.2s cubic-bezier(.16,1,.3,1)}
.vignette{position:fixed;inset:0;z-index:2;pointer-events:none;background:radial-gradient(ellipse at center,transparent 50%,rgba(5,5,5,0.5) 100%)}
.scanlines{position:fixed;inset:0;z-index:3;pointer-events:none;background:repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(74,199,255,0.008) 2px,rgba(74,199,255,0.008) 4px)}

/* ── Nav ── */
.s-nav{position:fixed;top:0;left:0;right:0;z-index:100;display:flex;align-items:center;justify-content:space-between;padding:0 48px;height:70px;background:rgba(5,5,5,0.4);backdrop-filter:blur(20px);border-bottom:1px solid rgba(74,199,255,0.08)}
.s-logo{display:flex;align-items:center}
.s-logo-img{height:40px;width:auto;object-fit:contain}
.s-section{position:absolute;left:50%;transform:translateX(-50%);display:flex;align-items:center;gap:10px}
.s-sec-num{font-family:'Space Mono',monospace;font-size:0.8rem;font-weight:400;letter-spacing:.1em;color:rgba(255,255,255,0.45)}
.s-sec-label{font-family:'Space Grotesk',sans-serif;font-size:0.8rem;font-weight:500;letter-spacing:.28em;text-transform:uppercase;color:rgba(74,199,255,0.8);transition:opacity .4s}
.s-sep{width:1px;height:12px;background:rgba(255,255,255,0.08)}
.s-nav-right{display:flex;align-items:center;gap:18px}
.s-nav-link{font-family:'Space Grotesk',sans-serif;font-size:0.75rem;font-weight:500;letter-spacing:.18em;text-transform:uppercase;color:rgba(255,255,255,0.55);text-decoration:none;transition:color .2s}
.s-nav-link:hover{color:rgba(255,255,255,0.6)}
.s-nav-link.active{color:rgba(74,199,255,0.7)}
.s-cta-btn{font-family:'Space Grotesk',sans-serif;font-size:0.75rem;font-weight:600;letter-spacing:.18em;text-transform:uppercase;background:transparent;color:#4AC7FF;padding:7px 16px;border-radius:50px;text-decoration:none;border:1px solid rgba(74,199,255,0.4);transition:all .25s ease}
.s-cta-btn:hover{background:rgba(74,199,255,0.1);border-color:#4AC7FF;box-shadow:0 0 20px rgba(74,199,255,0.2)}

#prog{position:fixed;bottom:0;left:0;right:0;height:2px;z-index:200;background:rgba(255,255,255,0.04)}
#prog-fill{height:100%;background:linear-gradient(90deg,#4AC7FF,#2a9fd4);width:0%;transition:width .12s linear;border-radius:1px}

#dots{position:fixed;right:30px;top:50%;transform:translateY(-50%);z-index:100;display:flex;flex-direction:column;gap:10px}
.dot{width:4px;height:4px;border-radius:50%;background:rgba(255,255,255,0.15);transition:all .35s cubic-bezier(.16,1,.3,1);cursor:default}
.dot.act{background:#4AC7FF;transform:scale(1.7);box-shadow:0 0 8px rgba(74,199,255,0.5)}

/* ── Content panels ── */
.s-panel{position:fixed;top:0;height:100vh;z-index:10;display:flex;flex-direction:column;justify-content:center;pointer-events:none;opacity:0;transform:translateY(18px);transition:opacity 1.0s cubic-bezier(.16,1,.3,1), transform 1.0s cubic-bezier(.16,1,.3,1)}
.s-panel.vis{opacity:1;transform:translateY(0)}
.s-panel.pos-left{left:0;width:42%;padding:0 56px 0 64px}
.s-panel.pos-right{right:0;width:42%;padding:0 64px 0 56px;align-items:flex-end;text-align:right}
.s-panel.pos-center{left:0;right:0;width:100%;padding:0 80px;align-items:center;text-align:center}

.p-eyebrow{font-family:'Space Grotesk',sans-serif;font-size:0.85rem;font-weight:500;letter-spacing:.28em;text-transform:uppercase;color:#4AC7FF;margin-bottom:12px;display:flex;align-items:center;gap:10px}
.p-eyebrow-line{width:22px;height:1px;background:rgba(74,199,255,0.35);flex-shrink:0}
.pos-right .p-eyebrow{flex-direction:row-reverse}
.pos-center .p-eyebrow{justify-content:center}

.p-num{font-family:'Space Mono',monospace;font-size:0.85rem;font-weight:400;letter-spacing:.1em;color:rgba(255,255,255,0.35);margin-bottom:6px}
.p-title{font-family:'Space Grotesk',sans-serif;font-size:clamp(2.8rem,4.5vw,5rem);font-weight:300;line-height:1.08;letter-spacing:-0.03em;color:#F5F7FA;white-space:pre-line;margin-bottom:14px;text-transform:uppercase;text-shadow:0 4px 32px rgba(0,0,0,0.6)}
.p-body{font-family:'Inter',sans-serif;font-size:0.95rem;color:#A7AFBB;line-height:1.72;max-width:380px;font-weight:400;margin-bottom:12px;white-space:pre-line}
.pos-right .p-body,.pos-right .p-note{margin-left:auto}
.pos-center .p-body{max-width:500px}
.p-note{font-family:'Space Grotesk',sans-serif;font-size:0.85rem;font-weight:400;color:rgba(74,199,255,0.85);letter-spacing:.08em;padding-top:10px;border-top:1px solid rgba(74,199,255,0.12);max-width:380px;line-height:1.5;white-space:pre-line}
.pos-right .p-note{margin-left:auto}
.pos-center .p-note{max-width:500px}

.p-ctas{display:flex;flex-wrap:wrap;gap:10px;margin-top:20px}
.pos-center .p-ctas{justify-content:center}
.pos-right .p-ctas{justify-content:flex-end}

.btn-p{background:transparent;color:#4AC7FF;font-family:'Space Grotesk',sans-serif;font-size:0.85rem;font-weight:600;letter-spacing:.18em;text-transform:uppercase;padding:11px 28px;border-radius:50px;text-decoration:none;display:inline-block;border:1px solid rgba(74,199,255,0.5);transition:all .25s ease;pointer-events:auto;cursor:pointer;position:relative;overflow:hidden}
.btn-p:hover{background:rgba(74,199,255,0.1);border-color:#4AC7FF;box-shadow:0 0 24px rgba(74,199,255,0.25);transform:translateY(-1px)}
.btn-g{color:rgba(255,255,255,0.7);font-family:'Space Grotesk',sans-serif;font-size:0.85rem;font-weight:400;letter-spacing:.18em;text-transform:uppercase;padding:11px 28px;border-radius:50px;border:1px solid rgba(255,255,255,0.12);text-decoration:none;display:inline-block;transition:all .25s ease;pointer-events:auto;cursor:pointer}
.btn-g:hover{color:#fff;border-color:rgba(74,199,255,0.4);background:rgba(74,199,255,0.06);box-shadow:0 0 16px rgba(74,199,255,0.12)}

/* ── Node labels (ecosystem statement) ── */
.node-row{display:flex;flex-wrap:wrap;gap:10px;margin-top:20px;justify-content:center;max-width:700px}
.node-pill{font-family:'Space Grotesk',sans-serif;font-size:0.82rem;font-weight:600;letter-spacing:.18em;text-transform:uppercase;padding:10px 22px;border-radius:50px;border:1px solid rgba(74,199,255,0.15);background:rgba(74,199,255,0.04);color:rgba(74,199,255,0.85);backdrop-filter:blur(8px);opacity:0;transform:scale(0.9);transition:opacity 0.6s cubic-bezier(.16,1,.3,1), transform 0.6s cubic-bezier(.16,1,.3,1), background 0.3s ease, border-color 0.3s ease;position:relative}
.vis .node-pill{opacity:1;transform:scale(1)}
.vis .node-pill:nth-child(1){transition-delay:0s}
.vis .node-pill:nth-child(2){transition-delay:0.08s}
.vis .node-pill:nth-child(3){transition-delay:0.16s}
.vis .node-pill:nth-child(4){transition-delay:0.24s}
.vis .node-pill:nth-child(5){transition-delay:0.32s}
.node-pill:hover{background:rgba(74,199,255,0.1);border-color:rgba(74,199,255,0.35);color:#4AC7FF}
.node-pill::before{content:'';position:absolute;top:50%;right:-10px;width:10px;height:1px;background:rgba(74,199,255,0.15)}
.node-pill:last-child::before{display:none}

/* ── Layers (system overview) ── */
.layers-stack{display:flex;flex-direction:column;gap:10px;width:100%;max-width:700px;margin-top:20px}
.layer-bar{display:flex;align-items:center;gap:16px;background:rgba(74,199,255,0.03);border:1px solid rgba(74,199,255,0.1);border-radius:12px;padding:16px 24px;backdrop-filter:blur(10px);opacity:0;transform:translateX(-40px);transition:opacity 0.7s cubic-bezier(.16,1,.3,1), transform 0.7s cubic-bezier(.16,1,.3,1), background 0.3s ease, border-color 0.3s ease;position:relative;overflow:hidden}
.vis .layer-bar{opacity:1;transform:translateX(0)}
.vis .layer-bar:nth-child(1){transition-delay:0s}
.vis .layer-bar:nth-child(2){transition-delay:0.1s}
.vis .layer-bar:nth-child(3){transition-delay:0.2s}
.vis .layer-bar:nth-child(4){transition-delay:0.3s}
.vis .layer-bar:nth-child(5){transition-delay:0.4s}
.layer-bar:hover{background:rgba(74,199,255,0.08);border-color:rgba(74,199,255,0.22)}
.layer-bar::before{content:'';position:absolute;left:0;top:0;bottom:0;width:3px;background:linear-gradient(180deg,#4AC7FF,rgba(74,199,255,0.1));border-radius:3px 0 0 3px}
.layer-icon{font-size:1.3rem;flex-shrink:0}
.layer-level{font-family:'Space Mono',monospace;font-size:0.78rem;font-weight:400;letter-spacing:.1em;color:rgba(255,255,255,0.2);flex-shrink:0;width:30px}
.layer-name{font-family:'Space Grotesk',sans-serif;font-size:0.8rem;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:#F5F7FA;flex-shrink:0;min-width:160px}
.layer-desc{font-family:'Inter',sans-serif;font-size:0.78rem;color:rgba(167,175,187,0.88);line-height:1.5}

/* ── Platform comparison ── */
.platform-compare{display:grid;grid-template-columns:repeat(2,1fr);gap:20px;width:100%;max-width:860px;margin-top:20px}
.platform-card{background:rgba(74,199,255,0.03);border:1px solid rgba(74,199,255,0.1);border-radius:14px;padding:28px 24px;backdrop-filter:blur(10px);text-align:left;opacity:0;transform:translateY(50px);transition:opacity 0.7s cubic-bezier(.16,1,.3,1), transform 0.7s cubic-bezier(.16,1,.3,1), background 0.3s ease, border-color 0.3s ease;position:relative;overflow:hidden}
.vis .platform-card{opacity:1;transform:translateY(0)}
.vis .platform-card:nth-child(1){transition-delay:0s}
.vis .platform-card:nth-child(2){transition-delay:0.15s}
.platform-card:hover{background:rgba(74,199,255,0.08);border-color:rgba(74,199,255,0.22)}
.platform-card::before{content:'';position:absolute;top:0;left:24px;right:24px;height:2px;background:linear-gradient(90deg,#4AC7FF,rgba(74,199,255,0.05));border-radius:1px}
.platform-alt{font-family:'Space Mono',monospace;font-size:0.78rem;font-weight:400;letter-spacing:.12em;color:rgba(255,255,255,0.2);margin-bottom:6px;margin-top:6px}
.platform-name{font-family:'Space Grotesk',sans-serif;font-size:1.8rem;font-weight:300;letter-spacing:-0.02em;color:#4AC7FF;margin-bottom:4px}
.platform-sub{font-family:'Space Grotesk',sans-serif;font-size:0.82rem;font-weight:500;letter-spacing:.14em;text-transform:uppercase;color:rgba(255,255,255,0.4);margin-bottom:12px}
.platform-body{font-family:'Inter',sans-serif;font-size:0.8rem;color:rgba(167,175,187,0.75);line-height:1.6;margin-bottom:14px}
.platform-specs{display:flex;flex-wrap:wrap;gap:5px;margin-bottom:14px}
.platform-spec{font-family:'Space Grotesk',sans-serif;font-size:0.78rem;font-weight:500;letter-spacing:.1em;text-transform:uppercase;color:rgba(74,199,255,0.75);background:rgba(74,199,255,0.05);border:1px solid rgba(74,199,255,0.08);border-radius:14px;padding:4px 10px}
.platform-link{font-family:'Space Grotesk',sans-serif;font-size:0.82rem;font-weight:600;letter-spacing:.16em;text-transform:uppercase;color:#4AC7FF;text-decoration:none;display:inline-flex;align-items:center;gap:6px;pointer-events:auto;transition:opacity .2s}
.platform-link:hover{opacity:0.7}
.platform-link-arrow{display:inline-block;transition:transform .2s}
.platform-link:hover .platform-link-arrow{transform:translateX(3px)}

/* ── Payload grid ── */
.payload-grid{display:grid;grid-template-columns:repeat(5,1fr);gap:14px;width:100%;max-width:960px;margin-top:24px}
.payload-card{background:rgba(74,199,255,0.04);border:1px solid rgba(74,199,255,0.1);border-radius:12px;padding:24px 14px;backdrop-filter:blur(10px);text-align:center;opacity:0;transform:translateY(50px);transition:opacity 0.7s cubic-bezier(.16,1,.3,1), transform 0.7s cubic-bezier(.16,1,.3,1), background 0.3s ease, border-color 0.3s ease}
.vis .payload-card{opacity:1;transform:translateY(0)}
.vis .payload-card:nth-child(1){transition-delay:0s}
.vis .payload-card:nth-child(2){transition-delay:0.1s}
.vis .payload-card:nth-child(3){transition-delay:0.2s}
.vis .payload-card:nth-child(4){transition-delay:0.3s}
.vis .payload-card:nth-child(5){transition-delay:0.4s}
.payload-card:hover{background:rgba(74,199,255,0.1);border-color:rgba(74,199,255,0.25);transform:translateY(-3px)}
.payload-icon{font-size:1.5rem;margin-bottom:12px;display:flex;align-items:center;justify-content:center;width:44px;height:44px;margin:0 auto 12px;background:rgba(74,199,255,0.06);border:1px solid rgba(74,199,255,0.12);border-radius:50%}
.payload-title{font-family:'Space Grotesk',sans-serif;font-size:0.82rem;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:#4AC7FF;margin-bottom:8px}
.payload-desc{font-family:'Inter',sans-serif;font-size:0.78rem;color:rgba(167,175,187,0.88);line-height:1.5}

/* ── Functions list ── */
.func-list{display:flex;flex-direction:column;gap:10px;margin-top:16px}
.func-item{font-family:'Space Grotesk',sans-serif;font-size:0.82rem;font-weight:400;color:rgba(255,255,255,0.7);letter-spacing:.06em;padding:12px 0;border-bottom:1px solid rgba(74,199,255,0.08);display:flex;align-items:flex-start;gap:10px;line-height:1.5}
.func-dot{width:4px;height:4px;border-radius:50%;background:#4AC7FF;flex-shrink:0;margin-top:7px}

/* ── Workflow steps ── */
.workflow-grid{display:grid;grid-template-columns:repeat(5,1fr);gap:14px;width:100%;max-width:960px;margin-top:24px}
.wf-step{background:rgba(74,199,255,0.04);border:1px solid rgba(74,199,255,0.1);border-radius:12px;padding:22px 14px;backdrop-filter:blur(10px);text-align:center;position:relative;opacity:0;transform:translateY(40px);transition:opacity 0.6s cubic-bezier(.16,1,.3,1), transform 0.6s cubic-bezier(.16,1,.3,1), background 0.3s ease, border-color 0.3s ease}
.vis .wf-step{opacity:1;transform:translateY(0)}
.vis .wf-step:nth-child(1){transition-delay:0s}
.vis .wf-step:nth-child(2){transition-delay:0.08s}
.vis .wf-step:nth-child(3){transition-delay:0.16s}
.vis .wf-step:nth-child(4){transition-delay:0.24s}
.vis .wf-step:nth-child(5){transition-delay:0.32s}
.wf-step:hover{background:rgba(74,199,255,0.1);border-color:rgba(74,199,255,0.25)}
.wf-step::after{content:'→';position:absolute;right:-12px;top:50%;transform:translateY(-50%);color:rgba(74,199,255,0.2);font-size:0.9rem}
.wf-step:last-child::after{display:none}
.wf-icon{font-size:1.3rem;margin-bottom:10px}
.wf-num{font-family:'Space Mono',monospace;font-size:0.78rem;font-weight:400;letter-spacing:.1em;color:rgba(255,255,255,0.2);margin-bottom:4px}
.wf-title{font-family:'Space Grotesk',sans-serif;font-size:0.7rem;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:#F5F7FA;margin-bottom:6px}
.wf-desc{font-family:'Inter',sans-serif;font-size:0.82rem;color:rgba(167,175,187,0.65);line-height:1.5}

/* ── Component blocks ── */
.comp-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:16px;width:100%;max-width:800px;margin-top:20px}
.comp-block{background:rgba(74,199,255,0.03);border:1px solid rgba(74,199,255,0.1);border-radius:14px;padding:24px 20px;backdrop-filter:blur(10px);text-align:left;opacity:0;transform:translateY(50px);transition:opacity 0.7s cubic-bezier(.16,1,.3,1), transform 0.7s cubic-bezier(.16,1,.3,1), background 0.3s ease, border-color 0.3s ease;position:relative;overflow:hidden}
.vis .comp-block{opacity:1;transform:translateY(0)}
.vis .comp-block:nth-child(1){transition-delay:0s}
.vis .comp-block:nth-child(2){transition-delay:0.1s}
.vis .comp-block:nth-child(3){transition-delay:0.2s}
.vis .comp-block:nth-child(4){transition-delay:0.3s}
.comp-block:hover{background:rgba(74,199,255,0.08);border-color:rgba(74,199,255,0.22)}
.comp-block::before{content:'';position:absolute;top:0;left:20px;right:20px;height:2px;background:linear-gradient(90deg,#4AC7FF,rgba(74,199,255,0.05));border-radius:1px}
.comp-icon{font-size:1.3rem;margin-bottom:10px;margin-top:4px}
.comp-title{font-family:'Space Grotesk',sans-serif;font-size:0.8rem;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:#F5F7FA;margin-bottom:8px}
.comp-desc{font-family:'Inter',sans-serif;font-size:0.8rem;color:rgba(167,175,187,0.75);line-height:1.6}

/* ── Scale metrics ── */
.scale-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:20px;width:100%;max-width:900px;margin-top:24px}
.scale-card{background:rgba(74,199,255,0.04);border:1px solid rgba(74,199,255,0.1);border-radius:12px;padding:28px 20px;backdrop-filter:blur(10px);text-align:center;opacity:0;transform:translateY(60px);transition:opacity 0.8s cubic-bezier(.16,1,.3,1), transform 0.8s cubic-bezier(.16,1,.3,1), background 0.3s ease, border-color 0.3s ease;position:relative}
.vis .scale-card{opacity:1;transform:translateY(0)}
.vis .scale-card:nth-child(1){transition-delay:0s}
.vis .scale-card:nth-child(2){transition-delay:0.15s}
.vis .scale-card:nth-child(3){transition-delay:0.3s}
.vis .scale-card:nth-child(4){transition-delay:0.45s}
.scale-card:hover{background:rgba(74,199,255,0.1);border-color:rgba(74,199,255,0.25)}
.scale-card::after{content:'→';position:absolute;right:-14px;top:50%;transform:translateY(-50%);color:rgba(74,199,255,0.15);font-size:0.9rem}
.scale-card:last-child::after{display:none}
.scale-val{font-family:'Space Mono',monospace;font-size:1.6rem;font-weight:700;color:#4AC7FF;margin-bottom:8px;letter-spacing:-0.02em}
.scale-desc{font-family:'Inter',sans-serif;font-size:0.85rem;color:rgba(167,175,187,0.88);line-height:1.5}

/* ── Intro panel ── */
.intro-panel{position:fixed;top:0;left:0;right:0;height:100vh;display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;padding:80px;z-index:10;pointer-events:none;opacity:0;transform:translateY(18px);transition:opacity 1.0s cubic-bezier(.16,1,.3,1), transform 1.0s cubic-bezier(.16,1,.3,1);background:radial-gradient(ellipse at center,rgba(5,5,5,.86) 0%,rgba(5,5,5,.68) 45%,rgba(5,5,5,.3) 70%,transparent 100%)}
.intro-panel.vis{opacity:1;transform:translateY(0);pointer-events:auto}
.i-eye{font-family:'Space Grotesk',sans-serif;font-size:0.85rem;font-weight:500;letter-spacing:.28em;text-transform:uppercase;color:#4AC7FF;margin-bottom:22px;display:flex;align-items:center;justify-content:center;gap:12px}
.i-eye-line{width:24px;height:1px;background:rgba(74,199,255,0.35)}
.i-title{font-family:'Space Grotesk',sans-serif;font-size:clamp(3.2rem,6vw,6.5rem);font-weight:300;line-height:1.05;letter-spacing:-0.03em;text-transform:uppercase;color:#F5F7FA;margin-bottom:24px;text-shadow:0 4px 40px rgba(0,0,0,0.5)}
.i-title .gc{color:#4AC7FF}
.i-sub{font-family:'Inter',sans-serif;font-size:1.05rem;color:#A7AFBB;line-height:1.82;max-width:520px;margin-bottom:42px;text-align:center}
.i-ctas{display:flex;gap:12px;margin-bottom:48px}
.i-scroll{display:flex;align-items:center;gap:10px;font-size:0.85rem;font-family:'Space Grotesk',sans-serif;letter-spacing:.2em;text-transform:uppercase;color:rgba(255,255,255,0.2);justify-content:center}
.i-dot{width:5px;height:5px;border-radius:50%;background:#4AC7FF;animation:pulse 2.2s ease infinite}
@keyframes pulse{0%,100%{opacity:.2;transform:scale(1)}50%{opacity:1;transform:scale(1.3)}}

/* ── Network animation ── */
.network-bg{position:fixed;inset:0;z-index:3;pointer-events:none;overflow:hidden}
.net-node{position:absolute;width:3px;height:3px;border-radius:50%;background:rgba(74,199,255,0.2);animation:netPulse 3s ease-in-out infinite}
@keyframes netPulse{0%,100%{opacity:0.1;transform:scale(1)}50%{opacity:0.6;transform:scale(1.8)}}
.net-line{position:absolute;height:1px;background:linear-gradient(90deg,transparent,rgba(74,199,255,0.06),transparent);transform-origin:left center;animation:lineFade 5s ease-in-out infinite}
@keyframes lineFade{0%,100%{opacity:0}50%{opacity:1}}

.particles{position:fixed;inset:0;z-index:3;pointer-events:none;overflow:hidden}
.particle{position:absolute;width:2px;height:2px;border-radius:50%;background:rgba(74,199,255,0.25);animation:drift linear infinite}
@keyframes drift{0%{transform:translateY(100vh) translateX(0);opacity:0}10%{opacity:1}90%{opacity:1}100%{transform:translateY(-10vh) translateX(40px);opacity:0}}

/* ── Outro ── */
.outro-panel{position:fixed;inset:0;z-index:20;pointer-events:none;opacity:0;transform:translateY(100%);transition:opacity .8s cubic-bezier(.16,1,.3,1), transform .8s cubic-bezier(.16,1,.3,1);display:flex;flex-direction:column;align-items:center;justify-content:center;background:linear-gradient(180deg, rgba(5,5,5,.94) 0%, rgba(8,17,31,.98) 100%);backdrop-filter:blur(30px);padding:48px}
.outro-panel.vis{opacity:1;transform:translateY(0);pointer-events:auto}
.o-logo{display:flex;align-items:center;gap:6px;margin-bottom:18px}
.o-logo-img{height:36px;width:auto;object-fit:contain}
.o-eyebrow{font-family:'Space Grotesk',sans-serif;font-size:0.85rem;font-weight:500;letter-spacing:.28em;text-transform:uppercase;color:rgba(74,199,255,0.7);display:flex;align-items:center;gap:12px;margin-bottom:16px}
.o-eyebrow-line{width:28px;height:1px;background:rgba(74,199,255,0.25)}
.o-title{font-family:'Space Grotesk',sans-serif;font-size:clamp(2.8rem,5vw,4.5rem);font-weight:300;line-height:1.08;letter-spacing:-0.03em;text-transform:uppercase;color:#F5F7FA;text-align:center;margin-bottom:14px;text-shadow:0 4px 40px rgba(0,0,0,.5)}
.o-title .oc{color:#4AC7FF}
.o-sub{font-family:'Inter',sans-serif;font-size:0.95rem;color:#A7AFBB;line-height:1.82;text-align:center;max-width:460px;margin-bottom:32px}
.o-cta-row{display:flex;flex-wrap:wrap;gap:12px;justify-content:center;margin-bottom:36px}
.o-divider{width:120px;height:1px;background:linear-gradient(90deg,transparent,rgba(74,199,255,0.2),transparent);margin-bottom:28px}
.o-footer{display:flex;flex-direction:column;align-items:center;gap:16px;margin-top:12px}
.o-footer-nav{display:flex;gap:20px;flex-wrap:wrap;justify-content:center}
.o-footer-link{font-family:'Space Grotesk',sans-serif;font-size:0.85rem;font-weight:500;letter-spacing:.18em;text-transform:uppercase;color:rgba(255,255,255,0.5);text-decoration:none;transition:color .2s}
.o-footer-link:hover{color:rgba(74,199,255,0.85)}
.o-footer-info{font-family:'Inter',sans-serif;font-size:0.9rem;color:rgba(167,175,187,0.92);text-align:center;line-height:1.6}
.o-footer-tagline{font-family:'Space Grotesk',sans-serif;font-size:0.8rem;font-weight:500;letter-spacing:.2em;text-transform:uppercase;color:rgba(74,199,255,0.45);margin-top:8px;display:flex;align-items:center;gap:8px}
.o-footer-dot{width:3px;height:3px;border-radius:50%;background:rgba(74,199,255,0.4)}

#sd{height:1560vh;position:relative;z-index:5;pointer-events:none}


/* ═══════════════════════════════════════════════════════════════
   MOBILE — STORIES MODE
═══════════════════════════════════════════════════════════════ */
.m-stories{position:fixed;inset:0;z-index:500;overflow:hidden;background:#050505;touch-action:pan-y}
.m-progress{position:absolute;top:0;left:0;right:0;z-index:60;display:flex;gap:3px;padding:8px 10px 0}
.m-prog-bar{flex:1;height:2px;border-radius:2px;background:rgba(255,255,255,0.12);overflow:hidden}
.m-prog-fill{height:100%;border-radius:2px;background:#4AC7FF;width:0%;transition:width 0.3s linear}
.m-prog-fill.done{width:100%}
.m-slide{position:absolute;inset:0;opacity:0;transform:scale(0.95);transition:opacity .35s ease, transform .35s ease;pointer-events:none;display:flex;flex-direction:column}
.m-slide.active{opacity:1;transform:scale(1);pointer-events:auto}
.m-slide-bg{position:absolute;inset:0;background-size:cover;background-position:center}
.m-slide-overlay{position:absolute;inset:0}
.m-slide-vignette{position:absolute;inset:0;background:linear-gradient(180deg, rgba(5,5,5,.3) 0%, rgba(5,5,5,.1) 30%, rgba(5,5,5,.55) 65%, rgba(5,5,5,.94) 100%)}
.m-tap-left,.m-tap-right{position:absolute;top:50px;bottom:0;z-index:40}
.m-tap-left{left:0;width:30%}
.m-tap-right{right:0;width:70%}
.m-header{position:relative;z-index:50;display:flex;align-items:center;justify-content:space-between;padding:20px 16px 0}
.m-header-logo{display:flex;align-items:center}
.m-header-logo-img{height:28px;width:auto;object-fit:contain}
.m-header-cta{font-family:'Space Grotesk',sans-serif;font-size:0.75rem;font-weight:700;letter-spacing:.14em;text-transform:uppercase;background:transparent;color:#4AC7FF;border:1px solid rgba(74,199,255,0.4);padding:7px 12px;border-radius:50px;text-decoration:none}
.m-content{position:relative;z-index:30;margin-top:auto;padding:0 12px 20px}
.m-content-inner{background:rgba(5,5,5,.5);backdrop-filter:blur(16px);border:1px solid rgba(74,199,255,0.08);border-radius:14px;padding:16px;max-height:60vh;overflow-y:auto}
.m-sec-num{font-family:'Space Mono',monospace;font-size:0.82rem;font-weight:400;letter-spacing:.1em;color:rgba(255,255,255,0.35);margin-bottom:4px}
.m-sec-label{font-family:'Space Grotesk',sans-serif;font-size:0.82rem;font-weight:500;letter-spacing:.24em;text-transform:uppercase;color:#4AC7FF;margin-bottom:8px;display:flex;align-items:center;gap:8px}
.m-sec-label-line{width:16px;height:1px;background:rgba(74,199,255,0.35)}
.m-sec-title{font-family:'Space Grotesk',sans-serif;font-size:clamp(1.5rem,5vw,2rem);font-weight:300;line-height:1.1;color:#F5F7FA;margin-bottom:6px;text-transform:uppercase;letter-spacing:-0.02em}
.m-sec-body{font-family:'Inter',sans-serif;font-size:0.8rem;color:#A7AFBB;line-height:1.7;margin-bottom:6px}
.m-sec-note{font-family:'Space Grotesk',sans-serif;font-size:0.75rem;font-weight:400;color:rgba(74,199,255,0.75);letter-spacing:.08em;padding-top:6px;border-top:1px solid rgba(74,199,255,0.1);line-height:1.5}
.m-sec-ctas{display:flex;gap:6px;margin-top:8px;flex-wrap:wrap}
.m-sec-ctas .btn-p{font-size:0.75rem;padding:8px 14px}
.m-sec-ctas .btn-g{font-size:0.75rem;padding:8px 14px}

/* Mobile specific grids */
.m-node-row{display:flex;flex-wrap:wrap;gap:5px;margin-top:8px;justify-content:center}
.m-node-pill{font-family:'Space Grotesk',sans-serif;font-size:0.82rem;font-weight:600;letter-spacing:.12em;text-transform:uppercase;padding:5px 12px;border-radius:14px;border:1px solid rgba(74,199,255,0.12);background:rgba(74,199,255,0.04);color:rgba(74,199,255,0.75)}

.m-layers{display:flex;flex-direction:column;gap:5px;margin-top:8px}
.m-layer{display:flex;align-items:center;gap:8px;background:rgba(74,199,255,0.03);border:1px solid rgba(74,199,255,0.08);border-radius:8px;padding:8px 10px;border-left:2px solid rgba(74,199,255,0.3)}
.m-layer-icon{font-size:0.9rem;flex-shrink:0}
.m-layer-name{font-family:'Space Grotesk',sans-serif;font-size:0.75rem;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:#F5F7FA}
.m-layer-desc{font-family:'Inter',sans-serif;font-size:0.82rem;color:rgba(167,175,187,0.92);line-height:1.3}

.m-platforms{display:flex;flex-direction:column;gap:8px;margin-top:8px}
.m-platform{background:rgba(74,199,255,0.03);border:1px solid rgba(74,199,255,0.08);border-radius:10px;padding:12px 14px;border-top:2px solid rgba(74,199,255,0.3)}
.m-platform-alt{font-family:'Space Mono',monospace;font-size:0.45rem;font-weight:400;letter-spacing:.1em;color:rgba(255,255,255,0.2);margin-bottom:2px}
.m-platform-name{font-family:'Space Grotesk',sans-serif;font-size:1.2rem;font-weight:300;color:#4AC7FF;margin-bottom:2px}
.m-platform-sub{font-family:'Space Grotesk',sans-serif;font-size:0.82rem;font-weight:500;letter-spacing:.1em;text-transform:uppercase;color:rgba(255,255,255,0.35);margin-bottom:6px}
.m-platform-body{font-family:'Inter',sans-serif;font-size:0.78rem;color:rgba(167,175,187,0.88);line-height:1.5;margin-bottom:6px}
.m-platform-specs{display:flex;flex-wrap:wrap;gap:3px}
.m-platform-spec{font-family:'Space Grotesk',sans-serif;font-size:0.42rem;font-weight:500;letter-spacing:.08em;text-transform:uppercase;color:rgba(74,199,255,0.7);background:rgba(74,199,255,0.04);border:1px solid rgba(74,199,255,0.06);border-radius:10px;padding:2px 6px}

.m-payload-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:6px;margin-top:8px}
.m-payload-card{background:rgba(74,199,255,0.04);border:1px solid rgba(74,199,255,0.1);border-radius:8px;padding:10px 8px;text-align:center}
.m-payload-icon{font-size:1rem;margin-bottom:4px}
.m-payload-title{font-family:'Space Grotesk',sans-serif;font-size:0.75rem;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:#4AC7FF;margin-bottom:4px}
.m-payload-desc{font-family:'Inter',sans-serif;font-size:0.82rem;color:rgba(167,175,187,0.88);line-height:1.4}

.m-func-list{display:flex;flex-direction:column;gap:4px;margin-top:8px}
.m-func-item{font-family:'Space Grotesk',sans-serif;font-size:0.78rem;font-weight:400;color:rgba(255,255,255,0.7);letter-spacing:.04em;padding:6px 0;border-bottom:1px solid rgba(74,199,255,0.06);display:flex;align-items:flex-start;gap:6px;line-height:1.4}
.m-func-dot{width:3px;height:3px;border-radius:50%;background:#4AC7FF;flex-shrink:0;margin-top:5px}

.m-wf-grid{display:flex;flex-direction:column;gap:5px;margin-top:8px}
.m-wf-step{display:flex;align-items:center;gap:8px;background:rgba(74,199,255,0.03);border:1px solid rgba(74,199,255,0.08);border-radius:8px;padding:8px 10px}
.m-wf-icon{font-size:0.9rem;flex-shrink:0}
.m-wf-num{font-family:'Space Mono',monospace;font-size:0.82rem;font-weight:400;color:rgba(255,255,255,0.2);flex-shrink:0;width:18px}
.m-wf-title{font-family:'Space Grotesk',sans-serif;font-size:0.75rem;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:#F5F7FA}
.m-wf-desc{font-family:'Inter',sans-serif;font-size:0.82rem;color:rgba(167,175,187,0.92);line-height:1.3}

.m-comp-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:6px;margin-top:8px}
.m-comp-block{background:rgba(74,199,255,0.03);border:1px solid rgba(74,199,255,0.08);border-radius:8px;padding:10px 10px;border-top:2px solid rgba(74,199,255,0.2)}
.m-comp-icon{font-size:0.9rem;margin-bottom:4px}
.m-comp-title{font-family:'Space Grotesk',sans-serif;font-size:0.75rem;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:#F5F7FA;margin-bottom:4px}
.m-comp-desc{font-family:'Inter',sans-serif;font-size:0.82rem;color:rgba(167,175,187,0.88);line-height:1.4}

.m-scale-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:6px;margin-top:8px}
.m-scale-card{background:rgba(74,199,255,0.04);border:1px solid rgba(74,199,255,0.1);border-radius:8px;padding:10px 8px;text-align:center}
.m-scale-val{font-family:'Space Mono',monospace;font-size:1rem;font-weight:700;color:#4AC7FF;margin-bottom:4px}
.m-scale-desc{font-family:'Inter',sans-serif;font-size:0.78rem;color:rgba(167,175,187,0.88);line-height:1.4}

.m-outro-content{position:relative;z-index:30;display:flex;flex-direction:column;align-items:center;justify-content:center;flex:1;padding:60px 20px 36px;text-align:center}
.m-outro-logo{display:flex;align-items:center;margin-bottom:14px}
.m-outro-logo-img{height:28px;width:auto;object-fit:contain}
.m-outro-title{font-family:'Space Grotesk',sans-serif;font-size:clamp(1.5rem,6vw,2.2rem);font-weight:300;line-height:1.1;color:#F5F7FA;margin-bottom:10px;text-transform:uppercase;letter-spacing:-0.02em}
.m-outro-title .oc{color:#4AC7FF}
.m-outro-sub{font-family:'Inter',sans-serif;font-size:0.8rem;color:#A7AFBB;line-height:1.7;max-width:280px;margin-bottom:22px}
.m-outro-ctas{display:flex;flex-direction:column;gap:8px;width:100%;max-width:260px;margin-bottom:20px}
.m-outro-ctas .btn-p,.m-outro-ctas .btn-g{width:100%;text-align:center;padding:12px 20px;font-size:0.75rem}
.m-outro-footer{margin-top:auto;font-family:'Inter',sans-serif;font-size:0.7rem;color:rgba(167,175,187,0.75);text-align:center;line-height:1.6;letter-spacing:.04em}
.m-outro-footer-tag{font-family:'Space Grotesk',sans-serif;font-size:0.42rem;font-weight:500;letter-spacing:.16em;text-transform:uppercase;color:rgba(74,199,255,0.45);margin-top:8px}
`

/* ═══════════════════════════════════════════════════════════════════
   TYPES
═══════════════════════════════════════════════════════════════════ */
type LayerItem = { name: string; desc: string; icon: string; level: number }
type PlatformItem = { name: string; sub: string; body: string; alt: string; href: string; specs: string[] }
type PayloadItem = { title: string; desc: string; icon: string }
type WorkflowItem = { step: string; title: string; desc: string; icon: string }
type CompItem = { title: string; desc: string; icon: string }
type ScaleItem = { val: string; desc: string }

/* ═══════════════════════════════════════════════════════════════════
   PAGE COMPONENT
═══════════════════════════════════════════════════════════════════ */
export default function EcosystemPage() {
  const [isMobile, setIsMobile] = useState(false)
  const [activeStory, setActiveStory] = useState(0)
  const totalStories = SECTIONS.length + 1

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const goNext = useCallback(() => setActiveStory(prev => Math.min(totalStories - 1, prev + 1)), [totalStories])
  const goPrev = useCallback(() => setActiveStory(prev => Math.max(0, prev - 1)), [])

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
      if (dx < 0) goNext(); else goPrev()
    }
    touchStart.current = null
  }, [goNext, goPrev])

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
      lenis = new Lenis({ duration: 1.6, easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) })
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
          ctrLabelRef.current.textContent = SECTIONS[n]?.label ?? 'Ecosystem'
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
    return () => { lenis?.destroy(); ScrollTrigger.getAll().forEach(t => t.kill()) }
  }, [isMobile])

  /* ═══════════════════════════════════════════════════════════════
     MOBILE: STORIES MODE
  ═══════════════════════════════════════════════════════════════ */
  if (isMobile) {
    return (
      <>
        <style>{CSS}</style>
        <div className="m-stories" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
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
                <div className="m-header-logo"><img src="/SFT-logo-1.png" alt="SFT" className="m-header-logo-img" /></div>
                <a href="/" className="m-header-cta">Home</a>
              </div>
              <div className="m-content"><div className="m-content-inner">
                <div className="m-sec-num">— {s.num}</div>
                <div className="m-sec-label"><span className="m-sec-label-line" />{s.eyebrow}</div>
                <div className="m-sec-title">{s.title.split('\n').map((l, li) => <span key={li}>{l}<br /></span>)}</div>
                {s.body && <div className="m-sec-body">{s.body}</div>}
                {s.note && <div className="m-sec-note">{s.note}</div>}
                {'nodeLabels' in s && (<div className="m-node-row">{(s.nodeLabels as string[]).map((n, ni) => <span key={ni} className="m-node-pill">{n}</span>)}</div>)}
                {'layers' in s && (<div className="m-layers">{(s.layers as LayerItem[]).map((l, li) => (<div key={li} className="m-layer"><span className="m-layer-icon"><SvgIcon name={l.icon} /></span><div><div className="m-layer-name">{l.name}</div><div className="m-layer-desc">{l.desc}</div></div></div>))}</div>)}
                {'platforms' in s && (<div className="m-platforms">{(s.platforms as PlatformItem[]).map((p, pi) => (<div key={pi} className="m-platform"><div className="m-platform-alt">{p.alt}</div><div className="m-platform-name">{p.name}</div><div className="m-platform-sub">{p.sub}</div><div className="m-platform-body">{p.body}</div><div className="m-platform-specs">{p.specs.map((sp, si) => <span key={si} className="m-platform-spec">{sp}</span>)}</div></div>))}</div>)}
                {'payloads' in s && (<div className="m-payload-grid">{(s.payloads as PayloadItem[]).map((p, pi) => (<div key={pi} className="m-payload-card"><div className="m-payload-icon"><SvgIcon name={p.icon} /></div><div className="m-payload-title">{p.title}</div><div className="m-payload-desc">{p.desc}</div></div>))}</div>)}
                {'functions' in s && (<div className="m-func-list">{(s.functions as string[]).map((f, fi) => (<div key={fi} className="m-func-item"><span className="m-func-dot" />{f}</div>))}</div>)}
                {'workflow' in s && (<div className="m-wf-grid">{(s.workflow as WorkflowItem[]).map((w, wi) => (<div key={wi} className="m-wf-step"><span className="m-wf-icon"><SvgIcon name={w.icon} /></span><span className="m-wf-num">{w.step}</span><div><div className="m-wf-title">{w.title}</div><div className="m-wf-desc">{w.desc}</div></div></div>))}</div>)}
                {'components' in s && (<div className="m-comp-grid">{(s.components as CompItem[]).map((c, ci) => (<div key={ci} className="m-comp-block"><div className="m-comp-icon"><SvgIcon name={c.icon} /></div><div className="m-comp-title">{c.title}</div><div className="m-comp-desc">{c.desc}</div></div>))}</div>)}
                {'scaleMetrics' in s && (<div className="m-scale-grid">{(s.scaleMetrics as ScaleItem[]).map((m, mi) => (<div key={mi} className="m-scale-card"><div className="m-scale-val">{m.val}</div><div className="m-scale-desc">{m.desc}</div></div>))}</div>)}
                {s.cta && s.cta.length > 0 && (<div className="m-sec-ctas">{s.cta.map((c, ci) => (<a key={ci} href={c.href} className={c.style === 'primary' ? 'btn-p' : 'btn-g'}>{c.label}</a>))}</div>)}
              </div></div>
            </div>
          ))}

          {/* Outro slide */}
          <div className={`m-slide${activeStory === SECTIONS.length ? ' active' : ''}`}>
            <div className="m-slide-bg" style={{ backgroundImage: `url(${SECTIONS[0].img})` }} />
            <div className="m-slide-overlay" style={{ background: 'radial-gradient(ellipse at center, rgba(5,5,5,0.92) 0%, rgba(5,5,5,0.88) 50%, rgba(5,5,5,0.7) 100%)' }} />
            <div className="m-slide-vignette" />
            <div className="m-tap-left" onClick={goPrev} />
            <div className="m-tap-right" onClick={goNext} />
            <div className="m-header"><div className="m-header-logo"><img src="/SFT-logo-1.png" alt="SFT" className="m-header-logo-img" /></div><a href="/" className="m-header-cta">Home</a></div>
            <div className="m-outro-content">
              <div className="m-outro-logo"><img src="/SFT-logo-1.png" alt="SFT" className="m-outro-logo-img" /></div>
              <h2 className="m-outro-title">Building The<br />Next Layer of<br /><span className="oc">Infrastructure.</span></h2>
              <p className="m-outro-sub">Platforms, payloads, and systems — unified aerial infrastructure for critical operations.</p>
              <div className="m-outro-ctas">
                <a href="/hawke" className="btn-p">Explore HAWKE</a>
                <a href="/mobius" className="btn-g">Explore MOBIUS</a>
                <a href="mailto:info@susanfuturetechnologies.com" className="btn-g">Contact Our Team</a>
              </div>
              <div className="m-outro-footer">Susan Future Technologies Pvt. Ltd.<br />IIT Madras Research Park, Chennai<div className="m-outro-footer-tag">Ecosystem · Platforms · Payloads · Infrastructure</div></div>
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
        <div ref={bgLayerARef} className="bg-inner-a" style={{ backgroundImage: 'url(/sft/ecosystem/hero.png)', backgroundSize: 'cover', backgroundPosition: 'center center', opacity: 1 }} />
        <div ref={bgLayerBRef} className="bg-inner-b" style={{ backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0 }} />
      </div>
      <div ref={overlayRef} className="overlay-layer" style={{ background: 'radial-gradient(ellipse at center, rgba(5,5,5,0.84) 0%, rgba(5,5,5,0.62) 40%, rgba(5,5,5,0.25) 65%, transparent 100%)' }} />
      <div className="vignette" />
      <div className="scanlines" />
      <div className="network-bg">
        {Array.from({ length: 12 }).map((_, i) => (<div key={`n${i}`} className="net-node" style={{ left: `${10 + Math.random() * 80}%`, top: `${10 + Math.random() * 80}%`, animationDelay: `${Math.random() * 3}s`, animationDuration: `${2 + Math.random() * 3}s` }} />))}
        {Array.from({ length: 6 }).map((_, i) => (<div key={`l${i}`} className="net-line" style={{ left: `${Math.random() * 60}%`, top: `${20 + Math.random() * 60}%`, width: `${100 + Math.random() * 200}px`, transform: `rotate(${-30 + Math.random() * 60}deg)`, animationDelay: `${Math.random() * 5}s`, animationDuration: `${4 + Math.random() * 4}s` }} />))}
      </div>
      <div className="particles">
        {Array.from({ length: 12 }).map((_, i) => (<div key={i} className="particle" style={{ left: `${Math.random() * 100}%`, animationDuration: `${8 + Math.random() * 12}s`, animationDelay: `${Math.random() * 8}s` }} />))}
      </div>
      <div id="sd" />

      {/* Intro */}
      <div ref={introRef} className="intro-panel">
        <div className="i-eye"><span className="i-eye-line" />SUSAN FUTURE TECHNOLOGIES<span className="i-eye-line" /></div>
        <h1 className="i-title"><span className="gc">Ecosystem</span></h1>
        <p className="i-sub">Aerial infrastructure systems for communication and monitoring — integrating platforms, payloads, and control into a unified operational system.</p>
        <div className="i-ctas">
          <a href="/applications" className="btn-p">Explore Technology</a>
          <a href="/applications" className="btn-g">View Applications</a>
        </div>
        <div className="i-scroll"><span className="i-dot" />Scroll to explore</div>
      </div>

      {/* Nav */}
      <nav className="s-nav">
        <div className="s-logo"><img src="/SFT-logo-1.png" alt="Susan Future Technologies" className="s-logo-img" /></div>
        <div className="s-section">
          <span ref={ctrRef} className="s-sec-num">01 / 10</span>
          <span className="s-sep" />
          <span ref={ctrLabelRef} className="s-sec-label">Ecosystem</span>
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
      <div id="dots">{SECTIONS.map((_, i) => (<div key={i} ref={el => { dotRefs.current[i] = el }} className="dot" />))}</div>

      {/* Section panels */}
      {SECTIONS.map((s, i) => (
        <div key={i} ref={el => { panelRefs.current[i] = el }} className={`s-panel pos-${s.pos}`}>
          <div className="p-num">— {s.num}</div>
          <div className="p-eyebrow"><span className="p-eyebrow-line" />{s.eyebrow}</div>
          <h2 className="p-title">{s.title.split('\n').map((line, li) => <span key={li}>{line}<br /></span>)}</h2>
          {s.body && <p className="p-body">{s.body}</p>}
          {s.note && <div className="p-note">{s.note}</div>}
          {'nodeLabels' in s && (
            <div className="node-row">{(s.nodeLabels as string[]).map((n, ni) => <span key={ni} className="node-pill">{n}</span>)}</div>
          )}
          {'layers' in s && (
            <div className="layers-stack">{(s.layers as LayerItem[]).map((l, li) => (
              <div key={li} className="layer-bar"><span className="layer-icon"><SvgIcon name={l.icon} /></span><span className="layer-level">L{l.level}</span><span className="layer-name">{l.name}</span><span className="layer-desc">{l.desc}</span></div>
            ))}</div>
          )}
          {'platforms' in s && (
            <div className="platform-compare">{(s.platforms as PlatformItem[]).map((p, pi) => (
              <div key={pi} className="platform-card">
                <div className="platform-alt">{p.alt}</div>
                <div className="platform-name">{p.name}</div>
                <div className="platform-sub">{p.sub}</div>
                <div className="platform-body">{p.body}</div>
                <div className="platform-specs">{p.specs.map((sp, si) => <span key={si} className="platform-spec">{sp}</span>)}</div>
                <a href={p.href} className="platform-link">Explore {p.name} <span className="platform-link-arrow">→</span></a>
              </div>
            ))}</div>
          )}
          {'payloads' in s && (
            <div className="payload-grid">{(s.payloads as PayloadItem[]).map((p, pi) => (
              <div key={pi} className="payload-card"><div className="payload-icon"><SvgIcon name={p.icon} /></div><div className="payload-title">{p.title}</div><div className="payload-desc">{p.desc}</div></div>
            ))}</div>
          )}
          {'functions' in s && (
            <div className="func-list">{(s.functions as string[]).map((f, fi) => (
              <div key={fi} className="func-item"><span className="func-dot" />{f}</div>
            ))}</div>
          )}
          {'workflow' in s && (
            <div className="workflow-grid">{(s.workflow as WorkflowItem[]).map((w, wi) => (
              <div key={wi} className="wf-step"><div className="wf-icon"><SvgIcon name={w.icon} /></div><div className="wf-num">{w.step}</div><div className="wf-title">{w.title}</div><div className="wf-desc">{w.desc}</div></div>
            ))}</div>
          )}
          {'components' in s && (
            <div className="comp-grid">{(s.components as CompItem[]).map((c, ci) => (
              <div key={ci} className="comp-block"><div className="comp-icon"><SvgIcon name={c.icon} /></div><div className="comp-title">{c.title}</div><div className="comp-desc">{c.desc}</div></div>
            ))}</div>
          )}
          {'scaleMetrics' in s && (
            <div className="scale-grid">{(s.scaleMetrics as ScaleItem[]).map((m, mi) => (
              <div key={mi} className="scale-card"><div className="scale-val">{m.val}</div><div className="scale-desc">{m.desc}</div></div>
            ))}</div>
          )}
          {s.cta && s.cta.length > 0 && (
            <div className="p-ctas">{s.cta.map((c, ci) => <a key={ci} href={c.href} className={c.style === 'primary' ? 'btn-p' : 'btn-g'}>{c.label}</a>)}</div>
          )}
        </div>
      ))}

      {/* Outro */}
      <div ref={outroRef} className="outro-panel">
        <div className="o-logo"><img src="/SFT-logo-1.png" alt="SFT" className="o-logo-img" /></div>
        <div className="o-eyebrow"><span className="o-eyebrow-line" />THE ECOSYSTEM<span className="o-eyebrow-line" /></div>
        <h2 className="o-title">Building The<br />Next Layer of<br /><span className="oc">Infrastructure.</span></h2>
        <p className="o-sub">Platforms, payloads, communication, and control — unified aerial infrastructure for critical operations at scale.</p>
        <div className="o-cta-row">
          <a href="/hawke" className="btn-p">Explore HAWKE</a>
          <a href="/mobius" className="btn-g">Explore MOBIUS</a>
          <a href="mailto:info@susanfuturetechnologies.com" className="btn-g">Contact Our Team</a>
          <a href="/" className="btn-g">Home</a>
        </div>
        <div className="o-divider" />
        <div className="o-footer">
          <div className="o-footer-nav">
            <a href="/" className="o-footer-link">Home</a>
            <a href="/about" className="o-footer-link">About</a>
            <a href="/hawke" className="o-footer-link">HAWKE</a>
            <a href="/mobius" className="o-footer-link">MOBIUS</a>
            <a href="/applications" className="o-footer-link">Applications</a>
            <a href="/ecosystem" className="o-footer-link">Ecosystem</a>
            <a href="mailto:info@susanfuturetechnologies.com" className="o-footer-link">Contact</a>
          </div>
          <div className="o-footer-info">Susan Future Technologies Pvt. Ltd.<br />IIT Madras Research Park, Chennai</div>
          <div className="o-footer-tagline">
            <span className="o-footer-dot" />Platforms<span className="o-footer-dot" />Payloads<span className="o-footer-dot" />Infrastructure<span className="o-footer-dot" />
          </div>
        </div>
      </div>
    </>
  )
}
