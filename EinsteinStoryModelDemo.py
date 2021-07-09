
import json, requests, os.path, base64, time

# Login
    # ..................................................

    # https://mytableau.tableaucorp.com/display/devanalytics/Salesforce+OAuth+Automation+Scripts

consumer_key = ""
consumer_secret = ""
username = ""
password = ""

authUrl = "https://login.salesforce.com/services/oauth2/token"
authHeaders = {
    "Content-Type": "application/x-www-form-urlencoded"
}
authData = {
    "grant_type": "password",
    "client_id": consumer_key,
    "client_secret": consumer_secret,
    "username": username,
    "password": password
}

r = requests.post(authUrl,
    headers=authHeaders,
    data=authData)

# print(r.content)

authResponseBody = json.loads(r.content)

accessToken = authResponseBody["access_token"]
userId = authResponseBody["id"]
folderId = os.path.split(userId)

# send create story request to Einstein
# .....................................

def sendCreateStoryRequestToSalesforce(instanceUrl, token, payload):
    requestHeader = {
        "Authorization": "Bearer " + token
    }
    requestEndPoint = instanceUrl + "/services/data/v52.0/smartdatadiscovery/stories"

    response = requests.post(requestEndPoint,
                            headers=requestHeader,
                            json=payload)

    print ("story create response")
    print(response.content)
    return response.content

# prepare story request body
# ..........................

def createStoryRequest(folder, storyName):
    requestBody = {
    "folder": {
                "id": folder
            },
    "input": {
                "dataset": {
                    "id": "0FbB0000000IJgPKAW"
                },
                "datasetVersion": {
                    "id": "0FcB0000004WwM3KAK"
                },
                "type": "AnalyticsDataset"
    },
    "label": storyName,
    "outcome": {
        "goal": "Maximize",
        "label": "AWND",
        "name": "AWND",
        "type": "Number"
    },
    "setup": {
        "fields": [
            {
                "displayName": "AWND",
                "min": 1.12,
                "max": 25.05,
                "bucketingStrategy": "PERCENTILE",
                "numBuckets": 10,
                "protected": "false",
                "ignored": "false",
                "highCardinality": "false",
                "sensitive": "false",
                "uniqueEquivalent": "false",
                "name": "AWND",
                "type": "number"
            },
            {
                "displayName": "PRCP",
                "min": 0,
                "max": 1.87,
                "bucketingStrategy": "PERCENTILE",
                "numBuckets": 10,
                "protected": "false",
                "ignored": "false",
                "highCardinality": "false",
                "sensitive": "false",
                "uniqueEquivalent": "false",
                "name": "PRCP",
                "type": "number"
            },
            {
                "displayName": "TMAX",
                "min": 49,
                "max": 108,
                "bucketingStrategy": "PERCENTILE",
                "numBuckets": 10,
                "protected": "false",
                "ignored": "false",
                "highCardinality": "false",
                "sensitive": "false",
                "uniqueEquivalent": "false",
                "name": "TMAX",
                "type": "number"
            },
            {
                "displayName": "STATION",
                "ordering": "OCCURRENCE",
                "includeOther": "true",
                "support": 24,
                "protected": "false",
                "ignored": "false",
                "highCardinality": "false",
                "sensitive": "false",
                "uniqueEquivalent": "false",
                "name": "STATION",
                "type": "text",
                "values": [
                    {
                        "name": "USW00023293",
                        "displayName": "USW00023293",
                        "count": 1827,
                        "ignored": "false"
                    }
                ]
            }
        ],
        "modelConfiguration": {
            "modelAlgType": "GLM"
        },
        "name": storyName,
        "outcome": {
        "goal": "Maximize",
        "name": "AWND",
        "displayName": "AWND",
        "type": "number",
        "min": "1.12",
        "max": "25.05",
        "predictionType": "Numeric"
        },
        "transformations": []
    }
    }

    return requestBody

# poll story creation status
# ..........................
def getStoryCreationStatus(instanceUrl, runId, storyId, token):
    requestHeader = {
        "Authorization": "Bearer " + token
    }

    requestEndPoint = instanceUrl + "/services/data/v52.0/smartdatadiscovery/stories/" + storyId + "/histories/" + runId

    response = requests.get(requestEndPoint,
                         headers=requestHeader)

    return response

# fetch AI Model info
# ...................

def fetchAIModelInfo(instanceUrl, runId, token):
    requestHeader = {
        "Authorization": "Bearer " + token
    }

    requestEndPoint = instanceUrl + "/services/data/v52.0/smartdatadiscovery/models?storyHistoryId=" + runId

    response = requests.get(requestEndPoint,
                            headers=requestHeader)

    return response

# fetch AI Model details
# ......................

def fetchAIModelDetails(instanceUrl, modelId, token):
    requestHeader = {
        "Authorization": "Bearer " + token
    }

    requestEndPoint = instanceUrl + "/services/data/v52.0/smartdatadiscovery/models/" + modelId

    response = requests.get(requestEndPoint,
                            headers=requestHeader)

    return response

# fetch AI Model file
# ...................

def fetchAIModelFile(instanceUrl, modelId, token):
    requestHeader = {
        "Authorization": "Bearer " + token
    }

    requestEndPoint = instanceUrl + "/services/data/v52.0/smartdatadiscovery/models/" + modelId + "/file"

    response = requests.get(requestEndPoint,
                            headers=requestHeader)

    return response

# create prediction definition request body
# .........................................

def createPredictionDefinitionRequest(name):
    request = {
        "status": "Enabled",
        "name": name,
        "label": name,
        "outcome": {
            "name": "TMAX",
            "label": "TMAX",
            "goal": "MAXIMIZE"
        },
        "predictionType": "Regression"
    }

    return request

# send create prediction definition to Einstein Discovery
# .......................................................

def sendCreatePredictionDefintionRequest(instanceUrl, token, requestPayload):
    requestHeader = {
        "Authorization": "Bearer " + token
    }

    requestEndPoint = instanceUrl + "/services/data/v52.0/smartdatadiscovery/predictionDefinitions"

    response = requests.post(requestEndPoint,
                            headers=requestHeader,
                             json=requestPayload)

    return response

# create deploy model request body
# ................................

def createDeployModelRequest(deployModelName, predictionDefinitionId, aiModelId, runId):
    request = {
        "name": deployModelName,
        "label": deployModelName,
        "status": "Enabled",
        "sortOrder": 0,
        "filterList": {
            "filters": []
        },
        "model": {
            "id": aiModelId
        },
        "analysis": {
            "id": runId
        },
        "prescribableFields": []
    }

    return request

# send deploy model creation request to Einstein Discovery
# ........................................................

def sendDeployModelRequest(instanceUrl, token, deployModelRequestPayload, predictionDefinitionId):
    requestHeader = {
        "Authorization": "Bearer " + token
    }

    requestEndPoint = instanceUrl + "/services/data/v52.0/smartdatadiscovery/predictionDefinitions/" + predictionDefinitionId + "/models"

    response = requests.post(requestEndPoint,
                             headers=requestHeader,
                             json=deployModelRequestPayload)

    return response

# get deployed model metrics
# ..........................

def getDeployedModelMetrics(instanceUrl, token, predictionDefinitionId, modelId):
    requestHeader = {
        "Authorization": "Bearer " + token
    }

    requestEndPoint = instanceUrl + "/services/data/v52.0/smartdatadiscovery/predictionDefinitions/" + predictionDefinitionId + "/models/" + modelId + "/metrics"

    response = requests.get(requestEndPoint,
                             headers=requestHeader)

    return response


# get started, start asking for details
# .....................................

storyName = input("Enter Story name: ")
print ("Creating Story request")

storyRequestBody = createStoryRequest(folderId[1], storyName)
instanceUrl = authResponseBody["instance_url"]
print ("Sending Create Story request to Einstein at /smartdatadiscovery/stories/")
storyResponse = json.loads(sendCreateStoryRequestToSalesforce(instanceUrl, accessToken, storyRequestBody))
runId = storyResponse["runId"]
storyId = storyResponse["id"]
print ("polling story creation status at /smartdatadiscovery/stories/<storyId>/histories/<storyrunId>")
statusResult = json.loads(getStoryCreationStatus(instanceUrl, runId, storyId, accessToken).content)
print (statusResult)
completed = False
while completed == False:
    status = statusResult["status"]
    print ("story creation status: " + status)
    if (status == "Success" or status == "Failed"):
        completed = True
        if(status == "Failed"):
            print ("story creation failed, response: " + statusResult)
        else:
            print ("story created with id: " + storyId + " and runId: " + runId)
    else:
        time.sleep(5)
        statusResult = json.loads(getStoryCreationStatus(instanceUrl, runId, storyId, accessToken).content)

print ("fetching AI Model info from /smartdatadiscovery/models?storyHistoryId=<storyrunId>")
modelInfo = json.loads(fetchAIModelInfo(instanceUrl, runId, accessToken).content)
print (modelInfo)
aiModelId = modelInfo["models"][0]["id"]
print ("AI Model id: " + aiModelId)

print ("fetching AI model details from /smartdatadiscovery/models/<modelId>")
modelDetails = json.loads(fetchAIModelDetails(instanceUrl, aiModelId, accessToken).content)
print ("AI model details: ")
print (modelDetails)

print ("\nfetching AI model file from /smartdatadiscovery/models/<modelId>/file")
modelFile = json.loads(fetchAIModelFile(instanceUrl, aiModelId, accessToken).content)
print ("AI model file: ")
print (modelFile)
print ("")

predictionDefinitionName = input ("\nenter prediction definition name to create:")
predictionDefinitionPayload = createPredictionDefinitionRequest(predictionDefinitionName)
print ("creating new predictionDefinition " + predictionDefinitionName + " at /smartdatadiscovery/predictiondefintions")
predictionDefinitionResponse = json.loads(sendCreatePredictionDefintionRequest(instanceUrl, accessToken, predictionDefinitionPayload).content)
print ("new predictionDefinitionId created with id: " + predictionDefinitionResponse["id"])

time.sleep(5)

deployModelName = input("enter deployed model name:")
deployModelRequest = createDeployModelRequest(deployModelName, predictionDefinitionResponse["id"], aiModelId, runId)

print ("deploying model: " + deployModelName)
deployModelResponse = json.loads(sendDeployModelRequest(instanceUrl, accessToken, deployModelRequest, predictionDefinitionResponse["id"]).content)

time.sleep(5)

print (deployModelResponse)
print ("new model deployed: " + deployModelResponse["id"])

print("Getting deployed model metrics")

modelMetrics = json.loads(getDeployedModelMetrics(instanceUrl, accessToken, predictionDefinitionResponse["id"], deployModelResponse["id"]).content)
print ("Model metrics:")
print (modelMetrics)







