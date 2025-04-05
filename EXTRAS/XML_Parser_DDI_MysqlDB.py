import xml.etree.ElementTree as ET
import mysql.connector

# Connect to the MySQL database
db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="{Your_Passowrd}",
    database="drugbank_db"
)
cursor = db.cursor()


# Function to insert data into the `drugs` table
def insert_drug(drug):
    sql = """
        INSERT INTO drugs (drugbank_id, drug_name, drug_description, cas_number, unii, state) 
        VALUES (%s, %s, %s, %s, %s, %s)
    """
    cursor.execute(sql, (
        drug['drugbank_id'],
        drug['drug_name'],
        drug['drug_description'],
        drug.get('cas_number'),
        drug.get('unii'),
        drug.get('state')
    ))
    return cursor.lastrowid


# Function to insert data into the `drug_interactions` table
def insert_interaction(drug_id, interacting_drugbank_id, interacting_drug_name, interaction_description):
    sql = """
        INSERT INTO drug_interactions (drug_id, interacting_drugbank_id, interacting_drug_name, interaction_description) 
        VALUES (%s, %s, %s, %s)
    """
    cursor.execute(sql, (drug_id, interacting_drugbank_id, interacting_drug_name, interaction_description))


# Function to insert data into the `dosages` table
def insert_dosage(drug_id, dosage_form, route, strength):
    sql = """
        INSERT INTO dosages (drug_id, dosage_form, route, strength) 
        VALUES (%s, %s, %s, %s)
    """
    cursor.execute(sql, (drug_id, dosage_form, route, strength))


# Function to insert data into the `categories` table
def insert_category(drug_id, category, mesh_id):
    sql = """
        INSERT INTO categories (drug_id, category, mesh_id) 
        VALUES (%s, %s, %s)
    """
    cursor.execute(sql, (drug_id, category, mesh_id))


# Function to insert data into the `food_interactions` table
def insert_food_interaction(drug_id, interaction_description):
    sql = """
        INSERT INTO food_interactions (drug_id, interaction_description) 
        VALUES (%s, %s)
    """
    cursor.execute(sql, (drug_id, interaction_description))


# Function to insert data into the `drug_references` table
def insert_reference(drug_id, pubmed_id, citation):
    sql = """
        INSERT INTO drug_references (drug_id, pubmed_id, citation) 
        VALUES (%s, %s, %s)
    """
    cursor.execute(sql, (drug_id, pubmed_id, citation))


# Parse the XML file
tree = ET.parse("C:\\Users\\siddh\\Downloads\\drugbank_all_full_database.xml\\full database.xml")
root = tree.getroot()

# Define the DrugBank namespace (adjust if your file uses something different)
ns = {"db": "http://www.drugbank.ca"}

# Optional: Let's see how many <drug> elements we find
all_drugs = root.findall("db:drug", ns)
print(f"Found {len(all_drugs)} drugs in XML.")

# Process each drug in the XML
for drug in all_drugs:
    # Typically the first or the primary drugbank-id is stored
    drugbank_id_elem = drug.find("db:drugbank-id[@primary='true']", ns)
    if drugbank_id_elem is None:
        # fallback: if no primary is set, just grab the first drugbank-id
        drugbank_id_elem = drug.find("db:drugbank-id", ns)
    drugbank_id = drugbank_id_elem.text if drugbank_id_elem is not None else None

    drug_name_elem = drug.find("db:name", ns)
    drug_description_elem = drug.find("db:description", ns)
    cas_number_elem = drug.find("db:cas-number", ns)
    unii_elem = drug.find("db:unii", ns)
    state_elem = drug.find("db:state", ns)

    drug_data = {
        "drugbank_id": drugbank_id,
        "drug_name": drug_name_elem.text if drug_name_elem is not None else None,
        "drug_description": drug_description_elem.text if drug_description_elem is not None else None,
        "cas_number": cas_number_elem.text if cas_number_elem is not None else None,
        "unii": unii_elem.text if unii_elem is not None else None,
        "state": state_elem.text if state_elem is not None else None,
    }

    drug_id = insert_drug(drug_data)

    # Insert drug interactions
    for interaction in drug.findall("db:drug-interactions/db:drug-interaction", ns):
        int_drugbank_id_elem = interaction.find("db:drugbank-id", ns)
        int_drug_name_elem = interaction.find("db:name", ns)
        int_description_elem = interaction.find("db:description", ns)

        interacting_drugbank_id = int_drugbank_id_elem.text if int_drugbank_id_elem is not None else None
        interacting_drug_name = int_drug_name_elem.text if int_drug_name_elem is not None else None
        interaction_description = int_description_elem.text if int_description_elem is not None else None

        insert_interaction(drug_id, interacting_drugbank_id, interacting_drug_name, interaction_description)

    # Insert dosage information
    for dosage in drug.findall("db:dosages/db:dosage", ns):
        dosage_form_elem = dosage.find("db:form", ns)
        route_elem = dosage.find("db:route", ns)
        strength_elem = dosage.find("db:strength", ns)

        dosage_form = dosage_form_elem.text if dosage_form_elem is not None else None
        route = route_elem.text if route_elem is not None else None
        strength = strength_elem.text if strength_elem is not None else None

        insert_dosage(drug_id, dosage_form, route, strength)

    # Insert categories
    for category in drug.findall("db:categories/db:category", ns):
        category_name_elem = category.find("db:category", ns)
        mesh_id_elem = category.find("db:mesh-id", ns)

        category_name = category_name_elem.text if category_name_elem is not None else None
        mesh_id = mesh_id_elem.text if mesh_id_elem is not None else None

        insert_category(drug_id, category_name, mesh_id)

    # Insert food interactions
    for fi in drug.findall("db:food-interactions/db:food-interaction", ns):
        if fi.text:
            insert_food_interaction(drug_id, fi.text)

    # Insert drug references
    for article in drug.findall(".//db:general-references/db:articles/db:article", ns):
        pubmed_id_elem = article.find("db:pubmed-id", ns)
        citation_elem = article.find("db:citation", ns)

        pubmed_id = pubmed_id_elem.text if pubmed_id_elem is not None else None
        citation = citation_elem.text if citation_elem is not None else None

        insert_reference(drug_id, pubmed_id, citation)

# Commit changes and close the connection
db.commit()
cursor.close()
db.close()

print("Data transfer completed successfully!")
