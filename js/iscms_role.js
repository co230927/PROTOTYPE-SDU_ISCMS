/**
 * Role context: Director, Secretary (same access), Office Head, Staff.
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
            { href: 'training_categories.html', label: 'Categories', icon: '../Img/Icon_report.png' },
            { href: 'skill_categories.html', label: 'Skill Categories', icon: '../Img/Icon_directories.png' },
            { href: 'rate_office_heads.html', label: 'Rate Office Heads', icon: '../Img/Icon_directories.png' }
        ];

        items.forEach((item) => {
            if (nav.querySelector(`a[href="${item.href}"]`)) return;
            const a = document.createElement('a');
            a.href = item.href;
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

        const items = [
            { href: 'my_evaluation.html', label: 'My Evaluation', icon: '../Img/Icon_directories.png' }
        ];

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
        if (global.ISCMS_OFFICE_HEAD_CODE) {
            iscmsInjectOfficeHeadNavExtras();
        } else {
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

    document.addEventListener('DOMContentLoaded', () => {
        iscmsApplyRoleChrome();
        iscmsLoadNotifications();
    });
})(typeof window !== 'undefined' ? window : globalThis);
