export type User = {
  id: string;
  name: string;
  email: string;
  avatar: string;
  skills: string[];
  learningGoals: string;
  interests: string;
  joinedCommunityIds: string[];
};

export type Community = {
  id: string;
  name: string;
  description: string;
  icon: string;
  memberCount: number;
  image: string;
};

export type Post = {
  id: string;
  communityId: string;
  authorId: string;
  title: string;
  content: string;
  createdAt: string;
  replies: Reply[];
};

export type Reply = {
  id: string;
  authorId: string;
  content: string;
  createdAt: string;
};

export type Message = {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
};

export type Chat = {
  id: string;
  participants: [string, string];
  messages: Message[];
};
