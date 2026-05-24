# Enterprise CI/CD Security

Enterprise-grade Docusaurus documentation and blog platform focused on CI/CD Security, DevSecOps, SCM Security, GitHub Actions Security, Application Security, and Software Supply Chain Security.

Live site:

```text
https://narendra486.github.io/devsecops-blogs/
```

Repository:

```text
https://github.com/narendra486/devsecops-blogs
```

## What This Platform Teaches

- CI/CD Security fundamentals
- Shift Left Security
- SCM and GitHub Security
- GitHub Actions Security
- Local and pre-commit scanning
- Pull Request Security
- SAST, SCA, secret scanning, IaC scanning, and container scanning
- Kubernetes Security in CI/CD
- SARIF and PR security comments
- Security Quality Gates
- Reusable security workflows
- Supply Chain Security
- SBOM, SLSA, and artifact signing
- OIDC and secure cloud deployments
- Self-hosted runner security
- Enterprise DevSecOps governance
- Policy as Code
- Real-world CI/CD attacks

## Project Structure

```text
docs/
blog/
static/
src/
.github/workflows/
scripts/
```

## Install

```bash
npm install
```

## Local Development

```bash
npm start
```

For this GitHub Pages project, local Docusaurus runs at:

```text
http://localhost:3000/devsecops-blogs/
```

## Build

```bash
npm run build
```

## Serve Production Build Locally

```bash
npm run serve
```

## Generate Practical Content

The documentation and blog series is generated from:

```text
scripts/rewrite-practical-content.mjs
```

Run:

```bash
npm run generate:content
```

Then build and review:

```bash
npm run build
```

## GitHub Pages Deployment

GitHub Pages deployment is configured in:

```text
.github/workflows/deploy-github-pages.yml
```

Flow:

```text
Push to main
  -> GitHub Actions
  -> npm ci
  -> npm run build
  -> Upload Pages artifact
  -> Deploy to GitHub Pages
```

GitHub repository settings:

```text
Settings
  -> Pages
  -> Source: GitHub Actions
```

The Docusaurus config uses:

```js
url: 'https://narendra486.github.io'
baseUrl: '/devsecops-blogs/'
```

## Cloudflare Pages Deployment

Cloudflare Pages can also host this project.

Cloudflare Pages settings:

```text
Framework preset: Docusaurus
Build command: npm run build
Build output directory: build
Node.js version: 24
```

Recommended environment variable:

```text
NODE_VERSION=24
```

For a custom domain on Cloudflare Pages, update `docusaurus.config.js`:

```js
url: 'https://your-domain.com'
baseUrl: '/'
```

For the current GitHub Pages deployment, keep:

```js
url: 'https://narendra486.github.io'
baseUrl: '/devsecops-blogs/'
```

## Content Standard

Every major article should include:

- Introduction
- Real-world scenario
- Architecture overview with Mermaid
- Technical deep dive
- YAML examples
- Vulnerable and secure examples
- Security risks
- Mitigation
- PR experience
- Enterprise recommendations
- Summary
