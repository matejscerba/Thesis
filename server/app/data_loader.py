from typing import Dict, Set

import pandas as pd


class DataLoader:
    @classmethod
    def load(cls) -> pd.DataFrame:
        return pd.read_csv("data/laptops_numerical_with_price.csv", delimiter=";")

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
