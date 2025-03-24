import { useState, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Button,
    TextField,
    Typography,
    Paper,
    FormControl,
    RadioGroup,
    FormControlLabel,
    Radio,
    IconButton,
    Alert,
} from '@mui/material';
import {
    CameraAlt as CameraIcon,
    ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useHappiness } from '../store/HappinessContext';
import AnimatedPage from '../components/AnimatedPage';
import Layout from '../components/Layout';

// 표정 옵션 정의
const emotionOptions = [
    { value: 'happy', label: '😊 행복해요', description: '기분이 좋고 행복한 느낌' },
    { value: 'excited', label: '🎉 신나요', description: '활기차고 흥분된 느낌' },
    { value: 'satisfied', label: '😌 만족해요', description: '성취감과 만족스러운 느낌' },
    { value: 'peaceful', label: '😇 평온해요', description: '조용하고 안정된 느낌' },
    { value: 'grateful', label: '🙏 감사해요', description: '고마움과 감사한 느낌' },
];

const RecordHappiness = () => {
    const navigate = useNavigate();
    const { addRecord } = useHappiness();

    const [text, setText] = useState('');
    const [emotion, setEmotion] = useState<'happy' | 'excited' | 'satisfied' | 'peaceful' | 'grateful'>('happy');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    // 텍스트 입력 처리
    const handleTextChange = (e: ChangeEvent<HTMLInputElement>) => {
        setText(e.target.value);
    };

    // 감정 선택 처리
    const handleEmotionChange = (e: ChangeEvent<HTMLInputElement>) => {
        setEmotion(e.target.value as 'happy' | 'excited' | 'satisfied' | 'peaceful' | 'grateful');
    };

    // 이미지 파일 처리
    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImageFile(file);

            // 이미지 미리보기 생성
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    // 저장 처리
    const handleSubmit = () => {
        if (!text.trim()) {
            setError('행복했던 순간에 대한 내용을 입력해주세요.');
            return;
        }

        try {
            const recordData = {
                text,
                emotion,
                imageUrl: imagePreview,
            };

            addRecord(recordData);
            navigate('/');
        } catch (err) {
            setError('기록을 저장하는 중 오류가 발생했습니다.');
            console.error(err);
        }
    };

    return (
        <Layout>
            <AnimatedPage>
                <Box sx={{ p: 2, maxWidth: 600, mx: 'auto' }}>
                    <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                        <IconButton onClick={() => navigate(-1)} sx={{ mr: 1 }}>
                            <ArrowBackIcon />
                        </IconButton>
                        <Typography variant="h6">오늘의 행복 기록하기</Typography>
                    </Box>

                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}

                    <Paper sx={{ p: 2, mb: 3 }}>
                        <Typography variant="subtitle1" gutterBottom sx={{ mb: 2 }}>
                            기분 선택
                        </Typography>
                        <FormControl component="fieldset">
                            <RadioGroup
                                value={emotion}
                                onChange={handleEmotionChange}
                            >
                                {emotionOptions.map((option) => (
                                    <motion.div
                                        key={option.value}
                                        whileHover={{ scale: 1.01 }}
                                        whileTap={{ scale: 0.99 }}
                                    >
                                        <Paper
                                            sx={{
                                                p: 1,
                                                my: 1,
                                                border: emotion === option.value ? 2 : 1,
                                                borderColor: emotion === option.value ? 'primary.main' : 'divider',
                                            }}
                                        >
                                            <FormControlLabel
                                                value={option.value}
                                                control={<Radio />}
                                                label={
                                                    <Box>
                                                        <Typography variant="body1">{option.label}</Typography>
                                                        <Typography variant="body2" color="text.secondary">
                                                            {option.description}
                                                        </Typography>
                                                    </Box>
                                                }
                                                sx={{ width: '100%', m: 0 }}
                                            />
                                        </Paper>
                                    </motion.div>
                                ))}
                            </RadioGroup>
                        </FormControl>
                    </Paper>

                    <Paper sx={{ p: 2, mb: 3 }}>
                        <Typography variant="subtitle1" gutterBottom>
                            행복했던 순간
                        </Typography>
                        <TextField
                            fullWidth
                            multiline
                            minRows={4}
                            maxRows={8}
                            placeholder="오늘 행복했던 순간이 있었나요? 어떤 일이 있었는지 적어주세요."
                            value={text}
                            onChange={handleTextChange}
                            sx={{ mb: 2 }}
                        />

                        <Box sx={{ mb: 2 }}>
                            <Button
                                variant="outlined"
                                component="label"
                                startIcon={<CameraIcon />}
                                sx={{ mb: 1 }}
                            >
                                사진 추가
                                <input
                                    type="file"
                                    accept="image/*"
                                    hidden
                                    onChange={handleImageChange}
                                />
                            </Button>

                            {imagePreview && (
                                <Box sx={{ mt: 2 }}>
                                    <img
                                        src={imagePreview}
                                        alt="미리보기"
                                        style={{
                                            width: '100%',
                                            maxHeight: '200px',
                                            objectFit: 'cover',
                                            borderRadius: '4px',
                                        }}
                                    />
                                </Box>
                            )}
                        </Box>
                    </Paper>

                    <motion.div
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <Button
                            fullWidth
                            variant="contained"
                            color="primary"
                            size="large"
                            onClick={handleSubmit}
                            sx={{ py: 1.5 }}
                        >
                            저장하기
                        </Button>
                    </motion.div>
                </Box>
            </AnimatedPage>
        </Layout>
    );
};

export default RecordHappiness; 