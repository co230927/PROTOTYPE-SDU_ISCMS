/**
 * Director recycle bin + persisted training assignments (localStorage prototype).
 */
(function (global) {
    const STORAGE = {
        RECYCLE: 'iscms_recycle_bin_v1',
        ASSIGNMENTS: 'iscms_director_assignments_v1'
    };

    const RecycleAction = {
        DELETED_ASSIGNED_TRAINING: 'DELETED_ASSIGNED_TRAINING',
        DELETED_STAFF_USER: 'DELETED_STAFF_USER',
        DELETED_TRAINING_PROOF: 'DELETED_TRAINING_PROOF',
        REJECTED_TRAINING_PROOF: 'REJECTED_TRAINING_PROOF'
    };

    const RecycleActionLabels = {
        DELETED_ASSIGNED_TRAINING: 'Deleted assigned training',
        DELETED_STAFF_USER: 'Deleted user (staff)',
        DELETED_TRAINING_PROOF: 'Deleted training proof',
        REJECTED_TRAINING_PROOF: 'Rejected training proof'
    };

    function readJson(key, fallback) {
        try {
            const raw = localStorage.getItem(key);
            if (raw == null) return fallback;
            const v = JSON.parse(raw);
            return v;
        } catch (e) {
            return fallback;
        }
    }

    function writeJson(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    }

    function getRecycleBin() {
        const arr = readJson(STORAGE.RECYCLE, []);
        return Array.isArray(arr) ? arr : [];
    }

    function setRecycleBin(items) {
        writeJson(STORAGE.RECYCLE, items);
    }

    function pushRecycleItem(entry) {
        const items = getRecycleBin();
        items.unshift(entry);
        setRecycleBin(items);
    }

    function removeRecycleItemById(id) {
        setRecycleBin(getRecycleBin().filter((x) => String(x.id) !== String(id)));
    }

    function getDirectorAssignments() {
        const arr = readJson(STORAGE.ASSIGNMENTS, null);
        return Array.isArray(arr) ? arr : null;
    }

    function setDirectorAssignments(assignments) {
        writeJson(STORAGE.ASSIGNMENTS, assignments);
    }

    function makeRecycleEntry(opts) {
        return {
            id: 'rb-' + Date.now() + '-' + Math.random().toString(36).slice(2, 9),
            actionType: opts.actionType,
            deletedAt: new Date().toISOString(),
            summary: opts.summary || '',
            payload: opts.payload != null ? opts.payload : null
        };
    }

    function formatRecycleWhen(iso) {
        if (!iso) return '—';
        const d = new Date(iso);
        if (isNaN(d.getTime())) return iso;
        return d.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit'
        });
    }

    function deepClone(o) {
        try {
            return JSON.parse(JSON.stringify(o));
        } catch (e) {
            return null;
        }
    }

    /** Restore one item from recycle bin into the appropriate store. */
    function restoreRecycleItem(entry) {
        if (!entry || !entry.actionType) return { ok: false, message: 'Invalid entry.' };

        switch (entry.actionType) {
            case RecycleAction.DELETED_ASSIGNED_TRAINING: {
                const assignment = deepClone(entry.payload);
                if (!assignment || assignment.trainingName == null) {
                    return { ok: false, message: 'Missing assignment payload.' };
                }
                const current = getDirectorAssignments();
                const list = Array.isArray(current) ? current.slice() : [];
                const exists = list.some((a) => String(a.id) === String(assignment.id));
                if (!exists) {
                    list.unshift(assignment);
                    setDirectorAssignments(list);
                }
                removeRecycleItemById(entry.id);
                return {
                    ok: true,
                    message: 'Assigned training restored to the Training Assignments board.'
                };
            }
            case RecycleAction.DELETED_STAFF_USER:
            case RecycleAction.DELETED_TRAINING_PROOF:
            case RecycleAction.REJECTED_TRAINING_PROOF:
                removeRecycleItemById(entry.id);
                return {
                    ok: true,
                    message:
                        entry.actionType === RecycleAction.DELETED_STAFF_USER
                            ? 'Staff removal cleared from recycle bin (prototype — directory not rewired).'
                            : entry.actionType === RecycleAction.REJECTED_TRAINING_PROOF
                              ? 'Rejected proof record cleared from recycle bin (prototype — queue not rewired).'
                              : 'Proof deletion cleared from recycle bin (prototype — proofs not rewired).'
                };
            default:
                return { ok: false, message: 'Unknown action type.' };
        }
    }

    global.RecycleBinStore = {
        STORAGE,
        RecycleAction,
        RecycleActionLabels,
        getRecycleBin,
        setRecycleBin,
        pushRecycleItem,
        removeRecycleItemById,
        getDirectorAssignments,
        setDirectorAssignments,
        makeRecycleEntry,
        formatRecycleWhen,
        restoreRecycleItem,
        purgeFiltered(actionFilter) {
            const items = getRecycleBin();
            if (actionFilter === 'ALL') {
                setRecycleBin([]);
                return items.length;
            }
            const next = items.filter((x) => x.actionType !== actionFilter);
            const removed = items.length - next.length;
            setRecycleBin(next);
            return removed;
        }
    };
})(typeof window !== 'undefined' ? window : globalThis);
