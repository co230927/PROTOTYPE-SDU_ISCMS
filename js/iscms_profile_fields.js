/**
 * Employment status & job function options (prototype profile fields).
 */
(function (global) {
    const PROFILE_EXTRAS_KEY = 'iscms_profile_extras_v1';

    const EMPLOYMENT_STATUS_OPTIONS = [
        'Regular/Permanent',
        'Probationary',
        'Contractual/Fixed-Term'
    ];

    const JOB_FUNCTION_STAFF = [
        'Program Officer',
        'Admin Officer'
    ];

    const JOB_FUNCTION_OFFICE_HEAD = [
        'Director-Office Head'
    ];

    const JOB_FUNCTION_DIRECTOR = [
        'Unit Director'
    ];

    function readExtrasMap() {
        try {
            return JSON.parse(localStorage.getItem(PROFILE_EXTRAS_KEY) || '{}');
        } catch (e) {
            return {};
        }
    }

    function writeExtrasMap(map) {
        localStorage.setItem(PROFILE_EXTRAS_KEY, JSON.stringify(map));
    }

    function profileKeyForUser(displayName, role) {
        return `${String(role || 'staff').toLowerCase()}::${String(displayName || '').trim()}`;
    }

    function getProfileExtras(displayName, role) {
        const map = readExtrasMap();
        const key = profileKeyForUser(displayName, role);
        const defaults = {
            employmentStatus: 'Regular/Permanent',
            jobFunction: role === 'director' || role === 'secretary'
                ? 'Unit Director'
                : role === 'office_head'
                    ? 'Director-Office Head'
                    : 'Program Officer'
        };
        return { ...defaults, ...(map[key] || {}) };
    }

    function saveProfileExtras(displayName, role, fields) {
        const map = readExtrasMap();
        const key = profileKeyForUser(displayName, role);
        map[key] = {
            employmentStatus: fields.employmentStatus || 'Regular/Permanent',
            jobFunction: fields.jobFunction || ''
        };
        writeExtrasMap(map);
        return map[key];
    }

    function jobFunctionOptionsForRole(role) {
        if (role === 'director' || role === 'secretary') return JOB_FUNCTION_DIRECTOR.slice();
        if (role === 'office_head') return JOB_FUNCTION_OFFICE_HEAD.slice();
        return JOB_FUNCTION_STAFF.slice();
    }

    global.ISCMS_EMPLOYMENT_STATUS_OPTIONS = EMPLOYMENT_STATUS_OPTIONS;
    global.ISCMS_JOB_FUNCTION_STAFF = JOB_FUNCTION_STAFF;
    global.ISCMS_JOB_FUNCTION_OFFICE_HEAD = JOB_FUNCTION_OFFICE_HEAD;
    global.ISCMS_JOB_FUNCTION_DIRECTOR = JOB_FUNCTION_DIRECTOR;
    global.getProfileExtras = getProfileExtras;
    global.saveProfileExtras = saveProfileExtras;
    global.jobFunctionOptionsForRole = jobFunctionOptionsForRole;
})(typeof window !== 'undefined' ? window : globalThis);
