import React, { useState, useRef } from 'react';
import ReactPlayer from 'react-player';

interface VideoPlayerProps {
    url: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ url }) => {
    const [playing, setPlaying] = useState(false);
    const [volume, setVolume] = useState(0.8);
    const [played, setPlayed] = useState(0);
    const playerRef = useRef<ReactPlayer>(null);

    const handlePlayPause = () => {
        setPlaying(!playing);
    };

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setVolume(parseFloat(e.target.value));
    };

    const handleProgress = (state: { played: number }) => {
        setPlayed(state.played);
    };

    const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const time = parseFloat(e.target.value);
        setPlayed(time);
        if (playerRef.current) {
            playerRef.current.seekTo(time);
        }
    };

    return (
        <div className="video-player">
            <ReactPlayer
                ref={playerRef}
                url={url}
                playing={playing}
                volume={volume}
                onProgress={handleProgress}
                width="100%"
                height="auto"
            />
            <div className="controls">
                <button onClick={handlePlayPause}>{playing ? 'Pause' : 'Play'}</button>
                <input
                    type="range"
                    min={0}
                    max={1}
                    step="any"
                    value={volume}
                    onChange={handleVolumeChange}
                />
                <input
                    type="range"
                    min={0}
                    max={1}
                    step="any"
                    value={played}
                    onChange={handleSeekChange}
                />
            </div>
        </div>
    );
};

export default VideoPlayer;
