'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { useResearchStore, useResearchProgress, useResearchStatus, useResearchTiming, useActivityStatus } from "@/store";

export default function StateTest() {
  const {
    topic,
    questions,
    isLoading,
    researchPhase,
    setTopic,
    setQuestions,
    setIsLoading,
    setResearchPhase,
    addActivity,
    resetResearch,
  } = useResearchStore();

  const progress = useResearchProgress();
  const status = useResearchStatus();
  const timing = useResearchTiming();
  const activityStatus = useActivityStatus();
  const activities = useResearchStore((state) => state.activities);

  const handleAddQuestion = () => {
    const newQuestion = {
      id: Math.random().toString(36).substr(2, 9),
      text: `Test Question ${questions.length + 1}`,
      isAnswered: false,
    };
    setQuestions([...questions, newQuestion]);
  };

  const handleAddActivity = () => {
    console.log('Adding activity...');
    addActivity({
      type: 'search',
      status: 'in_progress',
      message: `Testing activity tracking - ${new Date().toLocaleTimeString()}`,
    });
    console.log('Activity added');
  };

  const handleStartResearch = () => {
    setIsLoading(true);
    setResearchPhase('research');
    addActivity({
      type: 'search',
      status: 'in_progress',
      message: 'Starting research process',
    });
    
    // 模拟异步操作
    setTimeout(() => {
      setIsLoading(false);
      addActivity({
        type: 'search',
        status: 'completed',
        message: 'Research completed',
      });
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>状态管理测试</CardTitle>
          <CardDescription>测试Zustand状态管理功能</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="topic">研究主题</Label>
              <Input
                id="topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="输入研究主题"
              />
            </div>
            <div className="space-y-2">
              <Label>研究阶段</Label>
              <div className="text-sm font-medium">{researchPhase}</div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>问题进度</Label>
            <div className="text-sm">
              {progress.answeredQuestions} / {progress.totalQuestions} 已回答
            </div>
            <Progress value={progress.progressPercentage} />
          </div>

          <div className="flex flex-wrap gap-2">
            <Button onClick={handleAddQuestion}>
              添加问题 ({questions.length})
            </Button>
            <Button onClick={handleAddActivity} variant="outline">
              添加活动
            </Button>
            <Button 
              onClick={handleStartResearch} 
              disabled={isLoading}
              variant="secondary"
            >
              {isLoading ? '研究中...' : '开始研究'}
            </Button>
            <Button onClick={resetResearch} variant="destructive">
              重置状态
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <strong>状态信息:</strong>
              <ul className="mt-1 space-y-1">
                <li>有主题: {status.hasTopic ? '是' : '否'}</li>
                <li>有问题: {status.hasQuestions ? '是' : '否'}</li>
                <li>有答案: {status.hasAnswers ? '是' : '否'}</li>
                <li>可开始研究: {status.canStartResearch ? '是' : '否'}</li>
              </ul>
            </div>
            <div>
              <strong>时间信息:</strong>
              <ul className="mt-1 space-y-1">
                <li>开始时间: {timing.startTime?.toLocaleTimeString() || '未开始'}</li>
                <li>持续时间: {timing.formattedDuration}</li>
                <li>状态: {timing.isRunning ? '运行中' : '已停止'}</li>
              </ul>
            </div>
            <div>
              <strong>问题列表:</strong>
              <ul className="mt-1 space-y-1 max-h-32 overflow-y-auto">
                {questions.map((q, index) => (
                  <li key={q.id} className="text-xs">
                    {index + 1}. {q.text} {q.isAnswered ? '✓' : '○'}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <strong>活动状态:</strong>
              <ul className="mt-1 space-y-1">
                <li>总数: {activityStatus.total}</li>
                <li>进行中: {activityStatus.inProgress}</li>
                <li>已完成: {activityStatus.completed}</li>
                <li>错误: {activityStatus.errors}</li>
                <li>有错误: {activityStatus.hasErrors ? '是' : '否'}</li>
                <li>活跃: {activityStatus.isActive ? '是' : '否'}</li>
              </ul>
            </div>
            <div>
              <strong>活动列表:</strong>
              <ul className="mt-1 space-y-1 max-h-32 overflow-y-auto">
                {activities.map((activity, index) => (
                  <li key={activity.id} className="text-xs">
                    {index + 1}. [{activity.type}] {activity.message} 
                    <span className={`ml-2 px-1 py-0.5 rounded text-xs ${
                      activity.status === 'completed' ? 'bg-green-100 text-green-800' :
                      activity.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                      activity.status === 'error' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {activity.status}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
