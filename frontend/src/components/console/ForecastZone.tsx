"use client";

/**
 * Maps Zambretti forecast strings to simple SVG weather icons.
 * All icons are 40x40 amber-stroke line art.
 */

type IconType = "sun" | "sun-cloud" | "cloud" | "cloud-rain" | "cloud-heavy" | "storm" | "unknown";

function classifyForecast(forecast: string | null | undefined): IconType {
  if (!forecast) return "unknown";
  const f = forecast.toLowerCase();

  if (/storm|very unsettled/.test(f)) return "storm";
  if (/rain at times|rain at frequent|rainy|showery.*later/.test(f)) return "cloud-heavy";
  if (/shower|rain/.test(f)) return "cloud-rain";
  if (/unsettled|changeable|less settled/.test(f)) return "cloud";
  if (/becoming fine|fairly fine.*showers|fine.*possible/.test(f)) return "sun-cloud";
  if (/settled|fine|fair|very fine/.test(f)) return "sun";

  return "cloud"; // default fallback
}

function WeatherIcon({ type }: { type: IconType }) {
  const stroke = "#d4a574";
  const dimStroke = "rgba(212, 165, 116, 0.5)";

  return (
    <svg
      viewBox="0 0 40 40"
      className="h-20 w-20"
      style={{ filter: "drop-shadow(0 0 3px rgba(232, 196, 154, 0.7)) drop-shadow(0 0 8px rgba(212, 165, 116, 0.4))" }}
      aria-hidden="true"
    >
      {type === "sun" && (
        <>
          <circle cx="20" cy="20" r="7" fill="none" stroke={stroke} strokeWidth="1.5" />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => {
            const rad = (a * Math.PI) / 180;
            return (
              <line
                key={a}
                x1={20 + 10 * Math.cos(rad)} y1={20 + 10 * Math.sin(rad)}
                x2={20 + 13 * Math.cos(rad)} y2={20 + 13 * Math.sin(rad)}
                stroke={stroke} strokeWidth="1.5" strokeLinecap="round"
              />
            );
          })}
        </>
      )}

      {type === "sun-cloud" && (
        <>
          {/* Small sun peeking top-right */}
          <circle cx="28" cy="13" r="5" fill="none" stroke={stroke} strokeWidth="1.2" />
          {[0, 60, 120, 180, 240, 300].map((a) => {
            const rad = (a * Math.PI) / 180;
            return (
              <line
                key={a}
                x1={28 + 7 * Math.cos(rad)} y1={13 + 7 * Math.sin(rad)}
                x2={28 + 9 * Math.cos(rad)} y2={13 + 9 * Math.sin(rad)}
                stroke={dimStroke} strokeWidth="1" strokeLinecap="round"
              />
            );
          })}
          {/* Cloud below */}
          <path
            d="M8,28 Q8,22 14,22 Q15,18 20,18 Q26,18 27,22 Q32,22 32,28 Z"
            fill="none" stroke={stroke} strokeWidth="1.3" strokeLinejoin="round"
          />
        </>
      )}

      {type === "cloud" && (
        <path
          d="M7,26 Q7,20 13,20 Q14,15 20,15 Q27,15 28,20 Q34,20 34,26 Z"
          fill="none" stroke={stroke} strokeWidth="1.5" strokeLinejoin="round"
        />
      )}

      {type === "cloud-rain" && (
        <>
          <path
            d="M7,22 Q7,16 13,16 Q14,11 20,11 Q27,11 28,16 Q34,16 34,22 Z"
            fill="none" stroke={stroke} strokeWidth="1.3" strokeLinejoin="round"
          />
          {/* Rain drops */}
          <line x1="14" y1="26" x2="12" y2="32" stroke={dimStroke} strokeWidth="1" strokeLinecap="round" />
          <line x1="20" y1="26" x2="18" y2="32" stroke={dimStroke} strokeWidth="1" strokeLinecap="round" />
          <line x1="26" y1="26" x2="24" y2="32" stroke={dimStroke} strokeWidth="1" strokeLinecap="round" />
        </>
      )}

      {type === "cloud-heavy" && (
        <>
          <path
            d="M7,20 Q7,14 13,14 Q14,9 20,9 Q27,9 28,14 Q34,14 34,20 Z"
            fill="none" stroke={stroke} strokeWidth="1.3" strokeLinejoin="round"
          />
          {/* More rain drops */}
          <line x1="12" y1="24" x2="10" y2="30" stroke={stroke} strokeWidth="1" strokeLinecap="round" />
          <line x1="17" y1="25" x2="15" y2="31" stroke={stroke} strokeWidth="1" strokeLinecap="round" />
          <line x1="22" y1="24" x2="20" y2="30" stroke={stroke} strokeWidth="1" strokeLinecap="round" />
          <line x1="27" y1="25" x2="25" y2="31" stroke={stroke} strokeWidth="1" strokeLinecap="round" />
        </>
      )}

      {type === "storm" && (
        <>
          <path
            d="M7,18 Q7,12 13,12 Q14,7 20,7 Q27,7 28,12 Q34,12 34,18 Z"
            fill="none" stroke={stroke} strokeWidth="1.3" strokeLinejoin="round"
          />
          {/* Lightning bolt */}
          <polyline
            points="22,21 18,28 22,28 19,36"
            fill="none" stroke="#e8c49a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
          />
        </>
      )}

      {type === "unknown" && (
        <text x="20" y="24" textAnchor="middle" fill={dimStroke} fontSize="20">&mdash;</text>
      )}
    </svg>
  );
}

interface ForecastZoneProps {
  forecast: string | null | undefined;
}

export default function ForecastZone({ forecast }: ForecastZoneProps) {
  const iconType = classifyForecast(forecast);

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <WeatherIcon type={iconType} />
      <p className="font-mono text-center text-lg leading-snug vfd-dot-matrix">
        {forecast ?? "\u2014"}
      </p>
    </div>
  );
}
