import React, { useState, useRef } from 'react';
import ReactPlayer from 'react-player';

interface VideoPlayerProps {
    url: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ url }) => {
    return (
        <div className="video-container">
            <video controls>
                <source src={url} type="video/mp4"/>
                Your browser does not support the video tag.
            </video>
        </div>
    );
};

export default VideoPlayer;
