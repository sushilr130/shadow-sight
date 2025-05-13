
import { useData } from '@/hooks/useData';
import { getTopUsers } from '@/utils/dataTransformer';
import { useMemo } from 'react';
import { ArrowUpRight, ChevronDown, ChevronUp } from 'lucide-react';

export const UserActivityTable = () => {
  const { filteredData } = useData();
  
  const users = useMemo(() => {
    return getTopUsers(filteredData);
  }, [filteredData]);
  
  const getRiskBadge = (score: number) => {
    if (score <= 500) return (
      <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700 font-medium">
        Low
      </span>
    );
    if (score <= 1000) return (
      <span className="text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-700 font-medium">
        Moderate
      </span>
    );
    if (score <= 1500) return (
      <span className="text-xs px-2 py-1 rounded-full bg-orange-100 text-orange-700 font-medium">
        High
      </span>
    );
    if (score <= 2000) return (
      <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-700 font-medium">
        Very High
      </span>
    );
    return (
      <span className="text-xs px-2 py-1 rounded-full bg-red-200 text-red-800 font-medium">
        Critical
      </span>
    );
  };
  
  if (filteredData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 border border-border rounded-lg p-6">
        <p className="text-muted-foreground">No data available for user activities</p>
      </div>
    );
  }
  
  return (
    <div className="w-full overflow-hidden rounded-lg border border-border/60 shadow-subtle">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-muted/50">
            <th className="px-4 py-3 text-left font-medium text-muted-foreground">User</th>
            <th className="px-4 py-3 text-left font-medium text-muted-foreground">Activities</th>
            <th className="px-4 py-3 text-left font-medium text-muted-foreground">Avg. Risk</th>
            <th className="px-4 py-3 text-left font-medium text-muted-foreground">High Risk</th>
            <th className="px-4 py-3 text-left font-medium text-muted-foreground"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/60">
          {users.map((user, i) => (
            <tr key={i} className="bg-white hover:bg-muted/20 transition-colors">
              <td className="px-4 py-3">
                <div className="font-medium">{user.user.split('@')[0]}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{user.user}</div>
              </td>
              <td className="px-4 py-3">{user.activities}</td>
              <td className="px-4 py-3">
                <div className="flex items-center">
                  <span className="font-medium mr-2">{user.averageRiskScore}</span>
                  {getRiskBadge(user.averageRiskScore)}
                </div>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center">
                  <span className="font-medium">{user.highRiskActivities}</span>
                  {user.highRiskActivities > 0 && (
                    <ChevronUp className="ml-1 h-4 w-4 text-destructive" />
                  )}
                </div>
              </td>
              <td className="px-4 py-3 text-right">
                <button className="text-muted-foreground hover:text-foreground transition-colors">
                  <ArrowUpRight className="h-4 w-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserActivityTable;


