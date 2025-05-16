
import * as React from "react";
import { CalendarIcon } from "lucide-react";
import { addDays, format } from "date-fns";
import { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useData } from "@/hooks/useData";

export function DateRangePicker() {
  const { dateRange, setDateRange, fullDateRange } = useData();
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: dateRange.from,
    to: dateRange.to,
  });

  // Update internal state when dateRange from context changes
  React.useEffect(() => {
    setDate({
      from: dateRange.from,
      to: dateRange.to,
    });
  }, [dateRange.from, dateRange.to]);

  // Update quick select options based on available data
  const getQuickSelectRanges = () => {
    if (!fullDateRange) return [];

    const [minDate, maxDate] = fullDateRange;
    const now = new Date(maxDate);
    const ranges = [];

    // Only add ranges that are valid for the data
    if (addDays(now, -7) >= minDate) {
      ranges.push({ label: "Last 7 days", days: 7 });
    }
    if (addDays(now, -14) >= minDate) {
      ranges.push({ label: "Last 14 days", days: 14 });
    }
    if (addDays(now, -30) >= minDate) {
      ranges.push({ label: "Last 30 days", days: 30 });
    }
    if (addDays(now, -90) >= minDate) {
      ranges.push({ label: "Last 90 days", days: 90 });
    }

    // Add all data option
    ranges.push({ label: "All data", days: null });

    return ranges;
  };

  return (
    <div className="grid gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[260px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="p-3 border-b">
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Quick Select</h4>
              <div className="flex flex-wrap gap-2">
                {getQuickSelectRanges().map((range) => (
                  <Button
                    key={range.label}
                    variant="outline"
                    size="sm"
                    className="h-7 text-xs"
                    onClick={() => {
                      if (range.days === null) {
                        // All data option
                        if (fullDateRange) {
                          const newRange = {
                            from: fullDateRange[0],
                            to: fullDateRange[1],
                          };
                          setDate(newRange);
                          setDateRange(newRange);
                        }
                      } else if (fullDateRange) {
                        const to = new Date(fullDateRange[1]);
                        const from = addDays(to, -range.days);
                        const newRange = { from, to };
                        setDate(newRange);
                        setDateRange(newRange);
                      }
                    }}
                  >
                    {range.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={(newDate) => {
              setDate(newDate);
              setDateRange({
                from: newDate?.from,
                to: newDate?.to,
              });
            }}
            numberOfMonths={2}
            disabled={(date) => {
              // Only allow selecting dates within the available data range
              if (!fullDateRange) return false;
              const [minDate, maxDate] = fullDateRange;
              return date < minDate || date > maxDate;
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

export default DateRangePicker;
