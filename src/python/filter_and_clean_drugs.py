from dotenv import load_dotenv
import os
from config import MONGO_URI
import pymongo
from pymongo.errors import PyMongoError

# List of 1000 common drugs provided earlier
common_drugs = [
    "levothyroxine", "atorvastatin", "metformin", "lisinopril", "amlodipine",
    "metoprolol", "omeprazole", "simvastatin", "hydrocodone", "albuterol",
    "ibuprofen", "acetaminophen", "amoxicillin", "azithromycin", "prednisone",
    "sertraline", "fluoxetine", "citalopram", "escitalopram", "duloxetine",
    "alprazolam", "diazepam", "lorazepam", "clonazepam", "oxycodone",
    "morphine", "fentanyl", "codeine", "tramadol", "gabapentin",
    "pregabalin", "insulin", "aspirin", "clopidogrel", "warfarin",
    "apixaban", "rivaroxaban", "esomeprazole", "pantoprazole", "ranitidine",
    "losartan", "valsartan", "hydrochlorothiazide", "furosemide", "spironolactone",
    "dexamethasone", "montelukast", "sildenafil", "tadalafil", "ondansetron",
    "cetirizine", "loratadine", "diphenhydramine", "famotidine", "loperamide",
    "metoclopramide", "bupropion", "venlafaxine", "mirtazapine", "trazodone",
    "amitriptyline", "nortriptyline", "paroxetine", "fluvoxamine", "buspirone",
    "lithium", "lamotrigine", "valproate", "carbamazepine", "topiramate",
    "olanzapine", "quetiapine", "risperidone", "aripiprazole", "haloperidol",
    "chlorpromazine", "fluphenazine", "paliperidone", "ziprasidone", "lurasidone",
    "penicillin", "cephalexin", "doxycycline", "clindamycin", "erythromycin",
    "levofloxacin", "moxifloxacin", "ciprofloxacin", "trimethoprim", "sulfamethoxazole",
    "nitrofurantoin", "metronidazole", "fluconazole", "ketoconazole", "itraconazole",
    "voriconazole", "amphotericin", "nystatin", "terbinafine", "griseofulvin",
    "acyclovir", "valacyclovir", "famciclovir", "oseltamivir", "zanamivir",
    "ribavirin", "sofosbuvir", "ledipasvir", "tenofovir", "emtricitabine",
    "efavirenz", "nevirapine", "raltegravir", "dolutegravir", "abacavir",
    "zidovudine", "lamivudine", "ritonavir", "lopinavir", "darunavir",
    "atorvastatin", "rosuvastatin", "pravastatin", "lovastatin", "fluvastatin",
    "ezetimibe", "fenofibrate", "gemfibrozil", "niacin", "cholestyramine",
    "digoxin", "amiodarone", "diltiazem", "verapamil", "propranolol",
    "carvedilol", "bisoprolol", "atenolol", "nebivolol", "sotalol",
    "isosorbide", "nitroglycerin", "hydralazine", "minoxidil", "clonidine",
    "methyldopa", "prazosin", "doxazosin", "terazosin", "tamsulosin",
    "finasteride", "dutasteride", "oxybutynin", "tolterodine", "solifenacin",
    "darifenacin", "trospium", "fesoterodine", "mirabegron", "desmopressin",
    "levetiracetam", "phenytoin", "phenobarbital", "primidone", "ethosuximide",
    "zonisamide", "lacosamide", "brivaracetam", "perampanel", "tiagabine",
    "baclofen", "tizanidine", "cyclobenzaprine", "carisoprodol", "methocarbamol",
    "dantrolene", "orlistat", "phentermine", "liraglutide", "semaglutide",
    "exenatide", "dulaglutide", "sitagliptin", "saxagliptin", "linagliptin",
    "alogliptin", "vildagliptin", "empagliflozin", "dapagliflozin", "canagliflozin",
    "pioglitazone", "rosiglitazone", "acarbose", "miglitol", "repaglinide",
    "nateglinide", "glyburide", "glipizide", "glimepiride", "chlorpropamide",
    "tolbutamide", "thyroxine", "methimazole", "propylthiouracil", "calcitonin",
    "alendronate", "risedronate", "ibandronate", "zoledronic", "denosumab",
    "teriparatide", "raloxifene", "tamoxifen", "letrozole", "anastrozole",
    "exemestane", "fulvestrant", "bicalutamide", "flutamide", "nilutamide",
    "enzalutamide", "abiraterone", "leuprolide", "goserelin", "triptorelin",
    "degarelix", "testosterone", "estradiol", "progesterone", "medroxyprogesterone",
    "norethindrone", "ethinylestradiol", "desogestrel", "levonorgestrel", "drospirenone",
    "mifepristone", "misoprostol", "oxytocin", "dinoprostone", "ergometrine",
    "tranexamic", "aminocaproic", "desloratadine", "fexofenadine", "levocetirizine",
    "olopatadine", "ketotifen", "cromolyn", "nedocromil", "ipratropium",
    "tiotropium", "salmeterol", "formoterol", "budesonide", "fluticasone",
    "beclomethasone", "mometasone", "triamcinolone", "ciclesonide", "theophylline",
    "roflumilast", "zileuton", "zafirlukast", "pranlukast", "epinephrine",
    "norepinephrine", "dopamine", "dobutamine", "phenylephrine", "pseudoephedrine",
    "midodrine", "isoproterenol", "terbutaline", "salbutamol", "levalbuterol",
    "pirbuterol", "ephedrine", "guaifenesin", "dextromethorphan", "benzonatate",
    "acetylcysteine", "dornase", "mannitol", "hypertonic", "sodium",
    "potassium", "calcium", "magnesium", "phosphate", "bicarbonate",
    "lactate", "albumin", "heparin", "enoxaparin", "dalteparin",
    "tinzaparin", "fondaparinux", "argatroban", "bivalirudin", "dabigatran",
    "edoxaban", "alteplase", "reteplase", "tenecteplase", "streptokinase",
    "urokinase", "aminophylline", "caffeine", "modafinil", "armodafinil",
    "methylphenidate", "dexamfetamine", "lisdexamfetamine", "atomoxetine", "guanfacine",
    "clonidine", "buprenorphine", "naloxone", "naltrexone", "methadone", "disulfiram",
    "acamprosate", "nicotine", "varenicline", "bupropion", "cytisine",
    "allopurinol", "febuxostat", "colchicine", "probenecid", "sulfinpyrazone",
    "pegloticase", "rasburicase", "anakinra", "canakinumab", "rilonacept",
    "tocilizumab", "sarilumab", "etanercept", "infliximab", "adalimumab",
    "golimumab", "certolizumab", "rituximab", "abatacept", "belimumab",
    "secukinumab", "ixekizumab", "brodalumab", "guselkumab", "tildrakizumab",
    "ustekinumab", "methotrexate", "leflunomide", "sulfasalazine", "hydroxychloroquine",
    "azathioprine", "mycophenolate", "cyclophosphamide", "cyclosporine", "tacrolimus",
    "sirolimus", "everolimus", "prednisolone", "methylprednisolone", "hydrocortisone",
    "betamethasone", "clobetasol", "fluocinonide", "desonide", "mupirocin",
    "fusidic", "bacitracin", "neomycin", "polymyxin", "gentamicin",
    "tobramycin", "amikacin", "streptomycin", "kanamycin", "paromomycin",
    "linezolid", "tedizolid", "daptomycin", "vancomycin", "teicoplanin",
    "telavancin", "dalbavancin", "oritavancin", "rifampin", "rifabutin",
    "rifapentine", "isoniazid", "pyrazinamide", "ethambutol", "streptomycin",
    "bedaquiline", "delamanid", "clofazimine", "cycloserine", "capreomycin",
    "amikacin", "levofloxacin", "moxifloxacin", "gatifloxacin", "sparfloxacin",
    "ethionamide", "prothionamide", "terizidone", "linezolid", "pretomanid",
    "albendazole", "mebendazole", "ivermectin", "praziquantel", "niclosamide",
    "pyrantel", "diethylcarbamazine", "doxycycline", "miltefosine", "amodiaquine",
    "chloroquine", "hydroxychloroquine", "mefloquine", "primaquine", "quinine",
    "artemether", "lumefantrine", "artesunate", "atovaquone", "proguanil",
    "pyrimethamine", "sulfadoxine", "dapsone", "pentamidine", "suramin",
    "melarsoprol", "eflornithine", "nifurtimox", "benznidazole", "amphotericin",
    "flucytosine", "caspofungin", "micafungin", "anidulafungin", "isavuconazole",
    "posaconazole", "clotrimazole", "miconazole", "econazole", "oxiconazole",
    "sertaconazole", "sulconazole", "butoconazole", "tioconazole", "naftifine",
    "butenafine", "ciclopirox", "tolnaftate", "undecylenic", "griseofulvin",
    "amantadine", "rimantadine", "baloxavir", "peramivir", "laninamivir",
    "ganciclovir", "cidofovir", "foscarnet", "maraviroc", "enfuvirtide",
    "ib市民alizumab", "tipranavir", "atazanavir", "indinavir", "nelfinavir",
    "saquinavir", "amprenavir", "fosamprenavir", "elvitegravir", "bictegravir",
    "cabotegravir", "doravirine", "etravirine", "rilpivirine", "delavirdine",
    "stavudine", "didanosine", "zalcitabine", "tenofovir", "emtricitabine",
    "adefovir", "entecavir", "telbivudine", "clevudine", "boceprevir",
    "telaprevir", "simeprevir", "paritaprevir", "grazoprevir", "glecaprevir",
    "voxilaprevir", "dasabuvir", "ombitasvir", "velpatasvir", "pibrentasvir",
    "interferon", "peginterferon", "ribavirin", "sofosbuvir", "ledipasvir",
    "asunaprevir", "beclabuvir", "elbasvir", "uprifosbuvir", "ruzasvir",
    "cisplatin", "carboplatin", "oxaliplatin", "cyclophosphamide", "ifosfamide",
    "chlorambucil", "melphalan", "busulfan", "carmustine", "lomustine",
    "streptozocin", "dacarbazine", "temozolomide", "procarbazine", "altretamine",
    "thiotepa", "mitomycin", "doxorubicin", "daunorubicin", "epirubicin",
    "idarubicin", "mitoxantrone", "bleomycin", "dactinomycin", "plicamycin",
    "etoposide", "teniposide", "topotecan", "irinotecan", "camptothecin",
    "vincristine", "vinblastine", "vinorelbine", "vindesine", "paclitaxel",
    "docetaxel", "cabazitaxel", "eribulin", "ixabepilone", "methotrexate",
    "pemetrexed", "raltitrexed", "pralatrexate", "mercaptopurine", "thioguanine",
    "fludarabine", "cladribine", "clofarabine", "nelarabine", "cytarabine",
    "gemcitabine", "capecitabine", "floxuridine", "fluorouracil", "tegafur",
    "carmofur", "azacitidine", "decitabine", "trifluridine", "tipiracil",
    "hydroxyurea", "bortezomib", "carfilzomib", "ixazomib", "daratumumab",
    "elotuzumab", "lenalidomide", "pomalidomide", "thalidomide", "panobinostat",
    "vorinostat", "romidepsin", "belinostat", "entinostat", "mocetinostat",
    "imatinib", "dasatinib", "nilotinib", "bosutinib", "ponatinib",
    "erlotinib", "gefitinib", "afatinib", "osimertinib", "dacomitinib",
    "crizotinib", "ceritinib", "alectinib", "brigatinib", "lorlatinib",
    "sunitinib", "sorafenib", "pazopanib", "axitinib", "cabozantinib",
    "regorafenib", "lenvatinib", "nintedanib", "vandetanib", "tivozanib",
    "trastuzumab", "pertuzumab", "ado-trastuzumab", "fam-trastuzumab", "lapatinib",
    "neratinib", "tucatinib", "cetuximab", "panitumumab", "necitumumab",
    "bevacizumab", "ramucirumab", "ranibizumab", "aflibercept", "denosumab",
    "ipilimumab", "nivolumab", "pembrolizumab", "atezolizumab", "avelumab",
    "durvalumab", "cemiplimab", "tremelimumab", "dinutuximab", "blinatumomab",
    "obinutuzumab", "ofatumumab", "alemtuzumab", "brentuximab", "polatuzumab",
    "enfortumab", "sacituzumab", "loncastuximab", "tisotumab", "mogamulizumab",
    "inotuzumab", "gemtuzumab", "tositumomab", "ibritumomab", "catumaxomab",
    "olaratumab", "eculizumab", "ravulizumab", "caplacizumab", "emicizumab",
    "omalizumab", "mepolizumab", "reslizumab", "benralizumab", "dupilumab",
    "lebrikizumab", "tralokinumab", "anifrolumab", "tezepelumab", "sutimlimab",
    "palivizumab", "nirsevimab", "motavizumab", "sotrovimab", "casirivimab",
    "imdevimab", "bamlanivimab", "etesevimab", "tixagevimab", "cilgavimab",
    "regdanvimab", "amubarvimab", "romlusevimab", "bebtelovimab", "adintrevimab",
    "hydroxycarbamide", "anagrelide", "deferasirox", "deferiprone", "deferoxamine",
    "eltrombopag", "romiplostim", "avatrombopag", "lusutrombopag", "fostamatinib",
    "epoetin", "darbepoetin", "methoxy", "roxadustat", "vadadustat",
    "filgrastim", "pegfilgrastim", "lipegfilgrastim", "balugrastim", "efmoroctocog",
    "eftrenonacog", "nonacog", "octocog", "turoctocog", "damoctocog",
    "antihemophilic", "von", "factor", "fibrinogen", "thrombin",
    "aprotinin", "etamsylate", "carbazochrome", "romiplostim", "eltrombopag",
    "ferrous", "ferric", "folic", "cyanocobalamin", "hydroxocobalamin",
    "methylcobalamin", "pyridoxine", "thiamine", "riboflavin", "niacinamide",
    "pantothenic", "biotin", "ascorbic", "cholecalciferol", "ergocalciferol",
    "retinol", "beta-carotene", "tocopherol", "phytonadione", "menadione",
    "zinc", "selenium", "copper", "manganese", "chromium",
    "molybdenum", "iodine", "fluoride", "omega-3", "glucosamine",
    "chondroitin", "melatonin", "coenzyme", "alpha-lipoic", "l-carnitine",
    "probiotics", "lactobacillus", "bifidobacterium", "saccharomyces", "prebiotics",
    "inulin", "fructooligosaccharides", "galactooligosaccharides", "psyllium", "methylcellulose",
    "polycarbophil", "docusate", "bisacodyl", "senna", "lactulose",
    "polyethylene", "macrogol", "sorbitol", "magnesium", "sodium",
    "mineral", "petrolatum", "lanolin", "glycerin", "urea",
    "salicylic", "lactic", "glycolic", "benzoyl", "adapalene",
    "tretinoin", "isotretinoin", "tazarotene", "azelaic", "clindamycin",
    "erythromycin", "metronidazole", "ivermectin", "permethrin", "malathion",
    "spinosad", "benzyl", "crotamiton", "lindane", "dimethicone",
    "hydroquinone", "kojic", "arbutin", "niacinamide", "tranexamic",
    "fluoride", "chlorhexidine", "triclosan", "cetylpyridinium", "hydrogen",
    "carbamide", "benzocaine", "lidocaine", "prilocaine", "tetracaine",
    "menthol", "camphor", "capsaicin", "methyl", "diclofenac",
    "ketoprofen", "piroxicam", "indomethacin", "naproxen", "meloxicam",
    "celecoxib", "rofecoxib", "valdecoxib", "etoricoxib", "parecoxib",
    "ketorolac", "flurbiprofen", "sulindac", "etodolac", "mefenamic",
    "meclofenamate", "fenoprofen", "oxaprozin", "tolmetin", "nabumetone",
    "aspirin", "diflunisal", "salsalate", "choline", "magnesium",
    "epinephrine", "atropine", "scopolamine", "homatropine", "cyclopentolate",
    "tropicamide", "phenylephrine", "naphazoline", "tetrahydrozoline", "oxymetazoline",
    "brimonidine", "apraclonidine", "timolol", "betaxolol", "carteolol",
    "levobunolol", "dorzolamide", "brinzolamide", "acetazolamide", "methazolamide",
    "pilocarpine", "carbachol", "bimatoprost", "latanoprost", "travoprost",
    "tafluprost", "unoprostone", "netarsudil", "rho", "ripasudil",
    "tobramycin", "gentamicin", "erythromycin", "fluoroquinolone", "natamycin",
    "prednisolone", "dexamethasone", "fluorometholone", "loteprednol", "rimexolone",
    "cyclosporine", "tacrolimus", "lifitegrast", "cevimeline", "pilocarpine",
    "artificial", "hyaluronic", "carboxymethylcellulose", "polyvinyl", "glycerin",
    "antazoline", "xylometazoline", "pheniramine", "emedastine", "levocabastine",
    "olopatadine", "epinastine", "azelastine", "ketotifen", "bepotastine",
    "alcaftadine", "nedocromil", "lodoxamide", "cromolyn", "pemirolast"
]

# Load environment variables from .env file in src directory
load_dotenv('src/.env')
password = os.getenv('MONGO_PASSWORD')
if not password:
    print("Error: MONGO_PASSWORD environment variable is not set. Please check your .env file in the src directory.")
    exit(1)

# Connect to MongoDB
try:
    client = pymongo.MongoClient(f"mongodb+srv://medmatchproject2025:{password}@medmatchcluster.rrxor.mongodb.net/?retryWrites=true&w=majority&appName=MedMatchCluster")
    db = client['drugbank_db']
    collection = db['drugs']

    # Step 1: Get the set of valid drug names from the common_drugs list
    valid_drug_names = set(common_drugs)

    # Step 2: Find and retain only drugs from the common_drugs list
    print("Filtering drugs in the database...")
    all_drugs = collection.find()
    drugs_to_keep = []
    drugs_to_delete = []

    for drug in all_drugs:
        drug_name = drug.get('name', '').lower()
        if drug_name in valid_drug_names:
            drugs_to_keep.append(drug)
        else:
            drugs_to_delete.append(drug['_id'])

    # Delete drugs not in the common_drugs list
    if drugs_to_delete:
        result = collection.delete_many({'_id': {'$in': drugs_to_delete}})
        print(f"Deleted {result.deleted_count} drugs that were not in the 1000-drug list.")

    # Step 3: Update the retained drugs with cleaned interactions
    print("Cleaning interactions for retained drugs...")
    for drug in drugs_to_keep:
        if 'interactions' in drug:
            cleaned_interactions = []
            for interaction in drug['interactions']:
                interaction_name = interaction.get('name', '').lower()
                if interaction_name in valid_drug_names:
                    cleaned_interactions.append(interaction)
            drug['interactions'] = cleaned_interactions
            # Update the document in the database
            collection.replace_one({'_id': drug['_id']}, drug)

    # Step 4: Verify the result
    final_count = collection.count_documents({})
    print(f"Total number of drugs remaining in the database: {final_count}")

    # Optional: Display a sample of retained drugs
    print("\nSample of retained drugs:")
    sample_drugs = collection.find().limit(5)
    for i, drug in enumerate(sample_drugs, 1):
        print(f"\nDrug {i}:")
        print(f"Name: {drug.get('name', 'N/A')}")
        print(f"Number of Interactions: {len(drug.get('interactions', []))}")

except PyMongoError as pe:
    print(f"Error: Failed to connect to or operate on MongoDB: {pe}")
    exit(1)
except Exception as e:
    print(f"Unexpected error: {e}")
    exit(1)
finally:
    client.close()