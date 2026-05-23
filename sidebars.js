// @ts-check

const sidebars = {
  tutorialSidebar: [
    'intro',
    {
      type: 'category',
      label: 'Phase 1: Foundation',
      items: [
        'fundamentals/cicd-security-fundamentals',
        'fundamentals/shift-left-security',
        'fundamentals/where-should-security-run',
      ],
    },
    {
      type: 'category',
      label: 'Layer 1: Local Developer Security',
      items: [
        'local-security/security-before-git-push',
        'local-security/pre-commit-security-scanning',
      ],
    },
    {
      type: 'category',
      label: 'Layer 2: Pull Request Security',
      items: [
        'pull-request-security/building-secure-pr-pipelines',
        'pull-request-security/scanner-purpose-map',
      ],
    },
    {
      type: 'category',
      label: 'Layer 3: CI/CD Pipeline Security',
      items: [
        'ci-security/github-actions-security',
        'cd-security/secure-deployment-approvals',
      ],
    },
    {
      type: 'category',
      label: 'Security Quality Gates',
      items: [
        'security-gates/blocking-pull-requests-based-on-risk',
        'sarif-and-reporting/developer-friendly-security-feedback',
      ],
    },
    {
      type: 'category',
      label: 'Advanced Topics',
      items: [
        'supply-chain-security/securing-software-supply-chain',
        'enterprise-patterns/scaling-appsec-across-repositories',
      ],
    },
  ],
};

export default sidebars;
