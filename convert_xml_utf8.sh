#!/bin/bash

ROOT_DIR="/home/t0n34781/Manus API/badgr_bolt_ropr"
TRASH_DIR="$ROOT_DIR/TRASH"

mkdir -p "$TRASH_DIR"

# File extensions to convert
EXTENSIONS=("xml" "gradle" "kts" "java" "kt")

for ext in "${EXTENSIONS[@]}"; do
    find "$ROOT_DIR" -type f -name "*.$ext" | while read -r file; do
        rel_path="${file#$ROOT_DIR/}"
        backup_path="$TRASH_DIR/$rel_path"
        mkdir -p "$(dirname "$backup_path")"
        cp "$file" "$backup_path"

        # Detect original charset, fallback to ISO-8859-1 if unknown
        charset=$(file -bi "$file" | sed -n 's/.*charset=\(.*\)/\1/p')
        if [[ -z "$charset" || "$charset" == "binary" ]]; then
            charset="ISO-8859-1"
        fi

        iconv -f "$charset" -t UTF-8 "$file" -o "$file".utf8.tmp && mv "$file".utf8.tmp "$file"
        echo "Converted $file -> UTF-8 (backup at $backup_path)"
    done
done

echo "All specified files converted. Originals saved in $TRASH_DIR"
