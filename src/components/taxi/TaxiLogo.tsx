export default function TaxiLogo({ size = 80 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Shadow ellipse */}
      <ellipse cx="60" cy="108" rx="36" ry="7" fill="rgba(0,136,204,0.18)" />

      {/* Car body — main */}
      <rect x="14" y="58" width="92" height="36" rx="10" fill="url(#bodyGrad)" />

      {/* Roof / cabin */}
      <path
        d="M34 58 C36 42 44 34 56 32 L74 32 C84 32 90 42 88 58 Z"
        fill="url(#roofGrad)"
      />

      {/* Windshield */}
      <path
        d="M38 57 C39 46 46 38 56 36 L72 36 C80 36 85 44 85 57 Z"
        fill="url(#glassGrad)"
        opacity="0.85"
      />

      {/* Rear window */}
      <rect x="36" y="38" width="10" height="18" rx="3" fill="url(#glassGrad)" opacity="0.6" />

      {/* Checker stripe */}
      <rect x="14" y="70" width="92" height="8" fill="none" />
      {[0,1,2,3,4,5,6,7,8,9,10,11].map(i => (
        <rect key={i} x={14 + i * 8} y={70} width={4} height={8}
          fill={i % 2 === 0 ? "#FFD600" : "#1a1a1a"} opacity="0.9"
        />
      ))}

      {/* Left wheel */}
      <circle cx="34" cy="97" r="13" fill="#1a1a2e" />
      <circle cx="34" cy="97" r="8" fill="#2d3561" />
      <circle cx="34" cy="97" r="4" fill="#c8d6e5" />
      <circle cx="34" cy="97" r="1.5" fill="#ffffff" />

      {/* Right wheel */}
      <circle cx="86" cy="97" r="13" fill="#1a1a2e" />
      <circle cx="86" cy="97" r="8" fill="#2d3561" />
      <circle cx="86" cy="97" r="4" fill="#c8d6e5" />
      <circle cx="86" cy="97" r="1.5" fill="#ffffff" />

      {/* Headlight */}
      <ellipse cx="104" cy="72" rx="5" ry="4" fill="url(#lightGrad)" />
      <ellipse cx="104" cy="72" rx="3" ry="2.5" fill="#fffde7" opacity="0.9" />

      {/* Tail light */}
      <ellipse cx="16" cy="72" rx="5" ry="4" fill="#ff4444" opacity="0.85" />
      <ellipse cx="16" cy="72" rx="2.5" ry="2" fill="#ff8888" opacity="0.7" />

      {/* Door line */}
      <line x1="60" y1="58" x2="60" y2="90" stroke="rgba(0,0,0,0.12)" strokeWidth="1.5" />

      {/* Door handle */}
      <rect x="48" y="72" width="8" height="2.5" rx="1.2" fill="rgba(255,255,255,0.5)" />
      <rect x="66" y="72" width="8" height="2.5" rx="1.2" fill="rgba(255,255,255,0.5)" />

      {/* Roof highlight */}
      <ellipse cx="62" cy="54" rx="18" ry="4" fill="rgba(255,255,255,0.18)" />

      {/* Taxi sign on roof */}
      <rect x="50" y="26" width="24" height="10" rx="3" fill="#FFD600" />
      <rect x="51" y="27" width="22" height="8" rx="2" fill="#FFD600" />
      <text x="62" y="34" textAnchor="middle" fontSize="6" fontWeight="bold" fill="#1a1a1a" fontFamily="Arial">TAXI</text>

      {/* Gradients */}
      <defs>
        <linearGradient id="bodyGrad" x1="60" y1="58" x2="60" y2="94" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#2AABEE" />
          <stop offset="100%" stopColor="#006aad" />
        </linearGradient>
        <linearGradient id="roofGrad" x1="60" y1="32" x2="60" y2="58" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#3bbdf5" />
          <stop offset="100%" stopColor="#1a96d4" />
        </linearGradient>
        <linearGradient id="glassGrad" x1="60" y1="36" x2="60" y2="57" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#b3e8ff" />
          <stop offset="100%" stopColor="#6ecef5" />
        </linearGradient>
        <linearGradient id="lightGrad" x1="100" y1="70" x2="108" y2="74" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#fffde7" />
          <stop offset="100%" stopColor="#ffe082" />
        </linearGradient>
      </defs>
    </svg>
  );
}
