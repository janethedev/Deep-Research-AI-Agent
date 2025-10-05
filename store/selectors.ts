import { useResearchStore } from './deepResearch';
import { ResearchState } from './types';

// 基础选择器
export const useResearchState = () => useResearchStore();

// 研究进度相关选择器
export const useResearchProgress = () => {
  const totalQuestions = useResearchStore((state) => state.questions.length);
  const answeredQuestions = useResearchStore((state) => 
    state.questions.filter(q => q.isAnswered).length
  );
  
  return {
    totalQuestions,
    answeredQuestions,
    progressPercentage: totalQuestions > 0 ? (answeredQuestions / totalQuestions) * 100 : 0,
    isComplete: answeredQuestions === totalQuestions && totalQuestions > 0,
  };
};

// 当前问题选择器
export const useCurrentQuestion = () => {
  const currentIndex = useResearchStore((state) => state.currentQuestionIndex);
  const questions = useResearchStore((state) => state.questions);
  const currentQuestion = questions[currentIndex];
  const isFirstQuestion = currentIndex === 0;
  const isLastQuestion = currentIndex === questions.length - 1;
  
  return {
    question: currentQuestion,
    index: currentIndex,
    isFirstQuestion,
    isLastQuestion,
    canGoBack: !isFirstQuestion,
    canGoForward: !isLastQuestion,
  };
};

// 活动状态选择器
export const useActivityStatus = () => {
  const activities = useResearchStore((state) => state.activities);
  const pendingActivities = activities.filter(a => a.status === 'pending').length;
  const inProgressActivities = activities.filter(a => a.status === 'in_progress').length;
  const completedActivities = activities.filter(a => a.status === 'completed').length;
  const errorActivities = activities.filter(a => a.status === 'error').length;
  
  return {
    pending: pendingActivities,
    inProgress: inProgressActivities,
    completed: completedActivities,
    errors: errorActivities,
    total: activities.length,
    hasErrors: errorActivities > 0,
    isActive: inProgressActivities > 0,
  };
};

// 研究状态选择器
export const useResearchStatus = () => {
  const topic = useResearchStore((state) => state.topic);
  const questions = useResearchStore((state) => state.questions);
  const report = useResearchStore((state) => state.report);
  const isCompleted = useResearchStore((state) => state.isCompleted);
  
  const hasTopic = topic.length > 0;
  const hasQuestions = questions.length > 0;
  const hasAnswers = questions.some(q => q.isAnswered);
  const hasReport = report !== null;
  
  return {
    hasTopic,
    hasQuestions,
    hasAnswers,
    hasReport,
    canStartResearch: hasTopic && hasQuestions && hasAnswers,
    isResearchComplete: hasReport && isCompleted,
  };
};

// 时间相关选择器
export const useResearchTiming = () => {
  const startTime = useResearchStore((state) => state.startTime);
  const endTime = useResearchStore((state) => state.endTime);
  
  const now = new Date();
  let duration = 0;
  if (startTime) {
    const end = endTime || now;
    duration = end.getTime() - startTime.getTime();
  }
  
  const formatDuration = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    } else {
      return `${seconds}s`;
    }
  };
  
  return {
    startTime,
    endTime,
    duration,
    formattedDuration: formatDuration(duration),
    isRunning: startTime && !endTime,
  };
};

// 研究结果选择器
export const useResearchResults = () => {
  const sources = useResearchStore((state) => state.sources);
  const findings = useResearchStore((state) => state.findings);
  const report = useResearchStore((state) => state.report);
  
  return {
    sources,
    findings,
    report,
    hasResults: sources.length > 0 || findings !== null || report !== null,
    sourceCount: sources.length,
    hasFindings: findings !== null,
    hasReport: report !== null,
  };
};

// 组合选择器 - 用于复杂的状态计算
export const useResearchSummary = () => {
  const progress = useResearchProgress();
  const status = useResearchStatus();
  const timing = useResearchTiming();
  const results = useResearchResults();
  const activities = useActivityStatus();
  
  return {
    progress,
    status,
    timing,
    results,
    activities,
    // 计算总体状态
    overallStatus: (() => {
      if (status.isResearchComplete) return 'completed';
      if (activities.isActive) return 'researching';
      if (status.canStartResearch) return 'ready';
      if (status.hasQuestions) return 'answering';
      if (status.hasTopic) return 'preparing';
      return 'idle';
    })(),
  };
};
