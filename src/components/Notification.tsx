import { RxCross2 } from "react-icons/rx";
import { FaCircleCheck } from "react-icons/fa6";
import { PiWarningFill } from "react-icons/pi";
import { MdError } from "react-icons/md";
import { IoBulb } from "react-icons/io5";

export type NotificationType = "success" | "info" | "error" | "warning";

export interface NotificationProps {
  type?: NotificationType;
  message: any;
  duration?: number; // in ms
  onClose: () => void;
  animation?: keyof typeof Animation;
}

const icons = {
  success: <FaCircleCheck fill="#58816e" className="w-4.5 h-4.5"/>,
  info: <IoBulb fill="#4b6a9f" className="w-5.5 h-5.5"/>,
  error: <MdError fill="#dc6266" className="w-5.5 h-5.5"/>,
  warning: <PiWarningFill fill="#dfa00a" className="w-5.5 h-5.5"/>,
};

const Notification: React.FC<NotificationProps> = ({
  type = "info",
  message,
  onClose,
  animation="slide-down",
}) => {
  return (
    <div className={`notification ${type} ${animation} w-xs sm:w-md flex justify-between p-3`}>
    <div className="flex gap-3 items-center">
        {icons[type]}
      <span className="text-text-dark">{message}</span>
    </div>
      <RxCross2 
        onClick={onClose}
        fontWeight={700}
        strokeWidth={0.8}
        className="ml-2 cursor-pointer text-[#9aa29b] w-4.5 h-4.5"
      />
    </div>
  );
};

export default Notification;
