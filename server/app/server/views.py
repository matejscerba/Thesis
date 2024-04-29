from flask import request, Response, jsonify

from app.products.simple import SimpleProductHandler


def view_category() -> Response:
    name = request.args.get("name")
    candidate_ids = request.json.get("candidates")
    discarded_ids = request.json.get("discarded")
    data = SimpleProductHandler.organize_category(
        name=name, candidate_ids=candidate_ids, discarded_ids=discarded_ids
    ).model_dump()
    return jsonify(data)
