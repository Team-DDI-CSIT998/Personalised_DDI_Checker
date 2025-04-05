import xml.etree.ElementTree as ET
import pymongo
from pymongo.errors import BulkWriteError, PyMongoError, ServerSelectionTimeoutError  # Adjusted imports
from dotenv import load_dotenv
import os

# Step 1: Parse the XML file with namespace handling
try:
    # Parse the XML file
    tree = ET.parse("C:\\Users\\siddh\\OneDrive\\Desktop\\998\\full database.xml")
    root = tree.getroot()
except FileNotFoundError:
    print("Error: The file 'full database.xml' was not found. Please check the file path.")
    exit(1)
except ET.ParseError:
    print("Error: Failed to parse the XML file. Please ensure it is a valid XML.")
    exit(1)

# Step 2: Handle DrugBank namespace
namespace = ''
if '}' in root.tag:
    namespace = root.tag.split('}')[0] + '}'
ns = {'db': namespace.replace('{', '').replace('}', '')} if namespace else {}

# Helper function to remove namespace from tag names
def strip_ns(tag):
    if '}' in tag:
        return tag.split('}')[1]
    return tag

# Step 3: Extract data for each drug
drug_documents = []
for drug in root.findall('db:drug', namespaces=ns) if namespace else root.findall('drug'):
    drug_data = {}
    
    # Drug ID
    drug_id_elem = drug.find('db:drugbank-id[@primary="true"]', namespaces=ns) if namespace else drug.find('drugbank-id[@primary="true"]')
    drug_data['drug_id'] = drug_id_elem.text if drug_id_elem is not None else ''
    
    # Name
    name_elem = drug.find('db:name', ns) if namespace else drug.find('name')
    drug_data['name'] = name_elem.text if name_elem is not None else ''
    
    # Synonyms
    synonyms_elem = drug.find('db:synonyms', ns) if namespace else drug.find('synonyms')
    drug_data['synonyms'] = [syn.text for syn in synonyms_elem.findall('db:synonym', ns) if syn.text] if synonyms_elem is not None else []
    
    # Description (full and patient-friendly)
    desc_elem = drug.find('db:description', ns) if namespace else drug.find('description')
    full_desc = desc_elem.text if desc_elem is not None and desc_elem.text else ''
    drug_data['description'] = {'full': full_desc, 'patient_friendly': ''}
    
    # Indication (full and patient-friendly)
    ind_elem = drug.find('db:indication', ns) if namespace else drug.find('indication')
    full_ind = ind_elem.text if ind_elem is not None and ind_elem.text else ''
    drug_data['indication'] = {'full': full_ind, 'patient_friendly': ''}
    
    # Interactions
    interactions = []
    interactions_elem = drug.find('db:drug-interactions', ns) if namespace else drug.find('drug-interactions')
    if interactions_elem is not None:
        for interaction in interactions_elem.findall('db:drug-interaction', ns) if namespace else interactions_elem.findall('drug-interaction'):
            interactions.append({
                'drug_id': interaction.find('db:drugbank-id', ns).text if namespace else (interaction.find('drugbank-id').text if interaction.find('drugbank-id') is not None else ''),
                'name': interaction.find('db:name', ns).text if namespace else (interaction.find('name').text if interaction.find('name') is not None else ''),
                'description': interaction.find('db:description', ns).text if namespace else (interaction.find('description').text if interaction.find('description') is not None else '')
            })
    drug_data['interactions'] = interactions
    
    # Pharmacodynamics
    pharm_elem = drug.find('db:pharmacodynamics', ns) if namespace else drug.find('pharmacodynamics')
    drug_data['pharmacodynamics'] = pharm_elem.text if pharm_elem is not None and pharm_elem.text else ''
    
    # Mechanism of Action
    moa_elem = drug.find('db:mechanism-of-action', ns) if namespace else drug.find('mechanism-of-action')
    drug_data['mechanism_of_action'] = moa_elem.text if moa_elem is not None and moa_elem.text else ''
    
    # Toxicity
    tox_elem = drug.find('db:toxicity', ns) if namespace else drug.find('toxicity')
    drug_data['toxicity'] = tox_elem.text if tox_elem is not None and tox_elem.text else ''
    
    # References (articles and links)
    references = {'articles': [], 'links': []}
    ref_elem = drug.find('db:general-references', ns) if namespace else drug.find('general-references')
    if ref_elem is not None:
        articles_elem = ref_elem.find('db:articles', ns) if namespace else ref_elem.find('articles')
        if articles_elem is not None:
            for article in articles_elem.findall('db:article', ns) if namespace else articles_elem.findall('article'):
                references['articles'].append({
                    'ref_id': article.find('db:ref-id', ns).text if namespace else (article.find('ref-id').text if article.find('ref-id') is not None else ''),
                    'pubmed_id': article.find('db:pubmed-id', ns).text if namespace else (article.find('pubmed-id').text if article.find('pubmed-id') is not None else ''),
                    'citation': article.find('db:citation', ns).text if namespace else (article.find('citation').text if article.find('citation') is not None else '')
                })
        links_elem = ref_elem.find('db:links', ns) if namespace else ref_elem.find('links')
        if links_elem is not None:
            for link in links_elem.findall('db:link', ns) if namespace else links_elem.findall('link'):
                references['links'].append({
                    'ref_id': link.find('db:ref-id', ns).text if namespace else (link.find('ref-id').text if link.find('ref-id') is not None else ''),
                    'title': link.find('db:title', ns).text if namespace else (link.find('title').text if link.find('title') is not None else ''),
                    'url': link.find('db:url', ns).text if namespace else (link.find('url').text if link.find('url') is not None else '')
                })
    drug_data['references'] = references
    
    # State
    state_elem = drug.find('db:state', ns) if namespace else drug.find('state')
    drug_data['state'] = state_elem.text if state_elem is not None and state_elem.text else ''
    
    # Groups
    groups_elem = drug.find('db:groups', ns) if namespace else drug.find('groups')
    drug_data['groups'] = [group.text for group in groups_elem.findall('db:group', ns) if group.text] if groups_elem is not None else []
    
    # Products
    products = []
    products_elem = drug.find('db:products', ns) if namespace else drug.find('products')
    if products_elem is not None:
        for product in products_elem.findall('db:product', ns) if namespace else products_elem.findall('product'):
            products.append({
                'name': product.find('db:name', ns).text if namespace else (product.find('name').text if product.find('name') is not None else ''),
                'dosage_form': product.find('db:dosage-form', ns).text if namespace else (product.find('dosage-form').text if product.find('dosage-form') is not None else ''),
                'strength': product.find('db:strength', ns).text if namespace else (product.find('strength').text if product.find('strength') is not None else ''),
                'route': product.find('db:route', ns).text if namespace else (product.find('route').text if product.find('route') is not None else '')
            })
    drug_data['products'] = products
    
    # Classification
    classification = {}
    class_elem = drug.find('db:classification', ns) if namespace else drug.find('classification')
    if class_elem is not None:
        for child in class_elem:
            tag = strip_ns(child.tag)
            classification[tag] = child.text if child.text is not None else ''
    drug_data['classification'] = classification
    
    # Sequence
    seq_elem = drug.find('db:sequences', ns) if namespace else drug.find('sequences')
    if seq_elem is not None and (seq_elem.find('db:sequence', ns) if namespace else seq_elem.find('sequence')) is not None:
        seq_text = (seq_elem.find('db:sequence', ns) if namespace else seq_elem.find('sequence')).text
        sequence = seq_text.split('\n', 1)[1].replace('\n', '') if seq_text and '\n' in seq_text else seq_text
        drug_data['sequence'] = sequence if sequence else ''
    else:
        drug_data['sequence'] = ''
    
    # Experimental Properties
    exp_props = {}
    exp_elem = drug.find('db:experimental-properties', ns) if namespace else drug.find('experimental-properties')
    if exp_elem is not None:
        for prop in exp_elem.findall('db:property', ns) if namespace else exp_elem.findall('property'):
            kind = prop.find('db:kind', ns).text if namespace else (prop.find('kind').text if prop.find('kind') is not None else '')
            value = prop.find('db:value', ns).text if namespace else (prop.find('value').text if prop.find('value') is not None else '')
            if kind:
                exp_props[kind] = value if value else ''
    drug_data['experimental_properties'] = exp_props
    
    if drug_data['drug_id']:
        drug_documents.append(drug_data)

# Step 4: Connect to MongoDB and insert data
try:
    load_dotenv('src/.env')  # Load .env file from src directory
    password = os.getenv('MONGO_PASSWORD')
    if not password:
        print("Error: MONGO_PASSWORD environment variable is not set. Please check your .env file in the src directory.")
        exit(1)
    client = pymongo.MongoClient(f"mongodb+srv://medmatchproject2025:{password}@medmatchcluster.rrxor.mongodb.net/?retryWrites=true&w=majority&appName=MedMatchCluster")
    db = client['drugbank_db']
    collection = db['drugs']

    collection.delete_many({})  # Clear the collection before inserting

    if drug_documents:
        batch_size = 1000
        for i in range(0, len(drug_documents), batch_size):
            batch = drug_documents[i:i + batch_size]
            collection.insert_many(batch)
            print(f"Inserted {len(batch)} drugs into MongoDB (batch {i // batch_size + 1}).")
        print(f"Total: Inserted {len(drug_documents)} drugs into MongoDB.")
    else:
        print("No drug data to insert.")

    lepirudin = collection.find_one({'drug_id': 'DB00001'})
    if lepirudin:
        print("Successfully retrieved Lepirudin from MongoDB:")
        print(lepirudin)
    else:
        print("Lepirudin (DB00001) not found in the database.")

except PyMongoError as pe:  # Use PyMongoError as a general catch for MongoDB errors
    print(f"Error: Failed to connect to or operate on MongoDB: {pe}")
    exit(1)
except BulkWriteError as bwe:
    print(f"Error: Failed to insert data into MongoDB: {bwe}")
    exit(1)
except Exception as e:
    print(f"Unexpected error: {e}")
    exit(1)
finally:
    client.close()