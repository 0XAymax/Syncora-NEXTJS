"use Client";

import { useTheme } from "next-themes";
import Image from "next/image";
import React, { useEffect, useState } from "react";

interface LogoProps {
  isText: boolean;
}

const Logo: React.FC<LogoProps> = ({ isText }) => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // This ensures resolvedTheme will not be undefined, if the effect runs, the theme will be loaded
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-[150px] h-[100px] mb-4 text-center">Loading...</div>
    );
  }

  const imgSrc = `/logo-${resolvedTheme}${isText ? "-text" : ""}.png`;

  return (
    <Image src={imgSrc} alt="logo" width={150} height={100} className="mb-4" />
  );
};

export default Logo;
