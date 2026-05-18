
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { HandFist } from 'lucide-react';

export default function Toastify() {
  return (
    <ToastContainer
      icon={({ type}) => {
        switch (type) {
            case 'info':
            return <HandFist className="stroke-indigo-400" />;
            case 'error':
            return <HandFist color="var(--span)" />;
            case 'success':
            return <HandFist color="var(--confirmado)" />;
            case 'warning':
            return <HandFist color="var(--solicitado)" />;
            default:
            return null;
        }
      }}
    />  
  );
}