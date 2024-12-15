import json
import os
from typing import Set, List, Optional, Any

import pandas as pd

from app.attributes.attribute import CategoryAttributes, AttributeName, Attribute
from app.products.category import UnorganizedCategory


class DataLoader:
    """This class handles loading of all data used by the application."""

    @classmethod
    def get_root_dir(cls) -> str:
        """Gets the path to the root directory containing the data.

        :return: the path to the root directory containing the data
        :rtype: str
        """
        return "data/main"

    @classmethod
    def load_products(
        cls, category_name: str, usecols: Optional[List[str]] = None, userows: Optional[Set[int]] = None
    ) -> pd.DataFrame:
        """Loads products of a given category name, can select columns (attributes) and rows of the loaded dataframe.

        :param str category_name: name of the category to be loaded
        :param Optional[List[str]] usecols: names of columns (attributes) to be included, all included if `None`,
        default `None`
        :param Optional[Set[int]] userows: IDs of products to be included, all loaded if `None`, default `None`
        :return: dataframe containing the products of a given category
        :rtype: pd.DataFrame
        """
        data = pd.read_csv(
            f"{cls.get_root_dir()}/{category_name}/products.csv",
            sep=";",
            usecols=["id", *usecols] if usecols is not None else None,
        ).replace({float("nan"): None})
        if userows is not None:
            data = data[data["id"].apply(lambda x: x in userows)]
        return data

    @classmethod
    def load_product(cls, category_name: str, product_id: int, usecols: Optional[List[str]] = None) -> pd.Series:
        """Loads product of a given category, can select columns (attributes).

        :param str category_name: name of the category to consider
        :param int product_id: ID of the product to load
        :param Optional[List[str]] usecols: names of columns (attributes) to be included, all included if `None`,
        default `None`
        :return: series representing a product
        :rtype: pd.Series
        """
        return cls.load_products(category_name=category_name, usecols=usecols, userows={product_id}).iloc[0]

    @classmethod
    def load_categories(cls) -> List[str]:
        """Loads a list of categories supported by the application.

        :return: names of all categories
        :rtype: list
        """
        return sorted(
            [
                name
                for name in os.listdir(cls.get_root_dir())
                if os.path.isdir(os.path.join(cls.get_root_dir(), name)) and not name.startswith(".")
            ]
        )

    @classmethod
    def load_category(cls, category_name: str) -> UnorganizedCategory:
        """Load a category with its products as an object.

        :param str category_name: name of the category to be loaded
        :return: category represented as an object
        :rtype: UnorganizedCategory
        """
        return UnorganizedCategory.from_dataframe(
            cls.load_products(
                category_name=category_name,
                usecols=[AttributeName.NAME.value, AttributeName.PRICE.value, AttributeName.RATING.value],
            )
        )

    @classmethod
    def load_attributes(cls, category_name: str) -> CategoryAttributes:
        """Load attributes of a category.

        :param str category_name: name of the category
        :return: attributes of the category
        :rtype: CategoryAttributes
        """
        with open(f"{cls.get_root_dir()}/{category_name}/attributes.json", mode="r") as file:
            return CategoryAttributes.from_data(json.load(file))

    @classmethod
    def load_attribute(cls, category_name: str, attribute_name: str) -> Attribute:
        """Load a specified attribute.

        :param str category_name: name of the category
        :param str attribute_name: name of the attribute
        :return: attribute of the given name of a given category
        :rtype: Attribute
        """
        attributes = cls.load_attributes(category_name=category_name)
        return attributes.attributes[attribute_name]

    @classmethod
    def load_ratings(cls, category_name: str, attribute_name: str, values: pd.Series) -> pd.Series:
        """Load ratings of values of an attribute.

        :param str category_name: name of the category
        :param str attribute_name: name of the attribute
        :param pd.Series values: values of the attribute for which ratings will be loaded
        :return: ratings of the given values
        :rtype: pd.Series
        """
        df = pd.read_csv(f"{cls.get_root_dir()}/{category_name}/attributes_rating.csv", sep=";").replace(
            {float("nan"): None}
        )
        df = df[df["attribute"] == attribute_name]
        mapping = dict(zip(df["value"].astype(str), df["rating"]))
        return pd.Series([mapping.get(str(value)) for value in values])

    @classmethod
    def load_rating(cls, category_name: str, attribute_name: str, value: Any) -> Optional[float]:
        """Load rating of a given value of an attribute.

        :param str category_name: name of the category
        :param str attribute_name: name of the attribute
        :param Any value: value of the attribute
        :return: rating of a value of an attribute
        :rtype: Optional[float]
        """
        return cls.load_ratings(
            category_name=category_name, attribute_name=attribute_name, values=pd.Series([value])
        ).tolist()[0]
