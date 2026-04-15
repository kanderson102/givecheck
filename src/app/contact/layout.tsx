import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact — GiveCheck",
  description:
    "Get in touch with the GiveCheck team. Questions, partnerships, or feedback — we would love to hear from you.",
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
