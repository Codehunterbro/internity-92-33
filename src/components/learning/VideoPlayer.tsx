
import React, { useEffect, useRef, useState } from 'react';
import YouTube, { YouTubeProps, YouTubeEvent } from 'react-youtube';

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
  const [youtubeReady, setYoutubeReady] = useState(false);

  console.log('VideoPlayer - lessonData:', lessonData);
  console.log('VideoPlayer - videoId:', lessonData?.videoId);

  const youtubeOpts: YouTubeProps['opts'] = {
    height: '450',
    width: '100%',
    playerVars: {
      controls: 1,
      showinfo: 1,
      rel: 0,
      modestbranding: 1,
      autoplay: 0,
      playsinline: 1,
      enablejsapi: 1
    }
  };

  const onPlayerReady = (event: YouTubeEvent) => {
    console.log('YouTube player ready');
    playerRef.current = event.target;
    setYoutubeReady(true);
  };

  const onPlayerStateChange = (event: YouTubeEvent) => {
    console.log('YouTube player state changed:', event.data);
  };

  if (!lessonData || !lessonData.videoType || !lessonData.videoId) {
    console.log('VideoPlayer - No video data available');
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center mb-6">
        <p className="text-gray-600">No video content available for this lesson.</p>
      </div>
    );
  }

  console.log('VideoPlayer - Rendering with videoId:', lessonData.videoId);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
      <div className="aspect-video bg-black">
        <YouTube 
          videoId={lessonData.videoId} 
          opts={youtubeOpts} 
          onReady={onPlayerReady} 
          onStateChange={onPlayerStateChange} 
          className="w-full h-full"
        />
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2">{lessonData.videoTitle}</h3>
        <p className="text-gray-600">{lessonData.videoDescription}</p>
      </div>
    </div>
  );
};

export default VideoPlayer;
