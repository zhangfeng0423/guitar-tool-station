# Guitar Tool Station

A comprehensive web application for guitarists featuring professional-grade tools for practice, learning, and musical exploration.

## Features

### 🎯 **Guitar Tuner**
- Accurate chromatic tuner with visual feedback
- Multiple tuning presets (Standard, Drop D, Open G, DADGAD)
- Auto-detect and manual modes
- Adjustable sensitivity settings
- Reference tone playback

### 🎵 **Chord Library**
- Comprehensive chord charts with fingering diagrams
- Interactive chord visualization
- Searchable by name, category, and difficulty
- Detailed fingering positions and techniques

### ⚡ **Scale Finder**
- Interactive scale patterns and modes
- Fretboard visualization
- Multiple scale types (Major, Minor, Pentatonic, Blues, Modes)
- Note highlighting and interval display

### ⏰ **Metronome**
- Adjustable tempo (40-208 BPM)
- Multiple time signatures
- Visual beat indicators
- Accent patterns and subdivisions

### 🧭 **Circle of Fifths**
- Interactive key relationship visualizer
- Major and minor key exploration
- Key signature reference
- Chord progression insights

### 🎸 **Interactive Fretboard**
- Note mapping across the neck
- Scale pattern visualization
- Multiple viewing modes
- Interval and root note highlighting

### 🎼 **Chord Progressions**
- Common progression library
- Roman numeral analysis
- Key transposition
- Audio playback (planned)

### 📚 **Music Theory Guide**
- Comprehensive theory reference
- Interactive lessons
- Difficulty-based filtering
- Practical examples and applications

### 👂 **Ear Training**
- Interval recognition exercises
- Chord identification training
- Progressive difficulty levels
- Score tracking and statistics

### 🎯 **Practice Sessions**
- Structured practice routines
- Customizable session builder
- Built-in timer and progress tracking
- Practice item categorization

## Technology Stack

- **Frontend**: Next.js 13+ with App Router
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: Radix UI primitives with shadcn/ui
- **Audio Processing**: Web Audio API
- **Icons**: Lucide React
- **TypeScript**: Full type safety throughout

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/guitar-tool-station.git
cd guitar-tool-station
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
npm run build
npm start
```

## Features in Detail

### Audio Processing
The tuner and ear training modules use the Web Audio API for:
- Real-time frequency analysis
- Pitch detection algorithms
- Audio synthesis for reference tones
- Low-latency audio processing

### Responsive Design
- Mobile-first approach
- Optimized for tablets and desktop
- Touch-friendly interfaces
- Adaptive layouts

### Accessibility
- Keyboard navigation support
- Screen reader compatibility
- High contrast color schemes
- Focus management

### Performance
- Optimized bundle sizes
- Lazy loading of components
- Efficient audio processing
- Smooth animations and transitions

## Browser Compatibility

- Chrome 88+
- Firefox 85+
- Safari 14+
- Edge 88+

**Note**: Microphone access required for tuner functionality.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Music theory concepts and educational content
- Open source audio processing libraries
- Guitar community feedback and suggestions
- Web Audio API documentation and examples

## Roadmap

- [ ] MIDI device support
- [ ] Audio recording and playback
- [ ] Social features and sharing
- [ ] Advanced chord voicings
- [ ] Backing track integration
- [ ] Mobile app versions
- [ ] Offline functionality
- [ ] User accounts and progress saving

---

Built with ❤️ for the guitar community