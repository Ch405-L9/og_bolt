## BADGR RSVP Reader – Technical Documentation
**Version:** 1.0.0 (Production)
**Maintained By:** BADGR Technologies LLC Workflow Engineering Team
**Date:** February 12, 2026

---

#### 1. Architecture Overview
The **ReaderRSVP** application is built on a modern reactive stack, utilizing **Jetpack Compose** for the UI layer and **Kotlin Coroutines** for high-precision timing logic. The architecture follows a strict separation of concerns via the **MVVM** pattern.



###### Core Components
| Component | Responsibility |
|:---|:---|
| **MainActivity.kt** | Entry point; hosts the Jetpack Compose UI and manages the lifecycle of the `RSVPEngine`. |
| **RSVPReaderScreen** | High-level Composable containing the Word Display, Progress telemetry, and Control interfaces. |
| **RSVPEngine.kt** | The "Brain." Handles text tokenization, ORP calculation, timing loops, and state management. |

---

#### 2. Data Flow & Execution Logic
The system utilizes a unidirectional data flow to ensure UI consistency and predictable playback performance.

1.  **Ingestion**: Text is passed to `RSVPEngine.loadText()`.
2.  **Tokenization**: String is split via whitespace into a sanitized word array.
3.  **Initialization**: The `currentIndex` is set to 0; `StateFlow` emits the first word.
4.  **Playback**: A Coroutine-based Timing Loop executes:
    * Calculates **ORP Index** for the current word.
    * Constructs an `AnnotatedString` with the red fixation highlight.
    * Suspends via `delay(60,000ms / WPM)`.
    * Increments index and triggers UI recomposition.



---

#### 3. ORP (Optimal Recognition Point) Algorithm
The ORP is the specific fixation point in a word where the human eye recognizes the entire word fastest. By highlighting this point in **BADGR Red**, saccadic eye movement is eliminated, allowing for speeds up to 900 WPM.

###### Algorithm Logic
```kotlin
fun calculateOrpIndex(word: String): Int {
    return when (word.length) {
        in 1..2   -> 0      // "it" → "it"
        in 3..5   -> 1      // "word" → "wOrd"
        in 6..9   -> 2      // "reading" → "reAding"
        in 10..13 -> 3      // "understanding" → "undErstanding"
        else      -> 4      // "extraordinarily" → "extrAordinarily"
    }
}
