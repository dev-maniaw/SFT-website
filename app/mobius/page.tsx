'use client'
import { useEffect, useRef, useState, useCallback } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const SECTIONS = [
  {
    num: '01', label: 'Hero',
    title: 'MOBIUS',
    body: 'A reusable high-altitude platform system designed to extend connectivity, sensing, and operational reach beyond conventional systems.',
    note: 'Persistent, Scalable Aerial Infrastructure',
    chips: [],
    pos: 'center' as const, bgPos: 'center center',
    img: '/sft/mobius/hero-new.jpg',
    overlay: 'radial-gradient(ellipse at center, rgba(5,5,5,0.84) 0%, rgba(5,5,5,0.62) 40%, rgba(5,5,5,0.25) 65%, transparent 100%)',
    eyebrow: 'HIGH-ALTITUDE PLATFORM SYSTEM',
    cta: [{ label: 'Request a Pilot', style: 'primary', href: 'tel:+919486675847' }, { label: 'Contact Us', style: 'ghost', href: 'mailto:info@susanfuturetechnologies.com' }],
  },
  {
    num: '02', label: 'Metrics',
    title: 'KEY\nCAPABILITIES',
    body: '',
    note: '',
    chips: [
      { val: 'HIGH ALT.', lbl: 'Stratosphere' },
      { val: 'WEEKS+', lbl: 'Endurance' },
      { val: 'MODULAR', lbl: 'Payload' },
      { val: 'WIDE', lbl: 'Coverage' },
    ],
    pos: 'center' as const, bgPos: 'center center',
    img: '/sft/mobius/metrics.png',
    overlay: 'radial-gradient(ellipse at center, rgba(5,5,5,0.84) 0%, rgba(5,5,5,0.62) 40%, rgba(5,5,5,0.25) 65%, transparent 100%)',
    eyebrow: 'CAPABILITY BAND',
    cta: [],
  },
  {
    num: '03', label: 'Platform',
    title: 'A NEW LAYER\nOF AERIAL\nINFRASTRUCTURE',
    body: 'MOBIUS is not an aircraft. It is an infrastructure platform — a reusable, station-keeping system that operates in the stratosphere to provide persistent coverage, sensing, and relay capabilities.',
    note: '',
    chips: [],
    pos: 'right' as const, bgPos: 'left center',
    img: '/sft/mobius/overview.png',
    overlay: 'linear-gradient(270deg, rgba(5,5,5,0.94) 0%, rgba(5,5,5,0.82) 38%, rgba(5,5,5,0.3) 65%, transparent 100%)',
    eyebrow: 'PLATFORM OVERVIEW',
    cta: [],
  },
  {
    num: '04', label: 'Problem',
    title: 'WHY IT\nMATTERS',
    body: 'Ground infrastructure is terrain-limited and expensive to scale. Drones are short-endurance and low-altitude. Satellites are distant, latency-bound, and costly to deploy. MOBIUS operates in the gap.',
    note: '',
    chips: [],
    pos: 'left' as const, bgPos: 'right center',
    img: '/sft/mobius/why.png',
    overlay: 'linear-gradient(90deg, rgba(5,5,5,0.94) 0%, rgba(5,5,5,0.82) 38%, rgba(5,5,5,0.3) 65%, transparent 100%)',
    eyebrow: 'PROBLEM FRAMING',
    cta: [],
  },
  {
    num: '05', label: 'Architecture',
    title: 'PLATFORM\nARCHITECTURE',
    body: 'Five integrated systems working in concert — lighter-than-air structure, autonomous flight control, modular payload bay, energy management, and ground operations.',
    note: 'LTA Structure · Autonomous Control · Payload Bay · Energy · Ground Ops',
    chips: [],
    pos: 'right' as const, bgPos: 'left center',
    img: '/sft/mobius/architecture.png',
    overlay: 'linear-gradient(270deg, rgba(5,5,5,0.94) 0%, rgba(5,5,5,0.82) 38%, rgba(5,5,5,0.3) 65%, transparent 100%)',
    eyebrow: 'CORE SYSTEMS',
    cta: [],
  },
  {
    num: '06', label: 'Capabilities',
    title: 'WHAT MOBIUS\nDELIVERS',
    body: '',
    note: '',
    chips: [
      { val: '∞', lbl: 'Persistence' },
      { val: '⬆', lbl: 'Scalability' },
      { val: '🔄', lbl: 'Adaptability' },
      { val: '📡', lbl: 'Coverage' },
    ],
    pos: 'center' as const, bgPos: 'center center',
    img: '/sft/mobius/capabilities.png',
    overlay: 'radial-gradient(ellipse at center, rgba(5,5,5,0.84) 0%, rgba(5,5,5,0.62) 40%, rgba(5,5,5,0.25) 65%, transparent 100%)',
    eyebrow: 'CAPABILITY SECTIONS',
    cta: [],
  },
  {
    num: '07', label: 'Applications',
    title: 'MISSION\nAPPLICATIONS',
    body: 'From telecom backhaul to defence surveillance, environmental monitoring to disaster response — MOBIUS adapts to the mission.',
    note: '',
    chips: [
      { val: '📶', lbl: 'Telecom' },
      { val: '🛡', lbl: 'Defence' },
      { val: '🌍', lbl: 'Environment' },
      { val: '🔥', lbl: 'Disaster' },
    ],
    pos: 'left' as const, bgPos: 'right center',
    img: '/sft/mobius/applications.png',
    overlay: 'linear-gradient(90deg, rgba(5,5,5,0.94) 0%, rgba(5,5,5,0.82) 38%, rgba(5,5,5,0.3) 65%, transparent 100%)',
    eyebrow: 'USE CASES',
    cta: [],
  },
  {
    num: '08', label: 'Roadmap',
    title: 'DEVELOPMENT\nROADMAP',
    body: 'MOBIUS is under active development, progressing through three phases: subsystem validation, integrated flight testing, and operational deployment.',
    note: 'Phase 1: Subsystem → Phase 2: Integration → Phase 3: Operations',
    chips: [],
    pos: 'center' as const, bgPos: 'center center',
    img: '/sft/mobius/roadmap.png',
    overlay: 'radial-gradient(ellipse at center, rgba(5,5,5,0.84) 0%, rgba(5,5,5,0.62) 40%, rgba(5,5,5,0.25) 65%, transparent 100%)',
    eyebrow: 'PROGRESS',
    cta: [],
  },
  {
    num: '09', label: 'Future',
    title: 'TOWARD A\nNEW\nCONNECTIVITY\nLAYER',
    body: 'A fleet of MOBIUS platforms forming a persistent network in the stratosphere — extending connectivity, intelligence, and coverage to every corner of the Earth.',
    note: '',
    chips: [],
    pos: 'right' as const, bgPos: 'left center',
    img: '/sft/mobius/future.png',
    overlay: 'linear-gradient(270deg, rgba(5,5,5,0.94) 0%, rgba(5,5,5,0.82) 38%, rgba(5,5,5,0.3) 65%, transparent 100%)',
    eyebrow: 'FUTURE VISION',
    cta: [],
  }
]

const N = SECTIONS.length

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Space+Grotesk:wght@300;400;500;600;700&family=Space+Mono:wght@400;700&display=swap');
*{margin:0;padding:0;box-sizing:border-box}
html{scroll-behavior:auto}
body{background:#050505;color:#F5F7FA;overflow-x:hidden;font-family:'Inter',sans-serif}
::selection{background:rgba(74,199,255,0.25);color:#fff}
.bg-layer{position:fixed;inset:-5%;z-index:1;width:110%;height:110%;background-size:cover;background-position:center;will-change:transform,opacity;transition:opacity 1.2s cubic-bezier(.16,1,.3,1)}
.bg-overlay{position:fixed;inset:0;z-index:1;transition:opacity 1.2s cubic-bezier(.16,1,.3,1)}
.vignette{position:fixed;inset:0;z-index:2;pointer-events:none;background:radial-gradient(ellipse at center,transparent 50%,rgba(5,5,5,0.5) 100%)}
.scanlines{position:fixed;inset:0;z-index:3;pointer-events:none;background:repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(74,199,255,0.008) 2px,rgba(74,199,255,0.008) 4px)}
.s-nav{position:fixed;top:0;left:0;right:0;z-index:100;display:flex;align-items:center;justify-content:space-between;padding:0 48px;height:70px;background:rgba(5,5,5,0.78);border-bottom:1px solid rgba(74,199,255,0.08)}
.s-logo{display:flex;align-items:center}
.s-logo-img{height:55px;width:auto;object-fit:contain;mix-blend-mode:screen}
.s-section{position:absolute;left:50%;transform:translateX(-50%);display:flex;align-items:center;gap:10px}
.s-sec-num{font-family:'Space Mono',monospace;font-size:0.95rem;font-weight:400;letter-spacing:.1em;color:rgba(255,255,255,0.45)}
.s-sec-label{font-family:'Space Grotesk',sans-serif;font-size:0.95rem;font-weight:500;letter-spacing:.28em;text-transform:uppercase;color:rgba(74,199,255,0.8);transition:opacity .4s}
.s-sep{width:1px;height:12px;background:rgba(255,255,255,0.08)}
.s-nav-right{display:flex;align-items:center;gap:18px}
.s-nav-link{font-family:'Space Grotesk',sans-serif;font-size:0.95rem;font-weight:500;letter-spacing:.18em;text-transform:uppercase;color:rgba(255,255,255,0.55);text-decoration:none;transition:color .2s}
.s-nav-link:hover{color:rgba(255,255,255,0.6)}
.s-cta-btn{font-family:'Space Grotesk',sans-serif;font-size:0.95rem;font-weight:600;letter-spacing:.18em;text-transform:uppercase;background:transparent;color:#4AC7FF;padding:7px 16px;border-radius:50px;text-decoration:none;border:1px solid rgba(74,199,255,0.4);transition:all .25s ease}
.s-cta-btn:hover{background:rgba(74,199,255,0.1);border-color:#4AC7FF;box-shadow:0 0 20px rgba(74,199,255,0.2)}
#prog{position:fixed;bottom:0;left:0;right:0;height:2px;z-index:200;background:rgba(255,255,255,0.04)}
#prog-fill{height:100%;background:linear-gradient(90deg,#4AC7FF,#2a9fd4);width:0%;transition:width .12s linear;border-radius:1px}
#dots{position:fixed;right:30px;top:50%;transform:translateY(-50%);z-index:100;display:flex;flex-direction:column;gap:10px}
.dot{width:4px;height:4px;border-radius:50%;background:rgba(255,255,255,0.15);transition:all .35s cubic-bezier(.16,1,.3,1);cursor:default}
.dot.act{background:#4AC7FF;transform:scale(1.7);box-shadow:0 0 8px rgba(74,199,255,0.5)}
.s-panel{position:fixed;top:0;height:100vh;z-index:10;display:flex;flex-direction:column;justify-content:center;pointer-events:none;opacity:0;transform:translateY(18px);transition:opacity 1.0s cubic-bezier(.16,1,.3,1), transform 1.0s cubic-bezier(.16,1,.3,1)}
.s-panel.vis{opacity:1;transform:translateY(0)}
.s-panel.pos-left{left:0;width:42%;padding:0 56px 0 64px}
.s-panel.pos-right{right:0;width:42%;padding:0 64px 0 56px;align-items:flex-end;text-align:right}
.s-panel.pos-center{left:0;right:0;width:100%;padding:0 80px;align-items:center;text-align:center}
.p-eyebrow{font-family:'Space Grotesk',sans-serif;font-size:0.95rem;font-weight:500;letter-spacing:.28em;text-transform:uppercase;color:#4AC7FF;margin-bottom:18px;display:flex;align-items:center;gap:10px}
.p-eyebrow-line{width:22px;height:1px;background:rgba(74,199,255,0.35);flex-shrink:0}
.pos-right .p-eyebrow{flex-direction:row-reverse}
.pos-center .p-eyebrow{justify-content:center}
.p-num{font-family:'Space Mono',monospace;font-size:0.95rem;font-weight:400;letter-spacing:.1em;color:rgba(255,255,255,0.35);margin-bottom:8px}
.p-title{font-family:'Space Grotesk',sans-serif;font-size:clamp(2.8rem,4.5vw,5rem);font-weight:300;line-height:1.08;letter-spacing:-0.03em;color:#F5F7FA;white-space:pre-line;margin-bottom:20px;text-transform:uppercase;text-shadow:0 4px 32px rgba(0,0,0,0.6)}
.p-body{font-family:'Inter',sans-serif;font-size:0.95rem;color:#A7AFBB;line-height:1.82;max-width:420px;font-weight:400;margin-bottom:18px;white-space:pre-line}
.pos-right .p-body,.pos-right .p-note{margin-left:auto}
.pos-center .p-body{max-width:500px}
.p-note{font-family:'Space Grotesk',sans-serif;font-size:0.95rem;font-weight:400;color:rgba(74,199,255,0.85);letter-spacing:.1em;padding-top:12px;border-top:1px solid rgba(74,199,255,0.12);max-width:420px;line-height:1.6}
.pos-right .p-note{margin-left:auto}
.pos-center .p-note{max-width:none}
.p-chips{display:flex;flex-wrap:wrap;gap:8px;margin-top:16px;max-width:460px}
.pos-right .p-chips{margin-left:auto;justify-content:flex-end}
.pos-center .p-chips{max-width:none;justify-content:center}
.p-chip{display:flex;align-items:center;gap:7px;background:rgba(10,15,20,0.82);border:1px solid rgba(74,199,255,0.12);border-radius:20px;padding:7px 16px;transition:all .3s ease}
.p-chip:hover{background:rgba(74,199,255,0.14);border-color:rgba(74,199,255,0.3);transform:translateY(-1px)}
.p-chip-val{font-family:'Space Mono',monospace;font-size:0.95rem;font-weight:700;color:#F5F7FA;line-height:1;letter-spacing:-0.02em}
.p-chip-lbl{font-family:'Space Grotesk',sans-serif;font-size:0.95rem;font-weight:500;letter-spacing:.2em;text-transform:uppercase;color:#4AC7FF}
.p-ctas{display:flex;flex-wrap:wrap;gap:10px;margin-top:20px}
.pos-center .p-ctas{justify-content:center}
.pos-right .p-ctas{justify-content:flex-end}
.btn-p{background:transparent;color:#4AC7FF;font-family:'Space Grotesk',sans-serif;font-size:0.95rem;font-weight:600;letter-spacing:.18em;text-transform:uppercase;padding:11px 28px;border-radius:50px;text-decoration:none;display:inline-block;border:1px solid rgba(74,199,255,0.5);transition:all .25s ease;pointer-events:auto;cursor:pointer;position:relative;overflow:hidden}
.btn-p:hover{background:rgba(74,199,255,0.1);border-color:#4AC7FF;box-shadow:0 0 24px rgba(74,199,255,0.25);transform:translateY(-1px)}
.btn-g{color:rgba(255,255,255,0.7);font-family:'Space Grotesk',sans-serif;font-size:0.95rem;font-weight:400;letter-spacing:.18em;text-transform:uppercase;padding:11px 28px;border-radius:50px;border:1px solid rgba(255,255,255,0.12);text-decoration:none;display:inline-block;transition:all .25s ease;pointer-events:auto;cursor:pointer}
.btn-g:hover{color:#fff;border-color:rgba(74,199,255,0.4);background:rgba(10,15,20,0.82);box-shadow:0 0 16px rgba(74,199,255,0.12)}
.intro-panel{position:fixed;top:0;left:0;right:0;height:100vh;display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;padding:80px;z-index:10;pointer-events:none;opacity:0;transform:translateY(18px);transition:opacity 1.0s cubic-bezier(.16,1,.3,1), transform 1.0s cubic-bezier(.16,1,.3,1);background:radial-gradient(ellipse at center,rgba(5,5,5,.86) 0%,rgba(5,5,5,.68) 45%,rgba(5,5,5,.3) 70%,transparent 100%)}
.intro-panel.vis{opacity:1;transform:translateY(0);pointer-events:auto}
.i-eye{font-family:'Space Grotesk',sans-serif;font-size:1rem;font-weight:500;letter-spacing:.28em;text-transform:uppercase;color:#4AC7FF;margin-bottom:22px;display:flex;align-items:center;justify-content:center;gap:12px}
.i-eye-line{width:24px;height:1px;background:rgba(74,199,255,0.35)}
.i-title{font-family:'Space Grotesk',sans-serif;font-size:clamp(3.2rem,6vw,6.5rem);font-weight:300;line-height:1.05;letter-spacing:-0.03em;text-transform:uppercase;color:#F5F7FA;margin-bottom:24px;text-shadow:0 4px 40px rgba(0,0,0,0.5)}
.i-title .gc{color:#4AC7FF}
.i-sub{font-family:'Inter',sans-serif;font-size:1.05rem;color:#A7AFBB;line-height:1.82;max-width:480px;margin-bottom:42px;text-align:center}
.i-ctas{display:flex;gap:12px;margin-bottom:48px}
.i-scroll{display:flex;align-items:center;gap:10px;font-size:1rem;font-family:'Space Grotesk',sans-serif;letter-spacing:.2em;text-transform:uppercase;color:rgba(255,255,255,0.2);justify-content:center}
.i-dot{width:5px;height:5px;border-radius:50%;background:#4AC7FF;animation:pulse 2.2s ease infinite}
@keyframes pulse{0%,100%{opacity:.2;transform:scale(1)}50%{opacity:1;transform:scale(1.3)}}
.signal-rings{position:fixed;top:50%;left:50%;z-index:4;pointer-events:none;transform:translate(-50%,-50%)}
.signal-ring{position:absolute;top:50%;left:50%;border:1px solid rgba(74,199,255,0.08);border-radius:50%;transform:translate(-50%,-50%);animation:ringPulse 4s ease-out infinite}
.signal-ring:nth-child(1){width:200px;height:200px;animation-delay:0s}
.signal-ring:nth-child(2){width:400px;height:400px;animation-delay:0.8s}
.signal-ring:nth-child(3){width:600px;height:600px;animation-delay:1.6s}
.signal-ring:nth-child(4){width:800px;height:800px;animation-delay:2.4s}
@keyframes ringPulse{0%{opacity:0;transform:translate(-50%,-50%) scale(0.8)}30%{opacity:1}100%{opacity:0;transform:translate(-50%,-50%) scale(1.4)}}
.particles{position:fixed;inset:0;z-index:3;pointer-events:none;overflow:hidden}
.particle{position:absolute;width:2px;height:2px;border-radius:50%;background:rgba(74,199,255,0.25);animation:drift linear infinite}
@keyframes drift{0%{transform:translateY(100vh) translateX(0);opacity:0}10%{opacity:1}90%{opacity:1}100%{transform:translateY(-10vh) translateX(40px);opacity:0}}
.outro-panel{position:fixed;inset:0;z-index:20;pointer-events:none;opacity:0;transform:translateY(100%);transition:opacity .8s cubic-bezier(.16,1,.3,1), transform .8s cubic-bezier(.16,1,.3,1);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:0;background:linear-gradient(180deg, rgba(5,5,5,.94) 0%, rgba(8,17,31,.98) 100%);padding:48px}
.outro-panel.vis{opacity:1;transform:translateY(0);pointer-events:auto}
.o-logo{font-family:'Space Grotesk',sans-serif;font-size:1rem;font-weight:600;letter-spacing:.08em;color:#F5F7FA;text-transform:uppercase;display:flex;align-items:center;gap:6px;margin-bottom:18px}
.o-logo-img{height:36px;width:auto;object-fit:contain;mix-blend-mode:screen}
.o-eyebrow{font-family:'Space Grotesk',sans-serif;font-size:1rem;font-weight:500;letter-spacing:.28em;text-transform:uppercase;color:rgba(74,199,255,0.7);display:flex;align-items:center;gap:12px;margin-bottom:16px}
.o-eyebrow-line{width:28px;height:1px;background:rgba(74,199,255,0.25)}
.o-title{font-family:'Space Grotesk',sans-serif;font-size:clamp(2.8rem,5vw,4.5rem);font-weight:300;line-height:1.08;letter-spacing:-0.03em;text-transform:uppercase;color:#F5F7FA;text-align:center;margin-bottom:14px;text-shadow:0 4px 40px rgba(0,0,0,.5)}
.o-title .oc{color:#4AC7FF}
.o-sub{font-family:'Inter',sans-serif;font-size:1.05rem;color:#A7AFBB;line-height:1.82;text-align:center;max-width:440px;margin-bottom:32px}
.o-cta-row{display:flex;flex-wrap:wrap;gap:12px;justify-content:center;margin-bottom:36px}
.o-divider{width:120px;height:1px;background:linear-gradient(90deg,transparent,rgba(74,199,255,0.2),transparent);margin-bottom:28px}
.o-footer{display:flex;flex-direction:column;align-items:center;gap:16px;margin-top:12px}
.o-footer-nav{display:flex;gap:20px;flex-wrap:wrap;justify-content:center}
.o-footer-link{font-family:'Space Grotesk',sans-serif;font-size:0.95rem;font-weight:500;letter-spacing:.18em;text-transform:uppercase;color:rgba(255,255,255,0.5);text-decoration:none;transition:color .2s}
.o-footer-link:hover{color:rgba(74,199,255,0.85)}
.o-footer-info{font-family:'Inter',sans-serif;font-size:1rem;color:rgba(167,175,187,0.92);text-align:center;line-height:1.6}
.o-footer-tagline{font-family:'Space Grotesk',sans-serif;font-size:0.95rem;font-weight:500;letter-spacing:.2em;text-transform:uppercase;color:rgba(74,199,255,0.45);margin-top:8px;display:flex;align-items:center;gap:8px}
.o-footer-dot{width:3px;height:3px;border-radius:50%;background:rgba(74,199,255,0.4)}
#sd{height:900vh;position:relative;z-index:5;pointer-events:none}
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
.m-header{position:relative;z-index:50;display:flex;align-items:center;justify-content:space-between;padding:16px 16px 0}
.m-header-logo{display:flex;align-items:center;text-decoration:none}
.m-header-logo img{height:38px;width:auto;object-fit:contain;mix-blend-mode:screen}
.m-hamburger{background:none;border:none;cursor:pointer;padding:8px;display:flex;flex-direction:column;gap:5px;z-index:101}
.m-hamburger span{display:block;width:24px;height:2px;background:#F5F7FA;transition:transform 0.3s ease, opacity 0.3s ease}
.m-hamburger.open span:nth-child(1){transform:rotate(45deg) translate(5px,5px)}
.m-hamburger.open span:nth-child(2){opacity:0}
.m-hamburger.open span:nth-child(3){transform:rotate(-45deg) translate(5px,-5px)}
.m-mobile-overlay{position:fixed;top:0;left:0;right:0;bottom:0;z-index:100;background:rgba(5,5,5,0.96);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:28px;opacity:0;pointer-events:none;transition:opacity 0.3s ease}
.m-mobile-overlay.open{opacity:1;pointer-events:auto}
.m-mobile-overlay a{font-family:'Space Grotesk',sans-serif;font-size:1.3rem;font-weight:500;letter-spacing:.2em;text-transform:uppercase;color:rgba(255,255,255,0.8);text-decoration:none;transition:color 0.2s}
.m-mobile-overlay a:hover{color:#4AC7FF}
.m-content{position:relative;z-index:30;margin-top:auto;padding:0 12px 20px}
.m-content-inner{background:rgba(5,5,5,.5);border:1px solid rgba(74,199,255,0.08);border-radius:14px;padding:16px}
.m-sec-num{font-family:'Space Mono',monospace;font-size:0.95rem;font-weight:400;letter-spacing:.1em;color:rgba(255,255,255,0.35);margin-bottom:4px}
.m-sec-label{font-family:'Space Grotesk',sans-serif;font-size:0.95rem;font-weight:500;letter-spacing:.24em;text-transform:uppercase;color:#4AC7FF;margin-bottom:8px;display:flex;align-items:center;gap:8px}
.m-sec-label-line{width:16px;height:1px;background:rgba(74,199,255,0.35)}
.m-sec-title{font-family:'Space Grotesk',sans-serif;font-size:clamp(1.5rem,5vw,2rem);font-weight:300;line-height:1.1;color:#F5F7FA;margin-bottom:6px;text-transform:uppercase;letter-spacing:-0.02em}
.m-sec-body{font-family:'Inter',sans-serif;font-size:0.95rem;color:#A7AFBB;line-height:1.7;margin-bottom:6px}
.m-sec-note{font-family:'Space Grotesk',sans-serif;font-size:0.95rem;font-weight:400;color:rgba(74,199,255,0.75);letter-spacing:.08em;padding-top:6px;border-top:1px solid rgba(74,199,255,0.1);line-height:1.5}
.m-sec-chips{display:flex;flex-wrap:wrap;gap:5px;margin-top:6px}
.m-sec-chip{display:flex;align-items:center;gap:4px;background:rgba(10,15,20,0.82);border:1px solid rgba(74,199,255,0.1);border-radius:14px;padding:3px 8px}
.m-sec-chip-val{font-family:'Space Mono',monospace;font-size:0.95rem;font-weight:700;color:#F5F7FA;line-height:1}
.m-sec-chip-lbl{font-family:'Space Grotesk',sans-serif;font-size:0.42rem;font-weight:500;letter-spacing:.16em;text-transform:uppercase;color:#4AC7FF}
.m-sec-ctas{display:flex;gap:6px;margin-top:8px;flex-wrap:wrap}
.m-sec-ctas .btn-p{font-size:0.95rem;padding:8px 14px}
.m-sec-ctas .btn-g{font-size:0.95rem;padding:8px 14px}
.m-outro-content{position:relative;z-index:30;display:flex;flex-direction:column;align-items:center;justify-content:center;flex:1;padding:60px 20px 36px;text-align:center}
.m-outro-logo{display:flex;align-items:center;margin-bottom:14px}
.m-outro-logo img{height:42px;width:auto;object-fit:contain;mix-blend-mode:screen}
.m-outro-title{font-family:'Space Grotesk',sans-serif;font-size:clamp(1.5rem,6vw,2.2rem);font-weight:300;line-height:1.1;color:#F5F7FA;margin-bottom:10px;text-transform:uppercase;letter-spacing:-0.02em}
.m-outro-title .oc{color:#4AC7FF}
.m-outro-sub{font-family:'Inter',sans-serif;font-size:0.95rem;color:#A7AFBB;line-height:1.7;max-width:280px;margin-bottom:22px}
.m-outro-ctas{display:flex;flex-direction:column;gap:8px;width:100%;max-width:260px;margin-bottom:20px}
.m-outro-ctas .btn-p,.m-outro-ctas .btn-g{width:100%;text-align:center;padding:12px 20px;font-size:0.95rem}
.m-outro-footer{margin-top:auto;font-family:'Inter',sans-serif;font-size:0.7rem;color:rgba(167,175,187,0.75);text-align:center;line-height:1.6;letter-spacing:.04em}
.m-outro-footer-tag{font-family:'Space Grotesk',sans-serif;font-size:0.42rem;font-weight:500;letter-spacing:.16em;text-transform:uppercase;color:rgba(74,199,255,0.45);margin-top:8px}
.s-hamburger{display:none;background:none;border:none;cursor:pointer;padding:8px;flex-direction:column;gap:5px;z-index:101}
.s-hamburger span{display:block;width:24px;height:2px;background:#F5F7FA;transition:transform 0.3s ease, opacity 0.3s ease}
.s-hamburger.open span:nth-child(1){transform:rotate(45deg) translate(5px,5px)}
.s-hamburger.open span:nth-child(2){opacity:0}
.s-hamburger.open span:nth-child(3){transform:rotate(-45deg) translate(5px,-5px)}
.s-mobile-menu{display:none;position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(5,5,5,0.96);z-index:99;flex-direction:column;align-items:center;justify-content:center;gap:28px;opacity:0;pointer-events:none;transition:opacity 0.3s ease}
.s-mobile-menu.open{opacity:1;pointer-events:auto}
.s-mobile-menu a{font-family:'Space Grotesk',sans-serif;font-size:1.4rem;font-weight:500;letter-spacing:.2em;text-transform:uppercase;color:rgba(255,255,255,0.8);text-decoration:none;transition:color 0.2s}
.s-mobile-menu a:hover{color:#4AC7FF}
@media(max-width:768px){.s-nav{padding:0 16px;height:56px}.s-logo-img{height:38px}.s-section{display:none}.s-nav-right{display:none}.s-hamburger{display:flex}.s-mobile-menu{display:flex}.p-panel{padding:0 20px}.p-title{font-size:clamp(1.8rem,8vw,3rem)!important}.p-body,.p-note{font-size:0.9rem!important;max-width:100%!important}.p-chips{flex-wrap:wrap}.i-title{font-size:clamp(2rem,10vw,3.5rem)!important}.i-sub{font-size:0.9rem!important;max-width:90vw!important}#dots{right:8px;gap:6px}.dot{width:6px;height:6px}.o-footer{padding:40px 20px!important}.o-footer-grid{flex-direction:column!important;gap:24px!important}}
`

export default function MobiusPage() {
  const [isMobile, setIsMobile] = useState(false)
  const [activeStory, setActiveStory] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)
  const totalStories = N + 1
  useEffect(() => { const c = () => setIsMobile(window.innerWidth < 768); c(); window.addEventListener('resize', c); return () => window.removeEventListener('resize', c) }, [])
  const goNext = useCallback(() => setActiveStory(p => Math.min(p + 1, totalStories - 1)), [totalStories])
  const goPrev = useCallback(() => setActiveStory(p => Math.max(p - 1, 0)), [])
  const bgLayerARef = useRef<HTMLDivElement>(null), bgLayerBRef = useRef<HTMLDivElement>(null)
  const overlayARef = useRef<HTMLDivElement>(null), overlayBRef = useRef<HTMLDivElement>(null)
  const panelRefs = useRef<(HTMLDivElement | null)[]>([])
  const dotRefs = useRef<(HTMLDivElement | null)[]>([])
  const introRef = useRef<HTMLDivElement>(null), outroRef = useRef<HTMLDivElement>(null)
  const fillRef = useRef<HTMLDivElement>(null)
  const ctrRef = useRef<HTMLSpanElement>(null), ctrLabelRef = useRef<HTMLSpanElement>(null)
  const activeIdx = useRef(-1)

  useEffect(() => {
    if (isMobile) return
    let front = 'A' as 'A' | 'B'
    const onScroll = () => {
      const sd = document.getElementById('sd')
      if (!sd) return
      const rect = sd.getBoundingClientRect()
      const scrolled = -rect.top
      const total = sd.scrollHeight - window.innerHeight
      const pct = Math.max(0, Math.min(1, scrolled / total))
      if (fillRef.current) fillRef.current.style.width = `${pct * 100}%`
      const sF = Math.max(0, (pct - 0.03) / 0.90) * (N + 1.5)
      introRef.current?.classList.toggle('vis', sF < 0.72)
      outroRef.current?.classList.toggle('vis', sF >= N + 0.5)
      let newIdx = -1
      if (sF >= 0.75 && sF <= N + 0.5) newIdx = Math.min(N - 1, Math.floor(sF - 0.75))
      const fractional = sF - Math.floor(sF)
      const shift = (fractional - 0.5) * 4
      if (front === 'A' && bgLayerARef.current) bgLayerARef.current.style.transform = `translateY(${shift}%)`
      else if (front === 'B' && bgLayerBRef.current) bgLayerBRef.current.style.transform = `translateY(${shift}%)`
      if (newIdx === activeIdx.current) return
      activeIdx.current = newIdx
      panelRefs.current.forEach((p, i) => p?.classList.toggle('vis', i === newIdx))
      dotRefs.current.forEach((d, i) => d?.classList.toggle('act', i === newIdx))
      if (ctrRef.current) ctrRef.current.textContent = newIdx >= 0 ? SECTIONS[newIdx].num : '--'
      if (ctrLabelRef.current) ctrLabelRef.current.textContent = newIdx >= 0 ? SECTIONS[newIdx].label : ''
      if (newIdx >= 0) {
        const s = SECTIONS[newIdx]
        const next = front === 'A' ? 'B' : 'A'
        const nextBg = next === 'A' ? bgLayerARef.current : bgLayerBRef.current
        const nextOv = next === 'A' ? overlayARef.current : overlayBRef.current
        const prevBg = front === 'A' ? bgLayerARef.current : bgLayerBRef.current
        const prevOv = front === 'A' ? overlayARef.current : overlayBRef.current
        if (nextBg) { nextBg.style.backgroundImage = `url(${s.img})`; nextBg.style.backgroundPosition = s.bgPos; nextBg.style.opacity = '1' }
        if (nextOv) { nextOv.style.background = s.overlay; nextOv.style.opacity = '1' }
        if (prevBg) prevBg.style.opacity = '0'
        if (prevOv) prevOv.style.opacity = '0'
        front = next
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [isMobile])

  const particles = Array.from({ length: 18 }, (_, i) => ({ left: `${((i * 37 + 13) % 100)}%`, dur: `${8 + (i * 3.7 % 12)}s`, delay: `${(i * 1.3 % 8)}s` }))

  if (isMobile) {
    return (
      <><style dangerouslySetInnerHTML={{ __html: CSS }} />
        <div className="m-stories">
          <div className="m-progress">{Array.from({ length: totalStories }).map((_, i) => (<div key={i} className="m-prog-bar"><div className={`m-prog-fill${i < activeStory ? ' done' : ''}`} style={{ width: i === activeStory ? '100%' : i < activeStory ? '100%' : '0%' }} /></div>))}</div>
          {SECTIONS.map((s, i) => (
            <div key={i} className={`m-slide${activeStory === i ? ' active' : ''}`}>
              <div className="m-slide-bg" style={{ backgroundImage: `url(${s.img})` }} />
              <div className="m-slide-overlay" style={{ background: s.overlay }} />
              <div className="m-slide-vignette" />
              <div className="m-tap-left" onClick={goPrev} /><div className="m-tap-right" onClick={goNext} />
              <div className="m-header">
                <a href="/" className="m-header-logo"><img src="/SFT-logo-1.png" alt="SFT" /></a>
                <button className={`m-hamburger${menuOpen ? ' open' : ''}`} onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu"><span /><span /><span /></button>
              </div>
              <div className={`m-mobile-overlay${menuOpen ? ' open' : ''}`}>
                <a href="/" onClick={() => setMenuOpen(false)}>Home</a><a href="/about" onClick={() => setMenuOpen(false)}>About</a><a href="/hawke" onClick={() => setMenuOpen(false)}>HAWKE</a><a href="/applications" onClick={() => setMenuOpen(false)}>Applications</a><a href="/ecosystem" onClick={() => setMenuOpen(false)}>Ecosystem</a><a href="tel:+919486675847" onClick={() => setMenuOpen(false)} style={{ color: '#4AC7FF' }}>Request Pilot</a>
              </div>
              <div className="m-content"><div className="m-content-inner">
                <div className="m-sec-num">{s.num} / {String(N).padStart(2, '0')}</div>
                <div className="m-sec-label"><span className="m-sec-label-line" />{s.eyebrow}</div>
                <h2 className="m-sec-title">{s.title.replace(/\n/g, ' ')}</h2>
                {s.body && <p className="m-sec-body">{s.body}</p>}
                {s.note && <p className="m-sec-note">{s.note}</p>}
                {s.chips.length > 0 && <div className="m-sec-chips">{s.chips.map((c, ci) => (<div key={ci} className="m-sec-chip"><span className="m-sec-chip-val">{c.val}</span><span className="m-sec-chip-lbl">{c.lbl}</span></div>))}</div>}
                {s.cta.length > 0 && <div className="m-sec-ctas">{s.cta.map((c, ci) => (<a key={ci} href={c.href} className={c.style === 'primary' ? 'btn-p' : 'btn-g'}>{c.label}</a>))}</div>}
              </div></div>
            </div>
          ))}
          <div className={`m-slide${activeStory === N ? ' active' : ''}`}>
            <div className="m-slide-bg" style={{ backgroundImage: `url(${SECTIONS[0].img})` }} /><div className="m-slide-overlay" style={{ background: 'rgba(5,5,5,0.92)' }} />
            <div className="m-header"><a href="/" className="m-header-logo"><img src="/SFT-logo-1.png" alt="SFT" /></a><button className={`m-hamburger${menuOpen ? ' open' : ''}`} onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu"><span /><span /><span /></button></div>
            <div className={`m-mobile-overlay${menuOpen ? ' open' : ''}`}><a href="/" onClick={() => setMenuOpen(false)}>Home</a><a href="/about" onClick={() => setMenuOpen(false)}>About</a><a href="/hawke" onClick={() => setMenuOpen(false)}>HAWKE</a><a href="/applications" onClick={() => setMenuOpen(false)}>Applications</a><a href="/ecosystem" onClick={() => setMenuOpen(false)}>Ecosystem</a><a href="tel:+919486675847" onClick={() => setMenuOpen(false)} style={{ color: '#4AC7FF' }}>Request Pilot</a></div>
            <div className="m-tap-left" onClick={goPrev} />
            <div className="m-outro-content">
              <div className="m-outro-logo"><img src="/SFT-logo-1.png" alt="Susan Future Technologies" /></div>
              <h2 className="m-outro-title">Build The<br /><span className="oc">Future</span> Of<br />Aerial Infrastructure</h2>
              <p className="m-outro-sub">Ready to explore MOBIUS for your vision? Let&apos;s talk.</p>
              <div className="m-outro-ctas"><a href="tel:+919486675847" className="btn-p">Request a Pilot</a><a href="mailto:info@susanfuturetechnologies.com" className="btn-g">Contact Us</a></div>
              <div className="m-outro-footer">Susan Future Technologies Pvt. Ltd.<br />Chennai, India · info@susanfuturetechnologies.com<div className="m-outro-footer-tag">Engineering Persistent Aerial Systems</div></div>
            </div>
          </div>
        </div>
      </>
    )
  }

  return (
    <><style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div ref={bgLayerARef} className="bg-layer" style={{ backgroundImage: `url(${SECTIONS[0].img})`, backgroundPosition: SECTIONS[0].bgPos, opacity: 1 }} />
      <div ref={bgLayerBRef} className="bg-layer" style={{ opacity: 0 }} />
      <div ref={overlayARef} className="bg-overlay" style={{ background: SECTIONS[0].overlay, opacity: 1 }} />
      <div ref={overlayBRef} className="bg-overlay" style={{ opacity: 0 }} />
      <div className="vignette" /><div className="scanlines" />
      <div className="signal-rings"><div className="signal-ring" /><div className="signal-ring" /><div className="signal-ring" /><div className="signal-ring" /></div>
      <div className="particles">{particles.map((p, i) => (<div key={i} className="particle" style={{ left: p.left, animationDuration: p.dur, animationDelay: p.delay }} />))}</div>
      <nav className="s-nav">
        <a href="/" className="s-logo" style={{ textDecoration: 'none' }}><img src="/SFT-logo-1.png" alt="Susan Future Technologies" className="s-logo-img" /></a>
        <div className="s-section"><span ref={ctrRef} className="s-sec-num">--</span><span className="s-sep" /><span ref={ctrLabelRef} className="s-sec-label" /></div>
        <div className="s-nav-right">
          <a href="/" className="s-nav-link">Home</a><a href="/about" className="s-nav-link">About</a><a href="/hawke" className="s-nav-link">HAWKE</a><a href="/applications" className="s-nav-link">Applications</a><a href="/ecosystem" className="s-nav-link">Ecosystem</a><a href="tel:+919486675847" className="s-cta-btn">Request Pilot</a>
        </div>
        <button className={`s-hamburger${menuOpen ? ' open' : ''}`} onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu"><span /><span /><span /></button>
      </nav>
      <div className={`s-mobile-menu${menuOpen ? ' open' : ''}`}><a href="/" onClick={() => setMenuOpen(false)}>Home</a><a href="/about" onClick={() => setMenuOpen(false)}>About</a><a href="/hawke" onClick={() => setMenuOpen(false)}>HAWKE</a><a href="/applications" onClick={() => setMenuOpen(false)}>Applications</a><a href="/ecosystem" onClick={() => setMenuOpen(false)}>Ecosystem</a><a href="tel:+919486675847" onClick={() => setMenuOpen(false)} style={{ color: '#4AC7FF' }}>Request Pilot</a></div>
      <div id="prog"><div ref={fillRef} id="prog-fill" /></div>
      <div id="dots">{SECTIONS.map((_, i) => <div key={i} ref={el => { dotRefs.current[i] = el }} className="dot" />)}</div>
      <div ref={introRef} className="intro-panel vis">
        <div className="i-eye"><span className="i-eye-line" />MOBIUS<span className="i-eye-line" /></div>
        <h1 className="i-title">STRATOSPHERIC<br /><span className="gc">AERIAL PLATFORM</span></h1>
        <p className="i-sub">Persistent, scalable aerial infrastructure designed to extend connectivity, sensing, and operational reach beyond conventional systems.</p>
        <div className="i-ctas"><a href="tel:+919486675847" className="btn-p">Request a Pilot</a><a href="mailto:info@susanfuturetechnologies.com" className="btn-g">Contact Us</a></div>
        <div className="i-scroll"><span className="i-dot" />Scroll to explore</div>
      </div>
      <div id="sd" />
      {SECTIONS.map((s, i) => (
        <div key={i} ref={el => { panelRefs.current[i] = el }} className={`s-panel pos-${s.pos}`}>
          <div className="p-num">{s.num} / {String(N).padStart(2, '0')}</div>
          <div className="p-eyebrow"><span className="p-eyebrow-line" />{s.eyebrow}<span className="p-eyebrow-line" /></div>
          <h2 className="p-title">{s.title}</h2>
          {s.body && <p className="p-body">{s.body}</p>}
          {s.note && <p className="p-note">{s.note}</p>}
          {s.chips.length > 0 && <div className="p-chips">{s.chips.map((c, ci) => (<div key={ci} className="p-chip"><span className="p-chip-val">{c.val}</span><span className="p-chip-lbl">{c.lbl}</span></div>))}</div>}
          {s.cta.length > 0 && <div className="p-ctas">{s.cta.map((c, ci) => (<a key={ci} href={c.href} className={c.style === 'primary' ? 'btn-p' : 'btn-g'}>{c.label}</a>))}</div>}
        </div>
      ))}
      <div ref={outroRef} className="outro-panel">
        <div className="o-logo"><img src="/SFT-logo-1.png" alt="SFT" className="o-logo-img" /></div>
        <div className="o-eyebrow"><span className="o-eyebrow-line" />LET&apos;S BUILD<span className="o-eyebrow-line" /></div>
        <h2 className="o-title">Build The<br /><span className="oc">Future</span> Of<br />Aerial Infrastructure</h2>
        <p className="o-sub">Whether you represent a government, telecom operator, or investor — MOBIUS is ready.</p>
        <div className="o-cta-row"><a href="tel:+919486675847" className="btn-p">Request a Pilot</a><a href="mailto:info@susanfuturetechnologies.com" className="btn-g">Contact Us</a><a href="/hawke" className="btn-g">Explore HAWKE</a></div>
        <div className="o-divider" />
        <div className="o-footer">
          <div className="o-footer-nav"><a href="/" className="o-footer-link">Home</a><a href="/about" className="o-footer-link">About</a><a href="/hawke" className="o-footer-link">HAWKE</a><a href="/applications" className="o-footer-link">Applications</a><a href="/ecosystem" className="o-footer-link">Ecosystem</a><a href="mailto:info@susanfuturetechnologies.com" className="o-footer-link">Contact</a></div>
          <div className="o-footer-info">Susan Future Technologies Pvt. Ltd.<br />Chennai, India · +91 94866 75847 · info@susanfuturetechnologies.com</div>
          <div className="o-footer-tagline"><span className="o-footer-dot" />Engineering Persistent Aerial Systems<span className="o-footer-dot" /></div>
        </div>
      </div>
    </>
  )
}
