import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ResearchStore, ResearchState, Question, Activity, Source, ResearchFindings, ResearchReport } from './types';

// 初始状态
const initialState: ResearchState = {
  // 基本信息
  topic: '',
  clarifications: [],
  
  // 问题相关
  questions: [],
  currentQuestionIndex: 0,
  
  // 研究状态
  isCompleted: false,
  isLoading: false,
  researchPhase: 'input',
  
  // 活动跟踪
  activities: [],
  
  // 研究结果
  sources: [],
  findings: null,
  report: null,
  
  // 时间跟踪
  startTime: null,
  endTime: null,
};

// 生成唯一ID的辅助函数
const generateId = () => Math.random().toString(36).substr(2, 9);

// 创建Zustand store
export const useResearchStore = create<ResearchStore>()(
  persist(
    (set, get) => ({
      ...initialState,
      
      // 基础设置
      setTopic: (topic: string) => set({ topic }),
      
      setClarifications: (clarifications: string[]) => set({ clarifications }),
      
      // 问题管理
      setQuestions: (questions: Question[]) => set({ questions }),
      
      setCurrentQuestionIndex: (index: number) => set({ currentQuestionIndex: index }),
      
      updateQuestionAnswer: (questionId: string, answer: string) => 
        set((state) => ({
          questions: state.questions.map(q => 
            q.id === questionId 
              ? { ...q, answer, isAnswered: true }
              : q
          )
        })),
      
      // 状态管理
      setIsCompleted: (completed: boolean) => set({ isCompleted: completed }),
      
      setIsLoading: (loading: boolean) => set({ isLoading: loading }),
      
      setResearchPhase: (phase: ResearchState['researchPhase']) => set({ researchPhase: phase }),
      
      // 活动管理
      addActivity: (activityData) => {
        const activity: Activity = {
          id: generateId(),
          timestamp: new Date(),
          ...activityData,
        };
        set((state) => ({
          activities: [...state.activities, activity]
        }));
      },
      
      updateActivity: (activityId: string, updates: Partial<Activity>) =>
        set((state) => ({
          activities: state.activities.map(activity =>
            activity.id === activityId
              ? { ...activity, ...updates }
              : activity
          )
        })),
      
      setActivities: (activities: Activity[]) => set({ activities }),
      
      // 研究结果
      setSources: (sources: Source[]) => set({ sources }),
      
      setFindings: (findings: ResearchFindings) => set({ findings }),
      
      setReport: (report: ResearchReport) => set({ report }),
      
      // 时间管理
      setStartTime: (time: Date) => set({ startTime: time }),
      
      setEndTime: (time: Date) => set({ endTime: time }),
      
      // 重置状态
      resetResearch: () => set(initialState),
    }),
    {
      name: 'deep-research-storage', // 本地存储的键名
      // 只持久化必要的状态，排除临时状态
      partialize: (state) => ({
        topic: state.topic,
        clarifications: state.clarifications,
        questions: state.questions,
        currentQuestionIndex: state.currentQuestionIndex,
        isCompleted: state.isCompleted,
        researchPhase: state.researchPhase,
        sources: state.sources,
        findings: state.findings,
        report: state.report,
        startTime: state.startTime,
        endTime: state.endTime,
      }),
    }
  )
);

// 选择器函数 - 用于优化性能
export const useResearchTopic = () => useResearchStore((state) => state.topic);
export const useResearchQuestions = () => useResearchStore((state) => state.questions);
export const useCurrentQuestion = () => useResearchStore((state) => 
  state.questions[state.currentQuestionIndex]
);
export const useResearchPhase = () => useResearchStore((state) => state.researchPhase);
export const useIsLoading = () => useResearchStore((state) => state.isLoading);
export const useActivities = () => useResearchStore((state) => state.activities);
export const useResearchReport = () => useResearchStore((state) => state.report);
export const useResearchProgress = () => useResearchStore((state) => {
  const totalQuestions = state.questions.length;
  const answeredQuestions = state.questions.filter(q => q.isAnswered).length;
  return totalQuestions > 0 ? (answeredQuestions / totalQuestions) * 100 : 0;
});
