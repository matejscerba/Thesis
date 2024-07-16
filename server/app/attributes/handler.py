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
