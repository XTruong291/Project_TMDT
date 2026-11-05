import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

export function RyvoLogo({ className, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 160 40"
      xmlSpace="preserve"
      aria-hidden="true"
      className={className}
      {...props}
    >
      <g fill="currentColor">
        {/* Letter R */}
        <path d="M12 6h16c6.6 0 12 5.4 12 12 0 4.2-2.2 7.9-5.5 10l6.5 12h-9.5l-5.5-10.5h-5.5v10.5h-9v-34zm9 8v9h7c2.2 0 4-1.8 4-4.5s-1.8-4.5-4-4.5h-7z" />
        {/* Letter Y */}
        <path d="M52 6l8.5 15.5v18.5h9v-18.5l8.5-15.5h-10l-3 7-3-7h-10z" />
        {/* Letter V */}
        <path d="M85 6l9.5 34h9l9.5-34h-9.5l-4.5 18-4.5-18h-10z" />
        {/* Letter O with Acoustic Center Driver */}
        <path d="M136 6c-9.4 0-17 7.6-17 17s7.6 17 17 17 17-7.6 17-17-7.6-17-17-17zm0 25.5c-4.7 0-8.5-3.8-8.5-8.5s3.8-8.5 8.5-8.5 8.5 3.8 8.5 8.5-3.8 8.5-8.5 8.5z" />
        <circle cx="136" cy="23" r="3" />
      </g>
    </svg>
  );
}

// Backward compatibility alias so existing imports work seamlessly
export const RayconLogo = RyvoLogo;

export function SearchIcon({ className, ...props }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      fill="none"
      className={className}
      {...props}
    >
      <circle cx="9" cy="9" r="4.75" stroke="currentColor" strokeWidth="1.5" />
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="m12.5 12.5 3.25 3.25"
      />
    </svg>
  );
}

export function CartIcon({ className, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 20.511 26.564"
      aria-hidden="true"
      className={className}
      {...props}
    >
      <path
        fill="currentColor"
        d="M20.511,22.365,19.529,7.86h0a.744.744,0,0,0-.732-.686H15.386V5.468A5.3,5.3,0,0,0,10.26,0,5.309,5.309,0,0,0,5.125,5.468V7.174H1.705a.744.744,0,0,0-.732.686h0L0,22.365v.046a4.088,4.088,0,0,0,4.152,4.152H16.359a4.088,4.088,0,0,0,4.152-4.152ZM6.59,5.468a3.867,3.867,0,0,1,3.661-4,3.807,3.807,0,0,1,3.661,4V7.174H6.59V5.468ZM16.359,25.1H4.152a2.649,2.649,0,0,1-2.688-2.688L2.391,8.638H18.111l.927,13.773A2.636,2.636,0,0,1,16.359,25.1Z"
      />
    </svg>
  );
}

export function StarIcon({ className, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...props}>
      <path
        fill="currentColor"
        d="M12 2.5l2.94 5.96 6.56.95-4.75 4.63 1.12 6.54L12 17.49l-5.87 3.09 1.12-6.54-4.75-4.63 6.56-.95z"
      />
    </svg>
  );
}

export function ChevronIcon({ className, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <path
        d="M7 4.5 13 10 7 15.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function MenuIcon({ className, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...props}>
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        d="M4 7h16M4 12h16M4 17h16"
      />
    </svg>
  );
}

export function CloseIcon({ className, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...props}>
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        d="M6 6l12 12M18 6 6 18"
      />
    </svg>
  );
}

export function InstagramIcon({ className, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" className={className} aria-hidden="true" {...props}>
      <path
        fill="currentColor"
        d="M10.034 1.763h2.644c.407 0 .881 0 1.424.068.474 0 .881.067 1.152.135.271.068.543.136.678.203.271.068.475.204.61.34.136.135.34.27.543.406.203.204.339.34.407.543.067.203.203.406.339.61.067.203.135.407.203.678.068.27.135.678.135 1.152 0 .543.068 1.017.068 1.424v5.288c0 .407 0 .882-.068 1.424 0 .474-.067.881-.135 1.152-.068.272-.136.543-.203.678a1.31 1.31 0 0 1-.34.61c-.135.204-.27.34-.406.543-.204.203-.34.339-.543.407-.203.135-.406.203-.61.27-.203.069-.407.137-.678.204a4.868 4.868 0 0 1-1.152.136c-.543 0-1.017.068-1.424.068H7.39c-.407 0-.882 0-1.424-.068-.474 0-.881-.068-1.152-.136-.272-.067-.543-.135-.678-.203-.272-.068-.475-.203-.61-.271-.204-.136-.34-.271-.543-.407-.203-.203-.34-.339-.407-.543-.067-.203-.203-.407-.271-.61-.067-.271-.135-.475-.203-.678-.068-.271-.136-.678-.136-1.152 0-.543-.068-1.017-.068-1.424V7.39c0-.407 0-.882.068-1.424 0-.474.068-.881.136-1.152.068-.271.136-.543.203-.678.068-.272.204-.475.271-.61.136-.204.271-.34.407-.543.136-.136.34-.271.543-.34.135-.136.407-.204.61-.339.203-.068.407-.136.678-.203.271-.068.678-.135 1.152-.135.543 0 1.017-.068 1.424-.068h2.644zM10 5.4A4.6 4.6 0 1 0 14.6 10 4.6 4.6 0 0 0 10 5.4zm0 7.6A3 3 0 1 1 13 10a3 3 0 0 1-3 3zm5.85-8.85a1.1 1.1 0 1 0 1.1 1.1 1.1 1.1 0 0 0-1.1-1.1z"
      />
    </svg>
  );
}

export function YoutubeIcon({ className, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 21 20" className={className} aria-hidden="true" {...props}>
      <path
        fill="currentColor"
        d="M-.196 15.803q0 1.23.812 2.092t1.977.861h14.946q1.165 0 1.977-.861t.812-2.092V3.909q0-1.23-.82-2.116T17.539.907H2.593q-1.148 0-1.969.886t-.82 2.116v11.894zm7.465-2.149V6.058q0-.115.066-.18.049-.016.082-.016l.082.016 7.153 3.806q.066.066.066.164 0 .066-.066.131l-7.153 3.806q-.033.033-.066.033-.066 0-.098-.033-.066-.066-.066-.131z"
      />
    </svg>
  );
}

export function FacebookIcon({ className, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true" {...props}>
      <path
        fill="currentColor"
        d="M18.56 31.36V17.28h4.48l.64-5.12h-5.12v-3.2c0-1.28.64-2.56 2.56-2.56h2.56V1.28H19.2c-3.84 0-7.04 2.56-7.04 7.04v3.84H7.68v5.12h4.48v14.08h6.4z"
      />
    </svg>
  );
}

export function TwitterIcon({ className, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" className={className} aria-hidden="true" {...props}>
      <path
        fill="currentColor"
        d="M19.551 4.208q-.815 1.202-1.956 2.038 0 .082.02.255t.02.255q0 1.589-.469 3.179t-1.426 3.036-2.272 2.567-3.158 1.793-3.963.672q-3.301 0-6.031-1.773.571.041.937.041 2.751 0 4.911-1.671-1.284-.02-2.292-.784T2.456 11.85q.346.082.754.082.55 0 1.039-.163-1.365-.285-2.262-1.365T1.09 7.918v-.041q.774.408 1.773.448-.795-.53-1.263-1.396t-.469-1.864q0-1.019.509-1.997 1.487 1.854 3.596 2.924T9.81 7.184q-.143-.509-.143-.897 0-1.63 1.161-2.781t2.832-1.151q.815 0 1.569.326t1.284.917q1.345-.265 2.506-.958-.428 1.386-1.732 2.18 1.243-.163 2.262-.611z"
      />
    </svg>
  );
}
