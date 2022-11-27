import psycopg2
import dotenv
import os

dotenv.load_dotenv()

PSQL_USER = os.getenv("PSQL_USER")
PSQL_PASSWORD = os.getenv("PSQL_PASSWORD")
PSQL_DB = os.getenv("PSQL_DB")
CONN_STR = f"dbname={PSQL_DB} user={PSQL_USER} password={PSQL_PASSWORD}"

def create_anime_table():
    conn = psycopg2.connect(CONN_STR)
    cursor = conn.cursor()
    
    cursor.execute("CREATE TABLE ANIME \
                    (anime_id INTEGER PRIMARY KEY, \
                     picture_url VARCHAR  (80), \
                     description TEXT)")
    
    conn.commit()
    conn.close()

def insert_into_anime_table(anime_id, picture_url, description):
    
    conn = psycopg2.connect(CONN_STR)
    cursor = conn.cursor()

    cursor.execute("INSERT INTO ANIME \
                    (anime_id, picture_url, description) \
                    VALUES (%s, %s, %s)", (anime_id, picture_url, description))
    
    conn.commit()
    conn.close()    



def select_from_anime_table(anime_id):
    conn = psycopg2.connect(CONN_STR)
    cursor = conn.cursor()

    cursor.execute("SELECT picture_url, description \
                            FROM ANIME \
                            WHERE anime_id = %s",(anime_id,))
    
    result = cursor.fetchone()

    conn.commit()
    conn.close() 
    
    return result


print(select_from_anime_table(1))