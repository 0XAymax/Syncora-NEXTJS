"use client";

import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface Props {
  onChange: (timestamp: string) => void;
  defaultValue?: string;
}

const CustomDatePicker: React.FC<Props> = ({ onChange,defaultValue }) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(
      defaultValue ? new Date(defaultValue) : null
  );

  const handleChange = (date: Date | null) => {
    setSelectedDate(date);
    if (date) {
      const timestamp = date.toISOString(); // Format: "YYYY-MM-DDTHH:mm:ss.sssZ"
      onChange(timestamp);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <DatePicker
        selected={selectedDate}
        onChange={handleChange}
        showTimeSelect
        timeFormat="HH:mm"
        timeIntervals={15}
        dateFormat="yyyy-MM-dd HH:mm"
        className="border rounded-md p-1 w-[180px]"
        placeholderText="Select a date & time"
      />
    </div>
  );
};

export default CustomDatePicker;
