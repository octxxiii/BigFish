import { useState } from 'react';
import {
    Box,
    Typography,
    Switch,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Divider,
    Paper,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    TextField,
    Avatar,
} from '@mui/material';
import {
    Brightness4 as DarkModeIcon,
    Info as InfoIcon,
    Storage as StorageIcon,
    Help as HelpIcon,
    Delete as DeleteIcon,
    Person as PersonIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useHappiness } from '../store/HappinessContext';
import AnimatedPage from '../components/AnimatedPage';
import Layout from '../components/Layout';

interface ProfileProps {
    darkMode: boolean;
    setDarkMode: (mode: boolean) => void;
}

const Profile = ({ darkMode, setDarkMode }: ProfileProps) => {
    const { records } = useHappiness();
    const [userName, setUserName] = useState(() => localStorage.getItem('userName') || '사용자');
    const [openDialog, setOpenDialog] = useState(false);
    const [openNameDialog, setOpenNameDialog] = useState(false);
    const [inputName, setInputName] = useState(userName);

    // 총 기록 수
    const totalRecords = records.length;

    // 앱 정보
    const appVersion = 'v1.0.0';

    // 데이터 초기화 다이얼로그
    const handleOpenDialog = () => {
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const handleDataReset = () => {
        localStorage.clear();
        window.location.reload();
    };

    // 이름 변경 다이얼로그
    const handleOpenNameDialog = () => {
        setOpenNameDialog(true);
        setInputName(userName);
    };

    const handleCloseNameDialog = () => {
        setOpenNameDialog(false);
    };

    const handleNameChange = () => {
        if (inputName.trim()) {
            setUserName(inputName);
            localStorage.setItem('userName', inputName);
        }
        setOpenNameDialog(false);
    };

    return (
        <Layout>
            <AnimatedPage>
                <Box sx={{ maxWidth: 600, mx: 'auto', p: 2 }}>
                    <Paper sx={{ p: 3, mb: 3, textAlign: 'center' }}>
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Avatar
                                sx={{
                                    width: 80,
                                    height: 80,
                                    bgcolor: 'primary.main',
                                    fontSize: '2rem',
                                    mx: 'auto',
                                    mb: 2,
                                }}
                            >
                                {userName.slice(0, 1).toUpperCase()}
                            </Avatar>
                        </motion.div>

                        <Typography variant="h6" gutterBottom>
                            {userName}님, 안녕하세요!
                        </Typography>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                            지금까지 {totalRecords}개의 행복한 순간을 기록했어요.
                        </Typography>
                        <Button
                            variant="outlined"
                            size="small"
                            onClick={handleOpenNameDialog}
                            sx={{ mt: 1 }}
                        >
                            이름 변경
                        </Button>
                    </Paper>

                    <Paper sx={{ mb: 3 }}>
                        <List>
                            <ListItem>
                                <ListItemIcon>
                                    <DarkModeIcon />
                                </ListItemIcon>
                                <ListItemText
                                    primary="다크 모드"
                                    secondary="어두운 테마로 전환합니다"
                                />
                                <Switch
                                    edge="end"
                                    checked={darkMode}
                                    onChange={() => setDarkMode(!darkMode)}
                                />
                            </ListItem>
                            <Divider />
                            <ListItem>
                                <ListItemIcon>
                                    <InfoIcon />
                                </ListItemIcon>
                                <ListItemText
                                    primary="앱 버전"
                                    secondary={appVersion}
                                />
                            </ListItem>
                        </List>
                    </Paper>

                    <Paper sx={{ mb: 3 }}>
                        <List>
                            <ListItem>
                                <ListItemIcon>
                                    <PersonIcon />
                                </ListItemIcon>
                                <ListItemText
                                    primary="계정 정보"
                                    secondary="사용자 정보를 관리합니다"
                                />
                            </ListItem>
                            <Divider />
                            <ListItem>
                                <ListItemIcon>
                                    <StorageIcon />
                                </ListItemIcon>
                                <ListItemText
                                    primary="저장 공간"
                                    secondary={`${totalRecords}개의 항목이 저장되어 있습니다`}
                                />
                            </ListItem>
                            <Divider />
                            <ListItem>
                                <ListItemIcon>
                                    <HelpIcon />
                                </ListItemIcon>
                                <ListItemText
                                    primary="도움말"
                                    secondary="앱 사용 방법을 확인합니다"
                                />
                            </ListItem>
                        </List>
                    </Paper>

                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <Button
                            fullWidth
                            variant="outlined"
                            color="error"
                            startIcon={<DeleteIcon />}
                            onClick={handleOpenDialog}
                            sx={{ mt: 2 }}
                        >
                            데이터 초기화
                        </Button>
                    </motion.div>

                    {/* 데이터 초기화 확인 다이얼로그 */}
                    <Dialog
                        open={openDialog}
                        onClose={handleCloseDialog}
                    >
                        <DialogTitle>데이터 초기화</DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                모든 데이터가 영구적으로 삭제됩니다. 계속하시겠습니까?
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCloseDialog}>취소</Button>
                            <Button onClick={handleDataReset} color="error">
                                초기화
                            </Button>
                        </DialogActions>
                    </Dialog>

                    {/* 이름 변경 다이얼로그 */}
                    <Dialog
                        open={openNameDialog}
                        onClose={handleCloseNameDialog}
                    >
                        <DialogTitle>이름 변경</DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                새로운 이름을 입력해주세요.
                            </DialogContentText>
                            <TextField
                                autoFocus
                                margin="dense"
                                label="이름"
                                fullWidth
                                value={inputName}
                                onChange={(e) => setInputName(e.target.value)}
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCloseNameDialog}>취소</Button>
                            <Button onClick={handleNameChange} color="primary">
                                저장
                            </Button>
                        </DialogActions>
                    </Dialog>
                </Box>
            </AnimatedPage>
        </Layout>
    );
};

export default Profile; 