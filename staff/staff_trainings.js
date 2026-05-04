// --- STAFF TRAININGS MANAGEMENT LOGIC ---

let staffTrainings = [];
let currentEditingId = null;
let assignedPendingTrainings = [];
let assignedCompletedTrainings = [];
let uploadedProofs = [];
let currentProofTargetId = null;
const STAFF_FULL_NAME = 'Carlos Miguel V. Tingson';
const ASSIGNED_STATUS_KEY = 'staffAssignedStatusMap';

// Initialize Trainings Page
function initStaffTrainings() {
    loadTrainings();
    populateCategoryDropdown();
    renderTrainings();
    initializeAssignedTrainings();
    renderAssignedTrainings();
    renderUploadedFiles();
    setupTabNavigation();
    attachFormHandlers();
}

// Load trainings from localStorage
function loadTrainings() {
    const stored = localStorage.getItem('staffTrainings');
    staffTrainings = stored ? JSON.parse(stored) : generateSampleTrainings();
    uploadedProofs = JSON.parse(localStorage.getItem('staffUploadedProofs') || '[]');
}

// Generate sample trainings data
function generateSampleTrainings() {
    return [
        {
            id: 'tr-001',
            name: 'Community Organizing Foundations',
            venue: 'Community Learning Center',
            startDate: '2026-03-28',
            endDate: '2026-03-30',
            nature: 'Internal',
            scope: 'Local',
            category: 'Community Organizing',
            roles: ['Participant'],
            description: 'Entry-level organizing cycle covering listen, prioritize, mobilize, and evaluate.',
            createdDate: new Date().toISOString()
        },
        {
            id: 'tr-002',
            name: 'Project Monitoring Essentials',
            venue: 'ADZU Main Campus',
            startDate: '2026-04-21',
            endDate: '2026-04-22',
            nature: 'Internal',
            scope: 'Regional',
            category: 'Project Management',
            roles: ['Participant'],
            description: 'Learning logic models, indicators, and light-touch reporting.',
            createdDate: new Date().toISOString()
        },
        {
            id: 'tr-003',
            name: 'Digital Records and Responsible Systems',
            venue: 'Virtual Learning Hub',
            startDate: '2026-05-27',
            endDate: '2026-05-28',
            nature: 'Internal',
            scope: 'Regional',
            category: 'Data & Digital Literacy',
            roles: ['Facilitator', 'Speaker'],
            description: 'Data handling, archiving, and privacy-aware documentation for SDU units.',
            createdDate: new Date().toISOString()
        }
    ];
}

// Populate category dropdown
function populateCategoryDropdown() {
    const categorySelects = document.querySelectorAll('#trainingCategory, #filterCategory');
    const categories = getAvailableCategories();
    
    categorySelects.forEach(select => {
        categories.forEach(category => {
            if (!category) return;
            
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            
            select.appendChild(option);
        });
    });
}

function getAvailableCategories() {
    const fromSeed = (typeof TRAINING_EVENTS_SEED !== 'undefined' && Array.isArray(TRAINING_EVENTS_SEED))
        ? TRAINING_EVENTS_SEED.map(item => item.category).filter(Boolean)
        : [];
    const fromTrainings = staffTrainings.map(item => item.category).filter(Boolean);

    const merged = Array.from(new Set([...fromSeed, ...fromTrainings]));
    if (merged.length) return merged.sort((a, b) => a.localeCompare(b));

    return [
        'Community Organizing',
        'Data & Digital Literacy',
        'Environmental Stewardship',
        'Leadership & Governance',
        'Peace Education & Advocacy',
        'Project Management'
    ];
}

// Render all trainings
function renderTrainings() {
    const filteredTrainings = getFilteredTrainings();
    const container = document.getElementById('trainingsContainer');
    
    document.getElementById('trainingCount').textContent = `${filteredTrainings.length} training(s)`;
    
    if (filteredTrainings.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <h3>No trainings yet</h3>
                <p>Add your first training record by clicking the button above.</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = filteredTrainings.map(training => createTrainingCard(training)).join('');
}

// Create training card HTML
function createTrainingCard(training) {
    const rolesHtml = training.roles.map(role => 
        `<span class="training-field-badge" style="background: ${getRoleColor(role)}20; color: ${getRoleColor(role)};">${role}</span>`
    ).join('');
    
    const dateRange = formatDateRange(training);
    const status = getTrainingStatus(training);
    const statusClass = getStatusClass(status);
    
    return `
        <div class="training-row">
            <div class="training-info">
                <div class="training-field">
                    <div class="training-field-label">Training Name</div>
                    <div class="training-field-value">${training.name}</div>
                </div>
                <div class="training-field">
                    <div class="training-field-label">Schedule</div>
                    <div class="training-field-value">${dateRange}</div>
                </div>
                <div class="training-field">
                    <div class="training-field-label">Venue</div>
                    <div class="training-field-value">${training.venue}</div>
                </div>
                <div class="training-field">
                    <div class="training-field-label">Category</div>
                    <div class="training-field-value">${training.category}</div>
                </div>
                <div class="training-field">
                    <div class="training-field-label">Nature</div>
                    <div class="training-field-badge">${training.nature}</div>
                </div>
                <div class="training-field">
                    <div class="training-field-label">Scope</div>
                    <div class="training-field-badge">${training.scope}</div>
                </div>
                <div class="training-field">
                    <div class="training-field-label">Roles</div>
                    <div style="display: flex; flex-wrap: wrap; gap: 6px;">${rolesHtml}</div>
                </div>
                <div class="training-field">
                    <div class="training-field-label">Description</div>
                    <div class="training-field-value">${training.description || 'N/A'}</div>
                </div>
                <div class="training-field">
                    <div class="training-field-label">Status</div>
                    <div class="status-badge ${statusClass}">${status}</div>
                </div>
            </div>
            <div class="training-actions">
                <button class="btn-edit-training" onclick="editTraining('${training.id}')">Edit</button>
                <button class="btn-delete-training" onclick="confirmDelete('${training.id}')">Delete</button>
            </div>
        </div>
    `;
}

// Get role color
function getRoleColor(role) {
    const colors = {
        'Participant': '#3b82f6',
        'Facilitator': '#10b981',
        'Organizer': '#f59e0b',
        'Speaker': '#8b5cf6'
    };
    return colors[role] || '#64748b';
}

// Filter trainings
function filterTrainings() {
    renderTrainings();
}

// Get filtered trainings
function getFilteredTrainings() {
    const roleFilter = document.getElementById('filterRole').value;
    const categoryFilter = document.getElementById('filterCategory').value;
    const natureFilter = document.getElementById('filterNature').value;
    
    return staffTrainings.filter(training => {
        let matches = true;
        
        // Role filter - check if any selected role is in training roles
        if (roleFilter !== 'ALL' && !training.roles.includes(roleFilter)) {
            matches = false;
        }
        
        // Category filter
        if (categoryFilter !== 'ALL' && training.category !== categoryFilter) {
            matches = false;
        }
        
        // Nature filter
        if (natureFilter !== 'ALL' && training.nature !== natureFilter) {
            matches = false;
        }
        
        return matches;
    });
}

// Edit training
function editTraining(id) {
    const training = staffTrainings.find(t => t.id === id);
    if (!training) return;
    
    currentEditingId = id;
    
    // Populate form
    document.getElementById('modalTitle').textContent = 'Edit Training';
    document.getElementById('trainingName').value = training.name;
    document.getElementById('trainingVenue').value = training.venue;
    document.getElementById('trainingStartDate').value = getTrainingStartDate(training);
    document.getElementById('trainingEndDate').value = getTrainingEndDate(training);
    document.getElementById('trainingNature').value = training.nature;
    document.getElementById('trainingScope').value = training.scope;
    document.getElementById('trainingCategory').value = training.category;
    document.getElementById('trainingDescription').value = training.description || '';
    
    // Set role checkboxes
    document.querySelectorAll('input[name="roles"]').forEach(checkbox => {
        checkbox.checked = training.roles.includes(checkbox.value);
    });
    
    openModal('addTrainingModal');
}

// Confirm delete
function confirmDelete(id) {
    currentEditingId = id;
    const training = staffTrainings.find(t => t.id === id);
    
    if (training) {
        document.querySelector('.modal-header h3')?.remove();
        openModal('deleteConfirmModal');
    }
}

// Delete training
function deleteTraining() {
    staffTrainings = staffTrainings.filter(t => t.id !== currentEditingId);
    saveTrainings();
    renderTrainings();
    closeModal('deleteConfirmModal');
    currentEditingId = null;
}

// Save trainings to localStorage
function saveTrainings() {
    localStorage.setItem('staffTrainings', JSON.stringify(staffTrainings));
}

function saveProofs() {
    localStorage.setItem('staffUploadedProofs', JSON.stringify(uploadedProofs));
}

// Generate unique ID
function generateId() {
    return 'tr-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
}

// Attach form handlers
function attachFormHandlers() {
    const form = document.getElementById('trainingForm');
    form.addEventListener('submit', handleFormSubmit);
    
    document.getElementById('confirmDeleteBtn').addEventListener('click', deleteTraining);
}

function setupTabNavigation() {
    const tabs = document.querySelectorAll('.st-tab');
    const panels = document.querySelectorAll('.st-panel');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            panels.forEach(p => p.style.display = 'none');

            tab.classList.add('active');
            const target = tab.dataset.tab;
            const panel = document.querySelector(`.st-panel[data-panel="${target}"]`);
            if (panel) panel.style.display = 'block';
        });
    });
}

function initializeAssignedTrainings() {
    if (typeof TRAINING_EVENTS_SEED !== 'undefined' && Array.isArray(TRAINING_EVENTS_SEED)) {
        const mapped = [];
        TRAINING_EVENTS_SEED.forEach(event => {
            (event.assignedPersons || []).forEach((person, index) => {
                if (person.name !== STAFF_FULL_NAME) return;
                mapped.push({
                    id: `${event.id}-${index}`,
                    sourceEventId: event.id,
                    name: event.trainingName,
                    venue: event.venue || 'TBA',
                    category: event.category || 'Uncategorized',
                    role: person.role || 'Participant',
                    startDate: event.startDate || event.deadline || '',
                    endDate: event.endDate || event.deadline || '',
                    description: event.description || '',
                    status: person.status || 'pending'
                });
            });
        });

        const statusMap = JSON.parse(localStorage.getItem(ASSIGNED_STATUS_KEY) || '{}');
        mapped.forEach(item => {
            if (statusMap[item.id]) item.status = statusMap[item.id];
        });

        assignedPendingTrainings = mapped.filter(item => item.status === 'pending');
        assignedCompletedTrainings = mapped.filter(item => item.status === 'completed');
        return;
    }

    assignedPendingTrainings = [];
    assignedCompletedTrainings = [];
}

function renderAssignedTrainings() {
    const pendingBody = document.getElementById('assignedPendingBody');
    const completedBody = document.getElementById('assignedCompletedBody');
    if (!pendingBody || !completedBody) return;

    pendingBody.innerHTML = assignedPendingTrainings.length
        ? assignedPendingTrainings.map(item => `
            <tr>
                <td>${item.name}</td>
                <td>${item.venue}</td>
                <td>${item.category}</td>
                <td>${item.role}</td>
                <td>${formatDate(item.startDate)}</td>
                <td>${formatDate(item.endDate)}</td>
                <td>${item.description || 'N/A'}</td>
                <td><button class="btn-accept" onclick="markAssignedComplete('${item.id}')">Mark Complete</button></td>
            </tr>
        `).join('')
        : `<tr><td colspan="8" style="text-align:center;color:#64748b;">No pending assignments.</td></tr>`;

    completedBody.innerHTML = assignedCompletedTrainings.length
        ? assignedCompletedTrainings.map(item => `
            <tr>
                <td>${item.name}</td>
                <td>${item.venue}</td>
                <td>${item.category}</td>
                <td>${item.role}</td>
                <td>${formatDate(item.startDate)}</td>
                <td>${formatDate(item.endDate)}</td>
                <td>${item.description || 'N/A'}</td>
                <td><button class="btn-export" onclick="openProofUpload('${item.id}')">Upload Proof</button></td>
            </tr>
        `).join('')
        : `<tr><td colspan="8" style="text-align:center;color:#64748b;">No completed assignments yet.</td></tr>`;
}

function markAssignedComplete(id) {
    const index = assignedPendingTrainings.findIndex(item => item.id === id);
    if (index === -1) return;
    const [item] = assignedPendingTrainings.splice(index, 1);
    item.status = 'completed';
    assignedCompletedTrainings.push(item);
    persistAssignedStatus(item.id, 'completed');
    renderAssignedTrainings();
}

function persistAssignedStatus(id, status) {
    const statusMap = JSON.parse(localStorage.getItem(ASSIGNED_STATUS_KEY) || '{}');
    statusMap[id] = status;
    localStorage.setItem(ASSIGNED_STATUS_KEY, JSON.stringify(statusMap));
}

function openProofUpload(trainingId) {
    currentProofTargetId = trainingId;
    document.getElementById('proofFiles').value = '';
    document.getElementById('proofNote').value = '';
    openModal('uploadProofModal');
}

function submitProofUpload() {
    if (!currentProofTargetId) return;

    const filesInput = document.getElementById('proofFiles');
    const note = document.getElementById('proofNote').value.trim();
    const selectedFiles = Array.from(filesInput.files || []);

    if (!selectedFiles.length) {
        alert('Please select at least one file.');
        return;
    }

    const training = assignedCompletedTrainings.find(t => t.id === currentProofTargetId);
    if (!training) return;

    const uploadBundle = {
        id: `up-${Date.now()}`,
        trainingId: training.id,
        trainingName: training.name,
        dateUploaded: new Date().toISOString(),
        note,
        files: selectedFiles.map(file => ({ name: file.name, size: file.size }))
    };

    uploadedProofs.push(uploadBundle);
    saveProofs();
    renderUploadedFiles();
    closeModal('uploadProofModal');
}

function renderUploadedFiles() {
    const container = document.getElementById('uploadedFilesCards');
    if (!container) return;

    if (!uploadedProofs.length) {
        container.innerHTML = `<div class="empty-state"><h3>No uploaded proofs yet</h3><p>Upload proof of completion from the Assigned Trainings tab.</p></div>`;
        return;
    }

    container.innerHTML = `
        <ul class="st-proof-list">
            ${uploadedProofs.map(upload => `
                <li class="st-proof-item">
                    <h4>${upload.trainingName}</h4>
                    <p><strong>Uploaded:</strong> ${new Date(upload.dateUploaded).toLocaleString('en-US')}</p>
                    <p><strong>Files:</strong> ${upload.files.map(f => f.name).join(', ')}</p>
                    <p><strong>Note:</strong> ${upload.note || 'N/A'}</p>
                </li>
            `).join('')}
        </ul>
    `;
}

// Handle form submission
function handleFormSubmit(e) {
    e.preventDefault();
    const form = e.target;
    
    // Get form data
    const name = document.getElementById('trainingName').value.trim();
    const venue = document.getElementById('trainingVenue').value.trim();
    const startDate = document.getElementById('trainingStartDate').value;
    const endDate = document.getElementById('trainingEndDate').value;
    const nature = document.getElementById('trainingNature').value;
    const scope = document.getElementById('trainingScope').value;
    const category = document.getElementById('trainingCategory').value;
    const description = document.getElementById('trainingDescription').value.trim();
    
    // Get selected roles
    const roles = [];
    document.querySelectorAll('input[name="roles"]:checked').forEach(checkbox => {
        roles.push(checkbox.value);
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
        const training = staffTrainings.find(t => t.id === currentEditingId);
        if (training) {
            training.name = name;
            training.venue = venue;
            training.startDate = startDate;
            training.endDate = endDate;
            training.nature = nature;
            training.scope = scope;
            training.category = category;
            training.description = description;
            training.roles = roles;
        }
        currentEditingId = null;
        document.getElementById('modalTitle').textContent = 'Add New Training';
    } else {
        // Add new training
        staffTrainings.push({
            id: generateId(),
            name,
            venue,
            startDate,
            endDate,
            nature,
            scope,
            category,
            roles,
            description,
            createdDate: new Date().toISOString()
        });
    }
    
    saveTrainings();
    renderTrainings();
    closeModal('addTrainingModal');
    form.reset();
}

// Export to CSV
function exportTrainingsCSV() {
    const filteredTrainings = getFilteredTrainings();
    
    if (filteredTrainings.length === 0) {
        alert('No trainings to export');
        return;
    }
    
    // Prepare CSV header
    const headers = ['Training Name', 'Start Date', 'End Date', 'Venue', 'Category', 'Nature', 'Scope', 'Roles', 'Description'];
    
    // Prepare CSV rows
    const rows = filteredTrainings.map(t => [
        t.name,
        formatDate(getTrainingStartDate(t)),
        formatDate(getTrainingEndDate(t)),
        t.venue,
        t.category,
        t.nature,
        t.scope,
        t.roles.join('; '),
        t.description || ''
    ]);
    
    // Create CSV content
    const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(','))
    ].join('\n');
    
    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `my-trainings-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
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

// Initialize on page load
document.addEventListener('DOMContentLoaded', initStaffTrainings);
