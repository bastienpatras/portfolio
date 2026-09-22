import type { Publication } from '@/types';

export const publications: Publication[] = [
  {
    id: 'mandatory-disclosure-empirics',
    title: 'Mandatory Disclosure and Housing Market Dynamics',
    authors: ['Bastien Patras'],
    year: 2025,
    status: 'working-paper',
    venue: 'Sciences Po',
    abstract:
      'This paper studies how mandatory disclosure of energy performance affects housing market outcomes, using the 2021 reform that made Energy Performance Certificate (EPC) ratings legally binding and visible in all real-estate advertisements in France. Leveraging staggered implementation across neighboring countries and rich microdata on property listings, I combine quasi-experimental and market-wide evidence to study the effects of energy performance disclosure on housing prices.',
    artifacts: [
      { type: 'pdf', url: 'https://drive.google.com/file/d/1MY84Rwuekne1igsZ7LCeRIRkO5Pj8pjC/view' },
      { type: 'slides', url: '/slides/neurips2024.pdf' },
      { type: 'code', url: 'https://github.com/example/efficient-attention' },
      { type: 'demo', url: '/apis/attention-demo' },
      { type: 'replication', url: 'https://github.com/example/causal-ml-guide/tree/main/replication' },
      { type: 'doi', url: 'https://github.com/example/causal-ml-guide/tree/main/replication' },
    ],
    tags: ['Government-Policy', 'Energy-Economics', 'Information-Economics', 'Real-Estate', 'Causal-ML', 'Causal-Inference'],
    relatedIds: ['efficient-attention-2023'],
    bibtex: `@inproceedings{bpatras2025,
  title={Mandatory Disclosure and Housing Market Dynamics},
  author={Patras},
  booktitle={Mandatory Disclosure and Housing Market Dynamics},
  year={2025}
}`,
    lastUpdated: '2025-12-27',
  },
];
