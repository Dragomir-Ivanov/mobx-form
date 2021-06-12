import Link from "@docusaurus/Link"
import useDocusaurusContext from "@docusaurus/useDocusaurusContext"
import Layout from "@theme/Layout"
import clsx from "clsx"
import React from "react"
import EmbedCodesandbox from "../components/EmbedCodesandbox"
import HomepageFeatures from "../components/HomepageFeatures"
import styles from "./index.module.css"

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext()
  return (
    <header className={clsx("hero hero--primary", styles.heroBanner)}>
      <div className="container">
        <h1 className="hero__title">{siteConfig.title}</h1>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/intro"
          >
            Docs
          </Link>
          <Link
            className="button button--outline button--lg margin-left--md"
            to="https://github.com/mozartspa/mobx-form"
          >
            GitHub
          </Link>
        </div>
      </div>
    </header>
  )
}

export default function Home() {
  const { siteConfig } = useDocusaurusContext()
  return (
    <Layout
      title={`Hello from ${siteConfig.title}`}
      description="Description will go into a meta tag in <head />"
    >
      <HomepageHeader />
      <main>
        <HomepageFeatures />
        <EmbedCodesandbox src="https://codesandbox.io/embed/framer-motion-side-menu-forked-flj6y?fontsize=14&hidenavigation=1&theme=dark" />
      </main>
    </Layout>
  )
}
