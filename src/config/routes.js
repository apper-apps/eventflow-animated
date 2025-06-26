import Dashboard from '@/components/pages/Dashboard';
import Events from '@/components/pages/Events';
import Menus from '@/components/pages/Menus';
import Invoices from '@/components/pages/Invoices';
import Reports from '@/components/pages/Reports';

export const routes = {
  dashboard: {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/',
    icon: 'LayoutDashboard',
    component: Dashboard
  },
  events: {
    id: 'events',
    label: 'Events',
    path: '/events',
    icon: 'Calendar',
    component: Events
  },
  menus: {
    id: 'menus',
    label: 'Menus',
    path: '/menus',
    icon: 'ChefHat',
    component: Menus
  },
  invoices: {
    id: 'invoices',
    label: 'Invoices',
    path: '/invoices',
    icon: 'FileText',
    component: Invoices
  },
  reports: {
    id: 'reports',
    label: 'Reports',
    path: '/reports',
    icon: 'BarChart3',
    component: Reports
  }
};

export const routeArray = Object.values(routes);
export default routes;