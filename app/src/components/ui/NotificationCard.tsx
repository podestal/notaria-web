import { useEffect, useState } from "react";
import { AlertCircle, CheckCircle2, Info } from "lucide-react";

const styles = {
  notificationAnimation: `
    @keyframes slideIn {
      0% { transform: translateX(100%); opacity: 0; }
      100% { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
      0% { transform: translateX(0); opacity: 1; }
      100% { transform: translateX(100%); opacity: 0; }
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
  const isSuccess = type === "success";
  const isError = type === "error";
  const title = isSuccess ? "Operacion exitosa" : isError ? "Ocurrio un problema" : "Notificacion";
  const Icon = isSuccess ? CheckCircle2 : isError ? AlertCircle : Info;

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimateOut(true);
      setTimeout(() => reset(), 500);
    }, 3200);

    return () => clearTimeout(timer);
  }, [reset]);

  return (
    <div>
      <style dangerouslySetInnerHTML={{ __html: styles.notificationAnimation }} />

      <div
        className={`fixed top-8 right-4 z-60 w-[360px] max-w-[calc(100vw-2rem)] rounded-xl border px-4 py-3 shadow-xl backdrop-blur-sm
        ${animateOut ? "slide-out" : "slide-in"} 
        ${isSuccess ? "border-emerald-200 bg-emerald-50/95 text-emerald-900" : isError ? "border-rose-200 bg-rose-50/95 text-rose-900" : "border-slate-200 bg-white/95 text-slate-900"}`}
      >
        <div className="flex items-start gap-3">
          <Icon className={`${isSuccess ? "text-emerald-600" : isError ? "text-rose-600" : "text-slate-600"} mt-0.5 h-5 w-5 shrink-0`} />
          <div>
            <p className="text-sm font-semibold leading-5">{title}</p>
            <p className="text-sm opacity-90 leading-5">{message}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationCard;
