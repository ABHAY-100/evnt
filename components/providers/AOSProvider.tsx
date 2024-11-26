"use client";

import { useEffect } from "react";
import { initAOS } from "@/utils/aos";

interface AOSProviderProps {
  children: React.ReactNode;
}

export const AOSProvider = ({ children }: AOSProviderProps) => {
  useEffect(() => {
    initAOS();
  }, []);

  return <>{children}</>;
};
