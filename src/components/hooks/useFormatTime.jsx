import { useCallback } from 'react';

const useFormatTime = () => {
  const formatTime = useCallback((time) => {
    const today = new Date();
    const createTime = new Date(time);
    const diffMs = today - createTime; // milliseconds between now & createTime
    const diffDays = Math.floor(diffMs / 86400000); // days
    const diffHrs = Math.floor((diffMs % 86400000) / 3600000); // hours
    const diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000); // minutes

    if (diffDays === 0) {
      if (diffHrs === 0) {
        if (diffMins < 5) return 'just now';
        else return `${diffMins}m`;
      } else return `${diffHrs}h`;
    } else if (diffDays < 30) {
      return `${diffDays}d`;
    }

    const partialDate = createTime.toDateString().split(' ');
    return `${partialDate[1]} ${partialDate[2]}`;
  }, []);
  return formatTime;
};

export default useFormatTime;
