import {
  AiOutlineCheckCircle,
  AiOutlineClose,
  AiOutlineCloseCircle,
  AiOutlineInfoCircle,
  AiOutlineWarning,
} from "react-icons/ai";

export type NotificationType = "success" | "info" | "error" | "warning";

export interface NotificationProps {
  type?: NotificationType;
  message: string;
  duration?: number; // in ms
  onClose: () => void;
  animation?: keyof typeof Animation;
}

const icons = {
  success: <AiOutlineCheckCircle className="mr-2.5" />,
  info: <AiOutlineInfoCircle className="mr-2.5" />,
  error: <AiOutlineCloseCircle className="mr-2.5" />,
  warning: <AiOutlineWarning className="mr-2.5" />,
};

const Notification: React.FC<NotificationProps> = ({
  type = "info",
  message,
  onClose,
  animation="slide-up",
}) => {
  return (
    <div className={`notification ${type} ${animation}`}>
      {icons[type]}
      <span>{message}</span>
      <AiOutlineClose
        color="white"
        onClick={onClose}
        className="ml-2 cursor-pointer"
      />
    </div>
  );
};

export default Notification;
