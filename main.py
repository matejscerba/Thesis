import json

from recommenders.similarity import SimilarityRecommender
from recommenders.statements_simple import StatementsSimpleRecommender

if __name__ == "__main__":
    # Recommender = SimilarityRecommender
    Recommender = StatementsSimpleRecommender

    print(json.dumps(Recommender.predict(), indent=4, ensure_ascii=False))
