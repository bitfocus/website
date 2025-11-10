import type { ReactNode } from "react";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import Heading from "@theme/Heading";

import landingStyles from "./landing.module.css";

function HeroSection() {
  return (
    <section className={landingStyles.heroSection}>
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <img
          alt="Companion Icon"
          width="128"
          height="128"
          src="img/companion-logo.png"
        />
      </div>
      <Heading as="h1" className={landingStyles.heroTitle}>
        <span>Companion</span>
      </Heading>
      <p
        className={landingStyles.heroSubtitle}
        style={{ fontWeight: 600, fontSize: "1.25rem", marginBottom: "2rem" }}
      >
        Versatile shotbox for everybody
      </p>
      <p
        style={{
          marginBottom: "3rem",
          maxWidth: "48rem",
          margin: "0 auto 3rem auto",
          textAlign: "center",
          fontSize: "1.125rem",
          lineHeight: "1.75rem",
        }}
      >
        Companion elevates the affordable Elgato Stream Deck and similar devices
        into professional control surfaces for an extensive range of equipment
        and applications. From presentation switchers and broadcast equipment to
        video playback software and home automation systems, Companion delivers
        studio-grade control, putting powerful workflows right at your
        fingertips.
      </p>

      <div
        className={landingStyles.heroButtons}
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "0.5rem",
          maxWidth: "64rem",
          margin: "0 auto",
        }}
      >
        <Link
          className={landingStyles.primaryButton}
          href="https://bfoc.us/djzdpq4g9g"
          target="_blank"
          style={{
            position: "relative",
            paddingTop: "0.25rem",
            paddingBottom: "0.25rem",
            lineHeight: "1.25",
          }}
        >
          Download
          <br />
          <span style={{ fontSize: "0.75rem" }}>Win / Mac / Linux</span>
        </Link>
        <Link className={landingStyles.secondaryButton} to="/user-guide/">
          User Guide
        </Link>
        <Link
          className={landingStyles.secondaryButton}
          href="https://bfoc.us/42jn7eku7p"
          target="_blank"
        >
          Donate
        </Link>
      </div>
    </section>
  );
}

function FeaturesAndVideoSection() {
  return (
    <section className={landingStyles.featuresSection}>
      <div className={landingStyles.sectionContainer}>
        <div className={landingStyles.featuresVideoContainer}>
          <div className={landingStyles.featuresContent}>
            <p style={{ fontSize: "1rem", marginBottom: "1rem" }}>
              You don't need an actual stream deck to use it. Companion both
              comes with a builtin stream deck emulator, a webpage for touch
              screens and the ability to trigger buttons via OSC, TCP, UDP,
              HTTP, WebSocket and ArtNet. It does the same job, just without the
              buttons.
            </p>
            <ul
              style={{
                listStyleType: "disc",
                paddingLeft: "3rem",
                fontSize: "0.875rem",
                lineHeight: "1.5",
              }}
            >
              <li>
                Button designer - Either with colored text or upload your own
                images
              </li>
              <li>
                Feedback - Devices can give feedback to buttons to display state
              </li>
              <li>
                Stacked actions - Run multiple actions from the same button
              </li>
              <li>
                Delayed actions - Set delay time individually for each action
              </li>
              <li>
                Multi device - Have multiple stream decks connected at once
              </li>
              <li>
                Web admin - Configure the system from any browser in the network
              </li>
              <li>
                Web buttons - Virtual web buttons for mobile/tablet/browser
              </li>
              <li>
                Latching - Separate actions for key down and up, and ability to
                latch/toggle
              </li>
              <li>
                Streamdeck Plugin - Use companion buttons in the native stream
                deck application
              </li>
            </ul>
          </div>
          <div className={landingStyles.videoContainer}>
            <iframe
              className={landingStyles.videoEmbed}
              src="https://www.youtube.com/embed/Xn95LuF6x6I"
              allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function BenefitsSection() {
  return (
    <section className={landingStyles.benefitsSection}>
      <div className={landingStyles.sectionContainer}>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "2.5rem",
            justifyContent: "center",
          }}
        >
          <div style={{ textAlign: "center", flex: "1 1 300px", maxWidth: "400px" }}>
            <div style={{ marginBottom: "1rem" }}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                style={{ width: "2.5rem", height: "2.5rem", margin: "0 auto" }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
                />
              </svg>
            </div>
            <h3
              style={{
                fontSize: "0.875rem",
                fontWeight: 500,
                color: "#111827",
                marginBottom: "0.5rem",
              }}
            >
              Free and open source!
            </h3>
            <p style={{ fontSize: "0.875rem", color: "#6b7280" }}>
              Companion will always stay free, open source and community driven.
              You're very welcome to help us by contributing or donating!
            </p>
          </div>
          <div style={{ textAlign: "center", flex: "1 1 300px", maxWidth: "400px" }}>
            <div style={{ marginBottom: "1rem" }}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                style={{ width: "2.5rem", height: "2.5rem", margin: "0 auto" }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 13.5V3.75m0 9.75a1.5 1.5 0 0 1 0 3m0-3a1.5 1.5 0 0 0 0 3m0 3.75V16.5m12-3V3.75m0 9.75a1.5 1.5 0 0 1 0 3m0-3a1.5 1.5 0 0 0 0 3m0 3.75V16.5m-6-9V3.75m0 3.75a1.5 1.5 0 0 1 0 3m0-3a1.5 1.5 0 0 0 0 3m0 9.75V10.5"
                />
              </svg>
            </div>
            <h3
              style={{
                fontSize: "0.875rem",
                fontWeight: 500,
                color: "#111827",
                marginBottom: "0.5rem",
              }}
            >
              Trusted by your local technician
            </h3>
            <p style={{ fontSize: "0.875rem", color: "#6b7280" }}>
              Most places you go in the AV and broadcast industry, you can find
              someone using Companion for something. We're very proud of that.
            </p>
          </div>
          <div style={{ textAlign: "center", flex: "1 1 300px", maxWidth: "400px" }}>
            <div style={{ marginBottom: "1rem" }}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                style={{ width: "2.5rem", height: "2.5rem", margin: "0 auto" }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1 1 21.75 8.25Z"
                />
              </svg>
            </div>
            <h3
              style={{
                fontSize: "0.875rem",
                fontWeight: 500,
                color: "#111827",
                marginBottom: "0.5rem",
              }}
            >
              Companion is brand agnostic
            </h3>
            <p style={{ fontSize: "0.875rem", color: "#6b7280" }}>
              Not a part of a closed eco system. The project strive to be as
              open as possible, and support controlling as many products as
              possible, regardless of brand.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function GitHubSection() {
  return (
    <section className={landingStyles.githubSection}>
      <div className={landingStyles.sectionContainer}>
        <Link href="https://bfoc.us/4orxauukeg" target="_blank">
          <img
            alt="github"
            src="img/github_logo.png"
            width={120}
            height={32}
            style={{
              opacity: 0.5,
              margin: "0 auto",
              transition: "opacity 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.8")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.5")}
          />
        </Link>
        <Heading
          as="h3"
          className={landingStyles.githubTitle}
          style={{
            fontSize: "1.25rem",
            marginBottom: "2rem",
            marginTop: "1rem",
          }}
        >
          Open Source on GitHub
        </Heading>
        <p
          className={landingStyles.githubDescription}
          style={{ fontSize: "1rem", maxWidth: "42rem", margin: "0 auto" }}
        >
          Companion is completely open source and welcomes contributions from
          the community. Whether you're fixing bugs, adding features, or
          creating new device modules, your contributions help make Companion
          better for everyone.
        </p>
      </div>
    </section>
  );
}

export default function Home(): ReactNode {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={`${siteConfig.title} User Guide`}
      description="Companion elevates the affordable Elgato Stream Deck and similar devices into professional control surfaces for an extensive range of equipment and applications. From presentation switchers and broadcast equipment to video playback software and home automation systems, Companion delivers studio-grade control, putting powerful workflows right at your fingertips."
    >
      <main>
        <HeroSection />
        <FeaturesAndVideoSection />
        <BenefitsSection />
        <GitHubSection />
      </main>
    </Layout>
  );
}
