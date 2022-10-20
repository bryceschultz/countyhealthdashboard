import configparser
from clean import clean_data
import sqlalchemy as sa


def clean_datasets(categories):
    """
    PURPOSE: This function cleans our data before we insert the data into our database
    ARGUMENTS:
        categories: this is a list of dictionaries. Each dictionary has the path for datasets that we want to clean and what their categories are
    """
    for category in categories:
        category["df"] = clean_data(category)

def insert_tables(engine, dataset_dictionaries):
    """
    PURPOSE: This function inserts data into your seperate tables
    ARGUMENTS:
        engine: this is the engine you are using for your db operations
        dataset_dictionaries: this is the  list of dictionaries to insert df's from
    """
    for dataset_dictionary in dataset_dictionaries:
        dataset_dictionary["df"].to_sql(dataset_dictionary["table"], engine, if_exists='append', index=False)


def check_tables(engine, dataset_dictionaries):
    """
    PURPOSE: This function inserts data into your seperate tables
    ARGUMENTS:
        engine: this is the engine you are using for your db operations
        dataset_dictionaries: this is the  list of dictionaries to quality check
    """
    for dataset_dictionary in dataset_dictionaries:
        table_exists = sa.inspect(engine).has_table(dataset_dictionary["table"])
        if not table_exists:
            print(f'TABLE {dataset_dictionary["table"]}: TABLE DOES NOT EXIST - LOAD UNSUCCESSFUL')
        row_count_db = engine.execute(f'SELECT count(*) from {dataset_dictionary["table"]}')
        if row_count_db != dataset_dictionary["row_count_df"]:
            print(f'TABLE {dataset_dictionary["table"]}: DB ROW COUNT DOES NOT MATCH DF ROW COUNT')
        

def main():
    """
    PURPOSE: This function loads the config file, establishes a connection and cursor object then calls the load_staging_tables function and the insert_tables function.
    This function is called when a user inputs "python etl.py" into the command prompt.
    """
    print("etl.py fired")
    config = configparser.ConfigParser()
    config.read('rds.cfg')
    engine = sa.create_engine(f"postgresql://{config['DBCONNECT']['DB_USER']}:{config['DBCONNECT']['DB_PASSWORD']}@{config['DBCONNECT']['HOST']}:{config['DBCONNECT']['DB_PORT']}/{config['DBCONNECT']['DB_NAME']}")
    print("Now cleaning data")

    cleaned_data = clean_data([
    {
        "table": "mortality",
        "path": '../datasets/mortality_subset/2011MortalityFinalSubset.csv'
    },
    {
        "table": "mortality",
        "path": '../datasets/mortality_subset/2016MortalityFinalSubset.csv'
    },
    {
        "table": "fast_food",
        "path": '../datasets/fastfood/FastFood.csv'
    }
    ])
    print("Cleaning data done")
    print("Now inserting tables")
    insert_tables(engine, cleaned_data)
    print("Now quality checking tables")
    check_tables(engine, cleaned_data)
    print("ETL complete")

if __name__ == "__main__":
    main()