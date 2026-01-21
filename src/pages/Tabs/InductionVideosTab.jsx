import React, { useState, useEffect } from 'react';
import YouTube from 'react-youtube';

const InductionVideosTab = ({ cleaner }) => {
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [player, setPlayer] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // List of induction videos (you can add more as needed)
  const inductionVideos = [
    {
      id: 'QoBw-uEVZGg',
      title: 'Wally Cleaning Company - Full Induction Guide',
      description: 'Complete guide to Wally Cleaning Company induction process and procedures',
      duration: '15:30',
      uploadDate: '2024-01-15',
      category: 'General Induction'
    },
    {
      id: 'dQw4w9WgXcQ', 
      title: 'Cleaning Equipment Usage and Maintenance',
      description: 'Proper use and maintenance of cleaning equipment and supplies',
      duration: '18:20',
      uploadDate: '2024-01-25',
      category: 'Equipment'
    },
    {
      id: 'CN1DGd-c3IA', 
      title: 'AEC Induction Video',
      description: 'Tips for managing your time effectively and working efficiently',
      duration: '4:52',
      uploadDate: '2024-02-10',
      category: 'Productivity'
    }
  ];

  // Filter videos based on search term
  const filteredVideos = inductionVideos.filter(video => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      video.title.toLowerCase().includes(searchLower) ||
      video.description.toLowerCase().includes(searchLower) ||
      video.category.toLowerCase().includes(searchLower)
    );
  });

  // Set default selected video on component mount
  useEffect(() => {
    if (inductionVideos.length > 0 && !selectedVideo) {
      setSelectedVideo(inductionVideos[0]);
    }
  }, []);

  // YouTube player options
  const playerOptions = {
    height: '400',
    width: '100%',
    playerVars: {
      autoplay: 0,
      rel: 0,
      modestbranding: 1,
      showinfo: 0,
      controls: 1,
      iv_load_policy: 3,
      fs: 1,
      enablejsapi: 1
    },
  };

  const onPlayerReady = (event) => {
    setPlayer(event.target);
  };

  const handleVideoSelect = (video) => {
    setSelectedVideo(video);
    // If player exists, load new video
    if (player) {
      player.loadVideoById(video.id);
    }
  };

  const formatDuration = (duration) => {
    if (!duration) return 'N/A';
    return duration;
  };

  return (
    <div className="induction-videos-tab">
      <h2 className="section-title">Induction Videos</h2>
      <p className="section-description">
        Watch training videos to enhance your skills and knowledge. Click any video to play.
      </p>

      {/* Search Bar */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search videos by title, description, or category..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      <div className="videos-container">
        {/* Main Video Player */}
        <div className="video-player-section">
          <div className="video-player-card">
            <div className="video-player-wrapper">
              {selectedVideo ? (
                <>
                  <YouTube
                    videoId={selectedVideo.id}
                    opts={playerOptions}
                    onReady={onPlayerReady}
                    className="youtube-player"
                  />
                  <div className="video-info">
                    <h3 className="video-title">{selectedVideo.title}</h3>
                    <div className="video-meta">
                      <span className="video-views">{formatDuration(selectedVideo.duration)}</span>
                      <span className="video-upload-date">
                        Uploaded: {new Date(selectedVideo.uploadDate).toLocaleDateString()}
                      </span>
                      <span className="video-category">{selectedVideo.category}</span>
                    </div>
                    <p className="video-description">{selectedVideo.description}</p>
                  </div>
                </>
              ) : (
                <div className="no-video-selected">
                  <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <p>Select a video to start playing</p>
                </div>
              )}
            </div>
          </div>

          {/* Video Playlist */}
          <div className="video-playlist">
            <h3 className="playlist-title">All Videos ({filteredVideos.length})</h3>
            <div className="playlist-videos">
              {filteredVideos.map((video, index) => (
                <div
                  key={video.id}
                  className={`playlist-item ${selectedVideo?.id === video.id ? 'active' : ''}`}
                  onClick={() => handleVideoSelect(video)}
                >
                  <div className="video-thumbnail">
                    <img
                      src={`https://img.youtube.com/vi/${video.id}/hqdefault.jpg`}
                      alt={video.title}
                      className="thumbnail-image"
                    />
                    <div className="video-duration">{formatDuration(video.duration)}</div>
                  </div>
                  <div className="video-details">
                    <h4 className="video-title-small">{video.title}</h4>
                    <p className="video-description-small">{video.description}</p>
                    <div className="video-meta-small">
                      <span className="video-category-small">{video.category}</span>
                      <span className="video-date-small">
                        {new Date(video.uploadDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InductionVideosTab;