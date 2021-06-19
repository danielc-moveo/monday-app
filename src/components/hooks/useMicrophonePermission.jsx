import { useEffect, useState } from 'react';

const useMicrophonePermission = () => {
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    navigator.permissions.query({ name: 'microphone' }).then(function (permissionStatus) {
      if (permissionStatus.state === 'denied') {
        setNotification('Please allow microphone access in order to use this feature');
      }

      permissionStatus.onchange = function () {
        if (permissionStatus.state === 'denied') {
          setNotification('Please allow microphone access in order to use this feature');
        } else {
          setNotification(null);
        }
      };
    });
  }, []);

  return notification;
};

export default useMicrophonePermission;
