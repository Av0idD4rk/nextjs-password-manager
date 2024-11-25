'use client';

import { QueryClient, QueryClientProvider } from 'react-query';
import React, { useState } from 'react';

function QueryProvider({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(() => new QueryClient());

    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
}
export default QueryProvider;
