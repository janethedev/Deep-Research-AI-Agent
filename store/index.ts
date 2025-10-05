// 状态管理模块的统一导出

// 主要store
export { useResearchStore } from './deepResearch';

// 类型定义
export type {
  ResearchState,
  ResearchActions,
  ResearchStore,
  Question,
  Activity,
  Source,
  ResearchFindings,
  ResearchReport,
} from './types';

// 选择器
export {
  useResearchState,
  useResearchProgress,
  useCurrentQuestion,
  useActivityStatus,
  useResearchStatus,
  useResearchTiming,
  useResearchResults,
  useResearchSummary,
} from './selectors';

// 便捷的选择器（从deepResearch.ts导出）
export {
  useResearchTopic,
  useResearchQuestions,
  useCurrentQuestion as useCurrentQuestionSimple,
  useResearchPhase,
  useIsLoading,
  useActivities,
  useResearchReport,
  useResearchProgress as useResearchProgressSimple,
} from './deepResearch';
