from dotenv import load_dotenv
import os
import pymongo
from pymongo.errors import PyMongoError

# Sample list of 50 common drugs (expand to 1000 as needed)
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

    # Verify total number of drugs in the database
    total_drugs = collection.count_documents({})
    print(f"Total number of drugs in the database: {total_drugs}")

    # Search for each common drug in the database
    found_drugs = 0
    missing_drugs = []

    for drug_name in common_drugs:
        # Case-insensitive search in 'name' or 'synonyms' fields
        query = {
            '$or': [
                {'name': {'$regex': f'^{drug_name}$', '$options': 'i'}},  # Match name exactly (case-insensitive)
                {'synonyms': {'$regex': f'^{drug_name}$', '$options': 'i'}}  # Match synonyms exactly (case-insensitive)
            ]
        }
        result = collection.find_one(query)
        if result:
            found_drugs += 1
            print(f"Found: {drug_name}")
        else:
            missing_drugs.append(drug_name)
            print(f"Not Found: {drug_name}")

    # Print summary
    print(f"\nSummary:")
    print(f"Out of {len(common_drugs)} common drugs, {found_drugs} were found in the database.")
    print(f"Missing drugs ({len(missing_drugs)}): {missing_drugs}")

except PyMongoError as pe:
    print(f"Error: Failed to connect to or operate on MongoDB: {pe}")
    exit(1)
except Exception as e:
    print(f"Unexpected error: {e}")
    exit(1)
finally:
    client.close()