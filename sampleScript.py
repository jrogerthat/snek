import json, requests, base64,pprint,time,jsonify
import os
instance_url=''
token=''
prediction_definition='1ORB0000000KztCOAS'

# get the suth token
def get_oauth_token():
    global token
    global instance_url
    consumer_key = ''
    consumer_secret = ''
    username = ''
    password = ''

    authUrl = 'https://login.salesforce.com/services/oauth2/token'
    authHeaders = {
        'Content-Type': 'application/x-www-form-urlencoded'
    }
    authData = {
        'grant_type': 'password',
        'client_id': consumer_key,
        'client_secret': consumer_secret,
        'username': username,
        'password': password
    }

    r = requests.post(authUrl,
        headers=authHeaders,
        data=authData)
    authResponseBody = json.loads(r.content)
    token = authResponseBody['access_token']
    instance_url=authResponseBody['instance_url']
   
    return {'token': token}

# get all of the stories available
def get_all_stories():

    predictionsUrl = instance_url + '/services/data/v50.0/smartdatadiscovery/stories'
    jobsHeaders = {
        'Authorization': 'Bearer ' + token
    }
    r = requests.get(predictionsUrl,
        headers=jobsHeaders)
    predictionsResponseBody = json.loads(r.content)

    return {'response': predictionsResponseBody}

#get story info from id
def get_story_info_storyID(story_name_or_id):

    predictionsUrl = instance_url + '/services/data/v50.0/smartdatadiscovery/stories/{story_id}'.format(story_id=story_name_or_id)
    jobsHeaders = {
        'Authorization': 'Bearer ' + token
    }
    r = requests.get(predictionsUrl,
        headers=jobsHeaders)
    predictionsResponseBody = json.loads(r.content)

    return {'response': predictionsResponseBody}

#get story hostories using story id
def get_story_histories_storyID(story_name_or_id):
    #https://gs0.salesforce.com/services/data/v50.0/smartdatadiscovery/stories/1Y3B00000004LD0KAM/histories/
    predictionsUrl = instance_url + '/services/data/v50.0/smartdatadiscovery/stories/{story_id}/histories'.format(story_id=story_name_or_id)
    jobsHeaders = {
        'Authorization': 'Bearer ' + token
    }
    r = requests.get(predictionsUrl,
        headers=jobsHeaders)
    predictionsResponseBody = json.loads(r.content)

    return {'response': predictionsResponseBody}

def pull_all_files(path):
    files = os.listdir(path)
    data = {}
    for fi in files:
        stream = open(path+fi)
        file = json.load(stream)
        data[fi] = file
    return data

    #get story hostories using story id
def get_story_history_info(story_name_or_id, history_id):
    #https://gs0.salesforce.com/services/data/v52.0/smartdatadiscovery/stories/
    predictionsUrl = instance_url + '/services/data/v52.0/smartdatadiscovery/stories/{story_id}/histories/{history_id}/summary'.format(story_id=story_name_or_id,history_id=history_id)
    jobsHeaders = {
        'Authorization': 'Bearer ' + token
    }
    r = requests.get(predictionsUrl,
        headers=jobsHeaders)
    predictionsResponseBody = json.loads(r.content)

    return {'response': predictionsResponseBody}


def get_models_from_history(history_id):
    #https://gs0.salesforce.com/services/data/v50.0/smartdatadiscovery/models?storyHistoryId=9B4B0000000CrBEKA0
    predictionsUrl = instance_url + '/services/data/v52.0/smartdatadiscovery/models?storyHistoryId={history_id}'.format(history_id=history_id)
    jobsHeaders = {
        'Authorization': 'Bearer ' + token
    }
    r = requests.get(predictionsUrl,
        headers=jobsHeaders)
    predictionsResponseBody = json.loads(r.content)

    return {'response': predictionsResponseBody}

# get the model coefficient data for a model ID
def model_info_from_modelID(model_id):
    predictionsUrl = instance_url + '/services/data/v52.0/smartdatadiscovery/models/{model_id}/file'.format(model_id=model_id)
    jobsHeaders = {
        'Authorization': 'Bearer ' + token
    }
    r = requests.get(predictionsUrl,
        headers=jobsHeaders)
    predictionsResponseBody = json.loads(r.content)

    return {'response': predictionsResponseBody}

# get the model coefficient data for a model ID
def model_metrics_from_modelID(prediction_id, model_id): #/smartdatadiscovery/predictiondefinitions/
    #https://gs0.salesforce.com/services/data/v52.0/smartdatadiscovery/predictiondefinitions/1ORB0000000KzuPOAS/models/1OtB0000000L0AzKAK/metrics
    predictionsUrl = instance_url + '/services/data/v52.0/smartdatadiscovery/predictiondefinitions/{prediction_id}/models/{model_id}/metrics'.format(prediction_id=prediction_id,model_id=model_id)
    jobsHeaders = {
        'Authorization': 'Bearer ' + token
    }
    r = requests.get(predictionsUrl,
        headers=jobsHeaders)
    predictionsResponseBody = json.loads(r.content)

    return {'response': predictionsResponseBody}

# get input profile from story id
def input_profile_from_storyID(history_id): 
    #https://gs0.salesforce.com/services/data/v52.0/smartdatadiscovery/analyses/9B4B0000000Cuk5KAC/input-profile
    predictionsUrl = instance_url + '/services/data/v52.0/smartdatadiscovery/analyses/{history_id}/input-profile'.format(history_id=history_id)
    jobsHeaders = {
        'Authorization': 'Bearer ' + token
    }
    r = requests.get(predictionsUrl,
        headers=jobsHeaders)
    predictionsResponseBody = json.loads(r.content)

    return predictionsResponseBody


def analysis_from_historyID(history_id): 
  #https://gs0.salesforce.com/services/data/v52.0/smartdatadiscovery/analyses/9B4B0000000Cuk5KAC
    predictionsUrl = instance_url + '/services/data/v52.0/smartdatadiscovery/analyses/{history_id}'.format(history_id=history_id)
    jobsHeaders = {
        'Authorization': 'Bearer ' + token
    }
    r = requests.get(predictionsUrl,
        headers=jobsHeaders)
    predictionsResponseBody = json.loads(r.content)

    return predictionsResponseBody

def get_prediction_model_details(prediction_name_or_id):
    predictionsUrl = instance_url + '/services/data/v50.0/smartdatadiscovery/predictiondefinitions/{prediction_id}'.format(prediction_id=prediction_name_or_id)
    jobsHeaders = {
        'Authorization': 'Bearer ' + token
    }
    r = requests.get(predictionsUrl,
        headers=jobsHeaders)
    predictionsResponseBody = json.loads(r.content)
    #print("Label in the prediciton definition :{}".format(predictionsResponseBody['label']))
    print("number of active models in the prediciton definition {}:{}".format(prediction_name_or_id,predictionsResponseBody['countOfActiveModels']))

    if(predictionsResponseBody['countOfActiveModels']) > 0:
        predictionsModelUrl=predictionsUrl+'/models'
        modelsHeaders = {
            'Authorization': 'Bearer ' + token
        }
        models_response=requests.get(predictionsModelUrl,headers=modelsHeaders)
        prediction_models=json.loads(models_response.content)

        for i in range(len(prediction_models['models'])):
            print("Found model with  label : {label} --> deployed id: {modelId} --> Immutable ModelId : {immutableId}".format(modelId=prediction_models['models'][i]['id'],
                                                                                                                               label=prediction_models['models'][i]['label'],
                                                                                                                               immutableId=prediction_models['models'][i]['model']['id']))
            predictionsModelMetricsUrl = predictionsModelUrl +'/'+prediction_models['models'][i]['id']+ '/metrics'
            modelsHeaders = {
                'Authorization': 'Bearer ' + token
            }
            metrics_response = requests.get(predictionsModelMetricsUrl, headers=modelsHeaders)
            prediction_models_metrics = json.loads(metrics_response.content)
            print("Training metrics for the deployed model : {}".format(json.dumps(prediction_models_metrics["trainingMetrics"],indent=2)))



def create_prediction_definition(pred_defn_name="test_predictionDefinition_api"):
    prediction_definition_payload={"status": "Enabled", "name": pred_defn_name, "label": pred_defn_name,
     "outcome": {"name": "AWND", "label": "AWND", "goal": "MAXIMIZE"}, "predictionType": "Regression"}
    create_predictionDefn_url = instance_url + '/services/data/v50.0/smartdatadiscovery/predictiondefinitions'
    useHeaders = {
        'Authorization': 'Bearer ' + token
    }
    r = requests.post(create_predictionDefn_url,
        headers=useHeaders,
        json=prediction_definition_payload)
    #print(json.dumps(r.content,indent=2))
    prediction_definition_name_or_id=json.loads(r.content)["id"]
    return prediction_definition_name_or_id

def create_published_model(runId='',immutable_model_id='',prediction_definition_id=''):

    publish_model_payload={"name": "teststory", "label": "teststory -Version1", "status": "Enabled", "sortOrder": 0, "filterList": {"filters": []},
     "model": {"id": immutable_model_id}, "analysis": {"id": runId}, "prescribableFields": []}
    create_published_model_url = instance_url + '/services/data/v50.0/smartdatadiscovery/predictiondefinitions'+'/'+prediction_definition_id+'/models'
    useHeaders = {
        'Authorization': 'Bearer ' + token
    }
    r = requests.post(create_published_model_url,
        headers=useHeaders,
        json=publish_model_payload)
    #print(json.dumps(r.content,indent=2))


def get_immutable_model_from_run_id(run_id):
    useHeaders = {
        'Authorization': 'Bearer ' + token
    }
    get_model_url = instance_url + '/services/data/v50.0/smartdatadiscovery/models'
    r = requests.get(get_model_url,
                     headers=useHeaders,params={'storyHistoryId':run_id})
    response = json.loads(r.content)
    return response['models'][0]['id']




def delete_prediction_definition(prediction_definition_name_or_id):
    delete_prediction_definition_url = instance_url + '/services/data/v50.0/smartdatadiscovery/predictiondefinitions' +'/'+ prediction_definition_name_or_id
    useHeaders = {
        'Authorization': 'Bearer ' + token
    }

    r = requests.delete(delete_prediction_definition_url,
        headers=useHeaders)


if __name__=="__main__":
    get_oauth_token()
    print("Using oauth login token : "+ token)
    run_id='9B4B0000000Cs2GKAS'
    print('Using the run Id : {run_id} to create prediction definitions and deploy models'.format(run_id=run_id))
    immutable_model_id=get_immutable_model_from_run_id(run_id)
    print('Using the immutable_model : {model} '.format(model=immutable_model_id))
    created_definition=create_prediction_definition()
    print('Created a prediction definition : {prediction_definition} '.format(prediction_definition=created_definition))
    time.sleep(10)
    print('publishing model....within prediction definition {}'.format(created_definition))
    create_published_model(run_id,immutable_model_id=immutable_model_id,prediction_definition_id=created_definition)

    get_prediction_model_details(created_definition)
    delete_prediction_definition(created_definition)