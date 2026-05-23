// @ts-check

const sidebars = {
  tutorialSidebar: [
    'intro',
    'learning-path-yaml',
    {
      type: 'category',
      label: 'Fundamentals',
      items: [
        'fundamentals/cicd-security-fundamentals',
        'fundamentals/where-should-security-run',
      ],
    },
    {
      type: 'category',
      label: 'Shift Left Security',
      items: [
        'fundamentals/shift-left-security',
      ],
    },
    {
      type: 'category',
      label: 'Local Security',
      items: [
        'local-security/security-before-git-push',
        'local-security/pre-commit-security-scanning',
      ],
    },
    {
      type: 'category',
      label: 'PR Security',
      items: [
        'pull-request-security/building-secure-pr-pipelines',
        'pull-request-security/scanner-purpose-map',
      ],
    },
    {
      type: 'category',
      label: 'CI Security',
      items: [
        'ci-security/github-actions-security',
        'ci-security/ci-security-overview',
      ],
    },
    {
      type: 'category',
      label: 'CD Security',
      items: [
        'cd-security/secure-deployment-approvals',
      ],
    },
    {
      type: 'category',
      label: 'GitHub Security',
      items: [
        'github-security/github-security-best-practices',
      ],
    },
    {
      type: 'category',
      label: 'SAST',
      items: [
        'sast/sast-in-ci-cd',
      ],
    },
    {
      type: 'category',
      label: 'SCA',
      items: [
        'sca/dependency-security-in-ci-cd',
      ],
    },
    {
      type: 'category',
      label: 'IaC Security',
      items: [
        'iac-security/scanning-terraform-and-kubernetes',
      ],
    },
    {
      type: 'category',
      label: 'Container Security',
      items: [
        'container-security/securing-docker-images-in-ci-cd',
      ],
    },
    {
      type: 'category',
      label: 'Supply Chain Security',
      items: [
        'supply-chain-security/securing-software-supply-chain',
      ],
    },
    {
      type: 'category',
      label: 'SARIF',
      items: [
        'sarif-and-reporting/developer-friendly-security-feedback',
      ],
    },
    {
      type: 'category',
      label: 'Security Gates',
      items: [
        'security-gates/blocking-pull-requests-based-on-risk',
      ],
    },
    {
      type: 'category',
      label: 'Enterprise DevSecOps',
      items: [
        'enterprise-patterns/scaling-appsec-across-repositories',
      ],
    },
  ],
};

export default sidebars;
