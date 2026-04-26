import { useEffect } from 'react';

// iOS 13+ requires explicit permission for DeviceMotionEvent.
// Call this from a user-gesture handler (e.g. a button tap) before shaking.
export async function requestMotionPermission(): Promise<void> {
  type IOSDeviceMotionEvent = typeof DeviceMotionEvent & {
    requestPermission?: () => Promise<'granted' | 'denied'>;
  };
  const DME = DeviceMotionEvent as IOSDeviceMotionEvent;
  if (typeof DME.requestPermission === 'function') {
    try {
      await DME.requestPermission();
    } catch {
      // user denied or browser threw — shake just won't fire, which is fine
    }
  }
}

export function useShake(onShake: () => void, threshold = 18) {
  useEffect(() => {
    let lastX = 0, lastY = 0, lastZ = 0;
    let lastSample = 0;
    let cooldown = false;

    const handle = (e: DeviceMotionEvent) => {
      const acc = e.accelerationIncludingGravity;
      if (!acc) return;
      const now = Date.now();
      if (now - lastSample < 100) return;

      const dx = Math.abs((acc.x ?? 0) - lastX);
      const dy = Math.abs((acc.y ?? 0) - lastY);
      const dz = Math.abs((acc.z ?? 0) - lastZ);
      lastX = acc.x ?? 0;
      lastY = acc.y ?? 0;
      lastZ = acc.z ?? 0;
      lastSample = now;

      if (dx + dy + dz > threshold && !cooldown) {
        cooldown = true;
        onShake();
        setTimeout(() => { cooldown = false; }, 3000);
      }
    };

    window.addEventListener('devicemotion', handle);
    return () => window.removeEventListener('devicemotion', handle);
  }, [onShake, threshold]);
}
