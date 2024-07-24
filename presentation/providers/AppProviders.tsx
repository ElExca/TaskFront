// AppProviders.tsx
import React from 'react';
import { TaskProvider } from '@/presentation/providers/TaskProvider';
import { TaskProviderCategory } from '@/presentation/providers/TaskProviderCategory';
import { TaskProviderProgress } from '@/presentation/providers/TaskProviderProgress';
import { CategoryProvider } from '@/presentation/providers/CategoryProvider';

const AppProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <TaskProvider>
      <TaskProviderCategory>
        <TaskProviderProgress>
          <CategoryProvider>
            {children}
          </CategoryProvider>
        </TaskProviderProgress>
      </TaskProviderCategory>
    </TaskProvider>
  );
};

export default AppProviders;
