import json

from recommenders.similarity import SimilarityRecommender

if __name__ == "__main__":
    print(json.dumps(SimilarityRecommender.predict(), indent=4, ensure_ascii=False))
