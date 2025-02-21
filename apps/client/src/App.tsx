import './App.css'
import { uri as _uri } from '@lens-protocol/client'
import { client_id, redirect_uri } from './utils/env'
import { Route, Routes } from 'react-router'
import Home from './routes/home'
import Account from './routes/account'
import { AppProvider } from './contexts/AppContext'
import {
  DimoAuthProvider,
  initializeDimoSDK,
} from "@dimo-network/login-with-dimo";
import { Web3Provider } from './contexts/WagmiContext'
import Navbar from './components/Navbar'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Layout from './components/sidebar/app-sidebar'
import Dashboard from './routes/dashboard'
import Group from './components/group/group'
import Admin from './routes/admin'
import Feed from './routes/feed'

initializeDimoSDK({
  clientId: client_id,
  redirectUri: redirect_uri,
  // OPTIONAL
  // apiKey: "<dev_license_apiKey>",
  // environment: "<environment>", 
});

const queryClient = new QueryClient()

function App() {


  return (
    <AppProvider>
      <QueryClientProvider client={queryClient}>
        <DimoAuthProvider>
          <Web3Provider>
            <Layout>
            <Navbar />
            <Routes>
              <Route index element={<Home />} />
              <Route path='/account' element={<Account />} />
              <Route path='/dashboard' element={<Dashboard />} />
              <Route path='/group/:id' element={<Group />} />
              <Route path='/admin' element={<Admin />} />
              <Route path='/feed/:address' element={<Feed />} />
            </Routes>
            </Layout>
          </Web3Provider>
        </DimoAuthProvider>
      </QueryClientProvider>
    </AppProvider>
  )
}

export default App
