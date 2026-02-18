export interface UserProfile {
  id: string;
  name: string;
  username: string;
  avatar: string;
  ageRange: string;
  occupation: string;
  hobbies: string[];
  bio: string;
}

export interface MapEvent {
  id: string;
  title: string;
  description: string;
  category: 'food' | 'activity' | 'nightlife' | 'outdoors';
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  date: string;
  time: string;
  price: string;
  createdBy: UserProfile;
  attendees: UserProfile[];
  maxAttendees: number;
  accepted: boolean;
  imageUrl?: string;
}
