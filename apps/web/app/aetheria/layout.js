import styles from "./aetheria.module.css";

export const metadata = {
  title: "Aetheria — SaaS spend, brought into focus",
  description:
    "Find unused SaaS seats, get ahead of renewals, and bring company software spend into one clear view.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="light" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,400,0,0&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={styles.aetheria}>{children}</body>
    </html>
  );
}
