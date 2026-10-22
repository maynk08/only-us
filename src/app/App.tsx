import { createBrowserRouter, Outlet, RouterProvider } from 'react-router'
import { Backdrop } from '../components/Backdrop'
import { BottomNav } from '../components/BottomNav'
import { AuthGate } from '../features/auth/AuthGate'
import { ChatScreen } from '../features/chat/ChatScreen'
import { HomeScreen } from '../features/home/HomeScreen'
import { IncomingMoments } from '../features/moments/IncomingMoments'
import { ComingSoon } from '../features/placeholder/ComingSoon'

/** Phone-width column, centred on larger screens. */
function Frame() {
  return (
    <div className="relative mx-auto h-dvh max-w-[480px]">
      <IncomingMoments />
      <Outlet />
    </div>
  )
}

function TabLayout() {
  return (
    <div className="flex h-full flex-col gap-4 overflow-y-auto px-[18px] pt-[calc(22px+env(safe-area-inset-top))] pb-[calc(20px+env(safe-area-inset-bottom))]">
      <Outlet />
      <BottomNav />
    </div>
  )
}

const router = createBrowserRouter([
  {
    element: <Frame />,
    children: [
      {
        element: <TabLayout />,
        children: [{ index: true, element: <HomeScreen /> }],
      },
      { path: 'chat', element: <ChatScreen /> },
      { path: '*', element: <ComingSoon title="Lost?" note="This page doesn't exist." /> },
    ],
  },
])

export function App() {
  return (
    <>
      <Backdrop />
      <AuthGate>
        <RouterProvider router={router} />
      </AuthGate>
    </>
  )
}
