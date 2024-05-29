from flask import request, Response, jsonify

from app.data_loader import DataLoader
from app.products.simple import SimpleProductHandler


def view_category() -> Response:
    category_name = request.args.get("category_name")
    if category_name is None:
        raise Exception("Category name not set.")

    request_json = request.json or {}
    candidate_ids = request_json.get("candidates", [])
    discarded_ids = request_json.get("discarded", [])

    data = SimpleProductHandler.organize_category(
        category_name=category_name, candidate_ids=candidate_ids, discarded_ids=discarded_ids
    ).model_dump()

    return jsonify(data)


def view_attributes() -> Response:
    category_name = request.args.get("category_name")
    if category_name is None:
        raise Exception("Category name not set.")

    data = DataLoader.load_attributes(category_name=category_name).model_dump()

    return jsonify(data)


def view_discarded() -> Response:
    category_name = request.args.get("category_name")
    request_json = request.json or {}
    discarded_ids = request_json.get("discarded")

    if category_name is None:
        raise Exception("Category name not set.")

    if discarded_ids is None:
        raise Exception("Discarded products ids not set.")

    products = SimpleProductHandler.get_products(category_name=category_name, ids=discarded_ids)

    return jsonify([product.model_dump() for product in products])
