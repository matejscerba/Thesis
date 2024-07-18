# Explaining Recommender Systems in Content-rich Domains

This repository contains a demo implementation of a system helping customers select a product from an eshop.

## Description of the system

Users can select a category containing sample data and find the best product for their needs. They do so by organizing
products of a category into different sets of products:

- Candidates (products the user likes - product is moved there after user clicks heart icon in the product box)
- Discarded (products the user dislikes - product is moved there after user clicks trash icon in the product box)
- Alternatives (products recommended to the user by the recommender system based on preferences estimated from contents of Candidates and Discarded)
- Unseen (products the user did not see yet)

Users are expected to select the product they like in two phases.

### Phase 1: Selection of candidates

During the first phase, users are expected to browse the product catalog and gather all products that seem relevant to
them. These products are marked as candidates by clicking the heart icon in the product box.

Recommender system guides the browsing by offering alternatives to the currently selected candidate products and the
unseen section displays statistics about the rest of the products and allows users to filter products based on important
attributes. After the user browsed through all relevant products, an alert appears and tells the user that now might be
the time to move to phase 2. The red message "No products with relevant value" serves as this alert at this moment.

If the user wants to inspect more products, he/she certainly can. Recommender system still offers alternatives.

### Phase 2: Selection of the best candidate

Second phase is the selection of the best candidate. User has narrowed down the domain to contain only a handful of
relevant products and the selection should be easier than with the whole catalog.

This system does not help with this task, its main goal is to aid users with the phase 1.

### Attributes

Users can select attributes that are important to them in the left column menu. These attributes are displayed in the
boxes of all products and are considered when making recommendations and generating explanations.

## Installation

To install the system, run the following command in the root directory:

```shell
docker compose up
```

This will build docker container for `server` and `gui` apps and run both of them. `server` will be available at port
`8086` (unless specified differently) and `gui` at port `3000`. You can access the app at
`http://localhost:3000`.

### Configuration

Both the `gui` and `server` apps can be configured.

#### Gui

Gui app can not be configured.

#### Server

Server is a Flask app with multiple configurable environment variables:

- `SERVER_HOST` - specifies the host where the Flask app will run (value `"0.0.0.0"` is recommended)
- `SERVER_PORT` - specifies the port where the Flask app will run (value `8086` is recommended)
- `RECOMMENDER_MODEL` - specifies the recommender system model, described more below
- `EXPLANATIONS_MODEL` - specifies the explanations model, described more below
- `TEST_DATA` - specifies whether to use a test version of the data, described more below

You can edit these variables in the file `server/.env`.

##### Recommender model

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

##### Explanations model

The explanations model provides explanations of products and their attributes to the user.

The currently developed explanations models are:

- `content_based`
- `content_based_neutral`

Their description is provided directly in the code (file
`server/app/explanations/{content_based|content_based_neutral}.py`).

How to add a new explanations model:

1. Add a new value to `ExplanationsModel` enum (file `server/app/explanations/abstract.py`).
2. Implement a subclass of `AbstractExplanations` (file `server/app/explanations/abstract.py`). Implement its `explain` method and set its `model` attribute to the value defined in the previous step.
3. Import your class in `server/app/explanations/__init__.py`.

If you want to change the explanations model that is used, change the environment variable `EXPLANATIONS_MODEL` to a
different value of the `ExplanationsModel` enum representing the model you want to use.

##### Data

The data used by this program are organized into folders located in `server/data`.

There are two versions:

- `main` and
- `test`

The `test` folder contains a testing version of the data, typically reduced number of products to check properties of
recommender system and explanations before trying them on more products.

Currently, the testing version of the data contains large silver macbooks in the `laptops` category.

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

## Development

### Server

All requirements of the `server` app are handled by Poetry. Running

```shell
poetry install
```

in the `server` directory installs all the requirements, so you need Python and Poetry to develop the `server` app.

To run the `server` app locally you need to run the following command in the `server` directory:

```shell
python -m app.scripts.run_server
```

You need to make sure you are using the environment variables you want. You can use the `server/.env` file in your IDE.

### Gui

All requirements of the `gui` app are handled by npm. Running

```shell
npm install
```

in the gui directory installs all the requirements, so you need npm to develop the `gui` app.

To run the `gui` app locally you need to run the following command in the `gui` directory:

```shell
npm start
```

The environment variables from the file will be used automatically.

### Code checking

The project uses code checking software and GitHub actions.

The code checks include the following:

- `black` (server)
- `flake8` (server)
- `mypy` (server)
- `eslint` (gui)
- `prettier` (gui)

After a change has been made and pushed to the GitHub repository, all these checks are performed and docker compose is
tried as well to check if the container can be built properly.
