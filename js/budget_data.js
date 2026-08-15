/**
 * Office and event budget seed data (prototype).
 * Supports office → funded events → expense drill-down and staff expense logging.
 */
const OFFICE_BUDGETS = [
    { office: 'ACCA', allocated: 185000, spent: 112400 },
    { office: 'ACES', allocated: 160000, spent: 98000 },
    { office: 'ACLG', allocated: 142000, spent: 121500 },
    { office: 'APC', allocated: 175000, spent: 89000 },
    { office: 'CCES', allocated: 150000, spent: 134200 },
    { office: 'ALTEC', allocated: 168000, spent: 76000 },
    { office: 'SDU', allocated: 320000, spent: 198500 }
];

/**
 * Event budgets keyed by training event id (matches TRAINING_EVENTS_SEED).
 * officeAllocations: portion of office budget directed to this event
 * fundingSources: partner / co-funding contributions
 * expenses: logged line items (loggedBy / loggedAt for audit trail)
 */
const EVENT_BUDGETS_SEED = {
    'tevt-001': {
        eventId: 'tevt-001',
        eventName: 'Disaster Risk Reduction',
        allocated: 45000,
        officeAllocations: [{ office: 'ACCA', amount: 45000 }],
        fundingSources: [
            { partnerId: 'part-001', partnerName: 'Zamboanga City Disaster Risk Reduction Office', amount: 15000, type: 'In-kind' },
            { partnerId: 'part-004', partnerName: 'Philippine Red Cross — Zamboanga Chapter', amount: 8000, type: 'Cash' }
        ],
        expenses: [
            { id: 'exp-001a', description: 'Venue and sound system rental', amount: 12000, loggedBy: 'Carlos Miguel V. Tingson', loggedAt: '2026-04-02' },
            { id: 'exp-001b', description: 'Participant kits and materials', amount: 8500, loggedBy: 'Elena Mae R. Castro', loggedAt: '2026-04-08' },
            { id: 'exp-001c', description: 'Meals and refreshments (2 days)', amount: 15000, loggedBy: 'Carlos Miguel V. Tingson', loggedAt: '2026-04-10' }
        ]
    },
    'tevt-002': {
        eventId: 'tevt-002',
        eventName: 'Digital Records and Responsible Systems',
        allocated: 28000,
        officeAllocations: [{ office: 'ACES', amount: 28000 }],
        fundingSources: [
            { partnerId: 'part-003', partnerName: 'Western Mindanao State University — Extension Office', amount: 5000, type: 'In-kind' }
        ],
        expenses: [
            { id: 'exp-002a', description: 'Virtual platform license (month)', amount: 6500, loggedBy: 'Dorothy M. Ubag', loggedAt: '2026-04-20' },
            { id: 'exp-002b', description: 'Resource speaker honorarium', amount: 10000, loggedBy: 'Dorothy M. Ubag', loggedAt: '2026-04-22' },
            { id: 'exp-002c', description: 'Printed workbooks', amount: 4200, loggedBy: 'Matthew C. Larracochea', loggedAt: '2026-04-25' }
        ]
    },
    'tevt-003': {
        eventId: 'tevt-003',
        eventName: 'Stakeholder Engagement Simulation',
        allocated: 52000,
        officeAllocations: [
            { office: 'APC', amount: 30000 },
            { office: 'CCES', amount: 22000 }
        ],
        fundingSources: [
            { partnerId: 'part-002', partnerName: 'PeaceBuilders Community, Inc.', amount: 18000, type: 'In-kind' },
            { partnerId: 'part-005', partnerName: 'Department of Social Welfare and Development — FO IX', amount: 12000, type: 'Cash' }
        ],
        expenses: [
            { id: 'exp-003a', description: 'Convention hall booking', amount: 22000, loggedBy: 'Ismael G. Ibrahim', loggedAt: '2026-05-10' },
            { id: 'exp-003b', description: 'Transportation subsidy', amount: 14000, loggedBy: 'Rosalinda C. Guerrero', loggedAt: '2026-05-12' },
            { id: 'exp-003c', description: 'Simulation props and printed scenarios', amount: 7800, loggedBy: 'Nur-Aisa J. Salim', loggedAt: '2026-05-14' },
            { id: 'exp-003d', description: 'Catering (lunch + snacks)', amount: 11000, loggedBy: 'Ismael G. Ibrahim', loggedAt: '2026-05-15' }
        ]
    },
    'tevt-004': {
        eventId: 'tevt-004',
        eventName: 'Leadership for Multi-Center Teams',
        allocated: 35000,
        officeAllocations: [{ office: 'ACLG', amount: 35000 }],
        fundingSources: [],
        expenses: [
            { id: 'exp-004a', description: 'Facilitator honorarium', amount: 12000, loggedBy: 'Patricia Ann S. Cruz', loggedAt: '2026-03-28' },
            { id: 'exp-004b', description: 'Training materials', amount: 6500, loggedBy: 'Jonathan D. Reyes', loggedAt: '2026-03-30' },
            { id: 'exp-004c', description: 'Office supplies and certificates', amount: 3800, loggedBy: 'Patricia Ann S. Cruz', loggedAt: '2026-04-02' }
        ]
    },
    'tevt-005': {
        eventId: 'tevt-005',
        eventName: 'Program Evaluation in Practice',
        allocated: 30000,
        officeAllocations: [{ office: 'ALTEC', amount: 30000 }],
        fundingSources: [
            { partnerId: 'part-003', partnerName: 'Western Mindanao State University — Extension Office', amount: 7500, type: 'In-kind' }
        ],
        expenses: [
            { id: 'exp-005a', description: 'Studio space (ALTEC)', amount: 8000, loggedBy: 'Victoriano F. Santos', loggedAt: '2026-04-05' },
            { id: 'exp-005b', description: 'Survey tool subscription', amount: 5500, loggedBy: 'Luzviminda M. Diaz', loggedAt: '2026-04-08' },
            { id: 'exp-005c', description: 'Snacks for workshop days', amount: 7200, loggedBy: 'Fernando J. Mercado', loggedAt: '2026-04-12' }
        ]
    },
    'tevt-006': {
        eventId: 'tevt-006',
        eventName: 'Community Organizing Foundations',
        allocated: 40000,
        officeAllocations: [
            { office: 'SDU', amount: 25000 },
            { office: 'ACES', amount: 15000 }
        ],
        fundingSources: [
            { partnerId: 'part-006', partnerName: 'Sacred Heart Parish Social Action Center', amount: 10000, type: 'In-kind' },
            { partnerId: 'part-002', partnerName: 'PeaceBuilders Community, Inc.', amount: 6000, type: 'Cash' }
        ],
        expenses: [
            { id: 'exp-006a', description: 'Community venue rental', amount: 9000, loggedBy: 'Ricardo P. Alindayu', loggedAt: '2026-03-10' },
            { id: 'exp-006b', description: 'Field visit transport', amount: 11500, loggedBy: 'Sarah Jane F. Mendez', loggedAt: '2026-03-12' },
            { id: 'exp-006c', description: 'Learning kits', amount: 7800, loggedBy: 'Sarah Jane F. Mendez', loggedAt: '2026-03-14' },
            { id: 'exp-006d', description: 'Documentation (photo/video)', amount: 5000, loggedBy: 'Ricardo P. Alindayu', loggedAt: '2026-03-16' }
        ]
    }
};

const BUDGET_WARNING_RATIO = 0.8;
const EVENT_BUDGET_STORAGE_KEY = 'iscms_event_budgets_v2';

function cloneEventBudgets(source) {
    const out = {};
    Object.keys(source).forEach((id) => {
        const b = source[id];
        out[id] = {
            ...b,
            officeAllocations: (b.officeAllocations || []).map((o) => ({ ...o })),
            fundingSources: (b.fundingSources || []).map((f) => ({ ...f })),
            expenses: (b.expenses || []).map((e) => ({ ...e }))
        };
    });
    return out;
}

function loadEventBudgets() {
    try {
        const raw = localStorage.getItem(EVENT_BUDGET_STORAGE_KEY);
        if (raw) {
            const parsed = JSON.parse(raw);
            if (parsed && typeof parsed === 'object') return parsed;
        }
    } catch (e) { /* ignore */ }
    return cloneEventBudgets(EVENT_BUDGETS_SEED);
}

function saveEventBudgets(map) {
    localStorage.setItem(EVENT_BUDGET_STORAGE_KEY, JSON.stringify(map));
}

/** Live map used by getters (seed + localStorage overlays). */
let EVENT_BUDGETS = loadEventBudgets();

function refreshEventBudgetsFromStorage() {
    EVENT_BUDGETS = loadEventBudgets();
    window.EVENT_BUDGETS = EVENT_BUDGETS;
    return EVENT_BUDGETS;
}

function formatPeso(amount) {
    const n = Number(amount) || 0;
    return '₱' + n.toLocaleString('en-PH', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

function normalizeOfficeCode(code) {
    const c = String(code || '').trim().toUpperCase();
    if (c === 'SDU_ONLY') return 'SDU';
    return c;
}

function getOfficeBudgetRows() {
    return OFFICE_BUDGETS.map((row) => {
        const remaining = row.allocated - row.spent;
        const ratio = row.allocated > 0 ? row.spent / row.allocated : 0;
        return {
            ...row,
            remaining,
            ratio,
            overThreshold: ratio >= BUDGET_WARNING_RATIO
        };
    });
}

function getOfficeBudgetRow(officeCode) {
    const code = normalizeOfficeCode(officeCode);
    return getOfficeBudgetRows().find((r) => r.office === code) || null;
}

function summarizeEventBudget(budget) {
    if (!budget) return null;
    const spent = (budget.expenses || []).reduce((sum, e) => sum + Number(e.amount || 0), 0);
    const remaining = budget.allocated - spent;
    const ratio = budget.allocated > 0 ? spent / budget.allocated : 0;
    return {
        ...budget,
        spent,
        remaining,
        ratio,
        overThreshold: ratio >= BUDGET_WARNING_RATIO
    };
}

function getEventBudget(eventId) {
    refreshEventBudgetsFromStorage();
    return summarizeEventBudget(EVENT_BUDGETS[eventId] || null);
}

function findEventBudgetByName(eventName) {
    refreshEventBudgetsFromStorage();
    const name = String(eventName || '').trim().toLowerCase();
    if (!name) return null;
    const key = Object.keys(EVENT_BUDGETS).find((id) => {
        return String(EVENT_BUDGETS[id].eventName || '').trim().toLowerCase() === name;
    });
    return key ? getEventBudget(key) : null;
}

/**
 * Events funded by an office (via officeAllocations).
 * Falls back to TRAINING_EVENTS_SEED.offices when allocations are missing.
 */
function getEventsFundedByOffice(officeCode) {
    refreshEventBudgetsFromStorage();
    const code = normalizeOfficeCode(officeCode);
    const rows = [];

    Object.keys(EVENT_BUDGETS).forEach((id) => {
        const budget = EVENT_BUDGETS[id];
        const allocations = budget.officeAllocations || [];
        let officeShare = allocations.find((a) => normalizeOfficeCode(a.office) === code);

        if (!officeShare && typeof TRAINING_EVENTS_SEED !== 'undefined') {
            const evt = TRAINING_EVENTS_SEED.find((e) => e.id === id);
            const offices = (evt && evt.offices) || [];
            const matches = offices.some((o) => normalizeOfficeCode(o) === code);
            if (matches) {
                officeShare = { office: code, amount: budget.allocated };
            }
        }

        if (!officeShare) return;
        const summary = summarizeEventBudget(budget);
        rows.push({
            eventId: id,
            eventName: budget.eventName,
            officeAllocated: Number(officeShare.amount) || 0,
            allocated: summary.allocated,
            spent: summary.spent,
            remaining: summary.remaining,
            ratio: summary.ratio,
            overThreshold: summary.overThreshold,
            expenseCount: (budget.expenses || []).length,
            fundingSources: budget.fundingSources || []
        });
    });

    return rows.sort((a, b) => a.eventName.localeCompare(b.eventName));
}

function addEventExpense(eventId, entry) {
    refreshEventBudgetsFromStorage();
    const budget = EVENT_BUDGETS[eventId];
    if (!budget) return null;
    const record = {
        id: 'exp-' + Date.now(),
        description: String(entry.description || '').trim(),
        amount: Number(entry.amount) || 0,
        loggedBy: entry.loggedBy || 'Unknown',
        loggedAt: entry.loggedAt || new Date().toISOString().slice(0, 10)
    };
    if (!record.description || record.amount <= 0) return null;
    budget.expenses = budget.expenses || [];
    budget.expenses.push(record);
    saveEventBudgets(EVENT_BUDGETS);
    return summarizeEventBudget(budget);
}

function isStaffAssignedToEvent(eventId, staffName) {
    if (typeof TRAINING_EVENTS_SEED === 'undefined') return false;
    const evt = TRAINING_EVENTS_SEED.find((e) => e.id === eventId);
    if (!evt) return false;
    return (evt.assignedPersons || []).some((p) => p.name === staffName);
}

window.OFFICE_BUDGETS = OFFICE_BUDGETS;
window.EVENT_BUDGETS_SEED = EVENT_BUDGETS_SEED;
window.EVENT_BUDGETS = EVENT_BUDGETS;
window.BUDGET_WARNING_RATIO = BUDGET_WARNING_RATIO;
window.formatPeso = formatPeso;
window.getOfficeBudgetRows = getOfficeBudgetRows;
window.getOfficeBudgetRow = getOfficeBudgetRow;
window.getEventBudget = getEventBudget;
window.findEventBudgetByName = findEventBudgetByName;
window.getEventsFundedByOffice = getEventsFundedByOffice;
window.addEventExpense = addEventExpense;
window.isStaffAssignedToEvent = isStaffAssignedToEvent;
window.refreshEventBudgetsFromStorage = refreshEventBudgetsFromStorage;
window.normalizeOfficeCode = normalizeOfficeCode;
