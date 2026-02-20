package com.badgr.rsvpreader

import kotlinx.coroutines.*
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow

/**
 * BADGR RSVP Engine
 * Implements Rapid Serial Visual Presentation with Optimal Recognition Point (ORP)
 */
class RSVPEngine {
    // Text data
    private var words: List<String> = emptyList()
    private var currentIndex = 0

    // Timing
    private var wpm = 300
    private var isPlaying = false
    private var playbackJob: Job? = null

    // Settings
    var punctuationDelayEnabled: Boolean = true
    var wpmIncrement: Int = 50
    var speedIncrement: Int = 25

    // State flows for UI updates
    private val _currentWord = MutableStateFlow("")
    val currentWord: StateFlow<String> = _currentWord.asStateFlow()

    private val _orpIndex = MutableStateFlow(0)
    val orpIndex: StateFlow<Int> = _orpIndex.asStateFlow()

    private val _progress = MutableStateFlow(0f)
    val progress: StateFlow<Float> = _progress.asStateFlow()

    private val _wordCount = MutableStateFlow("0 / 0")
    val wordCount: StateFlow<String> = _wordCount.asStateFlow()

    private val _isPlayingState = MutableStateFlow(false)
    val isPlayingState: StateFlow<Boolean> = _isPlayingState.asStateFlow()

    /**
     * Load text into the engine
     */
    fun loadText(text: String) {
        // Tokenize and clean
        words = text.split(Regex("\\s+"))
            .map { it.trim() }
            .filter { it.isNotEmpty() }

        currentIndex = 0
        updateDisplay()
    }

    /**
     * Calculate Optimal Recognition Point (ORP) index based on word length
     */
    private fun calculateOrpIndex(word: String): Int {
        val cleanWord = word.filter { it.isLetterOrDigit() }
        if (cleanWord.isEmpty()) return 0

        return when (cleanWord.length) {
            in 1..2 -> 0
            in 3..5 -> 1
            in 6..9 -> 2
            in 10..13 -> 3
            else -> 4
        }
    }

    /**
     * Update display with current word
     */
    private fun updateDisplay() {
        if (words.isEmpty()) {
            _currentWord.value = ""
            _orpIndex.value = 0
            _progress.value = 0f
            _wordCount.value = "0 / 0"
            return
        }

        val word = words.getOrNull(currentIndex) ?: ""
        _currentWord.value = word
        _orpIndex.value = calculateOrpIndex(word)
        _progress.value = if (words.isNotEmpty()) currentIndex.toFloat() / words.size else 0f
        _wordCount.value = "${currentIndex + 1} / ${words.size}"
    }

    /**
     * Start playback
     */
    fun play(scope: CoroutineScope) {
        if (isPlaying || words.isEmpty()) return

        isPlaying = true
        _isPlayingState.value = true

        playbackJob = scope.launch {
            while (isPlaying && currentIndex < words.size) {
                updateDisplay()
                val delayTime = calculateDelay(words[currentIndex])
                delay(delayTime)
                currentIndex++
            }

            // Reached end
            if (currentIndex >= words.size) {
                currentIndex = words.size - 1
                updateDisplay()
                pause()
            }
        }
    }

    /**
     * Pause playback
     */
    fun pause() {
        isPlaying = false
        _isPlayingState.value = false
        playbackJob?.cancel()
        playbackJob = null
    }

    /**
     * Reset to beginning
     */
    fun reset() {
        pause()
        currentIndex = 0
        updateDisplay()
    }

    /**
     * Jump backward by count words
     */
    fun jumpBackward(count: Int = 10) {
        currentIndex = (currentIndex - count).coerceAtLeast(0)
        updateDisplay()
    }

    /**
     * Jump forward by count words
     */
    fun jumpForward(count: Int = 10) {
        currentIndex = (currentIndex + count).coerceAtMost(words.size - 1)
        updateDisplay()
    }

    /**
     * Set reading speed (WPM)
     */
    fun setWpm(newWpm: Int) {
        wpm = newWpm.coerceIn(100, 1500)
    }

    /**
     * Get current WPM
     */
    fun getWpm(): Int = wpm

    /**
     * Calculate delay in milliseconds based on WPM and punctuation
     */
    private fun calculateDelay(word: String): Long {
        var baseDelay = (60_000 / wpm).toLong()

        if (punctuationDelayEnabled) {
            if (word.endsWith(".") || word.endsWith("!") || word.endsWith("?")) {
                baseDelay *= 2
            } else if (word.endsWith(",") || word.endsWith(";") || word.endsWith(":")) {
                baseDelay = (baseDelay * 1.5).toLong()
            }
        }

        return baseDelay
    }

    /**
     * Get total word count
     */
    fun getTotalWords(): Int = words.size

    /**
     * Get current word index
     */
    fun getCurrentIndex(): Int = currentIndex

    /**
     * Check if engine is playing
     */
    fun isPlaying(): Boolean = isPlaying
}

