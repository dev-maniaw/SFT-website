'use client'
import { useEffect, useRef, useState, useCallback } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/* ═══════════════════════════════════════════════════════════════════
   SECTION DATA — About Us Chapters
═══════════════════════════════════════════════════════════════════ */
const SECTIONS = [
  {
    num: '01', label: 'Story',
    title: 'BUILDING THE\nNEXT LAYER OF\nCONNECTIVITY',
    body: 'Founded with a clear mission — to solve real-world infrastructure challenges using advanced aerial systems. We believe the future lies in persistent aerial platforms that deploy rapidly, operate continuously, and adapt to dynamic environments.',
    note: 'HAWKE — deployable aerial system for communication & monitoring\nMOBIUS — high-altitude platform for scalable, long-endurance operations',
    chips: [],
    pos: 'left' as const,
    bgPos: 'right center',
    img: '/sft/about/story.png',
    overlay: 'linear-gradient(90deg, rgba(5,5,5,0.94) 0%, rgba(5,5,5,0.82) 38%, rgba(5,5,5,0.3) 65%, transparent 100%)',
    eyebrow: 'OUR STORY',
    cta: [{ label: 'Explore HAWKE', style: 'primary', href: 'tel:+919486675847' }],
  },
  {
    num: '02', label: 'Mission',
    title: 'DESIGNED FOR\nENVIRONMENTS\nWHERE\nINFRASTRUCTURE\nFAILS',
    body: 'From disaster response and remote industrial sites to defence and future telecom networks, SFT platforms are engineered to operate where reliability is critical.',
    note: '',
    chips: [],
    pos: 'center' as const,
    bgPos: 'center center',
    img: '/sft/about/mission.png',
    overlay: 'radial-gradient(ellipse at center, rgba(5,5,5,0.86) 0%, rgba(5,5,5,0.65) 40%, rgba(5,5,5,0.3) 65%, transparent 100%)',
    eyebrow: 'BUILT FOR MISSIONS THAT DEMAND CONTINUOUS OPERATION',
    cta: [],
  },
  {
    num: '03', label: 'Metrics',
    title: 'MILESTONES\n& METRICS',
    body: '',
    note: '',
    chips: [
      { val: 'TRL 7→9', lbl: 'Readiness' },
      { val: '3+', lbl: 'Pilot Deployments' },
      { val: 'MULTI', lbl: 'Sector Applications' },
      { val: '2027', lbl: 'HAPS Target' },
    ],
    pos: 'center' as const,
    bgPos: 'center center',
    img: '/sft/about/metrics.png',
    overlay: 'radial-gradient(ellipse at center, rgba(5,5,5,0.88) 0%, rgba(5,5,5,0.68) 40%, rgba(5,5,5,0.3) 65%, transparent 100%)',
    eyebrow: 'ACHIEVEMENTS',
    cta: [],
    metrics: [
      { val: 'TRL 7 → 9', desc: 'HAWKE platform tested and progressing toward full deployment readiness' },
      { val: '3+', desc: 'Pilot deployments across industrial and government use cases' },
      { val: 'MULTI-SECTOR', desc: 'Disaster response, mining, defence, and remote monitoring' },
      { val: 'HAPS 2027', desc: 'MOBIUS platform advancing toward high-altitude deployment' },
    ],
  },
  {
    num: '04', label: 'Ecosystem',
    title: 'COLLABORATIONS\n& ECOSYSTEM',
    body: 'Working with industry, research institutions, and government bodies to develop and deploy next-generation aerial systems.',
    note: '',
    chips: [],
    pos: 'center' as const,
    bgPos: 'center center',
    img: '/sft/about/ecosystem.png',
    overlay: 'radial-gradient(ellipse at center, rgba(5,5,5,0.88) 0%, rgba(5,5,5,0.72) 40%, rgba(5,5,5,0.4) 65%, rgba(5,5,5,0.2) 100%)',
    eyebrow: 'PARTNERSHIPS',
    cta: [],
    partners: [
      'IIT Madras Research Park',
      'Anna University / C-WiSD',
      'Defence Research Partners',
      'Industrial Collaborators',
    ],
  },
  {
    num: '05', label: 'Journey',
    title: 'OUR\nJOURNEY',
    body: '',
    note: '',
    chips: [],
    pos: 'left' as const,
    bgPos: 'right center',
    img: '/sft/about/timeline.png',
    overlay: 'linear-gradient(90deg, rgba(5,5,5,0.94) 0%, rgba(5,5,5,0.82) 38%, rgba(5,5,5,0.3) 65%, transparent 100%)',
    eyebrow: 'TIMELINE',
    cta: [],
    timeline: [
      { year: '2021', desc: 'Company founded with a vision to develop real-world engineering solutions for communication and monitoring challenges.' },
      { year: '2022', desc: 'Recognition through national innovation programs and early-stage development of aerial platform technologies.' },
      { year: '2023', desc: 'Awarded for advanced technology development and continued progress in communication and aerospace systems.' },
      { year: '2024', desc: 'HAWKE platform development, testing, and pilot deployments initiated.' },
      { year: '2025', desc: 'Advancing toward higher TRL levels and expanding application use cases.' },
      { year: '2026+', desc: 'Commercial deployment of HAWKE and continued development of MOBIUS high-altitude platform.' },
    ],
  },
  {
    num: '06', label: 'Backed By',
    title: 'SUPPORTED\nBY',
    body: 'Backed by an ecosystem of research institutions, innovation programs, and strategic collaborators.',
    note: '',
    chips: [],
    pos: 'right' as const,
    bgPos: 'left center',
    img: '/sft/about/investors.png',
    overlay: 'linear-gradient(270deg, rgba(5,5,5,0.94) 0%, rgba(5,5,5,0.82) 38%, rgba(5,5,5,0.3) 65%, transparent 100%)',
    eyebrow: 'INVESTORS & ECOSYSTEM',
    cta: [{ label: 'Learn More', style: 'ghost', href: 'mailto:info@susanfuturetechnologies.com' }],
    supporters: ['Incubation Programs', 'Research Grants', 'Institutional Partnerships'],
  },
  {
    num: '07', label: 'Team',
    title: 'BUILDING THE\nFUTURE\nTOGETHER',
    body: 'Our team combines expertise across aerospace engineering, communication systems, and real-world deployment — driven by a shared mission to build technologies that matter.',
    note: 'Headquartered at IIT Madras Research Park, SFT operates at the intersection of aerospace engineering, communication systems, and mission-critical deployment technologies.',
    chips: [],
    pos: 'left' as const,
    bgPos: 'right center',
    img: '/sft/about/team.png',
    overlay: 'linear-gradient(90deg, rgba(5,5,5,0.94) 0%, rgba(5,5,5,0.82) 38%, rgba(5,5,5,0.3) 65%, transparent 100%)',
    eyebrow: 'OUR TEAM',
    cta: [{ label: 'Contact Us', style: 'primary', href: 'mailto:info@susanfuturetechnologies.com' }],
  },
  {
    num: '08', label: 'Connect',
    title: "LET'S BUILD THE\nNEXT LAYER OF\nCONNECTIVITY",
    body: 'If you are exploring deployable communication systems, aerial monitoring platforms, or future HAPS infrastructure, we\'d love to connect.',
    note: '',
    chips: [],
    pos: 'center' as const,
    bgPos: 'center center',
    img: '/sft/about/cta.png',
    overlay: 'radial-gradient(ellipse at center, rgba(5,5,5,0.88) 0%, rgba(5,5,5,0.72) 40%, rgba(5,5,5,0.35) 65%, transparent 100%)',
    eyebrow: 'GET IN TOUCH',
    cta: [
      { label: 'Contact Us', style: 'primary', href: 'mailto:info@susanfuturetechnologies.com' },
      { label: 'Request a Pilot', style: 'ghost', href: 'tel:+919486675847' },
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
.s-logo{
  display:flex;align-items:center;
}
.s-logo-img{
  height:55px;width:auto;object-fit:contain;mix-blend-mode:screen;
}
/* center section indicator */
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
/* right nav */
.s-nav-right{display:flex;align-items:center;gap:18px}
.s-nav-link{
  font-family:'Space Grotesk',sans-serif;
  font-size:0.95rem;font-weight:500;letter-spacing:.18em;text-transform:uppercase;
  color:rgba(255,255,255,0.55);text-decoration:none;transition:color .2s;
}
.s-nav-link:hover{color:rgba(255,255,255,0.6)}
.s-cta-btn{
  font-family:'Space Grotesk',sans-serif;font-size:0.95rem;font-weight:600;
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
.pos-center .p-body{max-width:460px}

.p-note{
  font-family:'Space Grotesk',sans-serif;
  font-size:0.95rem;font-weight:400;color:rgba(74,199,255,0.85);
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
  background:rgba(10,15,20,0.82);
  border:1px solid rgba(74,199,255,0.12);
  border-radius:20px;padding:7px 16px;
  
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
  font-size:0.95rem;font-weight:500;
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

/* ── Metrics grid ── */
.metrics-grid{
  display:grid;grid-template-columns:repeat(4,1fr);gap:20px;
  width:100%;max-width:900px;margin-top:24px;
}
.metric-card{
  background:rgba(10,15,20,0.82);
  border:1px solid rgba(74,199,255,0.1);
  border-radius:12px;padding:28px 20px;
  
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
  font-size:0.95rem;color:rgba(167,175,187,0.88);line-height:1.5;
}

/* ── Partners grid ── */
.partners-grid{
  display:grid;grid-template-columns:repeat(4,1fr);gap:16px;
  width:100%;max-width:800px;margin-top:24px;
}
.partner-card{
  background:rgba(10,15,20,0.82);
  border:1px solid rgba(74,199,255,0.1);
  border-radius:12px;padding:24px 16px;
  
  text-align:center;
  font-family:'Space Grotesk',sans-serif;
  font-size:0.95rem;font-weight:500;letter-spacing:.1em;
  color:rgba(255,255,255,0.7);text-transform:uppercase;
  opacity:0;transform:translateY(40px);
  transition:opacity 0.7s cubic-bezier(.16,1,.3,1), transform 0.7s cubic-bezier(.16,1,.3,1), background 0.3s ease, border-color 0.3s ease;
}
.vis .partner-card{opacity:1;transform:translateY(0)}
.vis .partner-card:nth-child(1){transition-delay:0s}
.vis .partner-card:nth-child(2){transition-delay:0.12s}
.vis .partner-card:nth-child(3){transition-delay:0.24s}
.vis .partner-card:nth-child(4){transition-delay:0.36s}
.partner-card:hover{
  background:rgba(74,199,255,0.1);
  border-color:rgba(74,199,255,0.25);
  color:rgba(255,255,255,0.8);
}

/* ── Timeline ── */
.timeline-right{
  position:fixed;bottom:0;left:0;width:100%;height:auto;
  z-index:11;pointer-events:none;
  padding:0 40px 50px 40px;
  opacity:0;
  transition:opacity 0.8s cubic-bezier(.16,1,.3,1);
  overflow:hidden;
}
.timeline-right.vis{opacity:1}
.timeline-card-stack{
  display:flex;gap:20px;
  transition:transform 0.6s cubic-bezier(.16,1,.3,1);
  will-change:transform;
}
.tl-card-full{
  flex:0 0 260px;
  background:rgba(5,5,5,0.88);
  border:1px solid rgba(74,199,255,0.1);
  border-radius:14px;
  padding:24px 22px;
  display:flex;flex-direction:column;justify-content:flex-start;
  opacity:0.35;transform:scale(0.95);
  transition:opacity 0.5s ease, transform 0.5s ease, border-color 0.5s ease, box-shadow 0.5s ease;
  pointer-events:auto;min-height:200px;
}
.tl-card-full.active{
  opacity:1;transform:scale(1);
  border-color:rgba(74,199,255,0.4);
  box-shadow:0 0 30px rgba(74,199,255,0.08);
}
.tl-card-full.past{
  opacity:0.25;transform:scale(0.92);
}
.tl-card-full::before{
  content:'';position:absolute;top:0;left:22px;right:22px;height:2px;
  background:linear-gradient(90deg,#4AC7FF,rgba(74,199,255,0.05));
  border-radius:1px;
}
.tl-card-counter{
  font-family:'Space Mono',monospace;
  font-size:0.8rem;font-weight:400;letter-spacing:.1em;
  color:rgba(255,255,255,0.35);margin-bottom:8px;
}
.tl-card-year{
  font-family:'Space Mono',monospace;
  font-size:2rem;font-weight:700;color:#4AC7FF;
  margin-bottom:10px;letter-spacing:-0.02em;
  line-height:1;
}
.tl-card-desc{
  font-family:'Inter',sans-serif;
  font-size:0.88rem;color:rgba(167,175,187,0.92);line-height:1.65;
}
.tl-card-progress{
  margin-top:auto;padding-top:14px;
  display:flex;gap:5px;
}
.tl-card-dot{
  width:20px;height:3px;border-radius:2px;
  background:rgba(255,255,255,0.08);
  transition:background 0.3s ease, width 0.3s ease;
}
.tl-card-dot.active{
  background:#4AC7FF;width:32px;
}

/* ── Supporters list ── */
.supporters-list{
  display:flex;flex-direction:column;gap:10px;margin-top:16px;
}
.supporter-item{
  font-family:'Space Grotesk',sans-serif;
  font-size:0.95rem;font-weight:500;letter-spacing:.12em;
  color:rgba(74,199,255,0.75);text-transform:uppercase;
  padding:8px 0;
  border-bottom:1px solid rgba(74,199,255,0.08);
  display:flex;align-items:center;gap:10px;
}
.supporter-dot{width:4px;height:4px;border-radius:50%;background:#4AC7FF;flex-shrink:0}

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
  max-width:480px;margin-bottom:42px;text-align:center
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

.o-logo{
  font-family:'Space Grotesk',sans-serif;font-size:1rem;font-weight:600;
  letter-spacing:.08em;color:#F5F7FA;text-transform:uppercase;
  display:flex;align-items:center;gap:6px;
  margin-bottom:18px;
}
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
#sd{height:1430vh;position:relative;z-index:5;pointer-events:none}


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
  display:flex;align-items:center;
}
.m-header-logo-img{height:28px;width:auto;object-fit:contain}
.m-header-cta{
  font-family:'Space Grotesk',sans-serif;font-size:0.95rem;font-weight:700;
  letter-spacing:.14em;text-transform:uppercase;
  background:transparent;color:#4AC7FF;
  border:1px solid rgba(74,199,255,0.4);
  padding:7px 12px;border-radius:50px;text-decoration:none;
}

/* ── Story content (bottom anchored) ── */
.m-content{
  position:relative;z-index:30;
  margin-top:auto;
  padding:0 12px 20px;
}
.m-content-inner{
  background:rgba(5,5,5,.5);
  
  border:1px solid rgba(74,199,255,0.08);
  border-radius:14px;
  padding:16px;
}
.m-sec-num{
  font-family:'Space Mono',monospace;
  font-size:0.95rem;font-weight:400;letter-spacing:.1em;
  color:rgba(255,255,255,0.35);margin-bottom:4px;
}
.m-sec-label{
  font-family:'Space Grotesk',sans-serif;
  font-size:0.95rem;font-weight:500;letter-spacing:.24em;text-transform:uppercase;
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
  font-size:0.95rem;color:#A7AFBB;
  line-height:1.7;margin-bottom:6px;
}
.m-sec-note{
  font-family:'Space Grotesk',sans-serif;
  font-size:0.95rem;font-weight:400;color:rgba(74,199,255,0.75);
  letter-spacing:.08em;
  padding-top:6px;border-top:1px solid rgba(74,199,255,0.1);
  line-height:1.5;
}
.m-sec-chips{
  display:flex;flex-wrap:wrap;gap:5px;margin-top:6px;
}
.m-sec-chip{
  display:flex;align-items:center;gap:4px;
  background:rgba(10,15,20,0.82);
  border:1px solid rgba(74,199,255,0.1);
  border-radius:14px;padding:3px 8px;
}
.m-sec-chip-val{
  font-family:'Space Mono',monospace;font-size:0.95rem;font-weight:700;
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
.m-sec-ctas .btn-p{font-size:0.95rem;padding:8px 14px}
.m-sec-ctas .btn-g{font-size:0.95rem;padding:8px 14px}

/* ── Mobile metrics ── */
.m-metrics-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:6px;margin-top:8px}
.m-metric-card{
  background:rgba(10,15,20,0.82);
  border:1px solid rgba(74,199,255,0.1);
  border-radius:8px;padding:10px 8px;text-align:center;
}
.m-metric-val{
  font-family:'Space Mono',monospace;font-size:1rem;font-weight:700;color:#4AC7FF;margin-bottom:4px;
}
.m-metric-desc{
  font-family:'Inter',sans-serif;font-size:0.95rem;color:rgba(167,175,187,0.88);line-height:1.4;
}

/* ── Mobile timeline ── */
.m-tl-grid{display:flex;flex-direction:column;gap:6px;margin-top:8px;max-height:200px;overflow-y:auto}
.m-tl-card{
  display:flex;gap:8px;align-items:flex-start;
  background:rgba(10,15,20,0.8);
  border:1px solid rgba(74,199,255,0.08);
  border-radius:8px;padding:8px 10px;
}
.m-tl-year{
  font-family:'Space Mono',monospace;font-size:0.95rem;font-weight:700;color:#4AC7FF;flex-shrink:0;
}
.m-tl-desc{
  font-family:'Inter',sans-serif;font-size:0.95rem;color:rgba(167,175,187,0.88);line-height:1.45;
}

/* ── Mobile partners ── */
.m-partners-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:6px;margin-top:8px}
.m-partner-card{
  background:rgba(10,15,20,0.82);
  border:1px solid rgba(74,199,255,0.1);
  border-radius:8px;padding:10px 8px;text-align:center;
  font-family:'Space Grotesk',sans-serif;
  font-size:0.95rem;font-weight:500;letter-spacing:.08em;
  color:rgba(255,255,255,0.7);text-transform:uppercase;
}

/* ── Mobile outro slide ── */
.m-outro-content{
  position:relative;z-index:30;
  display:flex;flex-direction:column;
  align-items:center;justify-content:center;
  flex:1;padding:60px 20px 36px;text-align:center;
}
.m-outro-logo{
  display:flex;align-items:center;margin-bottom:14px;
}
.m-outro-logo-img{height:28px;width:auto;object-fit:contain}
.m-outro-title{
  font-family:'Space Grotesk',sans-serif;
  font-size:clamp(1.5rem,6vw,2.2rem);font-weight:300;line-height:1.1;
  color:#F5F7FA;margin-bottom:10px;text-transform:uppercase;
  letter-spacing:-0.02em;
}
.m-outro-title .oc{color:#4AC7FF}
.m-outro-sub{
  font-family:'Inter',sans-serif;
  font-size:0.95rem;color:#A7AFBB;line-height:1.7;
  max-width:280px;margin-bottom:22px;
}
.m-outro-ctas{
  display:flex;flex-direction:column;gap:8px;width:100%;max-width:260px;margin-bottom:20px;
}
.m-outro-ctas .btn-p,.m-outro-ctas .btn-g{
  width:100%;text-align:center;padding:12px 20px;font-size:0.95rem;
}
.m-outro-footer{
  margin-top:auto;
  font-family:'Inter',sans-serif;
  font-size:0.7rem;color:rgba(167,175,187,0.75);text-align:center;line-height:1.6;
  letter-spacing:.04em;
}
.m-outro-footer-tag{
  font-family:'Space Grotesk',sans-serif;
  font-size:0.42rem;font-weight:500;letter-spacing:.16em;text-transform:uppercase;
  color:rgba(74,199,255,0.45);margin-top:8px;
}

/* ── Mobile Responsive ── */
.s-hamburger{
  display:none;background:none;border:none;cursor:pointer;padding:8px;
  flex-direction:column;gap:5px;z-index:101;
}
.s-hamburger span{
  display:block;width:24px;height:2px;background:#F5F7FA;
  transition:transform 0.3s ease, opacity 0.3s ease;
}
.s-hamburger.open span:nth-child(1){transform:rotate(45deg) translate(5px,5px)}
.s-hamburger.open span:nth-child(2){opacity:0}
.s-hamburger.open span:nth-child(3){transform:rotate(-45deg) translate(5px,-5px)}
.s-mobile-menu{
  display:none;position:fixed;top:0;left:0;right:0;bottom:0;
  background:rgba(5,5,5,0.96);z-index:99;
  flex-direction:column;align-items:center;justify-content:center;gap:28px;
  opacity:0;pointer-events:none;transition:opacity 0.3s ease;
}
.s-mobile-menu.open{opacity:1;pointer-events:auto}
.s-mobile-menu a{
  font-family:'Space Grotesk',sans-serif;font-size:1.4rem;
  font-weight:500;letter-spacing:.2em;text-transform:uppercase;
  color:rgba(255,255,255,0.8);text-decoration:none;transition:color 0.2s;
}
.s-mobile-menu a:hover{color:#4AC7FF}
@media(max-width:768px){
  .s-nav{padding:0 16px;height:56px}
  .s-logo-img{height:38px}
  .s-section{display:none}
  .s-nav-right{display:none}
  .s-hamburger{display:flex}
  .s-mobile-menu{display:flex}
  .p-panel{padding:0 20px}
  .p-title{font-size:clamp(1.8rem,8vw,3rem)!important}
  .p-body,.p-note{font-size:0.9rem!important;max-width:100%!important}
  .p-chips{flex-wrap:wrap}
  .i-title{font-size:clamp(2rem,10vw,3.5rem)!important}
  .i-sub{font-size:0.9rem!important;max-width:90vw!important}
  #dots{right:8px;gap:6px}
  .dot{width:6px;height:6px}
  .o-footer{padding:40px 20px!important}
  .o-footer-grid{flex-direction:column!important;gap:24px!important}
}

`

/* ═══════════════════════════════════════════════════════════════════
   PAGE COMPONENT
═══════════════════════════════════════════════════════════════════ */
export default function AboutPage() {
  /* ── Mobile detection ── */
  const [isMobile, setIsMobile] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
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
  const timelineRightRef = useRef<HTMLDivElement>(null)
  const tlCardRefs = useRef<(HTMLDivElement | null)[]>([])
  const tlStripRef = useRef<HTMLDivElement>(null)
  const TIMELINE_SECTION_IDX = 4 // section 05 (index 4) is the timeline

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

      const N = SECTIONS.length
      const onScroll = () => {
        const pct = Math.max(0, Math.min(1, window.scrollY / (driver.offsetHeight - window.innerHeight)))

        /* progress bar */
        if (fillRef.current) fillRef.current.style.width = (pct * 100) + '%'

        /* section mapping */
        const sF = Math.max(0, (pct - 0.03) / 0.90) * (N + 1.5)
        const newIdx = Math.min(N - 1, Math.floor(sF - 0.75))

        /* intro */
        if (introRef.current) introRef.current.classList.toggle('vis', sF < 0.72)

        /* outro */
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

        /* ── Timeline sub-scroll: must run on every tick ── */
        const curIdx = newIdx >= 0 ? newIdx : activeIdx.current
        const isTimelineActive = curIdx === TIMELINE_SECTION_IDX
        if (timelineRightRef.current) {
          timelineRightRef.current.classList.toggle('vis', isTimelineActive)
        }
        if (isTimelineActive) {
          const subStart = TIMELINE_SECTION_IDX + 0.75
          const subEnd = TIMELINE_SECTION_IDX + 1.70
          const subPct = Math.max(0, Math.min(1, (sF - subStart) / (subEnd - subStart)))
          const tlCount = tlCardRefs.current.filter(Boolean).length
          const activeCard = Math.min(tlCount - 1, Math.floor(subPct * tlCount))
          /* Slide the strip: each card is 260px + 20px gap = 280px */
          const stripOffset = activeCard * 280
          if (tlStripRef.current) {
            tlStripRef.current.style.transform = `translateX(-${stripOffset}px)`
          }
          tlCardRefs.current.forEach((el, ci) => {
            if (!el) return
            el.classList.remove('active', 'past')
            if (ci === activeCard) el.classList.add('active')
            else if (ci < activeCard) el.classList.add('past')
          })
        } else {
          tlCardRefs.current.forEach(el => { el?.classList.remove('active', 'past') })
          if (tlStripRef.current) tlStripRef.current.style.transform = 'translateX(0)'
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
                <div className={`m-prog-fill${i < activeStory ? ' done' : ''}`}
                  style={i === activeStory ? { width: '50%' } : {}} />
              </div>
            ))}
          </div>

          {/* Slides */}
          {SECTIONS.map((s, i) => (
            <div key={i} className={`m-slide${activeStory === i ? ' active' : ''}`}>
              <div className="m-slide-bg" style={{ backgroundImage: `url(${s.img})` }} />
              <div className="m-slide-overlay" style={{ background: s.overlay }} />
              <div className="m-slide-vignette" />

              {/* Tap zones */}
              <div className="m-tap-left" onClick={goPrev} />
              <div className="m-tap-right" onClick={goNext} />

              {/* Header */}
              <div className="m-header">
                <div className="m-header-logo">
                  <img src="/SFT-logo-1.png" alt="SFT" className="m-header-logo-img" />
                </div>
                <a href="/" className="m-header-cta">
                  Home
                </a>
              </div>

              {/* Content */}
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
                  {/* Mobile metrics */}
                  {'metrics' in s && (s as typeof SECTIONS[4] & { metrics: { val: string; desc: string }[] }).metrics && (
                    <div className="m-metrics-grid">
                      {(s as typeof SECTIONS[4] & { metrics: { val: string; desc: string }[] }).metrics.map((m, mi) => (
                        <div key={mi} className="m-metric-card">
                          <div className="m-metric-val">{m.val}</div>
                          <div className="m-metric-desc">{m.desc}</div>
                        </div>
                      ))}
                    </div>
                  )}
                  {/* Mobile timeline */}
                  {'timeline' in s && (s as typeof SECTIONS[6] & { timeline: { year: string; desc: string }[] }).timeline && (
                    <div className="m-tl-grid">
                      {(s as typeof SECTIONS[6] & { timeline: { year: string; desc: string }[] }).timeline.map((t, ti) => (
                        <div key={ti} className="m-tl-card">
                          <div className="m-tl-year">{t.year}</div>
                          <div className="m-tl-desc">{t.desc}</div>
                        </div>
                      ))}
                    </div>
                  )}
                  {/* Mobile partners */}
                  {'partners' in s && (s as typeof SECTIONS[5] & { partners: string[] }).partners && (
                    <div className="m-partners-grid">
                      {(s as typeof SECTIONS[5] & { partners: string[] }).partners.map((p, pi) => (
                        <div key={pi} className="m-partner-card">{p}</div>
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
                Let&apos;s Build The<br />
                Next Layer of<br />
                <span className="oc">Connectivity.</span>
              </h2>
              <p className="m-outro-sub">
                Deployable communication systems, aerial monitoring platforms, and future HAPS infrastructure.
              </p>
              <div className="m-outro-ctas">
                <a href="mailto:info@susanfuturetechnologies.com" className="btn-p">Contact Us</a>
                <a href="tel:+919486675847" className="btn-g">Request a Pilot</a>
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
            backgroundImage: `url(/sft/about/hero.png)`,
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

      {/* Overlay gradient */}
      <div ref={overlayRef} className="overlay-layer" style={{ background: 'radial-gradient(ellipse at center, rgba(5,5,5,0.84) 0%, rgba(5,5,5,0.62) 40%, rgba(5,5,5,0.25) 65%, transparent 100%)' }} />

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

      {/* Scroll driver */}
      <div id="sd" />

      {/* Intro panel */}
      <div ref={introRef} className="intro-panel">
        <div className="i-eye">
          <span className="i-eye-line" />
          SUSAN FUTURE TECHNOLOGIES
          <span className="i-eye-line" />
        </div>
        <h1 className="i-title">
          About<br />
          <span className="gc">Us</span>
        </h1>
        <p className="i-sub">
          Engineering persistent aerial systems for the next generation of connectivity.
        </p>
        <div className="i-scroll">
          <span className="i-dot" />Scroll to explore
        </div>
      </div>

      {/* Nav */}
      <nav className="s-nav">
        {/* Left: Logo */}
        <a href="/" className="s-logo" style={{textDecoration:"none"}}>
          <img src="/SFT-logo-1.png" alt="Susan Future Technologies" className="s-logo-img" />
        </a>

        {/* Center: Section indicator */}
        <div className="s-section">
          <span ref={ctrRef} className="s-sec-num">01 / 08</span>
          <span className="s-sep" />
          <span ref={ctrLabelRef} className="s-sec-label">About</span>
        </div>

        {/* Right: CTA */}
        <div className="s-nav-right">
          <a href="/" className="s-nav-link">Home</a>
          <a href="/hawke" className="s-nav-link">HAWKE</a>
          <a href="/mobius" className="s-nav-link">MOBIUS</a>
          <a href="/applications" className="s-nav-link">Applications</a>
          <a href="/ecosystem" className="s-nav-link">Ecosystem</a>
          <a href="tel:+919486675847" className="s-cta-btn">Request Pilot</a>
        </div>
        <button className={`s-hamburger${menuOpen?' open':''}`} onClick={()=>setMenuOpen(!menuOpen)} aria-label="Menu">
          <span /><span /><span />
        </button>
      </nav>
      <div className={`s-mobile-menu${menuOpen?' open':''}`}>
        <a href="/" onClick={()=>setMenuOpen(false)}>Home</a>
        <a href="/hawke" onClick={()=>setMenuOpen(false)}>HAWKE</a>
        <a href="/mobius" onClick={()=>setMenuOpen(false)}>MOBIUS</a>
        <a href="/applications" onClick={()=>setMenuOpen(false)}>Applications</a>
        <a href="/ecosystem" onClick={()=>setMenuOpen(false)}>Ecosystem</a>
        <a href="tel:+919486675847" onClick={()=>setMenuOpen(false)} style={{color:'#4AC7FF'}}>Request Pilot</a>
      </div>


      {/* Progress bar */}
      <div id="prog"><div ref={fillRef} id="prog-fill" /></div>

      {/* Dot indicators */}
      <div id="dots">
        {SECTIONS.map((_, i) => (
          <div key={i} ref={el => { dotRefs.current[i] = el }} className="dot" />
        ))}
      </div>

      {/* Section content panels */}
      {SECTIONS.map((s, i) => {
        const hasMetrics = 'metrics' in s
        const hasTimeline = 'timeline' in s
        const hasPartners = 'partners' in s
        const hasSupporters = 'supporters' in s
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
          {/* Metrics grid */}
          {hasMetrics && (
            <div className="metrics-grid">
              {(s as typeof SECTIONS[4] & { metrics: { val: string; desc: string }[] }).metrics.map((m, mi) => (
                <div key={mi} className="metric-card">
                  <div className="metric-val">{m.val}</div>
                  <div className="metric-desc">{m.desc}</div>
                </div>
              ))}
            </div>
          )}
          {/* Partners grid */}
          {hasPartners && (
            <div className="partners-grid">
              {(s as typeof SECTIONS[5] & { partners: string[] }).partners.map((p, pi) => (
                <div key={pi} className="partner-card">{p}</div>
              ))}
            </div>
          )}
          {/* Timeline — now rendered as separate right-side panel */}
          {hasTimeline && null}
          {/* Supporters */}
          {hasSupporters && (
            <div className="supporters-list">
              {(s as typeof SECTIONS[7] & { supporters: string[] }).supporters.map((sup, si) => (
                <div key={si} className="supporter-item">
                  <span className="supporter-dot" />
                  {sup}
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

      {/* ── Timeline Right Panel: card stack ── */}
      <div ref={timelineRightRef} className="timeline-right">
        <div ref={tlStripRef} className="timeline-card-stack">
          {SECTIONS[4] && 'timeline' in SECTIONS[4] && (SECTIONS[4] as typeof SECTIONS[4] & { timeline: { year: string; desc: string }[] }).timeline.map((t, ti, arr) => (
            <div key={ti} ref={el => { tlCardRefs.current[ti] = el }} className="tl-card-full">
              <div className="tl-card-counter">{String(ti + 1).padStart(2, '0')} / {String(arr.length).padStart(2, '0')}</div>
              <div className="tl-card-year">{t.year}</div>
              <div className="tl-card-desc">{t.desc}</div>
              <div className="tl-card-progress">
                {arr.map((_, di) => (
                  <span key={di} className={`tl-card-dot${di === ti ? ' active' : ''}`} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Outro overlay */}
      <div ref={outroRef} className="outro-panel">
        <div className="o-logo">
          <img src="/SFT-logo-1.png" alt="SFT" className="o-logo-img" />
        </div>

        <div className="o-eyebrow">
          <span className="o-eyebrow-line" />
          GET IN TOUCH
          <span className="o-eyebrow-line" />
        </div>

        <h2 className="o-title">
          Let&apos;s Build The<br />
          Next Layer of<br />
          <span className="oc">Connectivity.</span>
        </h2>

        <p className="o-sub">
          Deployable communication systems, aerial monitoring, and HAPS infrastructure. Let&apos;s talk.
        </p>

        <div className="o-cta-row">
          <a href="mailto:info@susanfuturetechnologies.com" className="btn-p">Contact Us</a>
          <a href="tel:+919486675847" className="btn-g">Request a Pilot</a>
          <a href="/" className="btn-g">Home</a>
        </div>

        <div className="o-divider" />

        <div className="o-footer">
          <div className="o-footer-nav">
            <a href="/" className="o-footer-link">Home</a>
            <a href="/hawke" className="o-footer-link">HAWKE</a>
            <a href="/mobius" className="o-footer-link">MOBIUS</a>
            <a href="/#" className="o-footer-link">Technology</a>
            <a href="mailto:info@susanfuturetechnologies.com" className="o-footer-link">Contact</a>
          </div>
          <div className="o-footer-info">
            Susan Future Technologies Pvt. Ltd.<br />
            IIT Madras Research Park, Chennai
          </div>
          <div className="o-footer-tagline">
            <span className="o-footer-dot" />
            Persistent Aerial Systems
            <span className="o-footer-dot" />
            HAPS
            <span className="o-footer-dot" />
            Communication
            <span className="o-footer-dot" />
          </div>
        </div>
      </div>
    </>
  )
}
