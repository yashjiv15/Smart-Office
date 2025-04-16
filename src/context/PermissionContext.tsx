// src/context/PermissionContext.tsx
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type PermissionContextType = {
  permissions: string[];
};

const PermissionContext = createContext<PermissionContextType>({ permissions: [] });

export const usePermissions = () => useContext(PermissionContext);

export const PermissionProvider = ({ children }: { children: ReactNode }) => {
    const [permissions, setPermissions] = useState<string[]>([]);
  
    useEffect(() => {
      const fetchPermissions = () => {
        const sessionPermissions = localStorage.getItem('sessionPermissions');
        if (sessionPermissions) {
          const permissionsList = JSON.parse(sessionPermissions);
          setPermissions(permissionsList);
          console.log(setPermissions)
        } else {
          setPermissions([]); // Clear permissions if not found
        }
      };
  
      fetchPermissions();
    }, []);
  
    return (
      <PermissionContext.Provider value={{ permissions }}>
        {children}
      </PermissionContext.Provider>
    );
  };
