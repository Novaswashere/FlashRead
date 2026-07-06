import React from "react";
import { User } from "@/types";

export interface ProfileSectionProps {
  user: User;
  onSignOut: () => void;
}

export const ProfileSection: React.FC<ProfileSectionProps> = ({
  user,
  onSignOut
}) => {
  return (
    <div className="flex flex-col text-left">
      <div className="p-space-md flex items-center justify-between">
        <div className="flex items-center gap-space-md text-left">
          <div className="w-12 h-12 rounded-full overflow-hidden bg-surface-container shrink-0">
            <img
              className="w-full h-full object-cover"
              alt="User profile avatar"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAgRgsP0ljZmdxeZ7rjg-9aFLB7ZAegxADAwSyfnZv_GrwbmuW1grGH6lDStNzO4GdOmr4-p2ZVNMsJ3HGMtM-rPafWhIgqtXsvZdv5jBtBPGLuXmRw59yKE6x4lbBb3FoZyjl__j9JW9x0YhLi77VTV3CQ-8W0ekt26wxa1KfG7Eg5dYakfEE6_7GSfICU9QpRZlrVBl26pFp9egipT0jtxHHZ79-bDBogh8xp39nUb3gfsTKQbYKM0GuKoAqSvx7vXgP6tGwAYoju"
            />
          </div>
          <div>
            <p className="font-bold text-on-surface">{user.displayName}</p>
            <p className="text-xs text-on-surface-variant">{user.email}</p>
          </div>
        </div>
        <button className="text-primary text-sm font-bold hover:underline">Edit</button>
      </div>

      <a className="p-space-md flex items-center justify-between hover:bg-surface-container-low transition-colors" href="#">
        <div className="flex items-center gap-space-md">
          <span className="material-symbols-outlined text-secondary">sync</span>
          <p className="font-medium text-on-surface">Cloud Synchronization</p>
        </div>
        <span className="material-symbols-outlined text-on-surface-variant">chevron_right</span>
      </a>

      <button
        onClick={onSignOut}
        className="p-space-md flex items-center justify-between hover:bg-surface-container-low transition-colors text-left w-full"
      >
        <div className="flex items-center gap-space-md text-error">
          <span className="material-symbols-outlined">logout</span>
          <p className="font-medium">Sign Out</p>
        </div>
      </button>
    </div>
  );
};
