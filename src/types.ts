
export type Screen = 'home' | 'map' | 'saved' | 'alerts' | 'chat' | 'scanner';

export type Theme = 'basic' | 'colorful' | 'dark';

export interface UserProfile {
  name: string;
  role: 'Admin' | 'Member' | 'Guest';
  profilePic?: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export interface ASPStatus {
  status: string;
  date: string;
}

export interface LatLng {
  lat: number;
  lng: number;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'alert';
  timestamp: number;
  isRead: boolean;
}
