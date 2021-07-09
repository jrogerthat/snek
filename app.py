import os
from pathlib import Path
from flask import Flask, render_template, jsonify, request
import requests
import json
from webpack_loader.config import setup_jinja2_ext
from sampleScript import analysis_from_historyID, get_all_stories, get_oauth_token, get_story_histories_storyID, get_story_history_info, get_story_info_storyID, get_models_from_history, input_profile_from_storyID, model_info_from_modelID, model_metrics_from_modelID, pull_all_files


BASE_DIR = Path(__file__).parent

#WHERE FLASK KNOWS TO LOOK FOR YOUR STATIC FILES AND TEMPLATES
app = Flask(__name__, static_folder="frontend/build", static_url_path="/static/")
app.config.update({
    'WEBPACK_LOADER': {
        'MANIFEST_FILE': os.path.join(BASE_DIR, "frontend/build/manifest.json"),
    }
})
setup_jinja2_ext(app)

@app.cli.command("webpack_init")
def webpack_init():
    from cookiecutter.main import cookiecutter
    from webpack_loader import GIT_URL
    cookiecutter(GIT_URL, directory='frontend_template')


@app.route("/")
def hello():
    return render_template('index.html')

##TESTING OUT REQUEST
@app.route("/get-auth")
def get_auth():
    return get_oauth_token()

@app.route("/list-stories")
def get_stories():
    get_oauth_token()
    return get_all_stories()

@app.route("/model_properties")
def model_properties():
    return {"model_properties_files" : pull_all_files("frontend/vendors/data_jsons/model_properties/")}

@app.route("/ds_pipeline_properties")
def ds_pipeline_properties():
    return {"ds_pipline_files" : pull_all_files("frontend/vendors/data_jsons/ds_pipeline_properties/")}

@app.route("/search_space_properties")
def search_space_properties():
    return {"search space": pull_all_files("frontend/vendors/data_jsons/search_space_properties/")}

@app.route("/data_properties")
def data_properties():
    return {"data_properties": pull_all_files("frontend/vendors/data_jsons/data_properties/")}

@app.route("/interface_components") 
def interface_components():
    # files = os.listdir("frontend/vendors/data_jsons/interface_components/")
    result = pull_all_files("frontend/vendors/data_jsons/interface_components/")
    print("listed", result)
    return {'result': result}
   # return render_template('screen_shots.html', data=result)
   # return {"file list": files}
   # return {"interface_components": pull_all_files("frontend/vendors/data_jsons/interface-components/")}

@app.route("/automated_reporting_process")
def automated_reporting_process():
    return {"automated_reporting_process": pull_all_files("frontend/vendors/data_jsons/automated_reporting_process/")}

@app.route("/analysis_properties")
def analysis_properties():
    return {"analysis_properties": pull_all_files("frontend/vendors/data_jsons/analysis_properties/")}

@app.route("/user_action_properties")
def user_action_properties():
    return {"user_action_properties": pull_all_files("frontend/vendors/data_jsons/user_action_properties/")}

@app.route("/oversight_processes")
def oversight_processes():
    return {"oversight_processes": pull_all_files("frontend/vendors/data_jsons/oversight_processes/")}

@app.route("/computational_processes")
def computational_processes():
    return {"computational_processes": pull_all_files("frontend/vendors/data_jsons/computational_processes/")}

@app.route("/verification_processes")
def verification_processes():
    return {"verification_processes": pull_all_files("frontend/vendors/data_jsons/verification_processes/")}



#pass id as a parameter in URL
#http://127.0.0.1:5000/story-info?id=1Y3B00000004JgrKAE
@app.route("/story-info")
def story_info():
    get_oauth_token()
    return get_story_info_storyID(request.args['id'])
    # return get_story_info_storyID('1Y3B00000004JgrKAE')

#pass id as a parameter in URL
#http://127.0.0.1:5000/story-histories?id=1Y3B00000004LD0KAM
@app.route("/story-histories")
def story_histories():
    get_oauth_token()
    return get_story_histories_storyID(request.args['id'])

#pass id and history as a parameter in URL
#http://127.0.0.1:5000/history-info?id=1Y3B00000004LD0KAM&history=9B4B0000000CujgKAC
@app.route("/history-info")
def history_info():
    get_oauth_token()
    return {'id': request.args['id'], 'history':request.args['history'], 'response':get_story_history_info(request.args['id'], request.args['history'])}

#pass id as a parameter in URL
#http://127.0.0.1:5000/models-from-history?history=9B4B0000000CujgKAC
@app.route("/models-from-history")
def models_from_history():
    get_oauth_token()
    return {'history id':request.args['history'], 'response': get_models_from_history(request.args['history'])}

#http://127.0.0.1:5000/model-file-info?model=1OTB0000000Cr5UOAS
@app.route("/model-file-info")
def model_file_info():
    get_oauth_token()
    return {'model id':request.args['model'], 'response': model_info_from_modelID(request.args['model'])}

#http://127.0.0.1:5000/model-metrics-info?prediction=1ORB0000000L055OAC&model=1OtB0000000L0TRKA0
@app.route("/model-metrics-info")
def model_metrics_info():
    get_oauth_token()
    return {'model id':request.args['model'], 'response': model_metrics_from_modelID(request.args['prediction'],request.args['model'])}

@app.route("/input-profile")
def input_profile():
    get_oauth_token()
    return input_profile_from_storyID(request.args['history'])

@app.route("/analysis")
def analysis():
    get_oauth_token()
    return analysis_from_historyID(request.args['history'])

@app.route("/improvements")
def improvements():
    f = open("frontend/vendors/data_jsons/insight_improvements.json")
    jSON = json.load(f)
    return {'improvements': jSON['Body']['improvements']}

@app.route("/insights")
def insights():
    f = open("frontend/vendors/data_jsons/insight_improvements.json")
    jSON = json.load(f)
    return {'insights': jSON['Body']['insights']}

@app.route("/analysis-meta")
def analysis_meta():
    f = open("frontend/vendors/data_jsons/analysis_meta.json")
    jSON = json.load(f)
    return jSON

@app.route("/model-metrics-training")
def model_metrics_training():
    f = open("frontend/vendors/data_jsons/insight_improvements.json")
    jSON = json.load(f)
    return {'insights': jSON['Body']['model']['metrics']['training']}

@app.route("/model-metrics-validation")
def model_metrics_validation():
    f = open("frontend/vendors/data_jsons/insight_improvements.json")
    jSON = json.load(f)
    return {'insights': jSON['Body']['model']['metrics']['validation']}

@app.route("/model-metrics-crossValidation")
def model_metrics_crossValidation():
    f = open("frontend/vendors/data_jsons/insight_improvements.json")
    jSON = json.load(f)
    return {'insights': jSON['Body']['model']['metrics']['crossValidation']}

