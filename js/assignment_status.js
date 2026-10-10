/**
 * Assignment status: pending → awaiting_proof → completed (certificate upload).
 * Legacy `proof_pending` values remain readable in stored records but are no longer written.
 */
(function (global) {
    const STATUS_MAP_KEY = 'iscms_assignment_status_v1';

    const POST_PENDING = ['awaiting_proof', 'proof_pending', 'completed'];

    function readMap() {
        try {
            return JSON.parse(localStorage.getItem(STATUS_MAP_KEY) || '{}');
        } catch (e) {
            return {};
        }
    }

    function writeMap(map) {
        localStorage.setItem(STATUS_MAP_KEY, JSON.stringify(map));
    }

    function getStatus(assignmentId) {
        return readMap()[assignmentId] || null;
    }

    function setStatus(assignmentId, status) {
        const map = readMap();
        map[assignmentId] = status;
        writeMap(map);
        syncTrainingEventsSeedPersonStatus(assignmentId, status);
    }

    function syncTrainingEventsSeedPersonStatus(assignmentId, status) {
        const m = /^(.+)-(\d+)$/.exec(String(assignmentId));
        const eventId = m && m[1];
        const personIndex = m ? parseInt(m[2], 10) : -1;
        if (typeof TRAINING_EVENTS_SEED !== 'undefined' && eventId) {
            const evt = TRAINING_EVENTS_SEED.find((e) => e.id === eventId);
            if (evt && evt.assignedPersons && evt.assignedPersons[personIndex]) {
                evt.assignedPersons[personIndex].status = status;
            }
        }

        try {
            const directorAssignments = JSON.parse(localStorage.getItem('iscms_director_assignments_v1') || '[]');
            directorAssignments.forEach((assignment) => {
                if (assignment.id === eventId && assignment.assignedPersons?.[personIndex]) {
                    assignment.assignedPersons[personIndex].status = status;
                }
            });
            const seedRows = typeof TRAINING_EVENTS_SEED !== 'undefined' ? TRAINING_EVENTS_SEED : [];
            const assignmentsById = new Map(directorAssignments.map((item) => [item.id, item]));
            const isSeedAssignment = seedRows.some((item) => item.id === eventId);
            if (isSeedAssignment) {
                seedRows.forEach((item) => {
                    if (!directorAssignments.length || assignmentsById.has(item.id) || item.id === eventId) {
                        assignmentsById.set(item.id, JSON.parse(JSON.stringify(item)));
                    }
                });
            }
            if (directorAssignments.length || isSeedAssignment) {
                localStorage.setItem('iscms_director_assignments_v1', JSON.stringify([...assignmentsById.values()]));
            }
        } catch (e) { /* ignore malformed prototype data */ }

        try {
            for (let index = 0; index < localStorage.length; index++) {
                const key = localStorage.key(index);
                if (!key || !key.startsWith('iscms_office_head_staff_assignments_v1_')) continue;
                const rows = JSON.parse(localStorage.getItem(key) || '[]');
                let changed = false;
                rows.forEach((item) => {
                    if (String(item.id) === String(assignmentId)) {
                        item.status = status;
                        changed = true;
                    }
                });
                if (changed) localStorage.setItem(key, JSON.stringify(rows));
            }
        } catch (e) { /* ignore malformed prototype data */ }
    }

    function resolveAssignmentIdForPerson(eventId, personName) {
        if (typeof TRAINING_EVENTS_SEED === 'undefined') return null;
        const evt = TRAINING_EVENTS_SEED.find((e) => e.id === eventId);
        if (!evt) return null;
        const idx = (evt.assignedPersons || []).findIndex((p) => p.name === personName);
        if (idx < 0) return null;
        return `${eventId}-${idx}`;
    }

    function markProofPending(assignmentId) {
        setStatus(assignmentId, 'proof_pending');
    }

    function markCompleted(assignmentId) {
        setStatus(assignmentId, 'completed');
    }

    function markAwaitingProof(assignmentId) {
        setStatus(assignmentId, 'awaiting_proof');
    }

    function markCompletedByProofAccept(staffName, trainingTitle) {
        (typeof TRAINING_EVENTS_SEED !== 'undefined' ? TRAINING_EVENTS_SEED : []).forEach((evt) => {
            if (String(evt.trainingName).trim() !== String(trainingTitle).trim()) return;
            (evt.assignedPersons || []).forEach((p, idx) => {
                if (p.name === staffName) {
                    setStatus(`${evt.id}-${idx}`, 'completed');
                }
            });
        });

        try {
            const directorAssignments = JSON.parse(localStorage.getItem('iscms_director_assignments_v1') || '[]');
            directorAssignments.forEach((assignment) => {
                if (String(assignment.trainingName).trim() !== String(trainingTitle).trim()) return;
                (assignment.assignedPersons || []).forEach((person, index) => {
                    if (person.name === staffName) setStatus(`${assignment.id}-${index}`, 'completed');
                });
            });
        } catch (e) { /* ignore malformed prototype data */ }

        try {
            for (let index = 0; index < localStorage.length; index++) {
                const key = localStorage.key(index);
                if (!key || !key.startsWith('iscms_office_head_staff_assignments_v1_')) continue;
                const assignments = JSON.parse(localStorage.getItem(key) || '[]');
                assignments.forEach((assignment) => {
                    if (assignment.staffName === staffName && String(assignment.name).trim() === String(trainingTitle).trim()) {
                        setStatus(assignment.id, 'completed');
                    }
                });
            }
        } catch (e) { /* ignore malformed prototype data */ }
    }

    function effectiveStatus(baseStatus, assignmentId) {
        const override = assignmentId ? getStatus(assignmentId) : null;
        if (override === 'completed') return 'completed';
        if (override) return applyOverdueStatus(override, assignmentId);
        const s = (baseStatus || 'pending').toLowerCase();
        return applyOverdueStatus(s, assignmentId);
    }

    function applyOverdueStatus(status, assignmentId) {
        if (status === 'completed' || status === 'cancelled' || !assignmentId) return status;
        const eventId = String(assignmentId).replace(/-\d+$/, '');
        let deadlineValue = (typeof TRAINING_EVENTS_SEED !== 'undefined' ? TRAINING_EVENTS_SEED : [])
            .find((item) => item.id === eventId)?.deadline;
        try {
            if (!deadlineValue) {
                const directorAssignments = JSON.parse(localStorage.getItem('iscms_director_assignments_v1') || '[]');
                deadlineValue = directorAssignments.find((item) => item.id === eventId)?.deadline;
            }
            if (!deadlineValue) {
                for (let index = 0; index < localStorage.length && !deadlineValue; index++) {
                    const key = localStorage.key(index);
                    if (!key || !key.startsWith('iscms_office_head_staff_assignments_v1_')) continue;
                    const assignments = JSON.parse(localStorage.getItem(key) || '[]');
                    deadlineValue = assignments.find((item) => String(item.id) === String(assignmentId))?.deadline;
                }
            }
        } catch (e) { /* ignore malformed prototype data */ }
        if (!deadlineValue) return status;
        const deadline = new Date(deadlineValue + 'T00:00:00');
        const overdueAt = new Date(deadline.getTime() + 7 * 24 * 60 * 60 * 1000);
        return new Date() > overdueAt ? 'overdue' : status;
    }

    function isPostPendingStatus(status) {
        return POST_PENDING.includes(status);
    }

    global.IscmsAssignmentStatus = {
        getStatus,
        setStatus,
        markProofPending,
        markCompleted,
        markAwaitingProof,
        markCompletedByProofAccept,
        resolveAssignmentIdForPerson,
        effectiveStatus,
        applyOverdueStatus,
        isPostPendingStatus,
        readMap
    };
})(typeof window !== 'undefined' ? window : globalThis);
