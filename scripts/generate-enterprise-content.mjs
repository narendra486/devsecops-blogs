import {mkdirSync, writeFileSync} from 'node:fs';
import {dirname} from 'node:path';

const author = 'Narendra Palla';

const docs = [
  ['introduction', 'Introduction', 'The complete starting point for practical CI/CD Security and Enterprise DevSecOps learning.', ['DevSecOps flow', 'How to use this platform', 'Learning path', 'Audience and outcomes']],
  ['cicd-security-fundamentals', 'CI/CD Security Fundamentals', 'Why CI/CD pipelines are production trust boundaries and how attackers abuse weak delivery systems.', ['CI/CD basics', 'Pipeline attack surface', 'Shared responsibility', 'Security maturity levels']],
  ['shift-left-security', 'Shift Left Security', 'How security starts before git push and continues through pull requests, CI, release, and runtime.', ['Local feedback', 'Pre-commit controls', 'PR enforcement', 'Runtime drift']],
  ['scm-security', 'SCM Security', 'How to protect source code management systems, branches, commits, pull requests, and repository permissions.', ['Git fundamentals', 'Repository attacks', 'Branch protection', 'Commit signing', 'CODEOWNERS']],
  ['github-security', 'GitHub Security', 'GitHub-native security controls for repositories, organizations, rulesets, Dependabot, and code ownership.', ['Rulesets', 'Repository permissions', 'Dependabot', 'Secret scanning', 'Security alerts']],
  ['github-actions-security', 'GitHub Actions Security', 'How to secure workflows, jobs, runners, actions, secrets, permissions, and deployment paths.', ['GITHUB_TOKEN', 'Action pinning', 'Fork PR risks', 'OIDC', 'Reusable workflows']],
  ['local-security-scanning', 'Local Security Scanning', 'Fast developer feedback using local scanning before code reaches GitHub.', ['Gitleaks', 'TruffleHog', 'Semgrep local', 'npm audit', 'pip-audit']],
  ['pre-commit-security', 'Pre-Commit Security', 'Use pre-commit and Git hooks to stop obvious mistakes before Git history is created.', ['pre-commit', 'Husky', 'Secret prevention', 'Fast hooks', 'Developer experience']],
  ['pull-request-security', 'Pull Request Security', 'PRs as the main policy enforcement point for SAST, SCA, secrets, IaC, and container checks.', ['Required checks', 'PR comments', 'SARIF', 'Quality gates', 'Review automation']],
  ['sast-security', 'SAST Security', 'Static application security testing for insecure code, taint flow, rule tuning, and false positive handling.', ['CodeQL', 'Semgrep', 'Snyk Code', 'SonarQube', 'Taint analysis']],
  ['sca-security', 'SCA Security', 'Dependency security for vulnerable packages, transitive dependencies, and malicious package risks.', ['Dependabot', 'OSV Scanner', 'Snyk Open Source', 'Trivy', 'Typosquatting']],
  ['secret-scanning', 'Secret Scanning', 'Prevent API keys, cloud credentials, GitHub tokens, SSH keys, and passwords from leaking.', ['Gitleaks', 'GitHub Secret Scanning', 'TruffleHog', 'Secret rotation', 'Repository history']],
  ['iac-security', 'IaC Security', 'Scan Terraform, Kubernetes manifests, and cloud configuration before deployment.', ['Checkov', 'tfsec', 'Trivy config', 'KICS', 'Cloud misconfigurations']],
  ['container-security', 'Container Security', 'Secure Dockerfiles, base images, image builds, package vulnerabilities, and runtime defaults.', ['Trivy', 'Grype', 'Root containers', 'Minimal images', 'Image quality gates']],
  ['kubernetes-security', 'Kubernetes Security in CI/CD', 'Secure Kubernetes manifests and deployment controls before workloads reach clusters.', ['Pod security', 'Admission control', 'RBAC', 'Secrets', 'Network policy']],
  ['security-quality-gates', 'Security Quality Gates', 'Block pull requests and releases based on practical risk thresholds.', ['Severity thresholds', 'Fail-open', 'Fail-close', 'Risk acceptance', 'Scorecards']],
  ['sarif-and-pr-comments', 'SARIF and PR Comments', 'Use SARIF, annotations, GitHub checks, and PR comments to make security feedback developer-friendly.', ['SARIF upload', 'Code scanning', 'Reviewdog', 'Inline comments', 'Checks API']],
  ['reusable-security-workflows', 'Reusable Security Workflows', 'Centralize security checks so AppSec and platform teams can scale across many repositories.', ['Reusable workflows', 'Workflow inputs', 'Org standards', 'Versioning', 'Governance']],
  ['supply-chain-security', 'Supply Chain Security', 'Protect dependencies, build systems, maintainers, artifacts, and release provenance.', ['Dependency confusion', 'Malicious packages', 'SolarWinds', 'Codecov', 'XZ Utils']],
  ['sbom-and-slsa', 'SBOM and SLSA', 'Generate software bills of materials and improve build provenance maturity using SLSA principles.', ['SBOM', 'CycloneDX', 'SPDX', 'SLSA', 'Provenance']],
  ['artifact-signing', 'Artifact Signing', 'Sign and verify container images and artifacts using Sigstore and Cosign.', ['Cosign', 'Sigstore', 'Keyless signing', 'Verification', 'Release trust']],
  ['oidc-and-cloud-security', 'OIDC and Cloud Security', 'Use short-lived cloud credentials instead of long-lived secrets in CI/CD.', ['OIDC', 'AWS roles', 'Azure federation', 'GCP workload identity', 'Least privilege']],
  ['branch-protection-and-rulesets', 'Branch Protection and Rulesets', 'Protect important branches with required checks, approvals, CODEOWNERS, and organization rulesets.', ['Branch protection', 'Rulesets', 'Required checks', 'Approvals', 'CODEOWNERS']],
  ['self-hosted-runner-security', 'Self-Hosted Runner Security', 'Secure self-hosted runners, reduce persistence risk, and isolate untrusted workloads.', ['Runner isolation', 'Ephemeral runners', 'Fork PR risk', 'Network access', 'Secrets']],
  ['enterprise-devsecops', 'Enterprise DevSecOps', 'Scale AppSec with reusable workflows, shared platforms, governance, and developer-friendly automation.', ['Security platform', 'Central workflows', 'Multi-repo rollout', 'Dashboards', 'Operating model']],
  ['security-governance', 'Security Governance', 'Turn security policy into practical engineering controls with ownership and exception handling.', ['Ownership', 'Policy rollout', 'Exception process', 'Metrics', 'Executive reporting']],
  ['policy-as-code', 'Policy as Code', 'Use code-based policies for repeatable and reviewable security decisions.', ['OPA', 'Conftest', 'Regula', 'Checkov policies', 'GitOps']],
  ['real-world-attacks', 'Real-World Attacks', 'Study real CI/CD and supply chain incidents to understand how delivery systems are compromised.', ['SolarWinds', 'Codecov', 'Dependency confusion', 'XZ Utils', 'Compromised tokens']],
  ['best-practices', 'Best Practices', 'A practical checklist for securing modern CI/CD pipelines from local development to production.', ['Local checks', 'PR checks', 'CI hardening', 'CD controls', 'Enterprise governance']],
];

const blogPosts = [
  ['2026-05-23-01-why-cicd-security-matters', 'Why CI/CD Security Matters'],
  ['2026-05-23-02-understanding-shift-left-security', 'Understanding Shift Left Security'],
  ['2026-05-23-03-scm-security-with-github', 'SCM Security with GitHub'],
  ['2026-05-23-04-github-actions-security-fundamentals', 'GitHub Actions Security Fundamentals'],
  ['2026-05-23-05-securing-developers-before-git-push', 'Securing Developers Before Git Push'],
  ['2026-05-23-06-local-security-scanning-with-pre-commit', 'Local Security Scanning with pre-commit'],
  ['2026-05-23-07-pull-request-security-architecture', 'Pull Request Security Architecture'],
  ['2026-05-23-08-sast-in-modern-cicd', 'SAST in Modern CI/CD'],
  ['2026-05-23-09-dependency-and-sca-security', 'Dependency and SCA Security'],
  ['2026-05-23-10-preventing-secret-leaks', 'Preventing Secret Leaks'],
  ['2026-05-23-11-iac-security-with-terraform-and-kubernetes', 'IaC Security with Terraform and Kubernetes'],
  ['2026-05-23-12-container-security-in-cicd', 'Container Security in CI/CD'],
  ['2026-05-23-13-security-quality-gates', 'Security Quality Gates'],
  ['2026-05-23-14-understanding-sarif-and-pr-security-comments', 'Understanding SARIF and PR Security Comments'],
  ['2026-05-23-15-supply-chain-security-explained', 'Supply Chain Security Explained'],
  ['2026-05-23-16-sbom-slsa-and-artifact-signing', 'SBOM, SLSA, and Artifact Signing'],
  ['2026-05-23-17-oidc-and-secure-cloud-deployments', 'OIDC and Secure Cloud Deployments'],
  ['2026-05-23-18-securing-self-hosted-runners', 'Securing Self-Hosted Runners'],
  ['2026-05-23-19-enterprise-devsecops-architecture', 'Enterprise DevSecOps Architecture'],
  ['2026-05-23-20-real-world-cicd-security-incidents', 'Real-World CI/CD Security Incidents'],
];

const diagram = `flowchart LR
    Dev[Developer] --> Commit[Git Commit]
    Commit --> PR[Pull Request]
    PR --> SAST[SAST Scan]
    PR --> SCA[SCA Scan]
    PR --> Secrets[Secret Scan]
    PR --> IaC[IaC Scan]
    PR --> Container[Container Scan]
    SAST --> Gate[Security Quality Gate]
    SCA --> Gate
    Secrets --> Gate
    IaC --> Gate
    Container --> Gate
    Gate --> Merge[Merge PR]
    Merge --> Build[Secure Build]
    Build --> Sign[Sign Artifact]
    Sign --> Deploy[Secure Deployment]`;

function docBody(slug, title, purpose, topics) {
  const isIntro = slug === 'introduction';
  return `---
id: ${slug}
title: ${title}
${isIntro ? 'slug: /' : ''}
description: ${purpose}
---

# ${title}

Author: ${author}  
Role: Product Engineer and Product Security Engineer

## What This Page Covers

${purpose}

This page is written in simple engineering language. The goal is to help developers and security teams understand the real problem, where it fails in CI/CD, and how to fix it with practical controls.

## Why It Matters

In real teams, security fails when it is added too late or when tools give noisy feedback. CI/CD security should be close to the developer workflow, but it should also be strong enough for enterprise governance.

Common failure points:

- secrets reach Git history,
- vulnerable dependencies merge quietly,
- pull requests do not have required security checks,
- workflows run with broad permissions,
- containers are deployed without image scanning,
- cloud deployments use long-lived secrets,
- and security findings are hidden inside CI logs.

## Architecture Overview

\`\`\`mermaid
${diagram}
\`\`\`

The main idea is simple. Fast checks should run early. Deep checks should run in CI. High-risk findings should block pull requests or releases. Developers should see clear feedback in the PR.

## Key Topics

${topics.map((topic) => `- ${topic}`).join('\n')}

## Practical YAML Example

\`\`\`yaml
name: ${slug}

on:
  pull_request:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  security-events: write
  pull-requests: write

jobs:
  security-check:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Run security control
        run: |
          echo "Run ${title} checks here"
          echo "Upload SARIF or comment on PR when possible"
\`\`\`

## Vulnerable Example

\`\`\`yaml
permissions: write-all

jobs:
  unsafe-job:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@master
      - run: echo "$CLOUD_SECRET"
\`\`\`

Problems in this example:

- workflow token is too powerful,
- action is not pinned to a safe version or SHA,
- secret handling is careless,
- and there is no clear policy gate.

## Secure Example

\`\`\`yaml
permissions:
  contents: read
  security-events: write

jobs:
  secure-job:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run controlled check
        run: |
          echo "Run scanner with least privilege"
\`\`\`

## PR Experience

A good PR security comment should not only say "scan failed".

\`\`\`text
Security check failed

High: 1
Medium: 3

Blocking reason:
- High severity issue affects code changed in this PR.

Next step:
- Review inline SARIF annotation.
- Apply suggested fix.
- Re-run the workflow.
\`\`\`

## Enterprise Recommendations

- Use required checks on protected branches.
- Upload SARIF for code-level findings.
- Use PR comments for readable summaries.
- Keep severity thresholds clear.
- Allow risk acceptance only with owner, reason, and expiry.
- Move common logic into reusable workflows.
- Track findings centrally across repositories.

## Summary

${title} is not only a tool topic. It is part of secure software delivery. Start with the risk, place the control in the right CI/CD stage, and make feedback easy for developers to act on.
`;
}

function blogBody(file, title, index) {
  const slug = file.replace(/^\d{4}-\d{2}-\d{2}-\d+-/, '');
  return `---
slug: ${slug}
title: ${title}
authors: [narendra]
tags: [devsecops, cicd-security, appsec, github-actions]
---

CI/CD security is practical engineering work. In this part, we will learn **${title}** slowly, with real examples and simple explanations.

<!-- truncate -->

## Introduction

Many teams ship fast, but they do not always secure the path from code to production. That path includes source code, pull requests, CI runners, secrets, artifacts, cloud credentials, and deployment approvals.

The mistake is usually not lack of interest. The mistake is unclear ownership and weak automation.

In this article, I will explain the topic like an engineer working with another engineer. We will focus on what breaks in real pipelines and how to fix it without making developers hate the process.

## Real-World Scenario

Imagine a developer opens a pull request. The code works, tests pass, and the team is ready to merge.

But the PR also has one hidden risk:

- a leaked token,
- an unsafe workflow permission,
- a vulnerable dependency,
- a Terraform misconfiguration,
- or an image built from a risky base image.

If security runs only after deployment, this becomes expensive. If security runs clearly in the PR, the fix is usually small.

## Architecture Overview

\`\`\`mermaid
${diagram}
\`\`\`

This flow is the base architecture for the full series.

Security should not live in one place only. It should run in layers:

- local checks for fast feedback,
- pre-commit for obvious mistakes,
- pull request checks for policy,
- CI checks for deeper validation,
- release checks for final control,
- runtime checks for drift.

## Technical Deep Dive

Start with a small workflow. Do not add ten scanners on day one.

\`\`\`yaml
name: pr-security

on:
  pull_request:
    branches: [main]

permissions:
  contents: read
  security-events: write
  pull-requests: write

jobs:
  security:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Run security checks
        run: |
          echo "Run SAST, SCA, secret, IaC, or container checks"
\`\`\`

For local checks, keep the feedback fast:

\`\`\`bash
gitleaks detect --source . --redact
semgrep scan --config p/owasp-top-ten
npm audit --audit-level=high
pip-audit
\`\`\`

For infrastructure checks, use scanner output that developers can understand:

\`\`\`hcl
resource "aws_security_group_rule" "bad_ssh" {
  type        = "ingress"
  from_port   = 22
  to_port     = 22
  protocol    = "tcp"
  cidr_blocks = ["0.0.0.0/0"]
}
\`\`\`

This is risky because SSH is open to the internet. The secure version should restrict access.

\`\`\`hcl
resource "aws_security_group_rule" "restricted_ssh" {
  type        = "ingress"
  from_port   = 22
  to_port     = 22
  protocol    = "tcp"
  cidr_blocks = ["10.0.0.0/8"]
}
\`\`\`

## Security Risks

Common risks:

- scanners run but nobody reads results,
- PR checks are optional,
- secrets are available to untrusted workflows,
- third-party actions are not pinned,
- self-hosted runners are reused across trust levels,
- SARIF is not uploaded,
- and quality gates are not connected to branch protection.

## Mitigation

Use a simple policy first:

\`\`\`yaml
security_policy:
  block_on:
    secrets: [critical, high, medium]
    sast: [critical, high]
    sca: [critical]
    iac: [critical, high]
    container: [critical]
  risk_acceptance:
    requires_owner: true
    requires_expiry: true
    max_days: 30
\`\`\`

This gives developers a clear rule. It also gives AppSec a way to scale without manual review for every finding.

## PR Experience

The PR should show a clean summary.

\`\`\`text
Security summary

Critical: 0
High: 1
Medium: 4

Status: Blocked
Reason: High severity issue introduced in this PR
Next step: Review SARIF annotation and apply the suggested fix
\`\`\`

Developers should not search long CI logs. Put findings in annotations, checks, and PR comments.

## Enterprise Recommendations

- Use reusable workflows for common scanners.
- Keep scanner policy in a central repo.
- Use branch protection and rulesets.
- Generate dashboards from SARIF or scanner APIs.
- Tune false positives before enforcing strict gates.
- Use OIDC for cloud deployments.
- Prefer short-lived credentials.
- Review exceptions every month.

## Summary

${title} is part of a bigger secure delivery model.

The goal is not to block developers randomly. The goal is to give fast feedback, enforce important policy, and stop high-risk changes before they reach production.
`;
}

for (const [slug, title, purpose, topics] of docs) {
  const path = `docs/${slug}.mdx`;
  mkdirSync(dirname(path), {recursive: true});
  writeFileSync(path, docBody(slug, title, purpose, topics));
}

for (let i = 0; i < blogPosts.length; i += 1) {
  const [file, title] = blogPosts[i];
  const path = `blog/${file}.mdx`;
  mkdirSync(dirname(path), {recursive: true});
  writeFileSync(path, blogBody(file, title, i + 1));
}
