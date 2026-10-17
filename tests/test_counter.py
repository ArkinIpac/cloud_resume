"""Tests for the visitor counter. They use a fake container, so no Azure account is needed."""
import json
import os
import sys

import pytest
from azure.cosmos import exceptions

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "api"))

import counter  # noqa: E402
import azure.functions as func  # noqa: E402


class FakeContainer:
    """Stands in for a Cosmos DB container and keeps items in a dict."""

    def __init__(self, items=None):
        self.items = items or {}

    def patch_item(self, item, partition_key, patch_operations):
        if item not in self.items:
            raise exceptions.CosmosResourceNotFoundError(message="not found")
        for op in patch_operations:
            assert op["op"] == "incr" and op["path"] == "/count"
            self.items[item]["count"] += op["value"]
        return dict(self.items[item])

    def upsert_item(self, body):
        self.items[body["id"]] = dict(body)
        return dict(body)


def make_request():
    return func.HttpRequest(method="GET", url="/api/counter", body=b"")


@pytest.fixture
def fake(monkeypatch):
    container = FakeContainer({"visitors": {"id": "visitors", "count": 41}})
    monkeypatch.setattr(counter, "get_container", lambda: container)
    return container


def test_returns_200_and_json(fake):
    response = counter.main(make_request())
    assert response.status_code == 200
    assert response.mimetype == "application/json"


def test_count_goes_up_by_one(fake):
    body = json.loads(counter.main(make_request()).get_body())
    assert body == {"count": 42}


def test_count_keeps_going_up(fake):
    counter.main(make_request())
    body = json.loads(counter.main(make_request()).get_body())
    assert body["count"] == 43


def test_creates_item_on_first_visit():
    container = FakeContainer()
    assert counter.increment(container) == 1
    assert container.items["visitors"]["count"] == 1


def test_returns_500_when_database_fails(monkeypatch):
    def broken():
        raise RuntimeError("no connection")

    monkeypatch.setattr(counter, "get_container", broken)
    response = counter.main(make_request())
    assert response.status_code == 500
    assert json.loads(response.get_body()) == {"error": "counter unavailable"}
