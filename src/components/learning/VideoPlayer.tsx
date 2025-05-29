import React, { useEffect, useRef, useState, CSSProperties } from 'react';
import YouTube, { YouTubeProps, YouTubeEvent } from 'react-youtube';
import { FileText, Download, Volume2, Volume1, VolumeX, Maximize, Minimize, Play, Pause } from 'lucide-react';

export interface LessonVideoContent {
  title: string;
  subtitle: string;
  videoType: 'youtube' | null;
  videoId: string | null;
  videoTitle: string;
  videoDescription: string;
  resources: {
    name: string;
    type: string;
    size: string;
  }[];
}

interface VideoPlayerProps {
  lessonData: LessonVideoContent | null;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ lessonData }) => {
  const playerRef = useRef<any>(null);
  const playerContainerRef = useRef<HTMLDivElement>(null);
  const progressIntervalRef = useRef<number | null>(null);
  const hideControlsTimerRef = useRef<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(100);
  const [isProgressDragging, setIsProgressDragging] = useState(false);
  const [youtubeReady, setYoutubeReady] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [overlayVisible, setOverlayVisible] = useState(true);
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPos, setTooltipPos] = useState(0);
  const [tooltipTime, setTooltipTime] = useState('0:00');

  console.log('VideoPlayer - lessonData:', lessonData);
  console.log('VideoPlayer - videoId:', lessonData?.videoId);

  const styles: {
    videoSection: CSSProperties;
    videoContainer: CSSProperties;
    videoPlayer: CSSProperties;
  } = {
    videoSection: {
      background: 'white',
      borderRadius: '15px',
      overflow: 'hidden',
      boxShadow: '0 5px 15px rgba(0,0,0,0.05)'
    },
    videoContainer: {
      position: 'relative',
      background: '#000',
      aspectRatio: '16 / 9',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    videoPlayer: {
      width: '100%',
      height: '122%',
      position: 'relative'
    }
  };

  const youtubeOpts: YouTubeProps['opts'] = {
    height: '100%',
    width: '100%',
    playerVars: {
      controls: 0,
      showinfo: 0,
      rel: 0,
      iv_load_policy: 3,
      modestbranding: 1,
      disablekb: 1,
      fs: 0,
      autoplay: 0,
      playsinline: 1,
      enablejsapi: 1,
      origin: window.location.origin
    }
  };

  const onPlayerReady = (event: YouTubeEvent) => {
    console.log('YouTube player ready');
    playerRef.current = event.target;
    setDuration(event.target.getDuration());
    setYoutubeReady(true);
    updateProgressBar();
  };

  const onPlayerStateChange = (event: YouTubeEvent) => {
    console.log('YouTube player state changed:', event.data);
    if (event.data === 1) {
      setIsPlaying(true);
    } else if (event.data === 2 || event.data === 0) {
      setIsPlaying(false);
    }
  };

  const updateProgressBar = () => {
    if (progressIntervalRef.current) {
      window.clearInterval(progressIntervalRef.current);
    }
    progressIntervalRef.current = window.setInterval(() => {
      if (playerRef.current && !isProgressDragging && youtubeReady) {
        const currentTime = playerRef.current.getCurrentTime();
        const duration = playerRef.current.getDuration();
        setCurrentTime(currentTime);
        if (duration > 0) {
          const progress = currentTime / duration * 100;
          setProgress(progress);
        }
      }
    }, 100);
  };

  const startHideControlsTimer = () => {
    if (hideControlsTimerRef.current) {
      window.clearTimeout(hideControlsTimerRef.current);
    }
    hideControlsTimerRef.current = window.setTimeout(() => {
      if (isPlaying) {
        setControlsVisible(false);
      }
    }, 3000);
  };

  const handleMouseMove = () => {
    setControlsVisible(true);
    startHideControlsTimer();
  };

  useEffect(() => {
    if (controlsVisible && isPlaying) {
      startHideControlsTimer();
    }
  }, [controlsVisible, isPlaying]);

  useEffect(() => {
    if (isPlaying) {
      setOverlayVisible(false);
      startHideControlsTimer();
    } else {
      setOverlayVisible(true);
      setControlsVisible(true);
      if (hideControlsTimerRef.current) {
        window.clearTimeout(hideControlsTimerRef.current);
      }
    }
  }, [isPlaying]);

  useEffect(() => {
    return () => {
      if (progressIntervalRef.current) {
        window.clearInterval(progressIntervalRef.current);
      }
      if (hideControlsTimerRef.current) {
        window.clearTimeout(hideControlsTimerRef.current);
      }
    };
  }, []);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const togglePlayPause = () => {
    if (playerRef.current && youtubeReady) {
      if (isPlaying) {
        playerRef.current.pauseVideo();
      } else {
        playerRef.current.playVideo();
      }
    }
  };

  const toggleFullscreen = () => {
    const videoContainer = playerContainerRef.current?.closest('.video-container');
    if (videoContainer) {
      if (!document.fullscreenElement) {
        videoContainer.requestFullscreen();
        setIsFullscreen(true);
      } else {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  const toggleMute = () => {
    if (playerRef.current && youtubeReady) {
      if (isMuted) {
        playerRef.current.unMute();
        setVolume(playerRef.current.getVolume());
      } else {
        playerRef.current.mute();
        setVolume(0);
      }
      setIsMuted(!isMuted);
    }
  };

  const seekToPosition = (position: number) => {
    if (playerRef.current && youtubeReady) {
      const targetTime = position / 100 * duration;
      playerRef.current.seekTo(targetTime, true);
      if (!isPlaying) {
        setCurrentTime(targetTime);
        setProgress(position);
      }
    }
  };

  const adjustVolume = (vol: number) => {
    if (playerRef.current && youtubeReady) {
      playerRef.current.setVolume(vol);
      setVolume(vol);
      if (vol === 0) {
        setIsMuted(true);
      } else if (isMuted) {
        setIsMuted(false);
        playerRef.current.unMute();
      }
    }
  };

  const handleProgressMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (duration) {
      const container = e.currentTarget;
      const rect = container.getBoundingClientRect();
      const position = Math.max(0, Math.min(100, (e.clientX - rect.left) / rect.width * 100));
      setTooltipPos(position);
      setTooltipTime(formatTime(position / 100 * duration));
      setShowTooltip(true);
      if (isProgressDragging) {
        setProgress(position);
      }
    }
  };

  const handleProgressMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const rect = container.getBoundingClientRect();
    const position = Math.max(0, Math.min(100, (e.clientX - rect.left) / rect.width * 100));
    setIsProgressDragging(true);
    setProgress(position);
  };

  const handleProgressMouseUp = () => {
    if (isProgressDragging) {
      seekToPosition(progress);
      setIsProgressDragging(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mouseup', handleProgressMouseUp);
    return () => {
      document.removeEventListener('mouseup', handleProgressMouseUp);
    };
  }, [isProgressDragging, progress]);

  if (!lessonData || !lessonData.videoType || !lessonData.videoId) {
    console.log('VideoPlayer - No video data available');
    return (
      <div className="flex flex-col gap-6 w-full">
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-gray-600">No video content available for this lesson.</p>
        </div>
      </div>
    );
  }

  console.log('VideoPlayer - Rendering with videoId:', lessonData.videoId);

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-0 w-full" style={styles.videoSection}>
        <div className="video-section">
          <div 
            className="relative aspect-video bg-black video-container overflow-hidden" 
            onMouseMove={handleMouseMove} 
            style={styles.videoContainer}
          >
            <div ref={playerContainerRef} className="w-full h-full overflow-hidden" style={styles.videoPlayer}>
              <div className="youtube-container">
                <YouTube 
                  videoId={lessonData.videoId} 
                  opts={youtubeOpts} 
                  onReady={onPlayerReady} 
                  onStateChange={onPlayerStateChange} 
                  className="absolute" 
                  iframeClassName="absolute" 
                  style={{
                    position: 'absolute',
                    top: '0',
                    left: '0',
                    width: '100%',
                    height: '100%'
                  }} 
                />
              </div>
            </div>
            
            <div className="absolute inset-0 z-10" onClick={togglePlayPause} />
            
            {overlayVisible && (
              <div className="absolute inset-0 flex items-center justify-center z-20" onClick={togglePlayPause}>
                <button className="w-20 h-20 bg-black/60 hover:bg-black/90 rounded-full flex items-center justify-center transition-colors">
                  {isPlaying ? <Pause className="w-12 h-12 text-white" /> : <Play className="w-12 h-12 text-white ml-2" />}
                </button>
              </div>
            )}
            
            <div className={`absolute bottom-0 left-0 right-0 custom-controls z-20 transition-opacity duration-300 ${controlsVisible ? 'opacity-100' : 'opacity-0'}`}>
              <div 
                className="progress-container relative h-2 bg-white/30 rounded-full cursor-pointer mb-2" 
                onMouseMove={handleProgressMouseMove} 
                onMouseDown={handleProgressMouseDown} 
                onMouseLeave={() => setShowTooltip(false)}
              >
                <div className="progress-bar h-full bg-red-600 rounded-full" style={{ width: `${progress}%` }} />
                {showTooltip && (
                  <div 
                    className="progress-tooltip absolute -top-8 bg-black/80 text-white text-xs py-1 px-2 rounded transform -translate-x-1/2" 
                    style={{ left: `${tooltipPos}%` }}
                  >
                    {tooltipTime}
                  </div>
                )}
              </div>
              
              <div className="controls-container flex items-center gap-4 pb-2 px-4">
                <button onClick={togglePlayPause} className="control-button bg-transparent border-none text-white cursor-pointer p-2 rounded-full hover:bg-white/10">
                  {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                </button>
                
                <div className="volume-container flex items-center group">
                  <button onClick={toggleMute} className="control-button bg-transparent border-none text-white cursor-pointer p-2 rounded-full hover:bg-white/10">
                    {isMuted || volume === 0 ? <VolumeX className="h-5 w-5" /> : volume < 50 ? <Volume1 className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                  </button>
                  
                  <div className="volume-slider hidden group-hover:block w-20 h-1 bg-white/30 rounded cursor-pointer ml-2" onClick={e => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const newVolume = Math.max(0, Math.min(100, (e.clientX - rect.left) / rect.width * 100));
                    adjustVolume(newVolume);
                  }}>
                    <div className="volume-level h-full bg-white rounded" style={{ width: `${volume}%` }} />
                  </div>
                </div>
                
                <div className="time-display font-mono text-white text-sm">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </div>
                
                <div className="flex-1" />
                
                <button onClick={toggleFullscreen} className="control-button bg-transparent border-none text-white cursor-pointer p-2 rounded-full hover:bg-white/10">
                  {isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
                </button>
              </div>
            </div>
          </div>
          
          <div className="p-6 video-info">
            <h3 className="text-xl font-semibold mb-2 video-title">{lessonData.videoTitle}</h3>
            <p className="text-gray-600 video-description">{lessonData.videoDescription}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
