import { create } from 'zustand';

interface AgentState {
  id: number;
  name: string;
  status: 'ACTIVE' | 'IDLE' | 'ERROR';
  currentAction: string;
  progress: number;
  prospectsProcessed: number;
}

interface AgentStore {
  agents: AgentState[];
  isSquadMissionActive: boolean;
  toggleAgent: (id: number) => void;
  updateAgent: (id: number, updates: Partial<AgentState>) => void;
  startSquadMission: (config: any) => Promise<void>;
  setSquadMissionActive: (active: boolean) => void;
}

export const useAgentStore = create<AgentStore>((set, get) => ({
  agents: [
    { id: 1, name: 'Discovery Agent', status: 'IDLE', currentAction: 'Waiting for instructions...', progress: 0, prospectsProcessed: 142 },
    { id: 2, name: 'Outreach Agent', status: 'IDLE', currentAction: 'Standby...', progress: 0, prospectsProcessed: 89 },
    { id: 3, name: 'Negotiation Agent', status: 'IDLE', currentAction: 'Monitoring replies...', progress: 0, prospectsProcessed: 12 },
  ],
  isSquadMissionActive: false,
  setSquadMissionActive: (active) => set({ isSquadMissionActive: active }),
  toggleAgent: (id) => set((state) => ({
    agents: state.agents.map((a) =>
      a.id === id ? { ...a, status: a.status === 'ACTIVE' ? 'IDLE' : 'ACTIVE' } : a
    )
  })),
  updateAgent: (id, updates) => set((state) => ({
    agents: state.agents.map((a) => a.id === id ? { ...a, ...updates } : a)
  })),
  startSquadMission: async (config) => {
    const { updateAgent, toggleAgent, setSquadMissionActive } = get();
    setSquadMissionActive(true);

    try {
      updateAgent(1, { status: 'ACTIVE', currentAction: 'Initializing deep scan...', progress: 10 });
      updateAgent(2, { status: 'ACTIVE', currentAction: 'Preparing outreach sequences...', progress: 10 });
      updateAgent(3, { status: 'ACTIVE', currentAction: 'Standing by for replies...', progress: 50 });

      const missionRes = await fetch('/api/agents/mission', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: config.global.categories[0],
          location: config.global.targetRegion
        })
      });

      if (!missionRes.ok) {
        updateAgent(1, { status: 'ERROR', currentAction: 'Discovery failed.', progress: 0 });
        updateAgent(2, { status: 'ERROR', currentAction: 'Outreach failed.', progress: 0 });
        return;
      }

      const result = await missionRes.json();
      const discoveryOk = result?.discovery?.status === 'success';
      const outreachOk = result?.outreach?.status === 'success';

      updateAgent(1, { status: discoveryOk ? 'IDLE' : 'ERROR', currentAction: discoveryOk ? 'Discovery complete.' : 'Discovery failed.', progress: discoveryOk ? 100 : 0 });
      updateAgent(2, { status: outreachOk ? 'IDLE' : 'ERROR', currentAction: outreachOk ? 'Outreach complete.' : 'Outreach failed.', progress: outreachOk ? 100 : 0 });
      updateAgent(3, { status: 'ACTIVE', currentAction: 'Monitoring inbound replies...', progress: 50 });

      setTimeout(() => updateAgent(1, { status: 'IDLE', currentAction: 'Waiting for instructions...', progress: 0 }), 2000);
      setTimeout(() => updateAgent(2, { status: 'IDLE', currentAction: 'Standby...', progress: 0 }), 2000);
    } catch (e) {
      console.error('Squad mission error:', e);
    } finally {
      setTimeout(() => setSquadMissionActive(false), 5000);
    }
  },
}));

interface Notification {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: Date;
  isUrgent?: boolean;
  read: boolean;
  agentId?: number;
  agentName?: string;
}

interface NotificationStore {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (n: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
}

export const useNotificationStore = create<NotificationStore>((set) => ({
  notifications: [],
  unreadCount: 0,
  addNotification: (n) => set((state) => {
    const newNotification: Notification = {
      ...n,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      read: false
    };
    return {
      notifications: [newNotification, ...state.notifications],
      unreadCount: state.unreadCount + 1,
    };
  }),
  markAllAsRead: () => set((state) => ({
    notifications: state.notifications.map((n) => ({ ...n, read: true })),
    unreadCount: 0
  })),
  clearNotifications: () => set({ notifications: [], unreadCount: 0 }),
}));

// Export legacy notification hook for backward compatibility if needed, 
// but encourage migration to the unified store or specific components
export const useLegacyNotificationStore = useNotificationStore;

// Agent Configuration (derived from PROMPT2.md, minimized to essentials)
export interface AgentConfig {
  global: {
    targetRegion: string;
    categories: string[];
  };
  modules?: {
    sentimentAnalysis: boolean;
    competitorTracking: boolean;
    autoEscalation: boolean;
  };
  agent1: {
    searchDepth: number; // 1-10
    scoringWeightRevenue: number; // 0-100
    gapCriteria: string[];
    competitorAnalysis: boolean;
  };
  agent2: {
    senderIdentity: 'Executive Concierge (Sarah)' | 'Technical Advisor (Marcus)' | 'Growth Specialist (Alex)';
    brandTone: 'Professional' | 'Aggressive' | 'Helpful';
    personalityProfile: 'Empathetic' | 'Data-Driven' | 'Challenger';
    abTesting: boolean;
    dailySendLimit: number;
    smartScheduling: boolean;
  };
  agent3: {
    rules: Array<{ service: string; min: number; max: number; threshold?: string }>;
    escalationDiscountPercent: number; // trigger threshold
  };
}

interface ConfigStore {
  config: AgentConfig;
  setConfig: (cfg: Partial<AgentConfig>) => void;
}

export const useAgentConfig = create<ConfigStore>((set) => ({
  config: {
    global: { targetRegion: 'San Francisco, CA', categories: ['E-commerce', 'Healthcare'] },
    modules: { sentimentAnalysis: true, competitorTracking: true, autoEscalation: false },
    agent1: {
      searchDepth: 4,
      scoringWeightRevenue: 85,
      gapCriteria: ['Missing Website', 'Low SEO Score', 'No Social Presence'],
      competitorAnalysis: true
    },
    agent2: {
      senderIdentity: 'Executive Concierge (Sarah)',
      brandTone: 'Professional',
      personalityProfile: 'Empathetic',
      abTesting: true,
      dailySendLimit: 450,
      smartScheduling: true
    },
    agent3: { rules: [{ service: 'SEO Audit', min: 500, max: 1500 }, { service: 'PPC Setup', min: 1200, max: 3000 }], escalationDiscountPercent: 25 },
  },
  setConfig: (cfg) => set((state) => ({
    config: {
      ...state.config,
      ...cfg,
      global: { ...state.config.global, ...(cfg.global || {}) },
      modules: { ...state.config.modules, ...(cfg.modules || {}) },
      agent1: { ...state.config.agent1, ...(cfg.agent1 || {}) },
      agent2: { ...state.config.agent2, ...(cfg.agent2 || {}) },
      agent3: { ...state.config.agent3, ...(cfg.agent3 || {}) },
    }
  })),
}));
