import { createContext, useContext, useState } from "react";
import { CheckCircle2, Info, X, XCircle } from "lucide-react";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [items, setItems] = useState([]);

  function push(message, type = "success") {
    const id = crypto.randomUUID();
    setItems(x => [...x, { id, message, type }]);
    setTimeout(() => setItems(x => x.filter(t => t.id !== id)), 3200);
  }

  return (
    <ToastContext.Provider value={{ push }}>
      {children}
      <div className="fixed right-5 bottom-5 z-[100] space-y-2 w-[min(380px,calc(100vw-40px))]">
        {items.map(t => (
          <div key={t.id} className="glass border border-[#d6d7cf] shadow-xl rounded-2xl p-4 flex items-start gap-3">
            {t.type === "error" ? <XCircle className="text-red-600 shrink-0" size={19}/> :
             t.type === "info" ? <Info className="text-blue-600 shrink-0" size={19}/> :
             <CheckCircle2 className="text-green-700 shrink-0" size={19}/>}
            <p className="text-sm leading-5 flex-1">{t.message}</p>
            <button onClick={() => setItems(x => x.filter(a => a.id !== t.id))}><X size={16}/></button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
