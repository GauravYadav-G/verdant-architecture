import { useEffect, useLayoutEffect, useRef, useState, type RefObject } from "react";
import {
  gsap,
  scrollToTarget,
  useBodyBg,
  useClock,
  useFontsRefresh,
  useLenis,
  usePointerFine,
  useReducedMotion,
  type Lenis,
} from "./shared/motion";
import { Magnetic } from "./shared/ui";
import { CadBlueprint, HeliodonCanvas } from "./Art";
import { principles, projects, solarPresets, specimens, type ArchProject } from "./data";

function formatHour(h: number) {
  const hrs = Math.floor(h);
  const mins = Math.round((h - hrs) * 60);
  return `${String(hrs).padStart(2, "0")}:${String(mins === 60 ? 59 : mins).padStart(2, "0")}`;
}

/* ================================================================
   ARCHITECT'S DRAFTING CURSOR
   ================================================================ */

function DraftingCursor() {
  const fine = usePointerFine();
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!fine || reduced) return;
    let x = -100;
    let y = -100;
    let rx = -100;
    let ry = -100;
    let raf = 0;

    const move = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      const t = e.target as HTMLElement | null;
      const cur = t?.closest?.("[data-vcursor]") as HTMLElement | null;
      if (labelRef.current) {
        labelRef.current.textContent = cur?.getAttribute("data-vcursor") || "";
      }
    };

    const loop = () => {
      rx += (x - rx) * 0.22;
      ry += (y - ry) * 0.22;
      if (ref.current) {
        ref.current.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
      }
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("pointermove", move, { passive: true });
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("pointermove", move);
      cancelAnimationFrame(raf);
    };
  }, [fine, reduced]);

  if (!fine || reduced) return null;
  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed top-0 left-0 z-[190]"
      style={{ transform: "translate3d(-100px,-100px,0)" }}
    >
      <div className="relative -translate-x-1/2 -translate-y-1/2">
        <div className="h-7 w-7 rounded-full border border-[#171410]/45" />
        <div className="absolute top-1/2 left-1/2 h-1 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#a6732d]" />
      </div>
      <span
        ref={labelRef}
        className="ml-4 -mt-3 block bg-[#171410] px-2 py-0.5 font-mono text-[9px] tracking-[0.24em] whitespace-nowrap text-[#f2ecdf] uppercase empty:hidden"
      />
    </div>
  );
}

/* ================================================================
   NAVIGATION
   ================================================================ */

function VNav({ lenis }: { lenis: RefObject<Lenis | null> }) {
  const cet = useClock("Europe/Madrid");
  const go = (e: React.MouseEvent, sel: string) => {
    e.preventDefault();
    scrollToTarget(lenis.current, sel, -40);
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-[#171410]/12 bg-[#f2ecdf]/88 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1680px] items-center justify-between px-5 md:h-20 md:px-10">
        <a href="#v-top" onClick={(e) => go(e, "#v-top")} className="flex items-baseline gap-3">
          <span className="font-display text-xl font-light tracking-[-0.02em] text-[#171410] md:text-2xl">
            Verdant
          </span>
          <span className="hidden font-mono text-[9px] tracking-[0.28em] text-[#171410]/50 uppercase sm:inline">
            Atelier d&apos;Architecture
          </span>
        </a>

        <nav className="hidden items-center gap-9 lg:flex" aria-label="Verdant sections">
          {[
            ["01 Works", "#v-works"],
            ["02 Heliodon", "#v-heliodon"],
            ["03 Materials", "#v-materials"],
            ["04 Ethos", "#v-ethos"],
            ["05 Commission", "#v-contact"],
          ].map(([label, href]) => (
            <a
              key={href}
              href={href}
              onClick={(e) => go(e, href)}
              className="link-sweep font-mono text-[10px] tracking-[0.26em] text-[#171410]/70 uppercase transition-colors hover:text-[#171410]"
            >
              {label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-5">
          <span className="hidden font-mono text-[10px] tracking-[0.2em] text-[#171410]/50 uppercase tabular xl:inline">
            Mallorca {cet}
          </span>
          <a
            href="#v-contact"
            onClick={(e) => go(e, "#v-contact")}
            className="border border-[#171410]/35 px-4 py-2 font-mono text-[10px] tracking-[0.26em] text-[#171410] uppercase transition-colors duration-300 hover:border-[#171410] hover:bg-[#171410] hover:text-[#f2ecdf]"
          >
            Dossier ↗
          </a>
        </div>
      </div>
    </header>
  );
}

/* ================================================================
   HERO — INTERACTIVE BLUEPRINT X-RAY SPLIT
   ================================================================ */

function Hero({ lenis }: { lenis: RefObject<Lenis | null> }) {
  const root = useRef<HTMLElement>(null);
  const [split, setSplit] = useState(34);
  const reduced = useReducedMotion();

  useLayoutEffect(() => {
    if (reduced) return;
    const ctx = gsap.context(() => {
      gsap.from("[data-vhero]", {
        y: 36,
        opacity: 0,
        duration: 1.15,
        ease: "expo.out",
        stagger: 0.1,
        delay: 0.15,
      });
    }, root);
    return () => ctx.revert();
  }, [reduced]);

  const handleMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const pct = Math.max(8, Math.min(92, ((e.clientX - r.left) / r.width) * 100));
    setSplit(pct);
  };

  return (
    <section ref={root} id="v-top" className="relative pt-20 md:pt-24">
      <div className="mx-auto max-w-[1680px] px-5 pt-8 pb-16 md:px-10 md:pt-12 md:pb-24">
        {/* Top architectural metadata bar */}
        <div
          data-vhero
          className="grid grid-cols-2 gap-4 border-b border-[#171410]/15 pb-5 font-mono text-[10px] tracking-[0.25em] text-[#171410]/55 uppercase md:grid-cols-4"
        >
          <span>Monograph Vol. IV — 2014–2026</span>
          <span>Lisbon · Mallorca · Kyoto</span>
          <span className="hidden md:inline">Datum: ±0.00m Mediterranean Mean</span>
          <span className="text-right text-[#a6732d]">4 Built Works / 12 in Archive</span>
        </div>

        {/* Display headline */}
        <div className="mt-8 grid grid-cols-12 items-end gap-x-6 gap-y-8 md:mt-12">
          <div className="col-span-12 lg:col-span-8">
            <h1
              data-vhero
              className="font-display text-[clamp(3rem,8.4vw,8.8rem)] leading-[0.92] font-light tracking-[-0.035em] text-[#171410]"
            >
              Architecture of{" "}
              <em className="font-light text-[#a6732d]">measured</em> silence &amp; stone.
            </h1>
          </div>
          <div data-vhero className="col-span-12 lg:col-span-4">
            <p className="max-w-md text-[15px] leading-relaxed font-light text-[#171410]/75">
              We design monolithic residences, bathhouses, and sanctuaries shaped by solar geometry, raw mineral mass, and the patient patina of local weather.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-6">
              <Magnetic>
                <a
                  href="#v-works"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToTarget(lenis.current, "#v-works", -40);
                  }}
                  className="inline-flex items-center gap-3 bg-[#171410] px-6 py-3.5 font-mono text-[10px] tracking-[0.28em] text-[#f2ecdf] uppercase transition-colors hover:bg-[#a6732d]"
                >
                  Inspect monographs ↓
                </a>
              </Magnetic>
              <a
                href="#v-heliodon"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToTarget(lenis.current, "#v-heliodon", -40);
                }}
                className="link-sweep font-mono text-[10px] tracking-[0.26em] text-[#171410] uppercase"
              >
                Open solar heliodon →
              </a>
            </div>
          </div>
        </div>

        {/* Interactive Photo / CAD Section Split Stage */}
        <div data-vhero className="mt-10 md:mt-14">
          <div
            onPointerMove={handleMove}
            data-vcursor="DRAG / MOVE X-RAY"
            className="group relative aspect-[16/9] max-h-[680px] w-full cursor-ew-resize overflow-hidden border border-[#171410]/20 bg-[#e6decb] select-none"
          >
            {/* Base layer: Photograph */}
            <img
              src="/images/v-hero.jpg"
              alt="Casa del Viento — travertine and concrete courtyard at golden hour"
              className="h-full w-full object-cover"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#171410]/35 via-transparent to-transparent" />

            {/* Clipped top layer: Precision CAD Longitudinal Section */}
            <div
              className="pointer-events-none absolute inset-0 overflow-hidden"
              style={{ clipPath: `inset(0 ${100 - split}% 0 0)` }}
            >
              <CadBlueprint kind="courtyard" />
            </div>

            {/* Vertical split rule & handle */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-y-0 z-10 w-px bg-[#a6732d]"
              style={{ left: `${split}%` }}
            >
              <div className="absolute top-1/2 -left-4 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-[#a6732d] bg-[#171410] font-mono text-[9px] text-[#f2ecdf] shadow-md">
                ↔
              </div>
            </div>

            {/* Corner technical badges */}
            <div className="pointer-events-none absolute top-4 left-4 bg-[#f2ecdf]/90 px-3 py-1.5 font-mono text-[10px] tracking-[0.24em] text-[#171410] uppercase backdrop-blur-sm">
              CAD SECTION AA&apos; ({Math.round(split)}%)
            </div>
            <div className="pointer-events-none absolute top-4 right-4 bg-[#171410]/85 px-3 py-1.5 font-mono text-[10px] tracking-[0.24em] text-[#f2ecdf] uppercase backdrop-blur-sm">
              V—01 CASA DEL VIENTO · 39.7492° N
            </div>
            <div className="pointer-events-none absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-between gap-2 text-[#f2ecdf]">
              <span className="bg-[#171410]/80 px-3 py-1 font-mono text-[10px] tracking-[0.24em] uppercase backdrop-blur-sm">
                Move cursor across frame to X-ray structural section
              </span>
              <div className="pointer-events-auto flex gap-1.5">
                {[
                  ["CAD 100%", 92],
                  ["50 / 50", 50],
                  ["Photo 100%", 8],
                ].map(([lbl, val]) => (
                  <button
                    key={lbl}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSplit(Number(val));
                    }}
                    className="bg-[#171410]/80 px-2.5 py-1 font-mono text-[9px] tracking-[0.22em] text-[#f2ecdf] uppercase transition-colors hover:bg-[#a6732d]"
                  >
                    {lbl}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ================================================================
   01 — SELECTED MONOGRAPHS (WITH CAD TOGGLE & DOSSIER DRAWER)
   ================================================================ */

function MonographModal({
  project,
  onClose,
  lenis,
}: {
  project: ArchProject;
  onClose: () => void;
  lenis: RefObject<Lenis | null>;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const l = lenis.current;
    l?.stop();
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      l?.start();
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [lenis, onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${project.name} architectural monograph`}
      className="backdrop-in fixed inset-0 z-[150] flex justify-end bg-[#171410]/65 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="drawer-in flex h-full w-full max-w-[780px] flex-col overflow-y-auto border-l border-[#171410]/20 bg-[#f2ecdf] text-[#171410]"
      >
        <div className="flex items-center justify-between border-b border-[#171410]/15 px-6 py-5 md:px-10">
          <div>
            <p className="font-mono text-[10px] tracking-[0.28em] text-[#a6732d] uppercase">
              {project.code} // {project.typology}
            </p>
            <p className="mt-0.5 font-mono text-[10px] tracking-[0.2em] text-[#171410]/50 uppercase">
              {project.coords} — {project.elevation}
            </p>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="border border-[#171410]/30 px-4 py-2 font-mono text-[10px] tracking-[0.25em] uppercase transition-colors hover:bg-[#171410] hover:text-[#f2ecdf]"
          >
            Close [ESC]
          </button>
        </div>

        <div className="grid grid-cols-1 border-b border-[#171410]/15 sm:grid-cols-2">
          <div className="aspect-[4/3] overflow-hidden border-b border-[#171410]/15 sm:border-r sm:border-b-0">
            <img src={project.image} alt={project.name} className="h-full w-full object-cover" />
          </div>
          <div className="aspect-[4/3] overflow-hidden">
            <CadBlueprint kind={project.cadKind} />
          </div>
        </div>

        <div className="flex-1 p-6 md:p-10">
          <div className="flex flex-wrap items-baseline justify-between gap-4">
            <h3 className="font-display text-4xl font-light tracking-[-0.03em] md:text-5xl">{project.name}</h3>
            <span className="font-mono text-xs tracking-[0.24em] text-[#a6732d] uppercase">
              {project.location} · {project.year}
            </span>
          </div>

          <p className="mt-6 text-base leading-relaxed font-light text-[#171410]/80">{project.narrative}</p>

          <div className="mt-8 grid grid-cols-2 gap-4 border-y border-[#171410]/15 py-6 sm:grid-cols-4">
            {project.metrics.map(([k, v]) => (
              <div key={k}>
                <p className="font-mono text-[9px] tracking-[0.24em] text-[#171410]/50 uppercase">{k}</p>
                <p className="mt-1.5 font-display text-xl font-light text-[#171410]">{v}</p>
              </div>
            ))}
          </div>

          <div className="mt-8">
            <p className="font-mono text-[10px] tracking-[0.28em] text-[#171410]/50 uppercase">
              Specified Material Palette
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {project.materials.map((m) => (
                <span
                  key={m}
                  className="border border-[#171410]/25 bg-[#e6decb]/60 px-3.5 py-1.5 font-mono text-[10px] tracking-[0.18em] uppercase"
                >
                  {m}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Works({ lenis }: { lenis: RefObject<Lenis | null> }) {
  const [mode, setMode] = useState<"split" | "photo" | "cad">("split");
  const [selected, setSelected] = useState<ArchProject | null>(null);

  return (
    <section id="v-works" className="border-t border-[#171410]/15 bg-[#f2ecdf] py-24 md:py-36">
      <div className="mx-auto max-w-[1680px] px-5 md:px-10">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="font-mono text-[10px] tracking-[0.32em] text-[#a6732d] uppercase">
              (01) — Selected Monographs
            </p>
            <h2 className="mt-4 font-display text-[clamp(2.4rem,5.8vw,5.6rem)] leading-[0.95] font-light tracking-[-0.03em]">
              Built works &amp; <em className="font-light text-[#a6732d]">section studies.</em>
            </h2>
          </div>

          {/* Global CAD / Photo view switcher */}
          <div className="flex items-center gap-1 border border-[#171410]/25 p-1" role="tablist" aria-label="Inspection mode">
            {(
              [
                ["split", "Split X-Ray"],
                ["photo", "Photograph"],
                ["cad", "CAD Section"],
              ] as const
            ).map(([k, label]) => (
              <button
                key={k}
                type="button"
                role="tab"
                aria-selected={mode === k}
                onClick={() => setMode(k)}
                className={`px-3.5 py-2 font-mono text-[10px] tracking-[0.22em] uppercase transition-colors ${
                  mode === k ? "bg-[#171410] text-[#f2ecdf]" : "text-[#171410]/65 hover:text-[#171410]"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-12 md:mt-20 md:grid-cols-2">
          {projects.map((p) => (
            <article
              key={p.id}
              data-rise
              className="group flex flex-col border border-[#171410]/20 bg-[#ebe4d4]/55 transition-colors hover:border-[#171410]/50"
            >
              {/* Header strip */}
              <div className="flex items-center justify-between border-b border-[#171410]/15 px-5 py-3.5 font-mono text-[10px] tracking-[0.24em] uppercase">
                <span className="text-[#a6732d]">{p.code}</span>
                <span className="text-[#171410]/60">{p.location}</span>
                <span>{p.year}</span>
              </div>

              {/* Visual stage */}
              <button
                type="button"
                onClick={() => setSelected(p)}
                data-vcursor="OPEN DOSSIER"
                className="relative aspect-[16/10] w-full overflow-hidden bg-[#dfd6c3] text-left"
              >
                {mode !== "cad" && (
                  <img
                    src={p.image}
                    alt={p.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-1000 ease-out group-hover:scale-[1.04]"
                  />
                )}
                {mode === "cad" && <CadBlueprint kind={p.cadKind} />}
                {mode === "split" && (
                  <div className="absolute inset-y-0 right-0 w-[46%] overflow-hidden border-l border-[#a6732d] transition-[width] duration-700 ease-out group-hover:w-[62%]">
                    <CadBlueprint kind={p.cadKind} />
                  </div>
                )}
                <span className="absolute bottom-3 left-3 bg-[#171410]/85 px-3 py-1 font-mono text-[9px] tracking-[0.24em] text-[#f2ecdf] uppercase">
                  {p.area} · {p.orientation}
                </span>
              </button>

              {/* Content */}
              <div className="flex flex-1 flex-col justify-between p-6 md:p-8">
                <div>
                  <div className="flex items-baseline justify-between gap-4">
                    <h3 className="font-display text-3xl font-light tracking-[-0.025em] md:text-4xl">{p.name}</h3>
                    <span className="font-display text-base italic text-[#a6732d]">{p.subtitle}</span>
                  </div>
                  <p className="mt-4 text-sm leading-relaxed font-light text-[#171410]/75">{p.blurb}</p>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-[#171410]/15 pt-4">
                  <div className="flex flex-wrap gap-2">
                    {p.materials.slice(0, 2).map((m) => (
                      <span key={m} className="font-mono text-[9px] tracking-[0.2em] text-[#171410]/55 uppercase">
                        · {m}
                      </span>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelected(p)}
                    className="link-sweep font-mono text-[10px] tracking-[0.25em] text-[#171410] uppercase"
                  >
                    Read Dossier →
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {selected && <MonographModal project={selected} onClose={() => setSelected(null)} lenis={lenis} />}
    </section>
  );
}

/* ================================================================
   02 — INTERACTIVE HELIODON (SOLAR & SHADOW STUDY)
   ================================================================ */

function HeliodonSection() {
  const [hour, setHour] = useState(16.2);

  // Compute live solar metrics from hour
  const dayT = Math.max(0, Math.min(1, (hour - 5.5) / 14.5));
  const altitude = Math.round(Math.sin(dayT * Math.PI) * 64 - (hour < 5.8 || hour > 19.6 ? 12 : 0));
  const azimuth = Math.round(72 + dayT * 216);
  const shadowRatio = altitude > 5 ? (1 / Math.tan((altitude * Math.PI) / 180)).toFixed(2) : "∞";

  return (
    <section id="v-heliodon" className="border-t border-[#171410]/15 bg-[#e6decb] py-24 md:py-36">
      <div className="mx-auto max-w-[1680px] px-5 md:px-10">
        <div className="grid grid-cols-12 items-end gap-x-6 gap-y-8">
          <div className="col-span-12 lg:col-span-7">
            <p className="font-mono text-[10px] tracking-[0.32em] text-[#a6732d] uppercase">
              (02) — Solar Heliodon Simulator
            </p>
            <h2 className="mt-4 font-display text-[clamp(2.4rem,5.6vw,5.4rem)] leading-[0.95] font-light tracking-[-0.03em]">
              Choreographing <em className="font-light text-[#a6732d]">shadow</em> across the equinox.
            </h2>
          </div>
          <p className="col-span-12 max-w-md text-sm leading-relaxed font-light text-[#171410]/75 lg:col-span-5">
            Every Verdant courtyard is modeled on a heliodon table before excavation. Scrub the solar clock below to observe how our walls cast cooling shade across the travertine plinth.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-12 gap-8 border border-[#171410]/20 bg-[#f2ecdf] p-5 md:p-8">
          {/* Interactive Canvas */}
          <div className="col-span-12 lg:col-span-8">
            <div className="relative aspect-[16/10] w-full overflow-hidden border border-[#171410]/20">
              <HeliodonCanvas hour={hour} />
              <div className="pointer-events-none absolute top-4 left-4 bg-[#f2ecdf]/90 px-3 py-1.5 font-mono text-[10px] tracking-[0.24em] text-[#171410] uppercase">
                LAT 39.75° N — SOLAR TIME {formatHour(hour)}
              </div>
            </div>
          </div>

          {/* Controls & Telemetry */}
          <div className="col-span-12 flex flex-col justify-between lg:col-span-4">
            <div>
              <div className="flex items-baseline justify-between border-b border-[#171410]/15 pb-4">
                <span className="font-mono text-[10px] tracking-[0.26em] text-[#171410]/55 uppercase">Solar Time</span>
                <span className="font-display text-4xl font-light tabular text-[#171410]">{formatHour(hour)}</span>
              </div>

              <label className="mt-6 block">
                <span className="font-mono text-[10px] tracking-[0.24em] text-[#a6732d] uppercase">
                  Scrub Sun Trajectory (05:00 — 22:00)
                </span>
                <input
                  type="range"
                  min={5}
                  max={22}
                  step={0.1}
                  value={hour}
                  onChange={(e) => setHour( parseFloat(e.target.value) )}
                  className="mt-3 h-1.5 w-full cursor-pointer appearance-none bg-[#171410]/20 accent-[#a6732d]"
                />
              </label>

              {/* Presets */}
              <div className="mt-6 grid grid-cols-2 gap-2">
                {solarPresets.map((p) => (
                  <button
                    key={p.label}
                    type="button"
                    onClick={() => setHour(p.hour)}
                    className={`border px-3 py-2.5 text-left font-mono text-[10px] tracking-[0.2em] uppercase transition-colors ${
                      Math.abs(hour - p.hour) < 0.6
                        ? "border-[#171410] bg-[#171410] text-[#f2ecdf]"
                        : "border-[#171410]/25 text-[#171410] hover:border-[#171410]"
                    }`}
                  >
                    <span className="block text-[#a6732d]">{formatHour(p.hour)}</span>
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <dl className="mt-8 grid grid-cols-3 gap-4 border-t border-[#171410]/15 pt-6">
              <div>
                <dt className="font-mono text-[9px] tracking-[0.22em] text-[#171410]/50 uppercase">Azimuth</dt>
                <dd className="mt-1 font-display text-2xl font-light tabular">{azimuth}°</dd>
              </div>
              <div>
                <dt className="font-mono text-[9px] tracking-[0.22em] text-[#171410]/50 uppercase">Altitude</dt>
                <dd className="mt-1 font-display text-2xl font-light tabular">{altitude}°</dd>
              </div>
              <div>
                <dt className="font-mono text-[9px] tracking-[0.22em] text-[#171410]/50 uppercase">Shadow L/H</dt>
                <dd className="mt-1 font-display text-2xl font-light tabular">{shadowRatio}×</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ================================================================
   03 — TACTILE MATERIAL ARCHIVE
   ================================================================ */

function MaterialsSection() {
  const [active, setActive] = useState(0);
  const spec = specimens[active];

  return (
    <section id="v-materials" className="border-t border-[#171410]/15 bg-[#171410] py-24 text-[#f2ecdf] md:py-36">
      <div className="mx-auto max-w-[1680px] px-5 md:px-10">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="font-mono text-[10px] tracking-[0.32em] text-[#c68e45] uppercase">
              (03) — Material Provenance &amp; Patina
            </p>
            <h2 className="mt-4 font-display text-[clamp(2.4rem,5.6vw,5.4rem)] leading-[0.95] font-light tracking-[-0.03em]">
              Five raw <em className="font-light text-[#c68e45]">minerals</em>, zero coatings.
            </h2>
          </div>
          <p className="max-w-sm font-mono text-[10px] leading-relaxed tracking-[0.22em] text-[#f2ecdf]/55 uppercase">
            Select a specimen from the studio archive to inspect its physical density and weathering behavior.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-12 gap-8">
          {/* Specimen selector list */}
          <div className="col-span-12 lg:col-span-6">
            <ul className="border-t border-[#f2ecdf]/15">
              {specimens.map((s, idx) => (
                <li key={s.id}>
                  <button
                    type="button"
                    onClick={() => setActive(idx)}
                    className={`flex w-full items-center justify-between gap-4 border-b border-[#f2ecdf]/15 px-4 py-5 text-left transition-colors ${
                      active === idx ? "bg-[#f2ecdf] text-[#171410]" : "hover:bg-[#f2ecdf]/5"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <span
                        className="h-7 w-7 shrink-0 border border-current/25"
                        style={{
                          background: `radial-gradient(circle at 30% 30%, ${s.swatch}, ${s.grain})`,
                        }}
                      />
                      <div>
                        <span className="block font-mono text-[9px] tracking-[0.24em] text-[#c68e45] uppercase">
                          {s.code}
                        </span>
                        <span className="font-display text-2xl font-light">{s.name}</span>
                      </div>
                    </div>
                    <span className="font-mono text-xs tabular opacity-70">{s.density}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Active Specimen Inspection Card */}
          <div className="col-span-12 lg:col-span-6">
            <div className="flex h-full flex-col justify-between border border-[#f2ecdf]/20 bg-[#1f1c17] p-7 md:p-10">
              <div className="flex items-start justify-between gap-6">
                <div>
                  <span className="font-mono text-[10px] tracking-[0.28em] text-[#c68e45] uppercase">
                    {spec.code} — {spec.origin}
                  </span>
                  <h3 className="mt-2 font-display text-3xl font-light md:text-4xl">{spec.name}</h3>
                </div>
                <div
                  className="h-20 w-20 shrink-0 border border-[#f2ecdf]/30 shadow-inner"
                  style={{
                    background: `repeating-linear-gradient(135deg, ${spec.swatch} 0px, ${spec.swatch} 6px, ${spec.grain} 6px, ${spec.grain} 12px)`,
                  }}
                />
              </div>

              <p className="mt-8 text-base leading-relaxed font-light text-[#f2ecdf]/80">{spec.notes}</p>

              <div className="mt-8 border-t border-[#f2ecdf]/15 pt-6">
                <p className="font-mono text-[10px] tracking-[0.25em] text-[#c68e45] uppercase">30-Year Weathering Curve</p>
                <p className="mt-2 text-sm font-light text-[#f2ecdf]/75">{spec.patina}</p>
              </div>

              <dl className="mt-8 grid grid-cols-2 gap-6 border-t border-[#f2ecdf]/15 pt-6">
                <div>
                  <dt className="font-mono text-[9px] tracking-[0.24em] text-[#f2ecdf]/45 uppercase">Bulk Density</dt>
                  <dd className="mt-1 font-display text-2xl font-light tabular">{spec.density}</dd>
                </div>
                <div>
                  <dt className="font-mono text-[9px] tracking-[0.24em] text-[#f2ecdf]/45 uppercase">Thermal Conductivity λ</dt>
                  <dd className="mt-1 font-display text-2xl font-light tabular">{spec.conductivity}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ================================================================
   04 — ETHOS & COMMISSION INQUIRY
   ================================================================ */

function EthosAndContact({ lenis }: { lenis: RefObject<Lenis | null> }) {
  const [typology, setTypology] = useState("Private Residence");
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("");
  const [submitted, setSubmitted] = useState<string | null>(null);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) return;
    const code = `VRD—2026—${Math.floor(100 + Math.random() * 899)}`;
    setSubmitted(code);
  };

  return (
    <>
      <section id="v-ethos" className="border-t border-[#171410]/15 bg-[#f2ecdf] py-24 md:py-36">
        <div className="mx-auto max-w-[1680px] px-5 md:px-10">
          <div className="grid grid-cols-12 gap-8">
            <div className="col-span-12 lg:col-span-4">
              <p className="font-mono text-[10px] tracking-[0.32em] text-[#a6732d] uppercase">(04) — Architectural Ethos</p>
              <h2 className="mt-4 font-display text-4xl leading-tight font-light md:text-5xl">
                Three rules of <em className="font-light text-[#a6732d]">restraint.</em>
              </h2>
            </div>
            <div className="col-span-12 grid gap-8 md:grid-cols-3 lg:col-span-8">
              {principles.map((p) => (
                <div key={p.n} className="border-t border-[#171410]/25 pt-5">
                  <span className="font-display text-lg italic text-[#a6732d]">{p.n}</span>
                  <h3 className="mt-3 font-display text-2xl font-light">{p.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed font-light text-[#171410]/75">{p.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="v-contact" className="border-t border-[#171410]/20 bg-[#ebe4d4] pt-24 pb-16 md:pt-36">
        <div className="mx-auto max-w-[1680px] px-5 md:px-10">
          <div className="grid grid-cols-12 gap-10">
            <div className="col-span-12 lg:col-span-6">
              <p className="font-mono text-[10px] tracking-[0.32em] text-[#a6732d] uppercase">
                (05) — New Commissions (2026–2028)
              </p>
              <h2 className="mt-4 font-display text-[clamp(2.6rem,6vw,5.8rem)] leading-[0.94] font-light tracking-[-0.03em]">
                Begin a <em className="font-light text-[#a6732d]">site study.</em>
              </h2>
              <p className="mt-6 max-w-md text-sm leading-relaxed font-light text-[#171410]/75">
                The atelier accepts four new projects each year. Every commission begins with a three-day topographical and solar survey on your land.
              </p>
              <div className="mt-10 grid grid-cols-2 gap-6 border-t border-[#171410]/15 pt-6 font-mono text-[10px] tracking-[0.22em] text-[#171410]/65 uppercase">
                <div>
                  <p className="text-[#171410]">Lisbon Practice</p>
                  <p className="mt-1">Rua do Salitre 142, 1250-204</p>
                </div>
                <div>
                  <p className="text-[#171410]">Mallorca Field Office</p>
                  <p className="mt-1">Carrer de la Pedra 8, Deià</p>
                </div>
              </div>
            </div>

            <div className="col-span-12 lg:col-span-6">
              {submitted ? (
                <div className="border border-[#171410] bg-[#f2ecdf] p-8">
                  <p className="font-mono text-[10px] tracking-[0.28em] text-[#a6732d] uppercase">
                    ● Dossier Registered — {submitted}
                  </p>
                  <p className="mt-4 font-display text-3xl font-light">
                    Thank you. Our senior partner will write to <span className="italic">{email}</span> within 48 hours to arrange an initial site dialogue.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSubmitted(null);
                      setEmail("");
                    }}
                    className="link-sweep mt-6 font-mono text-[10px] tracking-[0.25em] uppercase"
                  >
                    Register another inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={onSubmit} className="border border-[#171410]/20 bg-[#f2ecdf] p-7 md:p-10">
                  <p className="font-mono text-[10px] tracking-[0.26em] text-[#171410]/60 uppercase">Commission Typology</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {["Private Residence", "Cultural / Sanctuary", "Hospitality", "Landscape & Masterplan"].map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setTypology(t)}
                        className={`border px-3.5 py-2 font-mono text-[10px] tracking-[0.2em] uppercase transition-colors ${
                          typology === t
                            ? "border-[#171410] bg-[#171410] text-[#f2ecdf]"
                            : "border-[#171410]/25 text-[#171410] hover:border-[#171410]"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>

                  <div className="mt-6 grid gap-6 sm:grid-cols-2">
                    <label className="block">
                      <span className="font-mono text-[9px] tracking-[0.25em] text-[#171410]/60 uppercase">
                        Site Location / Coordinates
                      </span>
                      <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="e.g., Alentejo Coast / 37.6° N"
                        className="mt-2 w-full border-b border-[#171410]/30 bg-transparent py-2.5 text-sm focus:border-[#a6732d] focus:outline-none"
                      />
                    </label>
                    <label className="block">
                      <span className="font-mono text-[9px] tracking-[0.25em] text-[#171410]/60 uppercase">
                        Your Email *
                      </span>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="principal@domain.com"
                        className="mt-2 w-full border-b border-[#171410]/30 bg-transparent py-2.5 text-sm focus:border-[#a6732d] focus:outline-none"
                      />
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="mt-8 w-full bg-[#171410] py-4 font-mono text-[10px] tracking-[0.3em] text-[#f2ecdf] uppercase transition-colors hover:bg-[#a6732d]"
                  >
                    Request Preliminary Site Dossier →
                  </button>
                </form>
              )}
            </div>
          </div>

          <div className="mt-20 flex flex-wrap items-center justify-between gap-4 border-t border-[#171410]/15 pt-8 font-mono text-[10px] tracking-[0.25em] text-[#171410]/50 uppercase">
            <span>© 2026 Verdant — Atelier d&apos;Architecture &amp; Paysage</span>
            <button
              type="button"
              onClick={() => (lenis.current ? lenis.current.scrollTo(0, { duration: 1.6 }) : window.scrollTo(0, 0))}
              className="link-sweep text-[#171410]"
            >
              Return to Datum ±0.00 ↑
            </button>
          </div>
        </div>
      </section>
    </>
  );
}

/* ================================================================
   MAIN PAGE EXPORT
   ================================================================ */

export default function Verdant() {
  useBodyBg("#f2ecdf");
  const lenis = useLenis();
  useFontsRefresh();
  const root = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useLayoutEffect(() => {
    if (reduced) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-rise]").forEach((el) => {
        gsap.from(el, {
          y: 44,
          opacity: 0,
          duration: 1.05,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 92%", once: true },
        });
      });
    }, root);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <div ref={root} className="relative min-h-screen bg-[#f2ecdf] font-body text-[#171410]">
      <DraftingCursor />
      <VNav lenis={lenis} />
      <main>
        <Hero lenis={lenis} />
        <Works lenis={lenis} />
        <HeliodonSection />
        <MaterialsSection />
        <EthosAndContact lenis={lenis} />
      </main>
    </div>
  );
}
