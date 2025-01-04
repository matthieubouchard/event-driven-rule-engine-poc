import {FC} from "react";

interface NotificationProps {
  type: string;
  message: string;
  isVisible: boolean;
  title: string;
}

export const NotificationToast: FC<NotificationProps> = ({
  type,
  message,
  title,
  isVisible,
}) => {
  console.log(type);
  const getAlertType = () => {
    switch (type) {
      case "RULE_EVALUATED":
        return "alert-info";
      case "application.submitted":
        return "alert-warning";
      case "document.requested":
        return "alert-info";
      case "document.request.created":
        return "alert-info";
      default:
        return "alert-success";
    }
  };

  return (
    <div
      className={`alert ${getAlertType()} transition-opacity duration-500 flex flex-col items-start ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <h3 className="font-bold">{title.toUpperCase()}</h3>
      <p className="mt-2">{message}</p>
    </div>
  );
};
