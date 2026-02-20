#!/usr/bin/env bash
set -e

mkdir -p app/src/main/java/com/badgr/rsvpreader

# LibraryItem.kt
cat > app/src/main/java/com/badgr/rsvpreader/LibraryItem.kt << 'EOK'
package com.badgr.rsvpreader

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "library_items")
data class LibraryItem(
    @PrimaryKey(autoGenerate = true) val id: Long = 0L,
    val title: String,
    val content: String,
    val importedAt: Long = System.currentTimeMillis()
)
EOK

# LibraryDao.kt
cat > app/src/main/java/com/badgr/rsvpreader/LibraryDao.kt << 'EOK'
package com.badgr.rsvpreader

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import kotlinx.coroutines.flow.Flow

@Dao
interface LibraryDao {

    @Query("SELECT * FROM library_items ORDER BY importedAt DESC")
    fun getAll(): Flow<List<LibraryItem>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insert(item: LibraryItem)

    @Query("DELETE FROM library_items")
    suspend fun deleteAll()
}
EOK

# AppDatabase.kt
cat > app/src/main/java/com/badgr/rsvpreader/AppDatabase.kt << 'EOK'
package com.badgr.rsvpreader

import android.content.Context
import androidx.room.Database
import androidx.room.Room
import androidx.room.RoomDatabase

@Database(
    entities = [LibraryItem::class],
    version = 1,
    exportSchema = false
)
abstract class AppDatabase : RoomDatabase() {
    abstract fun libraryDao(): LibraryDao

    companion object {
        @Volatile
        private var INSTANCE: AppDatabase? = null

        fun getInstance(context: Context): AppDatabase {
            return INSTANCE ?: synchronized(this) {
                INSTANCE ?: Room.databaseBuilder(
                    context.applicationContext,
                    AppDatabase::class.java,
                    "rsvp_reader.db"
                ).build().also { INSTANCE = it }
            }
        }
    }
}
EOK

# LibraryRepository.kt
cat > app/src/main/java/com/badgr/rsvpreader/LibraryRepository.kt << 'EOK'
package com.badgr.rsvpreader

import kotlinx.coroutines.flow.Flow

class LibraryRepository(private val dao: LibraryDao) {

    val allItems: Flow<List<LibraryItem>> = dao.getAll()

    suspend fun addItem(title: String, content: String) {
        dao.insert(LibraryItem(title = title, content = content))
    }

    suspend fun clear() {
        dao.deleteAll()
    }
}
EOK

# LibraryViewModel.kt
cat > app/src/main/java/com/badgr/rsvpreader/LibraryViewModel.kt << 'EOK'
package com.badgr.rsvpreader

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch

class LibraryViewModel(private val repository: LibraryRepository) : ViewModel() {

    val items: StateFlow<List<LibraryItem>> =
        repository.allItems
            .stateIn(viewModelScope, SharingStarted.Eagerly, emptyList())

    fun addImportedBook(title: String, content: String) {
        viewModelScope.launch {
            repository.addItem(title, content)
        }
    }
}
EOK

echo "Room entity/DAO/DB/repository/ViewModel created."
