"""Add filtered column to lightning_events for ghost strike suppression.

Revision ID: 006
Revises: 005
Create Date: 2026-04-10

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = "006"
down_revision: Union[str, None] = "005"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "lightning_events",
        sa.Column("filtered", sa.Boolean(), nullable=False, server_default=sa.text("false")),
    )

    # Backfill existing ghost strikes (isolated singles at known EMI distances)
    op.execute(
        "UPDATE lightning_events SET filtered = true "
        "WHERE new_strikes = 1 AND distance_km IN (12, 14)"
    )

    # Partial index for the common query path (exclude filtered events)
    op.create_index(
        "ix_lightning_events_unfiltered",
        "lightning_events",
        ["timestamp"],
        postgresql_where=sa.text("filtered = false"),
    )


def downgrade() -> None:
    op.drop_index("ix_lightning_events_unfiltered", table_name="lightning_events")
    op.drop_column("lightning_events", "filtered")
