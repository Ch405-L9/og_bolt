package com.badgr.rsvpreader

import android.net.Uri
import android.os.Bundle
import android.widget.Toast
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.animation.Crossfade
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.SpanStyle
import androidx.compose.ui.text.buildAnnotatedString
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.withStyle
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.lifecycleScope
import com.badgr.rsvpreader.ui.theme.BADGRBlack
import com.badgr.rsvpreader.ui.theme.BADGRBlue
import com.badgr.rsvpreader.ui.theme.BADGRRed
import com.badgr.rsvpreader.ui.theme.BADGRWhite
import com.badgr.rsvpreader.ui.theme.RSVPReaderTheme
import com.tom_roush.pdfbox.android.PDFBoxResourceLoader
import com.tom_roush.pdfbox.pdmodel.PDDocument
import com.tom_roush.pdfbox.text.PDFTextStripper
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch

enum class Screen {
    Splash, Reader, Library, Settings, Outro
}

class MainActivity : ComponentActivity() {

    private val rsvpEngine = RSVPEngine()
    private lateinit var libraryViewModel: LibraryViewModel

    private val openDocumentLauncher = registerForActivityResult(
        ActivityResultContracts.OpenDocument()
    ) { uri ->
        uri?.let { processBookFile(it) }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()

        // Initialize PDFBox for PDF text extraction
        PDFBoxResourceLoader.init(applicationContext)

        // Initialize Room-backed library
        val db = AppDatabase.getInstance(applicationContext)
        val repo = LibraryRepository(db.libraryDao())
        libraryViewModel = LibraryViewModel(repo)

        // Load sample text into engine
        val sampleText = getString(R.string.sample_text)
        rsvpEngine.loadText(sampleText)

        setContent {
            val libraryItems by libraryViewModel.items.collectAsState()

            var currentScreen by remember { mutableStateOf(Screen.Splash) }
            var isDarkTheme by remember { mutableStateOf(true) }

            RSVPReaderTheme(darkTheme = isDarkTheme) {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background
                ) {
                    Crossfade(targetState = currentScreen, label = "ScreenTransition") { screen ->
                        when (screen) {
                            Screen.Splash -> SplashScreen { currentScreen = Screen.Reader }
                            Screen.Reader -> ReaderScreen(
                                engine = rsvpEngine,
                                scope = lifecycleScope,
                                onNavigateToLibrary = { currentScreen = Screen.Library },
                                onNavigateToSettings = { currentScreen = Screen.Settings },
                                onFinished = { currentScreen = Screen.Outro }
                            )
                            Screen.Library -> LibraryScreen(
                                books = libraryItems,
                                onBookSelected = { item ->
                                    rsvpEngine.loadText(item.content)
                                    currentScreen = Screen.Reader
                                },
                                onImportRequested = {
                                    // Allow TXT and PDF
                                    openDocumentLauncher.launch(
                                        arrayOf(
                                            "text/plain",
                                            "application/pdf"
                                        )
                                    )
                                },
                                onBack = { currentScreen = Screen.Reader }
                            )
                            Screen.Settings -> SettingsScreen(
                                engine = rsvpEngine,
                                isDarkTheme = isDarkTheme,
                                onThemeToggle = { isDarkTheme = !isDarkTheme },
                                onBack = { currentScreen = Screen.Reader }
                            )
                            Screen.Outro -> OutroScreen { currentScreen = Screen.Reader }
                        }
                    }
                }
            }
        }
    }

    private fun processBookFile(uri: Uri) {
        try {
            val type = contentResolver.getType(uri) ?: ""

            val text: String? = when {
                // Plain text
                type.startsWith("text/") -> {
                    contentResolver.openInputStream(uri)
                        ?.bufferedReader()
                        ?.use { it.readText() }
                }

                // PDF → extract text
                type == "application/pdf" -> {
                    extractTextFromPdf(uri)
                }

                else -> {
                    // Fallback: try reading as text
                    contentResolver.openInputStream(uri)
                        ?.bufferedReader()
                        ?.use { it.readText() }
                }
            }

            if (text != null && text.isNotBlank()) {
                rsvpEngine.loadText(text)

                // Save to Room library
                val title = "Imported ${System.currentTimeMillis()}"
                lifecycleScope.launch {
                    libraryViewModel.addImportedBook(title, text)
                }

                Toast.makeText(this, "File loaded successfully", Toast.LENGTH_SHORT).show()
            } else {
                Toast.makeText(this, "No readable text found in file", Toast.LENGTH_LONG).show()
            }
        } catch (e: Exception) {
            Toast.makeText(this, "Error loading file: ${e.message}", Toast.LENGTH_LONG).show()
        }
    }

    private fun extractTextFromPdf(uri: Uri): String? {
        return try {
            val inputStream = contentResolver.openInputStream(uri) ?: return null

            val document = PDDocument.load(inputStream)
            val text = try {
                if (document.isEncrypted) {
                    null
                } else {
                    val stripper = PDFTextStripper()
                    stripper.startPage = 1
                    stripper.endPage = document.numberOfPages
                    stripper.getText(document)
                }
            } finally {
                document.close()
                inputStream.close()
            }

            text
        } catch (e: Exception) {
            e.printStackTrace()
            null
        }
    }
}

@Composable
fun SplashScreen(onFinished: () -> Unit) {
    LaunchedEffect(Unit) {
        delay(2000)
        onFinished()
    }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(BADGRBlack),
        contentAlignment = Alignment.Center
    ) {
        Column(horizontalAlignment = Alignment.CenterHorizontally) {
            Image(
                painter = painterResource(id = R.drawable.badgr_logo),
                contentDescription = "BADGR Logo",
                modifier = Modifier.size(200.dp)
            )
            Spacer(modifier = Modifier.height(24.dp))
            Text(
                text = "BADGR Bolt",
                fontSize = 32.sp,
                fontWeight = FontWeight.Bold,
                color = BADGRBlue
            )
            Text(
                text = "Technologies LLC",
                fontSize = 14.sp,
                color = BADGRWhite.copy(alpha = 0.7f)
            )
        }
    }
}

@Composable
fun OutroScreen(onBack: () -> Unit) {
    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(BADGRBlack)
            .padding(32.dp),
        contentAlignment = Alignment.Center
    ) {
        Column(horizontalAlignment = Alignment.CenterHorizontally) {
            Text(
                text = "Thank You!",
                fontSize = 32.sp,
                fontWeight = FontWeight.Bold,
                color = BADGRBlue,
                textAlign = TextAlign.Center
            )
            Spacer(modifier = Modifier.height(16.dp))
            Text(
                text = "We hope you enjoyed your reading session with BADGR Speed Reader.",
                fontSize = 18.sp,
                color = BADGRWhite,
                textAlign = TextAlign.Center
            )
            Spacer(modifier = Modifier.height(48.dp))
            Button(
                onClick = onBack,
                colors = ButtonDefaults.buttonColors(containerColor = BADGRBlue)
            ) {
                Text("Back to Reader")
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ReaderScreen(
    engine: RSVPEngine,
    scope: kotlinx.coroutines.CoroutineScope,
    onNavigateToLibrary: () -> Unit,
    onNavigateToSettings: () -> Unit,
    onFinished: () -> Unit
) {
    val currentWord by engine.currentWord.collectAsState()
    val orpIndex by engine.orpIndex.collectAsState()
    val progress by engine.progress.collectAsState()
    val wordCount by engine.wordCount.collectAsState()
    val isPlaying by engine.isPlayingState.collectAsState()

    var wpm by remember { mutableIntStateOf(engine.getWpm()) }

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Image(
                            painter = painterResource(id = R.drawable.badgr_logo),
                            contentDescription = null,
                            modifier = Modifier.size(32.dp)
                        )
                        Spacer(modifier = Modifier.width(8.dp))
                        Text("BADGR Bolt", color = BADGRBlue, fontWeight = FontWeight.Bold)
                    }
                },
                actions = {
                    IconButton(onClick = onNavigateToLibrary) {
                        Icon(
                            Icons.Default.LibraryBooks,
                            contentDescription = "Library",
                            tint = BADGRBlue
                        )
                    }
                    IconButton(onClick = onNavigateToSettings) {
                        Icon(
                            Icons.Default.Settings,
                            contentDescription = "Settings",
                            tint = BADGRBlue
                        )
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = Color.Transparent,
                    titleContentColor = BADGRBlue
                )
            )
        },
        containerColor = MaterialTheme.colorScheme.background
    ) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .padding(16.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Spacer(modifier = Modifier.weight(0.3f))

            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(200.dp)
                    .clip(RoundedCornerShape(16.dp))
                    .background(MaterialTheme.colorScheme.surface)
                    .padding(16.dp),
                contentAlignment = Alignment.Center
            ) {
                if (currentWord.isNotEmpty()) {
                    WordDisplay(word = currentWord, orpIndex = orpIndex)
                } else {
                    Text(
                        text = "Press Play to Start",
                        fontSize = 24.sp,
                        color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.5f)
                    )
                }
            }

            Spacer(modifier = Modifier.weight(0.3f))

            Column(
                modifier = Modifier.fillMaxWidth(),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                LinearProgressIndicator(
                    progress = progress,
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(8.dp)
                        .clip(RoundedCornerShape(4.dp)),
                    color = BADGRBlue,
                    trackColor = MaterialTheme.colorScheme.surfaceVariant
                )
                Spacer(modifier = Modifier.height(8.dp))
                Text(
                    text = "${(progress * 100).toInt()}% • Word ${engine.getCurrentIndex()} of $wordCount",
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.7f)
                )
            }

            Spacer(modifier = Modifier.height(32.dp))

            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                IconButton(onClick = {
                    wpm = (wpm - engine.wpmIncrement).coerceAtLeast(100)
                    engine.setWpm(wpm)
                }) {
                    Icon(Icons.Default.Remove, contentDescription = "Decrease Speed", tint = BADGRBlue)
                }

                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Text(
                        text = "$wpm",
                        fontSize = 48.sp,
                        fontWeight = FontWeight.Bold,
                        color = BADGRBlue
                    )
                    Text(
                        text = "WPM",
                        fontSize = 14.sp,
                        color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.7f)
                    )
                }

                IconButton(onClick = {
                    wpm = (wpm + engine.wpmIncrement).coerceAtMost(1500)
                    engine.setWpm(wpm)
                }) {
                    Icon(Icons.Default.Add, contentDescription = "Increase Speed", tint = BADGRBlue)
                }
            }

            Spacer(modifier = Modifier.height(32.dp))

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceEvenly,
                verticalAlignment = Alignment.CenterVertically
            ) {
                IconButton(onClick = { engine.jumpBackward(10) }) {
                    Icon(
                        Icons.Default.SkipPrevious,
                        contentDescription = "Back 10",
                        tint = MaterialTheme.colorScheme.onSurface,
                        modifier = Modifier.size(32.dp)
                    )
                }

                FloatingActionButton(
                    onClick = {
                        if (isPlaying) engine.pause() else {
                            scope.launch {
                                engine.play(scope)
                            }
                        }
                    },
                    containerColor = BADGRBlue,
                    contentColor = Color.White,
                    shape = RoundedCornerShape(50)
                ) {
                    Icon(
                        imageVector = if (isPlaying) Icons.Default.Pause else Icons.Default.PlayArrow,
                        contentDescription = if (isPlaying) "Pause" else "Play",
                        tint = Color.White,
                        modifier = Modifier.size(40.dp)
                    )
                }

                IconButton(onClick = { engine.jumpForward(10) }) {
                    Icon(
                        Icons.Default.SkipNext,
                        contentDescription = "Forward 10",
                        tint = MaterialTheme.colorScheme.onSurface,
                        modifier = Modifier.size(32.dp)
                    )
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            TextButton(onClick = { engine.reset() }) {
                Icon(Icons.Default.Refresh, contentDescription = null, modifier = Modifier.size(18.dp))
                Spacer(modifier = Modifier.width(8.dp))
                Text("Reset Progress")
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun LibraryScreen(
    books: List<LibraryItem>,
    onBookSelected: (LibraryItem) -> Unit,
    onImportRequested: () -> Unit,
    onBack: () -> Unit
) {
    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Library") },
                navigationIcon = {
                    IconButton(onClick = onBack) {
                        Icon(Icons.Default.ArrowBack, contentDescription = "Back")
                    }
                }
            )
        }
    ) { padding ->
        LazyColumn(modifier = Modifier.padding(padding)) {
            items(books) { item ->
                ListItem(
                    headlineContent = { Text(item.title) },
                    supportingContent = {
                        Text(item.content.take(50) + "...", maxLines = 1)
                    },
                    leadingContent = {
                        Icon(
                            Icons.Default.Book,
                            contentDescription = null,
                            tint = BADGRBlue
                        )
                    },
                    modifier = Modifier.clickable { onBookSelected(item) }
                )
                Divider(color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.1f))
            }
            item {
                ListItem(
                    headlineContent = { Text("Import from Device", color = BADGRBlue) },
                    leadingContent = {
                        Icon(
                            Icons.Default.FileUpload,
                            contentDescription = null,
                            tint = BADGRBlue
                        )
                    },
                    modifier = Modifier.clickable {
                        onImportRequested()
                    }
                )
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SettingsScreen(
    engine: RSVPEngine,
    isDarkTheme: Boolean,
    onThemeToggle: () -> Unit,
    onBack: () -> Unit
) {
    val uriHandler = androidx.compose.ui.platform.LocalUriHandler.current
    val privacyUrl = "https://github.com/Ch405-L9/ReaderRSVP/blob/main/PRIVACY_POLICY.md"
    val termsUrl = "https://github.com/Ch405-L9/ReaderRSVP/blob/main/TERMS_OF_SERVICE.md"

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Settings") },
                navigationIcon = {
                    IconButton(onClick = onBack) {
                        Icon(Icons.Default.ArrowBack, contentDescription = "Back")
                    }
                }
            )
        }
    ) { padding ->
        Column(
            modifier = Modifier
                .padding(padding)
                .padding(16.dp)
        ) {
            Text("Appearance", style = MaterialTheme.typography.titleMedium, color = BADGRBlue)
            ListItem(
                headlineContent = { Text("Dark Theme") },
                trailingContent = {
                    Switch(checked = isDarkTheme, onCheckedChange = { onThemeToggle() })
                }
            )
            Divider(color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.1f))

            Spacer(modifier = Modifier.height(16.dp))
            Text("Reading Engine", style = MaterialTheme.typography.titleMedium, color = BADGRBlue)
            ListItem(
                headlineContent = { Text("Punctuation Delay") },
                supportingContent = { Text("Slightly pause at commas and periods") },
                trailingContent = {
                    Switch(
                        checked = engine.punctuationDelayEnabled,
                        onCheckedChange = { engine.punctuationDelayEnabled = it }
                    )
                }
            )
            Divider(color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.1f))
            ListItem(
                headlineContent = { Text("Speed Increment") },
                supportingContent = { Text("WPM change per click: ${engine.wpmIncrement}") },
                trailingContent = {
                    Row {
                        IconButton(onClick = {
                            engine.wpmIncrement = (engine.wpmIncrement - 25).coerceAtLeast(25)
                        }) {
                            Icon(Icons.Default.Remove, contentDescription = null)
                        }
                        IconButton(onClick = {
                            engine.wpmIncrement = (engine.wpmIncrement + 25).coerceAtMost(100)
                        }) {
                            Icon(Icons.Default.Add, contentDescription = null)
                        }
                    }
                }
            )
            Divider(color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.1f))

            Spacer(modifier = Modifier.height(16.dp))
            Text("Legal", style = MaterialTheme.typography.titleMedium, color = BADGRBlue)
            ListItem(
                headlineContent = { Text("Privacy Policy", color = BADGRBlue) },
                leadingContent = {
                    Icon(
                        Icons.Default.PrivacyTip,
                        contentDescription = null,
                        tint = BADGRBlue
                    )
                },
                modifier = Modifier.clickable { uriHandler.openUri(privacyUrl) }
            )
            Divider(color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.1f))
            ListItem(
                headlineContent = { Text("Terms of Service", color = BADGRBlue) },
                leadingContent = {
                    Icon(
                        Icons.Default.Gavel,
                        contentDescription = null,
                        tint = BADGRBlue
                    )
                },
                modifier = Modifier.clickable { uriHandler.openUri(termsUrl) }
            )

            Spacer(modifier = Modifier.height(16.dp))
            Text("About", style = MaterialTheme.typography.titleMedium, color = BADGRBlue)
            ListItem(
                headlineContent = { Text("Version") },
                supportingContent = { Text("1.0.1") }
            )
            ListItem(
                headlineContent = { Text("Developer") },
                supportingContent = { Text("BADGR Technologies LLC") }
            )
        }
    }
}

@Composable
fun WordDisplay(word: String, orpIndex: Int) {
    val annotatedString = buildAnnotatedString {
        val color = MaterialTheme.colorScheme.onSurface

        if (orpIndex > 0) {
            withStyle(style = SpanStyle(color = color, fontSize = 48.sp)) {
                append(word.substring(0, orpIndex))
            }
        }

        if (orpIndex < word.length) {
            withStyle(
                style = SpanStyle(
                    color = BADGRRed,
                    fontSize = 48.sp,
                    fontWeight = FontWeight.Bold
                )
            ) {
                append(word[orpIndex])
            }
        }

        if (orpIndex < word.length - 1) {
            withStyle(style = SpanStyle(color = color, fontSize = 48.sp)) {
                append(word.substring(orpIndex + 1))
            }
        }
    }

    Text(
        text = annotatedString,
        fontSize = 48.sp,
        textAlign = TextAlign.Center,
        modifier = Modifier.fillMaxWidth()
    )
}

