import { useState } from "react";
import { Badge } from "../ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { IoAlertCircleOutline } from "react-icons/io5";

const NotificationComponent = () => {
  const [unreadCount, setUnreadCount] = useState(0);
  return (
    <Tooltip>
      <TooltipTrigger>
        <div className="relative flex items-center justify-center">
          <IoAlertCircleOutline size={6} />
          {unreadCount > 0 && (
            <Badge
              variant="default"
              className="absolute -top-2 -right-2 h-5 w-5 text-xs flex items-center justify-center rounded-full bg-red-600 text-white"
            >
              {unreadCount}
            </Badge>
          )}
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <span>
          {unreadCount} mensagem{unreadCount !== 1 ? "s" : ""} não lida
          {unreadCount !== 1 ? "s" : ""}
        </span>
      </TooltipContent>
    </Tooltip>
  );
};

export default NotificationComponent;
