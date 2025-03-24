import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    Card,
    CardContent,
    CardMedia,
    Grid,
    Button,
    Chip,
} from '@mui/material';
import {
    AddCircle as AddCircleIcon,
    Brightness4 as Brightness4Icon,
    Favorite as FavoriteIcon,
    Comment as CommentIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useHappiness } from '../store/HappinessContext';
import AnimatedPage from '../components/AnimatedPage';
import Layout from '../components/Layout';

const emotionEmoji: Record<string, string> = {
    happy: '😊',
    excited: '🎉',
    satisfied: '😌',
    peaceful: '😇',
    grateful: '🙏',
};

const Home = () => {
    const navigate = useNavigate();
    const { records, continuousStreak } = useHappiness();
    const [selectedFilter, setSelectedFilter] = useState<string | null>(null);

    // 최근 레코드를 가져옴
    const recentRecords = [...records]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .filter(record => !selectedFilter || record.emotion === selectedFilter)
        .slice(0, 10);

    const filterOptions = [
        { value: 'happy', label: '😊 행복' },
        { value: 'excited', label: '🎉 신남' },
        { value: 'satisfied', label: '😌 만족' },
        { value: 'peaceful', label: '😇 평온' },
        { value: 'grateful', label: '🙏 감사' },
    ];

    return (
        <Layout>
            <AnimatedPage>
                <Box sx={{ mb: 4 }}>
                    {/* 연속 기록 배지 */}
                    {continuousStreak > 0 && (
                        <motion.div
                            initial={{ x: -100, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            <Card
                                sx={{
                                    mb: 2,
                                    backgroundColor: 'primary.main',
                                    color: 'white'
                                }}
                            >
                                <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Brightness4Icon sx={{ mr: 1 }} />
                                    <Typography variant="h6">
                                        {continuousStreak}일 연속 기록 중! 🔥
                                    </Typography>
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}

                    {/* 새 행복 기록하기 버튼 */}
                    <motion.div
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <Button
                            fullWidth
                            size="large"
                            variant="contained"
                            color="primary"
                            startIcon={<AddCircleIcon />}
                            onClick={() => navigate('/record')}
                            sx={{ mb: 3, py: 1.5 }}
                        >
                            오늘의 행복 기록하기
                        </Button>
                    </motion.div>

                    {/* 감정 필터 */}
                    <Box sx={{ mb: 3, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        <Chip
                            label="전체"
                            color={selectedFilter === null ? 'primary' : 'default'}
                            onClick={() => setSelectedFilter(null)}
                            sx={{ mb: 1 }}
                        />
                        {filterOptions.map(option => (
                            <Chip
                                key={option.value}
                                label={option.label}
                                color={selectedFilter === option.value ? 'primary' : 'default'}
                                onClick={() => setSelectedFilter(option.value)}
                                sx={{ mb: 1 }}
                            />
                        ))}
                    </Box>

                    {/* 행복 기록 목록 */}
                    {recentRecords.length > 0 ? (
                        <Grid container spacing={2}>
                            {recentRecords.map((record, index) => (
                                <Grid item xs={12} key={record.id}>
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                    >
                                        <Card
                                            onClick={() => navigate(`/view/${record.id}`)}
                                            sx={{
                                                cursor: 'pointer',
                                                '&:hover': { boxShadow: 3 },
                                                transition: 'box-shadow 0.3s',
                                            }}
                                        >
                                            <CardContent>
                                                <Box sx={{ display: 'flex', mb: 1, justifyContent: 'space-between' }}>
                                                    <Typography variant="subtitle2" color="text.secondary">
                                                        {new Date(record.createdAt).toLocaleDateString()}
                                                    </Typography>
                                                    <Typography variant="h6">
                                                        {emotionEmoji[record.emotion]}
                                                    </Typography>
                                                </Box>

                                                {record.imageUrl && (
                                                    <CardMedia
                                                        component="img"
                                                        alt="행복한 순간"
                                                        height="140"
                                                        image={record.imageUrl}
                                                        sx={{ borderRadius: 1, mb: 1 }}
                                                    />
                                                )}

                                                <Typography variant="body1" sx={{ mb: 1 }}>
                                                    {record.text.length > 100
                                                        ? `${record.text.substring(0, 100)}...`
                                                        : record.text}
                                                </Typography>

                                                <Box sx={{ display: 'flex', gap: 2 }}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                        <FavoriteIcon
                                                            fontSize="small"
                                                            color="error"
                                                            sx={{ mr: 0.5 }}
                                                        />
                                                        <Typography variant="body2">
                                                            {record.likes}
                                                        </Typography>
                                                    </Box>
                                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                        <CommentIcon
                                                            fontSize="small"
                                                            color="primary"
                                                            sx={{ mr: 0.5 }}
                                                        />
                                                        <Typography variant="body2">
                                                            {record.comments.length}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                </Grid>
                            ))}
                        </Grid>
                    ) : (
                        <Box sx={{ textAlign: 'center', py: 5 }}>
                            <Typography variant="h6" color="text.secondary" gutterBottom>
                                기록된 행복 순간이 없습니다.
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                '오늘의 행복 기록하기' 버튼을 눌러 행복했던 순간을 기록해보세요!
                            </Typography>
                        </Box>
                    )}
                </Box>
            </AnimatedPage>
        </Layout>
    );
};

export default Home; 