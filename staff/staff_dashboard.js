// --- STAFF DASHBOARD LOGIC ---

let currentStaffUser = {
    name: 'Carlos Miguel V. Tingson',
    office: 'ACCA',
    role: 'Participant'
};

let staffRoleEvents = {
    'Participant': [],
    'Facilitator': [],
    'Organizer': [],
    'Speaker': []
};

let currentTimeFilter = 'FULL';

// Initialize Dashboard
function initStaffDashboard() {
    document.getElementById('staffName').textContent = currentStaffUser.name;
    
    // Populate staff role events from seed data
    populateRoleEvents();
    
    // Populate category options
    populateCategoryFilters();
    
    // Update counts and display
    updateRoleCounts();
    updateTrainingStatusCounts();
    updateTrainingBreakdown();
    updateNeedsAttention();
    updateCategoryCoverage();
}

// Populate role events from training seed data
function populateRoleEvents() {
    // Filter events where current staff is assigned
    const staffName = currentStaffUser.name;
    
    TRAINING_EVENTS_SEED.forEach(event => {
        const assignment = event.assignedPersons.find(p => p.name === staffName);
        if (assignment) {
            staffRoleEvents[assignment.role].push({
                ...event,
                userRole: assignment.role,
                userStatus: assignment.status
            });
        }
    });
}

// Update role card counts
function updateRoleCounts() {
    document.getElementById('countParticipant').textContent = staffRoleEvents['Participant'].length;
    document.getElementById('countFacilitator').textContent = staffRoleEvents['Facilitator'].length;
    document.getElementById('countOrganizer').textContent = staffRoleEvents['Organizer'].length;
    document.getElementById('countSpeaker').textContent = staffRoleEvents['Speaker'].length;
}

// Update dashboard cards for upcoming/incoming/completed trainings
function updateTrainingStatusCounts() {
    const allEvents = getAllAssignedEvents();
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    let upcoming = 0;
    let incoming = 0;
    let completed = 0;

    allEvents.forEach(event => {
        const eventDate = new Date(event.deadline);
        eventDate.setHours(0, 0, 0, 0);
        const dayDiff = Math.ceil((eventDate - now) / (1000 * 60 * 60 * 24));
        const status = (event.userStatus || '').toLowerCase();

        if (status === 'completed') {
            completed++;
            return;
        }

        if (dayDiff >= 0 && dayDiff <= 7) {
            incoming++;
        } else if (dayDiff > 7) {
            upcoming++;
        }
    });

    const upcomingEl = document.getElementById('countUpcomingTrainings');
    const incomingEl = document.getElementById('countIncomingTrainings');
    const completedEl = document.getElementById('countCompletedTrainings');

    if (upcomingEl) upcomingEl.textContent = upcoming;
    if (incomingEl) incomingEl.textContent = incoming;
    if (completedEl) completedEl.textContent = completed;
}

function getAllAssignedEvents() {
    const allEvents = [];
    Object.keys(staffRoleEvents).forEach(role => {
        staffRoleEvents[role].forEach(event => {
            allEvents.push({ ...event, role });
        });
    });
    return allEvents;
}

// Show events for a specific role
function showRoleEvents(role) {
    const events = staffRoleEvents[role];
    document.getElementById('roleEventsTitle').textContent = `${role} Events`;
    
    const tbody = document.getElementById('roleEventsTableBody');
    tbody.innerHTML = '';
    
    if (events.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4" style="text-align: center; padding: 20px;">No events found for this role</td></tr>`;
    } else {
        events.forEach(event => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><strong>${event.trainingName}</strong><br><small>${event.category}</small></td>
                <td>${event.venue || 'TBA'}</td>
                <td>${formatDate(event.deadline)}</td>
                <td>
                    <button class="btn-viewmore" onclick="goToTrainingDetails('${event.id}')" style="padding: 6px 12px; font-size: 0.85rem;">View More</button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }
    
    openModal('roleEventsModal');
}

// Go to training details page
function goToTrainingDetails(trainingId) {
    // Redirect to My Trainings page (to be created)
    window.location.href = 'staff_trainings.html?id=' + trainingId;
}

// Populate category filter options
function populateCategoryFilters() {
    const categoryFilter = document.getElementById('breakdownCategoryFilter');
    
    trainingCategories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });
}

// Update training breakdown chart
function updateTrainingBreakdown() {
    const selectedCategory = document.getElementById('breakdownCategoryFilter').value;
    const selectedPeriod = document.getElementById('breakdownPeriodFilter').value;
    
    // Calculate role breakdown for the current staff member
    const roleBreakdown = calculateStaffRoleBreakdown(selectedCategory, selectedPeriod);
    
    // Draw stacked bar chart
    drawRoleBreakdownBar(roleBreakdown);
}

// Calculate role breakdown for staff
function calculateStaffRoleBreakdown(category, period) {
    let participant = 0, facilitator = 0, organizer = 0, speaker = 0;
    
    // Get all events assigned to staff
    const allEvents = getAllAssignedEvents();
    
    // Filter by category and period
    allEvents.forEach(event => {
        let includeEvent = true;
        
        // Category filter
        if (category !== 'ALL' && event.category !== category) {
            includeEvent = false;
        }
        
        // Period filter
        if (period !== 'FULL') {
            const eventDate = new Date(event.deadline);
            const month = eventDate.getMonth();
            
            if (period === 'H1' && month >= 6) includeEvent = false;
            if (period === 'H2' && month < 6) includeEvent = false;
            if (period === 'SEM1' && (month < 7 || month >= 12)) includeEvent = false;
            if (period === 'SEM2' && (month < 0 || month >= 5)) includeEvent = false;
        }
        
        if (includeEvent) {
            switch (event.role) {
                case 'Participant': participant++; break;
                case 'Facilitator': facilitator++; break;
                case 'Organizer': organizer++; break;
                case 'Speaker': speaker++; break;
            }
        }
    });
    
    const total = participant + facilitator + organizer + speaker;
    
    return {
        participant: total > 0 ? (participant / total) * 100 : 0,
        facilitator: total > 0 ? (facilitator / total) * 100 : 0,
        organizer: total > 0 ? (organizer / total) * 100 : 0,
        speaker: total > 0 ? (speaker / total) * 100 : 0,
        counts: { participant, facilitator, organizer, speaker }
    };
}

// Draw role breakdown bar chart
function drawRoleBreakdownBar(breakdown) {
    const bar = document.getElementById('breakdownBar');
    bar.innerHTML = '';
    
    const roles = [
        { name: 'Participant', class: 'bg-participant', percent: breakdown.participant },
        { name: 'Facilitator', class: 'bg-facilitator', percent: breakdown.facilitator },
        { name: 'Organizer', class: 'bg-organizer', percent: breakdown.organizer },
        { name: 'Speaker', class: 'bg-speaker', percent: breakdown.speaker }
    ];
    
    roles.forEach(role => {
        if (role.percent > 0) {
            const segment = document.createElement('div');
            segment.className = `bar-segment ${role.class}`;
            segment.style.width = role.percent + '%';
            segment.title = `${role.name}: ${role.percent.toFixed(1)}%`;
            bar.appendChild(segment);
        }
    });
    
    // Update legend
    updateRoleBreakdownLegend(breakdown.counts);
}

// Update role breakdown legend
function updateRoleBreakdownLegend(counts) {
    const legend = document.getElementById('breakdownLegend');
    legend.innerHTML = '';
    
    const total = counts.participant + counts.facilitator + counts.organizer + counts.speaker;
    
    const roles = [
        { name: 'Participant', class: 'bg-participant', count: counts.participant },
        { name: 'Facilitator', class: 'bg-facilitator', count: counts.facilitator },
        { name: 'Organizer', class: 'bg-organizer', count: counts.organizer },
        { name: 'Speaker', class: 'bg-speaker', count: counts.speaker }
    ];
    
    roles.forEach(role => {
        const span = document.createElement('span');
        span.innerHTML = `<div class="legend-dot ${role.class}"></div>${role.name}: ${role.count}`;
        legend.appendChild(span);
    });
}

// Update needs attention section
function updateNeedsAttention() {
    const container = document.getElementById('needsAttentionList');
    container.innerHTML = '';
    
    const alerts = [];
    
    // Check for upcoming trainings
    const upcomingEvents = [];
    Object.keys(staffRoleEvents).forEach(role => {
        staffRoleEvents[role].forEach(event => {
            const eventDate = new Date(event.deadline);
            const daysUntil = Math.ceil((eventDate - new Date()) / (1000 * 60 * 60 * 24));
            if (daysUntil > 0 && daysUntil <= 14) {
                upcomingEvents.push({ event, daysUntil, role });
            }
        });
    });
    
    // Add alerts for upcoming events
    upcomingEvents.forEach(item => {
        const alert = document.createElement('div');
        alert.className = 'alert-item alert-warning';
        alert.innerHTML = `
            <strong>Upcoming Training (${item.daysUntil} days)</strong>
            ${item.event.trainingName} as ${item.role}
        `;
        alerts.push(alert);
    });
    
    // Add alerts for incomplete categories
    const categories = getStaffCategoryStatus();
    Object.keys(categories).forEach(cat => {
        if (categories[cat] === 0) {
            const alert = document.createElement('div');
            alert.className = 'alert-item alert-info';
            alert.innerHTML = `<strong>Category Gap</strong>No trainings in ${cat}`;
            alerts.push(alert);
        }
    });
    
    if (alerts.length === 0) {
        container.innerHTML = '<div class="alert-item alert-info"><strong>All clear!</strong> No pending items.</div>';
    } else {
        alerts.slice(0, 5).forEach(alert => container.appendChild(alert));
    }
}

// Get staff category status
function getStaffCategoryStatus() {
    const categories = {};
    trainingCategories.forEach(cat => categories[cat] = 0);
    
    Object.keys(staffRoleEvents).forEach(role => {
        staffRoleEvents[role].forEach(event => {
            if (categories.hasOwnProperty(event.category)) {
                categories[event.category]++;
            }
        });
    });
    
    return categories;
}

// Update category coverage section
function updateCategoryCoverage() {
    const container = document.getElementById('categoryCoverageList');
    container.innerHTML = '';
    
    const categories = getStaffCategoryStatus();
    
    trainingCategories.forEach(category => {
        const count = categories[category] || 0;
        const alert = document.createElement('div');
        alert.className = `alert-item ${count > 0 ? 'alert-info' : 'alert-warning'}`;
        alert.innerHTML = `
            <strong>${category}</strong>
            ${count > 0 ? `${count} training(s)` : 'No trainings yet'}
        `;
        container.appendChild(alert);
    });
}

// Apply global time filter
function applyGlobalFilter() {
    currentTimeFilter = document.getElementById('globalTimeFilter').value;
    updateTrainingBreakdown();
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

// Utility: Format date
function formatDate(dateStr) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateStr).toLocaleDateString('en-US', options);
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
document.addEventListener('DOMContentLoaded', initStaffDashboard);
