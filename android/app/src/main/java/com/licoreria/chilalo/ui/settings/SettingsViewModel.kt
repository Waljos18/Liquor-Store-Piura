package com.licoreria.chilalo.ui.settings

import androidx.lifecycle.ViewModel
import com.licoreria.chilalo.data.local.ServerConfig
import dagger.hilt.android.lifecycle.HiltViewModel
import javax.inject.Inject

@HiltViewModel
class SettingsViewModel @Inject constructor(
    val serverConfig: ServerConfig
) : ViewModel()
