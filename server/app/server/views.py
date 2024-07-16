from flask import request, Response, jsonify

from app.attributes.attribute import FilterValue
from app.attributes.handler import AttributeHandler
from app.products.handler import ProductHandler


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

    :raise Exception: if required argument or body contents are missing
    :return: JSON response containing the requested category
    :rtype: Response
    """
    category_name = request.args.get("category_name")
    if category_name is None:
        raise Exception("Category name not set.")

    request_json = request.json or {}
    candidate_ids = request_json.get("candidates", [])
    discarded_ids = request_json.get("discarded", [])
    important_attributes = request_json.get("important_attributes", [])
    limit = request_json.get("limit")

    data = ProductHandler.organize_category(
        category_name=category_name,
        candidate_ids=set(candidate_ids),
        discarded_ids=set(discarded_ids),
        important_attributes=important_attributes,
        limit=limit,
    )

    return jsonify(data)


def view_category_filter() -> Response:
    """HTTP view method providing list of products of a category filtered by an attribute.

    The request has one argument `category_name`, stating the name of the category.
    The body of the request is expected to be JSON containing the following items:
    `attribute`: name of the attribute to be filtered, expected type `str`
    `value`: filter value as a `dict` that can be parsed as `FilterValue`
    `candidates`: list of ids of candidate products, expected type `List[int]`
    `discarded`: list of ids of discarded products, expected type `List[int]`

    :raise Exception: if required argument or body contents are missing
    :return: JSON response containing the list of filtered products
    :rtype: Response
    """
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

    products = ProductHandler.filter_category(
        category_name=category_name,
        attribute_name=attribute,
        value=FilterValue.model_validate(value),
        candidate_ids=set(candidate_ids),
        discarded_ids=set(discarded_ids),
    )

    return jsonify(products)


def view_attributes() -> Response:
    """HTTP view method providing attributes of a category

    The request has one argument `category_name`, stating the name of the category.

    :raise Exception: if required argument are missing
    :return: JSON response containing attributes used in the given category
    :rtype: Response
    """
    category_name = request.args.get("category_name")
    if category_name is None:
        raise Exception("Category name not set.")

    data = AttributeHandler.get_attributes(category_name=category_name)

    return jsonify(data)


def view_discarded() -> Response:
    """HTTP view method providing discarded products.

    The request has one argument `category_name`, stating the name of the category.
    The body of the request is expected to be JSON containing the following items:
    `discarded`: list of ids of discarded products, expected type `List[int]`

    :raise Exception: if required argument or body contents are missing
    :return: JSON response containing the discarded products
    :rtype: Response
    """
    category_name = request.args.get("category_name")
    request_json = request.json or {}
    discarded_ids = request_json.get("discarded")

    if category_name is None:
        raise Exception("Category name not set.")

    if discarded_ids is None:
        raise Exception("Discarded products ids not set.")

    products = ProductHandler.get_products(category_name=category_name, ids=discarded_ids)

    return jsonify(products)


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
    candidate_ids = request_json.get("candidates", [])
    discarded_ids = request_json.get("discarded", [])
    important_attributes = request_json.get("important_attributes", [])

    explanation = ProductHandler.explain(
        category_name=category_name,
        product_id=int(product_id),
        candidate_ids=set(candidate_ids),
        discarded_ids=set(discarded_ids),
        important_attributes=important_attributes,
    )

    return jsonify(explanation)
