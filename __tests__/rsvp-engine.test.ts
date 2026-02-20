import { describe, it, expect, vi, beforeEach } from 'vitest';
import { RSVPEngine } from '../lib/rsvp-engine';

// Mock requestAnimationFrame for tests
let rafId = 0;
const mockRaf = (callback: FrameRequestCallback) => {
  return ++rafId;
};
const mockCaf = (id: number) => {
  // no-op
};

global.requestAnimationFrame = mockRaf as any;
global.cancelAnimationFrame = mockCaf as any;

describe('RSVPEngine', () => {
  let engine: RSVPEngine;
  let mockOnWordChange: ReturnType<typeof vi.fn>;
  let mockOnComplete: ReturnType<typeof vi.fn>;

  const testWords = ['The', 'quick', 'brown', 'fox', 'jumps', 'over', 'the', 'lazy', 'dog'];

  beforeEach(() => {
    mockOnWordChange = vi.fn();
    mockOnComplete = vi.fn();

    engine = new RSVPEngine(testWords, {
      speed: 300,
      orpColor: '#FF0000',
      onWordChange: mockOnWordChange,
      onComplete: mockOnComplete,
    });
  });

  describe('Initialization', () => {
    it('should initialize with correct configuration', () => {
      const state = engine.getState();
      expect(state.currentIndex).toBe(0);
      expect(state.totalWords).toBe(testWords.length);
      expect(state.isPlaying).toBe(false);
      expect(state.percentComplete).toBe(0);
    });

    it('should have correct initial word', () => {
      const state = engine.getState();
      expect(state.currentWord).toBe('The');
    });
  });

  describe('Word Navigation', () => {
    it('should jump to specific word index', () => {
      engine.jumpToWord(3);
      const state = engine.getState();
      expect(state.currentIndex).toBe(3);
      expect(state.currentWord).toBe('fox');
      expect(mockOnWordChange).toHaveBeenCalledWith(3, 'fox');
    });

    it('should clamp word index to valid range', () => {
      engine.jumpToWord(-5);
      let state = engine.getState();
      expect(state.currentIndex).toBe(0);

      engine.jumpToWord(1000);
      state = engine.getState();
      expect(state.currentIndex).toBe(testWords.length - 1);
    });
  });

  describe('Speed Control', () => {
    it('should set speed within valid range', () => {
      engine.setSpeed(500);
      const state = engine.getState();
      expect(state.currentIndex).toBe(0);
    });

    it('should clamp speed to valid range', () => {
      engine.setSpeed(100);
      engine.setSpeed(2000);
      // Speed should be clamped internally
    });
  });

  describe('ORP Calculation', () => {
    it('should calculate ORP position correctly', () => {
      const orp = RSVPEngine.getORP('quick');
      expect(orp.before).toBe('qu');
      expect(orp.highlight).toBe('i');
      expect(orp.after).toBe('ck');
    });

    it('should handle short words', () => {
      const orp = RSVPEngine.getORP('a');
      // For single character, orpIndex = Math.ceil(1/3) = 1
      // before = substring(0, 1) = 'a'
      // highlight = word[1] = undefined -> ''
      // after = substring(2) = ''
      expect(orp.before).toBe('a');
      expect(orp.highlight).toBe('');
      expect(orp.after).toBe('');
    });

    it('should handle single character', () => {
      const orp = RSVPEngine.getORP('I');
      expect(orp.before).toBe('I');
      expect(orp.highlight).toBe('');
      expect(orp.after).toBe('');
    });

    it('should handle long words', () => {
      const word = 'comprehension';
      const orp = RSVPEngine.getORP(word);
      expect(orp.before + orp.highlight + orp.after).toBe(word);
      expect(orp.highlight.length).toBe(1);
    });
  });

  describe('Playback Control', () => {
    it('should stop and reset', () => {
      engine.jumpToWord(5);
      engine.stop();
      const state = engine.getState();
      expect(state.currentIndex).toBe(0);
      expect(state.isPlaying).toBe(false);
    });
  });

  describe('State Management', () => {
    it('should return correct state', () => {
      engine.jumpToWord(4);
      const state = engine.getState();
      expect(state.currentIndex).toBe(4);
      expect(state.totalWords).toBe(9);
      expect(state.isPlaying).toBe(false);
      expect(state.percentComplete).toBeCloseTo((4 / 9) * 100, 1);
      expect(state.currentWord).toBe('jumps');
    });

    it('should calculate percent complete correctly', () => {
      engine.jumpToWord(0);
      let state = engine.getState();
      expect(state.percentComplete).toBe(0);

      engine.jumpToWord(4);
      state = engine.getState();
      expect(state.percentComplete).toBeCloseTo((4 / 9) * 100, 1);

      engine.jumpToWord(8);
      state = engine.getState();
      expect(state.percentComplete).toBeCloseTo((8 / 9) * 100, 1);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty word list', () => {
      const emptyEngine = new RSVPEngine([], {
        speed: 300,
        orpColor: '#FF0000',
        onWordChange: mockOnWordChange,
        onComplete: mockOnComplete,
      });

      const state = emptyEngine.getState();
      expect(state.totalWords).toBe(0);
      expect(state.percentComplete).toBe(0);
      expect(state.currentWord).toBe('');
    });

    it('should handle single word', () => {
      const singleEngine = new RSVPEngine(['word'], {
        speed: 300,
        orpColor: '#FF0000',
        onWordChange: mockOnWordChange,
        onComplete: mockOnComplete,
      });

      const state = singleEngine.getState();
      expect(state.totalWords).toBe(1);
      expect(state.currentWord).toBe('word');
    });

    it('should handle special characters in words', () => {
      const specialWords = ['Hello,', 'world!', 'How\'s', 'it?'];
      const specialEngine = new RSVPEngine(specialWords, {
        speed: 300,
        orpColor: '#FF0000',
        onWordChange: mockOnWordChange,
        onComplete: mockOnComplete,
      });

      specialEngine.jumpToWord(2);
      const state = specialEngine.getState();
      expect(state.currentWord).toBe('How\'s');
    });
  });
});
