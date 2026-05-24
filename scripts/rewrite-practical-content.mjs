import {writeFileSync} from 'node:fs';

const docs = [
  {
    file: 'docs/cicd-security-fundamentals.mdx',
    id: 'cicd-security-fundamentals',
    title: 'CI/CD Security Fundamentals',
    desc: 'Practical foundation for securing CI/CD pipelines.',
    why: 'Nowadays most teams deploy through CI/CD. If this path is weak, a small mistake in a pull request can become a production issue very fast.',
    problem: 'The pipeline has access to source code, build artifacts, package registries, cloud credentials, and deployment environments. This makes CI/CD a high-value target.',
    attacker: 'Attackers try to steal tokens, modify workflows, push malicious packages, or abuse over-permissive runners to reach production indirectly.',
    wrong: 'A common mistake is treating CI as only a build tool. Teams add tests, but they forget secrets, dependency checks, artifact signing, and workflow permissions.',
    command: 'git log --oneline -5\nnpm ci\nnpm test --if-present',
    yamlName: 'cicd-baseline',
    scanner: 'baseline checks',
    secure: 'Keep checks close to pull requests. Start with secrets, dependencies, SAST, and IaC checks before adding advanced gates.',
    output: 'PR check failed: secret-scan found 1 high confidence token in src/config.js',
  },
  {
    file: 'docs/shift-left-security.mdx',
    id: 'shift-left-security',
    title: 'Shift Left Security',
    desc: 'How to move security feedback closer to developers.',
    why: 'Security is easier to fix when the developer still remembers the code change.',
    problem: 'Many teams scan only after merge or before release. By that time, the issue becomes a ticket, not a quick fix.',
    attacker: 'Attackers depend on this delay. A leaked token or vulnerable dependency merged today may be abused before the weekly security review happens.',
    wrong: 'Teams install heavy scanners locally and then developers disable them because every commit becomes slow.',
    command: 'gitleaks detect --source . --redact\nsemgrep scan --config p/owasp-top-ten\nnpm audit --audit-level=high',
    yamlName: 'shift-left-pr-checks',
    scanner: 'fast security checks',
    secure: 'Run fast checks locally, enforce important checks in PR, and keep deeper scans in CI.',
    output: 'pre-commit failed: possible AWS key found. Commit blocked before push.',
  },
  {
    file: 'docs/scm-security.mdx',
    id: 'scm-security',
    title: 'SCM Security',
    desc: 'Practical source code management security for Git and GitHub.',
    why: 'SCM is where product code, history, workflows, and review decisions live.',
    problem: 'If repository permissions, branches, and pull requests are weak, attackers can change code before the pipeline even starts.',
    attacker: 'Attackers target stale users, weak branch rules, leaked deploy keys, unreviewed workflow changes, and malicious pull requests.',
    wrong: 'One common issue is allowing direct pushes to main because the team trusts everyone. This breaks audit and review flow.',
    command: 'git branch --show-current\ngit log --show-signature -1\ngit remote -v',
    yamlName: 'scm-security-check',
    scanner: 'repository policy checks',
    secure: 'Protect main, require pull requests, use CODEOWNERS, review workflow changes carefully, and remove stale access.',
    output: 'Ruleset blocked merge: required check pr-security is missing.',
  },
  {
    file: 'docs/github-security.mdx',
    id: 'github-security',
    title: 'GitHub Security',
    desc: 'Repository and organization security controls in GitHub.',
    why: 'GitHub is not only code hosting. It is also part of the CI/CD control plane.',
    problem: 'Wrong repository settings can allow bypassing review, pushing to protected branches, or running risky workflows.',
    attacker: 'Attackers look for weak repo permissions, public secrets, over-trusted bots, and missing branch protection.',
    wrong: 'Many teams enable scanners but forget to make those checks required in branch protection or rulesets.',
    command: 'gh repo view --json name,visibility,defaultBranchRef\ngh api repos/:owner/:repo/actions/permissions',
    yamlName: 'github-repo-security',
    scanner: 'GitHub configuration checks',
    secure: 'Use rulesets, CODEOWNERS, Dependabot, secret scanning, least privilege Actions permissions, and regular access review.',
    output: 'Dependabot opened PR: bump package with critical vulnerability.',
  },
  {
    file: 'docs/github-actions-security.mdx',
    id: 'github-actions-security',
    title: 'GitHub Actions Security',
    desc: 'Secure workflows, jobs, actions, runners, secrets, and permissions.',
    why: 'GitHub Actions can build, publish, and deploy. That means a workflow bug can become a production security bug.',
    problem: 'Workflows often run with too much token permission and untrusted code can reach sensitive jobs.',
    attacker: 'Attackers abuse pull_request_target, workflow injection, unpinned third-party actions, and secrets exposed to forks.',
    wrong: 'A common mistake I observed is giving write permissions to all workflows by default.',
    command: 'gh workflow list\ngh run list --limit 5\ngh api repos/:owner/:repo/actions/permissions/workflow',
    yamlName: 'github-actions-hardening',
    scanner: 'workflow security checks',
    secure: 'Set permissions per job, pin actions, avoid secrets in fork PRs, and use OIDC instead of cloud keys.',
    output: 'Workflow failed: job requested id-token but environment approval is missing.',
  },
  {
    file: 'docs/local-security-scanning.mdx',
    id: 'local-security-scanning',
    title: 'Local Security Scanning',
    desc: 'Security checks developers can run before pushing code.',
    why: 'The cheapest security issue is the one fixed before git push.',
    problem: 'If developers get feedback only in CI, they lose time waiting for pipeline failures.',
    attacker: 'Attackers do not need advanced tricks if secrets and vulnerable packages are committed normally.',
    wrong: 'Teams sometimes force slow enterprise scans on every local commit. Developers then skip the hooks.',
    command: 'gitleaks detect --source . --redact\ntrufflehog git file://. --only-verified\npip-audit\nnpm audit',
    yamlName: 'local-security-reference',
    scanner: 'local tools',
    secure: 'Keep local checks fast. Block secrets locally. Keep deeper policy checks for PR.',
    output: 'gitleaks: finding detected in .env at line 3. Commit should not continue.',
  },
  {
    file: 'docs/pre-commit-security.mdx',
    id: 'pre-commit-security',
    title: 'Pre-Commit Security',
    desc: 'Use Git hooks to stop obvious mistakes before commit.',
    why: 'Pre-commit is useful because it stops simple mistakes before they enter Git history.',
    problem: 'Once a secret enters Git history, deleting the line is not enough. Rotation is usually required.',
    attacker: 'Attackers scan public repos and leaked histories for tokens, keys, and passwords.',
    wrong: 'Teams add too many hooks and make commits slow. Then developers bypass hooks with --no-verify.',
    command: 'pip install pre-commit\npre-commit install\npre-commit run --all-files',
    yamlName: 'pre-commit-security',
    scanner: 'pre-commit hooks',
    secure: 'Use pre-commit for high-confidence checks like secrets, YAML validation, and basic hygiene.',
    output: 'pre-commit hook gitleaks failed: hardcoded token detected.',
  },
  {
    file: 'docs/pull-request-security.mdx',
    id: 'pull-request-security',
    title: 'Pull Request Security',
    desc: 'Use PR checks to stop risky changes before merge.',
    why: 'Pull request is the best place to enforce security because developers already expect review there.',
    problem: 'Security findings often stay hidden in CI logs and do not block merge.',
    attacker: 'Attackers try to land small risky changes through normal PR flow: dependency update, workflow change, or config change.',
    wrong: 'Many teams run scanners but mark them optional. So the PR still merges.',
    command: 'gh pr checks\ngh pr view --json statusCheckRollup',
    yamlName: 'pr-security',
    scanner: 'SAST, SCA, secrets, IaC',
    secure: 'Make important checks required. Add PR comments and SARIF annotations so developers can fix issues quickly.',
    output: 'PR blocked: high severity Semgrep finding introduced in changed file.',
  },
  {
    file: 'docs/sast-security.mdx',
    id: 'sast-security',
    title: 'SAST Security',
    desc: 'Static analysis for insecure code patterns.',
    why: 'SAST helps catch insecure code before it is merged.',
    problem: 'Issues like SQL injection, path traversal, and unsafe deserialization can be introduced by normal feature code.',
    attacker: 'Attackers look for user input reaching dangerous functions without validation or encoding.',
    wrong: 'Teams enable all rules at once and get too many false positives. Developers stop trusting the scanner.',
    command: 'semgrep scan --config p/owasp-top-ten\ncodeql database analyze',
    yamlName: 'sast-pr-scan',
    scanner: 'CodeQL or Semgrep',
    secure: 'Start with high-confidence rules. Tune false positives before making SAST fully blocking.',
    output: 'SAST failed: user input reaches SQL query without parameterized statement.',
  },
  {
    file: 'docs/sca-security.mdx',
    id: 'sca-security',
    title: 'SCA Security',
    desc: 'Dependency vulnerability scanning in CI/CD.',
    why: 'Most applications depend heavily on open-source packages.',
    problem: 'One vulnerable transitive dependency can enter production without any code change from your team.',
    attacker: 'Attackers publish malicious packages, abuse dependency confusion, and target popular libraries.',
    wrong: 'Teams only scan direct dependencies and miss transitive risk.',
    command: 'osv-scanner --recursive .\ntrivy fs .\nnpm audit --omit=dev',
    yamlName: 'dependency-security',
    scanner: 'OSV Scanner or Trivy',
    secure: 'Use Dependabot for updates and SCA checks in PR. Block critical reachable issues first.',
    output: 'OSV found CVE in transitive dependency. Upgrade parent package.',
  },
  {
    file: 'docs/secret-scanning.mdx',
    id: 'secret-scanning',
    title: 'Secret Scanning',
    desc: 'Find and stop leaked credentials.',
    why: 'A leaked cloud key can become an incident in minutes.',
    problem: 'Secrets are often committed through config files, test scripts, logs, or copied examples.',
    attacker: 'Attackers continuously scan GitHub for tokens, AWS keys, GitHub PATs, SSH keys, and API keys.',
    wrong: 'Teams think deleting the secret from the latest commit fixes the problem. It does not fix Git history.',
    command: 'gitleaks detect --source . --redact\ntrufflehog git file://. --only-verified',
    yamlName: 'secret-scanning',
    scanner: 'Gitleaks or TruffleHog',
    secure: 'Block secrets in pre-commit and PR. Rotate exposed credentials immediately.',
    output: 'Secret scan failed: generic-api-key detected in config/local.env.',
  },
  {
    file: 'docs/iac-security.mdx',
    id: 'iac-security',
    title: 'IaC Security',
    desc: 'Scan Terraform, Kubernetes YAML, and cloud configuration.',
    why: 'Infrastructure code can create public cloud risk very quickly.',
    problem: 'A small Terraform change can open SSH to the internet or disable encryption.',
    attacker: 'Attackers search for exposed storage, public databases, weak IAM, and open network rules.',
    wrong: 'Teams review application code carefully but merge Terraform changes without security checks.',
    command: 'checkov -d .\ntrivy config .\ntfsec .',
    yamlName: 'iac-security',
    scanner: 'Checkov or Trivy config',
    secure: 'Run IaC scanning in PR and block critical cloud misconfigurations.',
    output: 'Checkov failed: security group allows 0.0.0.0/0 on port 22.',
  },
  {
    file: 'docs/container-security.mdx',
    id: 'container-security',
    title: 'Container Security',
    desc: 'Secure Dockerfiles and container images.',
    why: 'Containers are deployed as production artifacts, so image security matters.',
    problem: 'Images often include vulnerable OS packages, root users, secrets, and unnecessary tools.',
    attacker: 'Attackers exploit known CVEs in base images or abuse root containers after compromise.',
    wrong: 'Teams scan Dockerfile only but do not scan the final built image.',
    command: 'docker build -t app:test .\ntrivy image app:test\ngrype app:test',
    yamlName: 'container-security',
    scanner: 'Trivy or Grype',
    secure: 'Use minimal base images, run as non-root, scan final image, and sign release images.',
    output: 'Trivy failed: CRITICAL vulnerability found in base image package.',
  },
  {
    file: 'docs/kubernetes-security.mdx',
    id: 'kubernetes-security',
    title: 'Kubernetes Security in CI/CD',
    desc: 'Check Kubernetes manifests before deployment.',
    why: 'Kubernetes YAML decides how workloads run in the cluster.',
    problem: 'A manifest can enable privileged mode, mount host paths, or run containers as root.',
    attacker: 'Attackers abuse weak pod settings to escape containers or access cluster secrets.',
    wrong: 'Teams apply manifests directly from CI without policy checks.',
    command: 'kubectl apply --dry-run=client -f deploy.yaml\ntrivy config k8s/\ncheckov -d k8s/',
    yamlName: 'kubernetes-security',
    scanner: 'Trivy config or Checkov',
    secure: 'Scan manifests in PR. Enforce admission policies in cluster also.',
    output: 'Kubernetes scan failed: privileged container is not allowed.',
  },
  {
    file: 'docs/security-quality-gates.mdx',
    id: 'security-quality-gates',
    title: 'Security Quality Gates',
    desc: 'Block PRs based on agreed security risk.',
    why: 'Scanning without enforcement becomes only reporting.',
    problem: 'Teams see findings but still merge because checks are optional.',
    attacker: 'Attackers benefit when high severity findings are known but not blocked.',
    wrong: 'Some teams block every finding from day one and create noise. Others block nothing.',
    command: 'jq ".runs[].results[] | .level" results.sarif\ncat security-gate.json',
    yamlName: 'security-quality-gate',
    scanner: 'SARIF parser or custom gate',
    secure: 'Block secrets and critical/high issues first. Add exception process with owner and expiry.',
    output: 'Quality gate failed: 1 high SAST finding and 1 secret finding.',
  },
  {
    file: 'docs/sarif-and-pr-comments.mdx',
    id: 'sarif-and-pr-comments',
    title: 'SARIF and PR Comments',
    desc: 'Make scanner results visible inside pull requests.',
    why: 'Developers should not search long CI logs to understand a security failure.',
    problem: 'Security tools generate output, but the feedback is not visible where developers review code.',
    attacker: 'This is not an attacker technique directly, but poor feedback delays fixes and lets risky code move forward.',
    wrong: 'Teams upload artifacts only and expect developers to download JSON reports.',
    command: 'cat results.sarif | jq ".runs[0].results[0]"\ngh pr comment 12 --body-file summary.md',
    yamlName: 'sarif-pr-feedback',
    scanner: 'SARIF upload and PR comments',
    secure: 'Upload SARIF for code findings and add a short PR summary with counts and next steps.',
    output: 'GitHub Code Scanning annotation added on changed line.',
  },
  {
    file: 'docs/reusable-security-workflows.mdx',
    id: 'reusable-security-workflows',
    title: 'Reusable Security Workflows',
    desc: 'Centralize security automation across repositories.',
    why: 'Copy-pasting security YAML into every repo does not scale.',
    problem: 'Different teams configure scanners differently, so policy becomes inconsistent.',
    attacker: 'Attackers target the weakest repository. One repo without required checks can become the entry point.',
    wrong: 'Teams duplicate workflows and forget to update old repos when policy changes.',
    command: 'gh repo list org --limit 100\ngh workflow list',
    yamlName: 'reusable-security-workflow',
    scanner: 'central workflow',
    secure: 'Keep scanner logic in one security-workflows repo and call it from application repos.',
    output: 'Reusable workflow failed: caller repo missing required permission security-events: write.',
  },
  {
    file: 'docs/supply-chain-security.mdx',
    id: 'supply-chain-security',
    title: 'Supply Chain Security',
    desc: 'Protect dependencies, builds, artifacts, and provenance.',
    why: 'Modern applications trust many third-party packages and build tools.',
    problem: 'A compromised dependency or build step can ship malicious code without changing your application logic.',
    attacker: 'Attackers use typosquatting, dependency confusion, compromised maintainers, and CI token theft.',
    wrong: 'Teams trust package install blindly and do not verify artifacts.',
    command: 'npm ci --ignore-scripts\nosv-scanner --recursive .\ncosign verify image',
    yamlName: 'supply-chain-security',
    scanner: 'SCA, SBOM, signing',
    secure: 'Pin dependencies, generate SBOM, sign artifacts, and verify provenance before deployment.',
    output: 'Supply chain check failed: package source registry is not approved.',
  },
  {
    file: 'docs/sbom-and-slsa.mdx',
    id: 'sbom-and-slsa',
    title: 'SBOM and SLSA',
    desc: 'Generate SBOMs and improve build provenance.',
    why: 'When a new CVE comes, teams need to know where the affected package is used.',
    problem: 'Without SBOM, dependency impact analysis becomes manual and slow.',
    attacker: 'Attackers hide inside dependency trees and build systems where teams have poor visibility.',
    wrong: 'Teams generate SBOM but do not store or use it during release decisions.',
    command: 'syft packages dir:. -o cyclonedx-json > sbom.json\ncat sbom.json | jq ".components | length"',
    yamlName: 'sbom-generation',
    scanner: 'Syft or CycloneDX',
    secure: 'Generate SBOM in CI, attach it to releases, and connect it with vulnerability monitoring.',
    output: 'SBOM generated: 243 components identified.',
  },
  {
    file: 'docs/artifact-signing.mdx',
    id: 'artifact-signing',
    title: 'Artifact Signing',
    desc: 'Sign and verify build artifacts and container images.',
    why: 'Deployment systems should know whether an artifact came from a trusted build.',
    problem: 'Unsigned artifacts can be replaced or pushed manually without clear trust.',
    attacker: 'Attackers try to push modified images or tamper with build outputs.',
    wrong: 'Teams scan images but deploy without verifying who built them.',
    command: 'cosign sign image\ncosign verify image',
    yamlName: 'artifact-signing',
    scanner: 'Cosign verification',
    secure: 'Sign images in CI and verify signatures before deployment.',
    output: 'Cosign verify failed: no matching signature found for image digest.',
  },
  {
    file: 'docs/oidc-and-cloud-security.mdx',
    id: 'oidc-and-cloud-security',
    title: 'OIDC and Cloud Security',
    desc: 'Use short-lived cloud credentials from CI/CD.',
    why: 'Long-lived cloud keys in CI are risky and hard to rotate.',
    problem: 'If a cloud secret leaks from CI, attackers may use it outside GitHub.',
    attacker: 'Attackers steal cloud keys from logs, secrets, compromised workflows, or third-party actions.',
    wrong: 'Teams store AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY as long-lived GitHub secrets.',
    command: 'aws sts get-caller-identity\ngh secret list',
    yamlName: 'oidc-cloud-auth',
    scanner: 'OIDC trust policy',
    secure: 'Use OIDC with branch, repo, and environment conditions. Keep permissions narrow.',
    output: 'Cloud auth failed: OIDC subject does not match allowed branch.',
  },
  {
    file: 'docs/branch-protection-and-rulesets.mdx',
    id: 'branch-protection-and-rulesets',
    title: 'Branch Protection and Rulesets',
    desc: 'Protect important branches using GitHub rules.',
    why: 'Rulesets make security checks enforceable instead of optional.',
    problem: 'Without branch rules, someone can merge risky code even if scanners fail.',
    attacker: 'Attackers prefer paths where review or checks can be bypassed.',
    wrong: 'Teams protect main but forget release branches and workflow files.',
    command: 'gh api repos/:owner/:repo/rulesets\ngh pr checks',
    yamlName: 'ruleset-policy',
    scanner: 'required checks',
    secure: 'Require PR review, CODEOWNERS, signed commits if needed, and required security checks.',
    output: 'Merge blocked: required status check secret-scan did not pass.',
  },
  {
    file: 'docs/self-hosted-runner-security.mdx',
    id: 'self-hosted-runner-security',
    title: 'Self-Hosted Runner Security',
    desc: 'Secure self-hosted GitHub Actions runners.',
    why: 'Self-hosted runners usually have more network access than GitHub-hosted runners.',
    problem: 'If untrusted PR code runs on a persistent runner, it may steal files, tokens, or internal network access.',
    attacker: 'Attackers open PRs that execute commands on runners with internal access.',
    wrong: 'Teams use the same runner for trusted deploys and untrusted pull requests.',
    command: 'ps aux\nls -la $RUNNER_WORKSPACE\nip route',
    yamlName: 'runner-security',
    scanner: 'runner isolation checks',
    secure: 'Use ephemeral runners, isolate networks, avoid fork PRs on sensitive runners, and clean workspace every run.',
    output: 'Runner policy failed: fork pull_request cannot use self-hosted runner group.',
  },
  {
    file: 'docs/enterprise-devsecops.mdx',
    id: 'enterprise-devsecops',
    title: 'Enterprise DevSecOps',
    desc: 'Scale security automation across many repositories.',
    why: 'Enterprise AppSec fails when every repo has a different security setup.',
    problem: 'Manual onboarding, copied YAML, and inconsistent policies create gaps.',
    attacker: 'Attackers need only one weak repo or pipeline to start moving deeper.',
    wrong: 'Teams create central standards but do not provide reusable workflows or clear developer feedback.',
    command: 'gh repo list org --limit 200\njq ".repositories[] | .securityStatus" dashboard.json',
    yamlName: 'enterprise-devsecops',
    scanner: 'central AppSec automation',
    secure: 'Use reusable workflows, policy as code, dashboards, exception process, and staged rollout.',
    output: 'Dashboard: 83 repos passing baseline, 12 missing secret scan, 4 missing branch rules.',
  },
  {
    file: 'docs/security-governance.mdx',
    id: 'security-governance',
    title: 'Security Governance',
    desc: 'Turn security policy into engineering controls.',
    why: 'Policy only works when it is translated into CI/CD checks developers can understand.',
    problem: 'Security teams define rules, but engineering teams do not know how to implement them.',
    attacker: 'Attackers benefit from unclear ownership and inconsistent enforcement.',
    wrong: 'Governance becomes spreadsheet tracking instead of automated checks.',
    command: 'cat policy.yml\ngh pr checks\njq ".exceptions[]" risk-acceptance.json',
    yamlName: 'security-governance',
    scanner: 'policy checks',
    secure: 'Define owners, severity thresholds, exception expiry, and required checks.',
    output: 'Policy failed: risk acceptance expired 7 days ago.',
  },
  {
    file: 'docs/policy-as-code.mdx',
    id: 'policy-as-code',
    title: 'Policy as Code',
    desc: 'Write security rules as reviewable code.',
    why: 'Security decisions should be repeatable and reviewable.',
    problem: 'Manual reviews do not scale across hundreds of repositories.',
    attacker: 'Attackers look for places where policy is not enforced consistently.',
    wrong: 'Teams write policy documents but never connect them to CI/CD.',
    command: 'conftest test deployment.yaml\nopa eval -d policy.rego -i input.json "data.security.allow"',
    yamlName: 'policy-as-code',
    scanner: 'OPA or Conftest',
    secure: 'Keep policies in Git, review changes, test them in CI, and explain failures clearly.',
    output: 'Policy failed: container must not run as root.',
  },
  {
    file: 'docs/real-world-attacks.mdx',
    id: 'real-world-attacks',
    title: 'Real-World Attacks',
    desc: 'CI/CD and supply chain incidents worth studying.',
    why: 'Real incidents show where theory fails in actual engineering systems.',
    problem: 'Supply chain and CI/CD attacks often use trusted systems against the organization.',
    attacker: 'Attackers compromise update systems, CI scripts, maintainers, dependencies, or tokens.',
    wrong: 'Teams study incidents but do not convert lessons into pipeline controls.',
    command: 'grep -R "curl | bash" .github workflows scripts\nosv-scanner --recursive .',
    yamlName: 'incident-learning',
    scanner: 'incident-driven checks',
    secure: 'Convert lessons from SolarWinds, Codecov, and XZ Utils into controls like signing, SBOM, OIDC, and dependency review.',
    output: 'Review finding: CI script downloads remote shell script without checksum verification.',
  },
  {
    file: 'docs/best-practices.mdx',
    id: 'best-practices',
    title: 'Best Practices',
    desc: 'Practical checklist for CI/CD security.',
    why: 'Teams need a simple baseline they can actually implement.',
    problem: 'Security programs fail when the checklist is too big or not connected to developer workflow.',
    attacker: 'Attackers target missing basics first: secrets, weak permissions, no branch rules, and old dependencies.',
    wrong: 'Teams try to implement everything at once and then abandon enforcement.',
    command: 'gh pr checks\ngitleaks detect --source . --redact\ntrivy fs .',
    yamlName: 'security-baseline',
    scanner: 'baseline security workflow',
    secure: 'Start small: secrets, dependency scan, SAST, IaC, branch rules, least privilege, and clear PR comments.',
    output: 'Baseline status: secrets pass, SCA pass, SAST warning, IaC fail.',
  },
];

function fence(lang, lines) {
  return ['```' + lang, lines.join('\n'), '```'].join('\n');
}

function wrongYaml(d) {
  if (d.id.includes('github-actions')) {
    return fence('yaml', [
      'name: unsafe-actions-workflow',
      'on: [pull_request_target]',
      'permissions: write-all',
      'jobs:',
      '  build:',
      '    runs-on: ubuntu-latest',
      '    steps:',
      '      - uses: actions/checkout@master',
      '      - run: npm install',
      '      - run: npm test',
    ]);
  }

  if (d.id.includes('secret') || d.id.includes('pre-commit') || d.id.includes('local')) {
    return fence('bash', [
      'echo "AWS_SECRET_ACCESS_KEY=real-key-value" >> .env',
      'git add .env',
      'git commit -m "add env config"',
    ]);
  }

  if (d.id.includes('iac') || d.id.includes('kubernetes')) {
    return fence('yaml', [
      'apiVersion: v1',
      'kind: Pod',
      'metadata:',
      '  name: unsafe-app',
      'spec:',
      '  containers:',
      '    - name: app',
      '      image: nginx:latest',
      '      securityContext:',
      '        privileged: true',
    ]);
  }

  if (d.id.includes('container')) {
    return fence('dockerfile', [
      'FROM node:latest',
      'WORKDIR /app',
      'COPY . .',
      'RUN npm install',
      'USER root',
      'CMD ["npm", "start"]',
    ]);
  }

  if (d.id.includes('sca') || d.id.includes('supply') || d.id.includes('sbom')) {
    return fence('json', [
      '{',
      '  "scripts": {',
      '    "postinstall": "curl https://example.com/install.sh | bash"',
      '  },',
      '  "dependencies": {',
      '    "left-pad-secure": "^1.0.0"',
      '  }',
      '}',
    ]);
  }

  if (d.id.includes('oidc')) {
    return fence('yaml', [
      'env:',
      '  AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}',
      '  AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}',
      'jobs:',
      '  deploy:',
      '    runs-on: ubuntu-latest',
      '    steps:',
      '      - run: aws s3 ls',
    ]);
  }

  return fence('yaml', [
    'name: unsafe-' + d.yamlName,
    'on:',
    '  pull_request:',
    'permissions: write-all',
    'jobs:',
    '  scan:',
    '    runs-on: ubuntu-latest',
    '    steps:',
    '      - uses: actions/checkout@master',
    '      - run: echo "$CLOUD_SECRET"',
  ]);
}

function wrongNotes(d) {
  if (d.id.includes('secret') || d.id.includes('pre-commit') || d.id.includes('local')) {
    return [
      '- The secret is now part of Git history.',
      '- Removing the line later does not fully solve it.',
      '- The real fix needs secret rotation and history cleanup.',
      '- Local checks should stop this before commit.',
    ].join('\n');
  }

  if (d.id.includes('iac') || d.id.includes('kubernetes')) {
    return [
      '- The workload runs with unsafe privilege.',
      '- The image tag is not pinned.',
      '- A small config change can create a cloud or cluster risk.',
      '- This should fail in PR before deployment.',
    ].join('\n');
  }

  if (d.id.includes('container')) {
    return [
      '- latest tag changes without review.',
      '- npm install can change dependency tree.',
      '- Running as root increases impact after compromise.',
      '- Image scanning is missing before publish.',
    ].join('\n');
  }

  if (d.id.includes('sca') || d.id.includes('supply') || d.id.includes('sbom')) {
    return [
      '- Install scripts run code from the internet.',
      '- Package source is not reviewed.',
      '- Transitive dependencies are trusted blindly.',
      '- There is no SBOM or provenance check.',
    ].join('\n');
  }

  if (d.id.includes('oidc')) {
    return [
      '- Long-lived cloud keys are stored in GitHub secrets.',
      '- Stolen keys can be reused outside the workflow.',
      '- There is no short-lived identity boundary.',
      '- Deployment access is not tied to branch or environment.',
    ].join('\n');
  }

  return [
    '- write-all gives more access than required.',
    '- checkout@master is not a stable pinned version.',
    '- Secret handling is careless.',
    '- There is no clear PR output or quality gate.',
  ].join('\n');
}

function secureYaml(d) {
  if (d.id.includes('secret') || d.id.includes('pre-commit') || d.id.includes('local')) {
    return fence('yaml', [
      'repos:',
      '  - repo: https://github.com/gitleaks/gitleaks',
      '    rev: v8.24.2',
      '    hooks:',
      '      - id: gitleaks',
      '        args: ["--redact"]',
    ]);
  }

  if (d.id.includes('sast')) {
    return fence('yaml', [
      'name: sast-security',
      'on:',
      '  pull_request:',
      '    branches: [main]',
      'permissions:',
      '  contents: read',
      '  security-events: write',
      'jobs:',
      '  codeql:',
      '    runs-on: ubuntu-latest',
      '    steps:',
      '      - uses: actions/checkout@v4',
      '      - uses: github/codeql-action/init@v3',
      '        with:',
      '          languages: javascript-typescript',
      '      - uses: github/codeql-action/analyze@v3',
    ]);
  }

  if (d.id.includes('sca') || d.id.includes('supply')) {
    return fence('yaml', [
      'name: dependency-security',
      'on:',
      '  pull_request:',
      'permissions:',
      '  contents: read',
      '  security-events: write',
      'jobs:',
      '  osv:',
      '    runs-on: ubuntu-latest',
      '    steps:',
      '      - uses: actions/checkout@v4',
      '      - name: Scan dependencies',
      '        uses: google/osv-scanner-action@v2',
      '        with:',
      '          scan-args: --recursive .',
    ]);
  }

  if (d.id.includes('iac') || d.id.includes('kubernetes')) {
    return fence('yaml', [
      'name: iac-security',
      'on:',
      '  pull_request:',
      'permissions:',
      '  contents: read',
      '  security-events: write',
      'jobs:',
      '  trivy-config:',
      '    runs-on: ubuntu-latest',
      '    steps:',
      '      - uses: actions/checkout@v4',
      '      - uses: aquasecurity/trivy-action@0.28.0',
      '        with:',
      '          scan-type: config',
      '          format: sarif',
      '          output: trivy-config.sarif',
      '      - uses: github/codeql-action/upload-sarif@v3',
      '        with:',
      '          sarif_file: trivy-config.sarif',
    ]);
  }

  if (d.id.includes('container')) {
    return fence('yaml', [
      'name: container-security',
      'on:',
      '  pull_request:',
      'permissions:',
      '  contents: read',
      '  security-events: write',
      'jobs:',
      '  trivy-image:',
      '    runs-on: ubuntu-latest',
      '    steps:',
      '      - uses: actions/checkout@v4',
      '      - run: docker build -t demo-app:${{ github.sha }} .',
      '      - uses: aquasecurity/trivy-action@0.28.0',
      '        with:',
      '          image-ref: demo-app:${{ github.sha }}',
      '          severity: HIGH,CRITICAL',
      '          exit-code: "1"',
    ]);
  }

  if (d.id.includes('oidc')) {
    return fence('yaml', [
      'name: deploy-with-oidc',
      'on:',
      '  push:',
      '    branches: [main]',
      'permissions:',
      '  contents: read',
      '  id-token: write',
      'jobs:',
      '  deploy:',
      '    runs-on: ubuntu-latest',
      '    environment: production',
      '    steps:',
      '      - uses: actions/checkout@v4',
      '      - uses: aws-actions/configure-aws-credentials@v4',
      '        with:',
      '          role-to-assume: arn:aws:iam::123456789012:role/github-deploy',
      '          aws-region: ap-south-1',
      '      - run: aws sts get-caller-identity',
    ]);
  }

  return fence('yaml', [
    'name: ' + d.yamlName,
    'on:',
    '  pull_request:',
    '    branches: [main]',
    '  workflow_dispatch:',
    'permissions:',
    '  contents: read',
    '  security-events: write',
    '  pull-requests: write',
    'jobs:',
    '  security-check:',
    '    runs-on: ubuntu-latest',
    '    steps:',
    '      - name: Checkout repository',
    '        uses: actions/checkout@v4',
    '      - name: Run ' + d.scanner,
    '        run: |',
    '          echo "Run ' + d.scanner + ' here"',
    '          echo "Fail only on agreed severity threshold"',
  ]);
}

function docTemplate(d) {
  return `---
id: ${d.id}
title: ${d.title}
description: ${d.desc}
---

# ${d.title}

## Why This Matters

${d.why}

## Actual Security Problem

${d.problem}

In real implementation, the issue is not only the tool. The main issue is where the check runs, what permission it gets, and whether the result blocks risky code.

## How Attackers Misuse It

${d.attacker}

They do not always need a zero-day. Many times they use normal engineering paths like pull requests, package updates, workflow changes, or leaked credentials.

## Common Wrong Setup

${d.wrong}

${wrongYaml(d)}

What is wrong here:

${wrongNotes(d)}

## Practical Implementation

${secureYaml(d)}

## Useful Commands

\`\`\`bash
${d.command}
\`\`\`

## Example Result

\`\`\`text
${d.output}
\`\`\`

## Secure Fix

${d.secure}

Also make sure the check is required in GitHub rulesets or branch protection. Otherwise it only reports and does not stop risky code.

## Practical Recommendations

- Start with high-confidence checks.
- Keep permissions minimum.
- Put security feedback in the pull request.
- Make only important checks blocking in the beginning.
- Tune false positives before strict enforcement.
- Track exceptions with owner, reason, and expiry.
`;
}

for (const doc of docs) {
  writeFileSync(doc.file, docTemplate(doc));
}

const blogTopics = [
  ['blog/2026-05-23-01-why-cicd-security-matters.mdx', 'Why CI/CD Security Matters', 'CI/CD pipeline compromise can directly affect production.', 'an attacker changes pipeline logic or steals a deployment token'],
  ['blog/2026-05-23-02-understanding-shift-left-security.mdx', 'Understanding Shift Left Security', 'Security feedback should come while the developer still has context.', 'a secret or vulnerable package reaches main because checks ran too late'],
  ['blog/2026-05-23-03-scm-security-with-github.mdx', 'SCM Security With GitHub', 'Source code management is the first security boundary.', 'a weak branch rule allows risky code to merge'],
  ['blog/2026-05-23-04-github-actions-security-fundamentals.mdx', 'GitHub Actions Security Fundamentals', 'GitHub Actions can build and deploy, so permissions matter.', 'a malicious workflow abuses write-all token permissions'],
  ['blog/2026-05-23-05-securing-developers-before-git-push.mdx', 'Securing Developers Before Git Push', 'Local checks reduce CI noise and catch simple mistakes.', 'a developer commits a token before PR checks run'],
  ['blog/2026-05-23-06-local-security-scanning-with-pre-commit.mdx', 'Local Security Scanning With Pre-Commit', 'Pre-commit hooks stop obvious mistakes early.', 'a secret enters Git history and needs rotation'],
  ['blog/2026-05-23-07-pull-request-security-architecture.mdx', 'Pull Request Security Architecture', 'PR is where security policy becomes enforceable.', 'a scanner reports an issue but merge is still allowed'],
  ['blog/2026-05-23-08-sast-in-modern-cicd.mdx', 'SAST in Modern CI/CD', 'SAST catches insecure code before merge.', 'user input reaches a dangerous function'],
  ['blog/2026-05-23-09-dependency-and-sca-security.mdx', 'Dependency and SCA Security', 'Applications trust many open-source packages.', 'a vulnerable transitive package reaches production'],
  ['blog/2026-05-23-10-preventing-secret-leaks.mdx', 'Preventing Secret Leaks', 'Leaked credentials are one of the fastest ways to get breached.', 'a cloud key is pushed to a public repository'],
  ['blog/2026-05-23-11-iac-security-with-terraform-and-kubernetes.mdx', 'IaC Security With Terraform and Kubernetes', 'Infrastructure code can expose cloud resources.', 'a Terraform change opens SSH to the internet'],
  ['blog/2026-05-23-12-container-security-in-cicd.mdx', 'Container Security in CI/CD', 'Container images are production artifacts.', 'a vulnerable base image is deployed without scanning'],
  ['blog/2026-05-23-13-security-quality-gates.mdx', 'Security Quality Gates', 'Security checks need merge decisions.', 'critical findings are reported but not blocked'],
  ['blog/2026-05-23-14-understanding-sarif-and-pr-security-comments.mdx', 'Understanding SARIF and PR Security Comments', 'Developers need findings inside the PR.', 'scanner output stays hidden in CI logs'],
  ['blog/2026-05-23-15-supply-chain-security-explained.mdx', 'Supply Chain Security Explained', 'Builds and dependencies are part of the attack surface.', 'a malicious package enters through normal install'],
  ['blog/2026-05-23-16-sbom-slsa-and-artifact-signing.mdx', 'SBOM, SLSA, and Artifact Signing', 'Teams need to know what they ship and who built it.', 'an unsigned artifact is replaced before deployment'],
  ['blog/2026-05-23-17-oidc-and-secure-cloud-deployments.mdx', 'OIDC and Secure Cloud Deployments', 'Long-lived cloud keys in CI are risky.', 'a stolen cloud secret is reused outside GitHub'],
  ['blog/2026-05-23-18-securing-self-hosted-runners.mdx', 'Securing Self-Hosted Runners', 'Self-hosted runners often have internal access.', 'untrusted PR code runs on a persistent runner'],
  ['blog/2026-05-23-19-enterprise-devsecops-architecture.mdx', 'Enterprise DevSecOps Architecture', 'Security needs to scale across many repos.', 'one repo misses baseline checks and becomes weak entry point'],
  ['blog/2026-05-23-20-real-world-cicd-security-incidents.mdx', 'Real-World CI/CD Security Incidents', 'Real incidents show what controls are missing.', 'trusted build or update systems are abused'],
];

function slugFromFile(file) {
  return file.split('/').pop().replace(/^\d{4}-\d{2}-\d{2}-\d+-/, '').replace(/\.mdx$/, '');
}

function blogKind(title) {
  const t = title.toLowerCase();
  if (t.includes('secret')) return 'secret';
  if (t.includes('sast')) return 'sast';
  if (t.includes('dependency') || t.includes('sca')) return 'sca';
  if (t.includes('iac')) return 'iac';
  if (t.includes('container')) return 'container';
  if (t.includes('sarif')) return 'sarif';
  if (t.includes('quality')) return 'gate';
  if (t.includes('oidc')) return 'oidc';
  if (t.includes('self-hosted')) return 'runner';
  if (t.includes('supply') || t.includes('sbom') || t.includes('artifact')) return 'supply';
  if (t.includes('github actions')) return 'actions';
  if (t.includes('scm')) return 'scm';
  return 'baseline';
}

function blogWorkflow(kind) {
  const workflows = {
    secret: [
      'name: secret-scan',
      'on: [pull_request]',
      'permissions:',
      '  contents: read',
      'jobs:',
      '  gitleaks:',
      '    runs-on: ubuntu-latest',
      '    steps:',
      '      - uses: actions/checkout@v4',
      '        with:',
      '          fetch-depth: 0',
      '      - uses: gitleaks/gitleaks-action@v2',
      '        env:',
      '          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}',
    ],
    sast: [
      'name: sast-codeql',
      'on: [pull_request]',
      'permissions:',
      '  contents: read',
      '  security-events: write',
      'jobs:',
      '  analyze:',
      '    runs-on: ubuntu-latest',
      '    steps:',
      '      - uses: actions/checkout@v4',
      '      - uses: github/codeql-action/init@v3',
      '        with:',
      '          languages: javascript-typescript',
      '      - uses: github/codeql-action/analyze@v3',
    ],
    sca: [
      'name: sca-osv',
      'on: [pull_request]',
      'permissions:',
      '  contents: read',
      'jobs:',
      '  dependency-scan:',
      '    runs-on: ubuntu-latest',
      '    steps:',
      '      - uses: actions/checkout@v4',
      '      - uses: google/osv-scanner-action@v2',
      '        with:',
      '          scan-args: --recursive .',
    ],
    iac: [
      'name: iac-security',
      'on: [pull_request]',
      'permissions:',
      '  contents: read',
      '  security-events: write',
      'jobs:',
      '  scan-config:',
      '    runs-on: ubuntu-latest',
      '    steps:',
      '      - uses: actions/checkout@v4',
      '      - uses: aquasecurity/trivy-action@0.28.0',
      '        with:',
      '          scan-type: config',
      '          format: sarif',
      '          output: iac.sarif',
    ],
    container: [
      'name: image-security',
      'on: [pull_request]',
      'permissions:',
      '  contents: read',
      'jobs:',
      '  image-scan:',
      '    runs-on: ubuntu-latest',
      '    steps:',
      '      - uses: actions/checkout@v4',
      '      - run: docker build -t app:${{ github.sha }} .',
      '      - uses: aquasecurity/trivy-action@0.28.0',
      '        with:',
      '          image-ref: app:${{ github.sha }}',
      '          severity: HIGH,CRITICAL',
      '          exit-code: "1"',
    ],
    oidc: [
      'name: cloud-deploy',
      'on:',
      '  push:',
      '    branches: [main]',
      'permissions:',
      '  contents: read',
      '  id-token: write',
      'jobs:',
      '  deploy:',
      '    runs-on: ubuntu-latest',
      '    environment: production',
      '    steps:',
      '      - uses: actions/checkout@v4',
      '      - uses: aws-actions/configure-aws-credentials@v4',
      '        with:',
      '          role-to-assume: arn:aws:iam::123456789012:role/github-deploy',
      '          aws-region: ap-south-1',
    ],
    supply: [
      'name: supply-chain-security',
      'on: [pull_request]',
      'permissions:',
      '  contents: read',
      '  id-token: write',
      'jobs:',
      '  verify-build:',
      '    runs-on: ubuntu-latest',
      '    steps:',
      '      - uses: actions/checkout@v4',
      '      - run: npm ci --ignore-scripts',
      '      - run: syft . -o spdx-json=sbom.spdx.json',
      '      - run: cosign sign --yes ghcr.io/org/app:${{ github.sha }}',
    ],
    gate: [
      'name: security-quality-gate',
      'on: [pull_request]',
      'permissions:',
      '  contents: read',
      '  pull-requests: write',
      'jobs:',
      '  gate:',
      '    runs-on: ubuntu-latest',
      '    steps:',
      '      - uses: actions/checkout@v4',
      '      - run: node scripts/security-gate.js --fail-on critical --sarif results.sarif',
    ],
    sarif: [
      'name: sarif-upload',
      'on: [pull_request]',
      'permissions:',
      '  contents: read',
      '  security-events: write',
      '  pull-requests: write',
      'jobs:',
      '  upload:',
      '    runs-on: ubuntu-latest',
      '    steps:',
      '      - uses: actions/checkout@v4',
      '      - run: echo "scanner writes results.sarif"',
      '      - uses: github/codeql-action/upload-sarif@v3',
      '        with:',
      '          sarif_file: results.sarif',
    ],
  };

  return fence('yaml', workflows[kind] || [
    'name: pr-security',
    'on:',
    '  pull_request:',
    '    branches: [main]',
    'permissions:',
    '  contents: read',
    '  security-events: write',
    '  pull-requests: write',
    'jobs:',
    '  security:',
    '    runs-on: ubuntu-latest',
    '    steps:',
    '      - uses: actions/checkout@v4',
    '      - run: echo "Run required security checks"',
  ]);
}

function blogBadExample(kind) {
  if (kind === 'secret') {
    return fence('bash', ['echo "GITHUB_TOKEN=ghp_real_token" >> .env', 'git add .env', 'git commit -m "add local config"']);
  }
  if (kind === 'iac') {
    return fence('hcl', ['resource "aws_security_group_rule" "ssh" {', '  type = "ingress"', '  from_port = 22', '  to_port = 22', '  protocol = "tcp"', '  cidr_blocks = ["0.0.0.0/0"]', '}']);
  }
  if (kind === 'container') {
    return fence('dockerfile', ['FROM node:latest', 'COPY . /app', 'WORKDIR /app', 'RUN npm install', 'USER root']);
  }
  if (kind === 'oidc') {
    return fence('yaml', ['env:', '  AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}', '  AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}']);
  }
  if (kind === 'sca' || kind === 'supply') {
    return fence('json', ['{', '  "scripts": {', '    "postinstall": "curl https://example.com/run.sh | bash"', '  }', '}']);
  }
  return fence('yaml', ['permissions: write-all', 'jobs:', '  unsafe:', '    runs-on: ubuntu-latest', '    steps:', '      - uses: actions/checkout@master', '      - run: echo "$SECRET_VALUE"']);
}

function blogMistakes(kind) {
  const map = {
    secret: ['Secrets are kept in .env files inside the repo.', 'Developers trust gitignore but forget older commits.', 'Teams do not rotate keys after exposure.', 'Secret scan runs in CI but not before commit.'],
    sast: ['SAST is enabled but findings are not triaged.', 'Rules are too noisy and developers stop trusting results.', 'Only main branch is scanned after merge.', 'Security bugs are treated as backlog items.'],
    sca: ['Lock files are not reviewed.', 'Transitive dependency risk is ignored.', 'Dependabot PRs are merged without testing.', 'Malicious package risk is not considered.'],
    iac: ['Terraform plan is reviewed only for cost, not security.', 'Kubernetes manifests allow privileged workloads.', 'Cloud resources are opened to the internet by mistake.', 'IaC scanners run but are optional.'],
    container: ['Images use latest tags.', 'Containers run as root.', 'Base image vulnerabilities are ignored.', 'Image scanning happens after publish, not before.'],
    oidc: ['Cloud keys are stored as long-lived GitHub secrets.', 'Deployment role can be used from any branch.', 'Environment approvals are missing.', 'Cloud trust policy is too wide.'],
    runner: ['Untrusted PRs run on self-hosted runners.', 'Runner workspace is reused.', 'Runner has internal network access.', 'Secrets remain on disk after job completion.'],
    supply: ['Install scripts are trusted blindly.', 'Artifacts are published without signing.', 'SBOM is missing.', 'Build provenance is not verified before deployment.'],
    actions: ['Workflow token has write-all permission.', 'Third-party actions are not pinned.', 'pull_request_target is used without understanding risk.', 'Secrets are available to jobs that do not need them.'],
    scm: ['Direct push to main is allowed.', 'CODEOWNERS is missing for workflow changes.', 'Old users still have write access.', 'Rulesets are not applied to all important branches.'],
    gate: ['Scanners run but merge is still allowed.', 'Severity threshold is not agreed.', 'Exception process is informal.', 'Fail-open behavior is not documented.'],
    sarif: ['Scanner output stays in logs.', 'Developers do not see inline annotations.', 'SARIF upload permission is missing.', 'PR comment does not explain next step.'],
  };
  return (map[kind] || ['Security check is present but not required.', 'Permissions are wider than needed.', 'Findings are hard to understand.', 'No owner is assigned for fixing issues.']).map((item) => '- ' + item).join('\n');
}

function blogDiagram(kind) {
  if (kind === 'secret') {
    return fence('mermaid', ['flowchart LR', '    Dev[Developer] --> Hook[Pre Commit Secret Scan]', '    Hook -->|Fail| Fix[Fix And Rotate]', '    Hook -->|Pass| PR[Pull Request]', '    PR --> Gate[Required Secret Check]', '    Gate --> Merge[Merge]']);
  }
  if (kind === 'supply') {
    return fence('mermaid', ['flowchart LR', '    Package[Dependency] --> Build[CI Build]', '    Build --> SBOM[Generate SBOM]', '    Build --> Sign[Sign Artifact]', '    Sign --> Verify[Verify Before Deploy]', '    Verify --> Prod[Production]']);
  }
  if (kind === 'oidc') {
    return fence('mermaid', ['flowchart LR', '    GitHub[GitHub Actions] --> OIDC[OIDC Token]', '    OIDC --> CloudIAM[Cloud IAM Trust Policy]', '    CloudIAM --> ShortCreds[Short Lived Credentials]', '    ShortCreds --> Deploy[Deploy]']);
  }
  return fence('mermaid', ['flowchart LR', '    Dev[Developer] --> PR[Pull Request]', '    PR --> Scan[Security Scan]', '    Scan --> Gate[Quality Gate]', '    Gate -->|Pass| Merge[Merge]', '    Gate -->|Fail| Comment[PR Comment With Fix]']);
}

function blogPR(kind) {
  const map = {
    secret: ['Secret scan failed', 'Finding: AWS key pattern found in config/local.env', 'Status: PR blocked', 'Next step: remove secret, rotate key, rerun scan'],
    sast: ['SAST failed', 'Finding: user input reaches command execution', 'Status: PR blocked', 'Next step: validate input and avoid shell execution'],
    sca: ['Dependency scan failed', 'Finding: critical CVE in transitive package', 'Status: PR blocked', 'Next step: upgrade package or add approved exception'],
    iac: ['IaC scan failed', 'Finding: security group allows 0.0.0.0/0 on port 22', 'Status: PR blocked', 'Next step: restrict CIDR and rerun workflow'],
    container: ['Image scan failed', 'Finding: critical CVE in base image', 'Status: PR blocked', 'Next step: update base image and rebuild'],
    oidc: ['Deployment blocked', 'Finding: environment approval missing for production', 'Status: job waiting', 'Next step: approve from protected environment'],
  };
  return fence('text', map[kind] || ['Security check failed', 'Finding: high confidence issue found', 'Status: PR blocked', 'Next step: fix changed file and rerun workflow']);
}

function blogRecommendations(kind) {
  const base = ['Make the check required only after tuning.', 'Show result in the pull request.', 'Track exceptions with owner, reason, and expiry.'];
  const specific = {
    secret: ['Run secret checks in pre-commit and PR.', 'Rotate exposed secrets immediately.'],
    sast: ['Start with high confidence rules.', 'Tune noisy rules before blocking all PRs.'],
    sca: ['Review lock file changes.', 'Block critical exploitable dependency issues.'],
    iac: ['Scan Terraform and Kubernetes manifests in PR.', 'Block internet exposure and privileged workloads.'],
    container: ['Pin base images.', 'Run containers as non-root where possible.'],
    oidc: ['Use short-lived cloud credentials.', 'Restrict trust policy by repo, branch, and environment.'],
    supply: ['Generate SBOM in CI.', 'Sign and verify artifacts before deployment.'],
  };
  return [...(specific[kind] || ['Keep workflow permissions minimum.', 'Review workflow changes carefully.']), ...base].map((item) => '- ' + item).join('\n');
}

function blogTemplate([file, title, why, attack]) {
  const kind = blogKind(title);
  return `---
slug: ${slugFromFile(file)}
title: ${title}
authors: [narendra]
tags: [devsecops, cicd-security, appsec, github-actions]
---

${why}

In real projects, this is not a theory topic. It affects pull requests, CI jobs, secrets, artifacts, deployments, and sometimes production directly.

<!-- truncate -->

## Why This Matters

Nowadays most deployments are automated using CI/CD pipelines. If pipeline security is weak, attackers can use the same automation that developers use.

For this topic, the practical risk is simple: ${attack}.

## What Usually Goes Wrong

Common mistakes I have seen in real projects:

${blogMistakes(kind)}

## Basic Flow

${blogDiagram(kind)}

## Practical GitHub Actions Example

${blogWorkflow(kind)}

## Vulnerable Example

${blogBadExample(kind)}

This is risky because it trusts too much by default. In real teams this usually becomes a problem during a rushed release or when a small PR is approved without checking the pipeline impact.

## Secure Fix

${blogWorkflow(kind)}

## Example PR Output

${blogPR(kind)}

## Practical Recommendations

${blogRecommendations(kind)}

Security should help developers fix issues early. It should not become random CI noise.
`;
}

for (const topic of blogTopics) {
  writeFileSync(topic[0], blogTemplate(topic));
}
