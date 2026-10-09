/**
 * Skill evaluation / rating seed data (prototype).
 * Tied primarily to Elena Mae R. Castro (staff demo account).
 */
const RATING_LABELS = {
    1: 'Needs Improvement',
    2: 'Below Average',
    3: 'Satisfactory',
    4: 'Proficient',
    5: 'Excellent'
};

function getRatingLabel(rating) {
    return RATING_LABELS[Number(rating)] || '';
}

const EVALUATION_RATINGS_SEED = [
    {
        id: 'eval-001',
        staffName: 'Elena Mae R. Castro',
        skillId: 'facilitation',
        skillName: 'Facilitation',
        rating: 4,
        comment: 'Facilitated small-group sessions confidently during Community Organizing Foundations.',
        trainingTitle: 'Community Organizing Foundations',
        date: '2025-09-12'
    },
    {
        id: 'eval-002',
        staffName: 'Elena Mae R. Castro',
        skillId: 'community-organizing',
        skillName: 'Community Organizing',
        rating: 3,
        comment: 'Good field coordination; still building confidence with large assemblies.',
        trainingTitle: 'Barangay Mobilization Workshop',
        date: '2025-11-05'
    },
    {
        id: 'eval-003',
        staffName: 'Elena Mae R. Castro',
        skillId: 'stakeholder-engagement',
        skillName: 'Stakeholder Engagement',
        rating: 4,
        comment: 'Clear communication with LGU partners during consultation simulation.',
        trainingTitle: 'Stakeholder Engagement Simulation',
        date: '2026-01-18'
    },
    {
        id: 'eval-004',
        staffName: 'Elena Mae R. Castro',
        skillId: 'peace-education',
        skillName: 'Peace Education',
        rating: 5,
        comment: 'Excellent synthesis of peace concepts for mixed-office audience.',
        trainingTitle: 'Peace Education & Advocacy Clinic',
        date: '2026-03-02'
    },
    {
        id: 'eval-005',
        staffName: 'Elena Mae R. Castro',
        skillId: 'facilitation',
        skillName: 'Facilitation',
        rating: 5,
        comment: 'Led breakout rooms smoothly; peers rated engagement very high.',
        trainingTitle: 'Leadership for Multi-Center Teams',
        date: '2026-04-20'
    },
    {
        id: 'eval-006',
        staffName: 'Carlos Miguel V. Tingson',
        skillId: 'leadership',
        skillName: 'Leadership',
        rating: 4,
        comment: 'Strong coordination across ACCA team assignments.',
        trainingTitle: 'Disaster Risk Reduction',
        date: '2026-05-12',
        subjectRole: 'office_head'
    }
];

const EVALUATION_STORAGE_KEY = 'iscms_evaluations_v1';

function loadEvaluations() {
    try {
        const raw = localStorage.getItem(EVALUATION_STORAGE_KEY);
        if (raw) {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed)) return parsed;
        }
    } catch (e) { /* ignore */ }
    return EVALUATION_RATINGS_SEED.map((e) => ({ ...e }));
}

function saveEvaluations(list) {
    localStorage.setItem(EVALUATION_STORAGE_KEY, JSON.stringify(list));
}

function getEvaluationsForStaff(staffName) {
    return loadEvaluations()
        .filter((e) => e.staffName === staffName && e.subjectRole !== 'office_head')
        .sort((a, b) => String(a.date).localeCompare(String(b.date)));
}

function addEvaluation(entry) {
    const list = loadEvaluations();
    const record = {
        id: 'eval-' + Date.now(),
        staffName: entry.staffName,
        skillId: entry.skillId,
        skillName: entry.skillName || (typeof getSkillName === 'function' ? getSkillName(entry.skillId) : entry.skillId),
        rating: Number(entry.rating),
        comment: entry.comment || '',
        trainingTitle: entry.trainingTitle || '',
        date: entry.date || new Date().toISOString().slice(0, 10),
        ratedBy: entry.ratedBy || '',
        office: entry.office || '',
        subjectRole: entry.subjectRole || 'staff'
    };
    list.push(record);
    saveEvaluations(list);
    return record;
}

function addOfficeHeadEvaluation(entry) {
    return addEvaluation({ ...entry, subjectRole: 'office_head' });
}

function getEvaluationsForOfficeHead(headName) {
    return loadEvaluations()
        .filter((e) => e.staffName === headName && e.subjectRole === 'office_head')
        .sort((a, b) => String(a.date).localeCompare(String(b.date)));
}

function getOfficeHeadNamesList() {
    if (typeof officeHeads === 'undefined') return [];
    return Object.keys(officeHeads).map((code) => ({
        code: code === 'SDU_ONLY' ? 'SDU' : code,
        name: officeHeads[code]
    }));
}

function getEvaluationsForOffice(officeCode) {
    const code = String(officeCode || '').trim().toUpperCase();
    return loadEvaluations()
        .filter((e) => String(e.office || '').toUpperCase() === code)
        .sort((a, b) => String(a.date).localeCompare(String(b.date)));
}

function getOfficeHeadRatingTrendSummary(headName) {
    const items = getEvaluationsForOfficeHead(headName);
    if (!items.length) return { average: 0, count: 0, latest: null, items: [] };
    const sum = items.reduce((acc, e) => acc + Number(e.rating || 0), 0);
    return {
        average: Math.round((sum / items.length) * 10) / 10,
        count: items.length,
        latest: items[items.length - 1],
        items
    };
}

function getRatingTrendSummary(staffName) {
    const items = getEvaluationsForStaff(staffName);
    if (!items.length) return { average: 0, count: 0, latest: null, items: [] };
    const sum = items.reduce((acc, e) => acc + Number(e.rating || 0), 0);
    return {
        average: Math.round((sum / items.length) * 10) / 10,
        count: items.length,
        latest: items[items.length - 1],
        items
    };
}

window.EVALUATION_RATINGS_SEED = EVALUATION_RATINGS_SEED;
window.RATING_LABELS = RATING_LABELS;
window.getRatingLabel = getRatingLabel;
window.loadEvaluations = loadEvaluations;
window.saveEvaluations = saveEvaluations;
window.getEvaluationsForStaff = getEvaluationsForStaff;
window.getEvaluationsForOffice = getEvaluationsForOffice;
window.addEvaluation = addEvaluation;
window.addOfficeHeadEvaluation = addOfficeHeadEvaluation;
window.getEvaluationsForOfficeHead = getEvaluationsForOfficeHead;
window.getOfficeHeadNamesList = getOfficeHeadNamesList;
window.getOfficeHeadRatingTrendSummary = getOfficeHeadRatingTrendSummary;
window.getRatingTrendSummary = getRatingTrendSummary;
