# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in C:\Users\Usuario\AppData\Local\Android\Sdk/tools/proguard/proguard-android.txt

# Retrofit / Gson
-keepattributes Signature
-keepattributes *Annotation*
-dontwarn retrofit2.**
-keep class com.licoreria.chilalo.data.remote.** { *; }

# Keep data classes for Gson
-keepclassmembers,allowobfuscation class * {
  @com.google.gson.annotations.SerializedName <fields>;
}
