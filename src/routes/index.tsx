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

const TITLE = "SinalZero — Prospecção inteligente de leads e produtos digitais";
const DESCRIPTION =
  "A SinalZero encontra e qualifica leads para empresas que querem vender mais, e cria os sites e produtos digitais que transformam interesse em contato.";

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
          url: "https://linktr.ee/SinalZero",
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
      <Footer />
    </div>
  );
}
