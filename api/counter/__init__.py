"""Visitor counter API: adds 1 to the count in Cosmos DB and returns the new total."""
import json
import logging
import os

import azure.functions as func
from azure.cosmos import CosmosClient, exceptions

DATABASE = "resume"
CONTAINER = "counter"
ITEM_ID = "visitors"

# Created once and reused, so warm requests don't reconnect to Cosmos DB.
_container = None


def get_container():
    global _container
    if _container is None:
        client = CosmosClient.from_connection_string(os.environ["COSMOS_CONNECTION_STRING"])
        _container = client.get_database_client(DATABASE).get_container_client(CONTAINER)
    return _container


def increment(container):
    """Adds 1 to the count and returns the new value.

    The "incr" patch runs inside Cosmos DB, so two visitors at the same moment
    can't overwrite each other's update.
    """
    try:
        item = container.patch_item(
            item=ITEM_ID,
            partition_key=ITEM_ID,
            patch_operations=[{"op": "incr", "path": "/count", "value": 1}],
        )
    except exceptions.CosmosResourceNotFoundError:
        # First visit ever: the item doesn't exist yet.
        item = container.upsert_item({"id": ITEM_ID, "count": 1})
    return item["count"]


def main(req: func.HttpRequest) -> func.HttpResponse:
    try:
        count = increment(get_container())
    except Exception:
        logging.exception("Could not update the visitor count")
        return func.HttpResponse(
            json.dumps({"error": "counter unavailable"}),
            status_code=500,
            mimetype="application/json",
        )

    return func.HttpResponse(
        json.dumps({"count": count}),
        status_code=200,
        mimetype="application/json",
        headers={"Cache-Control": "no-store"},
    )
