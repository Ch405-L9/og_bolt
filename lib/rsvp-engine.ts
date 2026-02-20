/**
 * RSVP Engine
 * Handles word-by-word display timing and animation logic
 */

export interface RSVPEngineConfig {
  speed: number; // Words per minute (200-1000)
  orpColor: string;
  onWordChange: (wordIndex: number, word: string) => void;
  onComplete: () => void;
}

export class RSVPEngine {
  private words: string[] = [];
  private currentIndex = 0;
  private isPlaying = false;
  private animationFrameId: number | null = null;
  private lastWordTime = 0;
  private config: RSVPEngineConfig;

  constructor(words: string[], config: RSVPEngineConfig) {
    this.words = words;
    this.config = config;
  }

  /**
   * Calculate milliseconds per word based on WPM
   */
  private getMillisecondsPerWord(): number {
    return (60 * 1000) / this.config.speed;
  }

  /**
   * Start or resume playback
   */
  play(): void {
    if (this.isPlaying) return;
    this.isPlaying = true;
    this.lastWordTime = Date.now();
    this.animate();
  }

  /**
   * Pause playback
   */
  pause(): void {
    this.isPlaying = false;
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  /**
   * Stop and reset
   */
  stop(): void {
    this.pause();
    this.currentIndex = 0;
    this.config.onWordChange(0, this.words[0] || '');
  }

  /**
   * Jump to specific word index
   */
  jumpToWord(index: number): void {
    this.currentIndex = Math.max(0, Math.min(index, this.words.length - 1));
    this.lastWordTime = Date.now();
    this.config.onWordChange(this.currentIndex, this.words[this.currentIndex] || '');
  }

  /**
   * Animation loop
   */
  private animate = (): void => {
    if (!this.isPlaying) return;

    const now = Date.now();
    const msPerWord = this.getMillisecondsPerWord();
    const elapsedMs = now - this.lastWordTime;

    if (elapsedMs >= msPerWord) {
      this.currentIndex++;

      if (this.currentIndex >= this.words.length) {
        this.currentIndex = this.words.length - 1;
        this.isPlaying = false;
        this.config.onComplete();
        return;
      }

      this.config.onWordChange(this.currentIndex, this.words[this.currentIndex]);
      this.lastWordTime = now;
    }

    this.animationFrameId = requestAnimationFrame(this.animate);
  };

  /**
   * Update speed and recalculate timing
   */
  setSpeed(speed: number): void {
    this.config.speed = Math.max(200, Math.min(1000, speed));
    this.lastWordTime = Date.now(); // Reset timing
  }

  /**
   * Get current state
   */
  getState() {
    return {
      currentIndex: this.currentIndex,
      totalWords: this.words.length,
      isPlaying: this.isPlaying,
      percentComplete: this.words.length > 0 ? (this.currentIndex / this.words.length) * 100 : 0,
      currentWord: this.words[this.currentIndex] || '',
    };
  }

  /**
   * Calculate ORP position for a word
   */
  static getORP(word: string): { before: string; highlight: string; after: string } {
    // ORP is typically at 1/3 into the word for optimal eye fixation
    const orpIndex = Math.ceil(word.length / 3);
    return {
      before: word.substring(0, orpIndex),
      highlight: word[orpIndex] || '',
      after: word.substring(orpIndex + 1),
    };
  }
}
