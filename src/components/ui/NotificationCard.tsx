import { useEffect, useState } from "react";

const styles = {
  notificationAnimation: `
    @keyframes slideIn {
      0% { transform: translateX(100%); opacity: 0; }
      100% { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
      0% { transform: translateX(0); opacity: 1; }
      100% { transform: translateX(-100%); opacity: 0; }
    }
    .slide-in {
      animation: slideIn 0.5s ease forwards;
    }
    .slide-out {
      animation: slideOut 0.5s ease forwards;
    }
  `
};

interface Props {
  type: string;
  message: string;
  reset: () => void;
}

const NotificationCard = ({ type, message, reset }: Props) => {
  const [animateOut, setAnimateOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimateOut(true);
      setTimeout(() => reset(), 500);
    }, 2000);

    return () => clearTimeout(timer);
  }, [reset]);

  return (
    <div>
      <style dangerouslySetInnerHTML={{ __html: styles.notificationAnimation }} />

      <div
        className={`fixed top-10 right-4 px-6 py-3 z-50 rounded-lg shadow-lg flex items-center space-x-3
        ${animateOut ? "slide-out" : "slide-in"} 
        ${type === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}
      >
        <span className="font-medium">{message}</span>
      </div>
    </div>
  );
};

export default NotificationCard;
