import { useEffect, useRef } from "react";

/* ================================================================
   PRECISION ARCHITECTURAL CAD BLUEPRINT OVERLAYS
   ================================================================ */

export function CadBlueprint({
  kind,
  invert = false,
}: {
  kind: "courtyard" | "cantilever" | "cloister" | "pavilion";
  invert?: boolean;
}) {
  const stroke = invert ? "#f2ecdf" : "#171410";
  const accent = "#b37d33";
  const bg = invert ? "#141614" : "#ebe4d4";

  return (
    <svg
      viewBox="0 0 800 540"
      className="block h-full w-full select-none"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
    >
      <defs>
        <pattern id={`grid-${kind}-${invert ? "d" : "l"}`} width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke={stroke} strokeOpacity="0.1" strokeWidth="0.6" />
        </pattern>
        <pattern id={`hatch-${kind}-${invert ? "d" : "l"}`} width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="8" stroke={stroke} strokeOpacity="0.28" strokeWidth="1" />
        </pattern>
      </defs>

      <rect width="800" height="540" fill={bg} />
      <rect width="800" height="540" fill={`url(#grid-${kind}-${invert ? "d" : "l"})`} />

      {/* Structural grid axes A1 - A6 */}
      {[120, 240, 360, 480, 600, 680].map((x, idx) => (
        <g key={x}>
          <line x1={x} y1="28" x2={x} y2="500" stroke={stroke} strokeOpacity="0.18" strokeWidth="0.75" strokeDasharray="3 4" />
          <circle cx={x} cy="22" r="9" fill="none" stroke={stroke} strokeOpacity="0.45" strokeWidth="0.8" />
          <text x={x} y="25" textAnchor="middle" fill={stroke} fillOpacity="0.7" fontSize="8" fontFamily="JetBrains Mono, monospace">
            A{idx + 1}
          </text>
        </g>
      ))}

      {/* Datum levels */}
      {[
        { y: 150, label: "+6.40 m ROOF PARAPET" },
        { y: 260, label: "+3.20 m MEZZANINE SOFFIT" },
        { y: 390, label: "±0.00 m DATUM COURT" },
      ].map((d) => (
        <g key={d.y}>
          <line x1="48" y1={d.y} x2="752" y2={d.y} stroke={accent} strokeOpacity="0.45" strokeWidth="0.7" strokeDasharray="6 4" />
          <text x="54" y={d.y - 5} fill={accent} fontSize="8" fontFamily="JetBrains Mono, monospace">
            {d.label}
          </text>
        </g>
      ))}

      {kind === "courtyard" && (
        <g stroke={stroke} fill="none">
          {/* Ground mass */}
          <rect x="80" y="390" width="640" height="75" fill={`url(#hatch-${kind}-${invert ? "d" : "l"})`} strokeWidth="1.2" />
          {/* Left monolith volume */}
          <rect x="120" y="150" width="220" height="240" strokeWidth="1.5" />
          <rect x="120" y="150" width="220" height="26" fill={`url(#hatch-${kind}-${invert ? "d" : "l"})`} strokeWidth="1.2" />
          {/* Deep aperture reveal */}
          <rect x="160" y="210" width="110" height="180" strokeWidth="1" />
          <line x1="160" y1="210" x2="270" y2="390" strokeOpacity="0.25" strokeWidth="0.7" />
          {/* Central reflecting basin + solar ray */}
          <rect x="340" y="390" width="140" height="22" fill={accent} fillOpacity="0.18" stroke={accent} strokeWidth="1" />
          <circle cx="410" cy="315" r="42" stroke={accent} strokeOpacity="0.7" strokeWidth="1" strokeDasharray="2 3" />
          <line x1="410" y1="390" x2="410" y2="295" stroke={accent} strokeWidth="1.2" />
          {/* Right cantilevered pavilion */}
          <rect x="480" y="220" width="200" height="170" strokeWidth="1.5" />
          <rect x="440" y="200" width="250" height="20" fill={`url(#hatch-${kind}-${invert ? "d" : "l"})`} strokeWidth="1.3" />
          {/* Solar incidence vector */}
          <line x1="650" y1="70" x2="365" y2="390" stroke={accent} strokeWidth="1.2" />
          <text x="615" y="64" fill={accent} fontSize="8.5" fontFamily="JetBrains Mono, monospace">
            SOLAR ALT 62° SSW
          </text>
        </g>
      )}

      {kind === "cantilever" && (
        <g stroke={stroke} fill="none">
          <rect x="80" y="390" width="640" height="70" fill={`url(#hatch-${kind}-${invert ? "d" : "l"})`} strokeWidth="1.2" />
          {/* Sawtooth north-light trusses */}
          {[120, 260, 400, 540].map((x) => (
            <g key={x}>
              <polygon
                points={`${x},230 ${x + 115},150 ${x + 115},230`}
                fill={`url(#hatch-${kind}-${invert ? "d" : "l"})`}
                strokeWidth="1.4"
              />
              <line x1={x + 115} y1="150" x2={x + 140} y2="230" stroke={accent} strokeWidth="1.2" />
              {/* North light rays */}
              <line x1={x + 135} y1="90" x2={x + 60} y2="390" stroke={accent} strokeOpacity="0.45" strokeWidth="0.8" strokeDasharray="3 3" />
            </g>
          ))}
          <rect x="120" y="230" width="560" height="160" strokeWidth="1.5" />
          {[240, 360, 480, 600].map((x) => (
            <line key={x} x1={x} y1="230" x2={x} y2="390" strokeWidth="1.2" />
          ))}
        </g>
      )}

      {kind === "cloister" && (
        <g stroke={stroke} fill="none">
          {/* Subterranean rock mass */}
          <rect x="80" y="130" width="640" height="330" fill={`url(#hatch-${kind}-${invert ? "d" : "l"})`} strokeWidth="1.4" />
          {/* Carved thermal chambers */}
          <rect x="130" y="200" width="150" height="190" fill={bg} strokeWidth="1.5" />
          <rect x="310" y="170" width="210" height="220" fill={bg} strokeWidth="1.5" />
          <rect x="550" y="220" width="130" height="170" fill={bg} strokeWidth="1.5" />
          {/* Oculi light shafts */}
          <rect x="190" y="130" width="28" height="70" fill={bg} stroke={accent} strokeWidth="1.1" />
          <rect x="400" y="130" width="34" height="40" fill={bg} stroke={accent} strokeWidth="1.1" />
          {/* Thermal water level */}
          <rect x="130" y="345" width="550" height="45" fill={accent} fillOpacity="0.2" stroke={accent} strokeWidth="1" />
        </g>
      )}

      {kind === "pavilion" && (
        <g stroke={stroke} fill="none">
          {/* Floating basalt pads */}
          <rect x="80" y="405" width="640" height="55" fill={`url(#hatch-${kind}-${invert ? "d" : "l"})`} strokeWidth="1.1" />
          {/* Deep cantilevered hipped roof */}
          <polygon
            points="95,235 400,155 705,235 650,252 150,252"
            fill={`url(#hatch-${kind}-${invert ? "d" : "l"})`}
            strokeWidth="1.5"
          />
          {/* Raised engawa platform */}
          <rect x="180" y="365" width="440" height="18" fill={`url(#hatch-${kind}-${invert ? "d" : "l"})`} strokeWidth="1.4" />
          {[220, 340, 460, 580].map((x) => (
            <g key={x}>
              <line x1={x} y1="252" x2={x} y2="365" strokeWidth="1.6" />
              <rect x={x - 10} y="383" width="20" height="22" fill={stroke} fillOpacity="0.25" strokeWidth="1" />
            </g>
          ))}
          {/* Dimension callout for 3.60m cantilever */}
          <line x1="95" y1="295" x2="220" y2="295" stroke={accent} strokeWidth="1.1" />
          <text x="157" y="288" textAnchor="middle" fill={accent} fontSize="8.5" fontFamily="JetBrains Mono, monospace">
            3.60m EAVE
          </text>
        </g>
      )}

      {/* Titleblock footer */}
      <g transform="translate(48, 488)">
        <line x1="0" y1="0" x2="704" y2="0" stroke={stroke} strokeOpacity="0.4" strokeWidth="0.8" />
        <text x="0" y="18" fill={stroke} fillOpacity="0.65" fontSize="8.5" fontFamily="JetBrains Mono, monospace">
          SCALE 1:100 — LONGITUDINAL SECTION AA&apos;
        </text>
        <text x="704" y="18" textAnchor="end" fill={accent} fontSize="8.5" fontFamily="JetBrains Mono, monospace">
          VERDANT ARCHIVE // DWG—2026
        </text>
      </g>
    </svg>
  );
}

/* ================================================================
   INTERACTIVE HELIODON (SOLAR & SHADOW ARCHITECTURAL SIMULATOR)
   ================================================================ */

export function HeliodonCanvas({ hour }: { hour: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = canvas.clientWidth || 800;
    const h = canvas.clientHeight || 480;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Normalize daylight progress (6:00 sunrise -> 19:30 sunset)
    const dayT = Math.max(0, Math.min(1, (hour - 5.5) / 14.5));
    const isNight = hour < 5.8 || hour > 19.6;
    const sunArc = Math.sin(dayT * Math.PI); // 0 at horizon, 1 at noon

    // Sky / ground palette interpolation
    const bgTop = isNight ? "#121513" : sunArc > 0.55 ? "#eae3d2" : "#dfd1bc";
    const bgBot = isNight ? "#1b1f1c" : sunArc > 0.55 ? "#dfd5c0" : "#cbb699";
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, bgTop);
    grad.addColorStop(1, bgBot);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Subtle architectural grid
    ctx.strokeStyle = isNight ? "rgba(242,236,223,0.06)" : "rgba(23,20,16,0.06)";
    ctx.lineWidth = 1;
    const step = 44;
    for (let x = 0; x < w; x += step) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 0; y < h; y += step) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // Sun position along elliptical path
    const cx = w * 0.5;
    const cy = h * 0.58;
    const rx = w * 0.38;
    const ry = h * 0.42;
    const angle = Math.PI - dayT * Math.PI; // East (left) to West (right)
    const sunX = cx + Math.cos(angle) * rx;
    const sunY = cy - Math.sin(angle) * ry;

    // Draw solar trajectory arc
    ctx.save();
    ctx.setLineDash([4, 6]);
    ctx.strokeStyle = isNight ? "rgba(198,142,69,0.3)" : "rgba(166,115,45,0.45)";
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.ellipse(cx, cy, rx, ry, 0, Math.PI, 0, false);
    ctx.stroke();
    ctx.restore();

    // Shadow vector from sun relative to pavilion center
    const shadowScale = isNight ? 0.35 : Math.max(0.28, 1.55 - sunArc * 1.15);
    const dx = ((cx - sunX) / rx) * 140 * shadowScale;
    const dy = Math.max(18, (1 - sunArc) * 85 + 22);

    // Courtyard plinth base
    const px = w * 0.22;
    const py = h * 0.42;
    const pw = w * 0.56;
    const ph = h * 0.38;

    ctx.fillStyle = isNight ? "#222622" : "#e5dcc8";
    ctx.strokeStyle = isNight ? "rgba(242,236,223,0.22)" : "rgba(23,20,16,0.28)";
    ctx.lineWidth = 1.2;
    ctx.fillRect(px, py, pw, ph);
    ctx.strokeRect(px, py, pw, ph);

    // Reflecting pool
    const poolX = px + pw * 0.28;
    const poolY = py + ph * 0.24;
    const poolW = pw * 0.46;
    const poolH = ph * 0.52;
    const poolGrad = ctx.createLinearGradient(poolX, poolY, poolX + poolW, poolY + poolH);
    if (isNight) {
      poolGrad.addColorStop(0, "#1c2826");
      poolGrad.addColorStop(1, "#2b3830");
    } else {
      poolGrad.addColorStop(0, "#9aa79e");
      poolGrad.addColorStop(1, "#c7bfa9");
    }
    ctx.fillStyle = poolGrad;
    ctx.fillRect(poolX, poolY, poolW, poolH);
    ctx.strokeRect(poolX, poolY, poolW, poolH);

    // Architectural walls/volumes that cast real-time shadows
    const blocks = [
      { x: px + pw * 0.08, y: py + ph * 0.14, w: pw * 0.16, h: ph * 0.68, heightFactor: 1.0, label: "WEST LOGGIA" },
      { x: px + pw * 0.32, y: py + ph * 0.08, w: pw * 0.48, h: ph * 0.11, heightFactor: 0.75, label: "NORTH WALL" },
      { x: px + pw * 0.78, y: py + ph * 0.28, w: pw * 0.14, h: ph * 0.54, heightFactor: 1.15, label: "TOWER" },
    ];

    // Cast polygon shadows for each architectural mass
    ctx.fillStyle = isNight ? "rgba(6, 8, 7, 0.55)" : `rgba(23, 20, 16, ${0.16 + sunArc * 0.18})`;
    blocks.forEach((b) => {
      const sx = dx * b.heightFactor;
      const sy = dy * b.heightFactor;
      ctx.beginPath();
      ctx.moveTo(b.x, b.y + b.h);
      ctx.lineTo(b.x + b.w, b.y + b.h);
      ctx.lineTo(b.x + b.w + sx, b.y + b.h + sy);
      ctx.lineTo(b.x + sx, b.y + b.h + sy);
      ctx.closePath();
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(b.x + b.w, b.y);
      ctx.lineTo(b.x + b.w, b.y + b.h);
      ctx.lineTo(b.x + b.w + sx, b.y + b.h + sy);
      ctx.lineTo(b.x + b.w + sx, b.y + sy);
      ctx.closePath();
      ctx.fill();
    });

    // Draw the travertine roof masses on top of shadows
    blocks.forEach((b) => {
      ctx.fillStyle = isNight ? "#323632" : "#f4efe4";
      ctx.strokeStyle = isNight ? "#c68e45" : "#171410";
      ctx.lineWidth = 1.4;
      ctx.fillRect(b.x, b.y, b.w, b.h);
      ctx.strokeRect(b.x, b.y, b.w, b.h);
    });

    // Warm nocturnal submerged pool glow or daytime solar ray lines
    if (isNight) {
      const glow = ctx.createRadialGradient(
        poolX + poolW * 0.5,
        poolY + poolH * 0.5,
        4,
        poolX + poolW * 0.5,
        poolY + poolH * 0.5,
        poolW * 0.65
      );
      glow.addColorStop(0, "rgba(198, 142, 69, 0.42)");
      glow.addColorStop(1, "rgba(198, 142, 69, 0)");
      ctx.fillStyle = glow;
      ctx.fillRect(px, py, pw, ph);
    } else {
      // Sun orb
      const sunGlow = ctx.createRadialGradient(sunX, sunY, 2, sunX, sunY, 44);
      sunGlow.addColorStop(0, "rgba(198, 142, 69, 0.95)");
      sunGlow.addColorStop(1, "rgba(198, 142, 69, 0)");
      ctx.fillStyle = sunGlow;
      ctx.beginPath();
      ctx.arc(sunX, sunY, 44, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#a6732d";
      ctx.beginPath();
      ctx.arc(sunX, sunY, 6, 0, Math.PI * 2);
      ctx.fill();
    }

    // Compass rose in top-right
    const compX = w - 54;
    const compY = 54;
    ctx.strokeStyle = isNight ? "rgba(242,236,223,0.45)" : "rgba(23,20,16,0.45)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(compX, compY, 20, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(compX, compY - 24);
    ctx.lineTo(compX, compY + 24);
    ctx.moveTo(compX - 24, compY);
    ctx.lineTo(compX + 24, compY);
    ctx.stroke();
    ctx.fillStyle = "#a6732d";
    ctx.font = "9px 'JetBrains Mono', monospace";
    ctx.textAlign = "center";
    ctx.fillText("N", compX, compY - 28);
  }, [hour]);

  return <canvas ref={canvasRef} className="block h-full w-full" />;
}
