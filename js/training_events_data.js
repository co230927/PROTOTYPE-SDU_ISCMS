/**
 * Seed data for director assignment board prototype (6 assigned training events).
 * offices: string[] codes matching office filter keys where applicable (SDU_ONLY -> display as SDU).
 */
const TRAINING_EVENTS_SEED = [
    {
        id: 'tevt-001',
        trainingName: 'Disaster Risk Reduction',
        description: 'Standard competency assignment covering hazard mapping, preparedness planning, and community drills.',
        category: 'Environmental Stewardship',
        deadline: '2026-05-12',
        nature: 'Internal',
        scope: 'Local',
        venue: 'ACCA Learning Hall — Annex B',
        offices: ['ACCA'],
        assignedPersons: [
            { name: 'Carlos Miguel V. Tingson', office: 'ACCA', role: 'Participant', status: 'pending' },
            { name: 'Elena Mae R. Castro', office: 'ACCA', role: 'Facilitator', status: 'pending' }
        ]
    },
    {
        id: 'tevt-002',
        trainingName: 'Digital Records and Responsible Systems',
        description: 'Data handling, archiving, and privacy-aware documentation for SDU units.',
        category: 'Data & Digital Literacy',
        deadline: '2026-05-28',
        nature: 'Internal',
        scope: 'Regional',
        venue: 'Virtual Learning Hub',
        offices: ['ACES'],
        assignedPersons: [
            { name: 'Dorothy M. Ubag', office: 'ACES', role: 'Speaker', status: 'pending' },
            { name: 'Matthew C. Larracochea', office: 'ACES', role: 'Participant', status: 'pending' }
        ]
    },
    {
        id: 'tevt-003',
        trainingName: 'Stakeholder Engagement Simulation',
        description: 'Scenario-based practice for consultations, grievance pathways, and follow-through.',
        category: 'Peace Education & Advocacy',
        deadline: '2026-06-05',
        nature: 'External',
        scope: 'National',
        venue: 'Regional Convention Hall',
        offices: ['APC', 'CCES'],
        assignedPersons: [
            { name: 'Ismael G. Ibrahim', office: 'APC', role: 'Organizer', status: 'pending' },
            { name: 'Nur-Aisa J. Salim', office: 'APC', role: 'Participant', status: 'pending' },
            { name: 'Rosalinda C. Guerrero', office: 'CCES', role: 'Participant', status: 'pending' }
        ]
    },
    {
        id: 'tevt-004',
        trainingName: 'Leadership for Multi-Center Teams',
        description: 'Coordinating priorities across satellite offices without duplicating workloads.',
        category: 'Leadership & Governance',
        deadline: '2026-04-15',
        nature: 'Internal',
        scope: 'Local',
        offices: ['ACLG'],
        assignedPersons: [
            { name: 'Jonathan D. Reyes', office: 'ACLG', role: 'Participant', status: 'completed' },
            { name: 'Patricia Ann S. Cruz', office: 'ACLG', role: 'Facilitator', status: 'completed' }
        ]
    },
    {
        id: 'tevt-005',
        trainingName: 'Program Evaluation in Practice',
        description: 'Logic models, indicators, and light-touch reporting for ongoing programs.',
        category: 'Project Management',
        deadline: '2026-04-22',
        nature: 'Internal',
        scope: 'Regional',
        venue: 'ALTEC Collaborative Studio',
        offices: ['ALTEC'],
        assignedPersons: [
            { name: 'Victoriano F. Santos', office: 'ALTEC', role: 'Organizer', status: 'completed' },
            { name: 'Luzviminda M. Diaz', office: 'ALTEC', role: 'Participant', status: 'completed' },
            { name: 'Fernando J. Mercado', office: 'ALTEC', role: 'Participant', status: 'completed' }
        ]
    },
    {
        id: 'tevt-006',
        trainingName: 'Community Organizing Foundations',
        description: 'Entry-level organizing cycle: listen, prioritize, mobilize, and evaluate.',
        category: 'Community Organizing',
        deadline: '2026-03-30',
        nature: 'Internal',
        scope: 'Local',
        venue: 'Community Learning Center',
        offices: ['SDU_ONLY', 'ACES'],
        assignedPersons: [
            { name: 'Ricardo P. Alindayu', office: 'SDU', role: 'Participant', status: 'completed' },
            { name: 'Sarah Jane F. Mendez', office: 'ACES', role: 'Speaker', status: 'completed' }
        ]
    }
];
