// src/components/TiltWrapper.tsx

import React, { useRef, useState, useEffect, CSSProperties } from 'react';

interface TiltWrapperProps {
  children: React.ReactNode;
  className?: string;
  perspective?: number;
  maxTilt?: number;
  scale?: number;
  transitionSpeed?: number;
  easing?: string;
  gyroscope?: boolean;
  reset?: boolean;
  alwaysActive?: boolean;
  hoverScaleEffect?: boolean;
  showReflection?: boolean;
  reflectionHeight?: string;
  reflectionOpacity?: number;
  reflectionBlur?: string;
  reflectionGap?: string;
}

const TiltWrapper: React.FC<TiltWrapperProps> = ({
  children,
  className = '',
  perspective = 1000,
  maxTilt = 15,
  scale = 1.05,
  transitionSpeed = 400,
  easing = 'cubic-bezier(0.23, 1, 0.32, 1)',
  gyroscope = false,
  reset = true,
  alwaysActive = true,
  hoverScaleEffect = false,
  showReflection = false,
  reflectionHeight = '20%',
  reflectionOpacity = 0.4,
  reflectionBlur = 'blur-md',
  reflectionGap = 'mt-2',
}) => {
  const tiltRef = useRef<HTMLDivElement>(null);
  const [tiltStyle, setTiltStyle] = useState<CSSProperties>({
    transform: `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)`,
    transition: `transform ${transitionSpeed}ms ${easing}`,
  });
  const [isHovering, setIsHovering] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const fadeDuration = Math.max(300, transitionSpeed);
  const applyTilt = (rotateX: number, rotateY: number) => {
    const effectiveScale = hoverScaleEffect && isHovering ? scale * 1.05 : scale;
    setTiltStyle({
      transform: `perspective(${perspective}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(${effectiveScale},${effectiveScale},${effectiveScale})`,
      transition: `transform ${transitionSpeed}ms ${easing}`,
    });
  };

  useEffect(() => {
    if (!alwaysActive && !isHovering) return;
    const handleMouseMove = (e: MouseEvent) => {
      if (!tiltRef.current) return;

      const el = tiltRef.current;
      const rect = el.getBoundingClientRect();

      if (alwaysActive) {
        const dx = (e.clientX - (rect.left + rect.width / 2)) / (window.innerWidth / 2);
        const dy = (e.clientY - (rect.top + rect.height / 2)) / (window.innerHeight / 2);
        applyTilt(-dy * maxTilt, dx * maxTilt);
      } else {
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const rotateY = maxTilt * ((x - rect.width / 2) / (rect.width / 2));
        const rotateX = -maxTilt * ((y - rect.height / 2) / (rect.height / 2));
        applyTilt(rotateX, rotateY);
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, [alwaysActive, isHovering, maxTilt, perspective, scale, transitionSpeed, easing, hoverScaleEffect]);

  useEffect(() => {
    if (!gyroscope) return;
    const handleDeviceOrientation = (e: DeviceOrientationEvent) => {
      if (!tiltRef.current || e.beta == null || e.gamma == null) return;
      const beta = Math.max(-maxTilt, Math.min(maxTilt, e.beta / 3));
      const gamma = Math.max(-maxTilt, Math.min(maxTilt, e.gamma / 3));
      applyTilt(beta, gamma);
    };

    window.addEventListener('deviceorientation', handleDeviceOrientation);
    return () => window.removeEventListener('deviceorientation', handleDeviceOrientation);
  }, [gyroscope, maxTilt, perspective, scale, easing, hoverScaleEffect]);

  const handleMouseEnter = () => setIsHovering(true);
  const handleMouseLeave = () => {
    setIsHovering(false);
    if (reset && !alwaysActive) {
      setTiltStyle({
        transform: `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)`,
        transition: `transform ${transitionSpeed}ms ${easing}`,
      });
    }
  };

  const childElement = React.Children.only(children) as React.ReactElement<any>;

  const isMediaElement = typeof childElement.type === 'string' && (childElement.type === 'img' || childElement.type === 'video');

  const markLoaded = () => setIsLoaded(true);

  const makeLoadHandler = (existing?: (...args: any[]) => void) => (e?: any) => {
    try {
      if (existing) existing(e);
    } catch (err) {
    }
    markLoaded();
  };

  const childWithLoad = React.cloneElement(childElement, {
    ...childElement.props,
    onLoad: makeLoadHandler(childElement.props.onLoad),
    onLoadedData: makeLoadHandler(childElement.props.onLoadedData),
    onLoadedMetadata: makeLoadHandler(childElement.props.onLoadedMetadata),
    onCanPlayThrough: makeLoadHandler(childElement.props.onCanPlayThrough),
    style: {
      ...(childElement.props.style || {}),
      transition: `opacity ${fadeDuration}ms ${easing}, filter ${fadeDuration}ms ${easing}`,
      opacity: isLoaded ? 1 : 0,
      filter: isLoaded ? 'none' : 'blur(6px) saturate(.95) brightness(.98)'
    }
  });

  useEffect(() => {
    if (!isMediaElement) setIsLoaded(true);
  }, [isMediaElement]);

  // Media children fill the container width, so their box size comes from CSS
  // (w-full plus an aspect ratio or width/height attributes on the media), not
  // from JS measurement. Never measure with getBoundingClientRect here: it
  // includes the tilt/scale transform.
  const containerClass = isMediaElement ? 'relative block w-full' : 'relative inline-block';

  return (
    <div
      ref={tiltRef}
      style={tiltStyle}
      className={`tilt-wrapper ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className={containerClass}>
        {!isLoaded && (
          <div
            className="absolute inset-0 z-10 rounded-2xl overflow-hidden bg-white/10 animate-pulse"
            aria-hidden="true"
          />
        )}

        {childWithLoad}

        {showReflection && (
          <div
            className={`absolute top-full left-0 ${reflectionGap} w-full overflow-hidden rounded-2xl reflection-mask`}
            style={{
              height: reflectionHeight,
              opacity: reflectionOpacity,
            }}
          >
            {!isLoaded ? (
              <div
                className={`w-full h-full transform scale-y-[-1] ${reflectionBlur} pointer-events-none bg-white/10 animate-pulse`}
                style={{
                  transformOrigin: 'top',
                }}
                aria-hidden="true"
              />
            ) : (
              React.cloneElement(childWithLoad, {
                ...childWithLoad.props,
                style: {
                  ...(childWithLoad.props.style || {}),
                  transform: `${(childWithLoad.props.style && childWithLoad.props.style.transform) || ''} scaleY(-1)`,
                  opacity: (childWithLoad.props.style && (childWithLoad.props.style.opacity as number)) ? (childWithLoad.props.style.opacity as number) * 0.85 : 0.85,
                  pointerEvents: 'none'
                },
                className: `
                  ${childWithLoad.props.className || ''}
                  w-full h-full
                  object-cover object-bottom
                  ${reflectionBlur}
                  pointer-events-none
                `.trim()
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TiltWrapper;