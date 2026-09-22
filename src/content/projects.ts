import type { Project } from '@/types';

export const projects: Project[] = [
  {
    id: 'energy-housing-market',
    title: 'Energy Regulation and Housing Market Dynamics',
    description:
      'My PhD dissertation research examines how energy regulation policies impact housing markets and urban development. This comprehensive research program investigates the effects of environmental legislation, particularly the "Loi Energie & Climat," on real estate valuations, market dynamics, and household decision-making. Using advanced econometric methods and large-scale data analysis, I analyze the causal effects of energy performance standards on housing prices, transaction volumes, and renovation investments across French municipalities.',
    tags: ['urban-economics', 'real-estate', 'energy-policy', 'environmental-economics', 'causal-ML'],
    publicationIds: [],
    artifacts: [],
    year: 2024,
    lastUpdated: '2024-01-05',
  },
  {
    id: 'survival-analysis-tenure',
    title: 'Tenure Dynamics in France',
    description:
      'Research project with Dr. Angela Greulich (CRIS, Sciences Po) examining gender disparities in academic career trajectories among French doctoral candidates. This work applies survival analysis methods and Cox regression models to analyze the Génération survey data (Céreq), investigating how publication patterns, disciplinary fields, and demographic factors influence the transition to permanent academic positions (CNU qualification). The research reveals significant gender gaps in scientific publication rates during doctoral studies, with male PhD students showing 26.9% higher publication probability. The analysis demonstrates how these early-career publication disadvantages may accumulate and perpetuate gender disparities in senior research positions, particularly in STEM fields. The project combines web scraping techniques to gather comprehensive data on research performance and academic careers with rigorous statistical methods to identify key determinants of tenure success.',
    tags: ['survival-analysis', 'gender-economics', 'cox-regression', 'data-science', 'python', 'r'],
    publicationIds: [],
    artifacts: [
      { type: 'paper', url: 'https://journals.openedition.org/formationemploi/12964' },
    ],
    year: 2023,
    lastUpdated: '2023-05-01',
  },
  {
    id: 'media-ownership-narrative',
    title: 'Media Ownership and Narrative Capture',
    description:
      'Master thesis research supervised by Julia Cagé and Emeric Henry investigating how ownership structures influence media narratives through large-scale empirical analysis. This project employs computational text analysis, natural language processing, and econometric methods to quantify the relationship between media ownership concentration and editorial content. The research provides insights into media economics, political economy, and the role of information in democratic societies.',
    tags: ['media-economics', 'political-economy', 'text-analysis', 'NLP','cox-regression', 'topic-modeling'],
    publicationIds: [],
    artifacts: [],
    year: 2023,
    lastUpdated: '2023-05-01',
  },
  {
    id: 'blp-estimation',
    title: 'BLP Estimation and Demand Analysis',
    description:
      'Quantitative research project with Dr. Alfred Galichon (NYU, Harvard PhD) focused on implementing and extending the Berry-Levinsohn-Pakes (BLP) methodology for estimating demand in differentiated product markets. Developed Python replication code for BLP (1995, 1999, 2004) and implemented the MPEC (Mathematical Programming with Equilibrium Constraints) formulation for more efficient estimation. This work advances computational methods in industrial organization and provides tools for analyzing market competition and consumer welfare.',
    tags: ['industrial-organization', 'demand-estimation', 'blp', 'computational-economics', 'python', 'optimization'],
    publicationIds: [],
    artifacts: [],
    year: 2021,
    lastUpdated: '2021-07-01',
  },
  {
    id: 'environmental-kuznets-curve',
    title: 'Environmental Kuznets Curve: Empirical Validation',
    description:
      'Master thesis research at ENS Paris Saclay testing the empirical validity of the Environmental Kuznets Curve (EKC) hypothesis, which posits an inverted U-shaped relationship between economic development and environmental degradation. Using panel data methods and advanced econometric techniques, this work examines whether the EKC holds across different countries, time periods, and environmental indicators. The research contributes to understanding the relationship between economic growth and environmental sustainability.',
    tags: ['environmental-economics', 'panel-data-econometrics', 'sustainability',],
    publicationIds: [],
    artifacts: [],
    year: 2021,
    lastUpdated: '2021-05-01',
  },
];
