type Props = {
  sport: string;
  className?: string;
};

export default function SportIcon({ sport, className = "w-6 h-6" }: Props) {
  const norm = sport.toLowerCase();

  if (norm === "swimming") {
    return (
      <svg
        viewBox="0 0 24 24"
        className={className}
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M18 15c-1.24 0-1.91.34-2.45.61c-.46.23-.79.39-1.56.39s-1.09-.17-1.55-.39c-.54-.27-1.21-.61-2.45-.61s-1.91.34-2.45.61c-.46.23-.79.39-1.55.39s-1.09-.17-1.55-.39C3.9 15.34 3.23 15 1.99 15v2c.76 0 1.09.17 1.55.39c.54.27 1.21.61 2.45.61s1.91-.34 2.45-.61c.46-.23.79-.39 1.55-.39s1.09.17 1.55.39c.54.27 1.21.61 2.45.61s1.91-.34 2.45-.61c.46-.23.79-.39 1.56-.39s1.1.17 1.56.39c.54.27 1.21.61 2.45.61v-2c-.77 0-1.1-.17-1.56-.39c-.54-.27-1.21-.61-2.45-.61m0 4c-1.24 0-1.91.34-2.45.61c-.46.23-.79.39-1.56.39s-1.09-.17-1.55-.39c-.54-.27-1.21-.61-2.45-.61s-1.91.34-2.45.61c-.46.23-.79.39-1.55.39s-1.09-.17-1.55-.39C3.9 19.34 3.23 19 1.99 19v2c.76 0 1.09.17 1.55.39c.54.27 1.21.61 2.45.61s1.91-.34 2.45-.61c.46-.23.79-.39 1.55-.39s1.09.17 1.55.39c.54.27 1.21.61 2.45.61s1.91-.34 2.45-.61c.46-.23.79-.39 1.56-.39s1.1.17 1.56.39c.54.27 1.21.61 2.45.61v-2c-.77 0-1.1-.17-1.56-.39c-.54-.27-1.21-.61-2.45-.61M17 5c0-1.65-1.35-3-3-3s-3 1.35-3 3v1h2V5c0-.55.45-1 1-1s1 .45 1 1v2h-5V5c0-1.65-1.35-3-3-3S4 3.35 4 5v1h2V5c0-.55.45-1 1-1s1 .45 1 1v2H2v2h6v5h2V9h5v5h2V9h5V7h-5z" />
      </svg>
    );
  }

  if (norm === "football") {
    return (
      <svg
        viewBox="0 0 24 24"
        className={className}
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M12 2C6.49 2 2 6.49 2 12s4.49 10 10 10s10-4.49 10-10S17.51 2 12 2m6.23 15H16l-1.25 2.5c-.86.32-1.78.5-2.75.5s-1.89-.18-2.75-.5L8 17H5.77a8 8 0 0 1-1.63-3.53L6 10.99L4.78 8.56a8.02 8.02 0 0 1 4.79-4.19L12 5.99l2.43-1.62c2.11.68 3.84 2.21 4.79 4.19L18 11l1.86 2.48A8.1 8.1 0 0 1 18.24 17Z" />
        <path d="m8.5 11l1.5 4h4l1.5-4L12 8.5z" />
      </svg>
    );
  }

  if (norm === "badminton") {
    return (
      <svg
        viewBox="0 0 24 24"
        className={className}
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M20.48 10.92c.16-.32.28-.67.32-1.04a3.2 3.2 0 0 0-.92-2.64c-.59-.59-1.39-.89-2.2-.9c-.01-.84-.34-1.63-.94-2.23a3.2 3.2 0 0 0-2.64-.92c-.37.04-.71.16-1.03.32c-.15-.31-.35-.6-.61-.85a3.2 3.2 0 0 0-3.07-.84A3.18 3.18 0 0 0 7.1 4.03l-2.41 8.2l-1.23 1.23C2.52 14.4 2 15.66 2 17s.52 2.59 1.46 3.54S5.72 22 7 22s2.56-.49 3.54-1.46l1.23-1.23l8.2-2.41c1.1-.32 1.93-1.18 2.21-2.29s-.03-2.26-.84-3.07a3.2 3.2 0 0 0-.85-.61Zm-1.67-1.26c-.04.37-.25.7-.56.89l-.55.35c-.12.06-.24.11-.35.18l-7.37 4.64l-.14-.14l6.92-6.92c.46-.46 1.26-.46 1.72 0c.26.26.39.63.35 1Zm-4.48-4.48c.37-.04.73.08 1 .35c.23.23.36.54.36.86s-.13.63-.36.86l-6.92 6.92l-.14-.14l4.64-7.37c.07-.11.12-.23.18-.35l.35-.56c.2-.32.52-.52.89-.56Zm-5.31-.59c.12-.42.44-.73.87-.83c.43-.11.85 0 1.16.32c.36.36.44.88.24 1.33l-4.48 7.16l-.11-.11l2.31-7.87ZM4.87 19.11c-.57-.57-.88-1.32-.88-2.12s.31-1.55.88-2.12s4.24 4.24 4.24 4.24a3 3 0 0 1-4.24 0m15.36-5.01c-.05.2-.24.69-.83.87l-7.87 2.31l-.11-.11l7.17-4.48c.45-.19.97-.11 1.33.24c.44.44.37.96.32 1.16Z" />
      </svg>
    );
  }

  if (norm === "cricket") {
    return (
      <svg
        viewBox="0 0 24 24"
        className={className}
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="m6 2l4 2m4-1l4-1" />
        <circle cx="12" cy="13" r="2" />
        <path d="M6 7v15m7-15l-.3 4.1m-.2 3.8L12 22m6-15v15" />
      </svg>
    );
  }

  if (norm === "tennis") {
    return (
      <svg
        viewBox="0 0 24 24"
        className={className}
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M6 6c3 3 3 9 0 12" />
        <path d="M18 6c-3 3-3 9 0 12" />
      </svg>
    );
  }

  if (norm === "basketball") {
    return (
      <svg
        viewBox="0 0 24 24"
        className={className}
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M12 2v20M2 12h20" />
        <path d="M6.2 6.2c3 3 3 9 0 11.6" />
        <path d="M17.8 6.2c-3 3-3 9 0 11.6" />
      </svg>
    );
  }

  if (norm === "volleyball") {
    return (
      <svg
        viewBox="0 0 24 24"
        className={className}
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M6.3 3.8a16.55 16.55 0 0 0 1.9 11.5M20.7 17a12.8 12.8 0 0 0-8.7-5a13.3 13.3 0 0 1 0-10" />
        <path d="M22 11.1c-.8-.6-1.7-1.3-2.6-1.8c-3-1.7-6.1-2.5-8.3-2.2m-3.3 14c1-.4 1.9-.8 2.9-1.4c3-1.7 5.2-4 6.1-6.1M12 12a12.6 12.6 0 0 1-8.7 5" />
      </svg>
    );
  }

  if (norm === "pickleball") {
    return (
      <svg
        viewBox="0 0 24 24"
        className={className}
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M7.075 14.475q.475.475 1.05.7t1.2.225t1.2-.225t1.05-.7l.9-.9q.475-.475.7-1.05t.225-1.2t-.225-1.187t-.7-1.038l-3.8-3.8q-.3-.3-.712-.3t-.713.3L3.3 9.275q-.3.3-.3.7t.3.7zM18.575 22L12.7 16.125q-.725.65-1.612.95t-1.788.3q-1 0-1.937-.375t-1.688-1.125l-3.8-3.775q-.425-.425-.65-.987T1 9.975t.225-1.137t.65-.988L5.85 3.875q.425-.425.988-.65T7.974 3t1.138.225t.987.65l3.775 3.8q.75.75 1.125 1.688t.375 1.937q0 .9-.312 1.788T14.1 14.7l5.9 5.9zM19.5 9q-1.45 0-2.475-1.025T16 5.5t1.025-2.475T19.5 2t2.475 1.025T23 5.5t-1.025 2.475T19.5 9m0-2q.625 0 1.063-.437T21 5.5t-.437-1.062T19.5 4t-1.062.438T18 5.5t.438 1.063T19.5 7M8.15 10.15" />
      </svg>
    );
  }

  // Default fallback
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
  );
}
