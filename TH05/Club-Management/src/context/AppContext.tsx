import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { Club, Registration } from '../types';
import { mockClubs, mockRegistrations } from '../data/mockData';
import { format } from 'date-fns';

interface AppContextType {
  clubs: Club[];
  registrations: Registration[];
  setRegistrations: (regs: Registration[]) => void;
  addClub: (club: Club) => void;
  updateClub: (club: Club) => void;
  deleteClub: (id: string) => void;
  approveRegistration: (id: string) => void;
  rejectRegistration: (id: string, reason: string) => void;
  bulkApprove: (ids: string[]) => void;
  bulkReject: (ids: string[], reason: string) => void;
  changeClubForMembers: (memberIds: string[], newClubId: string) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [clubs, setClubs] = useState<Club[]>(mockClubs);
  const [registrations, setRegistrations] =
    useState<Registration[]>(mockRegistrations);

  const addClub = (club: Club) => setClubs((prev) => [...prev, club]);
  const updateClub = (club: Club) =>
    setClubs((prev) => prev.map((c) => (c.id === club.id ? club : c)));
  const deleteClub = (id: string) =>
    setClubs((prev) => prev.filter((c) => c.id !== id));

  const approveRegistration = (id: string) => {
    setRegistrations((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              status: 'Approved',
              history: [
                ...r.history,
                {
                  action: 'Approved',
                  timestamp: format(new Date(), 'HH:mm dd/MM/yyyy'),
                  admin: 'Admin',
                },
              ],
            }
          : r,
      ),
    );
  };

  const rejectRegistration = (id: string, reason: string) => {
    setRegistrations((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              status: 'Rejected',
              notes: reason,
              history: [
                ...r.history,
                {
                  action: 'Rejected',
                  timestamp: format(new Date(), 'HH:mm dd/MM/yyyy'),
                  reason,
                  admin: 'Admin',
                },
              ],
            }
          : r,
      ),
    );
  };

  const bulkApprove = (ids: string[]) => {
    setRegistrations((prev) =>
      prev.map((r) =>
        ids.includes(r.id)
          ? {
              ...r,
              status: 'Approved',
              history: [
                ...r.history,
                {
                  action: 'Approved (bulk)',
                  timestamp: format(new Date(), 'HH:mm dd/MM/yyyy'),
                  admin: 'Admin',
                },
              ],
            }
          : r,
      ),
    );
  };

  const bulkReject = (ids: string[], reason: string) => {
    setRegistrations((prev) =>
      prev.map((r) =>
        ids.includes(r.id)
          ? {
              ...r,
              status: 'Rejected',
              notes: reason,
              history: [
                ...r.history,
                {
                  action: 'Rejected (bulk)',
                  timestamp: format(new Date(), 'HH:mm dd/MM/yyyy'),
                  reason,
                  admin: 'Admin',
                },
              ],
            }
          : r,
      ),
    );
  };

  const changeClubForMembers = (memberIds: string[], newClubId: string) => {
    console.log('🔄 Context nhận yêu cầu chuyển CLB:', {
      memberIds,
      newClubId,
    });

    setRegistrations((prev) => {
      const updated = prev.map((r) => {
        if (memberIds.includes(r.id)) {
          console.log(
            `✅ Đổi CLB cho: ${r.fullName} | ${r.clubId} → ${newClubId}`,
          );
          return { ...r, clubId: newClubId };
        }
        return r;
      });
      return updated;
    });
  };

  return (
    <AppContext.Provider
      value={{
        clubs,
        registrations,
        setRegistrations,
        addClub,
        updateClub,
        deleteClub,
        approveRegistration,
        rejectRegistration,
        bulkApprove,
        bulkReject,
        changeClubForMembers,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp phải dùng trong AppProvider');
  return context;
};
