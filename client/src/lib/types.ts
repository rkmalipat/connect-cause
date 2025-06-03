export interface InitiativeWithRunner {
  id: number;
  title: string;
  description: string;
  category: string;
  goalAmount: number;
  raisedAmount: number | null;
  supportersCount: number | null;
  coverImage: string | null;
  runnerId: number;
  status: string | null;
  createdAt: Date | null;
  runner?: {
    id: number;
    fullName: string;
    avatar: string | null;
    bio: string | null;
  };
}

export interface StoryWithAuthor {
  id: number;
  content: string;
  mediaUrl: string | null;
  mediaType: string | null;
  authorId: number;
  initiativeId: number | null;
  heartsCount: number | null;
  createdAt: Date | null;
  author?: {
    id: number;
    fullName: string;
    avatar: string | null;
  };
}

export interface MessageWithUsers {
  id: number;
  senderId: number;
  receiverId: number;
  content: string;
  read: boolean | null;
  createdAt: Date | null;
  sender?: {
    id: number;
    fullName: string;
    avatar: string | null;
  };
  receiver?: {
    id: number;
    fullName: string;
    avatar: string | null;
  };
}
