export interface User {
  id: string;
  telegramId: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  photoUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Workspace {
  id: string;
  name: string;
  description?: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  members?: WorkspaceMember[];
  projects?: Project[];
}

export interface WorkspaceMember {
  id: string;
  workspaceId: string;
  userId: string;
  role: 'owner' | 'admin' | 'member';
  joinedAt: string;
  user?: User;
}

export interface Project {
  id: string;
  workspaceId: string;
  name: string;
  description?: string;
  color?: string;
  icon?: string;
  createdAt: string;
  updatedAt: string;
  workspace?: Workspace;
  boards?: Board[];
}

export interface Board {
  id: string;
  projectId: string;
  name: string;
  description?: string;
  viewType: 'kanban' | 'list' | 'calendar' | 'timeline';
  createdAt: string;
  updatedAt: string;
  project?: Project;
  columns?: BoardColumn[];
  tasks?: Task[];
}

export interface BoardColumn {
  id: string;
  boardId: string;
  name: string;
  position: number;
  color?: string;
  createdAt: string;
  updatedAt: string;
  board?: Board;
  tasks?: Task[];
}

export interface Task {
  id: string;
  boardId: string;
  columnId?: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'todo' | 'in_progress' | 'done' | 'archived';
  position: number;
  assigneeId?: string;
  reporterId?: string;
  dueDate?: string;
  startDate?: string;
  estimatedHours?: number;
  actualHours?: number;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
  board?: Board;
  column?: BoardColumn;
  assignee?: User;
  reporter?: User;
  comments?: Comment[];
  attachments?: Attachment[];
  subtasks?: Task[];
  parentTask?: Task;
}

export interface Comment {
  id: string;
  taskId: string;
  userId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  task?: Task;
  user?: User;
}

export interface Attachment {
  id: string;
  taskId: string;
  userId: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  createdAt: string;
  task?: Task;
  user?: User;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'task_assigned' | 'task_updated' | 'comment_added' | 'due_date_reminder' | 'mention';
  title: string;
  message: string;
  isRead: boolean;
  relatedTaskId?: string;
  relatedCommentId?: string;
  createdAt: string;
  user?: User;
  relatedTask?: Task;
}

export interface Activity {
  id: string;
  userId: string;
  workspaceId?: string;
  projectId?: string;
  taskId?: string;
  action: string;
  entityType: 'workspace' | 'project' | 'board' | 'task' | 'comment';
  entityId: string;
  metadata?: Record<string, any>;
  createdAt: string;
  user?: User;
}

export interface CalendarEvent {
  id: string;
  taskId: string;
  title: string;
  start: string;
  end: string;
  allDay: boolean;
  task?: Task;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiError {
  message: string;
  statusCode: number;
  errors?: Record<string, string[]>;
}
