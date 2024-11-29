"use client";

import { useEffect, useState } from "react";
import { ring } from "ldrs";

ring.register();

declare module "react" {
  interface ReactJSXElement {
    "l-ring": any;
  }
}

export default function LoadingScreen() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
      <l-ring size="50" stroke="4" speed="2.5" color="white"></l-ring>
    </div>
  );
}
