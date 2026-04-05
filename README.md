# WaffleWeather

A self-hosted weather station dashboard built for [Ecowitt](https://www.ecowitt.com/) hardware. Real-time data, historical charts, lightning tracking, wind rose visualization, and a warm design that's actually nice to look at — all running on a Raspberry Pi.

Named after a very good dog.

![WaffleWeather Observatory](dashboard-desktop-full.png)

## Why?

Ecowitt makes solid, affordable weather station hardware. But the software options for viewing your data — Ecowitt's cloud, Weather Underground, WeeWX — all have tradeoffs. Cloud services mean your data lives on someone else's server. WeeWX is powerful but shows its age in the UI and lacks real-time updates out of the box.

WaffleWeather was built to fill that gap: a modern, good-looking dashboard that runs entirely on your local network, processes data in real time, and stores everything in a proper time-series database you control.

## Features

**Observatory Dashboard** — 10 live-updating cards covering temperature, humidity, wind (with SVG compass rose), barometric pressure, rain, solar/UV, lightning, thermal comfort (UTCI), sun position, and moon phase. Every value updates in real time over WebSocket. 15-minute trend arrows show which way things are heading.

**Lightning Tracker** — Interactive map (Leaflet) showing strike distance radius, plus charts for strike activity and storm approach/retreat patterns. Detected events are stored separately so you can browse storm history.

**Wind Rose** — Custom SVG polar chart breaking down wind patterns by direction and speed across 16 compass sectors. Configurable time ranges from 24 hours to a full year.

**History** — Time-series charts with automatic resolution scaling (raw data for 24h, hourly aggregates for a week, daily for a month, monthly for a year). Plus a GitHub-style calendar heatmap for any metric.

**Diagnostics** — Battery levels, gateway stats, firmware info, and connection status. Useful for keeping an eye on sensor health.

**Unit Toggle** — Global metric/imperial switch that converts everything on the fly. All data is stored as metric; conversions happen in the browser.

**Derived Meteorology** — Dew point (Magnus-Tetens), heat index (full NWS Rothfusz), wind chill, composite feels-like, UTCI thermal comfort (Brode polynomial), and Zambretti barometric forecast (based on the [pywws implementation](https://github.com/jim-easterbrook/pywws) of the 1915 Negretti & Zambra algorithm, with 16-point wind direction table and automatic hemisphere detection from station latitude). Computed on the fly, never stored stale.

**Tooltips Everywhere** — Click-to-toggle info tips on every card explaining what each metric means and how it's calculated.

![Lightning page](lightning-page-desktop.png)
![Wind Rose](phase5-windrose-loaded.png)

## Architecture

```
Ecowitt Station  -->  ecowitt2mqtt  -->  Mosquitto (MQTT)
                                              |
                                         FastAPI Backend
                                        /       |       \
                                   REST API   WebSocket   TimescaleDB
                                        \       |       /
                                         Nginx reverse proxy
                                              |
                                       Next.js Frontend
```

The Ecowitt gateway pushes data to [ecowitt2mqtt](https://github.com/bachya/ecowitt2mqtt) over HTTP, which normalizes it and publishes to an MQTT broker. The FastAPI backend subscribes to MQTT, stores observations in TimescaleDB, enriches them with derived calculations, and pushes updates to connected browsers over WebSocket. The Next.js frontend handles all the rendering and unit conversions.

Everything runs natively on the Pi — no Docker, no containers. A Raspberry Pi 4 with 4GB RAM handles it all comfortably.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | FastAPI, Python 3.12+, SQLAlchemy async, aiomqtt, Alembic |
| Database | TimescaleDB (PostgreSQL 17) — hypertables, continuous aggregates, compression |
| Frontend | Next.js 16 (App Router), TypeScript, Recharts, TanStack Query |
| API Contract | OpenAPI 3.1 YAML (hand-written, single source of truth) |
| Client Codegen | Orval — generates typed TanStack Query hooks from the OpenAPI spec |
| Real-time | WebSocket with auto-reconnect and exponential backoff |
| Styling | Tailwind CSS v4, custom "Warm Observatory" design system |
| Fonts | Fraunces (headings), Outfit (body), IBM Plex Mono (data readouts) |
| Package Managers | uv (Python), pnpm (Node) |
| Deployment | systemd services, Nginx reverse proxy, rsync from dev machine |

## Hardware Requirements

**Weather Station**: Any Ecowitt gateway with sensors. The MQTT parser handles field name variants across models, so most Ecowitt setups should work. Currently tested with:

- **Gateway**: GW3000B (GW1000, GW1100, GW2000 should also work)
- **Outdoor sensor**: WS80 / WS90 (temperature, humidity, wind, solar, UV, rain)
- **Lightning**: Included in WS80/WS90 (AS3935 sensor)

Sensors you don't have simply won't populate those cards — the dashboard gracefully handles missing data.

**Server**: Raspberry Pi 4 (4GB RAM recommended). Should also work on a Pi 5 or any Debian-based Linux system. The full stack (PostgreSQL + TimescaleDB, Mosquitto, FastAPI, Next.js, Nginx) runs well within 4GB.

## Setup

This guide assumes you have a Raspberry Pi running Debian 13 (Bookworm or Trixie) with SSH access and your Ecowitt gateway on the same network.

### 1. Clone and run the setup script

```bash
ssh your-user@your-pi
git clone https://github.com/your-username/WaffleWeather.git /opt/waffleweather
cd /opt/waffleweather
bash deploy/setup.sh
```

The setup script installs and configures:
- PostgreSQL 17 + TimescaleDB (tuned for Pi 4)
- Mosquitto MQTT broker (with authentication)
- Nginx reverse proxy
- Node.js + pnpm
- uv (Python package manager)
- A `waffleweather` system user and systemd service files

It generates random passwords for the database, MQTT broker, and API key, and writes them to `/opt/waffleweather/.env`.

### 2. Configure your environment

Edit `/opt/waffleweather/.env` with your station details:

```bash
# Station identity (shown in UI and used for lightning map centering)
WW_STATION_NAME=My Weather Station
WW_STATION_LATITUDE=40.7128
WW_STATION_LONGITUDE=-74.0060
WW_STATION_ALTITUDE=10.0
```

The database URL, MQTT credentials, and API key are filled in automatically by the setup script. See `.env.example` for the full list.

### 3. Configure ecowitt2mqtt

Install [ecowitt2mqtt](https://github.com/bachya/ecowitt2mqtt) and point it at your Mosquitto broker. A systemd service file is included at `deploy/ecowitt2mqtt.service` — it reads MQTT credentials from the same `.env` file.

Then configure your Ecowitt gateway's "Customized" server to push to `http://your-pi:8080/data/report` (or whatever port ecowitt2mqtt is listening on).

**Important**: Run ecowitt2mqtt with `--disable-calculated-data` — WaffleWeather computes its own derived values (dew point, heat index, UTCI, etc.) and the pre-calculated ones from ecowitt2mqtt would conflict.

### 4. Deploy the application

From your development machine:

```bash
# Install backend dependencies and run migrations
cd /opt/waffleweather/backend
uv sync
uv run alembic upgrade head

# Install frontend dependencies and build
cd /opt/waffleweather/frontend
pnpm install --frozen-lockfile
pnpm build

# Copy standalone assets
cp -r .next/static .next/standalone/.next/
cp -r public .next/standalone/

# Set ownership and start services
sudo chown -R waffleweather:waffleweather /opt/waffleweather
sudo systemctl enable --now waffleweather-backend waffleweather-frontend
```

The dashboard should now be accessible at `http://your-pi` on port 80.

### 5. Verify data flow

Once your Ecowitt gateway is pushing to ecowitt2mqtt, you should see data appear on the Observatory dashboard within a few seconds. Check the Diagnostics page to confirm the WebSocket connection is active and sensor batteries are reporting.

## Sensor Compatibility

WaffleWeather's MQTT parser maps Ecowitt field names to database columns. It handles multiple naming conventions across sensor models:

| Data | Sensor Keys (any of these) |
|------|---------------------------|
| Outdoor temp/humidity | `temp1`, `tempf`, `humidity1` |
| Wind | `windspeed`, `windgust`, `winddir` |
| Rain | `dailyrain`, `dailyrainin`, `drain_piezo` (+ weekly, monthly, yearly, event, rate) |
| Pressure | `baromrel`, `baromrelin`, `baromabs` |
| Solar/UV | `solarradiation`, `uv` |
| Lightning | `lightning`, `lightning_time`, `lightning_num` |
| Indoor temp/humidity | `tempinf`, `humidityin` |

If your sensor setup uses different field names, check `backend/app/mqtt/parser.py` — the mapping is straightforward to extend.

Cards for sensors you don't have (e.g., lightning if you only have a WH32) will simply not render or will show "No data."

## Project Structure

```
WaffleWeather/
├── openapi/
│   └── waffleweather.yaml        # OpenAPI 3.1 spec (API source of truth)
├── backend/
│   ├── pyproject.toml
│   ├── alembic/                   # Database migrations
│   └── app/
│       ├── main.py                # FastAPI app + MQTT lifecycle
│       ├── config.py              # Pydantic Settings (WW_ prefix)
│       ├── models/                # SQLAlchemy models (hypertables)
│       ├── schemas/               # Pydantic request/response schemas
│       ├── api/                   # REST + WebSocket endpoints
│       ├── services/              # Derived calculations, WS broadcast
│       └── mqtt/                  # MQTT subscriber + field parser
├── frontend/
│   ├── orval.config.ts            # API client codegen config
│   └── src/
│       ├── app/                   # Next.js pages (Observatory, Lightning, etc.)
│       ├── components/            # Dashboard cards, charts, UI primitives
│       ├── hooks/                 # useHistoryData, useTrends
│       ├── lib/                   # Units, utilities, fetch wrapper
│       ├── providers/             # React contexts (Query, Units, WebSocket)
│       └── generated/             # Orval output (gitignored)
├── deploy/
│   ├── setup.sh                   # One-time Pi setup
│   ├── nginx.conf                 # Reverse proxy config
│   ├── mosquitto.conf             # MQTT broker config
│   └── *.service                  # systemd unit files
└── scripts/
    ├── mqtt-test-publish.py       # Dev: publish test MQTT messages
    └── seed-data.py               # Dev: generate fake historical data
```

## Database

TimescaleDB powers the storage layer with two hypertables:

- **`weather_observations`** — one row per station per observation interval (~16s default), chunked by day
- **`lightning_events`** — detected strike events with delta counts and distance, chunked by week

Three continuous aggregates (hourly, daily, monthly) roll up key metrics hierarchically. Compression kicks in after 14 days, retention drops data after 1 year.

All derived values (dew point, heat index, wind chill, feels like, UTCI, Zambretti) are computed at query time, not stored. This keeps the schema clean and makes it easy to refine calculations without backfilling.

## Development

### Backend

```bash
cd backend
uv sync
uv run uvicorn app.main:app --reload --host 0.0.0.0
```

### Frontend

```bash
cd frontend
pnpm install
pnpm dev
```

To regenerate the API client after changing the OpenAPI spec:

```bash
cd frontend
pnpm orval
```

### Test data

If you don't have a live station connected, you can seed fake historical data and publish test MQTT messages:

```bash
cd scripts
uv run python seed-data.py
uv run python mqtt-test-publish.py
```

## Security Notes

WaffleWeather is designed for local network use. If you're exposing it to the internet, you should address:

- **HTTPS**: Configure TLS in Nginx (Let's Encrypt works well on a Pi)
- **Rate limiting**: Add Nginx rate limiting or application-level throttling
- **Security headers**: CSP, HSTS, X-Frame-Options, etc.
- **CORS**: Tighten the default `allow_methods=["*"]` in the backend config

API key authentication is available via Nginx header injection — the setup script generates a key automatically. When `WW_API_KEY` is set, all API requests must include a valid key. When unset, auth is disabled (suitable for LAN-only use).

## Credits

Built by Timothy Brown and [Claude](https://claude.ai) with lots of love and coffee.

## License

This project is provided as-is for personal and educational use. See [LICENSE](LICENSE) for details.
