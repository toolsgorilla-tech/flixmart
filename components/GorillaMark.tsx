export default function GorillaMark({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <linearGradient id="fmMarkGrad" x1="4" y1="4" x2="44" y2="44" gradientUnits="userSpaceOnUse">
          <stop stopColor="#6366F1" />
          <stop offset="0.55" stopColor="#8B5CF6" />
          <stop offset="1" stopColor="#06B6D4" />
        </linearGradient>
      </defs>
      <rect x="1" y="1" width="46" height="46" rx="14" fill="url(#fmMarkGrad)" fillOpacity="0.16" />
      <rect x="1" y="1" width="46" height="46" rx="14" stroke="url(#fmMarkGrad)" strokeWidth="1.5" />
      <path d="M14 34V14h19v4H19v4h11v4H19v8h-5Z" fill="url(#fmMarkGrad)" />
      <path d="M29 14h5v20h-5z" fill="white" fillOpacity="0.9" />
    </svg>
  );
}
