import type { Publication } from '@/types';

export const publications: Publication[] = [
  {
    id: 'silence-pays',
    title: 'When Silence Pays: Mandatory Disclosure and Strategic Concealment in Housing Markets',
    authors: ['Bastien Patras'],
    year: 2025,
    status: 'working-paper',
    venue: 'Sciences Po',
    abstract:
      'Standard unraveling theory predicts that mandatory disclosure separates high-quality from low-quality products: silence signals bad news and non-disclosers should trade at-or-below the worst disclosed category. We document the opposite. Following France\'s 2021 enforcement of Energy Performance Certificate disclosure, properties listed without a certified score trade at a premium of 6.9 percent above disclosed low-efficiency properties for apartments and 3.4 percent for houses. The puzzle resolves because non-disclosure pools informed sellers strategically concealing unfavorable scores with uninformed sellers who genuinely lack a certified audit. We build and structurally estimate a model of the disclosure game, bringing it to the data through a variable unobservable from the buyer\'s side: private listing data from SeLoger matched to the ADEME registry of certified energy audits.',
    artifacts: [
      { type: 'pdf', url: '/papers/silence-pays-2025.pdf' },
      { type: 'code', url: 'https://github.com/bastienpatras/structural-model-chapter-two' },
    ],
    tags: ['Mandatory-Disclosure', 'Housing-Markets', 'Information-Asymmetry', 'Unraveling', 'Energy-Economics', 'Structural-Estimation'],
    relatedIds: ['rental-tension'],
    bibtex: `@unpublished{patras2025silence,
  title={When Silence Pays: Mandatory Disclosure and Strategic Concealment in Housing Markets},
  author={Patras, Bastien},
  year={2025},
  note={Working Paper, Sciences Po}
}`,
    lastUpdated: '2025-09-22',
  },
  {
    id: 'rental-tension',
    title: 'Non-Disclosure and Rental Market Tension: Descriptive Evidence',
    authors: ['Bastien Patras'],
    year: 2025,
    status: 'working-paper',
    venue: 'Sciences Po',
    abstract:
      'This paper presents descriptive evidence on the relationship between energy performance certificate non-disclosure and rental market tension in France. Using a listing-spell panel from SeLoger covering 2018Q1\u20132025Q4 (approximately 6.7 million spells), the analysis examines how seeker activity, time on market, and listing characteristics interact with the zone tendue regulatory framework and the July 2021 DPE reform.',
    artifacts: [
      { type: 'slides', url: '/papers/rental-tension-slides-2025.pdf' },
      { type: 'code', url: 'https://github.com/bastienpatras/rental-disclosure-tension' },
    ],
    tags: ['Rental-Markets', 'Non-Disclosure', 'Energy-Performance', 'Market-Tension', 'Housing-Policy'],
    relatedIds: ['silence-pays'],
    bibtex: `@unpublished{patras2025rental,
  title={Non-Disclosure and Rental Market Tension: Descriptive Evidence},
  author={Patras, Bastien},
  year={2025},
  note={Working Paper, Sciences Po}
}`,
    lastUpdated: '2025-09-22',
  },
];
