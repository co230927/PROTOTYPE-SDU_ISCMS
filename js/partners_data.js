/**
 * Partner institutions seed data (prototype).
 */
const PARTNERS_SEED = [
    {
        id: 'part-001',
        name: 'Zamboanga City Disaster Risk Reduction Office',
        type: 'Local Government',
        contactPerson: 'Engr. Maria L. Santos',
        email: 'm.santos@zamboanga.gov.ph',
        phone: '+63 62 991 1001',
        mouFile: 'MOU_ZCDRRMO_2025.pdf',
        mouExpiry: '2026-09-30',
        contributions: [
            { period: '2025-Q1', label: 'Q1 2025', trainings: 2, staffReached: 28, inKindValue: 45000 },
            { period: '2025-Q2', label: 'Q2 2025', trainings: 1, staffReached: 15, inKindValue: 22000 },
            { period: '2025-Q3', label: 'Q3 2025', trainings: 3, staffReached: 40, inKindValue: 61000 },
            { period: '2025-Q4', label: 'Q4 2025', trainings: 2, staffReached: 22, inKindValue: 38000 },
            { period: '2025', label: 'CY 2025', trainings: 8, staffReached: 105, inKindValue: 166000 },
            { period: '2025-S1', label: '1st Sem 2025', trainings: 3, staffReached: 43, inKindValue: 67000 },
            { period: '2025-S2', label: '2nd Sem 2025', trainings: 5, staffReached: 62, inKindValue: 99000 }
        ]
    },
    {
        id: 'part-002',
        name: 'PeaceBuilders Community, Inc.',
        type: 'NGO',
        contactPerson: 'Rev. Daniel R. Abubakar',
        email: 'd.abubakar@peacebuilders.org',
        phone: '+63 917 555 2200',
        mouFile: 'MOU_PeaceBuilders_2024.pdf',
        mouExpiry: '2026-09-15',
        contributions: [
            { period: '2025-Q1', label: 'Q1 2025', trainings: 1, staffReached: 20, inKindValue: 30000 },
            { period: '2025-Q2', label: 'Q2 2025', trainings: 2, staffReached: 35, inKindValue: 52000 },
            { period: '2025', label: 'CY 2025', trainings: 5, staffReached: 80, inKindValue: 120000 },
            { period: '2025-S1', label: '1st Sem 2025', trainings: 3, staffReached: 55, inKindValue: 82000 },
            { period: '2025-S2', label: '2nd Sem 2025', trainings: 2, staffReached: 25, inKindValue: 38000 }
        ]
    },
    {
        id: 'part-003',
        name: 'Western Mindanao State University — Extension Office',
        type: 'Academic Institution',
        contactPerson: 'Dr. Helen C. Rivera',
        email: 'h.rivera@wmsu.edu.ph',
        phone: '+63 62 991 1777',
        mouFile: 'MOU_WMSU_Extension_2025.pdf',
        mouExpiry: '2027-01-31',
        contributions: [
            { period: '2025-Q3', label: 'Q3 2025', trainings: 1, staffReached: 18, inKindValue: 25000 },
            { period: '2025-Q4', label: 'Q4 2025', trainings: 1, staffReached: 12, inKindValue: 18000 },
            { period: '2025', label: 'CY 2025', trainings: 2, staffReached: 30, inKindValue: 43000 },
            { period: '2025-S2', label: '2nd Sem 2025', trainings: 2, staffReached: 30, inKindValue: 43000 }
        ]
    },
    {
        id: 'part-004',
        name: 'Philippine Red Cross — Zamboanga Chapter',
        type: 'Humanitarian',
        contactPerson: 'Mr. Jose A. Lim',
        email: 'j.lim@redcross.org.ph',
        phone: '+63 62 992 3344',
        mouFile: 'MOU_PRC_Zamboanga_2025.pdf',
        mouExpiry: '2026-10-30',
        contributions: [
            { period: '2025-Q1', label: 'Q1 2025', trainings: 2, staffReached: 45, inKindValue: 70000 },
            { period: '2025-Q2', label: 'Q2 2025', trainings: 1, staffReached: 20, inKindValue: 28000 },
            { period: '2025', label: 'CY 2025', trainings: 4, staffReached: 90, inKindValue: 130000 },
            { period: '2025-S1', label: '1st Sem 2025', trainings: 3, staffReached: 65, inKindValue: 98000 },
            { period: '2025-S2', label: '2nd Sem 2025', trainings: 1, staffReached: 25, inKindValue: 32000 }
        ]
    },
    {
        id: 'part-005',
        name: 'Department of Social Welfare and Development — FO IX',
        type: 'National Government',
        contactPerson: 'Ms. Ana Belinda T. Gomez',
        email: 'ab.gomez@dswd.gov.ph',
        phone: '+63 62 991 5566',
        mouFile: 'MOU_DSWD_FO9_2024.pdf',
        mouExpiry: '2026-08-28',
        contributions: [
            { period: '2025', label: 'CY 2025', trainings: 3, staffReached: 60, inKindValue: 95000 },
            { period: '2025-S1', label: '1st Sem 2025', trainings: 2, staffReached: 40, inKindValue: 60000 },
            { period: '2025-S2', label: '2nd Sem 2025', trainings: 1, staffReached: 20, inKindValue: 35000 }
        ]
    },
    {
        id: 'part-006',
        name: 'Sacred Heart Parish Social Action Center',
        type: 'Faith-Based',
        contactPerson: 'Sr. Theresa M. Villanueva',
        email: 't.villanueva@shp-sac.org',
        phone: '+63 917 888 4411',
        mouFile: 'MOU_SHP_SAC_2025.pdf',
        mouExpiry: '2028-03-15',
        contributions: [
            { period: '2025-Q4', label: 'Q4 2025', trainings: 1, staffReached: 14, inKindValue: 15000 },
            { period: '2025', label: 'CY 2025', trainings: 1, staffReached: 14, inKindValue: 15000 },
            { period: '2025-S2', label: '2nd Sem 2025', trainings: 1, staffReached: 14, inKindValue: 15000 }
        ]
    }
];

const PARTNERS_STORAGE_KEY = 'iscms_partners_v1';
const EXPIRING_SOON_DAYS = 90;

function loadPartners() {
    try {
        const raw = localStorage.getItem(PARTNERS_STORAGE_KEY);
        if (raw) {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed) && parsed.length) {
                return parsed.map((partner) => ({ ...partner, office: partner.office || 'SDU' }));
            }
        }
    } catch (e) { /* ignore */ }
    return PARTNERS_SEED.map((p) => ({ ...p, office: p.office || 'SDU', contributions: (p.contributions || []).map((c) => ({ ...c })) }));
}

function savePartners(list) {
    localStorage.setItem(PARTNERS_STORAGE_KEY, JSON.stringify(list));
}

function getPartnerById(id) {
    return loadPartners().find((p) => p.id === id) || null;
}

function daysUntil(dateStr) {
    const target = new Date(dateStr + 'T00:00:00');
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return Math.ceil((target - today) / (1000 * 60 * 60 * 24));
}

function getExpiringSoonPartners(withinDays) {
    const days = withinDays == null ? EXPIRING_SOON_DAYS : withinDays;
    return loadPartners().filter((p) => {
        const d = daysUntil(p.mouExpiry);
        return d >= 0 && d <= days;
    });
}

function getExpiringSoonCount(withinDays) {
    return getExpiringSoonPartners(withinDays).length;
}

function filterPartnerContributions(partner, filterMode) {
    const items = (partner && partner.contributions) || [];
    if (filterMode === 'Yearly') {
        return items.filter((c) => /^\d{4}$/.test(c.period));
    }
    if (filterMode === 'Quarterly') {
        return items.filter((c) => /Q\d/.test(c.period));
    }
    if (filterMode === 'Semestral') {
        return items.filter((c) => /S\d/.test(c.period));
    }
    return items;
}

window.PARTNERS_SEED = PARTNERS_SEED;
window.loadPartners = loadPartners;
window.savePartners = savePartners;
window.getPartnerById = getPartnerById;
window.getExpiringSoonPartners = getExpiringSoonPartners;
window.getExpiringSoonCount = getExpiringSoonCount;
window.filterPartnerContributions = filterPartnerContributions;
window.daysUntil = daysUntil;
