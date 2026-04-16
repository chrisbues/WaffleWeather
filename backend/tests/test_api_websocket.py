"""Tests for WebSocket endpoint origin validation (and related handshake behavior)."""
from unittest.mock import patch

import pytest
from fastapi.testclient import TestClient

from app.config import Settings
from app.main import app


def test_ws_rejects_unknown_origin():
    settings = Settings(cors_origins=["https://allowed.example"])
    with patch("app.api.websocket.settings", settings):
        with TestClient(app) as client:
            with pytest.raises(Exception):
                with client.websocket_connect(
                    "/ws/live", headers={"Origin": "https://evil.example"}
                ):
                    pytest.fail("Should have been rejected before accept")


def test_ws_accepts_configured_origin():
    settings = Settings(cors_origins=["https://allowed.example"])
    with patch("app.api.websocket.settings", settings):
        with TestClient(app) as client:
            # Connecting with a configured origin should succeed (no exception)
            with client.websocket_connect(
                "/ws/live", headers={"Origin": "https://allowed.example"}
            ) as ws:
                # Close cleanly; we just want to prove the handshake succeeded.
                ws.close()


def test_ws_allows_missing_origin_when_origins_unset():
    """If cors_origins is empty, don't enforce origin (local dev)."""
    settings = Settings(cors_origins=[])
    with patch("app.api.websocket.settings", settings):
        with TestClient(app) as client:
            # No Origin header at all — should succeed (or at least not be rejected by origin check)
            with client.websocket_connect("/ws/live") as ws:
                ws.close()
