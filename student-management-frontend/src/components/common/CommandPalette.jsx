import React, { useState, useEffect } from 'react';
import { Search, Users, UserSquare2, BookOpen, Building2, Layers, Award, CalendarDays, X, ArrowRight } from 'lucide-react';
import { studentApi, teacherApi } from '../../api';

export default function CommandPalette({ isOpen, onClose, onNavigate }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        onClose(false); // toggle
      }
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const [stRes, tRes] = await Promise.allSettled([
          studentApi.getAll({ page: 0, size: 5, keyword: query }),
          teacherApi.getAll({ page: 0, size: 5, keyword: query }),
        ]);

        const items = [];
        if (stRes.status === 'fulfilled') {
          const d = stRes.value.data || stRes.value;
          const list = Array.isArray(d) ? d : d.content || [];
          list.forEach(s => items.push({
            id: s.studentId,
            title: s.fullName,
            subtitle: `Student ID: ${s.studentId} • Class: ${s.classId || s.className || 'CNTT'}`,
            type: 'student',
            tab: 'students',
          }));
        }

        if (tRes.status === 'fulfilled') {
          const d = tRes.value.data || tRes.value;
          const list = Array.isArray(d) ? d : d.content || [];
          list.forEach(t => items.push({
            id: t.teacherId,
            title: t.fullName,
            subtitle: `Lecturer ID: ${t.teacherId} • Dept: ${t.facultyName || t.facultyId}`,
            type: 'teacher',
            tab: 'teachers',
          }));
        }

        setResults(items);
      } catch (e) {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  const quickNavs = [
    { label: 'Student Directory', tab: 'students', icon: Users },
    { label: 'Lecturers / Teachers', tab: 'teachers', icon: UserSquare2 },
    { label: 'Subjects & Modules', tab: 'subjects', icon: BookOpen },
    { label: 'Academic Grades & GPA', tab: 'grades', icon: Award },
    { label: 'Timetable & Schedule', tab: 'schedules', icon: CalendarDays },
    { label: 'Audit Logs & Activity', tab: 'audit-logs', icon: Layers },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="glass-card w-full max-w-2xl rounded-2xl border border-slate-700/80 shadow-2xl overflow-hidden animate-scale-up space-y-0">
        
        {/* Search Input */}
        <div className="relative flex items-center px-4 py-3.5 border-b border-slate-800">
          <Search className="h-5 w-5 text-indigo-400 shrink-0 mr-3" />
          <input
            type="text"
            autoFocus
            placeholder="Type a student name, lecturer ID, or command... (e.g. SV001, Nguyen)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
          />
          <button 
            onClick={onClose}
            className="p-1 text-slate-500 hover:text-white rounded-lg"
          >
            <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700 font-mono">ESC</span>
          </button>
        </div>

        {/* Results / Navigation Suggestions */}
        <div className="max-h-80 overflow-y-auto p-3 space-y-1 text-xs">
          {query.trim() === '' ? (
            <div className="space-y-2">
              <p className="px-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Quick Navigation</p>
              <div className="grid grid-cols-2 gap-1.5">
                {quickNavs.map(item => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.tab}
                      onClick={() => { onNavigate(item.tab); onClose(); }}
                      className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-slate-900/60 hover:bg-indigo-600/20 text-slate-300 hover:text-white border border-slate-800/80 hover:border-indigo-500/30 transition text-left"
                    >
                      <Icon className="h-4 w-4 text-indigo-400 shrink-0" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <div>
              {loading ? (
                <div className="text-center py-6 text-slate-500">Searching database...</div>
              ) : results.length === 0 ? (
                <div className="text-center py-6 text-slate-500">No records found matching "{query}"</div>
              ) : (
                results.map((r, i) => (
                  <button
                    key={i}
                    onClick={() => { onNavigate(r.tab); onClose(); }}
                    className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-800/80 text-left transition group"
                  >
                    <div>
                      <div className="font-semibold text-white group-hover:text-indigo-300">{r.title}</div>
                      <div className="text-[11px] text-slate-400">{r.subtitle}</div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-slate-600 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition" />
                  </button>
                ))
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 bg-slate-900/80 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
          <span>Tip: Press <kbd className="px-1.5 py-0.5 bg-slate-800 rounded text-[10px] text-slate-300 font-mono">Ctrl</kbd> + <kbd className="px-1.5 py-0.5 bg-slate-800 rounded text-[10px] text-slate-300 font-mono">K</kbd> anywhere to open Universal Search</span>
          <span className="text-indigo-400">EduPortal AI</span>
        </div>
      </div>
    </div>
  );
}
