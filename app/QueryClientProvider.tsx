"use client";
import {
  QueryClient,
  QueryClientProvider as ReactQueryClientProvier,
} from "@tanstack/react-query";
import { PropsWithChildren } from "react";

const queryClient = new QueryClient();

const QueryClientProvider = ({ children }: PropsWithChildren) => {
  return (
    <ReactQueryClientProvier client={queryClient}>
      {children}
    </ReactQueryClientProvier>
  );
};

export default QueryClientProvider;
