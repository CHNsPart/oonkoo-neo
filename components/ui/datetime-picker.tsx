"use client";

import React, { useState, useCallback } from 'react';
import { addDays, format } from "date-fns"
import { Clock, CalendarIcon } from 'lucide-react';
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from '@/lib/utils';

interface DateTimePickerProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

// Move these outside to prevent recreations
const hours = Array.from({ length: 12 }, (_, i) => 
  (i + 1).toString().padStart(2, '0')
);

const minutes = Array.from({ length: 60 }, (_, i) => 
  i.toString().padStart(2, '0')
);

export function DateTimePicker({ value, onChange, className }: DateTimePickerProps) {
  // Parse initial date from value prop
  const initialDate = value ? new Date(value) : undefined;
  const [date, setDate] = useState<Date | undefined>(initialDate);
  
  // Initial time values
  const getInitialTime = () => {
    if (!initialDate) return { hour: '12', minute: '00', period: 'AM' };
    
    let hours = initialDate.getHours();
    const isPM = hours >= 12;
    hours = hours % 12;
    hours = hours ? hours : 12;

    return {
      hour: hours.toString().padStart(2, '0'),
      minute: initialDate.getMinutes().toString().padStart(2, '0'),
      period: isPM ? 'PM' : 'AM'
    };
  };

  const [time, setTime] = useState(getInitialTime());

  // Memoized update handler
  const handleUpdate = useCallback((newDate: Date | undefined, newTime = time) => {
    if (!newDate) return;

    const dateObj = new Date(newDate);
    const hour = parseInt(newTime.hour);
    const minute = parseInt(newTime.minute);
    
    dateObj.setHours(
      newTime.period === 'PM' && hour !== 12 ? hour + 12 : 
      newTime.period === 'AM' && hour === 12 ? 0 : hour,
      minute
    );

    onChange(dateObj.toISOString());
  }, [time, onChange]);

  // Time update handlers
  const updateTime = useCallback((update: Partial<typeof time>) => {
    const newTime = { ...time, ...update };
    setTime(newTime);
    if (date) handleUpdate(date, newTime);
  }, [time, date, handleUpdate]);

  return (
    <div className={cn("space-y-2", className)}>
      <div className="text-sm text-muted-foreground">
        Preferred Meeting Time (Optional)
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Date Picker */}
        <Popover>
          <PopoverTrigger asChild>
            <button
              type="button"
              className={cn(
                "w-full h-[45px] px-4 rounded-xl bg-white/5 border border-white/10",
                "inline-flex items-center text-left text-sm text-white",
                "hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-brand-primary/50",
                "transition-colors duration-200",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4 text-brand-primary" />
              {date ? format(date, "PPP") : "Select date"}
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 bg-black/90 backdrop-blur-xl border-white/10">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(newDate) => {
                setDate(newDate);
                if (newDate) handleUpdate(newDate);
              }}
              disabled={(date) => date < addDays(new Date(), 1)}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        {/* Time Picker */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <div className="flex items-center gap-2">
              {/* Hour */}
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-primary z-10" />
                <Select
                  value={time.hour}
                  onValueChange={(hour) => updateTime({ hour })}
                >
                  <SelectTrigger className="h-[45px] w-[85px] pl-10 rounded-xl bg-white/5 border-white/10 text-white">
                    <SelectValue placeholder="HH" />
                  </SelectTrigger>
                  <SelectContent className="bg-black/90 backdrop-blur-xl border-white/10 max-h-[200px]">
                    {hours.map((hour) => (
                      <SelectItem 
                        key={hour} 
                        value={hour}
                        className="text-white hover:bg-white/10"
                      >
                        {hour}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <span className="text-white/70">:</span>

              {/* Minute */}
              <Select
                value={time.minute}
                onValueChange={(minute) => updateTime({ minute })}
              >
                <SelectTrigger className="h-[45px] w-[85px] rounded-xl bg-white/5 border-white/10 text-white">
                  <SelectValue placeholder="MM" />
                </SelectTrigger>
                <SelectContent className="bg-black/90 backdrop-blur-xl border-white/10 max-h-[200px]">
                  {minutes.map((minute) => (
                    <SelectItem 
                      key={minute} 
                      value={minute}
                      className="text-white hover:bg-white/10"
                    >
                      {minute}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* AM/PM */}
              <Select
                value={time.period}
                onValueChange={(period: 'AM' | 'PM') => updateTime({ period })}
              >
                <SelectTrigger className="h-[45px] w-[85px] rounded-xl bg-white/5 border-white/10 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-black/90 backdrop-blur-xl border-white/10">
                  <SelectItem value="AM" className="text-white hover:bg-white/10">AM</SelectItem>
                  <SelectItem value="PM" className="text-white hover:bg-white/10">PM</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}