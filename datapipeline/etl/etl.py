import configparser
import psycopg2
from clean import clean_data
from sqlalchemy import create_engine


def clean_datasets(categories):
    """
    PURPOSE: This function cleans our data before we insert the data into our database
    ARGUMENTS:
        categories: this is a list of dictionaries. Each dictionary has the path for datasets that we want to clean and what their categories are
    """
    for category in categories:
        category["df"] = clean_data(category)

def insert_tables(cur, conn, dataset_dictionaries):
    """
    PURPOSE: This function inserts data into your seperate tables
    ARGUMENTS:
        cur: this is the cursor you are using for your db operations
        conn: this is the current connection you're using for your db operations
    """
    engine = create_engine('postgresql://postgres:postgresAWSUSER123@database1.clpwhhxfz0ui.us-east-1.rds.amazonaws.com:5432/database_1')
    for dataset_dictionary in dataset_dictionaries:
        dataset_dictionary["df"].to_sql(dataset_dictionary["table"], engine, if_exists='append', index=False)
        

def main():
    """
    PURPOSE: This function loads the config file, establishes a connection and cursor object then calls the load_staging_tables function and the insert_tables function.
    This function is called when a user inputs "python etl.py" into the command prompt.
    """
    print("etl.py fired")
    config = configparser.ConfigParser()
    config.read('rds.cfg')

    conn = psycopg2.connect(
        database=config['DBCONNECT']['DB_NAME'],
        user=['DBCONNECT']['DB_USER'],
        password=['DBCONNECT']['DB_PASSWORD'],
        host=['DBCONNECT']['HOST'],
        port=['DBCONNECT']['DB_PORT']
    )

    cur = conn.cursor()
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
    insert_tables(cur, conn, cleaned_data)

    conn.close()


if __name__ == "__main__":
    main()