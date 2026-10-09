/**
 * Assignment status: pending → awaiting_proof → proof_pending → completed (review accept only).
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
        if (typeof TRAINING_EVENTS_SEED === 'undefined') return;
        const m = /^(.+)-(\d+)$/.exec(String(assignmentId));
        if (!m) return;
        const eventId = m[1];
        const personIndex = parseInt(m[2], 10);
        const evt = TRAINING_EVENTS_SEED.find((e) => e.id === eventId);
        if (!evt || !evt.assignedPersons || !evt.assignedPersons[personIndex]) return;
        if (status === 'completed') {
            evt.assignedPersons[personIndex].status = 'completed';
        } else if (status === 'proof_pending' || status === 'awaiting_proof') {
            evt.assignedPersons[personIndex].status = status;
        } else if (status === 'pending') {
            evt.assignedPersons[personIndex].status = 'pending';
        } else if (status === 'cancelled') {
            evt.assignedPersons[personIndex].status = 'cancelled';
        }
        if (typeof RecycleBinStore !== 'undefined') {
            RecycleBinStore.setDirectorAssignments(
                TRAINING_EVENTS_SEED.map((e) => JSON.parse(JSON.stringify(e)))
            );
        }
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

    function markAwaitingProof(assignmentId) {
        setStatus(assignmentId, 'awaiting_proof');
    }

    function markCompletedByProofAccept(staffName, trainingTitle) {
        if (typeof TRAINING_EVENTS_SEED === 'undefined') return;
        TRAINING_EVENTS_SEED.forEach((evt) => {
            if (String(evt.trainingName).trim() !== String(trainingTitle).trim()) return;
            (evt.assignedPersons || []).forEach((p, idx) => {
                if (p.name === staffName) {
                    setStatus(`${evt.id}-${idx}`, 'completed');
                }
            });
        });
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
        if (typeof TRAINING_EVENTS_SEED === 'undefined') return status;
        const eventId = String(assignmentId).replace(/-\d+$/, '');
        const event = TRAINING_EVENTS_SEED.find((item) => item.id === eventId);
        if (!event || !event.deadline) return status;
        const deadline = new Date(event.deadline + 'T00:00:00');
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
        markAwaitingProof,
        markCompletedByProofAccept,
        resolveAssignmentIdForPerson,
        effectiveStatus,
        applyOverdueStatus,
        isPostPendingStatus,
        readMap
    };
})(typeof window !== 'undefined' ? window : globalThis);
