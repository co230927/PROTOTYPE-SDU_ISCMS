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

    function iscmsBuildCatalogNavGroup() {
        const group = document.createElement('div');
        group.className = 'nav-group';
        group.setAttribute('data-nav-group', 'catalogs');

        const catalogItems = [
            { page: 'training_categories.html', label: 'Training Categories', icon: '../Img/Icon_report.png' },
            { page: 'knowledge_categories.html', label: 'Knowledge Categories', icon: '../Img/Icon_report.png' },
            { page: 'skill_categories.html', label: 'Competencies', icon: '../Img/Icon_directories.png' }
        ];
        const links = catalogItems.map((item) => {
            const href = iscmsGetDirectorPageHref(item.page);
            return `<a href="${href}" class="nav-item nav-subitem"><img src="${item.icon}" class="nav-icon"><span class="nav-label">${item.label}</span></a>`;
        }).join('');

        group.innerHTML = `<button type="button" class="nav-item nav-group-toggle"><img src="../Img/Icon_report.png" class="nav-icon"><span class="nav-label">Catalogs</span></button><div class="nav-group-items">${links}</div>`;
        return group;
    }

    function iscmsSetupCatalogNavGroups() {
        const groups = document.querySelectorAll('.nav-group[data-nav-group="catalogs"]');
        const current = (location.pathname.split('/').pop() || '').toLowerCase();
        groups.forEach((group) => {
            if (group.dataset.iscmsGroupBound !== '1') {
                group.dataset.iscmsGroupBound = '1';
                const toggle = group.querySelector('.nav-group-toggle');
                if (toggle) {
                    toggle.addEventListener('click', () => group.classList.toggle('open'));
                }
            }
            if (current && group.querySelector(`.nav-group-items a[href$="${current}"]`)) {
                group.classList.add('open');
            }
            if (group.querySelector('.nav-group-items a.active')) {
                group.classList.add('open');
            }
        });
    }

    function iscmsInjectDirectorNavExtras() {
        const nav = document.querySelector('aside.sidebar .nav-links');
        if (!nav || nav.dataset.iscmsNavExtended === '1') return;

        const profileLink = nav.querySelector('a[href="profile.html"], a[href="../director/profile.html"]');
        const insertBefore = profileLink || nav.lastElementChild;

        const items = [
            { page: 'my_trainings.html', label: 'My Trainings', icon: '../Img/Icon_training_assignments.png' },
            { page: 'training_evaluations.html', label: 'Training Evaluations', icon: '../Img/Icon_report.png' }
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

        if (!nav.querySelector('.nav-group[data-nav-group="catalogs"]')) {
            nav.insertBefore(iscmsBuildCatalogNavGroup(), insertBefore);
        }

        nav.dataset.iscmsNavExtended = '1';
        iscmsSetupCatalogNavGroups();
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
    global.iscmsSetupCatalogNavGroups = iscmsSetupCatalogNavGroups;
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
        iscmsSetupCatalogNavGroups();
        iscmsLoadNotifications();
    });
})(typeof window !== 'undefined' ? window : globalThis);
