// @ts-check

const sidebars = {
  tutorialSidebar: [
    'introduction',
    'about-me',
    'writing-style-guide',
    {
      type: 'category',
      label: 'Foundations',
      collapsed: false,
      items: [
        'cicd-security-fundamentals',
        'fundamentals-git-pr-scm-and-security-yaml',
        'security-yaml-file-fundamentals',
        'shift-left-security',
        'best-practices',
      ],
    },
    {
      type: 'category',
      label: 'SCM and GitHub Security',
      collapsed: false,
      items: [
        'scm-security',
        'github-security',
        'branch-protection-and-rulesets',
      ],
    },
    {
      type: 'category',
      label: 'GitHub Actions Security',
      collapsed: false,
      items: [
        'github-actions-security',
        'self-hosted-runner-security',
        'oidc-and-cloud-security',
        'reusable-security-workflows',
      ],
    },
    {
      type: 'category',
      label: 'Developer and PR Security',
      items: [
        'local-security-scanning',
        'pre-commit-security',
        'pull-request-security',
        'sarif-and-pr-comments',
        'security-quality-gates',
      ],
    },
    {
      type: 'category',
      label: 'Security Testing',
      items: [
        'sast-security',
        'sca-security',
        'secret-scanning',
        'iac-security',
        'container-security',
        'kubernetes-security',
      ],
    },
    {
      type: 'category',
      label: 'Supply Chain Security',
      items: [
        'supply-chain-security',
        'sbom-and-slsa',
        'artifact-signing',
        'real-world-attacks',
      ],
    },
    {
      type: 'category',
      label: 'Enterprise DevSecOps',
      items: [
        'enterprise-devsecops',
        'security-governance',
        'policy-as-code',
      ],
    },
    {
      type: 'category',
      label: 'Deployment',
      items: [
        'cloudflare-pages-deployment',
      ],
    },
  ],
};

export default sidebars;
