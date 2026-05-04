/**
 * Office Head — My Trainings hub (joined list, director-assigned, uploaded proofs).
 * Depends on staff_data.js (officeData, officeHeads, getOfficeHeadStaffMember, trainingCategories).
 */
(function () {
    const LS_JOINED = 'iscms_oh_joined_trainings_v1';
    /** Demo only: assigned trainings are not persisted so refresh restores the show defaults. */

    let joinedRows = [];
    let pendingAssigned = [];
    let completedAssigned = [];

    let pendingDeleteRowId = null;
    let editJoinedId = null;
    let viewJoinedId = null;
    let uploadProofAssignmentId = null;
    let editProofContext = null;

    const DEFAULT_PENDING = [
        {
            id: 'asg-p1',
            title: 'Regional Disaster Preparedness Summit',
            venue: 'Regional Convention Hall',
            category: 'Environmental Stewardship',
            role: 'Participant',
            date: 'Jun 8, 2026'
        },
        {
            id: 'asg-p2',
            title: 'Leadership for Academic Units',
            venue: 'ADZU Main Campus',
            category: 'Leadership & Governance',
            role: 'Speaker',
            date: 'Jun 15, 2026'
        }
    ];

    const DEFAULT_COMPLETED = [
        {
            id: 'asg-c1',
            title: 'Disaster Risk Reduction',
            venue: 'Virtual Learning Hub',
            category: 'Environmental Stewardship',
            role: 'Participant',
            date: 'May 12, 2026',
            proofUploaded: false,
            uploadedProofs: []
        },
        {
            id: 'asg-c2',
            title: 'Eco-Action and Sustainability Planning',
            venue: 'ADZU Satellite Center',
            category: 'Environmental Stewardship',
            role: 'Organizer',
            date: 'Apr 18, 2026',
            proofUploaded: true,
            uploadedProofs: ['EcoAction_Attendance.pdf', 'EcoAction_PhotoSet.jpg']
        }
    ];

    function escapeHtml(t) {
        if (t == null) return '';
        const d = document.createElement('div');
        d.textContent = t;
        return d.innerHTML;
    }

    /** Label for a proof filename: Image, PDF, or File */
    function proofTypeLabel(fileName) {
        const ext = (String(fileName).split('.').pop() || '').toLowerCase();
        if (['png', 'jpg', 'jpeg', 'gif', 'webp'].includes(ext)) return 'Image';
        if (ext === 'pdf') return 'PDF';
        return 'File';
    }

    /** Short summary for table cell: "3 files · 2 PDF · 1 image" */
    function summarizeProofsList(proofs) {
        const arr = proofs || [];
        if (arr.length === 0) return '—';
        let img = 0;
        let pdf = 0;
        let other = 0;
        arr.forEach((f) => {
            const t = proofTypeLabel(f);
            if (t === 'Image') img++;
            else if (t === 'PDF') pdf++;
            else other++;
        });
        const bits = [];
        if (pdf) bits.push(`${pdf} PDF`);
        if (img) bits.push(`${img} image${img === 1 ? '' : 's'}`);
        if (other) bits.push(`${other} other`);
        return `${arr.length} file${arr.length === 1 ? '' : 's'} · ${bits.join(' · ')}`;
    }

    function saveJson(key, arr) {
        localStorage.setItem(key, JSON.stringify(arr));
    }

    function cloneJoinedFromStaff() {
        const staff = typeof getOfficeHeadStaffMember === 'function' ? getOfficeHeadStaffMember() : null;
        if (!staff || !staff.completedTrainings) return [];
        return staff.completedTrainings.map((tr, i) => ({
            ...tr,
            _rowId: tr._rowId || `j-${Date.now()}-${i}`,
            description:
                tr.description ||
                `${tr.title}: ${tr.category} — recorded participation in ISCMS. Venue: ${tr.venue}. Scope: ${tr.scope}; Nature: ${tr.nature}.`
        }));
    }

    function loadJoinedInitial() {
        try {
            const raw = localStorage.getItem(LS_JOINED);
            if (raw === null) return cloneJoinedFromStaff();
            const v = JSON.parse(raw);
            return Array.isArray(v) ? v : cloneJoinedFromStaff();
        } catch (e) {
            return cloneJoinedFromStaff();
        }
    }

    function freshDemoAssigned() {
        return {
            pending: JSON.parse(JSON.stringify(DEFAULT_PENDING)),
            completed: JSON.parse(JSON.stringify(DEFAULT_COMPLETED))
        };
    }

    function initState() {
        try {
            localStorage.removeItem('iscms_oh_assigned_pending_v1');
            localStorage.removeItem('iscms_oh_assigned_completed_v1');
        } catch (e) { /* ignore */ }
        joinedRows = loadJoinedInitial();
        const demo = freshDemoAssigned();
        pendingAssigned = demo.pending;
        completedAssigned = demo.completed;

        saveJson(LS_JOINED, joinedRows);
    }

    function getJoinedFiltered() {
        const roleQ = (document.getElementById('filterJoinedRole') || {}).value || 'ALL';
        const catQ = (document.getElementById('filterJoinedCategory') || {}).value || 'ALL';
        const dateQ = ((document.getElementById('filterJoinedDate') || {}).value || '').trim().toLowerCase();

        return joinedRows.filter((r) => {
            if (roleQ !== 'ALL' && r.role !== roleQ) return false;
            if (catQ !== 'ALL' && r.category !== catQ) return false;
            if (dateQ && String(r.date || '').toLowerCase().indexOf(dateQ) === -1) return false;
            return true;
        });
    }

    function renderJoinedTable() {
        const tbody = document.getElementById('joinedTrainingsBody');
        const countEl = document.getElementById('joinedFilterCount');
        if (!tbody) return;

        const rows = getJoinedFiltered();
        if (countEl) countEl.textContent = `${rows.length} training(s)`;

        if (rows.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7">No trainings match the current filters.</td></tr>';
            return;
        }

        tbody.innerHTML = rows
            .map((r) => {
                const proofSummary = summarizeProofsList(r.proofs);
                return `<tr data-row-id="${escapeHtml(r._rowId)}">
                    <td class="font-bold">${escapeHtml(r.title)}</td>
                    <td>${escapeHtml(r.date)}</td>
                    <td>${escapeHtml(r.role)}</td>
                    <td>${escapeHtml(r.category)}</td>
                    <td>${escapeHtml(r.venue)}</td>
                    <td class="oh-proof-summary-cell" title="Multiple proofs allowed per event (e.g. PDF + image)">${escapeHtml(proofSummary)}</td>
                    <td class="actions-nowrap">
                        <button type="button" class="btn-viewmore oh-act-view" data-id="${escapeHtml(r._rowId)}">View more</button>
                        <button type="button" class="btn-viewmore oh-act-edit" data-id="${escapeHtml(r._rowId)}">Edit</button>
                        <button type="button" class="btn-decline oh-act-del" data-id="${escapeHtml(r._rowId)}">Delete</button>
                    </td>
                </tr>`;
            })
            .join('');
    }

    function renderAssignedTables() {
        const pendingBody = document.getElementById('assignedPendingBody');
        const completedBody = document.getElementById('assignedCompletedBody');
        if (pendingBody) {
            if (pendingAssigned.length === 0) {
                pendingBody.innerHTML = '<tr><td colspan="6">No pending assignments from the Director.</td></tr>';
            } else {
                pendingBody.innerHTML = pendingAssigned
                    .map(
                        (a) => `<tr data-asg-id="${escapeHtml(a.id)}">
                        <td class="font-bold">${escapeHtml(a.title)}</td>
                        <td>${escapeHtml(a.venue)}</td>
                        <td>${escapeHtml(a.category)}</td>
                        <td>${escapeHtml(a.role)}</td>
                        <td>${escapeHtml(a.date)}</td>
                        <td class="actions-nowrap">
                            <button type="button" class="btn-accept oh-asg-complete" data-id="${escapeHtml(a.id)}">Complete</button>
                            <button type="button" class="btn-decline oh-asg-cancel" data-id="${escapeHtml(a.id)}">Cancelled</button>
                        </td>
                    </tr>`
                    )
                    .join('');
            }
        }
        if (completedBody) {
            if (completedAssigned.length === 0) {
                completedBody.innerHTML = '<tr><td colspan="6">No completed assignments yet.</td></tr>';
            } else {
                completedBody.innerHTML = completedAssigned
                    .map(
                        (a) => `<tr data-asg-id="${escapeHtml(a.id)}">
                        <td class="font-bold">${escapeHtml(a.title)}</td>
                        <td>${escapeHtml(a.venue)}</td>
                        <td>${escapeHtml(a.category)}</td>
                        <td>${escapeHtml(a.role)}</td>
                        <td>${escapeHtml(a.date)}</td>
                        <td class="actions-nowrap">
                            <button type="button" class="btn-accept oh-asg-upload" data-id="${escapeHtml(a.id)}">Upload proof</button>
                        </td>
                    </tr>`
                    )
                    .join('');
            }
        }
    }

    function buildUploadedCards() {
        const wrap = document.getElementById('uploadedFilesCards');
        if (!wrap) return;

        /** One group per event = multiple proof rows inside one card */
        const groups = [];

        joinedRows.forEach((t) => {
            const proofs = t.proofs || [];
            if (proofs.length === 0) return;
            groups.push({
                kind: 'joined',
                rowId: t._rowId,
                assignmentId: '',
                trainingTitle: t.title,
                date: t.date,
                role: t.role,
                category: t.category,
                sourceLabel: 'Joined training',
                proofs: proofs.map((fileName, proofIndex) => ({ fileName, proofIndex }))
            });
        });

        completedAssigned.forEach((a) => {
            const proofs = a.uploadedProofs || [];
            if (proofs.length === 0) return;
            groups.push({
                kind: 'assigned',
                rowId: '',
                assignmentId: a.id,
                trainingTitle: a.title,
                date: a.date,
                role: a.role,
                category: a.category,
                sourceLabel: 'Director assignment',
                proofs: proofs.map((fileName, proofIndex) => ({ fileName, proofIndex }))
            });
        });

        if (groups.length === 0) {
            wrap.innerHTML =
                '<p class="oh-muted">No proof files yet. Each event can have multiple proofs (e.g. one PDF certificate + one attendance image). Use <strong>Upload proof</strong> on completed assignments or keep proofs on joined trainings.</p>';
            return;
        }

        wrap.innerHTML = groups
            .map((g) => {
                const n = g.proofs.length;
                const proofRows = g.proofs
                    .map((p) => {
                        const tag = proofTypeLabel(p.fileName);
                        const kind = g.kind;
                        const rowId = g.rowId || '';
                        const assignmentId = g.assignmentId || '';
                        return `<li class="oh-proof-row-item">
                            <span class="oh-proof-tag">${escapeHtml(tag)}</span>
                            <span class="oh-proof-name">${escapeHtml(p.fileName)}</span>
                            <span class="oh-proof-row-actions">
                                <button type="button" class="btn-viewmore oh-proof-edit"
                                    data-kind="${escapeHtml(kind)}"
                                    data-row-id="${escapeHtml(rowId)}"
                                    data-assignment-id="${escapeHtml(assignmentId)}"
                                    data-proof-index="${p.proofIndex}">Edit file</button>
                                <button type="button" class="btn-decline oh-proof-remove"
                                    data-kind="${escapeHtml(kind)}"
                                    data-row-id="${escapeHtml(rowId)}"
                                    data-assignment-id="${escapeHtml(assignmentId)}"
                                    data-proof-index="${p.proofIndex}">Remove</button>
                            </span>
                        </li>`;
                    })
                    .join('');

                return `<div class="oh-upload-card navy-frame shadow-sm">
                    <div class="oh-upload-card-body">
                        <h4>${escapeHtml(g.trainingTitle)}</h4>
                        <p class="oh-upload-meta">${escapeHtml(g.date)} · ${escapeHtml(g.role)} · ${escapeHtml(g.category)}</p>
                        <p class="oh-upload-source"><span class="oh-proof-tag oh-proof-tag--muted">${escapeHtml(g.sourceLabel)}</span></p>
                        <p class="oh-proof-bundle-heading"><strong>Proof files (${n})</strong> — one event may include several attachments (images, PDFs, etc.)</p>
                        <ul class="oh-proof-rows">${proofRows}</ul>
                    </div>
                </div>`;
            })
            .join('');
    }

    function switchTab(which) {
        document.querySelectorAll('.oh-mt-tab').forEach((b) => {
            b.classList.toggle('active', b.getAttribute('data-tab') === which);
        });
        document.querySelectorAll('.oh-mt-panel').forEach((p) => {
            p.style.display = p.getAttribute('data-panel') === which ? 'block' : 'none';
        });
        if (which === 'uploads') buildUploadedCards();
    }

    function openModal(id) {
        const el = document.getElementById(id);
        if (el) el.style.display = 'flex';
    }

    function closeModal(id) {
        const el = document.getElementById(id);
        if (el) el.style.display = 'none';
    }

    function exportJoinedCsv() {
        const rows = getJoinedFiltered();
        const headers = ['Title', 'Date', 'Role', 'Category', 'Venue', 'Scope', 'Nature', 'Proof files'];
        const lines = [headers.join(',')];
        rows.forEach((r) => {
            const proofs = (r.proofs || []).join('; ');
            lines.push(
                [r.title, r.date, r.role, r.category, r.venue, r.scope, r.nature, proofs]
                    .map((x) => `"${String(x).replace(/"/g, '""')}"`)
                    .join(',')
            );
        });
        const blob = new Blob([lines.join('\n')], { type: 'text/csv' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'My_Trainings_export.csv';
        a.click();
        URL.revokeObjectURL(a.href);
    }

    function printJoinedTable() {
        const rows = getJoinedFiltered();
        const w = window.open('', '_blank');
        w.document.write(`<!DOCTYPE html><html><head><title>My Trainings</title>
            <style>body{font-family:Segoe UI,sans-serif;padding:20px;color:#1B2559;}table{border-collapse:collapse;width:100%;}th,td{border:1px solid #cbd5e1;padding:8px;font-size:12px;}th{background:#f1f5f9;}</style></head><body>
            <h1>My Trainings</h1><table><thead><tr><th>Title</th><th>Date</th><th>Role</th><th>Category</th><th>Venue</th><th>Proof files</th></tr></thead><tbody>`);
        rows.forEach((r) => {
            w.document.write(
                `<tr><td>${escapeHtml(r.title)}</td><td>${escapeHtml(r.date)}</td><td>${escapeHtml(r.role)}</td><td>${escapeHtml(r.category)}</td><td>${escapeHtml(r.venue)}</td><td>${escapeHtml(summarizeProofsList(r.proofs))}</td></tr>`
            );
        });
        w.document.write('</tbody></table></body></html>');
        w.document.close();
        w.focus();
        w.print();
    }

    function populateCategoryFilters() {
        const sel = document.getElementById('filterJoinedCategory');
        if (!sel || typeof trainingCategories === 'undefined') return;
        sel.innerHTML = '<option value="ALL">All categories</option>';
        trainingCategories.forEach((c) => {
            sel.innerHTML += `<option value="${escapeHtml(c)}">${escapeHtml(c)}</option>`;
        });
    }

    function populateEditCategorySelect() {
        const sel = document.getElementById('editJoinedCategory');
        if (!sel || typeof trainingCategories === 'undefined') return;
        sel.innerHTML = '';
        trainingCategories.forEach((c) => {
            sel.innerHTML += `<option value="${escapeHtml(c)}">${escapeHtml(c)}</option>`;
        });
    }

    document.addEventListener('DOMContentLoaded', () => {
        initState();
        populateCategoryFilters();
        populateEditCategorySelect();
        renderJoinedTable();
        renderAssignedTables();
        buildUploadedCards();

        const hash = (window.location.hash || '').replace('#', '');
        switchTab(hash === 'assigned' || hash === 'uploads' ? hash : 'joined');

        document.querySelectorAll('.oh-mt-tab').forEach((btn) => {
            btn.addEventListener('click', () => switchTab(btn.getAttribute('data-tab')));
        });

        ['filterJoinedRole', 'filterJoinedCategory', 'filterJoinedDate'].forEach((id) => {
            const el = document.getElementById(id);
            if (el) el.addEventListener('input', renderJoinedTable);
            if (el) el.addEventListener('change', renderJoinedTable);
        });

        document.getElementById('btnExportJoined')?.addEventListener('click', exportJoinedCsv);
        document.getElementById('btnPrintJoined')?.addEventListener('click', printJoinedTable);

        document.getElementById('joinedTrainingsBody')?.addEventListener('click', (ev) => {
            const v = ev.target.closest('.oh-act-view');
            const e = ev.target.closest('.oh-act-edit');
            const d = ev.target.closest('.oh-act-del');
            if (v) openViewModal(v.getAttribute('data-id'));
            if (e) openEditModal(e.getAttribute('data-id'));
            if (d) confirmDelete(d.getAttribute('data-id'));
        });

        document.getElementById('assignedPendingBody')?.addEventListener('click', (ev) => {
            const c = ev.target.closest('.oh-asg-complete');
            const x = ev.target.closest('.oh-asg-cancel');
            if (c) completeAssignment(c.getAttribute('data-id'));
            if (x) cancelAssignment(x.getAttribute('data-id'));
        });

        document.getElementById('assignedCompletedBody')?.addEventListener('click', (ev) => {
            const u = ev.target.closest('.oh-asg-upload');
            if (u) openUploadModal(u.getAttribute('data-id'));
        });

        document.getElementById('uploadedFilesCards')?.addEventListener('click', (ev) => {
            const ed = ev.target.closest('.oh-proof-edit');
            const rm = ev.target.closest('.oh-proof-remove');
            if (ed) {
                const pi = parseInt(ed.getAttribute('data-proof-index'), 10);
                if (!Number.isNaN(pi)) {
                    editProofFile(
                        ed.getAttribute('data-kind'),
                        ed.getAttribute('data-row-id') || '',
                        ed.getAttribute('data-assignment-id') || '',
                        pi
                    );
                }
            }
            if (rm) {
                const pi = parseInt(rm.getAttribute('data-proof-index'), 10);
                if (!Number.isNaN(pi)) {
                    removeProofFile(
                        rm.getAttribute('data-kind'),
                        rm.getAttribute('data-row-id') || '',
                        rm.getAttribute('data-assignment-id') || '',
                        pi
                    );
                }
            }
        });

        document.getElementById('modalJoinedViewClose')?.addEventListener('click', () => closeModal('modalJoinedView'));
        document.getElementById('modalJoinedViewClose2')?.addEventListener('click', () => closeModal('modalJoinedView'));
        document.getElementById('modalJoinedEditClose')?.addEventListener('click', () => closeModal('modalJoinedEdit'));
        document.getElementById('modalJoinedEditSave')?.addEventListener('click', saveEditJoined);
        document.getElementById('modalDeleteCancel')?.addEventListener('click', () => closeModal('modalJoinedDelete'));
        document.getElementById('modalDeleteConfirm')?.addEventListener('click', doDeleteJoined);

        document.getElementById('modalUploadProofClose')?.addEventListener('click', () => closeModal('modalUploadProof'));
        document.getElementById('modalUploadProofClose2')?.addEventListener('click', () => closeModal('modalUploadProof'));
        document.getElementById('modalUploadProofSubmit')?.addEventListener('click', submitUploadProof);

        document.getElementById('modalEditProofClose')?.addEventListener('click', () => closeModal('modalEditProof'));
        document.getElementById('modalEditProofClose2')?.addEventListener('click', () => closeModal('modalEditProof'));
        document.getElementById('modalEditProofSave')?.addEventListener('click', saveEditProof);

        document.getElementById('modalJoinedEditClose2')?.addEventListener('click', () => closeModal('modalJoinedEdit'));
        document.getElementById('modalDeleteCancelX')?.addEventListener('click', () => closeModal('modalJoinedDelete'));

        window.addEventListener('hashchange', () => {
            const h = (window.location.hash || '').replace('#', '');
            if (h === 'assigned' || h === 'uploads' || h === 'joined') switchTab(h);
        });
    });

    function findJoined(id) {
        return joinedRows.find((r) => r._rowId === id);
    }

    function openViewModal(id) {
        viewJoinedId = id;
        const r = findJoined(id);
        if (!r) return;
        const box = document.getElementById('modalJoinedViewBody');
        if (!box) return;
        const plist = r.proofs || [];
        const proofs =
            plist.length === 0
                ? '<li class="oh-muted">No proof files attached yet.</li>'
                : plist
                      .map((p) => {
                          const tag = proofTypeLabel(p);
                          return `<li><span class="oh-proof-tag">${escapeHtml(tag)}</span> <span class="oh-proof-file">${escapeHtml(p)}</span></li>`;
                      })
                      .join('');
        const proofHeading =
            plist.length === 0
                ? 'Proof attachments'
                : `Proof attachments (${plist.length} file${plist.length === 1 ? '' : 's'})`;
        box.innerHTML = `
            <p><strong>Training / event:</strong> ${escapeHtml(r.title)}</p>
            <p><strong>Date:</strong> ${escapeHtml(r.date)}</p>
            <p><strong>Role:</strong> ${escapeHtml(r.role)} · <strong>Category:</strong> ${escapeHtml(r.category)}</p>
            <p><strong>Venue:</strong> ${escapeHtml(r.venue)}</p>
            <p><strong>Scope / nature:</strong> ${escapeHtml(r.scope)} / ${escapeHtml(r.nature)}</p>
            <p class="oh-desc"><strong>Description:</strong> ${escapeHtml(r.description || '')}</p>
            <h4 style="margin-top:14px;">${escapeHtml(proofHeading)}</h4>
            <p class="oh-muted" style="margin-bottom:8px;font-size:0.88rem;">You can store multiple proofs per event (e.g. completion PDF + attendance sheet image).</p>
            <ul class="oh-proof-list">${proofs}</ul>`;
        openModal('modalJoinedView');
    }

    function openEditModal(id) {
        editJoinedId = id;
        const r = findJoined(id);
        if (!r) return;
        document.getElementById('editJoinedTitle').value = r.title || '';
        document.getElementById('editJoinedDate').value = r.date || '';
        const roleEl = document.getElementById('editJoinedRole');
        if (roleEl) roleEl.value = r.role || 'Participant';
        const catEl = document.getElementById('editJoinedCategory');
        if (catEl) catEl.value = r.category || (trainingCategories && trainingCategories[0]) || '';
        document.getElementById('editJoinedVenue').value = r.venue || '';
        document.getElementById('editJoinedDescription').value = r.description || '';
        openModal('modalJoinedEdit');
    }

    function saveEditJoined() {
        const r = findJoined(editJoinedId);
        if (!r) return;
        r.title = document.getElementById('editJoinedTitle').value.trim() || r.title;
        r.date = document.getElementById('editJoinedDate').value.trim() || r.date;
        const roleEl = document.getElementById('editJoinedRole');
        if (roleEl) r.role = roleEl.value || r.role;
        const catEl = document.getElementById('editJoinedCategory');
        if (catEl) r.category = catEl.value || r.category;
        r.venue = document.getElementById('editJoinedVenue').value.trim() || r.venue;
        r.description = document.getElementById('editJoinedDescription').value.trim() || r.description;
        saveJson(LS_JOINED, joinedRows);
        renderJoinedTable();
        buildUploadedCards();
        closeModal('modalJoinedEdit');
    }

    function confirmDelete(id) {
        pendingDeleteRowId = id;
        openModal('modalJoinedDelete');
    }

    function doDeleteJoined() {
        const id = pendingDeleteRowId;
        joinedRows = joinedRows.filter((r) => r._rowId !== id);
        pendingDeleteRowId = null;
        saveJson(LS_JOINED, joinedRows);
        renderJoinedTable();
        buildUploadedCards();
        closeModal('modalJoinedDelete');
    }

    function completeAssignment(id) {
        const idx = pendingAssigned.findIndex((a) => a.id === id);
        if (idx === -1) return;
        const [item] = pendingAssigned.splice(idx, 1);
        completedAssigned.push({
            ...item,
            proofUploaded: false,
            uploadedProofs: []
        });
        renderAssignedTables();
    }

    function cancelAssignment(id) {
        pendingAssigned = pendingAssigned.filter((a) => a.id !== id);
        renderAssignedTables();
    }

    function openUploadModal(id) {
        uploadProofAssignmentId = id;
        const inp = document.getElementById('uploadProofNote');
        const files = document.getElementById('uploadProofFiles');
        if (inp) inp.value = '';
        if (files) files.value = '';
        openModal('modalUploadProof');
    }

    function submitUploadProof() {
        const id = uploadProofAssignmentId;
        const a = completedAssigned.find((x) => x.id === id);
        if (!a) return;
        const note = (document.getElementById('uploadProofNote') || {}).value || '';
        const fileEl = document.getElementById('uploadProofFiles');
        const names = [];
        if (fileEl && fileEl.files && fileEl.files.length) {
            for (let i = 0; i < fileEl.files.length; i++) names.push(fileEl.files[i].name);
        }
        if (names.length === 0 && !note.trim()) {
            alert('Attach at least one file or add a note for the proof package.');
            return;
        }
        if (!a.uploadedProofs) a.uploadedProofs = [];
        names.forEach((n) => a.uploadedProofs.push(n));
        if (note.trim()) a.uploadedProofs.push(`Note_${Date.now()}.txt (${note.trim().slice(0, 80)})`);
        a.proofUploaded = a.uploadedProofs.length > 0;
        renderAssignedTables();
        buildUploadedCards();
        closeModal('modalUploadProof');
        alert('Proof package queued for Director review (prototype).');
    }

    function editProofFile(kind, rowId, assignmentId, proofIndex) {
        let fileName = '';
        if (kind === 'joined') {
            const row = joinedRows.find((r) => r._rowId === rowId);
            if (row && row.proofs && row.proofs[proofIndex] !== undefined) fileName = row.proofs[proofIndex];
        } else if (kind === 'assigned') {
            const a = completedAssigned.find((x) => x.id === assignmentId);
            if (a && a.uploadedProofs && a.uploadedProofs[proofIndex] !== undefined) fileName = a.uploadedProofs[proofIndex];
        }
        if (!fileName) return;
        editProofContext = { kind, rowId, assignmentId, proofIndex };
        document.getElementById('editProofFileName').value = fileName;
        openModal('modalEditProof');
    }

    function saveEditProof() {
        const ctx = editProofContext;
        if (!ctx) return;
        const newName = document.getElementById('editProofFileName').value.trim();
        if (!newName) return;
        if (ctx.kind === 'joined') {
            const row = joinedRows.find((r) => r._rowId === ctx.rowId);
            if (row && row.proofs && row.proofs[ctx.proofIndex] !== undefined) {
                row.proofs[ctx.proofIndex] = newName;
                saveJson(LS_JOINED, joinedRows);
            }
        } else if (ctx.kind === 'assigned') {
            const a = completedAssigned.find((x) => x.id === ctx.assignmentId);
            if (a && a.uploadedProofs && a.uploadedProofs[ctx.proofIndex] !== undefined) {
                a.uploadedProofs[ctx.proofIndex] = newName;
            }
        }
        editProofContext = null;
        closeModal('modalEditProof');
        buildUploadedCards();
        renderJoinedTable();
    }

    function removeProofFile(kind, rowId, assignmentId, proofIndex) {
        if (!confirm('Remove this proof file from this event? Other proofs for the same event stay attached.')) return;
        if (kind === 'joined') {
            const row = joinedRows.find((r) => r._rowId === rowId);
            if (row && row.proofs) {
                row.proofs.splice(proofIndex, 1);
                saveJson(LS_JOINED, joinedRows);
            }
        } else if (kind === 'assigned') {
            const a = completedAssigned.find((x) => x.id === assignmentId);
            if (a && a.uploadedProofs) {
                a.uploadedProofs.splice(proofIndex, 1);
                a.proofUploaded = (a.uploadedProofs || []).length > 0;
            }
        }
        renderJoinedTable();
        renderAssignedTables();
        buildUploadedCards();
    }

    window.OhMyTrainings = { switchTab };
})();
