/**
 * Role context: Director, Office Head, Staff.
 */
(function (global) {
    const ROLE_KEY = 'iscms_session_role';
    const ROLE_SCRIPT_URL = document.currentScript && document.currentScript.src;

    function iscmsSetSessionRole(role) {
        try {
            sessionStorage.setItem(ROLE_KEY, role);
        } catch (e) { /* ignore */ }
    }

    function iscmsGetSessionRole() {
        try {
            return sessionStorage.getItem(ROLE_KEY) || '';
        } catch (e) {
            return '';
        }
    }

    function iscmsIsSecretary() {
        return iscmsGetSessionRole() === 'secretary';
    }

    function iscmsValidatePageRole() {
        const segments = location.pathname.split('/').filter(Boolean);
        const pageRole = segments.length > 1 ? segments[segments.length - 2].toLowerCase() : '';
        const role = iscmsGetSessionRole();
        const valid = pageRole === 'director'
            ? role === 'director'
            : pageRole === 'secretary'
                ? role === 'secretary'
                : pageRole === 'officehead'
                    ? role === 'office_head'
                    : pageRole === 'staff'
                        ? role === 'staff'
                        : true;

        if (!valid) {
            location.replace(new URL('../login_and_signup/login.html', location.href).href);
        }
        return valid;
    }

    function iscmsGetDirectorPageHref(page) {
        return location.pathname.split('/').some((segment) => segment.toLowerCase() === 'secretary')
            ? `../director/${page}`
            : page;
    }

    function iscmsIsDirectorOrSecretary() {
        const r = iscmsGetSessionRole();
        return r === 'director' || r === 'secretary' || (!r && !global.ISCMS_OFFICE_HEAD_CODE);
    }

    function iscmsDirectorDisplayTitle() {
        return iscmsIsSecretary() ? 'SECRETARY' : 'DIRECTOR';
    }

    function iscmsIsOfficeHeadPerson(name) {
        if (!name || typeof officeHeads === 'undefined') return false;
        const n = String(name).trim();
        return Object.keys(officeHeads).some((k) => officeHeads[k] === n);
    }

    function iscmsGetOfficeHeadNameForCode(officeCode) {
        if (typeof officeHeads === 'undefined' || !officeCode) return null;
        const code = String(officeCode).trim();
        return officeHeads[code] || officeHeads[code === 'SDU' ? 'SDU_ONLY' : code] || null;
    }

    function iscmsInjectDirectorNavExtras() {
        const nav = document.querySelector('aside.sidebar .nav-links');
        if (!nav || nav.dataset.iscmsNavExtended === '1') return;

        const profileLink = nav.querySelector('a[href="profile.html"], a[href="../director/profile.html"]');
        const insertBefore = profileLink || nav.lastElementChild;

        const items = [
            { page: 'my_trainings.html', label: 'My Trainings', icon: '../Img/Icon_training_assignments.png' },
            { page: 'training_evaluations.html', label: 'Training Evaluations', icon: '../Img/Icon_report.png' },
            { page: 'training_categories.html', label: 'Training Categories', icon: '../Img/Icon_report.png' },
            { page: 'knowledge_categories.html', label: 'Knowledge Categories', icon: '../Img/Icon_report.png' },
            { page: 'skill_categories.html', label: 'Competencies', icon: '../Img/Icon_directories.png' }
        ];

        items.forEach((item) => {
            const href = iscmsGetDirectorPageHref(item.page);
            if (nav.querySelector(`a[href="${href}"]`)) return;
            const a = document.createElement('a');
            a.href = href;
            a.className = 'nav-item';
            a.innerHTML = `<img src="${item.icon}" class="nav-icon"><span class="nav-label">${item.label}</span>`;
            nav.insertBefore(a, insertBefore);
        });
        nav.dataset.iscmsNavExtended = '1';
    }

    function iscmsInjectOfficeHeadNavExtras() {
        const nav = document.querySelector('aside.sidebar .nav-links');
        if (!nav || !global.ISCMS_OFFICE_HEAD_CODE || nav.dataset.iscmsOhNavExtended === '1') return;

        const profileLink = nav.querySelector('a[href="profile.html"]');
        const insertBefore = profileLink || nav.lastElementChild;

        const items = [];

        items.forEach((item) => {
            if (nav.querySelector(`a[href="${item.href}"]`)) return;
            const a = document.createElement('a');
            a.href = item.href;
            a.className = 'nav-item';
            a.innerHTML = `<img src="${item.icon}" class="nav-icon"><span class="nav-label">${item.label}</span>`;
            nav.insertBefore(a, insertBefore);
        });
        nav.dataset.iscmsOhNavExtended = '1';
    }

    function iscmsApplyRoleChrome() {
        const titleEl = document.querySelector('.sidebar-header .header-text h3');
        if (titleEl && iscmsIsSecretary()) {
            titleEl.textContent = 'SECRETARY';
        }
        if (document.body && document.body.closest && !global.ISCMS_OFFICE_HEAD_CODE) {
            if (iscmsIsSecretary()) document.body.classList.add('iscms-secretary');
        }
        const folder = location.pathname.split('/').filter(Boolean).slice(-2, -1)[0]?.toLowerCase();
        if (folder === 'officehead') {
            iscmsInjectOfficeHeadNavExtras();
        } else if (folder === 'director' || folder === 'secretary') {
            iscmsInjectDirectorNavExtras();
        }
    }

    function iscmsLoadNotifications() {
        if (document.getElementById('iscms-notifications-script')) return;
        const script = document.createElement('script');
        script.id = 'iscms-notifications-script';
        script.src = new URL('notifications.js', ROLE_SCRIPT_URL || location.href).href;
        document.head.appendChild(script);
    }

    global.iscmsSetSessionRole = iscmsSetSessionRole;
    global.iscmsGetSessionRole = iscmsGetSessionRole;
    global.iscmsIsSecretary = iscmsIsSecretary;
    global.iscmsIsDirectorOrSecretary = iscmsIsDirectorOrSecretary;
    global.iscmsDirectorDisplayTitle = iscmsDirectorDisplayTitle;
    global.iscmsIsOfficeHeadPerson = iscmsIsOfficeHeadPerson;
    global.iscmsGetOfficeHeadNameForCode = iscmsGetOfficeHeadNameForCode;
    global.iscmsApplyRoleChrome = iscmsApplyRoleChrome;
    global.iscmsInjectDirectorNavExtras = iscmsInjectDirectorNavExtras;
    global.iscmsInjectOfficeHeadNavExtras = iscmsInjectOfficeHeadNavExtras;
    global.iscmsLoadNotifications = iscmsLoadNotifications;
    global.iscmsValidatePageRole = iscmsValidatePageRole;

    const validPageRole = iscmsValidatePageRole();
    if (!global.__ISCMS_ROLE_LOGOUT_BOUND) {
        global.__ISCMS_ROLE_LOGOUT_BOUND = true;
        document.addEventListener('click', (event) => {
            const logoutLink = event.target.closest && event.target.closest('a.logout');
            if (logoutLink) sessionStorage.removeItem(ROLE_KEY);
        });
    }
    document.addEventListener('DOMContentLoaded', () => {
        if (!validPageRole) return;
        iscmsApplyRoleChrome();
        iscmsLoadNotifications();
    });
})(typeof window !== 'undefined' ? window : globalThis);
