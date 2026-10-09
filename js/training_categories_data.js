/**
 * Training category CRUD (Director / Secretary).
 * Active categories feed all dropdowns across the prototype.
 */
(function (global) {
    const STORAGE_KEY = 'iscms_training_categories_v1';
    const DEFAULT_CATEGORIES = [
        'Community Organizing',
        'Project Management',
        'Peace Education & Advocacy',
        'Environmental Stewardship',
        'Cultural Heritage & Arts',
        'Health & Livelihood',
        'Leadership & Governance',
        'Data & Digital Literacy',
        'Other'
    ];

    function readAll() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (raw) {
                const parsed = JSON.parse(raw);
                if (Array.isArray(parsed) && parsed.length) return parsed;
            }
        } catch (e) { /* ignore */ }
        return DEFAULT_CATEGORIES.map((name, i) => ({
            id: 'cat-' + (i + 1),
            name,
            active: true,
            createdAt: new Date().toISOString()
        }));
    }

    function writeAll(list) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
        if (typeof refreshTrainingCategoriesFromStore === 'function') {
            refreshTrainingCategoriesFromStore();
        }
    }

    function slugify(name) {
        return String(name || '')
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '') || 'category';
    }

    const TrainingCategories = {
        getAll() {
            return readAll().slice().sort((a, b) => a.name.localeCompare(b.name));
        },
        getActive() {
            return readAll().filter((c) => c.active !== false);
        },
        getActiveNames() {
            return this.getActive().map((c) => c.name);
        },
        add(name) {
            const trimmed = String(name || '').trim();
            if (!trimmed) return { ok: false, error: 'empty' };
            const list = readAll();
            const exists = list.find((c) => c.name.toLowerCase() === trimmed.toLowerCase());
            if (exists) {
                if (exists.active === false) {
                    exists.active = true;
                    writeAll(list);
                    return { ok: true, item: exists, reactivated: true };
                }
                return { ok: false, error: 'duplicate' };
            }
            const item = {
                id: 'cat-' + Date.now(),
                name: trimmed,
                active: true,
                createdAt: new Date().toISOString()
            };
            list.push(item);
            writeAll(list);
            return { ok: true, item };
        },
        rename(id, newName) {
            const trimmed = String(newName || '').trim();
            if (!trimmed) return { ok: false, error: 'empty' };
            const list = readAll();
            const dup = list.find((c) => c.id !== id && c.name.toLowerCase() === trimmed.toLowerCase());
            if (dup) return { ok: false, error: 'duplicate' };
            const item = list.find((c) => c.id === id);
            if (!item) return { ok: false, error: 'not_found' };
            item.name = trimmed;
            writeAll(list);
            return { ok: true, item };
        },
        deactivate(id) {
            const list = readAll();
            const item = list.find((c) => c.id === id);
            if (!item) return { ok: false, error: 'not_found' };
            if (list.filter((c) => c.active !== false).length <= 1) {
                return { ok: false, error: 'last_active' };
            }
            item.active = false;
            item.deactivatedAt = new Date().toISOString();
            writeAll(list);
            return { ok: true, item };
        },
        reactivate(id) {
            const list = readAll();
            const item = list.find((c) => c.id === id);
            if (!item) return { ok: false, error: 'not_found' };
            item.active = true;
            delete item.deactivatedAt;
            writeAll(list);
            return { ok: true, item };
        }
    };

    global.TrainingCategories = TrainingCategories;
    global.DEFAULT_TRAINING_CATEGORIES = DEFAULT_CATEGORIES;
})(typeof window !== 'undefined' ? window : globalThis);
