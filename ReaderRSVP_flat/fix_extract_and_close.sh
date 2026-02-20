FILE=app/src/main/java/com/badgr/rsvpreader/MainActivity.kt

# Remove any existing extractTextFromPdf definition
sed -i '/private fun extractTextFromPdf/,/^\s*}\s*$/d' "$FILE"

# Append the correct implementation near the end, just before the last closing brace of the file.
# First, strip the very last line if it is just "}"
if tail -n 1 "$FILE" | grep -q '^\s*}\s*$'; then
  sed -i '$d' "$FILE"
fi

cat >> "$FILE" << 'EOK'

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
                    stripper.text
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
EOK
