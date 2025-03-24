import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

export interface HappinessRecord {
    id: string;
    text: string;
    emotion: 'happy' | 'excited' | 'satisfied' | 'peaceful' | 'grateful';
    createdAt: Date;
    imageUrl?: string;
    likes: number;
    comments: Comment[];
}

export interface Comment {
    id: string;
    text: string;
    author: string;
    createdAt: Date;
}

interface HappinessContextType {
    records: HappinessRecord[];
    addRecord: (record: Omit<HappinessRecord, 'id' | 'createdAt' | 'likes' | 'comments'>) => void;
    getRecord: (id: string) => HappinessRecord | undefined;
    addComment: (recordId: string, text: string, author: string) => void;
    likeRecord: (id: string) => void;
    deleteRecord: (id: string) => void;
    loading: boolean;
    error: string | null;
    continuousStreak: number;
}

const HappinessContext = createContext<HappinessContextType | undefined>(undefined);

export const useHappiness = () => {
    const context = useContext(HappinessContext);
    if (context === undefined) {
        throw new Error('useHappiness must be used within a HappinessProvider');
    }
    return context;
};

interface HappinessProviderProps {
    children: ReactNode;
}

export const HappinessProvider: React.FC<HappinessProviderProps> = ({ children }) => {
    const [records, setRecords] = useState<HappinessRecord[]>(() => {
        const savedRecords = localStorage.getItem('happinessRecords');
        if (savedRecords) {
            try {
                return JSON.parse(savedRecords).map((record: any) => ({
                    ...record,
                    createdAt: new Date(record.createdAt),
                    comments: record.comments?.map((comment: any) => ({
                        ...comment,
                        createdAt: new Date(comment.createdAt),
                    })) || [],
                }));
            } catch (err) {
                console.error('Error parsing records from localStorage', err);
                return [];
            }
        }
        return [];
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [continuousStreak, setContinuousStreak] = useState(0);

    // Save records to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem('happinessRecords', JSON.stringify(records));
    }, [records]);

    // Calculate continuous streak
    useEffect(() => {
        if (records.length === 0) {
            setContinuousStreak(0);
            return;
        }

        const sortedRecords = [...records].sort((a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        let streak = 1;
        let currentDate = new Date(sortedRecords[0].createdAt);
        currentDate.setHours(0, 0, 0, 0);

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Check if the most recent record is from today
        if (currentDate.getTime() !== today.getTime()) {
            setContinuousStreak(0);
            return;
        }

        // Look for consecutive days
        for (let i = 1; i < sortedRecords.length; i++) {
            const prevDate = new Date(currentDate);
            prevDate.setDate(prevDate.getDate() - 1);

            const recordDate = new Date(sortedRecords[i].createdAt);
            recordDate.setHours(0, 0, 0, 0);

            if (recordDate.getTime() === prevDate.getTime()) {
                streak++;
                currentDate = recordDate;
            } else {
                break;
            }
        }

        setContinuousStreak(streak);
    }, [records]);

    const addRecord = (record: Omit<HappinessRecord, 'id' | 'createdAt' | 'likes' | 'comments'>) => {
        try {
            setLoading(true);
            setError(null);

            const newRecord: HappinessRecord = {
                ...record,
                id: Date.now().toString(),
                createdAt: new Date(),
                likes: 0,
                comments: [],
            };

            setRecords(prev => [newRecord, ...prev]);
        } catch (err) {
            setError('행복 기록을 추가하는 중 오류가 발생했습니다');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const getRecord = (id: string) => {
        return records.find(record => record.id === id);
    };

    const addComment = (recordId: string, text: string, author: string) => {
        try {
            setLoading(true);
            setError(null);

            const newComment: Comment = {
                id: Date.now().toString(),
                text,
                author,
                createdAt: new Date(),
            };

            setRecords(prev =>
                prev.map(record =>
                    record.id === recordId
                        ? { ...record, comments: [...record.comments, newComment] }
                        : record
                )
            );
        } catch (err) {
            setError('댓글을 추가하는 중 오류가 발생했습니다');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const likeRecord = (id: string) => {
        try {
            setRecords(prev =>
                prev.map(record =>
                    record.id === id
                        ? { ...record, likes: record.likes + 1 }
                        : record
                )
            );
        } catch (err) {
            setError('좋아요를 업데이트하는 중 오류가 발생했습니다');
            console.error(err);
        }
    };

    const deleteRecord = (id: string) => {
        try {
            setLoading(true);
            setError(null);

            setRecords(prev => prev.filter(record => record.id !== id));
        } catch (err) {
            setError('행복 기록을 삭제하는 중 오류가 발생했습니다');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const value = {
        records,
        addRecord,
        getRecord,
        addComment,
        likeRecord,
        deleteRecord,
        loading,
        error,
        continuousStreak,
    };

    return (
        <HappinessContext.Provider value={value}>
            {children}
        </HappinessContext.Provider>
    );
}; 