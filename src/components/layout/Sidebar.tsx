
import {
  LayoutDashboard,
  BarChart3,
  Calendar,
  Settings,
  FileText,
  LucideIcon,
  Mail,
  Usb,
  Cloud,
  AlertOctagon,
  TrendingDown,
  UserCog,
  ShieldAlert,
  Globe,
  Clock,
  File,
  User,
  FileSearch,
  UserCheck,
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useSidebar } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  disabled?: boolean;
  label?: string;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

interface SidebarProps {
  className?: string;
}

const NAV_GROUPS: NavGroup[] = [
  {
    title: 'Main',
    items: [
      {
        title: 'Dashboard',
        href: '/',
        icon: LayoutDashboard,
      },
      {
        title: 'Analytics',
        href: '/analytics',
        icon: BarChart3,
      },
      {
        title: 'Calendar',
        href: '/calendar',
        icon: Calendar,
      },
      {
        title: 'Data Management',
        href: '/data-management',
        icon: FileText,
      },
    ]
  },
  {
    title: 'Channel Analytics',
    items: [
      {
        title: 'Email Analytics',
        href: '/email-analytics',
        icon: Mail,
      },
      {
        title: 'USB Analytics',
        href: '/usb-analytics',
        icon: Usb,
      },
      {
        title: 'Cloud Analytics',
        href: '/cloud-analytics',
        icon: Cloud,
      },
    ]
  },
  {
    title: 'Advanced Analytics',
    items: [
      {
        title: 'Email Domain Analysis',
        href: '/email-domain-analysis',
        icon: Globe,
      },
      {
        title: 'Activity Time Analysis',
        href: '/activity-time-analysis',
        icon: Clock,
      },
      {
        title: 'File Analysis',
        href: '/file-analysis',
        icon: File,
      },
    ]
  },
  {
    title: 'Compliance & Monitoring',
    items: [
      {
        title: 'Data Leakage',
        href: '/data-leakage',
        icon: AlertOctagon,
      },
      {
        title: 'Data Leakage Investigation',
        href: '/data-leakage-investigation',
        icon: FileSearch,
      },
      {
        title: 'Risk Analysis',
        href: '/risk-analysis',
        icon: TrendingDown,
      },
      {
        title: 'User Monitoring',
        href: '/user-monitoring',
        icon: UserCog,
      },
      {
        title: 'Employee Monitoring',
        href: '/employee-monitoring',
        icon: User,
      },
      {
        title: 'Manager Actions',
        href: '/manager-actions',
        icon: UserCheck,
      },
      {
        title: 'Compliance Reports',
        href: '/compliance-reports',
        icon: ShieldAlert,
        label: 'New',
      },
    ]
  },
  {
    title: 'Settings',
    items: [
      {
        title: 'Settings',
        href: '/settings',
        icon: Settings,
      },
    ]
  }
];

const Sidebar = ({ className }: SidebarProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const sidebar = useSidebar();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-50 flex h-screen w-64 flex-col border-r border-border/50 bg-secondary py-3 transition-all md:block md:static',
        className
      )}
    >
      <div className="px-6 pb-4">
        <div className="font-semibold">Insight Haven</div>
      </div>
      <div className="flex-1 overflow-y-auto px-4">
        {NAV_GROUPS.map((group, index) => {
          // Skip rendering the group title for Settings, but still render its items
          if (group.title === 'Settings') {
            return (
              <div key={index} className="mb-4">
                <ul className="space-y-1">
                  {group.items.map((item) => (
                    <li key={item.href}>
                      <NavLink
                        to={item.href}
                        className={({ isActive }) =>
                          cn(
                            'group flex items-center space-x-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground',
                            isActive
                              ? 'bg-accent text-accent-foreground'
                              : 'text-secondary-foreground'
                          )
                        }
                      >
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                        {item.label ? (
                          <span className="ml-auto rounded-sm bg-primary px-1.5 py-0.5 text-xs font-semibold text-primary-foreground">
                            {item.label}
                          </span>
                        ) : null}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </div>
            );
          }
          
          // Normal rendering for other groups
          return (
            <div key={index} className="mb-4">
              <div className="px-2 py-2">
                <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{group.title}</h3>
              </div>
              <ul className="space-y-1">
                {group.items.map((item) => (
                  <li key={item.href}>
                    <NavLink
                      to={item.href}
                      className={({ isActive }) =>
                        cn(
                          'group flex items-center space-x-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground',
                          isActive
                            ? 'bg-accent text-accent-foreground'
                            : 'text-secondary-foreground'
                        )
                      }
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                      {item.label ? (
                        <span className="ml-auto rounded-sm bg-primary px-1.5 py-0.5 text-xs font-semibold text-primary-foreground">
                          {item.label}
                        </span>
                      ) : null}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </aside>
  );
};

export default Sidebar;