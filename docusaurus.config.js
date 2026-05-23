// @ts-check

const config = {
  title: 'Enterprise CI/CD Security',
  tagline: 'Practical DevSecOps, SCM Security, GitHub Actions Security, and Software Supply Chain Security',
  url: 'https://narendra486.github.io',
  baseUrl: '/devsecops-blogs/',
  organizationName: 'narendra486',
  projectName: 'devsecops-blogs',

  onBrokenLinks: 'throw',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  markdown: {
    mermaid: true,
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },
  themes: ['@docusaurus/theme-mermaid'],

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.js',
          routeBasePath: '/',
        },
        blog: {
          showReadingTime: true,
          routeBasePath: 'blog',
          blogTitle: 'Enterprise CI/CD Security Blog',
          blogDescription: 'Practical DevSecOps articles by Narendra Palla.',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      },
    ],
  ],

  themeConfig: {
    navbar: {
      title: 'Enterprise CI/CD Security',
      items: [
        {to: '/', label: 'Docs', position: 'left'},
        {to: '/blog', label: 'Blog', position: 'left'},
        {
          href: 'https://github.com/narendra486/devsecops-blogs',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Series',
          items: [
            {label: 'CI/CD Fundamentals', to: '/cicd-security-fundamentals'},
            {label: 'SCM Security', to: '/scm-security'},
            {label: 'GitHub Actions Security', to: '/github-actions-security'},
            {label: 'Supply Chain Security', to: '/supply-chain-security'},
          ],
        },
        {
          title: 'Deploy',
          items: [
            {label: 'GitHub Pages', href: 'https://narendra486.github.io/devsecops-blogs/'},
            {label: 'Repository', href: 'https://github.com/narendra486/devsecops-blogs'},
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Narendra Palla. Built with Docusaurus.`,
    },
    prism: {
      additionalLanguages: ['bash', 'docker', 'hcl', 'json', 'yaml'],
    },
    colorMode: {
      defaultMode: 'light',
      disableSwitch: false,
      respectPrefersColorScheme: false,
    },
  },
};

export default config;
