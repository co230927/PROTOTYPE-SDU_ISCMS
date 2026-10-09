(function (global) {
    const STORAGE_KEY = 'iscms_notifications_v1';
    const PANEL_ID = 'iscmsNotificationPanel';
    const BELL_ID = 'iscmsNotificationBell';
    const BADGE_ID = 'iscmsNotificationBadge';
    const LIST_ID = 'iscmsNotificationList';
    const ROLE_KEY = 'iscms_session_role';
    const STAFF_NAME = 'Elena Mae R. Castro';
    const STAFF_OFFICE = 'ACCA';

    function currentRole() {
        if (global.ISCMS_OFFICE_HEAD_CODE) return 'office_head';
        const path = location.pathname.toLowerCase();
        if (path.includes('/officehead/')) return 'office_head';
        if (path.includes('/staff/')) return 'staff';
        if (path.includes('/secretary/')) return 'secretary';
        const stored = sessionStorage.getItem(ROLE_KEY) || '';
        if (stored) return stored;
        if (path.includes('/director/')) return 'director';
        return '';
    }

    function currentIdentity() {
        const role = currentRole();
        if (role === 'staff') return { role, name: STAFF_NAME, office: STAFF_OFFICE };
        if (role === 'office_head') {
            const office = global.ISCMS_OFFICE_HEAD_CODE || 'ACCA';
            const heads = typeof officeHeads !== 'undefined' ? officeHeads : {};
            const name = heads[office] || 'Carlos Miguel V. Tingson';
            return { role, name, office };
        }
        return { role, name: role === 'secretary' ? 'Secretary' : 'Director', office: 'SDU' };
    }

    function readAll() {
        try {
            const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
            return Array.isArray(parsed) ? parsed : [];
        } catch (error) {
            return [];
        }
    }

    function writeAll(rows) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(rows.slice(0, 500)));
    }

    function escapeHtml(value) {
        const node = document.createElement('div');
        node.textContent = String(value == null ? '' : value);
        return node.innerHTML;
    }

    function add(record) {
        if (!record || !record.recipientRole || !record.message) return null;
        const rows = readAll();
        const id = record.id || `ntf-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
        if (rows.some((row) => row.id === id)) return rows.find((row) => row.id === id);
        const saved = {
            id,
            type: record.type || 'announcement',
            title: record.title || 'Notification',
            message: record.message,
            createdAt: record.createdAt || new Date().toISOString(),
            sender: record.sender || currentIdentity().name,
            recipientRole: record.recipientRole,
            recipientOffice: record.recipientOffice || '',
            recipientName: record.recipientName || ''
        };
        rows.unshift(saved);
        writeAll(rows);
        return saved;
    }

    function matchesUser(row, user) {
        const roleMatches = row.recipientRole === user.role ||
            (row.recipientRole === 'director_secretary' && ['director', 'secretary'].includes(user.role));
        if (!roleMatches) return false;
        if (row.recipientOffice && row.recipientOffice !== user.office) return false;
        return !row.recipientName || row.recipientName === user.name;
    }

    function addAutomaticNotices(user) {
        const assignments = [];
        (Array.isArray(global.TRAINING_EVENTS_SEED) ? global.TRAINING_EVENTS_SEED : []).forEach((event) => {
            (event.assignedPersons || []).forEach((person) => {
                assignments.push({
                    id: event.id, title: event.trainingName, deadline: event.deadline,
                    recipientName: person.name, recipientOffice: person.office || (event.offices || [])[0],
                    role: person.role, sender: 'SDU Director'
                });
            });
        });
        try {
            const systemAssignments = JSON.parse(localStorage.getItem('iscms_director_assignments_v1') || '[]');
            systemAssignments.forEach((event) => (event.assignedPersons || []).forEach((person) => assignments.push({
                id: event.id, title: event.trainingName, deadline: event.deadline,
                recipientName: person.name, recipientOffice: person.office || (event.offices || [])[0],
                role: person.role, sender: 'SDU Director'
            })));
            const officeAssignments = JSON.parse(localStorage.getItem(`iscms_office_head_staff_assignments_v1_${user.office}`) || '[]');
            officeAssignments.forEach((event) => assignments.push({
                id: event.id, title: event.name, deadline: event.deadline,
                recipientName: event.staffName, recipientOffice: event.office,
                role: event.role, sender: 'Office Head'
            }));
        } catch (error) { /* ignore malformed legacy assignment data */ }
        assignments.forEach((event) => {
                if (event.recipientName !== user.name) return;
                add({
                    id: `assignment:${event.id}:${user.name}`,
                    type: 'assignment',
                    title: 'Training assignment',
                    message: `You are assigned as ${event.role || 'Participant'} for ${event.title}.`,
                    recipientRole: user.role,
                    recipientOffice: event.recipientOffice || user.office,
                    recipientName: user.name,
                    sender: event.sender || 'SDU Director'
                });
                if (event.deadline) {
                    const deadline = new Date(`${event.deadline}T00:00:00`);
                    const daysLeft = Math.ceil((deadline - new Date()) / 86400000);
                    if (daysLeft >= 0 && daysLeft <= 7) {
                        add({
                            id: `deadline:${event.id}:${user.name}`,
                            type: 'deadline',
                            title: 'Training deadline approaching',
                            message: `${event.title} is due ${event.deadline}.`,
                            recipientRole: user.role,
                            recipientOffice: event.recipientOffice || user.office,
                            recipientName: user.name,
                            sender: 'Staff Training and Management System'
                        });
                    }
                }
        });
        if (user.role === 'staff') {
            try {
                const rejectionNotices = JSON.parse(localStorage.getItem('iscms_staff_proof_rejection_notices_v1') || '[]');
                rejectionNotices.filter((notice) => notice.staffName === user.name).forEach((notice, index) => {
                    add({
                        id: `proof-rejection:${notice.staffName}:${notice.trainingTitle}:${notice.at || index}`,
                        type: 'proof_rejected',
                        title: 'Proof rejected',
                        message: `${notice.trainingTitle}: ${notice.reason || 'Please review and resubmit your proof.'}`,
                        createdAt: notice.at,
                        recipientRole: 'staff',
                        recipientOffice: user.office,
                        recipientName: user.name,
                        sender: notice.from || 'Director'
                    });
                });
            } catch (error) { /* ignore malformed legacy notice data */ }
        }
    }

    function getForCurrentUser() {
        const user = currentIdentity();
        addAutomaticNotices(user);
        return readAll().filter((row) => matchesUser(row, user));
    }

    function render() {
        const list = document.getElementById(LIST_ID);
        const badge = document.getElementById(BADGE_ID);
        if (!list || !badge) return;
        const rows = getForCurrentUser();
        badge.className = 'iscms-notification-badge';
        badge.textContent = String(rows.length);
        badge.style.display = rows.length ? 'flex' : 'none';
        list.innerHTML = rows.length ? rows.map((row) => `
            <article class="iscms-notification-item">
                <strong>${escapeHtml(row.title)}</strong>
                <p>${escapeHtml(row.message)}</p>
                <small>${escapeHtml(row.sender)} · ${escapeHtml(new Date(row.createdAt).toLocaleString())}</small>
            </article>
        `).join('') : '<div class="iscms-notification-empty">No notifications yet.</div>';
    }

    function togglePanel() {
        const panel = document.getElementById(PANEL_ID);
        if (!panel) return;
        panel.style.display = panel.style.display === 'block' ? 'none' : 'block';
        render();
    }

    function getOfficeData() {
        return typeof officeData !== 'undefined' ? officeData : {};
    }

    function getOfficeHeads() {
        return typeof officeHeads !== 'undefined' ? officeHeads : {};
    }

    function offices() {
        return Object.keys(getOfficeData()).filter((key) => key !== 'TOTAL_STAFF');
    }

    function officeHeadRecipients(office) {
        const head = getOfficeHeads()[office];
        return head ? [head] : [];
    }

    function staffRecipients(office) {
        const heads = Object.values(getOfficeHeads());
        return (getOfficeData()[office] || [])
            .filter((person) => !heads.includes(person.name))
            .map((person) => person.name);
    }

    function injectComposer() {
        if (document.getElementById('iscmsAnnouncementModal')) return;
        const modal = document.createElement('div');
        modal.id = 'iscmsAnnouncementModal';
        modal.className = 'modal-overlay';
        modal.style.display = 'none';
        modal.innerHTML = `
            <div class="modal-content navy-frame shadow-lg iscms-announcement-content">
                <div class="modal-header"><h2>Send Notification</h2><button type="button" class="close-btn" id="iscmsAnnouncementClose">×</button></div>
                <form id="iscmsAnnouncementForm">
                    <div class="form-group"><label for="iscmsAnnouncementAudience">Recipients</label><select id="iscmsAnnouncementAudience" class="flex-search"></select></div>
                    <div class="form-group" id="iscmsAnnouncementOfficeWrap"><label for="iscmsAnnouncementOffice">Office</label><select id="iscmsAnnouncementOffice" class="flex-search"></select></div>
                    <div class="form-group" id="iscmsAnnouncementPersonWrap"><label for="iscmsAnnouncementPerson">Specific recipient</label><select id="iscmsAnnouncementPerson" class="flex-search"></select></div>
                    <div class="form-group"><label for="iscmsAnnouncementTitle">Title</label><input id="iscmsAnnouncementTitle" class="flex-search" required maxlength="100"></div>
                    <div class="form-group"><label for="iscmsAnnouncementMessage">Message</label><textarea id="iscmsAnnouncementMessage" class="flex-search" rows="4" required maxlength="1000"></textarea></div>
                    <p id="iscmsAnnouncementError" role="alert" style="display:none;color:#b91c1c;"></p>
                    <div class="modal-actions"><button type="button" class="btn-decline" id="iscmsAnnouncementCancel">Cancel</button><button type="submit" class="btn-accept">Send</button></div>
                </form>
            </div>`;
        document.body.appendChild(modal);
        const audience = modal.querySelector('#iscmsAnnouncementAudience');
        const officeSelect = modal.querySelector('#iscmsAnnouncementOffice');
        const personSelect = modal.querySelector('#iscmsAnnouncementPerson');
        const role = currentRole();
        audience.innerHTML = role === 'office_head'
            ? '<option value="leadership">Director and Secretary</option><option value="office_staff">Staff in my office</option>'
            : '<option value="all_staff">All Staff</option><option value="all_heads">All Office Heads</option><option value="office_staff">Staff in a specific office</option><option value="office_head">Office Head of a specific office</option>';
        offices().forEach((office) => officeSelect.add(new Option(office === 'SDU_ONLY' ? 'SDU' : office, office)));
        function refreshAudience() {
            const selected = audience.value;
            const isOfficeHead = role === 'office_head';
            const needsOffice = isOfficeHead ? selected === 'office_staff' : ['office_staff', 'office_head'].includes(selected);
            modal.querySelector('#iscmsAnnouncementOfficeWrap').style.display = needsOffice && !isOfficeHead ? '' : 'none';
            modal.querySelector('#iscmsAnnouncementPersonWrap').style.display = needsOffice ? '' : 'none';
            if (isOfficeHead) officeSelect.value = global.ISCMS_OFFICE_HEAD_CODE || 'ACCA';
            const office = isOfficeHead ? global.ISCMS_OFFICE_HEAD_CODE || 'ACCA' : officeSelect.value;
            const names = selected === 'office_head' ? officeHeadRecipients(office) : needsOffice ? staffRecipients(office) : [];
            personSelect.innerHTML = '<option value="">Everyone in selected group</option>';
            names.forEach((name) => personSelect.add(new Option(name, name)));
        }
        audience.addEventListener('change', refreshAudience);
        officeSelect.addEventListener('change', refreshAudience);
        refreshAudience();
        modal.querySelector('#iscmsAnnouncementClose').addEventListener('click', closeComposer);
        modal.querySelector('#iscmsAnnouncementCancel').addEventListener('click', closeComposer);
        modal.querySelector('#iscmsAnnouncementForm').addEventListener('submit', sendAnnouncement);
    }

    function closeComposer() {
        const modal = document.getElementById('iscmsAnnouncementModal');
        if (modal) modal.style.display = 'none';
    }

    function openComposer() {
        if (!['director', 'secretary', 'office_head'].includes(currentRole())) return;
        const panel = document.getElementById(PANEL_ID);
        if (panel) panel.style.display = 'none';
        injectComposer();
        document.getElementById('iscmsAnnouncementModal').style.display = 'flex';
    }

    function sendAnnouncement(event) {
        event.preventDefault();
        const user = currentIdentity();
        const audience = document.getElementById('iscmsAnnouncementAudience').value;
        const officeControl = document.getElementById('iscmsAnnouncementOffice');
        const office = user.role === 'office_head' ? user.office : officeControl.value;
        const name = document.getElementById('iscmsAnnouncementPerson').value;
        const title = document.getElementById('iscmsAnnouncementTitle').value.trim();
        const message = document.getElementById('iscmsAnnouncementMessage').value.trim();
        if (!title || !message) return;
        let recipientRole;
        let recipientOffice = '';
        let recipientName = '';
        if (user.role === 'office_head') {
            if (audience === 'leadership') recipientRole = 'director_secretary';
            else {
                recipientRole = 'staff';
                recipientOffice = user.office;
                recipientName = name;
            }
        } else if (audience === 'all_staff') recipientRole = 'staff';
        else if (audience === 'all_heads') recipientRole = 'office_head';
        else if (audience === 'office_staff') {
            recipientRole = 'staff';
            recipientOffice = office;
            recipientName = name;
        } else {
            recipientRole = 'office_head';
            recipientOffice = office;
            recipientName = name;
        }
        add({ type: 'announcement', title, message, recipientRole, recipientOffice, recipientName, sender: user.name });
        document.getElementById('iscmsAnnouncementForm').reset();
        closeComposer();
        render();
        global.alert('Notification sent.');
    }

    function injectBell() {
        if (document.getElementById(BELL_ID)) return;
        const headerActions = document.querySelector('.content-header .header-actions');
        const host = headerActions || document.querySelector('.content-header');
        if (!host) return;
        host.classList.add('iscms-notification-actions');
        const bell = document.createElement('button');
        bell.id = BELL_ID;
        bell.type = 'button';
        bell.className = 'iscms-notification-bell';
        bell.setAttribute('aria-label', 'Notifications');
        bell.title = 'Notifications';
        bell.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M10 21h4"></path></svg><span id="' + BADGE_ID + '"></span>';
        bell.addEventListener('click', togglePanel);
        host.appendChild(bell);
        const panel = document.createElement('section');
        panel.id = PANEL_ID;
        panel.className = 'iscms-notification-panel';
        panel.setAttribute('aria-label', 'Notifications');
        panel.innerHTML = '<div class="iscms-notification-panel-header"><h2>Notifications</h2><button type="button" class="close-btn" aria-label="Close notifications">×</button></div><div id="' + LIST_ID + '"></div>';
        panel.querySelector('.close-btn').addEventListener('click', togglePanel);
        host.appendChild(panel);
    }

    function replaceSendControls() {
        if (!['director', 'secretary', 'office_head'].includes(currentRole())) return;
        document.querySelectorAll('.btn-notify').forEach((button) => {
            if (!/send notification/i.test(button.textContent || '')) return;
            button.removeAttribute('onclick');
            button.addEventListener('click', openComposer);
        });
    }

    global.IscmsNotifications = { STORAGE_KEY, add, readAll, getForCurrentUser, refresh: render, openComposer };
    global.toggleNotificationPanel = togglePanel;
    global.toggleStaffNotificationPanel = togglePanel;
    global.openAnnouncementComposer = openComposer;
    global.addIscmsNotification = add;

    function initializeNotifications() {
        injectBell();
        replaceSendControls();
        render();
        if (['director', 'secretary', 'office_head'].includes(currentRole())) injectComposer();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeNotifications, { once: true });
    } else {
        initializeNotifications();
    }
})(window);
