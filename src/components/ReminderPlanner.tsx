import React, { useState } from 'react';
import { 
  Bell, 
  Plus, 
  CheckCircle2, 
  Clock, 
  Trash2, 
  Calendar, 
  AlertCircle,
  Tag
} from 'lucide-react';
import { ReminderTask, ApplicationDraft } from '../types';

interface ReminderPlannerProps {
  reminders: ReminderTask[];
  applications: ApplicationDraft[];
  onSaveReminder: (rem: ReminderTask) => void;
  onDeleteReminder: (id: string) => void;
}

export const ReminderPlanner: React.FC<ReminderPlannerProps> = ({
  reminders,
  applications,
  onSaveReminder,
  onDeleteReminder
}) => {
  const [isAddingNew, setIsAddingNew] = useState<boolean>(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDateTime, setDueDateTime] = useState('');
  const [selectedAppId, setSelectedAppId] = useState('');
  const [priority, setPriority] = useState<'HIGH' | 'MEDIUM' | 'LOW'>('HIGH');

  const now = new Date();

  const handleCreateReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !dueDateTime) return;

    const linkedApp = applications.find(a => a.id === selectedAppId);

    const newRem: ReminderTask = {
      id: `rem-${Date.now()}`,
      citizenId: 'citizen-demo-01',
      applicationId: selectedAppId || undefined,
      schemeTitle: linkedApp?.schemeTitle,
      title: title.trim(),
      description: description.trim(),
      dueDateTime: new Date(dueDateTime).toISOString(),
      isCompleted: false,
      priority,
      createdAt: new Date().toISOString()
    };

    onSaveReminder(newRem);
    setTitle('');
    setDescription('');
    setDueDateTime('');
    setSelectedAppId('');
    setIsAddingNew(false);
  };

  const handleToggleComplete = (rem: ReminderTask) => {
    onSaveReminder({ ...rem, isCompleted: !rem.isCompleted });
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#25303c]">
        <div>
          <h2 className="text-2xl font-black text-[#fdfbf7] flex items-center space-x-2">
            <Bell className="w-6 h-6 text-amber-400" />
            <span>Follow-Up & Reminder Planner</span>
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Never miss a government scheme renewal, certificate update, or verification window.
          </p>
        </div>

        <button
          onClick={() => setIsAddingNew(!isAddingNew)}
          className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center space-x-1.5 shadow-md shadow-amber-950 transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Follow-up Task</span>
        </button>
      </div>

      {/* Add Reminder Modal / Form Drawer */}
      {isAddingNew && (
        <form onSubmit={handleCreateReminder} className="bg-[#172029] border border-amber-600/40 rounded-2xl p-5 shadow-xl space-y-4 animate-fade-in">
          <h3 className="font-bold text-sm text-zinc-100 flex items-center space-x-1.5">
            <Plus className="w-4 h-4 text-amber-400" />
            <span>Create New Reminder Task</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="sm:col-span-2">
              <label className="text-zinc-300 font-semibold block mb-1">Reminder Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Upload renewal income certificate for MahaDBT OBC scholarship"
                className="w-full p-2.5 bg-[#12161a] border border-[#2d3947] rounded-xl text-white"
              />
            </div>

            <div>
              <label className="text-zinc-300 font-semibold block mb-1">Due Date & Time *</label>
              <input
                type="datetime-local"
                required
                value={dueDateTime}
                onChange={(e) => setDueDateTime(e.target.value)}
                className="w-full p-2.5 bg-[#12161a] border border-[#2d3947] rounded-xl text-white"
              />
            </div>

            <div>
              <label className="text-zinc-300 font-semibold block mb-1">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full p-2.5 bg-[#12161a] border border-[#2d3947] rounded-xl text-white"
              >
                <option value="HIGH">High Priority (Urgent Deadline)</option>
                <option value="MEDIUM">Medium Priority</option>
                <option value="LOW">Low Priority (Routine check)</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="text-zinc-300 font-semibold block mb-1">Link to Application (Optional)</label>
              <select
                value={selectedAppId}
                onChange={(e) => setSelectedAppId(e.target.value)}
                className="w-full p-2.5 bg-[#12161a] border border-[#2d3947] rounded-xl text-white"
              >
                <option value="">-- General Welfare Task --</option>
                {applications.map(app => (
                  <option key={app.id} value={app.id}>{app.schemeTitle}</option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="text-zinc-300 font-semibold block mb-1">Description / Notes</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                placeholder="Specific instructions or Tehsildar office timings..."
                className="w-full p-2.5 bg-[#12161a] border border-[#2d3947] rounded-xl text-white"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-2 border-t border-zinc-800">
            <button
              type="button"
              onClick={() => setIsAddingNew(false)}
              className="px-3.5 py-1.5 rounded-lg text-xs text-zinc-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow"
            >
              Save Reminder
            </button>
          </div>
        </form>
      )}

      {/* Reminders List */}
      <div className="space-y-3">
        {reminders.map((rem) => {
          const isOverdue = !rem.isCompleted && new Date(rem.dueDateTime) < now;

          return (
            <div
              key={rem.id}
              className={`p-4 rounded-2xl border transition flex items-start justify-between gap-4 ${
                rem.isCompleted
                  ? 'bg-[#141b22] border-zinc-800 opacity-60'
                  : isOverdue
                  ? 'bg-[#1b191a] border-rose-800/60 shadow-md'
                  : 'bg-[#182028] border-[#293542]'
              }`}
            >
              <div className="flex items-start space-x-3">
                <button
                  onClick={() => handleToggleComplete(rem)}
                  className="mt-0.5 text-zinc-500 hover:text-emerald-400 transition"
                  title={rem.isCompleted ? 'Mark incomplete' : 'Mark completed'}
                >
                  <CheckCircle2 className={`w-5 h-5 ${rem.isCompleted ? 'text-emerald-400 fill-emerald-950' : ''}`} />
                </button>

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className={`text-sm font-bold ${rem.isCompleted ? 'line-through text-zinc-400' : 'text-zinc-100'}`}>
                      {rem.title}
                    </h4>

                    {rem.priority === 'HIGH' && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800">
                        High Priority
                      </span>
                    )}

                    {isOverdue && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-900 text-white flex items-center space-x-1">
                        <AlertCircle className="w-3 h-3" />
                        <span>OVERDUE</span>
                      </span>
                    )}
                  </div>

                  {rem.schemeTitle && (
                    <p className="text-xs text-emerald-400 font-medium">
                      Linked: {rem.schemeTitle}
                    </p>
                  )}

                  {rem.description && (
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      {rem.description}
                    </p>
                  )}

                  <p className="text-[11px] text-zinc-500 flex items-center space-x-1 pt-1">
                    <Calendar className="w-3 h-3" />
                    <span>Due: {new Date(rem.dueDateTime).toLocaleString()}</span>
                  </p>
                </div>
              </div>

              <button
                onClick={() => onDeleteReminder(rem.id)}
                className="p-1.5 rounded-lg text-zinc-500 hover:text-rose-400 hover:bg-zinc-800 transition"
                title="Delete reminder"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          );
        })}

        {reminders.length === 0 && (
          <div className="bg-[#171f27] border border-[#283543] rounded-2xl p-10 text-center text-zinc-400 space-y-2">
            <Bell className="w-8 h-8 text-zinc-500 mx-auto" />
            <p className="text-sm font-semibold text-zinc-300">No Reminders Created Yet</p>
            <p className="text-xs">Create reminders for document updates or official portal visits.</p>
          </div>
        )}
      </div>
    </div>
  );
};
