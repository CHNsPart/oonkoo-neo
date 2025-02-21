export interface ServicePrice {
  monthly: number;
  annually: number;
}

export interface ServicePlan {
  id: string;
  title: string;
  description: string;
  serviceDescription: string[];
  icon: string;
  price: ServicePrice;
}

export interface UserService extends ServicePlan {
  serviceId: string;
  userId: string;
  userEmail: string;
  billingInterval: 'monthly' | 'annually';
  status: 'pending' | 'active' | 'paused' | 'cancelled';
  meetingTime?: Date | null;
  startDate: Date;
  endDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}