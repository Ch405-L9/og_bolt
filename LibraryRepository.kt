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
