import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    Paper,
    IconButton,
    TextField,
    Button,
    Divider,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Avatar,
    Chip,
} from '@mui/material';
import {
    ArrowBack as ArrowBackIcon,
    Favorite as FavoriteIcon,
    Share as ShareIcon,
    Comment as CommentIcon,
    Send as SendIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useHappiness, Comment } from '../store/HappinessContext';
import AnimatedPage from '../components/AnimatedPage';
import Layout from '../components/Layout';

const emotionEmoji: Record<string, string> = {
    happy: '😊',
    excited: '🎉',
    satisfied: '😌',
    peaceful: '😇',
    grateful: '🙏',
};

const ViewHappiness = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { getRecord, likeRecord, addComment } = useHappiness();
    const [newComment, setNewComment] = useState('');
    const [author, setAuthor] = useState(() => localStorage.getItem('userName') || '사용자');

    const record = getRecord(id || '');

    useEffect(() => {
        if (!record) {
            // 레코드가 없으면 홈으로 리다이렉트
            navigate('/');
        }
    }, [record, navigate]);

    if (!record) {
        return null;
    }

    const handleLike = () => {
        likeRecord(record.id);
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: '오늘의 작은 행복',
                text: record.text,
                url: window.location.href,
            }).catch(err => {
                console.error('공유하기 실패:', err);
            });
        } else {
            alert('이 브라우저에서는 공유 기능을 지원하지 않습니다.');
        }
    };

    const handleSubmitComment = () => {
        if (newComment.trim()) {
            addComment(record.id, newComment, author);
            setNewComment('');
        }
    };

    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            weekday: 'long',
        });
    };

    const formatTime = (date: Date) => {
        return new Date(date).toLocaleTimeString('ko-KR', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <Layout>
            <AnimatedPage>
                <Box sx={{ p: 2, maxWidth: 600, mx: 'auto' }}>
                    <Box sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                        <IconButton onClick={() => navigate(-1)} sx={{ mr: 1 }}>
                            <ArrowBackIcon />
                        </IconButton>
                        <Typography variant="h6">행복 모먼트</Typography>
                    </Box>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Paper sx={{ p: 3, mb: 3 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                <Typography variant="subtitle2" color="text.secondary">
                                    {formatDate(record.createdAt)}
                                </Typography>
                                <Chip
                                    label={`${emotionEmoji[record.emotion]} ${record.emotion}`}
                                    size="small"
                                    sx={{ borderRadius: 1 }}
                                />
                            </Box>

                            {record.imageUrl && (
                                <Box sx={{ mb: 2 }}>
                                    <img
                                        src={record.imageUrl}
                                        alt="행복한 순간"
                                        style={{
                                            width: '100%',
                                            borderRadius: '8px',
                                            maxHeight: '300px',
                                            objectFit: 'cover',
                                        }}
                                    />
                                </Box>
                            )}

                            <Typography variant="body1" sx={{ mb: 3, whiteSpace: 'pre-line' }}>
                                {record.text}
                            </Typography>

                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Box sx={{ display: 'flex', gap: 2 }}>
                                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                        <IconButton color="error" onClick={handleLike}>
                                            <FavoriteIcon />
                                        </IconButton>
                                        <Typography variant="body2" component="span">
                                            {record.likes}
                                        </Typography>
                                    </motion.div>

                                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                        <IconButton color="primary" onClick={handleShare}>
                                            <ShareIcon />
                                        </IconButton>
                                    </motion.div>
                                </Box>

                                <Typography variant="body2" color="text.secondary">
                                    {formatTime(record.createdAt)}
                                </Typography>
                            </Box>
                        </Paper>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.3 }}
                    >
                        <Paper sx={{ p: 3 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <CommentIcon color="primary" sx={{ mr: 1 }} />
                                <Typography variant="h6">
                                    댓글 {record.comments.length}개
                                </Typography>
                            </Box>

                            <Divider sx={{ mb: 2 }} />

                            <Box sx={{ mb: 3 }}>
                                <TextField
                                    fullWidth
                                    multiline
                                    placeholder="댓글을 남겨보세요..."
                                    rows={2}
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    sx={{ mb: 1 }}
                                />
                                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        endIcon={<SendIcon />}
                                        onClick={handleSubmitComment}
                                        disabled={!newComment.trim()}
                                    >
                                        등록
                                    </Button>
                                </Box>
                            </Box>

                            {record.comments.length > 0 ? (
                                <List>
                                    {record.comments.map((comment, index) => (
                                        <motion.div
                                            key={comment.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.3 + index * 0.1, duration: 0.3 }}
                                        >
                                            <ListItem alignItems="flex-start" divider={index < record.comments.length - 1}>
                                                <ListItemAvatar>
                                                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                                                        {comment.author.slice(0, 1).toUpperCase()}
                                                    </Avatar>
                                                </ListItemAvatar>
                                                <ListItemText
                                                    primary={
                                                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                            <Typography variant="subtitle2">{comment.author}</Typography>
                                                            <Typography variant="caption" color="text.secondary">
                                                                {formatDate(comment.createdAt)}
                                                            </Typography>
                                                        </Box>
                                                    }
                                                    secondary={
                                                        <Typography
                                                            variant="body2"
                                                            color="text.primary"
                                                            sx={{ mt: 1, whiteSpace: 'pre-line' }}
                                                        >
                                                            {comment.text}
                                                        </Typography>
                                                    }
                                                />
                                            </ListItem>
                                        </motion.div>
                                    ))}
                                </List>
                            ) : (
                                <Box sx={{ textAlign: 'center', py: 4 }}>
                                    <Typography variant="body2" color="text.secondary">
                                        첫 번째 댓글을 남겨보세요!
                                    </Typography>
                                </Box>
                            )}
                        </Paper>
                    </motion.div>
                </Box>
            </AnimatedPage>
        </Layout>
    );
};

export default ViewHappiness; 