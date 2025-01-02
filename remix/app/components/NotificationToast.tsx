// components/NotificationToast.tsx
import {FC} from "react";

interface NotificationProps {
  type: "RULE_EVALUATED" | "DOCUMENT_REQUESTED" | "APPLICATION_SUBMITTED";
  message: string;
  isVisible: boolean;
}

export const NotificationToast: FC<NotificationProps> = ({
  type,
  message,
  isVisible,
}) => {
  const getAlertType = () => {
    switch (type) {
      case "RULE_EVALUATED":
        return "alert-info";
      case "DOCUMENT_REQUESTED":
        return "alert-warning";
      default:
        return "alert-success";
    }
  };

  return (
    <div
      className={`alert ${getAlertType()} transition-opacity duration-500 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <span>{message}</span>
    </div>
  );
};
