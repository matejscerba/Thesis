from flask import request, Response, jsonify

from app.products.simple import SimpleProductHandler


def view_category() -> Response:
    name = request.args.get("name")
    if name is None:
        raise Exception("Category name not set.")

    request_json = request.json or {}
    candidate_ids = request_json.get("candidates", [])
    discarded_ids = request_json.get("discarded", [])

    data = SimpleProductHandler.organize_category(
        name=name, candidate_ids=candidate_ids, discarded_ids=discarded_ids
    ).model_dump()

    return jsonify(data)


def view_discarded() -> Response:
    name = request.args.get("name")
    request_json = request.json or {}
    discarded_ids = request_json.get("discarded")

    if name is None:
        raise Exception("Category name not set.")

    if discarded_ids is None:
        raise Exception("Discarded products ids not set.")

    products = SimpleProductHandler.get_products(name=name, ids=discarded_ids)

    return jsonify([product.model_dump() for product in products])
