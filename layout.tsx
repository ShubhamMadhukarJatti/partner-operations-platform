import React, { ReactNode } from 'react'

import RouteTransition from '@/components/ui/route-transition'
import SidebarMenuLayout from '@/components/layouts/sidebar-layout'

const DashboardLayout = ({ children, modal }: any) => {
  return (
    <SidebarMenuLayout isSettings={false}>
      <RouteTransition>{children}</RouteTransition>
      {modal}
    </SidebarMenuLayout>
  )
}

export default DashboardLayout
