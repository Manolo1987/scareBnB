import React, { useState, useEffect, useRef } from 'react';
import styles from './SoundAndFog.module.css';
import {
  Cloud,
  CloudSlash,
  MusicNotes,
  SpeakerSimpleSlash,
} from '@phosphor-icons/react';
import bgAtmo from '../../../assets/audio/horror-background-ambient-256309.mp3';

export default function SoundAndFog() {
  const [isFogActive, setIsFogActive] = useState(true);
  const [isSoundActive, setIsSoundActive] = useState(false);
  const audioRef = useRef(null);

  const toggleFog = () => {
    setIsFogActive((prevState) => !prevState);
  };

  const toggleSound = () => {
    if (audioRef.current) {
      if (audioRef.current.paused) {
        audioRef.current.play();
        setIsSoundActive(true);
      } else {
        audioRef.current.pause();
        setIsSoundActive(false);
      }
    }
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.05;
    }
  }, []);

  return (
    <>
      <div
        className={`${styles.fogOverlay} ${
          isFogActive ? styles.active : styles.inactive
        }`}
      >
        <div className={styles.fogLayer1}></div>
        <div className={styles.fogLayer2}></div>
        <div className={styles.fogLayer3}></div>
      </div>

      <audio ref={audioRef} src={bgAtmo} loop />

      <button
        onClick={toggleFog}
        className={`${styles.toggleButton} ${styles.forFog}`}
        aria-label={isFogActive ? 'Nebel deaktivieren' : 'Nebel aktivieren'}
        title={isFogActive ? 'Nebel deaktivieren' : 'Nebel aktivieren'}
      >
        {isFogActive ? <CloudSlash size={26} /> : <Cloud size={26} />}
      </button>

      <button
        onClick={toggleSound}
        className={`${styles.toggleButton} ${styles.forSound}`}
        aria-label={isSoundActive ? 'Sound deaktivieren' : 'Sound aktivieren'}
        title={isSoundActive ? 'Sound deaktivieren' : 'Sound aktivieren'}
      >
        {isSoundActive ? (
          <SpeakerSimpleSlash size={26} />
        ) : (
          <MusicNotes size={26} />
        )}
      </button>
    </>
  );
}
