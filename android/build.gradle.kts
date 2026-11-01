// BiciPRO para Android 5.0 en adelante (desarrollado por Javiera Navarrete). Única dependencia: BRouter (MIT), en libs/.
plugins { id("com.android.application") version "9.4.1" }

val assetsWeb = layout.buildDirectory.dir("assets-web").get().asFile
val prepararWeb by tasks.registering(Sync::class) { into(assetsWeb); from(rootDir.resolve("../web")) { into("web") } }

android {
    namespace = "com.bicipro.app"
    compileSdk { version = release(36) { minorApiLevel = 1 } }
    defaultConfig {
        applicationId = "cl.kotone.bicipro"
        minSdk = 21          // Android 5.0; lo moderno va protegido por versión
        targetSdk = 36
        versionCode = 1
        versionName = "1.0"
    }
    sourceSets["main"].apply {
        manifest.srcFile("AndroidManifest.xml")
        java.srcDirs("src")
        res.srcDirs("res")
        assets.srcDirs("assets", assetsWeb)
    }
    buildFeatures { buildConfig = true }
    buildTypes { release { isMinifyEnabled = false } }
    compileOptions { sourceCompatibility = JavaVersion.VERSION_17; targetCompatibility = JavaVersion.VERSION_17 }
    lint { abortOnError = false; checkOnly += setOf("NewApi", "InlinedApi"); textReport = true }
}
dependencies { implementation(files("libs/brouter-1.7.10-ro.jar")) }
tasks.named("preBuild") { dependsOn(prepararWeb) }
