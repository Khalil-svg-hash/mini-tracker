import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { workspacesApi } from '../api/workspaces';
import { useAuth } from '../hooks/useAuth';
import type { Workspace } from '../types';

export function SettingsPage() {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'general' | 'members' | 'danger'>('general');
  
  const [workspaceName, setWorkspaceName] = useState('');
  const [workspaceDescription, setWorkspaceDescription] = useState('');
  const [inviteCode] = useState('ABC123XYZ');

  useEffect(() => {
    if (workspaceId) {
      loadWorkspace();
    }
  }, [workspaceId]);

  const loadWorkspace = async () => {
    if (!workspaceId) return;

    try {
      setLoading(true);
      const workspaceData = await workspacesApi.getById(workspaceId);
      setWorkspace(workspaceData);
      setWorkspaceName(workspaceData.name);
      setWorkspaceDescription(workspaceData.description || '');
    } catch (error) {
      console.error('Failed to load workspace:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateWorkspace = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!workspaceId) return;

    try {
      await workspacesApi.update(workspaceId, {
        name: workspaceName,
        description: workspaceDescription,
      });
      loadWorkspace();
    } catch (error) {
      console.error('Failed to update workspace:', error);
    }
  };

  const handleDeleteWorkspace = async () => {
    if (!workspaceId || !window.confirm('Are you sure you want to delete this workspace? This action cannot be undone.')) {
      return;
    }

    try {
      await workspacesApi.delete(workspaceId);
      navigate('/workspaces');
    } catch (error) {
      console.error('Failed to delete workspace:', error);
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    if (!workspaceId || !window.confirm('Are you sure you want to remove this member?')) {
      return;
    }

    try {
      await workspacesApi.removeMember(workspaceId, memberId);
      loadWorkspace();
    } catch (error) {
      console.error('Failed to remove member:', error);
    }
  };

  const handleUpdateMemberRole = async (memberId: string, role: string) => {
    if (!workspaceId) return;

    try {
      await workspacesApi.updateMemberRole(workspaceId, memberId, role);
      loadWorkspace();
    } catch (error) {
      console.error('Failed to update member role:', error);
    }
  };

  const isOwner = workspace?.ownerId === user?.id;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading settings...</p>
        </div>
      </div>
    );
  }

  if (!workspace) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Workspace not found</h1>
          <button
            onClick={() => navigate('/workspaces')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go to Workspaces
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-4">
        <div className="mb-6">
          <button
            onClick={() => navigate(`/workspaces/${workspaceId}/projects`)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Workspace
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Workspace Settings</h1>
          <p className="text-gray-600 mt-2">{workspace.name}</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('general')}
              className={`px-6 py-3 font-medium transition ${
                activeTab === 'general'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              General
            </button>
            <button
              onClick={() => setActiveTab('members')}
              className={`px-6 py-3 font-medium transition ${
                activeTab === 'members'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Members
            </button>
            {isOwner && (
              <button
                onClick={() => setActiveTab('danger')}
                className={`px-6 py-3 font-medium transition ${
                  activeTab === 'danger'
                    ? 'border-b-2 border-red-600 text-red-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Danger Zone
              </button>
            )}
          </div>

          <div className="p-6">
            {activeTab === 'general' && (
              <form onSubmit={handleUpdateWorkspace}>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Workspace Name
                  </label>
                  <input
                    type="text"
                    value={workspaceName}
                    onChange={(e) => setWorkspaceName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={!isOwner}
                    required
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={workspaceDescription}
                    onChange={(e) => setWorkspaceDescription(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={4}
                    disabled={!isOwner}
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Invite Code
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={inviteCode}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                      readOnly
                    />
                    <button
                      type="button"
                      onClick={() => navigator.clipboard.writeText(inviteCode)}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                    >
                      Copy
                    </button>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Share this code with others to invite them to this workspace
                  </p>
                </div>

                {isOwner && (
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Save Changes
                  </button>
                )}
              </form>
            )}

            {activeTab === 'members' && (
              <div>
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Members ({workspace.members?.length || 0})
                  </h3>
                </div>

                <div className="space-y-3">
                  {workspace.members?.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center">
                          {(member.user?.firstName?.[0] || member.user?.username?.[0] || '?').toUpperCase()}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">
                            {member.user?.firstName || member.user?.username || 'Unknown User'}
                          </div>
                          <div className="text-sm text-gray-500">
                            Joined {new Date(member.joinedAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {isOwner && member.userId !== workspace.ownerId ? (
                          <select
                            value={member.role}
                            onChange={(e) => handleUpdateMemberRole(member.id, e.target.value)}
                            className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="member">Member</option>
                            <option value="admin">Admin</option>
                          </select>
                        ) : (
                          <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm">
                            {member.role}
                          </span>
                        )}
                        {isOwner && member.userId !== workspace.ownerId && (
                          <button
                            onClick={() => handleRemoveMember(member.id)}
                            className="px-3 py-1 text-red-600 hover:bg-red-50 rounded text-sm"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'danger' && isOwner && (
              <div>
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-red-600">Danger Zone</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    These actions are irreversible. Please be careful.
                  </p>
                </div>

                <div className="border border-red-300 rounded-lg p-4 bg-red-50">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Delete Workspace</h4>
                      <p className="text-sm text-gray-600">
                        Once deleted, all projects, boards, and tasks will be permanently removed.
                      </p>
                    </div>
                    <button
                      onClick={handleDeleteWorkspace}
                      className="ml-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 whitespace-nowrap"
                    >
                      Delete Workspace
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
