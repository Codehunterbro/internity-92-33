import { useEffect, useRef, useState } from 'react';

interface BackgroundVideoProps {
  src?: string;
  fallbackImageSrc?: string;
}

const BackgroundVideo = ({ src, fallbackImageSrc }: BackgroundVideoProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoError, setVideoError] = useState(false);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (videoElement && src) {
      const handleError = () => setVideoError(true);

      const handleCanPlay = async () => {
        try {
          await videoElement.play();
        } catch (error) {
          console.error("Video autoplay failed:", error);
          setVideoError(true);
        }
      };

      // Add event listeners
      videoElement.addEventListener('canplay', handleCanPlay);
      videoElement.addEventListener('error', handleError);

      // Cleanup
      return () => {
        videoElement.removeEventListener('canplay', handleCanPlay);
        videoElement.removeEventListener('error', handleError);
      };
    }
  }, [src]);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden -z-10">
      {/* Background image (used as fallback) */}
      {(fallbackImageSrc && (videoError || !src)) && (
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: `url(${fallbackImageSrc})`, 
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
      )}
      
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-black bg-opacity-40 z-[1]"></div>
      
      {/* Video element (conditionally rendered) */}
      {src && !videoError && (
        <video
          ref={videoRef}
          className="absolute object-cover w-full h-full"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        >
          <source src={src} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}
    </div>
  );
};

export default BackgroundVideo;