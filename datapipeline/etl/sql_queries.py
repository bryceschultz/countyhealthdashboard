import configparser

# DROP TABLES
fast_food_table_drop = "DROP TABLE IF EXISTS fast_food"
mortality_table_drop = "DROP TABLE IF EXISTS mortality"

# CREATE TABLES
fast_food_table_create= ("""
CREATE TABLE IF NOT EXISTS fast_food (
    fips varchar NOT NULL,
    state varchar,
    county varchar,
    restuarants_2011 int NOT NULL,
    restuarants_2016 int NOT NULL,
    pct_change decimal NOT NULL,
    CONSTRAINT fips
      FOREIGN KEY(fips) 
	    REFERENCES customers(fips)

)
""")

mortality_table_create= ("""
CREATE TABLE IF NOT EXISTS mortality (
    fips varchar,
    cause_of_death varchar NOT NULL,
    deaths int NOT NULL,
    population int,
    year int,
    PRIMARY KEY(fips)
)
""")

# QUERY LISTS

create_table_queries = [fast_food_table_create, mortality_table_create]
drop_table_queries = [fast_food_table_drop, mortality_table_drop]