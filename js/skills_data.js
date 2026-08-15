/**
 * Skills catalog and staff–skill mappings (prototype seed data).
 */
const SKILLS_CATALOG = [
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
    return SKILLS_CATALOG.find((s) => s.id === skillId) || null;
}

function getSkillName(skillId) {
    const skill = getSkillById(skillId);
    return skill ? skill.name : skillId;
}

function getSkillsForStaff(staffName) {
    const ids = STAFF_SKILLS[staffName] || [];
    return ids.map((id) => getSkillById(id)).filter(Boolean);
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

window.SKILLS_CATALOG = SKILLS_CATALOG;
window.STAFF_SKILLS = STAFF_SKILLS;
window.getSkillById = getSkillById;
window.getSkillName = getSkillName;
window.getSkillsForStaff = getSkillsForStaff;
window.getStaffBySkill = getStaffBySkill;
window.getStaffBySkillInOffice = getStaffBySkillInOffice;
window.getStaffSkillsInOffice = getStaffSkillsInOffice;
