import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

const DecayCard = ({ 
  width = 300, 
  height = 400, 
  image = 'https://picsum.photos/300/400?grayscale', 
  children,
  enableGyro = false,
  gyroSensitivity = 1.0
}) => {
  const svgRef = useRef(null);
  const displacementMapRef = useRef(null);
  const cursor = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const cachedCursor = useRef({ ...cursor.current });
  const winsize = useRef({ width: window.innerWidth, height: window.innerHeight });
  const [isGyroActive, setIsGyroActive] = useState(false);
  const gyroPosition = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });

  useEffect(() => {
    const lerp = (a, b, n) => (1 - n) * a + n * b;
    const map = (x, a, b, c, d) => ((x - a) * (d - c)) / (b - a) + c;
    const distance = (x1, x2, y1, y2) => Math.hypot(x1 - x2, y1 - y2);
    const clamp = (val, min, max) => Math.min(Math.max(val, min), max);

    const handleResize = () => {
      winsize.current = { width: window.innerWidth, height: window.innerHeight };
    };

    const handleMouseMove = ev => {
      if (!isGyroActive) {
        cursor.current = { x: ev.clientX, y: ev.clientY };
      }
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);

    const imgValues = {
      imgTransforms: { x: 0, y: 0, rz: 0 },
      displacementScale: 0
    };

    const render = () => {
      // Use gyro position if active, otherwise use cursor
      const activePosition = isGyroActive ? gyroPosition.current : cursor.current;

      let targetX = lerp(
        imgValues.imgTransforms.x, 
        map(activePosition.x, 0, winsize.current.width, -120, 120), 
        0.1
      );
      let targetY = lerp(
        imgValues.imgTransforms.y, 
        map(activePosition.y, 0, winsize.current.height, -120, 120), 
        0.1
      );
      let targetRz = lerp(
        imgValues.imgTransforms.rz, 
        map(activePosition.x, 0, winsize.current.width, -10, 10), 
        0.1
      );

      const bound = 50;
      if (targetX > bound) targetX = bound + (targetX - bound) * 0.2;
      if (targetX < -bound) targetX = -bound + (targetX + bound) * 0.2;
      if (targetY > bound) targetY = bound + (targetY - bound) * 0.2;
      if (targetY < -bound) targetY = -bound + (targetY + bound) * 0.2;

      imgValues.imgTransforms.x = targetX;
      imgValues.imgTransforms.y = targetY;
      imgValues.imgTransforms.rz = targetRz;

      if (svgRef.current) {
        gsap.set(svgRef.current, {
          x: imgValues.imgTransforms.x,
          y: imgValues.imgTransforms.y,
          rotateZ: imgValues.imgTransforms.rz
        });
      }

      const cursorTravelledDistance = distance(
        cachedCursor.current.x,
        activePosition.x,
        cachedCursor.current.y,
        activePosition.y
      );
      imgValues.displacementScale = lerp(
        imgValues.displacementScale,
        map(cursorTravelledDistance, 0, 200, 0, 400),
        0.06
      );

      if (displacementMapRef.current) {
        gsap.set(displacementMapRef.current, { attr: { scale: imgValues.displacementScale } });
      }

      cachedCursor.current = { ...activePosition };

      requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isGyroActive]);

  // Gyroscope support
  useEffect(() => {
    if (!enableGyro) return;

    const handleOrientation = (event) => {
      const gamma = event.gamma ?? 0; // left/right tilt (-90 to 90)
      const beta = event.beta ?? 0;   // front/back tilt (-180 to 180)

      // Check if device is in portrait or landscape
      const isPortrait = window.innerHeight > window.innerWidth;

      let normalizedX, normalizedY;

      if (isPortrait) {
        // Portrait mode: use beta for X, gamma for Y
        normalizedX = Math.max(-1, Math.min(1, -beta / 30));
        normalizedY = Math.max(-1, Math.min(1, gamma / 45));
      } else {
        // Landscape mode: use gamma for X, beta for Y
        normalizedX = Math.max(-1, Math.min(1, gamma / 45));
        normalizedY = Math.max(-1, Math.min(1, -beta / 30));
      }

      // Apply sensitivity
      normalizedX *= gyroSensitivity;
      normalizedY *= gyroSensitivity;

      // Map to screen coordinates
      const x = ((normalizedX + 1) / 2) * winsize.current.width;
      const y = ((normalizedY + 1) / 2) * winsize.current.height;

      gyroPosition.current = { x, y };
      setIsGyroActive(true);
    };

    const handleMotion = () => {
      // Detect when device is moving to activate gyro mode
      setIsGyroActive(true);
    };

    // Request permission for iOS 13+
    const requestPermission = async () => {
      if (
        typeof DeviceOrientationEvent !== 'undefined' &&
        typeof DeviceOrientationEvent.requestPermission === 'function'
      ) {
        try {
          const permission = await DeviceOrientationEvent.requestPermission();
          if (permission === 'granted') {
            window.addEventListener('deviceorientation', handleOrientation);
            window.addEventListener('devicemotion', handleMotion, { once: true });
          }
        } catch (error) {
          console.error('DeviceOrientation permission denied:', error);
        }
      } else {
        // Non-iOS devices
        window.addEventListener('deviceorientation', handleOrientation);
        window.addEventListener('devicemotion', handleMotion, { once: true });
      }
    };

    // Auto-request on mount, or wait for user interaction
    requestPermission();

    // Fallback to mouse when gyro becomes inactive
    const resetGyroTimer = setTimeout(() => {
      const checkGyroActivity = setInterval(() => {
        const timeSinceLastUpdate = Date.now() - (gyroPosition.current.lastUpdate || 0);
        if (timeSinceLastUpdate > 1000) {
          setIsGyroActive(false);
        }
      }, 2000);

      return () => clearInterval(checkGyroActivity);
    }, 5000);

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
      window.removeEventListener('devicemotion', handleMotion);
      clearTimeout(resetGyroTimer);
    };
  }, [enableGyro, gyroSensitivity]);

  // Click handler for iOS permission request
  const handleClick = async () => {
    if (
      enableGyro &&
      typeof DeviceOrientationEvent !== 'undefined' &&
      typeof DeviceOrientationEvent.requestPermission === 'function'
    ) {
      try {
        const permission = await DeviceOrientationEvent.requestPermission();
        if (permission === 'granted') {
          setIsGyroActive(true);
        }
      } catch (error) {
        console.error('Permission request failed:', error);
      }
    }
  };

  return (
    <div 
      ref={svgRef} 
      className="relative" 
      style={{ width: `${width}px`, height: `${height}px` }}
      onClick={handleClick}
    >
      <svg
        viewBox="-60 -75 720 900"
        preserveAspectRatio="xMidYMid slice"
        className="relative w-full h-full block [will-change:transform]"
      >
        <filter id="imgFilter">
          <feTurbulence
            type="turbulence"
            baseFrequency="0.015"
            numOctaves="5"
            seed="4"
            stitchTiles="stitch"
            x="0%"
            y="0%"
            width="100%"
            height="100%"
            result="turbulence1"
          />
          <feDisplacementMap
            ref={displacementMapRef}
            in="SourceGraphic"
            in2="turbulence1"
            scale="0"
            xChannelSelector="R"
            yChannelSelector="B"
            x="0%"
            y="0%"
            width="100%"
            height="100%"
            result="displacementMap3"
          />
        </filter>
        <g>
          <image
            href={image}
            x="0"
            y="0"
            width="600"
            height="750"
            filter="url(#imgFilter)"
            preserveAspectRatio="xMidYMid slice"
          />
        </g>
      </svg>
      <div className="absolute bottom-[1.2em] left-[1em] tracking-[-0.5px] font-black text-[2.5rem] leading-[1.5em] first-line:text-[6rem]">
        {children}
      </div>
      {enableGyro && isGyroActive && (
        <div className="absolute top-2 right-2 px-2 py-1 bg-black/50 text-white text-xs rounded backdrop-blur-sm">
          Gyro Active
        </div>
      )}
    </div>
  );
};

export default DecayCard;