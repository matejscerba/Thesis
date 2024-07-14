import json
import os
from typing import Dict, Set, List, Optional, Any

import pandas as pd

from app.attributes.attribute import CategoryAttributes, AttributeName
from app.products.category import UnorganizedCategory


class DataLoader:
    @classmethod
    def load(cls) -> pd.DataFrame:
        return pd.read_csv("data/laptops_numerical_with_price.csv", delimiter=";")

    @classmethod
    def load_products(
        cls, category_name: str, usecols: Optional[List[str]] = None, userows: Optional[Set[int]] = None
    ) -> pd.DataFrame:
        filename = "products"
        if category_name == "laptops" and os.environ.get("TEST_DATA", "FALSE").upper() == "TRUE":
            filename = "mac_large"
        data = pd.read_csv(
            f"data/{category_name}/{filename}.csv", sep=";", usecols=["id", *usecols] if usecols is not None else None
        ).replace({float("nan"): None})
        if userows is not None:
            data = data[data["id"].apply(lambda x: x in userows)]
        return data

    @classmethod
    def load_product(cls, category_name: str, product_id: int, usecols: Optional[List[str]] = None) -> pd.Series:
        return cls.load_products(category_name=category_name, usecols=usecols, userows={product_id}).iloc[0]

    @classmethod
    def load_categories(cls) -> List[str]:
        with open("data/categories.json", mode="r") as file:
            return json.load(file)

    @classmethod
    def load_category(cls, category_name: str) -> UnorganizedCategory:
        return UnorganizedCategory.from_dataframe(
            cls.load_products(
                category_name=category_name,
                usecols=[AttributeName.NAME.value, AttributeName.PRICE.value, AttributeName.RATING.value],
            )
        )

    @classmethod
    def load_attributes(cls, category_name: str) -> CategoryAttributes:
        with open(f"data/{category_name}/attributes.json", mode="r") as file:
            return CategoryAttributes.from_data(json.load(file))

    @classmethod
    def load_ratings(cls, category_name: str, attribute_name: str, values: pd.Series) -> pd.Series:
        df = pd.read_csv(f"data/{category_name}/attributes_rating.csv", sep=";").replace({float("nan"): None})
        df = df[df["attribute"] == attribute_name]
        mapping = dict(zip(df["value"].astype(str), df["rating"]))
        return pd.Series([mapping.get(str(value)) for value in values])

    @classmethod
    def load_rating(cls, category_name: str, attribute_name: str, value: Any) -> float:
        return cls.load_ratings(
            category_name=category_name, attribute_name=attribute_name, values=pd.Series([value])
        ).tolist()[0]

    @classmethod
    def get_ids_for_value(cls, data: pd.DataFrame) -> Dict[str, Dict[float, Set[int]]]:
        ids_for_value: Dict[str, Dict[float, Set[int]]] = {}

        for column in data:
            if column not in ["id", "Unnamed: 0"]:
                unique_values = data[column].unique()
                ids_for_value[str(column)] = {}
                for value in unique_values:
                    if pd.isna(value):
                        ids_for_value[str(column)][value] = set(data[data[column].isna()]["id"])
                    else:
                        ids_for_value[str(column)][value] = set(data[data[column] == value]["id"])

        return ids_for_value

    @classmethod
    def get_ids_for_value_compact(cls, data: pd.DataFrame) -> Dict[str, Set[int]]:
        ids_for_value = {}

        for column in data:
            if column not in ["id", "Unnamed: 0"]:
                unique_values = data[column].unique()
                for value in unique_values:
                    column_value = f"{column}:{value}"
                    if pd.isna(value):
                        ids_for_value[column_value] = set(data[data[column].isna()]["id"])
                    else:
                        ids_for_value[column_value] = set(data[data[column] == value]["id"])

        return ids_for_value
