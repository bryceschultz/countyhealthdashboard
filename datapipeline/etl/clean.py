import pandas as pd
import os

def clean_data(dataset_dictionaries):
    """
    PURPOSE: This function reads in all the dataset dictionaries passed to it and converts them to dataframes, it also handles any neccesary cleaning
    ARGUMENTS:
        dataset_dictionaries: this is a list of dictionaries. each dictionary contains a path to the dataset and the datasets category
    """
    for dataset_dictionary in dataset_dictionaries:
        if dataset_dictionary["table"] == "mortality":
            df = pd.read_csv(dataset_dictionary["path"], sep='\t', index_col=False)
            df = df.drop('notes', axis=1)
            df = df.drop('crude_rate', axis=1)
            df = df.drop('cause_of_death_code', axis=1)
            df = df.groupby(['county','state','fips', 'cause_of_death', 'population']).size().reset_index(name='deaths')
            df['fips'] = df['fips'].astype(str).str.zfill(5)
            dataset_dictionary["path"]
            df['year'] = dataset_dictionary["path"].split("/")[-1][0:4]
            print(df)
        else:
            df = pd.read_csv(dataset_dictionary["path"], index_col=False)
            df['fips'] = df['fips'].astype(str).str.zfill(5)
        dataset_dictionary["df"] = df
    return dataset_dictionaries