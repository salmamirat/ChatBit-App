import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { QueryClient, QueryClientProvider} from "@tanstack/react-query";
import SocketProvider from "../src/context/SocketContext";

const queryClient = new QueryClient();

export default function Layout() {
  return (
    <QueryClientProvider client={queryClient}>
      <SocketProvider>
        <StatusBar style="dark" />

        <Stack
          screenOptions={{
            headerShown: false
          }}
        />
      </SocketProvider>
    </QueryClientProvider>
  );
}