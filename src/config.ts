export const siteConfig = {
  name: 'Gao Yuze',
  title: 'Gao Yuze | Public Mind',
  description:
    'Long-form thoughts, books, and records of learning from Gao Yuze.',
  url: 'https://gaoyuze.com',
  language: 'en',
  since: '2026',
  cadence: '~2 essays / month',
  nav: [
    { label: 'Articles', href: '/articles/' },
    { label: 'Books', href: '/books/' },
    { label: 'About', href: '/about/' }
  ],
  current: {
    label: 'Currently',
    title: 'Building a public mind',
    detail: 'Writing, reading, and keeping score in the open.'
  },
  stats: [
    { label: 'Since', value: '2026' },
    { label: 'Languages', value: 'English · 中文' },
    { label: 'Cadence', value: '~2 essays / month' },
    { label: 'Mode', value: 'Long apprenticeship' }
  ],
  statusLine: [
    'Public mind',
    'Bilingual notes',
    'Books in progress',
    'Daily evidence'
  ],
  socialLinks: [{ label: 'RSS', href: '/rss.xml' }],
  footer:
    'Maintained by Gao Yuze. Set in a Newsreader and Inter inspired typographic system. Built in public where possible.'
};

export const languageLabels: Record<string, string> = {
  en: 'English',
  zh: '中文'
};
