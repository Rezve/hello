import { useNotification } from "./NotificationContext";
import { Notification } from './Notification'

interface NotificationContainerProps {
    notifications: Notification[];
  }
  
  export const NotificationContainer: React.FC<NotificationContainerProps> = ({ notifications }) => {
    const { removeNotification } = useNotification();
  
    return (
      <div className="fixed top-4 right-4 z-50 max-w-sm w-full">
        {notifications.map((notif) => (
          <Notification
            key={notif.id}
            message={notif.message}
            type={notif.type}
            onClose={() => removeNotification(notif.id)}
          />
        ))}
      </div>
    );
  };