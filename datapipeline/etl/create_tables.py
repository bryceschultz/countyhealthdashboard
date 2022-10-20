import configparser
import psycopg2
from sql_queries import create_table_queries, drop_table_queries


def drop_tables(cur, conn):
    """
    PURPOSE: drops the tables from AWS RDS db if they already exist
    ARGUMENTS: takes in the cursor and connection objects
    """
    for query in drop_table_queries:
        cur.execute(query)
        conn.commit()


def create_tables(cur, conn):
    """
    PURPOSE: creates the tables in the AWS RDS db so that data can then be loaded into them from the etl.py file
    ARGUMENTS: takes in the cursor and connection objects
    """
    for query in create_table_queries:
        cur.execute(query)
        conn.commit()


def main():
    """
    PURPOSE: This function fires when the file is executed, this function will call the create_tables function and the drop_tables function
    """
    config = configparser.ConfigParser()
    config.read('dwh.cfg')

    conn = psycopg2.connect(
        database=config['DBCONNECT']['DB_NAME'],
        user=config['DBCONNECT']['DB_USER'],
        password=config['DBCONNECT']['DB_PASSWORD'],
        host=config['DBCONNECT']['HOST'],
        port=config['DBCONNECT']['DB_PORT']
    )

    cur = conn.cursor()

    drop_tables(cur, conn)
    create_tables(cur, conn)
    

    conn.close()


if __name__ == "__main__":
    main()
