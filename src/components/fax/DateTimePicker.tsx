import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import { format, addDays } from 'date-fns';
import { Calendar as CalendarIcon, Clock } from 'lucide-react';
import "react-datepicker/dist/react-datepicker.css";

interface DateTimePickerProps {
  value: Date;
  onChange: (date: Date) => void;
  minDate?: Date;
}

export const DateTimePicker: React.FC<DateTimePickerProps> = ({
  value,
  onChange,
  minDate = new Date()
}) => {
  const [selectedDate, setSelectedDate] = useState<Date>(value);

  const handleDateChange = (date: Date | null) => {
    if (!date) return;
    setSelectedDate(date);
    onChange(date);
  };

  return (
    <div className="flex items-center space-x-4">
      <div className="relative flex-1">
        <div className="w-full flex items-center">
          <DatePicker
            selected={selectedDate}
            onChange={handleDateChange}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={15}
            dateFormat="MMM d, yyyy h:mm aa"
            minDate={minDate}
            maxDate={addDays(minDate, 30)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            customInput={
              <button type="button" className="w-full flex items-center">
                <CalendarIcon className="h-5 w-5 text-gray-400 mr-2" />
                <span className="text-gray-900">{format(selectedDate, 'MMM d, yyyy h:mm aa')}</span>
                <Clock className="h-5 w-5 text-gray-400 ml-2" />
              </button>
            }
          />
        </div>
      </div>
    </div>
  );
};

export default DateTimePicker;
