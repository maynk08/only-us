import { createBrowserRouter, Outlet, RouterProvider } from 'react-router'
import { Backdrop } from '../components/Backdrop'
import { BottomNav } from '../components/BottomNav'
import { ChatScreen } from '../features/chat/ChatScreen'
import { HomeScreen } from '../features/home/HomeScreen'
import { ComingSoon } from '../features/placeholder/ComingSoon'

/** Phone-width column, centred on larger screens. */
function Frame() {
  return (
    <>
      <Backdrop />
      <div className="relative mx-auto h-dvh max-w-[480px]">
        <Outlet />
      </div>
    </>
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
        children: [
          { index: true, element: <HomeScreen /> },
          {
            path: 'story',
            element: <ComingSoon title="Our Story" note="Your timeline of moments together lands in phase 5." />,
          },
          {
            path: 'stickers',
            element: <ComingSoon title="Stickers" note="Sticker packs and your own photo stickers land in phase 6." />,
          },
        ],
      },
      { path: 'chat', element: <ChatScreen /> },
      { path: '*', element: <ComingSoon title="Lost?" note="This page doesn't exist." /> },
    ],
  },
])

export function App() {
  return <RouterProvider router={router} />
}
