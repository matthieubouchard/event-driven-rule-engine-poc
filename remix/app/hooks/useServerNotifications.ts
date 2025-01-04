import {useRevalidator} from "@remix-run/react";
import {useState, useEffect} from "react";

type Notification = {
  type: "RULE_EVALUATED" | "DOCUMENT_REQUESTED" | "APPLICATION_SUBMITTED";
  payload: any;
  timestamp: string;
  id: string;
  isVisible: boolean;
};

export function useServerNotifications(
  endpoint = "http://localhost:3000/api/notification/sse"
) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [status, setStatus] = useState<
    "connecting" | "connected" | "disconnected"
  >("connecting");
  const NOTIFICATION_DURATION = 5000;
  const validator = useRevalidator();

  useEffect(() => {
    const eventSource = new EventSource(endpoint);
    console.log("EVENT SOURCE", eventSource);

    eventSource.onopen = () => {
      setStatus("connected");
    };

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      validator.revalidate();
      const newNotification = {
        ...data,
        id: crypto.randomUUID(),
        isVisible: true,
      };

      setNotifications((prev) => [newNotification, ...prev]);

      // Schedule fade out
      setTimeout(() => {
        setNotifications((prev) =>
          prev.map((notif) =>
            notif.id === newNotification.id
              ? {...notif, isVisible: false}
              : notif
          )
        );

        // Remove after fade animation
        setTimeout(() => {
          setNotifications((prev) =>
            prev.filter((notif) => notif.id !== newNotification.id)
          );
        }, 500); // matches fade duration
      }, NOTIFICATION_DURATION);
    };

    eventSource.onerror = () => {
      setStatus("disconnected");
      eventSource.close();
    };

    return () => {
      eventSource.close();
      setStatus("disconnected");
    };
  }, [endpoint]);

  return {notifications, status};
}
