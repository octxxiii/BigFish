import { useState } from 'react';
import {
    Box,
    Typography,
    Paper,
    Grid,
    Tabs,
    Tab,
    IconButton,
} from '@mui/material';
import {
    ChevronLeft as ChevronLeftIcon,
    ChevronRight as ChevronRightIcon,
    CalendarMonth as CalendarMonthIcon,
    BarChart as BarChartIcon,
} from '@mui/icons-material';
import { useHappiness } from '../store/HappinessContext';
import AnimatedPage from '../components/AnimatedPage';
import Layout from '../components/Layout';
import { motion } from 'framer-motion';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

const TabPanel = (props: TabPanelProps) => {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && <Box>{children}</Box>}
        </div>
    );
};

const emotionEmoji: Record<string, string> = {
    happy: '😊',
    excited: '🎉',
    satisfied: '😌',
    peaceful: '😇',
    grateful: '🙏',
};

const Calendar = () => {
    const { records } = useHappiness();
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [tabValue, setTabValue] = useState(0);

    const months = [
        '1월', '2월', '3월', '4월', '5월', '6월',
        '7월', '8월', '9월', '10월', '11월', '12월'
    ];

    const handlePrevMonth = () => {
        if (currentMonth === 0) {
            setCurrentMonth(11);
            setCurrentYear(prev => prev - 1);
        } else {
            setCurrentMonth(prev => prev - 1);
        }
    };

    const handleNextMonth = () => {
        if (currentMonth === 11) {
            setCurrentMonth(0);
            setCurrentYear(prev => prev + 1);
        } else {
            setCurrentMonth(prev => prev + 1);
        }
    };

    // 현재 월의 일 수 계산
    const getDaysInMonth = (year: number, month: number) => {
        return new Date(year, month + 1, 0).getDate();
    };

    // 현재 월의 첫 번째 날의 요일 계산 (0: 일요일, 1: 월요일, ...)
    const getFirstDayOfMonth = (year: number, month: number) => {
        return new Date(year, month, 1).getDay();
    };

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    const renderCalendar = () => {
        const daysInMonth = getDaysInMonth(currentYear, currentMonth);
        const firstDayOfMonth = getFirstDayOfMonth(currentYear, currentMonth);

        const days = [];

        // 이전 달의 일 추가 (빈 셀)
        for (let i = 0; i < firstDayOfMonth; i++) {
            days.push(<Grid item xs={1.7} key={`empty-prev-${i}`} />);
        }

        // 현재 달의 일 추가
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(currentYear, currentMonth, day);
            const dateString = date.toISOString().split('T')[0];

            // 해당 날짜의 감정 레코드 찾기
            const dayRecords = records.filter(record => {
                const recordDate = new Date(record.createdAt);
                return (
                    recordDate.getDate() === day &&
                    recordDate.getMonth() === currentMonth &&
                    recordDate.getFullYear() === currentYear
                );
            });

            days.push(
                <Grid item xs={1.7} key={day}>
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Paper
                            sx={{
                                height: 60,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: dayRecords.length > 0 ? 'pointer' : 'default',
                                border: '1px solid',
                                borderColor: 'divider',
                                bgcolor: 'background.paper',
                                position: 'relative',
                            }}
                        >
                            <Typography
                                variant="body2"
                                sx={{
                                    fontWeight:
                                        new Date().getDate() === day &&
                                            new Date().getMonth() === currentMonth &&
                                            new Date().getFullYear() === currentYear
                                            ? 'bold'
                                            : 'normal',
                                }}
                            >
                                {day}
                            </Typography>

                            {dayRecords.length > 0 && (
                                <Box
                                    sx={{
                                        fontSize: '1.2rem',
                                        position: 'absolute',
                                        bottom: 5
                                    }}
                                >
                                    {emotionEmoji[dayRecords[0].emotion]}
                                </Box>
                            )}
                        </Paper>
                    </motion.div>
                </Grid>
            );
        }

        return days;
    };

    return (
        <Layout>
            <AnimatedPage>
                <Box sx={{ p: 2, maxWidth: 600, mx: 'auto' }}>
                    <Paper sx={{ p: 2, mb: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <IconButton onClick={handlePrevMonth}>
                                <ChevronLeftIcon />
                            </IconButton>
                            <Typography variant="h6" sx={{ flex: 1, textAlign: 'center' }}>
                                {currentYear}년 {months[currentMonth]}
                            </Typography>
                            <IconButton onClick={handleNextMonth}>
                                <ChevronRightIcon />
                            </IconButton>
                        </Box>

                        <Tabs
                            value={tabValue}
                            onChange={handleTabChange}
                            variant="fullWidth"
                            sx={{ borderBottom: 1, borderColor: 'divider' }}
                        >
                            <Tab
                                icon={<CalendarMonthIcon />}
                                label="달력"
                                sx={{ py: 2 }}
                            />
                            <Tab
                                icon={<BarChartIcon />}
                                label="통계"
                                sx={{ py: 2 }}
                            />
                        </Tabs>

                        <Box sx={{ p: 2 }}>
                            <TabPanel value={tabValue} index={0}>
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <Grid container spacing={1} columns={12}>
                                        {['일', '월', '화', '수', '목', '금', '토'].map((day) => (
                                            <Grid item xs={1.7} key={day}>
                                                <Typography
                                                    variant="caption"
                                                    align="center"
                                                    sx={{
                                                        display: 'block',
                                                        mb: 1,
                                                        color: 'text.secondary',
                                                        fontWeight: 500,
                                                    }}
                                                >
                                                    {day}
                                                </Typography>
                                            </Grid>
                                        ))}
                                        {renderCalendar()}
                                    </Grid>
                                </motion.div>
                            </TabPanel>
                            <TabPanel value={tabValue} index={1}>
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <Box sx={{ py: 2, textAlign: 'center' }}>
                                        <Typography variant="h6" gutterBottom>
                                            감정 통계
                                        </Typography>
                                        {records.length === 0 ? (
                                            <Typography variant="body2" color="text.secondary">
                                                통계를 보려면 먼저 행복 순간을 기록해주세요.
                                            </Typography>
                                        ) : (
                                            <Box>
                                                {/* 여기에 통계 차트를 추가할 수 있습니다 */}
                                                <Typography variant="body2" color="text.secondary">
                                                    이번 달에 기록한 행복 순간: {records.filter(record => {
                                                        const recordDate = new Date(record.createdAt);
                                                        return (
                                                            recordDate.getMonth() === currentMonth &&
                                                            recordDate.getFullYear() === currentYear
                                                        );
                                                    }).length}개
                                                </Typography>
                                            </Box>
                                        )}
                                    </Box>
                                </motion.div>
                            </TabPanel>
                        </Box>
                    </Paper>
                </Box>
            </AnimatedPage>
        </Layout>
    );
};

export default Calendar; 