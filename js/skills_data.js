/**
 * Competencies catalog, knowledge catalog, and staff mapping data (prototype seed data).
 */
const DEFAULT_SKILLS_CATALOG = [
    { id: 'public-speaking', name: 'Public Speaking', category: 'Communication' },
    { id: 'community-organizing', name: 'Community Organizing', category: 'Outreach' },
    { id: 'leadership', name: 'Leadership', category: 'Governance' },
    { id: 'project-management', name: 'Project Management', category: 'Operations' },
    { id: 'facilitation', name: 'Facilitation', category: 'Training' },
    { id: 'data-literacy', name: 'Data Literacy', category: 'Digital' },
    { id: 'peace-education', name: 'Peace Education', category: 'Advocacy' },
    { id: 'grant-writing', name: 'Grant Writing', category: 'Resource Mobilization' },
    { id: 'stakeholder-engagement', name: 'Stakeholder Engagement', category: 'Partnerships' },
    { id: 'monitoring-evaluation', name: 'Monitoring & Evaluation', category: 'Operations' }
];

const DEFAULT_KNOWLEDGE_CATALOG = [
    { id: 'community-development', name: 'Community Development', category: 'Field Practice' },
    { id: 'policy-analysis', name: 'Policy Analysis', category: 'Governance' },
    { id: 'participatory-learning', name: 'Participatory Learning', category: 'Education' },
    { id: 'program-ethics', name: 'Program Ethics', category: 'Governance' },
    { id: 'monitoring-frameworks', name: 'Monitoring Frameworks', category: 'Operations' },
    { id: 'stakeholder-mapping', name: 'Stakeholder Mapping', category: 'Partnerships' },
    { id: 'digital-records', name: 'Digital Records', category: 'Digital' },
    { id: 'resource-planning', name: 'Resource Planning', category: 'Operations' },
    { id: 'learning-design', name: 'Learning Design', category: 'Education' },
    { id: 'safeguarding', name: 'Safeguarding', category: 'Protection' }
];

const SKILL_CATEGORIES_STORAGE_KEY = 'iscms_skill_categories_v1';
const KNOWLEDGE_CATEGORIES_STORAGE_KEY = 'iscms_knowledge_categories_v1';

function readSkillCatalog() {
    try {
        const raw = localStorage.getItem(SKILL_CATEGORIES_STORAGE_KEY);
        if (raw) {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed) && parsed.length) return parsed;
        }
    } catch (e) { /* ignore */ }
    return DEFAULT_SKILLS_CATALOG.map((skill, i) => ({
        id: skill.id || 'skill-' + (i + 1),
        name: skill.name,
        category: skill.category || 'General',
        active: skill.active !== false,
        createdAt: new Date().toISOString()
    }));
}

function writeSkillCatalog(list) {
    localStorage.setItem(SKILL_CATEGORIES_STORAGE_KEY, JSON.stringify(list));
    if (typeof refreshSkillsCatalogFromStore === 'function') {
        refreshSkillsCatalogFromStore();
    }
}

function readKnowledgeCatalog() {
    try {
        const raw = localStorage.getItem(KNOWLEDGE_CATEGORIES_STORAGE_KEY);
        if (raw) {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed) && parsed.length) return parsed;
        }
    } catch (e) { /* ignore */ }
    return DEFAULT_KNOWLEDGE_CATALOG.map((item, i) => ({
        id: item.id || 'knowledge-' + (i + 1),
        name: item.name,
        category: item.category || 'General',
        active: item.active !== false,
        createdAt: new Date().toISOString()
    }));
}

function writeKnowledgeCatalog(list) {
    localStorage.setItem(KNOWLEDGE_CATEGORIES_STORAGE_KEY, JSON.stringify(list));
    if (typeof refreshKnowledgeCatalogFromStore === 'function') {
        refreshKnowledgeCatalogFromStore();
    }
}

function getSkillCatalogSnapshot() {
    return readSkillCatalog().slice().sort((a, b) => a.name.localeCompare(b.name));
}

function getKnowledgeCatalogSnapshot() {
    return readKnowledgeCatalog().slice().sort((a, b) => a.name.localeCompare(b.name));
}

function getActiveSkills() {
    return getSkillCatalogSnapshot().filter((skill) => skill.active !== false);
}

function getActiveKnowledge() {
    return getKnowledgeCatalogSnapshot().filter((item) => item.active !== false);
}

function refreshSkillsCatalogFromStore() {
    if (typeof window !== 'undefined') {
        window.SKILLS_CATALOG = getSkillCatalogSnapshot();
    }
}

function refreshKnowledgeCatalogFromStore() {
    if (typeof window !== 'undefined') {
        window.KNOWLEDGE_CATALOG = getKnowledgeCatalogSnapshot();
    }
}

const SKILLS_CATALOG = getSkillCatalogSnapshot();
const KNOWLEDGE_CATALOG = getKnowledgeCatalogSnapshot();

const SkillCategories = {
    getAll() {
        return getSkillCatalogSnapshot();
    },
    getActive() {
        return this.getAll().filter((skill) => skill.active !== false);
    },
    getActiveNames() {
        return this.getActive().map((skill) => skill.name);
    },
    addSkill(name) {
        const trimmed = String(name || '').trim();
        if (!trimmed) return { ok: false, error: 'empty' };
        const list = readSkillCatalog();
        const exists = list.find((skill) => skill.name.toLowerCase() === trimmed.toLowerCase());
        if (exists) {
            if (exists.active === false) {
                exists.active = true;
                writeSkillCatalog(list);
                return { ok: true, item: exists, reactivated: true };
            }
            return { ok: false, error: 'duplicate' };
        }
        const item = {
            id: 'skill-' + Date.now(),
            name: trimmed,
            category: 'General',
            active: true,
            createdAt: new Date().toISOString()
        };
        list.push(item);
        writeSkillCatalog(list);
        return { ok: true, item };
    },
    renameSkill(id, newName) {
        const trimmed = String(newName || '').trim();
        if (!trimmed) return { ok: false, error: 'empty' };
        const list = readSkillCatalog();
        const dup = list.find((skill) => skill.id !== id && skill.name.toLowerCase() === trimmed.toLowerCase());
        if (dup) return { ok: false, error: 'duplicate' };
        const item = list.find((skill) => skill.id === id);
        if (!item) return { ok: false, error: 'not_found' };
        item.name = trimmed;
        writeSkillCatalog(list);
        return { ok: true, item };
    },
    deactivateSkill(id) {
        const list = readSkillCatalog();
        const item = list.find((skill) => skill.id === id);
        if (!item) return { ok: false, error: 'not_found' };
        if (list.filter((skill) => skill.active !== false).length <= 1) {
            return { ok: false, error: 'last_active' };
        }
        item.active = false;
        item.deactivatedAt = new Date().toISOString();
        writeSkillCatalog(list);
        return { ok: true, item };
    },
    reactivateSkill(id) {
        const list = readSkillCatalog();
        const item = list.find((skill) => skill.id === id);
        if (!item) return { ok: false, error: 'not_found' };
        item.active = true;
        delete item.deactivatedAt;
        writeSkillCatalog(list);
        return { ok: true, item };
    }
};

const KnowledgeCategories = {
    getAll() {
        return getKnowledgeCatalogSnapshot();
    },
    getActive() {
        return this.getAll().filter((item) => item.active !== false);
    },
    getActiveNames() {
        return this.getActive().map((item) => item.name);
    },
    addKnowledge(name) {
        const trimmed = String(name || '').trim();
        if (!trimmed) return { ok: false, error: 'empty' };
        const list = readKnowledgeCatalog();
        const exists = list.find((item) => item.name.toLowerCase() === trimmed.toLowerCase());
        if (exists) {
            if (exists.active === false) {
                exists.active = true;
                writeKnowledgeCatalog(list);
                return { ok: true, item: exists, reactivated: true };
            }
            return { ok: false, error: 'duplicate' };
        }
        const item = {
            id: 'knowledge-' + Date.now(),
            name: trimmed,
            category: 'General',
            active: true,
            createdAt: new Date().toISOString()
        };
        list.push(item);
        writeKnowledgeCatalog(list);
        return { ok: true, item };
    },
    renameKnowledge(id, newName) {
        const trimmed = String(newName || '').trim();
        if (!trimmed) return { ok: false, error: 'empty' };
        const list = readKnowledgeCatalog();
        const dup = list.find((item) => item.id !== id && item.name.toLowerCase() === trimmed.toLowerCase());
        if (dup) return { ok: false, error: 'duplicate' };
        const item = list.find((entry) => entry.id === id);
        if (!item) return { ok: false, error: 'not_found' };
        item.name = trimmed;
        writeKnowledgeCatalog(list);
        return { ok: true, item };
    },
    deactivateKnowledge(id) {
        const list = readKnowledgeCatalog();
        const item = list.find((entry) => entry.id === id);
        if (!item) return { ok: false, error: 'not_found' };
        if (list.filter((entry) => entry.active !== false).length <= 1) {
            return { ok: false, error: 'last_active' };
        }
        item.active = false;
        item.deactivatedAt = new Date().toISOString();
        writeKnowledgeCatalog(list);
        return { ok: true, item };
    },
    reactivateKnowledge(id) {
        const list = readKnowledgeCatalog();
        const item = list.find((entry) => entry.id === id);
        if (!item) return { ok: false, error: 'not_found' };
        item.active = true;
        delete item.deactivatedAt;
        writeKnowledgeCatalog(list);
        return { ok: true, item };
    }
};

/** Staff name → skill id[] */
const STAFF_SKILLS = {
    'Carlos Miguel V. Tingson': ['leadership', 'public-speaking', 'facilitation', 'project-management'],
    'Elena Mae R. Castro': ['community-organizing', 'facilitation', 'stakeholder-engagement', 'peace-education'],
    'Gabriel H. Luna': ['data-literacy', 'project-management', 'monitoring-evaluation'],
    'Dorothy M. Ubag': ['leadership', 'public-speaking', 'grant-writing'],
    'Matthew C. Larracochea': ['data-literacy', 'facilitation'],
    'Sarah Jane F. Mendez': ['community-organizing', 'stakeholder-engagement'],
    'Jonathan D. Reyes': ['leadership', 'project-management', 'monitoring-evaluation'],
    'Patricia Ann S. Cruz': ['facilitation', 'public-speaking', 'peace-education'],
    'Ronaldo B. Victorio': ['community-organizing'],
    'Ismael G. Ibrahim': ['peace-education', 'public-speaking', 'leadership', 'stakeholder-engagement'],
    'Nur-Aisa J. Salim': ['community-organizing', 'facilitation'],
    'Kevin Lee B. Tan': ['data-literacy', 'project-management', 'grant-writing'],
    'Rosalinda C. Guerrero': ['community-organizing', 'leadership', 'stakeholder-engagement'],
    'Samuel D. Enriquez': ['facilitation', 'monitoring-evaluation'],
    'Beatrice G. Solis': ['grant-writing', 'project-management'],
    'Victoriano F. Santos': ['leadership', 'facilitation', 'monitoring-evaluation'],
    'Luzviminda M. Diaz': ['data-literacy', 'project-management'],
    'Fernando J. Mercado': ['public-speaking', 'stakeholder-engagement'],
    'Ricardo P. Alindayu': ['leadership', 'project-management', 'grant-writing'],
    'Bernadette C. Gonzales': ['facilitation', 'public-speaking', 'monitoring-evaluation', 'leadership'],
    'Mark Anthony S. Joven': ['data-literacy', 'community-organizing']
};

function getSkillById(skillId) {
    return getSkillCatalogSnapshot().find((skill) => skill.id === skillId) || null;
}

function getKnowledgeById(knowledgeId) {
    return getKnowledgeCatalogSnapshot().find((item) => item.id === knowledgeId) || null;
}

function getSkillName(skillId) {
    const skill = getSkillById(skillId);
    return skill ? skill.name : skillId;
}

function getKnowledgeName(knowledgeId) {
    const item = getKnowledgeById(knowledgeId);
    return item ? item.name : knowledgeId;
}

function getSkillsForStaff(staffName) {
    const ids = STAFF_SKILLS[staffName] || [];
    return ids.map((id) => getSkillById(id)).filter(Boolean);
}

const STAFF_KNOWLEDGE = {
    'Carlos Miguel V. Tingson': ['community-development', 'policy-analysis', 'participatory-learning'],
    'Elena Mae R. Castro': ['program-ethics', 'stakeholder-mapping', 'learning-design'],
    'Gabriel H. Luna': ['digital-records', 'monitoring-frameworks', 'resource-planning'],
    'Dorothy M. Ubag': ['community-development', 'safeguarding', 'stakeholder-mapping'],
    'Matthew C. Larracochea': ['participatory-learning', 'resource-planning'],
    'Sarah Jane F. Mendez': ['stakeholder-mapping', 'community-development'],
    'Jonathan D. Reyes': ['monitoring-frameworks', 'policy-analysis'],
    'Patricia Ann S. Cruz': ['participatory-learning', 'learning-design'],
    'Ronaldo B. Victorio': ['program-ethics'],
    'Ismael G. Ibrahim': ['policy-analysis', 'community-development', 'safeguarding'],
    'Nur-Aisa J. Salim': ['stakeholder-mapping', 'participatory-learning'],
    'Kevin Lee B. Tan': ['digital-records', 'resource-planning'],
    'Rosalinda C. Guerrero': ['community-development', 'policy-analysis'],
    'Samuel D. Enriquez': ['learning-design', 'monitoring-frameworks'],
    'Beatrice G. Solis': ['resource-planning', 'stakeholder-mapping'],
    'Victoriano F. Santos': ['program-ethics', 'learning-design'],
    'Luzviminda M. Diaz': ['digital-records', 'monitoring-frameworks'],
    'Fernando J. Mercado': ['community-development', 'stakeholder-mapping'],
    'Ricardo P. Alindayu': ['policy-analysis', 'resource-planning'],
    'Bernadette C. Gonzales': ['participatory-learning', 'safeguarding', 'learning-design'],
    'Mark Anthony S. Joven': ['digital-records', 'community-development']
};

function getKnowledgeForStaff(staffName) {
    const ids = STAFF_KNOWLEDGE[staffName] || [];
    return ids.map((id) => getKnowledgeById(id)).filter(Boolean);
}

function resolveStaffOffice(name) {
    if (typeof officeData !== 'undefined' && officeData && Array.isArray(officeData.TOTAL_STAFF)) {
        const row = officeData.TOTAL_STAFF.find((s) => s && s.name === name);
        if (row) return row.office;
    }
    return '—';
}

function normalizeSkillOfficeCode(code) {
    const c = String(code || '').trim().toUpperCase();
    if (c === 'SDU_ONLY') return 'SDU';
    return c;
}

function getStaffBySkill(skillId) {
    const results = [];
    Object.keys(STAFF_SKILLS).forEach((name) => {
        if ((STAFF_SKILLS[name] || []).includes(skillId)) {
            results.push({
                name,
                office: resolveStaffOffice(name),
                skills: (STAFF_SKILLS[name] || []).map(getSkillName)
            });
        }
    });
    return results.sort((a, b) => a.name.localeCompare(b.name));
}

/** Staff with a skill limited to one office (Office Head scope). */
function getStaffBySkillInOffice(skillId, officeCode) {
    const code = normalizeSkillOfficeCode(officeCode);
    return getStaffBySkill(skillId).filter((row) => normalizeSkillOfficeCode(row.office) === code);
}

/** All staff in an office with their skill badges (for OH Staff Skills directory view). */
function getStaffSkillsInOffice(officeCode) {
    const code = normalizeSkillOfficeCode(officeCode);
    const results = [];
    if (typeof officeData === 'undefined' || !officeData) return results;
    let staffList = officeData[code] || officeData[officeCode] || [];
    if ((!staffList || !staffList.length) && code === 'SDU') {
        staffList = officeData.SDU_ONLY || [];
    }
    (Array.isArray(staffList) ? staffList : []).forEach((s) => {
        if (!s || !s.name) return;
        results.push({
            name: s.name,
            office: s.office || code,
            skills: getSkillsForStaff(s.name)
        });
    });
    return results.sort((a, b) => a.name.localeCompare(b.name));
}

window.DEFAULT_SKILLS_CATALOG = DEFAULT_SKILLS_CATALOG;
window.DEFAULT_KNOWLEDGE_CATALOG = DEFAULT_KNOWLEDGE_CATALOG;
window.SKILL_CATEGORIES_STORAGE_KEY = SKILL_CATEGORIES_STORAGE_KEY;
window.KNOWLEDGE_CATEGORIES_STORAGE_KEY = KNOWLEDGE_CATEGORIES_STORAGE_KEY;
window.SKILLS_CATALOG = SKILLS_CATALOG;
window.KNOWLEDGE_CATALOG = KNOWLEDGE_CATALOG;
window.SkillCategories = SkillCategories;
window.KnowledgeCategories = KnowledgeCategories;
window.STAFF_SKILLS = STAFF_SKILLS;
window.getActiveSkills = getActiveSkills;
window.getActiveKnowledge = getActiveKnowledge;
window.getSkillById = getSkillById;
window.getSkillName = getSkillName;
window.getKnowledgeById = getKnowledgeById;
window.getKnowledgeName = getKnowledgeName;
window.getSkillsForStaff = getSkillsForStaff;
window.getKnowledgeForStaff = getKnowledgeForStaff;
window.getStaffBySkill = getStaffBySkill;
window.getStaffBySkillInOffice = getStaffBySkillInOffice;
window.getStaffSkillsInOffice = getStaffSkillsInOffice;
window.refreshSkillsCatalogFromStore = refreshSkillsCatalogFromStore;
window.refreshKnowledgeCatalogFromStore = refreshKnowledgeCatalogFromStore;
