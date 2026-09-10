import { createFileRoute } from "@tanstack/react-router";

import { Header } from "@/components/site/Header";
import { Hero } from "@/components/site/Hero";
import {
  About,
  ClientPains,
  Services,
  Process,
  WhoItsFor,
  Differentials,
  Solutions,
  Faq,
} from "@/components/site/Sections";
import { EbookOffer } from "@/components/site/EbookOffer";
import { ContactCta } from "@/components/site/ContactCta";
import { Footer } from "@/components/site/Footer";
import { SectionRail } from "@/components/site/SectionRail";
import { MobileTabBar } from "@/components/site/MobileTabBar";

const TITLE = "SinalZero — E-book e SaaS de presença digital e sinal de mercado";
const DESCRIPTION =
  "A SinalZero ensina presença digital e sinal de mercado no e-book Fora do Balcão e sustenta o crescimento contínuo com um SaaS que projeta sua empresa para mais clientes.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "SinalZero",
          description: DESCRIPTION,
          url: "https://sinalzero.vercel.app",
        }),
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div id="page-shell" className="page-shell min-h-screen bg-background">
      <Header />
      <SectionRail />
            <main>
        <Hero />
        <About />
        <ClientPains />
        <Services />
        <Process />
        <WhoItsFor />
        <Differentials />
        <Solutions />
        <EbookOffer />
        <Faq />
        <ContactCta />
      </main>
      <MobileTabBar />
      <Footer />
    </div>
  );
}
