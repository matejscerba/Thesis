from flask import request, Response, jsonify

from app.data_loader import DataLoader
from app.products.simple import SimpleProductHandler, FilterValue
from app.recommenders.set_based import SetBasedRecommender


def view_category() -> Response:
    category_name = request.args.get("category_name")
    if category_name is None:
        raise Exception("Category name not set.")

    request_json = request.json or {}
    candidate_ids = request_json.get("candidates", [])
    discarded_ids = request_json.get("discarded", [])
    important_attributes = request_json.get("important_attributes", [])
    limit = request_json.get("limit")

    data = SimpleProductHandler.organize_category(
        category_name=category_name,
        candidate_ids=set(candidate_ids),
        discarded_ids=set(discarded_ids),
        important_attributes=important_attributes,
        limit=limit,
    )

    return jsonify(data)


def view_category_filter() -> Response:
    category_name = request.args.get("category_name")
    if category_name is None:
        raise Exception("Category name not set.")

    request_json = request.json or {}
    attribute = request_json.get("attribute")
    if attribute is None:
        raise Exception("Attribute for filter not set.")

    value = request_json.get("value")
    if value is None:
        raise Exception("Value for filter not set.")

    candidate_ids = request_json.get("candidates", [])
    discarded_ids = request_json.get("discarded", [])

    products = SimpleProductHandler.filter_category(
        category_name=category_name,
        attribute_name=attribute,
        value=FilterValue.model_validate(value),
        candidate_ids=set(candidate_ids),
        discarded_ids=set(discarded_ids),
    )

    return jsonify(products)


def view_attributes() -> Response:
    category_name = request.args.get("category_name")
    if category_name is None:
        raise Exception("Category name not set.")

    data = DataLoader.load_attributes(category_name=category_name)
    data.drop_unused(category_name=category_name)

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

    return jsonify(products)


def view_explanation() -> Response:
    category_name = request.args.get("category_name")
    if category_name is None:
        raise Exception("Category name not set.")

    product_id = request.args.get("product_id")
    if product_id is None:
        raise Exception("Product id not set.")

    request_json = request.json or {}
    candidate_ids = request_json.get("candidates", [])
    discarded_ids = request_json.get("discarded", [])
    important_attributes = request_json.get("important_attributes", [])

    explanation = SetBasedRecommender.explain(
        category_name=category_name,
        product_id=int(product_id),
        candidate_ids=set(candidate_ids),
        discarded_ids=set(discarded_ids),
        important_attributes=important_attributes,
    )

    return jsonify(explanation)
