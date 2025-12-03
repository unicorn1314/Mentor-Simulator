
import React, { useState, useEffect, useCallback } from 'react';
import { BookOpen, Users, Trophy, Wallet, RefreshCw, AlertTriangle, GraduationCap, Briefcase, Award, CheckCircle2, Zap, Medal, Skull, Star, ShoppingCart, ArrowUpCircle, LayoutDashboard, ScrollText, Target, FileText, Timer } from 'lucide-react';
import { GameState, Stats, Trait, GameEvent, LogEntry, Student, Achievement, ProjectDefinition } from './types';
import { TRAITS, EVENT_POOL, HIDDEN_EVENTS, ACHIEVEMENTS, PHASE_EVALUATIONS, CHAIN_EVENTS, UPGRADES, TITLES, ENDINGS, KPIS, PROJECTS } from './constants';

// --- Helper Components ---

const StatBar: React.FC<{ label: string; value: number; icon: React.ReactNode; color: string }> = ({ label, value, icon, color }) => (
  <div className="flex items-center gap-2 mb-2 relative group">
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

const Button: React.FC<{ onClick: () => void; children: React.ReactNode; variant?: 'primary' | 'secondary' | 'danger' | 'success'; disabled?: boolean; className?: string }> = ({ onClick, children, variant = 'primary', disabled = false, className = '' }) => {
  const baseStyle = "px-6 py-3 rounded-lg font-bold transition-all transform active:scale-95 border-2 flex justify-center items-center gap-2 select-none relative";
  const variants = {
    primary: "bg-stone-800 text-white border-stone-800 hover:bg-stone-700 disabled:bg-stone-400 disabled:border-stone-400",
    secondary: "bg-white text-stone-800 border-stone-300 hover:bg-stone-50 disabled:text-stone-400",
    danger: "bg-red-600 text-white border-red-700 hover:bg-red-500",
    success: "bg-amber-500 text-white border-amber-600 hover:bg-amber-400",
  };
  
  return (
    <button onClick={onClick} disabled={disabled} className={`${baseStyle} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
};

// --- Localization Map ---
const STAT_LABELS: Record<string, string> = {
  academic: '学术',
  reputation: '口碑',
  satisfaction: '学生',
  resources: '资源'
};

// --- Name Generation Helpers ---
const SURNAMES = "赵钱孙李周吴郑王冯陈褚卫蒋沈韩杨朱秦尤许何吕施张孔曹严华金魏陶姜".split("");
const GIVEN_NAMES = "伟芳娜敏静秀强磊洋艳勇军杰娟涛明超霞平刚桂英华强红玉兰竹山河海波宁远博文雅婷子轩浩然欣怡若雨梓涵一诺星宇".split("");

// --- Main App ---

export default function App() {
  // Harder start: 6 -> 4
  const INITIAL_STATS: Stats = { academic: 4, reputation: 4, satisfaction: 4, resources: 4 };
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
    upgrades: [],
    title: 'title_lecturer',
    activeProject: null
  });

  const [selectedTraits, setSelectedTraits] = useState<string[]>([]);
  const [showShop, setShowShop] = useState(false);
  const [showProjects, setShowProjects] = useState(false);
  const [floatingTexts, setFloatingTexts] = useState<{ id: number, text: string, color: string, left: string, top: string }[]>([]);
  const [mobileTab, setMobileTab] = useState<'career' | 'stats'>('career');

  // --- Visual Feedback ---
  const spawnFloatingText = useCallback((changes: Partial<Stats>) => {
     const newFloats: { id: number, text: string, color: string, left: string, top: string }[] = [];
     let offset = 0;
     
     if (changes.academic) {
        newFloats.push({ id: Date.now() + offset++, text: `学术 ${changes.academic > 0 ? '+' : ''}${changes.academic}`, color: changes.academic > 0 ? 'text-blue-600' : 'text-red-600', left: '20%', top: '30%' });
     }
     if (changes.reputation) {
        newFloats.push({ id: Date.now() + offset++, text: `口碑 ${changes.reputation > 0 ? '+' : ''}${changes.reputation}`, color: changes.reputation > 0 ? 'text-purple-600' : 'text-red-600', left: '40%', top: '30%' });
     }
     if (changes.satisfaction) {
        newFloats.push({ id: Date.now() + offset++, text: `学生 ${changes.satisfaction > 0 ? '+' : ''}${changes.satisfaction}`, color: changes.satisfaction > 0 ? 'text-pink-600' : 'text-red-600', left: '60%', top: '30%' });
     }
     if (changes.resources) {
        newFloats.push({ id: Date.now() + offset++, text: `资源 ${changes.resources > 0 ? '+' : ''}${changes.resources}`, color: changes.resources > 0 ? 'text-emerald-600' : 'text-red-600', left: '80%', top: '30%' });
     }

     if (newFloats.length > 0) {
         setFloatingTexts(prev => [...prev, ...newFloats]);
         // Cleanup
         setTimeout(() => {
             setFloatingTexts(prev => prev.filter(ft => !newFloats.find(nf => nf.id === ft.id)));
         }, 1500);
     }
  }, []);

  // --- Helpers ---

  const generateStudent = (year: number): Student => {
    const id = Math.random().toString(36).substr(2, 9);
    // Generate Chinese Name
    const surname = SURNAMES[Math.floor(Math.random() * SURNAMES.length)];
    const nameLen = Math.random() > 0.4 ? 2 : 1; // 60% chance for 2-char given name
    let givenName = "";
    for(let i=0; i<nameLen; i++) {
        givenName += GIVEN_NAMES[Math.floor(Math.random() * GIVEN_NAMES.length)];
    }
    const name = surname + givenName;

    // Random talent and stress based on initial bell curveish logic
    const talent = Math.floor(Math.random() * 6) + 3; // 3-8
    const stress = Math.floor(Math.random() * 4) + 2; // 2-5
    return {
      id,
      name,
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
      upgrades: [],
      title: 'title_lecturer',
      activeProject: null
    });
    setSelectedTraits([]);
    setMobileTab('career');
  };

  const toggleTrait = (traitId: string) => {
    const trait = TRAITS.find(t => t.id === traitId);
    if (!trait) return;

    if (selectedTraits.includes(traitId)) {
      // Allow unselecting
      setSelectedTraits(prev => prev.filter(id => id !== traitId));
    } else {
      // Check if a trait of this category is already selected
      const selectedObjs = TRAITS.filter(t => selectedTraits.includes(t.id));
      const hasCategory = selectedObjs.some(t => t.category === trait.category);
      
      // Only allow if category not yet selected and total < 3
      if (!hasCategory && selectedTraits.length < 3) {
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

    // Final safety check to ensure game doesn't start with Game Over stats
    // Even if traits reduce stats, clamp them to minimum 1 at start
    newStats.academic = Math.max(1, newStats.academic);
    newStats.reputation = Math.max(1, newStats.reputation);
    newStats.satisfaction = Math.max(1, newStats.satisfaction);
    newStats.resources = Math.max(1, newStats.resources);

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
          // Difficulty increase: Only high talent students contribute to academic score on graduation
          if (s.talent > 7) {
            statChanges.academic = (statChanges.academic || 0) + 1;
          }
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

  const buyUpgrade = (upgradeId: string) => {
      const upgrade = UPGRADES.find(u => u.id === upgradeId);
      if (!upgrade) return;
      
      if (gameState.stats.resources >= upgrade.cost) {
          setGameState(prev => ({
              ...prev,
              stats: { ...prev.stats, resources: prev.stats.resources - upgrade.cost },
              upgrades: [...prev.upgrades, upgradeId],
              history: [{ year: prev.year, message: `建设：购买了 ${upgrade.name}`, type: 'upgrade' }, ...prev.history]
          }));
          spawnFloatingText({ resources: -upgrade.cost });
      }
  };

  const startProject = (projId: string) => {
    const projDef = PROJECTS.find(p => p.id === projId);
    if (!projDef) return;

    setGameState(prev => ({
        ...prev,
        activeProject: { defId: projId, startYear: prev.year, progress: 0 },
        history: [{ year: prev.year, message: `项目：申报了【${projDef.name}】`, type: 'project' }, ...prev.history]
    }));
    setShowProjects(false);
  };

  const advanceYear = (bypassSummary = false) => {
    // Check for Retirement
    if (gameState.year >= RETIREMENT_YEAR) {
      // Calculate Rich Ending
      const ending = ENDINGS.find(e => e.condition(gameState.stats, gameState.achievements, gameState.title)) || ENDINGS[ENDINGS.length - 1];
      
      setGameState(prev => ({ 
        ...prev, 
        phase: 'ENDING',
        isGameOver: true,
        endingId: ending.id,
        gameOverReason: ending.title
      }));
      return;
    }

    if (gameState.isGameOver) {
      setGameState(prev => ({ ...prev, phase: 'GAMEOVER' }));
      return;
    }

    // Check for 5-Year Summary Phase (KPI Check)
    if (!bypassSummary && gameState.year % 5 === 0 && gameState.phase !== 'SUMMARY') {
        setGameState(prev => ({ ...prev, phase: 'SUMMARY' }));
        return;
    }

    const nextYear = gameState.year + 1;

    // --- Start of New Year Logic ---

    // 0. Entropy / Decay (High Difficulty Mechanism) - Relaxed Thresholds
    // 逆水行舟，不进则退：高属性维护成本极高
    const decayChanges: Partial<Stats> = {};
    const applyDecay = (val: number) => {
        if (val > 19 && Math.random() < 0.5) return -1; // Raised from 18
        if (val > 16 && Math.random() < 0.3) return -1; // Raised from 14
        if (val > 12 && Math.random() < 0.1) return -1; // Raised from 10
        return 0;
    };

    const dAcademic = applyDecay(gameState.stats.academic);
    const dReputation = applyDecay(gameState.stats.reputation);
    const dSatisfaction = applyDecay(gameState.stats.satisfaction);
    // Resources naturally drain more if you have a lot (people asking for money, maintenance)
    const dResources = gameState.stats.resources > 14 && Math.random() < 0.3 ? -1 : 0; // Raised from 12

    if (dAcademic || dReputation || dSatisfaction || dResources) {
         decayChanges.academic = dAcademic;
         decayChanges.reputation = dReputation;
         decayChanges.satisfaction = dSatisfaction;
         decayChanges.resources = dResources;
    }

    // 1. Trait Synergies & Passives
    let passiveChanges: Partial<Stats> = {};
    let traitLogs: LogEntry[] = [];
    let projectLogs: LogEntry[] = [];
    
    if (dAcademic || dReputation || dSatisfaction || dResources) {
         traitLogs.push({ year: nextYear, message: '【逆水行舟】由于行业竞争与知识迭代，部分属性自然衰减。', type: 'risk' });
         // Combine decay with passive changes object
         passiveChanges.academic = (passiveChanges.academic || 0) + (decayChanges.academic || 0);
         passiveChanges.reputation = (passiveChanges.reputation || 0) + (decayChanges.reputation || 0);
         passiveChanges.satisfaction = (passiveChanges.satisfaction || 0) + (decayChanges.satisfaction || 0);
         passiveChanges.resources = (passiveChanges.resources || 0) + (decayChanges.resources || 0);
    }

    const traitIds = gameState.traits.map(t => t.id);

    // Synergy: Social + Admin
    if (traitIds.includes('t13') && traitIds.includes('t14')) {
        passiveChanges.resources = (passiveChanges.resources || 0) + 1;
    }
    // Passive: Loner
    if (traitIds.includes('t15') && Math.random() < 0.2) {
        passiveChanges.academic = (passiveChanges.academic || 0) + 1;
        passiveChanges.satisfaction = (passiveChanges.satisfaction || 0) - 1;
        traitLogs.push({ year: nextYear, message: '因特质【独行侠】，独自攻克难题但忽略了学生。', type: 'event' });
    }

    // 2. Upgrades Passives
    gameState.upgrades.forEach(uid => {
        const u = UPGRADES.find(def => def.id === uid);
        if (u && u.passive) {
            const effect = u.passive(gameState.stats);
            passiveChanges.academic = (passiveChanges.academic || 0) + (effect.academic || 0);
            passiveChanges.reputation = (passiveChanges.reputation || 0) + (effect.reputation || 0);
            passiveChanges.satisfaction = (passiveChanges.satisfaction || 0) + (effect.satisfaction || 0);
            passiveChanges.resources = (passiveChanges.resources || 0) + (effect.resources || 0);
        }
    });

    // 3. Title Passives
    const currentTitleDef = TITLES.find(t => t.id === gameState.title);
    if (currentTitleDef && currentTitleDef.passive) {
        const effect = currentTitleDef.passive(gameState.stats);
        passiveChanges.academic = (passiveChanges.academic || 0) + (effect.academic || 0);
        passiveChanges.reputation = (passiveChanges.reputation || 0) + (effect.reputation || 0);
        passiveChanges.satisfaction = (passiveChanges.satisfaction || 0) + (effect.satisfaction || 0);
        passiveChanges.resources = (passiveChanges.resources || 0) + (effect.resources || 0);
    }

    // 4. Project Logic
    let nextActiveProject = gameState.activeProject;
    if (gameState.activeProject) {
        const projDef = PROJECTS.find(p => p.id === gameState.activeProject!.defId);
        if (projDef) {
            // Apply cost
            passiveChanges.academic = (passiveChanges.academic || 0) + (projDef.costPerYear.academic || 0);
            passiveChanges.resources = (passiveChanges.resources || 0) + (projDef.costPerYear.resources || 0);
            passiveChanges.satisfaction = (passiveChanges.satisfaction || 0) + (projDef.costPerYear.satisfaction || 0);
            
            // Advance progress
            const newProgress = gameState.activeProject.progress + 1;
            
            if (newProgress >= projDef.duration) {
                // Project Completed!
                projectLogs.push({ year: nextYear, message: `项目结题：【${projDef.name}】圆满完成！`, type: 'project' });
                passiveChanges.academic = (passiveChanges.academic || 0) + (projDef.reward.academic || 0);
                passiveChanges.resources = (passiveChanges.resources || 0) + (projDef.reward.resources || 0);
                passiveChanges.reputation = (passiveChanges.reputation || 0) + (projDef.reward.reputation || 0);
                passiveChanges.satisfaction = (passiveChanges.satisfaction || 0) + (projDef.reward.satisfaction || 0);
                nextActiveProject = null;
            } else {
                nextActiveProject = { ...gameState.activeProject, progress: newProgress };
            }
        }
    }


    // 5. Check Promotion
    let nextTitleId = gameState.title;
    let promotionLog: LogEntry | null = null;
    const currentLevel = currentTitleDef?.level || 1;
    
    // Check titles with higher level
    const nextTitle = TITLES.find(t => t.level === currentLevel + 1);
    if (nextTitle && nextTitle.condition(gameState)) {
        nextTitleId = nextTitle.id;
        promotionLog = { year: nextYear, message: `恭喜！你晋升为【${nextTitle.name}】！`, type: 'promotion' };
        // Initial bonus for promotion could be added here if we wanted
    }


    // 6. Student Lifecycle
    const { newStudents, logMessages, statChanges } = processStudentLifecycle(gameState.stats, gameState.students, nextYear);
    
    // Recruit new students
    const recruitmentCount = Math.floor(Math.random() * 2) + 1; // 1-2 new students per year
    for(let i=0; i<recruitmentCount; i++) {
        newStudents.push(generateStudent(nextYear));
    }

    // 7. Apply Changes (Allow going below 0 for Game Over check)
    const finalStats = {
        academic: gameState.stats.academic + (passiveChanges.academic || 0) + (statChanges.academic || 0),
        reputation: gameState.stats.reputation + (passiveChanges.reputation || 0) + (statChanges.reputation || 0),
        satisfaction: gameState.stats.satisfaction + (passiveChanges.satisfaction || 0) + (statChanges.satisfaction || 0),
        resources: gameState.stats.resources + (passiveChanges.resources || 0) + (statChanges.resources || 0),
    };

    spawnFloatingText({
        academic: (passiveChanges.academic || 0) + (statChanges.academic || 0),
        reputation: (passiveChanges.reputation || 0) + (statChanges.reputation || 0),
        satisfaction: (passiveChanges.satisfaction || 0) + (statChanges.satisfaction || 0),
        resources: (passiveChanges.resources || 0) + (statChanges.resources || 0)
    });
    
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

    // 8. Check Achievements
    let unlockedAchievs = [...gameState.achievements];
    let achievLogs: LogEntry[] = [];
    
    const tempStateForCheck = { ...gameState, stats: finalStats, students: newStudents, year: nextYear }; 
    
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
    
    const allLogs = [...projectLogs, ...achievLogs, ...logMessages, ...traitLogs];
    if (promotionLog) allLogs.push(promotionLog);

    setGameState(prev => ({
      ...prev,
      year: nextYear,
      stats: finalStats,
      students: newStudents,
      achievements: unlockedAchievs,
      studentCount: newStudents.filter(s => s.status === 'active').length,
      history: [...allLogs, ...prev.history],
      phase: 'PLAYING',
      title: nextTitleId,
      activeProject: nextActiveProject
    }));

    // Trigger event after short delay
    setTimeout(() => {
        triggerEvent();
    }, 500);
  };

  const handleChoice = (effect: (s: Stats) => Partial<Stats>, choiceText: string, resultText?: string, setFlag?: string, removeFlag?: string) => {
    const changes = effect(gameState.stats);
    
    spawnFloatingText(changes);

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
            lastEventResult: { text: resultText || '发生了意想不到的事情...', changes }, 
        }));
    }
    
    setGameState(prev => ({
      ...prev,
      stats: newStats,
      flags: newFlags,
      phase: gameOverCheck.isOver ? 'RESULT' : 'RESULT', 
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
        if(gameState.phase !== 'ENDING') { // Don't reset if it's a happy ending
            setGameState(prev => ({ ...prev, phase: 'GAMEOVER', lastEventResult: null }));
        }
    } else {
        setGameState(prev => ({
        ...prev,
        phase: 'PLAYING',
        lastEventResult: null
        }));
    }
  };

  const closeSummary = () => {
      // Check KPI before advancing
      const failedKPI = KPIS.find(k => k.year === gameState.year && !k.condition(gameState.stats));
      if (failedKPI) {
          setGameState(prev => ({
              ...prev,
              phase: 'GAMEOVER',
              isGameOver: true,
              gameOverReason: failedKPI.failMessage
          }));
      } else {
          // Explicitly bypass the summary check to advance to the next year
          advanceYear(true);
      }
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
            <span className="text-red-600 font-bold">警告：非升即走，指标不达标将直接解聘！</span><br/>
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
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-stone-800 serif text-center md:text-left">请选择 3 个初始特质 (每类各选一个)</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-24 md:mb-8">
            {/* Group by category */}
            {(['professional', 'mentorship', 'workplace'] as const).map(cat => {
                const isCatSelected = selectedTraits.some(id => TRAITS.find(t => t.id === id)?.category === cat);
                return (
                    <div key={cat} className="space-y-3">
                        <h3 className="font-bold text-stone-500 uppercase text-sm tracking-wider mb-2">
                            {cat === 'professional' ? '专业能力' : cat === 'mentorship' ? '育人风格' : '职场生存'}
                            {isCatSelected ? <span className="text-green-600 ml-2">✓</span> : ''}
                        </h3>
                        {TRAITS.filter(t => t.category === cat).map(trait => {
                            const isSelected = selectedTraits.includes(trait.id);
                            // Disable if not selected BUT category is already filled
                            const isDisabled = !isSelected && isCatSelected;

                            return (
                                <div 
                                    key={trait.id}
                                    onClick={() => !isDisabled && toggleTrait(trait.id)}
                                    className={`
                                        p-3 md:p-4 rounded-lg border-2 transition-all relative
                                        ${isSelected
                                            ? 'bg-stone-800 border-stone-800 text-white shadow-lg scale-105 z-10' 
                                            : isDisabled 
                                                ? 'bg-stone-100 border-stone-200 text-stone-400 cursor-not-allowed opacity-60'
                                                : 'bg-white border-stone-200 text-stone-600 hover:border-stone-400 cursor-pointer hover:scale-[1.02]'}
                                    `}
                                >
                                    <div className="font-bold text-base md:text-lg mb-1">{trait.name}</div>
                                    <div className="text-xs opacity-80">{trait.description}</div>
                                </div>
                            );
                        })}
                    </div>
                );
            })}
        </div>

        <div className="fixed bottom-0 left-0 right-0 p-4 md:static bg-white/90 backdrop-blur border-t-2 border-stone-200 md:border-t-0 md:bg-transparent md:backdrop-blur-none z-10">
          <div className="max-w-4xl mx-auto flex justify-between items-center bg-white md:p-4 rounded-xl md:border-2 md:border-stone-200 md:shadow-xl">
              <div className="text-stone-600">
                  已选: <span className="font-bold text-stone-900">{selectedTraits.length}/3</span>
                  <span className="text-xs ml-2 text-stone-400 hidden md:inline">(需包含专业、育人、职场各一项)</span>
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
                        {gameState.isGameOver && gameState.phase !== 'ENDING' ? '接受命运' : '确认'}
                    </Button>
                </div>
            </div>
        </div>
    );
  };

  const renderShop = () => {
      return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
            <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden border-2 border-stone-800 animate-in slide-in-from-bottom duration-300 max-h-[90vh] flex flex-col">
                <div className="bg-stone-800 text-white p-4 flex justify-between items-center">
                    <h3 className="text-xl font-bold flex items-center gap-2"><ShoppingCart /> 实验室建设 (经费: {gameState.stats.resources})</h3>
                    <button onClick={() => setShowShop(false)} className="text-white hover:text-stone-300 font-bold">关闭</button>
                </div>
                <div className="p-6 overflow-y-auto grid grid-cols-1 gap-4">
                    {UPGRADES.map(upgrade => {
                        const isBought = gameState.upgrades.includes(upgrade.id);
                        const canAfford = gameState.stats.resources >= upgrade.cost;
                        return (
                            <div key={upgrade.id} className={`flex justify-between items-center p-4 border-2 rounded-lg ${isBought ? 'bg-stone-100 border-stone-200 opacity-70' : 'bg-white border-stone-200'}`}>
                                <div>
                                    <div className="font-bold text-lg">{upgrade.name}</div>
                                    <div className="text-sm text-stone-500">{upgrade.description}</div>
                                </div>
                                {isBought ? (
                                    <span className="text-green-600 font-bold flex items-center gap-1"><CheckCircle2 size={16}/> 已拥有</span>
                                ) : (
                                    <Button 
                                        onClick={() => buyUpgrade(upgrade.id)} 
                                        disabled={!canAfford} 
                                        variant={canAfford ? 'primary' : 'secondary'}
                                        className="py-2 px-4 text-sm"
                                    >
                                        购买 ({upgrade.cost} 经费)
                                    </Button>
                                )}
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
      )
  };

  const renderProjectSelector = () => {
      // Filter available projects (active project blocks new ones)
      const isBusy = !!gameState.activeProject;

      return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
            <div className="max-w-3xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden border-2 border-stone-800 animate-in slide-in-from-bottom duration-300 max-h-[90vh] flex flex-col">
                <div className="bg-stone-800 text-white p-4 flex justify-between items-center">
                    <h3 className="text-xl font-bold flex items-center gap-2"><FileText /> 申报项目</h3>
                    <button onClick={() => setShowProjects(false)} className="text-white hover:text-stone-300 font-bold">关闭</button>
                </div>
                <div className="p-6 overflow-y-auto">
                    {isBusy ? (
                        <div className="text-center py-8 text-stone-500">
                            你当前有正在进行的项目，无法同时申报多个。
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-4">
                            {PROJECTS.map(proj => {
                                const meetsReq = (!proj.reqStats.academic || gameState.stats.academic >= proj.reqStats.academic) &&
                                                 (!proj.reqStats.reputation || gameState.stats.reputation >= proj.reqStats.reputation) &&
                                                 (!proj.reqStats.resources || gameState.stats.resources >= proj.reqStats.resources) &&
                                                 (!proj.reqStats.satisfaction || gameState.stats.satisfaction >= proj.reqStats.satisfaction);
                                
                                return (
                                    <div key={proj.id} className="border-2 border-stone-200 rounded-lg p-4 hover:border-stone-400 transition-colors">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h4 className="font-bold text-lg text-stone-800">{proj.name}</h4>
                                                <span className="text-xs bg-stone-100 px-2 py-1 rounded text-stone-500 font-bold uppercase">{proj.type === 'national' ? '国家级' : proj.type === 'corporate' ? '企业横向' : '人才项目'}</span>
                                                <span className="text-xs bg-blue-50 px-2 py-1 rounded text-blue-600 font-bold ml-2">周期: {proj.duration}年</span>
                                            </div>
                                            <Button 
                                                onClick={() => startProject(proj.id)} 
                                                disabled={!meetsReq} 
                                                variant={meetsReq ? 'primary' : 'secondary'}
                                                className="py-1 px-4 text-sm h-10"
                                            >
                                                {meetsReq ? '申报' : '条件不足'}
                                            </Button>
                                        </div>
                                        <p className="text-stone-600 text-sm mb-3">{proj.description}</p>
                                        
                                        <div className="grid grid-cols-3 gap-2 text-xs bg-stone-50 p-2 rounded">
                                            <div>
                                                <span className="font-bold text-stone-500 block">门槛</span>
                                                {proj.reqStats.academic && <div>学术 {proj.reqStats.academic}</div>}
                                                {proj.reqStats.reputation && <div>口碑 {proj.reqStats.reputation}</div>}
                                                {proj.reqStats.resources && <div>资源 {proj.reqStats.resources}</div>}
                                                {proj.reqStats.satisfaction && <div>学生 {proj.reqStats.satisfaction}</div>}
                                            </div>
                                             <div>
                                                <span className="font-bold text-red-500 block">每年的消耗/代价</span>
                                                {Object.entries(proj.costPerYear).map(([k,v]) => <div key={k}>{STAT_LABELS[k] || k} {v}</div>)}
                                            </div>
                                            <div>
                                                <span className="font-bold text-green-600 block">结题回报</span>
                                                {Object.entries(proj.reward).map(([k,v]) => <div key={k}>{STAT_LABELS[k] || k} +{v}</div>)}
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
      );
  };

  const renderSummary = () => {
      const evaluation = PHASE_EVALUATIONS.find(e => gameState.year >= e.minYear && gameState.year <= e.maxYear) || PHASE_EVALUATIONS[0];
      const activeStudents = gameState.students.filter(s => s.status === 'active').length;
      const graduatedStudents = gameState.students.filter(s => s.status === 'graduated').length;
      
      // KPI Check preview
      const nextKPI = KPIS.find(k => k.year === gameState.year);
      const kpiPassed = nextKPI ? nextKPI.condition(gameState.stats) : true;

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

                    {nextKPI && (
                        <div className={`mb-6 p-4 border-2 rounded-lg text-center ${kpiPassed ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                            <h4 className="font-bold mb-2 uppercase text-sm tracking-wider">非升即走考核结果</h4>
                            <p className="mb-2">{nextKPI.description}</p>
                            {kpiPassed ? (
                                <span className="text-green-600 font-bold flex items-center justify-center gap-2"><CheckCircle2/> 考核通过</span>
                            ) : (
                                <span className="text-red-600 font-bold flex items-center justify-center gap-2"><AlertTriangle/> 考核失败 (将解聘)</span>
                            )}
                        </div>
                    )}

                    <Button onClick={closeSummary} className="w-full">
                        {kpiPassed ? '开启下一个五年' : '接受解聘通知'}
                    </Button>
                </div>
            </div>
        </div>
      );
  };

  const renderGameOver = () => {
    // Check if it is a specific ending or a generic game over
    const ending = gameState.endingId ? ENDINGS.find(e => e.id === gameState.endingId) : null;
    const isSuccess = gameState.phase === 'ENDING';
    const finalTitle = TITLES.find(t => t.id === gameState.title)?.name || '讲师';

    return (
      <div className={`min-h-screen p-4 flex items-center justify-center ${ending ? ending.bgColor : 'bg-red-900'}`}>
          <div className={`max-w-2xl w-full rounded-2xl shadow-2xl p-8 border-4 animate-in zoom-in duration-500 ${isSuccess ? 'bg-white border-stone-200 text-stone-800' : 'bg-stone-900 border-red-700 text-stone-100'}`}>
              <div className="text-center space-y-4">
                  {isSuccess ? (
                      <div className="mx-auto bg-stone-100 p-4 rounded-full w-24 h-24 flex items-center justify-center mb-4">
                        <Trophy size={48} className={ending?.color || 'text-stone-500'} />
                      </div>
                  ) : (
                      <div className="mx-auto bg-red-900/50 p-4 rounded-full w-24 h-24 flex items-center justify-center mb-4">
                        <Skull size={48} className="text-red-500" />
                      </div>
                  )}
                  
                  <div className="mb-2">
                       <span className={`inline-block px-3 py-1 rounded-full text-sm font-bold border ${isSuccess ? 'bg-stone-100 text-stone-600 border-stone-200' : 'bg-red-800 text-red-100 border-red-600'}`}>
                           最终职称：{finalTitle}
                       </span>
                  </div>

                  <h1 className={`text-3xl md:text-5xl font-bold mb-2 font-serif ${ending ? ending.color : 'text-red-500'}`}>
                      {ending ? ending.title : '生涯终结'}
                  </h1>
                  
                  <p className={`text-lg md:text-xl font-serif ${isSuccess ? 'text-stone-600' : 'text-red-300'}`}>
                      {ending ? ending.description : gameState.gameOverReason}
                  </p>
                  
                  {!isSuccess && <p className="text-stone-400 text-sm">
                      坚持了 {gameState.year} 年，倒在了退休前夕。
                  </p>}
                  
                  <div className={`py-8 grid grid-cols-2 md:grid-cols-4 gap-4 text-center border-t border-b ${isSuccess ? 'border-stone-100' : 'border-stone-800'} my-6`}>
                      <div>
                           <div className={`text-xs uppercase ${isSuccess ? 'text-stone-400' : 'text-stone-500'}`}>学术</div>
                           <div className="text-xl font-bold">{gameState.stats.academic}</div>
                      </div>
                      <div>
                           <div className={`text-xs uppercase ${isSuccess ? 'text-stone-400' : 'text-stone-500'}`}>口碑</div>
                           <div className="text-xl font-bold">{gameState.stats.reputation}</div>
                      </div>
                       <div>
                           <div className={`text-xs uppercase ${isSuccess ? 'text-stone-400' : 'text-stone-500'}`}>学生</div>
                           <div className="text-xl font-bold">{gameState.stats.satisfaction}</div>
                      </div>
                       <div>
                           <div className={`text-xs uppercase ${isSuccess ? 'text-stone-400' : 'text-stone-500'}`}>资源</div>
                           <div className="text-xl font-bold">{gameState.stats.resources}</div>
                      </div>
                  </div>

                  <div className="space-y-3">
                      <Button onClick={startGame} variant={isSuccess ? 'primary' : 'danger'} className="w-full py-4 text-lg">
                          {isSuccess ? '开启第二人生 (重开)' : '不服！重开！'}
                      </Button>
                  </div>
              </div>
          </div>
      </div>
    );
  };

  const renderDashboard = () => {
    // Check for affordable upgrades
    const hasAffordableUpgrade = UPGRADES.some(u => 
        !gameState.upgrades.includes(u.id) && gameState.stats.resources >= u.cost
    );

    // Check for available projects (if no active project and has project meeting requirements)
    const hasAvailableProject = !gameState.activeProject && PROJECTS.some(p => 
        (!p.reqStats.academic || gameState.stats.academic >= p.reqStats.academic) &&
        (!p.reqStats.reputation || gameState.stats.reputation >= p.reqStats.reputation) &&
        (!p.reqStats.resources || gameState.stats.resources >= p.reqStats.resources) &&
        (!p.reqStats.satisfaction || gameState.stats.satisfaction >= p.reqStats.satisfaction)
    );

    // KPI Calc
    const currentKPIIndex = Math.floor((gameState.year - 1) / 5);
    const nextKPITarget = KPIS[currentKPIIndex];
    const kpiDeadline = (currentKPIIndex + 1) * 5;

    // Project Progress
    const activeProjDef = gameState.activeProject ? PROJECTS.find(p => p.id === gameState.activeProject!.defId) : null;

    return (
    <div className="min-h-screen bg-stone-100 pb-20 md:pb-8 relative">
      
      {/* Floating Texts Container */}
      {floatingTexts.map(ft => (
          <div key={ft.id} className={`fixed z-[100] font-bold text-xl pointer-events-none animate-float ${ft.color}`} style={{ left: ft.left, top: ft.top }}>
              {ft.text}
          </div>
      ))}

      {/* Mobile Top Header */}
      <div className="md:hidden bg-white border-b border-stone-200 p-4 sticky top-0 z-30 shadow-sm flex justify-between items-center">
         <div>
             <div className="text-xs text-stone-400 uppercase font-bold">第 {gameState.year} 年</div>
             <div className="font-bold text-stone-800 flex items-center gap-1">
                 <Award size={16} className="text-amber-500"/>
                 {TITLES.find(t => t.id === gameState.title)?.name || '讲师'}
             </div>
         </div>
         <div className="text-xs bg-stone-100 px-2 py-1 rounded text-stone-500 font-bold">
             退休: {RETIREMENT_YEAR - gameState.year}年
         </div>
      </div>

      <div className="max-w-5xl mx-auto p-4 md:p-8 grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Left Column (Stats) - Hidden on mobile unless 'stats' tab is active */}
        <div className={`md:col-span-4 space-y-6 ${mobileTab === 'stats' ? 'block' : 'hidden md:block'}`}>
            <Card className="md:sticky md:top-6">
                {/* Desktop Header */}
                <div className="hidden md:flex mb-6 items-center justify-between border-b border-stone-100 pb-4">
                    <h2 className="text-xl md:text-2xl font-bold serif">第 {gameState.year} 年</h2>
                    <span className="text-xs md:text-sm font-bold bg-stone-200 px-2 py-1 rounded text-stone-600">距离退休: {RETIREMENT_YEAR - gameState.year + 1}年</span>
                </div>
                
                <div className="hidden md:block mb-4">
                    <div className="text-xs text-stone-500 uppercase font-bold mb-1">当前职称</div>
                    <div className="text-lg font-bold text-stone-800 bg-stone-50 p-2 rounded border border-stone-200 flex items-center gap-2">
                        <Award className="text-amber-500" size={20} />
                        {TITLES.find(t => t.id === gameState.title)?.name || '讲师'}
                    </div>
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

             {/* Student List (Shown in stats tab on mobile) */}
            <div className="grid grid-cols-1 gap-4">
                <Card className="max-h-80 overflow-y-auto custom-scrollbar">
                     <h3 className="font-bold text-sm text-stone-500 uppercase mb-3 flex items-center gap-2">
                         <GraduationCap size={16} /> 在读高潜学生
                     </h3>
                     <div className="space-y-2">
                        {gameState.students.filter(s => s.status === 'active').sort((a,b) => b.talent - a.talent).map(s => (
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
            </div>
        </div>

        {/* Right Column (Career) - Hidden on mobile unless 'career' tab is active */}
        <div className={`md:col-span-8 flex flex-col gap-6 ${mobileTab === 'career' ? 'block' : 'hidden md:flex'}`}>
            {/* Action Bar */}
            <div className="bg-white border-2 border-stone-200 rounded-xl p-4 flex flex-col md:grid md:grid-cols-[1fr_auto] gap-4 shadow-sm sticky top-[72px] md:top-0 z-20">
                 <div className="font-serif italic text-stone-500 text-center sm:text-left hidden md:block self-center">
                    "{gameState.history[0]?.message || '新的学年开始了...'}"
                 </div>
                 <div className="grid grid-cols-3 gap-2 w-full md:w-auto">
                     <Button onClick={() => setShowProjects(true)} variant="secondary" className="px-2 py-3 text-sm md:text-base md:px-6 relative whitespace-nowrap">
                         <FileText size={18} className="hidden md:inline" /> 申报
                         {hasAvailableProject && (
                            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse border border-white"></span>
                         )}
                     </Button>
                     <Button onClick={() => setShowShop(true)} variant="secondary" className="px-2 py-3 text-sm md:text-base md:px-6 relative whitespace-nowrap">
                         <ShoppingCart size={18} className="hidden md:inline" /> 建设
                         {hasAffordableUpgrade && (
                            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse border border-white"></span>
                         )}
                     </Button>
                     <Button onClick={() => advanceYear(false)} disabled={gameState.phase === 'EVENT' || gameState.phase === 'RESULT' || gameState.phase === 'SUMMARY'} className="px-2 py-3 text-sm md:text-base md:px-6 whitespace-nowrap">
                        {gameState.year % 5 === 0 && gameState.year < RETIREMENT_YEAR ? '阶段总结' : '下一年'}
                     </Button>
                 </div>
            </div>

             {/* System Status: KPI & Project */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* KPI Tracker */}
                {nextKPITarget && (
                    <div className="bg-stone-50 border border-stone-200 rounded-lg p-3 flex items-center justify-between">
                        <div>
                             <div className="text-xs font-bold text-stone-400 uppercase flex items-center gap-1">
                                <Target size={12} /> 非升即走考核 (Year {kpiDeadline})
                             </div>
                             <div className="text-sm font-bold text-stone-700 mt-1">{nextKPITarget.description}</div>
                        </div>
                        <div className="text-2xl font-bold text-stone-300">
                             {kpiDeadline - gameState.year}y
                        </div>
                    </div>
                )}
                
                {/* Active Project */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                     <div className="text-xs font-bold text-blue-400 uppercase flex items-center gap-1">
                        <Timer size={12} /> 当前项目
                     </div>
                     {activeProjDef ? (
                         <div className="flex justify-between items-end">
                             <div>
                                 <div className="text-sm font-bold text-blue-800 mt-1">{activeProjDef.name}</div>
                                 <div className="text-xs text-blue-600">进度: {gameState.activeProject!.progress}/{activeProjDef.duration} 年</div>
                             </div>
                             <div className="w-16 h-1.5 bg-blue-200 rounded-full overflow-hidden">
                                  <div className="h-full bg-blue-500 transition-all duration-500" style={{ width: `${(gameState.activeProject!.progress / activeProjDef.duration) * 100}%` }}></div>
                             </div>
                         </div>
                     ) : (
                         <div className="text-sm text-blue-400 italic mt-1">暂无在研项目</div>
                     )}
                </div>
            </div>

            {/* Desktop Student List Preview (Hidden on Mobile, moved to stats tab) */}
            <div className="hidden md:grid grid-cols-2 gap-4">
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
            <Card className="flex-1 min-h-[60vh] md:min-h-[400px] flex flex-col">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-lg flex items-center gap-2">
                        <RefreshCw className="w-4 h-4" /> 生涯记录
                    </h3>
                </div>
                <div className="flex-1 overflow-y-auto space-y-4 max-h-[60vh] md:max-h-[400px] pr-2 custom-scrollbar">
                    {gameState.history.map((entry, idx) => (
                        <div key={idx} className={`p-3 rounded border-l-4 text-sm ${
                            entry.type === 'milestone' ? 'border-emerald-500 bg-emerald-50' :
                            entry.type === 'achievement' ? 'border-amber-500 bg-amber-50' :
                            entry.type === 'risk' ? 'border-red-500 bg-red-50' :
                            entry.type === 'promotion' ? 'border-purple-500 bg-purple-50' :
                            entry.type === 'upgrade' ? 'border-blue-500 bg-blue-50' :
                            entry.type === 'project' ? 'border-indigo-500 bg-indigo-50' :
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

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-stone-200 flex z-40">
           <button 
                onClick={() => setMobileTab('career')}
                className={`flex-1 p-4 flex flex-col items-center justify-center gap-1 ${mobileTab === 'career' ? 'text-stone-900 bg-stone-50' : 'text-stone-400'}`}
            >
               <ScrollText size={20} />
               <span className="text-xs font-bold">生涯</span>
           </button>
           <button 
                onClick={() => setMobileTab('stats')}
                className={`flex-1 p-4 flex flex-col items-center justify-center gap-1 ${mobileTab === 'stats' ? 'text-stone-900 bg-stone-50' : 'text-stone-400'}`}
            >
               <LayoutDashboard size={20} />
               <span className="text-xs font-bold">数据</span>
           </button>
      </div>

      {/* Modals */}
      {showShop && renderShop()}
      {showProjects && renderProjectSelector()}
      {gameState.phase === 'EVENT' && renderEvent()}
      {gameState.phase === 'RESULT' && renderResult()}
      {gameState.phase === 'SUMMARY' && renderSummary()}
    </div>
  );
  };

  return (
    <>
      {gameState.phase === 'MENU' && renderMenu()}
      {gameState.phase === 'CREATION' && renderCreation()}
      {(gameState.phase === 'PLAYING' || gameState.phase === 'EVENT' || gameState.phase === 'RESULT' || gameState.phase === 'SUMMARY') && renderDashboard()}
      {(gameState.phase === 'GAMEOVER' || gameState.phase === 'ENDING') && renderGameOver()}
    </>
  );
}
