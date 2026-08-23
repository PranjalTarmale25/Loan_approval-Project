import { useState } from 'react';
import { UserCircle, Mail, Calendar, ShieldCheck, Pencil, X, Check, AlertCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabaseClient';

type ProfileData = {
  fullName: string;
  email: string;
  gender: string;
  memberSince: string;
};

export default function Profile() {
  const { profile, user, refreshProfile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [editForm, setEditForm] = useState<ProfileData>({
    fullName: profile?.full_name ?? '',
    email: profile?.email ?? '',
    gender: profile?.gender ?? '',
    memberSince: profile?.created_at ? new Date(profile.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : '',
  });

  function startEditing() {
    setEditForm({
      fullName: profile?.full_name ?? '',
      email: profile?.email ?? '',
      gender: profile?.gender ?? '',
      memberSince: profile?.created_at ? new Date(profile.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : '',
    });
    setError('');
    setEditing(true);
  }

  function handleCancel() {
    setEditing(false);
    setError('');
  }

  async function handleSave() {
    setSaving(true);
    setError('');

    const { error: updateError } = await supabase
      .from('customers')
      .update({
        full_name: editForm.fullName,
        gender: editForm.gender || null,
      })
      .eq('customer_id', profile!.customer_id);

    setSaving(false);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    await refreshProfile();
    setEditing(false);
  }

  if (!profile) {
    return (
      <div className="animate-fade-in">
        <div className="border-b border-slate-200 bg-white px-6 py-5 lg:px-8">
          <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900">My Profile</h1>
          <p className="mt-1 text-sm text-slate-500">Manage your account information.</p>
        </div>

        <div className="p-6 lg:p-8">
          <div className="card flex flex-col items-center justify-center p-12 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
              <UserCircle className="h-7 w-7" />
            </div>
            <h3 className="mt-4 font-display text-base font-semibold text-slate-900">
              Your profile is not complete yet.
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Complete your profile to continue.
            </p>
            <button
              onClick={startEditing}
              className="btn-primary mt-5"
            >
              <Pencil className="h-4 w-4" />
              Complete Profile
            </button>
          </div>
        </div>
      </div>
    );
  }

  const memberSince = profile.created_at
    ? new Date(profile.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : '';

  return (
    <div className="animate-fade-in">
      <div className="border-b border-slate-200 bg-white px-6 py-5 lg:px-8">
        <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900">My Profile</h1>
        <p className="mt-1 text-sm text-slate-500">Manage your account information.</p>
      </div>

      <div className="p-6 lg:p-8">
        <div className="mx-auto max-w-3xl space-y-6">
          {error && (
            <div className="card flex items-center gap-3 p-4">
              <AlertCircle className="h-5 w-5 text-rose-500" />
              <p className="text-sm text-rose-700">{error}</p>
            </div>
          )}

          {/* Profile header */}
          <div className="card p-6 sm:p-8">
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-sky-50 ring-1 ring-sky-600/10">
                  <UserCircle className="h-10 w-10 text-sky-600" />
                </div>
                <div className="text-center sm:text-left">
                  <h2 className="font-display text-xl font-bold text-slate-900">
                    {profile.full_name || 'Not set'}
                  </h2>
                  <p className="text-sm text-slate-500">{profile.email || user?.email}</p>
                  <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-sky-50 px-2.5 py-1 text-xs font-semibold text-sky-700 ring-1 ring-sky-600/20">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    Registered User
                  </span>
                </div>
              </div>
              {!editing && (
                <button onClick={startEditing} className="btn-secondary">
                  <Pencil className="h-4 w-4" />
                  Edit Profile
                </button>
              )}
            </div>
          </div>

          {/* Account details */}
          <div className="card p-6 sm:p-8">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="font-display text-base font-semibold text-slate-900">Account Information</h3>
              {editing && (
                <div className="flex gap-2">
                  <button onClick={handleSave} disabled={saving} className="btn-primary disabled:opacity-60">
                    <Check className="h-4 w-4" />
                    {saving ? 'Saving...' : 'Save'}
                  </button>
                  <button onClick={handleCancel} className="btn-secondary">
                    <X className="h-4 w-4" />
                    Cancel
                  </button>
                </div>
              )}
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
                  <UserCircle className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-slate-400">Full Name</p>
                  {editing ? (
                    <input
                      type="text"
                      className="input-field mt-1"
                      value={editForm.fullName}
                      onChange={(e) => setEditForm((p) => ({ ...p, fullName: e.target.value }))}
                    />
                  ) : (
                    <p className="text-sm font-medium text-slate-900">{profile.full_name || 'Not set'}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
                  <Mail className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-slate-400">Email</p>
                  <p className="text-sm font-medium text-slate-900">{profile.email || user?.email || 'Not set'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
                  <UserCircle className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-slate-400">Gender</p>
                  {editing ? (
                    <select
                      className="input-field mt-1"
                      value={editForm.gender}
                      onChange={(e) => setEditForm((p) => ({ ...p, gender: e.target.value }))}
                    >
                      <option value="">Not set</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  ) : (
                    <p className="text-sm font-medium text-slate-900">{profile.gender || 'Not set'}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
                  <Calendar className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-slate-400">Member Since</p>
                  <p className="text-sm font-medium text-slate-900">{memberSince || 'Not available'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
