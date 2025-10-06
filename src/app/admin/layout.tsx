import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Panel de Administración - Prohausen",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
