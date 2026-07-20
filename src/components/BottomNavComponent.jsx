import { Link, useLocation } from 'react-router-dom';
import { House, HouseFill, PlusCircle, PlusCircleFill, Grid3x3Gap, Grid3x3GapFill, Calendar3, Calendar3Fill } from 'react-bootstrap-icons';

const BottomNavComponent = () => {
    const location = useLocation();

    if (location.pathname.substring(1, 6) === 'admin') {
        return null;
    }

    const isHome = location.pathname.startsWith('/home');
    const isAdd = location.pathname === '/myhome/stamp/add';
    const isStamp = location.pathname.startsWith('/myhome/stamp') && !isAdd;
    const isCalendar = location.pathname.startsWith('/calendar');

    const tabs = [
        { to: '/home', label: '홈', active: isHome, Icon: House, ActiveIcon: HouseFill },
        { to: '/myhome/stamp/add', label: '도장추가', active: isAdd, Icon: PlusCircle, ActiveIcon: PlusCircleFill },
        { to: '/myhome/stamp', label: '도장판', active: isStamp, Icon: Grid3x3Gap, ActiveIcon: Grid3x3GapFill },
        { to: '/calendar', label: '달력', active: isCalendar, Icon: Calendar3, ActiveIcon: Calendar3Fill },
    ];

    return (
        <nav className="bottom-nav">
            <div className="bottom-nav-wrap">
                {tabs.map(({ to, label, active, Icon, ActiveIcon }) => {
                    const TabIcon = active ? ActiveIcon : Icon;
                    return (
                        <Link key={to} to={to} className={`bottom-nav-item${active ? ' active' : ''}`}>
                            <TabIcon size={22} />
                            <span>{label}</span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
};

export default BottomNavComponent;
