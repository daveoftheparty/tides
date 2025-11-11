# Unicode Icons Reference

## Sun Icons
| Icon | Unicode Escape | Description |
|------|----------------|-------------|
| ☀ | \u2600 | Black Sun with Rays |
| ☀️ | \u2600\uFE0F | Black Sun with Rays (emoji) |
| ☼ | \u263C | White Sun with Rays |
| ☉ | \u2609 | Sun |
| 🌞 | \u{1F31E} | Sun with Face |
| 🌅 | \u{1F305} | Sunrise |
| 🌄 | \u{1F304} | Sunrise over Mountains |
| 🌇 | \u{1F307} | Sunset |

## Moon Icons
| Icon | Unicode Escape | Description |
|------|----------------|-------------|
| ☽ | \u263D | First Quarter Moon |
| ☾ | \u263E | Last Quarter Moon |
| 🌑 | \u{1F311} | New Moon |
| 🌒 | \u{1F312} | Waxing Crescent Moon |
| 🌓 | \u{1F313} | First Quarter Moon |
| 🌔 | \u{1F314} | Waxing Gibbous Moon |
| 🌕 | \u{1F315} | Full Moon |
| 🌖 | \u{1F316} | Waning Gibbous Moon |
| 🌗 | \u{1F317} | Last Quarter Moon |
| 🌘 | \u{1F318} | Waning Crescent Moon |
| 🌙 | \u{1F319} | Crescent Moon |
| 🌚 | \u{1F31A} | New Moon Face |
| 🌛 | \u{1F31B} | First Quarter Moon Face |
| 🌜 | \u{1F31C} | Last Quarter Moon Face |
| 🌝 | \u{1F31D} | Full Moon Face |

## Wave/Water/Tide Icons
| Icon | Unicode Escape | Description |
|------|----------------|-------------|
| 🌊 | \u{1F30A} | Water Wave |
| 〰 | \u3030 | Wavy Dash |
| ≈ | \u2248 | Almost Equal To (wavy) |
| ∼ | \u223C | Tilde Operator (wavy) |
| ～ | \uFF5E | Fullwidth Tilde (wavy) |
| 💧 | \u{1F4A7} | Droplet |
| 💦 | \u{1F4A6} | Sweat Droplets |

## Light/Brightness Icons
| Icon | Unicode Escape | Description |
|------|----------------|-------------|
| ☼ | \u263C | White Sun with Rays |
| ✨ | \u2728 | Sparkles |
| ⭐ | \u2B50 | Star |
| ★ | \u2605 | Black Star |
| ☆ | \u2606 | White Star |
| 💡 | \u{1F4A1} | Light Bulb |
| 🔆 | \u{1F506} | High Brightness |
| 🔅 | \u{1F505} | Low Brightness |

## Dark/Night Icons
| Icon | Unicode Escape | Description |
|------|----------------|-------------|
| ● | \u25CF | Black Circle |
| ⚫ | \u26AB | Medium Black Circle |
| 🌑 | \u{1F311} | New Moon (dark) |
| 🌃 | \u{1F303} | Night with Stars |
| 🌌 | \u{1F30C} | Milky Way |
| 🌠 | \u{1F320} | Shooting Star |

## Arrows (for up/down trends)
| Icon | Unicode Escape | Description |
|------|----------------|-------------|
| ↑ | \u2191 | Upwards Arrow |
| ↓ | \u2193 | Downwards Arrow |
| ⬆ | \u2B06 | Upwards Black Arrow |
| ⬇ | \u2B07 | Downwards Black Arrow |
| ⇅ | \u21C5 | Upwards Arrow Leftwards of Downwards Arrow |
| ⇵ | \u21F5 | Downwards Arrow Leftwards of Upwards Arrow |
| ▲ | \u25B2 | Black Up-Pointing Triangle |
| ▼ | \u25BC | Black Down-Pointing Triangle |
| △ | \u25B3 | White Up-Pointing Triangle |
| ▽ | \u25BD | White Down-Pointing Triangle |

## Usage in TypeScript/TSX

### Direct in JSX:
```tsx
<text>🌊 Wave</text>
<button>☀️ Sunrise</button>
```

### As variables:
```tsx
const sunIcon = '☀️';
const moonIcon = '🌙';
const waveIcon = '🌊';

<text>{sunIcon} Daylight</text>
```

### Using escape sequences:
```tsx
<text>{'\u2600'} Sun</text>
<text>{'\u{1F30A}'} Wave</text>
```

### Note on escape sequences:
- BMP characters (U+0000 to U+FFFF): Use `\uXXXX` format
- Non-BMP characters (U+10000 and above): Use `\u{XXXXX}` format (requires ES6+)
