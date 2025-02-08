import { WagmiProvider, createConfig, http } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";
import { lens_rpc_url, walletconnect_project_id } from "@/utils/env";
import { chains } from "@lens-network/sdk/viem";

export const config = createConfig(
  getDefaultConfig({
    chains: [chains.testnet],
    transports: {
      // RPC URL for each chain
      [37111]: http(
        lens_rpc_url,
      ),
    },

    walletConnectProjectId: walletconnect_project_id,

    appName: "autozone",

    appDescription: "der zone fur autos",
    appUrl: "https://family.co",
    appIcon: "https://family.co/logo.png",
    
  }),
);

const queryClient = new QueryClient();

// const client = createClient(
//   getDefaultClient({
//     appName: "ConnectKit Vite Demo",
//     alchemyId: process.env.ALCHEMY_ID,
//     //infuraId: process.env.INFURA_ID,
//     chains: [chain.mainnet, chain.polygon, chain.optimism, chain.arbitrum]
//   })
// )

export const Web3Provider = ({ children }: any) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider>{children}</ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};