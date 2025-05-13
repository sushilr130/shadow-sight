
import { useData } from '@/hooks/useData';
import { getTopUsersWithDataLeakage } from '@/utils/dataTransformer';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useMemo, useState } from 'react';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';

export const DataLeakageByUserChart = () => {
  const { filteredData } = useData();
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;
  
  const allData = useMemo(() => {
    return getTopUsersWithDataLeakage(filteredData);
  }, [filteredData]);
  
  const data = useMemo(() => {
    const startIndex = (page - 1) * itemsPerPage;
    return allData.slice(startIndex, startIndex + itemsPerPage)
      .map(item => ({
        ...item,
        name: item.user.split('@')[0] // Show only username part in chart
      }));
  }, [allData, page]);
  
  const totalPages = Math.ceil(allData.length / itemsPerPage);
  
  if (filteredData.length === 0 || allData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 border border-border rounded-lg p-6">
        <p className="text-muted-foreground">No data available for data leakage by user</p>
      </div>
    );
  }
  
  return (
    <div className="w-full">
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 10, right: 10, left: 100, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
            <XAxis type="number" />
            <YAxis 
              dataKey="name" 
              type="category"
              width={100} 
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              formatter={(value) => [`${value} Incidents`, 'Count']}
              labelFormatter={(label) => {
                const user = data.find(d => d.name === label)?.user || '';
                return `User: ${user}`;
              }}
            />
            <Bar 
              dataKey="count" 
              fill="#ef4444"
              radius={[0, 4, 4, 0]}
              animationDuration={800}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      {totalPages > 1 && (
        <Pagination className="mt-4">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => setPage(Math.max(1, page - 1))} 
                className={page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
            
            {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
              // Calculate page numbers to show
              let pageNum = i + 1;
              if (totalPages > 5) {
                if (page > 3 && page < totalPages - 1) {
                  pageNum = page - 2 + i;
                } else if (page >= totalPages - 1) {
                  pageNum = totalPages - 4 + i;
                }
              }
              
              return (
                <PaginationItem key={i}>
                  <PaginationLink 
                    onClick={() => setPage(pageNum)} 
                    isActive={page === pageNum}
                    className="cursor-pointer"
                  >
                    {pageNum}
                  </PaginationLink>
                </PaginationItem>
              );
            })}
            
            <PaginationItem>
              <PaginationNext 
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                className={page === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};

export default DataLeakageByUserChart;
