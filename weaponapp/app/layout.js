import "./globals.css";
import CustomCursor from "./components/ui/CustomCursor";

export const metadata = {
  title: "Monster Hunter World Weapon Trees",
  description: "a website that displays weapon in MHWorld",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="cursor-none">
        <CustomCursor></CustomCursor>
        {children}
      </body>
    </html>
  );
}
