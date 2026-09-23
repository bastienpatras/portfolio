import type { Publication } from '@/types';

export const publications: Publication[] = [
  {
    id: 'mandatory-disclosure',
    title: 'Mandatory Disclosure and Housing Market Dynamics',
    authors: ['Bastien Patras'],
    year: 2024,
    status: 'working-paper',
    venue: 'Sciences Po',
    abstract:
      'This paper studies how mandatory disclosure of energy performance affects housing market outcomes, using the 2021 reform that made Energy Performance Certificate (EPC) ratings legally binding and visible in all real-estate advertisements in France. Leveraging staggered implementation across neighboring countries and rich microdata on property listings, I combine quasi-experimental and market-wide evidence to study the effects of energy performance disclosure on housing prices. At the France\u2013Belgium border, mandatory disclosure induces a large and persistent price penalty of around 10 percentage points for energy-intensive dwellings. At the national level, energy inefficiency is consistently penalized across property types. Most strikingly, and contrary to the prediction of full unraveling, non-disclosure persists and is rewarded: listings without an EPC rating command a persistent premium of roughly 6 percentage points in the apartment market several years after the reform.',
    artifacts: [
      { type: 'pdf', url: '/papers/green-premium-disclosure-2025.pdf' },
      { type: 'code', url: 'https://github.com/bastienpatras/green-premium-disclosure' },
    ],
    tags: ['Mandatory-Disclosure', 'Housing-Markets', 'Energy-Economics', 'EPC', 'Unraveling', 'Cross-Border', 'France-Belgium'],
    relatedIds: ['silence-pays', 'rental-tension'],
    bibtex: `@unpublished{patras2025mandatory,
  title={Mandatory Disclosure and Housing Market Dynamics},
  author={Patras, Bastien},
  year={2025},
  note={Working Paper, Sciences Po}
}`,
    lastUpdated: '2025-09-22',
  },
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
    relatedIds: ['mandatory-disclosure', 'rental-tension'],
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
    year: 2026,
    status: 'working-paper',
    venue: 'Sciences Po',
    abstract:
      'This paper presents descriptive evidence on the relationship between energy performance certificate non-disclosure and rental market tension in France. Using a listing-spell panel from SeLoger covering 2018Q1\u20132025Q4 (approximately 6.7 million spells), the analysis examines how seeker activity, time on market, and listing characteristics interact with the zone tendue regulatory framework and the July 2021 DPE reform.',
    artifacts: [
      { type: 'slides', url: '/papers/rental-tension-slides-2025.pdf' },
      { type: 'code', url: 'https://github.com/bastienpatras/rental-disclosure-tension' },
    ],
    tags: ['Rental-Markets', 'Non-Disclosure', 'Energy-Performance', 'Market-Tension', 'Housing-Policy'],
    relatedIds: ['mandatory-disclosure', 'silence-pays'],
    bibtex: `@unpublished{patras2025rental,
  title={Non-Disclosure and Rental Market Tension: Descriptive Evidence},
  author={Patras, Bastien},
  year={2025},
  note={Working Paper, Sciences Po}
}`,
    lastUpdated: '2025-09-22',
  },
];
