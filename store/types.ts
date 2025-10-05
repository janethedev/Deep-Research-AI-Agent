// 研究状态相关类型定义

export interface Question {
  id: string;
  text: string;
  answer?: string;
  isAnswered: boolean;
}

export interface Activity {
  id: string;
  type: 'search' | 'extract' | 'analyze' | 'report';
  status: 'pending' | 'in_progress' | 'completed' | 'error';
  message: string;
  timestamp: Date;
  details?: string;
}

export interface Source {
  id: string;
  title: string;
  url: string;
  snippet: string;
  relevance: number;
}

export interface ResearchFindings {
  summary: string;
  keyPoints: string[];
  sources: Source[];
  confidence: number;
}

export interface ResearchReport {
  title: string;
  content: string;
  findings: ResearchFindings;
  generatedAt: Date;
  wordCount: number;
}

// 主要研究状态接口
export interface ResearchState {
  // 基本信息
  topic: string;
  clarifications: string[];
  
  // 问题相关
  questions: Question[];
  currentQuestionIndex: number;
  
  // 研究状态
  isCompleted: boolean;
  isLoading: boolean;
  researchPhase: 'input' | 'questions' | 'research' | 'report';
  
  // 活动跟踪
  activities: Activity[];
  
  // 研究结果
  sources: Source[];
  findings: ResearchFindings | null;
  report: ResearchReport | null;
  
  // 时间跟踪
  startTime: Date | null;
  endTime: Date | null;
}

// 状态更新动作类型
export interface ResearchActions {
  // 基础设置
  setTopic: (topic: string) => void;
  setClarifications: (clarifications: string[]) => void;
  
  // 问题管理
  setQuestions: (questions: Question[]) => void;
  setCurrentQuestionIndex: (index: number) => void;
  updateQuestionAnswer: (questionId: string, answer: string) => void;
  
  // 状态管理
  setIsCompleted: (completed: boolean) => void;
  setIsLoading: (loading: boolean) => void;
  setResearchPhase: (phase: ResearchState['researchPhase']) => void;
  
  // 活动管理
  addActivity: (activity: Omit<Activity, 'id' | 'timestamp'>) => void;
  updateActivity: (activityId: string, updates: Partial<Activity>) => void;
  setActivities: (activities: Activity[]) => void;
  
  // 研究结果
  setSources: (sources: Source[]) => void;
  setFindings: (findings: ResearchFindings) => void;
  setReport: (report: ResearchReport) => void;
  
  // 时间管理
  setStartTime: (time: Date) => void;
  setEndTime: (time: Date) => void;
  
  // 重置状态
  resetResearch: () => void;
}

// 完整的Store类型
export type ResearchStore = ResearchState & ResearchActions;
