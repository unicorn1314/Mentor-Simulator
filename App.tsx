import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { BookOpen, Users, Trophy, Wallet, RefreshCw, AlertTriangle, GraduationCap, Briefcase, Award, CheckCircle2, Zap, Medal, Skull } from 'lucide-react';
import { GameState, Stats, Trait, GameEvent, LogEntry, Student, Achievement } from './types';
import { TRAITS, EVENT_POOL, HIDDEN_EVENTS, ACHIEVEMENTS, PHASE_EVALUATIONS, CHAIN_EVENTS } from './constants';

// --- Helper Components ---

const StatBar: React.FC<{ label: string; value: number; icon: React.ReactNode; color: string }> = ({ label, value, icon, color }) => (
  <div className="flex items-center gap-2 mb-2">
    <div className={`p-2 rounded-lg ${color} text-white shadow-sm`}>{icon}</div>
    <div className="flex-1">
      <div className="flex justify-between text-sm font-bold mb-1 text-stone-700">
        <span>{label}</span>
        <span className={value <= 0 ? "text-red-600 animate-pulse" : ""}>{value}/20</span>
      </div>
      <div className="h-2 bg-stone-200 rounded-full overflow-hidden border border-stone-300">
        <div 
          className={`h-full transition-all duration-500 ${color.replace('bg-', 'bg-opacity-80 bg-')}`} 
          style={{ width: `${Math.max(0, Math.min(100, (value / 20) * 100))}%` }}
        />
      </div>
    </div>
  </div>
);

const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`bg-white border-2 border-stone-200 rounded-xl shadow-[4px_4px_0px_0px_rgba(120,113,108,0.2)] p-4 md:p-6 ${className}`}>
    {children}
  </div>
);

const Button: React.FC<{ onClick: () => void; children: React.ReactNode; variant?: 'primary' | 'secondary' | 'danger'; disabled?: boolean; className?: string }> = ({ onClick, children, variant = 'primary', disabled = false, className = '' }) => {
  const baseStyle = "px-6 py-3 rounded-lg font-bold transition-all transform active:scale-95 border-2 flex justify-center items-center gap-2 select-none";
  const variants = {
    primary: "bg-stone-800 text-white border-stone-800 hover:bg-stone-700 disabled:bg-stone-400 disabled:border-stone-400",
    secondary: "bg-white text-stone-800 border-stone-300 hover:bg-stone-50 disabled:text-stone-400",
    danger: "bg-red-600 text-white border-red-700 hover:bg-red-500",
  };
  
  return (
    <button onClick={onClick} disabled={disabled} className={`${baseStyle} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
};

// --- Main App ---

export default function App() {
  const INITIAL_STATS: Stats = { academic: 6, reputation: 6, satisfaction: 6, resources: 6 };
  const RETIREMENT_YEAR = 30;

  const [gameState, setGameState] = useState<GameState>({
    year: 1,
    stats: INITIAL_STATS,
    traits: [],
    history: [],
    phase: 'MENU',
    currentEvent: null,
    lastEventResult: null,
    studentCount: 0,
    students: [],
    achievements: [],
    flags: {},
    isGameOver: false,
  });

  const [selectedTraits, setSelectedTraits] = useState<string[]>([]);

  // --- Helpers ---

  const generateStudent = (year: number): Student => {
    const id = Math.random().toString(36).substr(2, 9);
    // Random talent and stress based on initial bell curveish logic
    const talent = Math.floor(Math.random() * 6) + 3; // 3-8
    const stress = Math.floor(Math.random() * 4) + 2; // 2-5
    return {
      id,
      name: `学生-${id.substr(0,4).toUpperCase()}`,
      talent,
      stress,
      status: 'active',
      enrollmentYear: year
    };
  };

  const checkGameOver = (stats: Stats): { isOver: boolean; reason?: string } => {
    if (stats.reputation <= 0) return { isOver: true, reason: '【身败名裂】由于口碑崩塌，学校决定解除你的聘用合同。' };
    if (stats.satisfaction <= 0) return { isOver: true, reason: '【众叛亲离】你的学生集体联名举报或退学，你的实验室被强制关闭。' };
    if (stats.academic <= 0) return { isOver: true, reason: '【末位淘汰】由于长期没有学术产出，你在非升即走考核中被淘汰。' };
    if (stats.resources <= -5) return { isOver: true, reason: '【严重赤字】实验室负债累累，涉嫌违规挪用资金，你被带走调查。' };
    return { isOver: false };
  };

  // --- Actions ---

  const startGame = () => {
    setGameState({
      year: 1,
      stats: INITIAL_STATS,
      traits: [],
      history: [],
      phase: 'CREATION',
      currentEvent: null,
      lastEventResult: null,
      studentCount: 3,
      students: [generateStudent(1), generateStudent(1), generateStudent(1)],
      achievements: [],
      flags: {},
      isGameOver: false,
    });
    setSelectedTraits([]);
  };

  const toggleTrait = (traitId: string) => {
    if (selectedTraits.includes(traitId)) {
      setSelectedTraits(prev => prev.filter(id => id !== traitId));
    } else {
      if (selectedTraits.length < 3) {
        setSelectedTraits(prev => [...prev, traitId]);
      }
    }
  };

  const confirmTraits = () => {
    const finalTraits = TRAITS.filter(t => selectedTraits.includes(t.id));
    let newStats = { ...INITIAL_STATS };
    
    // Apply initial trait effects
    finalTraits.forEach(t => {
      if (t.effect) newStats = t.effect(newStats);
    });

    setGameState(prev => ({
      ...prev,
      stats: newStats,
      traits: finalTraits,
      phase: 'PLAYING',
      history: [{ year: 0, message: '入职高校，导师生涯开始。', type: 'milestone' }]
    }));
  };

  const triggerEvent = useCallback(() => {
    const { stats, traits, studentCount, flags } = gameState;
    const traitIds = traits.map(t => t.id);

    // 1. Check for Chain Events (High Priority)
    const chainTrigger = CHAIN_EVENTS.find(e => 
      e.condition && e.condition(stats, traitIds, studentCount, flags)
    );
    
    // Higher chance for chain events if conditions are met
    if (chainTrigger && Math.random() < 0.7) { 
      setGameState(prev => ({ ...prev, phase: 'EVENT', currentEvent: chainTrigger }));
      return;
    }

    // 2. Check for Hidden Events
    const hiddenTrigger = HIDDEN_EVENTS.find(e => 
      e.condition && e.condition(stats, traitIds, studentCount, flags)
    );

    if (hiddenTrigger && Math.random() < 0.3) {
      setGameState(prev => ({ ...prev, phase: 'EVENT', currentEvent: hiddenTrigger }));
      return;
    }

    // 3. Pick Random Event from Pool
    const randomIndex = Math.floor(Math.random() * EVENT_POOL.length);
    const event = EVENT_POOL[randomIndex];
    setGameState(prev => ({ ...prev, phase: 'EVENT', currentEvent: event }));
  }, [gameState.stats, gameState.traits, gameState.studentCount, gameState.flags]); 

  const processStudentLifecycle = (currentStats: Stats, currentStudents: Student[], currentYear: number) => {
    let newStudents = [...currentStudents];
    const logMessages: LogEntry[] = [];
    let statChanges: Partial<Stats> = {};

    newStudents = newStudents.map(s => {
      if (s.status !== 'active') return s;

      // Logic: Low satisfaction increases stress
      if (currentStats.satisfaction < 8) s.stress += 1;
      // High satisfaction reduces stress
      if (currentStats.satisfaction > 14) s.stress = Math.max(0, s.stress - 1);

      // Check for Quit
      // Higher chance to quit if satisfaction is low
      const quitChance = s.stress > 9 ? 0.4 : (s.stress > 7 ? 0.1 : 0);
      if (Math.random() < quitChance) {
        logMessages.push({ year: currentYear, message: `${s.name} 因压力过大退学了。`, type: 'risk' });
        statChanges.reputation = (statChanges.reputation || 0) - 1;
        return { ...s, status: 'quit' };
      }

      // Check for Graduation (Min 3 years)
      const yearsIn = currentYear - s.enrollmentYear;
      if (yearsIn >= 3) {
        // High talent graduates faster/easier
        const gradChance = 0.2 + (s.talent * 0.05) + (yearsIn > 5 ? 0.5 : 0);
        if (Math.random() < gradChance) {
          logMessages.push({ year: currentYear, message: `${s.name} 顺利毕业。`, type: 'milestone' });
          statChanges.academic = (statChanges.academic || 0) + (s.talent > 7 ? 1 : 0);
          return { ...s, status: 'graduated' };
        }
      }

      return s;
    });

    // Check Alumni Feedback
    newStudents.forEach(s => {
      if (s.status === 'graduated' && Math.random() < 0.05) {
         logMessages.push({ year: currentYear, message: `校友 ${s.name} 回校看望并带来了一些资源。`, type: 'milestone' });
         statChanges.resources = (statChanges.resources || 0) + 1;
      }
    });

    return { newStudents, logMessages, statChanges };
  };

  const advanceYear = (bypassSummary = false) => {
    if (gameState.year >= RETIREMENT_YEAR) {
      setGameState(prev => ({ 
        ...prev, 
        phase: 'GAMEOVER',
        isGameOver: true,
        gameOverReason: '【光荣退休】三十年教学生涯圆满结束，你培养了无数优秀人才。'
      }));
      return;
    }

    if (gameState.isGameOver) {
      setGameState(prev => ({ ...prev, phase: 'GAMEOVER' }));
      return;
    }

    // Check for 5-Year Summary Phase
    // Loop fix: if bypassSummary is true, we skip this block and force advancement
    if (!bypassSummary && gameState.year % 5 === 0 && gameState.phase !== 'SUMMARY') {
        setGameState(prev => ({ ...prev, phase: 'SUMMARY' }));
        return;
    }

    const nextYear = gameState.year + 1;

    // --- Start of New Year Logic ---

    // 1. Trait Synergies & Passives
    let passiveChanges: Partial<Stats> = {};
    let traitLogs: LogEntry[] = [];
    const traitIds = gameState.traits.map(t => t.id);

    // Synergy: Social + Admin (t13 + t14)
    if (traitIds.includes('t13') && traitIds.includes('t14')) {
        passiveChanges.resources = (passiveChanges.resources || 0) + 1;
    }
    // Passive: Loner (t15)
    if (traitIds.includes('t15') && Math.random() < 0.2) {
        passiveChanges.academic = (passiveChanges.academic || 0) + 1;
        passiveChanges.satisfaction = (passiveChanges.satisfaction || 0) - 1;
        traitLogs.push({ year: nextYear, message: '因特质【独行侠】，独自攻克难题但忽略了学生。', type: 'event' });
    }

    // 2. Student Lifecycle
    const { newStudents, logMessages, statChanges } = processStudentLifecycle(gameState.stats, gameState.students, nextYear);
    
    // Recruit new students
    const recruitmentCount = Math.floor(Math.random() * 2) + 1; // 1-2 new students per year
    for(let i=0; i<recruitmentCount; i++) {
        newStudents.push(generateStudent(nextYear));
    }

    // 3. Apply Changes (Allow going below 0 for Game Over check)
    const finalStats = {
        academic: gameState.stats.academic + (passiveChanges.academic || 0) + (statChanges.academic || 0),
        reputation: gameState.stats.reputation + (passiveChanges.reputation || 0) + (statChanges.reputation || 0),
        satisfaction: gameState.stats.satisfaction + (passiveChanges.satisfaction || 0) + (statChanges.satisfaction || 0),
        resources: gameState.stats.resources + (passiveChanges.resources || 0) + (statChanges.resources || 0),
    };
    
    // Check Game Over immediately after year processing
    const gameOverCheck = checkGameOver(finalStats);
    if (gameOverCheck.isOver) {
        setGameState(prev => ({
            ...prev,
            year: nextYear,
            stats: finalStats,
            phase: 'GAMEOVER',
            isGameOver: true,
            gameOverReason: gameOverCheck.reason
        }));
        return;
    }

    // Clamp stats max only (min is open for risk)
    finalStats.academic = Math.min(20, finalStats.academic);
    finalStats.reputation = Math.min(20, finalStats.reputation);
    finalStats.satisfaction = Math.min(20, finalStats.satisfaction);
    finalStats.resources = Math.min(20, finalStats.resources);

    // 4. Check Achievements
    let unlockedAchievs = [...gameState.achievements];
    let achievLogs: LogEntry[] = [];
    
    const tempStateForCheck = { ...gameState, stats: finalStats, students: newStudents, year: nextYear }; // Approx state for check
    
    ACHIEVEMENTS.forEach(ach => {
        if (!unlockedAchievs.includes(ach.id) && ach.condition(tempStateForCheck)) {
            unlockedAchievs.push(ach.id);
            achievLogs.push({ year: nextYear, message: `达成成就：${ach.title}！`, type: 'achievement' });
            if (ach.reward) {
                 finalStats.academic += ach.reward.academic || 0;
                 finalStats.reputation += ach.reward.reputation || 0;
                 finalStats.satisfaction += ach.reward.satisfaction || 0;
                 finalStats.resources += ach.reward.resources || 0;
            }
        }
    });

    setGameState(prev => ({
      ...prev,
      year: nextYear,
      stats: finalStats,
      students: newStudents,
      achievements: unlockedAchievs,
      studentCount: newStudents.filter(s => s.status === 'active').length,
      history: [...achievLogs, ...logMessages, ...traitLogs, ...prev.history],
      phase: 'PLAYING'
    }));

    // Trigger event after short delay
    setTimeout(() => {
        triggerEvent();
    }, 500);
  };

  const handleChoice = (effect: (s: Stats) => Partial<Stats>, choiceText: string, resultText?: string, setFlag?: string, removeFlag?: string) => {
    const changes = effect(gameState.stats);
    
    // Apply changes without clamping min to 0 initially to catch game over
    const newStats = {
      academic: Math.min(20, gameState.stats.academic + (changes.academic || 0)),
      reputation: Math.min(20, gameState.stats.reputation + (changes.reputation || 0)),
      satisfaction: Math.min(20, gameState.stats.satisfaction + (changes.satisfaction || 0)),
      resources: Math.min(20, gameState.stats.resources + (changes.resources || 0)),
    };

    const newFlags = { ...gameState.flags };
    if (setFlag) {
        newFlags[setFlag] = true;
    }
    if (removeFlag) {
        delete newFlags[removeFlag];
    }

    // Check Game Over
    const gameOverCheck = checkGameOver(newStats);
    
    if (gameOverCheck.isOver) {
        setGameState(prev => ({
            ...prev,
            stats: newStats,
            flags: newFlags,
            phase: 'GAMEOVER',
            isGameOver: true,
            gameOverReason: gameOverCheck.reason,
            lastEventResult: { text: resultText || '发生了意想不到的事情...', changes }, // Show result then die? No, jump straight to die or show result then die.
            // Let's go to result first, then clicking confirm goes to gameover.
        }));
        // We override the phase in the state update below, but wait, if I set RESULT phase, confirmResult needs to know to go to GAMEOVER.
        // Actually simpler: Set Result, and in confirmResult check game over.
    }
    
    setGameState(prev => ({
      ...prev,
      stats: newStats,
      flags: newFlags,
      phase: gameOverCheck.isOver ? 'RESULT' : 'RESULT', // Always show result first
      currentEvent: null,
      lastEventResult: { text: resultText || '发生了意想不到的事情...', changes },
      history: [
        { year: prev.year, message: `事件：${prev.currentEvent?.title} -> 选择：${choiceText}`, type: 'event' },
        ...(resultText ? [{ year: prev.year, message: `结果：${resultText}`, type: 'event' } as LogEntry] : []),
        ...prev.history
      ],
      isGameOver: gameOverCheck.isOver,
      gameOverReason: gameOverCheck.reason
    }));
  };

  const confirmResult = () => {
    if (gameState.isGameOver) {
        setGameState(prev => ({ ...prev, phase: 'GAMEOVER', lastEventResult: null }));
    } else {
        setGameState(prev => ({
        ...prev,
        phase: 'PLAYING',
        lastEventResult: null
        }));
    }
  };

  const closeSummary = () => {
      // Explicitly bypass the summary check to advance to the next year
      advanceYear(true);
  };

  // Start first event
  useEffect(() => {
    if (gameState.phase === 'PLAYING' && gameState.year === 1 && gameState.history.length === 1) {
      triggerEvent();
    }
  }, [gameState.phase, gameState.year, gameState.history.length, triggerEvent]);


  // --- Render Functions ---

  const renderMenu = () => (
    <div className="flex flex-col items-center justify-center min-h-screen bg-stone-100 p-4">
      <div className="max-w-2xl w-full text-center space-y-8 animate-in fade-in duration-700">
        <div className="mb-8">
            <h1 className="text-4xl md:text-6xl font-bold text-stone-800 serif tracking-tighter mb-4">导师模拟器</h1>
            <p className="text-lg md:text-xl text-stone-600 italic font-serif">Professor Simulator</p>
        </div>
        
        <Card className="p-8 transform hover:scale-105 transition-transform duration-300 cursor-default">
          <p className="text-base md:text-lg text-stone-600 mb-6 leading-relaxed">
            你即将入职某知名高校，开启长达30年的导师生涯。<br/>
            <span className="text-red-600 font-bold">警告：属性过低可能导致直接解聘或破产！</span><br/>
            是成为学术泰斗，还是桃李满天下的教育家？<br/>
            一切由你决定。
          </p>
          <Button onClick={startGame} className="w-full text-lg py-4 shadow-lg">
            开始新的生涯
          </Button>
        </Card>
      </div>
    </div>
  );

  const renderCreation = () => (
    <div className="min-h-screen bg-stone-100 p-4 md:p-8 flex items-center justify-center">
      <div className="max-w-4xl w-full">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-stone-800 serif text-center md:text-left">请选择 3 个初始特质</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-24 md:mb-8">
            {/* Group by category */}
            {(['professional', 'mentorship', 'workplace'] as const).map(cat => (
                <div key={cat} className="space-y-3">
                    <h3 className="font-bold text-stone-500 uppercase text-sm tracking-wider mb-2">
                        {cat === 'professional' ? '专业能力' : cat === 'mentorship' ? '育人风格' : '职场生存'}
                    </h3>
                    {TRAITS.filter(t => t.category === cat).map(trait => (
                        <div 
                            key={trait.id}
                            onClick={() => toggleTrait(trait.id)}
                            className={`
                                p-3 md:p-4 rounded-lg border-2 cursor-pointer transition-all
                                ${selectedTraits.includes(trait.id) 
                                    ? 'bg-stone-800 border-stone-800 text-white shadow-lg scale-105' 
                                    : 'bg-white border-stone-200 text-stone-600 hover:border-stone-400'}
                                ${selectedTraits.length >= 3 && !selectedTraits.includes(trait.id) ? 'opacity-50 cursor-not-allowed' : ''}
                            `}
                        >
                            <div className="font-bold text-base md:text-lg mb-1">{trait.name}</div>
                            <div className="text-xs opacity-80">{trait.description}</div>
                        </div>
                    ))}
                </div>
            ))}
        </div>

        <div className="fixed bottom-0 left-0 right-0 p-4 md:static bg-white/90 backdrop-blur border-t-2 border-stone-200 md:border-t-0 md:bg-transparent md:backdrop-blur-none z-10">
          <div className="max-w-4xl mx-auto flex justify-between items-center bg-white md:p-4 rounded-xl md:border-2 md:border-stone-200 md:shadow-xl">
              <div className="text-stone-600">
                  已选: <span className="font-bold text-stone-900">{selectedTraits.length}/3</span>
              </div>
              <Button onClick={confirmTraits} disabled={selectedTraits.length !== 3}>
                  确认入职
              </Button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderEvent = () => {
    if (!gameState.currentEvent) return null;
    const { title, description, category, choices } = gameState.currentEvent;

    const categoryIcons = {
        academic: <BookOpen className="w-6 h-6 text-blue-500" />,
        student: <Users className="w-6 h-6 text-emerald-500" />,
        career: <Briefcase className="w-6 h-6 text-purple-500" />,
        network: <Award className="w-6 h-6 text-amber-500" />,
        risk: <AlertTriangle className="w-6 h-6 text-red-500" />,
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm overflow-y-auto">
            <div className={`relative max-w-2xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden border-4 ${category === 'risk' ? 'border-red-600' : 'border-stone-800'} animate-in fade-in zoom-in duration-300 max-h-[90vh] flex flex-col`}>
                <div className={`${category === 'risk' ? 'bg-red-50' : 'bg-stone-100'} p-6 border-b border-stone-200 flex items-center gap-3 flex-shrink-0`}>
                   {categoryIcons[category]}
                   <span className={`font-bold uppercase tracking-widest text-sm ${category === 'risk' ? 'text-red-600' : 'text-stone-500'}`}>
                       {category === 'academic' ? '学术科研' : category === 'student' ? '学生指导' : category === 'career' ? '职场发展' : category === 'network' ? '人脉资源' : '高危风险事件'}
                   </span>
                </div>
                <div className="p-6 md:p-8 overflow-y-auto">
                    <h3 className="text-2xl md:text-3xl font-bold mb-4 serif text-stone-900">{title}</h3>
                    <p className="text-base md:text-lg text-stone-700 leading-relaxed mb-8">{description}</p>
                    
                    <div className="space-y-3">
                        {choices.map((choice, idx) => (
                            <button
                                key={idx}
                                onClick={() => handleChoice(choice.effect, choice.text, choice.description, choice.setFlag, choice.removeFlag)}
                                className="w-full text-left p-4 rounded-lg border-2 border-stone-200 hover:border-stone-800 hover:bg-stone-50 transition-all group active:bg-stone-100"
                            >
                                <span className="font-bold text-stone-800 block mb-1 group-hover:translate-x-1 transition-transform">➢ {choice.text}</span>
                                {gameState.traits.some(t => t.id === 't3') && ( // Example of trait aiding player
                                    <span className="text-xs text-stone-400 italic">可能影响: {choice.description ? '查看后果提示' : '未知'}</span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
  };

  const renderResult = () => {
    if (!gameState.lastEventResult) return null;
    const { text, changes } = gameState.lastEventResult;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl overflow-hidden border-4 border-stone-800 animate-in fade-in zoom-in duration-300 max-h-[90vh] overflow-y-auto">
                <div className="bg-stone-100 p-4 border-b border-stone-200 text-center sticky top-0">
                   <h3 className="font-bold text-stone-600 flex items-center justify-center gap-2">
                       <CheckCircle2 size={18} /> 事件结果
                   </h3>
                </div>
                <div className="p-6 md:p-8 text-center">
                    <p className="text-lg md:text-xl text-stone-800 mb-8 font-serif leading-relaxed">{text}</p>
                    
                    {Object.keys(changes).length > 0 && (
                        <div className="grid grid-cols-2 gap-4 mb-8">
                             {Object.entries(changes).map(([key, value]) => {
                                 const val = value as number;
                                 if (!val) return null;
                                 const isPositive = val > 0;
                                 const labelMap: Record<string, string> = { academic: '学术', reputation: '口碑', satisfaction: '学生', resources: '资源' };
                                 return (
                                     <div key={key} className={`p-3 rounded-lg border-2 font-bold ${isPositive ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
                                         {labelMap[key]} {isPositive ? '+' : ''}{val}
                                     </div>
                                 );
                             })}
                        </div>
                    )}
                    
                    <Button onClick={confirmResult} className="w-full">
                        {gameState.isGameOver ? '接受命运' : '确认'}
                    </Button>
                </div>
            </div>
        </div>
    );
  };

  const renderSummary = () => {
      const evaluation = PHASE_EVALUATIONS.find(e => gameState.year >= e.minYear && gameState.year <= e.maxYear) || PHASE_EVALUATIONS[0];
      const activeStudents = gameState.students.filter(s => s.status === 'active').length;
      const graduatedStudents = gameState.students.filter(s => s.status === 'graduated').length;

      return (
        <div className="fixed inset-0 bg-stone-900/80 flex items-center justify-center p-4 z-50 backdrop-blur-md">
            <div className="max-w-2xl w-full bg-stone-50 rounded-lg shadow-2xl overflow-hidden border-2 border-stone-600 animate-in slide-in-from-bottom duration-500 max-h-[95vh] overflow-y-auto">
                <div className="bg-stone-800 text-white p-6 text-center sticky top-0 z-10">
                    <h2 className="text-2xl md:text-3xl font-serif font-bold mb-2">第 {gameState.year} 年 · 阶段总结</h2>
                    <div className="text-amber-400 font-bold uppercase tracking-widest">{evaluation.title}</div>
                </div>
                <div className="p-6 md:p-8">
                    <p className="text-center text-stone-600 italic mb-8 border-b pb-4">"{evaluation.desc}"</p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 text-center">
                        <div className="p-4 bg-white rounded shadow-sm">
                            <div className="text-xs text-stone-400 uppercase">学术造诣</div>
                            <div className="text-2xl font-bold text-stone-800">{gameState.stats.academic}</div>
                        </div>
                        <div className="p-4 bg-white rounded shadow-sm">
                            <div className="text-xs text-stone-400 uppercase">累计毕业</div>
                            <div className="text-2xl font-bold text-stone-800">{graduatedStudents}</div>
                        </div>
                        <div className="p-4 bg-white rounded shadow-sm">
                            <div className="text-xs text-stone-400 uppercase">在读学生</div>
                            <div className="text-2xl font-bold text-stone-800">{activeStudents}</div>
                        </div>
                         <div className="p-4 bg-white rounded shadow-sm">
                            <div className="text-xs text-stone-400 uppercase">解锁成就</div>
                            <div className="text-2xl font-bold text-stone-800">{gameState.achievements.length}</div>
                        </div>
                    </div>

                    <Button onClick={closeSummary} className="w-full">开启下一个五年</Button>
                </div>
            </div>
        </div>
      );
  };

  const renderGameOver = () => (
    <div className="min-h-screen bg-red-900 text-stone-100 p-4 flex items-center justify-center">
        <div className="max-w-2xl w-full bg-stone-900 rounded-2xl shadow-2xl p-8 border-4 border-red-700 animate-in zoom-in duration-500">
            <div className="text-center space-y-4">
                <Skull size={64} className="mx-auto text-red-600 mb-4" />
                <h1 className="text-3xl md:text-5xl font-bold text-white mb-2">生涯终结</h1>
                <p className="text-xl md:text-2xl text-red-400 font-serif font-bold">{gameState.gameOverReason}</p>
                <p className="text-stone-400">坚持了 {gameState.year} 年，倒在了退休前夕。</p>
                
                <div className="py-8 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div>
                         <div className="text-xs uppercase text-stone-500">学术</div>
                         <div className="text-xl font-bold">{gameState.stats.academic}</div>
                    </div>
                    <div>
                         <div className="text-xs uppercase text-stone-500">口碑</div>
                         <div className="text-xl font-bold">{gameState.stats.reputation}</div>
                    </div>
                     <div>
                         <div className="text-xs uppercase text-stone-500">学生</div>
                         <div className="text-xl font-bold">{gameState.stats.satisfaction}</div>
                    </div>
                     <div>
                         <div className="text-xs uppercase text-stone-500">资源</div>
                         <div className="text-xl font-bold">{gameState.stats.resources}</div>
                    </div>
                </div>

                <Button onClick={startGame} variant="danger" className="w-full py-4 text-lg">
                    不服！重开！
                </Button>
            </div>
        </div>
    </div>
  );

  const renderDashboard = () => (
    <div className="min-h-screen bg-stone-100 p-4 pb-24 md:p-8 overflow-x-hidden">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Left Column: Stats */}
        <div className="md:col-span-4 space-y-6 relative">
            <Card className="md:sticky md:top-6">
                <div className="mb-6 flex items-center justify-between border-b border-stone-100 pb-4">
                    <h2 className="text-xl md:text-2xl font-bold serif">第 {gameState.year} 年</h2>
                    <span className="text-xs md:text-sm font-bold bg-stone-200 px-2 py-1 rounded text-stone-600">距离退休: {RETIREMENT_YEAR - gameState.year + 1}年</span>
                </div>

                <StatBar label="学术造诣" value={gameState.stats.academic} icon={<BookOpen size={18} />} color="bg-blue-600" />
                <StatBar label="行业口碑" value={gameState.stats.reputation} icon={<Award size={18} />} color="bg-purple-600" />
                <StatBar label="学生爱戴" value={gameState.stats.satisfaction} icon={<Users size={18} />} color="bg-pink-500" />
                <StatBar label="经费资源" value={gameState.stats.resources} icon={<Wallet size={18} />} color="bg-emerald-600" />

                <div className="mt-6 pt-4 border-t border-stone-100 grid grid-cols-2 gap-4">
                    <div className="text-center p-2 bg-stone-50 rounded">
                        <div className="text-xs text-stone-500 uppercase">在读学生</div>
                        <div className="text-xl font-bold text-stone-800">{gameState.students.filter(s => s.status === 'active').length}</div>
                    </div>
                     <div className="text-center p-2 bg-stone-50 rounded">
                        <div className="text-xs text-stone-500 uppercase">获得成就</div>
                        <div className="text-xl font-bold text-stone-800">{gameState.achievements.length}</div>
                    </div>
                </div>

                {/* Achievements List */}
                {gameState.achievements.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-stone-100">
                        <h4 className="text-xs font-bold text-stone-400 uppercase mb-2">最新成就</h4>
                        <div className="flex flex-wrap gap-2">
                            {gameState.achievements.map(id => {
                                const ach = ACHIEVEMENTS.find(a => a.id === id);
                                return (
                                    <span key={id} className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full border border-amber-200 flex items-center gap-1">
                                        <Medal size={12} /> {ach?.title}
                                    </span>
                                );
                            })}
                        </div>
                    </div>
                )}
            </Card>

            <div className="block">
                 <h3 className="font-bold text-stone-500 mb-2 px-2 text-sm">特质 & 状态</h3>
                 <div className="flex flex-wrap gap-2">
                    {gameState.traits.map(t => (
                        <span key={t.id} className="bg-white border border-stone-200 px-3 py-1 rounded-full text-xs font-bold text-stone-600 shadow-sm" title={t.description}>
                            {t.name}
                        </span>
                    ))}
                    {Object.keys(gameState.flags).length > 0 && (
                         <span className="bg-red-100 border border-red-200 px-3 py-1 rounded-full text-xs font-bold text-red-600 shadow-sm flex items-center gap-1">
                            <AlertTriangle size={12} /> 风险标记
                         </span>
                    )}
                 </div>
            </div>
        </div>

        {/* Right Column: Main Area */}
        <div className="md:col-span-8 flex flex-col gap-6">
            {/* Action Bar */}
            <div className="bg-white border-2 border-stone-200 rounded-xl p-4 flex flex-col sm:flex-row justify-between items-center shadow-sm gap-4">
                 <div className="font-serif italic text-stone-500 text-center sm:text-left">
                    "{gameState.history[0]?.message || '新的学年开始了...'}"
                 </div>
                 <Button onClick={() => advanceYear(false)} disabled={gameState.phase === 'EVENT' || gameState.phase === 'RESULT' || gameState.phase === 'SUMMARY'} className="w-full sm:w-auto">
                    {gameState.year % 5 === 0 && gameState.year < RETIREMENT_YEAR ? '阶段总结' : '下一年'}
                 </Button>
            </div>

            {/* Student List Preview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Card className="max-h-60 overflow-y-auto custom-scrollbar">
                     <h3 className="font-bold text-sm text-stone-500 uppercase mb-3 flex items-center gap-2">
                         <GraduationCap size={16} /> 在读高潜学生
                     </h3>
                     <div className="space-y-2">
                        {gameState.students.filter(s => s.status === 'active').sort((a,b) => b.talent - a.talent).slice(0, 5).map(s => (
                            <div key={s.id} className="flex justify-between items-center text-sm p-2 bg-stone-50 rounded">
                                <span className="font-medium text-stone-700">{s.name}</span>
                                <div className="flex gap-2 text-xs">
                                    <span title="学术天赋" className="text-blue-600 font-bold">天:{s.talent}</span>
                                    <span title="压力值" className={`${s.stress > 7 ? 'text-red-600' : 'text-stone-400'}`}>压:{s.stress}</span>
                                </div>
                            </div>
                        ))}
                        {gameState.students.filter(s => s.status === 'active').length === 0 && <div className="text-stone-400 text-sm italic">暂无学生</div>}
                     </div>
                </Card>
                 <Card className="max-h-60 overflow-y-auto custom-scrollbar">
                     <h3 className="font-bold text-sm text-stone-500 uppercase mb-3 flex items-center gap-2">
                         <Briefcase size={16} /> 优秀毕业生
                     </h3>
                     <div className="space-y-2">
                        {gameState.students.filter(s => s.status === 'graduated').slice(0, 5).map(s => (
                            <div key={s.id} className="flex justify-between items-center text-sm p-2 bg-emerald-50 rounded">
                                <span className="font-medium text-emerald-800">{s.name}</span>
                                <span className="text-xs text-emerald-600">已毕业</span>
                            </div>
                        ))}
                         {gameState.students.filter(s => s.status === 'graduated').length === 0 && <div className="text-stone-400 text-sm italic">暂无毕业生</div>}
                     </div>
                </Card>
            </div>

            {/* Log Area */}
            <Card className="flex-1 min-h-[400px] flex flex-col">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-lg flex items-center gap-2">
                        <RefreshCw className="w-4 h-4" /> 生涯记录
                    </h3>
                </div>
                <div className="flex-1 overflow-y-auto space-y-4 max-h-[400px] pr-2 custom-scrollbar">
                    {gameState.history.map((entry, idx) => (
                        <div key={idx} className={`p-3 rounded border-l-4 text-sm ${
                            entry.type === 'milestone' ? 'border-emerald-500 bg-emerald-50' :
                            entry.type === 'achievement' ? 'border-amber-500 bg-amber-50' :
                            entry.type === 'risk' ? 'border-red-500 bg-red-50' :
                            entry.type === 'event' ? 'border-blue-400 bg-white' : 'border-stone-200'
                        }`}>
                            <span className="text-stone-400 font-mono text-xs mr-2">YEAR {entry.year}</span>
                            <span className="text-stone-800">{entry.message}</span>
                        </div>
                    ))}
                </div>
            </Card>
        </div>

      </div>
      {/* Modals */}
      {gameState.phase === 'EVENT' && renderEvent()}
      {gameState.phase === 'RESULT' && renderResult()}
      {gameState.phase === 'SUMMARY' && renderSummary()}
    </div>
  );

  return (
    <>
      {gameState.phase === 'MENU' && renderMenu()}
      {gameState.phase === 'CREATION' && renderCreation()}
      {(gameState.phase === 'PLAYING' || gameState.phase === 'EVENT' || gameState.phase === 'RESULT' || gameState.phase === 'SUMMARY') && renderDashboard()}
      {(gameState.phase === 'GAMEOVER' || gameState.phase === 'ENDING') && renderGameOver()}
    </>
  );
}