from flask import request, Response, jsonify

from app.products.simple import SimpleProductHandler


def view_category() -> Response:
    name = request.args.get("name")
    if name is None:
        raise Exception("Category name not set.")

    candidate_ids = None
    discarded_ids = None
    request_json = request.json
    if request_json is not None:
        candidate_ids = request_json.get("candidates")
        discarded_ids = request_json.get("discarded")

    data = SimpleProductHandler.organize_category(
        name=name, candidate_ids=candidate_ids, discarded_ids=discarded_ids
    ).model_dump()

    return jsonify(data)
