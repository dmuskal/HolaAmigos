import SwiftUI

@main
struct HolaAmigosApp: App {
    var body: some Scene {
        WindowGroup {
            HomeView()
                // Kids rotate iPads constantly; the layout is built to be
                // equally comfortable in both orientations.
                .environmentObject(ProgressStore.shared)
                .environmentObject(SpeechManager.shared)
        }
    }
}
