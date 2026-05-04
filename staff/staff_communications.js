(function () {
    const STAFF_NAME = 'Elena Mae R. Castro';
    const PANEL_ID = 'staffNotificationPanel';
    const BADGE_ID = 'staffNotificationBadge';
    const LIST_ID = 'staffNotificationList';
    const THREAD_LIST_ID = 'staffInboxThreadList';
    const BODY_ID = 'staffInboxMessageBody';
    const HEADER_ID = 'staffInboxMessageHeader';
    const STAFF_INBOX_MOCK_KEY = 'iscms_staff_inbox_mock_threads_v1';
    const STAFF_SENT_REPLIES_KEY = 'iscms_staff_sent_replies_v1';

    let selectedThreadId = null;
    let panelVisible = false;
    let notifications = [];

    function escapeHtml(text) {
        if (text == null) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    function ensureUiInjected() {
        if (!document.getElementById('staffInboxModal')) {
            const modal = document.createElement('div');
            modal.id = 'staffInboxModal';
            modal.className = 'modal-overlay';
            modal.style.display = 'none';
            modal.innerHTML = `
                <div class="modal-content modal-large modal-stable inbox-modal navy-frame shadow-lg">
                    <div class="modal-header">
                        <h2>Inbox Messages</h2>
                        <button type="button" class="close-btn" onclick="closeStaffInbox()">×</button>
                    </div>
                    <div class="modal-filters-row">
                        <input type="text" id="staffInboxSearch" onkeyup="renderStaffInboxThreads()" placeholder="Search sender name..." class="flex-search">
                        <div class="right-filters">
                            <select id="staffInboxOfficeFilter" onchange="renderStaffInboxThreads()">
                                <option value="ALL">All Offices</option>
                            </select>
                            <select id="staffInboxSenderTypeFilter" onchange="renderStaffInboxThreads()">
                                <option value="ALL">All Senders</option>
                                <option value="DIRECTOR">SDU Director</option>
                                <option value="OFFICE_HEAD">Office Head</option>
                            </select>
                        </div>
                    </div>
                    <div class="inbox-layout">
                        <div class="inbox-thread-list" id="${THREAD_LIST_ID}"></div>
                        <div class="inbox-message-view">
                            <div class="inbox-message-header" id="${HEADER_ID}">Select a message</div>
                            <div class="inbox-message-body" id="${BODY_ID}">Choose any conversation on the left.</div>
                            <div class="inbox-message-compose">
                                <input type="text" id="staffReplyInput" class="flex-search" placeholder="Type your message as Staff...">
                                <button type="button" class="btn-accept" onclick="sendStaffReply()">Send</button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);
        }

        if (!document.getElementById('staffNotificationBell')) {
            const bell = document.createElement('div');
            bell.id = 'staffNotificationBell';
            bell.style.cssText = 'position: fixed; top: 20px; right: 20px; z-index: 10000; cursor: pointer;';
            bell.innerHTML = `
                <div style="position: relative; width: 40px; height: 40px; background: #1B2559; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                        <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                    </svg>
                    <span id="${BADGE_ID}" style="position: absolute; top: -2px; right: -2px; background: #ef4444; color: white; font-size: 10px; font-weight: bold; min-width: 18px; height: 18px; border-radius: 9px; display: flex; align-items: center; justify-content: center; padding: 0 4px;">0</span>
                </div>
            `;
            bell.addEventListener('click', toggleStaffNotificationPanel);
            document.body.appendChild(bell);
        }

        if (!document.getElementById(PANEL_ID)) {
            const panel = document.createElement('div');
            panel.id = PANEL_ID;
            panel.style.cssText = 'position: fixed; top: 70px; right: 20px; z-index: 10000; width: 320px; max-height: 400px; overflow-y: auto; background: white; border-radius: 12px; box-shadow: 0 8px 32px rgba(0,0,0,0.2); display: none;';
            panel.innerHTML = `
                <div style="padding: 16px; border-bottom: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center;">
                    <h3 style="margin: 0; color: #1B2559; font-size: 1rem;">Notifications</h3>
                    <button type="button" onclick="toggleStaffNotificationPanel()" style="background: none; border: none; cursor: pointer; color: #64748b; font-size: 1.2rem;">&times;</button>
                </div>
                <div id="${LIST_ID}" style="padding: 8px 0;"></div>
            `;
            document.body.appendChild(panel);
        }
    }

    function buildNotifications() {
        const rows = [];
        if (typeof TRAINING_EVENTS_SEED !== 'undefined' && Array.isArray(TRAINING_EVENTS_SEED)) {
            TRAINING_EVENTS_SEED.forEach(event => {
                (event.assignedPersons || []).forEach(person => {
                    if (person.name !== STAFF_NAME) return;
                    rows.push({
                        title: 'New training assignment',
                        body: `Director assigned you as ${person.role} for ${event.trainingName}.`,
                        date: event.deadline || '',
                        source: 'SDU Director'
                    });
                });
            });
        }

        const threads = getStaffThreads();
        if (threads.length) {
            threads.forEach(thread => {
                const latest = thread.messages && thread.messages.length ? thread.messages[thread.messages.length - 1] : null;
                if (!latest || latest.sender === STAFF_NAME) return;
                const senderType = resolveSenderType(thread, latest.sender);
                rows.push({
                    title: `Message from ${latest.sender}`,
                    body: latest.content,
                    date: latest.date || '',
                    source: senderType === 'OFFICE_HEAD' ? 'Office Head' : 'SDU Director'
                });
            });
        }

        notifications = rows.slice(0, 25);
    }

    function updateBadge() {
        const badge = document.getElementById(BADGE_ID);
        if (!badge) return;
        badge.textContent = String(notifications.length);
        badge.style.display = notifications.length ? 'flex' : 'none';
    }

    function renderNotificationList() {
        const list = document.getElementById(LIST_ID);
        if (!list) return;
        if (!notifications.length) {
            list.innerHTML = '<div style="padding: 14px 16px; color:#64748b; font-size:0.88rem;">No notifications yet.</div>';
            return;
        }
        list.innerHTML = notifications.map(item => `
            <div style="padding: 10px 14px; border-bottom:1px solid #f1f5f9;">
                <div style="font-weight:700; color:#1B2559; font-size:0.86rem;">${escapeHtml(item.title)}</div>
                <div style="font-size:0.84rem; color:#334155; margin-top:3px;">${escapeHtml(item.body)}</div>
                <div style="font-size:0.76rem; color:#64748b; margin-top:6px;">${escapeHtml(item.source)} · ${escapeHtml(item.date || 'Recent')}</div>
            </div>
        `).join('');
    }

    function getOfficeHeadNames() {
        if (typeof officeHeads === 'undefined' || !officeHeads) return [];
        return Object.values(officeHeads).filter(Boolean);
    }

    function resolveSenderType(thread, senderName) {
        if (senderName === 'Director' || senderName === 'SDU Director') return 'DIRECTOR';
        if (thread?.senderType === 'OFFICE_HEAD') return 'OFFICE_HEAD';
        const officeHeadNames = getOfficeHeadNames();
        if (officeHeadNames.includes(senderName)) return 'OFFICE_HEAD';
        return 'DIRECTOR';
    }

    function getSenderTypeTag(senderType) {
        const label = senderType === 'OFFICE_HEAD' ? 'Office Head' : 'SDU Director';
        const className = senderType === 'OFFICE_HEAD' ? 'bg-speaker' : 'bg-participant';
        return `<span class="tag ${className}">${escapeHtml(label)}</span>`;
    }

    function getOfficeTagHtml(officeCode) {
        if (typeof getOfficeTag === 'function') return getOfficeTag(officeCode || 'ACCA');
        return `<span class="tag bg-acca">${escapeHtml(officeCode || 'ACCA')}</span>`;
    }

    function getMockThreads() {
        const mock = [
            {
                id: 900001,
                participants: [STAFF_NAME, 'SDU Director'],
                office: 'ACCA',
                senderType: 'DIRECTOR',
                subject: 'Training Assignment Confirmation',
                messages: [
                    { sender: 'SDU Director', date: 'May 2, 2026', content: `You are assigned to the upcoming Leadership Seminar as Participant. Please coordinate with your Office Head for schedule and requirements.` },
                    { sender: STAFF_NAME, date: 'May 2, 2026', content: 'Acknowledged, Director. I will prepare the required documents and coordinate with our office.' },
                    { sender: 'SDU Director', date: 'May 3, 2026', content: 'Noted. Upload your proof files after completion for review.' }
                ]
            },
            {
                id: 900002,
                participants: [STAFF_NAME, 'Carlos Miguel V. Tingson'],
                office: 'ACCA',
                senderType: 'OFFICE_HEAD',
                subject: 'Pre-training Reminders',
                messages: [
                    { sender: 'Carlos Miguel V. Tingson', date: 'May 3, 2026', content: 'Please arrive 15 minutes early and bring your attendance and activity documentation.' },
                    { sender: STAFF_NAME, date: 'May 3, 2026', content: 'Thanks for the reminder. I will bring all required files.' }
                ]
            }
        ];
        return mock;
    }

    function getStaffThreads() {
        const sourceThreads = (typeof inboxThreads !== 'undefined' && Array.isArray(inboxThreads))
            ? inboxThreads.filter(thread => (thread.participants || []).includes(STAFF_NAME))
            : [];

        const storedMock = JSON.parse(localStorage.getItem(STAFF_INBOX_MOCK_KEY) || 'null');
        const mockThreads = Array.isArray(storedMock) ? storedMock : getMockThreads();
        if (!storedMock) {
            localStorage.setItem(STAFF_INBOX_MOCK_KEY, JSON.stringify(mockThreads));
        }

        const combined = [...sourceThreads, ...mockThreads];
        const sentReplies = JSON.parse(localStorage.getItem(STAFF_SENT_REPLIES_KEY) || '[]');
        if (Array.isArray(sentReplies) && sentReplies.length) {
            sentReplies.forEach(reply => {
                const thread = combined.find(t => String(t.id) === String(reply.threadId));
                if (!thread) return;
                const exists = (thread.messages || []).some(m =>
                    m.sender === STAFF_NAME && m.date === reply.date && m.content === reply.content
                );
                if (!exists) {
                    if (!Array.isArray(thread.messages)) thread.messages = [];
                    thread.messages.push({
                        sender: STAFF_NAME,
                        date: reply.date,
                        content: reply.content
                    });
                }
            });
        }
        const deduped = [];
        const seen = new Set();
        combined.forEach(thread => {
            const key = String(thread.id);
            if (seen.has(key)) return;
            seen.add(key);
            deduped.push(thread);
        });
        return deduped;
    }

    function populateStaffInboxOfficeFilter() {
        const select = document.getElementById('staffInboxOfficeFilter');
        if (!select) return;
        const threads = getStaffThreads();
        const offices = Array.from(new Set(threads.map(t => t.office).filter(Boolean)));
        select.innerHTML = '<option value="ALL">All Offices</option>';
        offices.forEach(office => {
            const option = document.createElement('option');
            option.value = office;
            option.textContent = office;
            select.appendChild(option);
        });
    }

    function renderThreadView(threadId) {
        const thread = getStaffThreads().find(t => t.id === threadId);
        const header = document.getElementById(HEADER_ID);
        const body = document.getElementById(BODY_ID);
        if (!header || !body) return;
        if (!thread) {
            header.textContent = 'No conversation selected';
            body.textContent = 'Choose a conversation on the left.';
            return;
        }
        selectedThreadId = threadId;
        const peer = (thread.participants || []).find(p => p !== STAFF_NAME) || 'SDU Director';
        const latest = thread.messages && thread.messages.length ? thread.messages[thread.messages.length - 1] : { date: '' };
        const senderType = resolveSenderType(thread, latest.sender || peer);
        header.innerHTML = `<div class="inbox-selected-name">${escapeHtml(peer)}</div>
            <div class="inbox-selected-meta">${getSenderTypeTag(senderType)} ${getOfficeTagHtml(thread.office)} <span>${escapeHtml(latest.date || '')}</span></div>
            <div class="inbox-selected-subject">${escapeHtml(thread.subject || 'Conversation')}</div>`;
        body.innerHTML = (thread.messages || []).map(message => {
            const fromStaff = message.sender === STAFF_NAME;
            const rowClass = fromStaff ? 'chat-row-right' : 'chat-row-left';
            const bubbleClass = fromStaff ? 'chat-bubble-user' : 'chat-bubble-director';
            return `
                <div class="chat-row ${rowClass}">
                    <div class="chat-bubble ${bubbleClass}">
                        <div class="chat-meta">
                            <div class="chat-sender">${escapeHtml(message.sender)}</div>
                            <div class="chat-date">${escapeHtml(message.date || '')}</div>
                        </div>
                        <div class="chat-content">${escapeHtml(message.content || '')}</div>
                    </div>
                </div>
            `;
        }).join('');
    }

    function renderStaffInboxThreads() {
        const list = document.getElementById(THREAD_LIST_ID);
        const search = (document.getElementById('staffInboxSearch')?.value || '').toLowerCase();
        const officeFilter = document.getElementById('staffInboxOfficeFilter')?.value || 'ALL';
        const senderTypeFilter = document.getElementById('staffInboxSenderTypeFilter')?.value || 'ALL';
        if (!list) return;
        const threads = getStaffThreads().filter(thread => {
            const peer = (thread.participants || []).find(p => p !== STAFF_NAME) || '';
            const latest = thread.messages && thread.messages.length ? thread.messages[thread.messages.length - 1] : null;
            const senderType = resolveSenderType(thread, latest?.sender || peer);
            const matchesSearch = peer.toLowerCase().includes(search);
            const matchesOffice = officeFilter === 'ALL' || thread.office === officeFilter;
            const matchesSenderType = senderTypeFilter === 'ALL' || senderType === senderTypeFilter;
            return matchesSearch && matchesOffice && matchesSenderType;
        });
        if (!threads.length) {
            list.innerHTML = '<div class="inbox-empty">No messages found.</div>';
            renderThreadView(null);
            return;
        }
        if (!threads.some(t => t.id === selectedThreadId)) selectedThreadId = threads[0].id;

        list.innerHTML = threads.map(thread => {
            const peer = (thread.participants || []).find(p => p !== STAFF_NAME) || 'SDU Director';
            const latest = thread.messages && thread.messages.length ? thread.messages[thread.messages.length - 1] : { date: '' };
            const senderType = resolveSenderType(thread, latest.sender || peer);
            const active = thread.id === selectedThreadId ? 'active' : '';
            return `
                <button class="inbox-thread-item ${active}" data-thread-id="${thread.id}">
                    <div class="inbox-thread-top">
                        <span class="font-bold">${escapeHtml(peer)}</span>
                        <span class="inbox-thread-date">${escapeHtml(latest.date || '')}</span>
                    </div>
                    <div class="inbox-thread-meta">${getSenderTypeTag(senderType)} ${getOfficeTagHtml(thread.office)}</div>
                    <div class="inbox-thread-subject">${escapeHtml(thread.subject || 'Conversation')}</div>
                </button>
            `;
        }).join('');

        list.querySelectorAll('.inbox-thread-item').forEach(btn => {
            btn.addEventListener('click', () => {
                renderThreadView(Number(btn.getAttribute('data-thread-id')));
                renderStaffInboxThreads();
            });
        });

        renderThreadView(selectedThreadId);
    }

    function openStaffInbox() {
        const modal = document.getElementById('staffInboxModal');
        if (modal) modal.style.display = 'flex';
        populateStaffInboxOfficeFilter();
        renderStaffInboxThreads();
        const input = document.getElementById('staffReplyInput');
        if (input) input.focus();
    }

    function closeStaffInbox() {
        const modal = document.getElementById('staffInboxModal');
        if (modal) modal.style.display = 'none';
    }

    function toggleStaffNotificationPanel() {
        const panel = document.getElementById(PANEL_ID);
        if (!panel) return;
        panelVisible = !panelVisible;
        panel.style.display = panelVisible ? 'block' : 'none';
        if (panelVisible) renderNotificationList();
    }

    function sendStaffReply() {
        const input = document.getElementById('staffReplyInput');
        const message = input?.value?.trim();
        if (!message || !selectedThreadId) return;

        const now = new Date();
        const date = now.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });

        const sentReplies = JSON.parse(localStorage.getItem(STAFF_SENT_REPLIES_KEY) || '[]');
        sentReplies.push({
            threadId: selectedThreadId,
            sender: STAFF_NAME,
            date,
            content: message
        });
        localStorage.setItem(STAFF_SENT_REPLIES_KEY, JSON.stringify(sentReplies));

        input.value = '';
        renderStaffInboxThreads();
    }

    window.openStaffInbox = openStaffInbox;
    window.closeStaffInbox = closeStaffInbox;
    window.toggleStaffNotificationPanel = toggleStaffNotificationPanel;
    window.renderStaffInboxThreads = renderStaffInboxThreads;
    window.sendStaffReply = sendStaffReply;

    document.addEventListener('DOMContentLoaded', () => {
        ensureUiInjected();
        buildNotifications();
        updateBadge();
        renderNotificationList();
    });
})();
