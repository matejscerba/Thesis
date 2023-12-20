import pandas as pd


class DataLoader:
    @classmethod
    def load(cls) -> pd.DataFrame:
        return pd.read_csv("data/laptops_numerical.csv", delimiter=";")