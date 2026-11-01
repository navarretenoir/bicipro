// BiciPRO — proyecto Android Studio / F-Droid. La interfaz vive en ../web (compartida con iOS y Windows 10 Mobile).
pluginManagement { repositories { google(); mavenCentral(); gradlePluginPortal() } }
dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories { google(); mavenCentral() }
}
rootProject.name = "BiciPRO"
