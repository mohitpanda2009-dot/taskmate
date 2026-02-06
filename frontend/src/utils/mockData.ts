export interface User {
  id: string;
  name: string;
  phone: string;
  avatar?: string;
  rating: number;
  reviewCount: number;
  role: 'creator' | 'doer' | 'both';
  walletBalance: number;
  tasksCreated: number;
  tasksCompleted: number;
  earnings: number;
  memberSince: string;
  location: string;
  verified: boolean;
}

export interface Task {
  id: string;
  creatorId: string;
  creatorName: string;
  creatorAvatar?: string;
  creatorRating: number;
  title: string;
  description: string;
  category: string;
  categoryIcon: string;
  budget: number;
  status: 'open' | 'assigned' | 'in_progress' | 'completed' | 'cancelled';
  location: string;
  latitude: number;
  longitude: number;
  distance?: string;
  deadline: string;
  createdAt: string;
  applicantCount: number;
  photos?: string[];
}

export interface TaskApplication {
  id: string;
  taskId: string;
  doerId: string;
  doerName: string;
  doerAvatar?: string;
  doerRating: number;
  doerTasksCompleted: number;
  message: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}

export interface ChatThread {
  id: string;
  taskId: string;
  taskTitle: string;
  otherUser: {
    id: string;
    name: string;
    avatar?: string;
    online: boolean;
  };
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  text: string;
  timestamp: string;
  read: boolean;
}

export interface Notification {
  id: string;
  type: 'task' | 'chat' | 'payment' | 'system';
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
  data?: Record<string, string>;
}

export interface Transaction {
  id: string;
  type: 'credit' | 'debit';
  amount: number;
  description: string;
  status: 'completed' | 'pending' | 'failed';
  createdAt: string;
  taskTitle?: string;
}

export const CATEGORIES = [
  { id: 'form', label: 'Form Filling', icon: 'document-text-outline' },
  { id: 'delivery', label: 'Delivery', icon: 'cube-outline' },
  { id: 'queue', label: 'Queue / Line', icon: 'people-outline' },
  { id: 'shopping', label: 'Shopping', icon: 'cart-outline' },
  { id: 'document', label: 'Document Work', icon: 'documents-outline' },
  { id: 'repair', label: 'Small Repairs', icon: 'build-outline' },
  { id: 'driving', label: 'Driving', icon: 'car-outline' },
  { id: 'photo', label: 'Photo / Video', icon: 'camera-outline' },
  { id: 'other', label: 'Other', icon: 'ellipsis-horizontal-outline' },
];

export const currentUser: User = {
  id: 'u1',
  name: 'Arjun Mehta',
  phone: '+91 98765 43210',
  rating: 4.7,
  reviewCount: 32,
  role: 'both',
  walletBalance: 2450,
  tasksCreated: 15,
  tasksCompleted: 28,
  earnings: 12800,
  memberSince: 'Jan 2025',
  location: 'Koramangala, Bangalore',
  verified: true,
};

export const mockTasks: Task[] = [
  {
    id: 't1',
    creatorId: 'u2',
    creatorName: 'Priya Sharma',
    creatorRating: 4.8,
    title: 'Submit passport form at PSK',
    description:
      'Need someone to submit my filled passport renewal form at Koramangala PSK. All documents are ready, just need physical submission. Token already taken for 11:30 AM slot.',
    category: 'form',
    categoryIcon: 'document-text-outline',
    budget: 300,
    status: 'open',
    location: 'Koramangala PSK, Bangalore',
    latitude: 12.9352,
    longitude: 77.6245,
    distance: '1.2 km',
    deadline: '2026-02-07 12:00',
    createdAt: '10 min ago',
    applicantCount: 3,
  },
  {
    id: 't2',
    creatorId: 'u3',
    creatorName: 'Rahul Verma',
    creatorRating: 4.5,
    title: 'Pick up courier from Delhivery hub',
    description:
      'My package has been stuck at the Delhivery warehouse for 3 days. Need someone to go, collect it with my ID copy, and deliver to my apartment in HSR Layout.',
    category: 'delivery',
    categoryIcon: 'cube-outline',
    budget: 200,
    status: 'open',
    location: 'Delhivery Hub, Bommanahalli',
    latitude: 12.9081,
    longitude: 77.6234,
    distance: '3.5 km',
    deadline: '2026-02-06 18:00',
    createdAt: '25 min ago',
    applicantCount: 5,
  },
  {
    id: 't3',
    creatorId: 'u4',
    creatorName: 'Sneha Patel',
    creatorRating: 4.9,
    title: 'Stand in line at RTO for license',
    description:
      'Need someone to stand in the queue at RTO Jayanagar for driving license renewal. I will come for the biometric part. Expected wait 2-3 hours.',
    category: 'queue',
    categoryIcon: 'people-outline',
    budget: 500,
    status: 'open',
    location: 'RTO Jayanagar, Bangalore',
    latitude: 12.9299,
    longitude: 77.5838,
    distance: '4.8 km',
    deadline: '2026-02-07 09:00',
    createdAt: '1 hr ago',
    applicantCount: 2,
  },
  {
    id: 't4',
    creatorId: 'u5',
    creatorName: 'Karthik Rao',
    creatorRating: 4.3,
    title: 'Weekly grocery shopping from BigBasket warehouse',
    description:
      'Need someone to pick up my BigBasket order (already packed) from their Marathahalli hub. About 8-10 bags. Will share the pickup code.',
    category: 'shopping',
    categoryIcon: 'cart-outline',
    budget: 250,
    status: 'open',
    location: 'BigBasket Hub, Marathahalli',
    latitude: 12.9591,
    longitude: 77.6971,
    distance: '6.2 km',
    deadline: '2026-02-06 20:00',
    createdAt: '2 hrs ago',
    applicantCount: 1,
  },
  {
    id: 't5',
    creatorId: 'u6',
    creatorName: 'Ananya Iyer',
    creatorRating: 4.6,
    title: 'Get documents notarized at court',
    description:
      'Need 3 property documents notarized at the District Court, Shanthinagar. Documents are ready. Need someone familiar with the process.',
    category: 'document',
    categoryIcon: 'documents-outline',
    budget: 400,
    status: 'open',
    location: 'District Court, Shanthinagar',
    latitude: 12.9553,
    longitude: 77.5996,
    distance: '2.1 km',
    deadline: '2026-02-08 15:00',
    createdAt: '3 hrs ago',
    applicantCount: 0,
  },
  {
    id: 't6',
    creatorId: 'u7',
    creatorName: 'Vikram Joshi',
    creatorRating: 4.1,
    title: 'Fix leaking kitchen tap',
    description:
      'Kitchen tap has been dripping for a week. Need a quick fix or replacement. I have a spare tap if needed. Tools required.',
    category: 'repair',
    categoryIcon: 'build-outline',
    budget: 350,
    status: 'assigned',
    location: 'Indiranagar, Bangalore',
    latitude: 12.9784,
    longitude: 77.6408,
    distance: '5.0 km',
    deadline: '2026-02-06 17:00',
    createdAt: '5 hrs ago',
    applicantCount: 4,
  },
  {
    id: 't7',
    creatorId: 'u8',
    creatorName: 'Meera Reddy',
    creatorRating: 4.7,
    title: 'Drop off package at FedEx center',
    description:
      'Need to ship an international package via FedEx. Already packed and labeled. Just need someone to drop it at the Whitefield FedEx center.',
    category: 'driving',
    categoryIcon: 'car-outline',
    budget: 180,
    status: 'open',
    location: 'FedEx, Whitefield',
    latitude: 12.9698,
    longitude: 77.7499,
    distance: '8.3 km',
    deadline: '2026-02-06 16:00',
    createdAt: '4 hrs ago',
    applicantCount: 2,
  },
  {
    id: 't8',
    creatorId: 'u9',
    creatorName: 'Aditya Kulkarni',
    creatorRating: 4.4,
    title: 'Take photos of apartment for listing',
    description:
      'Need someone with a decent phone camera to take 15-20 well-lit photos of my 2BHK apartment for a rental listing. Afternoon light preferred.',
    category: 'photo',
    categoryIcon: 'camera-outline',
    budget: 500,
    status: 'open',
    location: 'BTM Layout, Bangalore',
    latitude: 12.9166,
    longitude: 77.6101,
    distance: '2.8 km',
    deadline: '2026-02-08 16:00',
    createdAt: '6 hrs ago',
    applicantCount: 6,
  },
  {
    id: 't9',
    creatorId: 'u1',
    creatorName: 'Arjun Mehta',
    creatorRating: 4.7,
    title: 'File GST return at CA office',
    description:
      'Need someone to drop off my GST documents at my CA\'s office in MG Road and collect the signed return.',
    category: 'document',
    categoryIcon: 'documents-outline',
    budget: 250,
    status: 'in_progress',
    location: 'MG Road, Bangalore',
    latitude: 12.9757,
    longitude: 77.6056,
    distance: '3.2 km',
    deadline: '2026-02-07 14:00',
    createdAt: '1 day ago',
    applicantCount: 3,
  },
  {
    id: 't10',
    creatorId: 'u1',
    creatorName: 'Arjun Mehta',
    creatorRating: 4.7,
    title: 'Buy birthday cake from Aubree',
    description:
      'Pick up a pre-ordered birthday cake from Aubree Koramangala. Order under name Arjun. Handle with care!',
    category: 'shopping',
    categoryIcon: 'cart-outline',
    budget: 150,
    status: 'completed',
    location: 'Aubree, Koramangala',
    latitude: 12.9352,
    longitude: 77.6245,
    distance: '1.0 km',
    deadline: '2026-02-05 18:00',
    createdAt: '2 days ago',
    applicantCount: 2,
  },
  {
    id: 't11',
    creatorId: 'u1',
    creatorName: 'Arjun Mehta',
    creatorRating: 4.7,
    title: 'Register society maintenance complaint',
    description:
      'Go to the apartment society office and register a plumbing complaint. Reference: Flat B-402.',
    category: 'form',
    categoryIcon: 'document-text-outline',
    budget: 100,
    status: 'open',
    location: 'Brigade Gateway, Rajajinagar',
    latitude: 12.9919,
    longitude: 77.5552,
    distance: '7.5 km',
    deadline: '2026-02-07 11:00',
    createdAt: '8 hrs ago',
    applicantCount: 0,
  },
  {
    id: 't12',
    creatorId: 'u10',
    creatorName: 'Divya Nair',
    creatorRating: 4.9,
    title: 'Pet sitting for 3 hours',
    description:
      'Need someone to watch my Golden Retriever at my home while I attend a meeting. He is friendly and trained. Food and toys provided.',
    category: 'other',
    categoryIcon: 'ellipsis-horizontal-outline',
    budget: 400,
    status: 'open',
    location: 'JP Nagar, Bangalore',
    latitude: 12.9063,
    longitude: 77.5857,
    distance: '4.1 km',
    deadline: '2026-02-07 15:00',
    createdAt: '30 min ago',
    applicantCount: 7,
  },
];

export const mockApplications: TaskApplication[] = [
  {
    id: 'a1',
    taskId: 't1',
    doerId: 'u10',
    doerName: 'Ravi Kumar',
    doerRating: 4.6,
    doerTasksCompleted: 45,
    message: 'I can reach PSK in 20 minutes. Have done passport submissions before.',
    status: 'pending',
    createdAt: '5 min ago',
  },
  {
    id: 'a2',
    taskId: 't1',
    doerId: 'u11',
    doerName: 'Pooja Singh',
    doerRating: 4.8,
    doerTasksCompleted: 62,
    message: 'I am near Koramangala right now. Can do this immediately.',
    status: 'pending',
    createdAt: '8 min ago',
  },
  {
    id: 'a3',
    taskId: 't1',
    doerId: 'u12',
    doerName: 'Mohammed Ali',
    doerRating: 4.3,
    doerTasksCompleted: 18,
    message: 'Available for this task. I know the PSK process well.',
    status: 'pending',
    createdAt: '10 min ago',
  },
];

export const mockChats: ChatThread[] = [
  {
    id: 'c1',
    taskId: 't9',
    taskTitle: 'File GST return at CA office',
    otherUser: {
      id: 'u13',
      name: 'Suresh Babu',
      online: true,
    },
    lastMessage: 'I have reached the CA office. Submitting now.',
    lastMessageTime: '2 min ago',
    unreadCount: 2,
  },
  {
    id: 'c2',
    taskId: 't6',
    taskTitle: 'Fix leaking kitchen tap',
    otherUser: {
      id: 'u7',
      name: 'Vikram Joshi',
      online: false,
    },
    lastMessage: 'Great, see you at 4 PM then!',
    lastMessageTime: '1 hr ago',
    unreadCount: 0,
  },
  {
    id: 'c3',
    taskId: 't10',
    taskTitle: 'Buy birthday cake from Aubree',
    otherUser: {
      id: 'u14',
      name: 'Lakshmi Devi',
      online: false,
    },
    lastMessage: 'Cake delivered safely. Happy birthday! 🎂',
    lastMessageTime: 'Yesterday',
    unreadCount: 0,
  },
  {
    id: 'c4',
    taskId: 't2',
    taskTitle: 'Pick up courier from Delhivery hub',
    otherUser: {
      id: 'u3',
      name: 'Rahul Verma',
      online: true,
    },
    lastMessage: 'Can you share the tracking ID?',
    lastMessageTime: '3 hrs ago',
    unreadCount: 1,
  },
];

export const mockMessages: Message[] = [
  {
    id: 'm1',
    chatId: 'c1',
    senderId: 'u1',
    text: 'Hi Suresh, here are the documents for the GST filing.',
    timestamp: '10:30 AM',
    read: true,
  },
  {
    id: 'm2',
    chatId: 'c1',
    senderId: 'u13',
    text: 'Got them. Heading to MG Road now.',
    timestamp: '10:45 AM',
    read: true,
  },
  {
    id: 'm3',
    chatId: 'c1',
    senderId: 'u13',
    text: 'Traffic is a bit heavy, might take 30 minutes.',
    timestamp: '10:50 AM',
    read: true,
  },
  {
    id: 'm4',
    chatId: 'c1',
    senderId: 'u1',
    text: 'No problem, take your time. The office is open till 5.',
    timestamp: '10:52 AM',
    read: true,
  },
  {
    id: 'm5',
    chatId: 'c1',
    senderId: 'u13',
    text: 'I have reached the CA office. Submitting now.',
    timestamp: '11:20 AM',
    read: false,
  },
  {
    id: 'm6',
    chatId: 'c1',
    senderId: 'u13',
    text: 'They are asking for the PAN card copy too. Do you have it?',
    timestamp: '11:22 AM',
    read: false,
  },
];

export const mockNotifications: Notification[] = [
  {
    id: 'n1',
    type: 'task',
    title: 'New applicant!',
    body: 'Ravi Kumar applied for "Submit passport form at PSK"',
    read: false,
    createdAt: '5 min ago',
  },
  {
    id: 'n2',
    type: 'chat',
    title: 'New message',
    body: 'Suresh Babu: They are asking for the PAN card copy too.',
    read: false,
    createdAt: '10 min ago',
  },
  {
    id: 'n3',
    type: 'task',
    title: 'Task in progress',
    body: 'Your task "File GST return at CA office" is being worked on',
    read: false,
    createdAt: '30 min ago',
  },
  {
    id: 'n4',
    type: 'payment',
    title: 'Payment received!',
    body: '₹150 credited for completing "Buy birthday cake from Aubree"',
    read: true,
    createdAt: '1 day ago',
  },
  {
    id: 'n5',
    type: 'task',
    title: 'Task completed ✓',
    body: '"Buy birthday cake from Aubree" has been marked complete',
    read: true,
    createdAt: '1 day ago',
  },
  {
    id: 'n6',
    type: 'system',
    title: 'Welcome to Taskmate!',
    body: 'Start by creating your first task or browsing available tasks nearby.',
    read: true,
    createdAt: '3 days ago',
  },
  {
    id: 'n7',
    type: 'payment',
    title: 'Wallet topped up',
    body: '₹1,000 added to your wallet via UPI',
    read: true,
    createdAt: '3 days ago',
  },
  {
    id: 'n8',
    type: 'task',
    title: '5 new tasks near you',
    body: 'Check out new tasks posted in Koramangala area',
    read: true,
    createdAt: '4 days ago',
  },
];

export const mockTransactions: Transaction[] = [
  {
    id: 'tx1',
    type: 'credit',
    amount: 150,
    description: 'Task payment received',
    status: 'completed',
    createdAt: '2026-02-05',
    taskTitle: 'Buy birthday cake from Aubree',
  },
  {
    id: 'tx2',
    type: 'debit',
    amount: 250,
    description: 'Task payment (escrow)',
    status: 'pending',
    createdAt: '2026-02-04',
    taskTitle: 'File GST return at CA office',
  },
  {
    id: 'tx3',
    type: 'credit',
    amount: 1000,
    description: 'Wallet top-up via UPI',
    status: 'completed',
    createdAt: '2026-02-03',
  },
  {
    id: 'tx4',
    type: 'credit',
    amount: 500,
    description: 'Task payment received',
    status: 'completed',
    createdAt: '2026-02-01',
    taskTitle: 'Stand in line at BBMP office',
  },
  {
    id: 'tx5',
    type: 'debit',
    amount: 300,
    description: 'Task payment (escrow)',
    status: 'completed',
    createdAt: '2026-01-30',
    taskTitle: 'Submit passport form at PSK',
  },
  {
    id: 'tx6',
    type: 'credit',
    amount: 2000,
    description: 'Wallet top-up via UPI',
    status: 'completed',
    createdAt: '2026-01-28',
  },
];
