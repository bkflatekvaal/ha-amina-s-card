## Screenshots

The screenshots below show the card in dark and light Home Assistant themes.

### Dark theme

| Connected | Charging | Not connected |
| --- | --- | --- |
| ![Amina S Card connected in dark theme](../screenshots/dark-connected.png) | ![Amina S Card charging in dark theme](../screenshots/dark-charging.png) | ![Amina S Card not connected in dark theme](../screenshots/dark-not-connected.png) |

### Light theme

| Connected | Charging | Not connected |
| --- | --- | --- |
| ![Amina S Card connected in light theme](../screenshots/light-connected.png) | ![Amina S Card charging in light theme](../screenshots/light-charging.png) | ![Amina S Card not connected in light theme](../screenshots/light-not-connected.png) |

### Three-phase telemetry

Captured in Home Assistant on 10 October 2026. Charging shows individual A/B/C currents and averaged voltage with the `3p` prefix. When the EV is connected without charging, the card shows the main current and retains `3p` voltage when all three phase voltages are available.

| Three-phase charging | EV connected |
| --- | --- |
| ![Amina S Card charging with A/B/C currents and three-phase voltage](../screenshots/dark-three-phase-charging.png) | ![Amina S Card with EV connected and three-phase voltage](../screenshots/dark-three-phase-connected.png) |

### Configuration editor

The card editor keeps the status entity required and groups manually assigned entities under optional overrides.

| Required configuration | Optional overrides |
| --- | --- |
| ![Amina S Card configuration editor with optional overrides collapsed](../screenshots/config-collapsed.png) | ![Amina S Card configuration editor with optional overrides expanded](../screenshots/config-expanded.png) |

