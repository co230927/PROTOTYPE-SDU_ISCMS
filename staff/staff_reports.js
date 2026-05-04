// --- STAFF REPORTS LOGIC ---

let staffActionHistory = [];
let staffRecycleBin = [];
let currentStaffName = 'Carlos Miguel V. Tingson';

// Initialize Reports
function initStaffReports() {
    loadActionHistory();
    attachEventListeners();
    renderReportRows();
    updateRecycleBinCount();
}

// Load action history from localStorage
function loadActionHistory() {
    const stored = localStorage.getItem('staffActionHistory');
    staffActionHistory = stored ? JSON.parse(stored) : generateSampleActionHistory();
    
    const storedBin = localStorage.getItem('staffRecycleBin');
    staffRecycleBin = storedBin ? JSON.parse(storedBin) : [];
}

// Generate sample action history
function generateSampleActionHistory() {
    const now = new Date();
    return [
        {
            id: 'action-001',
            date: formatDateISO(new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000)),
            time: '09:30 AM',
            action: 'TRAINING_JOINED',
            details: 'Participated in Community Organizing Foundations',
            status: 'completed',
            timestamp: Date.now() - 1 * 24 * 60 * 60 * 1000
        },
        {
            id: 'action-002',
            date: formatDateISO(new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000)),
            time: '02:15 PM',
            action: 'PROOF_SUBMITTED',
            details: 'Submitted certificate for Leadership Training',
            status: 'pending',
            timestamp: Date.now() - 3 * 24 * 60 * 60 * 1000
        },
        {
            id: 'action-003',
            date: formatDateISO(new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000)),
            time: '11:45 AM',
            action: 'PROFILE_UPDATED',
            details: 'Updated contact information',
            status: 'completed',
            timestamp: Date.now() - 5 * 24 * 60 * 60 * 1000
        },
        {
            id: 'action-004',
            date: formatDateISO(new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)),
            time: '03:20 PM',
            action: 'TRAINING_COMPLETED',
            details: 'Completed Project Monitoring Essentials',
            status: 'completed',
            timestamp: Date.now() - 7 * 24 * 60 * 60 * 1000
        },
        {
            id: 'action-005',
            date: formatDateISO(new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000)),
            time: '10:00 AM',
            action: 'PROOF_SUBMITTED',
            details: 'Submitted attendance sheet for Digital Records Training',
            status: 'approved',
            timestamp: Date.now() - 10 * 24 * 60 * 60 * 1000
        }
    ];
}

// Render report rows based on filter
function renderReportRows() {
    const filterValue = document.getElementById('reportActionFilter').value;
    const tbody = document.getElementById('reportsTableBody');
    tbody.innerHTML = '';
    
    let filteredActions = staffActionHistory;
    
    if (filterValue !== 'ALL') {
        filteredActions = staffActionHistory.filter(action => action.action === filterValue);
    }
    
    // Sort by timestamp descending
    filteredActions.sort((a, b) => b.timestamp - a.timestamp);
    
    document.getElementById('reportsCount').textContent = `Total Actions: ${filteredActions.length}`;
    
    if (filteredActions.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; padding: 20px;">No actions found</td></tr>`;
        return;
    }
    
    filteredActions.forEach(action => {
        const row = document.createElement('tr');
        const actionLabel = getActionLabel(action.action);
        const statusBadge = getStatusBadge(action.status);
        
        row.innerHTML = `
            <td>${action.date}</td>
            <td>${action.time}</td>
            <td><span class="action-pill action-${getActionClass(action.action)}">${actionLabel}</span></td>
            <td>${action.details}</td>
            <td>${statusBadge}</td>
        `;
        
        tbody.appendChild(row);
    });
}

// Get action label
function getActionLabel(action) {
    const labels = {
        'TRAINING_JOINED': 'Training Participation',
        'PROOF_SUBMITTED': 'Proof Submitted',
        'PROFILE_UPDATED': 'Profile Updated',
        'TRAINING_COMPLETED': 'Training Completed'
    };
    return labels[action] || action;
}

// Get action CSS class
function getActionClass(action) {
    const classes = {
        'TRAINING_JOINED': 'training',
        'PROOF_SUBMITTED': 'proof',
        'PROFILE_UPDATED': 'participation',
        'TRAINING_COMPLETED': 'training'
    };
    return classes[action] || 'participation';
}

// Get status badge HTML
function getStatusBadge(status) {
    const badges = {
        'completed': '<span style="background: #d1fae5; color: #065f46; padding: 4px 8px; border-radius: 6px; font-size: 0.75rem; font-weight: bold;">Completed</span>',
        'pending': '<span style="background: #fef3c7; color: #92400e; padding: 4px 8px; border-radius: 6px; font-size: 0.75rem; font-weight: bold;">Pending</span>',
        'approved': '<span style="background: #d1fae5; color: #065f46; padding: 4px 8px; border-radius: 6px; font-size: 0.75rem; font-weight: bold;">Approved</span>',
        'rejected': '<span style="background: #fee2e2; color: #991b1b; padding: 4px 8px; border-radius: 6px; font-size: 0.75rem; font-weight: bold;">Rejected</span>'
    };
    return badges[status] || status;
}

// Open clear reports modal
function openClearReportsModal() {
    openModal('clearReportsModal');
}

// Attach event listeners for buttons
function attachEventListeners() {
    document.getElementById('btnOpenRecycleBinModal')?.addEventListener('click', () => openRecycleBin());
    document.getElementById('confirmClearBtn')?.addEventListener('click', () => clearAllReports());
    document.getElementById('btnRecycleRestoreChoice')?.addEventListener('click', () => openModal('recycleRestoreModal'));
    document.getElementById('btnRecycleDeleteAllChoice')?.addEventListener('click', () => openModal('recycleDeleteAllModal'));
    document.getElementById('confirmDeleteAllBtn')?.addEventListener('click', () => deleteAllRecycledItems());
}

// Clear all reports (move to recycle bin)
function clearAllReports() {
    const now = new Date();
    
    staffActionHistory.forEach(action => {
        staffRecycleBin.push({
            id: 'recycled-' + action.id,
            dateRemoved: formatDateISO(now),
            action: action.action,
            detail: action.details,
            originalDate: action.date,
            canRestore: true,
            expiresOn: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000) // 30 days
        });
    });
    
    staffActionHistory = [];
    saveData();
    renderReportRows();
    updateRecycleBinCount();
    closeModal('clearReportsModal');
    showRecycleToast('All reports moved to recycle bin');
}

// Open recycle bin modal
function openRecycleBin() {
    renderRecycleBin();
    openModal('recycleBinModal');
}

// Render recycle bin contents
function renderRecycleBin() {
    const filterValue = document.getElementById('recycleActionFilter').value;
    const tbody = document.getElementById('recycleTableBody');
    tbody.innerHTML = '';
    
    let filteredBin = staffRecycleBin;
    
    if (filterValue !== 'ALL') {
        filteredBin = staffRecycleBin.filter(item => item.action === filterValue);
    }
    
    document.getElementById('recycleCount').textContent = `Total Items: ${filteredBin.length}`;
    
    if (filteredBin.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4" style="text-align: center; padding: 20px;">Recycle bin is empty</td></tr>`;
        return;
    }
    
    filteredBin.forEach(item => {
        const row = document.createElement('tr');
        const daysLeft = Math.ceil((new Date(item.expiresOn) - new Date()) / (1000 * 60 * 60 * 24));
        
        row.innerHTML = `
            <td>${item.dateRemoved}</td>
            <td><span class="action-pill action-${getActionClass(item.action)}">${getActionLabel(item.action)}</span></td>
            <td>${item.detail}</td>
            <td style="text-align: right;">
                <button class="btn-accept" onclick="restoreItem('${item.id}')" style="padding: 4px 8px; font-size: 0.75rem; margin-right: 4px;">Restore</button>
                <button class="btn-decline" onclick="deleteItem('${item.id}')" style="padding: 4px 8px; font-size: 0.75rem;">Delete</button>
            </td>
        `;
        
        tbody.appendChild(row);
    });
}

// Restore individual item
function restoreItem(itemId) {
    const item = staffRecycleBin.find(i => i.id === itemId);
    if (!item) return;
    
    // Convert back to action history
    const originalAction = {
        id: item.id.replace('recycled-', ''),
        date: item.originalDate,
        time: '00:00 AM',
        action: item.action,
        details: item.detail,
        status: 'restored',
        timestamp: Date.now()
    };
    
    staffActionHistory.push(originalAction);
    staffRecycleBin = staffRecycleBin.filter(i => i.id !== itemId);
    saveData();
    renderRecycleBin();
    renderReportRows();
    showRecycleToast('Item restored successfully');
}

// Restore filtered items
function restoreFilteredItems() {
    const filterValue = document.getElementById('recycleActionFilter').value;
    let itemsToRestore = staffRecycleBin;
    
    if (filterValue !== 'ALL') {
        itemsToRestore = staffRecycleBin.filter(item => item.action === filterValue);
    }
    
    itemsToRestore.forEach(item => {
        const originalAction = {
            id: item.id.replace('recycled-', ''),
            date: item.originalDate,
            time: '00:00 AM',
            action: item.action,
            details: item.detail,
            status: 'restored',
            timestamp: Date.now()
        };
        staffActionHistory.push(originalAction);
    });
    
    staffRecycleBin = staffRecycleBin.filter(item => 
        filterValue === 'ALL' ? false : item.action !== filterValue
    );
    
    saveData();
    closeModal('recycleRestoreModal');
    renderRecycleBin();
    renderReportRows();
    showRecycleToast('Items restored successfully');
}

// Restore all items
function restoreAllItems() {
    staffRecycleBin.forEach(item => {
        const originalAction = {
            id: item.id.replace('recycled-', ''),
            date: item.originalDate,
            time: '00:00 AM',
            action: item.action,
            details: item.detail,
            status: 'restored',
            timestamp: Date.now()
        };
        staffActionHistory.push(originalAction);
    });
    
    staffRecycleBin = [];
    saveData();
    closeModal('recycleRestoreModal');
    renderRecycleBin();
    renderReportRows();
    showRecycleToast('All items restored successfully');
}

// Delete individual item
function deleteItem(itemId) {
    if (confirm('Delete this item permanently?')) {
        staffRecycleBin = staffRecycleBin.filter(i => i.id !== itemId);
        saveData();
        renderRecycleBin();
        showRecycleToast('Item deleted permanently');
    }
}

// Delete all recycled items
function deleteAllRecycledItems() {
    staffRecycleBin = [];
    saveData();
    closeModal('recycleDeleteAllModal');
    renderRecycleBin();
    showRecycleToast('Recycle bin emptied');
}

// Update recycle bin count
function updateRecycleBinCount() {
    // Update button text if needed
}

// Save data to localStorage
function saveData() {
    localStorage.setItem('staffActionHistory', JSON.stringify(staffActionHistory));
    localStorage.setItem('staffRecycleBin', JSON.stringify(staffRecycleBin));
}

// Show toast message
function showRecycleToast(message) {
    const toast = document.getElementById('recycleToast');
    toast.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
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

// Utility: Format date to ISO string
function formatDateISO(date) {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return date.toLocaleDateString('en-US', options);
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
document.addEventListener('DOMContentLoaded', initStaffReports);
