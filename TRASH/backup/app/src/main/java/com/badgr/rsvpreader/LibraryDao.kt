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
