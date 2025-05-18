import React, { useState, useRef, useEffect } from 'react';
import { useClickOutside } from '@/hooks/use-click-outside';
import { Bell } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { format } from 'date-fns';
import { Link, useLocation } from 'wouter';

// Types for notifications
interface Notification {
  id: number;
  title: string;
  message: string; // DB field is 'message', we'll use this for description
  createdAt: Date; // DB field is 'createdAt', we'll use this for timestamp
  read: boolean;
  type: "info" | "warning" | "success" | "error";
  resourceType?: string; // Corresponds to link resource type
  resourceId?: string; // Can be used with resourceType to construct links
  actionText?: string; // Not in DB schema but useful for UI
}

export function NotificationCenter() {
  const [location, navigate] = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Use our custom hook to handle clicks outside the dropdown
  useClickOutside(dropdownRef, () => {
    if (isOpen) setIsOpen(false);
  });
  
  // Query for unread notification count
  const { data: notifications = [], isLoading } = useQuery<Notification[]>({
    queryKey: ['/api/admin/notifications/unread'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/admin/notifications/unread');
      return await response.json();
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });
  
  // Calculate unread count
  const unreadCount = notifications.length;
  
  // Function to navigate to notifications page
  const viewAllNotifications = () => {
    setIsOpen(false);
    navigate('/admin/notifications');
  };
  
  // Handle notification click
  const handleNotificationClick = (notification: Notification) => {
    if (notification.link) {
      // Mark as read before navigating
      apiRequest('PATCH', `/api/admin/notifications/${notification.id}/read`).then(() => {
        if (notification.link?.startsWith('/')) {
          navigate(notification.link);
        } else {
          window.open(notification.link, '_blank');
        }
      });
    }
    setIsOpen(false);
  };
  
  // Effect to handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);
  
  // Function to get badge color class based on notification type
  const getTypeClass = (type: string) => {
    switch (type) {
      case 'info': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'warning': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'success': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'error': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };
  
  return (
    <div className="notification-center">
      <div 
        className="notification-icon"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="notification-badge">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </div>
      
      {isOpen && (
        <div ref={dropdownRef} className="notification-dropdown">
          <div className="notification-header">
            <h3 className="notification-title">Notifications</h3>
            {unreadCount > 0 && (
              <span className="text-xs font-medium text-primary">
                {unreadCount} unread
              </span>
            )}
          </div>
          
          <div className="notification-list">
            {isLoading ? (
              <div className="py-8 text-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
                <p className="mt-2 text-sm text-muted-foreground">Loading notifications...</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="py-8 text-center">
                <Bell className="h-8 w-8 mx-auto text-muted-foreground opacity-50" />
                <p className="mt-2 text-sm text-muted-foreground">No new notifications</p>
              </div>
            ) : (
              <>
                {notifications.slice(0, 5).map((notification) => (
                  <div 
                    key={notification.id}
                    className={`notification-item ${notification.read ? '' : 'unread'}`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="notification-content">
                      <div className="flex items-center gap-2">
                        <h4 className="notification-item-title">{notification.title}</h4>
                        <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${getTypeClass(notification.type)}`}>
                          {notification.type.charAt(0).toUpperCase() + notification.type.slice(1)}
                        </span>
                      </div>
                      <p className="notification-item-description">{notification.message}</p>
                      <span className="notification-time">
                        {format(new Date(notification.createdAt), 'PPp')}
                      </span>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
          
          <div className="notification-footer">
            <button 
              className="notification-footer-link"
              onClick={viewAllNotifications}
            >
              View all notifications
            </button>
          </div>
        </div>
      )}
    </div>
  );
}