import { create } from 'zustand';

interface ModalState {
  createWorkspace: boolean;
  createProject: boolean;
  createBoard: boolean;
  createTask: boolean;
  editTask: boolean;
  taskDetails: boolean;
  userProfile: boolean;
  settings: boolean;
}

interface NavigationState {
  selectedWorkspaceId: string | null;
  selectedProjectId: string | null;
  selectedBoardId: string | null;
  sidebarOpen: boolean;
}

interface UIState {
  modals: ModalState;
  navigation: NavigationState;
  openModal: (modalName: keyof ModalState) => void;
  closeModal: (modalName: keyof ModalState) => void;
  closeAllModals: () => void;
  setSelectedWorkspace: (workspaceId: string | null) => void;
  setSelectedProject: (projectId: string | null) => void;
  setSelectedBoard: (boardId: string | null) => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
}

const initialModals: ModalState = {
  createWorkspace: false,
  createProject: false,
  createBoard: false,
  createTask: false,
  editTask: false,
  taskDetails: false,
  userProfile: false,
  settings: false,
};

export const useUIStore = create<UIState>((set) => ({
  modals: initialModals,
  navigation: {
    selectedWorkspaceId: null,
    selectedProjectId: null,
    selectedBoardId: null,
    sidebarOpen: true,
  },
  openModal: (modalName) =>
    set((state) => ({
      modals: { ...state.modals, [modalName]: true },
    })),
  closeModal: (modalName) =>
    set((state) => ({
      modals: { ...state.modals, [modalName]: false },
    })),
  closeAllModals: () =>
    set({
      modals: initialModals,
    }),
  setSelectedWorkspace: (workspaceId) =>
    set((state) => ({
      navigation: { ...state.navigation, selectedWorkspaceId: workspaceId },
    })),
  setSelectedProject: (projectId) =>
    set((state) => ({
      navigation: { ...state.navigation, selectedProjectId: projectId },
    })),
  setSelectedBoard: (boardId) =>
    set((state) => ({
      navigation: { ...state.navigation, selectedBoardId: boardId },
    })),
  toggleSidebar: () =>
    set((state) => ({
      navigation: { ...state.navigation, sidebarOpen: !state.navigation.sidebarOpen },
    })),
  setSidebarOpen: (open) =>
    set((state) => ({
      navigation: { ...state.navigation, sidebarOpen: open },
    })),
}));
