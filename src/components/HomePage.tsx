"use client";

import { useState } from "react";
import { LoadingScreen } from "@/components/layout/LoadingScreen";
import { Navbar } from "@/components/layout/Navbar";
import { ScrollProgress } from "@/components/layout/ScrollProgress";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Pillars } from "@/components/sections/Pillars";
import { Services } from "@/components/sections/Services";
import { Impact } from "@/components/sections/Impact";
import { Industries } from "@/components/sections/Industries";
import { Mission } from "@/components/sections/Mission";
import { Team } from "@/components/sections/Team";
import { Contact } from "@/components/sections/Contact";
import type { PublicSiteData } from "@/types/cms";

export function HomePage({ data }: { data: PublicSiteData }) {
  const [loaded, setLoaded] = useState(false);
  const {
    content,
    services,
    pillars,
    marketStats,
    industries,
    riskItems,
    successStories,
    team,
  } = data;

  return (
    <>
      {!loaded && <LoadingScreen onComplete={() => setLoaded(true)} />}
      <ScrollProgress />
      <Navbar />
      <main id="main-content">
        <Hero content={content} />
        <About content={content} />
        <Pillars pillars={pillars} content={content} />
        <Services services={services} content={content} />
        <Impact
          content={content}
          marketStats={marketStats}
          riskItems={riskItems}
          successStories={successStories}
        />
        <Industries industries={industries} content={content} />
        <Mission content={content} />
        <Team team={team} content={content} />
        <Contact content={content} />
      </main>
      <Footer content={content} />
    </>
  );
}
