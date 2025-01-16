import { ReactNode } from "react";

interface LoadingProps {
  children: ReactNode;
  text: string;
}

const LoadingComponent = ({ children, text }: LoadingProps) => {
  return (
    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-slate-400 bg-opacity-50 z-50">
      <div className="relative flex flex-col items-center text-primary">
        {children}
        <span className="mt-2">{text}</span>
      </div>
    </div>
  );
};

export default LoadingComponent;
