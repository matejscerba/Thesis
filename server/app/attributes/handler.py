from typing import Tuple

import pandas as pd

from app.attributes.attribute import CategoryAttributes
from app.data_loader import DataLoader


class AttributeHandler:
    """This class handles operations with the attributes."""

    @classmethod
    def get_attributes(cls, category_name: str) -> CategoryAttributes:
        """Gets all attributes used in the given category.

        :param str category_name: the name of the category
        :return: attributes of a category
        :rtype: CategoryAttributes
        """
        data = DataLoader.load_attributes(category_name=category_name)
        data.drop_unused(category_name=category_name)
        return data

    @classmethod
    def get_filter_value_bounds(
        cls, attribute_name: str, value: float, initial_value: float, products: pd.DataFrame
    ) -> Tuple[float, float]:
        statistics = products.groupby(attribute_name)[attribute_name].agg("count").pipe(pd.DataFrame)
        statistics["pdf"] = statistics[attribute_name] / sum(statistics[attribute_name])
        statistics["cdf"] = statistics["pdf"].cumsum()

        initial_cdf = statistics["cdf"][initial_value]
        value_cdf = statistics["cdf"][value]
        cdf = initial_cdf
        while value_cdf <= cdf - 0.05:
            cdf -= 0.05

        min_cdf = statistics.loc[statistics["cdf"] <= cdf - 0.05]["cdf"].max()
        lower_bound = products[attribute_name].min()
        if min_cdf is not None:
            try:
                lower_bound = statistics.loc[statistics["cdf"] == min_cdf][attribute_name].index[0]
            except Exception:
                pass
        max_cdf = statistics.loc[statistics["cdf"] >= cdf + 0.05]["cdf"].min()
        upper_bound = products[attribute_name].max()
        if max_cdf is not None:
            try:
                upper_bound = statistics.loc[statistics["cdf"] == max_cdf][attribute_name].index[0]
            except Exception:
                pass
        return lower_bound, upper_bound
