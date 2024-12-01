from typing import cast

from flask import request, Response, jsonify

from app.attributes.attribute import MultiFilterItem
from app.attributes.handler import AttributeHandler
from app.event_logger import EventLogger, Event
from app.products.category import OrganizedCategory
from app.products.handler import ProductHandler
from app.server.context import context


def view_categories() -> Response:
    """HTTP view method listing categories.

    :return: JSON response containing the list of categories names
    :rtype: Response
    """
    categories = ProductHandler.get_categories()
    return jsonify(categories)


def view_category() -> Response:
    """HTTP view method providing category of products.

    The request has one argument `category_name`, stating the name of the category.
    The body of the request is expected to be JSON containing the following items:
    `candidates`: list of ids of candidate products, expected type `List[int]`
    `discarded`: list of ids of discarded products, expected type `List[int]`
    `important_attributes`: names of the important attributes, expected type `List[str]`
    `limit`: maximum number of products to return if the category is not organized, return all if `None`

    :return: JSON response containing the requested category
    :rtype: Response
    :raise Exception: if required argument or body contents are missing
    """
    category_name = request.args.get("category_name")
    if category_name is None:
        raise Exception("Category name not set.")

    request_json = request.json or {}
    candidate_ids = set(request_json.get("candidates", []))
    discarded_ids = set(request_json.get("discarded", []))
    important_attributes = request_json.get("important_attributes", [])
    limit = int(cast(str, request_json.get("limit"))) if request_json.get("limit") is not None else None

    context.category_name = category_name
    context.candidates = candidate_ids
    context.discarded = discarded_ids
    context.important_attributes = important_attributes
    context.limit = limit

    category = ProductHandler.organize_category(
        category_name=context.category_name,
        candidate_ids=context.candidates,
        discarded_ids=context.discarded,
        important_attributes=context.important_attributes,
        limit=context.limit,
    )

    if category.organized:
        context.alternatives = [product.id for product in cast(OrganizedCategory, category).alternatives]
        context.unseen_statistics = cast(OrganizedCategory, category).unseen
    else:
        context.alternatives = None
        context.unseen_statistics = None

    return jsonify(category)


def view_category_filter() -> Response:
    """HTTP view method providing list of products of a category filtered by an attribute.

    The request has one argument `category_name`, stating the name of the category.
    The body of the request is expected to be JSON containing the following items:
    `attribute`: name of the attribute to be filtered, expected type `str`
    `value`: filter value as a `dict` that can be parsed as `FilterValue`
    `candidates`: list of ids of candidate products, expected type `List[int]`
    `discarded`: list of ids of discarded products, expected type `List[int]`

    :return: JSON response containing the list of filtered products
    :rtype: Response
    :raise Exception: if required argument or body contents are missing
    """
    request_json = request.json or {}
    filter_items = request_json.get("filter")
    if filter_items is None:
        raise Exception("Filter items for filter not set.")
    filter = [MultiFilterItem.model_validate(item) for item in filter_items]

    category = ProductHandler.filter_category(
        category_name=context.category_name,
        candidate_ids=context.candidates,
        discarded_ids=context.discarded,
        filter=filter,
    )

    return jsonify(category)


def view_attributes() -> Response:
    """HTTP view method providing attributes of a category

    The request has one argument `category_name`, stating the name of the category.

    :return: JSON response containing attributes used in the given category
    :rtype: Response
    :raise Exception: if required argument are missing
    """
    category_name = request.args.get("category_name")
    if category_name is None:
        raise Exception("Category name not set.")

    context.category_name = category_name

    return jsonify(AttributeHandler.get_attributes(category_name=context.category_name))


def view_discarded() -> Response:
    """HTTP view method providing discarded products.

    The request has one argument `category_name`, stating the name of the category.
    The body of the request is expected to be JSON containing the following items:
    `discarded`: list of ids of discarded products, expected type `List[int]`

    :return: JSON response containing the discarded products
    :rtype: Response
    :raise Exception: if required argument or body contents are missing
    """
    category_name = request.args.get("category_name")
    request_json = request.json or {}
    discarded_ids = request_json.get("discarded")

    if category_name is None:
        raise Exception("Category name not set.")

    if discarded_ids is None:
        raise Exception("Discarded products ids not set.")

    return jsonify(ProductHandler.get_products(category_name=category_name, ids=discarded_ids))


def view_explanation() -> Response:
    """HTTP view method providing explanation of a product.

    The request has two arguments:
    `category_name`: name of the category
    `product_id`: id of the product
    The body of the request is expected to be JSON containing the following items:
    `candidates`: list of ids of candidate products, expected type `List[int]`
    `discarded`: list of ids of discarded products, expected type `List[int]`
    `important_attributes`: names of the important attributes, expected type `List[str]`

    :return: JSON response containing the explanation of the given product
    :rtype: Response
    """
    category_name = request.args.get("category_name")
    if category_name is None:
        raise Exception("Category name not set.")

    product_id = request.args.get("product_id")
    if product_id is None:
        raise Exception("Product id not set.")

    request_json = request.json or {}
    candidate_ids = set(request_json.get("candidates", []))
    discarded_ids = set(request_json.get("discarded", []))
    important_attributes = request_json.get("important_attributes", [])

    return jsonify(
        ProductHandler.explain_product(
            category_name=category_name,
            product_id=int(product_id),
            candidate_ids=candidate_ids,
            discarded_ids=discarded_ids,
            important_attributes=important_attributes,
        )
    )


def view_stopping_criteria() -> Response:
    category_name = request.args.get("category_name")
    if category_name is None:
        raise Exception("Category name not set.")

    request_json = request.json or {}
    candidate_ids = set(request_json.get("candidates", []))
    discarded_ids = set(request_json.get("discarded", []))
    important_attributes = request_json.get("important_attributes", [])

    return jsonify(
        ProductHandler.generate_stopping_criteria(
            category_name=category_name,
            candidate_ids=candidate_ids,
            discarded_ids=discarded_ids,
            important_attributes=important_attributes,
        )
    )


def view_log_event() -> Response:
    event = request.args.get("event")
    if event is None:
        raise Exception("Log event not set.")

    data = request.json

    EventLogger().log(event=Event[event], data=data)

    return jsonify({"success": True})
