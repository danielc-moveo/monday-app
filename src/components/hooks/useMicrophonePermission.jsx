import { useEffect, useState } from 'react';
import Alert from '../../ui/alert/Alert.svg';

const AlertMessage = () => <img src={Alert} alt="" />;

const useMicrophonePermission = () => {
  const [isMicrophoneAllowed, setIsMicrophoneAllowed] = useState(false);

  useEffect(() => {
    navigator.permissions.query({ name: 'microphone' }).then(function (permissionStatus) {
      if (permissionStatus.state === 'denied') {
        setIsMicrophoneAllowed(false);
      }

      permissionStatus.onchange = function () {
        if (permissionStatus.state === 'denied') {
          setIsMicrophoneAllowed(false);
        }
        setIsMicrophoneAllowed(true);
      };
    });
  }, []);

  return [isMicrophoneAllowed, AlertMessage];
};

export default useMicrophonePermission;
