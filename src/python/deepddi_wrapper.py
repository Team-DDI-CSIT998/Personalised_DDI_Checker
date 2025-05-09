

import os
import time
import logging

import sys


from deepddi2.deepddi import DeepDDI, Severity, preprocessing, result_processing

def run_deepddi_pipeline(input_file: str, output_dir: str, PCA_profile_file: str = None):
    start = time.time()
    logging.basicConfig(format='%(levelname)s: %(message)s', level=logging.INFO)

    drug_dir = './deepddi2/data/DrugBank5.0_Approved_drugs/'
    pca_model = './deepddi2/data/PCA_tanimoto_model_50.pkl'
    drug_information_file = './deepddi2/data/Approved_drug_Information.txt'
    drug_enzyme_information_file = './deepddi2/data/Approved_drug_enzyme_Information.txt'   
    side_effect_information_file = './deepddi2/data/Drug_Side_Effect.txt'
    known_drug_similarity_file = './deepddi2/data/drug_similarity.csv'
    ddi_trained_model = './deepddi2/data/models/ddi_model.json'
    ddi_trained_model_weight = './deepddi2/data/models/ddi_model.h5'
    DDI_sentence_information_file = './deepddi2/data/Type_information/Interaction_information_model1.csv'
    binarizer_file = './deepddi2/data/multilabelbinarizer.pkl'
    known_DDI_file = './deepddi2/data/DrugBank_known_ddi.txt'
    model1_threshold = 0.4

    if not os.path.isdir(output_dir):
        os.mkdir(output_dir)

    drug_list = []
    with open('./deepddi2/data/DrugList.txt', 'r') as fp:
        for line in fp:
            drug_list.append(line.strip())

    parsed_input_file = os.path.join(output_dir, 'DDI_input.txt')
    preprocessing.parse_DDI_input_file(input_file, parsed_input_file)

    if PCA_profile_file is None:
        similarity_profile = os.path.join(output_dir, 'similarity_profile.csv')
        pca_similarity_profile = os.path.join(output_dir, 'PCA_transformed_similarity_profile.csv')
        preprocessing.calculate_structure_similarity(drug_dir, parsed_input_file, similarity_profile, drug_list)
        preprocessing.calculate_pca(similarity_profile, pca_similarity_profile, pca_model)
        pca_df = preprocessing.generate_input_profile(parsed_input_file, pca_similarity_profile)
    else:
        pca_df = preprocessing.generate_input_profile(parsed_input_file, PCA_profile_file)
        similarity_profile = known_drug_similarity_file

    output_file = os.path.join(output_dir, 'DDI_result.txt')
    ddi_output_file = os.path.join(output_dir, 'Final_DDI_result.txt')
    annotation_output_file = os.path.join(output_dir, 'Final_annotated_DDI_result.txt')

    model_type = 'model1'
    DeepDDI.predict_DDI(output_file, pca_df, ddi_trained_model, ddi_trained_model_weight, model1_threshold, binarizer_file, model_type)
    result_processing.summarize_prediction_outcome(output_file, ddi_output_file, DDI_sentence_information_file)
    result_processing.annotate_DDI_results(
        ddi_output_file, drug_information_file, drug_enzyme_information_file,
        similarity_profile, known_DDI_file, annotation_output_file,
        side_effect_information_file, model1_threshold, 0.7
    )

    logging.info(time.strftime("Elapsed time %H:%M:%S", time.gmtime(time.time() - start)))
    return annotation_output_file
