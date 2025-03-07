import os
from typing import Tuple, ClassVar

import pandas as pd

from app.attributes.attribute import CategoryAttributes
from app.data_loader import DataLoader


class AttributeHandler:
    """This class handles operations with the attributes.

    :param ClassVar[float] CDF_STEP: half of the size of a continuous attribute filter range in terms of cdf
    """

    CDF_STEP: ClassVar[float] = float(os.environ.get("CDF_STEP", "0.05"))

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
        """Gets bounds of a range containing a continuous attribute's value.

        Every range generated by this method contains 2 * cls.CDF_STEP % of values, the centers of the ranges are at
        values which cdf equals cdf(initial_value) + 2 * k * cls.CDF_STEP where k is a whole number.

        :param str attribute_name: the name of the attribute
        :param float value: the value of the attribute
        :param float initial_value: the initial value of the attribute
        :param pd.DataFrame products: the products in the current category
        :return: attributes of a category
        :rtype: CategoryAttributes
        """

        # Compute cdf of all products
        statistics = products.groupby(attribute_name)[attribute_name].agg("count").pipe(pd.DataFrame)
        statistics["pdf"] = statistics[attribute_name] / sum(statistics[attribute_name])
        statistics["cdf"] = statistics["pdf"].cumsum()

        # Move to a range containing value
        initial_cdf = statistics["cdf"][initial_value]
        value_cdf = statistics["cdf"][value]
        cdf = initial_cdf
        while value_cdf <= cdf - cls.CDF_STEP:
            cdf -= cls.CDF_STEP

        # Get lower bound
        min_cdf = statistics.loc[statistics["cdf"] <= cdf - cls.CDF_STEP]["cdf"].max()
        lower_bound = products[attribute_name].min()
        if min_cdf is not None:
            try:
                lower_bound = statistics.loc[statistics["cdf"] == min_cdf][attribute_name].index[0]
            except Exception:
                pass

        # Get upper bound
        max_cdf = statistics.loc[statistics["cdf"] >= cdf + cls.CDF_STEP]["cdf"].min()
        upper_bound = products[attribute_name].max()
        if max_cdf is not None:
            try:
                upper_bound = statistics.loc[statistics["cdf"] == max_cdf][attribute_name].index[0]
            except Exception:
                pass
        return lower_bound, upper_bound
