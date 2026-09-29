"""
core/logging.py
===============
Production-ready logging configuration for Prompt2Form.

Features:
  - Colored console output (via colorlog)
  - ISO-8601 timestamps
  - Log level filtering
  - Structured format: [TIMESTAMP] [LEVEL] [logger_name] — message
  - Graceful fallback if colorlog is not installed
"""

import logging
import sys
from app.core.config import settings


# ------------------------------------------------------------------
# Color mapping for each log level
# ------------------------------------------------------------------
_LOG_COLORS: dict[str, str] = {
    "DEBUG": "cyan",
    "INFO": "green",
    "WARNING": "yellow",
    "ERROR": "red",
    "CRITICAL": "bold_red",
}

_FORMAT = "%(asctime)s  %(log_color)s%(levelname)-8s%(reset)s  %(name)s — %(message)s"
_DATE_FORMAT = "%Y-%m-%d %H:%M:%S"
_PLAIN_FORMAT = "%(asctime)s  %(levelname)-8s  %(name)s — %(message)s"


def _build_colored_handler() -> logging.StreamHandler:  # type: ignore[type-arg]
    """Return a StreamHandler with colorlog formatting."""
    try:
        import colorlog  # noqa: PLC0415

        formatter = colorlog.ColoredFormatter(
            fmt=_FORMAT,
            datefmt=_DATE_FORMAT,
            log_colors=_LOG_COLORS,
            reset=True,
            style="%",
        )
    except ImportError:
        # Graceful fallback — plain formatter, no colours
        formatter = logging.Formatter(fmt=_PLAIN_FORMAT, datefmt=_DATE_FORMAT)

    handler = logging.StreamHandler(sys.stdout)
    handler.setFormatter(formatter)
    return handler


def setup_logging() -> None:
    """
    Configure the root logger and suppress noisy third-party loggers.

    Call this once at application startup (inside app/main.py).
    """
    level = logging.DEBUG if settings.debug else logging.INFO

    root_logger = logging.getLogger()
    root_logger.setLevel(level)

    # Remove any existing handlers to avoid duplicate log lines
    root_logger.handlers.clear()
    root_logger.addHandler(_build_colored_handler())

    # Suppress noisy third-party loggers
    for noisy in ("uvicorn.access", "httpx", "httpcore"):
        logging.getLogger(noisy).setLevel(logging.WARNING)

    # Keep uvicorn.error visible (it reports server lifecycle events)
    logging.getLogger("uvicorn.error").setLevel(logging.INFO)


def get_logger(name: str) -> logging.Logger:
    """
    Factory function — returns a named logger.

    Usage:
        from app.core.logging import get_logger
        logger = get_logger(__name__)
        logger.info("Hello from my module")
    """
    return logging.getLogger(name)
