import { useEffect } from 'react';
import { CheckCircle, X } from 'lucide-react';

export default function Toast({ message, type = 'success', onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-6 right-6 z-50 animate-slide-in">
      <div
        className={`flex items-center gap-4 px-6 py-4 rounded-3xl shadow-2xl min-w-[320px]
        ${type === 'success' ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'}`}
      >
        <CheckCircle size={26} />

        <div className="flex-1">
          <p className="font-medium">{message}</p>
        </div>

        <button
          onClick={onClose}
          className="hover:bg-white/20 p-1 rounded-xl transition"
        >
          <X size={20} />
        </button>
      </div>
    </div>
  );
}
