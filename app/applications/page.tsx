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
   SECTION DATA — Applications Chapters
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
    title: 'APPLICATIONS',
    body: 'Deployable Aerial Infrastructure for Real-World Environments',
    note: 'From disaster response to large-scale monitoring, SFT platforms deliver communication, visibility, and control where conventional systems cannot operate.',
    chips: [],
    pos: 'center' as const,
    bgPos: 'center center',
    img: '/sft/applications/hero.png',
    overlay: 'radial-gradient(ellipse at center, rgba(5,5,5,0.86) 0%, rgba(5,5,5,0.65) 40%, rgba(5,5,5,0.3) 65%, transparent 100%)',
    eyebrow: 'MISSION-FIRST AERIAL SYSTEMS',
    cta: [
      { label: 'Explore HAWKE', style: 'primary', href: '/hawke' },
      { label: 'Request Pilot Deployment', style: 'ghost', href: 'tel:+919486675847' },
    ],
  },
  {
    num: '02', label: 'Overview',
    title: 'ENGINEERED\nFOR CRITICAL\nENVIRONMENTS',
    body: 'SFT platforms are designed to operate in environments where infrastructure is limited, damaged, or non-existent.\n\nBy combining aerial deployment, modular payload systems, and persistent operation, SFT enables communication, monitoring, and operational awareness across diverse mission scenarios.',
    note: '',
    chips: [],
    pos: 'center' as const,
    bgPos: 'center center',
    img: '/sft/applications/overview.png',
    overlay: 'radial-gradient(ellipse at center, rgba(5,5,5,0.88) 0%, rgba(5,5,5,0.72) 40%, rgba(5,5,5,0.35) 65%, transparent 100%)',
    eyebrow: 'APPLICATIONS OVERVIEW',
    cta: [],
    environments: [
      { label: 'DISASTER ZONES', icon: 'alert' },
      { label: 'BORDER REGIONS', icon: 'shield' },
      { label: 'INDUSTRIAL SITES', icon: 'pick' },
      { label: 'FOREST & TERRAIN', icon: 'leaf' },
    ],
  },
  {
    num: '03', label: 'Applications',
    title: 'CORE\nAPPLICATION\nAREAS',
    body: '',
    note: '',
    chips: [],
    pos: 'center' as const,
    bgPos: 'center center',
    img: '/sft/applications/disaster.png',
    overlay: 'radial-gradient(ellipse at center, rgba(5,5,5,0.90) 0%, rgba(5,5,5,0.75) 40%, rgba(5,5,5,0.4) 65%, rgba(5,5,5,0.2) 100%)',
    eyebrow: 'FOUR PILLARS OF DEPLOYMENT',
    cta: [],
    applications: [
      {
        num: '01',
        title: 'DISASTER RESPONSE',
        heading: 'RESTORING CONNECTIVITY WHEN IT MATTERS MOST',
        body: 'In disaster scenarios such as floods, landslides, and earthquakes, ground communication infrastructure is often disrupted. HAWKE can be rapidly deployed to establish temporary communication networks.',
        capabilities: ['Rapid network deployment', 'Emergency communication relay', 'Aerial situational awareness', 'Real-time monitoring'],
        icon: 'alert',
      },
      {
        num: '02',
        title: 'DEFENCE & BORDER',
        heading: 'PERSISTENT SURVEILLANCE FROM ELEVATED POSITIONS',
        body: 'Border environments require continuous monitoring and communication support across challenging terrains. HAWKE provides persistent aerial presence for surveillance and threat detection.',
        capabilities: ['24/7 aerial monitoring', 'EO / IR payload integration', 'Drone threat detection', 'Secure communication relay'],
        icon: 'shield',
      },
      {
        num: '03',
        title: 'TELECOM & CONNECTIVITY',
        heading: 'EXTENDING NETWORKS BEYOND INFRASTRUCTURE LIMITS',
        body: 'Remote and underserved regions often lack the terrain or infrastructure required for traditional telecom towers. SFT platforms provide an aerial alternative for localized network coverage.',
        capabilities: ['Temporary network deployment', 'Rural connectivity', 'Event-based communication', 'Remote site connectivity'],
        icon: 'antenna',
      },
      {
        num: '04',
        title: 'INDUSTRIAL & ENVIRONMENTAL',
        heading: 'REAL-TIME VISIBILITY ACROSS CRITICAL SITES',
        body: 'From mining operations to forest monitoring, aerial platforms provide continuous oversight across large and complex environments without ground-level limitations.',
        capabilities: ['Site monitoring', 'Environmental tracking', 'Thermal analysis', 'Asset surveillance'],
        icon: 'leaf',
      },
    ],
  },
  {
    num: '04', label: 'Payloads',
    title: 'MODULAR\nPAYLOAD\nSYSTEMS',
    body: 'SFT platforms are designed to support a range of mission-specific payloads, allowing each deployment to be configured based on operational requirements.',
    note: '',
    chips: [],
    pos: 'center' as const,
    bgPos: 'center center',
    img: '/sft/applications/payload.png',
    overlay: 'radial-gradient(ellipse at center, rgba(5,5,5,0.88) 0%, rgba(5,5,5,0.68) 40%, rgba(5,5,5,0.3) 65%, transparent 100%)',
    eyebrow: 'PAYLOAD & SENSOR SYSTEMS',
    cta: [],
    payloads: [
      { title: 'COMMUNICATION', desc: 'Network relay modules for voice, data, and signal extension', icon: 'antenna' },
      { title: 'OPTICAL', desc: 'EO cameras for high-resolution visual monitoring', icon: 'camera' },
      { title: 'THERMAL', desc: 'Infrared sensors for night and low-visibility environments', icon: 'thermo' },
      { title: 'RADAR', desc: 'Detection and tracking for aerial and ground threats', icon: 'chart' },
      { title: 'ENVIRONMENTAL', desc: 'Air quality, terrain, and ecosystem monitoring', icon: 'globe' },
    ],
  },
  {
    num: '05', label: 'Coverage',
    title: 'ELEVATED\nCOVERAGE.\nENHANCED\nVISIBILITY.',
    body: 'Operating from an elevated vantage point, SFT platforms extend both communication reach and monitoring capability across wide areas.',
    note: '',
    chips: [],
    pos: 'center' as const,
    bgPos: 'center center',
    img: '/sft/applications/coverage.png',
    overlay: 'radial-gradient(ellipse at center, rgba(5,5,5,0.88) 0%, rgba(5,5,5,0.68) 40%, rgba(5,5,5,0.3) 65%, transparent 100%)',
    eyebrow: 'COVERAGE & CAPABILITY',
    cta: [],
    coverageStats: [
      { val: '5 KM', desc: 'Localized Coverage Radius' },
      { val: 'ELEVATED', desc: 'Observation Angle' },
      { val: 'REDUCED', desc: 'Ground Obstructions' },
      { val: 'SCALABLE', desc: 'Multi-unit Deployment' },
    ],
  },
  {
    num: '06', label: 'Scenarios',
    title: 'DEPLOYABLE\nACROSS\nENVIRONMENTS',
    body: 'HAWKE is designed for rapid deployment across varied terrains, requiring minimal infrastructure and enabling immediate operational readiness.',
    note: '',
    chips: [],
    pos: 'center' as const,
    bgPos: 'center center',
    img: '/sft/applications/deployment.png',
    overlay: 'radial-gradient(ellipse at center, rgba(5,5,5,0.88) 0%, rgba(5,5,5,0.72) 40%, rgba(5,5,5,0.4) 65%, rgba(5,5,5,0.2) 100%)',
    eyebrow: 'DEPLOYMENT SCENARIOS',
    cta: [],
    scenarios: [
      { title: 'DISASTER ZONES', desc: 'Rapid deployment in post-disaster environments for immediate communication restoration', icon: 'alert' },
      { title: 'BORDER REGIONS', desc: 'Persistent monitoring across remote and challenging border terrains', icon: 'shield' },
      { title: 'REMOTE TERRAINS', desc: 'Connectivity and monitoring in areas without existing infrastructure', icon: 'mountain' },
      { title: 'INDUSTRIAL SITES', desc: 'Continuous oversight for mining, construction, and energy operations', icon: 'pick' },
      { title: 'TEMPORARY OPS', desc: 'Event-based and time-limited deployments with rapid setup and teardown', icon: 'clock' },
    ],
  },
  {
    num: '07', label: 'Sectors',
    title: 'ONE\nPLATFORM.\nMULTIPLE\nSECTORS.',
    body: 'SFT platforms are designed to serve multiple industries with a single adaptable system — reducing deployment complexity while increasing operational capability.',
    note: '',
    chips: [],
    pos: 'center' as const,
    bgPos: 'center center',
    img: '/sft/applications/crossindustry.png',
    overlay: 'radial-gradient(ellipse at center, rgba(5,5,5,0.88) 0%, rgba(5,5,5,0.72) 40%, rgba(5,5,5,0.4) 65%, rgba(5,5,5,0.2) 100%)',
    eyebrow: 'CROSS-INDUSTRY VALUE',
    cta: [],
    sectors: [
      { name: 'GOVERNMENT', glow: true },
      { name: 'DEFENCE', glow: true },
      { name: 'TELECOM', glow: false },
      { name: 'INDUSTRIAL', glow: false },
      { name: 'ENVIRONMENTAL', glow: false },
    ],
  },
  {
    num: '08', label: 'Connect',
    title: 'DEPLOY\nWHEN AND\nWHERE IT\nMATTERS',
    body: 'Whether responding to emergencies, monitoring remote environments, or extending communication networks, SFT platforms are built to deliver immediate operational impact.',
    note: '',
    chips: [],
    pos: 'center' as const,
    bgPos: 'center center',
    img: '/sft/applications/cta.png',
    overlay: 'radial-gradient(ellipse at center, rgba(5,5,5,0.88) 0%, rgba(5,5,5,0.72) 40%, rgba(5,5,5,0.35) 65%, transparent 100%)',
    eyebrow: 'GET STARTED',
    cta: [
      { label: 'Request Pilot Deployment', style: 'primary', href: 'tel:+919486675847' },
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
  background:rgba(5,5,5,0.78);
  
  border-bottom:1px solid rgba(74,199,255,0.08);
}
.s-logo{display:flex;align-items:center}
.s-logo-img{height:55px;width:auto;object-fit:contain;mix-blend-mode:screen}
.s-section{
  position:absolute;left:50%;transform:translateX(-50%);
  display:flex;align-items:center;gap:10px;
}
.s-sec-num{
  font-family:'Space Mono',monospace;
  font-size:0.95rem;font-weight:400;letter-spacing:.1em;
  color:rgba(255,255,255,0.45);
}
.s-sec-label{
  font-family:'Space Grotesk',sans-serif;
  font-size:0.95rem;font-weight:500;letter-spacing:.28em;text-transform:uppercase;
  color:rgba(74,199,255,0.8);
  transition:opacity .4s;
}
.s-sep{width:1px;height:12px;background:rgba(255,255,255,0.08)}
.s-nav-right{display:flex;align-items:center;gap:18px}
.s-nav-link{
  font-family:'Space Grotesk',sans-serif;
  font-size:0.95rem;font-weight:500;letter-spacing:.18em;text-transform:uppercase;
  color:rgba(255,255,255,0.55);text-decoration:none;transition:color .2s;
}
.s-nav-link:hover{color:rgba(255,255,255,0.6)}
.s-nav-link.active{color:rgba(74,199,255,0.7)}
.s-cta-btn{
  font-family:'Space Grotesk',sans-serif;font-size:0.95rem;font-weight:600;
  letter-spacing:.18em;text-transform:uppercase;
  background:transparent;color:#4AC7FF;
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
  letter-spacing:.1em;color:rgba(255,255,255,0.35);margin-bottom:6px;
}

.p-title{
  font-family:'Space Grotesk',sans-serif;
  font-size:clamp(2.8rem,4.5vw,5rem);
  font-weight:300;line-height:1.08;letter-spacing:-0.03em;
  color:#F5F7FA;white-space:pre-line;margin-bottom:14px;
  text-transform:uppercase;
  text-shadow:0 4px 32px rgba(0,0,0,0.6);
}

.p-body{
  font-family:'Inter',sans-serif;
  font-size:0.95rem;color:#A7AFBB;
  line-height:1.72;max-width:380px;font-weight:400;margin-bottom:12px;
  white-space:pre-line;
}
.pos-right .p-body,.pos-right .p-note{margin-left:auto}
.pos-center .p-body{max-width:500px}

.p-note{
  font-family:'Space Grotesk',sans-serif;
  font-size:0.95rem;font-weight:400;color:rgba(74,199,255,0.85);
  letter-spacing:.08em;padding-top:10px;
  border-top:1px solid rgba(74,199,255,0.12);
  max-width:380px;line-height:1.5;
  white-space:pre-line;
}
.pos-right .p-note{margin-left:auto}
.pos-center .p-note{max-width:500px}

/* ── CTA buttons ── */
.p-ctas{display:flex;flex-wrap:wrap;gap:10px;margin-top:20px}
.pos-center .p-ctas{justify-content:center}
.pos-right .p-ctas{justify-content:flex-end}

.btn-p{
  background:transparent;color:#4AC7FF;
  font-family:'Space Grotesk',sans-serif;
  font-size:0.95rem;font-weight:600;letter-spacing:.18em;text-transform:uppercase;
  padding:11px 28px;border-radius:50px;text-decoration:none;display:inline-block;
  border:1px solid rgba(74,199,255,0.5);
  transition:all .25s ease;
  pointer-events:auto;cursor:pointer;
  position:relative;overflow:hidden;
}
.btn-p:hover{background:rgba(74,199,255,0.1);border-color:#4AC7FF;box-shadow:0 0 24px rgba(74,199,255,0.25);transform:translateY(-1px)}
.btn-g{
  color:rgba(255,255,255,0.7);font-family:'Space Grotesk',sans-serif;
  font-size:0.95rem;font-weight:400;letter-spacing:.18em;text-transform:uppercase;
  padding:11px 28px;border-radius:50px;border:1px solid rgba(255,255,255,0.12);
  text-decoration:none;display:inline-block;
  transition:all .25s ease;pointer-events:auto;cursor:pointer;
}
.btn-g:hover{color:#fff;border-color:rgba(74,199,255,0.4);background:rgba(10,15,20,0.82);box-shadow:0 0 16px rgba(74,199,255,0.12)}

/* ── Environment tags ── */
.env-tags{
  display:flex;flex-wrap:wrap;gap:10px;margin-top:20px;
  justify-content:center;max-width:600px;
}
.env-tag{
  display:flex;align-items:center;gap:8px;
  background:rgba(74,199,255,0.05);
  border:1px solid rgba(74,199,255,0.12);
  border-radius:24px;padding:10px 20px;
  
  transition:all .3s ease;
  opacity:0;transform:translateY(30px);
  transition:opacity 0.6s cubic-bezier(.16,1,.3,1), transform 0.6s cubic-bezier(.16,1,.3,1), background 0.3s ease, border-color 0.3s ease;
}
.vis .env-tag{opacity:1;transform:translateY(0)}
.vis .env-tag:nth-child(1){transition-delay:0s}
.vis .env-tag:nth-child(2){transition-delay:0.1s}
.vis .env-tag:nth-child(3){transition-delay:0.2s}
.vis .env-tag:nth-child(4){transition-delay:0.3s}
.env-tag:hover{
  background:rgba(74,199,255,0.12);
  border-color:rgba(74,199,255,0.3);
  transform:translateY(-2px);
}
.env-tag-icon{font-size:1.1rem}
.env-tag-label{
  font-family:'Space Grotesk',sans-serif;
  font-size:0.95rem;font-weight:600;letter-spacing:.18em;text-transform:uppercase;
  color:rgba(255,255,255,0.6);
}

/* ── Application pillars (2x2 grid) ── */
.app-pillars{
  display:grid;grid-template-columns:repeat(2,1fr);gap:16px;
  width:100%;max-width:900px;margin-top:20px;
}
.app-pillar{
  background:rgba(10,15,20,0.8);
  border:1px solid rgba(74,199,255,0.1);
  border-radius:14px;padding:24px 20px;
  
  text-align:left;
  opacity:0;transform:translateY(50px);
  transition:opacity 0.7s cubic-bezier(.16,1,.3,1), transform 0.7s cubic-bezier(.16,1,.3,1), background 0.3s ease, border-color 0.3s ease;
  position:relative;
  overflow:hidden;
}
.vis .app-pillar{opacity:1;transform:translateY(0)}
.vis .app-pillar:nth-child(1){transition-delay:0s}
.vis .app-pillar:nth-child(2){transition-delay:0.12s}
.vis .app-pillar:nth-child(3){transition-delay:0.24s}
.vis .app-pillar:nth-child(4){transition-delay:0.36s}
.app-pillar:hover{
  background:rgba(74,199,255,0.08);
  border-color:rgba(74,199,255,0.22);
}
.app-pillar::before{
  content:'';position:absolute;top:0;left:20px;right:20px;height:2px;
  background:linear-gradient(90deg,#4AC7FF,rgba(74,199,255,0.05));
  border-radius:1px;
}
.app-pillar-header{
  display:flex;align-items:center;gap:12px;margin-bottom:10px;margin-top:4px;
}
.app-pillar-icon{font-size:1.3rem}
.app-pillar-num{
  font-family:'Space Mono',monospace;
  font-size:0.95rem;font-weight:400;letter-spacing:.1em;
  color:rgba(255,255,255,0.2);
}
.app-pillar-title{
  font-family:'Space Grotesk',sans-serif;
  font-size:0.95rem;font-weight:600;letter-spacing:.14em;text-transform:uppercase;
  color:#F5F7FA;
}
.app-pillar-heading{
  font-family:'Space Grotesk',sans-serif;
  font-size:0.68rem;font-weight:500;letter-spacing:.1em;text-transform:uppercase;
  color:rgba(74,199,255,0.85);margin-bottom:8px;line-height:1.4;
}
.app-pillar-body{
  font-family:'Inter',sans-serif;
  font-size:0.95rem;color:rgba(167,175,187,0.75);line-height:1.6;
  margin-bottom:10px;
}
.app-pillar-caps{
  display:flex;flex-wrap:wrap;gap:5px;
}
.app-pillar-cap{
  font-family:'Space Grotesk',sans-serif;
  font-size:0.95rem;font-weight:500;letter-spacing:.1em;text-transform:uppercase;
  color:rgba(74,199,255,0.75);
  background:rgba(74,199,255,0.05);
  border:1px solid rgba(74,199,255,0.08);
  border-radius:14px;padding:4px 10px;
}

/* ── Payload modules ── */
.payload-grid{
  display:grid;grid-template-columns:repeat(5,1fr);gap:14px;
  width:100%;max-width:960px;margin-top:24px;
}
.payload-card{
  background:rgba(10,15,20,0.82);
  border:1px solid rgba(74,199,255,0.1);
  border-radius:12px;padding:24px 14px;
  
  text-align:center;
  opacity:0;transform:translateY(50px);
  transition:opacity 0.7s cubic-bezier(.16,1,.3,1), transform 0.7s cubic-bezier(.16,1,.3,1), background 0.3s ease, border-color 0.3s ease;
}
.vis .payload-card{opacity:1;transform:translateY(0)}
.vis .payload-card:nth-child(1){transition-delay:0s}
.vis .payload-card:nth-child(2){transition-delay:0.1s}
.vis .payload-card:nth-child(3){transition-delay:0.2s}
.vis .payload-card:nth-child(4){transition-delay:0.3s}
.vis .payload-card:nth-child(5){transition-delay:0.4s}
.payload-card:hover{
  background:rgba(74,199,255,0.1);
  border-color:rgba(74,199,255,0.25);
  transform:translateY(-3px);
}
.payload-icon{
  font-size:1.5rem;margin-bottom:12px;
  display:flex;align-items:center;justify-content:center;
  width:44px;height:44px;margin:0 auto 12px;
  background:rgba(10,15,20,0.82);
  border:1px solid rgba(74,199,255,0.12);
  border-radius:50%;
}
.payload-title{
  font-family:'Space Grotesk',sans-serif;
  font-size:0.95rem;font-weight:600;letter-spacing:.14em;text-transform:uppercase;
  color:#4AC7FF;margin-bottom:8px;
}
.payload-desc{
  font-family:'Inter',sans-serif;
  font-size:0.95rem;color:rgba(167,175,187,0.88);line-height:1.5;
}

/* ── Coverage stats ── */
.coverage-grid{
  display:grid;grid-template-columns:repeat(4,1fr);gap:20px;
  width:100%;max-width:900px;margin-top:24px;
}
.coverage-card{
  background:rgba(10,15,20,0.82);
  border:1px solid rgba(74,199,255,0.1);
  border-radius:12px;padding:28px 20px;
  
  text-align:center;
  opacity:0;transform:translateY(60px);
  transition:opacity 0.8s cubic-bezier(.16,1,.3,1), transform 0.8s cubic-bezier(.16,1,.3,1), background 0.3s ease, border-color 0.3s ease;
  position:relative;
}
.vis .coverage-card{opacity:1;transform:translateY(0)}
.vis .coverage-card:nth-child(1){transition-delay:0s}
.vis .coverage-card:nth-child(2){transition-delay:0.15s}
.vis .coverage-card:nth-child(3){transition-delay:0.3s}
.vis .coverage-card:nth-child(4){transition-delay:0.45s}
.coverage-card:hover{
  background:rgba(74,199,255,0.1);
  border-color:rgba(74,199,255,0.25);
}
.coverage-val{
  font-family:'Space Mono',monospace;
  font-size:1.6rem;font-weight:700;color:#4AC7FF;
  margin-bottom:8px;letter-spacing:-0.02em;
}
.coverage-desc{
  font-family:'Inter',sans-serif;
  font-size:0.95rem;color:rgba(167,175,187,0.88);line-height:1.5;
}

/* ── Scenario tiles (staggered) ── */
.scenario-grid{
  display:grid;grid-template-columns:repeat(5,1fr);gap:14px;
  width:100%;max-width:960px;margin-top:24px;
}
.scenario-tile{
  background:rgba(10,15,20,0.82);
  border:1px solid rgba(74,199,255,0.1);
  border-radius:12px;padding:22px 14px;
  
  text-align:center;
  opacity:0;transform:translateY(40px);
  transition:opacity 0.6s cubic-bezier(.16,1,.3,1), transform 0.6s cubic-bezier(.16,1,.3,1), background 0.3s ease, border-color 0.3s ease;
}
.vis .scenario-tile{opacity:1;transform:translateY(0)}
.vis .scenario-tile:nth-child(1){transition-delay:0s}
.vis .scenario-tile:nth-child(2){transition-delay:0.08s}
.vis .scenario-tile:nth-child(3){transition-delay:0.16s}
.vis .scenario-tile:nth-child(4){transition-delay:0.24s}
.vis .scenario-tile:nth-child(5){transition-delay:0.32s}
.scenario-tile:hover{
  background:rgba(74,199,255,0.1);
  border-color:rgba(74,199,255,0.25);
}
.scenario-icon{font-size:1.3rem;margin-bottom:10px}
.scenario-title{
  font-family:'Space Grotesk',sans-serif;
  font-size:0.7rem;font-weight:600;letter-spacing:.14em;text-transform:uppercase;
  color:#F5F7FA;margin-bottom:6px;
}
.scenario-desc{
  font-family:'Inter',sans-serif;
  font-size:0.95rem;color:rgba(167,175,187,0.65);line-height:1.5;
}

/* ── Sector labels ── */
.sector-grid{
  display:flex;flex-wrap:wrap;gap:12px;margin-top:24px;
  justify-content:center;max-width:700px;
}
.sector-label{
  font-family:'Space Grotesk',sans-serif;
  font-size:0.95rem;font-weight:600;letter-spacing:.2em;text-transform:uppercase;
  padding:14px 28px;border-radius:50px;
  border:1px solid rgba(74,199,255,0.12);
  background:rgba(10,15,20,0.82);
  color:rgba(255,255,255,0.4);
  
  opacity:0;transform:scale(0.9);
  transition:opacity 0.6s cubic-bezier(.16,1,.3,1), transform 0.6s cubic-bezier(.16,1,.3,1), background 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
}
.vis .sector-label{opacity:1;transform:scale(1)}
.vis .sector-label:nth-child(1){transition-delay:0s}
.vis .sector-label:nth-child(2){transition-delay:0.1s}
.vis .sector-label:nth-child(3){transition-delay:0.2s}
.vis .sector-label:nth-child(4){transition-delay:0.3s}
.vis .sector-label:nth-child(5){transition-delay:0.4s}
.sector-label:hover{
  background:rgba(74,199,255,0.1);
  border-color:rgba(74,199,255,0.3);
  color:rgba(255,255,255,0.7);
}
.sector-label.glow{
  color:#4AC7FF;
  border-color:rgba(74,199,255,0.3);
  box-shadow:0 0 16px rgba(74,199,255,0.1);
}
.sector-label.glow:hover{
  box-shadow:0 0 28px rgba(74,199,255,0.2);
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
  font-size:0.95rem;font-weight:500;letter-spacing:.28em;text-transform:uppercase;
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
  max-width:520px;margin-bottom:42px;text-align:center
}
.i-ctas{display:flex;gap:12px;margin-bottom:48px}
.i-scroll{
  display:flex;align-items:center;gap:10px;font-size:0.95rem;
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
  
  padding:48px;
}
.outro-panel.vis{opacity:1;transform:translateY(0);pointer-events:auto}

.o-logo{display:flex;align-items:center;gap:6px;margin-bottom:18px}
.o-logo-img{height:36px;width:auto;object-fit:contain}
.o-eyebrow{
  font-family:'Space Grotesk',sans-serif;
  font-size:0.95rem;font-weight:500;letter-spacing:.28em;text-transform:uppercase;
  color:rgba(74,199,255,0.7);
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
  text-align:center;max-width:460px;
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
.o-footer-nav{display:flex;gap:20px;flex-wrap:wrap;justify-content:center}
.o-footer-link{
  font-family:'Space Grotesk',sans-serif;
  font-size:0.95rem;font-weight:500;letter-spacing:.18em;text-transform:uppercase;
  color:rgba(255,255,255,0.5);text-decoration:none;transition:color .2s;
}
.o-footer-link:hover{color:rgba(74,199,255,0.85)}
.o-footer-info{
  font-family:'Inter',sans-serif;
  font-size:0.95rem;color:rgba(167,175,187,0.92);text-align:center;line-height:1.6;
}
.o-footer-tagline{
  font-family:'Space Grotesk',sans-serif;
  font-size:0.95rem;font-weight:500;letter-spacing:.2em;text-transform:uppercase;
  color:rgba(74,199,255,0.45);margin-top:8px;
  display:flex;align-items:center;gap:8px;
}
.o-footer-dot{width:3px;height:3px;border-radius:50%;background:rgba(74,199,255,0.4)}

/* ── Scroll driver ── */
#sd{height:1300vh;position:relative;z-index:5;pointer-events:none}


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
.m-header-cta{font-family:'Space Grotesk',sans-serif;font-size:0.95rem;font-weight:700;letter-spacing:.14em;text-transform:uppercase;background:transparent;color:#4AC7FF;border:1px solid rgba(74,199,255,0.4);padding:7px 12px;border-radius:50px;text-decoration:none}

.m-content{position:relative;z-index:30;margin-top:auto;padding:0 12px 20px}
.m-content-inner{background:rgba(5,5,5,.5);border:1px solid rgba(74,199,255,0.08);border-radius:14px;padding:16px}
.m-sec-num{font-family:'Space Mono',monospace;font-size:0.95rem;font-weight:400;letter-spacing:.1em;color:rgba(255,255,255,0.35);margin-bottom:4px}
.m-sec-label{font-family:'Space Grotesk',sans-serif;font-size:0.95rem;font-weight:500;letter-spacing:.24em;text-transform:uppercase;color:#4AC7FF;margin-bottom:8px;display:flex;align-items:center;gap:8px}
.m-sec-label-line{width:16px;height:1px;background:rgba(74,199,255,0.35)}
.m-sec-title{font-family:'Space Grotesk',sans-serif;font-size:clamp(1.5rem,5vw,2rem);font-weight:300;line-height:1.1;color:#F5F7FA;margin-bottom:6px;text-transform:uppercase;letter-spacing:-0.02em}
.m-sec-body{font-family:'Inter',sans-serif;font-size:0.95rem;color:#A7AFBB;line-height:1.7;margin-bottom:6px}
.m-sec-note{font-family:'Space Grotesk',sans-serif;font-size:0.95rem;font-weight:400;color:rgba(74,199,255,0.75);letter-spacing:.08em;padding-top:6px;border-top:1px solid rgba(74,199,255,0.1);line-height:1.5}
.m-sec-ctas{display:flex;gap:6px;margin-top:8px;flex-wrap:wrap}
.m-sec-ctas .btn-p{font-size:0.95rem;padding:8px 14px}
.m-sec-ctas .btn-g{font-size:0.95rem;padding:8px 14px}

/* ── Mobile grids ── */
.m-env-tags{display:flex;flex-wrap:wrap;gap:5px;margin-top:8px}
.m-env-tag{display:flex;align-items:center;gap:4px;background:rgba(74,199,255,0.05);border:1px solid rgba(74,199,255,0.1);border-radius:14px;padding:4px 10px}
.m-env-tag-icon{font-size:0.95rem}
.m-env-tag-label{font-family:'Space Grotesk',sans-serif;font-size:0.95rem;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:rgba(255,255,255,0.7)}

.m-app-pillars{display:flex;flex-direction:column;gap:6px;margin-top:8px;max-height:220px;overflow-y:auto}
.m-app-pillar{background:rgba(10,15,20,0.8);border:1px solid rgba(74,199,255,0.08);border-radius:8px;padding:10px 12px}
.m-app-pillar-header{display:flex;align-items:center;gap:6px;margin-bottom:4px}
.m-app-pillar-icon{font-size:0.95rem}
.m-app-pillar-title{font-family:'Space Grotesk',sans-serif;font-size:0.95rem;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:#F5F7FA}
.m-app-pillar-body{font-family:'Inter',sans-serif;font-size:0.95rem;color:rgba(167,175,187,0.88);line-height:1.4;margin-bottom:6px}
.m-app-pillar-caps{display:flex;flex-wrap:wrap;gap:3px}
.m-app-pillar-cap{font-family:'Space Grotesk',sans-serif;font-size:0.42rem;font-weight:500;letter-spacing:.08em;text-transform:uppercase;color:rgba(74,199,255,0.7);background:rgba(10,15,20,0.82);border:1px solid rgba(74,199,255,0.06);border-radius:10px;padding:2px 6px}

.m-payload-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:6px;margin-top:8px}
.m-payload-card{background:rgba(10,15,20,0.82);border:1px solid rgba(74,199,255,0.1);border-radius:8px;padding:10px 8px;text-align:center}
.m-payload-icon{font-size:1rem;margin-bottom:4px}
.m-payload-title{font-family:'Space Grotesk',sans-serif;font-size:0.95rem;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:#4AC7FF;margin-bottom:4px}
.m-payload-desc{font-family:'Inter',sans-serif;font-size:0.95rem;color:rgba(167,175,187,0.88);line-height:1.4}

.m-coverage-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:6px;margin-top:8px}
.m-coverage-card{background:rgba(10,15,20,0.82);border:1px solid rgba(74,199,255,0.1);border-radius:8px;padding:10px 8px;text-align:center}
.m-coverage-val{font-family:'Space Mono',monospace;font-size:1rem;font-weight:700;color:#4AC7FF;margin-bottom:4px}
.m-coverage-desc{font-family:'Inter',sans-serif;font-size:0.95rem;color:rgba(167,175,187,0.88);line-height:1.4}

.m-scenario-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:6px;margin-top:8px}
.m-scenario-tile{background:rgba(10,15,20,0.82);border:1px solid rgba(74,199,255,0.1);border-radius:8px;padding:10px 8px;text-align:center}
.m-scenario-icon{font-size:0.95rem;margin-bottom:4px}
.m-scenario-title{font-family:'Space Grotesk',sans-serif;font-size:0.95rem;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:#F5F7FA;margin-bottom:4px}
.m-scenario-desc{font-family:'Inter',sans-serif;font-size:0.95rem;color:rgba(167,175,187,0.88);line-height:1.4}

.m-sector-grid{display:flex;flex-wrap:wrap;gap:5px;margin-top:8px;justify-content:center}
.m-sector-label{font-family:'Space Grotesk',sans-serif;font-size:0.95rem;font-weight:600;letter-spacing:.14em;text-transform:uppercase;padding:6px 14px;border-radius:20px;border:1px solid rgba(74,199,255,0.1);background:rgba(10,15,20,0.82);color:rgba(255,255,255,0.4)}
.m-sector-label.glow{color:#4AC7FF;border-color:rgba(74,199,255,0.25)}

/* ── Mobile outro ── */
.m-outro-content{position:relative;z-index:30;display:flex;flex-direction:column;align-items:center;justify-content:center;flex:1;padding:60px 20px 36px;text-align:center}
.m-outro-logo{display:flex;align-items:center;margin-bottom:14px}
.m-outro-logo-img{height:28px;width:auto;object-fit:contain}
.m-outro-title{font-family:'Space Grotesk',sans-serif;font-size:clamp(1.5rem,6vw,2.2rem);font-weight:300;line-height:1.1;color:#F5F7FA;margin-bottom:10px;text-transform:uppercase;letter-spacing:-0.02em}
.m-outro-title .oc{color:#4AC7FF}
.m-outro-sub{font-family:'Inter',sans-serif;font-size:0.95rem;color:#A7AFBB;line-height:1.7;max-width:280px;margin-bottom:22px}
.m-outro-ctas{display:flex;flex-direction:column;gap:8px;width:100%;max-width:260px;margin-bottom:20px}
.m-outro-ctas .btn-p,.m-outro-ctas .btn-g{width:100%;text-align:center;padding:12px 20px;font-size:0.95rem}
.m-outro-footer{margin-top:auto;font-family:'Inter',sans-serif;font-size:0.7rem;color:rgba(167,175,187,0.75);text-align:center;line-height:1.6;letter-spacing:.04em}
.m-outro-footer-tag{font-family:'Space Grotesk',sans-serif;font-size:0.42rem;font-weight:500;letter-spacing:.16em;text-transform:uppercase;color:rgba(74,199,255,0.45);margin-top:8px}

`

/* ═══════════════════════════════════════════════════════════════════
   TYPES
═══════════════════════════════════════════════════════════════════ */
type AppPillar = { num: string; title: string; heading: string; body: string; capabilities: string[]; icon: string }
type PayloadItem = { title: string; desc: string; icon: string }
type CoverageStat = { val: string; desc: string }
type ScenarioItem = { title: string; desc: string; icon: string }
type SectorItem = { name: string; glow: boolean }
type EnvItem = { label: string; icon: string }

/* ═══════════════════════════════════════════════════════════════════
   PAGE COMPONENT
═══════════════════════════════════════════════════════════════════ */
export default function ApplicationsPage() {
  const [isMobile, setIsMobile] = useState(false)
  const [activeStory, setActiveStory] = useState(0)
  const totalStories = SECTIONS.length + 1

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const goNext = useCallback(() => {
    setActiveStory(prev => Math.min(totalStories - 1, prev + 1))
  }, [totalStories])

  const goPrev = useCallback(() => {
    setActiveStory(prev => Math.max(0, prev - 1))
  }, [])

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
          ctrLabelRef.current.textContent = SECTIONS[n]?.label ?? 'Applications'
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
              <div className="m-content">
                <div className="m-content-inner">
                  <div className="m-sec-num">— {s.num}</div>
                  <div className="m-sec-label"><span className="m-sec-label-line" />{s.eyebrow}</div>
                  <div className="m-sec-title">{s.title.split('\n').map((l, li) => <span key={li}>{l}<br /></span>)}</div>
                  {s.body && <div className="m-sec-body">{s.body}</div>}
                  {s.note && <div className="m-sec-note">{s.note}</div>}
                  {/* Mobile environments */}
                  {'environments' in s && (
                    <div className="m-env-tags">
                      {(s.environments as EnvItem[]).map((e, ei) => (
                        <div key={ei} className="m-env-tag">
                          <span className="m-env-tag-icon">{e.icon}</span>
                          <span className="m-env-tag-label">{e.label}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {/* Mobile application pillars */}
                  {'applications' in s && (
                    <div className="m-app-pillars">
                      {(s.applications as AppPillar[]).map((a, ai) => (
                        <div key={ai} className="m-app-pillar">
                          <div className="m-app-pillar-header">
                            <span className="m-app-pillar-icon"><SvgIcon name={a.icon} /></span>
                            <span className="m-app-pillar-title">{a.title}</span>
                          </div>
                          <div className="m-app-pillar-body">{a.body}</div>
                          <div className="m-app-pillar-caps">
                            {a.capabilities.map((c, ci) => (
                              <span key={ci} className="m-app-pillar-cap">{c}</span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  {/* Mobile payloads */}
                  {'payloads' in s && (
                    <div className="m-payload-grid">
                      {(s.payloads as PayloadItem[]).map((p, pi) => (
                        <div key={pi} className="m-payload-card">
                          <div className="m-payload-icon"><SvgIcon name={p.icon} /></div>
                          <div className="m-payload-title">{p.title}</div>
                          <div className="m-payload-desc">{p.desc}</div>
                        </div>
                      ))}
                    </div>
                  )}
                  {/* Mobile coverage */}
                  {'coverageStats' in s && (
                    <div className="m-coverage-grid">
                      {(s.coverageStats as CoverageStat[]).map((c, ci) => (
                        <div key={ci} className="m-coverage-card">
                          <div className="m-coverage-val">{c.val}</div>
                          <div className="m-coverage-desc">{c.desc}</div>
                        </div>
                      ))}
                    </div>
                  )}
                  {/* Mobile scenarios */}
                  {'scenarios' in s && (
                    <div className="m-scenario-grid">
                      {(s.scenarios as ScenarioItem[]).map((sc, si) => (
                        <div key={si} className="m-scenario-tile">
                          <div className="m-scenario-icon">{sc.icon}</div>
                          <div className="m-scenario-title">{sc.title}</div>
                          <div className="m-scenario-desc">{sc.desc}</div>
                        </div>
                      ))}
                    </div>
                  )}
                  {/* Mobile sectors */}
                  {'sectors' in s && (
                    <div className="m-sector-grid">
                      {(s.sectors as SectorItem[]).map((sec, si) => (
                        <span key={si} className={`m-sector-label${sec.glow ? ' glow' : ''}`}>{sec.name}</span>
                      ))}
                    </div>
                  )}
                  {s.cta && s.cta.length > 0 && (
                    <div className="m-sec-ctas">
                      {s.cta.map((c, ci) => (
                        <a key={ci} href={c.href || 'tel:+919486675847'} className={c.style === 'primary' ? 'btn-p' : 'btn-g'}>{c.label}</a>
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
              <div className="m-header-logo"><img src="/SFT-logo-1.png" alt="SFT" className="m-header-logo-img" /></div>
              <a href="/" className="m-header-cta">Home</a>
            </div>
            <div className="m-outro-content">
              <div className="m-outro-logo"><img src="/SFT-logo-1.png" alt="SFT" className="m-outro-logo-img" /></div>
              <h2 className="m-outro-title">
                Deploy When<br />And Where<br /><span className="oc">It Matters.</span>
              </h2>
              <p className="m-outro-sub">
                Aerial infrastructure for disaster response, monitoring, and mission-critical communication.
              </p>
              <div className="m-outro-ctas">
                <a href="tel:+919486675847" className="btn-p">Request Pilot Deployment</a>
                <a href="mailto:info@susanfuturetechnologies.com" className="btn-g">Contact Our Team</a>
              </div>
              <div className="m-outro-footer">
                Susan Future Technologies Pvt. Ltd.<br />
                IIT Madras Research Park, Chennai
                <div className="m-outro-footer-tag">
                  Applications · Disaster Response · Defence · Telecom · Monitoring
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
        <div ref={bgLayerARef} className="bg-inner-a"
          style={{ backgroundImage: `url(/sft/applications/hero.png)`, backgroundSize: 'cover', backgroundPosition: 'center center', opacity: 1 }} />
        <div ref={bgLayerBRef} className="bg-inner-b"
          style={{ backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0 }} />
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
          <div key={i} className="particle"
            style={{ left: `${Math.random() * 100}%`, animationDuration: `${8 + Math.random() * 12}s`, animationDelay: `${Math.random() * 8}s` }} />
        ))}
      </div>

      <div id="sd" />

      {/* Intro panel */}
      <div ref={introRef} className="intro-panel">
        <div className="i-eye">
          <span className="i-eye-line" />
          SUSAN FUTURE TECHNOLOGIES
          <span className="i-eye-line" />
        </div>
        <h1 className="i-title">
          <span className="gc">Applications</span>
        </h1>
        <p className="i-sub">
          Deployable aerial infrastructure for real-world environments — communication, visibility, and control where conventional systems cannot operate.
        </p>
        <div className="i-ctas">
          <a href="/hawke" className="btn-p">Explore HAWKE</a>
          <a href="tel:+919486675847" className="btn-g">Request Pilot Deployment</a>
        </div>
        <div className="i-scroll">
          <span className="i-dot" />Scroll to explore
        </div>
      </div>

      {/* Nav */}
      <nav className="s-nav">
        <a href="/" className="s-logo" style={{textDecoration:"none"}}>
          <img src="/SFT-logo-1.png" alt="Susan Future Technologies" className="s-logo-img" />
        </div>
        <div className="s-section">
          <span ref={ctrRef} className="s-sec-num">01 / 08</span>
          <span className="s-sep" />
          <span ref={ctrLabelRef} className="s-sec-label">Applications</span>
        </div>
        <div className="s-nav-right">
          <a href="/" className="s-nav-link">Home</a>
          <a href="/about" className="s-nav-link">About</a>
          <a href="/hawke" className="s-nav-link">HAWKE</a>
          <a href="/mobius" className="s-nav-link">MOBIUS</a>
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

      {/* Section content panels */}
      {SECTIONS.map((s, i) => {
        const hasEnvs = 'environments' in s
        const hasApps = 'applications' in s
        const hasPayloads = 'payloads' in s
        const hasCoverage = 'coverageStats' in s
        const hasScenarios = 'scenarios' in s
        const hasSectors = 'sectors' in s
        return (
        <div key={i} ref={el => { panelRefs.current[i] = el }}
          className={`s-panel pos-${s.pos}`}>
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
          {/* Environment tags */}
          {hasEnvs && (
            <div className="env-tags">
              {(s.environments as EnvItem[]).map((e, ei) => (
                <div key={ei} className="env-tag">
                  <span className="env-tag-icon">{e.icon}</span>
                  <span className="env-tag-label">{e.label}</span>
                </div>
              ))}
            </div>
          )}
          {/* Application pillars */}
          {hasApps && (
            <div className="app-pillars">
              {(s.applications as AppPillar[]).map((a, ai) => (
                <div key={ai} className="app-pillar">
                  <div className="app-pillar-header">
                    <span className="app-pillar-icon"><SvgIcon name={a.icon} /></span>
                    <span className="app-pillar-num">{a.num}</span>
                    <span className="app-pillar-title">{a.title}</span>
                  </div>
                  <div className="app-pillar-heading">{a.heading}</div>
                  <div className="app-pillar-body">{a.body}</div>
                  <div className="app-pillar-caps">
                    {a.capabilities.map((c, ci) => (
                      <span key={ci} className="app-pillar-cap">{c}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
          {/* Payload modules */}
          {hasPayloads && (
            <div className="payload-grid">
              {(s.payloads as PayloadItem[]).map((p, pi) => (
                <div key={pi} className="payload-card">
                  <div className="payload-icon"><SvgIcon name={p.icon} /></div>
                  <div className="payload-title">{p.title}</div>
                  <div className="payload-desc">{p.desc}</div>
                </div>
              ))}
            </div>
          )}
          {/* Coverage stats */}
          {hasCoverage && (
            <div className="coverage-grid">
              {(s.coverageStats as CoverageStat[]).map((c, ci) => (
                <div key={ci} className="coverage-card">
                  <div className="coverage-val">{c.val}</div>
                  <div className="coverage-desc">{c.desc}</div>
                </div>
              ))}
            </div>
          )}
          {/* Scenario tiles */}
          {hasScenarios && (
            <div className="scenario-grid">
              {(s.scenarios as ScenarioItem[]).map((sc, si) => (
                <div key={si} className="scenario-tile">
                  <div className="scenario-icon">{sc.icon}</div>
                  <div className="scenario-title">{sc.title}</div>
                  <div className="scenario-desc">{sc.desc}</div>
                </div>
              ))}
            </div>
          )}
          {/* Sector labels */}
          {hasSectors && (
            <div className="sector-grid">
              {(s.sectors as SectorItem[]).map((sec, si) => (
                <span key={si} className={`sector-label${sec.glow ? ' glow' : ''}`}>{sec.name}</span>
              ))}
            </div>
          )}
          {s.cta && s.cta.length > 0 && (
            <div className="p-ctas">
              {s.cta.map((c, ci) => (
                <a key={ci} href={c.href || 'tel:+919486675847'} className={c.style === 'primary' ? 'btn-p' : 'btn-g'}>{c.label}</a>
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
          DEPLOY NOW
          <span className="o-eyebrow-line" />
        </div>
        <h2 className="o-title">
          Deploy When<br />And Where<br /><span className="oc">It Matters.</span>
        </h2>
        <p className="o-sub">
          Aerial infrastructure for disaster response, monitoring, defence, and mission-critical communication at scale.
        </p>
        <div className="o-cta-row">
          <a href="tel:+919486675847" className="btn-p">Request Pilot Deployment</a>
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
            <a href="mailto:info@susanfuturetechnologies.com" className="o-footer-link">Contact</a>
          </div>
          <div className="o-footer-info">
            Susan Future Technologies Pvt. Ltd.<br />
            IIT Madras Research Park, Chennai
          </div>
          <div className="o-footer-tagline">
            <span className="o-footer-dot" />
            Disaster Response
            <span className="o-footer-dot" />
            Defence
            <span className="o-footer-dot" />
            Telecom
            <span className="o-footer-dot" />
            Monitoring
            <span className="o-footer-dot" />
          </div>
        </div>
      </div>
    </>
  )
}
