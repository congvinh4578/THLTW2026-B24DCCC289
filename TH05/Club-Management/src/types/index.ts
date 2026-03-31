export interface Club {
  id: string;
  avatar: string;
  name: string;
  foundingDate: string;
  description: string;
  leader: string;
  active: boolean;
}

export interface Registration {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  gender: 'Nam' | 'Nữ' | 'Khác';
  address: string;
  skills: string;
  clubId: string;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  notes: string;
  history: {
    action: string;
    timestamp: string;
    reason?: string;
    admin: string;
  }[];
}
