"use client";

import FloatingImageLayout from "@/components/shared/FloatingImageLayout";
import { homeFloatingAnimations } from "@/components/home/homeFloatingAnimations";
import { ProfileType } from "@/types";

interface HomeFloatingWrapperProps {
  profile: ProfileType;
  children: React.ReactNode;
}

export default function HomeFloatingWrapper({
  profile,
  children,
}: HomeFloatingWrapperProps) {
  return (
    <FloatingImageLayout
      profile={profile}
      setupSectionAnimations={homeFloatingAnimations}
    >
      {children}
    </FloatingImageLayout>
  );
}
