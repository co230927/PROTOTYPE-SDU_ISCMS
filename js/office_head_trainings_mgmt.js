// --- OFFICE HEAD TRAININGS MANAGEMENT LOGIC ---

let officeHeadTrainings = [];
let currentEditingId = null;

// Initialize Trainings Management
function initOfficeHeadTrainings() {
    loadTrainings();
    populateCategoryDropdown();
    renderTrainings();
    attachFormHandlers();
    setupTabNavigation();
}

// Load trainings from localStorage
function loadTrainings() {
    const stored = localStorage.getItem('officeHeadTrainings');
    officeHeadTrainings = stored ? JSON.parse(stored) : generateSampleTrainings();
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
            name: 'Leadership for Multi-Center Teams',
            venue: 'ADZU Main Campus',
            startDate: '2026-04-14',
            endDate: '2026-04-15',
            nature: 'Internal',
            scope: 'Local',
            category: 'Leadership & Governance',
            roles: ['Participant', 'Facilitator'],
            description: 'Coordinating priorities across satellite offices without duplicating workloads.',
            createdDate: new Date().toISOString()
        },
        {
            id: 'tr-003',
            name: 'Program Evaluation in Practice',
            venue: 'ALTEC Collaborative Studio',
            startDate: '2026-04-20',
            endDate: '2026-04-22',
            nature: 'Internal',
            scope: 'Regional',
            category: 'Project Management',
            roles: ['Organizer'],
            description: 'Logic models, indicators, and light-touch reporting for ongoing programs.',
            createdDate: new Date().toISOString()
        }
    ];
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

function getAvailableCategories() {
    const fromSeed = (typeof TRAINING_EVENTS_SEED !== 'undefined' && Array.isArray(TRAINING_EVENTS_SEED))
        ? TRAINING_EVENTS_SEED.map(item => item.category).filter(Boolean)
        : [];
    const fromTrainings = officeHeadTrainings.map(item => item.category).filter(Boolean);
    const merged = Array.from(new Set([...fromSeed, ...fromTrainings]));
    return merged.sort((a, b) => a.localeCompare(b));
}

// Render all trainings
function renderTrainings() {
    const filteredTrainings = getFilteredTrainings();
    const container = document.getElementById('trainingsContainer');
    
    if (!container) return;
    
    document.getElementById('joinedFilterCount').textContent = `${filteredTrainings.length} training(s)`;
    
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
    
    const schedule = formatDateRange(training);
    const status = getTrainingStatus(training);
    
    return `
        <div class="training-row">
            <div class="training-info">
                <div class="training-field">
                    <div class="training-field-label">Training Name</div>
                    <div class="training-field-value">${training.name}</div>
                </div>
                <div class="training-field">
                    <div class="training-field-label">Schedule</div>
                    <div class="training-field-value">${schedule}</div>
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
                    <div class="status-badge ${getStatusClass(status)}">${status}</div>
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
    const roleFilter = document.getElementById('filterJoinedRole')?.value || 'ALL';
    const categoryFilter = document.getElementById('filterJoinedCategory')?.value || 'ALL';
    const natureFilter = document.getElementById('filterJoinedNature')?.value || 'ALL';
    
    return officeHeadTrainings.filter(training => {
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
    localStorage.setItem('officeHeadTrainings', JSON.stringify(officeHeadTrainings));
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
        const training = officeHeadTrainings.find(t => t.id === currentEditingId);
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
            roles,
            description,
            createdDate: new Date().toISOString()
        });
    }
    
    saveTrainings();
    renderTrainings();
    closeModal('addTrainingModal');
    document.getElementById('trainingForm').reset();
}

// Export to CSV
function exportTrainingsCSV() {
    const filteredTrainings = getFilteredTrainings();
    
    if (filteredTrainings.length === 0) {
        alert('No trainings to export');
        return;
    }
    
    // Prepare CSV header
    const headers = ['Training Name', 'Start Date', 'End Date', 'Venue', 'Category', 'Nature', 'Scope', 'Roles', 'Status', 'Description'];
    
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
        getTrainingStatus(t),
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
    a.download = `office-head-trainings-${new Date().toISOString().split('T')[0]}.csv`;
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

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    initOfficeHeadTrainings();
    setupExportButtons();
});
