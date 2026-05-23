// @ts-check

const config = {
  title: 'Practical CI/CD Security',
  tagline: 'AppSec learning series for real engineering teams',
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
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      },
    ],
  ],

  themeConfig: {
    navbar: {
      title: 'Practical CI/CD Security',
      items: [
        {to: '/', label: 'Learning Path', position: 'left'},
        {to: '/blog', label: 'Blog', position: 'left'},
        {
          href: 'https://github.com',
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
            {label: 'Fundamentals', to: '/fundamentals/cicd-security-fundamentals'},
            {label: 'Shift Left', to: '/fundamentals/shift-left-security'},
            {label: 'Pull Request Security', to: '/pull-request-security/building-secure-pr-pipelines'},
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Practical CI/CD Security.`,
    },
    prism: {
      additionalLanguages: ['bash', 'docker', 'hcl', 'yaml'],
    },
  },
};

export default config;
