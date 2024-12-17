# Server

## Development

The application is written in [Pyhon](https://www.python.org) using [Flask](https://flask.palletsprojects.com/en/3.0.x/) web framework.

The dependencies are managed by [Poetry](https://python-poetry.org), you need to have this tool installed, to install
dependencies, run

```shell
poetry install
```

Running the application locally is done by executing the following command:

```shell
python -m app.scripts.run_server
```

Make sure you have the required environment variables set (see the [Configuration section](#configuration))

The code is statically checked by [Mypy](https://pypi.org/project/mypy/), [Black](https://pypi.org/project/black/) and
[Flake8](https://pypi.org/project/flake8/). This is done before every commit to the git repository and also in the git
repository after every commit.

You can set the code checking software the same way as it is done in the `pyproject.toml` file to run them in your IDE.

This project uses type hints checked by Mypy and the code is documented in the
[reST](https://en.wikipedia.org/wiki/ReStructuredText) format.

## Configuration

Server is a Flask app with multiple configurable environment variables:

- `SERVER_HOST` - specifies the host where the Flask app will run (`"0.0.0.0"` is default - not required)
- `SERVER_PORT` - specifies the port where the Flask app will run (`8086` is default - not required)
- `SERVER_DEBUG` - specifies whether to run the Flask app in debug mode (`TRUE`/`FALSE`, `FALSE` is default - not required)
- `SESSION_SECRET_KEY` - specifies the secret key for Flask session functionality
- `APP_FLOW_TYPE` - specifies the flow type of the application (`PRODUCTION`/`USER_STUDY`, `PRODUCTION` is default - not required)
- `PRODUCTION_UI_TYPE` - specifies the default UI type (`UNSEEN_STATISTICS`/`STOPPING_CRITERIA`, `STOPPING_CRITERIA` is default - not required)
- `RECOMMENDER_MODEL` - specifies the recommender system model, described more below
- `EXPLANATIONS_MODEL` - specifies the explanations model, described more below
- `STOPPING_CRITERIA_MODEL` - specifies the stopping criteria model, described more below
- `ALTERNATIVES_SIZE` - specifies the number of alternatives to be provided by the recommender system, (`10` is default - not required)
- `CDF_STEP` - specifies the size of the portion of products which should be contained in a continuous numerical attribute range, (`0.05` is default - not required, the final number of products in range is twice as large)
- `STOPPING_CRITERIA_PREFERENCE_THRESHOLD` - specifies the minimum metric value of stopping criteria presented to the user, (`0.0` is default - not required)

You can edit these variables in the file `server/.env`.

### Recommender model

The recommender model provides alternative products to the user, based on the candidates and discarded products.

The currently developed recommender models are:

- `set_based`
- `set_based_candidates_only`

Their description is provided directly in the code (file
`server/app/recommenders/{set_based|set_based_candidates_only}.py`).

How to add a new recommender model:

1. Add a new value to `RecommenderModel` enum (file `server/app/recommenders/abstract.py`).
2. Implement a subclass of `AbstractRecommender` (file `server/app/recommenders/abstract.py`). Implement its `predict` method and set its `model` attribute to the value defined in the previous step.
3. Import your class in `server/app/recommenders/__init__.py`.

If you want to change the recommender model that is used, change the environment variable `RECOMMENDER_MODEL` to a
different value of the `RecommenderModel` enum representing the model you want to use.

### Explanations generator model

The explanations model provides explanations of products and their attributes to the user.

The currently developed explanations models are:

- `content_based`
- `content_based_neutral`

Their description is provided directly in the code (file
`server/app/explanations/{content_based|content_based_neutral}.py`).

How to add a new explanations model:

1. Add a new value to `ExplanationsGeneratorModel` enum (file `server/app/explanations/abstract.py`).
2. Implement a subclass of `AbstractExplanationsGenerator` (file `server/app/explanations/abstract.py`). Implement its `explain` method and set its `model` attribute to the value defined in the previous step.
3. Import your class in `server/app/explanations/__init__.py`.

If you want to change the explanations model that is used, change the environment variable `EXPLANATIONS_MODEL` to a
different value of the `ExplanationsGeneratorModel` enum representing the model you want to use.

##### Stopping criteria generator model

The stopping criteria model provides stopping criteria based on products and attributes to the user.

The currently developed stopping criteria models are:

- `stopping_apriori`

Their description is provided directly in the code (file
`server/app/stopping_criteria/stopping_apriori.py`).

How to add a new stopping criteria model:

1. Add a new value to `StoppingCriteriaGeneratorModel` enum (file `server/app/stopping_criteria/abstract.py`).
2. Implement a subclass of `AbstractStoppingCriteriaGenerator` (file `server/app/stopping_criteria/abstract.py`). Implement its `generate` method and set its `model` attribute to the value defined in the previous step.
3. Import your class in `server/app/stopping_criteria/__init__.py`.

If you want to change the stopping criteria model that is used, change the environment variable `STOPPING_CRITERIA_MODEL` to a
different value of the `StoppingCriteriaGeneratorModel` enum representing the model you want to use.

### Data

The data used by this program are located in `server/data/main`.

Each category of the data needs to load images. These are stored in the `gui` app for simplicity. The exact location is
`gui/public/media/products`.

If you want to add a category of products, you need to provide two data files and images.

The first data file is a csv file containing the products, named `products.csv`. This file contains all products of the
category and all of their attribute values. The required columns are `id`, `name`, `Price [CZK]` (other currency is not
supported at the moment) and `rating`, the rest of the columns are attributes.

All of the attributes (including `name`, `Price [CZK]` and `rating`) must be defined in a file `attributes.json` as a
JSON list where each item can be parsed as `Attribute` (file `server/app/attribute.py`). The name of the column in the
`products.csv` file is the full name of the attribute.

For the currently implemented explanations to work, you need to provide a file `attributes_rating.csv`, which has four
columns: `attribute`, `value`, `rating` and `rating_count`. `attribute` is the full name of the attribute, `value` its
value, `rating` an average rating of all products with the same (attribute, value) pair and `rating_count` the number
of rated products with this (attribute, value) pair.

These two (or three) files must be stored in the folder `server/data/{main|test}/<category_name>`, the images must be
stored to `gui/public/media/products/<category_name>/<product_id>.jpg`. Category name is recommended not to contain
special characters, hyphens (-) will be replaced with spaces when presented to the user and the first letter will be
capitalized. Only `.jpg` images are supported at the moment, `product_id` is the `id` value of a product in the file
`products.csv`.

The server app will detect the folder with the data automatically, there is no need for adding the category name
anywhere.

## Deployment

Building the image to be deployed uses different version of Dockerfile than the default `gui/Dockerfile` and
`server/Dockerfile`. There is a second version of both of those files with filename `deploy.Dockerfile`, which should be
used when building Docker images to be deployed. The GUI image to be deployed uses [nginx engine](https://nginx.org) to
serve the application, and both of the images to be deployed are prepared to be built for `linux/amd64` architecture.
After these images are built, tagged and pushed to Docker repository, they can be deployed on cloud.

Command for building the image:

```shell
docker build -t [tag_name] -f deploy.Dockerfile .
```

Command for pushing the image to docker hub:

```shell
docker push [tag_name]
```
