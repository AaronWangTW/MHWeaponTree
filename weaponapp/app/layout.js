import "./globals.css";

export const metadata = {
  title: "Monster Hunter World Weapon Trees",
  description: "a website that displays weapon in MHWorld",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
