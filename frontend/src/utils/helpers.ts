export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function formatCurrency(amount: number): string {
  return `₹${amount.toLocaleString('en-IN')}`;
}

export function timeAgo(dateStr: string): string {
  // For mock data, just return as-is if it's already a relative string
  if (dateStr.includes('ago') || dateStr === 'Yesterday' || dateStr === 'Just now') {
    return dateStr;
  }
  return dateStr;
}

export function getNotificationIcon(type: string): string {
  switch (type) {
    case 'task':
      return 'briefcase-outline';
    case 'chat':
      return 'chatbubble-outline';
    case 'payment':
      return 'wallet-outline';
    case 'system':
      return 'information-circle-outline';
    default:
      return 'notifications-outline';
  }
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'open':
      return '#4A90D9';
    case 'assigned':
      return '#F5A623';
    case 'in_progress':
      return '#F39C12';
    case 'completed':
      return '#27AE60';
    case 'cancelled':
      return '#E74C3C';
    case 'pending':
      return '#F5A623';
    default:
      return '#7F8C8D';
  }
}

export function getStatusLabel(status: string): string {
  switch (status) {
    case 'open':
      return 'Open';
    case 'assigned':
      return 'Assigned';
    case 'in_progress':
      return 'In Progress';
    case 'completed':
      return 'Completed';
    case 'cancelled':
      return 'Cancelled';
    case 'pending':
      return 'Pending';
    default:
      return status;
  }
}
