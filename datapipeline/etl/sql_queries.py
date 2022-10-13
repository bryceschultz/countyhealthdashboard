import configparser

# DROP TABLES
fast_food_table_drop = "DROP TABLE IF EXISTS fast_food"
mortality_table_drop = "DROP TABLE IF EXISTS mortality"

# CREATE TABLES
fast_food_table_create= ("""
CREATE TABLE IF NOT EXISTS fast_food (
    fips varchar,
    state varchar,
    county varchar,
    restuarants_2011 int,
    restuarants_2016 int,
    pct_change decimal
)
""")

mortality_table_create= ("""
CREATE TABLE IF NOT EXISTS mortality (
    county varchar,
    state varchar,
    fips varchar,
    cause_of_death varchar,
    deaths int,
    population varchar,
    year int
)
""")

# QUERY LISTS

create_table_queries = [fast_food_table_create, mortality_table_create]
drop_table_queries = [fast_food_table_drop, mortality_table_drop]