/**
 * Office Head: inbox send-target overrides, notification bell, and scoped "send notification"
 * (ACCA staff only). Load after staff_data.js when window.ISCMS_OFFICE_HEAD_CODE is set and
 * the page includes notifyTargetType with OFFICE_STAFF / SPECIFIC_STAFF options.
 */
(function () {
    function getOfficeHeadCode() {
        return (typeof window !== 'undefined' && window.ISCMS_OFFICE_HEAD_CODE) || 'ACCA';
    }

    function isOfficeHeadNotifyPage() {
        const sel = document.getElementById('notifyTargetType');
        return !!(sel && sel.querySelector('option[value="OFFICE_STAFF"]'));
    }

    function notificationFeed() {
        if (!window.__iscmsOhNotificationFeed) {
            window.__iscmsOhNotificationFeed = [
                {
                    id: 1,
                    from: 'Director',
                    subject: 'ACCA should facilitate this',
                    messageHtml:
                        'Please have <strong>ACCA</strong> facilitate <strong>Institutional Research &amp; Data Stewardship Workshop 2026</strong>. Coordinate facilitators, confirm venue capacity, and send SDU a one-page run sheet.',
                    date: 'May 4, 2026, 10:30 AM',
                    read: false
                }
            ];
        }
        return window.__iscmsOhNotificationFeed;
    }

    function escapeNotifyCell(text) {
        return String(text || '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    function plainTextFromHtml(html) {
        const d = document.createElement('div');
        d.innerHTML = html || '';
        return d.textContent || d.innerText || '';
    }

    /** Merge Director inbox-style feed + sent log so the modal list is not empty on first visit. */
    const stockLoadNotifyLog =
        typeof loadNotifyLog === 'function'
            ? loadNotifyLog
            : function stockLoadNotifyLogNoop() {
                  /* empty */
              };

    window.loadNotifyLog = function loadNotifyLogOfficeHead() {
        if (!isOfficeHeadNotifyPage()) {
            return stockLoadNotifyLog();
        }
        const tbody = document.getElementById('notifyLogTableBody');
        if (!tbody) return;

        const lines = [];
        notificationFeed().forEach((n) => {
            const body = plainTextFromHtml(n.messageHtml || '');
            lines.push(
                `<strong>${escapeNotifyCell(n.subject)}</strong> <span style="color:#64748b">(from ${escapeNotifyCell(
                    n.from
                )})</span> — ${escapeNotifyCell(body)} <span style="color:#94a3b8">(${escapeNotifyCell(n.date)})</span>`
            );
        });
        if (typeof notificationLog !== 'undefined') {
            notificationLog.slice(0, 8).forEach((item) => {
                lines.push(
                    `<strong>${escapeNotifyCell(item.subject)}</strong> <span style="color:#64748b">(sent to ${escapeNotifyCell(
                        item.target
                    )})</span> — ${escapeNotifyCell(item.message)} <span style="color:#94a3b8">(${escapeNotifyCell(item.date)})</span>`
                );
            });
        }

        tbody.innerHTML = '';
        if (lines.length === 0) {
            tbody.innerHTML = '<tr><td>No notifications yet.</td></tr>';
            return;
        }
        lines.slice(0, 12).forEach((html) => {
            tbody.innerHTML += `<tr><td>${html}</td></tr>`;
        });
    };

    function populateOfficeStaffCheckboxes() {
        const container = document.getElementById('officeStaffCheckboxes');
        if (!container || typeof officeData === 'undefined') return;
        const code = getOfficeHeadCode();
        const staff = officeData[code] || [];
        const ohName = 'Carlos Miguel V. Tingson';
        container.innerHTML = '';
        staff.forEach((member) => {
            if (member.name === ohName) return;
            const label = document.createElement('label');
            label.innerHTML = `<input type="checkbox" value="${String(member.name).replace(/"/g, '&quot;')}" class="notify-office-checkbox"> ${member.name}`;
            container.appendChild(label);
        });
    }

    window.toggleNotificationTargetOffice = function () {
        const sel = document.getElementById('notifyTargetType');
        const group = document.getElementById('notifyTargetOfficeGroup');
        if (!sel || !group) return;
        const targetType = sel.value;
        const showStaff = targetType === 'SPECIFIC_STAFF';
        group.style.display = showStaff ? 'block' : 'none';
        if (showStaff) populateOfficeStaffCheckboxes();
        else {
            document.querySelectorAll('.notify-office-checkbox').forEach((cb) => {
                cb.checked = false;
            });
        }
    };

    window.submitNotification = function () {
        const sel = document.getElementById('notifyTargetType');
        if (!sel || !isOfficeHeadNotifyPage()) {
            return;
        }
        const targetType = sel.value;
        const subject = document.getElementById('notifySubject').value.trim();
        const message = document.getElementById('notifyMessage').value.trim();
        const code = getOfficeHeadCode();

        if (!subject || !message) {
            alert('Please provide both subject and message.');
            return;
        }

        let target = '';
        if (targetType === 'OFFICE_STAFF') {
            target = `All ${code} staff`;
        } else {
            const selectedStaff = Array.from(document.querySelectorAll('.notify-office-checkbox:checked')).map((cb) => cb.value);
            if (selectedStaff.length === 0) {
                alert('Please select at least one staff member in your office.');
                return;
            }
            target = selectedStaff.join(', ');
        }

        const now = new Date().toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit'
        });
        if (typeof notificationLog !== 'undefined') {
            notificationLog.unshift({ target, subject, message, date: now });
        }
        if (typeof loadNotifyLog === 'function') loadNotifyLog();

        document.getElementById('notifySubject').value = '';
        document.getElementById('notifyMessage').value = '';
        document.querySelectorAll('.notify-office-checkbox').forEach((checkbox) => {
            checkbox.checked = false;
        });
        alert(`Notification sent to ${target}.`);
    };

    window.toggleNotificationPanel = function () {
        const panel = document.getElementById('notificationPanel');
        if (!panel) return;
        const isVisible = panel.style.display === 'block';
        panel.style.display = isVisible ? 'none' : 'block';
        if (!isVisible) {
            if (typeof window.renderOfficeHeadNotifications === 'function') {
                window.renderOfficeHeadNotifications();
            }
            notificationFeed().forEach((n) => {
                n.read = true;
            });
            window.updateNotificationBadge();
        }
    };

    window.renderOfficeHeadNotifications = function () {
        const list = document.getElementById('notificationList');
        if (!list) return;
        const notifications = notificationFeed();
        list.innerHTML = '';
        if (notifications.length === 0) {
            list.innerHTML = '<div style="padding: 16px; text-align: center; color: #64748b;">No notifications</div>';
            return;
        }
        notifications.forEach((notif) => {
            const item = document.createElement('div');
            item.style.cssText =
                'padding: 12px 16px; border-bottom: 1px solid #f1f5f9; cursor: pointer; transition: background 0.2s;';
            item.onmouseover = () => {
                item.style.background = '#f8fafc';
            };
            item.onmouseout = () => {
                item.style.background = 'white';
            };
            item.innerHTML = `
                    <div style="font-weight: 600; color: #1B2559; font-size: 0.85rem; margin-bottom: 4px;">${notif.subject}</div>
                    <div style="font-size: 0.8rem; color: #475569; margin-bottom: 4px;">From: ${notif.from}</div>
                    <div style="font-size: 0.8rem; color: #64748b; line-height: 1.4;">${notif.messageHtml || ''}</div>
                    <div style="font-size: 0.72rem; color: #94a3b8; margin-top: 6px;">${notif.date}</div>`;
            list.appendChild(item);
        });
    };

    window.updateNotificationBadge = function () {
        const badge = document.getElementById('notificationBadge');
        if (!badge) return;
        const unreadCount = notificationFeed().filter((n) => !n.read).length;
        badge.textContent = String(unreadCount);
        badge.style.display = unreadCount > 0 ? 'flex' : 'none';
    };

    document.addEventListener('DOMContentLoaded', () => {
        if (!window.ISCMS_OFFICE_HEAD_CODE || !isOfficeHeadNotifyPage()) return;
        if (typeof populateInboxOfficeFilter === 'function') populateInboxOfficeFilter();
        if (typeof loadNotifyLog === 'function') loadNotifyLog();
        populateOfficeStaffCheckboxes();
        window.updateNotificationBadge();
    });
})();
