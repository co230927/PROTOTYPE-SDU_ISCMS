// --- OFFICE HEAD TRAININGS MANAGEMENT LOGIC ---

let officeHeadTrainings = [];
let currentEditingId = null;
const OFFICE_HEAD_STORAGE_KEY = 'officeHeadTrainings';
const FALLBACK_OFFICE_HEAD_NAME = 'Carlos Miguel V. Tingson';
const OFFICE_HEAD_ASSIGNED_STATUS_KEY = 'officeHeadAssignedStatusMap';
const OFFICE_HEAD_UPLOADED_PROOFS_KEY = 'officeHeadUploadedProofs';
let assignedPendingTrainings = [];
let assignedCompletedTrainings = [];
let uploadedProofs = [];
let currentProofTargetId = null;
const OFFICE_HEAD_STAFF_ASSIGNMENTS_KEY = 'iscms_office_head_staff_assignments_v1';

// Initialize Trainings Management
function initOfficeHeadTrainings() {
    loadTrainings();
    initializeAssignedTrainings();
    loadUploadedProofs();
    populateCategoryDropdown();
    renderTrainings();
    renderAssignedTrainings();
    renderStaffAssignments();
    renderUploadedFiles();
    attachFormHandlers();
    setupTabNavigation();
    setupJoinedDetailsModal();
    setupProofUploadModal();
}

// Load trainings from localStorage
function loadTrainings() {
    const baseline = generateOfficeHeadTrainingsFromStaffData();
    const stored = localStorage.getItem(OFFICE_HEAD_STORAGE_KEY);
    if (!stored) {
        officeHeadTrainings = baseline;
        return;
    }
    let parsed = [];
    try {
        parsed = JSON.parse(stored) || [];
    } catch (e) {
        parsed = [];
    }
    officeHeadTrainings = mergeOfficeHeadBaselineTrainings(parsed, baseline);
}

function getCurrentOfficeHeadRecord() {
    if (typeof getOfficeHeadStaffMember === 'function') {
        const row = getOfficeHeadStaffMember();
        if (row) return row;
    }
    return null;
}

function getCurrentOfficeHeadName() {
    return getCurrentOfficeHeadRecord()?.name || FALLBACK_OFFICE_HEAD_NAME;
}

function getCurrentOfficeCode() {
    return (typeof window !== 'undefined' && window.ISCMS_OFFICE_HEAD_CODE) ? window.ISCMS_OFFICE_HEAD_CODE : 'ACCA';
}

function getScopedStorageKey(base) {
    const office = getCurrentOfficeCode();
    const name = getCurrentOfficeHeadName().replace(/\s+/g, '_');
    return `${base}_${office}_${name}`;
}

function parseSeedDateToIso(dateText) {
    const parsed = new Date(dateText);
    if (Number.isNaN(parsed.getTime())) return '';
    const month = String(parsed.getMonth() + 1).padStart(2, '0');
    const day = String(parsed.getDate()).padStart(2, '0');
    return `${parsed.getFullYear()}-${month}-${day}`;
}

function generateOfficeHeadTrainingsFromStaffData() {
    const head = (typeof getOfficeHeadStaffMember === 'function') ? getOfficeHeadStaffMember() : null;
    const completed = Array.isArray(head?.completedTrainings) ? head.completedTrainings : [];
    return completed.map((item, index) => {
        const isoDate = parseSeedDateToIso(item.date);
        const headName = head?.name || FALLBACK_OFFICE_HEAD_NAME;
        return {
            id: `oh-seed-${index + 1}`,
            name: item.title || `Training ${index + 1}`,
            venue: item.venue || 'TBA',
            startDate: isoDate,
            endDate: isoDate,
            nature: item.nature || 'Internal',
            scope: item.scope || 'Local',
            category: item.category || 'Other',
            roles: [item.role || 'Participant'],
            description: `Loaded from ${headName} office-head data.`,
            sourceProofs: Array.isArray(item.proofs) ? item.proofs : [],
            createdDate: new Date().toISOString()
        };
    });
}

function mergeOfficeHeadBaselineTrainings(existingRows, baselineRows) {
    const existing = Array.isArray(existingRows) ? existingRows : [];
    const baseline = Array.isArray(baselineRows) ? baselineRows : [];
    const existingNames = new Set(existing.map(item => (item?.name || '').toLowerCase().trim()).filter(Boolean));
    const missingBaseline = baseline.filter(item => !existingNames.has((item.name || '').toLowerCase().trim()));
    return [...missingBaseline, ...existing];
}

function initializeAssignedTrainings() {
    const headName = getCurrentOfficeHeadName();
    const officeCode = getCurrentOfficeCode();
    const mapped = [];

    if (typeof pendingTrainings !== 'undefined' && Array.isArray(pendingTrainings)) {
        pendingTrainings.forEach((item, index) => {
            if (item.name !== headName) return;
            if (item.office && item.office !== officeCode) return;
            mapped.push({
                id: `oh-pending-${index + 1}`,
                source: 'pendingTrainings',
                name: item.training || 'Training',
                venue: item.venue || 'TBA',
                category: item.category || 'Other',
                role: item.role || 'Participant',
                startDate: parseSeedDateToIso(item.date || ''),
                endDate: parseSeedDateToIso(item.date || ''),
                description: item.description || 'Assigned by SDU Director.',
                status: 'pending'
            });
        });
    }

    if (typeof TRAINING_EVENTS_SEED !== 'undefined' && Array.isArray(TRAINING_EVENTS_SEED)) {
        TRAINING_EVENTS_SEED.forEach((event, idx) => {
            (event.assignedPersons || []).forEach((person, pidx) => {
                if (person.name !== headName) return;
                mapped.push({
                    id: `oh-seed-assigned-${idx}-${pidx}`,
                    source: 'TRAINING_EVENTS_SEED',
                    name: event.trainingName || 'Training',
                    venue: event.venue || 'TBA',
                    category: event.category || 'Other',
                    role: person.role || 'Participant',
                    startDate: event.startDate || event.deadline || '',
                    endDate: event.endDate || event.deadline || '',
                    description: event.description || 'Assigned by SDU Director.',
                    status: person.status || 'pending'
                });
            });
        });
    }

    try {
        const directorAssignments = JSON.parse(localStorage.getItem('iscms_director_assignments_v1') || '[]');
        directorAssignments.forEach((assignment) => {
            if (typeof TRAINING_EVENTS_SEED !== 'undefined' && TRAINING_EVENTS_SEED.some((event) => event.id === assignment.id)) return;
            (assignment.assignedPersons || []).forEach((person, index) => {
                if (person.name !== headName || (person.office && person.office !== officeCode && !(person.office === 'SDU' && officeCode === 'SDU_ONLY'))) return;
                mapped.push({
                    id: `${assignment.id}-${index}`,
                    source: 'director_assignment',
                    name: assignment.trainingName || 'Training',
                    venue: assignment.venue || 'TBA',
                    category: assignment.category || 'Other',
                    role: person.role || 'Participant',
                    startDate: assignment.startDate || assignment.deadline || '',
                    endDate: assignment.endDate || assignment.deadline || '',
                    deadline: assignment.deadline || assignment.endDate || '',
                    description: assignment.description || 'Assigned by SDU Director.',
                    status: person.status || assignment.status || 'pending'
                });
            });
        });
    } catch (e) { /* ignore malformed prototype data */ }

    let statusMap = {};
    let officeAssignments = [];
    try {
        statusMap = JSON.parse(localStorage.getItem(getScopedStorageKey(OFFICE_HEAD_ASSIGNED_STATUS_KEY)) || '{}');
    } catch (e) { /* ignore malformed prototype data */ }
    try {
        officeAssignments = JSON.parse(localStorage.getItem(`${OFFICE_HEAD_STAFF_ASSIGNMENTS_KEY}_${officeCode}`) || '[]');
    } catch (e) { /* ignore malformed prototype data */ }
    officeAssignments.forEach((item) => {
        if (item.office === officeCode) mapped.push(item);
    });
    mapped.forEach(item => {
        if (statusMap[item.id]) item.status = statusMap[item.id];
        if (typeof IscmsAssignmentStatus !== 'undefined') {
            item.status = IscmsAssignmentStatus.effectiveStatus(item.status, item.id);
        }
    });

    const isPost = (s) => typeof IscmsAssignmentStatus !== 'undefined'
        ? IscmsAssignmentStatus.isPostPendingStatus(s)
        : (s === 'completed' || s === 'proof_pending' || s === 'awaiting_proof');

    assignedPendingTrainings = mapped.filter(item => item.status === 'pending' || item.status === 'overdue');
    assignedCompletedTrainings = mapped.filter(item => isPost(item.status));
}

function openOfficeStaffAssignmentModal() {
    const container = document.getElementById('assignmentStaffCheckboxes');
    if (!container || typeof officeData === 'undefined') return;
    const staff = officeData[getCurrentOfficeCode()] || [];
    container.innerHTML = staff
        .filter((person) => person.name !== getCurrentOfficeHeadName())
        .map((person) => `<label><input type="checkbox" name="assignedStaff" value="${escapeHtml(person.name)}"> ${escapeHtml(person.name)}</label>`)
        .join('');
    openModal('officeStaffAssignmentModal');
}

function saveOfficeStaffAssignment(event) {
    event.preventDefault();
    const title = document.getElementById('assignmentTrainingTitle').value.trim();
    const deadline = document.getElementById('assignmentDeadline').value;
    const role = document.getElementById('assignmentRole').value;
    const staff = Array.from(document.querySelectorAll('input[name="assignedStaff"]:checked')).map((input) => input.value);
    if (!title || !deadline || !staff.length) {
        alert('Enter a title, deadline, and select at least one staff member.');
        return;
    }
    const key = `${OFFICE_HEAD_STAFF_ASSIGNMENTS_KEY}_${getCurrentOfficeCode()}`;
    const assignments = JSON.parse(localStorage.getItem(key) || '[]');
    staff.forEach((name) => assignments.push({
        id: `oh-staff-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        source: 'office_head_assignment', office: getCurrentOfficeCode(), staffName: name,
        name: title, venue: 'TBA', category: 'Other', role, startDate: deadline, endDate: deadline,
        deadline, description: `Assigned by ${getCurrentOfficeHeadName()}.`, status: 'pending'
    }));
    localStorage.setItem(key, JSON.stringify(assignments));
    if (typeof addIscmsNotification === 'function') {
        addIscmsNotification({
            type: 'assignment', title: 'Office training assignment',
            message: `${title} assigned to ${staff.join(', ')}.`,
            recipientRole: 'director_secretary', sender: getCurrentOfficeHeadName()
        });
        staff.forEach((staffName) => addIscmsNotification({
            type: 'assignment', title: 'New training assignment', message: `${title} was assigned to you.`,
            recipientRole: 'staff', recipientOffice: getCurrentOfficeCode(), recipientName: staffName,
            sender: getCurrentOfficeHeadName()
        }));
    }
    closeModal('officeStaffAssignmentModal');
    alert('Training assigned. Notifications were sent to the selected staff and SDU leadership.');
    initializeAssignedTrainings();
    renderAssignedTrainings();
    renderStaffAssignments();
}

function persistAssignedStatus(id, status) {
    const key = getScopedStorageKey(OFFICE_HEAD_ASSIGNED_STATUS_KEY);
    const map = JSON.parse(localStorage.getItem(key) || '{}');
    map[id] = status;
    localStorage.setItem(key, JSON.stringify(map));
}

function renderAssignedTrainings() {
    const pendingBody = document.getElementById('assignedPendingBody');
    const completedBody = document.getElementById('assignedCompletedBody');
    if (!pendingBody || !completedBody) return;

    pendingBody.innerHTML = assignedPendingTrainings.length
        ? assignedPendingTrainings.map(item => `
            <tr>
                <td>${escapeHtml(item.name)}</td>
                <td>${escapeHtml(item.venue)}</td>
                <td>${escapeHtml(item.category)}</td>
                <td>${escapeHtml(item.role)}</td>
                <td>${escapeHtml(formatDate(item.startDate))}</td>
                <td>${escapeHtml(formatDate(item.endDate))}</td>
                <td>${escapeHtml(item.description || 'N/A')}</td>
                <td>
                    <button class="btn-accept" onclick="markAssignedComplete('${item.id}')">Complete</button>
                    <button class="btn-decline" onclick="cancelAssigned('${item.id}')" style="margin-top:6px;">Cancelled</button>
                </td>
            </tr>
        `).join('')
        : `<tr><td colspan="8" style="text-align:center;color:#64748b;">No pending assignments for ${escapeHtml(getCurrentOfficeHeadName())}.</td></tr>`;

    completedBody.innerHTML = assignedCompletedTrainings.length
        ? assignedCompletedTrainings.map(item => `
            <tr>
                <td>${escapeHtml(item.name)}</td>
                <td>${escapeHtml(item.venue)}</td>
                <td>${escapeHtml(item.category)}</td>
                <td>${escapeHtml(item.role)}</td>
                <td>${escapeHtml(formatDate(item.startDate))}</td>
                <td>${escapeHtml(formatDate(item.endDate))}</td>
                <td>${escapeHtml(item.description || 'N/A')}</td>
                <td><button class="btn-export" onclick="openProofUpload('${item.id}')">Upload certificate</button></td>
            </tr>
        `).join('')
        : `<tr><td colspan="8" style="text-align:center;color:#64748b;">No completed assigned trainings yet.</td></tr>`;
}

function renderStaffAssignments() {
    const body = document.getElementById('staffAssignmentsBody');
    if (!body) return;

    const key = `${OFFICE_HEAD_STAFF_ASSIGNMENTS_KEY}_${getCurrentOfficeCode()}`;
    let rows = [];
    try {
        rows = JSON.parse(localStorage.getItem(key) || '[]');
    } catch (e) {
        rows = [];
    }
    if (!Array.isArray(rows) || !rows.length) {
        body.innerHTML = '<tr><td colspan="6" style="text-align:center;color:#64748b;">No assignments to your staff yet.</td></tr>';
        return;
    }

    const statusLabel = (status) => {
        const v = String(status || 'pending').toLowerCase();
        if (v === 'completed') return 'Completed';
        if (v === 'awaiting_proof' || v === 'proof_pending') return 'Awaiting certificate';
        if (v === 'cancelled' || v === 'canceled') return 'Cancelled';
        if (v === 'overdue') return 'Overdue';
        return 'Pending';
    };
    const statusClass = (status) => {
        const v = String(status || 'pending').toLowerCase();
        if (v === 'completed') return 'status-completed';
        if (v === 'awaiting_proof' || v === 'proof_pending') return 'status-ongoing';
        if (v === 'cancelled' || v === 'canceled') return 'status-cancelled';
        if (v === 'overdue') return 'status-overdue';
        return 'status-upcoming';
    };

    body.innerHTML = rows.map((item) => {
        let status = item.status || 'pending';
        if (typeof IscmsAssignmentStatus !== 'undefined') {
            status = IscmsAssignmentStatus.effectiveStatus(status, item.id);
        }
        return '<tr>' +
            '<td class="font-bold">' + escapeHtml(item.staffName || '—') + '</td>' +
            '<td>' + escapeHtml(item.name || '—') + '</td>' +
            '<td>' + escapeHtml(item.role || 'Participant') + '</td>' +
            '<td>' + escapeHtml(formatDate(item.deadline || item.startDate || item.endDate)) + '</td>' +
            '<td><span class="status-badge ' + statusClass(status) + '">' + escapeHtml(statusLabel(status)) + '</span></td>' +
            '<td>' + escapeHtml(item.description || 'N/A') + '</td>' +
            '</tr>';
    }).join('');
}

function markAssignedComplete(id) {
    const idx = assignedPendingTrainings.findIndex(item => item.id === id);
    if (idx === -1) return;
    const [item] = assignedPendingTrainings.splice(idx, 1);
    item.status = 'awaiting_proof';
    assignedCompletedTrainings.push(item);
    persistAssignedStatus(id, 'awaiting_proof');
    if (typeof IscmsAssignmentStatus !== 'undefined') {
        IscmsAssignmentStatus.markAwaitingProof(id);
    }
    renderAssignedTrainings();
}

function cancelAssigned(id) {
    assignedPendingTrainings = assignedPendingTrainings.filter(item => item.id !== id);
    persistAssignedStatus(id, 'cancelled');
    renderAssignedTrainings();
}

function loadUploadedProofs() {
    uploadedProofs = JSON.parse(localStorage.getItem(getScopedStorageKey(OFFICE_HEAD_UPLOADED_PROOFS_KEY)) || '[]');
}

function saveUploadedProofs() {
    localStorage.setItem(getScopedStorageKey(OFFICE_HEAD_UPLOADED_PROOFS_KEY), JSON.stringify(uploadedProofs));
}

function getBaselineProofBundles() {
    return officeHeadTrainings
        .filter(training => Array.isArray(training.sourceProofs) && training.sourceProofs.length)
        .map(training => ({
            id: `baseline-${training.id}`,
            trainingId: training.id,
            trainingName: training.name,
            dateUploaded: training.createdDate || new Date().toISOString(),
            note: 'Loaded from staff_data.js',
            source: 'staff_data',
            files: training.sourceProofs.map(name => ({ name, size: 0 }))
        }));
}

function renderUploadedFiles() {
    const container = document.getElementById('uploadedFilesCards');
    if (!container) return;
    const bundles = [...getBaselineProofBundles(), ...uploadedProofs];
    if (!bundles.length) {
        container.innerHTML = `<div class="empty-state"><h3>No uploaded files yet</h3><p>No certificate files are currently available for ${escapeHtml(getCurrentOfficeHeadName())}.</p></div>`;
        return;
    }
    container.innerHTML = bundles.map(upload => {
        const rows = (upload.files || []).map((f, idx) => `
            <li style="display:flex;justify-content:space-between;align-items:center;gap:8px;padding:6px 0;border-bottom:1px solid #e2e8f0;">
                <span>${escapeHtml(f.name)}</span>
                <span style="display:flex;gap:8px;">
                    <button class="btn-viewmore" style="padding:4px 8px;" onclick="editUploadedProofFile('${upload.id}', ${idx})">Edit</button>
                    <button class="btn-decline" style="padding:4px 8px;" onclick="removeUploadedProofFile('${upload.id}', ${idx})">Remove</button>
                </span>
            </li>
        `).join('');
        return `
            <div class="st-proof-item">
                <h4>${escapeHtml(upload.trainingName)}</h4>
                <p><strong>Uploaded:</strong> ${escapeHtml(new Date(upload.dateUploaded).toLocaleString('en-US'))}</p>
                <p><strong>Note:</strong> ${escapeHtml(upload.note || 'N/A')}</p>
                <ul class="st-proof-list">
                    ${rows}
                </ul>
            </div>
        `;
    }).join('');
}

function openProofUpload(trainingId) {
    currentProofTargetId = trainingId;
    const files = document.getElementById('uploadProofFiles');
    const note = document.getElementById('uploadProofNote');
    if (files) files.value = '';
    if (note) note.value = '';
    openModal('modalUploadProof');
}

function submitProofUpload() {
    if (!currentProofTargetId) return;
    const filesInput = document.getElementById('uploadProofFiles');
    const noteInput = document.getElementById('uploadProofNote');
    const selectedFiles = Array.from(filesInput?.files || []);
    if (!selectedFiles.length) {
        alert('Please select at least one file.');
        return;
    }
    const training = assignedCompletedTrainings.find(item => item.id === currentProofTargetId);
    if (!training) return;
    uploadedProofs.push({
        id: `up-${Date.now()}`,
        trainingId: training.id,
        trainingName: training.name,
        dateUploaded: new Date().toISOString(),
        note: noteInput?.value?.trim() || '',
        files: selectedFiles.map(file => ({ name: file.name, size: file.size }))
    });
    saveUploadedProofs();
    renderUploadedFiles();
    persistAssignedStatus(training.id, 'completed');
    training.status = 'completed';
    if (typeof IscmsAssignmentStatus !== 'undefined') {
        IscmsAssignmentStatus.markCompleted(training.id);
    }
    if (typeof addIscmsNotification === 'function') {
        const office = getCurrentOfficeCode();
        const stamp = Date.now();
        addIscmsNotification({
            id: `certificate-uploaded:${training.id}:${stamp}`,
            type: 'certificate_uploaded', title: 'Certificate uploaded',
            message: `${getCurrentOfficeHeadName()} uploaded a certificate of completion for ${training.name}.`,
            recipientRole: 'director_secretary', sender: getCurrentOfficeHeadName()
        });
        addIscmsNotification({
            id: `certificate-uploaded-oh:${training.id}:${stamp}`,
            type: 'certificate_uploaded', title: 'Certificate uploaded',
            message: `${getCurrentOfficeHeadName()} uploaded a certificate of completion for ${training.name}.`,
            recipientRole: 'office_head', recipientOffice: office, sender: getCurrentOfficeHeadName()
        });
    }
    closeModal('modalUploadProof');
}

function editUploadedProofFile(uploadId, fileIndex) {
    const upload = uploadedProofs.find(item => item.id === uploadId);
    if (!upload || !upload.files || !upload.files[fileIndex]) return;
    const current = upload.files[fileIndex].name;
    const next = prompt('Edit file name:', current);
    if (!next || !next.trim()) return;
    upload.files[fileIndex].name = next.trim();
    saveUploadedProofs();
    renderUploadedFiles();
}

function removeUploadedProofFile(uploadId, fileIndex) {
    const upload = uploadedProofs.find(item => item.id === uploadId);
    if (!upload || !upload.files || !upload.files[fileIndex]) return;
    upload.files.splice(fileIndex, 1);
    if (!upload.files.length) {
        uploadedProofs = uploadedProofs.filter(item => item.id !== uploadId);
    }
    saveUploadedProofs();
    renderUploadedFiles();
}

// Populate category dropdown
function populateCategoryDropdown() {
    const categorySelect = document.getElementById('trainingCategory');
    const categories = getAvailableCategories();
    
    if (categorySelect) {
        categories.forEach(category => {
            if (!category) return;
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categorySelect.appendChild(option);
        });
    }
    
    // Also update filter dropdown
    const filterCategorySelect = document.getElementById('filterJoinedCategory');
    if (filterCategorySelect) {
        categories.forEach(category => {
            if (!category) return;
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            filterCategorySelect.appendChild(option);
        });
    }
}

function populateRequiredSkillsCheckboxes() {
    const wrap = document.getElementById('requiredSkillsCheckboxes');
    if (!wrap) return;
    const skillOptions = typeof getActiveSkills === 'function' ? getActiveSkills() : [];
    wrap.innerHTML = skillOptions.map((s) =>
        `<label><input type="checkbox" name="requiredSkills" value="${s.id}"> ${s.name}</label>`
    ).join('');
}

function getAvailableCategories() {
    if (typeof TrainingCategories !== 'undefined') {
        const names = TrainingCategories.getActiveNames();
        if (names.length) return names.slice();
    }
    if (typeof trainingCategories !== 'undefined' && trainingCategories.length) {
        return trainingCategories.slice();
    }
    const fromSeed = (typeof TRAINING_EVENTS_SEED !== 'undefined' && Array.isArray(TRAINING_EVENTS_SEED))
        ? TRAINING_EVENTS_SEED.map(item => item.category).filter(Boolean)
        : [];
    const fromTrainings = officeHeadTrainings.map(item => item.category).filter(Boolean);
    return Array.from(new Set([...fromSeed, ...fromTrainings])).sort((a, b) => a.localeCompare(b));
}

// Render all trainings
function renderTrainings() {
    const filteredTrainings = getFilteredTrainings();
    const tbody = document.getElementById('joinedTrainingsBody');
    
    if (!tbody) return;
    
    document.getElementById('joinedFilterCount').textContent = `${filteredTrainings.length} training(s)`;
    
    if (filteredTrainings.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;color:#64748b;padding:20px;">No trainings yet. Add your first training record.</td></tr>`;
        return;
    }
    
    tbody.innerHTML = filteredTrainings.map(training => createTrainingRow(training)).join('');
}

function createTrainingRow(training) {
    const roleLabel = summarizeRoles(training.roles || []);
    const proofLabel = summarizeProofCount(training);
    return `
        <tr>
            <td>${escapeHtml(training.name)}</td>
            <td>${escapeHtml(formatDateRange(training))}</td>
            <td>${escapeHtml(roleLabel)}</td>
            <td>${escapeHtml(training.recordType || 'Attended')}</td>
            <td>${escapeHtml(training.category || 'Other')}</td>
            <td>${escapeHtml(training.venue || 'TBA')}</td>
            <td>${escapeHtml(proofLabel)}</td>
            <td>
                <button class="btn-viewmore" onclick="openTrainingDetails('${training.id}')">View more</button>
                <button class="btn-edit-training" onclick="editTraining('${training.id}')">Edit</button>
                <button class="btn-delete-training" onclick="confirmDelete('${training.id}')">Delete</button>
            </td>
        </tr>
    `;
}

function escapeHtml(text) {
    if (text == null) return '';
    const div = document.createElement('div');
    div.textContent = String(text);
    return div.innerHTML;
}

function summarizeRoles(roles) {
    if (!Array.isArray(roles) || !roles.length) return 'Participant';
    if (roles.length === 1) return roles[0];
    return `${roles[0]} +${roles.length - 1}`;
}

function summarizeProofCount(training) {
    const proofs = Array.isArray(training.sourceProofs) ? training.sourceProofs : [];
    const total = proofs.length;
    if (!total) return '0 files';
    const breakdown = getProofTypeBreakdown(proofs);
    return `${total} ${total === 1 ? 'file' : 'files'} (${breakdown})`;
}

function getProofType(fileName) {
    const name = String(fileName || '').toLowerCase();
    if (/\.(png|jpe?g|gif|webp|bmp|svg)$/.test(name)) return 'Image';
    if (/\.pdf$/.test(name)) return 'PDF';
    if (/\.(doc|docx|odt|rtf)$/.test(name)) return 'Document';
    if (/\.(xls|xlsx|csv)$/.test(name)) return 'Spreadsheet';
    return 'Other';
}

function getProofTypeBreakdown(fileNames) {
    const counts = {};
    fileNames.forEach(name => {
        const type = getProofType(name);
        counts[type] = (counts[type] || 0) + 1;
    });
    return Object.entries(counts)
        .map(([type, count]) => `${count} ${type}${count > 1 ? 's' : ''}`)
        .join(', ');
}

function openTrainingDetails(id) {
    const training = officeHeadTrainings.find(item => item.id === id);
    const body = document.getElementById('modalJoinedViewBody');
    if (!training || !body) return;
    const status = getTrainingStatus(training);
    const proofs = Array.isArray(training.sourceProofs) ? training.sourceProofs : [];
    const proofBreakdown = proofs.length ? getProofTypeBreakdown(proofs) : 'No files';
    const proofText = proofs.length
        ? proofs.map(file => `${file} (${getProofType(file)})`).join(', ')
        : 'No certificate files yet.';
    body.innerHTML = `
        <div class="training-field-grid">
            <p><strong>Training/Event:</strong> ${escapeHtml(training.name)}</p>
            <p><strong>Venue:</strong> ${escapeHtml(training.venue || 'TBA')}</p>
            <p><strong>Start Date:</strong> ${escapeHtml(formatDate(getTrainingStartDate(training)))}</p>
            <p><strong>End Date:</strong> ${escapeHtml(formatDate(getTrainingEndDate(training)))}</p>
            <p><strong>Nature:</strong> ${escapeHtml(training.nature || 'N/A')}</p>
            <p><strong>Scope:</strong> ${escapeHtml(training.scope || 'N/A')}</p>
            <p><strong>Category:</strong> ${escapeHtml(training.category || 'Other')}</p>
            <p><strong>Record Type:</strong> ${escapeHtml(training.recordType || 'Attended')}</p>
            <p><strong>Roles:</strong> ${escapeHtml((training.roles || []).join(', ') || 'Participant')}</p>
            <p><strong>Status:</strong> ${escapeHtml(status)}</p>
            <p><strong>Description:</strong> ${escapeHtml(training.description || 'N/A')}</p>
<p><strong>Certificate Summary:</strong> ${proofs.length} ${proofs.length === 1 ? 'file' : 'files'} - ${escapeHtml(proofBreakdown)}</p>
                    <p><strong>Certificate Files:</strong> ${escapeHtml(proofText)}</p>
        </div>
    `;
    openModal('modalJoinedView');
}

// Get role color
function getRoleColor(role) {
    const colors = {
        'Participant': '#3b82f6',
        'Facilitator': '#10b981',
        'Organizer': '#f59e0b',
        'Speaker': '#8b5cf6',
        'Host/Emcee': '#f97316',
        'Documenter': '#a855f7'
    };
    return colors[role] || '#64748b';
}

// Filter trainings
function filterTrainings() {
    renderTrainings();
}

// Get filtered trainings
function getFilteredTrainings() {
    const roleFilter = document.getElementById('filterJoinedRole')?.value || 'ALL';
    const categoryFilter = document.getElementById('filterJoinedCategory')?.value || 'ALL';
    const natureFilter = document.getElementById('filterJoinedNature')?.value || 'ALL';
    const recordTypeFilter = document.getElementById('filterJoinedRecordType')?.value || 'ALL';

    return officeHeadTrainings.filter(training => {
        let matches = true;

        if (roleFilter !== 'ALL' && !(training.roles || []).includes(roleFilter)) {
            matches = false;
        }

        if (categoryFilter !== 'ALL' && training.category !== categoryFilter) {
            matches = false;
        }

        if (natureFilter !== 'ALL' && training.nature !== natureFilter) {
            matches = false;
        }

        if (recordTypeFilter !== 'ALL' && (training.recordType || 'Attended') !== recordTypeFilter) {
            matches = false;
        }

        return matches;
    });
}

// Open add training modal
function openAddTrainingModal() {
    currentEditingId = null;
    document.getElementById('trainingModalTitle').textContent = 'Add New Training';
    document.getElementById('trainingForm').reset();
    document.querySelectorAll('input[name="roles"]').forEach(checkbox => checkbox.checked = false);
    openModal('addTrainingModal');
}

// Edit training
function editTraining(id) {
    const training = officeHeadTrainings.find(t => t.id === id);
    if (!training) return;
    
    currentEditingId = id;
    
    // Populate form
    document.getElementById('trainingModalTitle').textContent = 'Edit Training';
    document.getElementById('trainingName').value = training.name;
    document.getElementById('trainingVenue').value = training.venue;
    document.getElementById('trainingStartDate').value = getTrainingStartDate(training);
    document.getElementById('trainingEndDate').value = getTrainingEndDate(training);
    document.getElementById('trainingNature').value = training.nature;
    document.getElementById('trainingScope').value = training.scope;
    document.getElementById('trainingCategory').value = training.category;
    document.getElementById('trainingRecordType').value = training.recordType || 'Attended';
    document.getElementById('trainingDescription').value = training.description || '';
    
    // Set role checkboxes
    document.querySelectorAll('input[name="roles"]').forEach(checkbox => {
        checkbox.checked = (training.roles || []).includes(checkbox.value);
    });
    
    openModal('addTrainingModal');
}

// Confirm delete
function confirmDelete(id) {
    currentEditingId = id;
    openModal('deleteConfirmModal');
}

// Delete training
function deleteTraining() {
    officeHeadTrainings = officeHeadTrainings.filter(t => t.id !== currentEditingId);
    saveTrainings();
    renderTrainings();
    closeModal('deleteConfirmModal');
    currentEditingId = null;
}

// Save trainings to localStorage
function saveTrainings() {
    localStorage.setItem(OFFICE_HEAD_STORAGE_KEY, JSON.stringify(officeHeadTrainings));
}

// Generate unique ID
function generateId() {
    return 'tr-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
}

// Attach form handlers
function attachFormHandlers() {
    const form = document.getElementById('trainingForm');
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }
    
    const deleteBtn = document.getElementById('confirmDeleteBtn');
    if (deleteBtn) {
        deleteBtn.addEventListener('click', deleteTraining);
    }
}

// Handle form submission
function handleFormSubmit(e) {
    e.preventDefault();
    
    // Get form data
    const name = document.getElementById('trainingName').value.trim();
    const venue = document.getElementById('trainingVenue').value.trim();
    const startDate = document.getElementById('trainingStartDate').value;
    const endDate = document.getElementById('trainingEndDate').value;
    const nature = document.getElementById('trainingNature').value;
    const scope = document.getElementById('trainingScope').value;
    const category = document.getElementById('trainingCategory').value;
    const recordType = document.getElementById('trainingRecordType').value || 'Attended';
    const description = document.getElementById('trainingDescription').value.trim();
    
    // Get selected roles
    const roles = [];
    document.querySelectorAll('input[name="roles"]:checked').forEach(checkbox => {
        roles.push(checkbox.value);
    });
    const requiredSkills = [];
    document.querySelectorAll('input[name="requiredSkills"]:checked').forEach(checkbox => {
        requiredSkills.push(checkbox.value);
    });
    
    // Validation
    if (!name || !venue || !startDate || !endDate || !nature || !scope || !category || roles.length === 0) {
        alert('Please fill in all required fields and select at least one role.');
        return;
    }
    if (new Date(endDate) < new Date(startDate)) {
        alert('End date cannot be earlier than start date.');
        return;
    }
    
    if (currentEditingId) {
        // Update existing training
        const training = officeHeadTrainings.find(t => t.id === currentEditingId);
        if (training) {
            training.name = name;
            training.venue = venue;
            training.startDate = startDate;
            training.endDate = endDate;
            training.nature = nature;
            training.scope = scope;
            training.category = category;
            training.recordType = recordType;
            training.description = description;
            training.roles = roles;
            training.requiredSkills = requiredSkills;
        }
        currentEditingId = null;
        document.getElementById('trainingModalTitle').textContent = 'Add New Training';
    } else {
        // Add new training
        officeHeadTrainings.push({
            id: generateId(),
            name,
            venue,
            startDate,
            endDate,
            nature,
            scope,
            category,
            recordType,
            roles,
            requiredSkills,
            description,
            createdDate: new Date().toISOString()
        });
    }
    
    saveTrainings();
    renderTrainings();
    closeModal('addTrainingModal');
    document.getElementById('trainingForm').reset();
}

// Export to Excel (ISCMS letterhead .xls)
async function exportTrainingsCSV() {
    const filteredTrainings = getFilteredTrainings();
    
    if (filteredTrainings.length === 0) {
        alert('No trainings to export');
        return;
    }
    
    const headers = ['Training Name', 'Start Date', 'End Date', 'Venue', 'Category', 'Nature', 'Scope', 'Roles', 'Status', 'Description'];
    
    const dataRows = filteredTrainings.map(t => [
        t.name,
        formatDate(getTrainingStartDate(t)),
        formatDate(getTrainingEndDate(t)),
        t.venue,
        t.category,
        t.nature,
        t.scope,
        t.roles.join('; '),
        getTrainingStatus(t),
        t.description || ''
    ]);
    
    const inner = IscmsExcelExport.tableFromMatrix(headers, dataRows);
    await IscmsExcelExport.downloadExcelWithHeader(
        `office-head-trainings-${new Date().toISOString().split('T')[0]}`,
        'Office head trainings',
        inner
    );
}

// Print trainings
function printTrainings() {
    const filteredTrainings = getFilteredTrainings();
    
    if (filteredTrainings.length === 0) {
        alert('No trainings to print');
        return;
    }
    
    const printWindow = window.open('', '', 'height=600,width=800');
    
    let html = `
        <html>
        <head>
            <title>My Trainings</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                h1 { color: #1B2559; }
                table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
                th { background-color: #1A237E; color: white; font-weight: bold; }
                tr:nth-child(even) { background-color: #f4f7fe; }
                .role { display: inline-block; margin: 2px; padding: 4px 8px; border-radius: 4px; font-size: 0.8rem; }
            </style>
        </head>
        <body>
            <h1>My Trainings Report</h1>
            <p>Generated: ${new Date().toLocaleDateString('en-US')}</p>
            <table>
                <thead>
                    <tr>
                        <th>Training Name</th>
                        <th>Start Date</th>
                        <th>End Date</th>
                        <th>Venue</th>
                        <th>Category</th>
                        <th>Nature</th>
                        <th>Scope</th>
                        <th>Roles</th>
                        <th>Status</th>
                        <th>Description</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    filteredTrainings.forEach(t => {
        const rolesHtml = t.roles.map(r => `<span class="role">${r}</span>`).join('');
        
        html += `
            <tr>
                <td>${t.name}</td>
                <td>${formatDate(getTrainingStartDate(t))}</td>
                <td>${formatDate(getTrainingEndDate(t))}</td>
                <td>${t.venue}</td>
                <td>${t.category}</td>
                <td>${t.nature}</td>
                <td>${t.scope}</td>
                <td>${rolesHtml}</td>
                <td>${getTrainingStatus(t)}</td>
                <td>${t.description || ''}</td>
            </tr>
        `;
    });
    
    html += `
                </tbody>
            </table>
        </body>
        </html>
    `;
    
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.print();
}

// Setup tab navigation
function setupTabNavigation() {
    const tabs = document.querySelectorAll('.oh-mt-tab');
    const panels = document.querySelectorAll('.oh-mt-panel');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs and panels
            tabs.forEach(t => t.classList.remove('active'));
            panels.forEach(p => p.style.display = 'none');
            
            // Add active class to clicked tab
            tab.classList.add('active');
            
            // Show corresponding panel
            const panelName = tab.dataset.tab;
            const panel = document.querySelector(`.oh-mt-panel[data-panel="${panelName}"]`);
            if (panel) {
                panel.style.display = 'block';
            }
        });
    });
}

// Modal functions
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'flex';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
    }
}

function getTrainingStartDate(training) {
    return training.startDate || training.date || '';
}

function getTrainingEndDate(training) {
    return training.endDate || training.startDate || training.date || '';
}

function formatDate(dateValue) {
    if (!dateValue) return 'N/A';
    const date = new Date(dateValue);
    if (Number.isNaN(date.getTime())) return 'N/A';
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function formatDateRange(training) {
    const startDate = getTrainingStartDate(training);
    const endDate = getTrainingEndDate(training);
    const startLabel = formatDate(startDate);
    const endLabel = formatDate(endDate);
    return startLabel === endLabel ? startLabel : `${startLabel} - ${endLabel}`;
}

function getTrainingStatus(training) {
    const startDateValue = getTrainingStartDate(training);
    const endDateValue = getTrainingEndDate(training);
    if (!startDateValue || !endDateValue) return 'Upcoming';

    const today = new Date();
    const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const startDate = new Date(startDateValue);
    const endDate = new Date(endDateValue);
    const startOnly = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
    const endOnly = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());

    if (todayOnly < startOnly) return 'Upcoming';
    if (todayOnly > endOnly) return 'Completed';
    return 'Ongoing';
}

function getStatusClass(status) {
    if (status === 'Completed') return 'status-completed';
    if (status === 'Ongoing') return 'status-ongoing';
    return 'status-upcoming';
}

// Click outside modal to close
document.addEventListener('click', function(event) {
    const modals = document.querySelectorAll('.modal-overlay');
    modals.forEach(modal => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
});

// Hook up export and print buttons
function setupExportButtons() {
    const printBtn = document.getElementById('btnPrintJoined');
    const exportBtn = document.getElementById('btnExportJoined');
    
    if (printBtn) printBtn.addEventListener('click', printTrainings);
    if (exportBtn) exportBtn.addEventListener('click', exportTrainingsCSV);
}

function setupJoinedDetailsModal() {
    const closeIds = ['modalJoinedViewClose', 'modalJoinedViewClose2'];
    closeIds.forEach(id => {
        const btn = document.getElementById(id);
        if (btn) btn.addEventListener('click', () => closeModal('modalJoinedView'));
    });
}

function setupProofUploadModal() {
    const closeIds = ['modalUploadProofClose', 'modalUploadProofClose2'];
    closeIds.forEach(id => {
        const btn = document.getElementById(id);
        if (btn) btn.addEventListener('click', () => closeModal('modalUploadProof'));
    });
    const submit = document.getElementById('modalUploadProofSubmit');
    if (submit) submit.addEventListener('click', submitProofUpload);
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('officeStaffAssignmentForm')?.addEventListener('submit', saveOfficeStaffAssignment);
});

window.markAssignedComplete = markAssignedComplete;
window.cancelAssigned = cancelAssigned;
window.openProofUpload = openProofUpload;
window.editUploadedProofFile = editUploadedProofFile;
window.removeUploadedProofFile = removeUploadedProofFile;

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    initOfficeHeadTrainings();
    setupExportButtons();
});
