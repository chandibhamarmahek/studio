import { User, Community, Post, Chat, Message } from './types';

export let users: User[] = [
  {
    id: 'user1',
    name: 'Alex Johnson',
    email: 'alex.j@example.com',
    avatar: 'https://picsum.photos/seed/alex/200',
    skills: ['React', 'TypeScript', 'Node.js'],
    learningGoals: 'Become a full-stack developer and learn about system design.',
    interests: 'Open-source projects, AI, and hiking.',
    joinedCommunityIds: ['reactjs', 'nodejs'],
  },
  {
    id: 'user2',
    name: 'Maria Garcia',
    email: 'maria.g@example.com',
    avatar: 'https://picsum.photos/seed/maria/200',
    skills: ['Python', 'Machine Learning', 'TensorFlow'],
    learningGoals: 'Master deep learning techniques and contribute to ML research.',
    interests: 'Data visualization, chess, and photography.',
    joinedCommunityIds: ['ml', 'java'],
  },
    {
    id: 'user3',
    name: 'Sam Chen',
    email: 'sam.c@example.com',
    avatar: 'https://picsum.photos/seed/sam/200',
    skills: ['Java', 'Spring Boot', 'SQL'],
    learningGoals: 'Explore microservices architecture.',
    interests: 'Cloud computing, cooking, and cycling.',
    joinedCommunityIds: ['java'],
  },
];

export const communities: Community[] = [
  {
    id: 'ml',
    name: 'Machine Learning',
    description: 'Explore algorithms, data, and models.',
    icon: 'BrainCircuit',
    memberCount: 1250,
    image: 'https://picsum.photos/seed/ml/600/400',
  },
  {
    id: 'reactjs',
    name: 'React JS',
    description: 'Build modern UIs with React and its ecosystem.',
    icon: 'React',
    memberCount: 2300,
    image: 'https://picsum.photos/seed/react/600/400',
  },
  {
    id: 'nodejs',
    name: 'Node.js',
    description: 'Discuss backend development with Node.js.',
    icon: 'Server',
    memberCount: 1800,
    image: 'https://picsum.photos/seed/node/600/400',
  },
  {
    id: 'java',
    name: 'Java',
    description: 'For everything related to Java programming.',
    icon: 'Coffee',
    memberCount: 3100,
    image: 'https://picsum.photos/seed/java/600/400',
  },
];

export let posts: Post[] = [
    {
        id: 'post1',
        communityId: 'reactjs',
        authorId: 'user2',
        title: 'What are the best practices for state management in 2024?',
        content: 'I\'m starting a new project and I\'m wondering what the current consensus is on state management. Should I go with Redux, Zustand, or just rely on Context API?',
        createdAt: '2 days ago',
        replies: [
            { id: 'reply1', authorId: 'user1', content: 'For most cases, Zustand is a great lightweight option! Redux is still powerful for very complex apps.', createdAt: '1 day ago' }
        ]
    },
    {
        id: 'post2',
        communityId: 'ml',
        authorId: 'user1',
        title: 'How to deploy a basic model as a REST API?',
        content: 'I have a simple scikit-learn model. What\'s the easiest way to wrap it in a Flask or FastAPI server and deploy it?',
        createdAt: '4 hours ago',
        replies: []
    }
];

export let chats: Chat[] = [
    {
        id: 'chat1',
        participants: ['user1', 'user2'],
        messages: [
            { id: 'msg1', senderId: 'user1', text: 'Hey Maria! I saw your post on state management. Great points!', timestamp: '2:30 PM' },
            { id: 'msg2', senderId: 'user2', text: 'Thanks, Alex! Glad you found it helpful. I was just looking at your profile, your Node.js skills are impressive.', timestamp: '2-31 PM' },
            { id: 'msg3', senderId: 'user1', text: 'Thanks! We should collaborate on a project sometime.', timestamp: '2-32 PM' },
        ]
    },
    {
        id: 'chat2',
        participants: ['user1', 'user3'],
        messages: [
            { id: 'msg4', senderId: 'user3', text: 'Hey Alex, could you help me with a Java question?', timestamp: '10:00 AM' },
        ]
    }
];

// Functions to modify the data
export const addPost = (post: Post) => {
  posts.unshift(post);
};

export const addMessageToChat = (chatId: string, message: Message) => {
  const chatIndex = chats.findIndex(c => c.id === chatId);
  if (chatIndex !== -1) {
    chats[chatIndex].messages.push(message);
    return chats[chatIndex];
  }
  return null;
};
