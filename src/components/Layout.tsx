import { ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    Box,
    AppBar,
    Toolbar,
    Typography,
    BottomNavigation,
    BottomNavigationAction,
    Paper,
} from '@mui/material';
import {
    Home as HomeIcon,
    AddCircle as AddCircleIcon,
    CalendarMonth as CalendarIcon,
    Person as PersonIcon,
} from '@mui/icons-material';

interface LayoutProps {
    children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
    const navigate = useNavigate();
    const location = useLocation();

    const getActiveRoute = () => {
        const pathname = location.pathname;
        if (pathname === '/') return 0;
        if (pathname === '/record') return 1;
        if (pathname === '/calendar') return 2;
        if (pathname === '/profile') return 3;
        return 0; // Default to home
    };

    return (
        <Box sx={{ pb: 7, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <AppBar position="static" color="primary">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        오늘의 작은 행복
                    </Typography>
                </Toolbar>
            </AppBar>

            <Box sx={{ flexGrow: 1, overflow: 'auto', p: 2 }}>
                {children}
            </Box>

            <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
                <BottomNavigation
                    showLabels
                    value={getActiveRoute()}
                    onChange={(_, newValue) => {
                        switch (newValue) {
                            case 0:
                                navigate('/');
                                break;
                            case 1:
                                navigate('/record');
                                break;
                            case 2:
                                navigate('/calendar');
                                break;
                            case 3:
                                navigate('/profile');
                                break;
                            default:
                                navigate('/');
                        }
                    }}
                >
                    <BottomNavigationAction label="홈" icon={<HomeIcon />} />
                    <BottomNavigationAction label="기록" icon={<AddCircleIcon />} />
                    <BottomNavigationAction label="달력" icon={<CalendarIcon />} />
                    <BottomNavigationAction label="프로필" icon={<PersonIcon />} />
                </BottomNavigation>
            </Paper>
        </Box>
    );
};

export default Layout; 