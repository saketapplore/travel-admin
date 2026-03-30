import React from 'react';

const AvailabilityCalendar = ({
  calendarMonth,
  calendarYear,
  selectedDates,
  onNavigate,
  onToggleDate
}) => {
  const getDaysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (month, year) => new Date(year, month, 1).getDay();

  const formatDateKey = (day, month, year) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  const getDateStatus = (day) => {
    const dateKey = formatDateKey(day, calendarMonth, calendarYear);
    const date = selectedDates.find((d) => d.date === dateKey);
    return date ? date.status : null;
  };

  const isDateSelected = (day) => {
    const dateKey = formatDateKey(day, calendarMonth, calendarYear);
    return selectedDates.some((d) => d.date === dateKey);
  };

  const days = getDaysInMonth(calendarMonth, calendarYear);
  const firstDay = getFirstDayOfMonth(calendarMonth, calendarYear);
  const today = new Date().setHours(0, 0, 0, 0);

  return (
    <div className="border border-gray-300 rounded-lg p-4 bg-white">
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={() => onNavigate('prev')}
          className="p-2 hover:bg-gray-100 rounded-lg transition"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <h3 className="text-lg font-semibold text-gray-800">
          {new Date(calendarYear, calendarMonth).toLocaleDateString('en-US', {
            month: 'long',
            year: 'numeric'
          })}
        </h3>
        <button
          type="button"
          onClick={() => onNavigate('next')}
          className="p-2 hover:bg-gray-100 rounded-lg transition"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="text-center text-xs font-semibold text-gray-600 py-2">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: firstDay }).map((_, idx) => (
          <div key={`empty-${idx}`} className="aspect-square"></div>
        ))}
        {Array.from({ length: days }).map((_, idx) => {
          const day = idx + 1;
          const isSelected = isDateSelected(day);
          const status = getDateStatus(day);
          const isPast = new Date(calendarYear, calendarMonth, day) < today;

          return (
            <button
              key={day}
              type="button"
              onClick={() => !isPast && onToggleDate(day)}
              disabled={isPast}
              className={`aspect-square rounded-lg text-sm font-medium transition-all ${
                isPast
                  ? 'text-gray-300 cursor-not-allowed'
                  : isSelected
                    ? status === 'booked'
                      ? 'bg-red-500 text-white hover:bg-red-600'
                      : status === 'available'
                        ? 'bg-green-500 text-white hover:bg-green-600'
                        : 'bg-orange-500 text-white hover:bg-orange-600'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              title={
                isPast
                  ? 'Past date'
                  : isSelected
                    ? `${status} - Click to cycle: ${status === 'booked' ? 'available' : 'remove'}`
                    : 'Click to mark as booked'
              }
            >
              {day}
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex items-center justify-center gap-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-100 rounded"></div>
          <span>Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-500 rounded"></div>
          <span>Booked</span>
        </div>
        <div className="text-gray-500">Click dates to toggle status</div>
      </div>

      {selectedDates.length > 0 && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg text-left">
          <p className="text-xs font-semibold text-gray-700 mb-2">
            Selected Dates ({selectedDates.length}):
          </p>
          <div className="flex flex-wrap gap-2">
            {selectedDates
              .filter((d) => {
                const [y, m] = d.date.split('-').map(Number);
                return m === calendarMonth + 1 && y === calendarYear;
              })
              .slice(0, 5)
              .map((d, idx) => (
                <span
                  key={idx}
                  className={`text-xs px-2 py-1 rounded ${
                    d.status === 'booked'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-green-100 text-green-800'
                  }`}
                >
                  {new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}{' '}
                  ({d.status})
                </span>
              ))}
            {selectedDates.filter((d) => {
              const [y, m] = d.date.split('-').map(Number);
              return m === calendarMonth + 1 && y === calendarYear;
            }).length > 5 && (
              <span className="text-xs text-gray-500">
                +
                {selectedDates.filter((d) => {
                  const [y, m] = d.date.split('-').map(Number);
                  return m === calendarMonth + 1 && y === calendarYear;
                }).length - 5}{' '}
                more
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AvailabilityCalendar;
