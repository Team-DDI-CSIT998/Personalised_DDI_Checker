import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';

type NavItem = {
    to: string;
    icon: string;
    label: string;
};

interface SidebarProps {
    navItems: NavItem[];
    profile: {
        name: string;
        gender?: string;
        dob?: string;
        avatarUrl?: string;
    };
}

const Sidebar: React.FC<SidebarProps> = ({ navItems, profile }) => {
    const [collapsed, setCollapsed] = useState(false);

    const toggleSidebar = () => setCollapsed(prev => !prev);
    const profileClick = () => {
        // handle profile click if needed
    };

    return (
        <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
            <button className="sidebar-toggle" onClick={toggleSidebar}>
                <i className={`fas ${collapsed ? 'fa-angle-right' : 'fa-angle-left'}`} />
            </button>

            <div className="profile" onClick={profileClick}>
                <img src={profile.avatarUrl} alt="Avatar" />
                {!collapsed && (
                    <>
                        <h4>{profile.name}</h4>
                        {profile.gender && profile.dob && (
                            <p>
                                {profile.gender} | <span>{profile.dob}</span>
                            </p>
                        )}
                    </>
                )}
            </div>

            <nav className="sidebar-nav">
                {navItems.map(item => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        className={({ isActive }) =>
                            isActive ? 'nav-link active' : 'nav-link'
                        }
                    >
                        <i className={`fas ${item.icon}`} />
                        {!collapsed && <span>{item.label}</span>}
                    </NavLink>
                ))}
            </nav>
        </aside>
    );
};

// Patient sidebar items
const patientNavItems: NavItem[] = [
    { to: '/PatientPortal', icon: 'fa-tachometer-alt', label: 'Dashboard' },
    { to: '/medical-history', icon: 'fa-notes-medical', label: 'Medical History' },
    { to: '/patientLabResults/:patientId', icon: 'fa-flask', label: 'Lab Results' },
    { to: '/medications', icon: 'fa-pills', label: 'Prescriptions' },
    { to: '/appointments', icon: 'fa-calendar-alt', label: 'Appointments' },
    { to: '/logout', icon: 'fa-sign-out-alt', label: 'Log Out' },
];

// Doctor sidebar items
const doctorNavItems: NavItem[] = [
    { to: '/DoctorDashboard', icon: 'fa-tachometer-alt', label: 'Dashboard' },
    { to: '/patients', icon: 'fa-users', label: 'Patients' },
    { to: '/appointments', icon: 'fa-calendar-check', label: 'Appointments' },
    { to: '/lab-requests', icon: 'fa-vial', label: 'Lab Requests' },
    { to: '/prescriptions-review', icon: 'fa-prescription-bottle-alt', label: 'Prescriptions Review' },
    { to: '/logout', icon: 'fa-sign-out-alt', label: 'Log Out' },
];

export const PatientSidebar: React.FC = () => (
    <Sidebar
        navItems={patientNavItems}
        profile={{
            name: 'Jane Doe',
            gender: 'Female',
            dob: 'Jan 15 1989',
            avatarUrl: 'https://i.pravatar.cc/80',
        }}
    />
);

export const DocSidebar: React.FC = () => (
    <Sidebar
        navItems={doctorNavItems}
        profile={{ name: 'Dr. John Smith', avatarUrl: 'https://i.pravatar.cc/80' }}
    />
);

export default Sidebar;
