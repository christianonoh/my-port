import Head from "../../components/Head";
import "../globals.css";

export default function StudioLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <Head />
      <body>{children}</body>
    </html>
  );
}
