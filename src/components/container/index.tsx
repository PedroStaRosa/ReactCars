import { ReactNode } from "react";

function Container({ children }: { children: ReactNode }) {
  return (
    <main className="h-full w-full items-center justify-center mt-5 p-2 ">
      {children}
    </main>
  );
}

export default Container;
