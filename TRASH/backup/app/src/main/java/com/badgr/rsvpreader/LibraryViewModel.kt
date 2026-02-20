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

