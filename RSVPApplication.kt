package com.badgr.rsvpreader

import com.badgr.rsvpreader.BuildConfig
import android.app.Application
import timber.log.Timber

class RSVPApplication : Application() {
    override fun onCreate() {
        super.onCreate()
        if (BuildConfig.DEBUG) {
            Timber.plant(Timber.DebugTree())
        }
    }
}
