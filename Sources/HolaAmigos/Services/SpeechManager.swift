import AVFoundation

/// Speaks Spanish words aloud using the on-device speech synthesizer.
///
/// Deliberately avoids bundling audio files: no recording/licensing needed,
/// zero network calls (safe for a kids' app with no backend), and it works
/// offline the moment the app installs. Quality is "good enough for a
/// 5-year-old learning first words," not studio-grade.
final class SpeechManager: NSObject, ObservableObject {
    static let shared = SpeechManager()

    private let synthesizer = AVSpeechSynthesizer()

    @Published private(set) var isSpeaking = false

    private override init() {
        super.init()
        synthesizer.delegate = self
        try? AVAudioSession.sharedInstance().setCategory(.playback, mode: .default, options: [.mixWithOthers])
    }

    func speak(_ text: String) {
        synthesizer.stopSpeaking(at: .immediate)

        let utterance = AVSpeechUtterance(string: text)
        utterance.voice = AVSpeechSynthesisVoice(language: "es-MX") ?? AVSpeechSynthesisVoice(language: "es-ES")
        // Slightly slower and higher-pitched than default: easier for a young
        // child to follow, and reads as friendlier/more playful.
        utterance.rate = AVSpeechUtteranceDefaultSpeechRate * 0.85
        utterance.pitchMultiplier = 1.1

        synthesizer.speak(utterance)
    }
}

extension SpeechManager: AVSpeechSynthesizerDelegate {
    func speechSynthesizer(_ synthesizer: AVSpeechSynthesizer, didStart utterance: AVSpeechUtterance) {
        isSpeaking = true
    }

    func speechSynthesizer(_ synthesizer: AVSpeechSynthesizer, didFinish utterance: AVSpeechUtterance) {
        isSpeaking = false
    }

    func speechSynthesizer(_ synthesizer: AVSpeechSynthesizer, didCancel utterance: AVSpeechUtterance) {
        isSpeaking = false
    }
}
