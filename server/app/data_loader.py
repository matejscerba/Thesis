import json
import os
from typing import Dict, Set, List, Optional

import pandas as pd

from app.attributes.attribute import CategoryAttributes
from app.products.category import UnorganizedCategory


class DataLoader:
    @classmethod
    def load(cls) -> pd.DataFrame:
        return pd.read_csv("data/laptops_numerical_with_price.csv", delimiter=";")

    @classmethod
    def load_products(cls, category_name: str, usecols: Optional[List[str]] = None) -> pd.DataFrame:
        filename = "products"
        if os.environ.get("TEST_DATA", "FALSE").upper() == "TRUE":
            filename = "mac_large"
        return pd.read_csv(
            f"data/{category_name}/{filename}.csv", sep=";", usecols=["id", *usecols] if usecols is not None else None
        )

    @classmethod
    def load_category(cls, category_name: str) -> UnorganizedCategory:
        return UnorganizedCategory.from_dataframe(cls.load_products(category_name=category_name))

    @classmethod
    def load_attributes(cls, category_name: str) -> CategoryAttributes:
        with open(f"data/{category_name}/attributes.json", mode="r") as file:
            return CategoryAttributes.from_data(json.load(file))

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
