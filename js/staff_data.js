// --- 1. PREMADE DATA ---
const officeData = {
    'ACCA': [
        { name: 'Carlos Miguel V. Tingson', office: 'ACCA', total: 11, fac: 3, part: 5, org: 2, spk: 1 },
        { name: 'Elena Mae R. Castro', office: 'ACCA', total: 7, fac: 0, part: 6, org: 1, spk: 0 },
        { name: 'Gabriel H. Luna', office: 'ACCA', total: 14, fac: 2, part: 10, org: 0, spk: 2 }
    ],
    'ACES': [
        { name: 'Dorothy M. Ubag', office: 'ACES', total: 15, fac: 4, part: 8, org: 2, spk: 1 },
        { name: 'Matthew C. Larracochea', office: 'ACES', total: 10, fac: 1, part: 7, org: 1, spk: 1 },
        { name: 'Sarah Jane F. Mendez', office: 'ACES', total: 6, fac: 0, part: 5, org: 1, spk: 0 }
    ],
    'ACLG': [
        { name: 'Jonathan D. Reyes', office: 'ACLG', total: 13, fac: 3, part: 8, org: 1, spk: 1 },
        { name: 'Patricia Ann S. Cruz', office: 'ACLG', total: 9, fac: 2, part: 5, org: 2, spk: 0 },
        { name: 'Ronaldo B. Victorio', office: 'ACLG', total: 5, fac: 0, part: 4, org: 1, spk: 0 }
    ],
    'APC': [
        { name: 'Ismael G. Ibrahim', office: 'APC', total: 16, fac: 6, part: 6, org: 2, spk: 2 },
        { name: 'Nur-Aisa J. Salim', office: 'APC', total: 8, fac: 1, part: 5, org: 2, spk: 0 },
        { name: 'Kevin Lee B. Tan', office: 'APC', total: 12, fac: 2, part: 8, org: 1, spk: 1 }
    ],
    'CCES': [
        { name: 'Rosalinda C. Guerrero', office: 'CCES', total: 14, fac: 4, part: 7, org: 2, spk: 1 },
        { name: 'Samuel D. Enriquez', office: 'CCES', total: 10, fac: 2, part: 6, org: 1, spk: 1 },
        { name: 'Beatrice G. Solis', office: 'CCES', total: 7, fac: 1, part: 4, org: 2, spk: 0 }
    ],
    'ALTEC': [
        { name: 'Victoriano F. Santos', office: 'ALTEC', total: 15, fac: 5, part: 7, org: 2, spk: 1 },
        { name: 'Luzviminda M. Diaz', office: 'ALTEC', total: 9, fac: 1, part: 6, org: 2, spk: 0 },
        { name: 'Fernando J. Mercado', office: 'ALTEC', total: 11, fac: 2, part: 8, org: 1, spk: 0 }
    ],
    'SDU_ONLY': [
        { name: 'Ricardo P. Alindayu', office: 'SDU', total: 12, fac: 2, part: 8, org: 1, spk: 1 },
        { name: 'Bernadette C. Gonzales', office: 'SDU', total: 18, fac: 5, part: 10, org: 2, spk: 1 },
        { name: 'Mark Anthony S. Joven', office: 'SDU', total: 9, fac: 1, part: 6, org: 2, spk: 0 }
    ]
};

const trainingCategories = [
    'Community Organizing',
    'Project Management',
    'Peace Education & Advocacy',
    'Environmental Stewardship',
    'Cultural Heritage & Arts',
    'Health & Livelihood',
    'Leadership & Governance',
    'Data & Digital Literacy',
    'Other'
];

const trainingTitlePool = [
    'Community Facilitation Lab',
    'Project Monitoring Essentials',
    'Peacebuilding in Campus Communities',
    'Eco-Action and Sustainability Planning',
    'Arts for Social Development',
    'Livelihood Program Design Workshop',
    'Leadership for Multi-Center Teams',
    'Digital Records and Analytics Training',
    'Volunteer Coordination Fundamentals',
    'Stakeholder Engagement Simulation',
    'Program Evaluation in Practice',
    'Data Privacy and Responsible Systems'
];

const trainingVenuePool = [
    'ADZU Main Campus',
    'ADZU Satellite Center',
    'Regional Convention Hall',
    'Virtual Learning Hub',
    'Community Learning Center'
];

const trainingNaturePool = ['Internal', 'External'];
const trainingScopePool = ['Local', 'Regional', 'National', 'International'];
const trainingRolePool = ['Participant', 'Facilitator', 'Organizer', 'Speaker'];
const proofFilePool = [
    'Certificate.pdf',
    'AttendanceSheet.jpg',
    'ProgramFlow.docx',
    'EventPhoto1.png',
    'EventPhoto2.png',
    'CompletionProof.pdf'
];

const officeHeads = {
    ACCA: 'Carlos Miguel V. Tingson',
    ACES: 'Dorothy M. Ubag',
    ACLG: 'Patricia Ann S. Cruz',
    APC: 'Ismael G. Ibrahim',
    CCES: 'Rosalinda C. Guerrero',
    ALTEC: 'Victoriano F. Santos',
    SDU_ONLY: 'Bernadette C. Gonzales'
};

function seededNumberFromName(name) {
    return name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
}

function formatDateFromSeed(seed, offset) {
    const month = (seed + offset) % 12;
    const day = ((seed + offset * 7) % 27) + 1;
    const year = 2024 + ((seed + offset) % 3);
    const date = new Date(year, month, day);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function generateCompletedTrainings(staffMember) {
    const seed = seededNumberFromName(staffMember.name);
    const count = (seed % 6) + 1;
    const trainings = [];

    for (let i = 0; i < count; i++) {
        const title = trainingTitlePool[(seed + i) % trainingTitlePool.length];
        const category = trainingCategories[(seed + i * 2) % trainingCategories.length];
        const role = trainingRolePool[(seed + i * 3) % trainingRolePool.length];
        trainings.push({
            title,
            date: formatDateFromSeed(seed, i),
            venue: trainingVenuePool[(seed + i * 5) % trainingVenuePool.length],
            nature: trainingNaturePool[(seed + i) % trainingNaturePool.length],
            scope: trainingScopePool[(seed + i * 4) % trainingScopePool.length],
            role,
            category,
            proofs: Array.from({ length: ((seed + i) % 3) + 1 }, (_, proofIndex) => {
                return `${title.replace(/\s+/g, '_')}_Proof_${proofIndex + 1}_${proofFilePool[(seed + proofIndex + i) % proofFilePool.length]}`;
            })
        });
    }

    return trainings;
}

function attachTrainingDataAndRecalculate(staffMember) {
    staffMember.completedTrainings = generateCompletedTrainings(staffMember);
    staffMember.total = staffMember.completedTrainings.length;
    staffMember.fac = staffMember.completedTrainings.filter(t => t.role === 'Facilitator').length;
    staffMember.part = staffMember.completedTrainings.filter(t => t.role === 'Participant').length;
    staffMember.org = staffMember.completedTrainings.filter(t => t.role === 'Organizer').length;
    staffMember.spk = staffMember.completedTrainings.filter(t => t.role === 'Speaker').length;
}

Object.keys(officeData).forEach(key => {
    officeData[key].forEach(attachTrainingDataAndRecalculate);
});

// Combine all arrays into TOTAL_STAFF
officeData['TOTAL_STAFF'] = [
    ...officeData['ACCA'], ...officeData['ACES'], ...officeData['ACLG'], 
    ...officeData['APC'], ...officeData['CCES'], ...officeData['ALTEC'], ...officeData['SDU_ONLY']
];

const pendingRequests = [
    { name: 'Juan Dela Cruz', email: 'juan@adzu.edu.ph', requestedOffice: 'ACCA' },
    { name: 'Maria Clara', email: 'maria@adzu.edu.ph', requestedOffice: 'ACES' }
];

const pendingProofs = [
    { name: 'Ricardo P. Alindayu', office: 'SDU', training: 'Disaster Risk Reduction', role: 'Participant', category: 'Environmental Stewardship', document: 'Certificate_DRR.pdf' },
    { name: 'Elena Mae R. Castro', office: 'ACCA', training: 'Leadership Seminar', role: 'Facilitator', category: 'Leadership & Governance', document: 'Attendance_LS.jpg' },
    { name: 'Jonathan D. Reyes', office: 'ACLG', training: 'Data Privacy Workshop', role: 'Participant', category: 'Data & Digital Literacy', document: 'Cert_DPW.pdf' },
    { name: 'Beatrice G. Solis', office: 'CCES', training: 'Community Outreach Ops', role: 'Organizer', category: 'Community Organizing', document: 'Photos_Outreach.pdf' }
];

const pendingTrainings = [
    { name: 'Carlos Miguel V. Tingson', training: 'Disaster Risk Reduction', office: 'ACCA', role: 'Participant', category: 'Environmental Stewardship', date: 'May 12, 2026' },
    { name: 'Dorothy M. Ubag', training: 'Leadership Seminar', office: 'ACES', role: 'Facilitator', category: 'Leadership & Governance', date: 'May 15, 2026' },
    { name: 'Jonathan D. Reyes', training: 'Data Privacy Workshop', office: 'ACLG', role: 'Participant', category: 'Data & Digital Literacy', date: 'May 18, 2026' },
    { name: 'Ismael G. Ibrahim', training: 'Peacebuilding Summit', office: 'APC', role: 'Speaker', category: 'Peace Education & Advocacy', date: 'May 20, 2026' },
    { name: 'Rosalinda C. Guerrero', training: 'Community Outreach Ops', office: 'CCES', role: 'Organizer', category: 'Community Organizing', date: 'May 22, 2026' },
    { name: 'Victoriano F. Santos', training: 'Teaching Excellence Matrix', office: 'ALTEC', role: 'Participant', category: 'Project Management', date: 'May 25, 2026' }
];

const inboxThreads = [
    {
        id: 1,
        participants: ['Carlos Miguel V. Tingson', 'Director'],
        office: 'ACCA',
        senderType: 'STAFF',
        subject: 'Training Completion Uploaded',
        messages: [
            { sender: 'Carlos Miguel V. Tingson', date: 'May 10, 2026', content: 'I have submitted my certificate for Disaster Risk Reduction. Kindly review when available.' },
            { sender: 'Director', date: 'May 11, 2026', content: 'Thank you for submitting your certificate. I will review it shortly.' },
            { sender: 'Carlos Miguel V. Tingson', date: 'May 12, 2026', content: 'Thank you, Director. Please let me know if any additional information is needed.' }
        ]
    },
    {
        id: 2,
        participants: ['Dorothy M. Ubag', 'Director'],
        office: 'ACES',
        senderType: 'STAFF',
        subject: 'Request to Join External Seminar',
        messages: [
            { sender: 'Dorothy M. Ubag', date: 'May 11, 2026', content: 'May I be considered for the external leadership seminar this June?' }
        ]
    },
    {
        id: 3,
        participants: ['Jonathan D. Reyes', 'Director'],
        office: 'ACLG',
        senderType: 'STAFF',
        subject: 'Schedule Conflict Notice',
        messages: [
            { sender: 'Jonathan D. Reyes', date: 'May 13, 2026', content: 'My assigned data privacy workshop overlaps with community field activity. Requesting schedule advice.' }
        ]
    },
    {
        id: 4,
        participants: ['Rosalinda C. Guerrero', 'Director'],
        office: 'CCES',
        senderType: 'STAFF',
        subject: 'Category Clarification',
        messages: [
            { sender: 'Rosalinda C. Guerrero', date: 'May 14, 2026', content: 'Please confirm if Community Outreach Ops should be under Community Organizing or Health & Livelihood.' }
        ]
    },
    {
        id: 5,
        participants: ['Patricia Ann S. Cruz', 'Director'],
        office: 'ACLG',
        senderType: 'OFFICE_HEAD',
        subject: 'Office Training Priorities',
        messages: [
            { sender: 'Patricia Ann S. Cruz', date: 'May 12, 2026', content: 'ACLG recommends prioritizing Project Management and Data & Digital Literacy for next month.' }
        ]
    },
    {
        id: 6,
        participants: ['Ismael G. Ibrahim', 'Director'],
        office: 'APC',
        senderType: 'OFFICE_HEAD',
        subject: 'Need Additional Slots',
        messages: [
            { sender: 'Ismael G. Ibrahim', date: 'May 15, 2026', content: 'APC requests two additional slots for Peace Education & Advocacy training assignments.' }
        ]
    },
    {
        id: 7,
        participants: ['Victoriano F. Santos', 'Director'],
        office: 'ALTEC',
        senderType: 'OFFICE_HEAD',
        subject: 'Proof Validation Follow-up',
        messages: [
            { sender: 'Victoriano F. Santos', date: 'May 16, 2026', content: 'Following up on pending proof validations for ALTEC staff uploaded this week.' }
        ]
    }
];

// Keep backward compatibility for now
const inboxMessages = inboxThreads.map(thread => ({
    sender: thread.participants.find(p => p !== 'Director'),
    senderType: thread.senderType,
    office: thread.office,
    subject: thread.subject,
    message: thread.messages[thread.messages.length - 1].content,
    date: thread.messages[thread.messages.length - 1].date
}));

const notificationLog = [];
let currentGlobalFilter = 'FULL';
let selectedInboxThreadId = 1;
let selectedDirectoryOffice = null;
let selectedDirectoryStaffList = [];
let pendingRemoveDirectoryStaffName = '';
let selectedDirectoryOfficeFilters = ['ACCA', 'ACES', 'ACLG', 'APC', 'CCES', 'ALTEC', 'SDU_ONLY'];
let selectedDirectoryStaffIndex = null;
let openEventsState = { sourceTableId: null, key: null };

// --- Review proof queue (shared: Review page + Director dashboard pending proofs modal) ---
const ISCMS_RP_QUEUE_KEY = 'iscms_review_proof_queue_v1';
const ISCMS_RP_HISTORY_KEY = 'iscms_review_proof_history_v1';
const ISCMS_RP_NOTICES_KEY = 'iscms_staff_proof_rejection_notices_v1';

function iscmsRpBuildInitialQueue() {
    const q = [];
    let n = 0;
    if (typeof pendingProofs !== 'undefined') {
        const dates = ['May 8, 2026', 'May 9, 2026', 'May 10, 2026', 'May 11, 2026'];
        pendingProofs.forEach((p, i) => {
            const base = p.document || 'Proof.pdf';
            q.push({
                id: 'rpq-' + (++n),
                staffName: p.name,
                office: p.office,
                trainingTitle: p.training,
                role: p.role,
                category: p.category,
                date: dates[i] || 'May 12, 2026',
                nature: 'Internal',
                scope: i % 2 === 0 ? 'Regional' : 'Local',
                venue: 'ADZU Main Campus',
                proofs: [base, 'Scan_' + base.replace(/(\.[^.]+)$/, '_set$1')]
            });
        });
    }
    if (typeof officeData !== 'undefined' && officeData.TOTAL_STAFF) {
        let added = 0;
        for (const staff of officeData.TOTAL_STAFF) {
            if (added >= 2) break;
            const t = (staff.completedTrainings || [])[0];
            if (!t) continue;
            q.push({
                id: 'rpq-s-' + (++n),
                staffName: staff.name,
                office: staff.office,
                trainingTitle: t.title,
                role: t.role,
                category: t.category,
                date: t.date,
                nature: t.nature,
                scope: t.scope,
                venue: t.venue,
                proofs: (t.proofs && t.proofs.length) ? t.proofs.slice(0, 3) : ['CompletionProof.pdf']
            });
            added++;
        }
    }
    return q;
}

function iscmsRpBuildSeedHistory() {
    const now = Date.now();
    const iso = (d) => new Date(d).toISOString();
    return [
        { id: 'h-r1', staffName: 'Elena Mae R. Castro', trainingTitle: 'Leadership Seminar', office: 'ACCA', status: 'rejected', decidedAt: iso(now - 86400000 * 9), reason: 'Attendance sheet dates did not align with the seminar schedule.' },
        { id: 'h-r2', staffName: 'Beatrice G. Solis', trainingTitle: 'Community Outreach Ops', office: 'CCES', status: 'rejected', decidedAt: iso(now - 86400000 * 3), reason: 'Participant roster page was too blurred to verify names.' },
        { id: 'h-a1', staffName: 'Carlos Miguel V. Tingson', trainingTitle: 'Eco-Action and Sustainability Planning', office: 'ACCA', status: 'accepted', decidedAt: iso(now - 86400000 * 14), reason: null },
        { id: 'h-a2', staffName: 'Dorothy M. Ubag', trainingTitle: 'Leadership for Multi-Center Teams', office: 'ACES', status: 'accepted', decidedAt: iso(now - 86400000 * 13), reason: null },
        { id: 'h-a3', staffName: 'Ismael G. Ibrahim', trainingTitle: 'Peacebuilding in Campus Communities', office: 'APC', status: 'accepted', decidedAt: iso(now - 86400000 * 11), reason: null },
        { id: 'h-a4', staffName: 'Ricardo P. Alindayu', trainingTitle: 'Digital Records and Analytics Training', office: 'SDU', status: 'accepted', decidedAt: iso(now - 86400000 * 8), reason: null },
        { id: 'h-a5', staffName: 'Victoriano F. Santos', trainingTitle: 'Teaching Excellence Matrix', office: 'ALTEC', status: 'accepted', decidedAt: iso(now - 86400000 * 6), reason: null },
        { id: 'h-a6', staffName: 'Rosalinda C. Guerrero', trainingTitle: 'Community Facilitation Lab', office: 'CCES', status: 'accepted', decidedAt: iso(now - 86400000 * 4), reason: null }
    ];
}

window.IscmsReviewProof = {
    getQueue() {
        const raw = localStorage.getItem(ISCMS_RP_QUEUE_KEY);
        if (raw === null) {
            const initial = iscmsRpBuildInitialQueue();
            localStorage.setItem(ISCMS_RP_QUEUE_KEY, JSON.stringify(initial));
            return initial;
        }
        try {
            const q = JSON.parse(raw);
            return Array.isArray(q) ? q : [];
        } catch (e) {
            return [];
        }
    },
    setQueue(items) {
        localStorage.setItem(ISCMS_RP_QUEUE_KEY, JSON.stringify(items));
    },
    getHistory() {
        const raw = localStorage.getItem(ISCMS_RP_HISTORY_KEY);
        if (raw === null) {
            const h = iscmsRpBuildSeedHistory();
            localStorage.setItem(ISCMS_RP_HISTORY_KEY, JSON.stringify(h));
            return h;
        }
        try {
            const h = JSON.parse(raw);
            return Array.isArray(h) ? h : [];
        } catch (e) {
            return [];
        }
    },
    setHistory(items) {
        localStorage.setItem(ISCMS_RP_HISTORY_KEY, JSON.stringify(items));
    },
    getItemById(id) {
        return this.getQueue().find((x) => String(x.id) === String(id));
    },
    pushRejectionNotice(staffName, trainingTitle, reason) {
        const arr = JSON.parse(localStorage.getItem(ISCMS_RP_NOTICES_KEY) || '[]');
        arr.unshift({
            staffName,
            trainingTitle,
            reason,
            at: new Date().toISOString(),
            from: 'Director',
            type: 'PROOF_REJECTED'
        });
        localStorage.setItem(ISCMS_RP_NOTICES_KEY, JSON.stringify(arr.slice(0, 50)));
    },
    performAccept(id) {
        const item = this.getItemById(id);
        if (!item) return false;
        const q = this.getQueue().filter((x) => String(x.id) !== String(id));
        this.setQueue(q);
        const hist = this.getHistory();
        hist.unshift({
            id: 'h-' + Date.now(),
            staffName: item.staffName,
            trainingTitle: item.trainingTitle,
            office: item.office,
            status: 'accepted',
            decidedAt: new Date().toISOString(),
            reason: null
        });
        this.setHistory(hist);
        return true;
    },
    performReject(id, message, notifyStaff) {
        const msg = (message || '').trim();
        if (notifyStaff && !msg) {
            return { ok: false, error: 'message_required' };
        }
        const item = this.getItemById(id);
        if (!item) return { ok: false, error: 'not_found' };
        if (typeof RecycleBinStore !== 'undefined') {
            RecycleBinStore.pushRecycleItem(RecycleBinStore.makeRecycleEntry({
                actionType: RecycleBinStore.RecycleAction.REJECTED_TRAINING_PROOF,
                summary: `Rejected proof — ${item.trainingTitle} (${item.staffName})`,
                payload: {
                    staffName: item.staffName,
                    office: item.office,
                    trainingTitle: item.trainingTitle,
                    proofs: item.proofs || [],
                    reason: msg || null,
                    notifyStaff: !!notifyStaff
                }
            }));
        }
        if (notifyStaff && msg) {
            this.pushRejectionNotice(item.staffName, item.trainingTitle, msg);
        }
        const q = this.getQueue().filter((x) => String(x.id) !== String(id));
        this.setQueue(q);
        const hist = this.getHistory();
        hist.unshift({
            id: 'h-' + Date.now(),
            staffName: item.staffName,
            trainingTitle: item.trainingTitle,
            office: item.office,
            status: 'rejected',
            decidedAt: new Date().toISOString(),
            reason: msg || '(no message)'
        });
        this.setHistory(hist);
        return { ok: true };
    }
};

function updatePendingProofsBadge() {
    const el = document.getElementById('countProofs');
    if (!el || !window.IscmsReviewProof) return;
    el.textContent = String(IscmsReviewProof.getQueue().length);
}

function iscmsRpTrainingMatchesSemester(dateStr, sem) {
    if (sem === 'FULL') return true;
    const date = new Date(dateStr);
    if (Number.isNaN(date.getTime())) return true;
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    if (sem === 'SEM1') return year === 2025 && month >= 8 && month <= 12;
    if (sem === 'SEM2') return year === 2026 && month >= 1 && month <= 5;
    return true;
}

function iscmsRpStaffMatchesOffice(office, key) {
    if (key === 'ALL') return true;
    if (key === 'SDU_ONLY') return office === 'SDU';
    return office === key;
}

function iscmsRpFilterQueueItem(item, nameQ, office, category, role, semester) {
    if (nameQ && !String(item.staffName).toLowerCase().includes(nameQ)) return false;
    if (!iscmsRpStaffMatchesOffice(item.office, office)) return false;
    if (category !== 'ALL' && item.category !== category) return false;
    if (role !== 'ALL' && item.role !== role) return false;
    if (!iscmsRpTrainingMatchesSemester(item.date, semester)) return false;
    return true;
}

function iscmsRpGetDashboardProofFilters() {
    const nameQ = (document.getElementById('dashProofSearch')?.value || '').trim().toLowerCase();
    const office = document.getElementById('dashProofOffice')?.value || 'ALL';
    const category = document.getElementById('dashProofCategory')?.value || 'ALL';
    const role = document.getElementById('dashProofRole')?.value || 'ALL';
    const semester = document.getElementById('dashProofSemester')?.value || 'FULL';
    return { nameQ, office, category, role, semester };
}

let dashProofPendingId = null;

function iscmsGoReviewProofDetail(proofId) {
    closeModal('proofsModal');
    window.location.href = 'review.html?openProof=' + encodeURIComponent(proofId);
}

function iscmsDashboardOpenProofAccept(id) {
    const item = IscmsReviewProof.getItemById(id);
    if (!item) return;
    dashProofPendingId = id;
    const textEl = document.getElementById('dashProofAcceptText');
    if (textEl) {
        textEl.innerHTML = `Accept proof for <strong>${item.staffName}</strong> — <em>${item.trainingTitle}</em>?`;
    }
    const modal = document.getElementById('dashProofAcceptModal');
    if (modal) modal.style.display = 'flex';
}

function iscmsDashboardOpenProofReject(id) {
    const item = IscmsReviewProof.getItemById(id);
    if (!item) return;
    dashProofPendingId = id;
    const errEl = document.getElementById('dashProofRejectError');
    if (errEl) {
        errEl.textContent = '';
        errEl.style.display = 'none';
    }
    const intro = document.getElementById('dashProofRejectIntro');
    if (intro) {
        intro.innerHTML = `Reject proof for <strong>${item.staffName}</strong> (${item.office}) — <em>${item.trainingTitle}</em>.`;
    }
    const ta = document.getElementById('dashProofRejectMessage');
    if (ta) ta.value = '';
    const cb = document.getElementById('dashProofRejectNotify');
    if (cb) cb.checked = true;
    const modal = document.getElementById('dashProofRejectModal');
    if (modal) modal.style.display = 'flex';
}

function iscmsDashboardConfirmProofAccept() {
    const id = dashProofPendingId;
    closeModal('dashProofAcceptModal');
    dashProofPendingId = null;
    if (!id) return;
    if (IscmsReviewProof.performAccept(id)) {
        loadPendingProofs();
        updatePendingProofsBadge();
    }
}

function iscmsDashboardConfirmProofReject() {
    const id = dashProofPendingId;
    if (!id) {
        closeModal('dashProofRejectModal');
        return;
    }
    const msg = (document.getElementById('dashProofRejectMessage')?.value || '').trim();
    const notify = document.getElementById('dashProofRejectNotify')?.checked;
    if (notify && !msg) {
        const err = document.getElementById('dashProofRejectError');
        if (err) {
            err.textContent = 'Add a message for the staff, or uncheck notification.';
            err.style.display = 'block';
        }
        return;
    }
    const errEl = document.getElementById('dashProofRejectError');
    if (errEl) { errEl.textContent = ''; errEl.style.display = 'none'; }
    const r = IscmsReviewProof.performReject(id, msg, !!notify);
    if (!r.ok) {
        if (r.error === 'message_required' && errEl) {
            errEl.textContent = 'Add a message for the staff, or uncheck notification.';
            errEl.style.display = 'block';
        }
        return;
    }
    closeModal('dashProofRejectModal');
    dashProofPendingId = null;
    loadPendingProofs();
    updatePendingProofsBadge();
}

// --- 2. DASHBOARD LOGIC ---
document.addEventListener('DOMContentLoaded', () => { 
    populateCategoryFilters();
    populateInboxOfficeFilter();
    loadNotifyLog();
    renderDirectoriesOfficeCards();
    updateNeedsAttentionAlerts();
    updateCategoryCoverageCard();
    updatePerformers(); 
    updateRoleBreakdownChart(); // Auto-calculate the role breakdown chart on load
    updatePendingProofsBadge();
});

function isDateWithinGlobalFilter(dateStr) {
    if (currentGlobalFilter === 'FULL') return true;
    const date = new Date(dateStr);
    if (Number.isNaN(date.getTime())) return true;
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    if (currentGlobalFilter === 'SEM1') {
        return year === 2025 && month >= 8 && month <= 12;
    }
    if (currentGlobalFilter === 'SEM2') {
        return year === 2026 && month >= 1 && month <= 5;
    }
    return true;
}

function getFilteredStaffList(sourceList) {
    return (sourceList || []).map(person => {
        const filteredTrainings = (person.completedTrainings || []).filter(training => isDateWithinGlobalFilter(training.date));
        return {
            ...person,
            completedTrainings: filteredTrainings,
            total: filteredTrainings.length,
            fac: filteredTrainings.filter(training => training.role === 'Facilitator').length,
            part: filteredTrainings.filter(training => training.role === 'Participant').length,
            org: filteredTrainings.filter(training => training.role === 'Organizer').length,
            spk: filteredTrainings.filter(training => training.role === 'Speaker').length
        };
    });
}

function getFilteredOfficeData(officeCode) {
    const source = officeCode === 'ALL' ? officeData['TOTAL_STAFF'] : (officeData[officeCode] || []);
    return getFilteredStaffList(source);
}

function renderOfficeTable(officeCode) {
    const tbody = document.getElementById('staffTableBody');
    const list = getFilteredOfficeData(officeCode);
    tbody.innerHTML = '';
    list.forEach(p => {
        tbody.innerHTML += `<tr>
            <td class="font-bold">${p.name}</td>
            <td class="text-center font-bold">${p.total}</td>
            <td class="text-center">${p.fac}</td>
            <td class="text-center">${p.part}</td>
            <td class="text-center">${p.org}</td>
            <td class="text-center">${p.spk}</td>
        </tr>`;
    });
}

function getOfficeDisplayName(officeCode) {
    return officeCode === 'SDU_ONLY' ? 'SDU' : officeCode;
}

function getDirectoryOfficeKeys() {
    return ['ACCA', 'ACES', 'ACLG', 'APC', 'CCES', 'ALTEC', 'SDU_ONLY'];
}

function getVisibleDirectoryOfficeKeys() {
    return getDirectoryOfficeKeys();
}

function getOfficeFrameClass(officeCode) {
    const map = {
        ACCA: 'frame-acca',
        ACES: 'frame-aces',
        ACLG: 'frame-aclg',
        APC: 'frame-apc',
        CCES: 'frame-cces',
        ALTEC: 'frame-altec',
        SDU_ONLY: 'frame-sdu'
    };
    return map[officeCode] || 'frame-sdu';
}

function renderDirectoriesOfficeCards() {
    const container = document.getElementById('directoriesOfficeCards');
    if (!container) return;

    container.innerHTML = '';
    const visibleKeys = getVisibleDirectoryOfficeKeys();
    if (visibleKeys.length === 0) {
        container.innerHTML = '<div class="inbox-empty">No office selected. Click Select and choose at least one office.</div>';
        return;
    }

    visibleKeys.forEach(officeCode => {
        const count = getFilteredOfficeData(officeCode).length;
        const activeClass = selectedDirectoryOffice === officeCode ? 'active' : '';
        const card = document.createElement('button');
        card.type = 'button';
        const frameClass = getOfficeFrameClass(officeCode);
        card.className = `office-card ${frameClass} shadow-sm ${activeClass}`;
        card.onclick = () => openDirectoryOffice(officeCode);
        card.innerHTML = `
            <span class="office-title">${getOfficeDisplayName(officeCode)} STAFF</span>
            <h2 class="office-count">${count}</h2>
        `;
        container.appendChild(card);
    });
}

function openDirectoryOffice(officeCode) {
    // If clicking the same office, close the table
    if (selectedDirectoryOffice === officeCode) {
        selectedDirectoryOffice = null;
        selectedDirectoryStaffList = [];
        
        const tbody = document.getElementById('directoriesStaffTableBody');
        const officeHead = document.getElementById('directoryOfficeHead');
        if (tbody) tbody.innerHTML = '<tr><td colspan="7">Select an office above to view staff records.</td></tr>';
        if (officeHead) officeHead.innerHTML = 'Office Head: -';
        
        renderDirectoriesOfficeCards();
        return;
    }

    selectedDirectoryOffice = officeCode;
    selectedDirectoryStaffList = getFilteredOfficeData(officeCode);

    const tbody = document.getElementById('directoriesStaffTableBody');
    const officeHead = document.getElementById('directoryOfficeHead');
    if (!tbody || !officeHead) return;

    renderDirectoriesOfficeCards();

    officeHead.innerHTML = `Office Head: <span class="font-bold">${officeHeads[officeCode] || 'Not Assigned'}</span> (${getOfficeDisplayName(officeCode)})`;
    tbody.innerHTML = '';

    if (selectedDirectoryStaffList.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7">No staff records for the selected office in this period.</td></tr>';
        return;
    }

    selectedDirectoryStaffList.forEach((staff, index) => {
        tbody.innerHTML += `<tr>
            <td class="font-bold">${staff.name}</td>
            <td class="text-center font-bold">${staff.total}</td>
            <td class="text-center">${staff.fac}</td>
            <td class="text-center">${staff.part}</td>
            <td class="text-center">${staff.org}</td>
            <td class="text-center">${staff.spk}</td>
            <td class="actions-nowrap">
                <button class="btn-viewmore" onclick="openDirectoryStaffDetails(${index})">View Staff Info</button>
                <button class="btn-accept" onclick="window.location.href='training_assignments.html'">Assign Training</button>
                <button class="btn-decline" onclick="removeDirectoryStaff(${index})">Remove Staff</button>
            </td>
        </tr>`;
    });
}

function removeDirectoryStaff(index) {
    if (!selectedDirectoryOffice) return;
    const selectedStaff = selectedDirectoryStaffList[index];
    if (!selectedStaff) return;

    pendingRemoveDirectoryStaffName = selectedStaff.name;
    const msg = document.getElementById('directoriesRemoveMessage');
    if (msg) {
        msg.innerHTML = `Are you sure you want to remove <strong>${selectedStaff.name}</strong> from <strong>${getOfficeDisplayName(selectedDirectoryOffice)}</strong>?`;
    }
    openModal('directoriesRemoveModal');
}

function confirmRemoveDirectoryStaff() {
    if (!selectedDirectoryOffice || !pendingRemoveDirectoryStaffName) {
        closeModal('directoriesRemoveModal');
        return;
    }

    const officeList = officeData[selectedDirectoryOffice] || [];
    const actualIndex = officeList.findIndex(staff => staff.name === pendingRemoveDirectoryStaffName);
    if (actualIndex === -1) {
        closeModal('directoriesRemoveModal');
        return;
    }

    const removedName = officeList[actualIndex].name;
    officeList.splice(actualIndex, 1);
    officeData.TOTAL_STAFF = getDirectoryOfficeKeys().flatMap(code => officeData[code]);
    pendingRemoveDirectoryStaffName = '';
    closeModal('directoriesRemoveModal');
    openDirectoryOffice(selectedDirectoryOffice);
    alert(`${removedName} was removed from the directory.`);
}

function openDirectoriesExportModal() {
    const grid = document.getElementById('directoriesExportOfficeGrid');
    if (grid) {
        grid.innerHTML = '';
        getDirectoryOfficeKeys().forEach(code => {
            const checked = selectedDirectoryOfficeFilters.includes(code) ? 'checked' : '';
            grid.innerHTML += `<label class="directory-select-item"><input type="checkbox" class="directory-export-office-checkbox" value="${code}" ${checked}> ${getOfficeDisplayName(code)}</label>`;
        });
    }
    openModal('directoriesExportModal');
}

function selectAllExportOffices() {
    document.querySelectorAll('.directory-export-office-checkbox').forEach(box => {
        box.checked = true;
    });
}

function getSelectedExportOfficeCodes() {
    const selected = Array.from(document.querySelectorAll('.directory-export-office-checkbox:checked')).map(box => box.value);
    return selected.length ? selected : [];
}

function exportSelectedDirectoryOffice() {
    const selectedOffices = getSelectedExportOfficeCodes();
    if (selectedOffices.length === 0) {
        alert('Please select at least one office.');
        return;
    }
    selectedDirectoryOfficeFilters = [...selectedOffices];
    const exportRows = selectedOffices.flatMap(code => getFilteredOfficeData(code).map(staff => ({
        ...staff,
        officeCode: code
    })));

    if (exportRows.length === 0) {
        alert('No data available for export.');
        return;
    }

    const headers = ['Name', 'Office', 'Total Trainings', 'Facilitated', 'Participated', 'Organized', 'Speaker'];
    const rows = exportRows.map(staff => [
        staff.name,
        getOfficeDisplayName(staff.officeCode),
        staff.total,
        staff.fac,
        staff.part,
        staff.org,
        staff.spk
    ]);
    const csv = [headers.join(',')].concat(rows.map(row => row.map(value => `"${value}"`).join(',')));
    const file = new Blob([csv.join('\n')], { type: 'text/csv' });
    const link = document.createElement('a');
    link.download = `Directories_${selectedOffices.join('-')}_Staff.csv`;
    link.href = window.URL.createObjectURL(file);
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    closeModal('directoriesExportModal');
}

function printSelectedDirectoryOffice() {
    const selectedOffices = getSelectedExportOfficeCodes();
    if (selectedOffices.length === 0) {
        alert('Please select at least one office.');
        return;
    }
    selectedDirectoryOfficeFilters = [...selectedOffices];
    const printRows = selectedOffices.flatMap(code => getFilteredOfficeData(code).map(staff => ({
        ...staff,
        officeCode: code
    })));

    if (printRows.length === 0) {
        alert('No data available for printing.');
        return;
    }

    const columns = ['Name', 'Office', 'Total Trainings', 'Facilitated', 'Participated', 'Organized', 'Speaker'];
    const rows = printRows.map(staff => [
        staff.name,
        getOfficeDisplayName(staff.officeCode),
        staff.total,
        staff.fac,
        staff.part,
        staff.org,
        staff.spk
    ]);

    const printWindow = window.open('', '_blank');
    const title = `Selected Offices Staff Directory`;
    printWindow.document.write(`<html><head><title>${title}</title><style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        table { width: 100%; border-collapse: collapse; }
        th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
        th { background: #f4f7fe; }
    </style></head><body><h1>${title}</h1><table><thead><tr>${columns.map(c => `<th>${c}</th>`).join('')}</tr></thead><tbody>${rows.map(row => `<tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>`).join('')}</tbody></table></body></html>`);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    closeModal('directoriesExportModal');
}

function renderGroupedEventTable(targetId, groupedItems, typeLabel) {
    const tbody = document.getElementById(targetId);
    if (!tbody) return;

    tbody.innerHTML = '';
    if (groupedItems.length === 0) {
        tbody.innerHTML = `<tr><td colspan="3">No ${typeLabel.toLowerCase()} records for selected period.</td></tr>`;
        return;
    }

    groupedItems.forEach(item => {
        const encodedKey = encodeURIComponent(item.key);
        tbody.innerHTML += `<tr>
            <td>${item.key}</td>
            <td class="text-center font-bold">${item.count}</td>
            <td><button class="btn-viewmore" onclick="openGroupedEvents('${targetId}', '${encodedKey}')">View Events</button></td>
        </tr>`;
    });
}

function renderTrainingDetailsCard(targetId, title, trainings) {
    const target = document.getElementById(targetId);
    if (!target) return;
    if (!trainings || trainings.length === 0) {
        target.style.display = 'block';
        target.innerHTML = `<p>No events under <strong>${title}</strong>.</p>`;
        return;
    }

    const lines = trainings.map((training, idx) => {
        const encodedIdx = encodeURIComponent(String(idx));
        return `<li>
            <button class="event-link-btn" onclick="showEventDetails('${encodedIdx}')">${training.title}</button>
            <span> (${training.date})</span>
        </li>`;
    }).join('');

    target.style.display = 'block';
    target.classList.remove('role-events-open', 'category-events-open');
    target.classList.add(targetId === 'roleEventsCard' ? 'role-events-open' : 'category-events-open');
    target.innerHTML = `<p><strong>${title}</strong> events:</p><ul>${lines}</ul>`;
}

let selectedStaffTrainingIndexMap = [];

function showEventDetails(indexString) {
    const detailEl = document.getElementById('selectedEventDetails');
    if (!detailEl) return;
    const index = Number(decodeURIComponent(indexString));
    const training = selectedStaffTrainingIndexMap[index];
    if (!training) return;

    detailEl.innerHTML = `
        <div class="event-detail-grid">
            <div class="event-detail-row"><strong>Title:</strong> ${training.title}</div>
            <div class="event-detail-row"><strong>Date:</strong> ${training.date}</div>
            <div class="event-detail-row"><strong>Office:</strong> ${training.office || getOfficeDisplayName(selectedDirectoryOffice)}</div>
            <div class="event-detail-row"><strong>Participation Role:</strong> ${training.role}</div>
            <div class="event-detail-row"><strong>Category:</strong> ${training.category}</div>
            <div class="event-detail-row"><strong>Scope:</strong> ${training.scope}</div>
            <div class="event-detail-row"><strong>Nature:</strong> ${training.nature}</div>
            <div class="event-detail-row"><strong>Venue:</strong> ${training.venue}</div>
        </div>
        <div class="event-proofs-wrap">
            <strong>Proofs</strong>
            <ul class="proof-list">${training.proofs.map(proof => `<li>${proof}</li>`).join('')}</ul>
        </div>
    `;
}

function openGroupedEvents(sourceTableId, encodedKey) {
    const key = decodeURIComponent(encodedKey);
    const section = document.getElementById('staffDetailsSection');
    if (!section) return;
    const nameEl = document.getElementById('staffDetailsName');
    if (!nameEl || !nameEl.dataset.staffIndex) return;

    const staff = selectedDirectoryStaffList[Number(nameEl.dataset.staffIndex)];
    if (!staff) return;

    let filtered = [];
    let targetCardId = 'roleEventsCard';
    if (sourceTableId === 'staffRoleTableBody') {
        filtered = staff.completedTrainings.filter(training => training.role === key);
        targetCardId = 'roleEventsCard';
    } else {
        filtered = staff.completedTrainings.filter(training => training.category === key);
        targetCardId = 'categoryEventsCard';
    }

    if (openEventsState.sourceTableId === sourceTableId && openEventsState.key === key) {
        const targetCard = document.getElementById(targetCardId);
        if (targetCard) {
            targetCard.style.display = 'none';
            targetCard.innerHTML = '';
        }
        openEventsState = { sourceTableId: null, key: null };
        selectedStaffTrainingIndexMap = [];
        const selectedEventDetails = document.getElementById('selectedEventDetails');
        if (selectedEventDetails) {
            selectedEventDetails.innerHTML = 'Select `View Events` from Participation Roles or Event Categories, then click an event title to show full details here.';
        }
        return;
    }

    openEventsState = { sourceTableId, key };
    selectedStaffTrainingIndexMap = filtered;
    renderTrainingDetailsCard(targetCardId, key, filtered);
}

function openDirectoryStaffDetails(index) {
    const staff = selectedDirectoryStaffList[index];
    if (!staff) return;

    const section = document.getElementById('staffDetailsSection');
    const nameEl = document.getElementById('staffDetailsName');
    const metaEl = document.getElementById('staffDetailsMeta');
    const summaryEl = document.getElementById('staffDetailsSummary');
    const trainingsEl = document.getElementById('staffTrainingsList');
    const roleTable = document.getElementById('staffRoleTableBody');
    const categoryTable = document.getElementById('staffCategoryTableBody');
    const roleEventsCard = document.getElementById('roleEventsCard');
    const categoryEventsCard = document.getElementById('categoryEventsCard');
    const selectedEventDetails = document.getElementById('selectedEventDetails');
    if (!section || !nameEl || !metaEl || !summaryEl || !trainingsEl || !roleTable || !categoryTable || !roleEventsCard || !categoryEventsCard || !selectedEventDetails) return;

    nameEl.innerText = staff.name;
    selectedDirectoryStaffIndex = index;
    nameEl.classList.add('staff-title-emphasis');
    nameEl.dataset.staffIndex = String(index);
    metaEl.innerText = `${getOfficeDisplayName(selectedDirectoryOffice)} Office`;
    summaryEl.innerHTML = `
        <span class="summary-pill">Total Trainings: <strong>${staff.total}</strong></span>
        <span class="summary-pill">Facilitated: <strong>${staff.fac}</strong></span>
        <span class="summary-pill">Participated: <strong>${staff.part}</strong></span>
        <span class="summary-pill">Organized: <strong>${staff.org}</strong></span>
        <span class="summary-pill">Speaker: <strong>${staff.spk}</strong></span>
    `;

    trainingsEl.innerHTML = '';
    if (staff.completedTrainings.length === 0) {
        trainingsEl.innerHTML = '<div class="training-detail-card">No training records for selected time filter.</div>';
    } else {
        staff.completedTrainings.forEach((training, trainingIndex) => {
            trainingsEl.innerHTML += `<details class="training-detail-card">
                <summary><strong>${trainingIndex + 1}. ${training.title}</strong> - ${training.role}</summary>
                <div class="training-detail-body">
                    <p><strong>Category:</strong> ${training.category}</p>
                    <p><strong>Scope:</strong> ${training.scope}</p>
                    <p><strong>Nature:</strong> ${training.nature}</p>
                    <p><strong>Date:</strong> ${training.date}</p>
                    <p><strong>Venue:</strong> ${training.venue}</p>
                    <p><strong>Proofs:</strong></p>
                    <ul class="proof-list">
                        ${training.proofs.map(proof => `<li>${proof}</li>`).join('')}
                    </ul>
                </div>
            </details>`;
        });
    }

    const roleGroups = ['Facilitator', 'Participant', 'Organizer', 'Speaker'].map(role => ({
        key: role,
        count: staff.completedTrainings.filter(training => training.role === role).length
    }));
    const categoryMap = {};
    staff.completedTrainings.forEach(training => {
        categoryMap[training.category] = (categoryMap[training.category] || 0) + 1;
    });
    const categoryGroups = Object.keys(categoryMap)
        .sort((a, b) => categoryMap[b] - categoryMap[a] || a.localeCompare(b))
        .map(category => ({ key: category, count: categoryMap[category] }));

    renderGroupedEventTable('staffRoleTableBody', roleGroups, 'Role');
    renderGroupedEventTable('staffCategoryTableBody', categoryGroups, 'Category');
    roleEventsCard.style.display = 'none';
    categoryEventsCard.style.display = 'none';
    selectedEventDetails.innerHTML = 'Select `View Events` from Participation Roles or Event Categories, then click an event title to show full details here.';
    selectedStaffTrainingIndexMap = [];
    openEventsState = { sourceTableId: null, key: null };

    section.style.display = 'block';
    section.scrollIntoView({ behavior: 'smooth' });
}

function applyStaffDetailsFilter() {
    if (selectedDirectoryStaffIndex === null) return;
    
    const filterValue = document.getElementById('staffDetailsTimeFilter').value;
    const staff = selectedDirectoryStaffList[selectedDirectoryStaffIndex];
    if (!staff) return;
    
    // Create a temporary filtered version of the staff data
    const filteredTrainings = staff.completedTrainings.filter(training => {
        if (filterValue === 'FULL') return true;
        const date = new Date(training.date);
        if (Number.isNaN(date.getTime())) return true;
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        if (filterValue === 'SEM1') {
            return year === 2025 && month >= 8 && month <= 12;
        }
        if (filterValue === 'SEM2') {
            return year === 2026 && month >= 1 && month <= 5;
        }
        return true;
    });
    
    // Update the staff details with filtered data
    const section = document.getElementById('staffDetailsSection');
    const nameEl = document.getElementById('staffDetailsName');
    const metaEl = document.getElementById('staffDetailsMeta');
    const summaryEl = document.getElementById('staffDetailsSummary');
    const trainingsEl = document.getElementById('staffTrainingsList');
    const roleTable = document.getElementById('staffRoleTableBody');
    const categoryTable = document.getElementById('staffCategoryTableBody');
    const roleEventsCard = document.getElementById('roleEventsCard');
    const categoryEventsCard = document.getElementById('categoryEventsCard');
    const selectedEventDetails = document.getElementById('selectedEventDetails');
    
    const total = filteredTrainings.length;
    const fac = filteredTrainings.filter(t => t.role === 'Facilitator').length;
    const part = filteredTrainings.filter(t => t.role === 'Participant').length;
    const org = filteredTrainings.filter(t => t.role === 'Organizer').length;
    const spk = filteredTrainings.filter(t => t.role === 'Speaker').length;
    
    summaryEl.innerHTML = `
        <span class="summary-pill">Total Trainings: <strong>${total}</strong></span>
        <span class="summary-pill">Facilitated: <strong>${fac}</strong></span>
        <span class="summary-pill">Participated: <strong>${part}</strong></span>
        <span class="summary-pill">Organized: <strong>${org}</strong></span>
        <span class="summary-pill">Speaker: <strong>${spk}</strong></span>
    `;
    
    trainingsEl.innerHTML = '';
    if (filteredTrainings.length === 0) {
        trainingsEl.innerHTML = '<div class="training-detail-card">No training records for selected time filter.</div>';
    } else {
        filteredTrainings.forEach((training, trainingIndex) => {
            trainingsEl.innerHTML += `<details class="training-detail-card">
                <summary><strong>${trainingIndex + 1}. ${training.title}</strong> - ${training.role}</summary>
                <div class="training-detail-body">
                    <p><strong>Category:</strong> ${training.category}</p>
                    <p><strong>Scope:</strong> ${training.scope}</p>
                    <p><strong>Nature:</strong> ${training.nature}</p>
                    <p><strong>Date:</strong> ${training.date}</p>
                    <p><strong>Venue:</strong> ${training.venue}</p>
                    <p><strong>Proofs:</strong></p>
                    <ul class="proof-list">
                        ${training.proofs.map(proof => `<li>${proof}</li>`).join('')}
                    </ul>
                </div>
            </details>`;
        });
    }
    
    const roleGroups = ['Facilitator', 'Participant', 'Organizer', 'Speaker'].map(role => ({
        key: role,
        count: filteredTrainings.filter(training => training.role === role).length
    }));
    const categoryMap = {};
    filteredTrainings.forEach(training => {
        categoryMap[training.category] = (categoryMap[training.category] || 0) + 1;
    });
    const categoryGroups = Object.keys(categoryMap)
        .sort((a, b) => categoryMap[b] - categoryMap[a] || a.localeCompare(b))
        .map(category => ({ key: category, count: categoryMap[category] }));
    
    renderGroupedEventTable('staffRoleTableBody', roleGroups, 'Role');
    renderGroupedEventTable('staffCategoryTableBody', categoryGroups, 'Category');
    roleEventsCard.style.display = 'none';
    categoryEventsCard.style.display = 'none';
    selectedEventDetails.innerHTML = 'Select `View Events` from Participation Roles or Event Categories, then click an event title to show full details here.';
    selectedStaffTrainingIndexMap = [];
    openEventsState = { sourceTableId: null, key: null };
}

function openStaffDetailsExportModal() {
    if (selectedDirectoryStaffIndex === null) {
        alert('Please click View Staff Info first.');
        return;
    }
    openModal('staffDetailsExportModal');
}

function getStaffDetailsExportPayload() {
    if (selectedDirectoryStaffIndex === null) return null;
    const staff = selectedDirectoryStaffList[selectedDirectoryStaffIndex];
    if (!staff) return null;

    // Apply the staff details time filter
    const filterValue = document.getElementById('staffDetailsTimeFilter')?.value || 'FULL';
    const filteredTrainings = staff.completedTrainings.filter(training => {
        if (filterValue === 'FULL') return true;
        const date = new Date(training.date);
        if (Number.isNaN(date.getTime())) return true;
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        if (filterValue === 'SEM1') {
            return year === 2025 && month >= 8 && month <= 12;
        }
        if (filterValue === 'SEM2') {
            return year === 2026 && month >= 1 && month <= 5;
        }
        return true;
    });

    const roleGroups = ['Facilitator', 'Participant', 'Organizer', 'Speaker'].map(role => ({
        role,
        events: filteredTrainings.filter(training => training.role === role)
    }));
    const categorySet = {};
    filteredTrainings.forEach(training => {
        if (!categorySet[training.category]) categorySet[training.category] = [];
        categorySet[training.category].push(training);
    });

    return { staff, roleGroups, categorySet };
}

function exportStaffDetailsData() {
    const payload = getStaffDetailsExportPayload();
    if (!payload) {
        alert('Please click View Staff Info first.');
        return;
    }
    const scopeEl = document.getElementById('staffDetailsExportScope');
    const scope = scopeEl ? scopeEl.value : 'ALL';
    const { staff, roleGroups, categorySet } = payload;

    let rows = [];
    const headers = ['Name', 'Office', 'Section', 'Group', 'Training Title', 'Role', 'Category', 'Date', 'Scope', 'Nature', 'Venue'];

    const pushTraining = (section, group, training) => {
        rows.push([
            staff.name,
            getOfficeDisplayName(selectedDirectoryOffice),
            section,
            group,
            training.title,
            training.role,
            training.category,
            training.date,
            training.scope,
            training.nature,
            training.venue
        ]);
    };

    if (scope === 'ALL' || scope === 'JOINED') {
        staff.completedTrainings.forEach(training => pushTraining('Joined Trainings', 'All', training));
    }
    if (scope === 'ALL' || scope === 'ROLES') {
        roleGroups.forEach(group => group.events.forEach(training => pushTraining('Participation Roles', group.role, training)));
    }
    if (scope === 'ALL' || scope === 'CATEGORIES') {
        Object.keys(categorySet).forEach(category => categorySet[category].forEach(training => pushTraining('Event Categories', category, training)));
    }

    if (rows.length === 0) {
        alert('No data available for export.');
        return;
    }

    const csv = [headers.join(',')].concat(rows.map(row => row.map(value => `"${String(value).replace(/"/g, '""')}"`).join(',')));
    const file = new Blob([csv.join('\n')], { type: 'text/csv' });
    const link = document.createElement('a');
    link.download = `${staff.name.replace(/\s+/g, '_')}_Staff_Details_${scope}.csv`;
    link.href = window.URL.createObjectURL(file);
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    closeModal('staffDetailsExportModal');
}

function printStaffDetailsData() {
    const payload = getStaffDetailsExportPayload();
    if (!payload) {
        alert('Please click View Staff Info first.');
        return;
    }
    const scopeEl = document.getElementById('staffDetailsExportScope');
    const scope = scopeEl ? scopeEl.value : 'ALL';
    const { staff, roleGroups, categorySet } = payload;
    const officeName = getOfficeDisplayName(selectedDirectoryOffice);

    const renderRows = trainings => trainings.map(training => `<tr>
        <td>${training.title}</td>
        <td>${training.role}</td>
        <td>${training.category}</td>
        <td>${training.date}</td>
        <td>${training.scope}</td>
        <td>${training.nature}</td>
        <td>${training.venue}</td>
    </tr>`).join('');

    let sections = '';
    if (scope === 'ALL' || scope === 'JOINED') {
        sections += `<h3>Joined Trainings</h3><table><thead><tr><th>Title</th><th>Role</th><th>Category</th><th>Date</th><th>Scope</th><th>Nature</th><th>Venue</th></tr></thead><tbody>${renderRows(staff.completedTrainings)}</tbody></table>`;
    }
    if (scope === 'ALL' || scope === 'ROLES') {
        roleGroups.forEach(group => {
            sections += `<h3>Participation Role: ${group.role}</h3><table><thead><tr><th>Title</th><th>Role</th><th>Category</th><th>Date</th><th>Scope</th><th>Nature</th><th>Venue</th></tr></thead><tbody>${renderRows(group.events)}</tbody></table>`;
        });
    }
    if (scope === 'ALL' || scope === 'CATEGORIES') {
        Object.keys(categorySet).forEach(category => {
            sections += `<h3>Event Category: ${category}</h3><table><thead><tr><th>Title</th><th>Role</th><th>Category</th><th>Date</th><th>Scope</th><th>Nature</th><th>Venue</th></tr></thead><tbody>${renderRows(categorySet[category])}</tbody></table>`;
        });
    }

    const printWindow = window.open('', '_blank');
    printWindow.document.write(`<html><head><title>${staff.name} Staff Details</title><style>
        body { font-family: Arial, sans-serif; margin: 20px; color: #1f2937; }
        h1, h3 { margin-bottom: 8px; }
        h3 { margin-top: 18px; }
        table { width: 100%; border-collapse: collapse; margin-top: 8px; }
        th, td { border: 1px solid #d1d5db; padding: 7px; text-align: left; font-size: 12px; }
        th { background: #f3f4f6; }
    </style></head><body>
        <h1>${staff.name}</h1>
        <p><strong>Office:</strong> ${officeName}</p>
        ${sections}
    </body></html>`);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    closeModal('staffDetailsExportModal');
}

function updatePendingCounts() {
    const trainingsCountEl = document.getElementById('countTrainings');
    if (trainingsCountEl) {
        trainingsCountEl.innerText = pendingTrainings.filter(training => isDateWithinGlobalFilter(training.date)).length;
    }
}

// Global Time Filter
function applyGlobalFilter() {
    currentGlobalFilter = document.getElementById('globalTimeFilter').value;
    
    // Refresh the current office table if one is selected
    if (selectedDirectoryOffice) {
        selectedDirectoryStaffList = getFilteredOfficeData(selectedDirectoryOffice);
        
        const tbody = document.getElementById('directoriesStaffTableBody');
        const officeHead = document.getElementById('directoryOfficeHead');
        if (tbody && officeHead) {
            officeHead.innerHTML = `Office Head: <span class="font-bold">${officeHeads[selectedDirectoryOffice] || 'Not Assigned'}</span> (${getOfficeDisplayName(selectedDirectoryOffice)})`;
            tbody.innerHTML = '';
            
            if (selectedDirectoryStaffList.length === 0) {
                tbody.innerHTML = '<tr><td colspan="7">No staff records for the selected office in this period.</td></tr>';
            } else {
                selectedDirectoryStaffList.forEach((staff, index) => {
                    tbody.innerHTML += `<tr>
                        <td class="font-bold">${staff.name}</td>
                        <td class="text-center font-bold">${staff.total}</td>
                        <td class="text-center">${staff.fac}</td>
                        <td class="text-center">${staff.part}</td>
                        <td class="text-center">${staff.org}</td>
                        <td class="text-center">${staff.spk}</td>
                        <td class="actions-nowrap">
                            <button class="btn-viewmore" onclick="openDirectoryStaffDetails(${index})">View Staff Info</button>
                            <button class="btn-accept" onclick="window.location.href='training_assignments.html'">Assign Training</button>
                            <button class="btn-decline" onclick="removeDirectoryStaff(${index})">Remove Staff</button>
                        </td>
                    </tr>`;
                });
            }
        }
    }
    
    renderDirectoriesOfficeCards();
    if (currentActiveOffice) renderOfficeTable(currentActiveOffice);
    updatePendingCounts();
    updateNeedsAttentionAlerts();
    updateCategoryCoverageCard();
    updatePerformers();
    updateRoleBreakdownChart();
}

function updateRoleBreakdownChart() {
    const officeEl = document.getElementById('breakdownOfficeFilter');
    const viewEl = document.getElementById('breakdownViewFilter');
    const categoryEl = document.getElementById('breakdownCategoryFilter');
    if (!officeEl || !viewEl || !categoryEl) return;
    calculateInsights(officeEl.value, viewEl.value, categoryEl.value);
}


// Helper function to color code the office tags
function getOfficeTag(officeCode) {
    return `<span class="tag bg-${officeCode.toLowerCase()}">${officeCode}</span>`;
}

let currentActiveOffice = null;

// Office Cards Interaction
function toggleOffice(officeCode, cardElement) {
    const section = document.getElementById('staffSection');
    const tbody = document.getElementById('staffTableBody');
    const searchInput = document.getElementById('staffSearch');
    const exportPanel = document.getElementById('exportOptionsPanel');
    
    if (currentActiveOffice === officeCode) {
        section.style.display = 'none';
        cardElement.classList.remove('active');
        currentActiveOffice = null;
        if (exportPanel) exportPanel.style.display = 'none';
        return;
    }
    
    document.querySelectorAll('.office-card').forEach(c => c.classList.remove('active'));
    document.getElementById('selectedOfficeTitle').innerText = `${officeCode.replace('_', ' ')} Staff Records`;
    tbody.innerHTML = '';
    searchInput.value = '';
    if (exportPanel) exportPanel.style.display = 'none';
    
    renderOfficeTable(officeCode);
    
    section.style.display = 'block';
    cardElement.classList.add('active');
    currentActiveOffice = officeCode;
}

// Modal Functions
function openModal(id) {
    document.getElementById(id).style.display = 'flex';
    if (id === 'requestsModal') loadPendingRequests();
    if (id === 'trainingsModal') loadPendingTrainings();
    if (id === 'proofsModal') loadPendingProofs();
    if (id === 'inboxModal') loadInboxMessages();
    if (id === 'notifyModal') {
        toggleNotificationTargetOffice();
        loadNotifyLog();
    }
}

function closeModal(id) { 
    document.getElementById(id).style.display = 'none'; 
}

// Close Modal when clicking outside the box
window.onclick = (e) => {
    if (e.target.classList.contains('modal-overlay')) {
        e.target.style.display = 'none';
    }
}

// Load Pending Account Requests
function loadPendingRequests() {
    const tbody = document.getElementById('requestsTableBody');
    tbody.innerHTML = '';
    pendingRequests.forEach((r, i) => {
        tbody.innerHTML += `<tr id="req-${i}">
            <td class="font-bold">${r.name}</td>
            <td>${r.email}</td>
            <td>${getOfficeTag(r.requestedOffice)}</td>
            <td>
                <button class="btn-accept" onclick="handleAccountAction(${i}, 'Approve')">Approve</button>
                <button class="btn-decline" onclick="handleAccountAction(${i}, 'Reject')">Reject</button>
            </td>
        </tr>`;
    });
}

function handleAccountAction(index, action) {
    document.getElementById(`req-${index}`).style.display = 'none';
    let countEl = document.getElementById('countAccounts');
    if(countEl) countEl.innerText = parseInt(countEl.innerText) - 1;
}

// Load Pending Proofs (same queue as Review page; View Details → review.html?openProof=)
function loadPendingProofs() {
    const tbody = document.getElementById('proofsTableBody');
    if (!tbody || !window.IscmsReviewProof) return;
    const list = IscmsReviewProof.getQueue();
    const f = typeof iscmsRpGetDashboardProofFilters === 'function' ? iscmsRpGetDashboardProofFilters() : {
        nameQ: '', office: 'ALL', category: 'ALL', role: 'ALL', semester: 'FULL'
    };
    const filtered = list.filter((item) =>
        iscmsRpFilterQueueItem(item, f.nameQ, f.office, f.category, f.role, f.semester)
    );
    tbody.innerHTML = '';
    if (filtered.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6">No pending proofs match these filters. Open <a href="review.html">Review</a> for the full queue.</td></tr>';
        return;
    }
    filtered.forEach((item) => {
        const safeId = String(item.id).replace(/\\/g, '\\\\').replace(/'/g, "\\'");
        const proofCount = (item.proofs || []).length;
        tbody.innerHTML += `<tr>
            <td class="font-bold">${item.staffName}</td>
            <td>${item.trainingTitle}</td>
            <td>${getOfficeTag(item.office)}</td>
            <td>${item.date}</td>
            <td>${proofCount} file(s)</td>
            <td class="actions-nowrap">
                <button type="button" class="btn-viewmore" onclick="iscmsGoReviewProofDetail('${safeId}')">View Details</button>
                <button type="button" class="btn-accept" onclick="iscmsDashboardOpenProofAccept('${safeId}')">Accept</button>
                <button type="button" class="btn-decline" onclick="iscmsDashboardOpenProofReject('${safeId}')">Reject</button>
            </td>
        </tr>`;
    });
}

// Load and Filter Pending Trainings Data
function loadPendingTrainings() {
    const tbody = document.getElementById('trainingsTableBody');
    const officeFilter = document.getElementById('trainingOfficeFilter').value;
    const roleFilter = document.getElementById('trainingRoleFilter').value;
    const categoryFilter = document.getElementById('trainingCategoryFilter').value;
    const search = document.getElementById('trainingSearch').value.toLowerCase();
    
    tbody.innerHTML = '';
    
    pendingTrainings.forEach(t => {
        const matchOffice = officeFilter === 'ALL' || t.office === officeFilter;
        const matchRole = roleFilter === 'ALL' || t.role === roleFilter;
        const matchCategory = categoryFilter === 'ALL' || t.category === categoryFilter;
        const matchSearch = t.name.toLowerCase().includes(search);
        const matchGlobal = isDateWithinGlobalFilter(t.date);
        
        if (matchOffice && matchRole && matchCategory && matchSearch && matchGlobal) {
            tbody.innerHTML += `<tr>
                <td class="font-bold">${t.name}</td>
                <td>${t.training}</td>
                <td>${getOfficeTag(t.office)}</td>
                <td><span class="font-bold">${t.role}</span></td>
                <td>${t.category}</td>
                <td>${t.date}</td>
            </tr>`;
        }
    });
}

// Top Performers Logic
function updatePerformers() {
    const tbody = document.getElementById('performersTableBody');
    if (!tbody) return;
    const sortEl = document.getElementById('sortPerformersBy');
    const officeEl = document.getElementById('filterPerformersOffice');
    const categoryEl = document.getElementById('filterPerformersCategory');
    if (!sortEl || !officeEl || !categoryEl) return;
    const sortBy = sortEl.value;
    const officeF = officeEl.value;
    const categoryF = categoryEl.value;

    let list = getFilteredOfficeData(officeF);
    if (categoryF !== 'ALL') {
        list = list.filter(person => person.completedTrainings.some(training => training.category === categoryF));
    }
    
    // Sort array descending based on selected metric
    list.sort((a, b) => b[sortBy] - a[sortBy]);
    
    tbody.innerHTML = '';
    list.forEach((p, i) => {
        // Only show top performers, you can remove this if statement to show all
        if(i < 10) {
            tbody.innerHTML += `<tr>
                <td class="font-bold">#${i + 1}</td>
                <td class="font-bold">${p.name}</td>
                <td>${getOfficeTag(p.office)}</td>
                <td class="text-center font-bold color-blue">${p[sortBy]}</td>
            </tr>`;
        }
    });
}

// Simple text filter for the Staff Table
function filterTable() {
    const filter = document.getElementById('staffSearch').value.toLowerCase();
    const rows = document.getElementById('staffTableBody').getElementsByTagName('tr');
    
    for (let i = 0; i < rows.length; i++) {
        const nameCell = rows[i].getElementsByTagName('td')[0];
        if (nameCell) {
            rows[i].style.display = nameCell.innerText.toLowerCase().includes(filter) ? "" : "none";
        }
    }
}

function toggleExportOptions() {
    const panel = document.getElementById('exportOptionsPanel');
    if (!panel) return;
    panel.style.display = panel.style.display === 'flex' ? 'none' : 'flex';
}

function getSelectedExportFields() {
    const checkboxes = document.querySelectorAll('#exportOptionsPanel input[type="checkbox"]');
    const selected = Array.from(checkboxes)
        .filter(input => input.checked)
        .map(input => input.value);
    return selected.length ? selected : ['total', 'fac', 'part', 'org', 'spk'];
}

function exportCurrentOfficeData() {
    if (!currentActiveOffice) {
        alert('Please select an office card first.');
        return;
    }

    const selectedFields = getSelectedExportFields();
    const headers = ['Name', 'Office'];
    const fieldLabels = { total: 'Total Trainings', fac: 'Facilitated', part: 'Participated', org: 'Organized', spk: 'Speaker' };
    selectedFields.forEach(field => headers.push(fieldLabels[field]));

    const rows = (officeData[currentActiveOffice] || []).map(p => {
        const row = [p.name, p.office];
        selectedFields.forEach(field => row.push(p[field]));
        return row;
    });

    if (rows.length === 0) {
        alert('No data available for export.');
        return;
    }

    const csv = [headers.join(',')].concat(rows.map(row => row.map(value => '"' + value + '"').join(',')));
    const csvFile = new Blob([csv.join('\n')], { type: 'text/csv' });
    const downloadLink = document.createElement('a');
    downloadLink.download = `${currentActiveOffice}_Staff_Report.csv`;
    downloadLink.href = window.URL.createObjectURL(csvFile);
    downloadLink.style.display = 'none';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
}

function printCurrentOfficeData(printAll) {
    if (!currentActiveOffice) {
        alert('Please select an office card first.');
        return;
    }

    const allFields = ['total', 'fac', 'part', 'org', 'spk'];
    const selectedFields = printAll ? allFields : getSelectedExportFields();
    const fieldLabels = { total: 'Total Trainings', fac: 'Facilitated', part: 'Participated', org: 'Organized', spk: 'Speaker' };
    const columns = ['Name', 'Office'].concat(selectedFields.map(field => fieldLabels[field]));

    const rows = (officeData[currentActiveOffice] || []).map(p => {
        const row = [p.name, p.office];
        selectedFields.forEach(field => row.push(p[field]));
        return row;
    });

    if (rows.length === 0) {
        alert('No data available for printing.');
        return;
    }

    const printWindow = window.open('', '_blank');
    const title = `${currentActiveOffice.replace('_', ' ')} Staff Report`;
    printWindow.document.write(`<html><head><title>${title}</title><style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
            th { background: #f4f7fe; }
        </style></head><body><h1>${title}</h1><table><thead><tr>${columns.map(c => `<th>${c}</th>`).join('')}</tr></thead><tbody>${rows.map(row => `<tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>`).join('')}</tbody></table></body></html>`);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
}

// Dynamic Chart Logic for Participation Roles
function calculateInsights(officeCode = 'ALL', viewType = 'ROLE', categoryFilter = 'ALL') {
    const breakdownBar = document.getElementById('breakdownBar');
    const breakdownLegend = document.getElementById('breakdownLegend');
    if (!breakdownBar || !breakdownLegend) return;

    const roleItems = [
        { key: 'Participant', field: 'part', className: 'bg-participant' },
        { key: 'Facilitator', field: 'fac', className: 'bg-facilitator' },
        { key: 'Organizer', field: 'org', className: 'bg-organizer' },
        { key: 'Speaker', field: 'spk', className: 'bg-speaker' }
    ];
    const officeItems = [
        { key: 'ACCA', className: 'bg-acca' },
        { key: 'ACES', className: 'bg-aces' },
        { key: 'ACLG', className: 'bg-aclg' },
        { key: 'APC', className: 'bg-apc' },
        { key: 'CCES', className: 'bg-cces' },
        { key: 'ALTEC', className: 'bg-altec' },
        { key: 'SDU', className: 'bg-sdu' }
    ];

    let items = [];
    let total = 0;

    if (viewType === 'OFFICE') {
        const counts = { ACCA: 0, ACES: 0, ACLG: 0, APC: 0, CCES: 0, ALTEC: 0, SDU_ONLY: 0 };
        const dataset = getFilteredOfficeData(officeCode);

        dataset.forEach(p => {
            const officeKey = p.office === 'SDU' ? 'SDU_ONLY' : p.office;
            const trainings = categoryFilter === 'ALL'
                ? p.completedTrainings
                : p.completedTrainings.filter(training => training.category === categoryFilter);
            counts[officeKey] += trainings.length;
        });

        officeItems.forEach(item => {
            const officeKey = item.key === 'SDU' ? 'SDU_ONLY' : item.key;
            const value = counts[officeKey] || 0;
            if (value > 0) {
                items.push({ label: item.key, value, className: item.className });
                total += value;
            }
        });

        if (total === 0) {
            items = [{ label: officeCode === 'ALL' ? 'No activity' : officeCode.replace('_ONLY', ''), value: 0, className: 'bg-participant' }];
        }
    } else {
        const dataset = getFilteredOfficeData(officeCode);
        const counts = { Participant: 0, Facilitator: 0, Organizer: 0, Speaker: 0 };

        dataset.forEach(p => {
            const trainings = categoryFilter === 'ALL'
                ? p.completedTrainings
                : p.completedTrainings.filter(training => training.category === categoryFilter);
            trainings.forEach(training => {
                if (training.role === 'Participant') counts.Participant += 1;
                if (training.role === 'Facilitator') counts.Facilitator += 1;
                if (training.role === 'Organizer') counts.Organizer += 1;
                if (training.role === 'Speaker') counts.Speaker += 1;
            });
        });

        roleItems.forEach(item => {
            const value = counts[item.key] || 0;
            items.push({ label: item.key, value, className: item.className });
            total += value;
        });
    }

    breakdownBar.innerHTML = '';
    breakdownLegend.innerHTML = '';

    if (total === 0) {
        breakdownBar.innerHTML = '<div class="empty-bar">No data available</div>';
        return;
    }

    items.forEach(item => {
        const pct = ((item.value / total) * 100).toFixed(1);
        const segment = document.createElement('div');
        segment.className = `bar-segment ${item.className}`;
        segment.style.width = `${pct}%`;
        segment.title = `${item.label}: ${pct}% (${item.value})`;
        breakdownBar.appendChild(segment);

        const legendEntry = document.createElement('span');
        legendEntry.innerHTML = `<div class="legend-dot ${item.className}"></div> ${item.label} (${pct}% / ${item.value})`;
        breakdownLegend.appendChild(legendEntry);
    });
}

function buildCategoryOptionsHtml(includeAll = true) {
    const allOption = includeAll ? '<option value="ALL">All Categories</option>' : '';
    const options = trainingCategories.map(category => `<option value="${category}">${category}</option>`).join('');
    return allOption + options;
}

function populateCategoryFilters() {
    const breakdownFilter = document.getElementById('breakdownCategoryFilter');
    const performerFilter = document.getElementById('filterPerformersCategory');
    const trainingFilter = document.getElementById('trainingCategoryFilter');
    const coverageOfficeFilter = document.getElementById('categoryCoverageOfficeFilter');

    if (breakdownFilter) breakdownFilter.innerHTML = buildCategoryOptionsHtml(true);
    if (performerFilter) performerFilter.innerHTML = buildCategoryOptionsHtml(true);
    if (trainingFilter) trainingFilter.innerHTML = buildCategoryOptionsHtml(true);

    if (coverageOfficeFilter) {
        coverageOfficeFilter.innerHTML = `
            <option value="ALL">All Offices</option>
            <option value="SDU_ONLY">SDU Only</option>
            <option value="ACCA">ACCA</option>
            <option value="ACES">ACES</option>
            <option value="ACLG">ACLG</option>
            <option value="APC">APC</option>
            <option value="CCES">CCES</option>
            <option value="ALTEC">ALTEC</option>
        `;
    }
}

function updateCategoryCoverageCard() {
    const coverageList = document.getElementById('categoryCoverageList');
    if (!coverageList) return;

    const officeFilterEl = document.getElementById('categoryCoverageOfficeFilter');
    const officeFilter = officeFilterEl ? officeFilterEl.value : 'ALL';
    const dataset = getFilteredOfficeData(officeFilter);
    const totalStaff = dataset.length;

    coverageList.innerHTML = '';
    trainingCategories.forEach(category => {
        const coveredCount = dataset.filter(staff =>
            staff.completedTrainings.some(training => training.category === category)
        ).length;

        const statusClass = coveredCount === 0 ? 'alert-critical' : (coveredCount < Math.ceil(totalStaff / 4) ? 'alert-warning' : 'alert-info');
        const statusText = coveredCount === 0 ? 'No staff covered' : `${coveredCount}/${totalStaff} staff covered`;

        const row = document.createElement('div');
        row.className = `alert-item ${statusClass}`;
        row.innerHTML = `<strong>${category}</strong>${statusText}`;
        coverageList.appendChild(row);
    });
}

function updateNeedsAttentionAlerts() {
    const container = document.getElementById('needsAttentionList');
    if (!container) return;

    const staffList = getFilteredOfficeData('ALL');
    const officeKeys = ['ACCA', 'ACES', 'ACLG', 'APC', 'CCES', 'ALTEC', 'SDU_ONLY'];
    const officeLabel = (key) => key === 'SDU_ONLY' ? 'SDU' : key;

    container.innerHTML = '';
    const competencyAlerts = [];
    const unequalAlerts = [];
    const overParticipationAlerts = [];

    // 1) Competency gap by role per office
    const roleTypes = ['Participant', 'Facilitator', 'Organizer', 'Speaker'];
    officeKeys.forEach(officeKey => {
        const officeStaff = getFilteredOfficeData(officeKey);
        const roleCoverage = { Participant: 0, Facilitator: 0, Organizer: 0, Speaker: 0 };
        officeStaff.forEach(person => {
            person.completedTrainings.forEach(training => {
                roleCoverage[training.role] += 1;
            });
        });
        roleTypes.forEach(role => {
            if (roleCoverage[role] === 0) {
                competencyAlerts.push({
                    level: 'critical',
                    title: 'Competency Gap',
                    text: `No active ${role}s identified in ${officeLabel(officeKey)} based on recorded trainings.`
                });
            }
        });
    });

    // 2) Unequal distribution: staff with zero trainings per office
    officeKeys.forEach(officeKey => {
        const officeStaff = getFilteredOfficeData(officeKey);
        const zeroCount = officeStaff.filter(person => person.total === 0).length;
        if (zeroCount > 0) {
            unequalAlerts.push({
                level: 'warning',
                title: 'Unequal Distribution',
                text: `${zeroCount} staff in ${officeLabel(officeKey)} have 0 trainings recorded.`
            });
        }
    });

    // 3) Over-participation: top person vs overall average
    if (staffList.length > 0) {
        const totalTrainings = staffList.reduce((sum, person) => sum + person.total, 0);
        const average = totalTrainings / staffList.length;
        const topPerson = [...staffList].sort((a, b) => b.total - a.total)[0];
        if (topPerson && topPerson.total > average * 1.5) {
            overParticipationAlerts.push({
                level: 'info',
                title: 'Over-Participation',
                text: `${topPerson.name} is significantly above average training load (${topPerson.total} vs avg ${average.toFixed(1)}).`
            });
        }
    }

    const prioritizedAlerts = [];
    if (competencyAlerts.length) prioritizedAlerts.push(competencyAlerts[0]);
    if (unequalAlerts.length) prioritizedAlerts.push(unequalAlerts[0]);
    if (overParticipationAlerts.length) prioritizedAlerts.push(overParticipationAlerts[0]);

    const remainingAlerts = [
        ...competencyAlerts.slice(1),
        ...unequalAlerts.slice(1),
        ...overParticipationAlerts.slice(1)
    ];

    const alerts = prioritizedAlerts.concat(remainingAlerts).slice(0, 6);

    if (alerts.length === 0) {
        const okRow = document.createElement('div');
        okRow.className = 'alert-item alert-info';
        okRow.innerHTML = '<strong>All Clear</strong>No critical competency or distribution flags detected from current data.';
        container.appendChild(okRow);
        return;
    }

    alerts.forEach(alert => {
        const row = document.createElement('div');
        row.className = `alert-item alert-${alert.level}`;
        row.innerHTML = `<strong>${alert.title}:</strong> ${alert.text}`;
        container.appendChild(row);
    });
}

// --- EXPORT TO EXCEL (CSV) LOGIC ---
function exportToExcel(filename) {
    let csv = [];
    
    // Grab the rows currently visible in the active staff table
    let rows = document.querySelectorAll("#staffSection table tr");
    
    if(rows.length <= 1) {
        alert("Please open an office directory first to export its data.");
        return;
    }
    
    for (let i = 0; i < rows.length; i++) {
        // Only grab rows that are actually visible (respects search filter)
        if (rows[i].style.display !== 'none') {
            let row = [];
            let cols = rows[i].querySelectorAll("td, th");
            
            for (let j = 0; j < cols.length; j++) {
                let data = cols[j].innerText.replace(/"/g, '""');
                row.push('"' + data + '"');
            }
            csv.push(row.join(","));
        }
    }

    let csvFile = new Blob([csv.join("\n")], {type: "text/csv"});
    let downloadLink = document.createElement("a");
    downloadLink.download = filename;
    downloadLink.href = window.URL.createObjectURL(csvFile);
    downloadLink.style.display = "none";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
}

function downloadCsvFile(filename, rows) {
    const csvFile = new Blob([rows.join('\n')], { type: 'text/csv' });
    const downloadLink = document.createElement('a');
    downloadLink.download = filename;
    downloadLink.href = window.URL.createObjectURL(csvFile);
    downloadLink.style.display = 'none';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
}

function exportCategoryCoverageData() {
    const officeFilterEl = document.getElementById('categoryCoverageOfficeFilter');
    const officeFilter = officeFilterEl ? officeFilterEl.value : 'ALL';
    const dataset = getFilteredOfficeData(officeFilter);
    const totalStaff = dataset.length;

    if (totalStaff === 0) {
        alert('No category coverage data available for export.');
        return;
    }

    const rows = ['"Category","Covered Staff","Total Staff","Coverage (%)","Status"'];
    trainingCategories.forEach(category => {
        const coveredCount = dataset.filter(staff =>
            staff.completedTrainings.some(training => training.category === category)
        ).length;
        const pct = ((coveredCount / totalStaff) * 100).toFixed(1);
        const status = coveredCount === 0 ? 'No coverage' : (coveredCount < Math.ceil(totalStaff / 4) ? 'Low coverage' : 'Covered');
        rows.push(`"${category}","${coveredCount}","${totalStaff}","${pct}%","${status}"`);
    });

    downloadCsvFile(`Training_Category_Coverage_${officeFilter}.csv`, rows);
}

function exportTopPerformersData() {
    const officeF = document.getElementById('filterPerformersOffice').value;
    const categoryF = document.getElementById('filterPerformersCategory').value;
    const sortBy = document.getElementById('sortPerformersBy').value;

    let list = getFilteredOfficeData(officeF);
    if (categoryF !== 'ALL') {
        list = list.filter(person => person.completedTrainings.some(training => training.category === categoryF));
    }

    list.sort((a, b) => b[sortBy] - a[sortBy]);
    const topList = list.slice(0, 10);

    if (topList.length === 0) {
        alert('No top performer data available for export.');
        return;
    }

    const rows = ['"Rank","Name","Office","Score","Sorted By","Category Filter"'];
    topList.forEach((person, index) => {
        rows.push(`"#${index + 1}","${person.name}","${person.office}","${person[sortBy]}","${sortBy}","${categoryF}"`);
    });

    downloadCsvFile(`Top_Performers_${officeF}_${categoryF}_${sortBy}.csv`, rows);
}

function populateInboxOfficeFilter() {
    const officeFilter = document.getElementById('inboxOfficeFilter');
    if (!officeFilter) return;
    officeFilter.innerHTML = `
        <option value="ALL">All Offices</option>
        <option value="SDU_ONLY">SDU</option>
        <option value="ACCA">ACCA</option>
        <option value="ACES">ACES</option>
        <option value="ACLG">ACLG</option>
        <option value="APC">APC</option>
        <option value="CCES">CCES</option>
        <option value="ALTEC">ALTEC</option>
    `;
}

function getSenderTypeTag(senderType) {
    const label = senderType === 'OFFICE_HEAD' ? 'Office Head' : 'Staff';
    const className = senderType === 'OFFICE_HEAD' ? 'bg-speaker' : 'bg-participant';
    return `<span class="tag ${className}">${label}</span>`;
}

function loadInboxMessages() {
    const threadList = document.getElementById('inboxThreadList');
    const officeFilter = document.getElementById('inboxOfficeFilter').value;
    const senderTypeFilter = document.getElementById('inboxSenderTypeFilter').value;
    const search = document.getElementById('inboxSearch').value.toLowerCase();
    const headerEl = document.getElementById('inboxMessageHeader');
    const bodyEl = document.getElementById('inboxMessageBody');
    if (!threadList || !headerEl || !bodyEl) return;

    const filteredThreads = inboxThreads.filter(thread => {
        const matchOffice = officeFilter === 'ALL' || thread.office === officeFilter;
        const matchType = senderTypeFilter === 'ALL' || thread.senderType === senderTypeFilter;
        const matchSearch = thread.participants.some(p => p.toLowerCase().includes(search) && p !== 'Director');
        return matchOffice && matchType && matchSearch;
    });

    threadList.innerHTML = '';
    if (filteredThreads.length === 0) {
        threadList.innerHTML = '<div class="inbox-empty">No messages found.</div>';
        selectedInboxThreadId = null;
        headerEl.innerText = 'No conversation selected';
        bodyEl.innerText = 'Try adjusting filters or search.';
        return;
    }

    if (!filteredThreads.some(thread => thread.id === selectedInboxThreadId)) {
        selectedInboxThreadId = filteredThreads[0].id;
    }

    filteredThreads.forEach(thread => {
        const isActive = thread.id === selectedInboxThreadId;
        const lastMessage = thread.messages[thread.messages.length - 1];
        const staffName = thread.participants.find(p => p !== 'Director');
        threadList.innerHTML += `<button class="inbox-thread-item ${isActive ? 'active' : ''}" onclick="openInboxThread(${thread.id})">
            <div class="inbox-thread-top">
                <span class="font-bold">${staffName}</span>
                <span class="inbox-thread-date">${lastMessage.date}</span>
            </div>
            <div class="inbox-thread-meta">${getSenderTypeTag(thread.senderType)} ${getOfficeTag(thread.office)}</div>
            <div class="inbox-thread-subject">${thread.subject}</div>
        </button>`;
    });

    openInboxThread(selectedInboxThreadId);
}

function toggleNotificationTargetOffice() {
    const targetType = document.getElementById('notifyTargetType').value;
    const targetOfficeGroup = document.getElementById('notifyTargetOfficeGroup');
    if (!targetOfficeGroup) return;

    const shouldShow = targetType === 'SPECIFIC_OFFICE' || targetType === 'SPECIFIC_OFFICE_HEAD';
    targetOfficeGroup.style.display = shouldShow ? 'block' : 'none';

    if (!shouldShow) {
        document.querySelectorAll('.notify-office-checkbox').forEach(checkbox => {
            checkbox.checked = false;
        });
    }
}

function resolveOfficeDisplayName(officeCode) {
    return officeCode === 'SDU_ONLY' ? 'SDU' : officeCode;
}

function getSelectedNotifyOffices() {
    return Array.from(document.querySelectorAll('.notify-office-checkbox:checked')).map(checkbox => checkbox.value);
}

function resolveNotificationTargetLabel(targetType, offices) {
    if (targetType === 'ALL_STAFF') return 'All Staff';
    if (targetType === 'ALL_OFFICES') return 'All Offices';
    const officeText = offices.map(resolveOfficeDisplayName).join(', ');
    if (targetType === 'SPECIFIC_OFFICE') return `Office(s): ${officeText}`;
    return `Office Head(s): ${officeText}`;
}

function submitNotification() {
    const targetType = document.getElementById('notifyTargetType').value;
    const selectedOffices = getSelectedNotifyOffices();
    const subject = document.getElementById('notifySubject').value.trim();
    const message = document.getElementById('notifyMessage').value.trim();

    if (!subject || !message) {
        alert('Please provide both subject and message.');
        return;
    }

    if ((targetType === 'SPECIFIC_OFFICE' || targetType === 'SPECIFIC_OFFICE_HEAD') && selectedOffices.length === 0) {
        alert('Please select at least one office.');
        return;
    }

    const target = resolveNotificationTargetLabel(targetType, selectedOffices);
    const now = new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' });
    notificationLog.unshift({ target, subject, message, date: now });
    loadNotifyLog();

    document.getElementById('notifySubject').value = '';
    document.getElementById('notifyMessage').value = '';
    document.querySelectorAll('.notify-office-checkbox').forEach(checkbox => {
        checkbox.checked = false;
    });
    alert(`Notification sent to ${target}.`);
}

function loadNotifyLog() {
    const tbody = document.getElementById('notifyLogTableBody');
    if (!tbody) return;
    tbody.innerHTML = '';

    if (notificationLog.length === 0) {
        tbody.innerHTML = '<tr><td>No notifications sent yet.</td></tr>';
        return;
    }

    notificationLog.slice(0, 8).forEach(item => {
        tbody.innerHTML += `<tr><td><strong>${item.subject}</strong> to ${item.target} - ${item.message} (${item.date})</td></tr>`;
    });
}

function openInboxThread(threadId) {
    const thread = inboxThreads.find(t => t.id === threadId);
    const headerEl = document.getElementById('inboxMessageHeader');
    const bodyEl = document.getElementById('inboxMessageBody');
    if (!thread || !headerEl || !bodyEl) return;

    selectedInboxThreadId = threadId;
    const staffName = thread.participants.find(p => p !== 'Director');
    headerEl.innerHTML = `<div class="inbox-selected-name">${staffName}</div>
    <div class="inbox-selected-meta">${getSenderTypeTag(thread.senderType)} ${getOfficeTag(thread.office)} <span>${thread.messages[thread.messages.length - 1].date}</span></div>
    <div class="inbox-selected-subject">${thread.subject}</div>`;

    bodyEl.innerHTML = '';
    thread.messages.forEach(message => {
        const isDirector = message.sender === 'Director';
        const rowClass = isDirector ? 'chat-row-right' : 'chat-row-left';
        const bubbleClass = isDirector ? 'chat-bubble-director' : 'chat-bubble-user';

        bodyEl.innerHTML += `
            <div class="chat-row ${rowClass}">
                <div class="chat-bubble ${bubbleClass}">
                    <div class="chat-meta">
                        <div class="chat-sender">${message.sender}</div>
                        <div class="chat-date">${message.date}</div>
                    </div>
                    <div class="chat-content">${message.content}</div>
                </div>
            </div>
        `;
    });

    // Scroll to bottom
    bodyEl.scrollTop = bodyEl.scrollHeight;

    document.querySelectorAll('.inbox-thread-item').forEach(button => button.classList.remove('active'));
    const activeButton = document.querySelector(`.inbox-thread-item[onclick="openInboxThread(${threadId})"]`);
    if (activeButton) activeButton.classList.add('active');
}

function sendDirectorReply() {
    const inputEl = document.getElementById('directorReplyInput');
    const message = inputEl.value.trim();
    if (!message || !selectedInboxThreadId) return;

    const thread = inboxThreads.find(t => t.id === selectedInboxThreadId);
    if (!thread) return;

    // Add new message
    const today = new Date();
    const dateStr = `${today.toLocaleString('default', { month: 'short' })} ${today.getDate()}, ${today.getFullYear()}`;
    thread.messages.push({
        sender: 'Director',
        date: dateStr,
        content: message
    });

    // Clear input
    inputEl.value = '';

    // Refresh thread list and display
    loadInboxMessages();
}